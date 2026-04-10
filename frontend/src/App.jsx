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

// ADMIN
import AdminDashBoard from "./pages/Admin/DashBoard";
import MarkAttendance from "./pages/Admin/MarkAttendance";
import ViewAttendance from "./pages/Admin/ViewAttendance";
import Report from "./pages/Admin/Report";

// STUDENT
import StudentDashBoard from "./pages/Student/DashBoard";
import Attendance from "./pages/Student/Attendance";

// PROTECTED ROUTE
import { ProtectedRoute } from "./components/Layout/ProtectedRoute";

function App() {
  return (
    <Router>
      <ThemeProvider> {/* ✅ wrap here */}
        <AuthProvider> {/* ✅ only once */}
          <Routes>

            {/* AUTH */}
            <Route path="/" element={<SelectRole />} />
            <Route path="/login/:role" element={<Login />} />
            <Route path="/register/:role" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* ADMIN */}
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

            {/* STUDENT */}
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
      </ThemeProvider>
    </Router>
  );
}

export default App;