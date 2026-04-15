import React, { useState } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import StatsCard from "../../components/StatsCard";
import { FiBookOpen, FiUserCheck, FiUserX, FiPercent } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

// Dummy attendance trend for last 7 days
const DUMMY_ATTENDANCE_TREND = [
  { date: "2024-06-04", percent: 100 },
  { date: "2024-06-05", percent: 100 },
  { date: "2024-06-06", percent: 80 },
  { date: "2024-06-07", percent: 90 },
  { date: "2024-06-08", percent: 80 },
  { date: "2024-06-09", percent: 100 },
  { date: "2024-06-10", percent: 90 },
];

const StudentDashboard = () => {
  // Use state to allow future backend integration
  const [stats] = useState(DUMMY_STATS);
  const [subjectAttendance] = useState(DUMMY_SUBJECT_ATTENDANCE);
  const [recentAttendance] = useState(DUMMY_RECENT_ATTENDANCE);
  const [attendanceTrend] = useState(DUMMY_ATTENDANCE_TREND);

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

  // Calculate overall attendance percent (from stats or trend)
  let overallPercent = 0;
  let totalClasses = 0;
  let presentClasses = 0;
  if (stats && stats.length > 0) {
    const percentStat = stats.find((s) => s.label === "Attendance %");
    if (percentStat && typeof percentStat.value === "string") {
      overallPercent = parseInt(percentStat.value.replace("%", ""), 10);
    }
    const totalStat = stats.find((s) => s.label === "Total Classes");
    if (totalStat && typeof totalStat.value === "number") {
      totalClasses = totalStat.value;
    }
    const presentStat = stats.find((s) => s.label === "Present");
    if (presentStat && typeof presentStat.value === "number") {
      presentClasses = presentStat.value;
    }
  }

  // Prediction logic: classes needed to reach 75%
  let needed = 0;
  if (totalClasses > 0 && presentClasses / totalClasses < 0.75) {
    // (presentClasses + n) / (totalClasses + n) >= 0.75
    // presentClasses + n >= 0.75 * (totalClasses + n)
    // presentClasses + n >= 0.75*totalClasses + 0.75*n
    // presentClasses + 0.25n >= 0.75*totalClasses
    // 0.25n >= 0.75*totalClasses - presentClasses
    // n >= (0.75*totalClasses - presentClasses) / 0.25
    needed = Math.ceil((0.75 * totalClasses - presentClasses) / 0.25);
    if (needed < 0) needed = 0;
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {/* Warning Alert */}
        {overallPercent < 75 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 font-semibold mb-4">
            <span className="text-xl">⚠</span>
            <span>Attendance below required level</span>
          </div>
        )}

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

        {/* Prediction Message */}
        {needed > 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-xl flex items-center gap-2 font-semibold mt-2 mb-2">
            <span className="text-xl">📈</span>
            <span>
              You need {needed} more present classes to reach 75%
            </span>
          </div>
        )}

        {/* Attendance Trend Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Attendance Trend (Last 7 Days)
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={attendanceTrend}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#64748b" }}
                stroke="#cbd5e1"
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 12, fill: "#64748b" }}
                stroke="#cbd5e1"
              />
              <Tooltip
                formatter={(value) => `${value}%`}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  background: "#fff",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  color: "#0f172a",
                  fontWeight: 500,
                }}
              />
              <Line
                type="monotone"
                dataKey="percent"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 6, stroke: "#6366f1", strokeWidth: 2, fill: "#fff" }}
                activeDot={{ r: 8, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
                isAnimationActive={true}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
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