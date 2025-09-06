// frontend/src/components/RatingBadge.jsx
import React from 'react';
import { FaStar } from 'react-icons/fa';
import '../App.css'; 

const RatingBadge = ({ rating }) => {
  // Determine the background color based on the rating value
  const getRatingColor = () => {
    if (rating >= 3.5) return '#28a745'; 
    if (rating >= 2.5) return '#ffc107'; 
    return '#dc3545'; 
  };

  return (
    <div className="rating-badge" style={{ backgroundColor: getRatingColor() }}>
      <span className="rating-badge-text">{parseFloat(rating).toFixed(2)}</span>
      <FaStar className="rating-badge-star" />
    </div>
  );
};

export default RatingBadge;