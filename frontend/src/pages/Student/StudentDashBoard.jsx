import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import MainLayout from "../../components/Layout/MainLayout";
import StatsCard from "../../components/StatsCard";
import { FiBookOpen, FiUserCheck, FiUserX, FiPercent } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StudentDashboard = () => {
  const [stats, setStats] = useState([]);
  const [subjectAttendance, setSubjectAttendance] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [attendanceTrend, setAttendanceTrend] = useState([]);
  const [attendancePercent, setAttendancePercent] = useState(null);

  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const studentEmail = user.email || "";

  useEffect(() => {
    if (!studentEmail) return;

    axios.get(`/api/attendance?studentEmail=${encodeURIComponent(studentEmail)}`)
      .then(res => {
        const records = res.data;
        const total = records.length;
        const present = records.filter(r => r.status === "Present").length;
        const absent = total - present;
        const percentVal = total > 0 ? Math.round((present / total) * 100) : 0;

        setStats([
          { label: "Total Classes", value: total, icon: <FiBookOpen className="text-blue-500 text-3xl mb-2" />, color: "blue" },
          { label: "Present", value: present, icon: <FiUserCheck className="text-green-500 text-3xl mb-2" />, color: "green" },
          { label: "Absent", value: absent, icon: <FiUserX className="text-red-500 text-3xl mb-2" />, color: "red" },
          { label: "Attendance %", value: `${percentVal}%`, icon: <FiPercent className="text-indigo-500 text-3xl mb-2" />, color: "indigo" }
        ]);

        setAttendancePercent(percentVal);

        // Subject calculation
        const subjMap = {};
        records.forEach(r => {
          if (!subjMap[r.subject]) subjMap[r.subject] = { total: 0, present: 0 };
          subjMap[r.subject].total++;
          if (r.status === "Present") subjMap[r.subject].present++;
        });
        const subjAtt = Object.keys(subjMap).map(subj => ({
          subject: subj,
          percent: Math.round((subjMap[subj].present / subjMap[subj].total) * 100)
        }));
        setSubjectAttendance(subjAtt);

        // Recent calculation
        const sorted = [...records].sort((a,b) => new Date(b.date) - new Date(a.date));
        setRecentAttendance(sorted.slice(0, 5).map(r => ({
          date: r.date.split("T")[0] || new Date(r.date).toLocaleDateString(),
          subject: r.subject,
          status: r.status
        })));

        // Trend calculation (last 7 days overall)
        const dateMap = {};
        records.forEach(r => {
           const d = r.date.split("T")[0] || new Date(r.date).toLocaleDateString();
           if (!dateMap[d]) dateMap[d] = { total: 0, present: 0 };
           dateMap[d].total++;
           if (r.status === "Present") dateMap[d].present++;
        });
        const trend = Object.keys(dateMap).sort().slice(-7).map(d => ({
           date: d,
           percent: Math.round((dateMap[d].present / dateMap[d].total) * 100)
        }));
        setAttendanceTrend(trend);
      })
      .catch(err => {
        console.error("Failed to fetch attendance data", err);
        setAttendancePercent(null);
      });
  }, [studentEmail]);

  // Attendance Insights calculation
  const bestSubject =
    subjectAttendance.length > 0
      ? subjectAttendance.reduce((best, subj) =>
          subj.percent > best.percent ? subj : best,
        subjectAttendance[0])
      : null;
  const lowSubject =
    subjectAttendance.length > 0
      ? subjectAttendance.reduce((low, subj) =>
          subj.percent < low.percent ? subj : low,
        subjectAttendance[0])
      : null;

  // Calculate overall attendance percent
  let totalClasses = 0;
  let presentClasses = 0;
  if (stats && stats.length > 0) {
    const totalStat = stats.find((s) => s.label === "Total Classes");
    if (totalStat && typeof totalStat.value === "number") {
      totalClasses = totalStat.value;
    }
    const presentStat = stats.find((s) => s.label === "Present");
    if (presentStat && typeof presentStat.value === "number") {
      presentClasses = presentStat.value;
    }
  }

  // Prediction logic: classes needed to reach 75%
  let needed = 0;
  if (totalClasses > 0 && presentClasses / totalClasses < 0.75) {
    needed = Math.ceil((0.75 * totalClasses - presentClasses) / 0.25);
    if (needed < 0) needed = 0;
  }

  useEffect(() => {
    // Notify check if needed globally or locally
  }, []);

  return (
    <MainLayout>
      <motion.div 
        className="max-w-6xl mx-auto px-4 py-10 space-y-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Warning Message */}
        {attendancePercent !== null && attendancePercent < 75 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 font-semibold mb-4">
            <span className="text-xl">⚠</span>
            <span>Attendance below required level</span>
          </div>
        )}

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 shadow flex flex-col sm:flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back, Student 👋</h2>
            <p className="text-white text-opacity-90">Here is your attendance overview</p>
          </div>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Student Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 text-base">
            Welcome! Here’s your attendance overview and stats.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.length > 0 ? (
            stats.map((stat) => (
              <StatsCard
                key={stat.label}
                icon={stat.icon}
                title={stat.label}
                value={stat.value}
                color={stat.color}
              />
            ))
          ) : (
            <div className="col-span-4 text-center text-gray-500 dark:text-gray-400">
              No data available
            </div>
          )}
        </div>

        {/* Prediction Message */}
        {needed > 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-xl flex items-center gap-2 font-semibold mt-2 mb-2">
            <span className="text-xl">📈</span>
            <span>
              You need {needed} more present classes to reach 75%
            </span>
          </div>
        )}

        {/* Attendance Trend Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Attendance Trend (Last 7 Days)
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={attendanceTrend}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#64748b" }}
                stroke="#cbd5e1"
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 12, fill: "#64748b" }}
                stroke="#cbd5e1"
              />
              <Tooltip
                formatter={(value) => `${value}%`}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  background: "#fff",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  color: "#0f172a",
                  fontWeight: 500,
                }}
              />
              <Line
                type="monotone"
                dataKey="percent"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 6, stroke: "#6366f1", strokeWidth: 2, fill: "#fff" }}
                activeDot={{ r: 8, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
                isAnimationActive={true}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subject-wise Attendance Progress */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subject-wise Attendance</h2>
          <div className="space-y-4">
            {subjectAttendance.length > 0 ? (
              subjectAttendance.map((subj) => (
                <div key={subj.subject}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{subj.subject}</span>
                    <span className="font-semibold text-blue-700 dark:text-blue-300">{subj.percent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300`}
                      style={{
                        width: `${subj.percent}%`,
                        background:
                          subj.percent >= 90
                            ? "#22c55e" // green-500
                            : "#3b82f6", // blue-500
                      }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 dark:text-gray-400">No data available</div>
            )}
          </div>
        </div>

        {/* Recent Attendance Section */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Attendance</h2>
          <div className="overflow-x-auto">
            {recentAttendance.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-600 dark:text-gray-300 border-b">
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Subject</th>
                    <th className="py-3 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttendance.map((rec, idx) => (
                    <tr
                      key={idx}
                      className={`border-b transition hover:bg-blue-50 dark:hover:bg-gray-700 ${
                        idx === recentAttendance.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{rec.date}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{rec.subject}</td>
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
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 py-6 text-center">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Attendance Insights */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Attendance Insights</h2>
          {bestSubject && lowSubject ? (
            <div className="space-y-2">
              <div>
                <span className="font-medium">Best Subject:</span>{" "}
                <span className="text-green-600 dark:text-green-400">
                  {bestSubject.subject} ({bestSubject.percent}%)
                </span>
              </div>
              <div>
                <span className="font-medium">Needs Attention:</span>{" "}
                <span className="text-red-600 dark:text-red-400">
                  {lowSubject.subject} ({lowSubject.percent}%)
                </span>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">No data available</div>
          )}
        </div>

        {/* Removed notifications dashboard block as requested */}

      </motion.div>
    </MainLayout>
  );
};

export default StudentDashboard;