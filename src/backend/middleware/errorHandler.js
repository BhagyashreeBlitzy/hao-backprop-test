/**
 * Express Error-Handling Middleware for Standardized Error Response Formatting and Logging
 * 
 * This middleware serves as the central error handling point for the Express.js application,
 * providing consistent error response formatting, secure error handling, and comprehensive
 * error logging. It distinguishes between operational errors (HttpError instances) and
 * unexpected system errors, ensuring appropriate handling for each scenario.
 * 
 * Features:
 * - Centralized error handling for all Express.js routes and middleware
 * - Operational vs. programmer error distinction using HttpError class hierarchy
 * - Environment-aware error response formatting (development vs. production)
 * - Structured error logging using the centralized Logger utility
 * - Security-focused error responses that prevent information leakage in production
 * - Complete integration with custom error types from utils/errorTypes.js
 * - Express.js middleware pipeline compliance with proper next() handling
 * 
 * Security Considerations:
 * - Production responses exclude stack traces and sensitive error details
 * - Development responses include full error context for debugging
 * - All errors are logged internally regardless of environment
 * - Generic error messages prevent system information disclosure
 * 
 * Compatible with Express.js 5.1.0 and Node.js 18+
 * 
 * @fileoverview Express error-handling middleware for standardized error responses
 * @author Backend Development Team
 * @version 1.0.0
 * @since Node.js 18+
 */

// Internal imports - Application utilities and configuration
const { Logger } = require('../utils/logger.js'); // Centralized logging utility for structured error logging
const { HttpError, InternalServerError } = require('../utils/errorTypes.js'); // Custom error classes for HTTP error handling
const { env } = require('../config/env.js'); // Environment configuration for context-aware behavior

// Node.js built-in imports
// Node.js 18+ - Built-in process global for environment checks
const process = require('process');

/**
 * Production environment check for secure error handling
 * Controls error response detail level to prevent information disclosure
 * 
 * @constant {boolean}
 */
const IS_PRODUCTION = env === 'production';

/**
 * Express error-handling middleware function for centralized error processing.
 * 
 * This middleware catches all errors thrown in the Express.js request pipeline,
 * provides standardized error logging, and sends appropriate HTTP error responses
 * to clients. It implements security best practices by hiding sensitive information
 * in production while providing comprehensive debugging information in development.
 * 
 * Error Processing Flow:
 * 1. Determines if error is operational (HttpError) or unexpected (system error)
 * 2. Wraps unexpected errors in InternalServerError for consistent handling
 * 3. Logs complete error details using structured logging
 * 4. Constructs environment-appropriate response payload
 * 5. Sends JSON error response with proper HTTP status code
 * 6. Ensures Express.js middleware pipeline compliance
 * 
 * Response Format (Development):
 * {
 *   "status": 404,
 *   "message": "Resource not found",
 *   "details": { "resource": "user", "id": "123" },
 *   "stack": "Error: Resource not found\n    at ..."
 * }
 * 
 * Response Format (Production):
 * {
 *   "status": 404,
 *   "message": "Resource not found"
 * }
 * 
 * @function errorHandler
 * @param {Error} err - The error object caught by Express.js error handling pipeline
 * @param {Request} req - Express.js request object containing client request information
 * @param {Response} res - Express.js response object for sending HTTP responses to client
 * @param {Function} next - Express.js next function for continuing middleware pipeline
 * @returns {void} Sends HTTP error response to client and logs error details
 * 
 * @example
 * // Register as Express.js error-handling middleware (must be last)
 * app.use(errorHandler);
 * 
 * @example
 * // Handles HttpError instances with preserved status and message
 * throw new NotFoundError('User not found', { userId: 123 });
 * // Response: { "status": 404, "message": "User not found" }
 * 
 * @example
 * // Handles unexpected errors wrapped in InternalServerError
 * throw new Error('Database connection failed');
 * // Response: { "status": 500, "message": "Internal Server Error" }
 */
function errorHandler(err, req, res, next) {
    // Step 1: Check if err is an instance of HttpError
    // This determines whether we're dealing with an operational error (expected)
    // or a programmer/system error (unexpected) that needs to be wrapped
    let processedError;
    
    if (err instanceof HttpError) {
        // Error is already a properly structured HttpError instance
        // Use it directly without modification to preserve status, message, and details
        processedError = err;
    } else {
        // Step 2: If not HttpError, wrap err in InternalServerError
        // This converts unexpected errors into standardized HTTP error format
        // Preserves original error information in details for debugging
        const originalErrorDetails = {
            // Capture original error name and message for internal logging
            originalName: err.name || 'Error',
            originalMessage: err.message || 'Unknown error occurred',
            // Include error code if available (useful for system errors)
            ...(err.code && { originalCode: err.code }),
            // Include stack trace for internal debugging
            ...(err.stack && { originalStack: err.stack })
        };
        
        // Create new InternalServerError with generic message and detailed context
        processedError = new InternalServerError('Internal Server Error', originalErrorDetails);
    }
    
    // Step 3: Log the error using Logger.error with comprehensive context
    // Includes all error details for observability and troubleshooting
    const logContext = {
        // HTTP status code for error classification
        status: processedError.status,
        // Error message for human readability
        message: processedError.message,
        // Request context for debugging
        method: req.method,
        url: req.url,
        userAgent: req.get('User-Agent'),
        // Include error details if available
        ...(processedError.details && { details: processedError.details }),
        // Include stack trace for debugging
        ...(processedError.stack && { stack: processedError.stack })
    };
    
    // Log error to centralized logging system
    Logger.error('Express error handler caught error', logContext);
    
    // Step 4: Determine response status code and message from the error object
    const responseStatus = processedError.status;
    const responseMessage = processedError.message;
    
    // Step 5 & 6: Build response payload based on environment
    // Production: Minimal, secure response without sensitive information
    // Development/Test: Comprehensive response with debugging information
    let responsePayload = {
        status: responseStatus,
        message: responseMessage
    };
    
    if (IS_PRODUCTION) {
        // Step 5: If IS_PRODUCTION, omit stack trace and sensitive details from response
        // Only include basic error information to prevent information disclosure
        // Details are still logged internally for observability
        if (processedError.details && typeof processedError.details === 'object') {
            // In production, only include non-sensitive details that are safe for client consumption
            // Filter out internal system information, stack traces, and sensitive data
            const safeDetails = {};
            const safeKeys = ['field', 'reason', 'resource', 'id', 'code'];
            
            for (const key of safeKeys) {
                if (processedError.details[key] !== undefined && 
                    typeof processedError.details[key] !== 'object') {
                    safeDetails[key] = processedError.details[key];
                }
            }
            
            // Only include details if there are safe keys to expose
            if (Object.keys(safeDetails).length > 0) {
                responsePayload.details = safeDetails;
            }
        }
    } else {
        // Step 6: If not IS_PRODUCTION, include stack trace and error details for debugging
        // Provides comprehensive error information for development and testing
        
        // Include details if available
        if (processedError.details && typeof processedError.details === 'object') {
            responsePayload.details = processedError.details;
        }
        
        // Include stack trace for debugging
        if (processedError.stack) {
            responsePayload.stack = processedError.stack;
        }
    }
    
    // Step 8: Ensure headers are not sent twice (check res.headersSent before sending)
    // Prevents "Cannot set headers after they are sent" errors
    if (res.headersSent) {
        // Headers already sent, cannot send response
        // Log this situation and delegate to Express.js default error handler
        Logger.error('Cannot send error response - headers already sent', {
            status: responseStatus,
            message: responseMessage,
            url: req.url,
            method: req.method
        });
        
        // Step 9: Call next() with error to continue Express.js error pipeline
        return next(processedError);
    }
    
    // Step 7: Send a JSON response with the constructed payload
    // Set appropriate HTTP status code and send structured JSON response
    try {
        res.status(responseStatus).json(responsePayload);
        
        // Response successfully sent, no need to call next()
        // Express.js error handling middleware should not call next() when response is sent
        return;
    } catch (responseError) {
        // Error occurred while sending response
        // Log the response error and delegate to Express.js default error handler
        Logger.error('Error occurred while sending error response', {
            originalError: {
                status: responseStatus,
                message: responseMessage
            },
            responseError: {
                name: responseError.name,
                message: responseError.message,
                stack: responseError.stack
            },
            url: req.url,
            method: req.method
        });
        
        // Step 9: Call next() with original error for Express.js default handling
        return next(processedError);
    }
}

/**
 * Named exports for Express error-handling middleware
 * Provides the errorHandler function for use in Express.js application setup
 * Ensures centralized, standardized error handling across the entire application
 */
module.exports = {
    /**
     * Express error-handling middleware function for centralized error processing
     * Must be registered after all route handlers in the Express.js application
     * 
     * @type {Function}
     */
    errorHandler
};