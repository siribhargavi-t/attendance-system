import React, { useState } from "react";
import MainLayout from "../../components/Layout/MainLayout";

// Dummy data for attendance records
const allRecords = [
  { date: "2024-06-10", subject: "Mathematics", name: "Alice Johnson", status: "Present" },
  { date: "2024-06-10", subject: "Physics", name: "Bob Smith", status: "Absent" },
  { date: "2024-06-09", subject: "Chemistry", name: "Charlie Lee", status: "Present" },
  { date: "2024-06-09", subject: "English", name: "Diana Patel", status: "Present" },
  { date: "2024-06-08", subject: "Mathematics", name: "Ethan Brown", status: "Absent" },
  { date: "2024-06-08", subject: "Physics", name: "Alice Johnson", status: "Present" },
  { date: "2024-06-07", subject: "Chemistry", name: "Bob Smith", status: "Present" },
  { date: "2024-06-07", subject: "English", name: "Charlie Lee", status: "Absent" },
  // ...add more records as needed
];

const subjects = ["All", ...Array.from(new Set(allRecords.map(r => r.subject)))];

const StudentAttendance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");

  // Filtering logic
  const filteredData = allRecords.filter((rec) => {
    const matchesSearch =
      rec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "All" || rec.subject === selectedSubject;
    const matchesDate = !selectedDate || rec.date === selectedDate;
    return matchesSearch && matchesSubject && matchesDate;
  });

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Attendance Records</h1>
          <p className="text-gray-600 dark:text-gray-300 text-base">
            View all your attendance details. Use filters or search to find specific records.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Search by student name or subject"
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full md:w-1/3 transition-colors duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full md:w-1/4 transition-colors duration-300"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            {subjects.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full md:w-1/4 transition-colors duration-300"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Attendance Table */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-600 dark:text-gray-300 border-b">
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Subject</th>
                <th className="py-3 px-4 text-left">Student Name</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((rec, idx) => (
                  <tr
                    key={idx}
                    className={`border-b transition hover:bg-blue-50 dark:hover:bg-gray-700 ${
                      idx === filteredData.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{rec.date}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{rec.subject}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{rec.name}</td>
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
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center text-gray-400 dark:text-gray-500 py-6">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentAttendance;