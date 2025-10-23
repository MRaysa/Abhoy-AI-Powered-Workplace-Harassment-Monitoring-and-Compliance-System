import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { FaCertificate } from "react-icons/fa";

const CertificationPanel = () => {
  const { isDark } = useTheme();
  
  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <FaCertificate className="text-3xl text-indigo-600 mr-3" />
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Certification Panel
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Compliance Certifications
          </h2>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            Manage and track workplace safety certifications and compliance
            requirements.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CertificationPanel;
