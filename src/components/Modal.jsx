import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { IoLockClosed, IoClose } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Modal.css";
import bereanLogo from "../assets/logo1.jpg";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Modal({ onClose }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // Sample user credentials (in a real app, this would come from a backend)
  const userCredentials = {
    admin: { username: 'admin', password: 'admin123' },
    teacher: { username: 'teacher', password: 'teacher123' },
    student: { username: 'student', password: 'student123' }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    // Check credentials against all user types
    if (formData.username === userCredentials.admin.username && 
        formData.password === userCredentials.admin.password) {
      handleSuccessfulLogin('admin');
    } else if (formData.username === userCredentials.teacher.username && 
               formData.password === userCredentials.teacher.password) {
      handleSuccessfulLogin('teacher');
    } else if (formData.username === userCredentials.student.username && 
               formData.password === userCredentials.student.password) {
      handleSuccessfulLogin('student');
    } else {
      toast.error('Invalid username or password');
    }
  };

  const handleSuccessfulLogin = (role) => {
    toast.success('Login successful!');
    localStorage.setItem('user', JSON.stringify({
      username: formData.username,
      role: role
    }));

    setTimeout(() => {
      onClose();
      navigate(`/${role}-dashboard`);
    }, 1500);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          <IoClose size={24} />
        </button>
        <div className="login-container">
          <div className="login-left">
            <img src={bereanLogo} alt="Historia AI Logo" className="login-logo" />
          </div>
          <div className="login-right">
            <h2 className="login-title">Login Form</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <span className="input-group-text">
                  <FaUser className="input-icon" />
                </span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter admin username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <span className="input-group-text">
                  <IoLockClosed className="input-icon" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter your Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaEye className="password-icon" />
                  ) : (
                    <FaEyeSlash className="password-icon" />
                  )}
                </button>
              </div>
              <button type="submit" className="btn-signin">
                Sign In
              </button>
              <div className="forgot-password">
                <a href="#">Forgot your password? <span>Click here</span></a>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}

export default Modal;