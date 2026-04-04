import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MarkAttendance from './components/MarkAttendance';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
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
      </Routes>
    </Router>
  );
}

export default App;