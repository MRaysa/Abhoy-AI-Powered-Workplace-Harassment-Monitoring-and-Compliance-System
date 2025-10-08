import React from "react";
import { motion } from "framer-motion";

const Card = ({ title, children, icon, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg p-6 ${className}`}
    >
      {(title || icon) && (
        <div className="flex items-center mb-4">
          {icon && <div className="text-2xl text-indigo-600 mr-3">{icon}</div>}
          {title && <h3 className="text-xl font-bold text-gray-800">{title}</h3>}
        </div>
      )}
      {children}
    </motion.div>
  );
};

export default Card;
