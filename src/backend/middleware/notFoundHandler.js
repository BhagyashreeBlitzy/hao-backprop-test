/**
 * Not Found Handler Middleware for Node.js Tutorial Backend
 * 
 * This Express middleware handles all unmatched routes (404 Not Found) in the Node.js tutorial backend.
 * It is registered after all route handlers and serves as the final middleware in the request processing
 * pipeline before error handling middleware. The middleware provides consistent 404 error responses,
 * maintains observability through centralized logging, and demonstrates best practices for Express.js
 * middleware development.
 * 
 * Key Responsibilities:
 * - Intercepts all requests that don't match defined routes
 * - Logs 404 events with request details for observability and debugging
 * - Returns standardized, educationally clear 404 error responses
 * - Prevents information leakage by using centralized error messages
 * - Supports development debugging with optional request details
 * - Ensures consistent error response structure across the application
 * 
 * Middleware Registration:
 * This middleware must be registered after all route handlers in the Express app:
 * ```javascript
 * app.get('/hello', helloHandler);
 * app.use(notFoundHandler);  // Must be after all routes
 * app.use(errorHandler);     // Error handling middleware comes last
 * ```
 * 
 * Educational Value:
 * - Demonstrates proper Express.js middleware patterns
 * - Shows centralized logging integration
 * - Illustrates HTTP status code usage with constants
 * - Provides example of response formatting utility usage
 * - Demonstrates middleware execution flow and response termination
 * 
 * Design Principles:
 * - Centralized Error Handling: Uses shared utilities for consistency
 * - Observability: Comprehensive logging for debugging and monitoring
 * - Security: Prevents information disclosure through generic error messages
 * - Maintainability: Leverages constants and utilities for easy maintenance
 * - Educational Clarity: Comprehensive documentation and clear implementation
 * 
 * @fileoverview Express middleware for handling 404 Not Found responses
 * @author Node.js Tutorial Project
 * @version 1.0.0
 * @requires express ^5.1.0
 */

// Import centralized logging utility for standardized 404 event logging
// The logWarn function provides timestamped, formatted warning messages suitable for
// 404 events which are client-side errors that should be logged but don't indicate
// server-side problems
const { logWarn } = require('../utils/logger.js');

// Import HTTP status code constant for consistent 404 status code usage
// Using constants instead of magic numbers improves code readability and maintenance
// HTTP_NOT_FOUND represents the standard 404 status code
const { HTTP_NOT_FOUND } = require('../utils/httpStatusCodes.js');

// Import standardized error message constant for consistent 404 responses
// NOT_FOUND_MESSAGE provides a user-friendly, generic error message that doesn't
// expose internal system details or provide information that could aid attackers
const { NOT_FOUND_MESSAGE } = require('../utils/constants.js');

// Import centralized response formatting utility for consistent error response structure
// formatErrorResponse ensures all error responses follow the same format and
// handles environment-specific behavior (e.g., including debug details in development)
const { formatErrorResponse } = require('../utils/responseFormatter.js');

/**
 * Express middleware function that handles all unmatched routes (404 Not Found)
 * 
 * This middleware function is invoked when no previously registered route handlers
 * match the incoming request. It provides a standardized way to handle 404 errors
 * by logging the event and returning a consistent error response to the client.
 * 
 * The middleware serves multiple important functions:
 * 1. **Observability**: Logs all 404 events for monitoring and debugging purposes
 * 2. **Consistency**: Ensures all 404 responses follow the same format
 * 3. **Security**: Uses generic error messages to prevent information disclosure
 * 4. **Educational Value**: Demonstrates proper middleware implementation patterns
 * 
 * Middleware Execution Context:
 * - Called after all route handlers have been processed
 * - Receives requests that don't match any defined routes
 * - Terminates the middleware chain by not calling next()
 * - Sends response and ends the request-response cycle
 * 
 * Error Response Behavior:
 * - Development: May include additional request details for debugging
 * - Production: Returns only generic error message for security
 * - Consistent JSON structure matching other application error responses
 * 
 * @param {Object} req - Express request object containing HTTP request information
 * @param {string} req.method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {string} req.originalUrl - Original request URL including query parameters
 * @param {Object} req.headers - HTTP request headers
 * @param {Object} res - Express response object for sending HTTP response
 * @param {Function} next - Express next function (not called in this middleware)
 * @returns {void} Sends 404 error response to client and terminates request cycle
 * 
 * @example
 * // Middleware registration in Express app
 * const express = require('express');
 * const { notFoundHandler } = require('./middleware/notFoundHandler');
 * 
 * const app = express();
 * 
 * // Register route handlers first
 * app.get('/hello', helloHandler);
 * 
 * // Register 404 handler after all routes
 * app.use(notFoundHandler);
 * 
 * // Error handling middleware comes last
 * app.use(errorHandler);
 * 
 * @example
 * // Example 404 response in development environment
 * {
 *   "error": true,
 *   "message": "Resource not found",
 *   "details": {
 *     "method": "GET",
 *     "path": "/nonexistent"
 *   }
 * }
 * 
 * @example
 * // Example 404 response in production environment
 * {
 *   "error": true,
 *   "message": "Resource not found"
 * }
 */
function notFoundHandler(req, res, next) {
    // Step 1: Extract HTTP method and original URL from request object for logging
    // The method indicates what type of HTTP operation was attempted (GET, POST, etc.)
    // The originalUrl includes the full path and query parameters as received by the server
    const method = req.method;
    const path = req.originalUrl;
    
    // Step 2: Log the 404 event using centralized logging utility
    // This provides observability into which endpoints clients are attempting to access
    // The metadata object includes request details for debugging and analysis
    // Using logWarn because 404 errors are client-side issues, not server errors
    logWarn('404 Not Found - Request to undefined endpoint', {
        method: method,
        path: path,
        timestamp: new Date().toISOString(),
        userAgent: req.get('User-Agent') || 'Unknown',
        remoteAddress: req.ip || req.connection.remoteAddress || 'Unknown'
    });
    
    // Step 3: Prepare optional details for development environment debugging
    // These details help developers understand what request caused the 404 error
    // Only included in non-production environments to prevent information disclosure
    const details = {
        method: method,
        path: path,
        requestedAt: new Date().toISOString()
    };
    
    // Step 4: Send standardized 404 error response using centralized formatter
    // formatErrorResponse handles:
    // - Setting appropriate HTTP status code (404)
    // - Setting correct Content-Type header (application/json)
    // - Formatting response body with consistent error structure
    // - Including details only in development environment
    // - Automatically ending the response cycle
    formatErrorResponse(
        res,                    // Express response object
        HTTP_NOT_FOUND,         // HTTP 404 status code constant
        NOT_FOUND_MESSAGE,      // Standardized error message constant
        details                 // Optional request details for development
    );
    
    // Note: We intentionally do NOT call next() here because:
    // 1. formatErrorResponse() ends the response cycle automatically
    // 2. Calling next() after response is sent would cause an error
    // 3. 404 handling should terminate the middleware chain
    // 4. This prevents further middleware execution for unmatched routes
}

/**
 * Module Exports
 * 
 * Exports the notFoundHandler middleware using CommonJS named export syntax
 * for compatibility with Node.js require() system. The named export pattern
 * allows for selective importing and clear dependency management.
 * 
 * Export Benefits:
 * - Selective importing: const { notFoundHandler } = require('./notFoundHandler')
 * - Clear dependency relationships in importing modules
 * - Consistent with other middleware modules in the application
 * - Supports tree-shaking in bundling environments
 * - Maintains compatibility with both CommonJS and ES module systems
 * 
 * Usage Examples:
 * 
 * // Import the specific middleware function
 * const { notFoundHandler } = require('./middleware/notFoundHandler');
 * 
 * // Use in Express application
 * app.use(notFoundHandler);
 * 
 * // Import entire module if needed
 * const notFoundMiddleware = require('./middleware/notFoundHandler');
 * app.use(notFoundMiddleware.notFoundHandler);
 */
module.exports = {
    /**
     * Express middleware function for handling 404 Not Found responses
     * 
     * This middleware should be registered after all route handlers in the Express
     * application to catch requests that don't match any defined routes. It provides
     * consistent error handling, comprehensive logging, and secure error responses.
     * 
     * The middleware demonstrates best practices for:
     * - Express.js middleware development patterns
     * - Centralized error handling and response formatting
     * - Observability through structured logging
     * - Security through controlled information disclosure
     * - Educational clarity through comprehensive documentation
     * 
     * @function notFoundHandler
     * @memberof module:notFoundHandler
     * @type {Function}
     */
    notFoundHandler
};

/**
 * Implementation Notes and Best Practices:
 * 
 * 1. **Middleware Order**: This middleware must be registered after all route handlers
 *    but before error handling middleware to properly catch unmatched routes.
 * 
 * 2. **Response Termination**: The middleware uses formatErrorResponse() which automatically
 *    ends the response cycle, so next() should not be called after it.
 * 
 * 3. **Security Considerations**: The middleware uses generic error messages and only
 *    includes detailed request information in development environments.
 * 
 * 4. **Logging Strategy**: Uses logWarn instead of logError because 404 errors are
 *    client-side issues, not server-side failures.
 * 
 * 5. **Performance Impact**: Minimal performance overhead since this middleware only
 *    executes for unmatched routes, not for successful route matches.
 * 
 * 6. **Observability**: Includes comprehensive metadata in log messages to aid in
 *    debugging and monitoring of API usage patterns.
 * 
 * 7. **Extensibility**: The current implementation can be easily extended to include
 *    additional functionality such as request rate limiting, custom error pages,
 *    or integration with monitoring systems.
 * 
 * 8. **Testing Considerations**: The middleware can be easily unit tested by mocking
 *    the req, res, and next parameters and verifying the correct functions are called
 *    with expected parameters.
 * 
 * Educational Extensions:
 * 
 * Future tutorial extensions could demonstrate:
 * - Custom error page rendering for browser requests
 * - Request analytics and usage pattern tracking
 * - Rate limiting for unknown endpoints
 * - Integration with external monitoring services
 * - Advanced logging with correlation IDs
 * - Custom 404 responses based on request characteristics
 */

/**
 * Integration with Application Architecture:
 * 
 * This middleware integrates with several key application components:
 * 
 * 1. **Logger Utility**: Provides centralized, timestamped logging with metadata
 * 2. **HTTP Status Codes**: Uses constants for maintainable status code management
 * 3. **Constants Module**: Leverages centralized message constants for consistency
 * 4. **Response Formatter**: Ensures consistent error response structure
 * 5. **Express Framework**: Follows Express middleware patterns and conventions
 * 
 * The middleware serves as an excellent example of how individual components can
 * work together to create a cohesive, maintainable application architecture while
 * maintaining clear separation of concerns and promoting code reusability.
 */