import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wasteAPI } from '../../services/api';

export const fetchWasteStats = createAsyncThunk('waste/fetchStats', async () => {
  const response = await wasteAPI.getStats();
  return response.data.data;
});

const wasteSlice = createSlice({
  name: 'waste',
  initialState: {
    stats: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWasteStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export default wasteSlice.reducer;
