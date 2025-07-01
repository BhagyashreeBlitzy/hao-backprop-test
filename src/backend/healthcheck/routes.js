/**
 * Express Router for Healthcheck Feature - Monitoring and Observability
 * 
 * This module implements the Express Router for the healthcheck feature, exposing
 * the GET /health endpoint for application monitoring. Provides comprehensive
 * application health information including status, uptime, timestamp, memory usage,
 * and environment details in a standardized JSON format.
 * 
 * Integrates with centralized logging (Logger) for observability and supports
 * future extensibility for dependency checks. Handles errors gracefully, passing
 * them to the centralized error handler middleware.
 * 
 * Features:
 * - Application health status monitoring endpoint
 * - Process uptime and memory usage metrics
 * - Environment-aware health reporting
 * - Structured logging for healthcheck requests
 * - Centralized error handling integration
 * - Fast, lightweight response suitable for load balancers
 * 
 * @fileoverview Healthcheck routes implementation for monitoring and observability
 * @author Node.js Tutorial Team
 * @version 1.0.0
 */

// External imports - Express.js framework components
const { Router } = require('express'); // Express.js 5.1.0 - Creates isolated router instance

// Internal imports - Application utilities and configuration
const { Logger } = require('../utils/logger.js'); // Centralized logging utility for observability
const { env } = require('../config/env.js'); // Current runtime environment configuration

// Node.js built-in imports
// Node.js 18+ - Built-in process global for system metrics and environment access
const process = require('process');

/**
 * Healthcheck route constant for endpoint definition
 * Defines the standard health endpoint path used by monitoring systems,
 * load balancers, and platform health checks
 * 
 * @constant {string}
 * @default '/health'
 */
const HEALTHCHECK_ROUTE = '/health';

/**
 * Express router instance for healthcheck endpoints
 * Creates an isolated router for mounting healthcheck routes,
 * enabling modular route organization and middleware isolation
 * 
 * @type {Router}
 */
const router = Router();

/**
 * Express route handler for GET /health endpoint
 * 
 * Responds with comprehensive application health status including:
 * - Application status indicator ('healthy')
 * - Current runtime environment
 * - Process uptime in seconds
 * - ISO8601 timestamp of the health check
 * - Memory usage statistics from process.memoryUsage()
 * 
 * Logs all healthcheck requests using the centralized Logger for observability
 * and monitoring. Handles any errors gracefully by passing them to the
 * centralized error handler middleware via next().
 * 
 * This endpoint is designed to be fast and lightweight, suitable for frequent
 * polling by monitoring systems, load balancers, and container orchestrators.
 * 
 * @function healthStatusHandler
 * @param {Object} req - Express Request object containing request details
 * @param {Object} res - Express Response object for sending the health status
 * @param {Function} next - Express next middleware function for error handling
 * @returns {void} Sends JSON health status response or passes error to next()
 * 
 * @example
 * // Successful health check response
 * {
 *   "status": "healthy",
 *   "env": "development",
 *   "uptime": 3600.123,
 *   "timestamp": "2024-01-01T12:00:00.000Z",
 *   "memory": {
 *     "rss": 25165824,
 *     "heapTotal": 8388608,
 *     "heapUsed": 4194304,
 *     "external": 1048576,
 *     "arrayBuffers": 0
 *   }
 * }
 */
function healthStatusHandler(req, res, next) {
    try {
        // Step 1: Capture current timestamp in ISO8601 format for consistent time reporting
        const timestamp = new Date().toISOString();
        
        // Step 2: Retrieve process uptime in seconds for application runtime monitoring
        const uptime = process.uptime();
        
        // Step 3: Retrieve memory usage statistics for resource monitoring
        const memory = process.memoryUsage();
        
        // Step 4: Build comprehensive health status object with all metrics
        const healthStatus = {
            status: 'healthy',
            env: env,
            uptime: uptime,
            timestamp: timestamp,
            memory: memory
        };
        
        // Step 5: Log the healthcheck request for observability and monitoring
        Logger.info('Healthcheck request processed', {
            method: req.method,
            path: req.path,
            status: healthStatus.status,
            uptime: uptime,
            memoryUsed: memory.heapUsed,
            memoryTotal: memory.heapTotal
        });
        
        // Step 6: Send the health status object as JSON response with HTTP 200
        res.status(200).json(healthStatus);
        
    } catch (error) {
        // Step 7: Handle any errors gracefully with logging and centralized error handling
        Logger.error('Healthcheck request failed', {
            method: req.method,
            path: req.path,
            error: error.message,
            stack: error.stack
        });
        
        // Pass the error to the centralized error handler middleware
        next(error);
    }
}

/**
 * Route registration for the healthcheck endpoint
 * Registers the GET /health route with the healthStatusHandler function,
 * making the endpoint available for monitoring and health checks
 */
router.get(HEALTHCHECK_ROUTE, healthStatusHandler);

/**
 * Named exports for the healthcheck router
 * Exports the configured router instance for mounting in the main Express app,
 * typically at the root level or under a specific path prefix
 * 
 * The router provides:
 * - GET /health endpoint for application health monitoring
 * - Comprehensive health status reporting with metrics
 * - Integrated logging for observability
 * - Error handling through centralized middleware
 * - Fast, lightweight responses suitable for monitoring systems
 */
module.exports = {
    /**
     * Express router instance with healthcheck routes configured
     * Contains the GET /health endpoint for application monitoring
     * 
     * @type {Router}
     */
    router
};