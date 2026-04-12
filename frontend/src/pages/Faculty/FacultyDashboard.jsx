import React, { useState } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import Card from "../../components/Card";
import { FiUsers, FiUserCheck, FiUserX } from "react-icons/fi";

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
  const [students, setStudents] = useState(DUMMY_STUDENTS);

  const summary = getSummary(students);

  // Toggle attendance status
  const toggleStatus = (id) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: s.status === "Present" ? "Absent" : "Present",
            }
          : s
      )
    );
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-2 py-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="flex flex-col items-center py-6">
            <span className="text-gray-500 text-sm mb-1">Total Students</span>
            <span className="text-3xl font-bold flex items-center gap-2">
              <FiUsers className="text-blue-500" /> {summary.total}
            </span>
          </Card>
          <Card className="flex flex-col items-center py-6">
            <span className="text-gray-500 text-sm mb-1">Present</span>
            <span className="text-3xl font-bold text-green-600 flex items-center gap-2">
              <FiUserCheck /> {summary.present}
            </span>
          </Card>
          <Card className="flex flex-col items-center py-6">
            <span className="text-gray-500 text-sm mb-1">Absent</span>
            <span className="text-3xl font-bold text-red-500 flex items-center gap-2">
              <FiUserX /> {summary.absent}
            </span>
          </Card>
        </div>

        {/* Student List Table */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Student Attendance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Roll No</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {(students || []).length > 0 ? (
                  students.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b hover:bg-blue-50 transition"
                    >
                      <td className="py-3 px-4 font-medium">{student.name}</td>
                      <td className="py-3 px-4">{student.roll}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            student.status === "Present"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleStatus(student.id)}
                          className={`px-3 py-1 text-xs rounded-lg font-semibold flex items-center gap-1 transition
                            ${
                              student.status === "Present"
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                        >
                          {student.status === "Present" ? "Mark Absent" : "Mark Present"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-400">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default FacultyDashboard;


