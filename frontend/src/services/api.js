import axios from 'axios';

// Base URL for the Django backend
// Use environment variable if available, otherwise fallback to localhost
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:9001/api' ;


// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('accessToken', access);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      } else {
        // No refresh token, redirect to login
        window.location.href = '/login';
      }
    }
    
    // Ensure error has a consistent format
    if (error.response?.data && typeof error.response.data === 'object') {
      // Convert complex error objects to strings
      const data = error.response.data;
      
      if (Array.isArray(data.detail)) {
        // Handle validation errors with array format
        const firstError = data.detail[0];
        if (typeof firstError === 'object' && firstError.msg) {
          error.message = firstError.msg;
        } else if (typeof firstError === 'string') {
          error.message = firstError;
        }
      } else if (typeof data.detail === 'string') {
        error.message = data.detail;
      } else if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
        error.message = data.non_field_errors[0];
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth/login/', { username, password });
    return response.data;
  },
  
  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await api.post('/auth/logout/', { refresh: refreshToken });
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me/');
    return response.data;
  },
};

// Tasks API calls
export const tasksAPI = {
  getTasks: async (column = null) => {
    const params = column ? { column } : {};
    const response = await api.get('/tasks/', { params });
    return response.data;
  },
  
  createTask: async (taskData) => {
    const response = await api.post('/tasks/', taskData);
    return response.data;
  },
  
  updateTask: async (taskId, taskData) => {
    const response = await api.put(`/tasks/${taskId}/`, taskData);
    return response.data;
  },
  
  deleteTask: async (taskId) => {
    await api.delete(`/tasks/${taskId}/`);
  },
  
  updateTaskPositions: async (tasks) => {
    const response = await api.post('/tasks/update_positions/', { tasks });
    return response.data;
  },
};

export default api;