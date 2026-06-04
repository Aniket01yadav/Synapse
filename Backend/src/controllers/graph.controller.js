import * as graphService from "../services/graph.service.js";

export const getGraph = async (req, res, next) => {
  try {
    const result = await graphService.getGraph();

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};