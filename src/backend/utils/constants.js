/**
 * Application Constants
 * 
 * This module defines static, application-wide constants for the Node.js tutorial backend.
 * It centralizes all non-HTTP-status constant values to ensure consistency, maintainability,
 * and educational clarity throughout the codebase.
 * 
 * Design Principles:
 * - Separation of Concerns: HTTP status codes are handled in httpStatusCodes.js
 * - Educational Value: Descriptive constant names replace magic numbers and strings
 * - Maintainability: Centralized location for all application constants
 * - Consistency: Single source of truth for static values used across modules
 * 
 * Usage:
 * - Import specific constants: const { DEFAULT_PORT, APP_NAME } = require('./constants')
 * - Used by: logger.js, responseFormatter.js, route handlers, middleware, server initialization
 * 
 * @fileoverview Static application constants for Node.js tutorial backend
 * @author Node.js Tutorial Project
 * @version 1.0.0
 */

/**
 * Default port for the Express.js server
 * 
 * This port is used when the PORT environment variable is not specified.
 * Port 3000 is a common default for Node.js development servers and provides
 * a conflict-free port for local development and educational purposes.
 * 
 * Used by:
 * - Server initialization code for port binding
 * - Logger for startup messages
 * - Documentation and setup instructions
 * 
 * @type {number}
 * @constant
 * @default 3000
 */
const DEFAULT_PORT = 3000;

/**
 * Route path for the hello endpoint
 * 
 * Defines the exact path for the tutorial's primary endpoint. This constant
 * ensures consistency between route definitions, tests, and documentation.
 * Following REST conventions with a simple, descriptive path.
 * 
 * Used by:
 * - Route handler definitions in routes/
 * - Test files for endpoint validation
 * - API documentation generation
 * 
 * @type {string}
 * @constant
 * @default '/hello'
 */
const HELLO_ROUTE_PATH = '/hello';

/**
 * Static response text for the hello endpoint
 * 
 * The exact message returned by the /hello endpoint. This constant ensures
 * the response is consistent across all implementations and matches the
 * tutorial specifications exactly.
 * 
 * Used by:
 * - Hello route handler for response generation
 * - Test assertions for response validation
 * - Documentation examples
 * 
 * @type {string}
 * @constant
 * @default 'Hello world'
 */
const HELLO_RESPONSE_TEXT = 'Hello world';

/**
 * Default message for 404 Not Found errors
 * 
 * Standard message returned when a requested resource cannot be found.
 * Provides a user-friendly error message while maintaining security by
 * not exposing internal system details.
 * 
 * Used by:
 * - 404 error handling middleware
 * - Route handlers for invalid paths
 * - Response formatter utility
 * 
 * @type {string}
 * @constant
 * @default 'Resource not found'
 */
const NOT_FOUND_MESSAGE = 'Resource not found';

/**
 * Generic error message for unexpected server errors
 * 
 * Default message for 500 Internal Server Error and other unexpected errors.
 * Provides a safe, generic message that doesn't expose sensitive information
 * about the server's internal state or implementation details.
 * 
 * Used by:
 * - Global error handling middleware
 * - Response formatter for error responses
 * - Logging system for error categorization
 * 
 * @type {string}
 * @constant
 * @default 'An unexpected error occurred'
 */
const GENERIC_ERROR_MESSAGE = 'An unexpected error occurred';

/**
 * Application name identifier
 * 
 * Human-readable name for the tutorial application used in logging,
 * monitoring, and identification contexts. Helps distinguish this
 * application in logs and system monitoring tools.
 * 
 * Used by:
 * - Logger utility for log message prefixing
 * - Server startup messages
 * - Error reporting and monitoring
 * - Process identification in system logs
 * 
 * @type {string}
 * @constant
 * @default 'NodeJSTutorialApp'
 */
const APP_NAME = 'NodeJSTutorialApp';

/**
 * Supported environment names
 * 
 * Array of valid environment names for configuration, logging, and
 * environment-specific behavior. Follows Node.js convention with
 * three primary environments for different deployment stages.
 * 
 * Environments:
 * - development: Local development with debug features enabled
 * - test: Automated testing environment with test-specific configurations
 * - production: Production deployment with optimized settings and security
 * 
 * Used by:
 * - Environment validation in configuration modules
 * - Logger for environment-specific log levels
 * - Conditional feature flags based on environment
 * - Configuration file selection and validation
 * 
 * @type {Array<string>}
 * @constant
 * @default ['development', 'test', 'production']
 */
const ENVIRONMENTS = ['development', 'test', 'production'];

/**
 * Module Exports
 * 
 * Exports all constants using CommonJS module syntax for compatibility
 * with Node.js require() system. Each export is individually named to
 * support selective importing and improve code readability.
 * 
 * Export Structure:
 * - Named exports for selective importing
 * - Descriptive export names matching constant declarations
 * - JSDoc documentation for each export's purpose
 */

module.exports = {
    /**
     * Default port for Express.js server to listen on if not specified in environment variables
     * @type {number}
     */
    DEFAULT_PORT,
    
    /**
     * Path for the /hello endpoint, used in route definitions and tests
     * @type {string}
     */
    HELLO_ROUTE_PATH,
    
    /**
     * Static response text for the /hello endpoint, ensuring the exact message is returned
     * @type {string}
     */
    HELLO_RESPONSE_TEXT,
    
    /**
     * Default message for 404 Not Found errors, used in notFoundHandler and error responses
     * @type {string}
     */
    NOT_FOUND_MESSAGE,
    
    /**
     * Default message for generic server errors, used in errorHandler and responseFormatter
     * @type {string}
     */
    GENERIC_ERROR_MESSAGE,
    
    /**
     * Application name for logging and identification, used by logger.js and in log output
     * @type {string}
     */
    APP_NAME,
    
    /**
     * List of supported environment names for configuration, logging, and environment checks
     * @type {Array<string>}
     */
    ENVIRONMENTS
};

/**
 * Module Usage Examples:
 * 
 * // Import all constants
 * const constants = require('./utils/constants');
 * console.log(constants.APP_NAME);
 * 
 * // Import specific constants (recommended)
 * const { DEFAULT_PORT, HELLO_ROUTE_PATH } = require('./utils/constants');
 * app.listen(DEFAULT_PORT);
 * app.get(HELLO_ROUTE_PATH, handler);
 * 
 * // Environment validation
 * const { ENVIRONMENTS } = require('./utils/constants');
 * if (!ENVIRONMENTS.includes(process.env.NODE_ENV)) {
 *     throw new Error('Invalid environment');
 * }
 */

/**
 * Maintenance Notes:
 * 
 * 1. HTTP Status Codes: All HTTP status codes are defined in httpStatusCodes.js
 *    to maintain separation of concerns and module-specific responsibilities.
 * 
 * 2. Adding New Constants: When adding new static values, follow the established
 *    patterns: descriptive names, comprehensive JSDoc, and logical grouping.
 * 
 * 3. Educational Value: Each constant includes detailed documentation explaining
 *    its purpose, usage, and relationship to other system components.
 * 
 * 4. Version Compatibility: This module uses CommonJS exports for compatibility
 *    with Node.js v18+ and Express.js v5.1.0 requirements.
 * 
 * 5. Testing: All constants should be validated in corresponding test files
 *    to ensure they meet functional requirements and maintain expected values.
 */