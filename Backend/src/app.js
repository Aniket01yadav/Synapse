import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import graphRoutes from "./routes/graph.routes.js";
import hobbyRoutes from "./routes/hobby.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";

import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Synapse API Running",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/graph", graphRoutes);

app.use("/api/hobbies", hobbyRoutes);

app.use("/api/recommendations", recommendationRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorMiddleware);

export default app;
