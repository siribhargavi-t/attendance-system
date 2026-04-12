import React from "react";
import { NavLink } from "react-router-dom";
import { FiUser, FiHome, FiClipboard } from "react-icons/fi";

const navLinks = [
  { name: "Dashboard", to: "/dashboard", icon: <FiHome /> },
  { name: "Attendance", to: "/attendance", icon: <FiClipboard /> },
];

const Sidebar = () => (
  <aside className="fixed inset-y-0 left-0 w-56 bg-white shadow-lg z-30 flex flex-col py-6 px-4">
    <div className="mb-10 text-2xl font-bold text-blue-600 tracking-wide px-2">
      AttendPro
    </div>
    <nav className="flex-1">
      <ul className="space-y-2">
        {navLinks.map((link) => (
          <li key={link.name}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition 
                ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`
              }
            >
              {link.icon}
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
    <div className="mt-auto flex items-center gap-3 px-2">
      <div className="w-9 h-9 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 text-xl">
        <FiUser />
      </div>
      <span className="font-medium text-gray-700">User</span>
    </div>
  </aside>
);

const Navbar = () => (
  <header className="sticky top-0 z-20 bg-white/80 backdrop-blur shadow flex items-center h-16 px-8">
    <h1 className="text-xl font-semibold text-gray-800 flex-1">
      Attendance Management System
    </h1>
    <div className="w-9 h-9 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 text-xl">
      <FiUser />
    </div>
  </header>
);

const MainLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50 flex">
    {/* Sidebar */}
    <Sidebar />
    {/* Main content area */}
    <div className="flex-1 ml-56 flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gradient-to-br from-blue-50 via-white to-green-50">
        {children}
      </main>
    </div>
  </div>
);

export default MainLayout;