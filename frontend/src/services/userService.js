import API from './api';
// Login function
export const login = async (email, password) => {
  try {
    const { data } = await api.post('/users/login', { email, password });
    // Store user info, including the token, in local storage
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (error) {
    // Axios wraps the error response in error.response
    throw error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem('userInfo');
  // You might want to redirect the user or reset application state here
};

// Unused function removed