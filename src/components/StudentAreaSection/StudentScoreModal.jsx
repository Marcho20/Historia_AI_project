import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

export default function StudentScoreModal({ student, open, onClose, onSubmit }) {
  // Accept assignmentType and assignmentTitle as props for future extensibility
  const assignmentType = student?.assignmentType || 'Assignment';
  const assignmentTitle = `${assignmentType}`;

  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');

  // lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  if (!open || !student) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...student, score, feedback });
    setScore('');
    setFeedback('');
  };

  const modalContent = (
    <div className="score-modal-overlay">
      <div className="score-modal" style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 350, maxWidth: 400, boxShadow: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ marginBottom: 8 }}>Score Student</h2>
        <div style={{ fontWeight: 600, color: '#3975e8', marginBottom: 16, fontSize: 17 }}>{assignmentTitle}</div>
        <div style={{ marginBottom: 12, textAlign: 'left', width: '100%' }}>
          <b>Name:</b> {student.name}<br />
          <b>Grade:</b> {student.grade}<br />
          <b>Subject:</b> {student.subject}
        </div>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ marginBottom: 14 }}>
            <label>Score: <input type="number" min="0" max="100" value={score} onChange={e => setScore(e.target.value)} required style={{ width: 80, marginLeft: 10, fontSize: 16, padding: 4, borderRadius: 6, border: '1px solid #ccc' }} /></label>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label>Feedback:<br />
              <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={3} style={{ width: '100%', fontSize: 15, padding: 6, borderRadius: 6, border: '1px solid #ccc' }} />
            </label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" onClick={onClose} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '7px 16px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ background: '#3975e8', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontWeight: 600, cursor: 'pointer' }}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
