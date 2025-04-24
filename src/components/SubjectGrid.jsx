import React, { useState } from 'react';
import { FaSearch, FaFilter, FaThLarge, FaList, FaPlus, FaEllipsisV } from 'react-icons/fa';
import './SubjectGrid.css';

const SubjectGrid = ({ subjects, onEdit, onDelete, onStandByToggle }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [activeMenu, setActiveMenu] = useState(null);
  
  const handleMenuClick = (subjectId) => {
    setActiveMenu(activeMenu === subjectId ? null : subjectId);
  };

  const handleEdit = (subject) => {
    onEdit(subject);
    setActiveMenu(null);
  };

  const handleDelete = (subjectId) => {
    onDelete(subjectId);
    setActiveMenu(null);
  };

  const handleStandBy = (subject) => {
    onStandByToggle(subject);
    setActiveMenu(null);
  };

  return (
    <div className="subject-container">
      <div className="header-container">
        <h1 className="header-title">Subject</h1>
        <button className="post-teacher-button">
          <FaPlus />
          Post in Teacher
        </button>
      </div>

      <div className="search-filter-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search subject by name"
          />
        </div>
        
        <button className="filter-button">
          <FaFilter />
          FILTER
        </button>

        <div className="view-toggle">
          <button 
            className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <FaThLarge /> GRID
          </button>
          <button 
            className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <FaList /> LIST
          </button>
        </div>
      </div>

      <div className="subject-grid">
        {subjects.map((subject) => (
          <div key={subject.id} className="subject-card">
            <div className="card-status-header">
              <span className="draft-status">DRAFT</span>
              <button
                className="menu-button"
                onClick={() => handleMenuClick(subject.id)}
              >
                <FaEllipsisV />
              </button>
              {activeMenu === subject.id && (
                <div className="menu-dropdown">
                  <button onClick={() => handleEdit(subject)}>Edit</button>
                  <button onClick={() => handleDelete(subject.id)}>Delete</button>
                  <button 
                    className={subject.standBy ? 'cancel-standby' : ''}
                    onClick={() => handleStandBy(subject)}
                  >
                    {subject.standBy ? 'Cancel Stand BY' : 'Set Stand By'}
                  </button>
                </div>
              )}
            </div>
            <div className="subject-header">
              <h3>{subject.title}</h3>
            </div>
            <div className="subject-image">
              <img src={subject.image} alt={subject.title} />
              {subject.standBy && (
                <div className="stand-by-overlay">
                  Stand BY
                </div>
              )}
            </div>
            <div className="subject-content">
              <p className="subject-teacher">{subject.teacher}</p>
              <span className="subject-status">{subject.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectGrid; 