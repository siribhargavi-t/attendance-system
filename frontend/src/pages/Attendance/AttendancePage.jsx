import React, { useState, useMemo } from "react";
import { FiDownload, FiBookOpen, FiCalendar } from "react-icons/fi";
import MainLayout from "../../components/Layout/MainLayout";
import Card from "../../components/Card";
import Loader from "../../components/Loader";

// Dummy static data
const DUMMY_ATTENDANCE = [
  { id: 1, date: "2024-06-01", subject: "Mathematics", status: "Present" },
  { id: 2, date: "2024-06-02", subject: "Physics", status: "Absent" },
  { id: 3, date: "2024-06-03", subject: "Chemistry", status: "Present" },
  { id: 4, date: "2024-06-04", subject: "English", status: "Present" },
  { id: 5, date: "2024-06-05", subject: "Mathematics", status: "Absent" },
];

const DUMMY_SUBJECTS = [
  "All Subjects",
  "Mathematics",
  "Physics",
  "Chemistry",
  "English",
];

const AttendancePage = () => {
  const [attendance, setAttendance] = useState(DUMMY_ATTENDANCE);
  const [subjects] = useState(DUMMY_SUBJECTS);
  const [filter, setFilter] = useState({ subject: "All Subjects", date: "" });
  const [loading] = useState(false);
  const [error] = useState("");
  const [search, setSearch] = useState(""); // <-- Add this line

  // Filtered attendance (safe with useMemo)
  const filteredAttendance = useMemo(() => {
    return attendance.filter((rec) => {
      const subjectMatch =
        filter.subject === "All Subjects" || rec.subject === filter.subject;
      const dateMatch = !filter.date || rec.date === filter.date;
      return subjectMatch && dateMatch;
    });
  }, [attendance, filter]);

  // Export handler (dummy)
  const handleExport = () => {
    alert("Export to CSV coming soon!");
  };

  // Stats
  const total = attendance.length;
  const present = attendance.filter((a) => a.status === "Present").length;
  const absent = attendance.filter((a) => a.status === "Absent").length;
  const percentage = total === 0 ? 0 : Math.round((present / total) * 100);

  return (
    <MainLayout>
      <div className="space-y-8 max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">Attendance</h1>
            <p className="text-sm text-gray-500">
              Track and manage your attendance records
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition font-medium"
          >
            <FiDownload /> Export
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="flex flex-col items-center py-6">
            <span className="text-gray-500 text-sm mb-1">Total</span>
            <span className="text-3xl font-bold">{total}</span>
          </Card>
          <Card className="flex flex-col items-center py-6">
            <span className="text-gray-500 text-sm mb-1">Present</span>
            <span className="text-3xl font-bold text-green-600">{present}</span>
          </Card>
          <Card className="flex flex-col items-center py-6">
            <span className="text-gray-500 text-sm mb-1">Absent</span>
            <span className="text-3xl font-bold text-red-500">{absent}</span>
          </Card>
          <Card className="flex flex-col items-center py-6">
            <span className="text-gray-500 text-sm mb-1">Attendance %</span>
            <span className="text-3xl font-bold text-blue-600">{percentage}%</span>
          </Card>
        </div>

        {/* FILTER BAR */}
        <Card className="flex flex-col md:flex-row gap-4 md:items-center p-6">
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl">
            <FiBookOpen className="text-blue-500" />
            <select
              className="bg-transparent outline-none text-sm"
              value={filter.subject}
              onChange={(e) =>
                setFilter((f) => ({ ...f, subject: e.target.value }))
              }
            >
              {subjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl">
            <FiCalendar className="text-green-500" />
            <input
              type="date"
              className="bg-transparent outline-none text-sm"
              value={filter.date}
              onChange={(e) =>
                setFilter((f) => ({ ...f, date: e.target.value }))
              }
            />
          </div>
        </Card>

        {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="Search..."
          className="mb-4 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-200 dark:bg-gray-800 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* TABLE */}
        <Card className="p-0 overflow-x-auto">
          {loading ? (
            <Loader />
          ) : error ? (
            <div className="text-red-500 p-4">{error}</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Subject</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((rec) => (
                    <tr
                      key={rec.id}
                      className="border-b hover:bg-blue-50 transition"
                    >
                      <td className="py-3 px-4 font-medium">{rec.date}</td>
                      <td className="py-3 px-4">{rec.subject}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            rec.status === "Present"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            setAttendance((prev) =>
                              prev.map((item) =>
                                item.id === rec.id
                                  ? {
                                      ...item,
                                      status:
                                        item.status === "Present"
                                          ? "Absent"
                                          : "Present",
                                    }
                                  : item
                              )
                            );
                          }}
                          className="px-3 py-1 text-xs rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                        >
                          Toggle
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-400">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};

export default AttendancePage;