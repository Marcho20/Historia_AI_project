import React, { useState, useMemo } from 'react';
import { FaPlus, FaSearch, FaPen, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './SubjectList.css';

export const SubjectList = () => {
  const [subjects, setSubjects] = useState([
    { 
      code: 'MATH101', 
      name: 'Araling Panlipunan', 
      teacher: 'Mr. Ralp',
      status: 'Active',
      backgroundImage: null
    },
    { 
      code: 'ENG105', 
      name: 'English', 
      teacher: 'Mrs. Gwap',
      status: 'Inactive',
      backgroundImage: null
    }
  ]);

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

  // Get current items
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return subjects.slice(indexOfFirstItem, indexOfLastItem);
  }, [subjects, currentPage]);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    setSubjects([...subjects, { ...newSubject }]);
    setNewSubject({
      code: '',
      name: '',
      teacher: '',
      status: 'Active',
      backgroundImage: null
    });
    setShowAddModal(false);
  };

  const handleEditSubject = (e) => {
    e.preventDefault();
    setSubjects(subjects.map(subject => 
      subject.code === currentSubject.code ? currentSubject : subject
    ));
    setShowEditModal(false);
  };

  const handleDeleteSubject = (code) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      setSubjects(subjects.filter(subject => subject.code !== code));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
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

  return (
    <div className="subject-management">
      {/* Header Section */}
      <div className="subject-management__header">
        <h1 className="subject-management__title">Manage Subjects</h1>
        <button 
          className="subject-management__add-btn"
          onClick={() => setShowAddModal(true)}
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
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="subject-management__search-input"
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
            {currentItems.map(subject => (
              <tr key={subject.code} className="subject-management__table-row">
                <td>{subject.code}</td>
                <td>{subject.name}</td>
                <td>{subject.teacher}</td>
                <td>
                  <span className={`subject-management__status ${subject.status.toLowerCase()}`}>
                    {subject.status}
                  </span>
                </td>
                <td>
                  <div className="subject-management__actions">
                    <button 
                      className="subject-management__action-btn edit"
                      onClick={() => {
                        setCurrentSubject(subject);
                        setShowEditModal(true);
                      }}
                      title="Edit subject"
                    >
                      <FaPen />
                      <span>Edit</span>
                    </button>
                    <button 
                      className="subject-management__action-btn delete"
                      onClick={() => handleDeleteSubject(subject.code)}
                      title="Delete subject"
                    >
                      <FaTrash />
                      <span>Delete</span>
                    </button>
                  </div>
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

          {getPageNumbers().map((pageNum, index) => (
            <button
              key={index}
              className={`subject-management__page-btn ${
                pageNum === currentPage ? 'active' : ''
              } ${pageNum === '...' ? 'ellipsis' : ''}`}
              onClick={() => pageNum !== '...' && handlePageChange(pageNum)}
              disabled={pageNum === '...'}
            >
              {pageNum}
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
    </div>
  );
};

export default SubjectList; 