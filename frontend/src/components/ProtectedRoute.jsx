// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // While the context is checking for a user, don't render anything
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // If there is no user, redirect them to the login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If there is a user, render the page they were trying to access
  return children;
};

export default ProtectedRoute;