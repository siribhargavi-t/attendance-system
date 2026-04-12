import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";

import Login from "./pages/Auth/Login";
import AdminDashboard from "./pages/Admin/AdminDashBoard";
import StudentDashboard from "./pages/Student/StudentDashBoard";
import FacultyDashboard from "./pages/Faculty/FacultyDashboard";

function NotFound() {
  return <div>404 - Page Not Found</div>;
}

function App() {
  return (
    <div style={{ background: "#ffe", padding: 20 }}>
      <h1>App is rendering</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="*" element={<NotFound />} /> {/* Fallback route */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;