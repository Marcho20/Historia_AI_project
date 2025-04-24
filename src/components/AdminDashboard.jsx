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
  FaCalendarAlt,
  FaPlus,
  FaTimes,
  FaPencilAlt,
  FaSquare,
  FaCheckSquare
} from 'react-icons/fa';
import Calendar from './Calendar';
import { UserList } from './UserManagement/UserList';
import { SubjectList } from './SubjectManagement/SubjectList';
import UploadLessons from './UploadLessons';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('calendar');
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

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

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { 
        id: Date.now(), 
        text: newTodo, 
        completed: false,
        isEditing: false 
      }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id, newText) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
    setEditingId(null);
    setEditText('');
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const removeChecked = () => {
    const hasCompletedTodos = todos.some(todo => todo.completed);
    if (hasCompletedTodos) {
      setTodos(todos.map(todo => ({
        ...todo,
        completed: false // Uncheck instead of removing
      })));
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

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
            <>
              <div className="page-header">
                <h1>Dashboard Overview</h1>
                <div className="user-welcome">Welcome back, {user?.username}</div>
              </div>
              <div className="dashboard-stats">
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaUsers />
                  </div>
                  <div className="stat-info">
                    <h3>Total Users</h3>
                    <div className="stat-value">14</div>
                    <div className="stat-label">Active members</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaBook />
                  </div>
                  <div className="stat-info">
                    <h3>Total Subjects</h3>
                    <div className="stat-value">5</div>
                    <div className="stat-label">Available courses</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaChartLine />
                  </div>
                  <div className="stat-info">
                    <h3>Reports</h3>
                    <div className="stat-value">19</div>
                    <div className="stat-label">This month</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaUserGraduate />
                  </div>
                  <div className="stat-info">
                    <h3>Active Students</h3>
                    <div className="stat-value">8</div>
                    <div className="stat-label">Learning now</div>
                  </div>
                </div>
              </div>

              <div className="dashboard-grid">
                <div className="dashboard-card recent-activity">
                  <h3>Recent Activity</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <div className="activity-icon"><FaUserGraduate /></div>
                      <div className="activity-details">
                        <div className="activity-title">New Student Enrolled</div>
                        <div className="activity-time">2 hours ago</div>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon"><FaBook /></div>
                      <div className="activity-details">
                        <div className="activity-title">New Course Added</div>
                        <div className="activity-time">5 hours ago</div>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon"><FaUsers /></div>
                      <div className="activity-details">
                        <div className="activity-title">Group Discussion Created</div>
                        <div className="activity-time">1 day ago</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dashboard-card modern-todo-section">
                  <h2 className="todo-title">TODOLIST</h2>
                  <div className="modern-todo-input-wrapper">
                    <div className="modern-todo-input-group">
                      <input
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="what needs to be done?"
                        className="modern-todo-input"
                        onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                      />
                      <button 
                        className="modern-todo-add-btn"
                        onClick={addTodo}
                        disabled={!newTodo.trim()}
                        aria-label="Add task"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  <div className="modern-todo-list">
                    {todos.map(todo => (
                      <div 
                        key={todo.id} 
                        className={`modern-todo-item ${todo.completed ? 'completed' : ''}`}
                      >
                        <div className="modern-todo-content">
                          <button 
                            className="modern-todo-checkbox"
                            onClick={() => toggleTodo(todo.id)}
                            aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                          >
                            {todo.completed ? <FaCheckSquare className="check-icon" /> : <FaSquare className="check-icon" />}
                          </button>
                          {editingId === todo.id ? (
                            <input
                              type="text"
                              className="modern-todo-edit-input"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onBlur={() => editTodo(todo.id, editText)}
                              onKeyPress={(e) => e.key === 'Enter' && editTodo(todo.id, editText)}
                              autoFocus
                            />
                          ) : (
                            <span className={`modern-todo-text ${todo.completed ? 'completed-text' : ''}`}>
                              {todo.text}
                            </span>
                          )}
                        </div>
                        <div className="modern-todo-actions">
                          <button 
                            className="modern-todo-edit"
                            onClick={() => startEditing(todo.id, todo.text)}
                            aria-label="Edit task"
                          >
                            <FaPencilAlt />
                          </button>
                          <button 
                            className="modern-todo-delete"
                            onClick={() => deleteTodo(todo.id)}
                            aria-label="Delete task"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {todos.length > 0 && (
                    <div className="modern-todo-footer">
                      <div className="modern-todo-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">
                          {completedCount} of {totalCount} tasks done
                        </span>
                      </div>
                      <button 
                        className="remove-checked-btn"
                        onClick={removeChecked}
                        disabled={completedCount === 0}
                      >
                        Uncheck all ({completedCount})
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeMenu === 'calendar' && (
            <Calendar />
          )}

          {activeMenu === 'manage-users' && (
            <div className="section-content">
              <UserList />
            </div>
          )}

          {activeMenu === 'manage-subjects' && (
            <div className="section-content">
              <SubjectList />
            </div>
          )}

          {/* Add other section contents */}
          {activeMenu === 'upload-lessons' && (
            <div className="section-content">
              <UploadLessons />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;