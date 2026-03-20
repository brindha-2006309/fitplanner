// src/components/ProgressChart.js - Recharts line chart for weight/calories progress

import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const ProgressChart = ({ data }) => {
  // Format date for display on chart
  const formattedData = data.map((entry) => ({
    ...entry,
    date: new Date(entry.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
  }));

  return (
    <div className="card">
      <h3 className="text-white font-bold text-lg mb-4">📈 Progress Overview</h3>
      {formattedData.length === 0 ? (
        <div className="text-slate-400 text-center py-10">
          No progress data yet. Start logging your daily stats!
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={formattedData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              labelStyle={{ color: '#f97316' }}
              itemStyle={{ color: '#f1f5f9' }}
            />
            <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '13px' }} />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ fill: '#f97316', r: 4 }}
              name="Weight (kg)"
            />
            <Line
              type="monotone"
              dataKey="caloriesBurned"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              name="Calories Burned"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ProgressChart;
