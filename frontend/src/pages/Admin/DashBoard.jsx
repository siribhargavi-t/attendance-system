import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function Dashboard() {

  // Dummy data (later connect backend)
  const data = [
    { day: "Mon", attendance: 75 },
    { day: "Tue", attendance: 80 },
    { day: "Wed", attendance: 78 },
    { day: "Thu", attendance: 85 },
    { day: "Fri", attendance: 90 }
  ];

  return (
    <div className="container">
      <Sidebar />

      <div className="main">
        <Header />

        <h2 style={{ marginBottom: "20px" }}>Dashboard</h2>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px"
        }}>
          <div className="card">
            <h3>Total Students</h3>
            <p style={{ fontSize: "24px" }}>120</p>
          </div>

          <div className="card">
            <h3>Classes Today</h3>
            <p style={{ fontSize: "24px" }}>5</p>
          </div>

          <div className="card">
            <h3>Attendance %</h3>
            <p style={{ fontSize: "24px", color: "green" }}>82%</p>
          </div>
        </div>

        {/* Chart */}
        <div className="card">
          <h3>Weekly Attendance</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="attendance" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;