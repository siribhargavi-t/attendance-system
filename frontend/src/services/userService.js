import api from '../api/axios';

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

// FIX: Added and exported the missing function
export const getStudentsByBranchAndYear = async (branch, year) => {
  // This is a placeholder. You'll need to implement the actual API call.
  console.log(`Fetching students for branch: ${branch}, year: ${year}`);
  // Returning dummy data to prevent runtime errors in the component.
  return [
    { id: '1', name: 'Student A', status: 'Present' },
    { id: '2', name: 'Student B', status: 'Present' },
  ];
};