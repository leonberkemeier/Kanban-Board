import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

// Initial state
const initialState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

// Actions
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const authReducer = (state, action) => {
  console.log('AuthReducer: Action received:', action.type, action.payload);
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      const newState = {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
      console.log('AuthReducer: LOGIN_SUCCESS - New state:', newState);
      return newState;
    
    case AUTH_ACTIONS.LOGIN_ERROR:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        try {
          const userData = await authAPI.getCurrentUser();
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: userData,
          });
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = useCallback(async (username, password) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

    try {
      console.log('AuthContext: Calling API login...');
      const response = await authAPI.login(username, password);
      console.log('AuthContext: API login response:', response);
      
      // Store tokens
      localStorage.setItem('accessToken', response.tokens.access);
      localStorage.setItem('refreshToken', response.tokens.refresh);
      console.log('AuthContext: Tokens stored');
      
      console.log('AuthContext: Dispatching LOGIN_SUCCESS');
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user: response.user },
      });
      
      console.log('AuthContext: Login success, returning success=true');
      return { success: true };
    } catch (error) {
      console.log('Login error:', error);
      console.log('Error response:', error.response);
      console.log('Error response data:', error.response?.data);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response?.data) {
        const data = error.response.data;
        
        // Handle different error formats
        if (typeof data === 'string') {
          errorMessage = data;
        } else if (Array.isArray(data.detail)) {
          // Handle validation errors with array format
          const firstError = data.detail[0];
          if (typeof firstError === 'object' && firstError.msg) {
            errorMessage = firstError.msg;
          } else if (typeof firstError === 'string') {
            errorMessage = firstError;
          }
        } else if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        } else if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
          errorMessage = data.non_field_errors[0];
        } else if (data.username && Array.isArray(data.username)) {
          errorMessage = data.username[0];
        } else if (data.password && Array.isArray(data.password)) {
          errorMessage = data.password[0];
        } else if (typeof data === 'object') {
          // Try to extract the first error message from any field
          const firstError = Object.values(data).find(value => {
            if (Array.isArray(value)) {
              return typeof value[0] === 'string';
            }
            return typeof value === 'string';
          });
          if (firstError) {
            errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Ensure errorMessage is always a string
      if (typeof errorMessage !== 'string') {
        console.warn('Error message is not a string:', errorMessage);
        errorMessage = 'Login failed. Please try again.';
      }
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  const value = {
    ...state,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;