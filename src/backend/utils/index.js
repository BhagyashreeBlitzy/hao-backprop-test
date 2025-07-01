/**
 * Central Export Hub for Backend Utility Modules
 * 
 * This module serves as the centralized export point for all backend utility
 * classes and functions, enabling convenient, consistent, and maintainable imports
 * throughout the backend codebase. It re-exports custom error types and logger
 * utilities to support best practices in modularity and code organization.
 * 
 * Features:
 * - Single import point for error handling utilities
 * - Centralized access to logging functionality
 * - Consistent export interface for all utility modules
 * - Support for tree-shaking and selective imports
 * - Comprehensive error management and observability tools
 * 
 * This export hub addresses key requirements:
 * - Error Management: Provides custom error types for operational and programmer errors
 * - Monitoring and Observability: Ensures logger utility accessibility for request, error, and performance logging
 * - Response Generation: Supports standardized error responses with proper HTTP status codes
 * 
 * Compatible with Node.js 18+ and Express.js 5.1.0
 * 
 * @fileoverview Central export hub for backend utility modules
 * @module utils/index
 * @author Backend Development Team
 * @version 1.0.0
 * @since Node.js 18+
 */

// Import all error classes from errorTypes module
// These provide standardized HTTP error handling with proper status codes and messages
const {
    HttpError,
    NotFoundError,
    MethodNotAllowedError,
    InternalServerError
} = require('./errorTypes.js');

// Import Logger class from logger module
// This provides static logging methods with environment-aware output and structured formatting
const { Logger } = require('./logger.js');

/**
 * Re-export HttpError class for base HTTP error handling
 * 
 * Base class for all HTTP-related errors in the application. Provides consistent
 * error structure with HTTP status codes, human-readable messages, and optional
 * debugging details. Integrates seamlessly with Express.js error handling middleware.
 * 
 * @class HttpError
 * @extends {Error}
 * @property {number} status - HTTP status code for the error response
 * @property {string} message - Human-readable error message for client communication
 * @property {object} [details] - Optional details object for debugging or client feedback
 * 
 * @example
 * // Import and use HttpError
 * const { HttpError } = require('./utils');
 * throw new HttpError(400, 'Bad Request', { field: 'email', reason: 'invalid format' });
 * 
 * @example
 * // Express.js error handling middleware integration
 * app.use((err, req, res, next) => {
 *   if (err instanceof HttpError) {
 *     res.status(err.status).json({ error: err.message, details: err.details });
 *   }
 * });
 */
module.exports.HttpError = HttpError;

/**
 * Re-export NotFoundError class for 404 Not Found scenarios
 * 
 * Specialized error class for missing resources or routes. Automatically sets
 * HTTP status to 404 and provides appropriate default messaging. Used when
 * requested resources, routes, or endpoints cannot be found on the server.
 * 
 * @class NotFoundError
 * @extends {HttpError}
 * @property {number} status - Always 404 (Not Found)
 * @property {string} message - Default "Not Found" message or custom message
 * @property {object} [details] - Optional details for debugging missing resources
 * 
 * @example
 * // Import and use NotFoundError
 * const { NotFoundError } = require('./utils');
 * throw new NotFoundError('User not found', { userId: '12345' });
 * 
 * @example
 * // Route handler for undefined endpoints
 * app.use((req, res, next) => {
 *   next(new NotFoundError(`Route ${req.path} not found`));
 * });
 */
module.exports.NotFoundError = NotFoundError;

/**
 * Re-export MethodNotAllowedError class for 405 Method Not Allowed scenarios
 * 
 * Specialized error class for unsupported HTTP methods on endpoints. Automatically
 * sets HTTP status to 405 and provides appropriate messaging. Used when clients
 * attempt to use HTTP methods that are not supported by the requested endpoint.
 * 
 * @class MethodNotAllowedError
 * @extends {HttpError}
 * @property {number} status - Always 405 (Method Not Allowed)
 * @property {string} message - Default "Method Not Allowed" message or custom message
 * @property {object} [details] - Optional details including allowed methods
 * 
 * @example
 * // Import and use MethodNotAllowedError
 * const { MethodNotAllowedError } = require('./utils');
 * throw new MethodNotAllowedError('POST method not supported', { 
 *   allowed: ['GET'], 
 *   requested: 'POST' 
 * });
 * 
 * @example
 * // Route-specific method validation
 * app.get('/hello', (req, res, next) => {
 *   if (req.method !== 'GET') {
 *     return next(new MethodNotAllowedError());
 *   }
 *   res.send('Hello world');
 * });
 */
module.exports.MethodNotAllowedError = MethodNotAllowedError;

/**
 * Re-export InternalServerError class for 500 Internal Server Error scenarios
 * 
 * Specialized error class for unexpected server-side errors and system failures.
 * Automatically sets HTTP status to 500 and provides secure error messaging that
 * doesn't expose sensitive system information in production environments.
 * 
 * @class InternalServerError
 * @extends {HttpError}
 * @property {number} status - Always 500 (Internal Server Error)
 * @property {string} message - Default "Internal Server Error" message or custom message
 * @property {object} [details] - Optional details for internal debugging (not exposed to clients)
 * 
 * @example
 * // Import and use InternalServerError
 * const { InternalServerError } = require('./utils');
 * throw new InternalServerError('Service temporarily unavailable', { 
 *   service: 'database', 
 *   error: 'connection_timeout' 
 * });
 * 
 * @example
 * // Unhandled exception handling
 * process.on('uncaughtException', (err) => {
 *   Logger.error('Uncaught exception', new InternalServerError('System error', { 
 *     originalError: err.message 
 *   }));
 * });
 */
module.exports.InternalServerError = InternalServerError;

/**
 * Re-export Logger class for centralized logging functionality
 * 
 * Static logging utility that provides consistent, structured, and environment-aware
 * logging capabilities. Offers standardized logging methods for info, warn, error,
 * and debug levels with proper formatting, timestamping, and environment-based
 * verbosity control for comprehensive observability and monitoring.
 * 
 * @class Logger
 * @static
 * @property {function} info - Logs informational messages for general application events
 * @property {function} warn - Logs warning messages for potentially problematic situations
 * @property {function} error - Logs error messages with support for Error object stack traces
 * @property {function} debug - Logs debug messages for detailed diagnostic information (dev/test only)
 * 
 * @example
 * // Import and use Logger
 * const { Logger } = require('./utils');
 * Logger.info('Server started successfully', { port: 3000, environment: 'development' });
 * 
 * @example
 * // Error logging with Error object
 * const { Logger, InternalServerError } = require('./utils');
 * try {
 *   // Some operation that might fail
 * } catch (err) {
 *   Logger.error('Operation failed', err);
 *   throw new InternalServerError('Service unavailable');
 * }
 * 
 * @example
 * // Request logging middleware
 * app.use((req, res, next) => {
 *   Logger.info('Incoming request', { 
 *     method: req.method, 
 *     path: req.path, 
 *     userAgent: req.get('User-Agent') 
 *   });
 *   next();
 * });
 */
module.exports.Logger = Logger;

/**
 * Utility function to check if an error is an instance of any custom error type
 * 
 * Provides a convenient way to identify if an error is one of the custom HTTP
 * error types defined in this module. Useful for error handling middleware and
 * conditional error processing throughout the application.
 * 
 * @function isCustomError
 * @param {Error} error - The error instance to check
 * @returns {boolean} True if the error is a custom HTTP error type, false otherwise
 * 
 * @example
 * // Import and use isCustomError utility
 * const { isCustomError, NotFoundError } = require('./utils');
 * 
 * try {
 *   throw new NotFoundError('Resource not found');
 * } catch (err) {
 *   if (isCustomError(err)) {
 *     console.log('Custom error detected:', err.status, err.message);
 *   }
 * }
 * 
 * @example
 * // Express.js error handling middleware
 * app.use((err, req, res, next) => {
 *   if (isCustomError(err)) {
 *     res.status(err.status).json({ error: err.message });
 *   } else {
 *     res.status(500).json({ error: 'Internal Server Error' });
 *   }
 * });
 */
function isCustomError(error) {
    return error instanceof HttpError ||
           error instanceof NotFoundError ||
           error instanceof MethodNotAllowedError ||
           error instanceof InternalServerError;
}

// Export the utility function
module.exports.isCustomError = isCustomError;

/**
 * Utility function to create standardized error responses
 * 
 * Creates consistent error response objects with proper structure for HTTP
 * responses. Ensures all error responses follow the same format with status,
 * message, and optional details, supporting standardized client communication.
 * 
 * @function createErrorResponse
 * @param {HttpError} error - The custom error instance to format
 * @param {boolean} [includeDetails=false] - Whether to include error details in the response
 * @returns {object} Standardized error response object
 * @returns {number} returns.status - HTTP status code
 * @returns {string} returns.error - Error message
 * @returns {object} [returns.details] - Error details (if includeDetails is true and details exist)
 * @returns {string} returns.timestamp - ISO timestamp of the error
 * 
 * @example
 * // Import and use createErrorResponse utility
 * const { createErrorResponse, NotFoundError } = require('./utils');
 * 
 * const error = new NotFoundError('User not found', { userId: '12345' });
 * const response = createErrorResponse(error, true);
 * // Returns: { status: 404, error: 'User not found', details: { userId: '12345' }, timestamp: '...' }
 * 
 * @example
 * // Express.js route error handling
 * app.get('/users/:id', (req, res, next) => {
 *   try {
 *     // User lookup logic here
 *     throw new NotFoundError('User not found');
 *   } catch (err) {
 *     if (isCustomError(err)) {
 *       const errorResponse = createErrorResponse(err, process.env.NODE_ENV !== 'production');
 *       return res.status(errorResponse.status).json(errorResponse);
 *     }
 *     next(err);
 *   }
 * });
 */
function createErrorResponse(error, includeDetails = false) {
    // Validate that the error is a custom HTTP error
    if (!isCustomError(error)) {
        throw new Error('createErrorResponse requires a custom HTTP error instance');
    }
    
    // Create base response object
    const response = {
        status: error.status,
        error: error.message,
        timestamp: new Date().toISOString()
    };
    
    // Include details if requested and available
    if (includeDetails && error.details) {
        response.details = error.details;
    }
    
    return response;
}

// Export the utility function
module.exports.createErrorResponse = createErrorResponse;

/**
 * Utility function for logging errors with appropriate level based on status code
 * 
 * Automatically determines the appropriate log level for errors based on their
 * HTTP status code and logs them with consistent formatting. Helps maintain
 * proper observability by ensuring all errors are logged at appropriate levels.
 * 
 * @function logError
 * @param {HttpError} error - The custom error instance to log
 * @param {object} [context] - Additional context information for the log entry
 * @returns {void} Logs the error using the appropriate Logger method
 * 
 * @example
 * // Import and use logError utility
 * const { logError, NotFoundError } = require('./utils');
 * 
 * const error = new NotFoundError('User not found', { userId: '12345' });
 * logError(error, { requestId: 'req-123', endpoint: '/users/12345' });
 * 
 * @example
 * // Express.js middleware error logging
 * app.use((err, req, res, next) => {
 *   if (isCustomError(err)) {
 *     logError(err, { 
 *       method: req.method, 
 *       path: req.path, 
 *       userAgent: req.get('User-Agent') 
 *     });
 *   }
 *   next(err);
 * });
 */
function logError(error, context) {
    // Validate that the error is a custom HTTP error
    if (!isCustomError(error)) {
        Logger.error('Invalid error type passed to logError', { 
            errorType: typeof error, 
            errorName: error?.constructor?.name 
        });
        return;
    }
    
    // Prepare log metadata
    const logMeta = {
        status: error.status,
        errorName: error.name,
        ...(error.details && { errorDetails: error.details }),
        ...(context && { context })
    };
    
    // Log at appropriate level based on status code
    if (error.status >= 500) {
        // Server errors (5xx) - log as errors
        Logger.error(`Server Error (${error.status}): ${error.message}`, logMeta);
    } else if (error.status >= 400) {
        // Client errors (4xx) - log as warnings
        Logger.warn(`Client Error (${error.status}): ${error.message}`, logMeta);
    } else {
        // Other status codes - log as info
        Logger.info(`HTTP Error (${error.status}): ${error.message}`, logMeta);
    }
}

// Export the utility function
module.exports.logError = logError;

/**
 * Export summary for convenient destructuring imports
 * 
 * This module exports provide comprehensive utilities for error handling and logging:
 * 
 * Error Classes:
 * - HttpError: Base class for HTTP errors with status, message, and details
 * - NotFoundError: 404 errors for missing resources
 * - MethodNotAllowedError: 405 errors for unsupported HTTP methods  
 * - InternalServerError: 500 errors for server failures
 * 
 * Logging Utility:
 * - Logger: Static logging class with info, warn, error, and debug methods
 * 
 * Utility Functions:
 * - isCustomError: Check if error is a custom HTTP error type
 * - createErrorResponse: Create standardized error response objects
 * - logError: Log errors with appropriate level based on status code
 * 
 * @example
 * // Named imports for specific utilities
 * const { HttpError, Logger, isCustomError } = require('./utils');
 * 
 * @example
 * // Import all utilities
 * const utils = require('./utils');
 * const error = new utils.NotFoundError('Resource not found');
 * utils.Logger.error('Error occurred', error);
 * 
 * @example
 * // Destructured import in Express.js route
 * const { NotFoundError, Logger, createErrorResponse } = require('../utils');
 * 
 * app.get('/hello', (req, res, next) => {
 *   try {
 *     Logger.info('Processing hello request');
 *     res.send('Hello world');
 *   } catch (err) {
 *     Logger.error('Hello endpoint error', err);
 *     next(new InternalServerError('Service unavailable'));
 *   }
 * });
 */