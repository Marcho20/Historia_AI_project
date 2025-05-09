import React, { useState, useEffect, useRef } from 'react';
import './UploadLessons.css';
import PostInTeacherModal from './PostInTeacherModal';
import UploadModuleModal from './UploadModuleModal';
import UploadModule from './UploadModule';
import { subscribeToSubjects } from '../firebase/subjectService';

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
  const [view, setView] = useState('grid');
  const [message, setMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(null); // subject id or null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New state for showing popup when a new subject is added
  const [newSubjectPopup, setNewSubjectPopup] = useState(null);
  
  // Upload Module Modal State
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  // UploadModule overlay/modal state
  const [uploadModuleOpen, setUploadModuleOpen] = useState(false);
  
  // Create a ref to store previous subjects
  const previousSubjectsRef = useRef([]);
  
  // Use effect to subscribe to subjects collection
  useEffect(() => {
    setLoading(true);
    console.log('Setting up subjects subscription in UploadLessons');
    
    // Subscribe to real-time updates from Firestore
    const unsubscribe = subscribeToSubjects((updatedSubjects) => {
      setLoading(false);
      console.log('Received updated subjects in UploadLessons:', updatedSubjects);
      
      // Map Firebase subjects to the format expected by this component
      const formattedSubjects = updatedSubjects.map(subject => {
        const defaultImg = getDefaultImage(subject.name);
        return {
          id: subject.id,
          name: subject.name,
          teacher: subject.teacher,
          status: 'DRAFT',
          image: defaultImg.image,
          backgroundImage: subject.backgroundImageUrl || defaultImg.backgroundImage,
          standby: false
        };
      });
      
      // Get previous subjects from ref
      const previousSubjects = previousSubjectsRef.current;
      
      // Check if there's a new subject added
      if (previousSubjects.length > 0 && formattedSubjects.length > previousSubjects.length) {
        console.log('Detected new subject(s)');
        
        // Find all new subjects (ones that weren't in the previous list)
        const newSubjects = formattedSubjects.filter(subject => 
          !previousSubjects.some(prevSubject => prevSubject.id === subject.id)
        );
        
        if (newSubjects.length > 0) {
          console.log('New subject detected:', newSubjects[0]);
          // Show popup for the first new subject
          setNewSubjectPopup(newSubjects[0]);
          
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

  return (
    <div className="upload-lessons-container">
      <h1 className="page-title">Manage Upload Lessons</h1>
      {message && <div className="upload-lessons-message">{message}</div>}
      {loading && <div className="upload-lessons-loading">Loading subjects...</div>}
      {error && <div className="upload-lessons-error">{error}</div>}
      
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
      <div className="upload-lessons-header" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search subject by name"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="upload-lessons-search"
            style={{ minWidth: 260, maxWidth: 340 }}
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
                    !subject.standby && handleDraftClick(subject.id);
                  }}
                  style={{cursor: subject.status === 'DRAFT' && !subject.standby ? 'pointer' : 'default', color: subject.status === 'DRAFT' ? '#2f2f86' : '#888'}}
                >
                  {subject.status}
                </div>
              </div>
              <div className="kebab-menu-container">
                <button 
                  className="kebab-menu-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuToggle(subject.id);
                  }} 
                  aria-label="Open menu"
                >
                  <span className="kebab-icon">⋮</span>
                </button>
                {menuOpen === subject.id && subject.standby && (
                  <div className="kebab-dropdown">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelStandby(subject.id);
                      }} 
                      className="kebab-dropdown-item"
                    >
                      Cancel Stand BY
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <PostInTeacherModal
        open={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        subjects={modalSubjects}
        selections={modalSelections}
        onChange={handleModalRadioChange}
        onSubmit={handleModalSubmit}
      />
      
      <UploadModuleModal
        open={moduleModalOpen}
        onClose={() => setModuleModalOpen(false)}
        subject={selectedSubject}
        onAccept={handleAcceptModule}
      />

      {/* UploadModule overlay/modal for lesson/resource uploads */}
      {uploadModuleOpen && (
        <div className="upload-module-modal-bg">
          <div className="upload-module-modal-content">
            <div className="upload-module-lessons-scroll">
              <UploadModule
                subject={selectedSubject.name}
                onClose={handleCloseUploadModule}
                onSave={handleCloseUploadModule}
              />
            </div>
          </div>
        </div>
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
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          padding: 15px;
          width: 320px;
          position: relative;
          border-left: 4px solid #4b3fa7;
        }
        
        .new-subject-popup h3 {
          margin: 0 0 10px 0;
          color: #4b3fa7;
        }
        
        .new-subject-details {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .new-subject-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 6px;
        }
        
        .new-subject-action-btn {
          background: #4b3fa7;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          margin-top: 10px;
          cursor: pointer;
          font-size: 0.9rem;
        }
        
        .new-subject-action-btn:hover {
          background: #3c3286;
        }
        
        .new-subject-close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: #666;
        }
        
        .upload-lessons-loading,
        .upload-lessons-error {
          padding: 10px;
          margin-bottom: 15px;
          border-radius: 4px;
        }
        
        .upload-lessons-loading {
          background: #e8f4fd;
          color: #0d6efd;
        }
        
        .upload-lessons-error {
          background: #ffe8e8;
          color: #dc3545;
        }
      `}</style>
    </div>
  );
}

export default UploadLessons;
