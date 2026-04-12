import React, { useState } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import Card from "../../components/Card";
import { FiCheckCircle, FiXCircle, FiBookOpen, FiPercent, FiCalendar } from "react-icons/fi";

// Dummy data
const DUMMY_KPI = {
  total: 40,
  present: 36,
  absent: 4,
};
const DUMMY_SUBJECTS = [
  { name: "Mathematics", percentage: 95 },
  { name: "Physics", percentage: 90 },
  { name: "Chemistry", percentage: 85 },
  { name: "English", percentage: 100 },
];
const DUMMY_ATTENDANCE = [
  { id: 1, date: "2024-06-01", subject: "Mathematics", status: "Present" },
  { id: 2, date: "2024-05-31", subject: "Physics", status: "Absent" },
  { id: 3, date: "2024-05-30", subject: "Chemistry", status: "Present" },
  { id: 4, date: "2024-05-29", subject: "English", status: "Present" },
  { id: 5, date: "2024-05-28", subject: "Mathematics", status: "Present" },
];

const getPercentage = (present, total) =>
  total === 0 ? 0 : Math.round((present / total) * 100);

const StudentDashboard = () => {
  const [kpi] = useState(DUMMY_KPI);
  const [subjects] = useState(DUMMY_SUBJECTS);
  const [attendance] = useState(DUMMY_ATTENDANCE);

  const attendancePercentage = getPercentage(kpi.present, kpi.total);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-2 py-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="flex flex-col items-center py-6">
            <span className="text-gray-500 text-sm mb-1">Total Classes</span>
            <span className="text-3xl font-bold flex items-center gap-2">
              <FiBookOpen className="text-blue-500" /> {kpi.total}
            </span>
          </Card>
          <Card className="flex flex-col items-center py-6">
            <span className="text-gray-500 text-sm mb-1">Present</span>
            <span className="text-3xl font-bold text-green-600 flex items-center gap-2">
              <FiCheckCircle /> {kpi.present}
            </span>
          </Card>
          <Card className="flex flex-col items-center py-6">
            <span className="text-gray-500 text-sm mb-1">Absent</span>
            <span className="text-3xl font-bold text-red-500 flex items-center gap-2">
              <FiXCircle /> {kpi.absent}
            </span>
          </Card>
          <Card className="flex flex-col items-center py-6">
            <span className="text-gray-500 text-sm mb-1">Attendance %</span>
            <span className="text-3xl font-bold text-blue-600 flex items-center gap-2">
              <FiPercent /> {attendancePercentage}%
            </span>
          </Card>
        </div>

        {/* Subject-wise Attendance */}
        <Card>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiBookOpen className="text-blue-500" /> Subject-wise Attendance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {(subjects || []).map((subj) => (
              <div
                key={subj.name}
                className="bg-blue-50 rounded-xl p-4 flex flex-col items-center shadow-sm"
              >
                <span className="font-medium text-gray-700">{subj.name}</span>
                <span className="text-xl font-bold text-blue-600 mt-2">
                  {typeof subj.percentage === "number"
                    ? `${subj.percentage}%`
                    : "N/A"}
                </span>
                <div className="w-full bg-blue-100 h-2 rounded-full mt-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${subj.percentage || 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Attendance Table */}
        <Card>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiCalendar className="text-green-500" /> Recent Attendance
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Subject</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {(attendance || []).length > 0 ? (
                  attendance.map((rec) => (
                    <tr
                      key={rec.id}
                      className="border-b hover:bg-blue-50 transition"
                    >
                      <td className="py-3 px-4 font-medium">
                        {rec.date}
                      </td>
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-gray-400">
                      No attendance records found
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

export default StudentDashboard;