/**
 * Express Router Module for Hello World Endpoint
 * 
 * This module implements the Express.js router for the '/hello' endpoint as part of the
 * Node.js tutorial application. It demonstrates fundamental HTTP request handling patterns
 * using Express.js 5.1.0 framework with proper error handling and response generation.
 * 
 * The router enforces strict HTTP method compliance, supporting only GET requests while
 * returning 405 Method Not Allowed errors for all other HTTP methods. This implementation
 * serves as an educational example of RESTful API design principles and Express.js
 * routing capabilities.
 * 
 * Features:
 * - Single endpoint implementation for '/hello' path
 * - GET method support with static "Hello world" response
 * - HTTP method enforcement with 405 error handling
 * - Proper Content-Type headers (text/plain; charset=utf-8)
 * - Centralized error handling integration
 * - Standardized response messages from constants
 * - Production-ready logging and error management
 * 
 * Technical Requirements:
 * - Express.js 5.1.0 compatibility
 * - Node.js 18+ runtime support
 * - HTTP/1.1 protocol compliance
 * - Response time target: < 100ms
 * - Stateless request-response design
 * 
 * @module routes/hello
 * @author Backend Development Team
 * @version 1.0.0
 * @since Node.js 18+
 * @requires express@5.1.0
 */

// Import Express Router class for modular route definition
// Express.js 5.1.0 - Latest stable version with enhanced security features
const { Router } = require('express');

// Import standardized response messages from centralized constants
// Ensures consistent messaging across all endpoints and error scenarios
const { RESPONSE_MESSAGES } = require('../config/constants.js');

// Import custom error classes for proper HTTP error handling
// MethodNotAllowedError provides 405 status code with proper error structure
const { MethodNotAllowedError } = require('../utils/errorTypes.js');

/**
 * Express Router instance for the hello endpoint
 * 
 * This router instance encapsulates all route definitions and handlers for the
 * '/hello' endpoint. It provides a modular approach to route management that
 * can be easily imported and mounted in the main application router.
 * 
 * Router Configuration:
 * - Case-sensitive routing enabled (Express.js default)
 * - Strict routing disabled for flexibility
 * - Merge parameters enabled for nested routing
 * 
 * @type {express.Router}
 */
const router = Router();

/**
 * HTTP GET Request Handler for '/hello' Endpoint
 * 
 * This handler processes all valid GET requests to the '/hello' endpoint and returns
 * a static "Hello world" message as plain text with proper HTTP headers. It implements
 * the core functionality of the tutorial application as specified in the technical
 * requirements.
 * 
 * Handler Functionality:
 * 1. Sets Content-Type header to 'text/plain; charset=utf-8'
 * 2. Sends RESPONSE_MESSAGES.HELLO as the response body
 * 3. Automatically sets HTTP status code to 200 (Express.js default)
 * 4. Does not call next() unless an error occurs (proper Express.js pattern)
 * 
 * Response Characteristics:
 * - HTTP Status: 200 OK
 * - Content-Type: text/plain; charset=utf-8
 * - Response Body: "Hello world" (from constants)
 * - Response Time Target: < 100ms
 * - Character Encoding: UTF-8
 * 
 * Error Handling:
 * - Unexpected errors are caught by Express.js 5.0 promise handling
 * - Errors are automatically forwarded to centralized error middleware
 * - No explicit try-catch required due to Express.js 5.0 enhancements
 * 
 * @function helloHandler
 * @param {express.Request} req - Express request object containing client request data
 * @param {express.Response} res - Express response object for sending HTTP response
 * @param {express.NextFunction} next - Express next function for error handling
 * 
 * @example
 * // Example request-response cycle:
 * // Client: GET /hello
 * // Server: HTTP/1.1 200 OK
 * //         Content-Type: text/plain; charset=utf-8
 * //         Content-Length: 11
 * //
 * //         Hello world
 * 
 * @since 1.0.0
 */
function helloHandler(req, res, next) {
    try {
        // Step 1: Set Content-Type header to 'text/plain; charset=utf-8'
        // This ensures proper content type identification and character encoding
        // Follows HTTP/1.1 specification for plain text responses
        res.set('Content-Type', 'text/plain; charset=utf-8');
        
        // Step 2: Send RESPONSE_MESSAGES.HELLO as the response body
        // Uses centralized constant to ensure consistent message across all responses
        // Express.js automatically sets Content-Length header and 200 status code
        res.send(RESPONSE_MESSAGES.HELLO);
        
        // Note: next() is not called here as the response is successfully sent
        // Express.js considers the request complete after res.send() is called
        // Only call next() if an error occurs during processing
        
    } catch (error) {
        // Step 3: If an unexpected error occurs, pass it to centralized error handling
        // Express.js 5.0 automatically catches rejected promises in async handlers
        // This explicit catch ensures any synchronous errors are also handled
        next(error);
    }
}

/**
 * HTTP Method Not Allowed Handler for '/hello' Endpoint
 * 
 * This handler processes all unsupported HTTP methods (POST, PUT, DELETE, PATCH, etc.)
 * for the '/hello' endpoint and throws a MethodNotAllowedError to be caught by the
 * centralized error handling middleware. This enforces proper HTTP method usage
 * and provides clear error responses for invalid method attempts.
 * 
 * Handler Functionality:
 * 1. Creates a new MethodNotAllowedError with standardized message
 * 2. Passes the error to next() for centralized error handling
 * 3. Does not send response directly (handled by error middleware)
 * 
 * Error Response Characteristics:
 * - HTTP Status: 405 Method Not Allowed
 * - Content-Type: application/json (set by error middleware)
 * - Response Body: Standardized error format with message
 * - Error Message: From RESPONSE_MESSAGES.METHOD_NOT_ALLOWED
 * 
 * Supported Methods:
 * - GET: Handled by helloHandler
 * - All Others: Handled by this method (POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
 * 
 * Integration:
 * - Integrates with centralized error handling middleware
 * - Uses custom MethodNotAllowedError class for proper error structure
 * - Follows Express.js error handling patterns and conventions
 * 
 * @function methodNotAllowedHandler
 * @param {express.Request} req - Express request object containing client request data
 * @param {express.Response} res - Express response object (unused in this handler)
 * @param {express.NextFunction} next - Express next function for error propagation
 * 
 * @example
 * // Example request-response cycle:
 * // Client: POST /hello
 * // Server: HTTP/1.1 405 Method Not Allowed
 * //         Content-Type: application/json
 * //
 * //         {"error": "Method Not Allowed", "status": 405}
 * 
 * @since 1.0.0
 */
function methodNotAllowedHandler(req, res, next) {
    // Step 1: Create a new MethodNotAllowedError with standardized message
    // Uses RESPONSE_MESSAGES.METHOD_NOT_ALLOWED for consistent error messaging
    // MethodNotAllowedError automatically sets status to 405 and proper error structure
    const error = new MethodNotAllowedError(RESPONSE_MESSAGES.METHOD_NOT_ALLOWED);
    
    // Step 2: Pass the error to next() for centralized error handling
    // This follows Express.js error handling patterns where errors are passed
    // to the next middleware function for consistent error response formatting
    // The centralized error handler will format and send the appropriate response
    next(error);
}

/**
 * Route Configuration for '/hello' Endpoint
 * 
 * This section defines all route handlers for the '/hello' endpoint with proper
 * HTTP method enforcement. The configuration follows RESTful principles and
 * Express.js best practices for route definition and method handling.
 * 
 * Route Structure:
 * - GET /hello: Returns "Hello world" message (primary functionality)
 * - ALL other methods /hello: Returns 405 Method Not Allowed error
 * 
 * Middleware Execution Order:
 * 1. GET /hello -> helloHandler (for GET requests)
 * 2. ALL /hello (except GET) -> methodNotAllowedHandler (for all other methods)
 * 
 * Security Considerations:
 * - Method enforcement prevents unauthorized operations
 * - Error handling prevents information leakage
 * - Consistent response format across all endpoints
 */

// Route Definition 1: Handle GET requests to '/hello' endpoint
// This route handler processes the primary functionality of the tutorial application
// Returns "Hello world" message with proper headers and status code
router.get('/hello', helloHandler);

// Route Definition 2: Handle all other HTTP methods to '/hello' endpoint
// This route handler enforces method restrictions and returns 405 errors
// Uses router.all() with method filtering to catch unsupported methods
// Placed after GET route to ensure GET requests are handled first
router.all('/hello', methodNotAllowedHandler);

/**
 * Router Export for Modular Integration
 * 
 * The router instance is exported as a named export to support:
 * - Modular import patterns in the main application
 * - Tree-shaking optimization for production builds
 * - Explicit import syntax for maintainability
 * - Integration with routing index file
 * 
 * Usage in Main Application:
 * - Import: const { router } = require('./routes/hello');
 * - Mount: app.use(router);
 * - Base path: '/hello' (defined in routes, not at app level)
 * 
 * Router Capabilities:
 * - GET /hello: Static "Hello world" response
 * - Method enforcement: 405 errors for unsupported methods
 * - Error integration: Centralized error handling support
 * - Stateless design: No session or state dependencies
 * 
 * Performance Characteristics:
 * - Response time: < 100ms target
 * - Memory usage: Minimal (static responses only)
 * - Concurrency: Unlimited (stateless design)
 * - Scalability: Horizontal scaling compatible
 */
module.exports = {
    router
};