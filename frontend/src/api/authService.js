// frontend/src/api/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

// This helper function gets the token from localStorage
const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    // It formats the token correctly for the API request
    return { headers: { Authorization: 'Bearer ' + user.token } };
  }
  return {};
};

const signup = (name, email, password, address) => {
  return axios.post(API_URL + 'signup', { name, email, password, address });
};

const login = (email, password) => {
  return axios.post(API_URL + 'login', { email, password });
};

// --- THIS IS THE CORRECTED FUNCTION ---
const changePassword = (oldPassword, newPassword) => {
  // We now pass getAuthHeaders() as the third argument to axios.patch.
  // This adds the "Authorization: Bearer <token>" header to the request.
  return axios.patch(
    API_URL + 'change-password', 
    { oldPassword, newPassword }, 
    getAuthHeaders() // <-- THIS IS THE FIX
  );
};

export default {
  signup,
  login,
  changePassword,
};