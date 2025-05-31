import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Set base URL from environment variable or default to localhost
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5247';
axios.defaults.baseURL = baseURL;

// Configure axios defaults
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true; // Enable sending cookies

// Add request interceptor to add auth token
axios.interceptors.request.use(
  (config) => {
    // Keep the /api prefix in the URL
    console.log('Making request to:', config.url);
    console.log('Full URL:', `${baseURL}${config.url}`);
    
    const token = localStorage.getItem('token');
    if (token && token !== 'dummy-token') {  // Only use real tokens
      // Check if token is expired
      try {
        const decoded = jwtDecode(token);
        if (Date.now() >= decoded.exp * 1000) {
          console.log('Token expired, but continuing for debugging');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
      
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added auth header:', config.headers.Authorization);
    } else {
      console.log('No valid token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
axios.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      headers: error.config?.headers
    });

    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          console.log('Unauthorized, but continuing for debugging');
          break;
        case 403:
          console.log('Forbidden, but continuing for debugging');
          break;
        case 500:
          console.error('Server error:', error.response.data);
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    } else if (error.message === 'Network Error') {
      console.error('Network error - unable to connect to server');
      // Check if it's a CORS error
      if (error.message.includes('CORS')) {
        console.error('CORS error detected. Please check server configuration.');
      }
    }
    return Promise.reject(error);
  }
);

export default axios; 