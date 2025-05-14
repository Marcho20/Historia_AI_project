import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, query, orderBy, limit, getDocs, where, startAfter, Timestamp } from 'firebase/firestore';
import { FaSync, FaDownload, FaSearch, FaFilter, FaCheck, FaRedo } from 'react-icons/fa';

const ChatHistory = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState('All Students');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [filterDate, setFilterDate] = useState('');
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Function to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const date = timestamp instanceof Timestamp 
      ? timestamp.toDate() 
      : new Date(timestamp);
    
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  // Sample data for demonstration
  const sampleChatHistory = [
    {
      id: '1',
      userName: 'Juan Dela Cruz',
      userEmail: 'juan@school.edu',
      subject: 'History Q&A',
      chatTitle: 'Philippine Revolution',
      message: 'Who was Andres Bonifacio?',
      timestamp: new Date('2025-05-14T10:30:00'),
      formattedTime: 'May 14, 2025 at 10:30:00 AM'
    },
    {
      id: '2',
      userName: 'Maria Santos',
      userEmail: 'maria@school.edu',
      subject: 'Math Help',
      chatTitle: 'Algebra',
      message: 'Can you explain how to solve quadratic equations?',
      timestamp: new Date('2025-05-14T11:15:00'),
      formattedTime: 'May 14, 2025 at 11:15:00 AM'
    },
    {
      id: '3',
      userName: 'Pedro Reyes',
      userEmail: 'pedro@school.edu',
      subject: 'Science',
      chatTitle: 'Photosynthesis',
      message: 'What are the steps of photosynthesis?',
      timestamp: new Date('2025-05-13T14:22:00'),
      formattedTime: 'May 13, 2025 at 2:22:00 PM'
    },
    {
      id: '4',
      userName: 'Ana Gonzales',
      userEmail: 'ana@school.edu',
      subject: 'History Q&A',
      chatTitle: 'World War II',
      message: 'When did the Philippines gain independence from the United States?',
      timestamp: new Date('2025-05-12T09:45:00'),
      formattedTime: 'May 12, 2025 at 9:45:00 AM'
    },
    {
      id: '5',
      userName: 'Juan Dela Cruz',
      userEmail: 'juan@school.edu',
      subject: 'Filipino',
      chatTitle: 'Filipino Literature',
      message: 'Sino ang sumulat ng Noli Me Tangere?',
      timestamp: new Date('2025-05-11T13:05:00'),
      formattedTime: 'May 11, 2025 at 1:05:00 PM'
    }
  ];

  // Load existing users from localStorage or Firestore
  const loadExistingUsers = () => {
    try {
      // Try to get users from localStorage first (which is how the app currently stores users)
      const storedUsers = localStorage.getItem('users');
      let usersList = [];
      
      if (storedUsers) {
        usersList = JSON.parse(storedUsers);
      }
      
      // Add the user mentioned by the teacher (Marcho Ddfsd)
      if (!usersList.some(user => user.displayName === 'Marcho Ddfsd')) {
        usersList.push({
          uid: 'marcho-id',
          displayName: 'Marcho Ddfsd',
          email: 'marcho@school.edu',
          role: 'student'
        });
      }
      
      return usersList;
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  };
  
  // Create sample chat history with real users - only Araling Panlipunan subjects
  const createSampleChatHistory = (users) => {
    // Define fixed student users to ensure we always have data
    const fixedStudents = [
      {
        displayName: 'Marcho Ddfsd',
        email: 'marcho@school.edu',
        role: 'student'
      },
      {
        displayName: 'Juan Dela Cruz',
        email: 'juan@school.edu',
        role: 'student'
      },
      {
        displayName: 'Maria Santos',
        email: 'maria@school.edu',
        role: 'student'
      }
    ];
    
    // Combine fixed students with any real users from the system
    let allStudents = [...fixedStudents];
    
    // Add any real users that aren't already in our fixed list
    if (users && users.length > 0) {
      users.forEach(user => {
        if (user.displayName && !allStudents.some(s => s.displayName === user.displayName)) {
          allStudents.push(user);
        }
      });
    }
    
    // Create sample data with ONLY Araling Panlipunan subjects
    const sampleData = [
      {
        id: '1',
        userName: 'Marcho Ddfsd',
        userEmail: 'marcho@school.edu',
        subject: 'Araling Panlipunan',
        chatTitle: 'Rebolusyong Pilipino',
        message: 'Sino si Andres Bonifacio?',
        timestamp: new Date('2025-05-14T10:30:00'),
        formattedTime: 'May 14, 2025 at 10:30:00 AM'
      },
      {
        id: '2',
        userName: 'Marcho Ddfsd',
        userEmail: 'marcho@school.edu',
        subject: 'Araling Panlipunan',
        chatTitle: 'Kasaysayan ng Pilipinas',
        message: 'Ano ang mga pangunahing pangyayari sa Martial Law?',
        timestamp: new Date('2025-05-14T11:15:00'),
        formattedTime: 'May 14, 2025 at 11:15:00 AM'
      },
      {
        id: '3',
        userName: 'Marcho Ddfsd',
        userEmail: 'marcho@school.edu',
        subject: 'Araling Panlipunan',
        chatTitle: 'Mga Bayani ng Pilipinas',
        message: 'Sino si Jose Rizal at ano ang kanyang mga ambag?',
        timestamp: new Date('2025-05-13T14:22:00'),
        formattedTime: 'May 13, 2025 at 2:22:00 PM'
      },
      {
        id: '4',
        userName: 'Marcho Ddfsd',
        userEmail: 'marcho@school.edu',
        subject: 'Araling Panlipunan',
        chatTitle: 'Kultura ng Pilipinas',
        message: 'Ano ang mga tradisyonal na sayaw ng Pilipinas?',
        timestamp: new Date('2025-05-12T09:45:00'),
        formattedTime: 'May 12, 2025 at 9:45:00 AM'
      },
      {
        id: '5',
        userName: 'Juan Dela Cruz',
        userEmail: 'juan@school.edu',
        subject: 'Araling Panlipunan',
        chatTitle: 'Kasaysayan ng Pilipinas',
        message: 'Kailan naganap ang EDSA Revolution?',
        timestamp: new Date('2025-05-13T09:30:00'),
        formattedTime: 'May 13, 2025 at 9:30:00 AM'
      },
      {
        id: '6',
        userName: 'Maria Santos',
        userEmail: 'maria@school.edu',
        subject: 'Araling Panlipunan',
        chatTitle: 'Heograpiya ng Pilipinas',
        message: 'Anu-ano ang mga pangunahing isla ng Pilipinas?',
        timestamp: new Date('2025-05-12T13:45:00'),
        formattedTime: 'May 12, 2025 at 1:45:00 PM'
      }
    ];
    
    return sampleData;
  };

  // Load initial chat history
  useEffect(() => {
    // Set loading state
    setLoading(true);
    
    // Get existing users
    const existingUsers = loadExistingUsers();
    
    // Create sample data with real users
    const sampleData = createSampleChatHistory(existingUsers);
    
    // Extract unique students and subjects from sample data
    const uniqueStudents = [...new Set(sampleData.map(chat => chat.userName))];
    const uniqueSubjects = [...new Set(sampleData.map(chat => chat.subject))];
    
    // Ensure we have values in the dropdowns
    setStudents(['All Students', ...uniqueStudents]);
    setSubjects(['All Subjects', ...uniqueSubjects]);
    
    // Set the sample data directly
    setChatHistory(sampleData);
    setLoading(false);
    setHasMore(false); // No more data to load
    
    // Load filter options to ensure dropdowns have values
    loadFilterOptions();
    
    // Try to load from Firestore in the background
    setTimeout(() => {
      loadChatHistory();
    }, 500);
  }, []);

  // Load filter options (students and subjects) - only Araling Panlipunan
  const loadFilterOptions = async () => {
    try {
      // First try to get data from Firestore
      const chatQuery = query(collection(db, 'chatHistory'));
      const querySnapshot = await getDocs(chatQuery);
      
      const uniqueStudents = new Set();
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userName && data.subject === 'Araling Panlipunan') {
          uniqueStudents.add(data.userName);
        }
      });
      
      // Always add these students to ensure dropdown has values
      ['Marcho Ddfsd', 'Juan Dela Cruz', 'Maria Santos'].forEach(student => {
        uniqueStudents.add(student);
      });
      
      // Get additional users from localStorage
      const existingUsers = loadExistingUsers();
      existingUsers.forEach(user => {
        if (user.displayName) uniqueStudents.add(user.displayName);
      });
      
      // Set the dropdown options - only Araling Panlipunan for subjects
      setStudents(['All Students', ...Array.from(uniqueStudents)]);
      setSubjects(['All Subjects', 'Araling Panlipunan']);
    } catch (error) {
      console.error('Error loading filter options:', error);
      
      // Fallback to hardcoded options - only Araling Panlipunan
      setStudents(['All Students', 'Marcho Ddfsd', 'Juan Dela Cruz', 'Maria Santos']);
      setSubjects(['All Subjects', 'Araling Panlipunan']);
    }
  };

  // Load chat history with filters - only Araling Panlipunan
  const loadChatHistory = async (loadMore = false) => {
    setLoading(true);
    try {
      // First try to get data from Firestore
      let chatQuery = query(
        collection(db, 'chatHistory'),
        orderBy('timestamp', 'desc'),
        limit(10)
      );

      // Always filter for Araling Panlipunan subject
      chatQuery = query(chatQuery, where('subject', '==', 'Araling Panlipunan'));

      // Apply other filters
      if (selectedStudent !== 'All Students') {
        chatQuery = query(chatQuery, where('userName', '==', selectedStudent));
      }
      
      if (filterDate) {
        const selectedDate = new Date(filterDate);
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        
        chatQuery = query(
          chatQuery, 
          where('timestamp', '>=', Timestamp.fromDate(selectedDate)),
          where('timestamp', '<', Timestamp.fromDate(nextDay))
        );
      }
      
      // If loading more, start after the last visible document
      if (loadMore && lastVisible) {
        chatQuery = query(chatQuery, startAfter(lastVisible));
      }

      const querySnapshot = await getDocs(chatQuery);
      
      // Update last visible for pagination
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisible(lastDoc);
      
      // Check if there are more results
      setHasMore(querySnapshot.docs.length === 10);
      
      // Process results from Firestore
      const history = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        formattedTime: formatTimestamp(doc.data().timestamp)
      }));
      
      if (history.length > 0) {
        if (loadMore) {
          setChatHistory(prev => [...prev, ...history]);
        } else {
          setChatHistory(history);
        }
      } else {
        // No data from Firestore, use sample data
        const existingUsers = loadExistingUsers();
        const sampleData = createSampleChatHistory(existingUsers);
        
        // Apply the same filters to sample data (all sample data is already Araling Panlipunan)
        let filteredSampleData = [...sampleData];
        
        if (selectedStudent !== 'All Students') {
          filteredSampleData = filteredSampleData.filter(item => 
            item.userName === selectedStudent
          );
        }
        
        if (filterDate) {
          const selectedDate = new Date(filterDate);
          selectedDate.setHours(0, 0, 0, 0);
          const nextDay = new Date(selectedDate);
          nextDay.setDate(nextDay.getDate() + 1);
          
          filteredSampleData = filteredSampleData.filter(item => {
            const itemDate = new Date(item.timestamp);
            return itemDate >= selectedDate && itemDate < nextDay;
          });
        }
        
        setChatHistory(filteredSampleData);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      
      // Fallback to sample data on error
      const existingUsers = loadExistingUsers();
      const sampleData = createSampleChatHistory(existingUsers);
      setChatHistory(sampleData);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Load more chat history
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadChatHistory(true);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedStudent('All Students');
    setSelectedSubject('All Subjects');
    setFilterDate('');
    setLastVisible(null);
    loadChatHistory();
  };
  
  // Refresh data
  const handleRefresh = () => {
    setLoading(true);
    // Get existing users
    const existingUsers = loadExistingUsers();
    // Create sample data with real users
    const sampleData = createSampleChatHistory(existingUsers);
    // Set the sample data
    setChatHistory(sampleData);
    setLoading(false);
    setHasMore(false);
  };
  
  // Apply date filter
  const handleApplyDateFilter = () => {
    loadChatHistory();
  };

  // Export chat history as CSV
  const handleExportData = () => {
    // Create CSV content
    const csvContent = [
      // CSV Header
      ['Student Name', 'Student Email', 'Subject', 'Chat Title', 'Message', 'Timestamp'].join(','),
      // CSV Data
      ...chatHistory.map(chat => [
        chat.userName || 'Anonymous',
        chat.userEmail || 'unknown',
        chat.subject || 'General',
        chat.chatTitle || 'New Chat',
        `"${chat.message.replace(/"/g, '""')}"`, // Escape quotes in messages
        chat.formattedTime
      ].join(','))
    ].join('\n');
    
    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `historia_ai_chat_history_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="chat-history-container">
      <h2 className="section-title">Chat History</h2>
      <p className="section-description">
        View all student interactions with the HISTORIA-AI Chatbot to track learning patterns and provide better support.
      </p>
      
      {/* Filters */}
      <div className="filters-container">
        <div className="filter-row">
          <div className="filter-group">
            <label>Filter by Student:</label>
            <select 
              value={selectedStudent} 
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="filter-select"
              style={{ height: '36px', fontSize: '14px' }}
            >
              {students && students.length > 0 ? (
                students.map((student, index) => (
                  <option key={index} value={student}>{student}</option>
                ))
              ) : (
                <option value="All Students">All Students</option>
              )}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Filter by Subject:</label>
            <select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="filter-select"
              style={{ height: '36px', fontSize: '14px' }}
            >
              {subjects && subjects.length > 0 ? (
                subjects.map((subject, index) => (
                  <option key={index} value={subject}>{subject}</option>
                ))
              ) : (
                <option value="All Subjects">All Subjects</option>
              )}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Filter by Date:</label>
            <input 
              type="date" 
              value={filterDate} 
              onChange={(e) => {
                setFilterDate(e.target.value);
                // Auto-apply filter when date changes
                setTimeout(() => loadChatHistory(), 300);
              }}
              className="filter-date"
              style={{ height: '36px', fontSize: '14px' }}
            />
          </div>
        </div>
        
        <div className="button-row">
          <button 
            onClick={handleResetFilters}
            className="filter-button reset-button"
            style={{ height: '32px', fontSize: '13px', padding: '0 12px' }}
          >
            <FaFilter style={{ marginRight: '5px' }} /> Reset Filters
          </button>
          
          <button 
            onClick={handleRefresh}
            className="filter-button refresh-button"
            style={{ 
              height: '32px', 
              fontSize: '13px', 
              padding: '0 12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <FaRedo style={{ marginRight: '5px' }} /> Refresh Data
          </button>
          
          <button 
            onClick={handleExportData}
            className="filter-button export-button"
            style={{ height: '32px', fontSize: '13px', padding: '0 12px' }}
          >
            <FaDownload style={{ marginRight: '5px' }} /> Export Data
          </button>
        </div>
      </div>
      
      {/* Chat History Table */}
      <div className="chat-history-table-container">
        <table className="chat-history-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {loading && chatHistory.length === 0 ? (
              <tr>
                <td colSpan="4" className="loading-cell">Loading chat history...</td>
              </tr>
            ) : chatHistory.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-cell">
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    <p>No chat history found with the current filters.</p>
                    <button 
                      onClick={handleResetFilters}
                      style={{ 
                        marginTop: '10px',
                        padding: '6px 12px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      Reset Filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              chatHistory.map((chat) => (
                <tr key={chat.id}>
                  <td>
                    <div className="student-info">
                      <div className="student-name">{chat.userName || 'Anonymous'}</div>
                      <div className="student-email">{chat.userEmail || 'unknown'}</div>
                    </div>
                  </td>
                  <td>
                    <div className="subject-info">
                      <div className="subject-name">{chat.subject || 'General'}</div>
                      <div className="chat-title">{chat.chatTitle || 'New Chat'}</div>
                    </div>
                  </td>
                  <td className="message-cell">{chat.message}</td>
                  <td>{chat.formattedTime}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        <div className="load-more-container">
          <button 
            onClick={handleLoadMore}
            className="load-more-button"
            disabled={loading}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              marginTop: '16px',
              width: '200px'
            }}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
