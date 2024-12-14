import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const AuthWrapper = ({ children, requiredRole = 'user' }) => {
  const { user, loading } = useContext(AuthContext);

  // If still loading, show a loading spinner or placeholder
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRole === 'admin' && user.role !== 'admin') {
    return <Navigate to="/feedback" replace />;
  }

  // If all checks pass, render children
  return children;
};

export default AuthWrapper;