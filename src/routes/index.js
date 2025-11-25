import express from "express";
import authRoutes from "./authRoutes.js";
import weatherRoutes from "./weatherRoutes.js";

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Weather Integration API is running",
    timestamp: new Date().toISOString(),
  });
});

// Mount route modules
router.use("/auth", authRoutes);
router.use("/weather", weatherRoutes);

export default router;
