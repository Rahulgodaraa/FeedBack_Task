import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL:  'http://localhost:8000/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    // Handle specific error scenarios
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          window.location = '/login';
          break;
        case 403:
          // Forbidden - show error message
          console.error('You do not have permission');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('An error occurred');
      }
    }
    return Promise.reject(error);
  }
);

export default api;