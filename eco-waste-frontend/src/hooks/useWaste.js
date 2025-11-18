// src/hooks/useWaste.js
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { wasteService } from '../services/wasteService';
import { setWasteLogs, addWasteLog, setStats } from '../store/wasteSlice';

export const useWaste = () => {
  const dispatch = useDispatch();
  const { logs, stats, loading } = useSelector(state => state.waste);
  const [error, setError] = useState(null);

  const logWaste = async (wasteData) => {
    try {
      setError(null);
      const response = await wasteService.logWaste(wasteData);
      dispatch(addWasteLog(response.wasteLog));
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const fetchHistory = async (params = {}) => {
    try {
      setError(null);
      const response = await wasteService.getHistory(params);
      dispatch(setWasteLogs(response.logs));
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const fetchStats = async () => {
    try {
      setError(null);
      const response = await wasteService.getStats();
      dispatch(setStats(response.stats));
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const classifyImage = async (image) => {
    try {
      setError(null);
      const response = await wasteService.classifyImage(image);
      return response;
    } catch (err) {
      setError(err.message);
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
