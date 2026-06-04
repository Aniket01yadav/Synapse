import * as hobbyService from "../services/hobby.service.js";

export const addHobby = async (req, res, next) => {
  try {
    const result = await hobbyService.addHobby(
      req.params.id,
      req.body
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const removeHobby = async (req, res, next) => {
  try {
    const result = await hobbyService.removeHobby(
      req.params.id,
      req.body
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllHobbies = async (req, res, next) => {
  try {
    const result = await hobbyService.getAllHobbies();

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
