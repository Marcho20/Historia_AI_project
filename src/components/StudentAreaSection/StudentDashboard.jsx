import React, { useState, useEffect } from 'react';
import {
  FaSignOutAlt,
  FaArrowLeft,
  FaBook,
  FaChevronUp,
  FaChevronDown,
  FaGraduationCap
} from 'react-icons/fa';
import logo4student from '../../assets/logo4student.png';
import '../TeacherSection/../AdminDashboard.css'; // Reuse admin/teacher sidebar styles
import Lessons from './Lessons';
import Assignment from './Assignment';
import ChatBot from './ChatBot';
import Badges from './Badges';
import Calendar from '../Calendar';
import StudentSubjectEnrollment from './StudentSubjectEnrollment';
// Voice commands removed

function StudentDashboard() {
  // --- To-do List State and Handlers ---
  const [todos, setTodos] = useState([
    // Example initial tasks (can be empty)
    { text: 'Finish Math Assignment', done: false },
    { text: 'Read Chapter 4', done: true },
  ]);
  const [newTodo, setNewTodo] = useState("");

  const handleAddTodo = (e) => {
    e.preventDefault();
    const trimmed = newTodo.trim();
    if (trimmed.length === 0) return;
    setTodos([...todos, { text: trimmed, done: false }]);
    setNewTodo("");
  };

  const handleToggleTodo = (idx) => {
    setTodos(todos =>
      todos.map((todo, i) => i === idx ? { ...todo, done: !todo.done } : todo)
    );
  };

  const handleDeleteTodo = (idx) => {
    setTodos(todos => todos.filter((_, i) => i !== idx));
  };

  // --- Edit functionality for To-do ---
  const [editIdx, setEditIdx] = useState(null);
  const [editText, setEditText] = useState("");

  const handleStartEdit = (idx) => {
    setEditIdx(idx);
    setEditText(todos[idx].text);
  };

  const handleEditChange = (e) => {
    setEditText(e.target.value);
  };

  const handleSaveEdit = (idx) => {
    const trimmed = editText.trim();
    if (trimmed.length === 0) return;
    setTodos(todos => todos.map((todo, i) => i === idx ? { ...todo, text: trimmed } : todo));
    setEditIdx(null);
    setEditText("");
  };

  const handleCancelEdit = () => {
    setEditIdx(null);
    setEditText("");
  };

  // --- Sidebar and Navigation State ---
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [assignmentsOpen, setAssignmentsOpen] = useState(true);
  const [quizzesOpen, setQuizzesOpen] = useState(true);
  const [showSubjectEnrollment, setShowSubjectEnrollment] = useState(false);

  // --- Unit data ---
  const [units] = useState([
    { id: 1, title: 'Unit 1', subtitle: 'Ang Aking Komunidad Ngayon at Noon' },
    { id: 2, title: 'Unit 2', subtitle: 'Ang Aking Lalawigan' },
    { id: 3, title: 'Unit 3', subtitle: 'Ang Aking Rehiyon' },
    { id: 4, title: 'Unit 4', subtitle: 'Ang Aking Bansa' }
  ]);

  // Unit navigation handlers
  const handleViewUnit = (unit) => {
    setSelectedUnit(unit);
    setActiveMenu('unit-detail');
  };

  const handleBackToUnits = () => {
    setSelectedUnit(null);
    setSelectedLesson(null);
    setActiveMenu('dashboard');
  };
  
  const handleViewLesson = (lesson) => {
    setSelectedLesson(lesson);
  };
  
  const handleBackToLessons = () => {
    setSelectedLesson(null);
  };

  const toggleAssignments = () => {
    setAssignmentsOpen(!assignmentsOpen);
  };

  const toggleQuizzes = () => {
    setQuizzesOpen(!quizzesOpen);
  };

  // PH Date and Time (UTC+8)
  const [phDate, setPhDate] = useState('');
  const [phTime, setPhTime] = useState('');

  useEffect(() => {
    const updatePhDateTime = () => {
      const now = new Date();
      // Convert to PH time (UTC+8)
      const phNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
      setPhDate(phNow.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
      setPhTime(phNow.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    updatePhDateTime();
    const interval = setInterval(updatePhDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.role !== 'student') {
      window.location.href = '/';
      return;
    }
    setUser(userData);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  // Simplified menu - just Home
  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: null }
  ];

  // Voice command functionality removed

  return (
    <div className="dashboard-container" style={{backgroundColor: 'white'}}>
      {/* Sidebar - simplified design based on second image */}
      <aside style={{
        backgroundColor: '#1a3a8f', /* Matching the blue in the image */
        width: '200px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0',
        position: 'fixed',
        left: 0,
        top: 0,
        boxShadow: '2px 0 10px rgba(0,0,0,0.2)'
      }}>
        {/* Top section matches with the purple header */}
        <div style={{width: '100%'}}>
          {/* This empty div maintains the same height as the header */}
          <div style={{height: '64px', backgroundColor: 'white', borderBottom: '1px solid black'}}></div>
          
          {/* Navigation Menu */}
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px'}}>
            <div 
              onClick={() => setActiveMenu('dashboard')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginTop: '30px',
                marginBottom: '20px'
              }}
            >
              <div style={{
                width: '100px',
                height: '100px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <img 
                  src={logo4student} 
                  alt="Home" 
                  style={{
                    width: '250px', 
                    height: '250px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                  }} 
                />
              </div>
              <span style={{color: 'white', fontSize: '22px', fontWeight: '600'}}>Home</span>
            </div>
            
            {/* Subject Enrollment Navigation Item */}
            <div 
              onClick={() => setActiveMenu('subject-enrollment')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginTop: '10px',
                marginBottom: '20px',
                opacity: activeMenu === 'subject-enrollment' ? 1 : 0.8,
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#4a6bcc',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '10px',
                boxShadow: activeMenu === 'subject-enrollment' ? '0 0 15px rgba(255,255,255,0.5)' : 'none'
              }}>
                <FaGraduationCap style={{color: 'white', fontSize: '28px'}} />
              </div>
              <span style={{color: 'white', fontSize: '18px', fontWeight: '600'}}>My Subjects</span>
            </div>
          </div>
        </div>
        
        {/* Logout button at bottom */}
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{marginBottom: '40px', textAlign: 'center'}}>
            <div 
              onClick={handleLogout}
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: '#4a6bcc', /* Lighter blue circle */
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
                margin: '0 auto 15px auto'
              }}
            >
              <FaSignOutAlt style={{color: 'white', fontSize: '30px'}} />
            </div>
            <span style={{color: 'white', fontSize: '22px', fontWeight: '600'}}>LogOut</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{marginLeft: '200px', backgroundColor: 'white'}}>
        {/* Header - simplified purple header as in the image */}
        <header style={{
          height: '80px',
          padding: '0 30px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'white'
        }}>
          <div>
            <div style={{fontSize: '28px', fontWeight: 'bold'}}>Welcome Student</div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
            <div style={{fontSize: '20px', fontWeight: 'bold', color: '#1a3a8f'}}>{phTime}</div>
            <div style={{fontSize: '14px', color: '#718096'}}>{phDate}</div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {/* Main dashboard view */}
          {activeMenu === 'dashboard' && (
            <div style={{padding: '40px', maxWidth: '1200px', margin: '0 auto'}}>
              <h2 style={{
                marginBottom: '30px', 
                textAlign: 'center', 
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#1a3a8f'
              }}>Welcome to HISTORIA-AI</h2>
              
              {/* Unit cards */}
              <div style={{
                display: 'flex', 
                flexDirection: 'column',
                gap: '20px',
                maxWidth: '800px',
                margin: '0 auto'
              }}>
                {units.map(unit => (
                  <div 
                    key={unit.id}
                    onClick={() => handleViewUnit(unit)}
                    className="unit-card"
                    style={{
                      backgroundColor: '#ffeb3b',
                      padding: '25px 30px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <h3 style={{
                          marginBottom: '10px', 
                          fontSize: '24px', 
                          fontWeight: 'bold',
                          color: '#1a3a8f'
                        }}>Unit {unit.id}:</h3>
                        <p style={{color: '#555', fontSize: '16px'}}>{unit.subtitle}</p>
                      </div>
                      
                      {/* Progress indicator */}
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        border: '3px solid #1a3a8f',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#1a3a8f',
                        backgroundColor: 'rgba(255,255,255,0.7)'
                      }}>
                        {unit.id === 1 ? '100%' : '0%'}
                      </div>
                    </div>
                    
                    {/* Visual indicator for current unit */}
                    {unit.id === 1 && (
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>Current</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Unit detail view - styled to exactly match the image */}
          {activeMenu === 'unit-detail' && selectedUnit && !selectedLesson && (
            <div className="unit-detail-view" style={{padding: '30px', maxWidth: '900px', margin: '0 auto'}}>
              {/* Unit header with title and back button - matching second image */}
              <div style={{marginBottom: '20px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <h2 style={{margin: 0, fontSize: '24px', fontWeight: 'bold'}}>Unit {selectedUnit.id}</h2>
                  <button 
                    onClick={handleBackToUnits}
                    style={{
                      background: '#1a3a8f',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      width: '120px'
                    }}
                  >
                    Back to Units
                  </button>
                </div>
              </div>
              
              {/* Lessons Section */}
              <div style={{marginBottom: '30px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
                <div style={{background: '#1a3a8f', color: 'white', padding: '15px 20px'}}>
                  <h3 style={{margin: 0, fontSize: '20px', fontWeight: 'bold'}}>Lessons</h3>
                </div>
                
                <div style={{background: 'white', padding: '20px'}}>
                  <div 
                    style={{borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '20px', cursor: 'pointer'}}
                    onClick={() => handleViewLesson({
                      id: 1,
                      title: 'Introduction to Social Studies',
                      description: 'Understanding our community\'s history and development',
                      status: 'Completed',
                      unitTitle: 'Unit ' + selectedUnit.id + ': ' + selectedUnit.subtitle,
                      content: [
                        { title: 'Ang Komunidad', description: 'Description' },
                        { title: 'Ang Kahalagahan ng Komunidad', description: 'Description' },
                        { title: 'Ang mga Bumubuo ng Komunidad', description: 'Description' },
                        { title: 'Ang mga Tungkulin at Gawain ng mga Bumubuo ng Komunidad', description: 'Description' },
                        { title: 'Ang mga Institusyong Naglilingkod sa Ating Komunidad', description: 'Description' },
                        { title: 'Ang Pananatili at mga Pagbabago sa Unang Komunidad', description: 'Description' }
                      ]
                    })}
                  >
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <h4 style={{margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold'}}>Lesson 1: Introduction to Social Studies</h4>
                        <p style={{margin: '0', color: '#718096', fontSize: '15px'}}>Understanding our community's history and development</p>
                      </div>
                      <span style={{color: '#48BB78', fontWeight: 'bold', fontSize: '16px'}}>Completed</span>
                    </div>
                  </div>
                  
                  <div style={{borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '20px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <h4 style={{margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold'}}>Lesson 2: Primary Sources</h4>
                        <p style={{margin: '0', color: '#718096', fontSize: '15px'}}>Understanding and analyzing primary historical sources</p>
                      </div>
                      <span style={{color: '#F6AD55', fontWeight: 'bold', fontSize: '16px'}}>In Progress</span>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <h4 style={{margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold'}}>Lesson 3: Historical Context</h4>
                        <p style={{margin: '0', color: '#718096', fontSize: '15px'}}>Placing events in their proper historical context</p>
                      </div>
                      <span style={{color: '#A0AEC0', fontWeight: 'bold', fontSize: '16px'}}>Not Started</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Assignments Section */}
              <div style={{marginBottom: '30px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'}}>
                <div 
                  style={{background: '#1a3a8f', color: 'white', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'}}
                  onClick={toggleAssignments}
                >
                  <h3 style={{margin: 0, fontSize: '20px', fontWeight: 'bold'}}>Araling Panlipunan Assignments</h3>
                  <span>
                    {assignmentsOpen ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </div>
                
                {assignmentsOpen && (
                  <div style={{background: 'white', padding: '0'}}>
                    <div style={{borderBottom: '1px solid #e2e8f0', padding: '15px 20px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>
                          <h4 style={{margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold'}}>Gumuhit ng Pambansang Bayani</h4>
                          <p style={{margin: '0', color: '#718096', fontSize: '15px'}}>Gumuhit ng larawan ng isang pambansang bayani ng Pilipinas (halimbawa: Jose Rizal, Andres Bonifacio, o Melchora Aquino).</p>
                        </div>
                        <span style={{color: '#E53E3E', fontWeight: 'bold', fontSize: '16px'}}>Due: May 20, 2025</span>
                      </div>
                    </div>
                    
                    <div style={{padding: '15px 20px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>
                          <h4 style={{margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold'}}>Tungkol sa Bayani</h4>
                          <p style={{margin: '0', color: '#718096', fontSize: '15px'}}>Isulat sa ilalim ng iyong drawing ang pangalan ng bayani at ang isang mabuting gawa niya para sa ating bansa.</p>
                        </div>
                        <span style={{color: '#E53E3E', fontWeight: 'bold', fontSize: '16px'}}>Due: May 15, 2025</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Quizzes Section */}
              <div style={{borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'}}>
                <div 
                  style={{background: '#1a3a8f', color: 'white', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'}}
                  onClick={toggleQuizzes}
                >
                  <h3 style={{margin: 0, fontSize: '20px', fontWeight: 'bold'}}>Quizzes</h3>
                  <span>
                    {quizzesOpen ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </div>
                
                {quizzesOpen && (
                  <div style={{background: 'white', padding: '0'}}>
                    <div style={{borderBottom: '1px solid #e2e8f0', padding: '15px 20px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>
                          <h4 style={{margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold'}}>Quiz 1: Historical Methods</h4>
                          <p style={{margin: '0', color: '#718096', fontSize: '15px'}}>Completed on May 5, 2025</p>
                        </div>
                        <span style={{color: '#48BB78', fontWeight: 'bold', fontSize: '16px'}}>Score: 90%</span>
                      </div>
                    </div>
                    
                    <div style={{padding: '15px 20px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>
                          <h4 style={{margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold'}}>Quiz 2: Primary Sources</h4>
                          <p style={{margin: '0', color: '#718096', fontSize: '15px'}}>Opens on May 14, 2025</p>
                        </div>
                        <span style={{color: '#4299E1', fontWeight: 'bold', fontSize: '16px'}}>Available</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Lesson detail view - styled to match the provided image */}
          {activeMenu === 'unit-detail' && selectedUnit && selectedLesson && (
            <div className="lesson-detail-view" style={{padding: '30px', maxWidth: '900px', margin: '0 auto'}}>
              {/* Lesson header with title and back button */}
              <div style={{marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h2 style={{margin: 0, fontSize: '32px', fontWeight: 'bold'}}>Lesson {selectedLesson.id}</h2>
                <button 
                  onClick={handleBackToLessons}
                  style={{
                    background: '#1a3a8f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '12px 24px',
                    fontSize: '18px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    width: '180px'
                  }}
                >
                  Back to Lessons
                </button>
              </div>
              
              {/* Unit title banner with images */}
              <div style={{
                background: '#1a3a8f',
                color: '#ffeb3b',
                padding: '30px',
                borderRadius: '10px',
                marginBottom: '30px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <img 
                  src="/src/assets/40a9d902f60514e77c12b6ed227781f4.jpg" 
                  alt="Community" 
                  style={{width: '80px', height: '80px', borderRadius: '10px'}}
                />
                <h3 style={{margin: 0, fontSize: '32px', fontWeight: 'bold'}}>Unit 1: Ang Komunidad</h3>
                <img 
                  src="/src/assets/a8b7b000ad97ac97d4d74ee0f4bf7870.jpg" 
                  alt="Village" 
                  style={{width: '80px', height: '80px', borderRadius: '10px'}}
                />
              </div>
              
              {/* Summary section */}
              <div style={{
                background: '#1a3a8f',
                color: 'white',
                padding: '30px',
                borderRadius: '10px',
                marginBottom: '30px'
              }}>
                <h3 style={{margin: '0 0 15px 0', fontSize: '26px', fontWeight: 'bold', textAlign: 'right'}}>Summary of Unit 1</h3>
                <p style={{margin: 0, textAlign: 'center', color: 'white', fontSize: '20px', lineHeight: '1.5'}}>This unit explores the concept of community, its history, development, and importance in Filipino society.</p>
              </div>
              
              {/* Lesson content sections */}
              <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                {selectedLesson.content.map((item, index) => (
                  <div key={index} style={{display: 'flex', alignItems: 'center', gap: '25px'}}>
                    <div style={{width: '150px', color: '#718096', fontSize: '20px'}}>{item.description}</div>
                    <div style={{
                      flex: 1,
                      background: '#1a3a8f',
                      color: '#ffeb3b',
                      padding: '20px 30px',
                      borderRadius: '10px',
                      fontSize: '22px',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}>
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Other menu sections */}
          {activeMenu === 'lesson' && <Lessons />}
          {activeMenu === 'assignment' && <Assignment />}
          {activeMenu === 'chatbot' && <ChatBot />}
          {activeMenu === 'badges' && <Badges />}
          {activeMenu === 'calendar' && <Calendar />}
          {activeMenu === 'subject-enrollment' && <StudentSubjectEnrollment />}

          {/* Development message removed */}
        </div>
      </main>
      {/* AI Chatbot - positioned at bottom right */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <ChatBot />
      </div>
    </div>
  );
}

export default StudentDashboard;
