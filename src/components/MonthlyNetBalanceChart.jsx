import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function MonthlyNetBalanceChart({ data }) {
  // Format month string for better display, e.g., "2023-1" to "Jan 2023"
  const formatMonth = (monthString) => {
    const [year, monthNum] = monthString.split('-').map(Number);
    const date = new Date(year, monthNum - 1); // Month is 0-indexed
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Monthly Net Balance Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" dark:stroke="#444" />
          <XAxis dataKey="month" tickFormatter={formatMonth} stroke="#888" dark:stroke="#ccc" />
          <YAxis stroke="#888" dark:stroke="#ccc" />
          <Tooltip
            formatter={(value) => `$${value.toFixed(2)}`}
            labelFormatter={(label) => formatMonth(label)}
            contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '4px' }}
            itemStyle={{ color: '#333' }}
          />
          <Legend />
          <Line type="monotone" dataKey="netBalance" stroke="#8884d8" activeDot={{ r: 8 }} name="Net Balance" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}