import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ActiveUsersChart = ({ data, height = 340 }) => (
  <div style={{ width: '100%', height }}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 32, right: 40, left: 10, bottom: 24 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" tick={{ fontSize: 15 }} />
        <YAxis tick={{ fontSize: 15 }} />
        <Tooltip />
        <Line type="monotone" dataKey="users" stroke="#6c63ff" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default ActiveUsersChart;
