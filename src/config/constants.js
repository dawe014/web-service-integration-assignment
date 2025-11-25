/**
 * Application constants
 */

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
};

export const ERROR_MESSAGES = {
  MISSING_AUTH_HEADER: "Missing Authorization header",
  INVALID_AUTH_FORMAT: "Invalid Authorization format. Expected: Bearer <token>",
  INVALID_TOKEN: "Invalid or expired token",
  INTERNAL_SERVER_ERROR: "Internal server error",
  WEATHER_API_FAILED: "Failed to fetch weather from external API",
  MISSING_CITIES_ARRAY: "Please provide a 'cities' array in the request body.",
};

export const AUTH_HEADER_PREFIX = "Bearer";
