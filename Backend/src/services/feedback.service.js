import Feedback from "../models/Feedback.js";

export const submitFeedback =
  async (userId, data) => {

    const feedback =
      await Feedback.create({
        userId,
        recommendationId:
          data.recommendationId,
        type: data.type,
        action: data.action,
      });

    return {
      success: true,
      feedback,
    };
  };