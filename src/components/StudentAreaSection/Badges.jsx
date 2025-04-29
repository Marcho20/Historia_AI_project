import React from 'react';

const badgesData = [
  {
    name: 'Math Master',
    icon: '🧮',
    description: 'Awarded for excellence in Mathematics.',
    achieved: true,
    date: '2025-04-10',
  },
  {
    name: 'Science Star',
    icon: '🔬',
    description: 'Outstanding performance in Science.',
    achieved: false,
    date: null,
  },
  {
    name: 'Literature Lover',
    icon: '📚',
    description: 'Exceptional work in English Literature.',
    achieved: true,
    date: '2025-03-28',
  },
  {
    name: 'History Hero',
    icon: '🏛️',
    description: 'Great achievement in History.',
    achieved: false,
    date: null,
  },
  {
    name: 'MAPEH ',
    icon: '🖼️',
    description: 'dsadads.',
    achieved: true,
    date: '2025-04-15',
  },
];

export default function Badges() {
  return (
    <div className="section-content" style={{padding: '24px 10px'}}>
      <h2 style={{marginTop: 0, marginBottom: 28, color: '#2d2a4a', fontWeight: 700, fontSize: '2rem'}}>My Badges</h2>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 28}}>
        {badgesData.map((badge, idx) => (
          <div key={idx} style={{
            minWidth: 200,
            maxWidth: 240,
            background: badge.achieved ? '#fff' : '#f5f6fb',
            borderRadius: 18,
            boxShadow: badge.achieved ? '0 2px 12px #0001' : '0 1px 6px #e4e6fa',
            padding: '30px 18px 22px 18px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            border: badge.achieved ? '2px solid #4b3fa7' : '2px dashed #bfc4e0',
            opacity: badge.achieved ? 1 : 0.65,
            transition: 'all 0.2s',
          }}>
            <span style={{fontSize: 48, marginBottom: 8}}>{badge.icon}</span>
            <div style={{fontWeight: 700, fontSize: 18, color: '#4b3fa7', textAlign: 'center'}}>{badge.name}</div>
            <div style={{fontSize: 15, color: '#3b3e5b', textAlign: 'center', marginBottom: 6}}>{badge.description}</div>
            {badge.achieved ? (
              <div style={{color: '#27ae60', fontWeight: 600, fontSize: 14}}>Achieved on {badge.date}</div>
            ) : (
              <div style={{color: '#888', fontWeight: 500, fontSize: 14}}>Not yet achieved</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
