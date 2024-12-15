import React, { createContext, useReducer, useCallback, useEffect, useContext } from 'react';
import { authService } from '../services/authService';
import axios  from 'axios';

// Initial state
const initialState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null
};

// Create context
export const AuthContext = createContext(initialState);

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null
      };
    case 'LOGIN_FAIL':
    case 'AUTH_ERROR':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setLoading = useCallback(() => {
    dispatch({ type: 'SET_LOADING' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Login action
  const login = useCallback(async (userData) => {
    setLoading();
    try {
      console.log('Attempting login with:', userData);
      const response = await authService.login(userData);
      console.log('Login response:', response);

      if (response.success) {
        // Store token and user data in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.userData));
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: response.userData
        });

        // Set default headers for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;

        return response;
      }
    } catch (error) {
      console.error('Login error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      dispatch({
        type: 'LOGIN_FAIL',
        payload: error.message || 'Login failed'
      });
      throw error;
    }
  }, [setLoading]);

  // Register action
  const register = useCallback(async (userData) => {
    setLoading();
    try {
      console.log('Attempting registration with:', userData);
      const response = await authService.register(userData);
      console.log('Registration response:', response);

      if (response.success) {
        return response;
      }
      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      dispatch({
        type: 'AUTH_ERROR',
        payload: error.message || 'Registration failed'
      });
      throw error;
    }
  }, [setLoading]);

  // Logout action
  const logout = useCallback(() => {
    authService.logout();
    // Remove Authorization header
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
  }, []);

  // Check token and load user
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: user
          });
        }
      } catch (error) {
        dispatch({
          type: 'AUTH_ERROR',
          payload: 'Session expired'
        });
      }
    }
  }, []);

  // Setup axios interceptors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider 
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        login,
        register,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;