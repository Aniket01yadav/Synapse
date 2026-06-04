import express from "express";

import {
  addHobby,
  removeHobby,
  getAllHobbies,
} from "../controllers/hobby.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getAllHobbies
);

router.post(
  "/:id",
  authMiddleware,
  addHobby
);

router.delete(
  "/:id",
  authMiddleware,
  removeHobby
);

export default router;
