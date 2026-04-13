import React from "react";
import MainLayout from "../../components/Layout/MainLayout";
import StatsCard from "../../components/StatsCard";
import { FiBookOpen, FiUserCheck, FiUserX, FiPercent, FiBarChart2, FiUsers, FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// Dummy data for stats
const stats = [
  {
    label: "Total Classes",
    value: 45,
    icon: <FiBookOpen className="text-blue-500 text-3xl mb-2" />,
    color: "blue",
  },
  {
    label: "Present",
    value: 41,
    icon: <FiUserCheck className="text-green-500 text-3xl mb-2" />,
    color: "green",
  },
  {
    label: "Absent",
    value: 4,
    icon: <FiUserX className="text-red-500 text-3xl mb-2" />,
    color: "red",
  },
  {
    label: "Attendance %",
    value: "91%",
    icon: <FiPercent className="text-indigo-500 text-3xl mb-2" />,
    color: "indigo",
  },
];

// Dummy subject-wise attendance data
const subjectAttendance = [
  { subject: "Mathematics", percent: 85 },
  { subject: "Physics", percent: 92 },
  { subject: "Chemistry", percent: 78 },
  { subject: "English", percent: 95 },
];

// Dummy recent activity data
const recentActivity = [
  { id: 1, name: "Alice Johnson", action: "Marked Present", date: "2024-06-10" },
  { id: 2, name: "Bob Smith", action: "Marked Absent", date: "2024-06-10" },
  { id: 3, name: "Charlie Lee", action: "Marked Present", date: "2024-06-09" },
  { id: 4, name: "Diana Patel", action: "Marked Present", date: "2024-06-09" },
  { id: 5, name: "Ethan Brown", action: "Marked Absent", date: "2024-06-08" },
];

const quickActions = [
  {
    label: "Mark Attendance",
    icon: <FiEdit className="text-blue-600 text-2xl" />,
    onClick: (navigate) => navigate("/student/attendance"),
  },
  {
    label: "View Reports",
    icon: <FiBarChart2 className="text-green-600 text-2xl" />,
    onClick: () => alert("Reports feature coming soon!"),
  },
  {
    label: "Manage Students",
    icon: <FiUsers className="text-indigo-600 text-2xl" />,
    onClick: () => alert("Manage Students feature coming soon!"),
  },
];

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 shadow flex flex-col sm:flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back, Student 👋</h2>
            <p className="text-white text-opacity-90">Here is your attendance overview</p>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Student Dashboard</h1>
          <p className="text-gray-500 text-base">
            Welcome! Here’s your attendance overview and stats.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat) => (
            <StatsCard
              key={stat.label}
              icon={stat.icon}
              title={stat.label}
              value={stat.value}
              color={stat.color}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <div
            className="cursor-pointer rounded-2xl shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white flex flex-col items-center justify-center p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            onClick={() => navigate("/student/attendance")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && navigate("/student/attendance")}
          >
            <div className="text-5xl mb-3">📋</div>
            <div className="text-2xl font-bold mb-1">Mark Attendance</div>
            <div className="text-white/90 text-base">Update today's records</div>
          </div>
        </div>

        {/* Subject-wise Attendance Progress */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Subject-wise Attendance</h2>
          <div className="space-y-4">
            {subjectAttendance.map((subj) => (
              <div key={subj.subject}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-700">{subj.subject}</span>
                  <span className="font-semibold text-blue-700">{subj.percent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300`}
                    style={{
                      width: `${subj.percent}%`,
                      background:
                        subj.percent >= 90
                          ? "#22c55e" // green-500
                          : "#3b82f6", // blue-500
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-3 px-4 text-left">User Name</th>
                  <th className="py-3 px-4 text-left">Action</th>
                  <th className="py-3 px-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity, idx) => (
                  <tr
                    key={activity.id}
                    className={`border-b transition hover:bg-blue-50 ${
                      idx === recentActivity.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="py-3 px-4 font-medium">{activity.name}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          activity.action === "Marked Present"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {activity.action}
                      </span>
                    </td>
                    <td className="py-3 px-4">{activity.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;