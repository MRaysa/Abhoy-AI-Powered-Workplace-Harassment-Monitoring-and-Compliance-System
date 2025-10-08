import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaSearch, FaStar } from "react-icons/fa";

const WorkplaceFinder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [workplaces] = useState([
    {
      id: 1,
      name: "TechCorp Solutions",
      location: "San Francisco, CA",
      rating: 4.5,
      safetyScore: 95,
      description:
        "Leading tech company with excellent safety policies and inclusive culture",
    },
    {
      id: 2,
      name: "InnovateLabs",
      location: "New York, NY",
      rating: 4.8,
      safetyScore: 98,
      description:
        "Award-winning workplace safety program and harassment prevention",
    },
    {
      id: 3,
      name: "Creative Minds Agency",
      location: "Austin, TX",
      rating: 4.3,
      safetyScore: 92,
      description: "Strong commitment to employee wellbeing and safe work environment",
    },
  ]);

  const filteredWorkplaces = workplaces.filter(
    (workplace) =>
      workplace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workplace.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center mb-6">
            <FaMapMarkerAlt className="text-3xl text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">
              Safe Workplace Finder
            </h1>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by company name or location..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <FaSearch className="absolute left-4 top-4 text-gray-400" />
            </div>
          </div>

          {/* Workplaces List */}
          <div className="space-y-4">
            {filteredWorkplaces.map((workplace, index) => (
              <motion.div
                key={workplace.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {workplace.name}
                    </h3>
                    <p className="text-gray-600 mb-2 flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-indigo-600" />
                      {workplace.location}
                    </p>
                    <p className="text-gray-600 mb-4">{workplace.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <FaStar className="text-yellow-500 mr-1" />
                        <span className="font-semibold">
                          {workplace.rating}/5.0
                        </span>
                      </div>
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Safety Score: {workplace.safetyScore}%
                      </div>
                    </div>
                  </div>
                  <button className="ml-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredWorkplaces.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-600 text-lg">
                No workplaces found matching your search.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default WorkplaceFinder;
