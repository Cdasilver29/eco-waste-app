import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import wasteReducer from './slices/wasteSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    waste: wasteReducer,
  },
});

export default store;
