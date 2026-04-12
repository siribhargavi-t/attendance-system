import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    if (token && role) {
      setUser({ token, role, username });
    }
    setLoading(false);
  }, []);

  // ✅ FIXED LOGIN
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });

      // Use the backend's response structure
      const { token, user } = response.data;

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('username', user.email);

      // Update state
      setUser({ token, role: user.role, username: user.email });

      // Navigate
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'student') navigate('/student/dashboard');
      else if (user.role === 'faculty') navigate('/faculty/dashboard');
      else navigate('/');

      return { token, role: user.role };
    } catch (error) {
      console.error('Login error', error);
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/');
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}