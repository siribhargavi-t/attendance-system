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