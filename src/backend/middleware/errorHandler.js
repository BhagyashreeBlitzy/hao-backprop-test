// External imports
const express = require('express'); // v5.1.0 - Express framework with enhanced error handling patterns

// Internal imports
const { logger } = require('../utils/logger.js'); // Centralized logging for error tracking and observability
const { sendServerError } = require('../utils/httpResponses.js'); // Standardized HTTP error response generation

/**
 * Express error-handling middleware function for the Node.js tutorial application.
 * 
 * This middleware serves as the centralized error handler for all unhandled errors
 * that occur during request processing. It implements Express 5.x error-handling
 * patterns with automatic promise rejection forwarding, ensuring consistent error
 * responses and comprehensive logging for observability.
 * 
 * Key Features:
 * - Logs all errors with contextual information for debugging
 * - Sends standardized 500 Internal Server Error responses
 * - Prevents information leakage by not exposing stack traces to clients
 * - Handles both development and production environments appropriately
 * - Supports Express 5.x automatic promise rejection handling
 * 
 * @param {Error} err - The error object passed from Express middleware chain
 * @param {Object} req - Express request object containing request context
 * @param {Object} res - Express response object for sending HTTP responses
 * @param {Function} next - Express next middleware function for delegation
 * @returns {void} Sends HTTP error response and terminates request/response cycle
 */
function errorHandler(err, req, res, next) {
    // Step 1: Check if response headers have already been sent
    // If headers are already sent, delegate to Express's default error handler
    // This prevents attempting to send multiple responses for the same request
    if (res.headersSent) {
        // Headers already sent, delegate to Express's default error handler
        // This ensures proper cleanup and prevents further response attempts
        return next(err);
    }
    
    // Step 2: Log the error using centralized logger with comprehensive context
    // Include error details, request information, and any available request ID
    // This provides comprehensive error tracking for debugging and monitoring
    const errorContext = {
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl || req.url,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    };
    
    // Include request ID if available (common in production environments)
    if (req.id) {
        errorContext.requestId = req.id;
    }
    
    // Include IP address if available for security monitoring
    if (req.ip) {
        errorContext.clientIp = req.ip;
    }
    
    // Log the error with full context for server-side debugging
    logger.error('Unhandled error in request processing', errorContext);
    
    // Step 3: Determine appropriate error message based on environment
    // In development, provide minimal error information (never stack traces)
    // In production, use generic error messages to prevent information disclosure
    let errorMessage = 'Internal Server Error';
    
    // In development environment, provide slightly more context for debugging
    // while still preventing sensitive information leakage
    if (process.env.NODE_ENV === 'development') {
        // Provide basic error type information without exposing implementation details
        errorMessage = err.name && err.name !== 'Error' 
            ? `Internal Server Error: ${err.name}` 
            : 'Internal Server Error';
    }
    
    // Step 4: Send standardized 500 Internal Server Error response
    // Use the centralized sendServerError function for consistent error responses
    // This ensures all error responses follow the same format and include proper headers
    sendServerError(res, errorMessage);
    
    // Note: We don't call next() here as we've handled the error and sent a response
    // The request/response cycle is complete at this point
}

// Export the error handler middleware for use in the Express application
// This will be registered as the last middleware in the Express app to catch
// all unhandled errors from routes and other middleware
module.exports = {
    errorHandler
};