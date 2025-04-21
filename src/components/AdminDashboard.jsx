// // AdminDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaHome, FaUsers, FaBook, FaChartBar, FaCog, FaSignOutAlt } from 'react-icons/fa';
// import './AdminDashboard.css';

// function AdminDashboard() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = () => {
//       const userData = JSON.parse(localStorage.getItem('user'));
//       if (!userData || userData.role !== 'admin') {
//         navigate('/');
//         return;
//       }
//       setUser(userData);
//       setIsLoading(false);
//     };

//     checkAuth();
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     navigate('/');
//   };

//   if (isLoading) {
//     return <div className="loading-spinner">Loading...</div>;
//   }

//   return (
//     <div className="dashboard-container">
//       {/* Sidebar */}
//       <div className="dashboard-sidebar">
//         <div className="sidebar-header">
//           <img src="/logo.png" alt="Logo" className="sidebar-logo" />
//           <h3>Historia: AI</h3>
//         </div>
        
//         <nav className="sidebar-nav">
//           <button 
//             className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
//             onClick={() => setActiveTab('overview')}
//           >
//             <FaHome /> Overview
//           </button>
          
//           <button 
//             className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
//             onClick={() => setActiveTab('users')}
//           >
//             <FaUsers /> Users
//           </button>
          
//           <button 
//             className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
//             onClick={() => setActiveTab('courses')}
//           >
//             <FaBook /> Courses
//           </button>
          
//           <button 
//             className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
//             onClick={() => setActiveTab('analytics')}
//           >
//             <FaChartBar /> Analytics
//           </button>
          
//           <button 
//             className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
//             onClick={() => setActiveTab('settings')}
//           >
//             <FaCog /> Settings
//           </button>
//         </nav>

//         <button className="logout-btn" onClick={handleLogout}>
//           <FaSignOutAlt /> Logout
//         </button>
//       </div>

//       {/* Main Content */}
//       <div className="dashboard-main">
//         <header className="dashboard-header">
//           <div className="header-title">
//             <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
//           </div>
//           <div className="header-user">
//             <span>Welcome, {user?.username}</span>
//           </div>
//         </header>

//         <div className="dashboard-content">
//           {activeTab === 'overview' && (
//             <div className="overview-grid">
//               <div className="stat-card">
//                 <h3>Total Users</h3>
//                 <p className="stat-number">1,234</p>
//                 <p className="stat-label">Active users</p>
//               </div>
              
//               <div className="stat-card">
//                 <h3>Courses</h3>
//                 <p className="stat-number">42</p>
//                 <p className="stat-label">Available courses</p>
//               </div>
              
//               <div className="stat-card">
//                 <h3>Active Sessions</h3>
//                 <p className="stat-number">89</p>
//                 <p className="stat-label">Current users</p>
//               </div>
              
//               <div className="stat-card">
//                 <h3>Total Revenue</h3>
//                 <p className="stat-number">$12,345</p>
//                 <p className="stat-label">This month</p>
//               </div>
//             </div>
//           )}

//           {/* Add other tab contents here */}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;




// AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBars, 
  FaBook, 
  FaUsers, 
  FaChartLine, 
  FaSignOutAlt,
  FaTachometerAlt,
  FaUpload,
  FaUserGraduate,
  FaCalendarAlt
} from 'react-icons/fa';
import Calendar from './Calendar';
import { UserList } from './UserManagement/UserList';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('calendar');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || userData.role !== 'admin') {
        navigate('/');
        return;
      }
      setUser(userData);
      setIsLoading(false);
    };

    checkAuth();
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
    { id: 'calendar', label: 'Calendar', icon: <FaCalendarAlt /> },
    { id: 'manage-users', label: 'Manage Users', icon: <FaUsers /> },
    { id: 'manage-subjects', label: 'Manage Subjects', icon: <FaBook /> },
    { id: 'upload-lessons', label: 'Upload Lessons', icon: <FaUpload /> },
    { id: 'monitor-activity', label: 'Monitor Activity', icon: <FaUserGraduate /> },
    { id: 'analytics', label: 'Analytics', icon: <FaChartLine /> },
  ];

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="admin-container">
      {/* Toggle Button */}
      <button className="menu-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          {/* <img src="/logo.png" alt="Logo" className="sidebar-logo" /> */}
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
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>Total Users</h3>
                <div className="stat-value">14</div>
              </div>
              <div className="stat-card">
                <h3>Total Subjects</h3>
                <div className="stat-value">5</div>
              </div>
              <div className="stat-card">
                <h3>Reports</h3>
                <div className="stat-value">19</div>
              </div>
            </div>
          )}

          {activeMenu === 'calendar' && (
            <Calendar />
          )}

          {activeMenu === 'manage-users' && (
            <div className="section-content">
              <UserList />
            </div>
          )}

          {/* Add other section contents */}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;