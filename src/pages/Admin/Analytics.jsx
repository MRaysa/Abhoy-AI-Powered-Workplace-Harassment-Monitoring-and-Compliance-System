import React from "react";
import { motion } from "framer-motion";
import { FaChartBar } from "react-icons/fa";

const Analytics = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <FaChartBar className="text-3xl text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Reports by Type
            </h2>
            <div className="h-64 flex items-center justify-center text-gray-500">
              Chart placeholder - Integrate charting library
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Monthly Trends
            </h2>
            <div className="h-64 flex items-center justify-center text-gray-500">
              Chart placeholder - Integrate charting library
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
