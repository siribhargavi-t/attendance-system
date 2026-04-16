import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import MainLayout from "../../components/Layout/MainLayout";
import Card from "../../components/Card";
import Loader from "../../components/Loader";
import {
  FiUsers,
  FiUserCheck,
  FiBookOpen
} from "react-icons/fi";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";

// Unused static data and manual exports removed for real backend API integration

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalClasses: 0,
    averageAttendance: 0,
  });
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats
    const fetchDashboardStats = async () => {
      try {
        const res = await axios.get("/api/admin/dashboard");
        setDashboardStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };

    // Fetch attendance data
    const fetchAttendanceData = async () => {
      try {
        const res = await axios.get("/api/attendance/all"); // Adjust endpoint as needed
        setAttendanceData(res.data);
      } catch (err) {
        console.error("Failed to fetch attendance data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
    fetchAttendanceData();
  }, []);

  // Dynamic stats
  const stats = [
    {
      label: "Total Students",
      value: dashboardStats.totalStudents,
      icon: <FiUsers className="text-white text-4xl mb-2" />,
      bg: "bg-gradient-to-br from-blue-400 to-blue-600",
    },
    {
      label: "Total Faculty",
      value: dashboardStats.totalFaculty,
      icon: <FiUserCheck className="text-white text-4xl mb-2" />,
      bg: "bg-gradient-to-br from-green-400 to-green-600",
    },
    {
      label: "Total Classes",
      value: dashboardStats.totalClasses,
      icon: <FiBookOpen className="text-white text-4xl mb-2" />,
      bg: "bg-gradient-to-br from-indigo-400 to-purple-600",
    },
  ];

  // Prepare chart data from fetched attendanceData
  // Assume attendanceData: [{ day, class, present, total, status, subject, ... }]
  // You may need to adjust mapping based on your backend response

  // Helper function to extract short day name from date (e.g., 'Mon', 'Tue')
  const getDayStr = (dateString) => {
    if (!dateString) return "Unknown";
    const d = new Date(dateString);
    if (isNaN(d.valueOf())) return "Unknown";
    return d.toLocaleDateString("en-US", { weekday: "short" });
  };

  // Days and classes extraction
  const days = Array.from(new Set(attendanceData.map(rec => getDayStr(rec.date)))).sort();
  const classes = Array.from(new Set(attendanceData.map(rec => rec.subject))).filter(Boolean).sort();

  // Line chart: average attendance per day
  const lineData = days.map((day) => {
    const dayRecords = attendanceData.filter((rec) => getDayStr(rec.date) === day);
    const totalPresent = dayRecords.reduce((sum, rec) => sum + (rec.status === "Present" ? 1 : 0), 0);
    const totalStudents = dayRecords.length;
    return {
      day,
      attendance: totalStudents ? Math.round((totalPresent / totalStudents) * 100) : 0,
    };
  });

  // Bar chart: average attendance per class
  const barData = classes.map((cls) => {
    const classRecords = attendanceData.filter((rec) => rec.subject === cls);
    const totalPresent = classRecords.reduce((sum, rec) => sum + (rec.status === "Present" ? 1 : 0), 0);
    const totalStudents = classRecords.length;
    return {
      class: cls,
      value: totalStudents ? Math.round((totalPresent / totalStudents) * 100) : 0,
    };
  });

  // Pie chart: overall present/absent
  const totalPresent = attendanceData.reduce((sum, rec) => sum + (rec.status === "Present" ? 1 : 0), 0);
  const totalStudents = attendanceData.length;
  const totalAbsent = totalStudents - totalPresent;
  const pieData = [
    { name: "Present", value: totalPresent },
    { name: "Absent", value: totalAbsent },
  ];
  const COLORS = ["#22c55e", "#ef4444"];

  if (loading) return <Loader />;

  return (
    <MainLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={stat.label} 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <div className={`rounded-2xl shadow-xl overflow-hidden ${stat.bg} p-6 flex flex-col items-center justify-center text-white border border-white/20 relative`}>
                <div className="absolute top-2 right-4 opacity-20 text-6xl">{stat.icon}</div>
                {stat.icon}
                <div className="text-4xl font-extrabold tracking-tight mt-2">{stat.value}</div>
                <div className="text-white/80 font-medium uppercase tracking-widest mt-1 text-sm">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Existing Charts Wrapped with gentle animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="font-semibold mb-2">Average Attendance per Day</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData}>
              <XAxis dataKey="day" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div className="font-semibold mb-2">Average Attendance per Class</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <XAxis dataKey="class" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <div className="font-semibold mb-2">Overall Attendance</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label
              >
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        {/* ...other cards/insights... */}
      </div>
      </motion.div>
    </MainLayout>
  );
};

export default AdminDashboard;