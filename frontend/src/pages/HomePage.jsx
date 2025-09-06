// frontend/src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSearch, FaStar, FaBullhorn } from 'react-icons/fa';
import '../App.css';

const HomePage = () => {
  const { user } = useAuth();
  const ctaLink = user ? '/stores' : '/login';
  const ctaText = user ? 'Browse Stores' : 'Get Started';

  return (
  <>
    <div className="homepage">
      <header className="hero-section">
        <header className="hero-section">
        <div className="hero-content">
          <h1>Find Trusted Stores<br/> Share Your Experience</h1>
          <p>The definitive platform for authentic customer ratings and reviews</p>
          <Link to={ctaLink} className="cta-button">
            {ctaText}
          </Link>
        </div>
      </header>
      </header>

      
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          
          <div className="step">
            <FaSearch size={40} className="step-icon" />
            <h3>1. Discover</h3>
            <p>Search and browse through a curated list of registered stores.</p>
          </div>

          
          <div className="step">
            <FaStar size={40} className="step-icon" />
            <h3>2. Rate</h3>
            <p>Share your honest feedback by giving a rating from 1 to 5 stars.</p>
          </div>

          
          <div className="step">
            <FaBullhorn size={40} className="step-icon" />
            <h3>3. Empower</h3>
            <p>Help other customers make informed decisions with your reviews.</p>
          </div>
        </div>
      </section>
    </div>
  </>
  );
};

export default HomePage;