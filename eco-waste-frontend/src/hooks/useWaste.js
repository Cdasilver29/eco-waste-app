// src/hooks/useWaste.js
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { wasteAPI, imageAPI } from '../services/api';
import { addWasteLog, setWasteLogs, setStats } from '../store/slices/wasteSlice';

export const useWaste = () => {
  const dispatch = useDispatch();
  const { logs, stats, loading } = useSelector(state => state.waste);
  const [error, setError] = useState(null);

  const logWaste = async (wasteData) => {
    try {
      setError(null);
      const { data } = await wasteAPI.logWaste(wasteData);
      dispatch(addWasteLog(data?.wasteLog || data));
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  const fetchHistory = async (params = {}) => {
    try {
      setError(null);
      const { data } = await wasteAPI.getHistory(params);
      dispatch(setWasteLogs(data?.logs || data));
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  const fetchStats = async () => {
    try {
      setError(null);
      const { data } = await wasteAPI.getStats();
      dispatch(setStats(data?.stats || data));
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  const classifyImage = async (formData) => {
    try {
      setError(null);
      const { data } = await imageAPI.classify(formData);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  return {
    logs,
    stats,
    loading,
    error,
    logWaste,
    fetchHistory,
    fetchStats,
    classifyImage
  };
};
