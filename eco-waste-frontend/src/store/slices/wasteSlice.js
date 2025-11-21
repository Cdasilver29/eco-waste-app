import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wasteAPI } from '../../services/api';

// Async thunks
export const fetchWasteStats = createAsyncThunk('waste/fetchStats', async () => {
  const response = await wasteAPI.getStats();
  return response.data.data;
});

export const fetchLeaderboard = createAsyncThunk('waste/fetchLeaderboard', async (params) => {
  const response = await wasteAPI.getLeaderboard(params);
  return response.data.data;
});

export const fetchWasteHistory = createAsyncThunk('waste/fetchHistory', async (params) => {
  const response = await wasteAPI.getHistory(params);
  return response.data.data;
});

export const logWaste = createAsyncThunk('waste/logWaste', async (wasteData) => {
  const response = await wasteAPI.logWaste(wasteData);
  return response.data.data;
});

// Slice
const wasteSlice = createSlice({
  name: 'waste',
  initialState: {
    logs: [],
    stats: null,
    leaderboard: [],
    loading: false,
    error: null,
  },
  reducers: {
    setWasteLogs: (state, action) => {
      state.logs = action.payload;
    },
    addWasteLog: (state, action) => {
      state.logs.push(action.payload);
    },
    setStats: (state, action) => {
      state.stats = action.payload;
    },
    addPoints: (state, action) => {
      if (state.stats?.gamification) {
        state.stats.gamification.points += action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWasteStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.leaderboard = action.payload;
      })
      .addCase(fetchWasteHistory.fulfilled, (state, action) => {
        state.logs = action.payload;
      })
      .addCase(logWaste.fulfilled, (state, action) => {
        state.logs.push(action.payload);
      });
  },
});

export const { setWasteLogs, addWasteLog, setStats, addPoints } = wasteSlice.actions;
export default wasteSlice.reducer;
