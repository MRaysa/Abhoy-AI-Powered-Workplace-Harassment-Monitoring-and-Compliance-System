import React from "react";
import { motion } from "framer-motion";
import { FaCertificate } from "react-icons/fa";

const CertificationPanel = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <FaCertificate className="text-3xl text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">
            Certification Panel
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Compliance Certifications
          </h2>
          <p className="text-gray-600">
            Manage and track workplace safety certifications and compliance
            requirements.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CertificationPanel;
