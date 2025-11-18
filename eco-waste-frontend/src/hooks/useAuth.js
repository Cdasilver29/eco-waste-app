// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../services/authService';
import { setUser, clearUser, setLoading } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector(state => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          dispatch(setLoading(true));
          const userData = await authService.getCurrentUser();
          dispatch(setUser(userData));
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          dispatch(clearUser());
        } finally {
          dispatch(setLoading(false));
        }
      }
    };

    checkAuth();
  }, [dispatch]);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      dispatch(setUser(response.user));
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      dispatch(setUser(response.user));
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch(clearUser());
  };

  const updateProfile = async (data) => {
    try {
      const response = await authService.updateProfile(data);
      dispatch(setUser(response.user));
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile
  };
};

