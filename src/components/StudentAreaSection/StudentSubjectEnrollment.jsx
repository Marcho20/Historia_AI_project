import React, { useState, useEffect } from 'react';
import { 
  FaArrowLeft, 
  FaSearch, 
  FaPlus, 
  FaCheck, 
  FaChevronDown, 
  FaChevronUp,
  FaBook,
  FaCircle,
  FaCheckCircle,
  FaRegCircle,
  FaAngleDown
} from 'react-icons/fa';
import './StudentSubjectEnrollment.css';

const StudentSubjectEnrollment = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([
    { 
      id: 'ap001', 
      code: 'AP101', 
      name: 'Araling Panlipunan', 
      description: 'Kasaysayan at Kultura ng Pilipinas',
      icon: '🏛️',
      units: [
        { 
          id: 1, 
          title: 'Ang Aking Komunidad Ngayon at Noon', 
          progress: 100, 
          status: 'current',
          lessons: [
            { id: 1, title: 'Introduction to Social Studies', description: 'Understanding our community\'s history and development', status: 'completed' },
            { id: 2, title: 'Primary Sources', description: 'Understanding and analyzing primary historical sources', status: 'in-progress' },
            { id: 3, title: 'Historical Context', description: 'Placing events in their proper historical context', status: 'not-started' }
          ]
        },
        { 
          id: 2, 
          title: 'Ang Aking Lalawigan', 
          progress: 0,
          lessons: [
            { id: 1, title: 'Geography of Provinces', description: 'Understanding the geography of Philippine provinces', status: 'not-started' },
            { id: 2, title: 'Provincial Government', description: 'Structure and function of provincial governments', status: 'not-started' },
            { id: 3, title: 'Local Culture', description: 'Cultural diversity across provinces', status: 'not-started' }
          ]
        },
        { 
          id: 3, 
          title: 'Ang Aking Rehiyon', 
          progress: 0,
          lessons: [
            { id: 1, title: 'Regional Development', description: 'Economic and social development of regions', status: 'not-started' },
            { id: 2, title: 'Regional Diversity', description: 'Cultural and environmental diversity of regions', status: 'not-started' }
          ]
        },
        { 
          id: 4, 
          title: 'Ang Aking Bansa', 
          progress: 0,
          lessons: [
            { id: 1, title: 'National Identity', description: 'Formation of Filipino national identity', status: 'not-started' },
            { id: 2, title: 'Government Structure', description: 'Structure and function of the national government', status: 'not-started' },
            { id: 3, title: 'National Heroes', description: 'Contributions of national heroes to Philippine history', status: 'not-started' }
          ]
        }
      ],
      assignments: [
        { id: 1, title: 'Community Interview', dueDate: '2025-05-20', status: 'pending' },
        { id: 2, title: 'Historical Timeline', dueDate: '2025-05-25', status: 'pending' }
      ],
      quizzes: [
        { id: 1, title: 'Unit 1 Quiz', questions: 10, status: 'available' },
        { id: 2, title: 'Midterm Exam', questions: 25, status: 'locked' }
      ]
    },
    { 
      id: 'fil001', 
      code: 'FIL101', 
      name: 'Filipino', 
      description: 'Wika at Panitikan',
      icon: '📚',
      units: [
        { id: 1, title: 'Ang Wikang Filipino', progress: 0 },
        { id: 2, title: 'Mga Akdang Pampanitikan', progress: 0 },
        { id: 3, title: 'Pagsulat at Pagbasa', progress: 0 }
      ]
    },
    { 
      id: 'math001', 
      code: 'MATH101', 
      name: 'Mathematics', 
      description: 'Elementary Mathematics',
      icon: '🔢',
      units: [
        { id: 1, title: 'Numbers and Operations', progress: 0 },
        { id: 2, title: 'Patterns and Algebra', progress: 0 },
        { id: 3, title: 'Geometry', progress: 0 },
        { id: 4, title: 'Statistics and Probability', progress: 0 }
      ]
    },
    { 
      id: 'sci001', 
      code: 'SCI101', 
      name: 'Science', 
      description: 'General Science',
      icon: '🔬',
      units: [
        { id: 1, title: 'Living Things and Their Environment', progress: 0 },
        { id: 2, title: 'Force, Motion, and Energy', progress: 0 },
        { id: 3, title: 'Earth and Space', progress: 0 },
        { id: 4, title: 'Matter', progress: 0 }
      ]
    }
  ]);
  const [enrolledSubjects, setEnrolledSubjects] = useState([]);
  const [viewMode, setViewMode] = useState('browse'); // browse, details, confirmation, my-subjects
  const [currentSubject, setCurrentSubject] = useState(null);
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [viewingLessons, setViewingLessons] = useState(false);

  useEffect(() => {
    // Simulate loading enrolled subjects from database/localStorage
    const loadEnrolledSubjects = () => {
      const savedSubjects = localStorage.getItem('enrolledSubjects');
      if (savedSubjects) {
        setEnrolledSubjects(JSON.parse(savedSubjects));
      }
    };
    
    loadEnrolledSubjects();
  }, []);

  useEffect(() => {
    // Save enrolled subjects to localStorage when they change
    if (enrolledSubjects.length > 0) {
      localStorage.setItem('enrolledSubjects', JSON.stringify(enrolledSubjects));
    }
  }, [enrolledSubjects]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSubjects = availableSubjects.filter(subject => 
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectSubject = (subject) => {
    if (selectedSubjects.some(s => s.id === subject.id)) {
      setSelectedSubjects(selectedSubjects.filter(s => s.id !== subject.id));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleViewSubjectDetails = (subject) => {
    setCurrentSubject(subject);
    setViewMode('details');
  };

  const handleBackToBrowse = () => {
    setViewMode('browse');
    setCurrentSubject(null);
    setSelectedUnit(null);
    setViewingLessons(false);
  };
  
  const handleViewUnitLessons = (unit) => {
    setSelectedUnit(unit);
    setViewingLessons(true);
  };
  
  const handleBackToUnits = () => {
    setViewingLessons(false);
    setSelectedUnit(null);
  };
  
  const getLessonStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <FaCheckCircle className="status-icon completed" />;
      case 'in-progress':
        return <FaCircle className="status-icon in-progress" />;
      case 'not-started':
      default:
        return <FaRegCircle className="status-icon not-started" />;
    }
  };

  const handleEnroll = () => {
    if (viewMode === 'details' && currentSubject) {
      // Enroll in a single subject from details view
      if (!enrolledSubjects.some(s => s.id === currentSubject.id)) {
        setEnrolledSubjects([...enrolledSubjects, currentSubject]);
      }
      setViewMode('confirmation');
    } else if (selectedSubjects.length > 0) {
      // Enroll in multiple selected subjects
      const newEnrolledSubjects = [...enrolledSubjects];
      
      selectedSubjects.forEach(subject => {
        if (!newEnrolledSubjects.some(s => s.id === subject.id)) {
          newEnrolledSubjects.push(subject);
        }
      });
      
      setEnrolledSubjects(newEnrolledSubjects);
      setSelectedSubjects([]);
      setViewMode('confirmation');
    }
  };

  const toggleSubjectExpansion = (subjectId) => {
    setExpandedSubjects({
      ...expandedSubjects,
      [subjectId]: !expandedSubjects[subjectId]
    });
  };

  const renderBrowseView = () => (
    <div className="subject-enrollment-container">
      <h2 className="enrollment-title">Enroll in New Subjects</h2>
      
      <div className="search-container">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search subjects..." 
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>
      
      <div className="subjects-list">
        {filteredSubjects.map(subject => (
          <div 
            key={subject.id} 
            className={`subject-card ${selectedSubjects.some(s => s.id === subject.id) ? 'selected' : ''}`}
          >
            <div className="subject-card-header">
              <div className="subject-icon">{subject.icon}</div>
              <div className="subject-info">
                <h3 className="subject-name">{subject.name}</h3>
                <p className="subject-code">{subject.code}</p>
              </div>
              <div className="subject-actions">
                <button 
                  className="view-details-btn"
                  onClick={() => handleViewSubjectDetails(subject)}
                >
                  View Details
                </button>
                <button 
                  className={`select-subject-btn ${selectedSubjects.some(s => s.id === subject.id) ? 'selected' : ''}`}
                  onClick={() => handleSelectSubject(subject)}
                >
                  {selectedSubjects.some(s => s.id === subject.id) ? <FaCheck /> : <FaPlus />}
                </button>
              </div>
            </div>
            <p className="subject-description">{subject.description}</p>
          </div>
        ))}
      </div>
      
      {selectedSubjects.length > 0 && (
        <div className="enrollment-actions">
          <button 
            className="enroll-btn"
            onClick={handleEnroll}
          >
            Enroll in {selectedSubjects.length} Subject{selectedSubjects.length !== 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  );

  const renderDetailsView = () => {
    if (!currentSubject) return null;
    
    if (viewingLessons && selectedUnit) {
      return (
        <div className="unit-lessons-view">
          <div className="lessons-header">
            <button 
              className="back-btn"
              onClick={handleBackToUnits}
            >
              <FaArrowLeft /> Back to Units
            </button>
            <h2>Unit {selectedUnit.id}</h2>
          </div>
          
          <div className="lessons-container">
            <div className="lessons-section">
              <div className="section-header">
                <h3>Lessons</h3>
              </div>
              <div className="lessons-list">
                {selectedUnit.lessons.map(lesson => (
                  <div key={lesson.id} className={`lesson-item ${lesson.status}`}>
                    <div className="lesson-info">
                      <h4>Lesson {lesson.id}: {lesson.title}</h4>
                      <p>{lesson.description}</p>
                    </div>
                    <div className="lesson-status">
                      {getLessonStatusIcon(lesson.status)}
                      <span className={`status-text ${lesson.status}`}>
                        {lesson.status === 'completed' ? 'Completed' : 
                         lesson.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {currentSubject.assignments && currentSubject.assignments.length > 0 && (
              <div className="assignments-section collapsible-section">
                <div className="section-header">
                  <h3>Araling Panlipunan Assignments</h3>
                  <FaAngleDown className="toggle-icon" />
                </div>
                <div className="section-content hidden">
                  {/* Assignment content would go here */}
                </div>
              </div>
            )}
            
            {currentSubject.quizzes && currentSubject.quizzes.length > 0 && (
              <div className="quizzes-section collapsible-section">
                <div className="section-header">
                  <h3>Quizzes</h3>
                  <FaAngleDown className="toggle-icon" />
                </div>
                <div className="section-content hidden">
                  {/* Quizzes content would go here */}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <div className="subject-details">
        <button 
          className="back-btn"
          onClick={handleBackToBrowse}
        >
          <FaArrowLeft /> Back to Browse
        </button>
        
        <div className="subject-header">
          <div className="subject-icon-large">{currentSubject.icon}</div>
          <div className="subject-header-info">
            <h2 className="subject-name">{currentSubject.name}</h2>
            <p className="subject-code">{currentSubject.code}</p>
            <p className="subject-description">{currentSubject.description}</p>
          </div>
        </div>
        
        <div className="subject-units">
          {currentSubject.units.map(unit => (
            <div key={unit.id} className="unit-card">
              <div className="unit-content">
                <h3 className="unit-title">Unit {unit.id}:</h3>
                <p className="unit-description">{unit.title}</p>
              </div>
              <div className="unit-progress-circle">
                <div className="progress-circle">
                  <div className="progress-text">{unit.progress}%</div>
                </div>
                {unit.status === 'current' && (
                  <div className="current-label">Current</div>
                )}
              </div>
              <button 
                className="view-lessons-btn"
                onClick={() => handleViewUnitLessons(unit)}
              >
                View Lessons
              </button>
            </div>
          ))}
        </div>
        
        <div className="enrollment-actions">
          <button 
            className="enroll-btn"
            onClick={handleEnroll}
          >
            Enroll in this Subject
          </button>
        </div>
      </div>
    );
  };

  const renderConfirmationView = () => (
    <div className="enrollment-confirmation">
      <div className="confirmation-icon">✅</div>
      <h2>Enrollment Successful!</h2>
      <p>You have successfully enrolled in the following subject(s):</p>
      
      <div className="enrolled-subjects-list">
        {currentSubject ? (
          <div className="enrolled-subject-item">
            <span className="subject-icon">{currentSubject.icon}</span>
            <span className="subject-name">{currentSubject.name}</span>
          </div>
        ) : (
          selectedSubjects.map(subject => (
            <div key={subject.id} className="enrolled-subject-item">
              <span className="subject-icon">{subject.icon}</span>
              <span className="subject-name">{subject.name}</span>
            </div>
          ))
        )}
      </div>
      
      <p>You can now access these subjects from your dashboard.</p>
      
      <button 
        className="back-to-browse-btn"
        onClick={handleBackToBrowse}
      >
        Enroll in More Subjects
      </button>
    </div>
  );

  const renderMySubjectsView = () => (
    <div className="my-subjects-container">
      <h2 className="my-subjects-title">My Enrolled Subjects</h2>
      
      {enrolledSubjects.length === 0 ? (
        <div className="no-subjects">
          <p>You haven't enrolled in any subjects yet.</p>
          <button 
            className="browse-subjects-btn"
            onClick={() => setViewMode('browse')}
          >
            Browse Available Subjects
          </button>
        </div>
      ) : (
        <div className="enrolled-subjects-grid">
          {enrolledSubjects.map(subject => (
            <div key={subject.id} className="enrolled-subject-card">
              <div className="subject-card-header">
                <div className="subject-icon">{subject.icon}</div>
                <div className="subject-info">
                  <h3 className="subject-name">{subject.name}</h3>
                  <p className="subject-code">{subject.code}</p>
                </div>
                <button 
                  className="expand-btn"
                  onClick={() => toggleSubjectExpansion(subject.id)}
                >
                  {expandedSubjects[subject.id] ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>
              
              {expandedSubjects[subject.id] && (
                <div className="subject-units-list">
                  <h4>Units:</h4>
                  {subject.units.map(unit => (
                    <div key={unit.id} className="unit-row">
                      <div className="unit-info">
                        <span className="unit-number">Unit {unit.id}:</span>
                        <span className="unit-title">{unit.title}</span>
                      </div>
                      <div className="unit-progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${unit.progress}%` }}
                        ></div>
                        <span className="progress-text">{unit.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="student-subject-enrollment">
      {viewMode === 'browse' && renderBrowseView()}
      {viewMode === 'details' && renderDetailsView()}
      {viewMode === 'confirmation' && renderConfirmationView()}
      {viewMode === 'my-subjects' && renderMySubjectsView()}
    </div>
  );
};

export default StudentSubjectEnrollment;
