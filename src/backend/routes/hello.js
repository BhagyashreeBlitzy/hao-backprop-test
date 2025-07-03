// External imports
const { Router } = require('express'); // v5.1.0 - Express Router constructor for defining modular route handlers

// Internal imports
const { sendOk, sendMethodNotAllowed } = require('../utils/httpResponses.js'); // Standardized response helpers for consistent HTTP response generation

// Create Express router instance for hello endpoint routing
const helloRouter = Router();

/**
 * Handles GET requests to /hello endpoint.
 * Responds with 'Hello world' message and HTTP 200 status using standardized response helper.
 * Provides core educational demonstration of successful HTTP response generation.
 * 
 * @param {Object} req - Express request object containing HTTP request details
 * @param {Object} res - Express response object for sending HTTP response
 * @returns {void} Sends HTTP 200 response with 'Hello world' message
 */
function helloGetHandler(req, res) {
    // Invoke sendOk helper to send standardized 200 OK response with 'Hello world' message and correct headers
    sendOk(res);
}

/**
 * Handles non-GET requests to /hello endpoint.
 * Responds with HTTP 405 Method Not Allowed using standardized response helper.
 * Demonstrates proper RESTful API design and method filtering for educational purposes.
 * 
 * @param {Object} req - Express request object containing HTTP request details  
 * @param {Object} res - Express response object for sending HTTP response
 * @returns {void} Sends HTTP 405 response indicating method is not allowed
 */
function helloMethodNotAllowedHandler(req, res) {
    // Invoke sendMethodNotAllowed helper to send standardized 405 Method Not Allowed response with correct headers
    sendMethodNotAllowed(res);
}

// Define GET route for /hello endpoint - primary educational endpoint
// Maps GET requests to helloGetHandler for successful 'Hello world' response
helloRouter.get('/hello', helloGetHandler);

// Define catch-all route for non-GET methods to /hello endpoint
// Maps all other HTTP methods (POST, PUT, DELETE, PATCH, etc.) to method not allowed handler
// This ensures proper HTTP method filtering and RESTful API compliance
helloRouter.all('/hello', helloMethodNotAllowedHandler);

// Export the Express router for the /hello endpoint
// Enables mounting by central router (routes/index.js) for modular route organization
// Supports educational demonstration and production-ready endpoint implementation
module.exports = { helloRouter };