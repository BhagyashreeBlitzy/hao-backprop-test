// Node.js built-in Error class - version 18+
// Base class for all error types in JavaScript, extended to create custom error classes

// Global constants for default error handling
const DEFAULT_ERROR_STATUS = 500;
const DEFAULT_ERROR_MESSAGE = 'Internal Server Error';

/**
 * Base class for all HTTP-related errors in the backend system.
 * 
 * This class provides a consistent structure for all HTTP errors, encapsulating
 * an HTTP status code, human-readable message, and optional debugging details.
 * It serves as the foundation for all custom error types, ensuring standardized
 * error handling, logging, and secure client responses throughout the application.
 * 
 * The class follows security best practices by allowing controlled exposure of
 * error information while preventing sensitive data leakage in production environments.
 * 
 * @class HttpError
 * @extends Error
 */
class HttpError extends Error {
    /**
     * Initializes a new HttpError instance with structured error information.
     * 
     * This constructor ensures all HTTP errors have a consistent format with
     * proper status codes, messages, and optional debugging details. It also
     * maintains proper error stack traces for debugging purposes.
     * 
     * @param {number} status - HTTP status code (defaults to 500 if not provided)
     * @param {string} message - Human-readable error message (defaults to 'Internal Server Error' if not provided)
     * @param {object} [details] - Optional debugging details or additional context (defaults to undefined)
     * 
     * @example
     * throw new HttpError(400, 'Invalid request parameters', { field: 'email', issue: 'format' });
     */
    constructor(status, message, details) {
        // Call super(message) to initialize the base Error class
        super(message || DEFAULT_ERROR_MESSAGE);
        
        // Assign this.status with fallback to default
        this.status = status || DEFAULT_ERROR_STATUS;
        
        // Assign this.message with fallback to default
        this.message = message || DEFAULT_ERROR_MESSAGE;
        
        // Assign this.details with fallback to undefined
        this.details = details || undefined;
        
        // Set this.name to the class name for stack trace clarity
        this.name = this.constructor.name;
        
        // Capture the stack trace if available in the environment
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

/**
 * Represents a 404 Not Found error for missing resources or routes.
 * 
 * This error class is used when a requested resource, endpoint, or route
 * cannot be found on the server. It provides a standardized way to handle
 * and respond to missing resource scenarios throughout the application.
 * 
 * Common use cases include:
 * - API endpoints that don't exist
 * - Database records that cannot be found
 * - Files or assets that are not available
 * - Invalid route parameters
 * 
 * @class NotFoundError
 * @extends HttpError
 */
class NotFoundError extends HttpError {
    /**
     * Initializes a NotFoundError with status 404 and appropriate messaging.
     * 
     * This constructor automatically sets the HTTP status to 404 and provides
     * a default message while allowing customization for specific use cases.
     * The error maintains consistency with the base HttpError structure.
     * 
     * @param {string} [message] - Custom error message (defaults to 'Not Found')
     * @param {object} [details] - Optional debugging details or additional context
     * 
     * @example
     * throw new NotFoundError('User not found', { userId: 123 });
     * throw new NotFoundError(); // Uses default message
     */
    constructor(message, details) {
        // Call super with status 404, custom or default message, and details
        super(404, message || 'Not Found', details);
    }
}

/**
 * Represents a 405 Method Not Allowed error for unsupported HTTP methods.
 * 
 * This error class is used when a client attempts to use an HTTP method
 * that is not supported for a particular endpoint or resource. It helps
 * enforce proper API design and provides clear feedback about allowed methods.
 * 
 * Common use cases include:
 * - POST requests to GET-only endpoints
 * - PUT/PATCH requests to read-only resources
 * - DELETE requests to protected resources
 * - Unsupported HTTP verbs on specific routes
 * 
 * @class MethodNotAllowedError
 * @extends HttpError
 */
class MethodNotAllowedError extends HttpError {
    /**
     * Initializes a MethodNotAllowedError with status 405 and appropriate messaging.
     * 
     * This constructor automatically sets the HTTP status to 405 and provides
     * a default message while allowing customization for specific endpoints.
     * The error can include details about which methods are actually allowed.
     * 
     * @param {string} [message] - Custom error message (defaults to 'Method Not Allowed')
     * @param {object} [details] - Optional debugging details, such as allowed methods
     * 
     * @example
     * throw new MethodNotAllowedError('POST not allowed on this endpoint', { allowed: ['GET', 'PUT'] });
     * throw new MethodNotAllowedError(); // Uses default message
     */
    constructor(message, details) {
        // Call super with status 405, custom or default message, and details
        super(405, message || 'Method Not Allowed', details);
    }
}

/**
 * Represents a 500 Internal Server Error for unexpected application failures.
 * 
 * This error class is used for unexpected server-side errors that occur
 * during request processing. It provides a standardized way to handle
 * system failures while ensuring sensitive information is not exposed
 * to clients in production environments.
 * 
 * Common use cases include:
 * - Database connection failures
 * - External service timeouts
 * - Unhandled exceptions in business logic
 * - Configuration or environment issues
 * - Critical system resource failures
 * 
 * @class InternalServerError
 * @extends HttpError
 */
class InternalServerError extends HttpError {
    /**
     * Initializes an InternalServerError with status 500 and appropriate messaging.
     * 
     * This constructor automatically sets the HTTP status to 500 and provides
     * a default message while allowing customization for specific failure scenarios.
     * Care should be taken to avoid exposing sensitive system information in
     * error messages that may be returned to clients.
     * 
     * @param {string} [message] - Custom error message (defaults to 'Internal Server Error')
     * @param {object} [details] - Optional debugging details (should be sanitized for production)
     * 
     * @example
     * throw new InternalServerError('Database connection failed', { service: 'postgres' });
     * throw new InternalServerError(); // Uses default message
     */
    constructor(message, details) {
        // Call super with status 500, custom or default message, and details
        super(500, message || 'Internal Server Error', details);
    }
}

// Export all error classes for use throughout the backend application
// These exports enable centralized error handling, logging, and secure client responses
module.exports = {
    HttpError,
    NotFoundError,
    MethodNotAllowedError,
    InternalServerError
};