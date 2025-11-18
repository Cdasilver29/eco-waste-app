import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

export const login = createAsyncThunk('auth/login', async (credentials) => {
  const response = await authAPI.login(credentials);
  localStorage.setItem('accessToken', response.data.data.accessToken);
  return response.data.data;
});

export const register = createAsyncThunk('auth/register', async (userData) => {
  const response = await authAPI.register(userData);
  localStorage.setItem('accessToken', response.data.data.accessToken);
  return response.data.data;
});

export const fetchUser = createAsyncThunk('auth/fetchUser', async () => {
  const response = await authAPI.getMe();
  return response.data.data.user;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('accessToken'),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('accessToken');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
