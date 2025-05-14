import React, { useState, useEffect } from 'react';
import './StudentUploadModule.css';

const StudentUploadModule = ({ onClose, onSave }) => {
  const [units, setUnits] = useState([
    {
      id: 1,
      title: '',
      summary: '',
      description: '',
      lessons: [
        {
          id: 1,
          title: '',
          description: '',
          resources: {
            image: null,
            video: null,
            file: null
          }
        }
      ]
    }
  ]);
  
  const [activeUnit, setActiveUnit] = useState(0);
  const [uploadProgress, setUploadProgress] = useState({});

  // Simulate upload progress animation
  useEffect(() => {
    const progressTimers = {};
    
    Object.keys(uploadProgress).forEach(key => {
      if (uploadProgress[key].progress < 100 && !uploadProgress[key].completed) {
        progressTimers[key] = setInterval(() => {
          setUploadProgress(prev => {
            const current = prev[key].progress;
            const nextProgress = Math.min(current + 5, 100);
            const completed = nextProgress === 100;
            
            if (completed && progressTimers[key]) {
              clearInterval(progressTimers[key]);
            }
            
            return {
              ...prev,
              [key]: {
                ...prev[key],
                progress: nextProgress,
                completed
              }
            };
          });
        }, 300);
      }
    });
    
    return () => {
      Object.values(progressTimers).forEach(timer => clearInterval(timer));
    };
  }, [uploadProgress]);

  // Handle unit title change
  const handleUnitTitleChange = (id, value) => {
    setUnits(units.map(unit => 
      unit.id === id ? { ...unit, title: value } : unit
    ));
  };

  // Handle unit summary change
  const handleUnitSummaryChange = (id, value) => {
    setUnits(units.map(unit => 
      unit.id === id ? { ...unit, summary: value } : unit
    ));
  };

  // Handle unit description change
  const handleUnitDescriptionChange = (id, value) => {
    setUnits(units.map(unit => 
      unit.id === id ? { ...unit, description: value } : unit
    ));
  };

  // Handle lesson title change
  const handleLessonTitleChange = (unitId, lessonId, value) => {
    setUnits(units.map(unit => {
      if (unit.id === unitId) {
        return {
          ...unit,
          lessons: unit.lessons.map(lesson => 
            lesson.id === lessonId ? { ...lesson, title: value } : lesson
          )
        };
      }
      return unit;
    }));
  };

  // Handle lesson description change
  const handleLessonDescriptionChange = (unitId, lessonId, value) => {
    setUnits(units.map(unit => {
      if (unit.id === unitId) {
        return {
          ...unit,
          lessons: unit.lessons.map(lesson => 
            lesson.id === lessonId ? { ...lesson, description: value } : lesson
          )
        };
      }
      return unit;
    }));
  };

  // Handle resource upload
  const handleResourceUpload = (unitId, lessonId, resourceType, file) => {
    // Create a unique key for this upload
    const uploadKey = `${unitId}_${lessonId}_${resourceType}_${Date.now()}`;
    
    // Initialize progress for this upload
    setUploadProgress(prev => ({
      ...prev,
      [uploadKey]: {
        file,
        progress: 0,
        completed: false
      }
    }));
    
    // Update the lesson with the file
    setUnits(units.map(unit => {
      if (unit.id === unitId) {
        return {
          ...unit,
          lessons: unit.lessons.map(lesson => {
            if (lesson.id === lessonId) {
              return {
                ...lesson,
                resources: {
                  ...lesson.resources,
                  [resourceType]: {
                    file,
                    uploadKey
                  }
                }
              };
            }
            return lesson;
          })
        };
      }
      return unit;
    }));
  };

  // Handle cancel upload
  const handleCancelUpload = (unitId, lessonId, resourceType) => {
    // Find the unit and lesson
    const unit = units.find(u => u.id === unitId);
    if (!unit) return;
    
    const lesson = unit.lessons.find(l => l.id === lessonId);
    if (!lesson || !lesson.resources[resourceType]) return;
    
    // Get the upload key
    const uploadKey = lesson.resources[resourceType].uploadKey;
    
    // Remove the upload progress
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[uploadKey];
      return newProgress;
    });
    
    // Update the lesson
    setUnits(units.map(unit => {
      if (unit.id === unitId) {
        return {
          ...unit,
          lessons: unit.lessons.map(lesson => {
            if (lesson.id === lessonId) {
              return {
                ...lesson,
                resources: {
                  ...lesson.resources,
                  [resourceType]: null
                }
              };
            }
            return lesson;
          })
        };
      }
      return unit;
    }));
  };

  // Add a new lesson to a unit
  const handleAddLesson = (unitId) => {
    const unit = units.find(u => u.id === unitId);
    if (!unit) return;
    
    const newLessonId = unit.lessons.length > 0 
      ? Math.max(...unit.lessons.map(l => l.id)) + 1 
      : 1;
    
    setUnits(units.map(unit => {
      if (unit.id === unitId) {
        return {
          ...unit,
          lessons: [
            ...unit.lessons,
            {
              id: newLessonId,
              title: '',
              description: '',
              resources: {
                image: null,
                video: null,
                file: null
              }
            }
          ]
        };
      }
      return unit;
    }));
    
    // Scroll to the new lesson after it's added
    setTimeout(() => {
      const newLessonElement = document.getElementById(`lesson-${unitId}-${newLessonId}`);
      if (newLessonElement) {
        newLessonElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add a highlight effect
        newLessonElement.style.transition = 'background-color 1s';
        newLessonElement.style.backgroundColor = '#f0f7ff';
        setTimeout(() => {
          newLessonElement.style.backgroundColor = 'transparent';
        }, 1500);
      }
    }, 100);
  };

  // Add a new description section
  const handleAddDescription = (unitId) => {
    // Implementation similar to adding a lesson
    console.log("Adding description to unit", unitId);
    // For now, this is just a placeholder
  };

  // Cancel a lesson
  const handleCancelLesson = (unitId, lessonId) => {
    // Create a fade-out effect before removing
    const lessonElement = document.getElementById(`lesson-${unitId}-${lessonId}`);
    if (lessonElement) {
      lessonElement.style.transition = 'opacity 0.3s, transform 0.3s';
      lessonElement.style.opacity = '0';
      lessonElement.style.transform = 'translateY(-10px)';
      
      // Wait for animation to complete before removing
      setTimeout(() => {
        setUnits(units.map(unit => {
          if (unit.id === unitId) {
            // If it's the last lesson, just reset it instead of removing
            if (unit.lessons.length === 1) {
              return {
                ...unit,
                lessons: [{
                  id: 1,
                  title: '',
                  description: '',
                  resources: {
                    image: null,
                    video: null,
                    file: null
                  }
                }]
              };
            }
            
            // Otherwise, filter out the lesson
            return {
              ...unit,
              lessons: unit.lessons.filter(lesson => lesson.id !== lessonId)
            };
          }
          return unit;
        }));
      }, 300);
    }
  };

  // Cancel a description
  const handleCancelDescription = (unitId) => {
    console.log("Canceling description for unit", unitId);
    // Implementation would be similar to canceling a lesson
  };

  // Save as draft
  const handleSaveAsDraft = () => {
    onSave({ status: 'draft', units });
    onClose();
  };

  // Save and continue
  const handleSaveAndContinue = () => {
    onSave({ status: 'complete', units });
    onClose();
  };

  // Render the current unit
  const renderUnit = (unit) => {
    return (
      <div key={unit.id} className="student-upload-unit">
        <div className="unit-header">
          <div className="unit-title-row">
            <label>Unit {unit.id}</label>
            <input
              type="text"
              className="unit-title-input"
              placeholder="Enter Unit title"
              value={unit.title}
              onChange={(e) => handleUnitTitleChange(unit.id, e.target.value)}
            />
          </div>
          
          <div className="unit-description-section">
            <label>Subject Description</label>
            <textarea
              className="unit-description-input"
              placeholder="Enter subject description"
              value={unit.description}
              onChange={(e) => handleUnitDescriptionChange(unit.id, e.target.value)}
            />
          </div>
        </div>
        
        {unit.lessons.map((lesson) => (
          <div 
            key={lesson.id} 
            id={`lesson-${unit.id}-${lesson.id}`}
            className="lesson-block"
          >
            <div className="lesson-header">
              <label>Lessons{lesson.id}</label>
              <input
                type="text"
                className="lesson-title-input"
                placeholder="Enter lesson title"
                value={lesson.title}
                onChange={(e) => handleLessonTitleChange(unit.id, lesson.id, e.target.value)}
              />
            </div>
            
            <textarea
              className="lesson-description-input"
              placeholder="Enter description"
              value={lesson.description}
              onChange={(e) => handleLessonDescriptionChange(unit.id, lesson.id, e.target.value)}
            />
            
            <div className="resource-upload-section">
              <div className="resource-upload-container">
                <div 
                  className="resource-dropzone"
                  onClick={() => document.getElementById(`image-${unit.id}-${lesson.id}`).click()}
                >
                  <div className="resource-icon">🖼️</div>
                  <div className="resource-text">
                    Drag & Drop image or <span className="browse-text">browse</span>
                    <div className="file-formats">SVG, PNG, JPG or GIF (max 800 x 400)</div>
                  </div>
                  <input
                    id={`image-${unit.id}-${lesson.id}`}
                    type="file"
                    accept=".svg,.png,.jpg,.jpeg,.gif"
                    hidden
                    onChange={(e) => handleResourceUpload(unit.id, lesson.id, 'image', e.target.files[0])}
                  />
                </div>
                
                {lesson.resources.image && (
                  <div className="upload-progress">
                    <div className="upload-progress-header">
                      <div className="file-name">{lesson.resources.image.file.name}</div>
                      <button 
                        className="cancel-upload-btn"
                        onClick={() => handleCancelUpload(unit.id, lesson.id, 'image')}
                        title="Remove file"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${uploadProgress[lesson.resources.image.uploadKey]?.progress || 0}%` 
                        }}
                      ></div>
                    </div>
                    <div className="progress-text">
                      {uploadProgress[lesson.resources.image.uploadKey]?.progress || 0}%
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="lesson-actions-container">
              <button 
                className="add-more-btn"
                onClick={() => handleAddLesson(unit.id)}
              >
                + Add More Lessons
              </button>
              <button 
                className="cancel-lesson-btn"
                onClick={() => handleCancelLesson(unit.id, lesson.id)}
              >
                Cancel lesson
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render the summary and description section
  const renderSummarySection = (unit) => {
    return (
      <div key={`summary-${unit.id}`} className="summary-section">
        <div className="summary-row">
          <label>Summary Unit {unit.id}</label>
          <textarea
            className="summary-input"
            placeholder="Enter Summary description"
            value={unit.summary}
            onChange={(e) => handleUnitSummaryChange(unit.id, e.target.value)}
          />
        </div>
        
        <div className="description-row">
          <label>Description</label>
          <input
            type="text"
            className="description-title-input"
            placeholder="Enter title of description"
            value={unit.description}
            onChange={(e) => handleUnitDescriptionChange(unit.id, e.target.value)}
          />
        </div>
        
        <div className="resource-upload-row">
          <div className="resource-upload-container">
            <div 
              className="resource-dropzone"
              onClick={() => document.getElementById(`summary-image-${unit.id}`).click()}
            >
              <div className="resource-icon">🖼️</div>
              <div className="resource-text">
                Drag & Drop image or <span className="browse-text">browse</span>
                <div className="file-formats">SVG, PNG, JPG or GIF (max 800 x 400)</div>
              </div>
              <input
                id={`summary-image-${unit.id}`}
                type="file"
                accept=".svg,.png,.jpg,.jpeg,.gif"
                hidden
                onChange={(e) => console.log('Upload image', e.target.files[0])}
              />
            </div>
          </div>
          
          <div className="resource-upload-container">
            <div 
              className="resource-dropzone"
              onClick={() => document.getElementById(`summary-video-${unit.id}`).click()}
            >
              <div className="resource-icon">🎬</div>
              <div className="resource-text">
                Drag & Drop video or <span className="browse-text">browse</span>
                <div className="file-formats">MP4, AVI, MOV (max 100MB)</div>
              </div>
              <input
                id={`summary-video-${unit.id}`}
                type="file"
                accept=".mp4,.avi,.mov"
                hidden
                onChange={(e) => console.log('Upload video', e.target.files[0])}
              />
            </div>
          </div>
          
          <div className="resource-upload-container">
            <div 
              className="resource-dropzone"
              onClick={() => document.getElementById(`summary-file-${unit.id}`).click()}
            >
              <div className="resource-icon">📄</div>
              <div className="resource-text">
                Drag & Drop file or <span className="browse-text">browse</span>
                <div className="file-formats">PDF, DOC, DOCX (max 10MB)</div>
              </div>
              <input
                id={`summary-file-${unit.id}`}
                type="file"
                accept=".pdf,.doc,.docx"
                hidden
                onChange={(e) => console.log('Upload file', e.target.files[0])}
              />
            </div>
          </div>
        </div>
        
        <div className="add-cancel-row">
          <button 
            className="add-more-description-btn"
            onClick={() => handleAddDescription(unit.id)}
          >
            + Add More Description
          </button>
          
          <button 
            className="cancel-description-btn"
            onClick={() => handleCancelDescription(unit.id)}
          >
            Cancel Description
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="student-upload-modal-bg">
      <div className="student-upload-modal-content">
        <h2 className="student-upload-header">Upload Module</h2>
        
        <div className="student-upload-tabs">
          <button 
            className={`tab-btn ${activeUnit === 0 ? 'active' : ''}`}
            onClick={() => setActiveUnit(0)}
          >
            Unit
          </button>
          <button 
            className={`tab-btn ${activeUnit === 1 ? 'active' : ''}`}
            onClick={() => setActiveUnit(1)}
          >
            Summary
          </button>
        </div>
        
        <div className="student-upload-content">
          {activeUnit === 0 ? (
            units.map(unit => renderUnit(unit))
          ) : (
            units.map(unit => renderSummarySection(unit))
          )}
        </div>
        
        <div className="student-upload-footer">
          <button 
            className="save-draft-btn"
            onClick={handleSaveAsDraft}
          >
            Save as Draft
          </button>
          <button 
            className="save-continue-btn"
            onClick={handleSaveAndContinue}
          >
            Save/Continue →
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentUploadModule;
