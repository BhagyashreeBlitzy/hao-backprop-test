/**
 * Custom Error Classes for Standardized HTTP Error Handling
 * 
 * This module defines a comprehensive set of custom error classes that provide
 * standardized error handling throughout the Node.js Express.js backend application.
 * These error classes ensure consistent error structure, proper HTTP status codes,
 * and secure error responses that don't leak sensitive information in production.
 * 
 * The error hierarchy is built on the Node.js built-in Error class and provides:
 * - Base HttpError class for all HTTP-related errors
 * - Specific error classes for common HTTP error scenarios (404, 405, 500)
 * - Consistent error structure with status, message, and optional details
 * - Integration with Express.js middleware and error handling pipeline
 * 
 * Compatible with Node.js 18+ and Express.js 5.1.0
 * 
 * @module errorTypes
 * @author Backend Development Team
 * @version 1.0.0
 * @since Node.js 18+
 */

// Global constants for default error handling
// These constants provide fallback values when specific error details are not provided
const DEFAULT_ERROR_STATUS = 500;
const DEFAULT_ERROR_MESSAGE = 'Internal Server Error';

/**
 * Base class for all HTTP-related errors in the application.
 * 
 * This class extends the built-in JavaScript Error class to provide a consistent
 * structure for HTTP errors throughout the backend. It encapsulates an HTTP status
 * code, human-readable message, and optional debugging details.
 * 
 * Features:
 * - Proper inheritance from Error class with stack trace preservation
 * - HTTP status code integration for Express.js response handling
 * - Optional details object for debugging and client feedback
 * - Proper error name setting for clear stack traces
 * - Environment-aware error handling support
 * 
 * Usage:
 * - Used as parent class for all custom error types
 * - Can be instantiated directly for custom HTTP errors
 * - Integrates with Express.js error handling middleware
 * - Supports both operational and programmer error patterns
 * 
 * @class HttpError
 * @extends {Error}
 */
class HttpError extends Error {
    /**
     * Creates a new HttpError instance with specified status, message, and optional details.
     * 
     * This constructor implements the complete error initialization sequence:
     * 1. Calls parent Error constructor with the message
     * 2. Sets HTTP status code with fallback to default
     * 3. Ensures message is set with fallback to default
     * 4. Stores optional details for debugging purposes
     * 5. Sets proper error name for stack trace clarity
     * 6. Captures stack trace for debugging (when available)
     * 
     * Error Structure:
     * - status: HTTP status code (number)
     * - message: Human-readable error message (string)
     * - details: Optional additional information (object)
     * - name: Error class name for identification
     * - stack: Stack trace for debugging
     * 
     * @param {number} [status=500] - HTTP status code for the error response
     * @param {string} [message='Internal Server Error'] - Human-readable error message
     * @param {object} [details] - Optional details object for debugging or client feedback
     * 
     * @example
     * // Basic error creation
     * const error = new HttpError(400, 'Bad Request');
     * 
     * @example
     * // Error with details
     * const error = new HttpError(422, 'Validation Failed', {
     *   field: 'email',
     *   reason: 'Invalid format'
     * });
     * 
     * @example
     * // Default error (500 Internal Server Error)
     * const error = new HttpError();
     */
    constructor(status, message, details) {
        // Step 1: Call super(message) to initialize the base Error class
        // This ensures proper Error inheritance and message handling
        super(message || DEFAULT_ERROR_MESSAGE);
        
        // Step 2: Assign this.status = status (default to 500 if not provided)
        // HTTP status codes are essential for proper client-server communication
        // Fallback to DEFAULT_ERROR_STATUS ensures we always have a valid status
        this.status = typeof status === 'number' ? status : DEFAULT_ERROR_STATUS;
        
        // Step 3: Assign this.message = message (default to 'Internal Server Error' if not provided)
        // Ensure we always have a meaningful error message for logging and debugging
        // The message was already passed to super(), but we ensure it's properly set
        this.message = message || DEFAULT_ERROR_MESSAGE;
        
        // Step 4: Assign this.details = details (default to undefined if not provided)
        // Details provide additional context for debugging without exposing sensitive information
        // This is optional and can contain structured data for error analysis
        this.details = details;
        
        // Step 5: Set this.name = this.constructor.name for stack trace clarity
        // This ensures the error name reflects the actual class (HttpError, NotFoundError, etc.)
        // Critical for debugging and error identification in logs
        this.name = this.constructor.name;
        
        // Step 6: Capture the stack trace (if available in the environment)
        // Error.captureStackTrace is a V8-specific feature that provides clean stack traces
        // It removes the constructor call from the stack trace for cleaner debugging
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

/**
 * Represents a 404 Not Found error for missing resources or routes.
 * 
 * This error class is used when requested resources, routes, or endpoints
 * cannot be found on the server. It automatically sets the HTTP status to 404
 * and provides appropriate default messaging for client communication.
 * 
 * Common Use Cases:
 * - Route handlers for undefined endpoints
 * - Resource lookup failures (missing files, records, etc.)
 * - API endpoint not found scenarios
 * - Middleware for handling undefined routes
 * 
 * Features:
 * - Automatic 404 status code assignment
 * - Default "Not Found" message with override capability
 * - Inherits all HttpError functionality (details, stack trace, etc.)
 * - Express.js middleware compatible
 * 
 * @class NotFoundError
 * @extends {HttpError}
 */
class NotFoundError extends HttpError {
    /**
     * Creates a new NotFoundError instance with 404 status code.
     * 
     * This constructor automatically sets the HTTP status to 404 while allowing
     * customization of the error message and details. It's designed for scenarios
     * where resources, routes, or data cannot be located.
     * 
     * Default Behavior:
     * - Status: 404 (Not Found)
     * - Message: "Not Found" (if not specified)
     * - Details: Optional debugging information
     * 
     * @param {string} [message='Not Found'] - Custom error message for the 404 error
     * @param {object} [details] - Optional details object for debugging or client feedback
     * 
     * @example
     * // Basic 404 error
     * const error = new NotFoundError();
     * // Results in: 404 status with "Not Found" message
     * 
     * @example
     * // Custom 404 message
     * const error = new NotFoundError('User not found');
     * 
     * @example
     * // 404 with debugging details
     * const error = new NotFoundError('Resource not found', {
     *   resource: 'user',
     *   id: '12345',
     *   attempted_path: '/api/users/12345'
     * });
     */
    constructor(message, details) {
        // Call super(404, message || 'Not Found', details) to initialize the base HttpError
        // This automatically sets status to 404 and provides default "Not Found" message
        // The parent constructor handles all error initialization steps
        super(404, message || 'Not Found', details);
    }
}

/**
 * Represents a 405 Method Not Allowed error for unsupported HTTP methods.
 * 
 * This error class is used when a client attempts to use an HTTP method
 * that is not supported by the requested endpoint. It automatically sets
 * the HTTP status to 405 and provides appropriate messaging.
 * 
 * Common Use Cases:
 * - Route handlers that only support specific HTTP methods (GET, POST, etc.)
 * - API endpoints with method restrictions
 * - Middleware for method validation
 * - RESTful API method enforcement
 * 
 * HTTP Method Context:
 * - Used with Express.js route method restrictions
 * - Integrates with Express.js error handling middleware
 * - Supports REST API best practices for method handling
 * 
 * Features:
 * - Automatic 405 status code assignment
 * - Default "Method Not Allowed" message with override capability
 * - Inherits all HttpError functionality
 * - Compatible with Express.js routing and middleware
 * 
 * @class MethodNotAllowedError
 * @extends {HttpError}
 */
class MethodNotAllowedError extends HttpError {
    /**
     * Creates a new MethodNotAllowedError instance with 405 status code.
     * 
     * This constructor automatically sets the HTTP status to 405 while allowing
     * customization of the error message and details. It's designed for scenarios
     * where clients use unsupported HTTP methods on endpoints.
     * 
     * Default Behavior:
     * - Status: 405 (Method Not Allowed)
     * - Message: "Method Not Allowed" (if not specified)
     * - Details: Optional debugging information
     * 
     * Integration with Express.js:
     * - Works with Express.js method-specific routing (app.get, app.post, etc.)
     * - Can be thrown from route handlers when method validation fails
     * - Integrates with Express.js error handling middleware
     * 
     * @param {string} [message='Method Not Allowed'] - Custom error message for the 405 error
     * @param {object} [details] - Optional details object for debugging or client feedback
     * 
     * @example
     * // Basic 405 error
     * const error = new MethodNotAllowedError();
     * // Results in: 405 status with "Method Not Allowed" message
     * 
     * @example 
     * // Custom 405 message
     * const error = new MethodNotAllowedError('POST method not supported on this endpoint');
     * 
     * @example
     * // 405 with debugging details
     * const error = new MethodNotAllowedError('Method not allowed', {
     *   requested_method: 'POST',
     *   allowed_methods: ['GET'],
     *   endpoint: '/api/users'
     * });
     */
    constructor(message, details) {
        // Call super(405, message || 'Method Not Allowed', details) to initialize the base HttpError
        // This automatically sets status to 405 and provides default "Method Not Allowed" message
        // The parent constructor handles all error initialization steps
        super(405, message || 'Method Not Allowed', details);
    }
}

/**
 * Represents a 500 Internal Server Error for unexpected application failures.
 * 
 * This error class is used for unexpected server-side errors, system failures,
 * and unhandled exceptions that occur during request processing. It automatically
 * sets the HTTP status to 500 and provides secure error messaging.
 * 
 * Common Use Cases:
 * - Unhandled exceptions in route handlers
 * - Database connection failures
 * - External service integration failures
 * - System resource exhaustion
 * - Unexpected application state errors
 * 
 * Security Considerations:
 * - Should not expose sensitive system information in production
 * - Details object should be used for internal logging only
 * - Message should be generic for client consumption
 * - Stack traces should be logged internally but not exposed to clients
 * 
 * Features:
 * - Automatic 500 status code assignment
 * - Default "Internal Server Error" message with override capability
 * - Inherits all HttpError functionality
 * - Designed for Express.js error handling middleware integration
 * 
 * @class InternalServerError
 * @extends {HttpError}
 */
class InternalServerError extends HttpError {
    /**
     * Creates a new InternalServerError instance with 500 status code.
     * 
     * This constructor automatically sets the HTTP status to 500 while allowing
     * customization of the error message and details. It's designed for unexpected
     * server-side errors and system failures.
     * 
     * Default Behavior:
     * - Status: 500 (Internal Server Error)
     * - Message: "Internal Server Error" (if not specified)
     * - Details: Optional debugging information (for internal use)
     * 
     * Security Best Practices:
     * - Keep client-facing messages generic to avoid information disclosure
     * - Use details object for internal debugging and logging
     * - Log full error context internally while returning safe messages to clients
     * - Consider environment-based error detail exposure
     * 
     * @param {string} [message='Internal Server Error'] - Custom error message for the 500 error
     * @param {object} [details] - Optional details object for debugging or internal logging
     * 
     * @example
     * // Basic 500 error
     * const error = new InternalServerError();
     * // Results in: 500 status with "Internal Server Error" message
     * 
     * @example
     * // Custom 500 message (be careful not to expose sensitive information)
     * const error = new InternalServerError('Service temporarily unavailable');
     * 
     * @example
     * // 500 with internal debugging details
     * const error = new InternalServerError('Database operation failed', {
     *   operation: 'user_lookup',
     *   query_id: 'q_12345',
     *   timestamp: new Date().toISOString(),
     *   internal_code: 'DB_CONNECTION_TIMEOUT'
     * });
     */
    constructor(message, details) {
        // Call super(500, message || 'Internal Server Error', details) to initialize the base HttpError
        // This automatically sets status to 500 and provides default "Internal Server Error" message  
        // The parent constructor handles all error initialization steps
        super(500, message || 'Internal Server Error', details);
    }
}

// Export all error classes as named exports for use throughout the backend
// This enables centralized error handling and consistent error responses across the application

/**
 * Base HTTP error class - exported for direct instantiation and inheritance
 * @type {HttpError}
 */
module.exports.HttpError = HttpError;

/**
 * 404 Not Found error class - exported for missing resource scenarios
 * @type {NotFoundError}  
 */
module.exports.NotFoundError = NotFoundError;

/**
 * 405 Method Not Allowed error class - exported for unsupported HTTP method scenarios
 * @type {MethodNotAllowedError}
 */
module.exports.MethodNotAllowedError = MethodNotAllowedError;

/**
 * 500 Internal Server Error class - exported for unexpected application failure scenarios
 * @type {InternalServerError}
 */
module.exports.InternalServerError = InternalServerError;

// Export global constants for use in error handling middleware and utilities
/**
 * Default HTTP status code for errors when not specified
 * @type {number}
 */
module.exports.DEFAULT_ERROR_STATUS = DEFAULT_ERROR_STATUS;

/**
 * Default error message when not specified
 * @type {string}
 */
module.exports.DEFAULT_ERROR_MESSAGE = DEFAULT_ERROR_MESSAGE;