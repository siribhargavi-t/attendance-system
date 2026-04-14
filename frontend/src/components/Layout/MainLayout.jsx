import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "../Navbar";

const MainLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

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

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main */}
      <div className="flex-1 flex flex-col w-full">
        <Navbar
          darkMode={darkMode}
          toggleDarkMode={handleToggleTheme}
          setOpen={setOpen}
          onLogout={handleLogout}
        />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;