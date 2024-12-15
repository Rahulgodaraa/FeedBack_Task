import React, { createContext, useCallback, useReducer } from 'react';
import { feedbackService } from '../services/feedbackService';

// Initial state
const initialState = {
  feedbacks: [],
  loading: false,
  error: null
};

// Create context
export const FeedbackContext = createContext(initialState);

// Reducer
const feedbackReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
        return {
          ...state,
          loading: true,
          error: null
        };
      case 'GET_FEEDBACKS':
        return {
          ...state,
          feedbacks: action.payload,
          loading: false,
          error: null
        };
      case 'ADD_FEEDBACK':
        return {
          ...state,
          feedbacks: [...state.feedbacks, action.payload],
          loading: false,
          error: null
        };
    case 'UPDATE_FEEDBACK':
      return {
        ...state,
        feedbacks: state.feedbacks.map(feedback =>
          feedback._id === action.payload._id ? action.payload : feedback
        ),
        loading: false,
        error: null
      };
    case 'DELETE_FEEDBACK':
      return {
        ...state,
        feedbacks: state.feedbacks.filter(
          feedback => feedback._id !== action.payload
        ),
        loading: false,
        error: null
      };
    case 'FEEDBACK_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

// Provider component
export const FeedbackProvider = ({ children }) => {
  const [state, dispatch] = useReducer(feedbackReducer, initialState);

  const getAllFeedbacks = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const response = await feedbackService.getAllFeedbacks();
      dispatch({
        type: 'GET_FEEDBACKS',
        payload: response
      });
    } catch (error) {
      dispatch({
        type: 'FEEDBACK_ERROR',
        payload: error.message
      });
    }
  }, []);

  const getUserFeedbacks = useCallback(async (userId) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const response = await feedbackService.getUserFeedback(userId);
      dispatch({
        type: 'GET_FEEDBACKS',
        payload: response
      });
    } catch (error) {
      dispatch({
        type: 'FEEDBACK_ERROR',
        payload: error.message
      });
    }
  }, []);
  // Add feedback
  const addFeedback = async (feedbackData) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const response = await feedbackService.addFeedback(feedbackData);
      console.log('Add feedback response:', response); // Debug log

      if (response.success) {
        dispatch({
          type: 'ADD_FEEDBACK',
          payload: response.feedback  // Make sure this matches your API response
        });

        // Refresh the feedbacks list after adding
        const user = JSON.parse(localStorage.getItem('user'));
        if (user.role === 'admin') {
          await getAllFeedbacks();
        } else {
          await getUserFeedbacks(user._id);
        }

        return response.feedback;
      }
    } catch (error) {
      console.error('Error adding feedback:', error);
      dispatch({
        type: 'FEEDBACK_ERROR',
        payload: error.message
      });
      throw error;
    }
  };

  // Update feedback
  const updateFeedback = async (feedbackData) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const response = await feedbackService.updateFeedback(
        feedbackData._id,
        feedbackData
      );
      dispatch({
        type: 'UPDATE_FEEDBACK',
        payload: response
      });
      return response;
    } catch (error) {
      dispatch({
        type: 'FEEDBACK_ERROR',
        payload: error.message
      });
      throw error;
    }
  };

  // Delete feedback
  const deleteFeedback = async (feedbackId) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      await feedbackService.deleteFeedback(feedbackId);
      dispatch({
        type: 'DELETE_FEEDBACK',
        payload: feedbackId
      });
    } catch (error) {
      dispatch({
        type: 'FEEDBACK_ERROR',
        payload: error.message
      });
      throw error;
    }
  };

 
  return (
    <FeedbackContext.Provider
      value={{
        feedbacks: state.feedbacks,
        loading: state.loading,
        error: state.error,
        getAllFeedbacks,
        getUserFeedbacks,
        addFeedback,
        updateFeedback,
        deleteFeedback
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};