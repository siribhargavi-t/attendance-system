import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import axios from 'axios';
import { Users, CheckCircle, Percent, BarChart, Calendar, AlertTriangle, Filter } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// --- Reusable Card Component ---
const DashboardCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 transition-transform transform hover:scale-105">
    <div className={`rounded-full p-3 ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

// --- Dummy Data for components without a backend API yet ---
const dummyWeeklyData = [
  { day: 'Mon', present: 120, absent: 30 },
  { day: 'Tue', present: 135, absent: 15 },
  { day: 'Wed', present: 130, absent: 20 },
  { day: 'Thu', present: 140, absent: 10 },
  { day: 'Fri', present: 115, absent: 35 },
];

const dummyRecentAttendance = [
    { _id: '1', studentId: { name: 'Siri Bhargavi' }, subjectId: { name: 'Computer Networks' }, status: 'present' },
    { _id: '2', studentId: { name: 'John Doe' }, subjectId: { name: 'Database Systems' }, status: 'present' },
    { _id: '3', studentId: { name: 'Jane Smith' }, subjectId: { name: 'Computer Networks' }, status: 'absent' },
];

// --- Main Dashboard Component ---
const AdminDashBoard = () => {
  const [stats, setStats] = useState({ totalStudents: 0, todayAttendance: 0, overallPercentage: 0 });
  const [weeklyData, setWeeklyData] = useState(dummyWeeklyData);
  const [recentAttendance, setRecentAttendance] = useState(dummyRecentAttendance);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // <-- State for error message

  // State for filters
  const [subjectFilter, setSubjectFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Reset error on new fetch
      const token = localStorage.getItem('token');
      const config = { 
        headers: { Authorization: `Bearer ${token}` },
        params: { subjectId: subjectFilter, date: dateFilter } // Pass filters as query params
      };

      try {
        // Fetch all data in parallel
        const [statsRes, weeklyRes, recentRes] = await Promise.all([
          axios.get('/api/admin/dashboard-stats', config),
          axios.get('/api/attendance/weekly', config),
          axios.get('/api/attendance/recent', config)
        ]);

        setStats(statsRes.data);
        setWeeklyData(weeklyRes.data);
        setRecentAttendance(recentRes.data);

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err.response?.data?.message || "Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subjectFilter, dateFilter]); // Re-fetch when filters change

  // --- Loading State UI ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // --- Error State UI ---
  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative flex items-center" role="alert">
          <AlertTriangle className="mr-4" size={24} />
          <div>
            <strong className="font-bold">An error occurred: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Dashboard UI ---
  return (
    <div className="p-6 md:p-8 bg-gray-100 min-h-[calc(100vh-64px)]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>

      {/* --- Filter Bar --- */}
      <div className="mb-8 p-4 bg-white rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-4">
        <h3 className="font-semibold text-gray-600 flex items-center"><Filter size={18} className="mr-2"/>Filters:</h3>
        <select onChange={(e) => setSubjectFilter(e.target.value)} value={subjectFilter} className="p-2 border rounded-md w-full md:w-auto">
          <option value="">All Subjects</option>
          {/* This should be populated from an API call to fetch subjects */}
          <option value="subj1">Computer Networks</option>
          <option value="subj2">Database Systems</option>
        </select>
        <DatePicker selected={dateFilter} onChange={date => setDateFilter(date)} isClearable placeholderText="Select a date" className="p-2 border rounded-md w-full md:w-auto" />
      </div>

      {/* --- Cards Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Total Students" value={stats.totalStudents} icon={<Users className="text-white" />} color="bg-blue-500" />
        <DashboardCard title="Today's Attendance" value={stats.todayAttendance} icon={<CheckCircle className="text-white" />} color="bg-green-500" />
        <DashboardCard title="Overall Percentage" value={`${stats.overallPercentage}%`} icon={<Percent className="text-white" />} color="bg-orange-500" />
      </div>
      
      {/* --- Charts and Tables Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center"><BarChart className="mr-2" />Weekly Attendance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="presentCount" name="Present" fill="#4CAF50" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center"><Calendar className="mr-2" />Recent Attendance</h2>
          <div className="overflow-y-auto max-h-[300px]">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                <tr>
                  <th scope="col" className="py-3 px-4">Student</th>
                  <th scope="col" className="py-3 px-4">Subject</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAttendance.length > 0 ? recentAttendance.map((record) => (
                  <tr key={record._id} className="bg-white border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{record.studentId?.name || 'N/A'}</td>
                    <td className="py-3 px-4 text-gray-600">{record.subjectId?.name || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" className="text-center p-4">No recent records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
=======
import api from "../../api/axios";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// ✅ Improved StatCard with dynamic color
const StatCard = ({ title, value, symbol }) => {
  const isPercentage = title.includes('Attendance');

  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p
        style={{
          ...styles.cardValue,
          color: isPercentage
            ? value >= 75
              ? 'green'
              : 'red'
            : '#007bff',
        }}
      >
        {value}
        {symbol}
      </p>
>>>>>>> 8c4e74d3ebd9aeb673baa2ae2c2def86dd594b99
    </div>
  );
};

<<<<<<< HEAD
export default AdminDashBoard;
=======
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    classesToday: 0,
    attendancePercentage: '0.00',
  });

  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [statsRes, weeklyRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/weekly-attendance'),
        ]);

        setStats(statsRes.data);
        setWeeklyData(weeklyRes.data);
        setError('');
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load dashboard'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Safe chart data
  const chartData = {
    labels:
      weeklyData?.map((d) =>
        d.date
          ? new Date(d.date).toLocaleDateString('en-US', {
              weekday: 'short',
              day: 'numeric',
            })
          : ''
      ) || [],
    datasets: [
      {
        label: 'Weekly Attendance %',
        data: weeklyData?.map((d) => d.percentage) || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Last 7 Days Attendance',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => value + '%',
        },
      },
    },
  };

  if (loading) {
    return <div style={styles.message}>Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div style={{ ...styles.message, color: 'red' }}>
        {error}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Admin Dashboard</h1>

      {/* ✅ Username display */}
      <p style={styles.user}>Logged in as: {username}</p>

      {/* ✅ Stats */}
      <div style={styles.statsContainer}>
        <StatCard title="Total Students" value={stats.totalStudents} />
        <StatCard title="Classes Today" value={stats.classesToday} />
        <StatCard
          title="Attendance Today"
          value={stats.attendancePercentage}
          symbol="%"
        />
      </div>

      {/* ✅ Chart */}
      <div style={styles.chartContainer}>
        {weeklyData.length > 0 ? (
          <Line options={chartOptions} data={chartData} />
        ) : (
          <p style={styles.message}>No data for chart</p>
        )}
      </div>

      {/* ✅ Refresh Button */}
      <button
        style={styles.button}
        onClick={() => window.location.reload()}
      >
        Refresh
      </button>
    </div>
  );
};

// ✅ Clean UI styles
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial',
  },
  header: {
    marginBottom: '10px',
  },
  user: {
    marginBottom: '20px',
    color: '#555',
  },
  statsContainer: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '30px',
  },
  card: {
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    minWidth: '200px',
    textAlign: 'center',
    background: '#fff',
  },
  cardTitle: {
    marginBottom: '10px',
  },
  cardValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
  },
  chartContainer: {
    padding: '20px',
    borderRadius: '10px',
    background: '#fff',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  message: {
    textAlign: 'center',
    padding: '20px',
  },
  button: {
    marginTop: '20px',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    background: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default AdminDashboard;
>>>>>>> 8c4e74d3ebd9aeb673baa2ae2c2def86dd594b99
