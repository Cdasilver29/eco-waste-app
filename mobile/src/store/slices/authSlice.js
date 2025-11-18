import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../../services/api';

export const login = createAsyncThunk('auth/login', async (credentials) => {
  const response = await authAPI.login(credentials);
  await AsyncStorage.setItem('accessToken', response.data.data.accessToken);
  return response.data.data;
});

export const register = createAsyncThunk('auth/register', async (userData) => {
  const response = await authAPI.register(userData);
  await AsyncStorage.setItem('accessToken', response.data.data.accessToken);
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
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      AsyncStorage.removeItem('accessToken');
    },
    setToken: (state, action) => {
      state.token = action.payload;
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

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;
