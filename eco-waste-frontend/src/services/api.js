import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ===== Axios Instance ===== //
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===== Request Interceptor ===== //
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ===== Response Interceptor ===== //
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== Mock Auth Service (Development) ===== //
const authService = {
  login: async (credentials) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const userData = {
      id: '1',
      email: credentials.email,
      role: credentials.role || 'citizen',
      firstName: credentials.role === 'citizen' ? 'John' : 'Manufacturer',
      lastName: credentials.role === 'citizen' ? 'Doe' : 'Admin',
      phone: '+254712345678',
      city: 'Nairobi',
      tokens: credentials.role === 'citizen' ? 2450 : 0,
      level: credentials.role === 'citizen' ? 12 : 1,
      rating: 4.8,
      companyName: credentials.role === 'manufacturer' ? 'GreenTech Manufacturing' : null,
      joinDate: new Date().toISOString(),
      avatar: null,
    };
    return { data: { token: `mock-jwt-token-${Date.now()}`, user: userData } };
  },

  register: async (userData) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const newUser = {
      id: '2',
      email: userData.email,
      role: userData.role || 'citizen',
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      city: userData.city,
      tokens: userData.role === 'citizen' ? 50 : 0,
      level: 1,
      rating: 5.0,
      companyName: userData.companyName,
      joinDate: new Date().toISOString(),
      avatar: null,
    };
    return { data: { token: `mock-jwt-token-${Date.now()}`, user: newUser } };
  },

  getMe: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const userData = localStorage.getItem('user');
    if (!userData) throw new Error('User not found');
    return { data: JSON.parse(userData) };
  },
};

// ===== Use Mock Auth? ===== //
const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true' || !import.meta.env.VITE_API_URL;

// ===== Auth API ===== //
export const authAPI = {
  register: (data) =>
    USE_MOCK_AUTH ? authService.register(data) : api.post('/auth/register', data, { withCredentials: true }),

  login: (data) =>
    USE_MOCK_AUTH ? authService.login(data) : api.post('/auth/login', data, { withCredentials: true }),

  getMe: () => (USE_MOCK_AUTH ? authService.getMe() : api.get('/auth/me', { withCredentials: true })),

  logout: (refreshToken) =>
    USE_MOCK_AUTH ? Promise.resolve({ data: { success: true } }) : api.post('/auth/logout', { refreshToken }, { withCredentials: true }),
};

// ===== Waste API ===== //
export const wasteAPI = {
  logWaste: (data) => api.post('/waste/log', data),
  getHistory: (params) => api.get('/waste/history', { params }),
  getStats: () => api.get('/waste/stats'),
  getLeaderboard: (params) => api.get('/waste/leaderboard', { params }),
  getMyRank: () => api.get('/waste/my-rank'),
};

// ===== Chat API ===== //
export const chatAPI = {
  createSession: () => api.post('/chat/session'),
  sendMessage: (data) => api.post('/chat/message', data),
  provideFeedback: (data) => api.post('/chat/feedback', data),
  getHistory: (params) => api.get('/chat/history', { params }),
  getStats: () => api.get('/chat/stats'),
};

// ===== Image API ===== //
export const imageAPI = {
  classify: (formData) => api.post('/image/classify', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  scanAndLog: (formData) => api.post('/image/scan-and-log', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getHistory: (params) => api.get('/image/history', { params }),
  getStats: () => api.get('/image/stats'),
};

// ===== Map API ===== //
export const mapAPI = {
  getNearbyFacilities: (params) => api.get('/maps/facilities/nearby', { params }),
  getDirections: (data) => api.post('/maps/directions', data),
  geocode: (address) => api.get('/maps/geocode', { params: { address } }),
  reverseGeocode: (lng, lat) => api.get('/maps/reverse-geocode', { params: { lng, lat } }),
};

// ===== Route API ===== //
export const routeAPI = {
  getActiveRoutes: (params) => api.get('/routes/active', { params }),
  getRouteDetails: (routeId) => api.get(`/routes/${routeId}`),
  subscribeToRoute: (routeId) => api.post(`/routes/${routeId}/subscribe`),
};

// ===== Schedule API ===== //
export const scheduleAPI = {
  getMySchedule: () => api.get('/schedules/my-schedule'),
  getNextPickups: () => api.get('/schedules/next-pickups'),
  subscribeToSchedule: (scheduleId) => api.post(`/schedules/${scheduleId}/subscribe`),
};

// ===== Municipality API ===== //
export const municipalityAPI = {
  getAll: () => api.get('/municipalities'),
  getBySlug: (slug) => api.get(`/municipalities/${slug}`),
  getWasteTypes: (slug) => api.get(`/municipalities/${slug}/waste-types`),
};

// ===== Manufacturer API ===== //
export const manufacturerAPI = {
  getWasteFeed: (params) => api.get('/manufacturer/waste-feed', { params }),
  placeOrder: (data) => api.post('/manufacturer/orders', data),
  getMyOrders: (params) => api.get('/manufacturer/orders', { params }),
  getSupplierStats: () => api.get('/manufacturer/supplier-stats'),
  getInventory: () => api.get('/manufacturer/inventory'),
};

// ===== Analytics API ===== //
export const analyticsAPI = {
  getCitizenStats: () => api.get('/analytics/citizen'),
  getManufacturerStats: () => api.get('/analytics/manufacturer'),
  getEnvironmentalImpact: () => api.get('/analytics/environmental-impact'),
};

export default api;

