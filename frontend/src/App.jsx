import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// CONTEXTS
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// AUTH PAGES
import SelectRole from "./pages/Auth/SelectRole";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

// ADMIN
import DashBoard from "./pages/Admin/DashBoard";
import MarkAttendance from "./pages/Admin/MarkAttendance";
import ManageStudents from "./pages/Admin/ManageStudents";
import Header from './components/Header'; // <-- IMPORT THE HEADER

// STUDENT
// FIX: Changed 'Dashboard' to 'DashBoard' to match the filename
import StudentDashBoard from "./pages/Student/StudentDashBoard"; 
import Attendance from "./pages/Student/Attendance";

// PROTECTED ROUTE
import { ProtectedRoute } from "./components/Layout/ProtectedRoute";

function App() {
  return (
    <Router>
      <Header /> {/* <-- ADD THE HEADER COMPONENT HERE */}
      <AuthProvider>
        <Routes>
          <Route path="/" element={<SelectRole />} />
          <Route path="/login/:role" element={<Login />} />
          <Route path="/register/:role" element={<Register />} />
          
          <Route 
            path="/admin/dashboard" 
            element={<AdminDashBoard />} 
          />
          <Route 
            path="/admin/mark-attendance" 
            element={
              <ProtectedRoute role="admin">
                <MarkAttendance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/attendance" 
            element={
              <ProtectedRoute role="admin">
                <MarkAttendance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/manage-students" 
            element={<ManageStudents />} 
          />
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute role="student">
                <StudentDashBoard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/attendance" 
            element={
              <ProtectedRoute role="student">
                <Attendance />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;