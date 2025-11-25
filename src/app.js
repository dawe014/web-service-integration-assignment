import express from "express";
import config from "./config/index.js";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import logger from "./utils/logger.js";

/**
 * Creates and configures the Express application
 * @returns {express.Application} Configured Express app
 */
function createApp() {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging middleware
  if (config.isDevelopment) {
    app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path}`);
      next();
    });
  }

  // API routes
  app.use("/api", routes);

  // Root endpoint redirect
  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "Weather Integration API",
      version: "2.0.0",
      documentation: "/api/health",
    });
  });

  // 404 handler for undefined routes
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}

export default createApp;
