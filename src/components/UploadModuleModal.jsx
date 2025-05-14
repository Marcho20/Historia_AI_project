import React from 'react';
import './UploadModuleModal.css';

// Default subject background patterns
const defaultBackgrounds = {
  'Math': 'linear-gradient(135deg, #8e44ad 0%, #3498db 100%)',
  'English': 'linear-gradient(135deg, #2ecc71 0%, #3498db 100%)',
  'Araling Panlipunan': 'linear-gradient(135deg, #e74c3c 0%, #f39c12 100%)'
};

export default function UploadModuleModal({ isOpen, onClose, subject, onAccept }) {
  if (!isOpen) return null;
  
  // Get default background based on subject name or use a generic one
  const getDefaultBackground = (subjectName) => {
    return defaultBackgrounds[subjectName] || 'linear-gradient(135deg, #7f8c8d 0%, #95a5a6 100%)';
  };
  
  return (
    <div className="upload-module-overlay">
      <div className="upload-module-content">
        <h2 className="upload-module-title">Upload Module</h2>
        
        <div className="upload-module-subject-container">
          <div className="upload-module-subject-background" style={{
            backgroundImage: subject.backgroundImage ? 
              `url(${subject.backgroundImage})` : 
              (subject.image ? `url(${subject.image})` : getDefaultBackground(subject.name)),
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            <div className="upload-module-subject-name">
              {subject.name}
            </div>
          </div>
        </div>
        
        <div className="upload-module-actions">
          <button 
            className="upload-module-btn upload-module-cancel-btn"
            onClick={onClose}
          >
            <span className="upload-module-btn-icon">✕</span>
            Cancel
          </button>
          <button 
            className="upload-module-btn upload-module-accept-btn"
            onClick={onAccept}
          >
            <span className="upload-module-btn-icon">✓</span>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
} 