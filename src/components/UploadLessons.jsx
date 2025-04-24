import React, { useState } from 'react';
import './UploadLessons.css';
import PostInTeacherModal from './PostInTeacherModal';

const initialSubjects = [
  {
    id: 1,
    name: 'Araling Panlipunan',
    teacher: 'Mr. Ralp',
    status: 'DRAFT',
    image: '/img/araling.png',
    standby: false
  },
  {
    id: 2,
    name: 'English',
    teacher: 'Mrs. Gwap',
    status: 'DRAFT',
    image: '/img/english.png',
    standby: false
  },
  {
    id: 3,
    name: 'Math',
    teacher: 'Mrs. Gwap',
    status: 'DRAFT',
    image: '/img/math.png',
    standby: true
  }
];


export default function UploadLessons() {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [view, setView] = useState('grid');
  const [message, setMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(null); // subject id or null

  // Modal State and Handlers
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [modalSelections, setModalSelections] = useState({
    english: 'yes',
    araling: 'yes',
    math: 'yes',
  });
  const modalSubjects = [
    { id: 'english', name: 'English', teacher: 'Mr. Ralp' },
    { id: 'araling', name: 'Araling Panlipunan', teacher: 'Mrs. Gwap' },
    { id: 'math', name: 'Math', teacher: 'Mrs. Gwap' },
  ];
  const handleModalRadioChange = (subjectId, value) => {
    setModalSelections(prev => ({ ...prev, [subjectId]: value }));
  };
  const handleModalSubmit = () => {
    // Handle submit logic here (e.g., send to backend)
    setPostModalOpen(false);
  };

  const filteredSubjects = subjects.filter(subj => {
    const matchesSearch = subj.name.toLowerCase().includes(search.toLowerCase());
    if (filter === 'All') return matchesSearch;
    if (filter === 'DRAFT') return matchesSearch && !subj.standby;
    if (filter === 'Stand BY') return matchesSearch && subj.standby;
    return matchesSearch;
  });

  const handleDraftClick = (id) => {
    setSubjects(subjects.map(subj =>
      subj.id === id ? { ...subj, standby: true } : subj
    ));
    setMessage('Subject set to Stand BY!');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleCancelStandby = (id) => {
    setSubjects(subjects.map(subj =>
      subj.id === id ? { ...subj, standby: false } : subj
    ));
    setMessage('Returned to Draft.');
    setMenuOpen(null);
    setTimeout(() => setMessage(''), 2000);
  };

  const handleMenuToggle = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  return (
    <div className="upload-lessons-container">
      <h1 className="page-title">Manage Upload Lessons</h1>
      {message && <div className="upload-lessons-message">{message}</div>}
      <div className="upload-lessons-header" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
        <input
          type="text"
          placeholder="Search subject by name"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="upload-lessons-search"
          style={{ minWidth: 260, maxWidth: 340 }}
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="upload-lessons-filter"
        >
          <option value="All">FILTER</option>
          <option value="DRAFT">Draft</option>
          <option value="Stand BY">Stand BY</option>
        </select>
        <div className="upload-lessons-view-toggle">
          <button
            className={view === 'grid' ? 'active' : ''}
            onClick={() => setView('grid')}
          >
            GRID
          </button>
          <button
            className={view === 'list' ? 'active' : ''}
            onClick={() => setView('list')}
          >
            LIST
          </button>
        </div>
        <button
          className="upload-lessons-post-btn"
          onClick={() => setPostModalOpen(true)}
          style={{ marginLeft: 'auto', minWidth: 180 }}
        >
          + Post in Teacher
        </button>
      </div>
      <div className={view === 'grid' ? 'subject-grid' : 'subject-list'}>
        {filteredSubjects.map(subject => (
          <div key={subject.id} className="subject-card">
            <div className="subject-image-container">
              <img src={subject.image} alt={subject.name} className="subject-image" />
              {subject.standby && <div className="standby-overlay">Stand BY</div>}
            </div>
            <div className="subject-details subject-details-row">
              <div>
                <div className="subject-title">{subject.name}</div>
                <div className="subject-teacher">{subject.teacher}</div>
                <div 
                  className="subject-status clickable-status"
                  onClick={() => !subject.standby && handleDraftClick(subject.id)}
                  style={{cursor: subject.status === 'DRAFT' && !subject.standby ? 'pointer' : 'default', color: subject.status === 'DRAFT' ? '#2f2f86' : '#888'}}
                >
                  {subject.status}
                </div>
              </div>
              <div className="kebab-menu-container">
                <button 
                  className="kebab-menu-btn" 
                  onClick={() => handleMenuToggle(subject.id)} 
                  aria-label="Open menu"
                >
                  <span className="kebab-icon">⋮</span>
                </button>
                {menuOpen === subject.id && subject.standby && (
                  <div className="kebab-dropdown">
                    <button 
                      onClick={() => handleCancelStandby(subject.id)} 
                      className="kebab-dropdown-item"
                    >
                      Cancel Stand BY
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <PostInTeacherModal
        open={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        subjects={modalSubjects}
        selections={modalSelections}
        onChange={handleModalRadioChange}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}

