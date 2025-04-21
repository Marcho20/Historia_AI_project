import React, { useState, useEffect } from 'react';
import './UserList.css';
import { RegistrationForm } from './RegistrationForm';
import { FiSearch } from 'react-icons/fi';
import { FiLock, FiUser, FiMoreVertical } from 'react-icons/fi';

export const UserList = () => {
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Mock users data for testing
    const mockUsers = [
      {
        id: 1,
        name: 'Tarun',
        role: 'Enterprise Admin',
        email: 'tarun.dubey@wavemaker.com',
        status: 'Active',
        createdOn: '15 Dec 2016 11:33 AM',
        lastSeen: 'Just now'
      },
      {
        id: 2,
        name: 'sai vaddepally',
        role: 'Studio User',
        email: 'sai.vaddepally@wavemaker.com',
        status: 'Active',
        createdOn: '15 Apr 2020 12:21 PM',
        lastSeen: '14 hours ago'
      },
      {
        id: 3,
        name: 'Zinedine Zidane',
        role: 'Enterprise Admin',
        email: 'zinedine.zidane@football.org',
        status: 'Active',
        createdOn: '11 Jun 2020 09:21 AM',
        lastSeen: 'an hour ago'
      },
      {
        id: 4,
        name: 'Thierry Henry',
        role: 'Studio User',
        email: 'thierry.henry@football.org',
        status: 'Active',
        createdOn: '18 Jun 2020 11:29 AM',
        lastSeen: '3 days ago'
      }
    ];
    setUsers(mockUsers);
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
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`status-badge ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </td>
                <td>{user.createdOn}</td>
                <td>{user.lastSeen}</td>
                <td className="actions">
                  <button className="action-button">
                    <FiLock />
                  </button>
                  <button className="action-button">
                    <FiUser />
                  </button>
                  <button className="action-button">
                    <FiMoreVertical />
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
    </div>
  );
}; 