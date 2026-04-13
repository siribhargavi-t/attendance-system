import React from "react";

const colorThemes = {
  blue: "from-blue-100 via-blue-50 to-white dark:from-blue-900 dark:via-gray-800 dark:to-gray-900 text-blue-700 dark:text-blue-300",
  green: "from-green-100 via-green-50 to-white dark:from-green-900 dark:via-gray-800 dark:to-gray-900 text-green-700 dark:text-green-300",
  red: "from-red-100 via-red-50 to-white dark:from-red-900 dark:via-gray-800 dark:to-gray-900 text-red-700 dark:text-red-300",
  indigo: "from-indigo-100 via-indigo-50 to-white dark:from-indigo-900 dark:via-gray-800 dark:to-gray-900 text-indigo-700 dark:text-indigo-300",
  default: "from-gray-100 via-white to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 text-gray-700 dark:text-gray-200",
};

const StatsCard = ({
  icon,
  title,
  value,
  color = "default",
  className = "",
}) => (
  <div
    className={`
      flex items-center gap-4 p-5 rounded-2xl shadow-md
      bg-gradient-to-br ${colorThemes[color] || colorThemes.default}
      hover:scale-105 hover:shadow-lg transition-transform transition-colors duration-300
      ${className}
    `}
  >
    <div className="text-3xl">{icon}</div>
    <div>
      <div className="text-xs text-gray-500 dark:text-gray-300 font-medium transition-colors duration-300">{title}</div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{value}</div>
    </div>
  </div>
);

export default StatsCard;