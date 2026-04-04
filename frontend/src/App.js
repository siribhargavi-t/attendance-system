<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import MarkAttendance from "./pages/MarkAttendance";
import ViewAttendance from "./pages/ViewAttendance";
=======
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MarkAttendance from './components/MarkAttendance';
import ProtectedRoute from './components/ProtectedRoute';
>>>>>>> ae555bcb9dc84e355fe5759a038a83b93569cbcf

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
<<<<<<< HEAD
        <Route path="/mark" element={<MarkAttendance />} />
        <Route path="/view" element={<ViewAttendance />} />
=======
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mark-attendance" 
          element={
            <ProtectedRoute>
              <MarkAttendance />
            </ProtectedRoute>
          } 
        />
        {/* Add other routes here */}
>>>>>>> ae555bcb9dc84e355fe5759a038a83b93569cbcf
      </Routes>
    </Router>
  );
}

export default App;