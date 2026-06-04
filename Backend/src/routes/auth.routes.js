import express from "express";

import {
  register,
  login,
  getMe,
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import validationMiddleware from "../middleware/validation.middleware.js";

const router = express.Router();

router.post(
  "/register",
  validationMiddleware([
    "username",
    "email",
    "password",
    "age",
  ]),
  register
);

router.post(
  "/login",
  validationMiddleware([
    "email",
    "password",
  ]),
  login
);

router.get(
  "/me",
  authMiddleware,
  getMe
);

export default router;