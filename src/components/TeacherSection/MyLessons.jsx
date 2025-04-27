import React, { useState } from 'react';
import gridViewIcon from '../../assets/gridview.png';
import listViewIcon from '../../assets/listview.png';
import './TeachearDashboard.css';
import './MyLessons.css';

// Mock data for subjects, lessons, and sections
const mockSubjects = [
  {
    name: 'Araling Panlipunan',
    lessons: [
      {
        title: 'Syllabus and Course Outline',
        description: 'It is a portion of a school curriculum that includes classes in history, government, economics, civics, sociology, geography, and anthropology and is focused on the study of social relationships and the functioning of society.',
        sections: [
          { title: '01 AP Lessons1 Presentation 1', type: 'presentation' },
          { title: '01 Handout1.pdf', type: 'pdf' },
          { title: '01AP Lessons 1 .pdf', type: 'pdf' }
        ]
      },
      {
        title: 'Lesson1',
        description: 'LO1: Describe the cybersecurity role of a company, and LO2: Identify the importance of data and its worth.',
        sections: []
      },
      {
        title: 'Lesson2',
        description: 'In the second lesson of Social Studies, the location of the Philippines in the world is discussed using cardinal directions, maps, and globes. It also emphasizes the importance of the country\'s geographical location in history, economy, and culture. Students learn how location affects the Philippines\' relations with other countries and its own development.',
        sections: []
      },
      {
        title: 'Lesson3',
        description: 'Lesson 3 delves into various teaching strategies such as constructivism, collaborative learning, experiential learning, thematic approach, conceptual approach, and more',
        sections: []
      },
      {
        title: 'Lesson4',
        description: 'Sa ikaapat na aralin ng Araling Panlipunan, tinatalakay ang mga rehiyon ng Pilipinas, kabilang ang kanilang mga katangian, kultura, at pangunahing produkto. Tinuturo sa mga mag-aaral ang kahalagahan ng pagkakabuo ng mga rehiyon upang mas madaling mapamahalaan ang bansa. Pinag-aaralan din kung paano nakatutulong ang heograpiya sa pag-unlad ng mga lalawigan at rehiyon.',
        sections: []
      },
    ]
  },
  {
    name: 'English',
    lessons: [
      {
        title: 'English Syllabus',
        description: 'Overview of the English curriculum including grammar, literature, and communication skills.',
        sections: [
          { title: 'Syllabus.pdf', type: 'pdf' }
        ]
      },
      {
        title: 'Lesson 1: Parts of Speech',
        description: 'Identify and use the eight parts of speech in English.',
        sections: []
      },
      {
        title: 'Lesson 2: Reading Comprehension',
        description: 'Strategies for understanding and analyzing texts.',
        sections: []
      }
    ]
  }
];

export default function MyLessons() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [search, setSearch] = useState('');
  const [filterSections, setFilterSections] = useState(false);


  const handleSubjectChange = (e) => {
    const subj = mockSubjects.find(s => s.name === e.target.value);
    setSelectedSubject(subj);
    setExpandedLesson(null);
  };

  let lessonsToShow = selectedSubject ? selectedSubject.lessons : [];
  if (search) {
    lessonsToShow = lessonsToShow.filter(l =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (filterSections) {
    lessonsToShow = lessonsToShow.filter(l => l.sections && l.sections.length > 0);
  }

  return (
    <div style={{minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: selectedSubject ? 'flex-start' : 'center'}}>
      {!selectedSubject && (
        <select className="mylessons-dropdown" defaultValue="" onChange={handleSubjectChange}>
          <option value="" disabled>SUBJECT</option>
          {mockSubjects.map(subj => <option key={subj.name} value={subj.name}>{subj.name}</option>)}
        </select>
      )}
      {selectedSubject && (
        <div style={{width: '100%', maxWidth: 1300, marginTop: 30}}>
          <div className="mylessons-header">
            <h2>{selectedSubject.name}</h2>
            <div className="mylessons-controls" style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
  <button onClick={() => setSelectedSubject(null)} style={{marginRight: 16}}>Change Subject</button>
  
  
  <div className="mylessons-toggle-group">
    <button
      className={`mytoggle-btn${viewMode === 'grid' ? ' active' : ''}`}
      onClick={() => setViewMode('grid')}
      type="button"
    >
      {/* <img src={gridViewIcon} alt="Grid" /> */}
      <span className="button-icon">&#9783;</span>

      GRID
    </button>
    <button
      className={`mytoggle-btn${viewMode === 'list' ? ' active' : ''}`}
      onClick={() => setViewMode('list')}
      type="button"
    >
      {/* <img src={listViewIcon} alt="List" /> */}
      <span className="button-icon">&#9776;</span>

      LIST
    </button>
  </div>
</div>

{/* <div className="mylessons-toggle-group">
  <button
    className={viewMode === 'grid' ? 'active' : ''}
    onClick={() => setViewMode('grid')}
    type="button"
  >
    <span className="button-icon">&#9783;</span>
    GRID
  </button>
  <button
    className={viewMode === 'list' ? 'active' : ''}
    onClick={() => setViewMode('list')}
    type="button"
  >
    <span className="button-icon">&#9776;</span>
    LIST
  </button>
</div>
</div> */}
          </div>
          <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:18}}>
            <input
              className="mylessons-search"
              type="text"
              placeholder="Search lessons..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {/* <label style={{fontSize:14, display:'flex', alignItems:'center', gap:5}}>
              <input type="checkbox" checked={filterSections} onChange={e => setFilterSections(e.target.checked)} />
              Only with sections
            </label> */}
          </div>
          <div className={viewMode === 'grid' ? 'mylessons-grid' : 'mylessons-list'}>
            {lessonsToShow.map((lesson, idx) => (
              <div className={`mylessons-card-ref ${viewMode === 'list' ? 'mylessons-card-listview' : ''}`} key={lesson.title}>
                {viewMode === 'list' ? (
                  <div className="mylessons-list-row">
                    <div className="mylessons-card-img-placeholder mylessons-list-img">
                      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="56" height="56" rx="8" fill="#E5E7EB"/>
                        <path d="M14 42L28 28L42 42" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="20" cy="20" r="4" fill="#9CA3AF"/>
                      </svg>
                    </div>
                    <div className={`mylessons-card-info ${idx % 2 === 0 ? 'mylessons-card-blue' : 'mylessons-card-dark'}`} style={{flex:1}}>
                      <div className="mylessons-card-title">{lesson.title}</div>
                      <div className="mylessons-card-desc">{lesson.description}</div>
                      <button
  className="mylessons-section-toggle"
  onClick={e => {
    e.stopPropagation();
    setExpandedLesson(expandedLesson === idx ? null : idx);
  }}
  aria-label={expandedLesson === idx ? 'Hide sections' : 'Show sections'}
>
  {lesson.sections.length} section{lesson.sections.length !== 1 ? 's' : ''}
  <span
    className={`mylessons-chevron${expandedLesson === idx ? ' expanded' : ''}`}
    aria-hidden="true"
    style={{display:'inline-block', marginLeft:8, transition:'transform 0.2s', transform:expandedLesson===idx?'rotate(180deg)':'rotate(0deg)'}}
  >
    ▼
  </span>
</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mylessons-card-img-placeholder">
                      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="56" height="56" rx="8" fill="#E5E7EB"/>
                        <path d="M14 42L28 28L42 42" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="20" cy="20" r="4" fill="#9CA3AF"/>
                      </svg>
                    </div>
                    <div className={`mylessons-card-info ${idx % 2 === 0 ? 'mylessons-card-blue' : 'mylessons-card-dark'}`}> 
                      <div className="mylessons-card-title">{lesson.title}</div>
                      <div className="mylessons-card-desc">{lesson.description}</div>
                      <button
  className="mylessons-section-toggle"
  onClick={e => {
    e.stopPropagation();
    setExpandedLesson(expandedLesson === idx ? null : idx);
  }}
  aria-label={expandedLesson === idx ? 'Hide sections' : 'Show sections'}
>
  {lesson.sections.length} section{lesson.sections.length !== 1 ? 's' : ''}
  <span
    className={`mylessons-chevron${expandedLesson === idx ? ' expanded' : ''}`}
    aria-hidden="true"
    style={{display:'inline-block', marginLeft:8, transition:'transform 0.2s', transform:expandedLesson===idx?'rotate(180deg)':'rotate(0deg)'}}
  >
    ▼
  </span>
</button>
                    </div>
                  </>
                )}
                {lesson.sections && lesson.sections.length > 0 && expandedLesson === idx && (
                  <div className="mylessons-section-bar">
                    <div className="mylessons-section-bar-title">Section</div>
                    <ul className="mylessons-section-bar-list">
                      {lesson.sections.map((sec, sidx) => (
                        <li key={sidx} className="mylessons-section-bar-item">
                          {sec.type === 'pdf' && <span role="img" aria-label="pdf">📄</span>}
                          {sec.type === 'presentation' && <span role="img" aria-label="presentation">📊</span>}
                          {sec.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            {lessonsToShow.length === 0 && (
              <div style={{margin: '40px auto', color: '#888', fontSize: 18}}>No lessons found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

