import React, { useState } from "react";
import { motion } from "framer-motion";
import MainLayout from "../../components/Layout/MainLayout";
import Card from "../../components/Card";
import { FiUsers, FiUserCheck, FiUserX, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import axios from "axios";

// Helper for summary
const getSummary = (students) => {
  const total = students.length;
  const present = students.filter((s) => s.status === "Present").length;
  const absent = students.filter((s) => s.status === "Absent").length;
  return { total, present, absent };
};

const FacultyDashboard = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    Promise.all([
      axios.get("/api/admin/students"),
      axios.get("/api/attendance/all")
    ]).then(([studentsRes, attendanceRes]) => {
      const allStudents = studentsRes.data;
      const allAttendance = attendanceRes.data;
      
      const today = new Date().toISOString().split("T")[0];
      const todayRecords = allAttendance.filter(r => r.date && r.date.startsWith(today));

      const mergedStudents = allStudents.map(student => {
         const rec = todayRecords.find(r => r.studentEmail === student.email);
         return {
           id: student._id,
           name: student.name,
           status: rec ? rec.status : "Not Marked"
         };
      });
      setStudents(mergedStudents);
    }).catch(err => console.error(err));
  }, []);

  const summary = getSummary(students);

  return (
    <MainLayout>
      <motion.div 
        className="max-w-6xl mx-auto px-4 py-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 shadow flex flex-col sm:flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back, Faculty 👨‍🏫</h2>
            <p className="text-white text-opacity-90">Here is your attendance overview</p>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Faculty Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 text-base">
            Welcome! View your class attendance overview and quick actions.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <div className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-xl overflow-hidden border border-white/20 relative">
              <FiUsers className="text-white opacity-20 text-6xl absolute top-2 right-4" />
              <FiUsers className="text-white text-4xl mb-3 z-10" />
              <span className="text-4xl font-extrabold text-white z-10">{summary.total}</span>
              <span className="text-white/80 text-sm mt-1 uppercase tracking-wider font-semibold z-10">Total Students</span>
            </div>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <div className="flex flex-col items-center p-6 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-xl overflow-hidden border border-white/20 relative">
              <FiUserCheck className="text-white opacity-20 text-6xl absolute top-2 right-4" />
              <FiUserCheck className="text-white text-4xl mb-3 z-10" />
              <span className="text-4xl font-extrabold text-white z-10">{summary.present}</span>
              <span className="text-white/80 text-sm mt-1 uppercase tracking-wider font-semibold z-10">Present</span>
            </div>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <div className="flex flex-col items-center p-6 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl shadow-xl overflow-hidden border border-white/20 relative">
              <FiUserX className="text-white opacity-20 text-6xl absolute top-2 right-4" />
              <FiUserX className="text-white text-4xl mb-3 z-10" />
              <span className="text-4xl font-extrabold text-white z-10">{summary.absent}</span>
              <span className="text-white/80 text-sm mt-1 uppercase tracking-wider font-semibold z-10">Absent</span>
            </div>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <div className="flex flex-col items-center p-6 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-2xl shadow-xl overflow-hidden border border-white/20 relative">
              <FiArrowRight className="text-white opacity-20 text-6xl absolute top-2 right-4" />
              <span className="text-xl font-bold text-white mb-2 z-10">Quick Action</span>
              <button
                className="bg-white/20 text-white px-5 py-2.5 rounded-lg mt-1 hover:bg-white/30 transition shadow font-bold flex items-center gap-2 z-10 backdrop-blur-sm"
                onClick={() => navigate("/faculty/attendance")}
              >
                Mark Attendance <FiArrowRight />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default FacultyDashboard;


