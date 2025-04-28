import React, { useState } from 'react';
import CalendarLib from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Dummy event data (replace with real data later)
const events = [
  { date: '2025-04-28', title: 'Math Quiz', color: '#4b3fa7' },
  { date: '2025-04-29', title: 'Science Project Due', color: '#27ae60' },
  { date: '2025-05-01', title: 'English Essay', color: '#f39c12' },
  { date: '2025-05-03', title: 'School Event', color: '#e74c3c' },
];

function getEventsForDate(date) {
  const d = date.toISOString().slice(0, 10);
  return events.filter(ev => ev.date === d);
}

export default function Calendar() {
  const [value, setValue] = useState(new Date());
  return (
    <div className="section-content" style={{padding: '24px 10px', minHeight: 600}}>
      <h2 style={{marginTop: 0, marginBottom: 28, color: '#2d2a4a', fontWeight: 700, fontSize: '2rem'}}>Calendar</h2>
      <div style={{maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 18, boxShadow: '0 2px 18px #0001', padding: 30}}>
        <CalendarLib
          onChange={setValue}
          value={value}
          tileContent={({ date, view }) => {
            if (view === 'month') {
              const todaysEvents = getEventsForDate(date);
              return (
                <div style={{marginTop: 2, display: 'flex', justifyContent: 'center', gap: 3}}>
                  {todaysEvents.map((ev, i) => (
                    <span key={i} style={{display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: ev.color}} title={ev.title}></span>
                  ))}
                </div>
              );
            }
            return null;
          }}
          tileClassName={({ date, view }) => {
            // Highlight today
            const today = new Date();
            if (view === 'month' && date.toDateString() === today.toDateString()) {
              return 'react-calendar__tile--active';
            }
            return null;
          }}
        />
      </div>
    </div>
  );
}
