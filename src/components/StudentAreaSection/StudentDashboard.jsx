import React, { useState, useEffect } from 'react';
import {
  FaBars,
  FaTachometerAlt,
  FaBook,
  FaClipboardList,
  FaRobot,
  FaMedal,
  FaCalendarAlt,
  FaSignOutAlt
} from 'react-icons/fa';
import '../TeacherSection/../AdminDashboard.css'; // Reuse admin/teacher sidebar styles
import Lessons from './Lessons';
import Assignment from './Assignment';
import ChatBot from './ChatBot';
import Badges from './Badges';
import Calendar from '../Calendar';

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
    { id: 'assignmnt', label: 'Assignmnt', icon: <FaClipboardList /> },
    { id: 'chatbot', label: 'ChatBot', icon: <FaRobot /> },
    { id: 'badges', label: 'Badges', icon: <FaMedal /> },
    { id: 'calendar', label: 'Calendar', icon: <FaCalendarAlt /> }
  ];

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
                marginBottom: 42,
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
                  <div style={{color: '#4b3fa7', fontWeight: 400, fontSize: '1.25rem', letterSpacing: 1.8, marginBottom: 40}}>
                    {phDate} | {phTime}
                  </div>
                  <div style={{fontSize: '1.2rem', color: '#4b3fa7', fontWeight: 500}}>
                    Welcome back{user && user.username ? `, ${user.username}` : ', Student'}!
                  </div>
                </div>
              </div>
              <div style={{display: 'flex', gap: '40px', marginBottom: 36, flexWrap: 'wrap'}}>
                {/* Recent Activity */}
                <div style={{minWidth: 280, background: '#f8fafc', borderRadius: 18, boxShadow: '0 4px 24px #0001', padding: 0, overflow: 'hidden', border: '1.5px solid #e4e6fa'}}>
                  <div style={{background: 'linear-gradient(90deg, #4b3fa7 0%, #7c8aff 100%)', color: 'white', fontWeight: 600, padding: '12px 20px', borderTopLeftRadius: 18, borderTopRightRadius: 18, fontSize: '1.05rem', letterSpacing: 1}}>
                    <span style={{marginRight: 8}}>&#x2611;</span> Recent
                  </div>
                  <div style={{padding: 18}}>
                    <div style={{fontWeight: 600, color: '#2d2a4a', fontSize: 16}}>Activity</div>
                    <div style={{fontSize: 15, marginTop: 10, color: '#3b3e5b'}}>
                      Checked in for Discrete Math<br/>
                      <span style={{color: '#4b3fa7'}}>Today, 10:30 AM</span><br/>
                      Completed Biometric Registration<br/>
                      <span style={{color: '#4b3fa7'}}>Today, 10:00 AM</span><br/>
                      Requested Leave for Circuit Theory<br/>
                      <span style={{color: '#4b3fa7'}}>Yesterday, 01:00 PM</span>
                    </div>
                  </div>
                </div>
                {/* Awards */}
                <div style={{minWidth: 280, background: '#f8fafc', borderRadius: 18, boxShadow: '0 4px 24px #0001', padding: 0, overflow: 'hidden', border: '1.5px solid #e4e6fa'}}>
                  <div style={{background: 'linear-gradient(90deg, #0c9baf 0%, #7c8aff 100%)', color: 'white', fontWeight: 600, padding: '12px 20px', borderTopLeftRadius: 18, borderTopRightRadius: 18, fontSize: '1.05rem', letterSpacing: 1}}>
                    Awards <span style={{marginLeft: 8, background: '#fff2', color: 'white', borderRadius: 8, padding: '2px 8px', fontSize: 12}}>7</span>
                  </div>
                  <div style={{padding: 18, fontSize: 15, color: '#3b3e5b'}}>
                    <div>Avid Reader: Iron</div>
                    <div style={{color: '#888'}}>Philippine Popular Culture - SY232...</div>
                    <div>Avid Reader: Challenger</div>
                    <div style={{color: '#888'}}>Philippine Popular Culture - SY232...</div>
                    <div>Avid Reader: Silver</div>
                    <div style={{color: '#888'}}>Philippine Popular Culture - SY232...</div>
                    <div>Avid Reader: Bronze</div>
                    <div style={{color: '#888'}}>Philippine Popular Culture - SY232...</div>
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
          {activeMenu === 'assignmnt' && <Assignment />}
          {activeMenu === 'chatbot' && <ChatBot />}
          {activeMenu === 'badges' && <Badges />}
          {activeMenu === 'calendar' && <Calendar />}


        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
