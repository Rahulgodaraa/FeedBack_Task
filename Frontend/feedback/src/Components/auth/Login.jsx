import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import "../../styles/global.css"

const Login = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(userData);
      if (response.success) {
        if (response.userData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/feedback');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Sign in to your account</h2>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={userData.email}
              onChange={handleChange}
              placeholder="Email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={userData.password}
              onChange={handleChange}
              placeholder="Password"
            />
          </div>

         

          <button
            type="submit"
            disabled={loading}
            className={`submit-button ${loading ? 'loading' : ''}`}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="register-link">
            <span>Don't have an account? </span>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="link-button"
            >
              Register here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};




export default Login;

