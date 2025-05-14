import React, { useState, useRef, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const initialFolders = [
  {
    name: 'Math Help',
    chats: [
      {
        id: 1,
        title: 'Algebra Homework',
        messages: [
          { text: 'How do I solve x+2=5?', from: 'user', time: '12:01' },
          { text: 'Subtract 2 from both sides.', from: 'bot', time: '12:02' },
        ],
      },
      {
        id: 2,
        title: 'Geometry',
        messages: [
          { text: 'What is a right angle?', from: 'user', time: '13:10' },
          { text: 'A right angle is 90 degrees.', from: 'bot', time: '13:11' },
        ],
      },
    ],
  },
  {
    name: 'History Q&A',
    chats: [
      {
        id: 3,
        title: 'World War II',
        messages: [
          { text: 'When did WWII end?', from: 'user', time: '10:30' },
          { text: '1945.', from: 'bot', time: '10:31' },
        ],
      },
    ],
  },
];

function getTimeNow() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatBot() {
  const [folders, setFolders] = useState(initialFolders);
  const [selectedFolderIdx, setSelectedFolderIdx] = useState(0);
  const [selectedChatIdx, setSelectedChatIdx] = useState(0);
  const [input, setInput] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const chatbotRef = useRef(null);
  
  const currentFolder = folders[selectedFolderIdx];
  const currentChat = currentFolder?.chats[selectedChatIdx];

  // Folder actions
  const handleNewFolder = () => {
    setCreatingFolder(true);
    setNewFolderName('');
  };
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      setFolders([...folders, { name: newFolderName.trim(), chats: [] }]);
      setCreatingFolder(false);
      setNewFolderName('');
      setSelectedFolderIdx(folders.length);
      setSelectedChatIdx(0);
    }
  };
  // Chat actions
  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'New Chat',
      messages: [],
    };
    const updatedFolders = folders.map((f, idx) =>
      idx === selectedFolderIdx
        ? { ...f, chats: [newChat, ...f.chats] }
        : f
    );
    setFolders(updatedFolders);
    setSelectedChatIdx(0);
  };
  // Send message
  const handleSend = async () => {
    if (!input.trim()) return;
    const time = getTimeNow();
    const msg = { text: input, from: 'user', time };
    
    // Update local state
    const updatedFolders = folders.map((f, fIdx) =>
      fIdx === selectedFolderIdx
        ? {
            ...f,
            chats: f.chats.map((c, cIdx) =>
              cIdx === selectedChatIdx
                ? { ...c, messages: [...c.messages, msg] }
                : c
            ),
          }
        : f
    );
    setFolders(updatedFolders);
    setInput('');
    
    try {
      // Save message to Firestore
      const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
      await addDoc(collection(db, 'chatHistory'), {
        userId: userInfo.uid || 'anonymous',
        userName: userInfo.displayName || 'Anonymous Student',
        userEmail: userInfo.email || 'unknown',
        message: input.trim(),
        timestamp: serverTimestamp(),
        subject: currentFolder?.name || 'General',
        chatTitle: currentChat?.title || 'New Chat'
      });
    } catch (error) {
      console.error('Error saving chat message to Firestore:', error);
      // Continue with local functionality even if Firebase fails
    }
    
    // Mock bot reply
    setTimeout(async () => {
      const botMsg = { text: 'This is a mock bot reply.', from: 'bot', time: getTimeNow() };
      setFolders(folders => folders.map((f, fIdx) =>
        fIdx === selectedFolderIdx
          ? {
              ...f,
              chats: f.chats.map((c, cIdx) =>
                cIdx === selectedChatIdx
                  ? { ...c, messages: [...c.messages, botMsg] }
                  : c
              ),
            }
          : f
      ));
    }, 700);
  };

  // Toggle chat window size
  const toggleMinimize = () => {
    if (isDragging) return; // Don't toggle if we're dragging
    setIsMinimized(!isMinimized);
  };

  // Handle start of drag
  const handleDragStart = (e) => {
    // For mouse events
    if (e.type === 'mousedown') {
      setIsDragging(true);
      const rect = chatbotRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    // For touch events
    else if (e.type === 'touchstart') {
      setIsDragging(true);
      const touch = e.touches[0];
      const rect = chatbotRef.current.getBoundingClientRect();
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      });
    }
  };

  // Handle drag movement
  const handleDragMove = (e) => {
    if (!isDragging) return;
    
    // Prevent default to avoid scrolling while dragging on mobile
    e.preventDefault();
    
    let clientX, clientY;
    
    // For mouse events
    if (e.type === 'mousemove') {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    // For touch events
    else if (e.type === 'touchmove') {
      const touch = e.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    }
    
    // Calculate new position
    const newX = clientX - dragOffset.x;
    const newY = clientY - dragOffset.y;
    
    // Update position
    setPosition({
      x: newX,
      y: newY
    });
  };

  // Handle end of drag
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Add and remove event listeners
  useEffect(() => {
    if (isMinimized) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
      
      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isMinimized, isDragging, dragOffset]);

  return (
    <div className="chatbot-container" style={{position: 'relative'}}>
      {/* Floating AI Assistant - visible when minimized */}
      {isMinimized ? (
        <div 
          ref={chatbotRef}
          style={{
            position: 'fixed', 
            bottom: `${position.y}px`, 
            right: `${position.x}px`, 
            zIndex: 1000,
            cursor: isDragging ? 'grabbing' : 'grab',
            transition: isDragging ? 'none' : 'all 0.2s ease',
            filter: isDragging ? 'brightness(1.1)' : 'brightness(1)'
          }}>
          {/* Cloud background */}
          <div style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'linear-gradient(to bottom, #e6f0ff 0%, #f0f7ff 100%)',
            opacity: '0.8',
            zIndex: '-1'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '30px',
            right: '50px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(to bottom, #e6f0ff 0%, #f0f7ff 100%)',
            opacity: '0.6',
            zIndex: '-1'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '60px',
            right: '-20px',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(to bottom, #e6f0ff 0%, #f0f7ff 100%)',
            opacity: '0.7',
            zIndex: '-1'
          }}></div>
          
          {/* Cloud-shaped speech bubble - modern design */}
          <div style={{
            position: 'absolute',
            bottom: '140px',
            right: '20px',
            width: '220px',
            height: '140px',
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))',
            zIndex: '1'
          }}>
            {/* SVG cloud shape with modern styling */}
            <svg width="220" height="140" viewBox="0 0 220 140" style={{position: 'absolute', top: 0, left: 0}}>
              <path 
                d="M210,70 C210,40 190,20 160,20 C140,5 110,5 90,20 C70,5 40,10 20,30 C10,40 10,60 20,70 C10,90 20,110 40,120 C60,130 90,130 110,120 C130,130 160,130 180,120 C200,110 210,90 210,70 Z" 
                fill="white" 
                stroke="#e2e8f0"
                strokeWidth="2"
              />
            </svg>
            
            {/* Text content positioned over the cloud */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              textAlign: 'center',
              fontSize: '16px',
              lineHeight: '1.5',
              fontWeight: '500',
              color: '#2d3748'
            }}>
              <div style={{marginBottom: '8px'}}>Hi! I'm your AI Companion!</div>
              <div>Kumusta ako ang iyong AI na katulong</div>
            </div>
            
            {/* Small connector to robot */}
            <svg width="40" height="40" viewBox="0 0 40 40" style={{position: 'absolute', bottom: '-25px', right: '30px'}}>
              <circle cx="20" cy="15" r="10" fill="white" stroke="#e2e8f0" strokeWidth="2" />
              <circle cx="15" cy="25" r="6" fill="white" stroke="#e2e8f0" strokeWidth="2" />
            </svg>
          </div>
          
          {/* Robot character - much larger and more detailed */}
          <div 
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            onClick={toggleMinimize}
            style={{
              cursor: 'pointer',
              width: '120px',
              height: '140px',
              position: 'relative'
            }}
          >
            {/* Robot head */}
            <div style={{
              width: '90px',
              height: '70px',
              backgroundColor: '#4299e1',
              borderRadius: '15px',
              position: 'absolute',
              top: '0',
              left: '15px',
              border: '3px solid #2b6cb0',
              boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
              overflow: 'hidden'
            }}>
              {/* Screen/face */}
              <div style={{
                width: '75px',
                height: '45px',
                backgroundColor: '#2c5282',
                margin: '10px auto',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.3)'
              }}>
                {/* Eyes and smile */}
                <div style={{color: '#63b3ed', fontSize: '30px', fontWeight: 'bold'}}>ᴗ‿ᴗ</div>
              </div>
              {/* Antenna */}
              <div style={{
                width: '15px',
                height: '15px',
                backgroundColor: '#63b3ed',
                borderRadius: '50%',
                position: 'absolute',
                top: '-8px',
                left: '38px',
                border: '2px solid #2b6cb0',
                boxShadow: '0 0 5px rgba(99,179,237,0.8)'
              }}></div>
            </div>
            
            {/* Robot body */}
            <div style={{
              width: '75px',
              height: '60px',
              backgroundColor: 'white',
              borderRadius: '15px',
              position: 'absolute',
              top: '70px',
              left: '22px',
              border: '3px solid #e2e8f0',
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {/* Center chest light */}
              <div style={{
                width: '30px',
                height: '30px',
                backgroundColor: '#4299e1',
                borderRadius: '8px',
                boxShadow: 'inset 0 0 10px rgba(255,255,255,0.8), 0 0 5px rgba(66,153,225,0.5)'
              }}></div>
            </div>
            
            {/* Arms */}
            <div style={{
              width: '20px',
              height: '40px',
              backgroundColor: '#4299e1',
              borderRadius: '8px',
              position: 'absolute',
              top: '75px',
              left: '0',
              border: '3px solid #2b6cb0',
              boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
            }}></div>
            <div style={{
              width: '20px',
              height: '40px',
              backgroundColor: '#4299e1',
              borderRadius: '8px',
              position: 'absolute',
              top: '75px',
              right: '0',
              border: '3px solid #2b6cb0',
              boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
            }}></div>
            
            {/* Legs */}
            <div style={{
              width: '20px',
              height: '25px',
              backgroundColor: '#4299e1',
              borderRadius: '0 0 8px 8px',
              position: 'absolute',
              top: '130px',
              left: '35px',
              border: '3px solid #2b6cb0',
              boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
            }}></div>
            <div style={{
              width: '20px',
              height: '25px',
              backgroundColor: '#4299e1',
              borderRadius: '0 0 8px 8px',
              position: 'absolute',
              top: '130px',
              right: '35px',
              border: '3px solid #2b6cb0',
              boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
            }}></div>
          </div>
        </div>
      ) : (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '400px',
          height: '600px',
          borderRadius: '12px',
          backgroundColor: '#f8fafc',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 1000,
          border: '1px solid #e2e8f0'
        }}>
          {/* Header - with robot character */}
          <div style={{
            padding: '15px 20px',
            backgroundColor: '#1a3a8f',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              {/* Robot icon */}
              <div style={{
                width: '35px',
                height: '35px',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {/* Robot head simplified */}
                <div style={{
                  width: '25px',
                  height: '20px',
                  backgroundColor: '#4299e1',
                  borderRadius: '5px',
                  position: 'absolute',
                  top: '0',
                  border: '1px solid #63b3ed',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <div style={{color: '#1a365d', fontSize: '10px', fontWeight: 'bold'}}>ᴗᴗ</div>
                </div>
                {/* Robot body simplified */}
                <div style={{
                  width: '20px',
                  height: '15px',
                  backgroundColor: 'white',
                  borderRadius: '3px',
                  position: 'absolute',
                  top: '20px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#4299e1',
                    borderRadius: '2px',
                    margin: '2px auto'
                  }}></div>
                </div>
              </div>
              <div>
                <div style={{fontWeight: 'bold', fontSize: '18px'}}>HISTORIA-AI</div>
                <div style={{fontSize: '14px'}}>Assistant</div>
              </div>
            </div>
            <div>
              <span onClick={toggleMinimize} style={{cursor: 'pointer', fontSize: '20px'}}>×</span>
            </div>
          </div>
          
          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            overflowY: 'auto',
            backgroundColor: '#F7FAFC'
          }}>
            {/* Welcome message - styled to match the image */}
            <div style={{
              alignSelf: 'flex-start',
              maxWidth: '80%',
              backgroundColor: '#EBF8FF',
              color: '#2A4365',
              borderRadius: '18px',
              padding: '15px',
              fontSize: '16px',
              marginBottom: '5px'
            }}>
              <div>Hello! I'm your HISTORIA-AI assistant. How can I help you with your history studies today?</div>
              <div style={{fontSize: '12px', color: '#718096', textAlign: 'right', marginTop: '5px'}}>Just now</div>
            </div>
            
            {/* Sample User Message */}
            <div style={{
              alignSelf: 'flex-end',
              maxWidth: '80%',
              backgroundColor: '#1a3a8f',
              color: 'white',
              borderRadius: '18px',
              padding: '15px',
              fontSize: '16px',
              marginBottom: '5px'
            }}>
              <div>Hi! Can you tell me more about the lesson on primary sources?</div>
              <div style={{fontSize: '12px', color: '#CBD5E0', textAlign: 'right', marginTop: '5px'}}>Just now</div>
            </div>
            
            {/* Bot response - styled to match the image */}
            <div style={{
              alignSelf: 'flex-start',
              maxWidth: '80%',
              backgroundColor: '#EBF8FF',
              color: '#2A4365',
              borderRadius: '18px',
              padding: '15px',
              fontSize: '16px',
              marginBottom: '5px'
            }}>
              <div>The lesson on primary sources focuses on understanding and analyzing historical documents, artifacts, and other original materials. You'll learn how to evaluate their authenticity, context, and significance. The lesson includes examples of primary sources like letters, diaries, photographs, and artifacts from the time period being studied.</div>
              <div style={{fontSize: '12px', color: '#718096', textAlign: 'right', marginTop: '5px'}}>Just now</div>
            </div>
            
            {/* Messages from the user */}
            {currentChat?.messages.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                backgroundColor: msg.from === 'user' ? '#1a3a8f' : '#EBF8FF',
                color: msg.from === 'user' ? 'white' : '#2A4365',
                borderRadius: '18px',
                padding: '15px',
                fontSize: '16px',
                marginBottom: '5px'
              }}>
                <div>{msg.text}</div>
                <div style={{fontSize: '12px', color: msg.from === 'user' ? '#CBD5E0' : '#718096', textAlign: 'right', marginTop: '5px'}}>{msg.time}</div>
              </div>
            ))}
          </div>
          
          {/* Input Area - styled to match the image */}
          <div style={{
            padding: '15px',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'white'
          }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Type your message here..."
              style={{
                flex: 1,
                padding: '15px 20px',
                borderRadius: '25px',
                border: '1px solid #E2E8F0',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: '#f8fafc'
              }}
            />
            <button
              onClick={handleSend}
              style={{
                backgroundColor: '#1a3a8f',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '45px',
                height: '45px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
            >
              <span style={{fontSize: '20px'}}>→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
