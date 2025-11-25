import { HTTP_STATUS, ERROR_MESSAGES } from "../config/constants.js";
import { AppError } from "../utils/errors.js";
import logger from "../utils/logger.js";
import config from "../config/index.js";

/**
 * Global error handling middleware
 * Handles both operational and programming errors
 */
export function errorHandler(err, req, res, next) {
  let error = err;

  // Log error details
  if (error.isOperational) {
    logger.warn(
      `Operational error: ${error.message} - ${req.method} ${req.path}`
    );
  } else {
    logger.error(
      `Unexpected error: ${error.stack || error.message} - ${req.method} ${
        req.path
      }`
    );
  }

  // Default to 500 server error
  let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

  // If it's an AppError, use its status code and message
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  // Build error response
  const errorResponse = {
    success: false,
    message,
  };

  // Include stack trace in development
  if (config.isDevelopment && error.stack) {
    errorResponse.stack = error.stack;
  }

  res.status(statusCode).json(errorResponse);
}

/**
 * 404 Not Found handler for undefined routes
 */
export function notFoundHandler(req, res, next) {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
}
