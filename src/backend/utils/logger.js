/**
 * Centralized, Environment-Aware Logging Utility for Backend Services
 * 
 * This module provides a comprehensive logging solution for the Node.js tutorial
 * application backend. It offers static logging methods with consistent formatting,
 * timestamping, and environment-based log verbosity control. The logger is designed
 * to be used throughout all backend modules for request logging, error tracking,
 * and health monitoring.
 * 
 * Features:
 * - Environment-aware logging (suppresses logs in test environments)
 * - Structured log formatting with timestamps and metadata
 * - Multiple log levels (info, warn, error, debug)
 * - Automatic error object handling with stack traces
 * - Extensible design for future integration with external logging systems
 * - Consistent log format across all backend services
 * 
 * Requirements Addressed:
 * - Monitoring and Observability: Structured, environment-aware logging output
 * - Error Management: Comprehensive error handling and logging with stack traces
 * - Response Generation: Standardized error response logging for debugging
 * 
 * Usage:
 * import { Logger } from './utils/logger.js';
 * 
 * Logger.info('Server started successfully', { port: 3000 });
 * Logger.error('Database connection failed', error);
 * Logger.debug('Request processing details', { userId: 123, endpoint: '/api/data' });
 * 
 * @fileoverview Centralized logging utility with environment awareness
 * @version 1.0.0
 * @author Tutorial Implementation Team
 */

// =============================================================================
// IMPORTS
// =============================================================================

/**
 * Application name constant for log identification and context
 * Used to identify the source application in all log messages
 */
const { APP_NAME } = require('../config/constants.js');

/**
 * Runtime environment configuration for environment-aware logging
 * Determines current environment (development, production, or test) for
 * log filtering and formatting decisions
 */
const { env } = require('../config/env.js');

/**
 * Node.js built-in process module for environment checks and output streams
 * @external process
 * @see {@link https://nodejs.org/api/process.html} Node.js 18+ process documentation
 */
// process is a global object in Node.js - no explicit import needed

// =============================================================================
// GLOBAL CONSTANTS
// =============================================================================

/**
 * Log level constants for consistent log level identification
 * These constants ensure consistent log level naming across the application
 * and provide a single source of truth for log level values
 */
const LOG_LEVELS = {
  INFO: 'info',
  WARN: 'warn', 
  ERROR: 'error',
  DEBUG: 'debug'
};

/**
 * Production environment check for environment-aware logging behavior
 * Used to determine if the application is running in production mode
 * for optimized logging and error handling
 */
const IS_PRODUCTION = env === 'production';

/**
 * Test environment check for test-specific logging behavior
 * Used to suppress log output during automated testing to prevent
 * noise in test results and maintain clean test output
 */
const IS_TEST = env === 'test';

// =============================================================================
// LOGGING UTILITY FUNCTIONS
// =============================================================================

/**
 * Formats a log message with timestamp, log level, application context, and metadata
 * 
 * Creates a structured log entry with consistent formatting across all log levels.
 * The formatted message includes timestamp in ISO8601 format, log level identifier,
 * application name, current environment, and the core message. If metadata is
 * provided, it is serialized as JSON and appended to the log entry.
 * 
 * Format: [timestamp] [level] [APP_NAME] [env] message [metadata]
 * 
 * @function formatMessage
 * @param {string} level - Log level identifier (info, warn, error, debug)
 * @param {string} message - Core log message content
 * @param {object} [meta] - Optional metadata object to include in log entry
 * @returns {string} Formatted log message string ready for output
 * 
 * @example
 * // Basic message formatting
 * const formatted = formatMessage('info', 'Server started successfully');
 * console.log(formatted);
 * // Output: [2024-01-15T10:30:45.123Z] [info] [nodejs-hello-world-tutorial] [development] Server started successfully
 * 
 * @example
 * // Message with metadata
 * const formatted = formatMessage('error', 'Database connection failed', { 
 *   host: 'localhost', 
 *   port: 5432, 
 *   database: 'app_db' 
 * });
 * console.log(formatted);
 * // Output: [2024-01-15T10:30:45.123Z] [error] [nodejs-hello-world-tutorial] [production] Database connection failed {"host":"localhost","port":5432,"database":"app_db"}
 */
function formatMessage(level, message, meta) {
  // Get current timestamp in ISO8601 format for consistent timestamping
  const timestamp = new Date().toISOString();
  
  // Build the base log string with timestamp, level, app name, environment, and message
  let logString = `[${timestamp}] [${level}] [${APP_NAME}] [${env}] ${message}`;
  
  // Append metadata if provided and not empty
  if (meta && typeof meta === 'object' && Object.keys(meta).length > 0) {
    try {
      // Serialize metadata as JSON for structured logging
      logString += ` ${JSON.stringify(meta)}`;
    } catch (error) {
      // Handle circular references or other JSON serialization errors
      logString += ` [Metadata serialization error: ${error.message}]`;
    }
  }
  
  return logString;
}

// =============================================================================
// LOGGER CLASS IMPLEMENTATION
// =============================================================================

/**
 * Static logging utility class for centralized log management
 * 
 * The Logger class provides static methods for different log levels with
 * environment-aware behavior. It handles formatting, output stream selection,
 * and metadata processing for all logging operations. The class is designed
 * as a static utility and should not be instantiated.
 * 
 * Key Features:
 * - Environment-aware logging (suppresses logs in test environment)
 * - Automatic error object handling with stack trace extraction
 * - Structured log formatting with timestamps and metadata
 * - Appropriate output stream selection (stdout vs stderr)
 * - Extensible design for future logging system integration
 * 
 * Log Level Behavior:
 * - INFO: Logs in all environments except test
 * - WARN: Logs in all environments except test
 * - ERROR: Logs in all environments except test (uses stderr)
 * - DEBUG: Only logs in development and test environments
 * 
 * @class Logger
 * @static
 * 
 * @example
 * // Information logging
 * Logger.info('User authentication successful', { userId: 123, loginTime: Date.now() });
 * 
 * @example
 * // Warning logging
 * Logger.warn('Rate limit approaching', { currentRequests: 950, limit: 1000 });
 * 
 * @example
 * // Error logging with Error object
 * try {
 *   // Some operation that might fail
 * } catch (error) {
 *   Logger.error('Operation failed', error);
 * }
 * 
 * @example
 * // Debug logging (only in development)
 * Logger.debug('Request processing details', { 
 *   method: 'GET', 
 *   url: '/api/users', 
 *   duration: 45 
 * });
 */
class Logger {
  /**
   * Logger constructor - prevents instantiation of static utility class
   * 
   * The Logger class is designed as a static utility and should not be instantiated.
   * All logging operations should be performed using the static methods provided.
   * This constructor throws an error if instantiation is attempted to enforce
   * the static utility pattern.
   * 
   * @constructor
   * @throws {Error} Always throws error to prevent instantiation
   * 
   * @example
   * // Correct usage (static methods)
   * Logger.info('This is the correct way to use Logger');
   * 
   * @example
   * // Incorrect usage (will throw error)
   * try {
   *   const logger = new Logger(); // This will throw an error
   * } catch (error) {
   *   console.error('Cannot instantiate Logger class');
   * }
   */
  constructor() {
    throw new Error('Logger is a static utility class and should not be instantiated. Use Logger.info(), Logger.warn(), Logger.error(), or Logger.debug() instead.');
  }

  /**
   * Logs an informational message
   * 
   * The info method is used for general information logging such as application
   * startup, successful operations, user actions, and other notable events that
   * are useful for operational monitoring and debugging. Info logs are suppressed
   * in test environments to maintain clean test output.
   * 
   * @static
   * @method info
   * @param {string} message - The informational message to log
   * @param {object} [meta] - Optional metadata object to include with the log entry
   * @returns {void} Writes formatted info log to process.stdout
   * 
   * @example
   * // Basic info logging
   * Logger.info('Server started successfully');
   * 
   * @example
   * // Info logging with metadata
   * Logger.info('User created account', { 
   *   userId: 12345, 
   *   email: 'user@example.com',
   *   registrationDate: new Date().toISOString()
   * });
   * 
   * @example
   * // Request logging
   * Logger.info('HTTP request processed', {
   *   method: 'GET',
   *   url: '/api/users',
   *   statusCode: 200,
   *   responseTime: 150
   * });
   */
  static info(message, meta) {
    // Suppress logging in test environment to maintain clean test output
    if (IS_TEST) {
      return;
    }
    
    // Format the message with info level and optional metadata
    const formattedMessage = formatMessage(LOG_LEVELS.INFO, message, meta);
    
    // Write to stdout for informational messages
    process.stdout.write(`${formattedMessage}\n`);
  }

  /**
   * Logs a warning message
   * 
   * The warn method is used for warning conditions that don't prevent the
   * application from functioning but may indicate potential issues, deprecated
   * usage, or conditions that should be monitored. Warnings are suppressed
   * in test environments to maintain clean test output.
   * 
   * @static
   * @method warn
   * @param {string} message - The warning message to log
   * @param {object} [meta] - Optional metadata object to include with the log entry
   * @returns {void} Writes formatted warn log to process.stdout
   * 
   * @example
   * // Basic warning logging
   * Logger.warn('Database connection pool approaching capacity');
   * 
   * @example
   * // Warning with metadata
   * Logger.warn('Rate limit threshold exceeded', {
   *   clientId: 'client-123',
   *   currentRequests: 1050,
   *   rateLimit: 1000,
   *   timeWindow: '1 hour'
   * });
   * 
   * @example
   * // Deprecated feature warning
   * Logger.warn('Using deprecated API endpoint', {
   *   endpoint: '/api/v1/users',
   *   deprecationDate: '2024-12-31',
   *   replacementEndpoint: '/api/v2/users'
   * });
   */
  static warn(message, meta) {
    // Suppress logging in test environment to maintain clean test output
    if (IS_TEST) {
      return;
    }
    
    // Format the message with warn level and optional metadata
    const formattedMessage = formatMessage(LOG_LEVELS.WARN, message, meta);
    
    // Write to stdout for warning messages
    process.stdout.write(`${formattedMessage}\n`);
  }

  /**
   * Logs an error message
   * 
   * The error method is used for error conditions that prevent normal operation
   * or indicate significant problems that need immediate attention. It handles
   * both string messages and Error objects, automatically extracting stack traces
   * from Error objects for comprehensive error reporting. Error logs are suppressed
   * in test environments to maintain clean test output.
   * 
   * @static
   * @method error
   * @param {string} message - The error message to log
   * @param {object|Error} [meta] - Optional metadata object or Error object to include
   * @returns {void} Writes formatted error log to process.stderr
   * 
   * @example
   * // Basic error logging
   * Logger.error('Database connection failed');
   * 
   * @example
   * // Error logging with Error object
   * try {
   *   // Some operation that might fail
   *   JSON.parse('invalid json');
   * } catch (error) {
   *   Logger.error('JSON parsing failed', error);
   * }
   * 
   * @example
   * // Error logging with custom metadata
   * Logger.error('Authentication failed', {
   *   userId: 12345,
   *   attemptedEmail: 'user@example.com',
   *   failureReason: 'Invalid password',
   *   attemptCount: 3
   * });
   * 
   * @example
   * // HTTP error logging
   * Logger.error('HTTP request failed', {
   *   method: 'POST',
   *   url: '/api/users',
   *   statusCode: 500,
   *   errorCode: 'INTERNAL_SERVER_ERROR'
   * });
   */
  static error(message, meta) {
    // Suppress logging in test environment to maintain clean test output
    if (IS_TEST) {
      return;
    }
    
    let processedMeta = meta;
    
    // Handle Error objects by extracting stack trace and error properties
    if (meta instanceof Error) {
      processedMeta = {
        name: meta.name,
        message: meta.message,
        stack: meta.stack,
        // Include any custom properties that might be present on the error
        ...Object.getOwnPropertyNames(meta).reduce((acc, prop) => {
          if (!['name', 'message', 'stack'].includes(prop)) {
            acc[prop] = meta[prop];
          }
          return acc;
        }, {})
      };
    }
    
    // Format the message with error level and processed metadata
    const formattedMessage = formatMessage(LOG_LEVELS.ERROR, message, processedMeta);
    
    // Write to stderr for error messages to distinguish from regular output
    process.stderr.write(`${formattedMessage}\n`);
  }

  /**
   * Logs a debug message
   * 
   * The debug method is used for detailed diagnostic information that is typically
   * only useful during development or troubleshooting. Debug logs are only output
   * in development and test environments, and are suppressed in production to
   * avoid performance impact and log volume issues.
   * 
   * @static
   * @method debug
   * @param {string} message - The debug message to log
   * @param {object} [meta] - Optional metadata object to include with the log entry
   * @returns {void} Writes formatted debug log to process.stdout
   * 
   * @example
   * // Basic debug logging
   * Logger.debug('Processing user authentication request');
   * 
   * @example
   * // Debug logging with detailed metadata
   * Logger.debug('Database query executed', {
   *   query: 'SELECT * FROM users WHERE id = ?',
   *   parameters: [12345],
   *   executionTime: 45,
   *   rowsReturned: 1
   * });
   * 
   * @example
   * // Request processing debug information
   * Logger.debug('HTTP request details', {
   *   method: 'GET',
   *   url: '/api/users/12345',
   *   headers: {
   *     'content-type': 'application/json',
   *     'authorization': 'Bearer [REDACTED]'
   *   },
   *   queryParams: { include: 'profile,settings' }
   * });
   * 
   * @example
   * // Function entry/exit debugging
   * Logger.debug('Entering calculateUserScore function', {
   *   userId: 12345,
   *   parameters: { includeHistory: true, weightFactors: [0.3, 0.7] }
   * });
   */
  static debug(message, meta) {
    // Only log debug messages in development and test environments
    // Production environments suppress debug logs for performance and security
    if (IS_PRODUCTION) {
      return;
    }
    
    // Format the message with debug level and optional metadata
    const formattedMessage = formatMessage(LOG_LEVELS.DEBUG, message, meta);
    
    // Write to stdout for debug messages
    process.stdout.write(`${formattedMessage}\n`);
  }
}

// =============================================================================
// MODULE EXPORTS
// =============================================================================

/**
 * Export the Logger class for use throughout the backend application
 * 
 * The Logger class is exported as a named export to maintain consistency
 * with other backend modules and enable tree-shaking optimization. This
 * export pattern supports explicit imports and static analysis.
 * 
 * Usage Examples:
 * 
 * // Named import (recommended)
 * const { Logger } = require('./utils/logger.js');
 * 
 * // ES6 import syntax
 * import { Logger } from './utils/logger.js';
 * 
 * // Using the logger
 * Logger.info('Application started', { port: 3000, environment: 'production' });
 * Logger.warn('Memory usage high', { usage: '85%', threshold: '80%' });
 * Logger.error('Database connection failed', error);
 * Logger.debug('Request processing', { method: 'GET', url: '/api/users' });
 * 
 * Integration Points:
 * - Used by errorHandler middleware for error logging
 * - Used by requestLogger middleware for request/response logging
 * - Used by health check endpoints for status logging
 * - Used by server startup logic for initialization logging
 * - Used by all route handlers for operation logging
 * 
 * Future Extensibility:
 * - Ready for integration with external logging systems (Winston, Bunyan)
 * - Supports correlation ID injection for distributed tracing
 * - Extensible for cloud logging service integration (AWS CloudWatch, Google Cloud Logging)
 * - Prepared for structured logging enhancements (JSON formatting, log levels)
 */
module.exports = {
  Logger
};