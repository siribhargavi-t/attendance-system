import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { FiSun, FiMoon, FiUser } from "react-icons/fi";

const Navbar = ({ onToggleTheme, darkMode }) => (
  <header
    className="
      h-16
      bg-white/70 dark:bg-gray-900/80
      backdrop-blur-md
      shadow-sm
      flex items-center px-6 justify-between
      border-b border-gray-200 dark:border-gray-700
      transition-colors duration-300
    "
  >
    <h1 className="text-lg font-semibold text-gray-800 dark:text-white transition-colors duration-300">
      Attendance Management System
    </h1>
    <div className="flex items-center gap-3">
      <button
        onClick={onToggleTheme}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <FiSun className="text-xl text-yellow-400" />
        ) : (
          <FiMoon className="text-xl text-gray-600 dark:text-gray-300" />
        )}
      </button>
      <FiUser className="text-2xl text-gray-500 dark:text-gray-300" />
      <button
        onClick={() => {
          if (window.confirm("Are you sure you want to logout?")) {
            localStorage.clear();
            window.location.href = "/login";
          }
        }}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition-colors duration-300"
      >
        Logout
      </button>
    </div>
  </header>
);

const MainLayout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(
    () =>
      localStorage.getItem("theme") === "dark" ||
      (window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleToggleTheme = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-60 flex flex-col">
        <Navbar onToggleTheme={handleToggleTheme} darkMode={darkMode} />
        <main className="p-6 transition-colors duration-300">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;