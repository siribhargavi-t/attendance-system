import axios from 'axios';

// Create a new Axios instance with a custom configuration
const api = axios.create({
  // Set the base URL for all API requests to your backend server
  baseURL: 'http://localhost:5000/api',
});

// Use an interceptor to automatically add the JWT token to every request
api.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    const token = localStorage.getItem('token');
    
    // If the token exists, add it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

export default api;
