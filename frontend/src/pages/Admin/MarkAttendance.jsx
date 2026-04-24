import React, { useState } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import { FiSearch, FiBookOpen, FiCalendar, FiDownload } from "react-icons/fi";
import API from "../../services/api";

const getStats = (records) => {
  const total = records.length;
  const present = records.filter((a) => a.status === "Present").length;
  const absent = records.filter((a) => a.status === "Absent").length;
  const presentPercent = total ? Math.round((present / total) * 100) : 0;
  const absentPercent = total ? Math.round((absent / total) * 100) : 0;
  return { total, presentPercent, absentPercent };
};

const AdminAttendance = () => {
  const [subject, setSubject] = useState("All Subjects");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [subjectsList, setSubjectsList] = useState(["All Subjects"]);

  React.useEffect(() => {
    API.get("/api/attendance/all").then(res => {
         const records = res.data.map(r => ({
           id: r._id,
           name: r.studentName,
           subject: r.subject,
           date: r.date.split("T")[0],
           status: r.status
         }));
         setAttendance(records);
         const uniqueSubjects = Array.from(new Set(records.map(r => r.subject)));
         setSubjectsList(["All Subjects", ...uniqueSubjects]);
      })
      .catch(err => console.error("Error fetching attendance list", err));
  }, []);

  const filtered = attendance.filter(
    (rec) =>
      (subject === "All Subjects" || rec.subject === subject) &&
      (!date || rec.date === date) &&
      (rec.name.toLowerCase().includes(search.toLowerCase()) ||
        rec.subject.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = getStats(attendance);

  // Export to CSV function
  const handleExportCSV = () => {
    const headers = ["Name", "Subject", "Date", "Status"];
    const rows = filtered.map((rec) => [
      `"${rec.name}"`,
      `"${rec.subject}"`,
      `"${rec.date}"`,
      `"${rec.status}"`,
    ]);
    const csvContent =
      headers.join(",") +
      "\n" +
      rows.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance_report.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-2 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2 text-gray-900 dark:text-white transition-colors duration-300">
            All Attendance Records
          </h1>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            onClick={handleExportCSV}
          >
            <FiDownload className="text-lg" />
            Download Report
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col items-center">
            <span className="text-gray-600 dark:text-gray-300 text-sm">Total Students</span>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</span>
          </div>
          <div className="bg-green-50 dark:bg-green-900 rounded-xl shadow p-4 flex flex-col items-center">
            <span className="text-green-700 dark:text-green-300 text-sm">Present %</span>
            <span className="text-xl font-bold text-green-700 dark:text-green-300">{stats.presentPercent}%</span>
          </div>
          <div className="bg-red-50 dark:bg-red-900 rounded-xl shadow p-4 flex flex-col items-center">
            <span className="text-red-700 dark:text-red-300 text-sm">Absent %</span>
            <span className="text-xl font-bold text-red-700 dark:text-red-300">{stats.absentPercent}%</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <FiSearch className="text-blue-500" />
            <input
              type="text"
              placeholder="Search by name or subject"
              className="rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 w-full sm:w-48 transition-colors duration-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <FiBookOpen className="text-blue-500" />
            <select
              className="rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 transition-colors duration-300"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              {subjectsList.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <FiCalendar className="text-blue-500" />
            <input
              type="date"
              className="rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 transition-colors duration-300"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-600 dark:text-gray-300 border-b">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Subject</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((rec) => (
                  <tr
                    key={rec.id}
                    className="border-b hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{rec.name}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{rec.subject}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{rec.date}</td>
                    <td className="py-3 px-4 text-center">
                      {rec.status === "Present" ? (
                        <span className="px-3 py-1 text-xs rounded-full font-medium bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300">
                          Present
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs rounded-full font-medium bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300">
                          Absent
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center text-gray-400 dark:text-gray-500 py-6">
                    No records found
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

export default AdminAttendance;