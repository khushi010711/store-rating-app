// frontend/src/api/storeService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/stores/';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { headers: { Authorization: 'Bearer ' + user.token } };
  }
  return {};
};

// UPDATED: This function now accepts a filters object
const getAllStores = (filters = {}) => {
  // This creates a query string like "?name=Cafe&address=Street"
  // It safely handles encoding and removes empty filters.
  const params = new URLSearchParams(filters);
  
  return axios.get(API_URL + `?${params.toString()}`, getAuthHeaders());
};

// This function for the detail page is unchanged
const getStoreById = (storeId) => {
  return axios.get(API_URL + storeId, getAuthHeaders());
};

export default {
  getAllStores,
  getStoreById,
};