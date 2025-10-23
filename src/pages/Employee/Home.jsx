import React from "react";
import { motion } from "framer-motion";
import { FaShieldAlt, FaFileAlt, FaChartLine, FaUsers, FaUserSecret, FaSearch, FaComments } from "react-icons/fa";
import { Link } from "react-router";
import { useTheme } from "../../contexts/ThemeContext";

const Home = () => {
  const { isDark } = useTheme();
  
  const featuredActions = [
    {
      title: "Anonymous Complaint",
      description: "Report harassment safely without revealing your identity",
      icon: <FaUserSecret className="text-4xl" />,
      link: "/submit-complaint",
      color: "from-indigo-600 to-purple-600",
      badge: "NEW",
      featured: true
    },
    {
      title: "Track Complaint",
      description: "Check the status of your complaint using Anonymous ID",
      icon: <FaSearch className="text-4xl" />,
      link: "/track-complaint",
      color: "from-blue-500 to-cyan-500",
      badge: "NEW",
      featured: true
    },
    {
      title: "Public Forum",
      description: "View verified complaints and show community support",
      icon: <FaComments className="text-4xl" />,
      link: "/forum",
      color: "from-green-500 to-emerald-500",
      badge: "NEW",
      featured: true
    },
  ];

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
      color: "from-orange-500 to-amber-500",
    },
    {
      title: "Legal Support",
      description: "Access legal resources and guidance",
      icon: <FaShieldAlt className="text-4xl" />,
      link: "/employee/legal-support",
      color: "from-violet-500 to-purple-500",
    },
    {
      title: "Workplace Finder",
      description: "Find safe workplace resources",
      icon: <FaUsers className="text-4xl" />,
      link: "/employee/workplace-finder",
      color: "from-teal-500 to-cyan-500",
    },
  ];

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white mb-8 shadow-2xl"
        >
          <div className="flex items-center mb-4">
            <FaShieldAlt className="text-5xl mr-4" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome to SafeDesk</h1>
              <p className="text-lg text-indigo-100">
                Your AI-powered workplace safety companion. Report incidents safely, track
                progress, and access support resources.
              </p>
            </div>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 mt-6">
            <p className="text-sm font-semibold">🔒 Your safety and privacy are our top priorities</p>
          </div>
        </motion.div>

        {/* Featured: Anonymous Complaint System */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>✨ Featured: Anonymous Complaint System</h2>
            <span className="ml-3 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">NEW</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -8, scale: 1.03 }}
              >
                <Link to={action.link}>
                  <div className={`rounded-xl shadow-xl p-6 h-full hover:shadow-2xl transition-all border-2 relative overflow-hidden ${
                    isDark ? 'bg-gray-800 border-gray-700 hover:border-indigo-500' : 'bg-white border-gray-200 hover:border-indigo-400'
                  }`}>
                    {action.badge && (
                      <span className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full text-xs font-bold shadow-lg">
                        {action.badge}
                      </span>
                    )}
                    <div
                      className={`bg-gradient-to-r ${action.color} w-16 h-16 rounded-lg flex items-center justify-center text-white mb-4 shadow-lg`}
                    >
                      {action.icon}
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {action.title}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{action.description}</p>
                    <div className="mt-4 flex items-center text-indigo-600 font-semibold text-sm">
                      <span>Learn More</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Link to={action.link}>
                  <div className={`rounded-xl shadow-lg p-6 h-full hover:shadow-xl transition-shadow ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                  }`}>
                    <div
                      className={`bg-gradient-to-r ${action.color} w-16 h-16 rounded-lg flex items-center justify-center text-white mb-4`}
                    >
                      {action.icon}
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {action.title}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{action.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className={`border-l-4 border-indigo-500 rounded-lg p-6 mb-8 ${
            isDark ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-50 to-indigo-50'
          }`}
        >
          <div className="flex items-start">
            <FaShieldAlt className="text-2xl text-indigo-600 mr-4 mt-1" />
            <div>
              <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>How Anonymous Complaints Work</h3>
              <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Submit complaints without revealing your identity - You receive a unique Anonymous ID</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Provide evidence (files/URLs) OR collect 5+ witness verifications via Google Forms</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Track your complaint status anytime using your Anonymous ID</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Verified complaints appear in the public forum to raise awareness</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Statistics Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className={`rounded-xl shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Your Activity Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
              <p className="text-blue-600 font-semibold mb-2">Total Reports</p>
              <p className="text-4xl font-bold text-blue-700">0</p>
              <p className="text-xs text-blue-600 mt-2">All time submissions</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
              <p className="text-green-600 font-semibold mb-2">Resolved</p>
              <p className="text-4xl font-bold text-green-700">0</p>
              <p className="text-xs text-green-600 mt-2">Successfully completed</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
              <p className="text-yellow-600 font-semibold mb-2">Pending</p>
              <p className="text-4xl font-bold text-yellow-700">0</p>
              <p className="text-xs text-yellow-600 mt-2">Under review</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
