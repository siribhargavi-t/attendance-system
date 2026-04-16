import React, { useState, useRef, useEffect } from "react";
import { FiBell, FiSun, FiMoon } from "react-icons/fi";
import axios from "axios";

const Navbar = ({ darkMode, toggleDarkMode, setOpen, onLogout }) => {
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef();

  const [notifications, setNotifications] = useState([]);

  // ✅ FETCH FROM BACKEND (IMPORTANT FIX)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("userData"));

        if (!user?.email) return;

        const res = await axios.get(
          `http://localhost:5000/api/notifications/${user.email}`
        );

        setNotifications(res.data);
      } catch (err) {
        console.error("Notification fetch error:", err);
      }
    };

    fetchNotifications();

    // 🔁 Optional: auto refresh every 5 sec
    const interval = setInterval(fetchNotifications, 5000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Close dropdown on outside click
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

  // ✅ Count unread
  const unreadCount = notifications.filter(n => !n.read).length;

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
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition relative"
        >
          <FiBell className="text-xl text-gray-700 dark:text-white" />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {showNotif && (
          <div className="absolute right-0 mt-12 w-64 bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 z-50 border dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Notifications
            </h4>

            {notifications.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                No new notifications
              </p>
            ) : (
              <ul className="space-y-2">
                {notifications.map((notif) => (
                  <li
                    key={notif._id}
                    className="text-sm text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded px-3 py-2"
                  >
                    {notif.message}
                  </li>
                ))}
              </ul>
            )}
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