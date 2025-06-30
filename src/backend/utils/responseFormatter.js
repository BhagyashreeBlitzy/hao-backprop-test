/**
 * Response Formatter Utility
 * 
 * This module provides standardized HTTP response formatting utilities for the Node.js tutorial backend.
 * It exports pure functions to generate consistent, educationally clear HTTP responses for both success
 * and error scenarios, ensuring all API responses follow a uniform structure throughout the application.
 * 
 * Key Benefits:
 * - Centralized response formatting logic eliminates code duplication
 * - Ensures consistent response structure across all endpoints
 * - Supports both plain text and JSON responses based on data type
 * - Provides secure error handling that prevents information leakage in production
 * - Enables educational clarity through comprehensive inline documentation
 * - Follows Express.js best practices for response handling
 * 
 * Usage Context:
 * - Route handlers (e.g., /hello endpoint) for successful responses
 * - Error handling middleware for standardized error responses
 * - Not found middleware for 404 error responses
 * - Any module requiring consistent HTTP response formatting
 * 
 * Design Principles:
 * - Pure functions without side effects (except response sending)
 * - Educational value through comprehensive documentation
 * - Production-ready security practices
 * - Maintainable and testable code structure
 * - Express.js framework compatibility
 * 
 * @fileoverview Standardized response formatting utilities for HTTP responses
 * @author Node.js Tutorial Project
 * @version 1.0.0
 * @requires express ^5.1.0
 */

// Import HTTP status code constants for consistent status code usage
const { HTTP_OK, HTTP_INTERNAL_SERVER_ERROR } = require('./httpStatusCodes.js');

// Import generic error message constant for secure error handling
const { GENERIC_ERROR_MESSAGE } = require('./constants.js');

/**
 * Formats and sends a standardized HTTP success response
 * 
 * This function provides a centralized way to send successful HTTP responses with consistent
 * formatting across the application. It supports both plain text and JSON responses based on
 * the data type, ensuring appropriate Content-Type headers are set automatically.
 * 
 * Features:
 * - Automatic Content-Type detection based on data type
 * - Configurable HTTP status code with sensible default
 * - Optional custom headers support
 * - Proper response termination to prevent hanging connections
 * - Support for empty responses when no data is provided
 * 
 * Educational Value:
 * - Demonstrates proper Express.js response handling patterns
 * - Shows how to set headers programmatically
 * - Illustrates different response content types
 * - Provides examples of function parameter handling
 * 
 * @param {Object} res - Express.js response object for sending HTTP response
 * @param {any} [data] - Optional response body or payload data
 *                      - String: sent as plain text with Content-Type: text/plain
 *                      - Object: sent as JSON with Content-Type: application/json
 *                      - Undefined: results in empty response body
 * @param {number} [status=HTTP_OK] - Optional HTTP status code, defaults to 200 OK
 * @param {Object} [headers] - Optional additional headers to set on the response
 *                            - Object with key-value pairs representing header names and values
 * @returns {void} - Function sends response and terminates, no return value
 * 
 * @example
 * // Plain text response (Hello endpoint)
 * formatSuccessResponse(res, 'Hello world');
 * 
 * @example  
 * // JSON response with custom status
 * formatSuccessResponse(res, { message: 'User created' }, 201);
 * 
 * @example
 * // Response with custom headers
 * formatSuccessResponse(res, data, 200, { 'X-Custom-Header': 'value' });
 * 
 * @example
 * // Empty response (no content)
 * formatSuccessResponse(res, undefined, 204);
 */
function formatSuccessResponse(res, data, status = HTTP_OK, headers = null) {
    // Step 1: Set the HTTP status code on the response object
    // Default to HTTP_OK (200) if no status is provided, ensuring proper HTTP compliance
    res.status(status);
    
    // Step 2: Set additional headers if provided
    // Iterate through the headers object and set each header on the response
    if (headers && typeof headers === 'object') {
        // Use Object.entries to iterate over header key-value pairs
        Object.entries(headers).forEach(([headerName, headerValue]) => {
            // Set each header individually to maintain header integrity
            res.set(headerName, headerValue);
        });
    }
    
    // Step 3: Handle response data based on its type
    // Different data types require different Content-Type headers and processing
    if (typeof data === 'string') {
        // String data: Send as plain text response
        // Set Content-Type to text/plain for proper browser handling
        res.set('Content-Type', 'text/plain');
        res.send(data);
    } else if (data !== undefined && data !== null) {
        // Object/array data: Send as JSON response
        // Express.js automatically sets Content-Type to application/json with res.json()
        res.json(data);
    } else {
        // Undefined/null data: Send empty response body
        // Useful for operations that don't return data (e.g., DELETE operations)
        res.end();
    }
    
    // Note: Response is automatically ended by Express.js send(), json(), or end() methods
    // No additional response.end() call is needed, and attempting to send more data
    // after this function completes will result in an error
}

/**
 * Formats and sends a standardized HTTP error response
 * 
 * This function provides a centralized way to send error HTTP responses with consistent
 * formatting and security considerations. It ensures error responses never leak internal
 * system details in production while providing helpful information for development.
 * 
 * Security Features:
 * - Prevents information disclosure in production environments
 * - Sanitizes error messages to avoid exposing sensitive data
 * - Optional development details that are excluded in production
 * - Consistent error response structure for API consumers
 * 
 * Educational Value:
 * - Demonstrates proper error handling patterns in Node.js
 * - Shows environment-aware response formatting
 * - Illustrates JSON error response structure
 * - Provides examples of security-conscious error handling
 * 
 * @param {Object} res - Express.js response object for sending HTTP error response
 * @param {number} [status=HTTP_INTERNAL_SERVER_ERROR] - HTTP error status code, defaults to 500
 * @param {string} [message=GENERIC_ERROR_MESSAGE] - Error message for the client
 *                                                  - Should be user-friendly and non-technical
 *                                                  - Defaults to generic error message for security
 * @param {Object} [details] - Optional additional error details for development environments
 *                           - May include stack traces, debug information, or error context
 *                           - Automatically excluded in production for security
 * @returns {void} - Function sends response and terminates, no return value
 * 
 * @example
 * // Basic error response (500 with generic message)
 * formatErrorResponse(res);
 * 
 * @example
 * // Custom error with specific status and message
 * formatErrorResponse(res, 404, 'Resource not found');
 * 
 * @example
 * // Development error with additional details
 * formatErrorResponse(res, 400, 'Validation failed', { 
 *   field: 'email', 
 *   reason: 'Invalid format' 
 * });
 * 
 * @example
 * // Error with stack trace for development
 * formatErrorResponse(res, 500, 'Database connection failed', {
 *   stack: error.stack,
 *   timestamp: new Date().toISOString()
 * });
 */
function formatErrorResponse(res, status = HTTP_INTERNAL_SERVER_ERROR, message = GENERIC_ERROR_MESSAGE, details = null) {
    // Step 1: Set the HTTP status code on the response object
    // Default to HTTP_INTERNAL_SERVER_ERROR (500) for generic server errors
    res.status(status);
    
    // Step 2: Set Content-Type to application/json for structured error responses
    // JSON format provides consistent, parseable error responses for API consumers
    res.set('Content-Type', 'application/json');
    
    // Step 3: Construct the response body object with standard error structure
    // This creates a consistent error response format across the entire application
    const responseBody = {
        // Error flag indicates this is an error response (helps with client-side handling)
        error: true,
        
        // User-friendly error message that can be safely displayed to clients
        message: message
    };
    
    // Step 4: Include additional details only in non-production environments
    // This provides helpful debugging information during development while maintaining
    // security in production by preventing information disclosure
    if (details && process.env.NODE_ENV !== 'production') {
        // Add details object to response body for development/testing environments
        // This may include stack traces, validation errors, or debugging context
        responseBody.details = details;
    }
    
    // Step 5: Send the JSON error response and end the response
    // Express.js automatically serializes the object to JSON and sets appropriate headers
    res.json(responseBody);
    
    // Note: res.json() automatically ends the response, so no additional res.end() is needed
    // Attempting to send more data after this will result in an Express.js error
}

/**
 * Module Exports
 * 
 * This module exports the two primary response formatting functions using CommonJS
 * syntax for compatibility with Node.js require() system. Both functions are exported
 * as named exports to support selective importing and improve code clarity.
 * 
 * Export Benefits:
 * - Named exports allow selective importing: const { formatSuccessResponse } = require(...)
 * - Descriptive function names improve code readability and maintainability
 * - JSDoc documentation is preserved for IDE autocompletion and IntelliSense
 * - Functions can be imported individually to reduce memory usage in importing modules
 * 
 * Usage Examples:
 * 
 * // Import both functions
 * const { formatSuccessResponse, formatErrorResponse } = require('./utils/responseFormatter');
 * 
 * // Import single function
 * const { formatSuccessResponse } = require('./utils/responseFormatter');
 * 
 * // Import entire module
 * const responseFormatter = require('./utils/responseFormatter');
 * responseFormatter.formatSuccessResponse(res, data);
 */

module.exports = {
    /**
     * Standardized success response formatter for consistent HTTP success responses
     * 
     * Used by route handlers and middleware to ensure all successful responses
     * follow the same structure and format, supporting both plain text and JSON
     * responses based on the data type provided.
     * 
     * @function formatSuccessResponse
     * @memberof module:responseFormatter
     */
    formatSuccessResponse,
    
    /**
     * Standardized error response formatter for consistent HTTP error responses
     * 
     * Used by error handling middleware and route handlers to ensure all error
     * responses follow the same structure and maintain security by preventing
     * information disclosure in production environments.
     * 
     * @function formatErrorResponse  
     * @memberof module:responseFormatter
     */
    formatErrorResponse
};

/**
 * Implementation Notes:
 * 
 * 1. Response Termination: Both functions automatically terminate the HTTP response
 *    using Express.js methods (send(), json(), end()). Calling code should not
 *    attempt to send additional data after calling these functions.
 * 
 * 2. Error Security: The formatErrorResponse function never leaks internal error
 *    details in production environments. Details are only included when NODE_ENV
 *    is not set to 'production', supporting safe development debugging.
 * 
 * 3. Content-Type Handling: The formatSuccessResponse function automatically sets
 *    appropriate Content-Type headers based on the data type (text/plain for strings,
 *    application/json for objects), following HTTP best practices.
 * 
 * 4. Status Code Defaults: Both functions provide sensible defaults for HTTP status
 *    codes (200 for success, 500 for errors) while allowing customization for
 *    specific use cases.
 * 
 * 5. Header Management: Custom headers can be set through the formatSuccessResponse
 *    function, allowing for flexible response customization while maintaining
 *    the standardized response structure.
 * 
 * 6. Educational Purpose: This module serves as an educational example of proper
 *    response handling in Express.js applications, demonstrating best practices
 *    for API response formatting and security considerations.
 */