import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Backend base URL
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token from storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Inject token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
