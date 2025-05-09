import React, { useState, useEffect } from 'react';
import { StudentActivityTracker } from '../StudentAreaSection';
import { useNavigate } from 'react-router-dom';

import {
  FaBars,
  FaTachometerAlt,
  FaUserGraduate,
  FaBook,
  FaCalendarAlt,
  FaSignOutAlt
} from 'react-icons/fa';
import ScheduleModal from '../ScheduleModal';
import ScheduleEditModal from '../ScheduleEditModal';
import './TeachearDashboard.css';
import Calendar from '../Calendar';
import MyLessons from './MyLessons';
import ManageActivity from '../ManageActivity/ManageActivity';

function TeacherDashboard() {

  // --- To-do List State & Handlers ---
  const [todos, setTodos] = useState([
    { id: 1, text: "Prepare lesson plans for next week", done: false },
    { id: 2, text: "Grade student assignments", done: false },
    { id: 3, text: "Schedule parent-teacher meetings", done: false },
  ]);
  const [todoInput, setTodoInput] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [todoEditText, setTodoEditText] = useState("");

  function handleTodoAdd(e) {
    e.preventDefault();
    const val = todoInput.trim();
    if (!val) return;
    setTodos(prev => [...prev, { id: Date.now(), text: val, done: false }]);
    setTodoInput("");
  }
  function handleTodoToggle(id) {
    setTodos(todos => todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }
  function handleTodoEditStart(todo) {
    setEditingTodoId(todo.id);
    setTodoEditText(todo.text);
  }
  function handleTodoEditSave(id) {
    setTodos(todos => todos.map(t => t.id === id ? { ...t, text: todoEditText.trim() || t.text } : t));
    setEditingTodoId(null);
    setTodoEditText("");
  }
  function handleTodoDelete(id) {
    setTodos(todos => todos.filter(t => t.id !== id));
  }
  function handleTodoUncheckAll() {
    setTodos(todos => todos.map(t => ({ ...t, done: false })));
  }

  // Chart modal state and handlers for Students donut chart
  const [popoverGroup, setPopoverGroup] = useState(null); // 'Boys' or 'Girls' or null
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const boysCount = 6;
  const girlsCount = 3;

  function handleArcFocus(group, event) {
    const rect = event.target.getBoundingClientRect();
    setPopoverGroup(group);
    setPopoverPosition({
      x: rect.right + window.scrollX + 6, // 16px gap to the right
      y: rect.top + rect.height / 10 + window.scrollY // vertical center
    });
    
  }
  function handleArcBlur() {
    setPopoverGroup(null);
  }

  // Auto-close popover if mouse leaves chart area or popover
  const chartRef = React.useRef();
  useEffect(() => {
    if (!popoverGroup) return;
    function handleMouseMove(e) {
      if (!chartRef.current) return;
      const chart = chartRef.current;
      const popover = document.querySelector('.popover-group');
      if (
        !chart.contains(e.target) &&
        (!popover || !popover.contains(e.target))
      ) {
        setPopoverGroup(null);
      }
    }
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [popoverGroup]);

  // Close popover when clicking outside
  useEffect(() => {
    if (!popoverGroup) return;
    const handleClick = (e) => {
      if (!e.target.closest('.pie-chart-placeholder') && !e.target.closest('.popover-group')) {
        setPopoverGroup(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [popoverGroup]);

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  // >4 Calendar schedule  and handlers<
  const today = new Date().toISOString().split('T')[0];
  const [calendarEvents, setCalendarEvents] = useState([
    { id: 1, title: "Math Class", timeRange: "9:00AM-9:30AM", date: today },
    { id: 2, title: "Science Lab", timeRange: "1:00PM-2:30PM", date: today }
  ]);
  const [editingId, setEditingId] = useState(null);
  const [showScheduleEditModal, setShowScheduleEditModal] = useState(false);
  const [scheduleToEdit, setScheduleToEdit] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", time: "" });
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const handleAddClick = () => {
    setShowScheduleModal(true);
    setShowScheduleEditModal(false);
    setEditingId(null); // Prevent editing and adding at the same time
  };
  const handleAddSchedule = (scheduleItem) => {
    setCalendarEvents(events => [
      ...events,
      {
        id: Date.now(),
        title: scheduleItem.className,
        time: scheduleItem.timeRange,
        date: scheduleItem.date
      }
    ]);
    setShowScheduleModal(false);
  };
  
  const handleCloseScheduleModal = () => {
    setShowScheduleModal(false);
  };

  const handleCloseEditModal = () => {
    setShowScheduleEditModal(false);
    setScheduleToEdit(null);
  };
  
  const handleSaveEdit = (updatedSchedule) => {
    setCalendarEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === updatedSchedule.id ? updatedSchedule : event
      )
    );
  };
  function formatTime(t) {
    // "13:30" to "1:30PM"
    if (!t) return "";
    const [h, m] = t.split(":");
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${m}${ampm}`;
  }
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  const handleDelete = (id) => {
    setCalendarEvents(events => events.filter(event => event.id !== id));
  };
  function handleEditClick(event) {
    const id = parseInt(event.currentTarget.dataset.id);
    const scheduleItem = calendarEvents.find(item => item.id === id);
    if (scheduleItem) {
      setScheduleToEdit(scheduleItem);
      setShowScheduleEditModal(true);
      setShowScheduleModal(false);
    }
  };
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSave = (id) => {
    setCalendarEvents(events =>
      events.map(event =>
        event.id === id ? { ...event, ...editForm } : event
      )
    );
    setEditingId(null);
  };
  const handleEditCancel = () => setEditingId(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.role !== 'teacher') {
      navigate('/');
      return;
    }
    setUser(userData);
  }, [navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { id: 'student-area', label: 'Student Area', icon: <FaUserGraduate /> },
    { id: 'manage-activity', label: 'Manage Activity', icon: <FaUserGraduate /> },
    { id: 'my-lesson', label: 'My Lesson', icon: <FaBook /> },
    { id: 'calendar', label: 'Calendar', icon: <FaCalendarAlt /> }
  ];

  return (
    <div className="admin-container">
      {showScheduleModal && (
        <div className="modal-portal">
          <ScheduleModal 
            onClose={handleCloseScheduleModal} 
            onAddSchedule={handleAddSchedule} 
          />
        </div>
      )}
      {showScheduleEditModal && scheduleToEdit && (
        <ScheduleEditModal
          onClose={handleCloseEditModal}
          onSaveEdit={handleSaveEdit}
          scheduleToEdit={scheduleToEdit}
        />
      )}
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
        <div className="content-wrapper">
          {activeMenu === 'dashboard' && (
            <>
              {/* <div className="page-header">
                <h1>Teacher Dashboard</h1>
                <div className="user-welcome">Welcome, {user?.username}!</div>
              </div>
              <div className="dashboard-grid">
              </div> */}
            </>
          )}
          {activeMenu === 'student-area' && (
            <div className="section-content">
              <StudentActivityTracker />
            </div>
          )}
          {activeMenu === 'dashboard' && (
            <>
              <div className="page-header">
                <h1>Teacher Dashboard</h1>
                <div className="user-welcome">Welcome back Admin {user?.username}!</div>
              </div>
              <div className="dashboard-grid">
                {/* Total Students Card */}
                <div className="dashboard-card students-total">
                  <div className="card-header">
                    <span className="card-icon">👥</span>
                    <span className="card-title">Total of Students</span>
                  </div>
                  <div className="card-value">8</div>
                </div>

                {/* Activity Card */}
                <div className="dashboard-card activity">
                  <div className="card-header">
                    <span className="card-title">Activity</span>
                  </div>
                  <div className="card-body">
                    <div>more info <span className="info-arrow">→</span></div>
                  </div>
                </div>

                {/* Calendar Card */}
                <div className="dashboard-card calendar">
                  <div className="card-header">
                    <span className="card-icon"><FaCalendarAlt /></span>
                    <span className="card-title">Schedule</span>
                  </div>
                  <div className="card-body">
                    {calendarEvents.length === 0 && !showScheduleModal && (
                      <div style={{textAlign:'center', color:'#bbb', margin:'28px 0 18px 0', fontSize:'1.07rem'}}>
                        No schedules yet.<br/>
                        <button className="calendar-add-btn" onClick={handleAddClick} style={{marginTop:16}}>+ Add Schedule</button>
                      </div>
                    )}
                    {calendarEvents.length > 0 && (
                      <div className="schedule-list">
                        {calendarEvents.map(event => (
                          <div className="schedule-item" key={event.id}>
                            <div className="calendar-date-label" style={{fontSize:'1.04rem', color:'#6d28d9', fontWeight:600, marginBottom:2}}>
                              {formatDate(event.date)}
                            </div>
                            <div className="calendar-item">
                              <span className="calendar-class-title" style={{fontWeight:700, fontSize:'1.13rem', color:'#312e81', marginRight:7}}>{event.title}</span>
                              <span className="calendar-class-time" style={{fontWeight:600, fontSize:'1.11rem', color:'#444', marginRight:8}}>{event.timeRange || event.time}</span>
                              <span className="calendar-edit">
                                <span onClick={handleEditClick} data-id={event.id} style={{cursor:'pointer', fontSize:'1.15rem'}} title="Edit">✏️</span>
                                <span onClick={() => handleDelete(event.id)} style={{cursor:'pointer', marginLeft: 8, fontSize:'1.15rem'}} title="Delete">🗑️</span>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {calendarEvents.length > 0 && !showScheduleModal && (
                      <div style={{textAlign:'center', marginTop:18}}>
                        <button className="calendar-add-btn" onClick={handleAddClick}>+ Add Schedule</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Students Chart Card */}
                <div className="dashboard-card students-chart">
                  <div className="card-header">
                    <span className="card-icon">📊</span>
                    <span className="card-title">Students</span>
                  </div>
                  <div className="card-body">
                    <div
  className="pie-chart-placeholder"
  style={{ position: 'relative' }}
  ref={chartRef}
>
  <svg width="180" height="180" viewBox="0 0 180 180">
    {/* Boys arc */}
    <circle
      cx="90"
      cy="90"
      r="57"
      fill="none"
      stroke="#4e73df"
      strokeWidth="30"
      strokeDasharray="320 320"
      strokeDashoffset="0"
      style={{ cursor: "pointer", filter: "drop-shadow(0 4px 12px #4e73df55)" }}
      onMouseEnter={e => handleArcFocus('Boys', e)}
      onMouseLeave={handleArcBlur}
    />
    {/* Girls arc */}
    <circle
      cx="90"
      cy="90"
      r="57"
      fill="none"
      stroke="#ff6384"
      strokeWidth="30"
      strokeDasharray="320 320"
      strokeDashoffset="-219"
      style={{ cursor: "pointer", filter: "drop-shadow(0 4px 12px #ff638455)" }}
      onMouseEnter={e => handleArcFocus('Girls', e)}
      onMouseLeave={handleArcBlur}
    />
  </svg>
  <div className="chart-legend-row">
    <span className="legend-dot boys"></span>
    <span className="legend-label boys">Boys</span>
    <span className="legend-dot girls"></span>
    <span className="legend-label girls">Girls</span>
  </div>
  {popoverGroup && (
    <div
      className={`popover-group ${popoverGroup === 'Girls' ? 'girls' : 'boys'}`}
      style={{
        position: 'absolute',
        left: popoverPosition.x - chartRef.current?.getBoundingClientRect().left - 20 || 0,
        top: popoverPosition.y - chartRef.current?.getBoundingClientRect().top - 30 || 0,
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 6px 24px 0 #2222',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        zIndex: 10,
        minWidth: 90,
        transition: 'opacity 0.2s',
        pointerEvents: 'auto',
      }}
      onMouseLeave={handleArcBlur}
      onMouseEnter={() => {}}
    >
      <span className={`legend-dot ${popoverGroup === 'Girls' ? 'girls' : 'boys'}`} style={{ marginRight: 8 }}></span>
      <span style={{ fontWeight: 500, color: '#444', fontSize: '1.1rem', marginRight: 10 }}>{popoverGroup}</span>
      <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#222' }}>{popoverGroup === 'Girls' ? girlsCount : boysCount}</span>
    </div>
  )}
</div>
                  </div>
                </div>

                {/* Student List Card */}
                <div className="dashboard-card students-list">
                  <div className="card-header">
                    <span className="card-title">Student List</span>
                  </div>
                  <div className="card-body">
                    <table className="student-table">
                      <thead>
                        <tr><th>Name</th><th>Grade</th><th>Subject</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>Emma Thompson</td><td>Grade 2</td><td>Math</td></tr>
                        <tr><td>James Wilson</td><td>Grade 2</td><td>Science</td></tr>
                        <tr><td>Sophia Davis</td><td>Grade 2</td><td>English</td></tr>
                        <tr><td>Noah Martinez</td><td>Grade 2</td><td>Art</td></tr>
                      </tbody>
                    </table>
                    <div className="more-info-link">more info <span className="info-arrow">→</span></div>
                  </div>
                </div>

                {/* Modern To-do List Card */}
                <div className="dashboard-card todo-list">
                  <div className="card-header">
                    <span className="card-title">To-do List</span>
                  </div>
                  <div className="card-body">
                    <form className="todo-form" onSubmit={handleTodoAdd} style={{marginBottom:20}}>
                      <input
                        type="text"
                        className="todo-input-modern"
                        placeholder="What needs to be done?"
                        value={todoInput}
                        onChange={e => setTodoInput(e.target.value)}
                        autoComplete="off"
                      />
                      <button type="submit" className="todo-add-modern" title="Add Task">+</button>
                    </form>
                    <div className="todo-list-modern">
                      {todos.length === 0 && (
                        <div style={{color:'#bbb', textAlign:'center', margin:'18px 0'}}>No tasks yet.</div>
                      )}
                      {todos.map(todo => (
                        <div key={todo.id} className={`todo-item-modern${todo.done ? ' done' : ''}`}> 
                          <input
                            type="checkbox"
                            checked={todo.done}
                            onChange={() => handleTodoToggle(todo.id)}
                            className="todo-checkbox-modern"
                          />
                          {editingTodoId === todo.id ? (
                            <input
                              className="todo-edit-modern"
                              value={todoEditText}
                              onChange={e => setTodoEditText(e.target.value)}
                              onBlur={() => handleTodoEditSave(todo.id)}
                              onKeyDown={e => e.key === 'Enter' && handleTodoEditSave(todo.id)}
                              autoFocus
                            />
                          ) : (
                            <span className="todo-text-modern" onDoubleClick={() => handleTodoEditStart(todo)}>{todo.text}</span>
                          )}
                          <span className="todo-actions-modern">
                            <span className="todo-action-edit" title="Edit" onClick={() => handleTodoEditStart(todo)}>✏️</span>
                            <span className="todo-action-delete" title="Delete" onClick={() => handleTodoDelete(todo.id)}>🗑️</span>
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Progress Bar and Bulk Uncheck */}
                    <div className="todo-progress-row">
                      <div className="todo-progress-bar-bg">
                        <div className="todo-progress-bar" style={{width: `${Math.round((todos.filter(t=>t.done).length/todos.length||0)*100)}%`}}></div>
                      </div>
                      <div className="todo-progress-label">
                        {todos.filter(t=>t.done).length} of {todos.length} tasks done
                      </div>
                      {todos.some(t=>t.done) && (
                        <button className="todo-bulk-uncheck" onClick={handleTodoUncheckAll}>
                          Uncheck all ({todos.filter(t=>t.done).length})
                        </button>
                      )}
                    </div>
                  </div>
                </div>


                {/* My Lessons Card */}
                <div className="dashboard-card my-lessons">
                  <div className="card-header">
                    <span className="card-title">My Lessons</span>
                  </div>
                  <div className="card-body lessons-body">
                    <div className="lesson-icon">📑 ▶️</div>
                    <div className="more-info-link">more info <span className="info-arrow">→</span></div>
                  </div>
                </div>
              </div>
            </>
          )}
          {activeMenu === 'manage-activity' && (
            <div className="section-content">
              <ManageActivity />
            </div>
          )}
          {activeMenu === 'my-lesson' && (
            <div className="section-content">
              <MyLessons />
              <div style={{color:'#bbb', marginTop:'18px',color: '#5a6474' }}>"The system is currently under development and not yet finalized. Some features may still be incomplete, and further testing and refinement are ongoing to ensure the best possible performance and user experience".</div>
            </div>
          )}
          {activeMenu === 'calendar' && (
            <div className="section-content">
              <Calendar />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default TeacherDashboard;
