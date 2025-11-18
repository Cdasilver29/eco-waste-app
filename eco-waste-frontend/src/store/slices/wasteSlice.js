import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wasteAPI } from '../../services/api';

export const fetchWasteStats = createAsyncThunk('waste/fetchStats', async () => {
  const response = await wasteAPI.getStats();
  return response.data.data;
});

export const fetchLeaderboard = createAsyncThunk('waste/fetchLeaderboard', async (params) => {
  const response = await wasteAPI.getLeaderboard(params);
  return response.data.data;
});

const wasteSlice = createSlice({
  name: 'waste',
  initialState: {
    stats: null,
    leaderboard: [],
    loading: false,
  },
  reducers: {
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
      });
  },
});

export const { addPoints } = wasteSlice.actions;
export default wasteSlice.reducer;
