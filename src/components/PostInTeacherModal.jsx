import React from 'react';
import './UploadLessons.css';

export default function PostInTeacherModal({ open, onClose, subjects, selections, onChange, onSubmit }) {
  if (!open) return null;
  return (
    <div className="modal-overlay-post">
      <div className="modal-content-post">
        <button className="modal-close-btn-post" onClick={onClose} aria-label="Close">×</button>
        <div className="modal-title-post" style={{textAlign: 'center', marginTop: '0.2rem'}}>Update the lesson to teacher</div>
        <div className="modal-table-post">
          {subjects.map(subject => (
            <div className="modal-column-post" key={subject.id}>
              <div className="modal-subject-title-post">{subject.name}</div>
              <div className="modal-assign-post">
                Assign to teacher: <b className="modal-teacher-name-post">{subject.teacher}</b>
              </div>
              <div className="modal-radio-group-post">
                <label>
                  <input
                    type="radio"
                    name={subject.id}
                    value="yes"
                    checked={selections[subject.id] === 'yes'}
                    onChange={() => onChange(subject.id, 'yes')}
                  /> yes
                </label>
                <label>
                  <input
                    type="radio"
                    name={subject.id}
                    value="no"
                    checked={selections[subject.id] === 'no'}
                    onChange={() => onChange(subject.id, 'no')}
                  /> no
                </label>
              </div>
            </div>
          ))}
        </div>
        <div className="modal-actions-post">
          <button className="modal-cancel-btn-post" onClick={onClose}> Cancel</button>
          <button className="modal-post-btn-post" onClick={onSubmit}> Post in Teacher</button>
        </div>
      </div>
    </div>
  );
}
