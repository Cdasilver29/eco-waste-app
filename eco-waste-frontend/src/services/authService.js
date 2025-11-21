// Mock authentication service that supports citizen/manufacturer roles

export const authService = {
  // Mock login function that handles roles
  
  login: async (credentials) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response based on role
    const userData = {
      id: '1',
      email: credentials.email,
      role: credentials.role,
      firstName: credentials.role === 'citizen' ? 'John' : 'Manufacturer',
      lastName: credentials.role === 'citizen' ? 'Doe' : 'Admin',
      phone: '+254712345678',
      city: 'Nairobi',
      tokens: credentials.role === 'citizen' ? 2450 : 0,
      level: credentials.role === 'citizen' ? 12 : 1,
      rating: 4.8,
      companyName: credentials.role === 'manufacturer' ? 'GreenTech Manufacturing' : null,
      joinDate: new Date().toISOString()
    };

    return {
      data: {
        token: 'mock-jwt-token-' + Date.now(),
        user: userData
      }
    };
  },

  // Mock registration function that handles roles
  register: async (userData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser = {
      id: '2',
      email: userData.email,
      role: userData.role,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      city: userData.city,
      tokens: userData.role === 'citizen' ? 50 : 0,
      level: 1,
      rating: 5.0,
      companyName: userData.companyName,
      joinDate: new Date().toISOString()
    };

    return {
      data: {
        token: 'mock-jwt-token-' + Date.now(),
        user: newUser
      }
    };
  },

  // Mock get user profile
  getMe: async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const userData = localStorage.getItem('user');
    if (!userData) throw new Error('User not found');

    return {
      data: JSON.parse(userData)
    };
  }
};

// IMPORTANT FIX
// Ensures stable imports everywhere
export default authService;
