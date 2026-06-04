import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";

const authMiddleware = async (
  req,
  res,
  next
) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith(
        "Bearer"
      )
    ) {
      token =
        req.headers.authorization.split(
          " "
        )[1];

      const decoded = jwt.verify(
        token,
        env.JWT_SECRET
      );

      req.user =
        await User.findById(
          decoded.id
        ).select("-password");

      return next();
    }

    return res.status(401).json({
      success: false,
      message:
        "Unauthorized access",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default authMiddleware;