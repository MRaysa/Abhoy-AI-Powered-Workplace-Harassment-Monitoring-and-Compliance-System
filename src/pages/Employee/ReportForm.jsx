import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaFileAlt, FaPaperPlane } from "react-icons/fa";
import Swal from "sweetalert2";

const ReportForm = () => {
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          {/* Header */}
          <div className="flex items-center mb-6">
            <FaFileAlt className="text-3xl text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">
              Report an Incident
            </h1>
          </div>

          <p className="text-gray-600 mb-6">
            Your safety matters. Please provide as much detail as possible to
            help us address your concern effectively.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Incident Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Incident Type *
              </label>
              <select
                name="incidentType"
                value={formData.incidentType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Incident *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Office Floor 3, Meeting Room A"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Please describe what happened in detail..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Witnesses */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Witnesses (if any)
              </label>
              <input
                type="text"
                name="witnesses"
                value={formData.witnesses}
                onChange={handleChange}
                placeholder="Names of any witnesses"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                className="ml-2 block text-sm text-gray-700"
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
