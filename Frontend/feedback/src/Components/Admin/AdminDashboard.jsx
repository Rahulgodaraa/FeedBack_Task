import React, { useState, useEffect, useContext } from "react";
import { FeedbackContext } from "../../context/FeedbackContext";
import { AuthContext } from "../../context/AuthContext";

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
    <div className="admin-dashboard" style={styles.dashboardContainer}>
      <h1 style={styles.heading}>Admin Dashboard</h1>

      <div style={styles.filterSection}>
        <div style={styles.filterGroup}>
          <label>Minimum Rating</label>
          <select
            name="minRating"
            value={filter.minRating}
            onChange={handleFilterChange}
            style={styles.select}
          >
            {[0, 1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}+ Stars
              </option>
            ))}
          </select>
        </div>
        <div style={styles.filterGroup}>
          <label>Search</label>
          <input
            type="text"
            name="searchTerm"
            value={filter.searchTerm}
            onChange={handleFilterChange}
            placeholder="Search feedback content"
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.feedbackManagement}>
        <h2>All Feedbacks</h2>
        {filteredFeedbacks.length === 0 ? (
          <p>No feedbacks found</p>
        ) : (
          <table style={styles.table}>
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
                        style={styles.textarea}
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
                        style={styles.select}
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
                  <td>
                    {editingFeedback && editingFeedback._id === feedback._id ? (
                      <button onClick={submitEdit} style={styles.saveButton}>Save</button>
                    ) : (
                      <button
                        onClick={() => setEditingFeedback(feedback)}
                        style={styles.editButton}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(feedback._id)}
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setViewingFeedback(feedback)}
                      style={styles.viewButton}
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
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>Feedback Details</h3>
            <p><strong>Content:</strong> {viewingFeedback.content}</p>
            <p><strong>Rating:</strong> {viewingFeedback.rating}/5</p>
            <button
              onClick={() => setViewingFeedback(null)}
              style={styles.closeButton}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  dashboardContainer: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
  },
  filterSection: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    marginRight: "10px",
  },
  input: {
    padding: "8px",
    fontSize: "14px",
  },
  select: {
    padding: "8px",
    fontSize: "14px",
  },
  feedbackManagement: {
    marginTop: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  textarea: {
    width: "100%",
    padding: "8px",
  },
  editButton: {
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    marginRight: "5px",
  },
  saveButton: {
    backgroundColor: "#28A745",
    color: "white",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    marginRight: "5px",
  },
  deleteButton: {
    backgroundColor: "#DC3545",
    color: "white",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    marginRight: "5px",
  },
  viewButton: {
    backgroundColor: "#6C757D",
    color: "white",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "5px",
    width: "400px",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    padding: "10px 20px",
    cursor: "pointer",
  },
};

export default AdminDashboard;
