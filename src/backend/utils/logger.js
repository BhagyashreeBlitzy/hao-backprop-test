/**
 * Centralized Environment-Aware Logging Utility for Node.js Hello World Tutorial Application
 * 
 * This module implements a static logging utility that provides consistent, structured,
 * and environment-aware logging capabilities for the backend. It offers standardized
 * logging methods for info, warn, error, and debug levels with proper formatting,
 * timestamping, and environment-based verbosity control.
 * 
 * Features:
 * - Static logging methods for all backend modules
 * - Environment-aware log output (suppressed in test, debug only in dev/test)
 * - Consistent ISO8601 timestamping and application metadata
 * - Structured logging with optional metadata JSON serialization
 * - Support for Error object stack trace extraction
 * - Extensible architecture for future correlation IDs and external logging systems
 * - Proper output stream handling (stdout for info/warn/debug, stderr for errors)
 * 
 * @fileoverview Static logging utility with environment-aware output and structured formatting
 * @author Node.js Tutorial Team
 * @version 1.0.0
 */

// Internal imports - Application configuration and metadata
const { APP_NAME } = require('../config/constants.js'); // Application name for log context
const { env } = require('../config/env.js'); // Current runtime environment for behavior control

// Node.js built-in imports
// Node.js 18+ - Built-in process global for environment checks and I/O streams
const process = require('process');

/**
 * Log level constants for structured logging
 * Defines the standard log levels used throughout the application
 * Ensures consistent log level naming and reduces magic strings
 * 
 * @constant {Object}
 * @property {string} INFO - Information level for general application events
 * @property {string} WARN - Warning level for potentially problematic situations
 * @property {string} ERROR - Error level for error conditions and exceptions
 * @property {string} DEBUG - Debug level for detailed diagnostic information
 */
const LOG_LEVELS = {
    INFO: 'info',
    WARN: 'warn', 
    ERROR: 'error',
    DEBUG: 'debug'
};

/**
 * Production environment check for optimized log behavior
 * Controls log suppression and error handling in production deployments
 * 
 * @constant {boolean}
 */
const IS_PRODUCTION = env === 'production';

/**
 * Test environment check for test-specific log behavior
 * Controls log suppression during test execution to reduce noise
 * 
 * @constant {boolean}
 */
const IS_TEST = env === 'test';

/**
 * Formats a log message with timestamp, level, application context, and optional metadata
 * Creates a structured, parseable log string suitable for both development and production
 * 
 * @function formatMessage
 * @param {string} level - The log level (info, warn, error, debug)
 * @param {string} message - The primary log message content
 * @param {Object} [meta] - Optional metadata object to include as JSON
 * @returns {string} Formatted log message string with full context
 * 
 * @example
 * formatMessage('info', 'Server started', { port: 3000 })
 * // Returns: '[2024-01-01T12:00:00.000Z] [info] [nodejs-hello-world-tutorial] [development] Server started {"port":3000}'
 * 
 * @example
 * formatMessage('error', 'Database connection failed')
 * // Returns: '[2024-01-01T12:00:00.000Z] [error] [nodejs-hello-world-tutorial] [production] Database connection failed'
 */
function formatMessage(level, message, meta) {
    // Get current ISO8601 timestamp for consistent time formatting
    const timestamp = new Date().toISOString();
    
    // Build base log string with timestamp, level, app name, environment, and message
    const baseLog = `[${timestamp}] [${level}] [${APP_NAME}] [${env}] ${message}`;
    
    // If meta is provided and not empty, append JSON.stringify(meta) to the log string
    if (meta && typeof meta === 'object' && Object.keys(meta).length > 0) {
        try {
            const metaJson = JSON.stringify(meta);
            return `${baseLog} ${metaJson}`;
        } catch (error) {
            // If JSON serialization fails, include the error information
            return `${baseLog} [META_SERIALIZATION_ERROR: ${error.message}]`;
        }
    }
    
    // Return the formatted string without metadata
    return baseLog;
}

/**
 * Static logging utility class for centralized, environment-aware logging
 * 
 * Provides static methods for different log levels with consistent formatting
 * and environment-specific behavior. Handles output stream routing, metadata
 * processing, and future extensibility for correlation IDs and external logging.
 * 
 * This class should not be instantiated - all methods are static utilities.
 * 
 * @class Logger
 * @example
 * // Log an informational message
 * Logger.info('Server started successfully', { port: 3000 });
 * 
 * @example
 * // Log an error with Error object
 * Logger.error('Database connection failed', new Error('Connection timeout'));
 * 
 * @example
 * // Debug logging (only in development/test)
 * Logger.debug('Processing user request', { userId: 123, endpoint: '/api/users' });
 */
class Logger {
    /**
     * Constructor for Logger class - prevents instantiation
     * Logger is designed as a static utility class and should not be instantiated
     * 
     * @constructor
     * @throws {Error} Always throws error when instantiation is attempted
     * 
     * @example
     * // This will throw an error
     * const logger = new Logger(); // Error: Logger is a static utility class and should not be instantiated
     */
    constructor() {
        // Throw an error if instantiation is attempted
        throw new Error('Logger is a static utility class and should not be instantiated. Use Logger.info(), Logger.warn(), Logger.error(), or Logger.debug() instead.');
    }

    /**
     * Logs an informational message to stdout
     * Always logs in all environments except test to avoid noise during testing
     * 
     * @static
     * @method info
     * @param {string} message - The informational message to log
     * @param {Object} [meta] - Optional metadata object for additional context
     * @returns {void} Writes formatted info log to process.stdout
     * 
     * @example
     * Logger.info('Application started successfully');
     * 
     * @example
     * Logger.info('User logged in', { userId: 123, sessionId: 'abc123' });
     */
    static info(message, meta) {
        // If IS_TEST, do not log to avoid noise in test output
        if (IS_TEST) {
            return;
        }
        
        // Format the message using formatMessage with 'info' level
        const formattedMessage = formatMessage(LOG_LEVELS.INFO, message, meta);
        
        // Write the formatted message to process.stdout
        process.stdout.write(formattedMessage + '\n');
    }

    /**
     * Logs a warning message to stdout
     * Always logs in all environments except test to avoid noise during testing
     * 
     * @static
     * @method warn
     * @param {string} message - The warning message to log
     * @param {Object} [meta] - Optional metadata object for additional context
     * @returns {void} Writes formatted warn log to process.stdout
     * 
     * @example
     * Logger.warn('Deprecated API endpoint used');
     * 
     * @example
     * Logger.warn('High memory usage detected', { memoryUsage: process.memoryUsage() });
     */
    static warn(message, meta) {
        // If IS_TEST, do not log to avoid noise in test output
        if (IS_TEST) {
            return;
        }
        
        // Format the message using formatMessage with 'warn' level
        const formattedMessage = formatMessage(LOG_LEVELS.WARN, message, meta);
        
        // Write the formatted message to process.stdout
        process.stdout.write(formattedMessage + '\n');
    }

    /**
     * Logs an error message to stderr
     * Always logs in all environments except test to avoid noise during testing
     * Includes special handling for Error objects to extract stack traces
     * 
     * @static
     * @method error
     * @param {string} message - The error message to log
     * @param {Object|Error} [meta] - Optional metadata object or Error instance
     * @returns {void} Writes formatted error log to process.stderr
     * 
     * @example
     * Logger.error('Database connection failed');
     * 
     * @example
     * Logger.error('Request processing failed', new Error('Invalid input'));
     * 
     * @example
     * Logger.error('Service unavailable', { statusCode: 503, retryAfter: 30 });
     */
    static error(message, meta) {
        // If IS_TEST, do not log to avoid noise in test output
        if (IS_TEST) {
            return;
        }
        
        // If meta is an Error object, extract stack trace and include in meta
        let processedMeta = meta;
        if (meta instanceof Error) {
            processedMeta = {
                name: meta.name,
                message: meta.message,
                stack: meta.stack,
                ...(meta.code && { code: meta.code }),
                ...(meta.statusCode && { statusCode: meta.statusCode })
            };
        }
        
        // Format the message using formatMessage with 'error' level
        const formattedMessage = formatMessage(LOG_LEVELS.ERROR, message, processedMeta);
        
        // Write the formatted message to process.stderr
        process.stderr.write(formattedMessage + '\n');
    }

    /**
     * Logs a debug message to stdout
     * Only logs in development and test environments for diagnostic purposes
     * Suppressed in production to reduce log volume and improve performance
     * 
     * @static
     * @method debug
     * @param {string} message - The debug message to log
     * @param {Object} [meta] - Optional metadata object for debugging context
     * @returns {void} Writes formatted debug log to process.stdout
     * 
     * @example
     * Logger.debug('Processing user request', { method: 'GET', path: '/hello' });
     * 
     * @example
     * Logger.debug('Cache hit', { key: 'user:123', ttl: 300 });
     */
    static debug(message, meta) {
        // If IS_PRODUCTION, do not log debug messages to reduce noise
        if (IS_PRODUCTION) {
            return;
        }
        
        // Format the message using formatMessage with 'debug' level
        const formattedMessage = formatMessage(LOG_LEVELS.DEBUG, message, meta);
        
        // Write the formatted message to process.stdout
        process.stdout.write(formattedMessage + '\n');
    }
}

/**
 * Named exports for the logging utility
 * Exports the Logger class for use throughout the backend application
 * Supports tree-shaking and explicit import patterns
 */
module.exports = {
    /**
     * Static Logger class with environment-aware logging methods
     * Provides info, warn, error, and debug logging capabilities
     * 
     * @type {Logger}
     */
    Logger
};