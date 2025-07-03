// Internal imports
const { logger } = require('./logger.js'); // Provides a singleton logger instance for logging response events, errors, and operational messages

// Global constants for standardized HTTP response handling
const DEFAULT_CONTENT_TYPE = 'text/plain; charset=utf-8';
const HELLO_WORLD_MESSAGE = 'Hello world';

/**
 * Sends a 200 OK response with a plain text body and appropriate headers.
 * Used for successful GET requests to /hello endpoint.
 * 
 * @param {Object} res - Express response object for sending HTTP response
 * @param {string} [message=HELLO_WORLD_MESSAGE] - Optional message content (defaults to HELLO_WORLD_MESSAGE)
 * @returns {void} Sends HTTP 200 response to client
 */
function sendOk(res, message = HELLO_WORLD_MESSAGE) {
    // Set status code to 200 for successful response
    res.status(200);
    
    // Set Content-Type header to DEFAULT_CONTENT_TYPE for consistent text response
    res.set('Content-Type', DEFAULT_CONTENT_TYPE);
    
    // Send message body with the specified content
    res.send(message);
    
    // Log info-level message for successful response tracking
    logger.info(`HTTP 200 OK response sent: "${message}"`);
}

/**
 * Sends a 404 Not Found response with a plain text message and appropriate headers.
 * Used for unmatched routes and invalid endpoint requests.
 * 
 * @param {Object} res - Express response object for sending HTTP response
 * @param {string} [message='Not Found'] - Optional error message (defaults to 'Not Found')
 * @returns {void} Sends HTTP 404 response to client
 */
function sendNotFound(res, message = 'Not Found') {
    // Set status code to 404 for resource not found
    res.status(404);
    
    // Set Content-Type header to DEFAULT_CONTENT_TYPE for consistent text response
    res.set('Content-Type', DEFAULT_CONTENT_TYPE);
    
    // Send error message body with the specified content
    res.send(message);
    
    // Log warn-level message for not found response tracking
    logger.warn(`HTTP 404 Not Found response sent: "${message}"`);
}

/**
 * Sends a 405 Method Not Allowed response with a plain text message and appropriate headers.
 * Used for invalid HTTP methods on defined routes (e.g., POST to /hello endpoint).
 * 
 * @param {Object} res - Express response object for sending HTTP response
 * @param {string} [message='Method Not Allowed'] - Optional error message (defaults to 'Method Not Allowed')
 * @returns {void} Sends HTTP 405 response to client
 */
function sendMethodNotAllowed(res, message = 'Method Not Allowed') {
    // Set status code to 405 for method not allowed
    res.status(405);
    
    // Set Content-Type header to DEFAULT_CONTENT_TYPE for consistent text response
    res.set('Content-Type', DEFAULT_CONTENT_TYPE);
    
    // Send error message body with the specified content
    res.send(message);
    
    // Log warn-level message for method not allowed response tracking
    logger.warn(`HTTP 405 Method Not Allowed response sent: "${message}"`);
}

/**
 * Sends a 500 Internal Server Error response with a plain text message and appropriate headers.
 * Used for unhandled exceptions, server errors, and unexpected system failures.
 * 
 * @param {Object} res - Express response object for sending HTTP response
 * @param {string} [message='Internal Server Error'] - Optional error message (defaults to 'Internal Server Error')
 * @returns {void} Sends HTTP 500 response to client
 */
function sendServerError(res, message = 'Internal Server Error') {
    // Set status code to 500 for internal server error
    res.status(500);
    
    // Set Content-Type header to DEFAULT_CONTENT_TYPE for consistent text response
    res.set('Content-Type', DEFAULT_CONTENT_TYPE);
    
    // Send error message body with the specified content
    res.send(message);
    
    // Log error-level message for server error response tracking
    logger.error(`HTTP 500 Internal Server Error response sent: "${message}"`);
}

/**
 * Sends a 400 Bad Request response with a plain text message and appropriate headers.
 * Used for malformed requests, invalid request parameters, and client-side input errors.
 * 
 * @param {Object} res - Express response object for sending HTTP response
 * @param {string} [message='Bad Request'] - Optional error message (defaults to 'Bad Request')
 * @returns {void} Sends HTTP 400 response to client
 */
function sendBadRequest(res, message = 'Bad Request') {
    // Set status code to 400 for bad request
    res.status(400);
    
    // Set Content-Type header to DEFAULT_CONTENT_TYPE for consistent text response
    res.set('Content-Type', DEFAULT_CONTENT_TYPE);
    
    // Send error message body with the specified content
    res.send(message);
    
    // Log warn-level message for bad request response tracking
    logger.warn(`HTTP 400 Bad Request response sent: "${message}"`);
}

// Export all response helper functions for use throughout the application
// These functions provide standardized HTTP response generation with consistent
// headers, status codes, and logging for maintainability and production readiness
module.exports = {
    sendOk,
    sendNotFound,
    sendMethodNotAllowed,
    sendServerError,
    sendBadRequest
};