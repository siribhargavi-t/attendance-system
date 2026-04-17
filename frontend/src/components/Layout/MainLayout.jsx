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
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: darkMode
          ? "linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)"
          : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 30%, #eef2ff 60%, #f5f3ff 100%)",
      }}
    >
      {/* Floating Orbs for visual interest */}
      <div
        className="orb orb-1"
        style={{ opacity: darkMode ? 0.25 : 0.18 }}
      />
      <div
        className="orb orb-2"
        style={{ opacity: darkMode ? 0.2 : 0.15 }}
      />
      <div
        className="orb orb-3"
        style={{ opacity: darkMode ? 0.18 : 0.12 }}
      />

      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="relative z-20">
          <Navbar
            darkMode={darkMode}
            toggleDarkMode={handleToggleTheme}
            setOpen={setOpen}
            onLogout={handleLogout}
          />
        </div>

        <main className="p-6 flex-1 relative z-10">
          <div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;