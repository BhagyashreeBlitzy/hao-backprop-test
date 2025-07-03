/**
 * Express Error-Handling Middleware for Standardized Error Response Formatting and Logging
 * 
 * This middleware serves as the central error handling point for the Express.js application,
 * catching all errors thrown in the request pipeline and providing standardized, secure
 * error responses to clients. It distinguishes between operational errors (HttpError instances)
 * and programmer/system errors, logging all errors with appropriate detail levels and
 * ensuring no sensitive information is leaked in production environments.
 * 
 * Key Features:
 * - Centralized error handling for all Express routes and middleware
 * - Operational vs programmer error classification and handling
 * - Environment-aware error response formatting (production vs development)
 * - Comprehensive error logging with structured metadata
 * - Security-focused error response generation
 * - Stack trace exposure control based on environment
 * - Header-sent state validation to prevent double responses
 * 
 * Requirements Addressed:
 * - Error Management (1.3.1): Provides basic error handling and logging with custom error types
 * - Response Generation Feature (2.1.4): Ensures standardized error responses with proper HTTP status codes
 * - Security and Error Handling (2.4.4): Prevents sensitive information leakage in production
 * 
 * Usage:
 * This middleware must be registered after all route handlers in the Express app:
 * app.use(errorHandler);
 * 
 * @fileoverview Express error-handling middleware for standardized error responses
 * @version 1.0.0
 * @author Tutorial Implementation Team
 */

// =============================================================================
// IMPORTS
// =============================================================================

/**
 * Centralized logging utility for structured error logging
 * Provides environment-aware logging with proper formatting and metadata handling
 */
const { Logger } = require('../utils/logger.js');

/**
 * Custom HTTP error classes for operational error handling
 * HttpError: Base class for all HTTP-related errors with status codes
 * InternalServerError: Represents 500 errors for unexpected failures
 */
const { HttpError, InternalServerError } = require('../utils/errorTypes.js');

/**
 * Runtime environment configuration for context-aware error handling
 * Used to determine if the application is running in production mode
 * for secure error response generation
 */
const { env } = require('../config/env.js');

/**
 * Node.js built-in process module for environment checks
 * @external process
 * @see {@link https://nodejs.org/api/process.html} Node.js 18+ process documentation
 */
// process is a global object in Node.js - no explicit import needed

// =============================================================================
// GLOBAL CONSTANTS
// =============================================================================

/**
 * Production environment check for secure error handling
 * When true, error responses exclude stack traces and sensitive details
 * to prevent information leakage in production environments
 */
const IS_PRODUCTION = env === 'production';

// =============================================================================
// ERROR HANDLER MIDDLEWARE IMPLEMENTATION
// =============================================================================

/**
 * Express error-handling middleware function
 * 
 * This function serves as the central error handling mechanism for the Express.js
 * application. It catches all errors thrown in the request pipeline, processes them
 * appropriately based on their type, logs comprehensive error details, and sends
 * standardized, secure error responses to clients.
 * 
 * Error Processing Flow:
 * 1. Check if error is an instance of HttpError (operational error)
 * 2. If not, wrap the error in InternalServerError (programmer/system error)
 * 3. Log the error with appropriate metadata using Logger.error
 * 4. Determine response format based on environment (production vs development)
 * 5. Send JSON response with error details (excluding sensitive info in production)
 * 6. Handle header-sent state to prevent double responses
 * 
 * @function errorHandler
 * @param {Error} err - The error object thrown by previous middleware or route handlers
 * @param {Object} req - Express request object containing request details
 * @param {Object} res - Express response object for sending HTTP responses
 * @param {Function} next - Express next function for continuing the middleware chain
 * @returns {void} Sends an HTTP error response to the client and logs the error
 * 
 * @example
 * // Register error handler after all routes
 * app.use('/api', routes);
 * app.use(errorHandler);
 * 
 * @example
 * // Error handler catches thrown HttpError instances
 * app.get('/users/:id', (req, res, next) => {
 *   try {
 *     // Route logic that might throw HttpError
 *     throw new NotFoundError('User not found', { userId: req.params.id });
 *   } catch (error) {
 *     next(error); // Passed to errorHandler
 *   }
 * });
 * 
 * @example
 * // Error handler catches unexpected errors
 * app.get('/data', (req, res, next) => {
 *   try {
 *     // Route logic that might throw unexpected error
 *     JSON.parse('invalid json'); // Throws SyntaxError
 *   } catch (error) {
 *     next(error); // Wrapped in InternalServerError by errorHandler
 *   }
 * });
 */
function errorHandler(err, req, res, next) {
  // Step 1: Check if err is an instance of HttpError
  let processedError;
  
  if (err instanceof HttpError) {
    // Error is already a properly formatted HttpError (operational error)
    processedError = err;
  } else {
    // Error is not an HttpError, wrap it in InternalServerError (programmer/system error)
    // Extract meaningful information from the original error if available
    const originalMessage = err.message || 'An unexpected error occurred';
    const originalDetails = {
      originalName: err.name || 'Unknown',
      originalMessage: originalMessage,
      // Include stack trace in details for logging purposes
      ...(err.stack && { originalStack: err.stack })
    };
    
    processedError = new InternalServerError('Internal Server Error', originalDetails);
  }
  
  // Step 2: Log the error using Logger.error with comprehensive metadata
  const logMetadata = {
    status: processedError.status,
    message: processedError.message,
    url: req.originalUrl || req.url,
    method: req.method,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
    // Include error details if available
    ...(processedError.details && { details: processedError.details }),
    // Include stack trace for logging (will be filtered for client response)
    ...(processedError.stack && { stack: processedError.stack })
  };
  
  Logger.error(`HTTP ${processedError.status} Error: ${processedError.message}`, logMetadata);
  
  // Step 3: Check if response headers have already been sent
  if (res.headersSent) {
    // Headers already sent, cannot send response
    // Log this condition and delegate to Express default error handler
    Logger.error('Cannot send error response - headers already sent', {
      url: req.originalUrl || req.url,
      method: req.method,
      status: processedError.status
    });
    
    // Call next() to delegate to Express default error handler
    return next(processedError);
  }
  
  // Step 4: Determine response status code and message from the error object
  const responseStatus = processedError.status;
  const responseMessage = processedError.message;
  
  // Step 5: Build the response object based on environment
  const responseData = {
    status: responseStatus,
    message: responseMessage
  };
  
  // Step 6: Add additional details based on environment
  if (IS_PRODUCTION) {
    // Production environment: Omit stack traces and sensitive details
    // Only include basic error information for security
    if (processedError.details && typeof processedError.details === 'object') {
      // Filter out sensitive details in production
      const sanitizedDetails = Object.keys(processedError.details).reduce((acc, key) => {
        // Exclude potentially sensitive keys like stack traces, file paths, etc.
        if (!['originalStack', 'stack', 'originalName'].includes(key)) {
          acc[key] = processedError.details[key];
        }
        return acc;
      }, {});
      
      // Only include details if there are safe details to include
      if (Object.keys(sanitizedDetails).length > 0) {
        responseData.details = sanitizedDetails;
      }
    }
  } else {
    // Development/Test environment: Include stack traces and error details for debugging
    if (processedError.details) {
      responseData.details = processedError.details;
    }
    
    // Include stack trace for debugging in non-production environments
    if (processedError.stack) {
      responseData.stack = processedError.stack;
    }
  }
  
  // Step 7: Send JSON response with error information
  try {
    res.status(responseStatus).json(responseData);
  } catch (responseError) {
    // If sending the response fails, log the error and attempt basic response
    Logger.error('Failed to send error response', {
      originalError: processedError.message,
      responseError: responseError.message,
      url: req.originalUrl || req.url,
      method: req.method
    });
    
    // Attempt to send a basic error response
    try {
      res.status(500).json({
        status: 500,
        message: 'Internal Server Error'
      });
    } catch (fallbackError) {
      // If even the fallback response fails, log and delegate to Express
      Logger.error('Failed to send fallback error response', {
        fallbackError: fallbackError.message,
        url: req.originalUrl || req.url,
        method: req.method
      });
      
      return next(processedError);
    }
  }
  
  // Step 8: Do not call next() when response is successfully sent
  // Express error handling middleware should not continue the chain
  // when a response has been sent to the client
}

// =============================================================================
// MODULE EXPORTS
// =============================================================================

/**
 * Export the errorHandler middleware function for use in Express applications
 * 
 * This middleware must be registered after all route handlers and other middleware
 * in the Express application to ensure it catches all errors that occur during
 * request processing. It serves as the final error handling layer before Express's
 * default error handling.
 * 
 * Integration Points:
 * - Used by app.js or server.js for Express application setup
 * - Re-exported by middleware/index.js for convenient import
 * - Integrates with Logger utility for structured error logging
 * - Works with custom error types from utils/errorTypes.js
 * - Respects environment configuration from config/env.js
 * 
 * Security Considerations:
 * - Prevents sensitive information leakage in production
 * - Provides detailed debugging information in development
 * - Handles header-sent state to prevent response corruption
 * - Logs all errors for security monitoring and audit trails
 * 
 * @example
 * // Direct import and usage
 * const { errorHandler } = require('./middleware/errorHandler.js');
 * app.use(errorHandler);
 * 
 * @example
 * // Import via middleware index
 * const { errorHandler } = require('./middleware');
 * app.use(errorHandler);
 * 
 * @example
 * // Complete Express application setup
 * const express = require('express');
 * const { errorHandler } = require('./middleware/errorHandler.js');
 * 
 * const app = express();
 * 
 * // Register routes
 * app.get('/hello', (req, res) => res.send('Hello world'));
 * 
 * // Register error handler last
 * app.use(errorHandler);
 * 
 * app.listen(3000);
 */
module.exports = {
  errorHandler
};