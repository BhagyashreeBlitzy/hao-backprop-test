/**
 * Request Logger Middleware for Node.js Tutorial Backend
 * 
 * This Express.js middleware provides comprehensive HTTP request logging capabilities
 * by capturing and logging all incoming HTTP requests in a standardized, educationally
 * clear format. It serves as a critical observability component that tracks method,
 * path, status, and response time for each request, leveraging the centralized logger
 * utility to ensure consistent, timestamped log output throughout the application.
 * 
 * Key Features:
 * - High-precision response time measurement using process.hrtime()
 * - Standardized log format for educational clarity and consistency
 * - Asynchronous logging that doesn't block request processing
 * - Integration with centralized logging system for unified output
 * - Support for metadata logging for advanced debugging capabilities
 * - Error-resistant implementation that ensures logging even during failures
 * - Future extensibility for correlation IDs, user context, and additional metrics
 * 
 * Educational Value:
 * - Demonstrates Express.js middleware development patterns
 * - Shows proper event-driven programming with response finish events
 * - Illustrates high-precision timing measurement techniques
 * - Provides foundation for understanding request/response lifecycle
 * - Models production-ready middleware architecture and documentation
 * 
 * Design Principles:
 * - Non-blocking: Logging operations don't interfere with request processing
 * - Consistent: Uses centralized logger for uniform output formatting
 * - Extensible: Architecture supports future enhancements and customization
 * - Educational: Comprehensive documentation and clear implementation
 * - Robust: Error handling ensures logging continues even during failures
 * 
 * Usage:
 * This middleware should be mounted early in the Express middleware stack,
 * before route handlers, to ensure all requests (including 404s and errors)
 * are captured and logged for complete observability.
 * 
 * @fileoverview Express middleware for standardized HTTP request logging
 * @author Node.js Tutorial Project
 * @version 1.0.0
 */

// Internal dependency: Centralized logging utility for consistent log output
// Imports the logInfo function for informational-level request logging
// Path: ../utils/logger.js - relative path from middleware subfolder
const { logInfo } = require('../utils/logger.js');

/**
 * Global Request Log Format Template
 * 
 * Defines the standardized format string for HTTP request log messages.
 * This template uses placeholder syntax for dynamic substitution of request
 * details, ensuring consistent log formatting across all requests and
 * supporting educational clarity through readable, structured output.
 * 
 * Format Structure:
 * - {method}: HTTP method (GET, POST, PUT, DELETE, etc.)
 * - {url}: Complete request URL including query parameters
 * - {status}: HTTP response status code (200, 404, 500, etc.)
 * - {responseTime}: Request processing time in milliseconds with 'ms' suffix
 * 
 * Example Output:
 * "[GET] /hello 200 45ms"
 * "[POST] /api/users?filter=active 201 120ms"
 * "[GET] /nonexistent 404 12ms"
 * 
 * This format is designed for:
 * - Human readability during development and debugging
 * - Easy parsing by log analysis tools and monitoring systems
 * - Educational clarity for understanding HTTP request patterns
 * - Compact representation suitable for high-volume logging scenarios
 * 
 * @constant {string} REQUEST_LOG_FORMAT
 * @global
 */
const REQUEST_LOG_FORMAT = '[{method}] {url} {status} {responseTime}ms';

/**
 * Express Request Logger Middleware
 * 
 * Express.js middleware function that implements comprehensive HTTP request logging
 * by capturing essential request metrics and outputting them in a standardized format.
 * This middleware leverages the Node.js event-driven architecture to perform logging
 * after the response is sent, ensuring accurate status codes and response times
 * without impacting request processing performance.
 * 
 * Request Lifecycle Integration:
 * 1. Middleware is invoked when request enters the Express application
 * 2. High-resolution start time is recorded using process.hrtime()
 * 3. Event listener is attached to response 'finish' event for post-processing
 * 4. Control is immediately passed to next middleware via next() callback
 * 5. When response completes, 'finish' event triggers logging functionality
 * 6. Response time is calculated and request details are logged
 * 
 * Timing Accuracy:
 * Uses process.hrtime() for nanosecond-precision timing measurement, providing
 * accurate response time calculations even for very fast requests. This ensures
 * reliable performance metrics for educational analysis and system monitoring.
 * 
 * Error Resilience:
 * The middleware includes comprehensive error handling to ensure that logging
 * failures don't impact request processing or cause application crashes.
 * All error conditions are handled gracefully with fallback mechanisms.
 * 
 * @function requestLogger
 * @param {Object} req - Express.js request object containing HTTP request information
 * @param {string} req.method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {string} req.originalUrl - Complete original URL including query parameters
 * @param {string} req.url - Request URL path (fallback if originalUrl unavailable)
 * @param {Object} res - Express.js response object for HTTP response handling  
 * @param {number} res.statusCode - HTTP response status code set by route handlers
 * @param {Function} next - Express.js next middleware function for control flow
 * @returns {void} Passes control to next middleware after setting up logging hooks
 * 
 * @example
 * // Mount early in middleware stack for complete request coverage
 * const { requestLogger } = require('./middleware/requestLogger');
 * const express = require('express');
 * const app = express();
 * 
 * // Register before route handlers to capture all requests
 * app.use(requestLogger);
 * 
 * // Define routes after logging middleware
 * app.get('/hello', (req, res) => {
 *   res.send('Hello world');
 * });
 * 
 * @example
 * // Expected log output for various requests:
 * // GET /hello -> "[GET] /hello 200 45ms"
 * // GET /nonexistent -> "[GET] /nonexistent 404 12ms" 
 * // POST /hello -> "[POST] /hello 405 8ms"
 */
function requestLogger(req, res, next) {
    // Record high-resolution start time for accurate response time calculation
    // process.hrtime() returns [seconds, nanoseconds] tuple for precise timing
    // This approach provides microsecond precision suitable for performance analysis
    const startTime = process.hrtime();
    
    // Record high-resolution start timestamp as fallback for compatibility
    // Date.now() provides millisecond precision and serves as backup timing method
    const startTimestamp = Date.now();
    
    // Attach event listener to response 'finish' event for post-processing logging
    // The 'finish' event is emitted after the response has been sent to the client,
    // ensuring accurate status codes and complete request processing metrics.
    // This event-driven approach prevents blocking the request/response cycle.
    res.on('finish', () => {
        try {
            // Calculate response time using high-resolution timing
            // process.hrtime(startTime) returns time elapsed since startTime
            // Result is [seconds, nanoseconds] which we convert to milliseconds
            const [seconds, nanoseconds] = process.hrtime(startTime);
            const responseTimeMs = Math.round((seconds * 1000) + (nanoseconds / 1000000));
            
            // Extract HTTP method from request object
            // req.method contains standard HTTP verbs (GET, POST, PUT, DELETE, etc.)
            const method = req.method || 'UNKNOWN';
            
            // Extract request URL, preferring originalUrl for complete path with query params
            // originalUrl includes the complete path as received, including query parameters
            // Fallback to req.url if originalUrl is not available for edge cases
            const url = req.originalUrl || req.url || '/';
            
            // Extract HTTP response status code set by route handlers or middleware
            // res.statusCode is set by Express based on response methods called
            // Default to 0 for edge cases where status code might not be set
            const status = res.statusCode || 0;
            
            // Format log message using REQUEST_LOG_FORMAT template
            // Replace placeholder tokens with actual request values for structured output
            // This creates consistent, parseable log entries for analysis and monitoring
            const logMessage = REQUEST_LOG_FORMAT
                .replace('{method}', method)
                .replace('{url}', url)
                .replace('{status}', status)
                .replace('{responseTime}', responseTimeMs);
            
            // Create structured metadata object for advanced logging and analysis
            // This metadata supports future extensibility for correlation IDs,
            // user context, IP addresses, user agents, and other request details
            const requestMetadata = {
                method: method,
                url: url, 
                status: status,
                responseTime: responseTimeMs,
                // Future extensibility placeholders:
                // correlationId: req.correlationId,
                // userId: req.user?.id,
                // ipAddress: req.ip,
                // userAgent: req.get('User-Agent'),
                // contentLength: res.get('Content-Length')
            };
            
            // Log the formatted request information using centralized logger utility
            // logInfo ensures consistent timestamp formatting, application identification,
            // and proper output formatting across all application logging
            logInfo(logMessage, requestMetadata);
            
        } catch (loggingError) {
            // Handle logging errors gracefully to prevent impact on request processing
            // Log errors should never cause application failures or request interruption
            // This ensures logging remains optional and doesn't compromise application stability
            
            // Calculate fallback response time using Date.now() for error scenarios
            const fallbackResponseTime = Date.now() - startTimestamp;
            
            // Create minimal log entry using fallback data to ensure some logging occurs
            const fallbackLogMessage = `[${req.method || 'UNKNOWN'}] ${req.originalUrl || req.url || '/'} ${res.statusCode || 0} ${fallbackResponseTime}ms [LOG_ERROR]`;
            
            // Output fallback log directly to console to bypass potential logger issues
            // This ensures request information is captured even if logging system fails
            console.log(`[${new Date().toISOString()}] [NodeJSTutorialApp] [INFO] ${fallbackLogMessage}`);
            
            // Note: We don't re-throw the error to prevent request processing disruption
            // Logging failures should be transparent to the request/response cycle
        }
    });
    
    // Pass control to the next middleware in the Express middleware stack
    // This must be called to continue request processing and ensure the
    // request reaches route handlers and other middleware components.
    // The middleware is designed to be non-blocking and transparent to the
    // request processing flow while providing comprehensive logging coverage.
    next();
}

/**
 * Module Exports
 * 
 * Exports the requestLogger middleware function for use throughout the Express
 * application. This export structure follows Node.js CommonJS module patterns
 * and supports both named imports and destructuring assignment for flexibility.
 * 
 * Export Strategy:
 * - Named export for explicit import syntax and code clarity
 * - Function export without internal state for stateless middleware pattern
 * - Comprehensive JSDoc documentation for usage guidance
 * - Consistent naming convention matching function declaration
 * 
 * Import Examples:
 * // Named destructuring import (recommended)
 * const { requestLogger } = require('./middleware/requestLogger');
 * 
 * // Full module import with property access
 * const requestLoggerModule = require('./middleware/requestLogger');
 * app.use(requestLoggerModule.requestLogger);
 * 
 * // Aliased import for naming flexibility
 * const { requestLogger: logMiddleware } = require('./middleware/requestLogger');
 */
module.exports = {
    /**
     * Express.js middleware function for comprehensive HTTP request logging.
     * Should be mounted early in the middleware stack to capture all requests,
     * including those resulting in 404 errors or middleware failures.
     * 
     * Integration Requirements:
     * - Mount before route handlers for complete request coverage
     * - Requires centralized logger utility (../utils/logger.js) for output
     * - Compatible with Express.js v5.1.0 and Node.js v18+ requirements
     * 
     * Performance Characteristics:
     * - Non-blocking middleware execution with event-driven logging
     * - High-precision timing using process.hrtime() for accurate metrics
     * - Minimal memory footprint with efficient string manipulation
     * - Error-resilient implementation with graceful failure handling
     * 
     * Educational Benefits:
     * - Demonstrates Express.js middleware development patterns
     * - Shows proper integration with centralized logging systems
     * - Illustrates event-driven programming with response lifecycle events
     * - Provides foundation for understanding HTTP request/response monitoring
     * 
     * @type {Function}
     */
    requestLogger
};

/**
 * Module Usage Documentation
 * 
 * Complete Integration Example:
 * ```javascript
 * const express = require('express'); // v5.1.0
 * const { requestLogger } = require('./middleware/requestLogger');
 * 
 * const app = express();
 * 
 * // Mount request logger early for complete coverage
 * app.use(requestLogger);
 * 
 * // Define application routes
 * app.get('/hello', (req, res) => {
 *   res.send('Hello world');
 * });
 * 
 * // Mount error handling after routes
 * app.use((req, res) => {
 *   res.status(404).send('Not Found');
 * });
 * 
 * app.listen(3000, () => {
 *   console.log('Server running with request logging');
 * });
 * ```
 * 
 * Expected Log Output Examples:
 * ```
 * [2024-12-30T14:25:30.123Z] [NodeJSTutorialApp] [INFO] [GET] /hello 200 45ms {"method":"GET","url":"/hello","status":200,"responseTime":45}
 * [2024-12-30T14:25:31.200Z] [NodeJSTutorialApp] [INFO] [GET] /nonexistent 404 12ms {"method":"GET","url":"/nonexistent","status":404,"responseTime":12}
 * [2024-12-30T14:25:32.100Z] [NodeJSTutorialApp] [INFO] [POST] /hello 405 8ms {"method":"POST","url":"/hello","status":405,"responseTime":8}
 * ```
 * 
 * Middleware Stack Positioning:
 * 1. Request Logger (this middleware) - captures all requests
 * 2. Body parsing middleware - handles request body processing
 * 3. Route handlers - application-specific request processing
 * 4. Error handling middleware - handles errors and exceptions
 * 5. Not found handler - handles unmatched routes (404 responses)
 * 
 * Performance Considerations:
 * - Logging occurs asynchronously after response completion
 * - High-resolution timing adds minimal overhead (~microseconds)
 * - String formatting operations are optimized for performance
 * - Event listener cleanup is handled automatically by Node.js
 * - Memory usage is minimal with no persistent state storage
 * 
 * Future Enhancement Opportunities:
 * - Correlation ID tracking for distributed request tracing
 * - User context logging for authenticated requests
 * - IP address and User-Agent header capture for analytics
 * - Request/response size logging for bandwidth monitoring
 * - Geographic location tracking for global applications
 * - Rate limiting integration for security monitoring
 * - Custom log format configuration for different environments
 * - Integration with external monitoring and observability platforms
 * 
 * Educational Applications:
 * - Demonstrates production-ready middleware development patterns
 * - Shows proper error handling and graceful degradation techniques
 * - Illustrates integration with centralized logging architecture
 * - Provides foundation for understanding HTTP observability patterns
 * - Models comprehensive documentation and code clarity practices
 * - Supports learning objectives for Express.js middleware concepts
 * - Enables debugging and troubleshooting skill development
 */

/**
 * Testing and Validation Guidelines
 * 
 * Unit Testing Approach:
 * ```javascript
 * const { requestLogger } = require('./requestLogger');
 * 
 * describe('requestLogger middleware', () => {
 *   it('should log successful GET requests', (done) => {
 *     const req = { method: 'GET', originalUrl: '/hello' };
 *     const res = { statusCode: 200, on: jest.fn() };
 *     const next = jest.fn();
 *     
 *     requestLogger(req, res, next);
 *     expect(next).toHaveBeenCalled();
 *     expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
 *   });
 * });
 * ```
 * 
 * Integration Testing:
 * - Test with actual Express.js application instance
 * - Verify log output format and content accuracy
 * - Validate response time measurement precision
 * - Confirm error handling and graceful degradation
 * - Test with various HTTP methods and status codes
 * 
 * Performance Testing:
 * - Measure middleware overhead under load conditions
 * - Validate memory usage and garbage collection impact
 * - Test high-concurrency scenarios for thread safety
 * - Benchmark response time measurement accuracy
 * - Assess logging performance impact on request throughput
 */