/**
 * Centralized Middleware Export Module for Express.js Application
 * 
 * This module serves as a single import point for all Express middleware used in the backend
 * application, providing consistent and maintainable middleware registration patterns. It
 * re-exports core middleware components including error handling and request logging to
 * support best practices for modularity and code organization.
 * 
 * Features:
 * - Centralized export point for all Express middleware components
 * - Simplified import paths for app.js and server.js configuration
 * - Supports scalable middleware management as the application grows
 * - Promotes separation of concerns through modular middleware architecture
 * - Ensures consistent middleware registration order across environments
 * 
 * Usage Pattern:
 * The middleware should be imported and registered in the correct order:
 * 1. requestLogger as the first middleware for comprehensive request/response logging
 * 2. errorHandler as the last middleware for centralized error handling after all routes
 * 
 * This pattern supports Express.js best practices and ensures proper middleware pipeline
 * execution with comprehensive observability and error management.
 * 
 * @fileoverview Centralized middleware exports for Express.js application
 * @author Backend Development Team
 * @version 1.0.0
 * @since Node.js 18+
 */

// Internal middleware imports - Core Express middleware components
const { errorHandler } = require('./errorHandler.js'); // Express error-handling middleware for standardized error response formatting and logging
const { requestLogger } = require('./requestLogger.js'); // Express middleware for logging HTTP requests and responses with structured, environment-aware output

/**
 * Named exports for all Express middleware components
 * 
 * This export pattern enables selective importing of middleware components while maintaining
 * a centralized location for middleware registration. It supports tree-shaking optimization
 * and provides clear dependency management for the Express application setup.
 * 
 * @namespace MiddlewareExports
 */
module.exports = {
    /**
     * Express error-handling middleware for standardized error response formatting and logging
     * 
     * Provides centralized error handling for all Express routes and middleware, ensuring
     * consistent error response formatting, secure error handling, and comprehensive error
     * logging. Distinguishes between operational errors (HttpError instances) and unexpected
     * system errors for appropriate handling.
     * 
     * Registration Order: Must be registered AFTER all route handlers and other middleware
     * to ensure it catches all errors thrown in the Express pipeline.
     * 
     * @function errorHandler
     * @param {Error} err - The error object caught by Express.js error handling pipeline
     * @param {Request} req - Express.js request object containing client request information
     * @param {Response} res - Express.js response object for sending HTTP responses to client
     * @param {Function} next - Express.js next function for continuing middleware pipeline
     * @returns {void} Sends HTTP error response to client and logs error details
     * 
     * @example
     * // Register in app.js after all routes
     * const { errorHandler } = require('./middleware');
     * app.use('/api', routes);
     * app.use(errorHandler); // Must be last
     */
    errorHandler,

    /**
     * Express middleware for logging HTTP requests and responses with structured, environment-aware output
     * 
     * Provides comprehensive HTTP request and response logging with structured output for
     * observability and troubleshooting. Integrates with the centralized Logger utility to
     * ensure consistent logging patterns across the application with environment-aware
     * configuration and high-resolution timing for performance monitoring.
     * 
     * Registration Order: Should be registered FIRST to ensure comprehensive coverage of all
     * incoming requests, including those that result in errors or are handled by other middleware.
     * 
     * @function requestLogger
     * @param {Object} req - Express Request object containing HTTP request information
     * @param {Object} res - Express Response object for HTTP response handling
     * @param {Function} next - Express next middleware function for continuing the chain
     * @returns {void} Calls next() to continue middleware execution after setting up logging
     * 
     * @example
     * // Register in app.js as first middleware
     * const { requestLogger } = require('./middleware');
     * app.use(requestLogger); // Must be first
     * app.use('/api', routes);
     */
    requestLogger
};