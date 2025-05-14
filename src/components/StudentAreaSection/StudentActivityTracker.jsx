import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import StudentScoreModal from './StudentScoreModal';
import './StudentScoreModal.css';

const initialStudents = [
  { id: 1, name: 'John Smith', grade: 1, subject: 'Araling Panlipunan', assignmentType: 'Task', assignment: 'Completed' },
  { id: 2, name: 'Emma Johnson', grade: 1, subject: 'Araling Panlipunan', assignmentType: 'Quiz', assignment: 'Pending' },
  { id: 3, name: 'Michael Brown', grade: 1, subject: 'Araling Panlipunan', assignmentType: 'Assignment', assignment: 'Completed' },
  { id: 4, name: 'Sarah Davis', grade: 1, subject: 'Araling Panlipunan', assignmentType: 'Task', assignment: 'Pending' },
  { id: 5, name: 'David Wilson', grade: 1, subject: 'Araling Panlipunan', assignmentType: 'Quiz', assignment: 'Completed' },
];

export default function StudentActivityTracker() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [students, setStudents] = useState(initialStudents);
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [assignmentType, setAssignmentType] = useState('Task');
  const [studentSearch, setStudentSearch] = useState("");

  // lock body scroll when assignment modal open
  useEffect(() => {
    if (assignmentModalOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [assignmentModalOpen]);

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const handleChangeAssignment = () => {
    setAssignmentModalOpen(true);
  };

  const handleAssignmentModalClose = () => {
    setAssignmentModalOpen(false);
  };

  const handleAssignmentTypeSubmit = (e) => {
    e.preventDefault();
    setStudents(students => students.map(s => ({
      ...s,
      assignmentType,
      assignment: 'Pending',
      score: undefined,
      feedback: undefined
    })));
    setAssignmentModalOpen(false);
  };


  const handleRowClick = (student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedStudent(null);
  };

  const handleScoreSubmit = (studentWithScore) => {
    setStudents(prev => prev.map(s => s.id === studentWithScore.id ? { ...s, ...studentWithScore } : s));
    setModalOpen(false);
    setSelectedStudent(null);
  };

  return (
    <div className="dashboard-card student-activity-tracker">
      <div className="card-header">
        <span className="card-title" style={{ color: '#3975e8', fontWeight: 700, fontSize: '1.3rem' }}>
          Student Activity Tracker
        </span>
      </div>
      <div className="card-body student-activity-body" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <input
            type="text"
            placeholder="Search students."
            value={studentSearch}
            onChange={e => setStudentSearch(e.target.value)}
            style={{
              border: '1px solid #e3e6f0',
              borderRadius: 6,
              padding: '5px 10px',
              fontSize: 17,
              width: 420,
              outline: 'none',
              background: '#f8fafc',
              height: 32,
              marginRight: 8,
              transition: 'border 0.2s',
            }}
          />
          <button
            className="change-assignment-btn"
            style={{
              background: '#3975e8',
              color: '#fff',
              border: 'none',
              borderRadius: 14,
              padding: '11px 14px',
              fontWeight: 700,
              width:220,
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              height: 42,
              transition: 'background 0.2s',
            }}
            onClick={handleChangeAssignment}
          >
            Change Assignment Type
            <span style={{ fontSize: 15, marginLeft: 2 }}>▼</span>
          </button>

          {/* Assignment Type Modal */}
          {assignmentModalOpen && ReactDOM.createPortal(
            <div className="score-modal-overlay">
              <div className="score-modal" style={{ minWidth: 320, maxWidth: 360, textAlign: 'center', boxShadow: 'none' }}>
                <h2 style={{ marginBottom: 18 }}>Change Assignment Type</h2>
                <form onSubmit={handleAssignmentTypeSubmit}>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontWeight: 500 }}>Assignment Type:
                      <select value={assignmentType} onChange={e => setAssignmentType(e.target.value)} style={{ marginLeft: 10, fontSize: 16, padding: 4, borderRadius: 6, border: '1px solid #ccc' }}>
                        <option value="Task">Task</option>
                        <option value="Assignment">Assignment</option>
                        <option value="Quiz">Quiz</option>
                        <option value="Project">Project</option>
                      </select>
                    </label>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button type="button" onClick={handleAssignmentModalClose} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '7px 16px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" style={{ background: '#3975e8', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                  </div>
                </form>
              </div>
            </div>, document.body)}

        </div>
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 10px #e3e6f0', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#8a97b1', fontWeight: 700 }}>
                <th style={{ padding: '10px 8px', textAlign: 'left', borderBottom: '1px solid #f0f2f7' }}>No.</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', borderBottom: '1px solid #f0f2f7' }}>NAME</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', borderBottom: '1px solid #f0f2f7' }}>Grade</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', borderBottom: '1px solid #f0f2f7' }}>SUBJECT</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', borderBottom: '1px solid #f0f2f7' }}>Assignment Type</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', borderBottom: '1px solid #f0f2f7' }}>ASSIGNMENT</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#bbb', padding: 24 }}>No students found.</td></tr>
              ) : (
                filteredStudents.map((student, idx) => (
                  <tr key={student.id} style={{ cursor: 'pointer' }} onClick={() => handleRowClick(student)}>
                    <td style={{ padding: '28px 8px' }}>{idx + 1}</td>
                    <td style={{ padding: '10px 8px', fontWeight: 500, color: '#5a5a5a' }}>{student.name}</td>
                    <td style={{ padding: '10px 8px' }}>{student.grade}</td>
                    <td style={{ padding: '10px 8px' }}>{student.subject}</td>
                    <td style={{ padding: '10px 8px', fontWeight: 600, color: '#3975e8' }}>{student.assignmentType}</td>
                    <td style={{ padding: '10px 8px' }}>
                      <span style={{
                        background: student.assignment === 'Completed' ? '#e3fbe7' : '#ffeaea',
                        color: student.assignment === 'Completed' ? '#34b77a' : '#e35d6a',
                        borderRadius: 12,
                        padding: '3px 14px',
                        fontWeight: 600,
                        fontSize: 14,
                      }}>
                        {student.assignment}
                        {typeof student.score !== 'undefined' && (
                          <span style={{ marginLeft: 10, color: '#3975e8', fontWeight: 700, fontSize: 13 }}>
                            | Score: {student.score}
                          </span>
                        )}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* <div style={{
          // background: '#f8f9ff',
          // border: '1px solid #e3e6f0', 
          borderRadius: 6,
          padding: '12px 16px',
          marginTop: 20,
          color: '#5a6474',
          fontSize: 15,
          lineHeight: 1.8
        }}>
         "The system is currently under development and not yet finalized. Some features may still be incomplete, and further testing and refinement are ongoing to ensure the best possible performance and user experience".
        </div> */}
        <div style={{color:'#bbb', marginTop:'18px',color: '#5a6474' }}>"The system is currently under development and not yet finalized. Some features may still be incomplete, and further testing and refinement are ongoing to ensure the best possible performance and user experience".</div>

      </div>
      <StudentScoreModal
        student={selectedStudent}
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleScoreSubmit}
      />
    </div>
  );
}
