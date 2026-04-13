import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Auth/Login";
import AdminDashboard from "./pages/Admin/AdminDashBoard";
import StudentDashboard from "./pages/Student/StudentDashBoard";
import FacultyDashboard from "./pages/Faculty/FacultyDashboard";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AdminAttendance from "./pages/Admin/Attendance";
import StudentAttendance from "./pages/Student/Attendance";
import FacultyAttendance from "./pages/Faculty/Attendance";

function NotFound() {
  return <h1>404 Page Not Found</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />

        <Route path="/admin/attendance" element={<AdminAttendance />} />
        <Route path="/student/attendance" element={<StudentAttendance />} />
        <Route path="/faculty/attendance" element={<FacultyAttendance />} />

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;