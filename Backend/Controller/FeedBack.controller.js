import Feedback from "../Model/Feedback.Schema.js";
 

// Add Feedback
export const addFeedback = async (req, res) => {
  try {
    const { userId, content, rating } = req.body;

    if (!userId || !content) {
      return res.status(400).json({ message: "User ID and content are required", success: false });
    }

    const newFeedback = new Feedback({ userId, content, rating });
    await newFeedback.save();

    res.status(201).json({ message: "Feedback added successfully", success: true, feedback: newFeedback });
  } catch (error) {
    console.error("Error adding feedback:", error.message);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Get Feedback by User ID
export const getUserFeedback = async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('Received userId:', userId); // Debug log

     
    const feedbacks = await Feedback.find({ userId })
      .populate('userId', 'name email')  // Populate user details
      .sort({ createdAt: -1 });         // Sort by newest first
    
    console.log('Found feedbacks:', feedbacks); // Debug log

    // Send response even if no feedbacks found
    return res.status(200).json({
      message: feedbacks.length ? "User feedbacks retrieved successfully" : "No feedbacks found",
      success: true,
      feedbacks
    });

  } catch (error) {
    console.error("Error fetching user feedback:", error.message);
    return res.status(500).json({ 
      message: "Internal server error", 
      success: false 
    });
  }
};
// Update Feedback
export const updateFeedback = async (req, res) => {
  try {
    const { feedbackId, content, rating } = req.body;

    if (!feedbackId || !content) {
      return res.status(400).json({ message: "Feedback ID and content are required", success: false });
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { content, rating },
      { new: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({ message: "Feedback not found", success: false });
    }

    res.status(200).json({ message: "Feedback updated successfully", success: true, feedback: updatedFeedback });
  } catch (error) {
    console.error("Error updating feedback:", error.message);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Delete Feedback
export const deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    if (!feedbackId) {
      return res.status(400).json({ message: "Feedback ID is required", success: false });
    }

    const deletedFeedback = await Feedback.findByIdAndDelete(feedbackId);

    if (!deletedFeedback) {
      return res.status(404).json({ message: "Feedback not found", success: false });
    }

    res.status(200).json({ message: "Feedback deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting feedback:", error.message);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

 

// Get all feedbacks for admin
// feedback.controller.js
export const getAllFeedbacks = async (req, res) => {
  try {
    // Role check
    if (req.user && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied", success: false });
    }
    
    // Fetch all feedbacks using an empty query {}
    const feedbacks = await Feedback.find({})
      .populate({
        path: 'userId',
        select: 'name email' // Only get name and email from User
      });
    
    if (!feedbacks.length) {
      return res.status(404).json({ 
        message: "No feedbacks found", 
        success: false 
      });
    }

    return res.status(200).json({
      message: "All feedbacks retrieved successfully",
      success: true,
      feedbacks
    });
    
  } catch (error) {
    console.error("Error fetching feedbacks:", error.message);
    return res.status(500).json({ 
      message: "Internal server error", 
      success: false 
    });
  }
};


