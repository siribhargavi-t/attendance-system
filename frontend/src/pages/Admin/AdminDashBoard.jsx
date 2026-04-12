import React, { useState } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import Card from "../../components/Card";
import { FiUsers, FiUserCheck, FiBookOpen, FiBarChart2, FiActivity } from "react-icons/fi";

// Dummy KPI data
const DUMMY_KPI = {
  students: 120,
  faculty: 15,
  classes: 8,
};

// Dummy analytics data (could be chart data in future)
const DUMMY_ANALYTICS = [
  { label: "Avg Attendance %", value: "92%" },
  { label: "Best Performing Class", value: "CSE-A" },
  { label: "Most Absent Day", value: "Friday" },
];

// Dummy recent activity
const DUMMY_ACTIVITY = [
  { id: 1, user: "Siri Bhargavi", action: "Marked Present", role: "Student", date: "2024-06-01" },
  { id: 2, user: "John Doe", action: "Marked Absent", role: "Student", date: "2024-06-01" },
  { id: 3, user: "Prof. Smith", action: "Added Attendance", role: "Faculty", date: "2024-05-31" },
  { id: 4, user: "Jane Smith", action: "Marked Present", role: "Student", date: "2024-05-31" },
];

const AdminDashboard = () => {
  const [kpi] = useState(DUMMY_KPI);
  const [analytics] = useState(DUMMY_ANALYTICS);
  const [activity] = useState(DUMMY_ACTIVITY);
  const [search, setSearch] = useState("");

  const filteredData = activity.filter((item) =>
    item.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-2 py-8 space-y-10">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="flex flex-col items-center py-6">
            <span className="text-gray-500 text-sm mb-1">Total Students</span>
            <span className="text-3xl font-bold flex items-center gap-2">
              <FiUsers className="text-blue-500" /> {kpi.students}
            </span>
          </Card>
          <Card className="flex flex-col items-center py-6">
            <span className="text-gray-500 text-sm mb-1">Total Faculty</span>
            <span className="text-3xl font-bold flex items-center gap-2 text-green-600">
              <FiUserCheck /> {kpi.faculty}
            </span>
          </Card>
          <Card className="flex flex-col items-center py-6">
            <span className="text-gray-500 text-sm mb-1">Total Classes</span>
            <span className="text-3xl font-bold flex items-center gap-2 text-orange-600">
              <FiBookOpen /> {kpi.classes}
            </span>
          </Card>
        </div>

        {/* Analytics Section */}
        <Card>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiBarChart2 className="text-blue-500" /> Analytics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {analytics.map((item, idx) => (
              <div
                key={idx}
                className="bg-blue-50 rounded-xl p-4 flex flex-col items-center shadow-sm"
              >
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className="text-xl font-bold text-blue-600 mt-2">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity Table */}
        <Card>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiActivity className="text-green-500" /> Recent Activity
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-3 px-4 text-left">User</th>
                  <th className="py-3 px-4 text-left">Role</th>
                  <th className="py-3 px-4 text-left">Action</th>
                  <th className="py-3 px-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {(filteredData || []).length > 0 ? (
                  filteredData.map((rec) => (
                    <tr
                      key={rec.id}
                      className="border-b hover:bg-blue-50 transition"
                    >
                      <td className="py-3 px-4 font-medium">{rec.user}</td>
                      <td className="py-3 px-4">{rec.role}</td>
                      <td className="py-3 px-4">{rec.action}</td>
                      <td className="py-3 px-4">{rec.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-400">
                      No recent activity found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="mb-4 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-200 dark:bg-gray-800 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
