/**
 * Standardized Logging Utility for Node.js Tutorial Backend
 * 
 * This module provides centralized, environment-aware logging utilities that serve as the
 * single source of truth for all logging operations throughout the Node.js tutorial backend.
 * It implements consistent, timestamped logging with structured output and support for
 * different log levels (info, warning, error) to ensure comprehensive observability and
 * educational clarity.
 * 
 * Key Features:
 * - Standardized log formatting with timestamps and application identification
 * - Environment-aware colorization for enhanced development experience
 * - Support for structured metadata logging for advanced debugging
 * - Educational documentation for learning purposes
 * - Future extensibility for file or remote logging implementations
 * - Integration with all middleware and server components
 * 
 * Design Principles:
 * - Centralized Logging: Single point of configuration and control
 * - Educational Value: Comprehensive documentation and clear implementation
 * - Consistency: Standardized format across all log messages
 * - Extensibility: Architecture supports future logging enhancements
 * - Performance: Lightweight implementation with minimal overhead
 * 
 * Usage Examples:
 * - Server startup: logInfo('Server starting on port 3000')
 * - Request processing: logInfo('GET /hello - 200 - 45ms', { ip: '127.0.0.1' })
 * - Error handling: logError('Request processing failed', { error: err.stack })
 * - Warnings: logWarn('Deprecated feature used', { feature: 'old-api' })
 * 
 * @fileoverview Centralized logging utilities for Node.js tutorial backend
 * @author Node.js Tutorial Project
 * @version 1.0.0
 */

// External dependency: chalk for terminal colorization (optional)
// Version: ^5.3.0 - Latest stable version with ES module support and improved performance
const chalk = require('chalk');

// Internal dependency: Application name for log identification
// Imported from constants.js to ensure consistency across all modules
const { APP_NAME } = require('./constants.js');

/**
 * Global Log Level Constants
 * 
 * Defines standard log levels used throughout the application for consistent
 * log classification and filtering. These constants ensure type safety and
 * prevent typos in log level specification.
 * 
 * @constant {Object} LOG_LEVELS
 * @property {string} INFO - Information level for general operational messages
 * @property {string} WARN - Warning level for non-critical issues and potential problems
 * @property {string} ERROR - Error level for error conditions and exceptions
 */
const LOG_LEVELS = {
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error'
};

/**
 * Get Current UTC Timestamp in ISO 8601 Format
 * 
 * Returns the current UTC timestamp in ISO 8601 format for consistent
 * timestamp representation across all log messages. This ensures that
 * all logs have precise timing information that is timezone-independent
 * and suitable for log aggregation and analysis.
 * 
 * The ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ) provides:
 * - International standard compliance
 * - Microsecond precision for detailed timing
 * - UTC timezone specification for consistency
 * - Sortable string format for log analysis
 * 
 * @function getTimestamp
 * @returns {string} Current timestamp in ISO 8601 format (e.g., "2024-12-30T10:30:00.000Z")
 * 
 * @example
 * const timestamp = getTimestamp();
 * console.log(timestamp); // "2024-12-30T14:25:30.123Z"
 */
function getTimestamp() {
    // Create new Date object with current time
    const now = new Date();
    
    // Convert to ISO 8601 UTC format string
    // toISOString() automatically handles UTC conversion and formatting
    return now.toISOString();
}

/**
 * Format Log Message with Standardized Structure
 * 
 * Creates a consistently formatted log message that includes timestamp,
 * application name, log level, message text, and optional metadata.
 * This function serves as the central formatting engine for all log output,
 * ensuring uniform log structure and supporting environment-specific
 * colorization for improved development experience.
 * 
 * Log Message Structure:
 * [timestamp] [APP_NAME] [LEVEL] message [meta]
 * 
 * Colorization (Development Environment):
 * - INFO: Blue prefix for informational messages
 * - WARN: Yellow prefix for warning messages  
 * - ERROR: Red prefix for error messages
 * 
 * @function formatLogMessage
 * @param {string} level - Log level (info, warn, error)
 * @param {string} message - Primary log message text
 * @param {Object} [meta] - Optional metadata object for additional context
 * @returns {string} Formatted log message string ready for console output
 * 
 * @example
 * // Basic message formatting
 * const formatted = formatLogMessage('info', 'Server started successfully');
 * // Output: "[2024-12-30T14:25:30.123Z] [NodeJSTutorialApp] [INFO] Server started successfully"
 * 
 * @example
 * // Message with metadata
 * const formatted = formatLogMessage('error', 'Request failed', { 
 *   statusCode: 500, 
 *   path: '/hello' 
 * });
 * // Output: "[2024-12-30T14:25:30.123Z] [NodeJSTutorialApp] [ERROR] Request failed {"statusCode":500,"path":"/hello"}"
 */
function formatLogMessage(level, message, meta) {
    // Get current timestamp for log entry
    const timestamp = getTimestamp();
    
    // Construct the log prefix with timestamp, app name, and log level
    // Format: [timestamp] [APP_NAME] [LEVEL]
    const logPrefix = `[${timestamp}] [${APP_NAME}] [${level.toUpperCase()}]`;
    
    // Start with the basic log structure
    let formattedMessage = `${logPrefix} ${message}`;
    
    // Append metadata if provided
    if (meta && typeof meta === 'object') {
        // Serialize metadata as JSON for structured logging
        // This allows for easy parsing by log analysis tools
        const metaString = JSON.stringify(meta);
        formattedMessage += ` ${metaString}`;
    }
    
    // Apply colorization if in development environment and chalk is available
    // This enhances readability during development while maintaining plain text for production
    if (process.env.NODE_ENV !== 'production' && chalk) {
        try {
            // Apply level-specific colorization to the prefix for visual distinction
            switch (level.toLowerCase()) {
                case LOG_LEVELS.INFO:
                    // Blue color for informational messages
                    formattedMessage = formattedMessage.replace(logPrefix, chalk.blue(logPrefix));
                    break;
                case LOG_LEVELS.WARN:
                    // Yellow color for warning messages
                    formattedMessage = formattedMessage.replace(logPrefix, chalk.yellow(logPrefix));
                    break;
                case LOG_LEVELS.ERROR:
                    // Red color for error messages
                    formattedMessage = formattedMessage.replace(logPrefix, chalk.red(logPrefix));
                    break;
                default:
                    // No colorization for unknown levels
                    break;
            }
        } catch (chalkError) {
            // If chalk fails, continue with plain text formatting
            // This ensures logging continues even if colorization fails
            // The error is not logged to prevent infinite recursion
        }
    }
    
    return formattedMessage;
}

/**
 * Log Information-Level Message
 * 
 * Outputs an informational log message using standardized formatting.
 * Info-level logs are used for general operational messages, successful
 * operations, request processing, server events, and other routine
 * application activities that provide visibility into normal operation.
 * 
 * Common Use Cases:
 * - Server startup and shutdown events
 * - Successful HTTP request processing
 * - Configuration loading
 * - Routine operational status updates
 * - Performance metrics and timing information
 * 
 * @function logInfo
 * @param {string} message - The informational message to log
 * @param {Object} [meta] - Optional metadata object providing additional context
 * @returns {void} Outputs the formatted log message to stdout via console.log
 * 
 * @example
 * // Basic informational logging
 * logInfo('Server listening on port 3000');
 * // Output: "[2024-12-30T14:25:30.123Z] [NodeJSTutorialApp] [INFO] Server listening on port 3000"
 * 
 * @example
 * // Request logging with metadata
 * logInfo('Request processed successfully', {
 *   method: 'GET',
 *   path: '/hello',
 *   statusCode: 200,
 *   responseTime: '45ms',
 *   userAgent: 'Mozilla/5.0...'
 * });
 */
function logInfo(message, meta) {
    // Format the message using the standardized log formatter
    const formattedMessage = formatLogMessage(LOG_LEVELS.INFO, message, meta);
    
    // Output to stdout using console.log for informational messages
    // stdout is the appropriate stream for general application output
    console.log(formattedMessage);
}

/**
 * Log Warning-Level Message
 * 
 * Outputs a warning-level log message using standardized formatting.
 * Warning-level logs are used for non-critical issues, potential problems,
 * deprecated features, configuration issues, and other situations that
 * don't prevent operation but may require attention or indicate
 * suboptimal conditions.
 * 
 * Common Use Cases:
 * - 404 Not Found errors (client-side errors)
 * - Deprecated API usage warnings
 * - Configuration fallbacks or defaults
 * - Performance threshold breaches
 * - Non-critical validation failures
 * - Resource usage warnings
 * 
 * @function logWarn
 * @param {string} message - The warning message to log
 * @param {Object} [meta] - Optional metadata object providing additional context
 * @returns {void} Outputs the formatted log message to stdout via console.warn
 * 
 * @example
 * // Basic warning logging
 * logWarn('Request to unknown endpoint');
 * // Output: "[2024-12-30T14:25:30.123Z] [NodeJSTutorialApp] [WARN] Request to unknown endpoint"
 * 
 * @example
 * // Warning with detailed context
 * logWarn('Response time exceeded recommended threshold', {
 *   path: '/hello',
 *   responseTime: '250ms',
 *   threshold: '100ms',
 *   impact: 'performance'
 * });
 */
function logWarn(message, meta) {
    // Format the message using the standardized log formatter
    const formattedMessage = formatLogMessage(LOG_LEVELS.WARN, message, meta);
    
    // Output to stdout using console.warn for warning messages
    // console.warn typically directs to stderr but maintains consistent behavior
    console.warn(formattedMessage);
}

/**
 * Log Error-Level Message
 * 
 * Outputs an error-level log message using standardized formatting.
 * Error-level logs are used for all error conditions, exceptions,
 * system failures, and critical issues that prevent normal operation
 * or indicate serious problems requiring immediate attention.
 * 
 * This function is primarily used by the errorHandler middleware and
 * other error processing components to ensure all errors are captured
 * with consistent formatting and complete context information.
 * 
 * Common Use Cases:
 * - HTTP 500 Internal Server Errors
 * - Unhandled exceptions and stack traces
 * - Database connection failures
 * - File system operation errors
 * - Security-related errors
 * - Critical system resource failures
 * 
 * @function logError
 * @param {string} message - The error message to log
 * @param {Object} [meta] - Optional metadata object (e.g., error stack, request info)
 * @returns {void} Outputs the formatted log message to stderr via console.error
 * 
 * @example
 * // Basic error logging
 * logError('Server failed to start');
 * // Output: "[2024-12-30T14:25:30.123Z] [NodeJSTutorialApp] [ERROR] Server failed to start"
 * 
 * @example
 * // Error with full context and stack trace
 * logError('Request processing failed', {
 *   error: error.message,
 *   stack: error.stack,
 *   method: 'GET',
 *   path: '/hello',
 *   statusCode: 500,
 *   requestId: 'req-123-456'
 * });
 */
function logError(message, meta) {
    // Format the message using the standardized log formatter
    const formattedMessage = formatLogMessage(LOG_LEVELS.ERROR, message, meta);
    
    // Output to stderr using console.error for error messages
    // stderr is the appropriate stream for error output and system monitoring
    console.error(formattedMessage);
}

/**
 * Module Exports
 * 
 * Exports the public logging functions for use throughout the application.
 * These functions provide the complete logging interface required by
 * middleware, server initialization, route handlers, and any other
 * components that need structured logging capabilities.
 * 
 * Export Strategy:
 * - Named exports for selective importing and clear dependency management
 * - Function-only exports (no internal state or configuration exposed)
 * - Consistent naming convention matching function declarations
 * - Complete logging interface coverage (info, warn, error levels)
 * 
 * Import Examples:
 * // Import all logging functions
 * const { logInfo, logWarn, logError } = require('./utils/logger');
 * 
 * // Import specific logging functions
 * const { logError } = require('./utils/logger');
 * 
 * // Import with aliasing
 * const { logInfo: log } = require('./utils/logger');
 */
module.exports = {
    /**
     * Information-level logging function for general operational messages,
     * successful operations, and routine application events. Used by
     * requestLogger middleware, server startup, and general status reporting.
     * 
     * @type {Function}
     */
    logInfo,
    
    /**
     * Warning-level logging function for non-critical issues, potential
     * problems, and situations requiring attention. Used by notFoundHandler
     * middleware and other warning scenarios.
     * 
     * @type {Function}
     */
    logWarn,
    
    /**
     * Error-level logging function for all error conditions, exceptions,
     * and critical issues. Used by errorHandler middleware and all error
     * processing throughout the application.
     * 
     * @type {Function}
     */
    logError
};

/**
 * Module Usage Documentation
 * 
 * Integration with Application Components:
 * 
 * 1. Error Handler Middleware:
 *    const { logError } = require('./utils/logger');
 *    logError('Request processing failed', { error: err.stack, path: req.path });
 * 
 * 2. Request Logger Middleware:
 *    const { logInfo } = require('./utils/logger');
 *    logInfo('Request processed', { method, path, status, responseTime });
 * 
 * 3. Not Found Handler Middleware:
 *    const { logWarn } = require('./utils/logger');
 *    logWarn('Route not found', { path: req.path, method: req.method });
 * 
 * 4. Server Initialization:
 *    const { logInfo, logError } = require('./utils/logger');
 *    logInfo('Server starting', { port: PORT, environment: NODE_ENV });
 * 
 * Performance Considerations:
 * - Lightweight implementation with minimal computational overhead
 * - Synchronous console output suitable for development and small-scale applications
 * - JSON serialization only when metadata is provided
 * - Colorization only in development environment to minimize production overhead
 * 
 * Future Extensibility:
 * - Architecture supports adding file-based logging writers
 * - Structure accommodates remote logging service integration
 * - Format supports log aggregation and analysis tools
 * - Design allows for log level filtering and configuration
 * 
 * Educational Value:
 * - Demonstrates centralized logging patterns
 * - Shows environment-aware feature implementation
 * - Illustrates structured logging with metadata
 * - Provides foundation for advanced logging concepts
 * - Models production-ready logging practices
 */

/**
 * Maintenance and Extension Guidelines
 * 
 * Adding New Log Levels:
 * 1. Add new level to LOG_LEVELS constant
 * 2. Implement new log function following existing patterns
 * 3. Add colorization rules if needed
 * 4. Export new function in module.exports
 * 5. Update documentation and examples
 * 
 * File Logging Extension:
 * 1. Add file system module dependency
 * 2. Create file writer utility functions
 * 3. Modify formatLogMessage to support different output formats
 * 4. Add configuration for log file paths and rotation
 * 5. Implement asynchronous logging to prevent blocking
 * 
 * Remote Logging Extension:
 * 1. Add HTTP client dependency for remote logging services
 * 2. Create remote logging utility functions
 * 3. Implement queue and retry mechanisms for reliability
 * 4. Add configuration for remote logging endpoints
 * 5. Ensure graceful fallback to console logging
 * 
 * Performance Optimization:
 * 1. Implement log level filtering to reduce overhead
 * 2. Add asynchronous logging for high-throughput scenarios
 * 3. Consider log message caching for repeated messages
 * 4. Implement log rotation and archival for file-based logging
 * 5. Add configuration for production vs development behavior
 */