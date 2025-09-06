// frontend/src/api/ratingService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ratings/stores/';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { headers: { Authorization: 'Bearer ' + user.token } };
  }
  return {};
};

// Submits or updates a rating for a specific store
const submitRating = (storeId, rating_value) => {
  return axios.post(API_URL + storeId, { rating_value }, getAuthHeaders());
};

export default {
  submitRating,
};