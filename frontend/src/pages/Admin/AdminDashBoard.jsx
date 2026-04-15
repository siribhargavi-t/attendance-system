import React from "react";
import MainLayout from "../../components/Layout/MainLayout";
import Card from "../../components/Card";
import {
  FiUsers,
  FiUserCheck,
  FiBookOpen,
  FiDownload
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

// 🔹 Attendance Data (for insights)
const attendanceData = [
  // day, class, present, total
  { day: "Mon", class: "CSE", present: 45, total: 50 },
  { day: "Mon", class: "ECE", present: 35, total: 50 },
  { day: "Mon", class: "MECH", present: 30, total: 50 },
  { day: "Tue", class: "CSE", present: 48, total: 50 },
  { day: "Tue", class: "ECE", present: 40, total: 50 },
  { day: "Tue", class: "MECH", present: 38, total: 50 },
  { day: "Wed", class: "CSE", present: 46, total: 50 },
  { day: "Wed", class: "ECE", present: 39, total: 50 },
  { day: "Wed", class: "MECH", present: 35, total: 50 },
  { day: "Thu", class: "CSE", present: 47, total: 50 },
  { day: "Thu", class: "ECE", present: 41, total: 50 },
  { day: "Thu", class: "MECH", present: 36, total: 50 },
  { day: "Fri", class: "CSE", present: 49, total: 50 },
  { day: "Fri", class: "ECE", present: 44, total: 50 },
  { day: "Fri", class: "MECH", present: 40, total: 50 },
];

// 🔹 Chart Data (derived from attendanceData)
const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const classes = ["CSE", "ECE", "MECH"];

// Line chart: average attendance per day
const lineData = days.map((day) => {
  const dayRecords = attendanceData.filter((rec) => rec.day === day);
  const totalPresent = dayRecords.reduce((sum, rec) => sum + rec.present, 0);
  const totalStudents = dayRecords.reduce((sum, rec) => sum + rec.total, 0);
  return {
    day,
    attendance: totalStudents ? Math.round((totalPresent / totalStudents) * 100) : 0,
  };
});

// Bar chart: average attendance per class
const barData = classes.map((cls) => {
  const classRecords = attendanceData.filter((rec) => rec.class === cls);
  const totalPresent = classRecords.reduce((sum, rec) => sum + rec.present, 0);
  const totalStudents = classRecords.reduce((sum, rec) => sum + rec.total, 0);
  return {
    class: cls,
    value: totalStudents ? Math.round((totalPresent / totalStudents) * 100) : 0,
  };
});

// Pie chart: overall present/absent
const totalPresent = attendanceData.reduce((sum, rec) => sum + rec.present, 0);
const totalStudents = attendanceData.reduce((sum, rec) => sum + rec.total, 0);
const totalAbsent = totalStudents - totalPresent;
const pieData = [
  { name: "Present", value: totalPresent },
  { name: "Absent", value: totalAbsent },
];
const COLORS = ["#22c55e", "#ef4444"];

// 🔹 Activity
const recentActivity = [
  { date: "2024-06-10", activity: "Attendance marked for all classes" },
  { date: "2024-06-09", activity: "New student registered: Ethan Brown" },
  { date: "2024-06-09", activity: "Faculty added: Dr. Smith" },
  { date: "2024-06-08", activity: "Class rescheduled: Physics" },
];

// 🔹 Dynamic Insights
function getInsights() {
  // Most absent day (lowest % present)
  let absentDay = "";
  let minPercent = 101;
  let bestDay = "";
  let maxPercent = -1;
  let topClass = "";
  let topClassPercent = -1;

  // Calculate day-wise attendance %
  days.forEach((day) => {
    const dayRecords = attendanceData.filter((rec) => rec.day === day);
    const present = dayRecords.reduce((sum, rec) => sum + rec.present, 0);
    const total = dayRecords.reduce((sum, rec) => sum + rec.total, 0);
    const percent = total ? (present / total) * 100 : 0;
    if (percent < minPercent) {
      minPercent = percent;
      absentDay = day;
    }
    if (percent > maxPercent) {
      maxPercent = percent;
      bestDay = day;
    }
  });

  // Calculate class-wise attendance %
  classes.forEach((cls) => {
    const classRecords = attendanceData.filter((rec) => rec.class === cls);
    const present = classRecords.reduce((sum, rec) => sum + rec.present, 0);
    const total = classRecords.reduce((sum, rec) => sum + rec.total, 0);
    const percent = total ? (present / total) * 100 : 0;
    if (percent > topClassPercent) {
      topClassPercent = percent;
      topClass = cls;
    }
  });

  return {
    mostAbsentDay: `${absentDay} (${Math.round(minPercent)}%)`,
    bestDay: `${bestDay} (${Math.round(maxPercent)}%)`,
    topClass: `${topClass} (${Math.round(topClassPercent)}%)`,
    lowClass: classes.find(cls => cls !== topClass), // for demo
  };
}

const insights = getInsights();

// Advanced Analytics Calculation
const avgAttendancePercent =
  attendanceData.reduce((sum, rec) => sum + (rec.present / rec.total) * 100, 0) /
  attendanceData.length;

const subjectStats = attendanceData.reduce((acc, rec) => {
  if (!acc[rec.class]) acc[rec.class] = { present: 0, total: 0 };
  acc[rec.class].present += rec.present;
  acc[rec.class].total += rec.total;
  return acc;
}, {});

const subjectPercentages = Object.entries(subjectStats).map(([subject, { present, total }]) => ({
  subject,
  percent: total ? (present / total) * 100 : 0,
}));

const subjectPerformance = subjectPercentages.map((subj) => ({
  subject: subj.subject,
  percent: Math.round(subj.percent),
}));

const highestAttendanceSubject = subjectPercentages.reduce(
  (max, curr) => (curr.percent > max.percent ? curr : max),
  { subject: "", percent: -1 }
);

const lowestAttendanceSubject = subjectPercentages.reduce(
  (min, curr) => (curr.percent
  < min.percent ? curr : min),
  { subject: "", percent: 100 }
);

// CSV export helper
function convertToCSV(data) {
  if (!data || !data.length) return "";
  const keys = Object.keys(data[0]);
  const csvRows = [
    keys.join(","),
    ...data.map(row =>
      keys.map(k => `"${String(row[k]).replace(/"/g, '""')}"`).join(",")
    ),
  ];
  return csvRows.join("\n");
}

function handleExportCSV() {
  const csv = convertToCSV(attendanceData);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "attendance_report.csv";
  a.click();
  window.URL.revokeObjectURL(url);
}

const AdminDashboard = () => (
  <MainLayout>
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">

      {/* Export Report Button */}
      <div className="flex justify-end">
        <button
          className="flex items-center gap-2 px-5 py-2 mb-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          onClick={handleExportCSV}
        >
          <FiDownload className="text-lg" />
          Export Report
        </button>
      </div>

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
              <Tooltip
                contentStyle={{ background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb" }}
                cursor={{ stroke: "#6366f1", strokeWidth: 2, opacity: 0.2 }}
              />
              <Line
                type="monotone"
                dataKey="attendance"
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

        {/* Bar */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2 text-gray-700 dark:text-white">
            Class Performance
          </h3>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <XAxis dataKey="class" />
              <YAxis />
              <Tooltip
                contentStyle={{ background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb" }}
                cursor={{ fill: "#6366f1", opacity: 0.1 }}
              />
              <Bar
                dataKey="value"
                fill="#3b82f6"
                isAnimationActive={true}
                animationDuration={800}
                radius={[8, 8, 0, 0]}
               
              />
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
            <Pie
              data={pieData}
              dataKey="value"
              outerRadius={80}
              label
              isAnimationActive={true}
              animationDuration={800}
              onMouseOver={(_, i, e) => {
                if (e && e[i]) e[i].style.opacity = 0.7;
              }}
              onMouseOut={(_, i, e) => {
                if (e && e[i]) e[i].style.opacity = 1;
              }}
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb" }}
            />
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

            <div className="flex justify-between">
              <span className="text-gray-500">Average Attendance</span>
              <span className="text-purple-500 font-semibold">
                {avgAttendancePercent}%
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Highest Attendance Subject</span>
              <span className="text-blue-500 font-semibold">
                {highestAttendanceSubject.subject}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Lowest Attendance Subject</span>
              <span className="text-red-500 font-semibold">
                {lowestAttendanceSubject.subject}
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* 🔷 Subject-wise Performance */}
      <div>
        <h3 className="font-semibold mb-2 text-gray-700 dark:text-white mt-8">
          Subject-wise Performance
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {subjectPerformance.map((subj) => (
            <div
              key={subj.subject}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col items-center"
            >
              <span className="font-semibold text-gray-700 dark:text-gray-100 mb-1">{subj.subject}</span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-300 mb-1">
                {subj.percent}%
              </span>
            </div>
          ))}
        </div>
        {/* Or as a bar chart: */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={subjectPerformance}>
              <XAxis dataKey="subject" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb" }}
                cursor={{ fill: "#6366f1", opacity: 0.1 }}
              />
              <Bar
                dataKey="percent"
                fill="#3b82f6"
                isAnimationActive={true}
                animationDuration={800}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  </MainLayout>
);

export default AdminDashboard;