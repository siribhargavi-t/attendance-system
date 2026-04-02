import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <Link to="/attendance">Mark Attendance</Link><br /><br />
      <Link to="/report">View Report</Link>
    </div>
  );
}

export default Dashboard;