import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute: isAuthenticated =', isAuthenticated, ', isLoading =', isLoading);

  // Show loading spinner while checking authentication
  if (isLoading) {
    console.log('ProtectedRoute: Showing loading spinner');
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component
  console.log('ProtectedRoute: Authenticated, rendering children');
  return children;
};

export default ProtectedRoute;