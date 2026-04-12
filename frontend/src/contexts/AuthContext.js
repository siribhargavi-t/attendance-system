import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const AuthContext = createContext();

// Custom hook for easy access
export function useAuth() {
  return useContext(AuthContext);
}

// Provider component
export function AuthProvider({ children }) {
  // user: { name, email, role }
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Login: set user and persist to localStorage
  const login = ({ name, email, role }) => {
    const userData = { name, email, role };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout: clear user
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Provide user and auth functions globally
  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}