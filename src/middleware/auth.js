import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { UnauthorizedError } from "../utils/errors.js";
import { validateAuthHeader } from "../utils/validation.js";

/**
 * Generates a JWT token with the given payload
 * @param {Object} payload - Data to encode in the token
 * @returns {string} JWT token
 */
export function generateToken(payload = { user: "student" }) {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

/**
 * Middleware to verify JWT token from Authorization header
 * Attaches decoded user data to req.user
 * @throws {UnauthorizedError} If token is missing, invalid, or expired
 */
export function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = validateAuthHeader(authHeader);

    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    if (
      err instanceof jwt.JsonWebTokenError ||
      err instanceof jwt.TokenExpiredError
    ) {
      throw new UnauthorizedError("Invalid or expired token");
    }
    throw err;
  }
}
