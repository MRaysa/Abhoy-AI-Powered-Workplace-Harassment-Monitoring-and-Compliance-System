import React from "react";
import { motion } from "framer-motion";
import { FaShieldAlt, FaFileAlt, FaChartLine, FaUsers } from "react-icons/fa";
import { Link } from "react-router";

const Home = () => {
  const quickActions = [
    {
      title: "Report Incident",
      description: "Submit a harassment or safety concern",
      icon: <FaFileAlt className="text-4xl" />,
      link: "/employee/report",
      color: "from-red-500 to-pink-500",
    },
    {
      title: "My Reports",
      description: "View and track your submitted reports",
      icon: <FaChartLine className="text-4xl" />,
      link: "/employee/reports",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Legal Support",
      description: "Access legal resources and guidance",
      icon: <FaShieldAlt className="text-4xl" />,
      link: "/employee/legal-support",
      color: "from-green-500 to-teal-500",
    },
    {
      title: "Workplace Finder",
      description: "Find safe workplace resources",
      icon: <FaUsers className="text-4xl" />,
      link: "/employee/workplace-finder",
      color: "from-purple-500 to-indigo-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Welcome to SafeDesk</h1>
          <p className="text-lg text-indigo-100">
            Your AI-powered workplace safety companion. Report incidents, track
            progress, and access support resources.
          </p>
        </motion.div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Link to={action.link}>
                <div className="bg-white rounded-xl shadow-lg p-6 h-full hover:shadow-xl transition-shadow">
                  <div
                    className={`bg-gradient-to-r ${action.color} w-16 h-16 rounded-lg flex items-center justify-center text-white mb-4`}
                  >
                    {action.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600">{action.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Statistics Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-600 font-semibold">Total Reports</p>
              <p className="text-3xl font-bold text-blue-700">0</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-green-600 font-semibold">Resolved</p>
              <p className="text-3xl font-bold text-green-700">0</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-yellow-600 font-semibold">Pending</p>
              <p className="text-3xl font-bold text-yellow-700">0</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
