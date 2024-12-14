import React from 'react';
import Login from '../Components/auth/Login';
import AuthWrapper from '../Components/auth/AuthWrapper';

const LoginPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;