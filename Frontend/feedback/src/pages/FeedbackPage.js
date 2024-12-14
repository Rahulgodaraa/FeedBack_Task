import React from 'react';
import AuthWrapper from '../Components/auth/AuthWrapper';
import FeedbackForm from '../Components/Feedback/FeedbackForm';
import FeedbackList from '../Components/Feedback/FeedbackList';

const FeedbackPage = () => {
  return (
    <AuthWrapper>
      <div className="feedback-page">
        <div className="feedback-container">
          <h1>My Feedback</h1>
          <div className="feedback-content">
            <FeedbackForm />
            <FeedbackList />
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default FeedbackPage;