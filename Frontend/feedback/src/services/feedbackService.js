import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/feedback';

export const feedbackService = {
  // Get all feedbacks for admin (requires authentication)
  getAllFeedbacks: async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token is missing');

      // Make the GET request to fetch all feedbacks
      const response = await axios.get(`${API_URL}/all`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in header
        },
      });

      // Return feedbacks data from response
      return response.data.feedbacks;
    } catch (error) {
      console.error('Error fetching all feedbacks:', error);
      throw error;
    }
  } , 

  // Adds feedback for a user (requires authentication)
  addFeedback: async (feedbackData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token is missing');
      
      const response = await axios.post(`${API_URL}/add`, feedbackData, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in header
        },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Gets feedback for a user by userId (requires authentication)
  getUserFeedback: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token is missing');
      
      const response = await axios.get(`${API_URL}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in header
        },
      });
      return response.data.feedbacks;
    } catch (error) {
      handleError(error);
    }
  },

  // Updates feedback by feedbackId (requires authentication)
  updateFeedback: async (feedbackId, updateData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token is missing');
      
      const response = await axios.put(`${API_URL}/update`, { feedbackId, ...updateData }, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in header
        },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Deletes feedback by feedbackId (requires authentication)
  deleteFeedback: async (feedbackId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token is missing');
      
      const response = await axios.delete(`${API_URL}/${feedbackId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in header
        },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// Helper function to handle errors and token-related issues
const handleError = (error) => {
  if (error.response) {
    if (error.response.status === 401 || error.response.status === 403) {
      // Token might be expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optionally, redirect to login page or show a message to the user
      console.error('Session expired, please log in again');
    }
    throw error.response.data;
  } else {
    throw { message: 'An error occurred, please try again later' };
  }
};
