import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/feedback';

export const feedbackService = {
  // Get all feedbacks (admin only)
  getAllFeedbacks: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token is missing');

      const response = await axios.get(`${API_URL}/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data.feedbacks;
    } catch (error) {
      console.error('Error fetching all feedbacks:', error);
      throw error;
    }
  },

  // Get user feedback
  getUserFeedback: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token is missing');
      
      console.log('Fetching feedback for userId:', userId);
      
      const response = await axios.get(`${API_URL}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data.feedbacks;
    } catch (error) {
      console.error('Error fetching user feedback:', error);
      throw error;
    }
  },

  // Add feedback
  addFeedback: async (feedbackData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token is missing');

      const response = await axios.post(`${API_URL}/add`, feedbackData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error adding feedback:', error);
      throw error;
    }
  },

  // Update feedback
  updateFeedback: async (feedbackId, updateData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token is missing');

      const response = await axios.put(
        `${API_URL}/update`,
        { feedbackId, ...updateData },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error updating feedback:', error);
      throw error;
    }
  },

  // Delete feedback
  deleteFeedback: async (feedbackId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token is missing');

      const response = await axios.delete(`${API_URL}/${feedbackId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error deleting feedback:', error);
      throw error;
    }
  }
};