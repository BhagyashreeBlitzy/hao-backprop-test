/**
 * Healthcheck Module Entry Point - Monitoring and Observability Integration
 * 
 * This module serves as the entry point for the healthcheck feature, providing
 * a clean integration point between the healthcheck router and the main Express
 * application. It exports the configured healthcheck router that exposes the
 * GET /health endpoint for application monitoring, load balancer health checks,
 * and platform status verification.
 * 
 * This module acts as the healthcheck feature's integration point, designed to be
 * imported by the main application or main routes index for mounting. It provides
 * clean separation of concerns, easier testing, and future extensibility for
 * additional health-related endpoints or dependency checks.
 * 
 * Features:
 * - Exports healthcheck router for main app integration
 * - Provides GET /health endpoint access through router mounting
 * - Supports clean modular architecture and testing isolation
 * - Enables future extensibility for additional health endpoints
 * - Maintains separation between integration and implementation logic
 * 
 * Usage Examples:
 * // Mount in main Express app
 * const { router: healthcheckRouter } = require('./healthcheck');
 * app.use('/health', healthcheckRouter);
 * 
 * // Or mount at root level
 * app.use(healthcheckRouter);
 * 
 * @fileoverview Healthcheck feature entry point for Express.js application integration
 * @author Node.js Tutorial Team
 * @version 1.0.0
 */

// Internal imports - Healthcheck router implementation
const { router } = require('./routes.js'); // Healthcheck router with GET /health endpoint

// Internal imports - Logging and configuration utilities
const { Logger } = require('../utils/logger.js'); // Centralized logging for integration events
const { env } = require('../config/env.js'); // Environment configuration for context

/**
 * Log the healthcheck module initialization for observability
 * Provides visibility into module loading and integration status
 * Includes environment context for deployment tracking
 */
Logger.info('Healthcheck module initialized', {
    module: 'healthcheck/index.js',
    environment: env,
    features: ['GET /health endpoint'],
    integrationReady: true
});

/**
 * Named exports for the healthcheck module
 * Exports the configured router instance for mounting in the main Express app
 * 
 * The exported router provides:
 * - GET /health endpoint for application health monitoring
 * - Comprehensive health status reporting with process metrics
 * - Integrated logging for observability and monitoring
 * - Centralized error handling integration
 * - Fast, lightweight responses suitable for load balancers and monitoring systems
 * 
 * Integration patterns:
 * - Mount with prefix: app.use('/api/health', healthcheckRouter)
 * - Mount at root: app.use(healthcheckRouter) // Endpoint becomes /health
 * - Mount with custom path: app.use('/status', healthcheckRouter)
 */
module.exports = {
    /**
     * Express router instance with healthcheck routes configured
     * Contains the GET /health endpoint implementation for application monitoring
     * 
     * Endpoint Details:
     * - Route: GET /health
     * - Response: JSON health status with uptime, memory, environment info
     * - Status Codes: 200 (healthy), 500 (error conditions)
     * - Content-Type: application/json
     * - Response Time: < 100ms target for monitoring system compatibility
     * 
     * Health Check Response Structure:
     * {
     *   "status": "healthy",
     *   "env": "development|production|test",
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
     * 
     * @type {Router}
     */
    router
};