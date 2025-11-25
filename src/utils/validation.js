import { BadRequestError } from "./errors.js";

/**
 * Validates that the request body contains a non-empty array of cities
 * @param {Array} cities - Array of city names
 * @throws {BadRequestError} If validation fails
 */
export function validateCitiesArray(cities) {
  if (!cities || !Array.isArray(cities) || cities.length === 0) {
    throw new BadRequestError(
      "Please provide a 'cities' array in the request body."
    );
  }
}

/**
 * Cleans and filters an array of city names
 * @param {Array} cities - Raw array of city names
 * @returns {Array} Cleaned array of city names
 */
export function cleanCityNames(cities) {
  return cities.map((c) => String(c).trim()).filter((c) => c.length > 0);
}

/**
 * Validates JWT token format from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string} Extracted token
 * @throws {BadRequestError} If header format is invalid
 */
export function validateAuthHeader(authHeader) {
  if (!authHeader) {
    throw new BadRequestError("Missing Authorization header");
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw new BadRequestError(
      "Invalid Authorization format. Expected: Bearer <token>"
    );
  }

  return parts[1];
}
