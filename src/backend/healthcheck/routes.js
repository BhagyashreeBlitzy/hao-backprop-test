/**
 * Healthcheck Routes Module
 * 
 * Defines the Express Router for the healthcheck feature, exposing the GET /health endpoint.
 * Implements a comprehensive health status handler that responds with application health
 * information including status, uptime, timestamp, memory usage, and environment details
 * in a standardized JSON format.
 * 
 * This module integrates with centralized logging (Logger) for observability and supports
 * future extensibility for dependency checks, database connectivity monitoring, and
 * external service health validation. All errors are handled gracefully and passed to
 * the centralized error handler middleware.
 * 
 * Features:
 * - Comprehensive health status reporting (status, uptime, timestamp, memory, environment)
 * - Centralized logging integration for request tracking and error reporting
 * - Environment-aware health reporting with runtime configuration
 * - Extensible architecture for future health check enhancements
 * - Graceful error handling with proper HTTP status codes
 * - Production-ready observability and monitoring support
 * 
 * Requirements Addressed:
 * - Monitoring and Observability (6.5): Provides health check endpoint for monitoring
 *   application status, uptime, and basic metrics with integrated logging
 * - HTTP Server Implementation (2.1.1): Implements lightweight, fast health check endpoint
 *   compatible with Node.js 18+ and Express.js 5.1.0
 * - Error Management (1.3.1): Ensures health check endpoints are integrated with
 *   centralized error handling and logging systems
 * 
 * Usage:
 * This router is imported and mounted by healthcheck/index.js, which is then
 * registered in the main Express application, typically at the /health endpoint.
 * 
 * Example:
 * GET /health
 * Response: {
 *   "status": "healthy",
 *   "env": "production",
 *   "uptime": 3600.5,
 *   "timestamp": "2024-01-15T10:30:45.123Z",
 *   "memory": {
 *     "rss": 29036544,
 *     "heapTotal": 6488064,
 *     "heapUsed": 4124392,
 *     "external": 1089470
 *   }
 * }
 * 
 * @fileoverview Express Router for comprehensive health check endpoint
 * @version 1.0.0
 * @author Tutorial Implementation Team
 */

// =============================================================================
// IMPORTS
// =============================================================================

/**
 * Express Router for creating modular, mountable route handlers
 * @external express
 * @see {@link https://expressjs.com/en/guide/routing.html} Express.js 5.1.0 routing documentation
 */
const { Router } = require('express'); // v5.1.0

/**
 * Centralized logging utility for request tracking and error reporting
 * Provides structured logging with environment awareness for observability
 */
const { Logger } = require('../utils/logger.js');

/**
 * Runtime environment configuration for health status reporting
 * Provides current environment (development, production, test) for health response
 */
const { env } = require('../config/env.js');

/**
 * Node.js built-in process module for runtime metrics collection
 * Used to access process.uptime(), process.memoryUsage(), and process.env
 * @external process
 * @see {@link https://nodejs.org/api/process.html} Node.js 18+ process documentation
 */
// process is a global object in Node.js - no explicit import needed

// =============================================================================
// GLOBAL CONSTANTS
// =============================================================================

/**
 * Health check endpoint route path
 * Defines the exact route path for the health check endpoint
 * 
 * @constant {string} HEALTHCHECK_ROUTE
 * @default '/health'
 */
const HEALTHCHECK_ROUTE = '/health';

/**
 * Health status constants for consistent status reporting
 * Ensures standardized health status values across all health check responses
 */
const HEALTH_STATUS = {
  HEALTHY: 'healthy',
  UNHEALTHY: 'unhealthy',
  DEGRADED: 'degraded'
};

// =============================================================================
// ROUTER INITIALIZATION
// =============================================================================

/**
 * Express Router instance for health check routes
 * Creates an isolated router instance for mounting health check endpoints
 * 
 * @constant {express.Router} router
 */
const router = Router();

// =============================================================================
// HEALTH CHECK HANDLER IMPLEMENTATION
// =============================================================================

/**
 * Express route handler for GET /health endpoint
 * 
 * Provides comprehensive application health status information including:
 * - Application health status (healthy/unhealthy)
 * - Current runtime environment (development/production/test)
 * - Process uptime in seconds
 * - Current timestamp in ISO8601 format
 * - Memory usage statistics from process.memoryUsage()
 * 
 * The handler logs all health check requests for observability and monitoring
 * purposes, and handles errors gracefully by logging them and passing to the
 * centralized error handler middleware.
 * 
 * This implementation is designed to be:
 * - Fast and lightweight for frequent health check polling
 * - Extensible for future dependency checks (database, external services)
 * - Compatible with load balancers and monitoring systems
 * - Compliant with standard health check patterns
 * 
 * @function healthStatusHandler
 * @param {express.Request} req - Express request object containing request details
 * @param {express.Response} res - Express response object for sending health status
 * @param {express.NextFunction} next - Express next middleware function for error handling
 * @returns {void} Sends JSON health status response or passes error to next()
 * 
 * @example
 * // Successful health check response
 * GET /health
 * HTTP/1.1 200 OK
 * Content-Type: application/json
 * 
 * {
 *   "status": "healthy",
 *   "env": "production",
 *   "uptime": 3600.5,
 *   "timestamp": "2024-01-15T10:30:45.123Z",
 *   "memory": {
 *     "rss": 29036544,
 *     "heapTotal": 6488064,
 *     "heapUsed": 4124392,
 *     "external": 1089470
 *   }
 * }
 * 
 * @example
 * // Error handling example
 * try {
 *   // Health check processing
 * } catch (error) {
 *   // Error is logged and passed to centralized error handler
 *   Logger.error('Health check failed', error);
 *   next(error);
 * }
 */
async function healthStatusHandler(req, res, next) {
  try {
    // Step 1: Capture current timestamp in ISO8601 format
    const timestamp = new Date().toISOString();
    
    // Step 2: Retrieve process uptime in seconds
    const uptime = process.uptime();
    
    // Step 3: Retrieve memory usage statistics from process.memoryUsage()
    const memory = process.memoryUsage();
    
    // Step 4: Build comprehensive health status object
    const healthStatus = {
      status: HEALTH_STATUS.HEALTHY,
      env: env,
      uptime: uptime,
      timestamp: timestamp,
      memory: {
        rss: memory.rss,           // Resident Set Size - total memory allocated
        heapTotal: memory.heapTotal, // Total heap size
        heapUsed: memory.heapUsed,   // Heap memory used
        external: memory.external    // External memory usage
      }
    };
    
    // Step 5: Log the health check request using Logger.info with method, path, and status
    Logger.info('Health check request processed', {
      method: req.method,
      path: req.path,
      status: healthStatus.status,
      uptime: uptime,
      memoryUsedMB: Math.round(memory.heapUsed / 1024 / 1024),
      environment: env,
      timestamp: timestamp
    });
    
    // Step 6: Send the health status object as JSON response with HTTP 200
    res.status(200).json(healthStatus);
    
  } catch (error) {
    // Step 7: If an error occurs, log the error using Logger.error and pass it to next()
    Logger.error('Health check endpoint failed', {
      error: error.message,
      stack: error.stack,
      method: req.method,
      path: req.path,
      timestamp: new Date().toISOString(),
      environment: env
    });
    
    // Pass error to centralized error handler middleware
    next(error);
  }
}

// =============================================================================
// ROUTE REGISTRATION
// =============================================================================

/**
 * Register GET /health endpoint with health status handler
 * 
 * Mounts the health check handler on the health check route, making it available
 * for HTTP GET requests. This endpoint is designed to be:
 * - Frequently accessible by load balancers and monitoring systems
 * - Fast and lightweight to minimize impact on application performance
 * - Comprehensive enough to provide meaningful health status information
 * - Extensible for future health check enhancements
 * 
 * Route Configuration:
 * - Path: HEALTHCHECK_ROUTE ('/health')
 * - Method: GET only
 * - Handler: healthStatusHandler
 * - Response: JSON health status object
 * - Status Code: 200 (success) or 500 (error)
 */
router.get(HEALTHCHECK_ROUTE, healthStatusHandler);

// =============================================================================
// EXTENSIBILITY HOOKS
// =============================================================================

/**
 * Future extensibility placeholder for additional health checks
 * 
 * This section reserves space for future health check enhancements such as:
 * - Database connectivity checks
 * - External service dependency validation
 * - Resource utilization monitoring
 * - Custom application-specific health metrics
 * 
 * Example future enhancements:
 * 
 * // Database connectivity check
 * async function checkDatabase() {
 *   try {
 *     await db.query('SELECT 1');
 *     return { database: 'healthy' };
 *   } catch (error) {
 *     return { database: 'unhealthy', error: error.message };
 *   }
 * }
 * 
 * // External service dependency check
 * async function checkExternalServices() {
 *   const checks = await Promise.allSettled([
 *     checkServiceA(),
 *     checkServiceB()
 *   ]);
 *   return checks.map(check => check.status);
 * }
 * 
 * // Enhanced health status with dependency checks
 * const healthStatus = {
 *   status: HEALTH_STATUS.HEALTHY,
 *   env: env,
 *   uptime: uptime,
 *   timestamp: timestamp,
 *   memory: memory,
 *   dependencies: {
 *     ...await checkDatabase(),
 *     ...await checkExternalServices()
 *   }
 * };
 */

// =============================================================================
// MODULE EXPORTS
// =============================================================================

/**
 * Export the configured health check router
 * 
 * The router is exported as the default export, making it easy to import and
 * mount in the main application or in the healthcheck index module. This
 * router contains all health check related routes and handlers.
 * 
 * Export Structure:
 * - Default export: Configured Express Router instance
 * - Routes included: GET /health
 * - Handlers included: healthStatusHandler
 * - Middleware: Error handling integrated
 * 
 * Integration Points:
 * - Imported by healthcheck/index.js for mounting in main app
 * - Used by monitoring systems and load balancers for health checks
 * - Provides observability data for application monitoring
 * - Supports future extensibility for additional health checks
 * 
 * Usage Example:
 * // In healthcheck/index.js
 * const healthRoutes = require('./routes.js');
 * app.use('/health', healthRoutes);
 * 
 * // In main app.js
 * const healthcheck = require('./healthcheck');
 * app.use(healthcheck);
 * 
 * // Client usage
 * GET /health
 * Response: { status: 'healthy', env: 'production', uptime: 3600.5, ... }
 * 
 * @module healthcheck/routes
 * @exports {express.Router} router - Configured Express Router with health check endpoints
 */
module.exports = router;