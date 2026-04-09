import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '').replace(/\/$/, '');

  const login = async (email, password, isAdmin = false) => {
    const url = isAdmin ? '/api/auth/admin-login' : '/api/auth/login';
    const normalizedEmail = email.trim();
    const { data } = await axios.post(`${API_BASE_URL}${url}`, { email: normalizedEmail, password });
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${API_BASE_URL}/api/auth/register`, { name, email, password });
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
