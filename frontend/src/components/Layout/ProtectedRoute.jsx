import React from "react";
import { Navigate } from "react-router-dom";

// Simple check: user is logged in if "user" exists in localStorage
const isLoggedIn = () => {
  try {
    const user = localStorage.getItem("user");
    return !!user;
  } catch {
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;