import React, { useState, useEffect, useContext, useRef } from 'react';
import { FeedbackContext } from '../../context/FeedbackContext';
import { AuthContext } from '../../context/AuthContext';

const FeedbackList = () => {
  const [editingFeedback, setEditingFeedback] = useState(null);
  const { user } = useContext(AuthContext);
  const { 
    getUserFeedbacks, 
    getAllFeedbacks,
    updateFeedback, 
    deleteFeedback,
    feedbacks,
    loading,
    error 
  } = useContext(FeedbackContext);

  const fetchedRef = useRef(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!fetchedRef.current && user) {
        try {
          if (user.role === 'admin') {
            await getAllFeedbacks();
          } else {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const userId = user._id || storedUser?._id;
            
            if (userId) {
              await getUserFeedbacks(userId);
            }
          }
          fetchedRef.current = true;
        } catch (error) {
          console.error('Error fetching feedbacks:', error);
        }
      }
    };

    fetchFeedbacks();
    
    // Cleanup function to reset the ref when component unmounts
    return () => {
      fetchedRef.current = false;
    };
  }, [user]);

  const handleEdit = (feedback) => {
    setEditingFeedback({ ...feedback });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setEditingFeedback(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value, 10) : value
    }));
  };

  const submitUpdate = async () => {
    try {
      await updateFeedback(editingFeedback);
      setEditingFeedback(null);
      // Refresh feedbacks
      if (user.role === 'admin') {
        await getAllFeedbacks();
      } else {
        await getUserFeedbacks(user._id);
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleDelete = async (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await deleteFeedback(feedbackId);
        // Refresh feedbacks
        if (user.role === 'admin') {
          await getAllFeedbacks();
        } else {
          await getUserFeedbacks(user._id);
        }
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  if (loading) return <div className="feedback-loading">Loading...</div>;
  if (error) return <div className="feedback-error">Error: {error}</div>;

  return (
    <div className="feedback-list-container">
      <h2>{user?.role === 'admin' ? 'All Feedbacks' : 'My Feedbacks'}</h2>
      {!user || !user._id ? (
        <p>Please login to view feedbacks.</p>
      ) : feedbacks.length === 0 ? (
        <p>No feedbacks found.</p>
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
                    className="feedback-textarea"
                  />
                  <select
                    name="rating"
                    value={editingFeedback.rating}
                    onChange={handleUpdateChange}
                    className="feedback-rating-select"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                  <div className="edit-actions">
                    <button 
                      onClick={submitUpdate}
                      className="btn-save"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setEditingFeedback(null)}
                      className="btn-cancel"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="view-mode">
                  <p className="feedback-content">{feedback.content}</p>
                  <div className="feedback-meta">
                    <span>Rating: {feedback.rating}/5</span>
                    {user.role === 'admin' && (
                      <span className="feedback-user">
                        By: {feedback.userId.name || 'Unknown user'}
                      </span>
                    )}
                    <div className="feedback-actions">
                      <button 
                        onClick={() => handleEdit(feedback)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(feedback._id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
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