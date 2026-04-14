import React, { useState } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import { FiCalendar, FiBookOpen } from "react-icons/fi";

// Dummy data
const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "English"];
const DUMMY_STUDENTS = [
  { id: 1, name: "Alice Johnson", roll: "21CS001" },
  { id: 2, name: "Bob Smith", roll: "21CS002" },
  { id: 3, name: "Charlie Lee", roll: "21CS003" },
  { id: 4, name: "Diana Patel", roll: "21CS004" },
  { id: 5, name: "Ethan Brown", roll: "21CS005" },
];

const ROWS_PER_PAGE = 5;

const FacultyAttendance = () => {
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [attendance, setAttendance] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtering logic
  const filteredData = DUMMY_STUDENTS.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.roll.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject =
      selectedSubject === "All" || subject === selectedSubject || student.subject === selectedSubject;
    const matchesDate = !selectedDate || date === selectedDate;
    return matchesSearch && matchesSubject && matchesDate;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ROWS_PER_PAGE);

  // Reset to first page if filter changes and current page is out of range
  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredData, totalPages, currentPage]);

  const handleMark = (id, status) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: status,
    }));
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-2 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2 text-gray-900 dark:text-white transition-colors duration-300">
            Mark Attendance
          </h1>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
            Select subject and mark attendance
          </p>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-center bg-white dark:bg-gray-800 rounded-xl shadow p-4 transition-colors duration-300">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <FiBookOpen className="text-blue-500" />
            <select
              className="rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 transition-colors duration-300"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="All">All Subjects</option>
              {SUBJECTS.map((subj) => (
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
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name or roll"
              className="rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 transition-colors duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 transition-colors duration-300">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-600 dark:text-gray-300 border-b">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Roll No</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{student.name}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{student.roll}</td>
                    <td className="py-3 px-4 text-center">
                      {attendance[student.id] === "Present" && (
                        <span className="px-3 py-1 text-xs rounded-full font-medium bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300">
                          Present
                        </span>
                      )}
                      {attendance[student.id] === "Absent" && (
                        <span className="px-3 py-1 text-xs rounded-full font-medium bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300">
                          Absent
                        </span>
                      )}
                      {!attendance[student.id] && (
                        <span className="px-3 py-1 text-xs rounded-full font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
                          Not Marked
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center flex gap-2 justify-center">
                      <button
                        className="px-3 py-1 text-xs rounded-lg font-semibold bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-700 transition"
                        onClick={() => handleMark(student.id, "Present")}
                      >
                        Present
                      </button>
                      <button
                        className="px-3 py-1 text-xs rounded-lg font-semibold bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-700 transition"
                        onClick={() => handleMark(student.id, "Absent")}
                      >
                        Absent
                      </button>
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
      </div>
    </MainLayout>
  );
};

export default FacultyAttendance;