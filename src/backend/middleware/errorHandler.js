/**
 * Express Error Handling Middleware for Node.js Tutorial Backend
 * 
 * This middleware serves as the centralized error handling component for the Express.js application,
 * implementing robust, educationally clear error management that leverages Express 5's promise-aware
 * error handling capabilities. It ensures that any error thrown or rejected in routes or middleware
 * is properly logged, sanitized, and returned as a standardized error response to clients.
 * 
 * Key Features:
 * - Centralized error handling for all unhandled errors in the Express application
 * - Environment-aware error detail exposure (full details in development, sanitized in production)  
 * - Comprehensive error logging with request context for debugging and observability
 * - Standardized error response formatting using shared responseFormatter utility
 * - Express 5 automatic promise rejection handling compatibility
 * - Educational clarity with extensive documentation and clear implementation patterns
 * 
 * Security Considerations:
 * - Never exposes internal error details in production environment
 * - Sanitizes error messages to prevent information disclosure
 * - Logs all errors for security monitoring and incident response
 * - Uses generic error messages for client-facing responses in production
 * 
 * Educational Value:
 * - Demonstrates best practices for Express error middleware implementation
 * - Shows environment-aware error handling patterns
 * - Illustrates proper error logging and response formatting
 * - Provides foundation for understanding production-ready error management
 * 
 * @fileoverview Centralized Express error handling middleware
 * @author Node.js Tutorial Project  
 * @version 1.0.0
 * @requires express ^5.1.0
 */

// Import centralized logging utility for consistent error logging
// logError provides standardized, timestamped error logging with metadata support
const { logError } = require('../utils/logger.js');

// Import standardized response formatting utility for consistent error responses
// formatErrorResponse ensures all error responses follow the same structure and security practices
const { formatErrorResponse } = require('../utils/responseFormatter.js');

// Import HTTP status code constant for internal server errors
// Using named constant improves code readability and maintainability
const { HTTP_INTERNAL_SERVER_ERROR } = require('../utils/httpStatusCodes.js');

// Import generic error message constant for secure error responses
// Prevents information disclosure by providing a safe default error message
const { GENERIC_ERROR_MESSAGE } = require('../utils/constants.js');

/**
 * Express Error Handling Middleware Function
 * 
 * This middleware function implements the Express.js error handling pattern by accepting
 * four parameters (err, req, res, next) as required by Express for error middleware.
 * It leverages Express 5's automatic promise rejection handling to catch both
 * synchronous and asynchronous errors throughout the application.
 * 
 * Error Processing Flow:
 * 1. Extract and determine appropriate HTTP status code from error object
 * 2. Extract and sanitize error message based on environment
 * 3. Collect request context information for development debugging
 * 4. Log comprehensive error details using centralized logging
 * 5. Format and send standardized error response to client
 * 6. Terminate response (do not call next() for handled errors)
 * 
 * Environment Behavior:
 * - Development/Test: Includes stack traces, error details, and request context
 * - Production: Sanitized error messages with no internal details exposed
 * 
 * @param {Error} err - Error object passed by Express or thrown/rejected in middleware/routes
 *                     May contain: message, stack, status, statusCode, and other properties
 * @param {Object} req - Express request object containing HTTP request information
 *                      Provides: method, url, params, query, headers, body for context
 * @param {Object} res - Express response object for sending HTTP response
 *                      Used to: set status, headers, and send formatted error response
 * @param {Function} next - Express next function for passing control to next middleware
 *                         Not typically called in error handlers unless error is unhandled
 * @returns {void} Sends formatted error response to client and logs error details
 * 
 * @example
 * // Used in app.js after all routes and middleware
 * app.use(errorHandler);
 * 
 * @example
 * // Automatically catches errors from async route handlers (Express 5)
 * app.get('/hello', async (req, res) => {
 *   throw new Error('Something went wrong'); // Automatically caught by errorHandler
 * });
 */
function errorHandler(err, req, res, next) {
    // Step 1: Extract HTTP status code from error object with fallback to 500
    // Check both common error status properties to handle different error types
    // Default to HTTP_INTERNAL_SERVER_ERROR (500) for unknown errors
    const statusCode = err.status || err.statusCode || HTTP_INTERNAL_SERVER_ERROR;
    
    // Step 2: Determine appropriate error message based on environment and status code
    // In production: Always use generic message for security (prevent information disclosure)
    // In development/test: Use actual error message for debugging clarity
    let errorMessage;
    if (process.env.NODE_ENV === 'production') {
        // Production environment: Always use generic error message for security
        errorMessage = GENERIC_ERROR_MESSAGE;
    } else {
        // Development/test environment: Use actual error message or fallback to generic
        errorMessage = err.message || GENERIC_ERROR_MESSAGE;
    }
    
    // Step 3: Collect request context information for debugging (development/test only)
    // This information helps developers understand the circumstances of the error
    let requestContext = null;
    if (process.env.NODE_ENV !== 'production') {
        requestContext = {
            // HTTP method (GET, POST, PUT, DELETE, etc.)
            method: req.method,
            // Requested URL path
            url: req.url,
            // Route parameters (e.g., /users/:id -> { id: '123' })
            params: req.params,
            // Query string parameters (e.g., ?filter=active -> { filter: 'active' })
            query: req.query,
            // Client IP address for request tracking
            ip: req.ip || req.connection?.remoteAddress || 'unknown',
            // User agent string for client identification
            userAgent: req.get('User-Agent') || 'unknown'
        };
    }
    
    // Step 4: Prepare error details for development environments
    // Include stack trace and additional error information for debugging
    let errorDetails = null;
    if (process.env.NODE_ENV !== 'production') {
        errorDetails = {
            // Full error stack trace for debugging
            stack: err.stack,
            // Original error message (may differ from sanitized client message)
            originalMessage: err.message,
            // Error name/type for categorization
            name: err.name,
            // HTTP status code for reference
            statusCode: statusCode,
            // Request context for understanding error circumstances
            request: requestContext,
            // Timestamp for correlation with logs
            timestamp: new Date().toISOString()
        };
    }
    
    // Step 5: Log comprehensive error information using centralized logger
    // This ensures all errors are captured for monitoring, debugging, and analysis
    logError('Request processing failed - Error handled by errorHandler middleware', {
        // Error identification and categorization
        errorMessage: err.message || 'Unknown error',
        errorName: err.name || 'Error',
        statusCode: statusCode,
        
        // Request context for debugging (development/test only)
        ...(requestContext && { request: requestContext }),
        
        // Stack trace for development debugging (not in production)
        ...(process.env.NODE_ENV !== 'production' && { 
            stack: err.stack,
            errorDetails: errorDetails
        }),
        
        // Additional error properties that might be useful
        ...(err.code && { errorCode: err.code }),
        ...(err.errno && { errno: err.errno }),
        ...(err.syscall && { syscall: err.syscall })
    });
    
    // Step 6: Send standardized error response to client using response formatter
    // This ensures consistent error response structure across the entire application
    formatErrorResponse(
        res,                    // Express response object
        statusCode,            // HTTP status code (determined from error or default 500)
        errorMessage,          // Sanitized error message (generic in production, actual in dev/test)
        errorDetails           // Additional details (development/test only, null in production)
    );
    
    // Note: Do not call next() for handled errors
    // The error has been processed and response sent, so the request cycle is complete
    // Calling next() would attempt to pass the error to the next error handler,
    // which could result in multiple responses or hanging connections
    
    // Only call next() in exceptional circumstances where this middleware
    // cannot handle the error (should not occur in normal operation)
}

/**
 * Module Exports
 * 
 * Export the errorHandler middleware function for use in Express application setup.
 * This middleware must be registered after all routes and other middleware to
 * catch any errors that occur during request processing.
 * 
 * Usage in app.js:
 * const { errorHandler } = require('./middleware/errorHandler');
 * 
 * // Register after all routes and middleware
 * app.use('/hello', helloRoutes);
 * app.use(notFoundHandler);      // 404 handler before error handler
 * app.use(errorHandler);         // Error handler must be last
 * 
 * Export Benefits:
 * - Named export supports selective importing
 * - Descriptive function name improves code readability
 * - JSDoc documentation preserved for IDE support
 * - Enables easy testing and mocking in test environments
 */
module.exports = {
    /**
     * Express error handling middleware for centralized error management
     * 
     * Implements comprehensive error handling with logging, response formatting,
     * and environment-aware detail exposure. Must be registered as the last
     * middleware in the Express application to catch all unhandled errors.
     * 
     * @function errorHandler
     * @memberof module:errorHandler
     */
    errorHandler
};

/**
 * Integration Notes:
 * 
 * 1. Express 5 Compatibility:
 *    This middleware leverages Express 5's automatic promise rejection handling.
 *    Async route handlers and middleware that throw errors or return rejected
 *    promises will automatically be caught and passed to this error handler.
 * 
 * 2. Middleware Registration Order:
 *    This error handler must be registered AFTER all routes and other middleware:
 *    - Routes (app.get, app.post, etc.)
 *    - Regular middleware (body parsing, cors, etc.)
 *    - Not found handler (404 middleware)
 *    - Error handler (this middleware) - MUST BE LAST
 * 
 * 3. Error Object Properties:
 *    The middleware handles various error object formats:
 *    - Standard Error objects with message and stack
 *    - HTTP errors with status/statusCode properties
 *    - Custom application errors with additional properties
 *    - Express-generated errors from built-in middleware
 * 
 * 4. Security Considerations:
 *    - Production environments never expose internal error details
 *    - Stack traces and request context only available in development/test
 *    - Generic error messages prevent information disclosure attacks
 *    - All errors logged for security monitoring and incident response
 * 
 * 5. Educational Value:
 *    This implementation demonstrates professional error handling patterns:
 *    - Centralized error management
 *    - Environment-aware security practices
 *    - Comprehensive error logging
 *    - Standardized response formatting
 *    - Express.js middleware best practices
 * 
 * 6. Performance Considerations:
 *    - Minimal overhead in production (no detail collection)
 *    - Efficient error object property extraction
 *    - Single response per error (no duplicate responses)
 *    - Proper request lifecycle termination
 * 
 * 7. Monitoring and Observability:
 *    - All errors logged with structured metadata
 *    - Request context captured for debugging
 *    - Error categorization through status codes
 *    - Integration with centralized logging system
 */

/**
 * Error Handling Best Practices Demonstrated:
 * 
 * 1. Never Ignore Errors:
 *    All errors are logged and responded to appropriately.
 * 
 * 2. Environment-Aware Error Details:
 *    Development gets full details, production gets sanitized responses.
 * 
 * 3. Consistent Error Response Format:
 *    All errors use the same response structure via formatErrorResponse.
 * 
 * 4. Comprehensive Error Logging:
 *    Errors include request context, stack traces, and metadata.
 * 
 * 5. Security-First Approach:
 *    Production never exposes internal system details to clients.
 * 
 * 6. Proper Middleware Integration:
 *    Follows Express.js patterns and integrates with application architecture.
 * 
 * 7. Educational Documentation:
 *    Extensive comments explain concepts for learning purposes.
 * 
 * This error handler serves as both a production-ready component and an
 * educational example of professional Node.js error handling practices.
 */