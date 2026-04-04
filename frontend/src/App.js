import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProtectedRoute } from "./components/Layout/ProtectedRoute";
import AdminLayout from "./components/Layout/AdminLayout";
import StudentLayout from "./components/Layout/StudentLayout";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import Register from "./pages/Auth/Register";


import AdminDashboard from "./pages/Admin/Dashboard";
import ManageAdmins from "./pages/Admin/ManageAdmins";
import Students from "./pages/Admin/Students";
import Subjects from "./pages/Admin/Subjects";
import MarkAttendance from "./pages/Admin/MarkAttendance";
import Requests from "./pages/Admin/Requests";
import Settings from "./pages/Admin/Settings";

import StudentDashboard from "./pages/Student/Dashboard";
import StudentAttendance from "./pages/Student/Attendance";
import StudentRequest from "./pages/Student/Request";
import StudentChangePassword from "./pages/Student/ChangePassword";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
             <Route index element={<AdminDashboard />} />
             <Route path="students" element={<Students />} />
             <Route path="subjects" element={<Subjects />} />
             <Route path="mark-attendance" element={<MarkAttendance />} />
             <Route path="requests" element={<Requests />} />
             <Route path="settings" element={<Settings />} />
             <Route path="manage-admins" element={<ManageAdmins />} />
             <Route path="add-admin" element={<Register />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout />
            </ProtectedRoute>
          }>
             <Route index element={<StudentDashboard />} />
             <Route path="attendance" element={<StudentAttendance />} />
             <Route path="request" element={<StudentRequest />} />
             <Route path="change-password" element={<StudentChangePassword />} />
          </Route>

        </Routes>
      </AuthProvider>
    </Router>
    </ThemeProvider>
  );
}

export default App;
