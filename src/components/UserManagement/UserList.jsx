import React, { useState, useEffect } from 'react';
import './UserList.css';
import { RegistrationForm } from './RegistrationForm';
import { FiSearch } from 'react-icons/fi';
import { FiLock, FiUser, FiEdit, FiMoreVertical, FiTrash2 } from 'react-icons/fi';
import { getAllUsers, deleteUserById, subscribeToUsers } from '../../firebase/firebase';
import { UserEdit } from './UserEdit';
import { toast, ToastContainer } from 'react-toastify';

export const UserList = () => {
  const [users, setUsers] = useState([]);
  
  // Sample passwords for demo purposes
  const demoPasswords = {
    'demo-1': 'Password123',
    'default': 'Demo1234'
  };
  const [showAddUser, setShowAddUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null); // For confirmation dialog
  const [editingUser, setEditingUser] = useState(null); // For user editing


  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToUsers(usersSnapshot => {
      if (usersSnapshot.length === 0) {
        setUsers([
          {
            id: 'demo-1',
            fullName: 'Tarun',
            role: 'Enterprise Admin',
            email: 'tarun.dubey@wavemaker.com',
            status: 'Active',
            createdOn: '15 Dec 2016 11:33 AM',
            lastSeen: 'Just now'
          }
        ]);
      } else {
        setUsers(usersSnapshot);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddUser = () => {
    setShowAddUser(true);
  };

  const handleCloseAddUser = () => {
    setShowAddUser(false);
  };

  const handleUserAdded = (newUser) => {
    setUsers([...users, newUser]);
    setShowAddUser(false);
    toast.success(`User ${newUser.name || newUser.fullName} added successfully!`);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleCloseEditUser = () => {
    setEditingUser(null);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setEditingUser(null);
    toast.success(`User ${updatedUser.name || updatedUser.fullName} updated successfully!`);
  };

  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || user.fullName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Delete user logic
  const handleDeleteUser = async (userId, userNameOrEmail) => {
    if (!userId) return;
    try {
      await deleteUserById(userId);
      setUsers(users.filter(u => u.id !== userId));
      toast.success(`User ${userNameOrEmail} deleted successfully!`);
    } catch (err) {
      toast.error('Failed to delete user: ' + (err.message || err));
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <h1>Manage Users</h1>
        <div className="user-management-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search Users"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="add-user-button" onClick={handleAddUser}>
            + Add User
          </button>
        </div>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>NAME</th>
              <th>ROLE</th>
              <th>EMAIL</th>
              <th>STATUS</th>
              <th>CREATED ON</th>
              <th>LAST SEEN</th>
              <th>PASSWORD</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name || user.fullName}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`status-badge ${user.status && user.status.toLowerCase() === 'active' ? 'active' : 'pending'}`}>
                    {user.status}
                  </span>
                </td>
                <td>{user.createdOn && user.createdOn.toDate ? user.createdOn.toDate().toLocaleString() : user.createdOn || ''}</td>
                <td>{user.lastSeen && user.lastSeen.toDate ? user.lastSeen.toDate().toLocaleString() : user.lastSeen || ''}</td>
                <td>
                  <div className="password-field">
                    <FiLock className="password-icon" /> {demoPasswords[user.id] || demoPasswords['default']}
                  </div>
                </td>
                <td className="actions">
                  <button 
                    className="action-button edit-button"
                    title="Edit User"
                    onClick={() => handleEditUser(user)}
                    style={{ color: '#4a69bd' }}
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="action-button delete-button"
                    title="Delete User"
                    onClick={() => setDeletingUserId(user.id)}
                    style={{ color: 'red' }}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddUser && (
        <div className="user-management-modal">
          <div className="modal-overlay">
            <div className="modal-content">
              <RegistrationForm onClose={handleCloseAddUser} onUserAdded={handleUserAdded} />
            </div>
          </div>
        </div>
      )}
      {/* Edit User Modal */}
      {editingUser && (
        <div className="user-management-modal">
          <div className="modal-overlay">
            <div className="modal-content">
              <UserEdit 
                user={editingUser} 
                onClose={handleCloseEditUser} 
                onUserUpdated={handleUserUpdated} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Delete */}
      {deletingUserId && (
        <div className="modal-overlay">
          <div className="confirm-modal" style={{ padding: '15px', maxWidth: '350px', borderRadius: '10px', background: 'white', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)' }}>
            <h3 style={{ fontSize: '16px', marginTop: '0', marginBottom: '10px' }}>Delete User</h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '13px' }}>Are you sure you want to delete this user?</p>
            <div className="confirm-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                className="cancel-btn"
                onClick={() => setDeletingUserId(null)}
                style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ddd', background: '#f5f5f5', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteUser(
                  deletingUserId, 
                  users.find(u => u.id === deletingUserId)?.email || 'User'
                )}
                style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '4px', border: 'none', background: '#dc3545', color: 'white', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{color:'#5a6474', marginTop:'30px', textAlign:'center', padding:'15px', borderRadius:'5px', background:'#f8f9fa'}}>
        "The system is currently under development and not yet finalized. Some features may still be incomplete, and further testing and refinement are ongoing to ensure the best possible performance and user experience".
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}; 