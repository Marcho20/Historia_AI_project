import React, { useState, useRef } from 'react';
import './ManageActivity.css';

const subjects = [
  { name: 'Mathematics', icon: '📘' },
  { name: 'Science', icon: '🧪' },
  { name: 'English', icon: '📗' },
  { name: 'History', icon: '🏛️' },
  { name: 'Geography', icon: '🌎' },
  { name: 'Art', icon: '🎨' },
];

const students = [
  { no: 1, name: 'John Smith', grade: 1, subject: 'Araling Panlipunan' },
  { no: 2, name: 'Emma Johnson', grade: 1, subject: 'Araling Panlipunan' },
  { no: 3, name: 'Michael Brown', grade: 1, subject: 'Araling Panlipunan' },
  { no: 4, name: 'Sarah Davis', grade: 1, subject: 'Araling Panlipunan' },
];

const steps = [
  { label: 'Subject', icon: '📚' },
  { label: 'Type', icon: '📝' },
  { label: 'Format', icon: '❓' },
  { label: 'Questions', icon: '🔢' },
  { label: 'Settings', icon: '⚙️' },
  { label: 'Review', icon: '🔍' },
  { label: 'Publish', icon: '📤' },
];

export default function ManageActivity() {
  const startDateRef = useRef(null);
  const dueDateRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [checked, setChecked] = useState([false, false, false, false]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [questions, setQuestions] = useState([]);
  
  // Settings state variables
  const [timeLimit, setTimeLimit] = useState(30);
  const [allowMultipleAttempts, setAllowMultipleAttempts] = useState(false);
  const [numberOfAttempts, setNumberOfAttempts] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleSubjectSelect = (subject) => setSelectedSubject(subject);
  const handleNext = () => {
    // If we're at step 1 (type selection) and selected Quiz, go to format selection
    if (activeStep === 1 && selectedType === 'Quiz') {
      setActiveStep(2);
    } else if (activeStep === 2 && selectedType === 'Quiz' && !selectedFormat) {
      // Stay on format selection if Quiz was selected but no format chosen
      return;
    } else {
      setActiveStep((s) => Math.min(s + 1, steps.length - 1));
    }
  };
  const handlePrev = () => setActiveStep((s) => Math.max(s - 1, 0));
  const handleCheck = (idx) => {
    setChecked(prev => prev.map((c, i) => (i === idx ? !c : c)));
  };
  
  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      text: '',
      type: selectedFormat
    };
    
    // Add format-specific properties
    if (selectedFormat === 'multiple-choice') {
      newQuestion.options = ['', '', '', ''];
      newQuestion.correctOption = null;
    } else if (selectedFormat === 'fill-blanks') {
      newQuestion.correctAnswer = '';
    } else if (selectedFormat === 'true-false') {
      newQuestion.correctAnswer = null;
    } else if (selectedFormat === 'guess-word') {
      newQuestion.correctAnswer = '';
    }
    
    setQuestions([...questions, newQuestion]);
  };
  
  const handleQuestionChange = (id, field, value) => {
    setQuestions(
      questions.map(q => {
        if (q.id === id) {
          return { ...q, [field]: value };
        }
        return q;
      })
    );
  };
  
  const handleOptionChange = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return {...q, options: newOptions};
      }
      return q;
    }));
  };
  
  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };
  
  // Settings handlers
  const handleTimeLimitChange = (e) => {
    setTimeLimit(e.target.value);
  };
  
  const handleMultipleAttemptsToggle = () => {
    setAllowMultipleAttempts(!allowMultipleAttempts);
  };
  
  const handleAttemptsNumberChange = (e) => {
    setNumberOfAttempts(e.target.value);
  };
  
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };
  
  const handleDueDateChange = (e) => {
    setDueDate(e.target.value);
  };
  
  const handleInstructionsChange = (e) => {
    setInstructions(e.target.value);
  };

  return (
    <div className="manage-activity-wrapper">
      <div className="assignment-header-row">
        <div>
          <h2>Create Assignment</h2>
          <div className="assignment-date">Monday, April 28, 2025</div>
        </div>
        <button className="draft-btn">Save Draft</button>
      </div>
      <div className="stepper-bar">
        {steps.map((step, idx) => (
          <div key={step.label} className={`stepper-step${idx === activeStep ? ' active' : ''}`}> 
            <div className="stepper-icon">{step.icon}</div>
            <div className="stepper-label">{step.label}</div>
          </div>
        ))}
      </div>
      {activeStep === 0 && (
        <>
          <div className="subject-select-section">
            <div className="subject-title">Select Subject</div>
            <div className="subject-grid">
              {subjects.map((subj) => (
                <button
                  key={subj.name}
                  className={`subject-card${selectedSubject === subj.name ? ' selected' : ''}`}
                  onClick={() => handleSubjectSelect(subj.name)}
                >
                  <div className="subject-icon">{subj.icon}</div>
                  <div className="subject-name">{subj.name}</div>
                </button>
              ))}
            </div>
            <div className="stepper-actions">
              <button className="prev-btn" onClick={handlePrev} disabled={activeStep === 0}>Previous</button>
              <button className="next-btn" onClick={handleNext} disabled={!selectedSubject || checked.every(c => !c)}>Next ➔</button>
            </div>
          </div>
          {/* Student Table Section */}
          <div className="student-table-section">
            <div className="student-table-title">Student</div>
            <table className="student-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>NAME</th>
                  <th>Grade</th>
                  <th>SUBJECT</th>
                  <th>Choose</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr key={student.no}>
                    <td>{student.no}</td>
                    <td>{student.name}</td>
                    <td>{student.grade}</td>
                    <td>{student.subject}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={checked[idx]}
                        onChange={() => handleCheck(idx)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeStep === 1 && (
        <div className="assignment-type-section">
          <div className="assignment-type-title">Choose Assignment Type</div>
          <div className="assignment-type-grid" style={{ display: 'flex', gap: '32px', justifyContent: 'center', margin: '30px 0' }}>
            <button
              className={`assignment-type-card${selectedType === 'Essay' ? ' selected' : ''}`}
              style={{
                background: '#fff',
                border: selectedType === 'Essay' ? '2px solid #2563eb' : '1.5px solid #e5e7eb',
                borderRadius: '15px',
                boxShadow: '0 2px 8px rgba(44,62,80,0.06)',
                minWidth: '260px',
                padding: '32px 18px',
                transition: 'border 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                outline: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => {
                setSelectedType('Essay');
                setQuestions([]);
                setSelectedFormat('');
              }}
            >
              <div style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                  <circle cx="28" cy="28" r="24" fill="#eaf3ff"/>
                  <rect x="20" y="16" width="16" height="24" rx="3" fill="#2563eb"/>
                  <rect x="24" y="24" width="8" height="2" rx="1" fill="#fff"/>
                  <rect x="24" y="29" width="8" height="2" rx="1" fill="#fff"/>
                  <rect x="24" y="34" width="8" height="2" rx="1" fill="#fff"/>
                </svg>
              </div>
              <div style={{ fontWeight: 600, fontSize: '18px', color: '#222', marginBottom: '7px' }}>Essay</div>
              <div style={{ color: '#555', fontSize: '14px', textAlign: 'center', maxWidth: '210px' }}>
                Long-form written responses to prompts
              </div>
            </button>
            <button
              className={`assignment-type-card${selectedType === 'Quiz' ? ' selected' : ''}`}
              style={{
                background: '#fff',
                border: selectedType === 'Quiz' ? '2px solid #2563eb' : '1.5px solid #e5e7eb',
                borderRadius: '15px',
                boxShadow: '0 2px 8px rgba(44,62,80,0.06)',
                minWidth: '260px',
                padding: '32px 18px',
                transition: 'border 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                outline: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => {
                setSelectedType('Quiz');
                setQuestions([]);
                setSelectedFormat('');
              }}
            >
              <div style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                  <circle cx="28" cy="28" r="24" fill="#eaf3ff"/>
                  <circle cx="28" cy="28" r="13" fill="#2563eb"/>
                  <text x="28" y="35" textAnchor="middle" fontSize="22" fill="#fff" fontFamily="Arial" fontWeight="bold">?</text>
                </svg>
              </div>
              <div style={{ fontWeight: 600, fontSize: '18px', color: '#222', marginBottom: '7px' }}>Quiz</div>
              <div style={{ color: '#555', fontSize: '14px', textAlign: 'center', maxWidth: '210px' }}>
                Test knowledge with various question formats
              </div>
            </button>
            <button
              className={`assignment-type-card${selectedType === 'Activity' ? ' selected' : ''}`}
              style={{
                background: '#fff',
                border: selectedType === 'Activity' ? '2px solid #2563eb' : '1.5px solid #e5e7eb',
                borderRadius: '15px',
                boxShadow: '0 2px 8px rgba(44,62,80,0.06)',
                minWidth: '260px',
                padding: '32px 18px',
                transition: 'border 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                outline: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => {
                setSelectedType('Activity');
                setQuestions([]);
                setSelectedFormat('');
              }}
            >
              <div style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                  <circle cx="28" cy="28" r="24" fill="#eaf3ff"/>
                  <path d="M36 36v-4a2 2 0 0 0-2-2h-2v-2a2 2 0 0 0-2-2h-2v-2a2 2 0 0 0-2-2h-4v12h14z" fill="#2563eb"/>
                </svg>
              </div>
              <div style={{ fontWeight: 600, fontSize: '18px', color: '#222', marginBottom: '7px' }}>Activity</div>
              <div style={{ color: '#555', fontSize: '14px', textAlign: 'center', maxWidth: '210px' }}>
                Interactive exercises and assignments
              </div>
            </button>
          </div>
          <div className="stepper-actions">
            <button className="prev-btn" onClick={handlePrev}>Previous</button>
            <button className="next-btn" onClick={handleNext} disabled={!selectedType}>Next ➔</button>
          </div>
        </div>
      )}
      
      {activeStep === 2 && selectedType === 'Quiz' && (
        <div style={{
          padding: '20px 0'
        }}>
          <h2 style={{
            fontSize: '22px',
            fontWeight: '700',
            color: '#333',
            margin: '0 0 25px 0'
          }}>Select Quiz Format</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {/* Multiple Choice */}
            <div 
              onClick={() => setSelectedFormat('multiple-choice')}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: selectedFormat === 'multiple-choice' ? '#f0f7ff' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#e6effd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px',
                color: '#2563eb',
                flexShrink: 0
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 5h14a1 1 0 0 1 0 2H3a1 1 0 1 1 0-2zm0 4h14a1 1 0 0 1 0 2H3a1 1 0 1 1 0-2zm0 4h14a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2z" fill="#2563eb"/>
                </svg>
              </div>
              <div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: '600' }}>Multiple Choice</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Select the correct answer from options</p>
              </div>
            </div>
            
            {/* Fill in the Blanks */}
            <div 
              onClick={() => setSelectedFormat('fill-blanks')}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: selectedFormat === 'fill-blanks' ? '#f0f7ff' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#e6effd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px',
                color: '#2563eb',
                flexShrink: 0
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5zm2 1v8h6V6H7z" fill="#2563eb"/>
                  <path d="M7 9h6v2H7V9z" fill="#2563eb"/>
                </svg>
              </div>
              <div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: '600' }}>Fill in the Blanks</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Complete sentences with missing words</p>
              </div>
            </div>
            
            {/* Guess the Word */}
            <div 
              onClick={() => setSelectedFormat('guess-word')}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: selectedFormat === 'guess-word' ? '#f0f7ff' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#e6effd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px',
                color: '#2563eb',
                flexShrink: 0
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0-2a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0-10a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V7a1 1 0 0 1 1-1zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" fill="#2563eb"/>
                </svg>
              </div>
              <div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: '600' }}>Guess the Word</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Identify words from clues or definitions</p>
              </div>
            </div>
            
            {/* True/False */}
            <div 
              onClick={() => setSelectedFormat('true-false')}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: selectedFormat === 'true-false' ? '#f0f7ff' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#e6effd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px',
                color: '#2563eb',
                flexShrink: 0
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm2.3-10.7a1 1 0 0 0-1.4 1.4l1.3 1.3-1.3 1.3a1 1 0 0 0 1.4 1.4l2-2a1 1 0 0 0 0-1.4l-2-2zm-4.6 0l-2 2a1 1 0 0 0 0 1.4l2 2a1 1 0 0 0 1.4-1.4L7.8 10l1.3-1.3a1 1 0 1 0-1.4-1.4z" fill="#2563eb"/>
                </svg>
              </div>
              <div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: '600' }}>True/False</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Determine if statements are true or false</p>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button 
              onClick={handlePrev}
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: '500',
                color: '#4b5563',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                width: 'auto',
                minWidth: 'auto'
              }}
            >
              ← Previous
            </button>
            <button 
              onClick={handleNext}
              style={{
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                width: 'auto',
                minWidth: 'auto',
                opacity: selectedFormat ? 1 : 0.7,
                pointerEvents: selectedFormat ? 'auto' : 'none'
              }}
              disabled={!selectedFormat}
            >
              Next →
            </button>
          </div>
        </div>
      )}
      
      {activeStep === 2 && selectedType !== 'Quiz' && (
        <div className="questions-section" style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '30px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px'
          }}>
            <h2 style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#333',
              margin: 0
            }}>Create Questions</h2>
            <button 
              onClick={handleAddQuestion}
              style={{
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                minWidth: 'auto',
                width: 'auto'
              }}
            >
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>+</span> Add Question
            </button>
          </div>
          
          {questions.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 0',
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
            }}>
              <div style={{
                width: '52px',
                height: '52px',
                background: '#e5e7eb',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '22px',
                color: '#9ca3af'
              }}>?</div>
              <p style={{ fontWeight: '600', color: '#4b5563', marginBottom: '8px' }}>No questions yet</p>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>Click the button above to add your first question</p>
              <button 
                onClick={handleAddQuestion}
                style={{
                  background: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  minWidth: 'auto',
                  width: 'auto'
                }}
              >
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>+</span> Add Question
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {questions.map((question, index) => (
                <div key={question.id} style={{
                  padding: '24px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  background: '#fff',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#333', position: 'static' }}>Question {index + 1}</h3>
                    <button 
                      onClick={() => handleDeleteQuestion(question.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ef4444',
                        transition: 'color 0.2s ease',
                        position: 'absolute',
                        right: '4px',
                        left: '500px',
                        top: '24px'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4b5563', marginBottom: '6px' }}>Question Text</label>
                    <textarea 
                      value={question.text}
                      onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                      placeholder="Enter your question here..."
                      style={{
                        width: '100%',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        padding: '12px',
                        fontSize: '14px',
                        minHeight: '80px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
            <button 
              onClick={handlePrev}
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: '500',
                color: '#4b5563',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                width: 'auto',
                minWidth: 'auto'
              }}
            >
              ← Previous
            </button>
            <button 
              onClick={handleNext}
              style={{
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                width: 'auto',
                minWidth: 'auto',
                opacity: questions.length > 0 ? 1 : 0.7,
                pointerEvents: questions.length > 0 ? 'auto' : 'none'
              }}
              disabled={questions.length === 0}
            >
              Next →
            </button>
          </div>
        </div>
      )}
      
      {activeStep === 3 && (
        <div className="questions-section" style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '30px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px'
          }}>
            <h2 style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#333',
              margin: 0
            }}>Create Questions</h2>
            <button 
              onClick={handleAddQuestion}
              style={{
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                minWidth: 'auto',
                width: 'auto'
              }}
            >
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>+</span> Add Question
            </button>
          </div>
          
          {questions.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 0',
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
            }}>
              <div style={{
                width: '52px',
                height: '52px',
                background: '#e5e7eb',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '22px',
                color: '#9ca3af'
              }}>?</div>
              <p style={{ fontWeight: '600', color: '#4b5563', marginBottom: '8px' }}>No questions yet</p>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>Click the button above to add your first question</p>
              <button 
                onClick={handleAddQuestion}
                style={{
                  background: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  minWidth: 'auto',
                  width: 'auto'
                }}
              >
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>+</span> Add Question
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {questions.map((question, index) => {
                // Determine question interface based on selected format
                if (selectedFormat === 'multiple-choice') {
                  // Multiple choice interface
                  return (
                    <div key={question.id} style={{
                      padding: '28px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      background: '#fff',
                      position: 'relative',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                      transition: 'box-shadow 0.2s ease'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '24px',
                        paddingBottom: '14px',
                        borderBottom: '1px solid #f0f0f5'
                      }}>
                        <h3 style={{ 
                          margin: 0, 
                          fontSize: '16px', 
                          fontWeight: '600', 
                          color: '#4b5563',
                          display: 'flex',
                          alignItems: 'center',
                          letterSpacing: '0.01em'
                        }}><span>Question</span><span style={{marginLeft: '5px', fontWeight: '500'}}>{index + 1}:</span></h3>
                        <button 
                          onClick={() => handleDeleteQuestion(question.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ef4444',
                            transition: 'color 0.2s ease',
                            position: 'absolute',
                            right: '4px',
                            left: '500px',
                            top: '24px'
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4b5563', marginBottom: '6px' }}>Question Text</label>
                        <textarea 
                          value={question.text || ''}
                          onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                          placeholder="Enter your question here..."
                          style={{
                            width: '100%',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            padding: '12px',
                            fontSize: '14px',
                            minHeight: '80px',
                            resize: 'vertical'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4b5563', marginBottom: '10px' }}>Answer Options</label>
                        {/* Show 4 options with custom styled radio buttons */}
                        {[0, 1, 2, 3].map(i => (
                          <div key={i} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            marginBottom: '12px',
                            backgroundColor: question.correctOption === i ? '#f9f9ff' : 'white',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: question.correctOption === i ? '1px solid #4f46e5' : '1px solid #e5e7eb',
                            transition: 'all 0.2s ease'
                          }}>
                            <div 
                              onClick={() => handleQuestionChange(question.id, 'correctOption', i)}
                              style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                border: question.correctOption === i ? '2px solid #4f46e5' : '2px solid #d1d5db',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '12px',
                                cursor: 'pointer',
                                flexShrink: 0
                              }}
                            >
                              {question.correctOption === i && (
                                <div style={{ 
                                  width: '10px', 
                                  height: '10px', 
                                  borderRadius: '50%', 
                                  backgroundColor: '#4f46e5' 
                                }} />
                              )}
                            </div>
                            <input 
                              type="text" 
                              value={(question.options && question.options[i]) || ''}
                              onChange={(e) => {
                                const newOptions = [...(question.options || ['', '', '', ''])];
                                newOptions[i] = e.target.value;
                                handleQuestionChange(question.id, 'options', newOptions);
                              }}
                              placeholder={`Option ${i + 1}`}
                              style={{
                                flex: 1,
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: '1px solid #d1d5db',
                                fontSize: '14px',
                                backgroundColor: '#fff'
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                } else if (selectedFormat === 'fill-blanks') {
                  // Fill in the blanks interface
                  return (
                    <div key={question.id} style={{
                      padding: '28px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      background: '#fff',
                      position: 'relative',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                      transition: 'box-shadow 0.2s ease'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '24px',
                        paddingBottom: '14px',
                        borderBottom: '1px solid #f0f0f5'
                      }}>
                        <h3 style={{ 
                          margin: 0, 
                          fontSize: '16px', 
                          fontWeight: '600', 
                          color: '#4b5563',
                          display: 'flex',
                          alignItems: 'center',
                          letterSpacing: '0.01em'
                        }}><span>Question</span><span style={{marginLeft: '5px', fontWeight: '500'}}>{index + 1}:</span></h3>
                        <button 
                          onClick={() => handleDeleteQuestion(question.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ef4444',
                            transition: 'color 0.2s ease',
                            position: 'absolute',
                            right: '4px',
                            left: '500px',
                            top: '24px'
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4b5563', marginBottom: '6px' }}>Question Text</label>
                        <textarea 
                          value={question.text || ''}
                          onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                          placeholder="Enter your question here..."
                          style={{
                            width: '100%',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            padding: '12px',
                            fontSize: '14px',
                            minHeight: '80px',
                            resize: 'vertical'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4b5563', marginBottom: '10px' }}>Correct Answer</label>
                        <div style={{ position: 'relative' }}>
                          <input 
                            type="text" 
                            value={question.correctAnswer || ''}
                            onChange={(e) => handleQuestionChange(question.id, 'correctAnswer', e.target.value)}
                            placeholder="Enter the correct answer"
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              border: '1px solid #d1d5db',
                              fontSize: '14px',
                              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.2s ease',
                              outline: 'none',
                              backgroundColor: '#fff'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#4f46e5';
                              e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                              // Keep background color consistent
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#d1d5db';
                              e.target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                            }}
                          />
                        </div>
                        <div style={{ 
                          backgroundColor: '#f9fafb', 
                          padding: '12px 16px', 
                          borderRadius: '8px',
                          borderLeft: '3px solid #4f46e5'
                        }}>
                          <p style={{ margin: '0', fontSize: '13px', color: '#6b7280' }}>
                            <span style={{ color: '#4f46e5', fontWeight: '600', marginRight: '5px' }}>Tip:</span>
                            Use underscores in your question to indicate blanks (e.g., "The capital of France is _____")
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                } else if (selectedFormat === 'true-false') {
                  // True/False interface
                  return (
                    <div key={question.id} style={{
                      padding: '28px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      background: '#fff',
                      position: 'relative',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                      transition: 'box-shadow 0.2s ease'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '24px',
                        paddingBottom: '14px',
                        borderBottom: '1px solid #f0f0f5'
                      }}>
                        <h3 style={{ 
                          margin: 0, 
                          fontSize: '16px', 
                          fontWeight: '600', 
                          color: '#4b5563',
                          display: 'flex',
                          alignItems: 'center',
                          letterSpacing: '0.01em'
                        }}><span>Question</span><span style={{marginLeft: '5px', fontWeight: '500'}}>{index + 1}:</span></h3>
                        <button 
                          onClick={() => handleDeleteQuestion(question.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ef4444',
                            transition: 'color 0.2s ease',
                            position: 'absolute',
                            right: '4px',
                            left: '500px',
                            top: '24px'
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4b5563', marginBottom: '6px' }}>Question Text</label>
                        <textarea 
                          value={question.text || ''}
                          onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                          placeholder="Enter your question here..."
                          style={{
                            width: '100%',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            padding: '12px',
                            fontSize: '14px',
                            minHeight: '80px',
                            resize: 'vertical'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#4f46e5';
                            e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#d1d5db';
                            e.target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4b5563', marginBottom: '10px' }}>Correct Answer</label>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <div 
                            onClick={() => handleQuestionChange(question.id, 'correctAnswer', true)}
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              padding: '10px 16px',
                              borderRadius: '8px',
                              border: question.correctAnswer === true ? '1px solid #4f46e5' : '1px solid #e5e7eb',
                              backgroundColor: question.correctAnswer === true ? '#f9f9ff' : '#fff',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              minWidth: '100px',
                              justifyContent: 'center'
                            }}
                          >
                            <div style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              border: question.correctAnswer === true ? '2px solid #4f46e5' : '2px solid #d1d5db',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: '8px',
                            }}>
                              {question.correctAnswer === true && (
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#4f46e5' }} />
                              )}
                            </div>
                            <span style={{ fontWeight: question.correctAnswer === true ? '600' : '400' }}>True</span>
                          </div>
                          
                          <div 
                            onClick={() => handleQuestionChange(question.id, 'correctAnswer', false)}
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              padding: '10px 16px',
                              borderRadius: '8px',
                              border: question.correctAnswer === false ? '1px solid #4f46e5' : '1px solid #e5e7eb',
                              backgroundColor: question.correctAnswer === false ? '#f9f9ff' : '#fff',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              minWidth: '100px',
                              justifyContent: 'center'
                            }}
                          >
                            <div style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              border: question.correctAnswer === false ? '2px solid #4f46e5' : '2px solid #d1d5db',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: '8px',
                            }}>
                              {question.correctAnswer === false && (
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#4f46e5' }} />
                              )}
                            </div>
                            <span style={{ fontWeight: question.correctAnswer === false ? '600' : '400' }}>False</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else if (selectedFormat === 'guess-word') {
                  // Guess the Word interface
                  return (
                    <div key={question.id} style={{
                      padding: '28px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      background: '#fff',
                      position: 'relative',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                      transition: 'box-shadow 0.2s ease'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '24px',
                        paddingBottom: '14px',
                        borderBottom: '1px solid #f0f0f5'
                      }}>
                        <h3 style={{ 
                          margin: 0, 
                          fontSize: '16px', 
                          fontWeight: '00', 
                          color: '#333',
                          display: 'flex',
                          alignItems: 'center'
                        }}><span>Question</span><span style={{marginLeft: '5px'}}>{index + 1}:</span></h3>
                        <button 
                          onClick={() => handleDeleteQuestion(question.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ef4444',
                            transition: 'color 0.2s ease',
                            position: 'absolute',
                            right: '4px',
                            left: '500px',  
                            top: '24px'
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4b5563', marginBottom: '6px' }}>Question Text</label>
                        <textarea 
                          value={question.text || ''}
                          onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                          placeholder="Enter your question here..."
                          style={{
                            width: '100%',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            padding: '12px',
                            fontSize: '14px',
                            minHeight: '80px',
                            resize: 'vertical'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#4f46e5';
                            e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#d1d5db';
                            e.target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4b5563', marginBottom: '10px' }}>Correct Answer</label>
                        <div style={{ position: 'relative' }}>
                          <input 
                            type="text" 
                            value={question.correctAnswer || ''}
                            onChange={(e) => handleQuestionChange(question.id, 'correctAnswer', e.target.value)}
                            placeholder="Enter the word students need to guess"
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              border: '1px solid #d1d5db',
                              fontSize: '14px',
                              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.2s ease',
                              outline: 'none'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#4f46e5';
                              e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#d1d5db';
                              e.target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                            }}
                          />
                        </div>
                        <div style={{ 
                          backgroundColor: '#f9fafb', 
                          padding: '12px 16px', 
                          borderRadius: '8px',
                          borderLeft: '3px solid #4f46e5',
                          marginTop: '14px'
                        }}>
                          <p style={{ margin: '0', fontSize: '13px', color: '#6b7280' }}>
                            <span style={{ color: '#4f46e5', fontWeight: '600', marginRight: '5px' }}>Hint:</span>
                            Make sure the question provides clear clues about the word to be guessed
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  // Default interface
                  return (
                    <div key={question.id} style={{
                      padding: '28px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      background: '#fff',
                      position: 'relative',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                      transition: 'box-shadow 0.2s ease'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '24px',
                        paddingBottom: '14px',
                        borderBottom: '1px solid #f0f0f5'
                      }}>
                        <h3 style={{ 
                          margin: 0, 
                          fontSize: '16px', 
                          fontWeight: '500', 
                          color: '#4b5563',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <span>Question</span><span style={{marginLeft: '5px'}}>{index + 1}:</span></h3>
                        <button 
                          onClick={() => handleDeleteQuestion(question.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ef4444',
                            transition: 'color 0.2s ease',
                            position: 'absolute',
                            right: '4px',
                            left: '500px',
                            top: '24px'
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#4b5563', marginBottom: '6px' }}>Question Text</label>
                        <textarea 
                          value={question.text || ''}
                          onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                          placeholder="Enter your question here..."
                          style={{
                            width: '100%',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            padding: '12px',
                            fontSize: '14px',
                            minHeight: '80px',
                            resize: 'vertical'
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          )}
          
          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
            <button 
              onClick={handlePrev}
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: '500',
                color: '#4b5563',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                width: 'auto',
                minWidth: 'auto'
              }}
            >
              ← Previous
            </button>
            <button 
              onClick={handleNext}
              style={{
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                width: 'auto',
                minWidth: 'auto',
                opacity: questions.length > 0 ? 1 : 0.7,
                pointerEvents: questions.length > 0 ? 'auto' : 'none'
              }}
              disabled={questions.length === 0}
            >
              Next →
            </button>
          </div>
        </div>
      )}
      
      {/* Settings Section */}
      {activeStep === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '8px' }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#374151', 
            margin: '0 0 24px 0' 
          }}>
            Assignment Settings
          </h2>
          
          {/* Time Settings Card */}
          <div style={{ 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: '24px', 
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#4b5563', 
              margin: '0 0 20px 0' 
            }}>
              Time Settings
            </h3>
            
            {/* Time Limit and Multiple Attempts side by side */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between', 
              marginBottom: '20px'
            }}>
              {/* Time Limit */}
              <div style={{ width: '47%' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#4b5563', 
                  marginBottom: '8px' 
                }}>
                  Time Limit (minutes)
                </label>
                <input 
                  type="number" 
                  value={timeLimit}
                  onChange={handleTimeLimitChange}
                  min="1"
                  style={{ 
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }} 
                />
              </div>

              {/* Multiple Attempts - aligned to the right */}
              <div style={{ width: '47%', display: 'flex', flexDirection: 'column' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#4b5563', 
                  marginBottom: '8px' 
                }}>
                  Allow Multiple Attempts
                </label>
                <div 
                  onClick={handleMultipleAttemptsToggle}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    cursor: 'pointer' 
                  }}
                >
                  <div style={{ 
                    width: '36px', 
                    height: '20px', 
                    backgroundColor: allowMultipleAttempts ? '#4f46e5' : '#e5e7eb', 
                    borderRadius: '20px',
                    position: 'relative',
                    transition: 'background-color 0.2s'
                  }}>
                    <div style={{ 
                      width: '16px', 
                      height: '16px', 
                      backgroundColor: 'white', 
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '2px',
                      left: allowMultipleAttempts ? '18px' : '2px',
                      transition: 'left 0.2s'
                    }}></div>
                  </div>
                  <span style={{ 
                    fontSize: '14px', 
                    color: '#4b5563' 
                  }}>{allowMultipleAttempts ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            {/* Number of Attempts - Only show if multiple attempts is allowed */}
            {allowMultipleAttempts && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#4b5563', 
                  marginBottom: '8px' 
                }}>
                  Number of Attempts Allowed
                </label>
                <input 
                  type="number" 
                  value={numberOfAttempts}
                  onChange={handleAttemptsNumberChange}
                  min="1"
                  style={{ 
                    width: '100%',
                    height: '40px',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }} 
                />
              </div>
            )}

            {/* Date Settings */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '5px'
            }}>
              {/* Start Date */}
              <div style={{ width: '47%' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#4b5563', 
                  marginBottom: '8px' 
                }}>
                  Start Date
                </label>
                <div style={{ 
                  position: 'relative', 
                  width: '100%' 
                }}>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={handleStartDateChange}
                    ref={startDateRef}
                    style={{ 
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }} 
                  />
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: '50%', 
                      right: '12px', 
                      transform: 'translateY(-50%)', 
                      cursor: 'pointer' 
                    }}
                    onClick={() => startDateRef.current && startDateRef.current.showPicker ? startDateRef.current.showPicker() : startDateRef.current && startDateRef.current.focus()}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Due Date */}
              <div style={{ width: '47%' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#4b5563', 
                  marginBottom: '8px' 
                }}>
                  Due Date
                </label>
                <div style={{ 
                  position: 'relative', 
                  width: '100%' 
                }}>
                  <input 
                    type="date" 
                    value={dueDate}
                    onChange={handleDueDateChange}
                    ref={dueDateRef}
                    style={{ 
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }} 
                  />
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: '50%', 
                      right: '12px', 
                      transform: 'translateY(-50%)', 
                      cursor: 'pointer' 
                    }}
                    onClick={() => dueDateRef.current && dueDateRef.current.showPicker ? dueDateRef.current.showPicker() : dueDateRef.current && dueDateRef.current.focus()}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Instructions Card */}
          <div style={{ 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: '24px', 
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#4b5563', 
              margin: '0 0 20px 0' 
            }}>
              Instructions
            </h3>
            <textarea 
              placeholder="Enter instructions for students..."
              value={instructions}
              onChange={handleInstructionsChange}
              style={{ 
                width: '100%',
                minHeight: '120px',
                height: '120px',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                resize: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }} 
            />
          </div>
          
          {/* Navigation Buttons */}
          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
            <button 
              onClick={handlePrev}
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: '500',
                color: '#4b5563',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                width: 'auto',
                minWidth: 'auto'
              }}
            >
              ← Previous
            </button>
            <button 
              onClick={handleNext}
              style={{
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                width: 'auto',
                minWidth: 'auto'
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
      
      {/* Review Section */}
      {activeStep === 5 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '8px' }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#374151', 
            margin: '0 0 24px 0' 
          }}>
            Review Assignment
          </h2>
          
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {/* Assignment Details - Left Side */}
            <div style={{ flex: '1', minWidth: '300px' }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#4b5563', 
                margin: '0 0 16px 0' 
              }}>
                Assignment Details
              </h3>
              
              {/* Subject */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Subject:</div>
                <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{selectedSubject}</div>
              </div>
              
              {/* Assignment Type */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Assignment Type</div>
                <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{selectedType}</div>
              </div>
              
              {/* Quiz Format - only show if type is Quiz */}
              {selectedType === 'Quiz' && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Quiz Format:</div>
                  <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>
                    {selectedFormat === 'multiple-choice' && 'Multiple Choice'}
                    {selectedFormat === 'fill-blanks' && 'Fill in the Blanks'}
                    {selectedFormat === 'true-false' && 'True/False'}
                    {selectedFormat === 'guess-word' && 'Guess the Word'}
                  </div>
                </div>
              )}
              
              {/* Number of Questions */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Number of Questions:</div>
                <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{questions.length}</div>
              </div>
              
              {/* Time Limit */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Time Limit:</div>
                <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{timeLimit} minutes</div>
              </div>
              
              {/* Attempts Allowed */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Attempts Allowed</div>
                <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{allowMultipleAttempts ? numberOfAttempts : 1}</div>
              </div>
              
              {/* Available From */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Available From</div>
                <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{startDate || 'Not set'}</div>
              </div>
              
              {/* Due Date */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Due Date</div>
                <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{dueDate || 'Not set'}</div>
              </div>
            </div>
            
            {/* Preview - Right Side */}
            <div style={{ flex: '1', minWidth: '300px' }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#4b5563', 
                margin: '0 0 16px 0' 
              }}>
                Preview
              </h3>
              
              {/* Questions Preview */}
              <div style={{ 
                backgroundColor: '#f9fafb', 
                borderRadius: '8px', 
                padding: '16px',
                marginBottom: '24px'
              }}>
                {questions.length > 0 ? (
  <div>
    {questions.map((q, idx) => (
      <div key={q.id} style={{ marginBottom: '18px', borderBottom: '1px solid #ececec', paddingBottom: '12px' }}>
        <div style={{ fontSize: '15px', fontWeight: '500', marginBottom: '8px' }}>
          Question {idx + 1}
        </div>
        <div style={{ fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>
          {q.text || 'No question text provided'}
        </div>
        {selectedFormat === 'fill-blanks' && (
          <div style={{ color: '#10b981', fontWeight: '500', fontSize: '14px' }}>
            Answer: {q.correctAnswer || 'Not set'}
          </div>
        )}
        {selectedFormat === 'multiple-choice' && q.correctOption !== null && (
          <div style={{ color: '#10b981', fontWeight: '500', fontSize: '14px' }}>
            Answer: {q.options && q.options[q.correctOption]}
          </div>
        )}
        {selectedFormat === 'true-false' && (
          <div style={{ color: '#10b981', fontWeight: '500', fontSize: '14px' }}>
            Answer: {q.correctAnswer === true ? 'True' : q.correctAnswer === false ? 'False' : 'Not set'}
          </div>
        )}
        {selectedFormat === 'guess-word' && (
          <div style={{ color: '#10b981', fontWeight: '500', fontSize: '14px' }}>
            Answer: {q.correctAnswer || 'Not set'}
          </div>
        )}
      </div>
    ))}
  </div>
) : (
                  <div style={{ textAlign: 'center', color: '#6b7280', padding: '20px 0' }}>
                    No questions added yet
                  </div>
                )}
              </div>
              
              {/* Students Table */}
              <div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: '500' }}>No</th>
                      <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: '500' }}>NAME</th>
                      <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: '500' }}>Grade</th>
                      <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: '500' }}>SUBJECT</th>
                      <th style={{ textAlign: 'center', padding: '8px 12px', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontWeight: '500' }}>Chosen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, idx) => (
                      <tr key={student.no} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f9fafb' }}>
                        <td style={{ padding: '10px 12px', color: '#1f2937' }}>{student.no}</td>
                        <td style={{ padding: '10px 12px', color: '#1f2937' }}>{student.name}</td>
                        <td style={{ padding: '10px 12px', color: '#1f2937' }}>{student.grade}</td>
                        <td style={{ padding: '10px 12px', color: '#1f2937' }}>{student.subject}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', justifyContent: 'center' }}>
                            <div style={{ 
                              width: '20px', 
                              height: '20px', 
                              backgroundColor: checked[idx] ? '#10b981' : 'transparent', 
                              border: checked[idx] ? '1px solid #10b981' : '1px solid #d1d5db',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white'
                            }}>
                              {checked[idx] && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
            <button 
              onClick={handlePrev}
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: '500',
                color: '#4b5563',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                width: 'auto',
                minWidth: 'auto'
              }}
            >
              ← Previous
            </button>
            <button 
              onClick={handleNext}
              style={{
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                width: 'auto',
                minWidth: 'auto'
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Publish Section */}
      {activeStep === 6 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '8px' }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#374151', 
            margin: '0 0 24px 0' 
          }}>
            Publish Assignment
          </h2>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#ecfdf5',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
              </svg>
            </div>
            
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
              Ready to Publish
            </h3>
            
            <p style={{ fontSize: '14px', color: '#6b7280', maxWidth: '450px', margin: '0 0 30px 0' }}>
              Your assignment has been created and is ready to be published. Once published, it will be available to the selected students based on the schedule you've set.
            </p>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={handlePrev}
                style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#4b5563',
                  cursor: 'pointer'
                }}
              >
                Back to Review
              </button>
              
              <button 
                onClick={() => alert('Assignment published successfully!')}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Publish Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
