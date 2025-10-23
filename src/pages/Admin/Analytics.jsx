import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { FaChartBar } from "react-icons/fa";

const Analytics = () => {
  const { isDark } = useTheme();
  
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
            <div className={`h-64 flex items-center justify-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Chart placeholder - Integrate charting library
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
            <div className={`h-64 flex items-center justify-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Chart placeholder - Integrate charting library
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
