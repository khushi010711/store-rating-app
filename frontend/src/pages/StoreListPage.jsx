// frontend/src/pages/StoreListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import storeService from '../api/storeService';
import { FaStar } from 'react-icons/fa';
import '../App.css';

const StaticRating = ({ rating }) => (
  <div className="static-stars">
    {[...Array(5)].map((_, i) => (
      <FaStar key={i} color={i < Math.round(rating) ? '#ffc107' : '#e4e5e9'} size={27} />
    ))}
  </div>
);

const StoreListPage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // NEW: State to manage the search inputs
  const [filters, setFilters] = useState({
    name: '',
    address: '',
  });

  // UPDATED: The data fetching function now uses the filters
  const fetchStores = async (currentFilters) => {
    try {
      setLoading(true);
      // Pass the filters to the API service
      const response = await storeService.getAllStores(currentFilters);
      setStores(response.data);
    } catch (err) {
      setError('Failed to fetch stores.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all stores when the page first loads
  useEffect(() => {
    fetchStores({}); 
  }, []);
  
  // NEW: Handler for typing in the search boxes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // NEW: Handler for clicking the search button
  const handleSearch = (e) => {
    e.preventDefault();
    fetchStores(filters);
  };

  if (loading) return <div className="page-container">Loading...</div>;
  if (error) return <div className="page-container" style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="page-container">
      <h2>All Stores</h2>

      
      <form onSubmit={handleSearch} className="filter-form">
        <input
          type="text"
          name="name"
          placeholder="Search by store name..."
          value={filters.name}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Search by address..."
          value={filters.address}
          onChange={handleFilterChange}
        />
        <button type="submit">Search</button>
      </form>

      <div className="store-grid">
        {stores.length > 0 ? (
          stores.map((store) => (
            <Link to={`/stores/${store.id}`} key={store.id} className="store-card-link">
              <div className="store-card">
                <img src={store.image_url} alt={store.name} className="card-image" />
                <div className="card-content">
                  <h3>{store.name}</h3>
                  <p className="reviewer-info">Overall Rating:</p>
                  <StaticRating rating={store.overall_rating} />
                  <p className="review-snippet">
                    {store.description ? store.description.substring(0, 70) + '...' : 'No description available.'}
                    <span className="read-more"> read more</span>
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          // Updated message for when no results are found
          <p>No stores found matching your search criteria.</p>
        )}
      </div>
    </div>
  );
};

export default StoreListPage;