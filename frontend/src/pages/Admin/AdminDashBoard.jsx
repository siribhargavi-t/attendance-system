import React from "react";
import MainLayout from "../../components/Layout/MainLayout";
import Card from "../../components/Card";
import {
  FiUsers,
  FiUserCheck,
  FiBookOpen,
} from "react-icons/fi";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";

// 🔹 Stats
const stats = [
  {
    label: "Total Students",
    value: 120,
    icon: <FiUsers className="text-blue-500 text-3xl mb-2" />,
    color: "text-blue-500 dark:text-blue-400",
  },
  {
    label: "Total Faculty",
    value: 15,
    icon: <FiUserCheck className="text-green-500 text-3xl mb-2" />,
    color: "text-green-600 dark:text-green-400",
  },
  {
    label: "Total Classes",
    value: 8,
    icon: <FiBookOpen className="text-indigo-500 text-3xl mb-2" />,
    color: "text-indigo-600 dark:text-indigo-400",
  },
];

// 🔹 Chart Data
const lineData = [
  { day: "Mon", attendance: 80 },
  { day: "Tue", attendance: 90 },
  { day: "Wed", attendance: 85 },
  { day: "Thu", attendance: 88 },
  { day: "Fri", attendance: 92 },
];

const barData = [
  { class: "CSE", value: 90 },
  { class: "ECE", value: 75 },
  { class: "MECH", value: 65 },
];

const pieData = [
  { name: "Present", value: 85 },
  { name: "Absent", value: 15 },
];

const COLORS = ["#22c55e", "#ef4444"];

// 🔹 Activity
const recentActivity = [
  { date: "2024-06-10", activity: "Attendance marked for all classes" },
  { date: "2024-06-09", activity: "New student registered: Ethan Brown" },
  { date: "2024-06-09", activity: "Faculty added: Dr. Smith" },
  { date: "2024-06-08", activity: "Class rescheduled: Physics" },
];

// 🔹 Insights
const insights = {
  mostAbsentDay: "Monday",
  bestDay: "Friday (92%)",
  topClass: "CSE",
  lowClass: "MECH",
};

const AdminDashboard = () => (
  <MainLayout>
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">

      {/* 🔷 Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 shadow">
        <h2 className="text-2xl font-bold text-white">
          Welcome back, Admin 👋
        </h2>
        <p className="text-white/80">System overview & analytics</p>
      </div>

      {/* 🔷 Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Monitor attendance and performance insights
        </p>
      </div>

      {/* 🔷 Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow"
          >
            {stat.icon}
            <span className={`text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </span>
            <span className="text-gray-600 dark:text-gray-300 text-sm">
              {stat.label}
            </span>
          </Card>
        ))}
      </div>

      {/* 🔷 Charts */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Line */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2 text-gray-700 dark:text-white">
            Attendance Trend
          </h3>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="#6366f1"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2 text-gray-700 dark:text-white">
            Class Performance
          </h3>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <XAxis dataKey="class" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🔷 Pie */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2 text-gray-700 dark:text-white">
          Overall Attendance
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={pieData} dataKey="value" outerRadius={80} label>
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 🔷 Activity + Insights */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>

          {recentActivity.map((item, idx) => (
            <div key={idx} className="border-b py-2 text-sm">
              <span className="text-gray-500">{item.date}</span> —{" "}
              <span className="text-gray-900 dark:text-gray-100">
                {item.activity}
              </span>
            </div>
          ))}
        </div>

        {/* Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Insights
          </h2>

          <div className="space-y-3 text-sm">

            <div className="flex justify-between">
              <span className="text-gray-500">Most Absent Day</span>
              <span className="text-red-500 font-semibold">
                {insights.mostAbsentDay}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Best Day</span>
              <span className="text-green-500 font-semibold">
                {insights.bestDay}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Top Class</span>
              <span className="text-blue-500 font-semibold">
                {insights.topClass}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Needs Improvement</span>
              <span className="text-yellow-500 font-semibold">
                {insights.lowClass}
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  </MainLayout>
);

export default AdminDashboard;