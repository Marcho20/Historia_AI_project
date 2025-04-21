import React, { useState } from 'react';
import './RegistrationForm.css';

export const RegistrationForm = ({ onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    role: '',
  });
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({
      ...prev,
      role
    }));
  };

  const handleSendVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement email verification code sending
      // This would typically make an API call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      setStep(2);
    } catch (error) {
      console.error('Error sending verification code:', error);
      // Handle error (show notification, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement user registration
      // This would typically make an API call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      
      const newUser = {
        id: Date.now(),
        name: formData.fullName,
        email: formData.email,
        role: formData.role === 'teacher' ? 'Teacher' : 'Student',
        status: 'Active',
        createdOn: new Date().toLocaleString(),
        lastSeen: '-'
      };

      onUserAdded(newUser);
      onClose();
    } catch (error) {
      console.error('Error registering user:', error);
      // Handle error (show notification, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="registration-form">
        <h2>Add New Member</h2>
        <form onSubmit={handleSendVerification}>
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <div className="role-buttons">
              <button
                type="button"
                className={`role-button ${formData.role === 'teacher' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('teacher')}
              >
                Teacher
              </button>
              <button
                type="button"
                className={`role-button ${formData.role === 'student' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('student')}
              >
                Student
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={!formData.email || !formData.fullName || !formData.password || !formData.role || isLoading}
            >
              Send Verification Code
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="registration-form">
      <h2>Verify Email</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="verificationCode">Enter Verification Code</label>
          <input
            type="text"
            id="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter code sent to your email"
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={!verificationCode || isLoading}
          >
            Apply
          </button>
        </div>
      </form>
    </div>
  );
}; 