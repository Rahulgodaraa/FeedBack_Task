import React, { useState, useContext } from 'react';
import { FeedbackContext } from '../../context/FeedbackContext';
import { AuthContext } from '../../context/AuthContext';
import "../../styles/global.css"
const FeedbackForm = () => {
  const [feedback, setFeedback] = useState({
    content: '',
    rating: 5
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { user } = useContext(AuthContext);
  const { addFeedback } = useContext(FeedbackContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addFeedback({
        userId: user._id,
        ...feedback
      });

      if (response.success) {
        setSuccess('Feedback submitted successfully');
        setFeedback({ content: '', rating: 5 });
        setError('');
      }
    } catch (err) {
      console.error('Feedback submission error:', err);
      setError(err.message || 'Failed to submit feedback');
      setSuccess('');
    }
  };

  return (
    <div className="feedback-form-container">
      <div className="feedback-form-card">
        <h2 className="form-title">Submit Feedback</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {success && (
          <div className="success-message">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label>Your Feedback</label>
            <textarea
              name="content"
              value={feedback.content}
              onChange={handleChange}
              placeholder="Share your thoughts..."
              required
              rows="4"
              className="form-textarea"
            />
          </div>
          
          <div className="form-group">
            <label>Rating</label>
            <select
              name="rating"
              value={feedback.rating}
              onChange={handleChange}
              className="form-select"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>
                  {num} Star{num !== 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
          
          <button
            type="submit"
            className="submit-btn"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;