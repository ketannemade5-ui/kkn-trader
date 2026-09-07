import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('kkn_token') || null);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('kkn_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Auto-login session expired:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('kkn_token', res.token);
        localStorage.setItem('kkn_user', JSON.stringify(res.user));
        success(`Welcome back, ${res.user.name}!`);
        return { success: true };
      }
    } catch (err) {
      error(err.message || 'Login failed. Please check credentials.');
      return { success: false, message: err.message };
    }
  };

  const register = async (name, email, password, experienceLevel, tradingGoals) => {
    try {
      const res = await authAPI.register({ name, email, password, experienceLevel, tradingGoals });
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('kkn_token', res.token);
        localStorage.setItem('kkn_user', JSON.stringify(res.user));
        success('Account created! $100,000 Virtual Practice Funds added.');
        return { success: true };
      }
    } catch (err) {
      error(err.message || 'Registration failed.');
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('kkn_token');
    localStorage.removeItem('kkn_user');
    success('Logged out successfully.');
  };

  const updateProfile = async (data) => {
    try {
      const res = await authAPI.updateProfile(data);
      if (res.success) {
        setUser(res.user);
        localStorage.setItem('kkn_user', JSON.stringify(res.user));
        success('Profile updated successfully.');
        return { success: true };
      }
    } catch (err) {
      error(err.message || 'Failed to update profile.');
      return { success: false, message: err.message };
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
