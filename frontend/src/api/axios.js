import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend base URL
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    // Get user info from storage, which should contain the token
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
