import { Router } from "express";
import Auth from "./Auth.route.js";
import FeedBack from "./FeedBack.routes.js";

const allRoutes = Router();

allRoutes.use("/auth", Auth);
allRoutes.use("/feedback", FeedBack);

export default allRoutes;
