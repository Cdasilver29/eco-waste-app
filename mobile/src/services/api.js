import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5000/api'; // Change for production
// For Android emulator use: http://10.0.2.2:5000/api
// For iOS simulator use: http://localhost:5000/api
// For physical device use: http://YOUR_IP:5000/api

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('accessToken');
      // Navigate to login screen (handled in navigation)
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
};

// Waste APIs
export const wasteAPI = {
  logWaste: (data) => api.post('/waste/log', data),
  getHistory: (params) => api.get('/waste/history', { params }),
  getStats: () => api.get('/waste/stats'),
  getLeaderboard: (params) => api.get('/waste/leaderboard', { params }),
  getMyRank: () => api.get('/waste/my-rank'),
};

// Image APIs
export const imageAPI = {
  classify: (formData) => api.post('/image/classify', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  scanAndLog: (formData) => api.post('/image/scan-and-log', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Chat APIs
export const chatAPI = {
  createSession: () => api.post('/chat/session'),
  sendMessage: (data) => api.post('/chat/message', data),
};

// Map APIs
export const mapAPI = {
  getNearbyFacilities: (params) => api.get('/maps/facilities/nearby', { params }),
};

// Schedule APIs
export const scheduleAPI = {
  getMySchedule: () => api.get('/schedules/my-schedule'),
  getNextPickups: () => api.get('/schedules/next-pickups'),
};

export default api;
