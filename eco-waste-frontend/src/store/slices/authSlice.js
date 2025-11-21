import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// Load user and token from local storage
const storedUser = JSON.parse(localStorage.getItem('user'));
const storedToken = localStorage.getItem('token');

// LOGIN THUNK
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    console.log('THUNK STARTED with:', credentials);
    try {
      const response = await authService.login(credentials);
      console.log('THUNK RESPONSE:', response);

      const { token, user } = response.data;

      // persist
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { token, user };
    } catch (err) {
      console.log('THUNK ERROR:', err);
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || 'Login failed'
      );
    }
  }
);

// REGISTER THUNK
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await authService.register(userData);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || 'Registration failed'
      );
    }
  }
);

// LOGOUT
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

// INITIAL STATE
const initialState = {
  user: storedUser || null,
  token: storedToken || null,
  loading: false,
  error: null,
};

// SLICE
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
  },
});

export default authSlice.reducer;




