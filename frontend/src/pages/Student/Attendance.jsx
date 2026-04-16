import React, { useState } from "react";
import MainLayout from "../../components/Layout/MainLayout";

import axios from "axios";

// Helper: get status by date
const ROWS_PER_PAGE = 5;

function getStatusByDate(date, userRecords) {
  // If any record for this date is Absent, show Absent, else Present
  const recs = userRecords.filter(r => r.date === date);
  if (recs.some(r => r.status === "Absent")) return "Absent";
  if (recs.length > 0) return "Present";
  return null;
}

const StudentAttendance = () => {
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const studentEmail = user.email || "";

  const [userRecords, setUserRecords] = useState([]);
  const [subjects, setSubjects] = useState(["All"]);
  const [allDates, setAllDates] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState("table"); // "table" or "calendar"
  const [calendarSelected, setCalendarSelected] = useState(""); // for calendar highlight

  React.useEffect(() => {
    if (!studentEmail) return;
    axios.get(`/api/attendance?studentEmail=${encodeURIComponent(studentEmail)}`)
      .then(res => {
        const records = res.data.map(r => ({
          id: r._id,
          date: r.date.split("T")[0],
          subject: r.subject,
          name: r.studentName,
          status: r.status
        }));
        setUserRecords(records);
        setSubjects(["All", ...Array.from(new Set(records.map(r => r.subject)))]);
        setAllDates(Array.from(new Set(records.map(r => r.date))).sort());
      })
      .catch(err => console.error("Failed to fetch attendance records", err));
  }, [studentEmail]);

  // Filtering logic
  const filteredData = userRecords.filter((rec) => {
    const matchesSearch =
      rec.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "All" || rec.subject === selectedSubject;
    const matchesDate = !selectedDate || rec.date === selectedDate;
    return matchesSearch && matchesSubject && matchesDate;
  });

  // Attendance summary calculations
  const total = filteredData.length;
  const present = filteredData.filter(s => s.status === "Present").length;
  const absent = total - present;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  // --- Subject-wise attendance calculation ---
  const subjectStats = {};
  userRecords.forEach((rec) => {
    if (!subjectStats[rec.subject]) {
      subjectStats[rec.subject] = { total: 0, present: 0 };
    }
    subjectStats[rec.subject].total += 1;
    if (rec.status === "Present") subjectStats[rec.subject].present += 1;
  });
  const subjectWise = Object.entries(subjectStats).map(([subject, stat]) => ({
    subject,
    percent: stat.total > 0 ? Math.round((stat.present / stat.total) * 100) : 0,
    present: stat.present,
    total: stat.total,
  }));

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ROWS_PER_PAGE);

  // Reset to first page if filter changes and current page is out of range
  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredData, totalPages, currentPage]);

  // Calendar grid: show all dates in data
  const calendarDates = allDates;

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {/* Warning Alert */}
        {view === "table" && percentage < 75 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 font-semibold mb-4">
            <span className="text-xl">⚠</span>
            <span>Attendance below required level</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Attendance Records</h1>
            <p className="text-gray-600 dark:text-gray-300 text-base">
              View all your attendance details. Use filters or search to find specific records.
            </p>
          </div>
          {/* Toggle View */}
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-lg font-semibold transition ${view === "table"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                }`}
              onClick={() => setView("table")}
            >
              Table View
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-semibold transition ${view === "calendar"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                }`}
              onClick={() => setView("calendar")}
            >
              Calendar View
            </button>
          </div>
        </div>

        {/* Subject-wise Attendance Cards */}
        {view === "table" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {subjectWise.map((subj) => (
              <div
                key={subj.subject}
                className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col items-center"
              >
                <span className="font-semibold text-gray-700 dark:text-gray-100 mb-1">{subj.subject}</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-300 mb-1">
                  {subj.percent}%
                </span>
                <span className="text-xs text-gray-500">
                  {subj.present} / {subj.total} Present
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Attendance Summary Cards */}
        {view === "table" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
            <div className="bg-blue-50 dark:bg-blue-900 rounded-xl shadow p-5 flex flex-col items-center">
              <span className="text-blue-600 dark:text-blue-300 font-bold text-lg mb-1">Total Classes</span>
              <span className="text-2xl font-bold text-blue-700 dark:text-blue-200">{total}</span>
            </div>
            <div className="bg-green-50 dark:bg-green-900 rounded-xl shadow p-5 flex flex-col items-center">
              <span className="text-green-600 dark:text-green-300 font-bold text-lg mb-1">Present</span>
              <span className="text-2xl font-bold text-green-700 dark:text-green-200">{present}</span>
            </div>
            <div className="bg-red-50 dark:bg-red-900 rounded-xl shadow p-5 flex flex-col items-center">
              <span className="text-red-600 dark:text-red-300 font-bold text-lg mb-1">Absent</span>
              <span className="text-2xl font-bold text-red-700 dark:text-red-200">{absent}</span>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900 rounded-xl shadow p-5 flex flex-col items-center">
              <span className="text-indigo-600 dark:text-indigo-300 font-bold text-lg mb-1">Attendance %</span>
              <span className="text-2xl font-bold text-indigo-700 dark:text-indigo-200">{percentage}%</span>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        {view === "table" && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder="Search by subject"
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full md:w-1/3 transition-colors duration-300"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <select
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full md:w-1/4 transition-colors duration-300"
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setCurrentPage(1);
              }}
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
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        )}

        {/* Table View */}
        {view === "table" && (
          <>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-600 dark:text-gray-300 border-b">
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Subject</th>
                    <th className="py-3 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((rec, idx) => (
                      <tr
                        key={startIndex + idx}
                        className={`border-b transition hover:bg-blue-50 dark:hover:bg-gray-700 ${idx === paginatedData.length - 1 ? "border-b-0" : ""
                          }`}
                      >
                        <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{rec.date}</td>
                        <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{rec.subject}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 text-xs rounded-full font-medium ${rec.status === "Present"
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
                      <td colSpan={3} className="text-center text-gray-400 dark:text-gray-500 py-6">
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Calendar View */}
        {view === "calendar" && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex flex-col items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance Calendar</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 w-full max-w-2xl">
              {calendarDates.map((date) => {
                const status = getStatusByDate(date, userRecords);
                const isSelected = calendarSelected === date;
                return (
                  <button
                    key={date}
                    onClick={() => setCalendarSelected(date)}
                    className={`
                      flex flex-col items-center justify-center p-3 rounded-xl border
                      transition
                      ${isSelected ? "ring-2 ring-blue-500 border-blue-400" : "border-gray-200 dark:border-gray-700"}
                      ${status === "Present" ? "bg-green-100 dark:bg-green-900" : ""}
                      ${status === "Absent" ? "bg-red-100 dark:bg-red-900" : ""}
                      hover:scale-105
                    `}
                  >
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{date}</span>
                    {status && (
                      <span
                        className={`mt-1 px-2 py-0.5 rounded-full text-xs font-medium
                          ${status === "Present"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"}
                        `}
                      >
                        {status}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {/* Show records for selected date */}
            {calendarSelected && (
              <div className="mt-8 w-full max-w-2xl">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Records for {calendarSelected}
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 shadow">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-600 dark:text-gray-300 border-b">
                        <th className="py-2 px-3 text-left">Subject</th>
                        <th className="py-2 px-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userRecords.filter(r => r.date === calendarSelected).map((rec, idx) => (
                        <tr key={idx} className="border-b last:border-b-0">
                          <td className="py-2 px-3 text-gray-900 dark:text-gray-100">{rec.subject}</td>
                          <td className="py-2 px-3">
                            <span
                              className={`px-3 py-1 text-xs rounded-full font-medium ${rec.status === "Present"
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
                  {userRecords.filter(r => r.date === calendarSelected).length === 0 && (
                    <div className="text-gray-500 dark:text-gray-400 py-4 text-center">
                      No records for this date.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default StudentAttendance;