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
    <aside className="fixed top-0 left-0 h-full w-60 bg-white shadow-xl border-r p-4 z-40 flex flex-col">
      
      {/* 🔷 Logo */}
      <div className="text-2xl font-bold text-blue-600 mb-8 px-2">
        AttendPro
      </div>

      {/* 🔷 Navigation */}
      <nav className="flex flex-col gap-4">
        {navLinks.map((link) => {
          const active = location.pathname === link.to;

          return (
            <Link
              key={link.name}
              to={link.to}
              className={`
                relative flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-300
                ${active
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                }
                hover:scale-105
              `}
            >
              {/* Active Indicator */}
              <span
                className={`absolute left-0 top-2 bottom-2 w-1 rounded-full ${
                  active ? "bg-blue-400" : "bg-transparent"
                }`}
              />

              {/* Icon */}
              <span className="text-xl">{link.icon}</span>

              {/* Text */}
              <span className="font-semibold">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 🔷 Bottom User Section */}
      <div className="mt-auto pt-6 border-t flex items-center gap-3 px-2">
        <div className="w-9 h-9 bg-blue-200 rounded-full flex items-center justify-center">
          👤
        </div>
        <span className="text-gray-700 font-medium capitalize">{role}</span>
      </div>

    </aside>
  );
};

export default Sidebar;