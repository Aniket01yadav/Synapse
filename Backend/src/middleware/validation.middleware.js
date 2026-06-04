const validationMiddleware =
  (requiredFields = []) =>
  (req, res, next) => {
    const missingFields =
      requiredFields.filter(
        (field) =>
          req.body[field] ===
            undefined ||
          req.body[field] === ""
      );

    if (
      missingFields.length > 0
    ) {
      const error = new Error(
        `Missing required fields: ${missingFields.join(
          ", "
        )}`
      );
      error.statusCode = 400;
      return next(error);
    }

    if (req.body.age !== undefined) {
      if (
        isNaN(req.body.age) ||
        req.body.age < 1 ||
        req.body.age > 150
      ) {
        const error = new Error(
          "Age must be a valid number between 1 and 150"
        );
        error.statusCode = 400;
        return next(error);
      }
    }

    if (req.body.email !== undefined) {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (
        !emailRegex.test(req.body.email)
      ) {
        const error = new Error(
          "Invalid email format"
        );
        error.statusCode = 400;
        return next(error);
      }
    }

    next();
  };

export default validationMiddleware;
