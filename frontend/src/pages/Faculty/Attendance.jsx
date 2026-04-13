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

const FacultyAttendance = () => {
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [attendance, setAttendance] = useState({});

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
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
            Mark Attendance
          </h1>
          <p className="text-gray-500">Select subject and mark attendance</p>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-center bg-white rounded-xl shadow p-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <FiBookOpen className="text-blue-500" />
            <select
              className="rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
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
              className="rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-xl shadow p-4">
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
              {DUMMY_STUDENTS.map((student) => (
                <tr
                  key={student.id}
                  className="border-b hover:bg-blue-50 transition"
                >
                  <td className="py-3 px-4 font-medium">{student.name}</td>
                  <td className="py-3 px-4">{student.roll}</td>
                  <td className="py-3 px-4 text-center">
                    {attendance[student.id] === "Present" && (
                      <span className="px-3 py-1 text-xs rounded-full font-medium bg-green-100 text-green-700">
                        Present
                      </span>
                    )}
                    {attendance[student.id] === "Absent" && (
                      <span className="px-3 py-1 text-xs rounded-full font-medium bg-red-100 text-red-700">
                        Absent
                      </span>
                    )}
                    {!attendance[student.id] && (
                      <span className="px-3 py-1 text-xs rounded-full font-medium bg-gray-100 text-gray-500">
                        Not Marked
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center flex gap-2 justify-center">
                    <button
                      className="px-3 py-1 text-xs rounded-lg font-semibold bg-green-100 text-green-700 hover:bg-green-200 transition"
                      onClick={() => handleMark(student.id, "Present")}
                    >
                      Present
                    </button>
                    <button
                      className="px-3 py-1 text-xs rounded-lg font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition"
                      onClick={() => handleMark(student.id, "Absent")}
                    >
                      Absent
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default FacultyAttendance;