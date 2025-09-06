// frontend/src/pages/StoreOwnerDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import storeOwnerService from '../api/storeOwnerService';
import '../App.css';

const StoreOwnerDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await storeOwnerService.getDashboard();
        setDashboardData(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch dashboard data.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="page-container">Loading dashboard...</div>;
  if (error) return <div className="page-container" style={{ color: 'red' }}>Error: {error}</div>;
  if (!dashboardData) return <div className="page-container">Your store has not been set up yet.</div>;


  return (
    <div className="page-container">
      <h1>{dashboardData.store_name} - Dashboard</h1>

      
      <div className="stats-section" style={{ justifyContent: 'center', maxWidth: '400px', margin: '2rem auto' }}>
        <div className="stat-card">
          <h3>Average Rating</h3>
          <p>{parseFloat(dashboardData.average_rating).toFixed(2)} / 5</p>
        </div>
      </div>

      
      <section>
        <h2>Users Who Rated Your Store</h2>
        {dashboardData.users_who_rated && dashboardData.users_who_rated.length > 0 ? (
          
          <table className="data-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Rating Given</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.users_who_rated.map((ratingInfo) => (
                <tr key={ratingInfo.user_id}>
                  <td>{ratingInfo.name}</td>
                  <td>{ratingInfo.rating_given} / 5</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Your store has not received any ratings yet.</p>
        )}
      </section>
    </div>
  );
};

export default StoreOwnerDashboardPage;