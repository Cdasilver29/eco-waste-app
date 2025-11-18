import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
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

// Chat APIs
export const chatAPI = {
  createSession: () => api.post('/chat/session'),
  sendMessage: (data) => api.post('/chat/message', data),
  provideFeedback: (data) => api.post('/chat/feedback', data),
  getHistory: (params) => api.get('/chat/history', { params }),
  getStats: () => api.get('/chat/stats'),
};

// Image APIs
export const imageAPI = {
  classify: (formData) => api.post('/image/classify', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  scanAndLog: (formData) => api.post('/image/scan-and-log', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getHistory: (params) => api.get('/image/history', { params }),
  getStats: () => api.get('/image/stats'),
};

// Map APIs
export const mapAPI = {
  getNearbyFacilities: (params) => api.get('/maps/facilities/nearby', { params }),
  getDirections: (data) => api.post('/maps/directions', data),
  geocode: (address) => api.get('/maps/geocode', { params: { address } }),
  reverseGeocode: (lng, lat) => api.get('/maps/reverse-geocode', { params: { lng, lat } }),
};

// Route APIs
export const routeAPI = {
  getActiveRoutes: (params) => api.get('/routes/active', { params }),
  getRouteDetails: (routeId) => api.get(`/routes/${routeId}`),
  subscribeToRoute: (routeId) => api.post(`/routes/${routeId}/subscribe`),
};

// Schedule APIs
export const scheduleAPI = {
  getMySchedule: () => api.get('/schedules/my-schedule'),
  getNextPickups: () => api.get('/schedules/next-pickups'),
  subscribeToSchedule: (scheduleId) => api.post(`/schedules/${scheduleId}/subscribe`),
};

// Municipality APIs
export const municipalityAPI = {
  getAll: () => api.get('/municipalities'),
  getBySlug: (slug) => api.get(`/municipalities/${slug}`),
  getWasteTypes: (slug) => api.get(`/municipalities/${slug}/waste-types`),
};

export default api;
