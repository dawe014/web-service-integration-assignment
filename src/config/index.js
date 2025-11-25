import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

/**
 * Application configuration
 * Validates required environment variables and provides typed config access
 */
class Config {
  constructor() {
    this.validateRequiredEnvVars();
  }

  // Server configuration
  get port() {
    return parseInt(process.env.PORT || "3000", 10);
  }

  get nodeEnv() {
    return process.env.NODE_ENV || "development";
  }

  get isProduction() {
    return this.nodeEnv === "production";
  }

  get isDevelopment() {
    return this.nodeEnv === "development";
  }

  // JWT configuration
  get jwtSecret() {
    return process.env.JWT_SECRET;
  }

  get jwtExpiresIn() {
    return process.env.JWT_EXPIRES_IN || "1h";
  }

  // OpenWeather API configuration
  get openWeatherApiKey() {
    return process.env.OPENWEATHER_API_KEY;
  }

  get openWeatherBaseUrl() {
    return (
      process.env.OPENWEATHER_BASE_URL ||
      "https://api.openweathermap.org/data/2.5"
    );
  }

  get apiTimeout() {
    return parseInt(process.env.API_TIMEOUT || "8000", 10);
  }

  // Logging configuration
  get logLevel() {
    return process.env.LOG_LEVEL || "info";
  }

  /**
   * Validates that all required environment variables are present
   * @throws {Error} If any required environment variable is missing
   */
  validateRequiredEnvVars() {
    const required = ["JWT_SECRET", "OPENWEATHER_API_KEY"];
    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}\n` +
          `Please check your .env file and ensure all required variables are set.`
      );
    }
  }
}

export default new Config();
