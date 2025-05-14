import React, { useState, useEffect } from 'react';
import './UserEdit.css';
import { updateUserRole, updateUserProfile } from '../../firebase/firebase';
import { toast } from 'react-toastify';

export const UserEdit = ({ user, onClose, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
    status: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || user.name || '',
        email: user.email || '',
        // Use sample password from the user list component
        password: user.id === 'demo-1' ? 'Password123' : 'Demo1234',
        role: user.role || '',
        status: user.status || 'Active'
      });
    }
  }, [user]);

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

  const handleStatusSelect = (status) => {
    setFormData(prev => ({
      ...prev,
      status
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update user role and profile
      await updateUserProfile(user.id, {
        fullName: formData.fullName,
        password: formData.password,
        role: formData.role,
        status: formData.status
      });
      
      // Create updated user object for UI
      const updatedUser = {
        ...user,
        fullName: formData.fullName,
        name: formData.fullName, // For compatibility
        password: formData.password,
        role: formData.role,
        status: formData.status
      };
      
      toast.success('User updated successfully!');
      
      // Update UI and close the modal
      if (onUserUpdated) onUserUpdated(updatedUser);
      if (onClose) onClose();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Update error: ' + (error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-edit-form">
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            disabled={true} // Email cannot be changed
            className="disabled-input"
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
            type="text"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>

        <div className="form-group">
          <label className="section-label">Role Selection</label>
          <div className="role-buttons">
            <button
              type="button"
              className={`role-button ${formData.role === 'Teacher' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('Teacher')}
            >
              Teacher
            </button>
            <button
              type="button"
              className={`role-button ${formData.role === 'Student' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('Student')}
            >
              Student
            </button>
            <button
              type="button"
              className={`role-button ${formData.role === 'Enterprise Admin' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('Enterprise Admin')}
            >
              Admin
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="section-label">Status Selection</label>
          <div className="status-buttons">
            <button
              type="button"
              className={`status-button ${formData.status === 'Active' ? 'active' : ''}`}
              onClick={() => handleStatusSelect('Active')}
            >
              <span className="button-text">Active</span>
            </button>
            <button
              type="button"
              className={`status-button ${formData.status === 'Pending Verification' ? 'active' : ''}`}
              onClick={() => handleStatusSelect('Pending Verification')}
            >
              <span className="button-text">Pending</span>
            </button>
            <button
              type="button"
              className={`status-button ${formData.status === 'Suspended' ? 'active' : ''}`}
              onClick={() => handleStatusSelect('Suspended')}
            >
              <span className="button-text">Suspended</span>
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
            disabled={!formData.fullName || !formData.role || isLoading}
          >
            {isLoading ? 'Updating...' : 'Update User'}
          </button>
        </div>
      </form>
    </div>
  );
};
