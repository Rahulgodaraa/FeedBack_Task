import React, { useState } from 'react';

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState({
    content: '',
    rating: 5
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mock user data for demonstration
  const mockUser = {
    _id: '123',
    name: 'John Doe'
  };

  // Mock feedback submission function
  const addFeedback = async (feedbackData) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Submitted feedback:', feedbackData);
        resolve({ success: true });
      }, 500);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addFeedback({
        userId: mockUser._id,
        ...feedback
      });

      if (response.success) {
        setSuccess('Feedback submitted successfully');
        setFeedback({ content: '', rating: 5 });
        setError('');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit feedback');
      setSuccess('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Submit Feedback</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Feedback
          </label>
          <textarea
            name="content"
            value={feedback.content}
            onChange={handleChange}
            placeholder="Share your thoughts..."
            required
            rows="4"
            className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Rating
          </label>
          <select
            name="rating"
            value={feedback.rating}
            onChange={handleChange}
            className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;