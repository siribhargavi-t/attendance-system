import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// AUTH PAGES
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// DASHBOARD & ATTENDANCE PAGES
import Dashboard from "./pages/Student/StudentDashBoard"; // Adjust the import path as needed
import AttendancePage from "./pages/Attendance/AttendancePage"; // Adjust the import path as needed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/attendance" element={<AttendancePage />} />
        {/* Default route: redirect to /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

