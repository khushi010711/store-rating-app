// frontend/src/components/Rating.jsx
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import '../App.css';

const Rating = ({ storeId, currentRating, onRatingSubmit }) => {
  const [hover, setHover] = useState(0); 

  const handleRatingClick = (ratingValue) => {
    onRatingSubmit(storeId, ratingValue);
  };

  return (
    <div className="rating-container">
      <div className="rating-stars">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;

          return (
            <label key={ratingValue}>
              <input
                type="radio"
                name={`rating-${storeId}`}
                value={ratingValue}
                onClick={() => handleRatingClick(ratingValue)}
                style={{ display: 'none' }}
              />
              <FaStar
                className="star"
                color={ratingValue <= currentRating ? '#ffc107' : '#e4e5e9'}
                size={35}
                
              />
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default Rating;