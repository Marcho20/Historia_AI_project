import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaSearch, FaPen, FaTrash, FaChevronLeft, FaChevronRight, FaLayerGroup, FaChevronDown } from 'react-icons/fa';
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
    students: [],
    status: 'Active',
    description: '',
    backgroundImage: null,
    units: []
  });
  
  // Interface state
  const [viewMode, setViewMode] = useState('selection'); // 'selection', 'teacher', 'student'
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [subjectDropdowns, setSubjectDropdowns] = useState({});
  
  // Mock student data
  const [students] = useState([
    { id: 'student1', name: 'Gabriel Fernandez', grade: '10A', enrolledSubjects: 3 },
    { id: 'student2', name: 'Michael Fernandez', grade: '10A', enrolledSubjects: 2 },
    { id: 'student3', name: 'Jane Fernandez', grade: '10B', enrolledSubjects: 4 },
    { id: 'student4', name: 'Marcho Dofsd', grade: '9C', enrolledSubjects: 1 },
    { id: 'student5', name: 'Ana Gonzales', grade: '9A', enrolledSubjects: 3 },
    { id: 'student6', name: 'Jose Mendoza', grade: '11B', enrolledSubjects: 2 },
    { id: 'student7', name: 'Maria Santos', grade: '11A', enrolledSubjects: 5 },
    { id: 'student8', name: 'Juan Dela Cruz', grade: '12C', enrolledSubjects: 3 },
    { id: 'student9', name: 'Sofia Rodriguez', grade: '12A', enrolledSubjects: 4 },
    { id: 'student10', name: 'Carlos Reyes', grade: '9B', enrolledSubjects: 2 },
    { id: 'student11', name: 'Isabella Garcia', grade: '10C', enrolledSubjects: 3 },
    { id: 'student12', name: 'Diego Martinez', grade: '11C', enrolledSubjects: 1 }
  ]);
  
  // Sample subject data
  const sampleSubjects = [
    {
      id: 'subj1',
      code: 'AP101',
      name: 'Araling Panlipunan',
      students: ['student1', 'student2', 'student3'],
      status: 'Active',
      description: 'Kasaysayan at Kultura ng Pilipinas',
      backgroundImage: null
    },
    {
      id: 'subj2',
      code: 'FIL101',
      name: 'Filipino',
      students: ['student1', 'student4', 'student7'],
      status: 'Active',
      description: 'Wika at Panitikan',
      backgroundImage: null
    },
    {
      id: 'subj3',
      code: 'MATH101',
      name: 'Mathematics',
      students: ['student2', 'student5', 'student8'],
      status: 'Active',
      description: 'Elementary Mathematics',
      backgroundImage: null
    },
    {
      id: 'subj4',
      code: 'SCI101',
      name: 'Science',
      students: ['student3', 'student6', 'student9'],
      status: 'Inactive',
      description: 'General Science',
      backgroundImage: null
    }
  ];
  
  // Fetch subjects from Firebase on component mount or use sample data
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        // Try to get subjects from Firebase, but fall back to sample data if there's an error
        try {
          const fetchedSubjects = await getAllSubjects();
          if (fetchedSubjects && fetchedSubjects.length > 0) {
            setSubjects(fetchedSubjects);
          } else {
            // Use sample data if no subjects are returned
            setSubjects(sampleSubjects);
          }
        } catch (error) {
          console.error('Error fetching subjects from Firebase:', error);
          // Fall back to sample data
          setSubjects(sampleSubjects);
        }
      } catch (err) {
        console.error('Error in fetchSubjects:', err);
        setError('Failed to load subjects. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubjects();
  }, []);
  
  // Filter subjects based on search term
  const filteredSubjects = useMemo(() => {
    return subjects.filter(subject => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        subject.code.toLowerCase().includes(searchTermLower) ||
        subject.name.toLowerCase().includes(searchTermLower)
      );
    });
  }, [subjects, searchTerm]);
  
  // Pagination
  const subjectsPerPage = 10;
  const totalPages = Math.ceil(filteredSubjects.length / subjectsPerPage);
  
  const paginatedSubjects = useMemo(() => {
    const startIndex = (currentPage - 1) * subjectsPerPage;
    const endIndex = startIndex + subjectsPerPage;
    return filteredSubjects.slice(startIndex, endIndex);
  }, [filteredSubjects, currentPage]);
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };
  
  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const handleModeSelection = (mode) => {
    setViewMode(mode);
  };
  
  const handleSelectAllStudents = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(student => student.id));
    }
  };
  
  const handleStudentSelection = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };
  
  const toggleStudentDropdown = () => {
    setShowStudentDropdown(!showStudentDropdown);
  };
  
  const handleAddNewSubject = () => {
    setNewSubject({
      code: '',
      name: '',
      students: [],
      status: 'Active',
      description: '',
      backgroundImage: null,
      units: []
    });
    setSelectedStudents([]);
    setShowAddModal(true);
  };
  
  const renderSelectionView = () => (
    <div className="subject-area-selection">
      <h2>Select Area</h2>
      <div className="area-buttons">
        <button 
          className="area-button teacher"
          onClick={() => handleModeSelection('teacher')}
        >
          Teacher
        </button>
        <button 
          className="area-button student"
          onClick={() => handleModeSelection('student')}
        >
          Student
        </button>
      </div>
    </div>
  );
  
  const renderStudentView = () => (
    <div className="subject-management">
      <div className="subject-management__header">
        <h2>Manage Subjects</h2>
        <button 
          className="subject-management__add-btn" 
          onClick={handleAddNewSubject}
        >
          <FaPlus /> Add New Subject
        </button>
      </div>

      <div className="subject-management__search">
        <input 
          type="text" 
          placeholder="Search subjects..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && <div className="subject-management__error">{error}</div>}

      <div className="subject-management__table-container">
        <table className="subject-management__table">
          <thead>
            <tr>
              <th>SUBJECT CODE</th>
              <th>SUBJECT NAME</th>
              <th>Student</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.map(subject => (
              <tr key={subject.id || Math.random().toString()}>
                <td>{subject.code}</td>
                <td>{subject.name}</td>
                <td>
                  <div className="student-dropdown-container">
                    <button 
                      type="button"
                      className="student-dropdown-button" 
                      onClick={() => {
                        // Create a subject-specific dropdown state
                        const newDropdownState = {...subjectDropdowns};
                        newDropdownState[subject.id] = !newDropdownState[subject.id];
                        setSubjectDropdowns(newDropdownState);
                      }}
                    >
                      {subject.students && subject.students.length > 0 ? 
                        `${subject.students.length} Students` : 'No Students'} <FaChevronDown />
                    </button>
                    {subjectDropdowns[subject.id] && (
                      <div className="student-dropdown-menu">
                        {subject.students && subject.students.length > 0 ? (
                          <>
                            {subject.students.map(studentId => {
                              const student = students.find(s => s.id === studentId);
                              return student ? (
                                <div key={student.id} className="student-dropdown-item">
                                  <div className="student-info">
                                    <div className="student-name">{student.name}</div>
                                    <div className="student-details">
                                      <span className="student-grade">Grade: {student.grade}</span>
                                      <span className="student-enrolled">Enrolled: {student.enrolledSubjects} subjects</span>
                                    </div>
                                  </div>
                                </div>
                              ) : null;
                            })}
                          </>
                        ) : (
                          <div className="student-dropdown-item empty">No students assigned</div>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`subject-management__status ${subject.status?.toLowerCase() || 'active'}`}>
                    {subject.status || 'Active'}
                  </span>
                </td>
                <td>
                  <div className="subject-management__actions">
                    <button 
                      className="subject-management__edit-btn"
                      onClick={() => handleEditSubject(subject)}
                    >
                      <FaPen /> Edit
                    </button>
                    <button 
                      className="subject-management__delete-btn"
                      onClick={() => handleDeleteSubject(subject.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  const renderTeacherView = () => (
    <div className="subject-management">
      <div className="subject-management__header">
        <h2>Manage Subjects</h2>
        <button 
          className="subject-management__add-btn" 
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus /> Add New Subject
        </button>
      </div>

      <div className="subject-management__search">
        <input 
          type="text" 
          placeholder="Search subjects..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && <div className="subject-management__error">{error}</div>}

      <div className="subject-management__table-container">
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
            {filteredSubjects.map(subject => (
              <tr key={subject.id}>
                <td>{subject.code}</td>
                <td>{subject.name}</td>
                <td>{subject.teacher || 'Not Assigned'}</td>
                <td>
                  <span className={`subject-management__status ${subject.status?.toLowerCase()}`}>
                    {subject.status}
                  </span>
                </td>
                <td>
                  <div className="subject-management__actions">
                    <button 
                      className="subject-management__edit-btn"
                      onClick={() => handleEditSubject(subject)}
                    >
                      <FaPen /> Edit
                    </button>
                    <button 
                      className="subject-management__delete-btn"
                      onClick={() => handleDeleteSubject(subject.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  const handleAddSubject = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Check if a subject with the same code already exists
      const existingSubject = subjects.find(
        subject => subject.code.toLowerCase() === newSubject.code.toLowerCase()
      );
      
      if (existingSubject) {
        setError(`A subject with code "${newSubject.code}" already exists.`);
        setLoading(false);
        return;
      }
      
      // Add the subject to Firestore with the selected students
      const subjectToAdd = {
        ...newSubject,
        students: selectedStudents,
        createdAt: new Date(),
        units: [] // Initialize with empty units array
      };
      
      const subjectId = await addSubject(subjectToAdd);
      
      // Reset form and close modal
      setNewSubject({
        code: '',
        name: '',
        students: [],
        status: 'Active',
        description: '',
        backgroundImage: null,
        units: []
      });
      setSelectedStudents([]);
      setShowAddModal(false);
      setError(null);
      
    } catch (err) {
      console.error('Error adding subject:', err);
      setError('Failed to add subject. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubject = (subject) => {
    // Set the current subject and open the edit modal
    setCurrentSubject({
      ...subject,
      students: subject.students || []
    });
    setSelectedStudents(subject.students || []);
    setShowEditModal(true);
  };
  
  const saveEditedSubject = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Check if a different subject with the same code already exists
      const existingSubject = subjects.find(
        subject => subject.code.toLowerCase() === currentSubject.code.toLowerCase() && 
                  subject.id !== currentSubject.id
      );
      
      if (existingSubject) {
        setError(`A subject with code "${currentSubject.code}" already exists.`);
        setLoading(false);
        return;
      }
      
      // Update the subject in Firestore with the selected students
      await updateSubject(currentSubject.id, {
        ...currentSubject,
        students: selectedStudents,
        updatedAt: new Date()
      });
      
      // Close modal
      setShowEditModal(false);
      setCurrentSubject(null);
      setError(null);
      
    } catch (err) {
      console.error('Error updating subject:', err);
      setError('Failed to update subject. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Delete the subject from Firestore
      await deleteSubject(id);
      
      setError(null);
      
    } catch (err) {
      console.error('Error deleting subject:', err);
      setError('Failed to delete subject. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleFileChange = (e, isEditing = false) => {
    const file = e.target.files[0];
    if (file) {
      if (isEditing) {
        setCurrentSubject({...currentSubject, backgroundImage: file});
      } else {
        setNewSubject({...newSubject, backgroundImage: file});
      }
    }
  };

  return (
    <div className="subject-management-container">
      {viewMode === 'selection' && renderSelectionView()}
      {viewMode === 'student' && renderStudentView()}
      {viewMode === 'teacher' && renderTeacherView()}
      
      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="subject-mgmt-modal">
          <div className="subject-mgmt-modal__content">
            <button 
              className="subject-mgmt-modal__close-btn"
              onClick={() => setShowAddModal(false)}
            >
              &times;
            </button>
            
            <div className="subject-mgmt-modal__header">
              <h3>Add Subject</h3>
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
              
              {viewMode === 'student' && (
                <div className="subject-mgmt-modal__form-group">
                  <label>Assigned Student</label>
                  <div className="student-select-dropdown">
                    <div 
                      className="student-select-header"
                      onClick={() => setShowStudentDropdown(!showStudentDropdown)}
                    >
                      <span>
                        {selectedStudents.length > 0 
                          ? `${selectedStudents.length} Student${selectedStudents.length > 1 ? 's' : ''} Selected` 
                          : 'Select Student'}
                      </span>
                      <FaChevronDown />
                    </div>
                    
                    {showStudentDropdown && (
                      <div className="student-select-options">
                        <div className="student-select-item select-all">
                          <input 
                            type="checkbox" 
                            id="select-all-students"
                            checked={selectedStudents.length === students.length}
                            onChange={handleSelectAllStudents}
                          />
                          <label htmlFor="select-all-students" className="select-all-text">Select All</label>
                        </div>
                        
                        {students.map(student => (
                          <div key={student.id} className="student-select-item">
                            <input 
                              type="checkbox"
                              id={`student-${student.id}`}
                              checked={selectedStudents.includes(student.id)}
                              onChange={() => handleStudentSelection(student.id)}
                            />
                            <label htmlFor={`student-${student.id}`}>{student.name}</label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {viewMode === 'teacher' && (
                <div className="subject-mgmt-modal__form-group">
                  <label>Assigned Teacher</label>
                  <select
                    value={newSubject.teacher}
                    onChange={(e) => setNewSubject({...newSubject, teacher: e.target.value})}
                  >
                    <option value="">Select Teacher</option>
                    <option value="Mr. Ralp">Mr. Ralp</option>
                    <option value="Mrs. Gwap">Mrs. Gwap</option>
                  </select>
                </div>
              )}
              <div className="subject-mgmt-modal__form-group">
                <label>Upload Background Image</label>
                <div className="subject-mgmt-modal__file-input">
                  <button 
                    type="button" 
                    className="file-select-button" 
                    onClick={() => document.getElementById('add-subject-file-input').click()}
                  >
                    Choose File
                  </button>
                  <span className="file-name">
                    {newSubject.backgroundImage ? newSubject.backgroundImage.name : 'No file chosen'}
                  </span>
                  <input
                    id="add-subject-file-input"
                    type="file"
                    onChange={handleFileChange}
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
                  className="subject-mgmt-modal__cancel-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="subject-mgmt-modal__submit-btn"
                >
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Subject Modal */}
      {showEditModal && currentSubject && (
        <div className="subject-mgmt-modal">
          <div className="subject-mgmt-modal__content">
            <button 
              className="subject-mgmt-modal__close-btn" 
              onClick={() => setShowEditModal(false)}
            >
              &times;
            </button>
            
            <div className="subject-mgmt-modal__header">
              <h3>Edit Subject</h3>
            </div>
            
            <form onSubmit={saveEditedSubject}>
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
                <label>Subject Description</label>
                <textarea
                  value={currentSubject.description || ''}
                  onChange={(e) => setCurrentSubject({...currentSubject, description: e.target.value})}
                  rows="3"
                  placeholder="Enter a description for this subject"
                />
              </div>
              
              <div className="subject-mgmt-modal__form-group">
                <label>Assigned Students</label>
                <div className="student-select-dropdown">
                  <div 
                    className="student-select-header"
                    onClick={() => setShowStudentDropdown(!showStudentDropdown)}
                  >
                    <span>
                      {selectedStudents.length > 0 
                        ? `${selectedStudents.length} Student${selectedStudents.length > 1 ? 's' : ''} Selected` 
                        : 'Select Student'}
                    </span>
                    <FaChevronDown />
                  </div>
                  
                  {showStudentDropdown && (
                    <div className="student-select-options">
                      <div className="student-select-item select-all">
                        <input 
                          type="checkbox" 
                          id="edit-select-all-students"
                          checked={selectedStudents.length === students.length}
                          onChange={handleSelectAllStudents}
                        />
                        <label htmlFor="edit-select-all-students" className="select-all-text">Select All</label>
                      </div>
                      
                      {students.map(student => (
                        <div key={student.id} className="student-select-item">
                          <input 
                            type="checkbox"
                            id={`edit-student-${student.id}`}
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => handleStudentSelection(student.id)}
                          />
                          <label htmlFor={`edit-student-${student.id}`}>{student.name}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="subject-mgmt-modal__form-group">
                <label>Upload Background Image</label>
                <div className="subject-mgmt-modal__file-input">
                  <button 
                    type="button" 
                    className="file-select-button"
                    onClick={() => document.getElementById('edit-subject-file-input').click()}
                  >
                    Choose File
                  </button>
                  <span className="file-name">
                    {currentSubject.backgroundImage ? 
                      (typeof currentSubject.backgroundImage === 'object' ? 
                        currentSubject.backgroundImage.name : 
                        'Current image') : 
                      'No file chosen'}
                  </span>
                  <input
                    id="edit-subject-file-input"
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
                  className="subject-mgmt-modal__cancel-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="subject-mgmt-modal__submit-btn"
                >
                  Save Changes
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
