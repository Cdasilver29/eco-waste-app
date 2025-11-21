// src/hooks/useAuth.js (Updated)
import { useDispatch, useSelector } from 'react-redux';
import { login as loginThunk, register as registerThunk, fetchUser, logout as logoutSlice, updateUser } from '../store/slices/authSlice';
import { authAPI } from '../services/api';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, loading } = useSelector(state => state.auth);
  const isAuthenticated = !!token && !!user;

  const login = async (credentials) => {
    const result = await dispatch(loginThunk(credentials));
    return result.payload;
  };

  const register = async (userData) => {
    const result = await dispatch(registerThunk(userData));
    return result.payload;
  };

  const logout = () => {
    dispatch(logoutSlice()); // Uses Redux action
  };

  const updateProfile = async (data) => {
    // Assuming you add this to authAPI
    const response = await authAPI.updateProfile(data);
    dispatch(updateUser(response.data.user));
    return response.data;
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

