// src/services/wasteService.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const wasteService = {
  // Log new waste
  logWaste: async (wasteData) => {
    return await apiCall('/waste', {
      method: 'POST',
      body: JSON.stringify(wasteData),
    });
  },

  // Upload waste image
  uploadWasteImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/waste/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    return await response.json();
  },

  // Get user's waste logs
  getUserWasteLogs: async (userId, filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return await apiCall(`/waste/user/${userId}?${queryParams}`);
  },

  // Get all available waste (for manufacturers)
  getAvailableWaste: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return await apiCall(`/waste/available?${queryParams}`);
  },

  // Get waste by ID
  getWasteById: async (wasteId) => {
    return await apiCall(`/waste/${wasteId}`);
  },

  // Update waste status
  updateWasteStatus: async (wasteId, status) => {
    return await apiCall(`/waste/${wasteId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Delete waste log
  deleteWaste: async (wasteId) => {
    return await apiCall(`/waste/${wasteId}`, {
      method: 'DELETE',
    });
  },

  // Create waste order (manufacturer)
  createOrder: async (wasteId, orderData) => {
    return await apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify({ wasteId, ...orderData }),
    });
  },

  // Get user's orders
  getUserOrders: async (userId) => {
    return await apiCall(`/orders/user/${userId}`);
  },

  // Get manufacturer's orders
  getManufacturerOrders: async () => {
    return await apiCall('/orders/manufacturer');
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    return await apiCall(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Get waste collection schedule
  getCollectionSchedule: async (location) => {
    return await apiCall(`/waste/schedule?location=${encodeURIComponent(location)}`);
  },

  // Track waste collection (live GPS tracking)
  trackCollection: async (collectionId) => {
    return await apiCall(`/waste/track/${collectionId}`);
  },

  // Get waste analytics
  getWasteAnalytics: async (userId, timeRange = '30d') => {
    return await apiCall(`/waste/analytics/${userId}?range=${timeRange}`);
  },

  // Verify waste quality
  verifyWasteQuality: async (wasteId, verification) => {
    return await apiCall(`/waste/${wasteId}/verify`, {
      method: 'POST',
      body: JSON.stringify(verification),
    });
  },

  // Get waste categories
  getWasteCategories: async () => {
    return await apiCall('/waste/categories');
  },

  // Calculate waste value/tokens
  calculateWasteValue: async (wasteData) => {
    return await apiCall('/waste/calculate-value', {
      method: 'POST',
      body: JSON.stringify(wasteData),
    });
  },

  // Find nearby recycling facilities
  findNearbyFacilities: async (location, radius = 5000) => {
    return await apiCall(`/facilities/nearby?lat=${location.lat}&lng=${location.lng}&radius=${radius}`);
  },

  // Report waste issue
  reportIssue: async (wasteId, issueData) => {
    return await apiCall(`/waste/${wasteId}/report`, {
      method: 'POST',
      body: JSON.stringify(issueData),
    });
  },

  // Get waste statistics
  getStatistics: async (userId) => {
    return await apiCall(`/waste/stats/${userId}`);
  },

  // Search waste by filters
  searchWaste: async (searchParams) => {
    const queryParams = new URLSearchParams(searchParams).toString();
    return await apiCall(`/waste/search?${queryParams}`);
  },
};

// WebSocket service for real-time tracking
export class WasteTrackingService {
  constructor() {
    this.ws = null;
    this.callbacks = {};
  }

  connect(collectionId) {
    const token = localStorage.getItem('token');
    const wsUrl = `${process.env.REACT_APP_WS_URL || 'ws://localhost:5000'}/track/${collectionId}?token=${token}`;
    
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('Tracking WebSocket connected');
      if (this.callbacks.onConnect) {
        this.callbacks.onConnect();
      }
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'location_update':
          if (this.callbacks.onLocationUpdate) {
            this.callbacks.onLocationUpdate(data.payload);
          }
          break;
        case 'status_update':
          if (this.callbacks.onStatusUpdate) {
            this.callbacks.onStatusUpdate(data.payload);
          }
          break;
        case 'eta_update':
          if (this.callbacks.onETAUpdate) {
            this.callbacks.onETAUpdate(data.payload);
          }
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (this.callbacks.onError) {
        this.callbacks.onError(error);
      }
    };

    this.ws.onclose = () => {
      console.log('Tracking WebSocket disconnected');
      if (this.callbacks.onDisconnect) {
        this.callbacks.onDisconnect();
      }
    };
  }

  onLocationUpdate(callback) {
    this.callbacks.onLocationUpdate = callback;
  }

  onStatusUpdate(callback) {
    this.callbacks.onStatusUpdate = callback;
  }

  onETAUpdate(callback) {
    this.callbacks.onETAUpdate = callback;
  }

  onConnect(callback) {
    this.callbacks.onConnect = callback;
  }

  onDisconnect(callback) {
    this.callbacks.onDisconnect = callback;
  }

  onError(callback) {
    this.callbacks.onError = callback;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.callbacks = {};
    }
  }

  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export default wasteService;