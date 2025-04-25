// TeacherDashboard.jsx
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './AdminDashboard.css';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBars,
  FaTachometerAlt,
  FaUserGraduate,
  FaBook,
  FaCalendarAlt,
  FaSignOutAlt
} from 'react-icons/fa';
import './AdminDashboard.css'; // Reuse admin styles

function TeacherDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');

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
    { id: 'manage-activity', label: 'Manage Activity', icon: <FaUserGraduate /> },
    { id: 'my-lesson', label: 'My Lesson', icon: <FaBook /> },
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
        <div className="content-wrapper">
          {activeMenu === 'dashboard' && (
            <>
              <div className="page-header">
                <h1>Teacher Dashboard</h1>
                <div className="user-welcome">Welcome, {user?.username}!</div>
              </div>
              {/* Dashboard content for teacher */}
            </>
          )}
          {activeMenu === 'manage-activity' && (
            <div className="section-content">
              {/* Manage Activity content */}
              <h2>Manage Activity</h2>
            </div>
          )}
          {activeMenu === 'my-lesson' && (
            <div className="section-content">
              {/* My Lesson content */}
              <h2>My Lesson</h2>
            </div>
          )}
          {activeMenu === 'calendar' && (
            <div className="section-content">
              {/* Calendar content */}
              <h2>Calendar</h2>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default TeacherDashboard;