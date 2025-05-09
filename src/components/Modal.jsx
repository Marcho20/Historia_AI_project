import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { IoLockClosed, IoClose } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Modal.css";
import historiaAILogo from "../assets/HISTORIA-AI_page-0001.jpg";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginWithEmailAndPassword, getUserByUID, updateUserLastSeen } from "../firebase/firebase";

function Modal({ onClose }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // We'll use Firebase authentication now instead of hardcoded credentials

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      // Use Firebase authentication
      const user = await loginWithEmailAndPassword(formData.username, formData.password);
      
      // Get user data from Firestore
      const userData = await getUserByUID(user.uid);
      
      if (!userData) {
        toast.error('User account not found');
        return;
      }
      
      // Update last seen timestamp
      await updateUserLastSeen(user.uid);
      
      // Login success - determine role from Firestore data
      handleSuccessfulLogin(userData.role.toLowerCase());
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid email or password');
    }
  };

  const handleSuccessfulLogin = (role) => {
    toast.success('Login successful!');
    localStorage.setItem('user', JSON.stringify({
      email: formData.username,
      role: role
    }));

    setTimeout(() => {
      onClose();
      
      // Navigate to the appropriate dashboard based on role
      // Convert role to lowercase for case-insensitive comparison
      const roleLower = role.toLowerCase();
      console.log('User role:', role, 'Lower case:', roleLower);
      
      if (roleLower === 'enterprise admin' || roleLower === 'admin') {
        navigate('/admin-dashboard');
      } else if (roleLower === 'teacher') {
        navigate('/teacher-dashboard');
      } else if (roleLower === 'student' || roleLower === 'studio user') {
        navigate('/student-dashboard');
      } else {
        // Default fallback
        console.log('No matching role found, using default dashboard');
        navigate('/dashboard');
      }
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
            <img src={historiaAILogo} alt="Historia AI Logo" className="login-logo-full" />
          </div>
          <div className="login-right">
            <h2 className="login-title">Login Form</h2>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <span className="input-group-text">
                  <FaUser className="input-icon" />
                </span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter your email"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  autoComplete="username"
                />
              </div>
              <div className="input-group password-group">
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
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
            </form>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}

export default Modal;