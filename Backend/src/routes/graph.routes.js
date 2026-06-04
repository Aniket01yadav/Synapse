import express from "express";

import {
  getGraph,
} from "../controllers/graph.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getGraph
);

export default router;