import React, { useState } from 'react';

const initialLessons = [
  {
    title: 'Mastering Basic Addition and Subtraction',
    subject: 'Mathematics',
    teacher: 'Mr. Santos',
    status: 'Completed',
    description: 'A beginner-friendly introduction to basic algebraic concepts and problem-solving.',
    files: [
      { name: 'Lesson 1 Handout', url: '/files/handouts01Lesson1.pdf', type: 'pdf' },
      { name: 'Lesson 1 Video', url: '/files/video01Lesson1.mp4', type: 'video' },
    ],
  },
  {
    title: 'World History: Chapter 3',
    subject: 'History',
    teacher: 'Ms. Reyes',
    status: 'In Progress',
    description: 'Exploring early civilizations and their impact on the modern world.',
    files: [
      { name: 'Lesson 2 Handout', url: '/files/handouts01Lesson2.pdf', type: 'pdf' },
      { name: 'Lesson 2 Video', url: '/files/video01Lesson2.mp4', type: 'video' },
    ],
  },
  {
    title: 'Basic Filipino',
    subject: 'Science',
    teacher: 'Mr. Cruz',
    status: 'Not Started',
    description: 'Learn about atoms, molecules, and the foundations of chemistry.',
    files: [
      { name: 'Chemistry Notes', url: '/files/chemistry_notes.pdf', type: 'pdf' },
    ],
  },
  {
    title: 'English Literature',
    subject: 'English',
    teacher: 'Ms. ',
    status: 'Completed',
    description: 'Dive into classic and modern works of English literature.',
    files: [
      { name: 'Poetry Handout', url: '/files/poetry_handout.pdf', type: 'pdf' },
    ],
  },
  {
    title: 'Edukasyon sa Pagpapakatao (EsP)',
    subject: 'ESP',
    teacher: 'Mr. ',
    status: 'In Progress',
    description: 'Introduction to computers, hardware, and software basics.',
    files: [
      { name: 'Lesson 5 Slides', url: '/files/ict_lesson5_slides.pdf', type: 'pdf' },
      { name: 'ICT Video', url: '/files/ict_video.mp4', type: 'video' },
    ],
  },
];

export default function Lessons() {
  const [lessons] = useState(initialLessons);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showLessonModal, setShowLessonModal] = useState(false);

  const handleViewLesson = (lesson) => {
    setSelectedLesson(lesson);
    setShowLessonModal(true);
  };
  const handleCloseLessonModal = () => {
    setShowLessonModal(false);
    setSelectedLesson(null);
  };

  return (
    <div className="section-content" style={{padding: '16px 8px'}}>
      <h2 style={{marginTop: 0, marginBottom: 28, color: '#2d2a4a', fontWeight: 700, fontSize: '2rem'}}>My Lessons</h2>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 28}}>
        {lessons.map((lesson, idx) => (
          <div key={idx} style={{
            minWidth: 280,
            maxWidth: 330,
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 2px 12px #0001',
            padding: '24px 20px 18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            border: '1.5px solid #e4e6fa',
          }}>
            <div style={{fontWeight: 700, fontSize: 20, color: '#4b3fa7', marginBottom: 2}}>{lesson.title}</div>
            <div style={{fontSize: 15, color: '#3b3e5b'}}><b>Subject:</b> {lesson.subject}</div>
            <div style={{fontSize: 15, color: '#888'}}><b>Teacher:</b> {lesson.teacher}</div>
            <div style={{marginTop: 8, marginBottom: 8}}>
              <span style={{
                background: lesson.status === 'Completed' ? '#27ae60' : lesson.status === 'In Progress' ? '#f7b731' : '#e74c3c',
                color: '#fff',
                borderRadius: 8,
                padding: '4px 12px',
                fontWeight: 600,
                fontSize: 14,
              }}>{lesson.status}</span>
            </div>
            <button style={{
              background: '#4b3fa7',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 0',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              marginTop: 8,
              transition: 'background 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = '#2d2a4a'}
            onMouseOut={e => e.currentTarget.style.background = '#4b3fa7'}
            onClick={() => handleViewLesson(lesson)}
            >View</button>
          </div>
        ))}
      </div>
      {showLessonModal && selectedLesson && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(44, 44, 66, 0.25)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 20,
            boxShadow: '0 8px 32px #0002',
            padding: '36px 40px',
            minWidth: 320,
            maxWidth: 420,
            width: '90vw',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}>
            <button
              onClick={handleCloseLessonModal}
              style={{
                position: 'absolute',
                top: 16,
                right: 18,
                background: '#e74c3c',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 36,
                height: 36,
                fontSize: 20,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px #e74c3c44',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#b72a1c'}
              onMouseOut={e => e.currentTarget.style.background = '#e74c3c'}
              title="Close"
            >✕</button>
            <div style={{fontWeight: 700, fontSize: 24, color: '#4b3fa7', marginBottom: 6}}>{selectedLesson.title}</div>
            <div style={{fontSize: 16, color: '#3b3e5b'}}><b>Subject:</b> {selectedLesson.subject}</div>
            <div style={{fontSize: 16, color: '#888'}}><b>Teacher:</b> {selectedLesson.teacher}</div>
            <div>
              <span style={{
                background: selectedLesson.status === 'Completed' ? '#27ae60' : selectedLesson.status === 'In Progress' ? '#f7b731' : '#e74c3c',
                color: '#fff',
                borderRadius: 8,
                padding: '4px 12px',
                fontWeight: 600,
                fontSize: 15,
              }}>{selectedLesson.status}</span>
            </div>
            <div style={{marginTop: 12, color: '#2d2a4a', fontSize: 16, lineHeight: 1.6}}>{selectedLesson.description}</div>
            {selectedLesson.files && selectedLesson.files.length > 0 && (
              <div style={{marginTop: 22}}>
                <div style={{fontWeight: 600, fontSize: 16, marginBottom: 8, color: '#4b3fa7'}}>Files</div>
                <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                  {selectedLesson.files.map((file, i) => (
                    <li key={i} style={{display: 'flex', alignItems: 'center', marginBottom: 10}}>
                      <span style={{fontSize: 15, color: '#2d2a4a', flex: 1}}>{file.name}</span>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: file.type === 'pdf' ? '#e74c3c' : '#4b3fa7',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 7,
                          padding: '6px 16px',
                          fontWeight: 600,
                          fontSize: 15,
                          textDecoration: 'none',
                          marginLeft: 8,
                          transition: 'background 0.2s',
                          boxShadow: '0 1px 4px #0001',
                        }}
                        onMouseOver={e => e.currentTarget.style.background = file.type === 'pdf' ? '#b72a1c' : '#2d2a4a'}
                        onMouseOut={e => e.currentTarget.style.background = file.type === 'pdf' ? '#e74c3c' : '#4b3fa7'}
                        download={file.type === 'pdf'}
                      >{file.type === 'pdf' ? 'Download' : 'View'}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
