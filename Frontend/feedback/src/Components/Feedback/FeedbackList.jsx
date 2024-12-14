import React, { useState, useEffect, useContext } from 'react';
import { FeedbackContext } from '../../context/FeedbackContext';
import { AuthContext } from '../../context/AuthContext';

const FeedbackList = () => {
  const [editingFeedback, setEditingFeedback] = useState(null);
  const { user } = useContext(AuthContext);
  const { 
    getUserFeedbacks, 
    updateFeedback, 
    deleteFeedback,
    getAllFeedbacks,
    feedbacks 
  } = useContext(FeedbackContext);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        // Only call the admin fetch if necessary
        if (!feedbacks.length) {
          getAllFeedbacks();
        }
      } else if (user._id) {
        // Only fetch user's feedback if not already fetched
        if (!feedbacks.length) {
          getUserFeedbacks(user._id);
        }
      }
    }
  }, [user, feedbacks, getAllFeedbacks, getUserFeedbacks]);
  

  const handleEdit = (feedback) => {
    setEditingFeedback({ ...feedback });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setEditingFeedback((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitUpdate = async () => {
    try {
      await updateFeedback(editingFeedback);
      setEditingFeedback(null);
    } catch (error) {
      console.error('Update failed', error);
    }
  };

  const handleDelete = async (feedbackId) => {
    try {
      await deleteFeedback(feedbackId);
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  return (
    <div className="feedback-list-container">
      <h2>My Feedbacks</h2>
      {!user || !user._id ? (
        <p>Please login as a user to view feedbacks.</p>
      ) : feedbacks.length === 0 ? (
        <p>No feedbacks submitted yet</p>
      ) : (
        <div className="feedback-grid">
          {feedbacks.map((feedback) => (
            <div key={feedback._id} className="feedback-card">
              {editingFeedback && editingFeedback._id === feedback._id ? (
                <div className="edit-mode">
                  <textarea
                    name="content"
                    value={editingFeedback.content}
                    onChange={handleUpdateChange}
                  />
                  <select
                    name="rating"
                    value={editingFeedback.rating}
                    onChange={handleUpdateChange}
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                  <div className="edit-actions">
                    <button onClick={submitUpdate}>Save</button>
                    <button onClick={() => setEditingFeedback(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="view-mode">
                  <p>{feedback.content}</p>
                  <div className="feedback-meta">
                    <span>Rating: {feedback.rating}/5</span>
                    <div className="feedback-actions">
                      <button onClick={() => handleEdit(feedback)}>Edit</button>
                      <button onClick={() => handleDelete(feedback._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
