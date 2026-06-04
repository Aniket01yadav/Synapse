import express from "express";

import {
  getRecommendations,
  submitFeedback,
} from "../controllers/recommendation.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/:id",
  authMiddleware,
  getRecommendations
);

router.post(
  "/:id/feedback",
  authMiddleware,
  submitFeedback
);

export default router;