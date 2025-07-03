/**
 * Express Router for the '/hello' endpoint
 * 
 * This module defines a modular Express router that handles HTTP requests to the '/hello' endpoint.
 * It implements proper HTTP method validation, returning the standardized "Hello world" message for
 * GET requests and appropriate error responses for unsupported methods.
 * 
 * The router is designed for educational purposes to demonstrate:
 * - Express.js routing patterns
 * - HTTP method enforcement
 * - Static response generation
 * - Centralized error handling integration
 * - Modular route organization
 * 
 * Features:
 * - Handles GET requests to '/hello' with static "Hello world" response
 * - Enforces HTTP method restrictions (GET only)
 * - Returns 405 Method Not Allowed for unsupported methods
 * - Integrates with centralized error handling through custom error classes
 * - Uses standardized response messages from configuration constants
 * - Optimized for fast response times (<100ms target)
 * 
 * @module routes/hello
 * @requires express Router (v5.1.0)
 * @requires ../config/constants RESPONSE_MESSAGES
 * @requires ../utils/errorTypes MethodNotAllowedError
 */

// External dependencies
const { Router } = require('express'); // Express.js v5.1.0 - Provides Router class for modular route handlers

// Internal dependencies
const { RESPONSE_MESSAGES } = require('../config/constants.js'); // Standardized response messages
const { MethodNotAllowedError } = require('../utils/errorTypes.js'); // Custom error class for 405 Method Not Allowed

/**
 * Express Router instance for the '/hello' endpoint
 * 
 * Creates a modular router that can be mounted in the main application.
 * This router handles all HTTP requests to the '/hello' path with proper
 * method validation and response generation.
 * 
 * @type {express.Router}
 */
const router = Router();

/**
 * Handles GET requests to the '/hello' endpoint
 * 
 * This function processes valid HTTP GET requests to the '/hello' endpoint and returns
 * a plain text "Hello world" response. It sets the appropriate Content-Type header
 * and HTTP status code for optimal client compatibility.
 * 
 * Response characteristics:
 * - Content-Type: text/plain; charset=utf-8
 * - HTTP Status: 200 OK
 * - Response Body: "Hello world" (from RESPONSE_MESSAGES.HELLO)
 * - Target Response Time: <100ms
 * 
 * @async
 * @function helloHandler
 * @param {Object} req - Express Request object containing client request information
 * @param {Object} res - Express Response object for sending response to client
 * @param {Function} next - Express next middleware function (used only for error handling)
 * @returns {void} Sends a plain text response directly to the client
 * 
 * @example
 * // GET request to /hello
 * // Response: 200 OK
 * // Content-Type: text/plain; charset=utf-8
 * // Body: "Hello world"
 */
function helloHandler(req, res, next) {
  try {
    // Set Content-Type header to plain text with UTF-8 encoding
    // This ensures proper character encoding and MIME type specification
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    
    // Send the standardized hello message with HTTP 200 status
    // Using RESPONSE_MESSAGES.HELLO ensures consistency across the application
    res.status(200).send(RESPONSE_MESSAGES.HELLO);
    
    // Note: next() is not called for successful responses
    // Only called when an error occurs for centralized error handling
    
  } catch (error) {
    // Pass any unexpected errors to Express error handling middleware
    next(error);
  }
}

/**
 * Handles unsupported HTTP methods for the '/hello' endpoint
 * 
 * This function processes HTTP requests using methods other than GET (such as POST, PUT, DELETE, etc.)
 * and throws a MethodNotAllowedError to be handled by the centralized error handling system.
 * This ensures proper HTTP method enforcement and standardized error responses.
 * 
 * Error characteristics:
 * - HTTP Status: 405 Method Not Allowed
 * - Error Message: "Method Not Allowed" (from RESPONSE_MESSAGES.METHOD_NOT_ALLOWED)
 * - Error Class: MethodNotAllowedError (custom error type)
 * 
 * @async
 * @function methodNotAllowedHandler
 * @param {Object} req - Express Request object containing client request information
 * @param {Object} res - Express Response object (not used directly, handled by error middleware)
 * @param {Function} next - Express next middleware function for error propagation
 * @returns {void} Passes a MethodNotAllowedError to the centralized error handler
 * 
 * @throws {MethodNotAllowedError} Always throws this error for centralized handling
 * 
 * @example
 * // POST request to /hello
 * // Throws MethodNotAllowedError -> 405 Method Not Allowed response
 */
function methodNotAllowedHandler(req, res, next) {
  // Create a new MethodNotAllowedError with the standardized message
  // This error will be caught by the centralized error handling middleware
  const error = new MethodNotAllowedError(RESPONSE_MESSAGES.METHOD_NOT_ALLOWED);
  
  // Pass the error to the Express error handling middleware
  // This ensures consistent error response formatting across the application
  next(error);
}

// Route Configuration
// ===================

/**
 * Route: GET /hello
 * 
 * Handles HTTP GET requests to the '/hello' endpoint.
 * Returns a static "Hello world" message as plain text.
 * 
 * This route demonstrates:
 * - Basic Express.js route handling
 * - Static response generation
 * - Proper HTTP status code usage
 * - Content-Type header management
 */
router.get('/hello', helloHandler);

/**
 * Route: ALL /hello (except GET)
 * 
 * Handles all HTTP methods except GET for the '/hello' endpoint.
 * Returns a 405 Method Not Allowed error through centralized error handling.
 * 
 * This route demonstrates:
 * - HTTP method enforcement
 * - Custom error handling integration
 * - Proper REST API method restriction
 * - Centralized error management
 * 
 * Supported methods that will trigger this handler:
 * - POST, PUT, DELETE, PATCH, HEAD, OPTIONS, etc.
 */
router.all('/hello', methodNotAllowedHandler);

// Export Configuration
// ====================

/**
 * Export the configured router for use in the main application
 * 
 * This router can be mounted in the main Express application using:
 * app.use('/', helloRouter);
 * 
 * The router provides:
 * - GET /hello -> Returns "Hello world" (200 OK)
 * - ALL /hello (except GET) -> Returns 405 Method Not Allowed
 * - Integration with centralized error handling
 * - Standardized response message usage
 * - Modular route organization
 * 
 * @exports router
 * @type {express.Router}
 */
module.exports = {
  router
};