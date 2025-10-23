import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { FaBuilding } from "react-icons/fa";

const DepartmentView = () => {
  const { isDark } = useTheme();
  
  const departments = [
    { name: "Engineering", reports: 12, resolved: 10 },
    { name: "Sales", reports: 8, resolved: 7 },
    { name: "Marketing", reports: 5, resolved: 5 },
    { name: "HR", reports: 3, resolved: 2 },
  ];

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <FaBuilding className="text-3xl text-indigo-600 mr-3" />
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Department View</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            >
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {dept.name}
              </h3>
              <div className="space-y-2">
                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  Total Reports: <span className="font-bold">{dept.reports}</span>
                </p>
                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  Resolved: <span className="font-bold text-green-600">{dept.resolved}</span>
                </p>
                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  Pending:{" "}
                  <span className="font-bold text-yellow-600">
                    {dept.reports - dept.resolved}
                  </span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentView;
