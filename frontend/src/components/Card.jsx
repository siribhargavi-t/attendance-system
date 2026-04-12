import React from "react";
import { motion } from "framer-motion";

const Card = ({ children, className = "" }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={`bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 ${className} transition`}
  >
    {children}
  </motion.div>
);

export default Card;