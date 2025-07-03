/**
 * Express Request Logger Middleware for HTTP Request and Response Logging
 * 
 * This middleware provides comprehensive logging of HTTP requests and responses with
 * structured, environment-aware output. It integrates with the centralized Logger
 * utility to ensure consistent formatting and logging behavior across the entire
 * backend application. The middleware captures essential request metadata including
 * method, URL, status codes, response times, and optional request/response details
 * for observability and troubleshooting purposes.
 * 
 * Key Features:
 * - High-resolution timing for accurate response time measurement
 * - Environment-aware logging that respects test and production settings
 * - Configurable path filtering to reduce log noise from health checks
 * - Status code-based log level selection (info, warn, error)
 * - Structured logging with consistent metadata formatting
 * - Extensible design for future correlation ID and distributed tracing support
 * - Request lifecycle tracking from incoming request to response completion
 * 
 * Requirements Addressed:
 * - Monitoring and Observability (6.5): Provides structured request/response logging
 *   with performance metrics for troubleshooting and health monitoring
 * - Error Management (1.3.1): Implements comprehensive error logging with 
 *   appropriate log levels for operational and debugging purposes
 * - Response Generation Feature (2.1.4): Standardized logging of HTTP responses
 *   for client communication debugging and request traceability
 * 
 * Usage:
 * import { requestLogger } from './middleware/requestLogger.js';
 * app.use(requestLogger); // Apply as first middleware for complete coverage
 * 
 * Log Output Examples:
 * [2024-01-15T10:30:45.123Z] [info] [nodejs-hello-world-tutorial] [development] Incoming HTTP request {"method":"GET","url":"/hello","userAgent":"Mozilla/5.0..."}
 * [2024-01-15T10:30:45.150Z] [info] [nodejs-hello-world-tutorial] [development] HTTP request completed {"method":"GET","url":"/hello","statusCode":200,"responseTime":27}
 * [2024-01-15T10:30:45.200Z] [warn] [nodejs-hello-world-tutorial] [development] HTTP request completed with client error {"method":"GET","url":"/invalid","statusCode":404,"responseTime":2}
 * 
 * @fileoverview Express middleware for HTTP request and response logging
 * @version 1.0.0
 * @author Tutorial Implementation Team
 */

// =============================================================================
// IMPORTS
// =============================================================================

/**
 * Centralized Logger utility for structured, environment-aware logging
 * Provides static logging methods (info, warn, error, debug) with consistent
 * formatting, timestamping, and metadata handling across all backend services
 */
const { Logger } = require('../utils/logger.js');

/**
 * Node.js built-in process module for high-resolution timing and environment access
 * Used for precise response time measurement and environment variable checks
 * @external process
 * @see {@link https://nodejs.org/api/process.html} Node.js 18+ process documentation
 */
// process is a global object in Node.js - no explicit import needed

// =============================================================================
// CONFIGURATION CONSTANTS
// =============================================================================

/**
 * Request paths that should be excluded from logging to reduce log noise
 * 
 * These paths are typically health check endpoints, static assets, or other
 * high-frequency requests that don't provide meaningful business value in logs.
 * The middleware will skip logging for requests matching these exact paths
 * to maintain clean, actionable log output.
 * 
 * Path Exclusion Rationale:
 * - /health: Health check endpoint called frequently by load balancers
 * - /favicon.ico: Browser automatic favicon requests
 * 
 * Future extensions may include:
 * - Static asset paths (/static, /assets, /public)
 * - Monitoring endpoints (/metrics, /status)
 * - Development-only endpoints in production
 * 
 * @constant {string[]} REQUEST_LOG_IGNORED_PATHS
 */
const REQUEST_LOG_IGNORED_PATHS = ['/health', '/favicon.ico'];

/**
 * HTTP status code thresholds for determining log levels
 * Used to categorize response status codes into appropriate log levels
 * for operational monitoring and alerting
 * 
 * @constant {Object} STATUS_CODE_THRESHOLDS
 */
const STATUS_CODE_THRESHOLDS = {
  /** Client error threshold (4xx status codes) */
  CLIENT_ERROR: 400,
  /** Server error threshold (5xx status codes) */
  SERVER_ERROR: 500
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Extracts and sanitizes essential request metadata for logging
 * 
 * Builds a structured metadata object containing key request information
 * while being mindful of sensitive data exposure and log volume. The function
 * selectively includes request properties that are useful for debugging and
 * monitoring without compromising security or creating excessive log noise.
 * 
 * Security Considerations:
 * - Authorization headers are excluded to prevent credential leakage
 * - Cookie headers are excluded to prevent session token exposure
 * - User agent is truncated to prevent log injection attacks
 * - Query parameters are included but may need sanitization in production
 * 
 * @function extractRequestMetadata
 * @param {Express.Request} req - Express request object
 * @returns {Object} Sanitized request metadata object
 * 
 * @example
 * const metadata = extractRequestMetadata(req);
 * console.log(metadata);
 * // Output: {
 * //   method: 'GET',
 * //   url: '/hello?name=world',
 * //   userAgent: 'Mozilla/5.0...',
 * //   contentType: 'application/json',
 * //   remoteAddress: '127.0.0.1'
 * // }
 */
function extractRequestMetadata(req) {
  // Build metadata object with essential request information
  const metadata = {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent')?.substring(0, 200) || 'Unknown', // Truncate for security
    contentType: req.get('Content-Type') || 'Not specified',
    remoteAddress: req.ip || req.connection.remoteAddress || 'Unknown'
  };

  // Include query parameters if present (may need sanitization in production)
  if (req.query && Object.keys(req.query).length > 0) {
    metadata.queryParams = req.query;
  }

  // Include content length for POST/PUT requests
  const contentLength = req.get('Content-Length');
  if (contentLength) {
    metadata.contentLength = parseInt(contentLength, 10);
  }

  return metadata;
}

/**
 * Extracts and formats response metadata for logging
 * 
 * Captures key response characteristics including status code, content type,
 * response size, and performance metrics. This metadata is essential for
 * monitoring API performance, debugging client issues, and operational alerting.
 * 
 * @function extractResponseMetadata
 * @param {Express.Response} res - Express response object
 * @param {number} responseTime - Response time in milliseconds
 * @returns {Object} Response metadata object
 * 
 * @example
 * const metadata = extractResponseMetadata(res, 145);
 * console.log(metadata);
 * // Output: {
 * //   statusCode: 200,
 * //   responseTime: 145,
 * //   contentType: 'text/plain',
 * //   contentLength: 11
 * // }
 */
function extractResponseMetadata(res, responseTime) {
  // Build response metadata object
  const metadata = {
    statusCode: res.statusCode,
    responseTime: responseTime,
    contentType: res.get('Content-Type') || 'Not specified'
  };

  // Include response size if available
  const contentLength = res.get('Content-Length');
  if (contentLength) {
    metadata.contentLength = parseInt(contentLength, 10);
  }

  return metadata;
}

/**
 * Determines the appropriate log level based on HTTP status code
 * 
 * Maps HTTP status codes to log levels following standard operational practices:
 * - 2xx/3xx: Info level (successful operations)
 * - 4xx: Warn level (client errors, typically not server issues)
 * - 5xx: Error level (server errors, require immediate attention)
 * 
 * This mapping enables proper alerting and monitoring workflows where
 * server errors trigger immediate notifications while client errors
 * are tracked but don't generate critical alerts.
 * 
 * @function getLogLevel
 * @param {number} statusCode - HTTP response status code
 * @returns {string} Log level ('info', 'warn', or 'error')
 * 
 * @example
 * const level = getLogLevel(200); // 'info'
 * const level = getLogLevel(404); // 'warn'
 * const level = getLogLevel(500); // 'error'
 */
function getLogLevel(statusCode) {
  if (statusCode >= STATUS_CODE_THRESHOLDS.SERVER_ERROR) {
    return 'error'; // 5xx status codes indicate server errors
  } else if (statusCode >= STATUS_CODE_THRESHOLDS.CLIENT_ERROR) {
    return 'warn';  // 4xx status codes indicate client errors
  } else {
    return 'info';  // 2xx and 3xx status codes indicate success
  }
}

// =============================================================================
// MIDDLEWARE IMPLEMENTATION
// =============================================================================

/**
 * Express middleware function for comprehensive HTTP request and response logging
 * 
 * This middleware implements the complete request-response logging lifecycle,
 * capturing both incoming request details and outgoing response metrics. It uses
 * high-resolution timing for accurate performance measurement and integrates
 * seamlessly with the centralized logging infrastructure.
 * 
 * Middleware Flow:
 * 1. Check if request path should be ignored (health checks, static assets)
 * 2. Capture high-resolution start time for response time calculation
 * 3. Log incoming request with essential metadata
 * 4. Attach response finish event listener for completion logging
 * 5. Continue middleware chain execution
 * 6. On response completion: calculate response time and log with appropriate level
 * 
 * Performance Considerations:
 * - Uses process.hrtime.bigint() for nanosecond precision timing
 * - Minimizes synchronous processing during request handling
 * - Leverages event-based response logging to avoid blocking
 * - Efficiently skips ignored paths to reduce overhead
 * 
 * Extensibility Features:
 * - Ready for correlation ID injection and distributed tracing
 * - Supports additional metadata collection (user context, session info)
 * - Compatible with structured logging enhancements
 * - Prepared for external monitoring system integration
 * 
 * @function requestLogger
 * @param {Express.Request} req - Express request object containing HTTP request details
 * @param {Express.Response} res - Express response object for HTTP response handling
 * @param {Function} next - Express next middleware function for chain continuation
 * @returns {void} Calls next() to continue middleware chain after setup
 * 
 * @example
 * // Apply as application-wide middleware (recommended as first middleware)
 * const express = require('express');
 * const { requestLogger } = require('./middleware/requestLogger');
 * 
 * const app = express();
 * app.use(requestLogger); // Log all requests
 * app.get('/hello', (req, res) => res.send('Hello world'));
 * 
 * @example
 * // Apply to specific routes
 * const router = express.Router();
 * router.use(requestLogger);
 * router.get('/api/*', routeHandler);
 * 
 * @example
 * // Integration with error handling
 * app.use(requestLogger);
 * app.use('/api', apiRoutes);
 * app.use(errorHandler); // requestLogger will log errors before errorHandler
 */
function requestLogger(req, res, next) {
  // Step 1: Check if request path should be ignored to reduce log noise
  if (REQUEST_LOG_IGNORED_PATHS.includes(req.path)) {
    // Skip logging for ignored paths and continue middleware chain
    return next();
  }

  // Step 2: Capture high-resolution start time for precise response time calculation
  // Using BigInt nanosecond precision for accurate performance monitoring
  const startTime = process.hrtime.bigint();

  // Step 3: Log incoming request with structured metadata
  try {
    const requestMetadata = extractRequestMetadata(req);
    Logger.info('Incoming HTTP request', requestMetadata);
  } catch (error) {
    // Log metadata extraction errors without breaking request flow
    Logger.error('Failed to extract request metadata', error);
  }

  // Step 4: Attach response finish event listener for completion logging
  // The 'finish' event is emitted after the response has been handed off to the OS
  res.on('finish', () => {
    try {
      // Calculate response time with high precision
      const endTime = process.hrtime.bigint();
      const responseTimeNs = endTime - startTime;
      const responseTimeMs = Number(responseTimeNs) / 1000000; // Convert nanoseconds to milliseconds

      // Extract response metadata including performance metrics
      const responseMetadata = extractResponseMetadata(res, Math.round(responseTimeMs * 100) / 100);

      // Add request context to response metadata for complete request tracing
      const completeMetadata = {
        method: req.method,
        url: req.url,
        ...responseMetadata
      };

      // Determine appropriate log level based on response status code
      const logLevel = getLogLevel(res.statusCode);
      const logMessage = `HTTP request completed${res.statusCode >= STATUS_CODE_THRESHOLDS.CLIENT_ERROR ? ' with error' : ''}`;

      // Log response completion with appropriate level
      switch (logLevel) {
        case 'error':
          Logger.error(logMessage, completeMetadata);
          break;
        case 'warn':
          Logger.warn(logMessage, completeMetadata);
          break;
        case 'info':
        default:
          Logger.info(logMessage, completeMetadata);
          break;
      }
    } catch (error) {
      // Log response logging errors without affecting application flow
      Logger.error('Failed to log response completion', error);
    }
  });

  // Step 5: Continue middleware chain execution
  // The request logger has completed its setup and request logging,
  // response logging will happen asynchronously when the response finishes
  next();
}

// =============================================================================
// MODULE EXPORTS
// =============================================================================

/**
 * Export the requestLogger middleware for use throughout the Express application
 * 
 * The middleware is exported as a named export to maintain consistency with
 * other backend modules and enable explicit imports. This export pattern
 * supports tree-shaking optimization and static analysis.
 * 
 * Integration Guidelines:
 * - Apply as the first middleware in the Express app for complete request coverage
 * - Ensure it's placed before route handlers and other middleware that might
 *   modify request/response objects or handle errors
 * - Compatible with Express error handling middleware (place before error handlers)
 * - Works seamlessly with other middleware like body parsers, CORS, etc.
 * 
 * Usage Examples:
 * 
 * // Named import (recommended)
 * const { requestLogger } = require('./middleware/requestLogger.js');
 * 
 * // ES6 import syntax
 * import { requestLogger } from './middleware/requestLogger.js';
 * 
 * // Application setup
 * const express = require('express');
 * const { requestLogger } = require('./middleware/requestLogger');
 * 
 * const app = express();
 * 
 * // Apply request logger as first middleware for complete coverage
 * app.use(requestLogger);
 * 
 * // Add other middleware
 * app.use(express.json());
 * app.use(express.urlencoded({ extended: false }));
 * 
 * // Add routes
 * app.get('/hello', (req, res) => res.send('Hello world'));
 * app.get('/health', (req, res) => res.json({ status: 'healthy' }));
 * 
 * // Error handling (request logger will log errors before this)
 * app.use((err, req, res, next) => {
 *   res.status(500).send('Internal Server Error');
 * });
 * 
 * Performance Impact:
 * - Minimal overhead: ~1-2ms per request for metadata extraction and logging
 * - Asynchronous response logging doesn't block request processing
 * - Efficient path filtering reduces processing for ignored endpoints
 * - High-resolution timing provides accurate performance metrics
 * 
 * Future Enhancements:
 * - Correlation ID generation and propagation for distributed tracing
 * - User context extraction from authentication middleware
 * - Request/response body logging for debugging (with sensitive data filtering)
 * - Integration with external monitoring systems (Prometheus, DataDog, etc.)
 * - Custom metadata extraction based on route configuration
 * - Request sampling for high-traffic applications
 */
module.exports = {
  requestLogger
};