import React, { useState, useEffect, useRef } from 'react';
import './UploadLessons.css';
import PostInTeacherModal from './PostInTeacherModal';
import UploadModuleModal from './UploadModuleModal';
import UploadModule from './UploadModule';
import StudentUploadModule from './StudentUploadModule';
import { subscribeToSubjects } from '../firebase/subjectService';
import { FaUserTie, FaUserGraduate } from 'react-icons/fa';

// Default images for subjects
const defaultImages = {
  'Araling Panlipunan': {
    image: '/img/araling.png',
    backgroundImage: '/img/berian-araling.svg'
  },
  'English': {
    image: '/img/english.png',
    backgroundImage: '/img/berian-english.svg'
  },
  'Math': {
    image: '/img/math.png',
    backgroundImage: '/img/berian-math.svg'
  }
};

// Get default image for a subject
const getDefaultImage = (subjectName) => {
  const defaultImage = defaultImages[subjectName] || {
    image: '/img/default-subject.png',
    backgroundImage: '/img/berian-default.svg'
  };
  return defaultImage;
};

const UploadLessons = () => {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [viewMode, setViewMode] = useState('selection'); // 'selection', 'teacher', or 'student'
  const [view, setView] = useState('grid');
  const [message, setMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(null); // subject id or null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [uploadModuleOpen, setUploadModuleOpen] = useState(false);
  const [newSubjectPopup, setNewSubjectPopup] = useState(null);
  const previousSubjectsRef = useRef([]);

  // Fetch subjects from Firebase
  useEffect(() => {
    console.log('Subscribing to subjects...');
    const unsubscribe = subscribeToSubjects((formattedSubjects) => {
      setLoading(false);
      
      // Check if there's a new subject added
      if (previousSubjectsRef.current.length > 0 && formattedSubjects.length > previousSubjectsRef.current.length) {
        // Find the new subject
        const newSubject = formattedSubjects.find(subject => 
          !previousSubjectsRef.current.some(prevSubject => prevSubject.id === subject.id)
        );
        
        if (newSubject) {
          setNewSubjectPopup(newSubject);
          
          // Auto-hide the popup after 8 seconds
          setTimeout(() => {
            setNewSubjectPopup(null);
          }, 8000);
        }
      }
      
      // Update the subjects state
      setSubjects(formattedSubjects);
      
      // Save current subjects for next comparison
      previousSubjectsRef.current = formattedSubjects;
    });
    
    // Clean up subscription on component unmount
    return () => {
      console.log('Cleaning up subjects subscription');
      unsubscribe();
    };
  }, []);

  // Modal State and Handlers
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [modalSelections, setModalSelections] = useState({
    english: 'yes',
    araling: 'yes',
    math: 'yes',
  });
  const modalSubjects = [
    { id: 'english', name: 'English', teacher: 'Mr. Ralp' },
    { id: 'araling', name: 'Araling Panlipunan', teacher: 'Mrs. Gwap' },
    { id: 'math', name: 'Math', teacher: 'Mrs. Gwap' },
  ];
  const handleModalRadioChange = (subjectId, value) => {
    setModalSelections(prev => ({ ...prev, [subjectId]: value }));
  };
  const handleModalSubmit = () => {
    // Handle submit logic here (e.g., send to backend)
    setPostModalOpen(false);
  };

  const filteredSubjects = subjects.filter(subj => {
    const matchesSearch = subj.name.toLowerCase().includes(search.toLowerCase());
    if (filter === 'All') return matchesSearch;
    if (filter === 'DRAFT') return matchesSearch && !subj.standby;
    if (filter === 'Stand BY') return matchesSearch && subj.standby;
    return matchesSearch;
  });

  const handleDraftClick = (id) => {
    setSubjects(subjects.map(subj =>
      subj.id === id ? { ...subj, standby: true } : subj
    ));
    setMessage('Subject set to Stand BY!');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleCancelStandby = (id) => {
    setSubjects(subjects.map(subj =>
      subj.id === id ? { ...subj, standby: false } : subj
    ));
    setMessage('Returned to Draft.');
    setMenuOpen(null);
    setTimeout(() => setMessage(''), 2000);
  };
  
  const handleMenuToggle = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };
  
  const handleSubjectClick = (subject) => {
    // Create a copy of the subject data to avoid reference issues
    setSelectedSubject({
      name: subject.name,
      image: subject.image,
      backgroundImage: subject.backgroundImage,
      id: subject.id,
      teacher: subject.teacher,
      standby: subject.standby
    });
    // Make sure we're in teacher mode before opening the modal
    if (viewMode !== 'teacher') {
      setViewMode('teacher');
    }
    // Add a small delay to avoid the active/pressed state from persisting
    setTimeout(() => {
      setModuleModalOpen(true);
    }, 10);
  };
  
  const handleAcceptModule = () => {
    setModuleModalOpen(false);
    // Add a small delay before opening the upload module
    setTimeout(() => {
      setUploadModuleOpen(true);
    }, 50);
  };

  // Handler to close UploadModule overlay/modal
  const handleCloseUploadModule = () => {
    setUploadModuleOpen(false);
    setMessage(`Module for ${selectedSubject.name} accepted!`);
    setTimeout(() => setMessage(''), 2000);
  };
  
  // Direct handler to open the upload module (for debugging/direct access)
  const openUploadModuleDirectly = (subject) => {
    setSelectedSubject({
      name: subject.name,
      image: subject.image,
      backgroundImage: subject.backgroundImage,
      id: subject.id,
      teacher: subject.teacher,
      standby: subject.standby
    });
    setUploadModuleOpen(true);
  };

  // Handler for mode selection
  const handleModeSelection = (mode) => {
    setViewMode(mode);
  };

  // Render selection view (Teacher/Student)
  const renderSelectionView = () => (
    <div className="subject-area-selection">
      <h2>Select Area</h2>
      <div className="area-buttons">
        <button 
          className="area-button teacher"
          onClick={() => handleModeSelection('teacher')}
        >
          <div className="area-button-content">
            <div className="area-button-icon">
              <FaUserTie size={48} />
            </div>
            <span>Teacher</span>
          </div>
        </button>
        <button 
          className="area-button student"
          onClick={() => handleModeSelection('student')}
        >
          <div className="area-button-content">
            <div className="area-button-icon">
              <FaUserGraduate size={48} />
            </div>
            <span>Student</span>
          </div>
        </button>
      </div>
    </div>
  );

  // State for student upload module
  const [studentUploadOpen, setStudentUploadOpen] = useState(false);

  // Handle student upload save
  const handleStudentUploadSave = (data) => {
    console.log('Student upload data:', data);
    setStudentUploadOpen(false);
  };

  // Sample student subjects for the card view
  const [studentSubjects, setStudentSubjects] = useState([
    {
      id: 1,
      name: 'Araling Panlipunan',
      teacher: 'Mr. Ralp',
      status: 'DRAFT',
      image: '/img/araling.png',
      standby: false
    }
  ]);
  
  // State for menu visibility
  const [activeMenu, setActiveMenu] = useState(null);
  
  // Toggle standby status
  const toggleStandby = (id) => {
    setStudentSubjects(prevSubjects => 
      prevSubjects.map(subject => 
        subject.id === id ? { ...subject, standby: !subject.standby } : subject
      )
    );
    setActiveMenu(null);
  };

  // Render student view with card-based design
  const renderStudentView = () => (
    <div className="upload-lessons-student-view">
      <div className="upload-lessons-header-row">
        <h2 className="upload-lessons-title">Manage Upload Lessons</h2>
        <div className="header-buttons">
          <button 
            className="upload-lessons-action-btn" 
            onClick={() => setStudentUploadOpen(true)}
          >
            Post to Student
          </button>
          <button 
            className="upload-lessons-back-btn" 
            onClick={() => setViewMode('selection')}
          >
            Go Back to Selection Area
          </button>
        </div>
      </div>
      
      {studentSubjects.length > 0 ? (
        <div className="student-subjects-grid">
          {studentSubjects.map(subject => (
            <div 
              key={subject.id} 
              className={`student-subject-card ${subject.standby ? 'standby-active' : ''}`} 
              onClick={() => setStudentUploadOpen(true)}
            >
              <div className="subject-card-image-container">
                <img 
                  src={subject.image} 
                  alt={subject.name} 
                  className="subject-card-image" 
                />
                {subject.standby && (
                  <div className="standby-overlay">
                    <span>Stand BY</span>
                  </div>
                )}
              </div>
              <div className="subject-card-content">
                <h3 className="subject-card-title">{subject.name}</h3>
                <p className="subject-card-teacher">{subject.teacher}</p>
                <div className="subject-card-status-container">
                  {subject.standby ? (
                    <div className="subject-card-status standby">Stand BY</div>
                  ) : (
                    <div className={`subject-card-status ${subject.status.toLowerCase()}`}>
                      {subject.status}
                    </div>
                  )}
                  <div className="subject-card-menu-container">
                    <button 
                      className="subject-card-menu-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === subject.id ? null : subject.id);
                      }}
                    >
                      <span className="dots">⋮</span>
                    </button>
                    {activeMenu === subject.id && (
                      <div className="standby-button-container">
                        <button 
                          className="standby-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStandby(subject.id);
                          }}
                        >
                          S
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-student-container">
          <div className="empty-student-message">
            <p>No content available for students yet.</p>
          </div>
        </div>
      )}
      
      <div className="system-message">
        "The system is currently under development and not yet finalized. Some features may still be incomplete, and further testing and refinement are ongoing to ensure the best possible performance and user experience".
      </div>

      {/* Student Upload Module */}
      {studentUploadOpen && (
        <div className="centered-modal-container">
          <StudentUploadModule
            onClose={() => setStudentUploadOpen(false)}
            onSave={handleStudentUploadSave}
          />
        </div>
      )}
    </div>
  );

  // Render teacher view (with subject grid/list)
  const renderTeacherView = () => (
    <>
      <div className="upload-lessons-header-row">
        <h2 className="upload-lessons-title">Manage Upload Lessons</h2>
        <button 
          className="upload-lessons-back-btn" 
          onClick={() => setViewMode('selection')}
        >
          Go Back to Selection Area
        </button>
      </div>
      
      {message && <div className="upload-lessons-message">{message}</div>}
      {loading && <div className="upload-lessons-loading">Loading subjects...</div>}
      {error && <div className="upload-lessons-error">{error}</div>}
      
      <div className="upload-lessons-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search subject by name"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="upload-lessons-search"
          />
          <span className="search-icon">&#128269;</span>
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="upload-lessons-filter"
        >
          <option value="All">FILTER</option>
          <option value="DRAFT">Draft</option>
          <option value="Stand BY">Stand BY</option>
        </select>
        <div className="upload-lessons-view-toggle">
          <button
            className={view === 'grid' ? 'active' : ''}
            onClick={() => setView('grid')}
          >
            <span className="button-icon">&#9783;</span>
            GRID
          </button>
          <button
            className={view === 'list' ? 'active' : ''}
            onClick={() => setView('list')}
          >
            <span className="button-icon">&#9776;</span>
            LIST
          </button>
        </div>
        <button
          className="upload-lessons-post-btn"
          onClick={() => setPostModalOpen(true)}
          style={{ marginLeft: 'auto', minWidth: 180 }}
        >
          + Post in Teacher
        </button>
      </div>
      
      <div className={view === 'grid' ? 'subject-grid' : 'subject-list'}>
        {filteredSubjects.map(subject => (
          <div key={subject.id} className="subject-card" onClick={() => openUploadModuleDirectly(subject)}>
            <div className="subject-image-container">
              <img src={subject.image} alt={subject.name} className="subject-image" />
              {subject.standby && <div className="standby-overlay">Stand BY</div>}
            </div>
            <div className="subject-details subject-details-row">
              <div>
                <div className="subject-title">{subject.name}</div>
                <div className="subject-teacher">{subject.teacher}</div>
                <div 
                  className="subject-status clickable-status"
                  onClick={(e) => {
                    e.stopPropagation();
                    subject.standby ? handleCancelStandby(subject.id) : handleDraftClick(subject.id);
                  }}
                >
                  {subject.standby ? 'Stand BY' : 'DRAFT'}
                </div>
              </div>
              <div className="subject-menu-container">
                <button 
                  className="subject-menu-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuToggle(subject.id);
                  }}
                >
                  &#8942;
                </button>
                {menuOpen === subject.id && (
                  <div className="subject-menu">
                    {subject.standby ? (
                      <button 
                        className="cancel-standby-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelStandby(subject.id);
                        }}
                      >
                        Cancel Stand BY
                      </button>
                    ) : (
                      <button 
                        className="set-standby-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDraftClick(subject.id);
                        }}
                      >
                        Set to Stand BY
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="upload-lessons-container">
      {/* New Subject Popup */}
      {newSubjectPopup && (
        <div className="new-subject-popup">
          <div className="new-subject-popup-content">
            <h3>New Subject Added!</h3>
            <div className="new-subject-details">
              <img 
                src={newSubjectPopup.image} 
                alt={newSubjectPopup.name} 
                className="new-subject-image" 
              />
              <div>
                <p><strong>{newSubjectPopup.name}</strong></p>
                <p>Teacher: {newSubjectPopup.teacher}</p>
                <button 
                  className="new-subject-action-btn"
                  onClick={() => {
                    setSelectedSubject(newSubjectPopup);
                    setNewSubjectPopup(null);
                    setModuleModalOpen(true);
                  }}
                >
                  Upload Lessons Now
                </button>
              </div>
            </div>
            <button 
              className="new-subject-close-btn"
              onClick={() => setNewSubjectPopup(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Render the appropriate view based on viewMode */}
      {viewMode === 'selection' && renderSelectionView()}
      {viewMode === 'student' && renderStudentView()}
      {viewMode === 'teacher' && renderTeacherView()}
      
      {/* Only render these modals if we're in teacher mode */}
      {viewMode === 'teacher' && (
        <>
          {/* Post in Teacher Modal */}
          {postModalOpen && (
            <PostInTeacherModal
              isOpen={postModalOpen}
              onClose={() => setPostModalOpen(false)}
              onSubmit={handleModalSubmit}
              subjects={modalSubjects}
              selections={modalSelections}
              onRadioChange={handleModalRadioChange}
            />
          )}
          
          {/* Upload Module Modal */}
          {moduleModalOpen && (
            <UploadModuleModal
              isOpen={moduleModalOpen}
              onClose={() => setModuleModalOpen(false)}
              onAccept={handleAcceptModule}
              subject={selectedSubject}
            />
          )}
          
          {/* Upload Module Overlay */}
          {uploadModuleOpen && (
            <div className="upload-module-overlay">
              <div className="upload-module-container">
                <UploadModule
                  subject={selectedSubject.name}
                  onClose={handleCloseUploadModule}
                  onSave={handleCloseUploadModule}
                />
              </div>
            </div>
          )}
        </>
      )}
      
      <div style={{color:'#5a6474', marginTop:'30px', textAlign:'center', padding:'15px', borderRadius:'5px', background:'#f8f9fa'}}>
        "The system is currently under development and not yet finalized. Some features may still be incomplete, and further testing and refinement are ongoing to ensure the best possible performance and user experience".
      </div>
      
      {/* Add CSS for the new subject popup */}
      <style>{`
        .new-subject-popup {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .new-subject-popup-content {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          padding: 15px;
          width: 300px;
        }
        
        .new-subject-details {
          display: flex;
          align-items: center;
          margin-top: 10px;
        }
        
        .new-subject-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 5px;
          margin-right: 15px;
        }
        
        .new-subject-action-btn {
          background: #4a90e2;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 5px 10px;
          margin-top: 10px;
          cursor: pointer;
        }
        
        .new-subject-close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
        }
        
        /* Selection area styles */
        .subject-area-selection {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          text-align: center;
        }
        
        .area-buttons {
          display: flex;
          gap: 30px;
          margin-top: 30px;
        }
        
        .area-button {
          width: 200px;
          height: 200px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .area-button:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .area-button.teacher {
          background-color: #4a90e2;
          color: white;
        }
        
        .area-button.student {
          background-color: #50c878;
          color: white;
        }
        
        .area-button-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }
        
        .area-button-icon {
          font-size: 48px;
        }
        
        .area-button span {
          font-size: 18px;
          font-weight: bold;
        }
        
        /* Header row with back button */
        .upload-lessons-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .header-buttons {
          display: flex;
          gap: 10px;
        }
        
        .upload-lessons-action-btn {
          background-color: #4285f4;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .upload-lessons-action-btn:hover {
          background-color: #3367d6;
        }
        
        .upload-lessons-title {
          margin: 0;
        }
        
        .upload-lessons-back-btn {
          // background-color: #f0f0f0;
          // border: none;
          // border-radius: 4px;
          // padding: 8px 16px;
          // cursor: pointer;
          // display: flex;
          // align-items: center;
          // gap: 8px;
        
         background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 200px;
  text-align: center;
        
          }
        
        .upload-lessons-back-btn:hover {
          background-color: #e0e0e0;
        }
        
        /* Empty student view */
        .empty-student-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 300px;
          background-color: #f9f9fa;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .empty-student-message {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 16px;
          color: #666;
        }
        
        .system-message {
          color: #5a6474;
          text-align: center;
          padding: 15px;
          border-radius: 5px;
          background: #f8f9fa;
          font-size: 14px;
          line-height: 1.5;
          margin-top: 30px;
        }
        
        /* Student subject cards styling */
        .student-subjects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .student-subject-card {
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
          position: relative;
          cursor: pointer;
          border: 1px solid #eaeaea;
          animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .student-subject-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .subject-card-image-container {
          height: 140px;
          background-color: #f5f7fa;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        .subject-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .student-subject-card:hover .subject-card-image {
          transform: scale(1.05);
        }
        
        .subject-card-content {
          padding: 15px;
          position: relative;
        }
        
        .subject-card-title {
          color: #2c3e50;
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 5px 0;
        }
        
        .subject-card-teacher {
          color: #7f8c8d;
          font-size: 14px;
          margin: 0 0 10px 0;
        }
        
        .subject-card-status {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }
        
        .subject-card-status.draft {
          background-color: #f8f9fa;
          color: #6c757d;
          border: 1px solid #dee2e6;
        }
        
        .subject-card-status.published {
          background-color: #e3f2fd;
          color: #1976d2;
          border: 1px solid #bbdefb;
        }
        
        .subject-card-status.standby {
          background-color: transparent;
          color: #4CAF50;
          font-weight: bold;
          border: none;
          font-size: 14px;
        }
        
        .standby-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
        }
        
        .standby-overlay span {
          color: white;
          font-size: 24px;
          font-weight: bold;
          text-transform: uppercase;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
        }
        
        .standby-active {
          border: 2px solid #6a5acd;
          box-shadow: 0 0 0 2px rgba(106, 90, 205, 0.3);
        }
        
        .subject-card-status-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 5px;
        }
        
        .subject-card-menu-container {
          position: relative;
          z-index: 10;
        }
        
        .subject-card-menu-btn {
          background: transparent;
          border: none;
          font-size: 20px;
          color: #95a5a6;
          cursor: pointer;
          padding: 5px;
          transition: color 0.2s ease;
        }
        
        .subject-card-menu-btn:hover {
          color: #2c3e50;
        }
        
        .dots {
          font-size: 24px;
          line-height: 1;
        }
        
        .standby-button-container {
          position: absolute;
          bottom: 5px;
          right: 25px;
          z-index: 20;
          animation: fadeInDropdown 0.2s ease;
        }
        
        @keyframes fadeInDropdown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        

        
        .standby-btn {
          background-color: #6a5acd;
          color: white;
          font-weight: 500;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          white-space: nowrap;
          padding: 4px 8px;
          font-size: 13px;
          border: none;
          cursor: pointer;
          text-align: center;
          transition: background-color 0.2s ease;
          width: 30px;
          height: 30px;
        }
        
        .standby-btn:hover {
          background-color: #5b4cbe;
        }
        
        /* Add card styling */
        .add-card {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          border: 2px dashed #dee2e6;
          min-height: 250px;
          transition: all 0.3s ease;
        }
        
        .add-card:hover {
          background-color: #e9ecef;
          border-color: #ced4da;
        }
        
        .add-card-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px;
        }
        
        .add-icon {
          font-size: 36px;
          color: #6c757d;
          margin-bottom: 10px;
          transition: transform 0.3s ease;
        }
        
        .add-card:hover .add-icon {
          transform: scale(1.2);
        }
        
        .add-card-content p {
          color: #6c757d;
          font-size: 16px;
          margin: 0;
        }
        
        /* Centered modal container */
        .centered-modal-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3000;
          animation: fadeInModal 0.3s ease;
        }
        
        @keyframes fadeInModal {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        /* Subject menu button styles */
        .subject-menu-container {
          display: flex;
          align-items: center;
          position: relative;
        }
        
        .subject-menu-button {
          background: transparent;
          border: none;
          font-size: 18px;
          cursor: pointer;
          padding: 5px;
          color: transparent;
          text-shadow: 0 0 0 #666; /* This makes only the dots visible with gray color */
        }
        
        .subject-menu {
          position: absolute;
          right: 0;
          top: 30px;
          background: white;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          z-index: 10;
          overflow: hidden;
          min-width: 150px;
        }
        
        .subject-menu button {
          width: 100%;
          text-align: left;
          padding: 10px 15px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }
        
        .set-standby-btn {
          background-color: #6a5acd !important; /* Slate blue color */
          color: white !important;
        }
        
        .set-standby-btn:hover {
          background-color: #5b4cbe !important;
        }
        
        .cancel-standby-btn {
          background-color: #ff7f50 !important; /* Coral color */
          color: white !important;
        }
        
        .cancel-standby-btn:hover {
          background-color: #ff6a41 !important;
        }
      `}</style>
    </div>
  );
};

export default UploadLessons;
