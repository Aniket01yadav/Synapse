import * as recommendationService from "../services/recommendation.service.js";
import * as friendshipService from "../services/friendship.service.js";
import * as feedbackService from "../services/feedback.service.js";

export const linkUsers = async (req, res, next) => {
  try {
    const result = await friendshipService.linkUsers(
      req.params.id,
      req.body.friendId
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const unlinkUsers = async (req, res, next) => {
  try {
    const result = await friendshipService.unlinkUsers(
      req.params.id,
      req.body.friendId
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await recommendationService.getRecommendations(
        req.params.id
      );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const submitFeedback = async (
  req,
  res,
  next
) => {
  try {
    const result = await feedbackService.submitFeedback(
      req.params.id,
      req.body
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};