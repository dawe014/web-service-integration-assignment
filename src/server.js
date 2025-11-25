import createApp from "./app.js";
import config from "./config/index.js";
import logger from "./utils/logger.js";

/**
 * Start the Express server
 */
function startServer() {
  try {
    // Validate configuration on startup
    logger.info("Starting Weather Integration API...");
    logger.info(`Environment: ${config.nodeEnv}`);
    logger.info(`Port: ${config.port}`);

    // Create Express app
    const app = createApp();

    // Start listening
    const server = app.listen(config.port, () => {
      logger.info(`✓ Server is running on port ${config.port}`);
      logger.info(
        `✓ API endpoints available at http://localhost:${config.port}/api`
      );
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);
      server.close(() => {
        logger.info("Server closed. Process terminating...");
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

// Start the server
startServer();
