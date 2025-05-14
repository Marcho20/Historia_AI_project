import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaMedal, 
  FaSearch,
  FaTimes,
  FaUpload,
  FaUser
} from 'react-icons/fa';
import { 
  getAllBadges, 
  createBadge, 
  updateBadge, 
  deleteBadge,
  awardBadgeToStudent,
  getStudentBadges
} from '../../firebase/badgeService';
import './BadgeList.css';

export const BadgeList = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [awardReason, setAwardReason] = useState('');
  const [currentBadge, setCurrentBadge] = useState({
    id: null,
    name: '',
    description: '',
    criteria: '',
    category: 'achievement', // Default category
    color: '#3498db', // Default color
    imageUrl: ''
  });
  const [selectedBadgeId, setSelectedBadgeId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');

  // Fetch badges on component mount
  useEffect(() => {
    fetchBadges();
    fetchStudents();
  }, []);

  // Fetch all badges from Firebase
  const fetchBadges = async () => {
    try {
      setLoading(true);
      const badgesData = await getAllBadges();
      setBadges(badgesData);
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching badges:', error);
      // Don't show error message on initial load
      // setError('Failed to load badges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Mock function to fetch students - replace with actual implementation
  const fetchStudents = async () => {
    try {
      // This should be replaced with your actual student fetching logic
      // For now, we'll use mock data
      const mockStudents = [
        { id: 'student1', name: 'John Doe', email: 'john@example.com' },
        { id: 'student2', name: 'Jane Smith', email: 'jane@example.com' },
        { id: 'student3', name: 'Alex Johnson', email: 'alex@example.com' },
      ];
      setStudents(mockStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open the modal for creating a new badge
  const handleAddBadge = () => {
    setCurrentBadge({
      id: null,
      name: '',
      description: '',
      criteria: '',
      category: 'achievement',
      color: '#3498db',
      imageUrl: ''
    });
    setImageFile(null);
    setImagePreview('');
    setModalMode('create');
    setShowModal(true);
  };

  // Open the modal for editing an existing badge
  const handleEditBadge = (badge) => {
    setCurrentBadge({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      criteria: badge.criteria || '',
      category: badge.category || 'achievement',
      color: badge.color || '#3498db',
      imageUrl: badge.imageUrl || ''
    });
    setImageFile(null);
    setImagePreview(badge.imageUrl || '');
    setModalMode('edit');
    setShowModal(true);
  };

  // Open the modal for awarding a badge to a student
  const handleAwardBadge = (badgeId) => {
    setSelectedBadgeId(badgeId);
    setSelectedStudentId('');
    setAwardReason('');
    setShowAwardModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBadge(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save a badge (create or update)
  const handleSaveBadge = async (e) => {
    e.preventDefault();
    console.log('Form submitted', currentBadge);
    
    try {
      setError('');
      
      // Validate form fields
      if (!currentBadge.name.trim()) {
        setError('Badge name is required');
        alert('Badge name is required');
        return;
      }
      
      if (!currentBadge.description.trim()) {
        setError('Badge description is required');
        alert('Badge description is required');
        return;
      }
      
      // Show loading indicator or disable button here if needed
      
      if (modalMode === 'create') {
        console.log('Creating new badge...');
        await createBadge(currentBadge, imageFile);
        console.log('Badge created successfully');
      } else {
        console.log('Updating badge...');
        await updateBadge(currentBadge.id, currentBadge, imageFile);
        console.log('Badge updated successfully');
      }
      
      await fetchBadges();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving badge:', error);
      setError('Failed to save badge: ' + (error.message || 'Please try again.'));
      alert('Failed to save badge: ' + (error.message || 'Please try again.'));
    }
  };

  // Delete a badge
  const handleDeleteBadge = async (badgeId) => {
    if (window.confirm('Are you sure you want to delete this badge?')) {
      try {
        await deleteBadge(badgeId);
        await fetchBadges();
      } catch (error) {
        console.error('Error deleting badge:', error);
        setError('Failed to delete badge. Please try again.');
      }
    }
  };

  // Award a badge to a student
  const handleAwardSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      
      if (!selectedStudentId) {
        setError('Please select a student');
        return;
      }
      
      // Get the current user (admin/teacher) ID - replace with your actual implementation
      const currentUserId = 'admin1'; // This should come from your auth context
      
      await awardBadgeToStudent(
        selectedBadgeId,
        selectedStudentId,
        currentUserId,
        awardReason
      );
      
      setShowAwardModal(false);
      alert('Badge awarded successfully!');
    } catch (error) {
      console.error('Error awarding badge:', error);
      setError('Failed to award badge. Please try again.');
    }
  };

  // Filter badges based on search query
  const filteredBadges = badges.filter(badge => 
    badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    badge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    badge.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="badge-management-container">
      <div className="badge-header">
        <h2>Badge Management</h2>
        <div className="header-controls">
          <div className="search-wrapper">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search badges by name, description or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          <div className="button-wrapper">
            <button className="add-badge-btn" onClick={handleAddBadge}>
              <FaPlus /> Create Badge
            </button>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner-icon"></div>
          <p>Loading badges...</p>
        </div>
      ) : (
        <div className="badges-grid">
          {filteredBadges.length > 0 ? (
            filteredBadges.map(badge => (
              <div className="badge-card" key={badge.id} style={{ borderColor: badge.color || '#401abe' }}>
                <div className="badge-image-container" style={{ backgroundColor: badge.color || '#401abe' }}>
                  {badge.imageUrl ? (
                    <img src={badge.imageUrl} alt={badge.name} className="badge-image" />
                  ) : (
                    <FaMedal className="badge-placeholder-icon" />
                  )}
                </div>
                <div className="badge-content">
                  <h3 className="badge-name">{badge.name}</h3>
                  <p className="badge-description">{badge.description}</p>
                  <div className="badge-category">
                    <span className="category-label">Category:</span>
                    <span className="category-value" style={{ color: badge.color || '#401abe' }}>{badge.category}</span>
                  </div>
                  {badge.criteria && (
                    <div className="badge-criteria">
                      <span className="criteria-label">Criteria:</span>
                      <span className="criteria-value">{badge.criteria}</span>
                    </div>
                  )}
                </div>
                <div className="badge-actions">
                  <button 
                    className="badge-action-btn award-btn" 
                    onClick={() => handleAwardBadge(badge.id)}
                    title="Award to student"
                  >
                    <FaUser />
                  </button>
                  <button 
                    className="badge-action-btn edit-btn" 
                    onClick={() => handleEditBadge(badge)}
                    title="Edit badge"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="badge-action-btn delete-btn" 
                    onClick={() => handleDeleteBadge(badge.id)}
                    title="Delete badge"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-badges-message">
              {searchQuery ? (
                <>
                  <FaSearch style={{ fontSize: '40px', marginBottom: '15px', opacity: 0.5 }} />
                  <p>No badges match your search.</p>
                </>  
              ) : (
                <>
                  <FaMedal style={{ fontSize: '60px', marginBottom: '20px', opacity: 0.5, animation: 'none' }} />
                  <p>No badges created yet. Click "Create Badge" to add your first badge.</p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Badge Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="badge-modal">
            <div className="modal-header">
              <h3>{modalMode === 'create' ? 'Create New Badge' : 'Edit Badge'}</h3>
              <button className="close-modal-btn" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSaveBadge}>
              <div className="form-group">
                <label htmlFor="name">Badge Name*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={currentBadge.name}
                  onChange={handleInputChange}
                  placeholder="Enter badge name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description*</label>
                <textarea
                  id="description"
                  name="description"
                  value={currentBadge.description}
                  onChange={handleInputChange}
                  placeholder="Enter badge description"
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="criteria">Criteria</label>
                <textarea
                  id="criteria"
                  name="criteria"
                  value={currentBadge.criteria}
                  onChange={handleInputChange}
                  placeholder="Enter criteria for earning this badge (e.g., 'Complete 5 quizzes with perfect scores')"
                ></textarea>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={currentBadge.category}
                    onChange={handleInputChange}
                  >
                    <option value="achievement">Achievement</option>
                    <option value="participation">Participation</option>
                    <option value="excellence">Excellence</option>
                    <option value="milestone">Milestone</option>
                    <option value="special">Special</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="color">Badge Color</label>
                  <input
                    type="color"
                    id="color"
                    name="color"
                    value={currentBadge.color}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="badgeImage">Badge Image</label>
                <div className="image-upload-container">
                  <div className="image-preview" style={{ borderColor: currentBadge.color }}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Badge preview" />
                    ) : (
                      <div className="no-image">
                        <FaMedal style={{ color: currentBadge.color }} />
                        <span>Click to upload an image</span>
                      </div>
                    )}
                  </div>
                  <label className="custom-file-upload">
                    <input
                      type="file"
                      id="badgeImage"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <FaUpload /> {imageFile ? imageFile.name : 'Choose Image'}
                  </label>
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="save-btn"
                  onClick={(e) => {
                    console.log('Submit button clicked');
                    // The form's onSubmit will handle this, but adding backup handling
                    // in case there's an event propagation issue
                  }}
                >
                  {modalMode === 'create' ? 'Create Badge' : 'Update Badge'}
                </button>
              </div>
              {error && <div className="error-message">{error}</div>}
            </form>
          </div>
        </div>
      )}

      {/* Award Badge Modal */}
      {showAwardModal && (
        <div className="modal-overlay">
          <div className="award-modal">
            <div className="modal-header">
              <h3>Award Badge to Student</h3>
              <button className="close-modal-btn" onClick={() => setShowAwardModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAwardSubmit}>
              <div className="form-group">
                <label htmlFor="student">Select Student*</label>
                <select
                  id="student"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  required
                >
                  <option value="">-- Select a student --</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="reason">Reason for Award (Optional)</label>
                <textarea
                  id="reason"
                  value={awardReason}
                  onChange={(e) => setAwardReason(e.target.value)}
                  placeholder="Enter reason for awarding this badge (e.g., 'Outstanding performance in History quiz')"
                ></textarea>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAwardModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="award-submit-btn">
                  Award Badge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeList;
