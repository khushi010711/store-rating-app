// frontend/src/api/adminService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin/';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { headers: { Authorization: 'Bearer ' + user.token } };
  }
  return {};
};

// Fetch dashboard statistics
const getDashboardStats = () => {
  return axios.get(API_URL + 'dashboard/stats', getAuthHeaders());
};

// Fetch all users with optional filters
const getAllUsers = (filters = {}) => {
  // Convert filters object to query string, e.g., { role: 'Normal User' } -> '?role=Normal%20User'
  const params = new URLSearchParams(filters).toString();
  return axios.get(API_URL + `users?${params}`, getAuthHeaders());
};

// Fetch all stores
const getAllStores = () => {
  return axios.get(API_URL + 'stores', getAuthHeaders());
};
const createUser = (userData) => {
  return axios.post(API_URL + 'users', userData, getAuthHeaders());
};

// ADD THIS FUNCTION
const createStore = (storeData) => {
  return axios.post(API_URL + 'stores', storeData, getAuthHeaders());
};

export default {
  getDashboardStats,
  getAllUsers,
  getAllStores,
  createUser,   // <-- EXPORT
  createStore,  // <-- EXPORT
};
