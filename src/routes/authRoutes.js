import express from "express";
import { generateToken } from "../middleware/auth.js";
import { asyncHandler } from "../utils/errors.js";
import config from "../config/index.js";

const router = express.Router();

/**
 * @route   GET /api/auth/token
 * @desc    Generate JWT token for authentication
 * @access  Public
 */
router.get(
  "/token",
  asyncHandler(async (req, res) => {
    const token = generateToken({ role: "student" });

    res.json({
      success: true,
      token,
      expires_in: config.jwtExpiresIn,
    });
  })
);

export default router;
