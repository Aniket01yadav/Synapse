import express from "express";

import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

import {
  linkUsers,
  unlinkUsers,
} from "../controllers/recommendation.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getUsers
);

router.get(
  "/:id",
  authMiddleware,
  getUserById
);

router.post(
  "/",
  authMiddleware,
  createUser
);

router.put(
  "/:id",
  authMiddleware,
  updateUser
);

router.delete(
  "/:id",
  authMiddleware,
  deleteUser
);

router.post(
  "/:id/link",
  authMiddleware,
  linkUsers
);

router.delete(
  "/:id/unlink",
  authMiddleware,
  unlinkUsers
);

export default router;