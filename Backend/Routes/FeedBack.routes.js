import { Router } from "express";
import {
  addFeedback,
  getUserFeedback,
  updateFeedback,
  deleteFeedback,
  getAllFeedbacks,
} from "../Controller/FeedBack.controller.js";

const FeedBack = Router();

// More specific routes first
FeedBack.get("/all", getAllFeedbacks); 
FeedBack.post("/add", addFeedback);
FeedBack.put("/update", updateFeedback);
FeedBack.delete("/:feedbackId", deleteFeedback);

// Parameter route last
FeedBack.get("/:userId", getUserFeedback);

export default FeedBack;