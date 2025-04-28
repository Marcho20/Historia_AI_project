import React, { useState } from 'react';

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
  const handleSend = () => {
    if (!input.trim()) return;
    const msg = { text: input, from: 'user', time: getTimeNow() };
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
    // Mock bot reply
    setTimeout(() => {
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

  return (
    <div style={{display: 'flex', height: 'calc(80vh - 60px)'}}>
      {/* Sidebar: Folders */}
      <div style={{width: 210, background: '#f5f6fb', borderRight: '1.5px solid #e4e6fa', padding: 0, display: 'flex', flexDirection: 'column'}}>
        <div style={{padding: '18px 14px 10px 20px', fontWeight: 700, color: '#4b3fa7', fontSize: 18}}>Folders</div>
        <div style={{flex: 1, overflowY: 'auto'}}>
          {folders.map((folder, idx) => (
            <div key={idx} style={{display: 'flex', alignItems: 'center', marginBottom: 4, cursor: 'pointer', background: idx === selectedFolderIdx ? '#e4e6fa' : 'transparent', borderRadius: 8, padding: '6px 14px 6px 18px'}} onClick={() => {setSelectedFolderIdx(idx); setSelectedChatIdx(0);}}>
              <span style={{fontWeight: 600, color: '#3b3e5b'}}>{folder.name}</span>
            </div>
          ))}
        </div>
        {creatingFolder ? (
          <div style={{padding: '10px 0', width: '100%'}}>
            <input
              type="text"
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              style={{
                padding: '6px 10px',
                border: '1px solid #ccc',
                borderRadius: 6,
                width: '90%',
                margin: '0 auto 6px auto',
                display: 'block',
              }}
            />
            <button
              onClick={handleCreateFolder}
              style={{
                background: '#4b3fa7',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '7px 0',
                width: '90%',
                margin: '0 auto',
                fontWeight: 700,
                display: 'block',
              }}
            >Create</button>
          </div>
        ) : (
          <button onClick={handleNewFolder} style={{
            background: '#e4e6fa',
            color: '#4b3fa7',
            border: 'none',
            borderRadius: 6,
            padding: '8px 0',
            width: '90%',
            margin: '12px auto',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'block',
          }}>+ New Folder</button>
        )}
      </div>
      {/* Chat List */}
      <div style={{width: 260, background: '#fff', borderRight: '1.5px solid #e4e6fa', display: 'flex', flexDirection: 'column'}}>
        <div style={{
          padding: '18px 16px 10px 20px',
          fontWeight: 700,
          color: '#4b3fa7',
          fontSize: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 20,
        }}>
          <span style={{fontWeight: 700, fontSize: 18, color: '#4b3fa7'}}>Chats</span>
          <button
            onClick={handleNewChat}
            style={{
              background: '#e4e6fa',
              color: '#4b3fa7',
              border: 'none',
              borderRadius: 6,
              padding: '5px 16px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: 15,
              marginLeft: 18,
            }}
          >+ New Chat</button>
        </div>
        <div style={{flex: 1, overflowY: 'auto'}}>
          {currentFolder?.chats.map((chat, idx) => (
            <div key={chat.id} style={{padding: '8px 16px', cursor: 'pointer', background: idx === selectedChatIdx ? '#f5f6fb' : 'transparent', borderLeft: idx === selectedChatIdx ? '3px solid #4b3fa7' : '3px solid transparent', marginBottom: 2, borderRadius: 7}} onClick={() => setSelectedChatIdx(idx)}>
              <div style={{fontWeight: 600, color: '#2d2a4a', fontSize: 15}}>{chat.title}</div>
              <div style={{color: '#888', fontSize: 13, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{chat.messages[chat.messages.length-1]?.text || 'No messages yet.'}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Chat Window */}
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', background: '#f5f6fb'}}>
        <div style={{padding: '14px 24px', borderBottom: '1.5px solid #e4e6fa', fontWeight: 700, color: '#4b3fa7', fontSize: 18}}>
          {currentChat?.title || 'No Chat Selected'}
        </div>
        <div style={{flex: 1, overflowY: 'auto', padding: '24px 30px 10px 30px', display: 'flex', flexDirection: 'column', gap: 10}}>
          {currentChat?.messages.map((msg, idx) => (
            <div key={idx} style={{alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start', maxWidth: '70%', background: msg.from === 'user' ? '#4b3fa7' : '#fff', color: msg.from === 'user' ? '#fff' : '#2d2a4a', borderRadius: msg.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '10px 16px', fontSize: 15, boxShadow: '0 1px 6px #0001'}}>
              {msg.text}
              <span style={{display: 'block', color: msg.from === 'user' ? '#e4e6fa' : '#888', fontSize: 11, marginTop: 3, textAlign: msg.from === 'user' ? 'right' : 'left'}}>{msg.time}</span>
            </div>
          ))}
        </div>
        {/* Input */}
        {currentChat && (
          <div style={{padding: '14px 24px', borderTop: '1.5px solid #e4e6fa', display: 'flex', alignItems: 'center', background: '#fff'}}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '16px 28px',
                border: '1.5px solid #e4e6fa',
                borderRadius: 16,
                fontSize: 18,
                marginRight: 10,
                minHeight: 44,
                minWidth: 780,
                background: '#f5f6fb',
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={handleSend}
              style={{
                background: '#4b3fa7',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '10px 14px',
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
                minHeight: 40,
                minWidth: 0,
                boxShadow: '0 2px 6px #4b3fa722',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#2d2a4a'}
              onMouseOut={e => e.currentTarget.style.background = '#4b3fa7'}
            >Send</button>
          </div>
        )}
      </div>
    </div>
  );
}
