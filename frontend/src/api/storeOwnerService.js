// frontend/src/api/storeOwnerService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/store-owner/';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { headers: { Authorization: 'Bearer ' + user.token } };
  }
  return {};
};

// Fetch dashboard data for the logged-in store owner
const getDashboard = () => {
  return axios.get(API_URL + 'dashboard', getAuthHeaders());
};

export default {
  getDashboard,
};