import React, { useState } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import Card from "../../components/Card";
import { FiUsers, FiUserCheck, FiUserX, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// Dummy student data
const DUMMY_STUDENTS = [
  { id: 1, name: "Alice Johnson", roll: "21CS001", status: "Present" },
  { id: 2, name: "Bob Smith", roll: "21CS002", status: "Absent" },
  { id: 3, name: "Charlie Lee", roll: "21CS003", status: "Present" },
  { id: 4, name: "Diana Patel", roll: "21CS004", status: "Present" },
  { id: 5, name: "Ethan Brown", roll: "21CS005", status: "Absent" },
];

// Helper for summary
const getSummary = (students) => {
  const total = students.length;
  const present = students.filter((s) => s.status === "Present").length;
  const absent = students.filter((s) => s.status === "Absent").length;
  return { total, present, absent };
};

const FacultyDashboard = () => {
  const [students] = useState(DUMMY_STUDENTS);
  const navigate = useNavigate();

  const summary = getSummary(students);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 shadow flex flex-col sm:flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back, Faculty 👨‍🏫</h2>
            <p className="text-white text-opacity-90">Here is your attendance overview</p>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Faculty Dashboard</h1>
          <p className="text-gray-500 text-base">
            Welcome! View your class attendance overview and quick actions.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
            <FiUsers className="text-blue-500 text-3xl mb-2" />
            <span className="text-3xl font-bold text-gray-800">{summary.total}</span>
            <span className="text-gray-500 text-sm mt-1">Total Students</span>
          </Card>
          <Card className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
            <FiUserCheck className="text-green-500 text-3xl mb-2" />
            <span className="text-3xl font-bold text-green-600">{summary.present}</span>
            <span className="text-gray-500 text-sm mt-1">Present</span>
          </Card>
          <Card className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
            <FiUserX className="text-red-500 text-3xl mb-2" />
            <span className="text-3xl font-bold text-red-500">{summary.absent}</span>
            <span className="text-gray-500 text-sm mt-1">Absent</span>
          </Card>
          <Card className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
            <FiArrowRight className="text-indigo-500 text-3xl mb-2" />
            <span className="text-xl font-semibold text-indigo-600 mb-1">Quick Action</span>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-2 hover:bg-blue-700 transition font-semibold flex items-center gap-2"
              onClick={() => navigate("/faculty/attendance")}
            >
              Go to Mark Attendance <FiArrowRight />
            </button>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default FacultyDashboard;


