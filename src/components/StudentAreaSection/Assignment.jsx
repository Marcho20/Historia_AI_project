import React, { useState } from 'react';

const initialAssignments = [
  {
    title: 'AP Activity 1',
    subject: 'Araling Panlipunan',
    dueDate: '2025-05-01',
    status: 'Not Started',
    description: 'Complete the worksheet and upload your answers as a PDF or image.',
    files: [
      { name: 'Worksheet PDF', url: '/files/AP_worksheet1.pdf', type: 'pdf' },
    ],
    submission: null,
    grade: null,
  },
  {
    title: 'Essay: AP 2',
    subject: 'Araling Panlipunan',
    dueDate: '2025-05-03',
    status: 'Submitted',
    description: 'Write a 500-word essay about any ancient civilization.',
    files: [
      { name: 'Essay Instructions', url: '/files/history_essay.pdf', type: 'pdf' },
    ],
    submission: {
      fileName: 'MyEssay.docx',
      submittedAt: '2025-04-27T18:00:00',
    },
    grade: {
      score: 92,
      feedback: 'Well researched and clearly written!'
    },
  },
  {
    title: 'AP quiz01',
    subject: 'Araling Panlipunan',
    dueDate: '2025-05-05',
    status: 'In Progress',
    description: 'Submit your lab report with data and analysis.',
    files: [
      { name: 'Lab Template', url: '/files/chem_lab_template.docx', type: 'docx' },
    ],
    submission: null,
    grade: null,
  },
];

export default function Assignment() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadError, setUploadError] = useState('');

  const handleOpen = (a) => {
    setSelected(a);
    setShowModal(true);
    setUploadFile(null);
    setUploadError('');
  };
  const handleClose = () => {
    setShowModal(false);
    setSelected(null);
    setUploadFile(null);
    setUploadError('');
  };
  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
    setUploadError('');
  };
  const handleSubmit = () => {
    if (!uploadFile) {
      setUploadError('Please select a file to upload.');
      return;
    }
    // Mock submission (local only)
    setAssignments(prev => prev.map(a =>
      a === selected
        ? {
            ...a,
            status: 'Submitted',
            submission: {
              fileName: uploadFile.name,
              submittedAt: new Date().toISOString(),
            },
          }
        : a
    ));
    handleClose();
  };

  return (
    <div className="section-content" style={{padding: '16px 8px'}}>
      <h2 style={{marginTop: 0, marginBottom: 28, color: '#2d2a4a', fontWeight: 700, fontSize: '2rem'}}>Assignments</h2>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 28}}>
        {assignments.map((a, idx) => (
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
            opacity: a.status === 'Graded' ? 0.85 : 1,
          }}>
            <div style={{fontWeight: 700, fontSize: 20, color: '#4b3fa7', marginBottom: 2}}>{a.title}</div>
            <div style={{fontSize: 15, color: '#3b3e5b'}}><b>Subject:</b> {a.subject}</div>
            <div style={{fontSize: 15, color: '#888'}}><b>Due:</b> {a.dueDate}</div>
            <div style={{marginTop: 8, marginBottom: 8}}>
              <span style={{
                background: a.status === 'Graded' ? '#27ae60' : a.status === 'Submitted' ? '#4b3fa7' : a.status === 'In Progress' ? '#f7b731' : '#e74c3c',
                color: '#fff',
                borderRadius: 8,
                padding: '4px 12px',
                fontWeight: 600,
                fontSize: 14,
              }}>{a.status}</span>
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
            onClick={() => handleOpen(a)}
            >View / Submit</button>
          </div>
        ))}
      </div>
      {showModal && selected && (
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
            maxWidth: 440,
            width: '90vw',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}>
            <button
              onClick={handleClose}
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
            <div style={{fontWeight: 700, fontSize: 22, color: '#4b3fa7', marginBottom: 6}}>{selected.title}</div>
            <div style={{fontSize: 16, color: '#3b3e5b'}}><b>Subject:</b> {selected.subject}</div>
            <div style={{fontSize: 16, color: '#888'}}><b>Due Date:</b> {selected.dueDate}</div>
            <div style={{margin: '8px 0', color: '#2d2a4a', fontSize: 16, lineHeight: 1.6}}>{selected.description}</div>
            {selected.files && selected.files.length > 0 && (
              <div style={{marginTop: 12}}>
                <div style={{fontWeight: 600, fontSize: 16, marginBottom: 8, color: '#4b3fa7'}}>Files</div>
                <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                  {selected.files.map((file, i) => (
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
            {/* Submission area */}
            {selected.status !== 'Submitted' && selected.status !== 'Graded' && (
              <div style={{marginTop: 18}}>
                <div style={{fontWeight: 600, fontSize: 16, marginBottom: 8, color: '#4b3fa7'}}>Submit Assignment</div>
                <input type="file" onChange={handleFileChange} style={{marginBottom: 8}} />
                <button
                  style={{
                    background: '#27ae60',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 24px',
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: 'pointer',
                    marginLeft: 8,
                    transition: 'background 0.2s',
                  }}
                  onClick={handleSubmit}
                >Submit</button>
                {uploadError && <div style={{color: '#e74c3c', marginTop: 6}}>{uploadError}</div>}
              </div>
            )}
            {/* Submission info */}
            {selected.submission && (
              <div style={{marginTop: 18}}>
                <div style={{fontWeight: 600, fontSize: 16, marginBottom: 8, color: '#4b3fa7'}}>Submission</div>
                <div style={{color: '#2d2a4a', fontSize: 15}}>File: {selected.submission.fileName}</div>
                <div style={{color: '#888', fontSize: 14}}>Submitted at: {new Date(selected.submission.submittedAt).toLocaleString()}</div>
              </div>
            )}
            {/* Grade and feedback */}
            {selected.grade && (
              <div style={{marginTop: 18}}>
                <div style={{fontWeight: 600, fontSize: 16, marginBottom: 8, color: '#27ae60'}}>Grade</div>
                <div style={{color: '#2d2a4a', fontSize: 15}}>Score: {selected.grade.score}</div>
                <div style={{color: '#888', fontSize: 14}}>Feedback: {selected.grade.feedback}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
