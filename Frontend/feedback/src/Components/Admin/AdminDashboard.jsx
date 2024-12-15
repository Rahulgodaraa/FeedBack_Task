import React, { useState, useEffect, useContext } from "react";
import { FeedbackContext } from "../../context/FeedbackContext";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/global.css"

const AdminDashboard = () => {
  const { getAllFeedbacks, feedbacks, deleteFeedback, updateFeedback } = useContext(FeedbackContext);
  const { user } = useContext(AuthContext);
  const [filter, setFilter] = useState({
    minRating: 0,
    searchTerm: "",
  });
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [viewingFeedback, setViewingFeedback] = useState(null);

  useEffect(() => {
    getAllFeedbacks();
  }, []);

  const filteredFeedbacks = feedbacks.filter(
    (feedback) =>
      feedback.rating >= filter.minRating &&
      feedback.content.toLowerCase().includes(filter.searchTerm.toLowerCase())
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (feedbackId) => {
    try {
      await deleteFeedback(feedbackId);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingFeedback((prev) => ({ ...prev, [name]: value }));
  };

  const submitEdit = async () => {
    try {
      await updateFeedback(editingFeedback);
      setEditingFeedback(null);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      <div className="filter-container">
        <div className="filter-group">
          <label>Minimum Rating</label>
          <select
            name="minRating"
            value={filter.minRating}
            onChange={handleFilterChange}
          >
            {[0, 1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}+ Stars
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Search</label>
          <input
            type="text"
            name="searchTerm"
            value={filter.searchTerm}
            onChange={handleFilterChange}
            placeholder="Search feedback content"
          />
        </div>
      </div>

      <div className="feedback-section">
        <h2 className="section-title">All Feedbacks</h2>
        {filteredFeedbacks.length === 0 ? (
          <p className="no-feedback">No feedbacks found</p>
        ) : (
          <table className="feedback-table">
            <thead>
              <tr>
                <th>Feedback</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.map((feedback) => (
                <tr key={feedback._id}>
                  <td>
                    {editingFeedback && editingFeedback._id === feedback._id ? (
                      <textarea
                        name="content"
                        value={editingFeedback.content}
                        onChange={handleEditChange}
                        className="edit-textarea"
                      />
                    ) : (
                      feedback.content
                    )}
                  </td>
                  <td>
                    {editingFeedback && editingFeedback._id === feedback._id ? (
                      <select
                        name="rating"
                        value={editingFeedback.rating}
                        onChange={handleEditChange}
                        className="edit-select"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    ) : (
                      `${feedback.rating}/5`
                    )}
                  </td>
                  <td className="action-buttons">
                    {editingFeedback && editingFeedback._id === feedback._id ? (
                      <button onClick={submitEdit} className="btn save">Save</button>
                    ) : (
                      <button
                        onClick={() => setEditingFeedback(feedback)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(feedback._id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setViewingFeedback(feedback)}
                      className="btn-view"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {viewingFeedback && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Feedback Details</h3>
            <p><strong>Content:</strong> {viewingFeedback.content}</p>
            <p><strong>Rating:</strong> {viewingFeedback.rating}/5</p>
            <button
              onClick={() => setViewingFeedback(null)}
              className="btn close"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};



export default AdminDashboard;

 