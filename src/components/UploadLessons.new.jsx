import React, { useState, useEffect, useRef } from 'react';
import './UploadLessons.css';
import PostInTeacherModal from './PostInTeacherModal';
import UploadModuleModal from './UploadModuleModal';
import UploadModule from './UploadModule';
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
      backgroundImage: subject.backgroundImage
    });
    // Add a small delay to avoid the active/pressed state from persisting
    setTimeout(() => {
      setModuleModalOpen(true);
    }, 10);
  };
  
  const handleAcceptModule = () => {
    setModuleModalOpen(false);
    setUploadModuleOpen(true);
  };

  // Handler to close UploadModule overlay/modal
  const handleCloseUploadModule = () => {
    setUploadModuleOpen(false);
    setMessage(`Module for ${selectedSubject.name} accepted!`);
    setTimeout(() => setMessage(''), 2000);
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

  // Render student view (empty initially)
  const renderStudentView = () => (
    <div className="upload-lessons-student-view">
      <div className="upload-lessons-header-row">
        <h2 className="upload-lessons-title">Manage Upload Lessons</h2>
        <button 
          className="upload-lessons-back-btn" 
          onClick={() => setViewMode('selection')}
        >
          Go Back to Selection Area
        </button>
      </div>
      <div className="empty-student-message">
        <p>No content available for students yet.</p>
      </div>
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
          <div key={subject.id} className="subject-card" onClick={() => handleSubjectClick(subject)}>
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
                      <button onClick={(e) => {
                        e.stopPropagation();
                        handleCancelStandby(subject.id);
                      }}>Cancel Stand BY</button>
                    ) : (
                      <button onClick={(e) => {
                        e.stopPropagation();
                        handleDraftClick(subject.id);
                      }}>Set to Stand BY</button>
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

          
        }
        
        .upload-lessons-back-btn:hover {
          background-color: #e0e0e0;
        }
        
        /* Empty student view */
        .empty-student-message {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 300px;
          background-color: #f9f9f9;
          border-radius: 8px;
          font-size: 18px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default UploadLessons;
