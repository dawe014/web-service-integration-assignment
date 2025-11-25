import { HTTP_STATUS } from "../config/constants.js";

/**
 * Base application error class
 */
export class AppError extends Error {
  constructor(
    message,
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Bad request error (400)
 */
export class BadRequestError extends AppError {
  constructor(message) {
    super(message, HTTP_STATUS.BAD_REQUEST);
  }
}

/**
 * Unauthorized error (401)
 */
export class UnauthorizedError extends AppError {
  constructor(message) {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}

/**
 * Not found error (404)
 */
export class NotFoundError extends AppError {
  constructor(message) {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}

/**
 * Bad gateway error (502) - for external API failures
 */
export class BadGatewayError extends AppError {
  constructor(message) {
    super(message, HTTP_STATUS.BAD_GATEWAY);
  }
}

/**
 * Wraps async route handlers to catch errors and pass them to error middleware
 * @param {Function} fn - Async route handler function
 * @returns {Function} Wrapped function that catches errors
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
