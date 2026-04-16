import React, { useState, useEffect } from "react";
import MainLayout from "../../components/Layout/MainLayout";
// No icons imported
import axios from "axios";

const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "English"];
const ROWS_PER_PAGE = 5;

const FacultyAttendance = () => {
  const [subject] = useState(SUBJECTS[0]);
  const [date] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [attendance, setAttendance] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [students, setStudents] = useState([]);

  // ✅ Fetch students safely
  useEffect(() => {
    axios
      .get("/api/admin/students")
      .then((res) => {
        setStudents(
          (res.data || []).map((s) => ({
            id: s._id,
            name: s.name || "",
            email: s.email || "",
            roll: s.rollNumber || "N/A",
            subject: s.subject || ""
          }))
        );
      })
      .catch((err) => console.error("Error fetching students", err));
  }, []);

  // ✅ SAFE FILTERING (FIXED ERROR)
  const filteredData = students.filter((student) => {
    const name = (student.name || "").toLowerCase();
    const roll = (student.roll || "").toLowerCase();
    const search = (searchTerm || "").toLowerCase();

    const matchesSearch =
      name.includes(search) || roll.includes(search);

    const matchesSubject =
      selectedSubject === "All" ||
      subject === selectedSubject ||
      (student.subject || "") === selectedSubject;

    const matchesDate = !selectedDate || date === selectedDate;

    return matchesSearch && matchesSubject && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + ROWS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredData, totalPages, currentPage]);

  // Mark all
  const handleMarkAll = (status) => {
    const newAttendance = {};
    filteredData.forEach((student) => {
      newAttendance[student.id] = status;
    });
    setAttendance((prev) => ({ ...prev, ...newAttendance }));
  };

  // Toggle
  const handleCheckbox = (id) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: prev[id] === "Present" ? "Absent" : "Present",
    }));
  };

  // Save attendance
  const handleSave = async () => {
    try {
      if (!subject || subject === "All") {
        return alert("Please select a subject");
      }

      const records = filteredData.map((student) => ({
        studentName: student.name || "Unknown",
        studentEmail: student.email,
        subject,
        date,
        status: attendance[student.id] || "Absent",
      }));

      await Promise.all(
        records.map((rec) => axios.post("/api/attendance", rec))
      );

      alert("Attendance saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save attendance");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-2 py-8 space-y-8">

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mark Attendance
        </h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl">

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="p-2 rounded"
          >
            <option value="All">All Subjects</option>
            {SUBJECTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 rounded"
          />

          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 rounded"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => handleMarkAll("Present")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Mark All Present
          </button>
          <button
            onClick={() => handleMarkAll("Absent")}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Mark All Absent
          </button>
        </div>

        {/* Table */}
        <table className="w-full text-sm bg-white dark:bg-gray-800 rounded">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll</th>
              <th>Status</th>
              <th>Mark</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.roll}</td>
                <td>{attendance[student.id] || "Not Marked"}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={attendance[student.id] === "Present"}
                    onChange={() => handleCheckbox(student.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Save */}
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Save
        </button>

        {/* Pagination */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <span>{currentPage} / {totalPages || 1}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>

      </div>
    </MainLayout>
  );
};

export default FacultyAttendance;