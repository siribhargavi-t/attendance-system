import React, { useState } from "react";
import { FiBell, FiSun, FiMoon } from "react-icons/fi";

const notifications = [
  { id: 1, text: "Attendance marked for today." },
  { id: 2, text: "New student registered." },
];

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [showNotif, setShowNotif] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-900 shadow transition">
      <div className="text-xl font-bold text-blue-700 tracking-tight">Attendance System</div>
      <div className="flex items-center gap-4 relative">
        {/* Notifications */}
        <button
          onClick={() => setShowNotif((s) => !s)}
          className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <FiBell className="text-xl" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        {showNotif && (
          <div className="absolute right-0 mt-12 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 z-50">
            <h4 className="font-semibold mb-2">Notifications</h4>
            <ul>
              {notifications.map((n) => (
                <li key={n.id} className="py-1 text-sm border-b last:border-b-0">{n.text}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;