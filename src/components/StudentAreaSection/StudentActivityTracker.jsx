import React, { useState } from 'react';

const initialStudents = [
  { id: 1, name: 'John Smith', grade: 1, subject: 'Araling Panlipunan', assignment: 'Completed' },
  { id: 2, name: 'Emma Johnson', grade: 1, subject: 'Araling Panlipunan', assignment: 'Pending' },
  { id: 3, name: 'Michael Brown', grade: 1, subject: 'Araling Panlipunan', assignment: 'Completed' },
  { id: 4, name: 'Sarah Davis', grade: 1, subject: 'Araling Panlipunan', assignment: 'Pending' },
  { id: 5, name: 'David Wilson', grade: 1, subject: 'Araling Panlipunan', assignment: 'Completed' },
];

export default function StudentActivityTracker() {
  const [students, setStudents] = useState(initialStudents);
  const [studentSearch, setStudentSearch] = useState("");

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const handleChangeAssignment = () => {
    setStudents(students => students.map(s => ({
      ...s,
      assignment: s.assignment === 'Completed' ? 'Pending' : 'Completed'
    })));
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
              boxShadow: '0 1px 3px #e3e6f033',
              transition: 'background 0.2s',
            }}
            onClick={handleChangeAssignment}
          >
            Change The Assignment
            <span style={{ fontSize: 15, marginLeft: 2 }}>▼</span>
          </button>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 10px #e3e6f0', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#8a97b1', fontWeight: 700 }}>
                <th style={{ padding: '10px 8px', textAlign: 'left', borderBottom: '1px solid #f0f2f7' }}>No.</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', borderBottom: '1px solid #f0f2f7' }}>NAME</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', borderBottom: '1px solid #f0f2f7' }}>Grade</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', borderBottom: '1px solid #f0f2f7' }}>SUBJECT</th>
                <th style={{ padding: '10px 8px', textAlign: 'left', borderBottom: '1px solid #f0f2f7' }}>ASSIGNMENT</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#bbb', padding: 24 }}>No students found.</td></tr>
              ) : (
                filteredStudents.map((student, idx) => (
                  <tr key={student.id}>
                    <td style={{ padding: '28px 8px' }}>{idx + 1}</td>
                    <td style={{ padding: '10px 8px', fontWeight: 500, color: '#5a5a5a' }}>{student.name}</td>
                    <td style={{ padding: '10px 8px' }}>{student.grade}</td>
                    <td style={{ padding: '10px 8px' }}>{student.subject}</td>
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
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
