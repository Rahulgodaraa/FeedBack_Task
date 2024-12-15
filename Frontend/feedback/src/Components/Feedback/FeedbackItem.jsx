import React, { useState } from 'react';
import '../../styles/global.css'; // Import the CSS file here

const FeedbackItem = ({ 
  feedback, 
  onEdit, 
  onDelete, 
  isEditable = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Render star rating
  const renderStarRating = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span 
        key={index} 
        className={`star ${index < rating ? 'filled' : ''}`}
      >
        ★
      </span>
    ));
  };

  // Truncate long feedback content
  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + '...';
  };

  return (
    <div className="feedback-item">
      <div className="feedback-header">
        <div className="feedback-rating">
          {renderStarRating(feedback.rating)}
        </div>
        {isEditable && (
          <div className="feedback-actions">
            <button 
              onClick={() => onEdit(feedback)}
              className="btn-edit"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(feedback._id)}
              className="btn-delete"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      
      <div className="feedback-content">
        {isExpanded 
          ? feedback.content 
          : truncateContent(feedback.content)
        }
        
        {feedback.content.length > 100 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn-toggle-content"
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </button>
        )}
      </div>
      
      <div className="feedback-meta">
        <span className="feedback-date">
          {new Date(feedback.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default FeedbackItem;
