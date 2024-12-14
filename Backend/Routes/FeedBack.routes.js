import { Router } from "express";
import {
  addFeedback,
  getUserFeedback,
  updateFeedback,
  deleteFeedback,
  getAllFeedbacks,
} from "../Controller/FeedBack.controller.js";

const FeedBack = Router();

 
FeedBack.post("/add", addFeedback);

 
FeedBack.get("/:userId", getUserFeedback);

 
FeedBack.put("/update", updateFeedback);

 
FeedBack.delete("/:feedbackId", deleteFeedback);

FeedBack.get("/all", getAllFeedbacks);


export default FeedBack;
