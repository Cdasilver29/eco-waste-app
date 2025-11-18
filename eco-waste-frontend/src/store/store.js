import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import wasteReducer from './slices/wasteSlice';
import chatReducer from './slices/chatSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    waste: wasteReducer,
    chat: chatReducer,
    ui: uiReducer,
  },
});

export default store;
