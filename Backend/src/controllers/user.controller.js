import * as userService from "../services/user.service.js";

export const createUser = async (req, res, next) => {
  try {
    const result = await userService.createUser(req.body);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const result = await userService.getUsers();

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const result = await userService.getUserById(req.params.id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const result = await userService.updateUser(
      req.params.id,
      req.body
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const result = await userService.deleteUser(req.params.id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};