import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useContext(UserContext);
  const role = user?.role;

  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef();

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

  // Role-based links
  let navLinks = [];
  if (role === "admin") {
    navLinks = [
      { name: "Dashboard", to: "/admin/dashboard", icon: "🏠" },
      { name: "Profile", to: "/admin/profile", icon: "👤" },
      { name: "Settings", to: "/admin/settings", icon: "⚙️" },
      { name: "Mail", to: "/admin/mail", icon: "📧" },
      { name: attendanceLabel, to: "/admin/attendance", icon: "📋" },
    ];
  } else if (role === "faculty") {
    navLinks = [
      { name: "Dashboard", to: "/faculty/dashboard", icon: "🏠" },
      { name: "Profile", to: "/faculty/profile", icon: "👤" },
      { name: "Settings", to: "/faculty/settings", icon: "⚙️" },
      { name: "Mail", to: "/faculty/mail", icon: "📧" },
      { name: attendanceLabel, to: "/faculty/attendance", icon: "📋" },
      { name: "Leave Requests", to: "/faculty/leave-requests", icon: "🗂️" },
    ];
  } else if (role === "student") {
    navLinks = [
      { name: "Dashboard", to: "/student/dashboard", icon: "🏠" },
      { name: "Profile", to: "/student/profile", icon: "👤" },
      { name: "Settings", to: "/student/settings", icon: "⚙️" },
      { name: "Mail", to: "/student/mail", icon: "📧" },
      { name: attendanceLabel, to: "/student/attendance", icon: "📋" },
      { name: "Leave Request", to: "/student/leave-request", icon: "📝" },
    ];
  }

  return (
    <>
      {/* ✅ Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ✅ Sidebar ONLY when open */}
      {open && (
        <aside
          className="fixed left-0 top-0 h-full w-60 z-50 flex flex-col
          bg-white dark:bg-gray-900 shadow-xl border-r p-4
          transition-all duration-300"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between mb-8 px-2">
            <span className="text-2xl font-bold text-blue-600">
              AttendPro
            </span>

            <button
              onClick={() => setOpen(false)}
              className="text-xl p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              ✕
            </button>
          </div>

          {/* NAVIGATION */}
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

          {/* PROFILE */}
          <div className="mt-auto pt-6 border-t relative" ref={profileRef}>
            <div
              onClick={() => setShowProfile((prev) => !prev)}
              className="flex items-center gap-3 px-2 py-2 cursor-pointer rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800 overflow-hidden">
                {user?.image ? (
                  <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl text-white">👤</span>
                )}
              </div>
              <span className="capitalize text-gray-800 dark:text-gray-100 font-bold tracking-wide">
                {role}
              </span>
            </div>

            {showProfile && (
              <div className="absolute bottom-14 left-2 w-56 bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 z-50 border dark:border-gray-700">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {user.name || "Demo User"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300 capitalize">
                  {role}
                </p>

                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  <p>Email: {user.email}</p>
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
      )}
    </>
  );
};

export default Sidebar;