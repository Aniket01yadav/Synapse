import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recommendationId: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["friend", "hobby"],
      required: true,
    },

    action: {
      type: String,
      enum: ["accepted", "rejected"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model(
  "Feedback",
  feedbackSchema
);

export default Feedback;