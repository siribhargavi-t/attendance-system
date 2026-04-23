import React, { useState, useRef, useEffect } from "react";
import API from "../services/api";
import ThemeToggle from "./ThemeToggle";

const CustomBell = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFC107" stroke="#1E3A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce-short">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    <path d="M5.5 3a10.9 10.9 0 0 1-2 1" stroke="#38BDF8" strokeWidth="2" />
    <path d="M18.5 3a10.9 10.9 0 0 0 2 1" stroke="#38BDF8" strokeWidth="2" />
  </svg>
);

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

        const res = await API.get(`/api/notifications/${user.email}`
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

  const handleDeleteNotif = async (id) => {
    try {
      await API.delete(`/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Delete notification error:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("userData"));
      if (!user?.email) return;
await API.delete(`/api/notifications/clear/${user.email}`);      setNotifications([]);
    } catch (err) {
      console.error("Clear all error:", err);
    }
  };

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
          onClick={() => setOpen((prev) => !prev)}
          className="text-2xl p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition relative z-20"
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
          <CustomBell />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {showNotif && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-4 z-50 border dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-gray-900 dark:text-white">
                Notifications
              </h4>
              {notifications.length > 0 && (
                <button 
                  onClick={handleClearAll}
                  className="text-xs text-blue-500 hover:text-blue-600 font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  All caught up! 
                </p>
              </div>
            ) : (
              <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {notifications.map((notif) => (
                  <li
                    key={notif._id}
                    className="group relative text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all"
                  >
                    <div className="pr-6">{notif.message}</div>
                    <button
                      onClick={() => handleDeleteNotif(notif._id)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                      title="Dismiss"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* 🌙 Dark Mode */}
        <ThemeToggle />

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