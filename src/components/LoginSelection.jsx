import React from 'react';
import { FaUserShield, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa'; // Import role-specific icons
import './LoginSelection.css';

function LoginSelection({ onSelectRole }) {
  return (
    <div className="login-selection-container">
      <h2 className="selection-title">Select Login Type</h2>
      <div className="login-options">
        <div className="login-option" onClick={() => onSelectRole('admin')}>
          <div className="option-icon">
            <FaUserShield size={40} />
          </div>
          <h3>Admin Login</h3>
          <p>School administrators and staff</p>
        </div>

        <div className="login-option" onClick={() => onSelectRole('teacher')}>
          <div className="option-icon">
            <FaChalkboardTeacher size={40} />
          </div>
          <h3>Teacher Login</h3>
          <p>Faculty and educators</p>
        </div>

        <div className="login-option" onClick={() => onSelectRole('student')}>
          <div className="option-icon">
            <FaUserGraduate size={40} />
          </div>
          <h3>Student Login</h3>
          <p>Enrolled students</p>
        </div>
      </div>
    </div>
  );
}

export default LoginSelection;