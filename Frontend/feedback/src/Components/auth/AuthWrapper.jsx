import React, { memo, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AuthWrapper = memo(({ children, requiredRole = 'user' }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin' && user.role !== 'admin') {
    return <Navigate to="/feedback" replace />;
  }

  return children;
});

export default AuthWrapper;