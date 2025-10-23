import React from "react";
import { Link, useLocation } from "react-router";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

const Sidebar = ({ menuItems }) => {
  const location = useLocation();
  const { isDark } = useTheme();

  return (
    <div className={`w-64 h-screen shadow-lg fixed left-0 top-0 pt-20 transition-colors duration-300 ${
      isDark ? 'bg-gray-800 border-r border-gray-700' : 'bg-white'
    }`}>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.li
              key={index}
              whileHover={{ x: 5 }}
              className={`rounded-lg transition-colors duration-200 ${
                location.pathname === item.path
                  ? isDark 
                    ? "bg-indigo-600 text-white" 
                    : "bg-indigo-100 text-indigo-700"
                  : isDark
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Link
                to={item.path}
                className="flex items-center p-3 space-x-3"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
