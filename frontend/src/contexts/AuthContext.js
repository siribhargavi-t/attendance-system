import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage for existing session on load
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedUsername = localStorage.getItem('username');
    const storedIsSuperAdmin = localStorage.getItem('isSuperAdmin');

    if (token && storedRole) {
      setUser({ 
          token, 
          role: storedRole, 
          username: storedUsername, 
          isSuperAdmin: storedIsSuperAdmin === 'true' 
      });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      if (response.data.success) {
        const { token, role, username: resUser, isSuperAdmin } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('username', resUser);
        localStorage.setItem('isSuperAdmin', isSuperAdmin);
        
        setUser({ token, role, username: resUser, isSuperAdmin });
        
        if (role === 'admin') navigate('/admin');
        else navigate('/student');
        return true;
      }
    } catch (error) {
      console.error('Login error', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('isSuperAdmin');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
