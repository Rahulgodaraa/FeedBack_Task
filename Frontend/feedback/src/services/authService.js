import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/auth';

// Helper to check if token is valid JWT
const isValidToken = (token) => {
  try {
    return token.split('.').length === 3;
  } catch (error) {
    return false;
  }
};

export const authService = {
  // Login service
  login: async (userData) => {
    try {
      console.log('Login attempt with:', userData);   
      const response = await axios.post(`${API_URL}/Login`, userData);
      console.log('Raw login response:', response.data);  
  
      if (response.data.success) {
         
        const { token, userData } = response.data;
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('Stored token:', localStorage.getItem('token')); // Debug log
        console.log('Stored user:', localStorage.getItem('user')); // Debug log
  
        return response.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      console.error('Login service error:', error);
      throw error.response ? error.response.data : { message: error.message };
    }
  },

  // Register service
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/Register`, userData);
      console.log('Register response:', response.data);  // Debug log

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || 'Registration successful',
          userData: response.data.userData
        };
      }
      
      throw new Error(response.data.message || 'Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data || { message: error.message };
    }
  },

  // Logout service
  logout: () => {
    try {
      // Clear all auth data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      
      return {
        success: true,
        message: 'Logout successful'
      };
    } catch (error) {
      console.error('Logout error:', error);
      throw { message: 'Logout failed' };
    }
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!user || !token) {
        return null;
      }

      // Validate token
      if (!isValidToken(token)) {
        authService.logout();
        return null;
      }

      return JSON.parse(user);
    } catch (error) {
      console.error('Get current user error:', error);
      authService.logout();
      return null;
    }
  },

  // Get token
  getToken: () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token || !isValidToken(token)) {
        return null;
      }

      return token;
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = authService.getToken();
    const user = authService.getCurrentUser();
    return !!(token && user);
  },

  // Check if user is admin
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  },

  // Initialize axios interceptors
  initializeAxios: () => {
    // Request interceptor
    axios.interceptors.request.use(
      (config) => {
        const token = authService.getToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          authService.logout();
        }
        return Promise.reject(error);
      }
    );
  }
};

// Initialize axios interceptors when this module is imported
authService.initializeAxios();

export default authService;