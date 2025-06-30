/**
 * Centralized Middleware Export Module for Node.js Tutorial Backend
 * 
 * This module serves as the single source of truth for all Express.js middleware used throughout
 * the Node.js tutorial application. It aggregates and re-exports the core middleware functions
 * (requestLogger, notFoundHandler, errorHandler) to provide a maintainable, educationally clear
 * import point for the main application entry point (app.js or server.js).
 * 
 * The centralized export pattern implemented here demonstrates several key benefits:
 * - **Single Import Point**: Reduces complexity in main application files
 * - **Consistent Middleware Registration**: Ensures proper middleware ordering through documentation
 * - **Educational Clarity**: Provides comprehensive documentation for learning Express.js patterns
 * - **Maintainability**: Centralizes middleware dependencies for easier management
 * - **Best Practices**: Demonstrates production-ready Express.js application architecture
 * 
 * Middleware Registration Order (Critical for Proper Functionality):
 * 1. **requestLogger** - Must be registered FIRST to capture all incoming requests
 * 2. **Application Routes** - Route handlers (e.g., GET /hello) registered by main app
 * 3. **notFoundHandler** - Must be registered AFTER all routes to catch unmatched requests
 * 4. **errorHandler** - Must be registered LAST to catch all errors from previous middleware
 * 
 * Correct Usage in Express Application:
 * ```javascript
 * const express = require('express');
 * const { requestLogger, notFoundHandler, errorHandler } = require('./middleware');
 * 
 * const app = express();
 * 
 * // Step 1: Register request logging middleware first
 * app.use(requestLogger);
 * 
 * // Step 2: Register application routes
 * app.get('/hello', (req, res) => {
 *   res.send('Hello world');
 * });
 * 
 * // Step 3: Register not found handler after all routes
 * app.use(notFoundHandler);
 * 
 * // Step 4: Register error handler as the final middleware
 * app.use(errorHandler);
 * ```
 * 
 * Educational Value:
 * This module demonstrates several important concepts for Node.js/Express.js development:
 * - Middleware organization and centralization patterns
 * - Proper Express.js middleware execution order and dependencies
 * - CommonJS module export/import patterns for Node.js applications
 * - Documentation-driven development with comprehensive JSDoc annotations
 * - Production-ready code structure and architectural patterns
 * 
 * Integration with Application Architecture:
 * - **Request Logger**: Provides observability and debugging capabilities for all HTTP requests
 * - **Not Found Handler**: Ensures consistent 404 error responses with proper logging
 * - **Error Handler**: Implements centralized, secure error handling with Express 5 compatibility
 * - **Shared Utilities**: All middleware leverage centralized logger, constants, and formatters
 * 
 * Express 5 Compatibility:
 * All middleware in this module are designed to work with Express.js v5.1.0 features:
 * - Automatic promise rejection handling in errorHandler middleware
 * - Updated path-to-regexp compatibility for secure route matching
 * - Node.js v18+ requirement support for modern JavaScript features
 * 
 * @fileoverview Centralized export module for Express.js middleware components
 * @author Node.js Tutorial Project
 * @version 1.0.0
 * @requires express ^5.1.0
 * @requires node >=18.0.0
 */

// =============================================================================
// MIDDLEWARE IMPORTS
// =============================================================================

/**
 * Request Logger Middleware Import
 * 
 * Imports the requestLogger middleware function that provides comprehensive HTTP request
 * logging capabilities. This middleware captures and logs all incoming HTTP requests in
 * a standardized, educationally clear format with high-precision response time measurement.
 * 
 * Key Features:
 * - High-precision response time measurement using process.hrtime()
 * - Standardized log format for educational clarity and consistency
 * - Integration with centralized logging system for unified output
 * - Non-blocking logging that doesn't interfere with request processing
 * 
 * Purpose: Provides observability and debugging capabilities by logging all HTTP requests
 * Method: GET, POST, PUT, DELETE, etc. with response times and status codes
 * Registration: Must be mounted FIRST in middleware stack to capture all requests
 * 
 * Dependencies:
 * - ../utils/logger.js - Centralized logging utility (logInfo function)
 * - process.hrtime() - Node.js high-resolution time for accurate measurements
 * 
 * @type {Function} Express.js middleware function (req, res, next) => void
 */
const { requestLogger } = require('./requestLogger.js');

/**
 * Not Found Handler Middleware Import
 * 
 * Imports the notFoundHandler middleware function that handles all unmatched routes
 * (404 Not Found responses) in the Express.js application. This middleware provides
 * consistent error handling for requests that don't match any defined routes.
 * 
 * Key Features:
 * - Intercepts all requests that don't match defined routes
 * - Logs 404 events with request details for observability and debugging
 * - Returns standardized, secure 404 error responses using shared utilities
 * - Prevents information leakage by using centralized error messages
 * 
 * Purpose: Ensures all unmatched routes receive consistent 404 error responses
 * Registration: Must be mounted AFTER all route handlers but BEFORE error handler
 * Response: JSON-formatted error response with appropriate HTTP 404 status code
 * 
 * Dependencies:
 * - ../utils/logger.js - Centralized logging utility (logWarn function)
 * - ../utils/httpStatusCodes.js - HTTP status code constants (HTTP_NOT_FOUND)
 * - ../utils/constants.js - Application constants (NOT_FOUND_MESSAGE)
 * - ../utils/responseFormatter.js - Response formatting utility (formatErrorResponse)
 * 
 * @type {Function} Express.js middleware function (req, res, next) => void
 */
const { notFoundHandler } = require('./notFoundHandler.js');

/**
 * Error Handler Middleware Import
 * 
 * Imports the errorHandler middleware function that serves as the centralized error
 * handling component for the Express.js application. This middleware implements robust,
 * educationally clear error management that leverages Express 5's promise-aware error
 * handling capabilities.
 * 
 * Key Features:
 * - Centralized error handling for all unhandled errors in the Express application
 * - Environment-aware error detail exposure (full details in dev, sanitized in production)
 * - Comprehensive error logging with request context for debugging and observability
 * - Express 5 automatic promise rejection handling compatibility
 * - Standardized error response formatting using shared responseFormatter utility
 * 
 * Purpose: Catches and handles all errors from routes and middleware with secure responses
 * Registration: Must be registered as the FINAL middleware in the Express application
 * Express 5: Automatically catches rejected promises from async routes and middleware
 * 
 * Dependencies:
 * - ../utils/logger.js - Centralized logging utility (logError function)
 * - ../utils/responseFormatter.js - Response formatting utility (formatErrorResponse)
 * - ../utils/httpStatusCodes.js - HTTP status code constants (HTTP_INTERNAL_SERVER_ERROR)
 * - ../utils/constants.js - Application constants (GENERIC_ERROR_MESSAGE)
 * 
 * @type {Function} Express.js error middleware function (err, req, res, next) => void
 */
const { errorHandler } = require('./errorHandler.js');

// =============================================================================
// MODULE EXPORTS
// =============================================================================

/**
 * Centralized Middleware Exports
 * 
 * This module exports all core Express.js middleware functions using CommonJS named exports
 * to provide a single, maintainable import point for the main application entry point.
 * The export structure follows Node.js best practices and supports selective importing
 * for flexibility and code clarity.
 * 
 * Export Benefits:
 * - **Selective Importing**: Import only the middleware needed with destructuring syntax
 * - **Single Source**: All middleware imports managed in one location for maintainability
 * - **Clear Dependencies**: Explicit dependency relationships visible in importing modules
 * - **Educational Value**: Demonstrates proper Node.js module organization patterns
 * - **IDE Support**: Full JSDoc documentation preserved for intelligent code completion
 * 
 * Import Examples:
 * 
 * // Import all middleware (recommended for main app)
 * const { requestLogger, notFoundHandler, errorHandler } = require('./middleware');
 * 
 * // Import specific middleware only
 * const { requestLogger } = require('./middleware');
 * 
 * // Import entire module (alternative approach)
 * const middleware = require('./middleware');
 * app.use(middleware.requestLogger);
 * 
 * // Import with custom aliases
 * const { 
 *   requestLogger: logger, 
 *   notFoundHandler: handle404, 
 *   errorHandler: handleErrors 
 * } = require('./middleware');
 */
module.exports = {
    /**
     * Express.js middleware for comprehensive HTTP request logging and observability
     * 
     * The requestLogger middleware provides essential observability capabilities by capturing
     * and logging all incoming HTTP requests with standardized formatting, high-precision
     * response time measurement, and integration with the centralized logging system.
     * 
     * **Registration Requirements:**
     * - Must be registered FIRST in the Express middleware stack
     * - Should be mounted before all route handlers and other middleware
     * - Captures all requests including those resulting in 404 or 500 errors
     * 
     * **Functionality:**
     * - Logs HTTP method, URL path, response status code, and response time
     * - Uses process.hrtime() for microsecond-precision timing measurements
     * - Integrates with centralized logger utility for consistent log formatting
     * - Provides non-blocking, event-driven logging after response completion
     * 
     * **Educational Value:**
     * - Demonstrates Express.js middleware development patterns and best practices
     * - Shows proper integration with centralized logging architecture
     * - Illustrates event-driven programming with response lifecycle events
     * - Provides foundation for understanding HTTP request/response monitoring
     * 
     * **Usage Example:**
     * ```javascript
     * const { requestLogger } = require('./middleware');
     * app.use(requestLogger); // Must be first middleware
     * ```
     * 
     * **Sample Log Output:**
     * ```
     * [2024-12-30T14:25:30.123Z] [NodeJSTutorialApp] [INFO] [GET] /hello 200 45ms
     * ```
     * 
     * @type {Function} 
     * @param {Object} req - Express request object with HTTP request details
     * @param {Object} res - Express response object for HTTP response handling
     * @param {Function} next - Express next function for middleware chain continuation
     * @returns {void} Passes control to next middleware after setting up logging hooks
     */
    requestLogger,

    /**
     * Express.js middleware for handling 404 Not Found responses with consistent formatting
     * 
     * The notFoundHandler middleware intercepts all requests that don't match any defined
     * routes and provides standardized 404 error responses with comprehensive logging
     * for observability and debugging purposes.
     * 
     * **Registration Requirements:**
     * - Must be registered AFTER all route handlers in the Express middleware stack
     * - Should be mounted before the error handling middleware
     * - Catches requests that don't match any previously defined routes
     * 
     * **Functionality:**
     * - Logs 404 events with request method, path, and client information
     * - Returns JSON-formatted error responses using shared response formatter
     * - Uses centralized constants for consistent error messaging
     * - Provides secure error responses that don't expose internal system details
     * 
     * **Educational Value:**
     * - Demonstrates proper Express.js middleware patterns for error handling
     * - Shows integration with centralized logging and response formatting utilities
     * - Illustrates security best practices for error message sanitization
     * - Provides example of middleware that terminates the request/response cycle
     * 
     * **Usage Example:**
     * ```javascript
     * const { notFoundHandler } = require('./middleware');
     * // Register after all routes but before error handler
     * app.get('/hello', helloHandler);
     * app.use(notFoundHandler);
     * ```
     * 
     * **Sample Response:**
     * ```json
     * {
     *   "error": true,
     *   "message": "Resource not found"
     * }
     * ```
     * 
     * @type {Function}
     * @param {Object} req - Express request object with HTTP request information
     * @param {Object} res - Express response object for sending HTTP response
     * @param {Function} next - Express next function (not called in this middleware)
     * @returns {void} Sends 404 error response to client and terminates request cycle
     */
    notFoundHandler,

    /**
     * Express.js middleware for centralized error handling with Express 5 compatibility
     * 
     * The errorHandler middleware serves as the comprehensive error handling component
     * that captures all unhandled errors from routes and middleware, providing secure,
     * environment-aware error responses with detailed logging for debugging purposes.
     * 
     * **Registration Requirements:**
     * - Must be registered as the FINAL middleware in the Express application
     * - Should be mounted after all routes and other middleware including notFoundHandler
     * - Automatically receives errors from Express 5's promise-aware error handling
     * 
     * **Functionality:**
     * - Catches all unhandled errors from routes and middleware (sync and async)
     * - Provides environment-aware error detail exposure (dev vs. production)
     * - Logs comprehensive error information with request context
     * - Returns standardized error responses using shared response formatter
     * - Leverages Express 5's automatic promise rejection handling
     * 
     * **Security Features:**
     * - Never exposes internal error details in production environment
     * - Sanitizes error messages to prevent information disclosure
     * - Uses generic error messages for client-facing responses in production
     * - Logs all errors for security monitoring and incident response
     * 
     * **Educational Value:**
     * - Demonstrates best practices for Express error middleware implementation
     * - Shows environment-aware error handling and security considerations
     * - Illustrates proper error logging and response formatting patterns
     * - Provides foundation for understanding production-ready error management
     * 
     * **Usage Example:**
     * ```javascript
     * const { errorHandler } = require('./middleware');
     * // Register as the final middleware
     * app.use(notFoundHandler);
     * app.use(errorHandler); // Must be last
     * ```
     * 
     * **Express 5 Automatic Error Handling:**
     * ```javascript
     * // Errors are automatically caught and passed to errorHandler
     * app.get('/example', async (req, res) => {
     *   throw new Error('This will be caught automatically');
     * });
     * ```
     * 
     * @type {Function}
     * @param {Error} err - Error object passed by Express or thrown/rejected in middleware
     * @param {Object} req - Express request object with HTTP request information
     * @param {Object} res - Express response object for sending HTTP response
     * @param {Function} next - Express next function for middleware chain control
     * @returns {void} Sends formatted error response to client and logs error details
     */
    errorHandler
};

/**
 * =============================================================================
 * INTEGRATION DOCUMENTATION
 * =============================================================================
 */

/**
 * Complete Application Integration Example
 * 
 * This example demonstrates the proper integration of all middleware exports
 * from this module into a complete Express.js application, showing the correct
 * registration order and usage patterns for educational purposes.
 * 
 * ```javascript
 * // app.js - Main Express Application Entry Point
 * const express = require('express'); // v5.1.0
 * const { requestLogger, notFoundHandler, errorHandler } = require('./middleware');
 * 
 * // Create Express application instance
 * const app = express();
 * 
 * // =========================================================================
 * // MIDDLEWARE REGISTRATION (Order is Critical!)
 * // =========================================================================
 * 
 * // 1. Request Logger - MUST BE FIRST to capture all requests
 * app.use(requestLogger);
 * 
 * // 2. Body Parsing Middleware (if needed for POST/PUT requests)
 * app.use(express.json()); // Parse JSON request bodies
 * app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
 * 
 * // =========================================================================
 * // APPLICATION ROUTES
 * // =========================================================================
 * 
 * // 3. Define Application Routes
 * app.get('/hello', (req, res) => {
 *   res.status(200).send('Hello world');
 * });
 * 
 * // Additional routes would be defined here...
 * 
 * // =========================================================================
 * // ERROR HANDLING MIDDLEWARE (Order is Critical!)
 * // =========================================================================
 * 
 * // 4. Not Found Handler - AFTER all routes, BEFORE error handler
 * app.use(notFoundHandler);
 * 
 * // 5. Error Handler - MUST BE LAST middleware
 * app.use(errorHandler);
 * 
 * // =========================================================================
 * // SERVER STARTUP
 * // =========================================================================
 * 
 * const PORT = process.env.PORT || 3000;
 * app.listen(PORT, () => {
 *   console.log(`Server running on port ${PORT}`);
 * });
 * 
 * module.exports = app;
 * ```
 */

/**
 * Middleware Execution Flow Documentation
 * 
 * Understanding the middleware execution flow is crucial for proper Express.js
 * application development. This documentation explains how requests flow through
 * the middleware stack and the importance of registration order.
 * 
 * **Successful Request Flow (GET /hello):**
 * 1. **requestLogger** - Logs incoming request, starts timing, calls next()
 * 2. **Express Built-ins** - Body parsing middleware (if registered)
 * 3. **Route Handler** - Processes GET /hello, sends response
 * 4. **requestLogger finish event** - Logs response details with timing
 * 
 * **404 Not Found Flow (GET /nonexistent):**
 * 1. **requestLogger** - Logs incoming request, starts timing, calls next()
 * 2. **Express Built-ins** - Body parsing middleware (if registered)  
 * 3. **Route Handlers** - No matching routes found, request continues
 * 4. **notFoundHandler** - Logs 404 event, sends 404 response, terminates
 * 5. **requestLogger finish event** - Logs 404 response with timing
 * 
 * **Error Handling Flow (Route throws error):**
 * 1. **requestLogger** - Logs incoming request, starts timing, calls next()
 * 2. **Route Handler** - Throws error or returns rejected promise
 * 3. **Express 5 Auto-catch** - Automatically passes error to error handler
 * 4. **errorHandler** - Logs error details, sends error response, terminates
 * 5. **requestLogger finish event** - Logs error response with timing
 * 
 * **Critical Registration Order Rules:**
 * - requestLogger MUST be first to capture all requests
 * - Route handlers come after logging but before error handling
 * - notFoundHandler MUST be after routes but before errorHandler
 * - errorHandler MUST be the final middleware in the stack
 */

/**
 * Advanced Usage Patterns and Extensions
 * 
 * This section provides examples of advanced usage patterns and potential
 * extensions to the middleware system for educational purposes and future
 * application development.
 * 
 * **Conditional Middleware Registration:**
 * ```javascript
 * const { requestLogger, notFoundHandler, errorHandler } = require('./middleware');
 * 
 * // Only enable request logging in development and test environments
 * if (process.env.NODE_ENV !== 'production') {
 *   app.use(requestLogger);
 * }
 * 
 * // Always register error handling middleware
 * app.use(notFoundHandler);
 * app.use(errorHandler);
 * ```
 * 
 * **Middleware Customization with Configuration:**
 * ```javascript
 * // Future enhancement: Configurable middleware
 * const middleware = require('./middleware');
 * 
 * // Configure request logger with custom options
 * app.use(middleware.createRequestLogger({
 *   includeHeaders: true,
 *   logLevel: 'debug'
 * }));
 * ```
 * 
 * **Testing Middleware Integration:**
 * ```javascript
 * const request = require('supertest');
 * const express = require('express');
 * const { requestLogger, notFoundHandler, errorHandler } = require('./middleware');
 * 
 * const app = express();
 * app.use(requestLogger);
 * app.get('/test', (req, res) => res.send('OK'));
 * app.use(notFoundHandler);
 * app.use(errorHandler);
 * 
 * describe('Middleware Integration', () => {
 *   it('should handle successful requests', async () => {
 *     const response = await request(app).get('/test');
 *     expect(response.status).toBe(200);
 *     expect(response.text).toBe('OK');
 *   });
 * 
 *   it('should handle 404 errors', async () => {
 *     const response = await request(app).get('/nonexistent');
 *     expect(response.status).toBe(404);
 *     expect(response.body.error).toBe(true);
 *   });
 * });
 * ```
 */

/**
 * Performance and Security Considerations
 * 
 * **Performance Optimizations:**
 * - Request logging uses event-driven, non-blocking approach
 * - Error handling includes environment-aware detail exposure
 * - All middleware designed with minimal computational overhead
 * - High-precision timing measurements with microsecond accuracy
 * 
 * **Security Best Practices:**
 * - Production environments never expose internal error details
 * - Error messages are sanitized to prevent information disclosure
 * - All error conditions are logged for security monitoring
 * - Generic error responses prevent enumeration attacks
 * 
 * **Scalability Considerations:**
 * - Stateless middleware design enables horizontal scaling
 * - Efficient string manipulation and JSON serialization
 * - Minimal memory footprint with automatic garbage collection
 * - Compatible with load balancing and clustering strategies
 */

/**
 * Educational Learning Objectives
 * 
 * This middleware module supports the following learning objectives for
 * Node.js and Express.js development education:
 * 
 * **Core Concepts:**
 * - Understanding Express.js middleware patterns and execution flow
 * - Learning proper middleware registration order and dependencies
 * - Implementing centralized logging and error handling strategies
 * - Demonstrating production-ready code organization and documentation
 * 
 * **Advanced Topics:**
 * - Event-driven programming with response lifecycle events
 * - Environment-aware configuration and security practices
 * - Integration with centralized utilities and shared components
 * - Testing strategies for middleware and application integration
 * 
 * **Best Practices:**
 * - Comprehensive documentation and code clarity standards
 * - Error handling and graceful degradation techniques
 * - Performance optimization and resource management
 * - Security considerations and information disclosure prevention
 * 
 * **Professional Development:**
 * - Enterprise-grade application architecture patterns
 * - Maintainable code structure and dependency management
 * - Production deployment considerations and monitoring integration
 * - Team collaboration and code review best practices
 */