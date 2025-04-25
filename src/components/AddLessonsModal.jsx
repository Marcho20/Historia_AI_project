import React, { useState } from 'react';
import './UploadModule.css';

// Simulate upload progress for demonstration
function useFakeUpload(file) {
  const [progress, setProgress] = useState(file ? 100 : 0);
  return progress;
}

export default function AddLessonsModal({ open, onClose, subject }) {
  const [lessons, setLessons] = useState([
    { title: '', description: '', cover: null, video: null, handout: null }
  ]);

  if (!open) return null;

  const handleLessonChange = (idx, field, value) => {
    const updated = lessons.map((lesson, i) =>
      i === idx ? { ...lesson, [field]: value } : lesson
    );
    setLessons(updated);
  };

  const handleFileChange = (idx, field, file) => {
    const updated = lessons.map((lesson, i) =>
      i === idx ? { ...lesson, [field]: file } : lesson
    );
    setLessons(updated);
  };

  const addLesson = () => {
    setLessons([...lessons, { title: '', description: '', cover: null, video: null, handout: null }]);
  };

  const removeLesson = idx => {
    setLessons(lessons.filter((_, i) => i !== idx));
  };

  return (
    <div className="upload-module-overlay">
      <div className="upload-module-content add-lessons-modal">
        <div className="add-lessons-header-row">
          <div className="add-lessons-header-title">Upload Module</div>
          <button className="add-lessons-add-btn" onClick={addLesson}>+ Add Lessons</button>
        </div>
        <div className="add-lessons-subject-row">
          <span className="add-lessons-subject-label">Subject Title:</span> <span className="add-lessons-subject-value">{subject?.name}</span>
        </div>
        {lessons.map((lesson, idx) => {
          const coverProgress = useFakeUpload(lesson.cover);
          const videoProgress = useFakeUpload(lesson.video);
          const handoutProgress = useFakeUpload(lesson.handout);
          return (
            <div className="lesson-block-card" key={idx}>
              <div className="lesson-block-header">
                <span className="lesson-block-title">Lesson: {idx + 1}</span>
                <button className="lesson-block-cancel" onClick={() => removeLesson(idx)}>✕</button>
              </div>
              <input
                className="lesson-title-input"
                placeholder="Lesson Title"
                value={lesson.title}
                onChange={e => handleLessonChange(idx, 'title', e.target.value)}
              />
              <div className="lesson-desc-label">Subject Description</div>
              <textarea
                className="lesson-desc-input"
                placeholder="Enter lesson description..."
                value={lesson.description}
                onChange={e => handleLessonChange(idx, 'description', e.target.value)}
              ></textarea>
              <div className="lesson-resources-row">
                <div className="lesson-resource-card">
                  <div className="lesson-resource-label">Cover Photo</div>
                  <div className="upload-dropzone">
                    <input
                      type="file"
                      accept="image/*"
                      id={`cover-upload-${idx}`}
                      style={{ display: 'none' }}
                      onChange={e => handleFileChange(idx, 'cover', e.target.files[0])}
                    />
                    <label htmlFor={`cover-upload-${idx}`} className="upload-dropzone-label">
                      <span className="upload-dropzone-icon">🖼️</span>
                      <span>Drag & Drop image or <span className="upload-dropzone-link">Browser</span></span>
                      <span className="upload-dropzone-note">SVG, PNG, JPG or GIF (max 350 x 250)</span>
                    </label>
                  </div>
                  {lesson.cover && (
                    <div className="upload-progress-bar">
                      <span className="upload-progress-filename">{lesson.cover.name}</span>
                      <div className="upload-progress-track">
                        <div className="upload-progress-fill" style={{ width: `${coverProgress}%` }}></div>
                      </div>
                      <span className="upload-progress-percent">{coverProgress}%</span>
                    </div>
                  )}
                </div>
                <div className="lesson-resource-card">
                  <div className="lesson-resource-label">Presentation Video</div>
                  <div className="upload-dropzone">
                    <input
                      type="file"
                      accept="video/*"
                      id={`video-upload-${idx}`}
                      style={{ display: 'none' }}
                      onChange={e => handleFileChange(idx, 'video', e.target.files[0])}
                    />
                    <label htmlFor={`video-upload-${idx}`} className="upload-dropzone-label">
                      <span className="upload-dropzone-icon">🎬</span>
                      <span>Drag & Drop video or <span className="upload-dropzone-link">Browser</span></span>
                      <span className="upload-dropzone-note">SVG, PNG, JPG or GIF (max 350 x 250)</span>
                    </label>
                  </div>
                  {lesson.video && (
                    <div className="upload-progress-bar">
                      <span className="upload-progress-filename">{lesson.video.name}</span>
                      <div className="upload-progress-track">
                        <div className="upload-progress-fill" style={{ width: `${videoProgress}%` }}></div>
                      </div>
                      <span className="upload-progress-percent">{videoProgress}%</span>
                    </div>
                  )}
                </div>
                <div className="lesson-resource-card">
                  <div className="lesson-resource-label">Handout</div>
                  <div className="upload-dropzone">
                    <input
                      type="file"
                      id={`handout-upload-${idx}`}
                      style={{ display: 'none' }}
                      onChange={e => handleFileChange(idx, 'handout', e.target.files[0])}
                    />
                    <label htmlFor={`handout-upload-${idx}`} className="upload-dropzone-label">
                      <span className="upload-dropzone-icon">📄</span>
                      <span>Drag & Drop file or <span className="upload-dropzone-link">Browser</span></span>
                      <span className="upload-dropzone-note">SVG, PNG, JPG or GIF (max 350 x 250)</span>
                    </label>
                  </div>
                  {lesson.handout && (
                    <div className="upload-progress-bar">
                      <span className="upload-progress-filename">{lesson.handout.name}</span>
                      <div className="upload-progress-track">
                        <div className="upload-progress-fill" style={{ width: `${handoutProgress}%` }}></div>
                      </div>
                      <span className="upload-progress-percent">{handoutProgress}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div className="add-lessons-actions-row">
          <button className="add-lessons-save-btn" onClick={onClose}>Save as Draft</button>
          <button className="add-lessons-save-btn primary" onClick={onClose}>Save/Continue →</button>
        </div>
      </div>
    </div>
  );
}
