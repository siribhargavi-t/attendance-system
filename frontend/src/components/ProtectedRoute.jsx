import React from "react";
import { Navigate } from "react-router-dom";

// Mock: Replace with your real auth logic or context if needed
const isLoggedIn = () => {
  // For demo: check if "user" exists in localStorage
  return !!localStorage.getItem("user");
};

const ProtectedRoute = ({ children }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;