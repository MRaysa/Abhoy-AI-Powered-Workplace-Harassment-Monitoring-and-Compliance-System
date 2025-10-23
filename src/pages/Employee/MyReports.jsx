import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaFileAlt, FaEye, FaClock, FaCheckCircle } from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";

const MyReports = () => {
  const { isDark } = useTheme();
  // Sample data - replace with actual API call
  const [reports] = useState([
    {
      id: 1,
      type: "Harassment",
      date: "2024-01-15",
      status: "Under Review",
      description: "Workplace harassment incident in office",
    },
    {
      id: 2,
      type: "Safety Violation",
      date: "2024-01-10",
      status: "Resolved",
      description: "Safety equipment not properly maintained",
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
        return <FaCheckCircle className="text-green-600" />;
      case "Under Review":
        return <FaClock className="text-yellow-600" />;
      default:
        return <FaClock className="text-blue-600" />;
    }
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center mb-6">
            <FaFileAlt className="text-3xl text-indigo-600 mr-3" />
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>My Reports</h1>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className={`rounded-xl shadow-lg p-8 text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <FaFileAlt className={`text-6xl mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  You haven't submitted any reports yet.
                </p>
              </div>
            ) : (
              reports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className={`text-xl font-bold mr-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                          {report.type}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {getStatusIcon(report.status)}
                          <span className="ml-2">{report.status}</span>
                        </span>
                      </div>
                      <p className={`mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{report.description}</p>
                      <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        Submitted on:{" "}
                        {new Date(report.date).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="ml-4 text-indigo-600 hover:text-indigo-700">
                      <FaEye className="text-xl" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MyReports;
