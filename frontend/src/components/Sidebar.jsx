import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    console.log("ROLE:", role);
    if (!role) {
      navigate("/login");
    }
  }, [role, navigate]);

  if (!role) return null;

  const navLinks = [
    {
      name: "Dashboard",
      to: `/${role}/dashboard`,
      icon: "🏠",
    },
    {
      name: "Attendance",
      to: `/${role}/attendance`,
      icon: "📋",
    },
  ];

  return (
    <nav className="flex flex-col gap-4 pt-8 px-2 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {navLinks.map((link) => {
        const active = location.pathname === link.to;
        return (
          <Link
            key={link.name}
            to={link.to}
            className={`
              relative flex items-center gap-3 px-4 py-3 rounded-xl
              transition-all duration-300
              cursor-pointer
              ${active
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md scale-105"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-700"
              }
              hover:scale-105
            `}
            style={{ minHeight: 56 }}
          >
            {/* Left active indicator bar */}
            <span
              className={`
                absolute left-0 top-2 bottom-2 w-1 rounded-full
                ${active ? "bg-blue-400" : "bg-transparent"}
                transition-all duration-300
              `}
            />
            <span className="text-2xl">{link.icon}</span>
            <span className="font-semibold text-base">{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Sidebar;