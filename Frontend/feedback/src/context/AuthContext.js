import React, { createContext, useReducer, useCallback } from 'react';

// Mock auth service to replace external dependency
const mockAuthService = {
  login: async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate basic validation
        if (userData.email && userData.password) {
          resolve({
            success: true,
            userData: {
              _id: '123',
              email: userData.email,
              name: 'John Doe',
              role: 'user'
            },
            token: 'mock-jwt-token'
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  },

  register: async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userData.email && userData.password && userData.name) {
          resolve({
            success: true,
            message: 'Registration successful'
          });
        } else {
          reject(new Error('Invalid registration data'));
        }
      }, 500);
    });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
};

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
      const response = await mockAuthService.login(userData);
      
      // Store token and user data in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.userData));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response.userData
      });

      return response;
    } catch (error) {
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
      const response = await mockAuthService.register(userData);
      return response;
    } catch (error) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: error.message || 'Registration failed'
      });
      throw error;
    }
  }, [setLoading]);

  // Logout action
  const logout = useCallback(() => {
    mockAuthService.logout();
    dispatch({ type: 'LOGOUT' });
  }, []);

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

export default AuthProvider;