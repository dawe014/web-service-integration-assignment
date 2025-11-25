import express from "express";
import { verifyToken } from "../middleware/auth.js";
import weatherService from "../services/weatherService.js";
import { asyncHandler } from "../utils/errors.js";
import { validateCitiesArray, cleanCityNames } from "../utils/validation.js";

const router = express.Router();

/**
 * @route   GET /api/weather/:city
 * @desc    Get weather data for a single city
 * @access  Protected (requires JWT token)
 */
router.get(
  "/:city",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { city } = req.params;
    const data = await weatherService.fetchWeatherByCity(city);

    res.json({
      success: true,
      data,
    });
  })
);

/**
 * @route   POST /api/weather/multiple
 * @desc    Get weather data for multiple cities
 * @access  Protected (requires JWT token)
 * @body    { cities: string[] }
 */
router.post(
  "/multiple",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { cities } = req.body;

    // Validate input
    validateCitiesArray(cities);

    // Clean city names
    const cleanedCities = cleanCityNames(cities);

    // Fetch weather for all cities
    const results = await weatherService.fetchWeatherForMultipleCities(
      cleanedCities
    );

    res.json({
      success: true,
      count: results.length,
      results,
    });
  })
);

export default router;
