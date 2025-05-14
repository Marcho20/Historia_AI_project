import React, { useState, useEffect } from 'react';
import { FaMedal, FaTrophy, FaAward, FaCertificate } from 'react-icons/fa';
import { getStudentBadges } from '../../firebase/badgeService';
import './StudentBadges.css';

const StudentBadges = ({ studentId }) => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showBadgeDetails, setShowBadgeDetails] = useState(false);

  useEffect(() => {
    const fetchStudentBadges = async () => {
      try {
        setLoading(true);
        // If studentId is not provided, try to get it from localStorage
        const user = JSON.parse(localStorage.getItem('user')) || {};
        const id = studentId || user.id;
        
        if (!id) {
          setError('Unable to identify student. Please log in again.');
          setLoading(false);
          return;
        }
        
        const badgesData = await getStudentBadges(id);
        setBadges(badgesData);
      } catch (error) {
        console.error('Error fetching student badges:', error);
        setError('Failed to load badges. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentBadges();
  }, [studentId]);

  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge);
    setShowBadgeDetails(true);
  };

  const getBadgeIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'achievement':
        return <FaTrophy className="badge-icon achievement" />;
      case 'excellence':
        return <FaAward className="badge-icon excellence" />;
      case 'milestone':
        return <FaCertificate className="badge-icon milestone" />;
      default:
        return <FaMedal className="badge-icon default" />;
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    // If it's a Firestore timestamp, convert to JS Date
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="student-badges-container">
      <div className="student-badges-header">
        <h2>My Achievement Badges</h2>
        <p className="badges-subtitle">
          Collect badges by completing activities and achieving excellence in your studies
        </p>
      </div>

      {error && <div className="badges-error-message">{error}</div>}

      {loading ? (
        <div className="badges-loading">Loading your badges...</div>
      ) : badges.length > 0 ? (
        <div className="student-badges-grid">
          {badges.map((badgeAward) => (
            <div 
              className="student-badge-card" 
              key={badgeAward.id}
              onClick={() => handleBadgeClick(badgeAward)}
              style={{ 
                borderColor: badgeAward.badge?.color || '#3498db',
                background: `linear-gradient(to bottom, white, white, ${badgeAward.badge?.color}10)`
              }}
            >
              <div 
                className="student-badge-image" 
                style={{ backgroundColor: badgeAward.badge?.color || '#3498db' }}
              >
                {badgeAward.badge?.imageUrl ? (
                  <img src={badgeAward.badge.imageUrl} alt={badgeAward.badge.name} />
                ) : (
                  getBadgeIcon(badgeAward.badge?.category)
                )}
              </div>
              <div className="student-badge-info">
                <h3>{badgeAward.badge?.name || 'Unknown Badge'}</h3>
                <p className="badge-date">Awarded: {formatDate(badgeAward.awardedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-badges-container">
          <div className="no-badges-icon">
            <FaMedal />
          </div>
          <h3>No Badges Yet</h3>
          <p>Complete activities and assignments to earn your first badge!</p>
        </div>
      )}

      {/* Badge Details Modal */}
      {showBadgeDetails && selectedBadge && (
        <div className="badge-details-overlay" onClick={() => setShowBadgeDetails(false)}>
          <div className="badge-details-modal" onClick={(e) => e.stopPropagation()}>
            <div 
              className="badge-details-header"
              style={{ backgroundColor: selectedBadge.badge?.color || '#3498db' }}
            >
              {selectedBadge.badge?.imageUrl ? (
                <img 
                  src={selectedBadge.badge.imageUrl} 
                  alt={selectedBadge.badge.name} 
                  className="badge-details-image"
                />
              ) : (
                <div className="badge-details-icon">
                  {getBadgeIcon(selectedBadge.badge?.category)}
                </div>
              )}
            </div>
            
            <div className="badge-details-content">
              <h2>{selectedBadge.badge?.name || 'Unknown Badge'}</h2>
              
              <div className="badge-details-info">
                <p className="badge-details-description">
                  {selectedBadge.badge?.description || 'No description available'}
                </p>
                
                {selectedBadge.badge?.criteria && (
                  <div className="badge-details-section">
                    <h4>Criteria:</h4>
                    <p>{selectedBadge.badge.criteria}</p>
                  </div>
                )}
                
                <div className="badge-details-section">
                  <h4>Category:</h4>
                  <p className="badge-category-tag" style={{ backgroundColor: selectedBadge.badge?.color || '#3498db' }}>
                    {selectedBadge.badge?.category || 'General'}
                  </p>
                </div>
                
                <div className="badge-details-section">
                  <h4>Awarded On:</h4>
                  <p>{formatDate(selectedBadge.awardedAt)}</p>
                </div>
                
                {selectedBadge.reason && (
                  <div className="badge-details-section">
                    <h4>Reason:</h4>
                    <p className="badge-reason">{selectedBadge.reason}</p>
                  </div>
                )}
              </div>
              
              <button 
                className="close-badge-details-btn"
                onClick={() => setShowBadgeDetails(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentBadges;
