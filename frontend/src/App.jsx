import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider } from "./context/ThemeContext";

import Login from "./pages/Auth/Login";
import AdminDashboard from "./pages/Admin/AdminDashBoard";
import StudentDashboard from "./pages/Student/StudentDashBoard";
import FacultyDashboard from "./pages/Faculty/FacultyDashboard";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import MarkAttendance from "./pages/Admin/MarkAttendance"; // <-- fixed import
import StudentAttendance from "./pages/Student/Attendance";
import FacultyAttendance from "./pages/Faculty/Attendance";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Common/Settings";
import LeaveRequest from "./pages/Student/LeaveList";
import FacultyLeaveRequests from "./pages/Faculty/LeaveRequests";
import LeaveList from "./pages/Student/LeaveList";
import NewLeave from "./pages/Student/NewLeave";
import Mail from "./pages/Common/Mail";

function NotFound() {
  return <h1>404 Page Not Found</h1>;
}

// ✅ Protected Route
function ProtectedRoute({ allowedRoles, children }) {
  const location = useLocation();

  const stored = localStorage.getItem("user"); // ✅ FIXED

  if (!stored) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  let user;
  try {
    user = JSON.parse(stored);
  } catch {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role?.toLowerCase(); // ✅ SAFE

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
function App() {
  return (
    <ThemeProvider>
    <UserProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <MarkAttendance />
              </ProtectedRoute>
            }
          />

          {/* Student */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/attendance"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/leave-request"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <LeaveRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/leave-list"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <LeaveList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/new-leave"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <NewLeave />
              </ProtectedRoute>
            }
          />

          {/* Faculty */}
          <Route
            path="/faculty/dashboard"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/attendance"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <FacultyAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/leave-requests"
            element={<FacultyLeaveRequests />}
          />

          {/* Profile & Settings */}
          <Route
            path="/:role/profile"
            element={
              <ProtectedRoute allowedRoles={["admin", "student", "faculty"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:role/settings"
            element={
              <ProtectedRoute allowedRoles={["admin", "student", "faculty"]}>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:role/mail"
            element={
              <ProtectedRoute allowedRoles={["admin", "student", "faculty"]}>
                <Mail />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </UserProvider>
    </ThemeProvider>
  );
}

export default App;