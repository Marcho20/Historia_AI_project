import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#6c63ff', '#b39ddb', '#9575cd'];

const StudentQuizTrendsChart = ({ data, height = 340 }) => (
  <div style={{ width: '100%', height }}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 32, right: 40, left: 10, bottom: 24 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" tick={{ fontSize: 15 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 15 }} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 15, marginTop: 16 }} />
        {Object.keys(data[0] || {}).filter(key => key !== 'week').map((subject, idx) => (
          <Line key={subject} type="monotone" dataKey={subject} stroke={COLORS[idx % COLORS.length]} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default StudentQuizTrendsChart;
