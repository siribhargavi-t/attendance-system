import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "../Navbar";
import { FiBell } from "react-icons/fi";

const MainLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleToggleTheme = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // Leave status notification logic
  useEffect(() => {
    const leaveRequests = JSON.parse(localStorage.getItem("leaveRequests") || "[]");
    const notifiedIds = JSON.parse(localStorage.getItem("notifiedLeaveIds") || "[]");
    const newNotifs = leaveRequests
      .filter(req => req.status && req.status !== "Pending" && !notifiedIds.includes(req.id))
      .map(req => ({
        id: req.id,
        message: `Your leave request is ${req.status}.`
      }));
    if (newNotifs.length > 0) {
      setNotifications(newNotifs);
      // Mark these as notified
      const updatedIds = [...notifiedIds, ...newNotifs.map(n => n.id)];
      localStorage.setItem("notifiedLeaveIds", JSON.stringify(updatedIds));
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">

        <Navbar
          darkMode={darkMode}
          toggleDarkMode={handleToggleTheme}
          setOpen={setOpen}
          onLogout={handleLogout}
        />

        {/* Notification Bell */}
        <div className="flex justify-end items-center mb-4 mr-8 relative">
          <button
            className="relative"
            onClick={() => setShowNotif((prev) => !prev)}
            title="Notifications"
          >
            <FiBell className="text-2xl text-gray-700 dark:text-white" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {notifications.length}
              </span>
            )}
          </button>
          {showNotif && notifications.length > 0 && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 z-50 border dark:border-gray-700">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Notifications</h4>
              <ul>
                {notifications.map((notif) => (
                  <li key={notif.id} className="mb-2 text-gray-800 dark:text-gray-200">
                    {notif.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <main className="p-6 relative z-[999] bg-white">
          <div className="relative z-[999]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;