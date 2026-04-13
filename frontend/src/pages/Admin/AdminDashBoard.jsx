import React from "react";
import MainLayout from "../../components/Layout/MainLayout";
import Card from "../../components/Card";
import { FiUsers, FiUserCheck, FiUserX, FiBookOpen } from "react-icons/fi";

// Dummy data for stats
const stats = [
  {
    label: "Total Students",
    value: 120,
    icon: <FiUsers className="text-blue-500 text-3xl mb-2" />,
    color: "text-blue-500",
  },
  {
    label: "Present Today",
    value: 110,
    icon: <FiUserCheck className="text-green-500 text-3xl mb-2" />,
    color: "text-green-600",
  },
  {
    label: "Absent Today",
    value: 10,
    icon: <FiUserX className="text-red-500 text-3xl mb-2" />,
    color: "text-red-500",
  },
  {
    label: "Subjects",
    value: 8,
    icon: <FiBookOpen className="text-indigo-500 text-3xl mb-2" />,
    color: "text-indigo-600",
  },
];

const AdminDashboard = () => (
  <MainLayout>
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 shadow flex flex-col sm:flex-row items-center justify-between transition-colors duration-300">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1 transition-colors duration-300">Welcome back, Admin 👋</h2>
          <p className="text-white text-opacity-90">Here is your attendance overview</p>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 transition-colors duration-300">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-300 text-base transition-colors duration-300">
          Welcome! View overall attendance and system stats.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-colors duration-300"
          >
            {stat.icon}
            <span className={`text-3xl font-bold ${stat.color} dark:text-white transition-colors duration-300`}>{stat.value}</span>
            <span className="text-gray-500 dark:text-gray-300 text-sm mt-1 transition-colors duration-300">{stat.label}</span>
          </Card>
        ))}
      </div>
    </div>
  </MainLayout>
);

export default AdminDashboard;
