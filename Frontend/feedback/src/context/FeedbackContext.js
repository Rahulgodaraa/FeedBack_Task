import React, { createContext, useReducer } from 'react';
import { feedbackService } from '../services/feedbackService';

// Initial state
const initialState = {
  feedbacks: [],
  loading: true,
  error: null
};

// Create context
export const FeedbackContext = createContext(initialState);

// Reducer
const feedbackReducer = (state, action) => {
  switch (action.type) {
    case 'GET_FEEDBACKS':
      return {
        ...state,
        feedbacks: action.payload,
        loading: false
      };
    case 'ADD_FEEDBACK':
      return {
        ...state,
        feedbacks: [...state.feedbacks, action.payload]
      };
    case 'UPDATE_FEEDBACK':
      return {
        ...state,
        feedbacks: state.feedbacks.map(feedback => 
          feedback._id === action.payload._id ? action.payload : feedback
        )
      };
    case 'DELETE_FEEDBACK':
      return {
        ...state,
        feedbacks: state.feedbacks.filter(
          feedback => feedback._id !== action.payload
        )
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

  // Get all feedbacks (add this route in your backend if it's not present)
  const getAllFeedbacks = async () => {
    try {
      const feedbacks = await feedbackService.getAllFeedbacks();
      dispatch({
        type: 'GET_FEEDBACKS',
        payload: feedbacks
      });
    } catch (error) {
      dispatch({
        type: 'FEEDBACK_ERROR',
        payload: error.message
      });
    }
  };


 


  // Get user's feedbacks
   const getUserFeedbacks = async (userId) => {
    try {
      const feedbacks = await feedbackService.getUserFeedback(userId);
      dispatch({
        type: 'GET_FEEDBACKS',
        payload: feedbacks
      });
    } catch (error) {
      dispatch({
        type: 'FEEDBACK_ERROR',
        payload: error.message
      });
    }
  };

  // Add feedback
  const addFeedback = async (feedbackData) => {
    try {
      const newFeedback = await feedbackService.addFeedback(feedbackData);
      dispatch({
        type: 'ADD_FEEDBACK',
        payload: newFeedback
      });
      return newFeedback;
    } catch (error) {
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
      const updatedFeedback = await feedbackService.updateFeedback(
        feedbackData._id, 
        feedbackData
      );
      dispatch({
        type: 'UPDATE_FEEDBACK',
        payload: updatedFeedback
      });
      return updatedFeedback;
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
