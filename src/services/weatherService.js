import axios from "axios";
import config from "../config/index.js";
import logger from "../utils/logger.js";
import { BadGatewayError } from "../utils/errors.js";

/**
 * Weather service for interacting with OpenWeatherMap API
 */
class WeatherService {
  constructor() {
    this.baseUrl = config.openWeatherBaseUrl;
    this.apiKey = config.openWeatherApiKey;
    this.timeout = config.apiTimeout;

    // Create axios instance with defaults
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      params: {
        appid: this.apiKey,
      },
    });
  }

  /**
   * Converts Kelvin to Celsius
   * @param {number} kelvin - Temperature in Kelvin
   * @returns {string} Temperature in Celsius (2 decimal places)
   */
  kelvinToCelsius(kelvin) {
    return (kelvin - 273.15).toFixed(2);
  }

  /**
   * Transforms raw OpenWeatherMap API response to simplified format
   * @param {Object} rawData - Raw API response
   * @returns {Object} Transformed weather data
   */
  transformWeatherData(rawData) {
    return {
      city: rawData.name,
      country: rawData.sys?.country,
      coordinates: {
        lat: rawData.coord?.lat,
        lon: rawData.coord?.lon,
      },
      temperature: {
        current: this.kelvinToCelsius(rawData.main?.temp),
        feels_like: this.kelvinToCelsius(rawData.main?.feels_like),
        min: this.kelvinToCelsius(rawData.main?.temp_min),
        max: this.kelvinToCelsius(rawData.main?.temp_max),
        unit: "celsius",
      },
      weather: {
        main: rawData.weather?.[0]?.main,
        description: rawData.weather?.[0]?.description,
        icon: rawData.weather?.[0]?.icon,
      },
      wind: {
        speed: rawData.wind?.speed,
        deg: rawData.wind?.deg,
        unit: "m/s",
      },
      humidity: rawData.main?.humidity,
      pressure: rawData.main?.pressure,
      visibility: rawData.visibility,
      clouds: rawData.clouds?.all,
      timestamp: new Date(rawData.dt * 1000).toISOString(),
    };
  }

  /**
   * Fetches weather data for a single city
   * @param {string} city - City name
   * @returns {Promise<Object>} Transformed weather data
   * @throws {BadGatewayError} If the API request fails
   */
  async fetchWeatherByCity(city) {
    try {
      logger.info(`Fetching weather data for city: ${city}`);

      const response = await this.client.get("/weather", {
        params: { q: city },
      });

      const transformedData = this.transformWeatherData(response.data);
      logger.info(`Successfully fetched weather data for city: ${city}`);

      return transformedData;
    } catch (error) {
      logger.error(`Failed to fetch weather for ${city}: ${error.message}`);

      // Handle specific axios errors
      if (error.response) {
        // API returned an error response
        const status = error.response.status;
        if (status === 404) {
          throw new BadGatewayError(`City '${city}' not found`);
        } else if (status === 401) {
          throw new BadGatewayError("Invalid API key");
        } else {
          throw new BadGatewayError(
            `Weather API error: ${
              error.response.data?.message || error.message
            }`
          );
        }
      } else if (error.request) {
        // Request was made but no response received
        throw new BadGatewayError("Weather API is not responding");
      } else {
        // Something else happened
        throw new BadGatewayError("Failed to fetch weather data");
      }
    }
  }

  /**
   * Fetches weather data for multiple cities
   * @param {Array<string>} cities - Array of city names
   * @returns {Promise<Array>} Array of results with success/error status
   */
  async fetchWeatherForMultipleCities(cities) {
    const results = [];

    // Process cities sequentially to avoid rate limiting
    // For better performance, could use Promise.all with rate limiting
    for (const city of cities) {
      try {
        const data = await this.fetchWeatherByCity(city);
        results.push({
          city,
          success: true,
          data,
        });
      } catch (error) {
        results.push({
          city,
          success: false,
          error: error.message,
        });
      }
    }

    return results;
  }
}

// Export singleton instance
export default new WeatherService();
