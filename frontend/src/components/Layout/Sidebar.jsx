import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef();

  useEffect(() => {
    if (!role) navigate("/login");
  }, [role, navigate]);

  // Close profile on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };

    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfile]);

  if (!role) return null;

  let attendanceLabel = "Attendance";
  if (role === "admin") attendanceLabel = "View Attendance";
  if (role === "faculty") attendanceLabel = "Mark Attendance";

  const navLinks = [
    { name: "Dashboard", to: `/${role}/dashboard`, icon: "🏠" },
    { name: attendanceLabel, to: `/${role}/attendance`, icon: "📋" },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full w-60 z-50 flex flex-col
      bg-white dark:bg-gray-900 shadow-xl border-r p-4
      transition-transform duration-300
      ${open ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* 🔷 HEADER WITH CLOSE BUTTON */}
      <div className="flex items-center justify-between mb-8 px-2">
        <span className="text-2xl font-bold text-blue-600">
          AttendPro
        </span>

        <button
          onClick={() => setOpen(false)}
          className="text-xl p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          ✕
        </button>
      </div>

      {/* 🔷 Navigation */}
      <nav className="flex flex-col gap-4">
        {navLinks.map((link) => {
          const active = location.pathname === link.to;

          return (
            <Link
              key={link.name}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              ${
                active
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-gray-700"
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 🔷 PROFILE SECTION */}
      <div className="mt-auto pt-6 border-t relative" ref={profileRef}>
        <div
          onClick={() => setShowProfile((prev) => !prev)}
          className="flex items-center gap-3 px-2 py-2 cursor-pointer rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <div className="w-9 h-9 bg-blue-200 dark:bg-blue-900 rounded-full flex items-center justify-center">
            👤
          </div>
          <span className="capitalize text-gray-700 dark:text-white font-medium">
            {role}
          </span>
        </div>

        {showProfile && (
          <div className="absolute bottom-14 left-2 w-56 bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 z-50 border dark:border-gray-700">
            <p className="font-semibold text-gray-900 dark:text-white">
              Demo User
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-300 capitalize">
              {role}
            </p>

            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              <p>Email: {role}@gmail.com</p>
              <p>Dept: CSE</p>
            </div>

            <button
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
              className="mt-3 w-full bg-red-500 text-white py-1 rounded-lg"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;