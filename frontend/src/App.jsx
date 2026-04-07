import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// AUTH
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// ADMIN
// FIX: Changed 'Dashboard' to 'DashBoard' to match the filename
import AdminDashBoard from "./pages/Admin/DashBoard"; 
import MarkAttendance from "./pages/Admin/MarkAttendance";
import ViewAttendance from "./pages/Admin/ViewAttendance";
import Report from "./pages/Admin/Report";

// STUDENT
// FIX: Changed 'Dashboard' to 'DashBoard' to match the filename
import StudentDashBoard from "./pages/Student/DashBoard"; 
import Attendance from "./pages/Student/Attendance";

// PROTECTED ROUTE
// FIX: Changed to a named import to match the export type
import { ProtectedRoute } from "./components/Layout/ProtectedRoute";

function App() {
  return (
    // FIX: Swapped Router and AuthProvider
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} /> 
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute role="admin">
                <AdminDashBoard />
              </ProtectedRoute>
            } 
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
            path="/admin/view-attendance" 
            element={
              <ProtectedRoute role="admin">
                <ViewAttendance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/report" 
            element={
              <ProtectedRoute role="admin">
                <Report />
              </ProtectedRoute>
            } 
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