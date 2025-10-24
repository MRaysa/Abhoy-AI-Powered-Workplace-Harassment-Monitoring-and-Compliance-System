import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { FaChartBar } from "react-icons/fa";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const { isDark } = useTheme();
  
  // Sample data for Reports by Type
  const reportTypeData = [
    { name: 'Verbal Harassment', value: 35, color: '#8884d8' },
    { name: 'Physical Harassment', value: 15, color: '#82ca9d' },
    { name: 'Sexual Harassment', value: 20, color: '#ffc658' },
    { name: 'Discrimination', value: 25, color: '#ff7c7c' },
    { name: 'Other', value: 5, color: '#8dd1e1' }
  ];

  // Sample data for Monthly Trends
  const monthlyData = [
    { month: 'Jan', reports: 12, resolved: 10 },
    { month: 'Feb', reports: 19, resolved: 17 },
    { month: 'Mar', reports: 15, resolved: 14 },
    { month: 'Apr', reports: 22, resolved: 18 },
    { month: 'May', reports: 18, resolved: 16 },
    { month: 'Jun', reports: 25, resolved: 23 },
    { month: 'Jul', reports: 20, resolved: 19 },
    { month: 'Aug', reports: 17, resolved: 15 },
    { month: 'Sep', reports: 23, resolved: 20 },
    { month: 'Oct', reports: 28, resolved: 25 },
    { month: 'Nov', reports: 21, resolved: 19 },
    { month: 'Dec', reports: 16, resolved: 15 }
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <FaChartBar className="text-3xl text-indigo-600 mr-3" />
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Analytics</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
          >
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Reports by Type
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={reportTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {reportTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    color: isDark ? '#ffffff' : '#000000'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap gap-2">
              {reportTypeData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
          >
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Monthly Trends
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="month" 
                  stroke={isDark ? '#9ca3af' : '#6b7280'}
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke={isDark ? '#9ca3af' : '#6b7280'}
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    color: isDark ? '#ffffff' : '#000000'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '14px' }}
                  iconType="line"
                />
                <Line 
                  type="monotone" 
                  dataKey="reports" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Total Reports"
                  dot={{ fill: '#8884d8', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Resolved"
                  dot={{ fill: '#82ca9d', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
