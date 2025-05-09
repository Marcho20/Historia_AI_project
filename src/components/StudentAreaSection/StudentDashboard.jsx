import React, { useState, useEffect } from 'react';
import {
  FaBars,
  FaTachometerAlt,
  FaBook,
  FaClipboardList,
  FaRobot,
  FaMedal,
  FaCalendarAlt,
  FaSignOutAlt,
  FaChevronRight
} from 'react-icons/fa';
import '../TeacherSection/../AdminDashboard.css'; // Reuse admin/teacher sidebar styles
import Lessons from './Lessons';
import Assignment from './Assignment';
import ChatBot from './ChatBot';
import Badges from './Badges';
import Calendar from '../Calendar';
import VoiceCommands from './VoiceCommands';

function StudentDashboard() {
  // --- To-do List State and Handlers ---
  const [todos, setTodos] = useState([
    // Example initial tasks (can be empty)
    // { text: 'Finish Math Assignment', done: false },
    // { text: 'Read Chapter 4', done: true },
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


  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [user, setUser] = useState(null);

  // Placeholder lesson data
  // const [lessons] = useState([
  //   { title: 'Introduction to Algebra', subject: 'Mathematics', teacher: 'Mr. Santos', status: 'Completed', description: 'A beginner-friendly introduction to basic algebraic concepts and problem-solving.' },
  //   { title: 'World History: Chapter 3', subject: 'History', teacher: 'Ms. Reyes', status: 'In Progress', description: 'Exploring early civilizations and their impact on the modern world.' },
  //   { title: 'Basic Chemistry', subject: 'Science', teacher: 'Mr. Cruz', status: 'Not Started', description: 'Learn about atoms, molecules, and the foundations of chemistry.' },
  //   { title: 'English Literature', subject: 'English', teacher: 'Ms. Garcia', status: 'Completed', description: 'Dive into classic and modern works of English literature.' },
  //   { title: 'Computer Fundamentals', subject: 'ICT', teacher: 'Mr. Lee', status: 'In Progress', description: 'Introduction to computers, hardware, and software basics.' },
  // ]);

  // Lesson modal state
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showLessonModal, setShowLessonModal] = useState(false);

  const handleViewLesson = (lesson) => {
    setSelectedLesson(lesson);
    setShowLessonModal(true);
  };

  const handleCloseLessonModal = () => {
    setShowLessonModal(false);
    setSelectedLesson(null);
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

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { id: 'lesson', label: 'Lesson', icon: <FaBook /> },
    { id: 'assignment', label: 'Assignment', icon: <FaClipboardList /> },
    { id: 'chatbot', label: 'ChatBot', icon: <FaRobot /> },
    { id: 'badges', label: 'Badges', icon: <FaMedal /> },
    { id: 'calendar', label: 'Calendar', icon: <FaCalendarAlt /> }
  ];

  const handleVoiceCommand = (command) => {
    console.log('[StudentDashboard] Received voice command:', command);
    
    // Map of command IDs to menu IDs
    const commandMap = {
      'dashboard': 'dashboard',
      'lesson': 'lesson',
      'assignment': 'assignment',
      'chatbot': 'chatbot',
      'badges': 'badges',
      'calendar': 'calendar',
      'logout': 'logout'
    };

    const menuId = commandMap[command];
    
    if (command === 'logout') {
      console.log('[StudentDashboard] Executing logout.');
      handleLogout();
    } else if (menuId) {
      console.log('[StudentDashboard] Setting active menu to:', menuId);
      setActiveMenu(menuId);
      // Add visual feedback that the command was recognized
      const menuElement = document.getElementById(`menu-${menuId}`);
      if (menuElement) {
        menuElement.style.transition = 'background-color 0.3s';
        const originalBackground = menuElement.style.backgroundColor;
        menuElement.style.backgroundColor = '#4b3fa7';
        setTimeout(() => {
          menuElement.style.backgroundColor = originalBackground;
        }, 1000);
      }
    } else {
      console.log('[StudentDashboard] Unknown command:', command);
    }
  };

  return (
    <div className="admin-container">
      {/* Toggle Button */}
      <button className="menu-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          {/* {isSidebarOpen && <h3>Historia: AI</h3>} */}
        </div>
        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              id={`menu-${item.id}`}
              className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => setActiveMenu(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              {isSidebarOpen && <span className="menu-label">{item.label}</span>}
            </button>
          ))}
        </nav>
        <button className="logout-button" onClick={handleLogout}>
          <span className="menu-icon"><FaSignOutAlt /></span>
          {isSidebarOpen && <span className="menu-label">Logout</span>}
        </button>
      </div>
      {/* Main Content */}
      <main className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
        <div className="content-wrapper" style={{fontFamily: 'Poppins, Inter, Arial, sans-serif', background: 'linear-gradient(135deg, #f6f7fb 0%, #e4e6fa 100%)', minHeight: '100vh', padding: '32px 0'}}>
          {activeMenu === 'dashboard' && (
            <>
              <div className="page-header" style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 30,
                position: 'relative',
                background: '#fff',
                borderRadius: 14,
                boxShadow: '0 4px 18px #0001',
                padding: '24px 32px 20px 32px',
                minHeight: 64,
                maxWidth: '100%',
              }}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                  <h1 style={{fontWeight: 700, color: '#2d2a4a', fontSize: '2.1rem', margin: 0}}>Dashboard</h1>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: 'auto'}}>
                  <div style={{color: '#4b3fa7', fontWeight: 400, fontSize: '1.25rem', letterSpacing: 1.8, marginBottom: 10}}>
                    {phDate} | {phTime}
                  </div>
                  <div style={{fontSize: '1.2rem', color: '#4b3fa7', fontWeight: 500}}>
                    Welcome back{user && user.username ? `, ${user.username}` : ', Student'}!
                  </div>
                </div>
              </div>

              {/* Learning Adventure Banner */}
              <div style={{
                background: 'linear-gradient(to right, #f0f4ff, #e6f0ff)',
                borderRadius: '16px',
                padding: '24px 32px',
                marginBottom: '30px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                backgroundImage: 'url("https://readdy.ai/api/search-image?query=Colorful%20educational%20background%20with%20cartoon%20children%20characters%20learning%20and%20playing%20with%20books%2C%20numbers%2C%20and%20science%20elements.%20Bright%2C%20cheerful%20design%20with%20blue%20gradient%20on%20the%20left%20side%20fading%20into%20illustrated%20learning%20elements%20on%20the%20right&width=1200&height=400&seq=6&orientation=landscape")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '200px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'relative',
                  zIndex: 2,
                  maxWidth: '50%'
                }}>
                  <h2 style={{
                    fontWeight: 700,
                    color: '#ffffff',
                    fontSize: '2rem',
                    margin: '0 0 10px 0',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>Start Your Learning Adventure</h2>
                  <p style={{
                    color: '#ffffff',
                    fontSize: '1.1rem',
                    maxWidth: '500px',
                    margin: '0 0 20px 0',
                    textShadow: '0 1px 3px rgba(0,0,0,0.2)'
                  }}>Explore exciting subjects, play fun games, and discover new things every day!</p>
                  <button 
                    onClick={() => setActiveMenu('lesson')}
                    style={{
                    background: '#FFD600',
                    color: '#2d2a4a',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease'
                  }}>Let's Start Learning!</button>
                </div>
              </div>

              {/* My Subjects Section */}
              <div style={{marginBottom: '30px'}}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <h2 style={{
                    fontWeight: '700',
                    color: '#2d2a4a',
                    fontSize: '1.5rem',
                    margin: 0
                  }}>My Subjects</h2>
                  <a href="#" style={{
                    color: '#4b3fa7',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    View All <FaChevronRight style={{marginLeft: '5px', fontSize: '0.8rem'}} />
                  </a>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '20px',
                  flexWrap: 'wrap'
                }}>
                  {/* Math Subject Card */}
                  <div style={{
                    background: '#fff',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    width: 'calc(33.333% - 14px)',
                    minWidth: '300px',
                    flex: '1',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                  }}>
                    <div style={{
                      background: '#4361EE',
                      color: '#fff',
                      padding: '24px 28px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <h3 style={{margin: 0, fontWeight: '600', fontSize: '1.5rem'}}>Math</h3>
                      <div style={{
                        width: '45px',
                        height: '45px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <span style={{fontSize: '1.6rem'}}>&#x1F4C8;</span>
                      </div>
                    </div>
                    <div style={{padding: '24px 28px'}}>
                      <p style={{margin: '0 0 24px 0', fontSize: '1.1rem', color: '#4b5563'}}>Learn numbers, shapes, and basic calculations</p>
                      <div style={{
                        height: '12px',
                        background: '#e5e7eb',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        marginBottom: '18px'
                      }}>
                        <div style={{
                          height: '100%',
                          width: '65%',
                          background: '#4361EE',
                          borderRadius: '6px'
                        }}></div>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{fontSize: '1rem', color: '#6b7280'}}>65% Complete</span>
                        <button style={{
                          background: '#4361EE',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '12px 24px',
                          fontSize: '1rem',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}>Continue</button>
                      </div>
                    </div>
                  </div>

                  {/* Reading Subject Card */}
                  <div style={{
                    background: '#fff',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    width: 'calc(33.333% - 14px)',
                    minWidth: '300px',
                    flex: '1',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                  }}>
                    <div style={{
                      background: '#F72585',
                      color: '#fff',
                      padding: '24px 28px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <h3 style={{margin: 0, fontWeight: '600', fontSize: '1.5rem'}}>Reading</h3>
                      <div style={{
                        width: '45px',
                        height: '45px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <span style={{fontSize: '1.6rem'}}>&#x1F4D6;</span>
                      </div>
                    </div>
                    <div style={{padding: '24px 28px'}}>
                      <p style={{margin: '0 0 24px 0', fontSize: '1.1rem', color: '#4b5563'}}>Improve reading skills with fun stories</p>
                      <div style={{
                        height: '12px',
                        background: '#e5e7eb',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        marginBottom: '18px'
                      }}>
                        <div style={{
                          height: '100%',
                          width: '80%',
                          background: '#F72585',
                          borderRadius: '6px'
                        }}></div>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{fontSize: '1rem', color: '#6b7280'}}>80% Complete</span>
                        <button style={{
                          background: '#F72585',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '12px 24px',
                          fontSize: '1rem',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}>Continue</button>
                      </div>
                    </div>
                  </div>

                  {/* Science Subject Card */}
                  <div style={{
                    background: '#fff',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    width: 'calc(33.333% - 14px)',
                    minWidth: '300px',
                    flex: '1',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                  }}>
                    <div style={{
                      background: '#4CC9F0',
                      color: '#fff',
                      padding: '24px 28px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <h3 style={{margin: 0, fontWeight: '600', fontSize: '1.5rem'}}>Science</h3>
                      <div style={{
                        width: '45px',
                        height: '45px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <span style={{fontSize: '1.6rem'}}>&#x1F9EA;</span>
                      </div>
                    </div>
                    <div style={{padding: '24px 28px'}}>
                      <p style={{margin: '0 0 24px 0', fontSize: '1.1rem', color: '#4b5563'}}>Discover the world around you through experiments</p>
                      <div style={{
                        height: '12px',
                        background: '#e5e7eb',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        marginBottom: '18px'
                      }}>
                        <div style={{
                          height: '100%',
                          width: '40%',
                          background: '#4CC9F0',
                          borderRadius: '6px'
                        }}></div>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{fontSize: '1rem', color: '#6b7280'}}>40% Complete</span>
                        <button style={{
                          background: '#4CC9F0',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '12px 24px',
                          fontSize: '1rem',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}>Continue</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second Row of Subject Cards */}
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  flexWrap: 'wrap',
                  marginTop: '20px'
                }}>
                  {/* Art Subject Card */}
                  <div style={{
                    background: '#fff',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    width: 'calc(33.333% - 14px)',
                    minWidth: '300px',
                    flex: '1',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                  }}>
                    <div style={{
                      background: '#9D4EDD',
                      color: '#fff',
                      padding: '24px 28px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <h3 style={{margin: 0, fontWeight: '600', fontSize: '1.5rem'}}>Art</h3>
                      <div style={{
                        width: '45px',
                        height: '45px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <span style={{fontSize: '1.6rem'}}>&#x1F3A8;</span>
                      </div>
                    </div>
                    <div style={{padding: '24px 28px'}}>
                      <p style={{margin: '0 0 24px 0', fontSize: '1.1rem', color: '#4b5563'}}>Express yourself through drawing and crafts</p>
                      <div style={{
                        height: '12px',
                        background: '#e5e7eb',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        marginBottom: '18px'
                      }}>
                        <div style={{
                          height: '100%',
                          width: '90%',
                          background: '#9D4EDD',
                          borderRadius: '6px'
                        }}></div>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{fontSize: '1rem', color: '#6b7280'}}>90% Complete</span>
                        <button style={{
                          background: '#9D4EDD',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '12px 24px',
                          fontSize: '1rem',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}>Continue</button>
                      </div>
                    </div>
                  </div>

                  {/* Music Subject Card */}
                  <div style={{
                    background: '#fff',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    width: 'calc(33.333% - 14px)',
                    minWidth: '300px',
                    flex: '1',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                  }}>
                    <div style={{
                      background: '#FFB703',
                      color: '#fff',
                      padding: '24px 28px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <h3 style={{margin: 0, fontWeight: '600', fontSize: '1.5rem'}}>Music</h3>
                      <div style={{
                        width: '45px',
                        height: '45px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <span style={{fontSize: '1.6rem'}}>&#x1F3B5;</span>
                      </div>
                    </div>
                    <div style={{padding: '24px 28px'}}>
                      <p style={{margin: '0 0 24px 0', fontSize: '1.1rem', color: '#4b5563'}}>Learn about sounds, instruments and songs</p>
                      <div style={{
                        height: '12px',
                        background: '#e5e7eb',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        marginBottom: '18px'
                      }}>
                        <div style={{
                          height: '100%',
                          width: '30%',
                          background: '#FFB703',
                          borderRadius: '6px'
                        }}></div>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{fontSize: '1rem', color: '#6b7280'}}>30% Complete</span>
                        <button style={{
                          background: '#FFB703',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '12px 24px',
                          fontSize: '1rem',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}>Continue</button>
                      </div>
                    </div>
                  </div>

                  {/* History Subject Card */}
                  <div style={{
                    background: '#fff',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    width: 'calc(33.333% - 14px)',
                    minWidth: '300px',
                    flex: '1',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                  }}>
                    <div style={{
                      background: '#FB8500',
                      color: '#fff',
                      padding: '24px 28px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <h3 style={{margin: 0, fontWeight: '600', fontSize: '1.5rem'}}>History</h3>
                      <div style={{
                        width: '45px',
                        height: '45px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <span style={{fontSize: '1.6rem'}}>&#x1F3DB;</span>
                      </div>
                    </div>
                    <div style={{padding: '24px 28px'}}>
                      <p style={{margin: '0 0 24px 0', fontSize: '1.1rem', color: '#4b5563'}}>Travel back in time to learn about the past</p>
                      <div style={{
                        height: '12px',
                        background: '#e5e7eb',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        marginBottom: '18px'
                      }}>
                        <div style={{
                          height: '100%',
                          width: '55%',
                          background: '#FB8500',
                          borderRadius: '6px'
                        }}></div>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{fontSize: '1rem', color: '#6b7280'}}>55% Complete</span>
                        <button style={{
                          background: '#FB8500',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '12px 24px',
                          fontSize: '1rem',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}>Continue</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{display: 'flex', gap: '40px', marginBottom: 36, flexWrap: 'wrap'}}>
                {/* Fun Learning Games Section */}
                <div style={{width: '100%', marginBottom: '30px'}}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                  }}>
                    <h2 style={{
                      fontWeight: '700',
                      color: '#2d2a4a',
                      fontSize: '1.5rem',
                      margin: 0
                    }}>Fun Learning Games</h2>
                    <a href="#" style={{
                      color: '#4b3fa7',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      View All Games <FaChevronRight style={{marginLeft: '5px', fontSize: '0.8rem'}} />
                    </a>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '15px',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between'
                  }}>
                    {/* Number Blast Game */}
                    <div style={{
                      background: '#fff',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      width: 'calc(25% - 12px)',
                      minWidth: '250px',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                    }}>
                      <div style={{
                        height: '160px',
                        background: 'linear-gradient(45deg, #FF9FB1, #FB6F92)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        backgroundImage: 'url("https://readdy.ai/api/search-image?query=Colorful%20cartoon%20game%20interface%20with%20numbers%20and%20math%20symbols%2C%20featuring%20friendly%20animated%20characters%20helping%20with%20addition%20and%20subtraction%2C%20bright%20educational%20game%20design%20for%20children%20with%20playful%20elements%20and%20a%20clean%20background&width=200&height=150&seq=1&orientation=landscape")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}>
                        <span style={{display: 'none'}}>&#x1F522;</span>
                      </div>
                      <div style={{padding: '18px'}}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px'
                        }}>
                          <h3 style={{margin: 0, fontWeight: '600', fontSize: '1.2rem'}}>Number Blast</h3>
                          <span style={{color: '#4361EE', fontSize: '0.9rem', fontWeight: '500'}}>Math</span>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '15px'
                        }}>
                          <span style={{marginRight: '5px', fontSize: '0.9rem', color: '#6b7280'}}>Difficulty:</span>
                          <span style={{color: '#f59e0b', fontSize: '1.1rem'}}>&#x2605;&#x2605;</span><span style={{color: '#d1d5db', fontSize: '1.1rem'}}>&#x2606;</span>
                        </div>
                        <button style={{
                          width: '100%',
                          background: '#7209B7',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 0',
                          fontSize: '1rem',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}>Play Now</button>
                      </div>
                    </div>

                    {/* Word Explorer Game */}
                    <div style={{
                      background: '#fff',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      width: 'calc(25% - 12px)',
                      minWidth: '280px',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                    }}>
                      <div style={{
                        height: '160px',
                        background: 'linear-gradient(45deg, #B5DEFF, #4CC9F0)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundImage: 'url("https://readdy.ai/api/search-image?query=Cheerful%20cartoon-style%20educational%20game%20showing%20alphabet%20letters%20and%20simple%20words%20with%20cute%20animal%20characters%2C%20designed%20for%20early%20readers%20with%20colorful%20interactive%20elements%20on%20a%20light%20playful%20background&width=200&height=150&seq=2&orientation=landscape")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}>
                        <span style={{display: 'none'}}>&#x1F4DC;</span>
                      </div>
                      <div style={{padding: '18px'}}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px'
                        }}>
                          <h3 style={{margin: 0, fontWeight: '600', fontSize: '1.2rem'}}>Word Explorer</h3>
                          <span style={{color: '#F72585', fontSize: '0.9rem', fontWeight: '500'}}>Reading</span>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '15px'
                        }}>
                          <span style={{marginRight: '5px', fontSize: '0.9rem', color: '#6b7280'}}>Difficulty:</span>
                          <span style={{color: '#f59e0b', fontSize: '1.1rem'}}>&#x2605;&#x2605;</span><span style={{color: '#d1d5db', fontSize: '1.1rem'}}>&#x2606;</span>
                        </div>
                        <button style={{
                          width: '100%',
                          background: '#7209B7',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 0',
                          fontSize: '1rem',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}>Play Now</button>
                      </div>
                    </div>

                    {/* Science Lab Game */}
                    <div style={{
                      background: '#fff',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      width: 'calc(25% - 12px)',
                      minWidth: '280px',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                    }}>
                      <div style={{
                        height: '160px',
                        background: 'linear-gradient(45deg, #90E0EF, #00B4D8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundImage: 'url("https://readdy.ai/api/search-image?query=Vibrant%20cartoon%20science%20laboratory%20game%20scene%20with%20bubbling%20beakers%2C%20test%20tubes%2C%20and%20fun%20experiments%2C%20featuring%20child-friendly%20scientist%20characters%20and%20interactive%20elements%20on%20a%20clean%20colorful%20background&width=200&height=150&seq=3&orientation=landscape")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}>
                        <span style={{display: 'none'}}>&#x1F9EA;</span>
                      </div>
                      <div style={{padding: '18px'}}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px'
                        }}>
                          <h3 style={{margin: 0, fontWeight: '600', fontSize: '1.2rem'}}>Science Lab</h3>
                          <span style={{color: '#4CC9F0', fontSize: '0.9rem', fontWeight: '500'}}>Science</span>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '15px'
                        }}>
                          <span style={{marginRight: '5px', fontSize: '0.9rem', color: '#6b7280'}}>Difficulty:</span>
                          <span style={{color: '#f59e0b', fontSize: '1.1rem'}}>&#x2605;&#x2605;&#x2605;</span>
                        </div>
                        <button style={{
                          width: '100%',
                          background: '#7209B7',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 0',
                          fontSize: '1rem',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}>Play Now</button>
                      </div>
                    </div>

                    {/* Paint Party Game */}
                    <div style={{
                      background: '#fff',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      width: 'calc(25% - 12px)',
                      minWidth: '280px',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                    }}>
                      <div style={{
                        height: '160px',
                        background: 'linear-gradient(45deg, #C77DFF, #7B2CBF)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundImage: 'url("https://readdy.ai/api/search-image?query=Bright%20and%20colorful%20digital%20art%20studio%20game%20interface%20with%20paintbrushes%2C%20color%20palettes%2C%20and%20creative%20tools%2C%20featuring%20cartoon%20characters%20helping%20children%20create%20artwork%20on%20a%20cheerful%20background%20with%20artistic%20elements&width=200&height=150&seq=4&orientation=landscape")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}>
                        <span style={{display: 'none'}}>&#x1F3A8;</span>
                      </div>
                      <div style={{padding: '18px'}}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px'
                        }}>
                          <h3 style={{margin: 0, fontWeight: '600', fontSize: '1.2rem'}}>Paint Party</h3>
                          <span style={{color: '#C77DFF', fontSize: '0.9rem', fontWeight: '500'}}>Art</span>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '15px'
                        }}>
                          <span style={{marginRight: '5px', fontSize: '0.9rem', color: '#6b7280'}}>Difficulty:</span>
                          <span style={{color: '#f59e0b', fontSize: '1.1rem'}}>&#x2605;&#x2605;</span><span style={{color: '#d1d5db', fontSize: '1.1rem'}}>&#x2606;</span>
                        </div>
                        <button style={{
                          width: '100%',
                          background: '#7209B7',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 0',
                          fontSize: '1rem',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}>Play Now</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* My Achievements Section */}
                <div style={{width: '100%', marginBottom: '30px'}}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                  }}>
                    <h2 style={{
                      fontWeight: '700',
                      color: '#2d2a4a',
                      fontSize: '1.5rem',
                      margin: 0
                    }}>My Achievements</h2>
                    <a href="#" style={{
                      color: '#4b3fa7',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      View All Badges <FaChevronRight style={{marginLeft: '5px', fontSize: '0.8rem'}} />
                    </a>
                  </div>

                  <div style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '15px',
                      marginBottom: '20px',
                      justifyContent: 'space-around'
                    }}>
                      {/* Math Whiz Badge */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '120px',
                        background: '#f0f4ff',
                        borderRadius: '8px',
                        padding: '15px 10px'
                      }}>
                        <div style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          background: '#4361EE',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: '#fff',
                          fontSize: '1.8rem',
                          marginBottom: '10px'
                        }}>&#x1F3C6;</div>
                        <h4 style={{margin: '0 0 5px 0', fontSize: '0.9rem', fontWeight: '600', textAlign: 'center'}}>Math Whiz</h4>
                        <span style={{fontSize: '0.75rem', color: '#4361EE', fontWeight: '500'}}>Earned!</span>
                      </div>

                      {/* Reading Star Badge */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '120px',
                        background: '#f0f4ff',
                        borderRadius: '8px',
                        padding: '15px 10px'
                      }}>
                        <div style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          background: '#4361EE',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: '#fff',
                          fontSize: '1.8rem',
                          marginBottom: '10px'
                        }}>&#x2605;</div>
                        <h4 style={{margin: '0 0 5px 0', fontSize: '0.9rem', fontWeight: '600', textAlign: 'center'}}>Reading Star</h4>
                        <span style={{fontSize: '0.75rem', color: '#4361EE', fontWeight: '500'}}>Earned!</span>
                      </div>

                      {/* Science Explorer Badge */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '120px',
                        background: '#f0f4ff',
                        borderRadius: '8px',
                        padding: '15px 10px'
                      }}>
                        <div style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          background: '#d1d5db',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: '#fff',
                          fontSize: '1.8rem',
                          marginBottom: '10px'
                        }}>&#x2699;</div>
                        <h4 style={{margin: '0 0 5px 0', fontSize: '0.9rem', fontWeight: '600', textAlign: 'center'}}>Science Explorer</h4>
                        <span style={{fontSize: '0.75rem', color: '#6b7280', fontWeight: '500'}}>Not yet earned</span>
                      </div>

                      {/* Art Master Badge */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '120px',
                        background: '#f0f4ff',
                        borderRadius: '8px',
                        padding: '15px 10px'
                      }}>
                        <div style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          background: '#4361EE',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: '#fff',
                          fontSize: '1.8rem',
                          marginBottom: '10px'
                        }}>&#x1F3A8;</div>
                        <h4 style={{margin: '0 0 5px 0', fontSize: '0.9rem', fontWeight: '600', textAlign: 'center'}}>Art Master</h4>
                        <span style={{fontSize: '0.75rem', color: '#4361EE', fontWeight: '500'}}>Earned!</span>
                      </div>

                      {/* Perfect Attendance Badge */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '120px',
                        background: '#f0f4ff',
                        borderRadius: '8px',
                        padding: '15px 10px'
                      }}>
                        <div style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          background: '#4361EE',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: '#fff',
                          fontSize: '1.8rem',
                          marginBottom: '10px'
                        }}>&#x1F4C5;</div>
                        <h4 style={{margin: '0 0 5px 0', fontSize: '0.9rem', fontWeight: '600', textAlign: 'center'}}>Perfect Attendance</h4>
                        <span style={{fontSize: '0.75rem', color: '#4361EE', fontWeight: '500'}}>Earned!</span>
                      </div>

                      {/* Homework Hero Badge */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '120px',
                        background: '#f0f4ff',
                        borderRadius: '8px',
                        padding: '15px 10px'
                      }}>
                        <div style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          background: '#d1d5db',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: '#fff',
                          fontSize: '1.8rem',
                          marginBottom: '10px'
                        }}>&#x270D;</div>
                        <h4 style={{margin: '0 0 5px 0', fontSize: '0.9rem', fontWeight: '600', textAlign: 'center'}}>Homework Hero</h4>
                        <span style={{fontSize: '0.75rem', color: '#6b7280', fontWeight: '500'}}>Not yet earned</span>
                      </div>
                    </div>

                    {/* Current Challenges */}
                    <div style={{
                      background: '#fffbeb',
                      borderRadius: '8px',
                      padding: '15px 20px',
                      marginTop: '10px'
                    }}>
                      <h3 style={{margin: '0 0 15px 0', color: '#92400e', fontSize: '1rem'}}>Current Challenges</h3>
                      
                      {/* Math Games Challenge */}
                      <div style={{marginBottom: '15px'}}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '5px',
                          fontSize: '0.9rem'
                        }}>
                          <span>Complete 5 Math Games</span>
                          <span>3/5</span>
                        </div>
                        <div style={{
                          height: '8px',
                          background: '#fde68a',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            height: '100%',
                            width: '60%',
                            background: '#f59e0b',
                            borderRadius: '4px'
                          }}></div>
                        </div>
                      </div>
                      
                      {/* Reading Challenge */}
                      <div>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '5px',
                          fontSize: '0.9rem'
                        }}>
                          <span>Read 10 Stories</span>
                          <span>7/10</span>
                        </div>
                        <div style={{
                          height: '8px',
                          background: '#fde68a',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            height: '100%',
                            width: '70%',
                            background: '#f59e0b',
                            borderRadius: '4px'
                          }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* To-do (functional) */}
                <div style={{minWidth: 280, background: '#f8fafc', borderRadius: 18, boxShadow: '0 4px 24px #0001', padding: 0, overflow: 'hidden', border: '1.5px solid #e4e6fa'}}>
                  <div style={{background: '#f6f7fa', color: '#4b3fa7', fontWeight: 700, padding: '16px 24px', borderTopLeftRadius: 18, borderTopRightRadius: 18, fontSize: '1.2rem', letterSpacing: 1}}>
                    To-do List
                  </div>
                  <div style={{padding: 20, fontSize: 17, color: '#3b3e5b'}}>
                    <form onSubmit={handleAddTodo} style={{display: 'flex', gap: 8, marginBottom: 18}}>
                      <input
                        type="text"
                        value={newTodo}
                        onChange={e => setNewTodo(e.target.value)}
                        placeholder="Add a new task..."
                        style={{flex: 1, padding: '10px 14px', fontSize: 16, borderRadius: 8, border: '1.2px solid #d1d5fa', outline: 'none'}}
                      />
                      <button
                        type="submit"
                        style={{
                          background: '#4b3fa7',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: 44,
                          height: 44,
                          fontSize: 26,
                          fontWeight: 700,
                          boxShadow: '0 2px 10px #4b3fa733',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background 0.2s, box-shadow 0.2s',
                        }}
                        onMouseOver={e => e.currentTarget.style.background = '#2d2a4a'}
                        onMouseOut={e => e.currentTarget.style.background = '#4b3fa7'}
                        title="Add Task"
                      >+
                      </button>
                    </form>
                    <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                      {todos.length === 0 && <li style={{color: '#bbb', fontSize: 16}}>No tasks yet!</li>}
                      {todos.map((todo, idx) => (
                        <li
                          key={idx}
                          style={{
                            display: 'flex', alignItems: 'center', marginBottom: 16, fontSize: 19, minHeight: 38,
                            opacity: 1, transition: 'opacity 0.3s',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={todo.done}
                            onChange={() => handleToggleTodo(idx)}
                            style={{width: 22, height: 22, marginRight: 14, accentColor: '#4b3fa7', cursor: 'pointer'}}
                          />
                          {editIdx === idx ? (
                            <>
                              <input
                                value={editText}
                                autoFocus
                                onChange={handleEditChange}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') handleSaveEdit(idx);
                                  if (e.key === 'Escape') handleCancelEdit();
                                }}
                                style={{
                                  flex: 1, fontSize: 18, padding: '7px 10px', borderRadius: 7, border: '1.2px solid #b5baff', outline: 'none',
                                  marginRight: 8,
                                }}
                              />
                              <button
                                onClick={() => handleSaveEdit(idx)}
                                title="Save"
                                style={{
                                  background: '#27ae60',
                                  border: 'none',
                                  color: '#fff',
                                  fontSize: 22,
                                  cursor: 'pointer',
                                  marginRight: 6,
                                  borderRadius: '50%',
                                  width: 38,
                                  height: 38,
                                  boxShadow: '0 2px 8px #27ae6044',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'background 0.2s',
                                }}
                                onMouseOver={e => e.currentTarget.style.background = '#219150'}
                                onMouseOut={e => e.currentTarget.style.background = '#27ae60'}
                              >✔</button>
                              <button
                                onClick={handleCancelEdit}
                                title="Cancel"
                                style={{
                                  background: '#e67e22',
                                  border: 'none',
                                  color: '#fff',
                                  fontSize: 22,
                                  cursor: 'pointer',
                                  marginLeft: 2,
                                  borderRadius: '50%',
                                  width: 38,
                                  height: 38,
                                  boxShadow: '0 2px 8px #e67e2244',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'background 0.2s',
                                }}
                                onMouseOver={e => e.currentTarget.style.background = '#b55b14'}
                                onMouseOut={e => e.currentTarget.style.background = '#e67e22'}
                              >✕</button>
                            </>
                          ) : (
                            <>
                              <span style={{
                                flex: 1,
                                textDecoration: todo.done ? 'line-through' : 'none',
                                color: todo.done ? '#aaa' : '#2d2a4a',
                                fontWeight: todo.done ? 400 : 500,
                                fontSize: 18,
                                transition: 'color 0.2s',
                              }}>{todo.text}</span>
                              <button
                                onClick={() => handleStartEdit(idx)}
                                title="Edit"
                                style={{
                                  background: '#3498db',
                                  border: 'none',
                                  color: '#fff',
                                  fontSize: 22,
                                  cursor: 'pointer',
                                  marginLeft: 6,
                                  marginRight: 2,
                                  borderRadius: '50%',
                                  width: 38,
                                  height: 38,
                                  boxShadow: '0 2px 8px #3498db44',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'background 0.2s',
                                }}
                                onMouseOver={e => e.currentTarget.style.background = '#217dbb'}
                                onMouseOut={e => e.currentTarget.style.background = '#3498db'}
                              >✎</button>
                              <button
                                onClick={() => handleDeleteTodo(idx)}
                                title="Delete"
                                style={{
                                  background: '#e74c3c',
                                  border: 'none',
                                  color: '#fff',
                                  fontSize: 22,
                                  cursor: 'pointer',
                                  marginLeft: 2,
                                  borderRadius: '50%',
                                  width: 38,
                                  height: 38,
                                  boxShadow: '0 2px 8px #e74c3c44',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'background 0.2s',
                                }}
                                onMouseOver={e => e.currentTarget.style.background = '#b72a1c'}
                                onMouseOut={e => e.currentTarget.style.background = '#e74c3c'}
                              >✕</button>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              {/* Date/time directly below header */} 
              {/* <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end', margin: 8, marginBottom: 10, maxWidth: '100%'}}>
                <span style={{color: '#4b3fa7', fontWeight: 400, fontSize: '1.16rem', letterSpacing: 1.3}}>
                  {phDate} | {phTime}
                </span>
              </div> */}
            </>
          )}
          {/* Add placeholder for other menu sections */}
          {activeMenu === 'lesson' && <Lessons />}
          {activeMenu === 'assignment' && <Assignment />}
          {activeMenu === 'chatbot' && <ChatBot />}
          {activeMenu === 'badges' && <Badges />}
          {activeMenu === 'calendar' && <Calendar />}

          <div style={{color:'#5a6474', marginTop:'30px', textAlign:'center', padding:'15px', borderRadius:'5px', background:'#f8f9fa'}}>
            "The system is currently under development and not yet finalized. Some features may still be incomplete, and further testing and refinement are ongoing to ensure the best possible performance and user experience".
          </div>
        </div>
      </main>
      <VoiceCommands onCommand={handleVoiceCommand} />
    </div>
  );
}

export default StudentDashboard;
