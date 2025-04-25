import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#6c63ff', '#b39ddb', '#9575cd', '#7e57c2', '#5e35b1'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.1;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#444" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={15} fontWeight={500}>
      {name}
      <tspan x={x} dy={20} fontSize={14} fontWeight={400} fill="#888">{value} views</tspan>
    </text>
  );
};

const MostViewedLessonsChart = ({ data, height = 340 }) => (
  <div style={{ width: '100%', height }}>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="views"
          nameKey="subject"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={110}
          fill="#8884d8"
          label={renderCustomizedLabel}
          labelLine={false}
          isAnimationActive={true}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ boxShadow: '0 2px 12px 2px rgba(44,62,80,0.14)', borderRadius: 10, fontSize: 16 }}
          formatter={(value, name, props) => [`${value} views (${((value / data.reduce((a, b) => a + b.views, 0)) * 100).toFixed(2)}%)`, props.payload.subject]}
        />
        <Legend
          layout="horizontal"
          align="center"
          verticalAlign="bottom"
          iconType="circle"
          wrapperStyle={{ fontSize: 16, marginTop: 24 }}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default MostViewedLessonsChart;
