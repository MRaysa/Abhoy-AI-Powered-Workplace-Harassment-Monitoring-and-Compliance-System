import React from "react";
import { motion } from "framer-motion";
import { FaShieldAlt, FaBook, FaPhone, FaEnvelope } from "react-icons/fa";

const LegalSupport = () => {
  const resources = [
    {
      title: "Know Your Rights",
      description:
        "Understanding workplace harassment laws and your legal protections",
      icon: <FaBook className="text-3xl" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Legal Consultation",
      description: "Connect with legal professionals for expert guidance",
      icon: <FaPhone className="text-3xl" />,
      color: "from-green-500 to-teal-500",
    },
    {
      title: "Documentation Guide",
      description: "Learn how to properly document incidents for legal purposes",
      icon: <FaEnvelope className="text-3xl" />,
      color: "from-purple-500 to-indigo-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center mb-6">
            <FaShieldAlt className="text-3xl text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Legal Support</h1>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {resources.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
              >
                <div
                  className={`bg-gradient-to-r ${resource.color} w-16 h-16 rounded-lg flex items-center justify-center text-white mb-4`}
                >
                  {resource.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600">{resource.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Emergency Contact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl shadow-lg p-8 text-white"
          >
            <h2 className="text-2xl font-bold mb-4">
              Emergency Legal Assistance
            </h2>
            <p className="mb-4">
              If you're in immediate danger or need urgent legal support:
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <a
                href="tel:1-800-XXX-XXXX"
                className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition"
              >
                Call Hotline: 1-800-XXX-XXXX
              </a>
              <a
                href="mailto:legal@safedesk.com"
                className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition"
              >
                Email: legal@safedesk.com
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LegalSupport;
