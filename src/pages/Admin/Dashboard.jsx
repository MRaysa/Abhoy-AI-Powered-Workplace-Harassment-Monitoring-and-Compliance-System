import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import {
  FaFileAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUsers,
} from "react-icons/fa";

const Dashboard = () => {
  const { isDark } = useTheme();
  const stats = [
    {
      title: "Total Reports",
      value: "156",
      icon: <FaFileAlt />,
      color: "from-blue-500 to-cyan-500",
      change: "+12%",
    },
    {
      title: "Pending Cases",
      value: "23",
      icon: <FaExclamationTriangle />,
      color: "from-yellow-500 to-orange-500",
      change: "-5%",
    },
    {
      title: "Resolved",
      value: "133",
      icon: <FaCheckCircle />,
      color: "from-green-500 to-teal-500",
      change: "+8%",
    },
    {
      title: "Active Users",
      value: "342",
      icon: <FaUsers />,
      color: "from-purple-500 to-indigo-500",
      change: "+15%",
    },
  ];

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Admin Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-xl shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div
                className={`bg-gradient-to-r ${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl mb-4`}
              >
                {stat.icon}
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.title}</p>
              <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{stat.value}</p>
              <p className="text-sm text-green-600 mt-2">{stat.change} this month</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className={`rounded-xl shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between border-b pb-4"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    New harassment report submitted
                  </p>
                  <p className="text-sm text-gray-600">2 hours ago</p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
