import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes, FaTrash, FaPlus } from 'react-icons/fa';
import './Calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState('month'); // 'month', 'week', or 'day'
  const [holidays, setHolidays] = useState([]);
  const [notification, setNotification] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    type: 'event'
  });
  const MAX_DESCRIPTION_LENGTH = 200;

  // Load events from localStorage when component mounts
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  // Fetch holidays for the current month
  useEffect(() => {
    const fetchHolidays = async () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      try {
        const response = await fetch(
          `https://date.nager.at/api/v3/PublicHolidays/${year}/US`
        );
        if (response.ok) {
          const data = await response.json();
          // Filter holidays for current month
          const monthHolidays = data.filter(holiday => {
            const holidayDate = new Date(holiday.date);
            return holidayDate.getMonth() === currentDate.getMonth();
          });
          setHolidays(monthHolidays);
        }
      } catch (error) {
        console.error('Error fetching holidays:', error);
      }
    };

    fetchHolidays();
  }, [currentDate]);

  // Check for upcoming events and show notifications
  useEffect(() => {
    const checkUpcomingEvents = () => {
      const now = new Date();
      const upcoming = events.filter(event => {
        const eventDateTime = new Date(`${event.date}T${event.startTime}`);
        const timeDiff = eventDateTime - now;
        // Check if event is within next 5 minutes
        return timeDiff > 0 && timeDiff <= 5 * 60 * 1000;
      });

      if (upcoming.length > 0) {
        const nextEvent = upcoming[0];
        setNotification({
          title: nextEvent.title,
          time: nextEvent.startTime,
          date: nextEvent.date
        });

        // Clear notification after 30 seconds
        setTimeout(() => setNotification(null), 30000);
      }
    };

    // Check every minute
    const interval = setInterval(checkUpcomingEvents, 60000);
    return () => clearInterval(interval);
  }, [events]);

  const handleCreateEvent = (e) => {
    e.preventDefault();
    const eventId = Math.max(0, ...events.map(e => e.id)) + 1;
    const newEventWithId = {
      ...newEvent,
      id: eventId,
      date: selectedDate
    };
    const updatedEvents = [...events, newEventWithId];
    setEvents(updatedEvents);
    setShowEventForm(false);
    resetNewEvent();
  };

  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    setSelectedEvent(null);
  };

  const resetNewEvent = () => {
    setNewEvent({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      description: '',
      type: 'event'
    });
  };

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_DESCRIPTION_LENGTH) {
      setNewEvent({...newEvent, description: text});
    }
  };

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const startOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthData = () => {
    const days = daysInMonth(currentDate);
    const startDay = startOfMonth(currentDate);
    const monthData = [];
    let week = new Array(7).fill(null);
    let dayCount = 1;

    // Fill in the first week with empty days
    for (let i = startDay; i < 7 && dayCount <= days; i++) {
      week[i] = dayCount++;
    }
    monthData.push(week);

    // Fill in the rest of the weeks
    while (dayCount <= days) {
      week = new Array(7).fill(null);
      for (let i = 0; i < 7 && dayCount <= days; i++) {
        week[i] = dayCount++;
      }
      monthData.push(week);
    }

    return monthData;
  };

  const getWeekData = () => {
    const currentDay = currentDate.getDay();
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDay);
    
    const weekData = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      weekData.push(date);
    }
    return weekData;
  };

  const formatDate = (day) => {
    if (!day) return '';
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (day) => {
    if (!day) return [];
    const dateStr = formatDate(day);
    return events.filter(event => event.date === dateStr);
  };

  const getHolidaysForDate = (day) => {
    if (!day) return [];
    const dateStr = formatDate(day);
    return holidays.filter(holiday => holiday.date === dateStr);
  };

  const handlePrevPeriod = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else if (view === 'week') {
      newDate.setDate(currentDate.getDate() - 7);
    } else {
      newDate.setDate(currentDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNextPeriod = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(currentDate.getDate() + 7);
    } else {
      newDate.setDate(currentDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleDateClick = (day) => {
    if (!day) return;
    const dateStr = formatDate(day);
    const dateEvents = getEventsForDate(day);
    
    if (dateEvents.length > 0) {
      setSelectedEvent(dateEvents[0]);
    } else {
      setSelectedDate(dateStr);
      setShowEventForm(true);
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === currentDate.getMonth() && 
           today.getFullYear() === currentDate.getFullYear();
  };

  const getWeekOfMonth = (date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const offsetDate = date.getDate() + firstDayOfWeek - 1;
    return Math.floor(offsetDate / 7) + 1;
  };

  const renderMonthView = () => (
    <div className="calendar-grid">
      <div className="calendar-days">
        {dayNames.map(day => (
          <div key={day} className="day-name">{day}</div>
        ))}
      </div>

      <div className="calendar-dates">
        {getMonthData().map((week, weekIndex) => {
          const weekDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), week.find(day => day !== null) || 1);
          const weekOfMonth = getWeekOfMonth(weekDate);
          
          return (
            <div key={weekIndex} className="week">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`date-box ${day ? 'has-date' : ''} ${
                    getEventsForDate(day).length > 0 ? 'has-events' : ''
                  }`}
                  onClick={() => handleDateClick(day)}
                >
                  {day && (
                    <>
                      {dayIndex === 0 && <span className="week-number">Week {weekOfMonth}</span>}
                      <span className={`date-number ${isToday(day) ? 'today' : ''}`}>{day}</span>
                      <div className="holiday-container">
                        {getHolidaysForDate(day).map(holiday => (
                          <div key={holiday.name} className="holiday-indicator">
                            {holiday.name}
                          </div>
                        ))}
                      </div>
                      <div className="events-container">
                        {getEventsForDate(day).map(event => (
                          <div
                            key={event.id}
                            className={`event-indicator ${event.type}`}
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderWeekView = () => (
    <div className="calendar-week-view">
      {getWeekData().map((date, index) => (
        <div key={index} className="week-day">
          <div className="week-day-header">
            <span className="day-name">{dayNames[date.getDay()]}</span>
            <span className="date-number">{date.getDate()}</span>
          </div>
          <div className="week-day-events">
            {events
              .filter(event => event.date === date.toISOString().split('T')[0])
              .map(event => (
                <div
                  key={event.id}
                  className={`week-event ${event.type}`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <span className="event-time">{event.startTime}</span>
                  <span className="event-title">{event.title}</span>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderDayView = () => (
    <div className="calendar-day-view">
      <div className="day-header">
        <h3>{currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
      </div>
      <div className="day-events">
        {events
          .filter(event => event.date === currentDate.toISOString().split('T')[0])
          .sort((a, b) => a.startTime.localeCompare(b.startTime))
          .map(event => (
            <div
              key={event.id}
              className={`day-event ${event.type}`}
              onClick={() => setSelectedEvent(event)}
            >
              <span className="event-time">{event.startTime} - {event.endTime}</span>
              <span className="event-title">{event.title}</span>
              <p className="event-description">{event.description}</p>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-navigation">
          <button onClick={handlePrevPeriod}><FaChevronLeft /></button>
          <h2>
            {view === 'day' 
              ? currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
              : view === 'week'
              ? `Week of ${currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
              : `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
            }
          </h2>
          <button onClick={handleNextPeriod}><FaChevronRight /></button>
        </div>
        <div className="calendar-controls">
          <button className="today-btn" onClick={handleToday}>today</button>
          <div className="view-options">
            <button 
              className={view === 'month' ? 'active' : ''} 
              onClick={() => setView('month')}
            >
              month
            </button>
            <button 
              className={view === 'week' ? 'active' : ''} 
              onClick={() => setView('week')}
            >
              week
            </button>
            <button 
              className={view === 'day' ? 'active' : ''} 
              onClick={() => setView('day')}
            >
              day
            </button>
          </div>
        </div>
      </div>

      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="event-modal" onClick={(e) => e.stopPropagation()}>
          <div className="event-modal-content">
            <button 
              className="close-modal" 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEvent(null);
              }}
            >
              <FaTimes />
            </button>
            <button 
              className="delete-event" 
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteEvent(selectedEvent.id);
              }}
            >
              <FaTrash />
            </button>
            <h3>{selectedEvent.title}</h3>
            <div className="event-time">
              {selectedEvent.startTime} - {selectedEvent.endTime}
            </div>
            <div className="event-date">
              {selectedEvent.date}
            </div>
            <p className="event-description">{selectedEvent.description}</p>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showEventForm && (
        <div className="event-modal">
          <div className="event-modal-content">
            <button className="close-modal" onClick={(e) => {
              e.stopPropagation();
              setShowEventForm(false);
              resetNewEvent();
            }}>
              <FaTimes />
            </button>
            <h3>Add Event</h3>
            <form onSubmit={handleCreateEvent} className="event-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Add title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group time-group">
                <input
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                  required
                />
                <span>-</span>
                <input
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                >
                  <option value="event">Event</option>
                  <option value="birthday">Birthday</option>
                  <option value="conference">Conference</option>
                  <option value="long">Long Event</option>
                </select>
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Add description"
                  value={newEvent.description}
                  onChange={handleDescriptionChange}
                  className={newEvent.description.length >= MAX_DESCRIPTION_LENGTH ? 'limit-reached' : ''}
                />
                <div className={`character-counter ${newEvent.description.length >= MAX_DESCRIPTION_LENGTH ? 'limit-reached' : ''}`}>
                  {newEvent.description.length}/{MAX_DESCRIPTION_LENGTH} characters
                </div>
              </div>
              <button type="submit" className="save-event">
                Save
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="notification">
          <div className="notification-content">
            <h4>Upcoming Event</h4>
            <p className="notification-title">{notification.title}</p>
            <p className="notification-time">Starting at {notification.time}</p>
          </div>
          <button className="close-notification" onClick={() => setNotification(null)}>
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};

export default Calendar; 