import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaSearch, FaPen, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './SubjectList.css';
import { addSubject, getAllSubjects, updateSubject, deleteSubject, subscribeToSubjects, cleanupDuplicateSubjects, clearAllSubjects } from '../../firebase/subjectService';
import { getStorage } from 'firebase/storage';

export const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [newSubject, setNewSubject] = useState({
    code: '',
    name: '',
    teacher: '',
    status: 'Active',
    backgroundImage: null
  });
  
  // Fetch subjects from Firebase on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const subjectsData = await getAllSubjects();
        setSubjects(subjectsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setError('Failed to load subjects. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();

    // Clean up any duplicate subjects that might exist in the database
    const cleanupDuplicates = async () => {
      try {
        console.log('Checking for duplicate subjects...');
        const removedCount = await cleanupDuplicateSubjects();
        if (removedCount > 0) {
          console.log(`Successfully removed ${removedCount} duplicate subjects`);
        } else {
          console.log('No duplicate subjects found');
        }
      } catch (err) {
        console.error('Error cleaning up duplicates:', err);
      }
    };

    cleanupDuplicates();

    // Set up real-time listener for subjects collection
    const unsubscribe = subscribeToSubjects((updatedSubjects) => {
      setSubjects(updatedSubjects);
    });

    // Clean up listener on component unmount
    return () => unsubscribe();
  }, []);

  const itemsPerPage = 5; // Show 5 items per page

  // Calculate total pages
  const totalPages = Math.ceil(subjects.length / itemsPerPage);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // If total pages is less than max visible, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust start and end to always show 3 pages
      if (currentPage <= 2) {
        endPage = 4;
      }
      if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always include last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // Filter subjects based on search term
  const filteredSubjects = useMemo(() => {
    return subjects.filter(subject => 
      subject.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.teacher?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [subjects, searchTerm]);

  // Get current items
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredSubjects.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredSubjects, currentPage, itemsPerPage]);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log('Adding new subject:', newSubject);
      
      // Validate subject data
      if (!newSubject.code || !newSubject.name || !newSubject.teacher) {
        alert('Please fill in all required fields: Code, Name, and Teacher');
        setLoading(false);
        return;
      }
      
      // Check for duplicates in the current subjects list before trying to add
      const isDuplicateCode = subjects.some(subject => 
        subject.code.toLowerCase() === newSubject.code.toLowerCase()
      );
      const isDuplicateName = subjects.some(subject => 
        subject.name.toLowerCase() === newSubject.name.toLowerCase()
      );
      
      if (isDuplicateCode) {
        alert(`A subject with code ${newSubject.code} already exists. Please use a different code.`);
        setLoading(false);
        return;
      }
      
      if (isDuplicateName) {
        alert(`A subject with name ${newSubject.name} already exists. Please use a different name.`);
        setLoading(false);
        return;
      }
      
      // Clear the 'all subjects deleted' flag since we're adding a new subject
      localStorage.removeItem('subjectsAllDeleted');
      console.log('Cleared the all subjects deleted flag');
      
      // Add subject to Firebase
      const addedSubject = await addSubject(
        {
          code: newSubject.code,
          name: newSubject.name,
          teacher: newSubject.teacher,
          status: newSubject.status || 'Active'
        },
        newSubject.backgroundImage
      );
      
      console.log('Subject added successfully:', addedSubject);
      
      // NOTE: We don't need to manually update the local state here
      // The subscription to Firestore will automatically update the subjects list
      // This prevents duplicates from appearing in the UI
      
      // Reset form
      setNewSubject({
        code: '',
        name: '',
        teacher: '',
        status: 'Active',
        backgroundImage: null
      });
      
      // Close modal
      setShowAddModal(false);
      
      // Show success message
      alert(`Subject '${addedSubject.name}' added successfully!`);
    } catch (err) {
      console.error('Error adding subject:', err);
      alert('Failed to add subject. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubject = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Update subject in Firebase
      await updateSubject(
        currentSubject.id,
        {
          code: currentSubject.code,
          name: currentSubject.name,
          teacher: currentSubject.teacher,
          status: currentSubject.status,
          backgroundImageUrl: currentSubject.backgroundImageUrl
        },
        currentSubject.backgroundImage
      );
      
      // Update local state
      setSubjects(subjects.map(subject => 
        subject.id === currentSubject.id ? currentSubject : subject
      ));
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating subject:', err);
      alert('Failed to update subject. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        setLoading(true);
        // Delete subject from Firebase
        await deleteSubject(id);
        
        // Update local state
        const updatedSubjects = subjects.filter(subject => subject.id !== id);
        setSubjects(updatedSubjects);
        
        // If this was the last subject, set a flag in localStorage
        // This prevents the app from re-adding default subjects
        if (updatedSubjects.length === 0) {
          console.log('All subjects deleted, setting flag in localStorage');
          localStorage.setItem('subjectsAllDeleted', 'true');
        }
      } catch (err) {
        console.error('Error deleting subject:', err);
        alert('Failed to delete subject. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to first page when searching
    setCurrentPage(1);
  };

  const handleFileChange = (e, isEditing = false) => {
    const file = e.target.files[0];
    if (file) {
      if (isEditing) {
        setCurrentSubject({ ...currentSubject, backgroundImage: file });
      } else {
        setNewSubject({ ...newSubject, backgroundImage: file });
      }
    }
  };

  // No longer needed - removed clear all subjects functionality

  return (
    <div className="subject-management">
      {/* Loading and Error States */}
      {loading && <div className="loading-message">Loading subjects...</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Header Section */}
      <div className="subject-management__header">
        <h1 className="subject-management__title">Manage Subjects</h1>
        <button 
          className="subject-management__add-btn" 
          onClick={() => setShowAddModal(true)}
          disabled={loading}
        >
          <FaPlus /> Add New Subject
        </button>
      </div>

      {/* Search Section */}
      <div className="subject-management__search-container">
        <div className="subject-management__search-wrapper">
          <FaSearch className="subject-management__search-icon" />
          <input
            type="text"
            className="subject-management__search-input"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="subject-management__table-wrapper">
        <table className="subject-management__table">
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>Assigned Teacher</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((subject) => (
              <tr key={subject.id}>
                <td>{subject.code}</td>
                <td>{subject.name}</td>
                <td>{subject.teacher}</td>
                <td>
                  <span className={`subject-management__status ${subject.status?.toLowerCase()}`}>
                    {subject.status}
                  </span>
                </td>
                <td className="subject-management__actions">
                  <button 
                    className="subject-management__edit-btn" 
                    onClick={() => {
                      setCurrentSubject(subject);
                      setShowEditModal(true);
                    }}
                    disabled={loading}
                  >
                    <FaPen /> Edit
                  </button>
                  <button 
                    className="subject-management__delete-btn" 
                    onClick={() => handleDeleteSubject(subject.id)}
                    disabled={loading}
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="subject-management__pagination">
          <button 
            className="subject-management__page-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <FaChevronLeft />
          </button>
          
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              className={`subject-management__page-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              disabled={typeof page !== 'number'}
            >
              {page}
            </button>
          ))}
          
          <button 
            className="subject-management__page-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="subject-mgmt-modal__overlay">
          <div className="subject-mgmt-modal">
            <div className="subject-mgmt-modal__header">
              <h2>Add Subject</h2>
              <button 
                className="subject-mgmt-modal__close" 
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddSubject}>
              <div className="subject-mgmt-modal__form-group">
                <label>Subject Code</label>
                <input
                  type="text"
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({...newSubject, code: e.target.value})}
                  required
                />
              </div>
              <div className="subject-mgmt-modal__form-group">
                <label>Subject Name</label>
                <input
                  type="text"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                  required
                />
              </div>
              <div className="subject-mgmt-modal__form-group">
                <label>Assigned Teacher</label>
                <select
                  value={newSubject.teacher}
                  onChange={(e) => setNewSubject({...newSubject, teacher: e.target.value})}
                  required
                >
                  <option value="">Select Teacher</option>
                  <option value="Mr. Ralp">Mr. Ralp</option>
                  <option value="Mrs. Gwap">Mrs. Gwap</option>
                </select>
              </div>
              <div className="subject-mgmt-modal__form-group">
                <label>Upload Background Image</label>
                <div className="subject-mgmt-modal__file-input">
                  <button type="button" className="subject-mgmt-modal__choose-file">
                    Choose File
                  </button>
                  <span className="subject-mgmt-modal__filename">
                    {newSubject.backgroundImage ? newSubject.backgroundImage.name : 'No file chosen'}
                  </span>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e)}
                    accept="image/*"
                    hidden
                  />
                </div>
              </div>
              <div className="subject-mgmt-modal__form-group">
                <label>Status</label>
                <select
                  value={newSubject.status}
                  onChange={(e) => setNewSubject({...newSubject, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="subject-mgmt-modal__actions">
                <button 
                  type="button" 
                  className="subject-mgmt-modal__cancel" 
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="subject-mgmt-modal__save">
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Subject Modal */}
      {showEditModal && currentSubject && (
        <div className="subject-mgmt-modal__overlay">
          <div className="subject-mgmt-modal">
            <div className="subject-mgmt-modal__header">
              <h2>Edit Subject</h2>
              <button 
                className="subject-mgmt-modal__close" 
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleEditSubject}>
              <div className="subject-mgmt-modal__form-group">
                <label>Subject Code</label>
                <input
                  type="text"
                  value={currentSubject.code}
                  onChange={(e) => setCurrentSubject({...currentSubject, code: e.target.value})}
                  required
                />
              </div>
              <div className="subject-mgmt-modal__form-group">
                <label>Subject Name</label>
                <input
                  type="text"
                  value={currentSubject.name}
                  onChange={(e) => setCurrentSubject({...currentSubject, name: e.target.value})}
                  required
                />
              </div>
              <div className="subject-mgmt-modal__form-group">
                <label>Assigned Teacher</label>
                <select
                  value={currentSubject.teacher}
                  onChange={(e) => setCurrentSubject({...currentSubject, teacher: e.target.value})}
                  required
                >
                  <option value="">Select Teacher</option>
                  <option value="Mr. Ralp">Mr. Ralp</option>
                  <option value="Mrs. Gwap">Mrs. Gwap</option>
                </select>
              </div>
              <div className="subject-mgmt-modal__form-group">
                <label>Upload Background Image</label>
                <div className="subject-mgmt-modal__file-input">
                  <button type="button" className="subject-mgmt-modal__choose-file">
                    Choose File
                  </button>
                  <span className="subject-mgmt-modal__filename">
                    {currentSubject.backgroundImage ? currentSubject.backgroundImage.name : 'No file chosen'}
                  </span>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, true)}
                    accept="image/*"
                    hidden
                  />
                </div>
              </div>
              <div className="subject-mgmt-modal__form-group">
                <label>Status</label>
                <select
                  value={currentSubject.status}
                  onChange={(e) => setCurrentSubject({...currentSubject, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="subject-mgmt-modal__actions">
                <button 
                  type="button" 
                  className="subject-mgmt-modal__cancel" 
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="subject-mgmt-modal__save">
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{color:'#5a6474', marginTop:'30px', textAlign:'center', padding:'15px', borderRadius:'5px', background:'#f8f9fa'}}>
        "The system is currently under development and not yet finalized. Some features may still be incomplete, and further testing and refinement are ongoing to ensure the best possible performance and user experience".
      </div>
    </div>
  );
};

// Also export as default for flexibility
export default SubjectList;
