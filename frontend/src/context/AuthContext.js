import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://shreya-classes.onrender.com/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('shreya_token');
    const savedUser = localStorage.getItem('shreya_user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch {
        localStorage.removeItem('shreya_token');
        localStorage.removeItem('shreya_user');
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${API}/auth/login`, {
      email,
      password
    });

    const { token, user: userData } = res.data;

    localStorage.setItem('shreya_token', token);
    localStorage.setItem('shreya_user', JSON.stringify(userData));

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    setUser(userData);

    return userData;
  };

  const register = async (data) => {
    const res = await axios.post(`${API}/auth/register`, data);

    const { token, user: userData } = res.data;

    localStorage.setItem('shreya_token', token);
    localStorage.setItem('shreya_user', JSON.stringify(userData));

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    setUser(userData);

    return userData;
  };

  const logout = () => {
    localStorage.removeItem('shreya_token');
    localStorage.removeItem('shreya_user');

    delete axios.defaults.headers.common['Authorization'];

    setUser(null);
  };

  const updateUser = (newData) => {
    const updated = { ...user, ...newData };

    setUser(updated);

    localStorage.setItem('shreya_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}