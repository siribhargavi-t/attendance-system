import React, { useState, useEffect } from 'react';
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
    </div>
  );
};

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