// frontend/src/pages/StoreDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import storeService from '../api/storeService';
import ratingService from '../api/ratingService';
import Rating from '../components/Rating';
import RatingBadge from '../components/RatingBadge'; 

const StoreDetailPage = () => {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStoreDetails = async () => {
    try {
      const response = await storeService.getStoreById(storeId);
      setStore(response.data);
    } catch (err) {
      setError('Failed to fetch store details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreDetails();
  }, [storeId]);

  const handleRatingSubmit = async (id, ratingValue) => {
    try {
      await ratingService.submitRating(id, ratingValue);
      fetchStoreDetails(); // Re-fetch details to show the updated rating
    } catch (err) {
      alert('Error submitting rating.');
    }
  };

  if (loading) return <div className="page-container">Loading...</div>;
  if (error) return <div className="page-container" style={{ color: 'red' }}>{error}</div>;
  if (!store) return <div className="page-container">Store not found.</div>;

  return (
    <div className="page-container">
      <img
        src={store.image_url.includes('picsum.photos') ? store.image_url.replace('/400/200', '/1200/400') : store.image_url}
        alt={store.name}
        className="store-detail-image"
      />
      
      <h1>{store.name}</h1> 
      
      <div className="store-details-grid">
        
        <div className="detail-item">
          <div className="detail-item-header">
            
            <h2>Address</h2> 
          </div>
          <div className="detail-item-content">
            <p>{store.address}</p>
          </div>
        </div>

        
        <div className="detail-item">
          <div className="detail-item-header">
            <h2>Description</h2>
          </div>
          <div className="detail-item-content">
            <p>{store.description}</p>
          </div>
        </div>
        
        
        <div className="detail-item">
          <div className="detail-item-header">
            <h2>Overall Rating</h2>
          </div>
          <div className="detail-item-content">
            <RatingBadge rating={store.overall_rating} />
          </div>
        </div>
      
        
        <div className="detail-item">
          <div className="detail-item-header">
            <h2>Your Rating</h2>
          </div>
          <div className="detail-item-content">
            {store.user_submitted_rating ? (
              <RatingBadge rating={store.user_submitted_rating} />
            ) : (
              <p>You have not rated this store yet.</p>
            )}
          </div>
        </div>

        
        <div className="detail-item">
          <div className="detail-item-header">
            <h4 className="rate-this-store-label">Rate this store:</h4>

          </div>
          <div className="detail-item-content">
            <Rating
              storeId={store.id}
              currentRating={store.user_submitted_rating}
              onRatingSubmit={handleRatingSubmit}
            />
          </div>
        </div>
        
      </div>
    </div>
  );
};
export default StoreDetailPage;