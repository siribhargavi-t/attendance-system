import React, { useState } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import StatsCard from "../../components/StatsCard";
import { FiBookOpen, FiUserCheck, FiUserX, FiPercent } from "react-icons/fi";

// Dummy data for stats
const DUMMY_STATS = [
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
const DUMMY_SUBJECT_ATTENDANCE = [
  { subject: "Mathematics", percent: 85 },
  { subject: "Physics", percent: 92 },
  { subject: "Chemistry", percent: 78 },
  { subject: "English", percent: 95 },
];

// Dummy recent attendance data (show only 5)
const DUMMY_RECENT_ATTENDANCE = [
  { date: "2024-06-10", subject: "Mathematics", status: "Present" },
  { date: "2024-06-10", subject: "Physics", status: "Absent" },
  { date: "2024-06-09", subject: "Chemistry", status: "Present" },
  { date: "2024-06-09", subject: "English", status: "Present" },
  { date: "2024-06-08", subject: "Mathematics", status: "Absent" },
];

const StudentDashboard = () => {
  console.log("StudentDashboard rendered");

  // Use state to allow future backend integration
  const [stats] = useState(DUMMY_STATS);
  const [subjectAttendance] = useState(DUMMY_SUBJECT_ATTENDANCE);
  const [recentAttendance] = useState(DUMMY_RECENT_ATTENDANCE);

  // Attendance Insights calculation
  const bestSubject =
    subjectAttendance.length > 0
      ? subjectAttendance.reduce((best, subj) =>
          subj.percent > best.percent ? subj : best,
        subjectAttendance[0])
      : null;
  const lowSubject =
    subjectAttendance.length > 0
      ? subjectAttendance.reduce((low, subj) =>
          subj.percent < low.percent ? subj : low,
        subjectAttendance[0])
      : null;

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 shadow flex flex-col sm:flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back, Student 👋</h2>
            <p className="text-white text-opacity-90">Here is your attendance overview</p>
          </div>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Student Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 text-base">
            Welcome! Here’s your attendance overview and stats.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.length > 0 ? (
            stats.map((stat) => (
              <StatsCard
                key={stat.label}
                icon={stat.icon}
                title={stat.label}
                value={stat.value}
                color={stat.color}
              />
            ))
          ) : (
            <div className="col-span-4 text-center text-gray-500 dark:text-gray-400">
              No data available
            </div>
          )}
        </div>

        {/* Subject-wise Attendance Progress */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subject-wise Attendance</h2>
          <div className="space-y-4">
            {subjectAttendance.length > 0 ? (
              subjectAttendance.map((subj) => (
                <div key={subj.subject}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{subj.subject}</span>
                    <span className="font-semibold text-blue-700 dark:text-blue-300">{subj.percent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
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
              ))
            ) : (
              <div className="text-gray-500 dark:text-gray-400">No data available</div>
            )}
          </div>
        </div>

        {/* Recent Attendance Section */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Attendance</h2>
          <div className="overflow-x-auto">
            {recentAttendance.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-600 dark:text-gray-300 border-b">
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Subject</th>
                    <th className="py-3 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttendance.map((rec, idx) => (
                    <tr
                      key={idx}
                      className={`border-b transition hover:bg-blue-50 dark:hover:bg-gray-700 ${
                        idx === recentAttendance.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{rec.date}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{rec.subject}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            rec.status === "Present"
                              ? "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300"
                              : "bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300"
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 py-6 text-center">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Attendance Insights */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Attendance Insights</h2>
          {bestSubject && lowSubject ? (
            <div className="space-y-2">
              <div>
                <span className="font-medium">Best Subject:</span>{" "}
                <span className="text-green-600 dark:text-green-400">
                  {bestSubject.subject} ({bestSubject.percent}%)
                </span>
              </div>
              <div>
                <span className="font-medium">Needs Attention:</span>{" "}
                <span className="text-red-600 dark:text-red-400">
                  {lowSubject.subject} ({lowSubject.percent}%)
                </span>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">No data available</div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;