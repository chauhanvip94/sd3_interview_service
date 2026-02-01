import { AppError } from "../utils/error.util.js";

export const errorHandler = (error, request, response, next) => {
  const httpCode = error.httpCode || 500;
  const status = error.status || "error";
  const errorMessage = error.message || "Internal server error";
  const stack = process.env.NODE_ENV === "production" ? undefined : error.stack;
  const route = `${request.method} ${request.originalUrl}`;

  response.status(httpCode).json({
    status,
    httpCode,
    error_message: errorMessage,
    stack,
    route,
  });
};

export const notFoundHandler = (request, response, next) => {
  const error = new AppError(`Route ${request.method} ${request.originalUrl} not found`, 404);
  next(error);
};

export const asyncHandler = (fn) => {
  return (request, response, next) => {
    Promise.resolve(fn(request, response, next)).catch(next);
  };
};
