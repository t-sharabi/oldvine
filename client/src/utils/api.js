import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    console.log('🔧 API Request Interceptor - Token:', token ? 'Present' : 'Missing');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔧 API Request - Authorization header set');
    }
    console.log('🔧 API Request to:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error('🔧 API Request Error:', error);
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => {
    console.log('🔧 API Response Success:', response.config.url);
    return response;
  },
  (error) => {
    console.error('🔧 API Response Error:', error.response?.status, error.config?.url);
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('🔧 Auth error - redirecting to login');
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;

