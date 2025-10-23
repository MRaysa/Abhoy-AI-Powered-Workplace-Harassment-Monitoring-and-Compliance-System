import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaFileAlt, FaPaperPlane } from "react-icons/fa";
import Swal from "sweetalert2";
import { useTheme } from "../../contexts/ThemeContext";

const ReportForm = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    incidentType: "",
    date: "",
    location: "",
    description: "",
    witnesses: "",
    anonymous: false,
  });

  const [loading, setLoading] = useState(false);

  const incidentTypes = [
    "Harassment",
    "Discrimination",
    "Bullying",
    "Safety Violation",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement API call to submit report
      await new Promise((resolve) => setTimeout(resolve, 1500));

      await Swal.fire({
        icon: "success",
        title: "Report Submitted",
        text: "Your report has been submitted successfully. We will review it shortly.",
        confirmButtonColor: "#4F46E5",
      });

      // Reset form
      setFormData({
        incidentType: "",
        date: "",
        location: "",
        description: "",
        witnesses: "",
        anonymous: false,
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Failed to submit report. Please try again.",
        confirmButtonColor: "#4F46E5",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl shadow-lg p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        >
          {/* Header */}
          <div className="flex items-center mb-6">
            <FaFileAlt className="text-3xl text-indigo-600 mr-3" />
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Report an Incident
            </h1>
          </div>

          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Your safety matters. Please provide as much detail as possible to
            help us address your concern effectively.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Incident Type */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Incident Type *
              </label>
              <select
                name="incidentType"
                value={formData.incidentType}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                }`}
              >
                <option value="">Select incident type</option>
                {incidentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Date of Incident *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                }`}
              />
            </div>

            {/* Location */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Office Floor 3, Meeting Room A"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'
                }`}
              />
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Please describe what happened in detail..."
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'
                }`}
              />
            </div>

            {/* Witnesses */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Witnesses (if any)
              </label>
              <input
                type="text"
                name="witnesses"
                value={formData.witnesses}
                onChange={handleChange}
                placeholder="Names of any witnesses"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'
                }`}
              />
            </div>

            {/* Anonymous Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="anonymous"
                name="anonymous"
                checked={formData.anonymous}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="anonymous"
                className={`ml-2 block text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Submit anonymously
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold flex items-center justify-center ${
                loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
              } transition-colors shadow-md`}
            >
              <FaPaperPlane className="mr-2" />
              {loading ? "Submitting..." : "Submit Report"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportForm;
