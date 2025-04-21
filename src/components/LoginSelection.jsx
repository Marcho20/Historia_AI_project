// LoginSelction.jsx


import React from 'react';
import { FaUserShield, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa'; // Import role-specific icons
import bereanLogo from "../assets/logo1.jpg";
import './LoginSelection.css';

function LoginSelection({ onSelectRole }) {
  return (
    <div className="modal-content">
      <div className="login-split-container">
        <div className="login-split-left">
          <img src={bereanLogo} alt="Berean Logo" className="berean-logo" />
        </div>
        <div className="login-split-right">
          <h2 className="selection-title">Select Login Type</h2>
          <div className="login-options">
            <div className="login-option" onClick={() => onSelectRole('admin')}>
              <div className="login-option-icon">
                <FaUserShield />
              </div>
              <div className="login-option-content">
                <h2>Admin Login</h2>
                <p>School administrators and staff</p>
              </div>
            </div>

            <div className="login-option" onClick={() => onSelectRole('teacher')}>
              <div className="login-option-icon">
                <FaChalkboardTeacher />
              </div>
              <div className="login-option-content">
                <h2>Teacher Login</h2>
                <p>Faculty and educators</p>
              </div>
            </div>

            <div className="login-option" onClick={() => onSelectRole('student')}>
              <div className="login-option-icon">
                <FaUserGraduate />
              </div>
              <div className="login-option-content">
                <h2>Student Login</h2>
                <p>Enrolled students</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginSelection;