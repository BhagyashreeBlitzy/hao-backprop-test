/**
 * Express Request Logger Middleware for Node.js Hello World Tutorial Application
 * 
 * This middleware provides comprehensive HTTP request and response logging with structured,
 * environment-aware output for observability and troubleshooting support. It integrates with
 * the centralized Logger utility to ensure consistent logging patterns across the application.
 * 
 * Features:
 * - Structured logging of HTTP requests and responses with metadata
 * - High-resolution timing for accurate performance monitoring
 * - Environment-aware logging that respects the centralized Logger configuration
 * - Configurable ignored paths for health checks and static assets
 * - Response status-based log level determination (warn/error for failures)
 * - Extensible architecture for future correlation IDs and distributed tracing
 * - Memory-efficient implementation with minimal performance overhead
 * 
 * The middleware is designed to be the first middleware in the Express app to ensure
 * comprehensive coverage of all incoming requests, including those that result in errors.
 * 
 * @fileoverview Express middleware for comprehensive HTTP request/response logging
 * @author Node.js Tutorial Team
 * @version 1.0.0
 */

// Internal imports - Centralized logging utility
const { Logger } = require('../utils/logger.js'); // Centralized environment-aware logging

// Node.js built-in imports
// Node.js 18+ - Built-in process global for high-resolution timing and environment access
const process = require('process');

/**
 * Global configuration for request logging behavior
 * Defines paths that should be excluded from request logging to reduce noise
 * in logs for operational endpoints and static assets
 * 
 * @constant {Array<string>}
 * @global
 */
const REQUEST_LOG_IGNORED_PATHS = ['/health', '/favicon.ico'];

/**
 * Express middleware function for comprehensive HTTP request and response logging
 * 
 * This middleware captures detailed information about incoming HTTP requests and their
 * corresponding responses, including timing data, response status codes, and optional
 * metadata. It uses high-resolution timing for accurate performance measurements and
 * integrates with the centralized Logger utility for consistent, structured output.
 * 
 * The middleware follows Express.js middleware patterns and implements non-blocking
 * logging through event listeners on the response object. It automatically determines
 * appropriate log levels based on HTTP response status codes.
 * 
 * @function requestLogger
 * @param {Object} req - Express Request object containing HTTP request information
 * @param {string} req.method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {string} req.path - Request path portion of the URL
 * @param {string} req.url - Complete request URL including query parameters
 * @param {Object} req.headers - HTTP request headers object
 * @param {Object} req.query - Parsed query string parameters
 * @param {Object} res - Express Response object for HTTP response handling
 * @param {number} res.statusCode - HTTP response status code (set after response)
 * @param {Function} res.on - Event emitter method for response events
 * @param {Function} next - Express next middleware function for continuing the chain
 * @returns {void} Calls next() to continue middleware execution after setting up logging
 * 
 * @example
 * // Register as first middleware in Express app
 * const express = require('express');
 * const { requestLogger } = require('./middleware/requestLogger');
 * 
 * const app = express();
 * app.use(requestLogger); // Must be first for comprehensive coverage
 * 
 * @example
 * // Typical log output for successful request
 * // [2024-01-01T12:00:00.000Z] [info] [nodejs-hello-world-tutorial] [development] 
 * // Incoming request {"method":"GET","url":"/hello","headers":{"host":"localhost:3000"}}
 * // [2024-01-01T12:00:00.025Z] [info] [nodejs-hello-world-tutorial] [development] 
 * // Completed request {"method":"GET","url":"/hello","statusCode":200,"responseTime":"25ms"}
 * 
 * @example
 * // Typical log output for error response
 * // [2024-01-01T12:00:00.000Z] [info] [nodejs-hello-world-tutorial] [development] 
 * // Incoming request {"method":"GET","url":"/invalid","headers":{"host":"localhost:3000"}}
 * // [2024-01-01T12:00:00.015Z] [warn] [nodejs-hello-world-tutorial] [development] 
 * // Completed request {"method":"GET","url":"/invalid","statusCode":404,"responseTime":"15ms"}
 */
function requestLogger(req, res, next) {
    // Step 1: Check if req.path is in REQUEST_LOG_IGNORED_PATHS; if so, call next() immediately
    if (REQUEST_LOG_IGNORED_PATHS.includes(req.path)) {
        // Skip logging for ignored paths to reduce log noise
        return next();
    }
    
    // Step 2: Capture the high-resolution start time using process.hrtime.bigint() for accurate timing
    // Using BigInt-based hrtime for nanosecond precision timing measurements
    const startTime = process.hrtime.bigint();
    
    // Step 3: Log the incoming request using Logger.info with method, url, and optional metadata
    // Structure the request metadata for consistent logging format
    const requestMetadata = {
        method: req.method,
        url: req.url,
        headers: {
            host: req.headers.host,
            'user-agent': req.headers['user-agent'],
            accept: req.headers.accept,
            'content-type': req.headers['content-type']
        },
        // Include query parameters if present
        ...(Object.keys(req.query).length > 0 && { query: req.query }),
        // Include user context if available (extensible for future authentication)
        ...(req.user && { user: { id: req.user.id, username: req.user.username } })
    };
    
    // Log the incoming request with structured metadata
    Logger.info('Incoming request', requestMetadata);
    
    // Step 4: Attach a listener to res 'finish' event to log the response after it is sent
    res.on('finish', () => {
        // Step 5: Calculate the response time in milliseconds using high-resolution timing
        const endTime = process.hrtime.bigint();
        const responseTimeNs = endTime - startTime;
        const responseTimeMs = Number(responseTimeNs) / 1_000_000; // Convert nanoseconds to milliseconds
        
        // Step 6: Structure the response metadata for logging
        const responseMetadata = {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            responseTime: `${responseTimeMs.toFixed(2)}ms`,
            // Include response size if available from Content-Length header
            ...(res.get('Content-Length') && { 
                responseSize: `${res.get('Content-Length')} bytes` 
            }),
            // Include user context if available (extensible for future user tracking)
            ...(req.user && { user: { id: req.user.id } })
        };
        
        // Step 7: Determine log level based on status code and log the response
        if (res.statusCode >= 500) {
            // 5xx status codes indicate server errors - use error level
            Logger.error('Completed request with server error', responseMetadata);
        } else if (res.statusCode >= 400) {
            // 4xx status codes indicate client errors - use warn level
            Logger.warn('Completed request with client error', responseMetadata);
        } else {
            // 2xx and 3xx status codes indicate successful responses - use info level
            Logger.info('Completed request', responseMetadata);
        }
    });
    
    // Step 8: Call next() to continue the middleware chain
    // This ensures the request processing continues to the next middleware or route handler
    next();
}

/**
 * Named exports for the request logging middleware
 * Provides the requestLogger function for use throughout the Express application
 * Supports tree-shaking and explicit import patterns for optimal bundle size
 */
module.exports = {
    /**
     * Express middleware function for comprehensive HTTP request and response logging
     * Integrates with centralized Logger utility for structured, environment-aware logging
     * 
     * @type {Function}
     */
    requestLogger
};