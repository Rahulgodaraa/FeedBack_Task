import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/auth';

export const authService = {
  login: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/Login`, userData);
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.userData)); // Store user data
        localStorage.setItem('token', response.data.token); // Store token
        return response.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      throw error.response ? error.response.data : { message: error.message };
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/Register`, userData);
      if (response.data.success) {
        return response.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      throw error.response ? error.response.data : { message: error.message };
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Also remove token on logout
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  getToken: () => {
    return localStorage.getItem('token'); // Utility to get token
  }
};
