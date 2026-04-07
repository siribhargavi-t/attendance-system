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

      if (response.data.success) {
        const { token, role, email: resUser } = response.data.data;

        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('username', resUser);

        // Update state
        setUser({ token, role, username: resUser });

        // Navigate
        if (role === 'admin') navigate('/admin/dashboard');
        else navigate('/student/dashboard');

        return { token, role };
      }
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