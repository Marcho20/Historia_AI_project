import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaCalendarAlt, FaBook, FaClock } from "react-icons/fa";
import "./Modal.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ScheduleEditModal({ onClose, onSaveEdit, scheduleToEdit }) {
  const [formData, setFormData] = useState({
    date: "",
    className: "",
    startTime: "",
    endTime: ""
  });

  // Initialize the form with the schedule being edited
  useEffect(() => {
    if (scheduleToEdit) {
      // Convert the time ranges back to individual components
      let startTime = "";
      let endTime = "";
      
      if (scheduleToEdit.timeRange) {
        const timeParts = scheduleToEdit.timeRange.split('-');
        if (timeParts.length === 2) {
          // Convert from 12h format (9:00AM) to 24h format (09:00)
          startTime = convertTo24Hour(timeParts[0]);
          endTime = convertTo24Hour(timeParts[1]);
        }
      } else if (scheduleToEdit.startTime && scheduleToEdit.endTime) {
        startTime = convertTo24Hour(scheduleToEdit.startTime);
        endTime = convertTo24Hour(scheduleToEdit.endTime);
      }

      setFormData({
        date: scheduleToEdit.date || "",
        className: scheduleToEdit.className || scheduleToEdit.title || "",
        startTime: startTime,
        endTime: endTime
      });
    }
  }, [scheduleToEdit]);

  // Convert 12-hour format (like 9:00AM) to 24-hour format (09:00)
  const convertTo24Hour = (time12h) => {
    if (!time12h) return "";
    
    // Extract parts
    const timeRegex = /(\d+):(\d+)([AP]M)/i;
    const match = time12h.match(timeRegex);
    
    if (!match) return "";
    
    let [_, hours, minutes, period] = match;
    
    // Convert hours to 24-hour format
    hours = parseInt(hours, 10);
    if (period.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
    
    // Format with leading zeros
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  const handleInputChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;
    
    // Special handling for date field
    if (name === 'date') {
      // Handle date input when user is typing manually
      if (e.target.type === 'text') {
        // Allow only numbers and slashes
        value = value.replace(/[^0-9/]/g, '');
        value = value.replace(/\/+/g, '/');
        
        // Auto-add slashes for MM/DD/YYYY format
        if (value.length === 2 && formData.date.length === 1) {
          value += '/';
        } else if (value.length === 5 && formData.date.length === 4) {
          value += '/';
        }
        
        // Enforce max length
        if (value.length > 10) {
          value = value.slice(0, 10);
        }
      } 
      // Handle when date is selected from date picker
      else if (e.target.type === 'date' && value) {
        try {
          // Convert from ISO format YYYY-MM-DD to MM/DD/YYYY
          const dateObj = new Date(value + 'T12:00:00');
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getDate()).padStart(2, '0');
          const year = dateObj.getFullYear();
          
          // Set formatted date value
          value = `${month}/${day}/${year}`;
          
          // Convert back to text input after selection
          setTimeout(() => {
            e.target.type = 'text';
          }, 0);
        } catch (error) {
          console.error('Error converting date:', error);
        }
      }
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Validate form data
    if (!formData.date || !formData.className || !formData.startTime || !formData.endTime) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate time (end time must be after start time)
    if (formData.startTime >= formData.endTime) {
      toast.error('End time must be after start time');
      return;
    }

    // Format the time for display
    const formattedStartTime = formatTime(formData.startTime);
    const formattedEndTime = formatTime(formData.endTime);

    // Create updated schedule object
    const updatedSchedule = {
      ...scheduleToEdit, // Preserve the original ID and any other properties
      date: formData.date,
      className: formData.className,
      title: formData.className, // Update both in case either is used
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      timeRange: `${formattedStartTime}-${formattedEndTime}`
    };

    try {
      // Call the parent component's function to save the edited schedule
      onSaveEdit(updatedSchedule);
      
      // Show success message
      toast.success('Schedule updated successfully!');
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error updating schedule:', error);
      toast.error('Failed to update schedule. Please try again.');
    }
  };

  // Helper function to format time from 24h to 12h format with AM/PM
  const formatTime = (time24h) => {
    if (!time24h) return "";
    
    const [hours, minutes] = time24h.split(":");
    const hoursNum = parseInt(hours, 10);
    
    const period = hoursNum >= 12 ? "PM" : "AM";
    const hours12 = hoursNum % 12 || 12;
    
    return `${hours12}:${minutes}${period}`;
  };

  // Common styles for consistency
  const containerStyle = {
    position: 'relative',
    maxWidth: '580px',
    width: '95%',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px 30px 35px',
    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.15)',
    zIndex: 10001
  };

  const formGroupStyle = {
    marginBottom: '25px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '10px',
    fontWeight: '500',
    fontSize: '16px',
    color: '#333'
  };

  const iconContainerStyle = {
    position: 'absolute',
    left: '0',
    width: '55px',
    height: '55px',
    backgroundColor: '#6a1b9a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '5px 0 0 5px'
  };

  const iconStyle = {
    color: 'white',
    fontSize: '20px'
  };

  const inputStyle = {
    paddingLeft: '65px',
    width: '100%',
    height: '55px',
    borderRadius: '5px',
    border: '1px solid #e0e0e0',
    fontSize: '16px',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    flex: 1,
    height: '50px',
    border: 'none',
    borderRadius: '5px',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer'
  };

  return (
    <div 
      className="modal schedule-modal-overlay" 
      onClick={onClose}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
    >
      <div 
        style={containerStyle} 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            zIndex: 1000,
            padding: '5px'
          }} 
          onClick={onClose}
          aria-label="Close"
        >
          <IoClose size={24} color="#333" />
        </button>
        
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#333', marginBottom: '30px', textAlign: 'center' }}>Edit Schedule</h2>
          <form onSubmit={handleSubmit}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Date</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={iconContainerStyle}>
                  <FaCalendarAlt style={iconStyle} />
                </div>
                <input 
                  type="text" 
                  style={inputStyle}
                  name="date"
                  placeholder="mm/dd/yyyy"
                  maxLength="10"
                  value={formData.date}
                  onChange={handleInputChange}
                  onClick={() => {
                    // Simple approach: just switch to date type on click
                    const input = document.querySelector('input[name="date"]');
                    if (input && input.type === 'text') {
                      // If we have a formatted date MM/DD/YYYY, convert to YYYY-MM-DD for picker
                      if (formData.date && /^\d{2}\/\d{2}\/\d{4}$/.test(formData.date)) {
                        const [month, day, year] = formData.date.split('/');
                        // First change the type
                        input.type = 'date';
                        // Then set the value in YYYY-MM-DD format
                        input.value = `${year}-${month}-${day}`;
                      } else {
                        input.type = 'date';
                      }
                      input.focus();
                    }
                  }}
                />
              </div>
            </div>
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>Class Name</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={iconContainerStyle}>
                  <FaBook style={iconStyle} />
                </div>
                <input 
                  type="text" 
                  style={inputStyle}
                  placeholder="Class Name"
                  name="className"
                  value={formData.className}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>Time</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div style={iconContainerStyle}>
                    <FaClock style={iconStyle} />
                  </div>
                  <input 
                    type="time" 
                    style={inputStyle}
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                  />
                </div>
                <span style={{ fontWeight: 500, fontSize: '16px', color: '#666', padding: '0 5px' }}>to</span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div style={iconContainerStyle}>
                    <FaClock style={iconStyle} />
                  </div>
                  <input 
                    type="time" 
                    style={inputStyle}
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
              <button 
                type="submit" 
                style={{
                  ...buttonStyle,
                  backgroundColor: '#6a1b9a',
                  color: 'white',
                }}
              >
                Save Changes
              </button>
              <button 
                type="button" 
                style={{
                  ...buttonStyle,
                  backgroundColor: '#f5f5f5',
                  color: '#333',
                }}
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}

export default ScheduleEditModal;
