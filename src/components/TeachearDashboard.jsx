// TeacherDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css'; // You can reuse the same CSS

function TeacherDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  React.useEffect(() => {
    if (!user || user.role !== 'teacher') {
      navigate('/');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1>Teacher Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>
      <div className="dashboard-content">
        <h2>Welcome, {user?.username}!</h2>
        {/* Add teacher-specific content here */}
      </div>
    </div>
  );
}

export default TeacherDashboard;