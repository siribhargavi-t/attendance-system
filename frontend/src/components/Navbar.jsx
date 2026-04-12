import { useTheme } from "../../contexts/ThemeContext";
import { FiSun, FiMoon, FiBell } from "react-icons/fi";
import { useState } from "react";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [showNotif, setShowNotif] = useState(false);
  const notifications = [
    { id: 1, text: "Attendance marked for today." },
    { id: 2, text: "New student registered." },
  ];

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white border-b">
      <h1 className="font-semibold text-lg">Dashboard</h1>

      <button
        onClick={toggleDarkMode}
        className="ml-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <FiSun /> : <FiMoon />}
      </button>

      <button
        onClick={() => setShowNotif((s) => !s)}
        className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <FiBell />
        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      {showNotif && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 z-50">
          <h4 className="font-semibold mb-2">Notifications</h4>
          <ul>
            {notifications.map((n) => (
              <li key={n.id} className="py-1 text-sm">{n.text}</li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;