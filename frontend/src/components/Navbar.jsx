import React, { useState, useRef, useEffect } from "react";
import { FiBell, FiSun, FiMoon } from "react-icons/fi";

const Navbar = ({ darkMode, toggleDarkMode, setOpen, onLogout }) => {
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef();

  // ✅ Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };

    if (showNotif) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotif]);

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-900 shadow border-b dark:border-gray-700">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(true)}
          className="text-2xl p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          ☰
        </button>

        <span className="text-xl font-bold text-gray-900 dark:text-white">
          Attendance System
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 relative" ref={notifRef}>

        {/* 🔔 Notifications */}
        <button
          onClick={() => setShowNotif((prev) => !prev)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <FiBell className="text-xl text-gray-700 dark:text-white" />
        </button>

        {/* Dropdown */}
        {showNotif && (
          <div className="absolute right-0 mt-12 w-64 bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 z-50 border dark:border-gray-700 transition-all duration-200">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Notifications
            </h4>

            <p className="text-sm text-gray-600 dark:text-gray-300">
              No new notifications
            </p>
          </div>
        )}

        {/* 🌙 Dark Mode */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? (
            <FiSun className="text-yellow-400" />
          ) : (
            <FiMoon className="text-gray-700 dark:text-white" />
          )}
        </button>

        {/* 🚪 Logout */}
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;