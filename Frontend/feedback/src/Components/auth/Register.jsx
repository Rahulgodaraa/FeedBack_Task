import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmpassword: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userData.password !== userData.confirmpassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await register(userData);
      if (response.success) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Create a password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmpassword">Confirm Password</label>
            <input
              id="confirmpassword"
              type="password"
              name="confirmpassword"
              value={userData.confirmpassword}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Confirm your password"
            />
          </div>

          

          <button type="submit" className="submit-btn">
            Register
          </button>

          <div className="auth-link">
            Already have an account?
            <span 
              onClick={() => navigate('/login')}
              className="text-link"
            >
              Login here
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;