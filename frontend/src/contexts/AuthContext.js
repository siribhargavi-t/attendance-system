import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        const storedRole = localStorage.getItem('role');
        const storedUsername = localStorage.getItem('username');
        const storedIsSuperAdmin = localStorage.getItem('isSuperAdmin');
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
      // Use the 'api' instance here
      const response = await api.post('/auth/login', { username, password });
      if (response.data.success) {
        const { token, role, username: resUser, isSuperAdmin } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('username', resUser);
        localStorage.setItem('isSuperAdmin', isSuperAdmin);
        
        const userData = { token, role, username: resUser, isSuperAdmin };
        setUser(userData);
        
        return userData; 
      }
    } catch (error) {
      console.error('Login error', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    return null;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('isSuperAdmin');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
