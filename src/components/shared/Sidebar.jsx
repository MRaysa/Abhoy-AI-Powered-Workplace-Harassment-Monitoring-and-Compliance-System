import React from "react";
import { Link, useLocation } from "react-router";
import { motion } from "framer-motion";

const Sidebar = ({ menuItems }) => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white h-screen shadow-lg fixed left-0 top-0 pt-20">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.li
              key={index}
              whileHover={{ x: 5 }}
              className={`rounded-lg ${
                location.pathname === item.path
                  ? "bg-indigo-100 text-indigo-700"
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
