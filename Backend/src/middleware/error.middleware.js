const errorMiddleware = (
  err,
  req,
  res,
  next
) => {
  console.error(err);

  let statusCode = 500;
  let message = "Internal Server Error";

  if (err.statusCode) {
    statusCode = err.statusCode;
  }

  if (err.message) {
    message = err.message;

    if (
      message.includes("not found") ||
      message.includes("not exist")
    ) {
      statusCode = 404;
    } else if (
      message.includes("already") ||
      message.includes("exist") ||
      message.includes("conflict")
    ) {
      statusCode = 409;
    } else if (
      message.includes("require") ||
      message.includes("invalid") ||
      message.includes("missing")
    ) {
      statusCode = 400;
    } else if (
      message.includes("unauthorized") ||
      message.includes("forbidden")
    ) {
      statusCode = 401;
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV ===
    "development" && {
      stack: err.stack,
    }),
  });
};

export default errorMiddleware;
