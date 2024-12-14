import React, { useState, useEffect, useContext } from 'react';
import { FeedbackContext } from '../context/FeedbackContext';
import FeedbackItem from './FeedbackItem';

const FeedbackManagement = () => {
  const { 
    getAllFeedbacks, 
    updateFeedback, 
    deleteFeedback, 
    feedbacks 
  } = useContext(FeedbackContext);

  const [filter, setFilter] = useState({
    minRating: 0,   
    searchTerm: ''
  });

  const [editingFeedback, setEditingFeedback] = useState(null);

  useEffect(() => {
    getAllFeedbacks();
  }, []);

  // Filter feedbacks based on rating and search term
  const filteredFeedbacks = feedbacks.filter(feedback => 
    feedback.rating >= filter.minRating &&
    feedback.content.toLowerCase().includes(filter.searchTerm.toLowerCase())
  );

  // Handle editing a feedback
  const handleEditFeedback = (feedback) => {
    setEditingFeedback(feedback);
  };

  // Handle update of feedback
  const handleUpdateFeedback = async () => {
    try {
      await updateFeedback(editingFeedback);
      setEditingFeedback(null);
    } catch (error) {
      console.error('Update failed', error);
    }
  };

  // Handle deletion of feedback
  const handleDeleteFeedback = async (feedbackId) => {
    try {
      await deleteFeedback(feedbackId);
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  return (
    <div className="feedback-management-container">
      <div className="feedback-filters">
        <div className="filter-group">
          <label>Minimum Rating</label>
          <select
            value={filter.minRating}
            onChange={(e) => setFilter(prev => ({
              ...prev, 
              minRating: Number(e.target.value)
            }))}
          >
            {[0,1,2,3,4,5].map(num => (
              <option key={num} value={num}>
                {num}+ Stars
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Search Feedback</label>
          <input
            type="text"
            placeholder="Search feedback content"
            value={filter.searchTerm}
            onChange={(e) => setFilter(prev => ({
              ...prev, 
              searchTerm: e.target.value
            }))}
          />
        </div>
      </div>

      {editingFeedback && (
        <div className="edit-modal">
          <textarea
            value={editingFeedback.content}
            onChange={(e) => setEditingFeedback(prev => ({
              ...prev, 
              content: e.target.value
            }))}
          />
          <select
            value={editingFeedback.rating}
            onChange={(e) => setEditingFeedback(prev => ({
              ...prev, 
              rating: Number(e.target.value)
            }))}
          >
            {[1,2,3,4,5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <div className="edit-actions">
            <button onClick={handleUpdateFeedback}>Save</button>
            <button onClick={() => setEditingFeedback(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="feedback-list">
        {filteredFeedbacks.length === 0 ? (
          <p>No feedbacks found</p>
        ) : (
          filteredFeedbacks.map(feedback => (
            <FeedbackItem
              key={feedback._id}
              feedback={feedback}
              onEdit={handleEditFeedback}
              onDelete={handleDeleteFeedback}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FeedbackManagement;