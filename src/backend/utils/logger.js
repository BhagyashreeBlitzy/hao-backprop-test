// External imports
const process = require('process'); // Node.js 18+ - Access environment variables for log configuration

// Global constants for logger configuration
const LOG_LEVELS = { info: 0, warn: 1, error: 2 };
const DEFAULT_LOG_LEVEL = "info";

/**
 * Formats a log message with timestamp, log level, and message content.
 * Optionally includes metadata (e.g., error stack traces or additional context).
 * 
 * @param {string} level - The log level (info, warn, error)
 * @param {string} message - The primary log message
 * @param {object} [meta] - Optional metadata object or Error instance
 * @returns {string} A formatted log string ready for console output
 */
function formatMessage(level, message, meta) {
    // Get current ISO timestamp for consistent time formatting
    const timestamp = new Date().toISOString();
    
    // Construct log prefix with timestamp and level in uppercase
    const logPrefix = `[${timestamp}] ${level.toUpperCase()}:`;
    
    // Start with the basic formatted message
    let formattedMessage = `${logPrefix} ${message}`;
    
    // Handle metadata if provided
    if (meta) {
        if (meta instanceof Error) {
            // If meta is an Error object, append the stack trace for debugging
            formattedMessage += `\n${meta.stack}`;
        } else if (typeof meta === 'object') {
            // If meta is a regular object, append JSON stringified representation
            try {
                formattedMessage += ` ${JSON.stringify(meta, null, 2)}`;
            } catch (jsonError) {
                // Fallback if JSON.stringify fails (e.g., circular references)
                formattedMessage += ` [Object - JSON serialization failed: ${jsonError.message}]`;
            }
        }
    }
    
    return formattedMessage;
}

/**
 * Singleton Logger Utility Class
 * 
 * Provides a centralized, production-ready logging system with standardized
 * info, warn, and error methods for consistent, structured logging throughout
 * the backend application. Implements singleton pattern to ensure consistent
 * configuration across all application modules.
 */
class Logger {
    constructor() {
        // Determine log level from environment variable or use default
        this.logLevel = process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL;
        
        // Validate log level configuration
        if (!LOG_LEVELS.hasOwnProperty(this.logLevel)) {
            // Fallback to default if invalid log level specified
            this.logLevel = DEFAULT_LOG_LEVEL;
            console.warn(`Invalid LOG_LEVEL environment variable. Using default: ${DEFAULT_LOG_LEVEL}`);
        }
        
        // Store current log level numeric value for comparison
        this.currentLogLevel = LOG_LEVELS[this.logLevel];
        
        // Bind methods to ensure proper context when passed as callbacks
        this.info = this.info.bind(this);
        this.warn = this.warn.bind(this);
        this.error = this.error.bind(this);
        
        // Log successful logger initialization
        console.log(`Logger initialized with level: ${this.logLevel}`);
    }
    
    /**
     * Logs an informational message to stdout with timestamp and level.
     * Used for general operational information, server startup messages,
     * and normal application flow tracking.
     * 
     * @param {string} message - The informational message to log
     * @param {object} [meta] - Optional metadata for additional context
     * @returns {void} Outputs formatted info message to console
     */
    info(message, meta) {
        // Check if current log level allows info messages
        if (this.currentLogLevel <= LOG_LEVELS.info) {
            // Format message using the centralized formatting function
            const formattedMessage = formatMessage('info', message, meta);
            
            // Output to stdout for informational messages
            console.log(formattedMessage);
        }
    }
    
    /**
     * Logs a warning message to stdout with timestamp and level.
     * Used for non-critical issues, deprecated functionality warnings,
     * and potential problems that don't halt execution.
     * 
     * @param {string} message - The warning message to log
     * @param {object} [meta] - Optional metadata for additional context
     * @returns {void} Outputs formatted warning message to console
     */
    warn(message, meta) {
        // Check if current log level allows warning messages
        if (this.currentLogLevel <= LOG_LEVELS.warn) {
            // Format message using the centralized formatting function
            const formattedMessage = formatMessage('warn', message, meta);
            
            // Output to stdout for warning messages (following Node.js conventions)
            console.warn(formattedMessage);
        }
    }
    
    /**
     * Logs an error message to stderr with timestamp and level.
     * Used for critical errors, exceptions, and system failures.
     * If meta is an Error instance, includes the full stack trace.
     * 
     * @param {string} message - The error message to log
     * @param {object} [meta] - Optional metadata, typically an Error object
     * @returns {void} Outputs formatted error message to console
     */
    error(message, meta) {
        // Error messages are always logged regardless of log level
        // This ensures critical errors are never silenced
        
        // Format message using the centralized formatting function
        const formattedMessage = formatMessage('error', message, meta);
        
        // Output to stderr for error messages
        console.error(formattedMessage);
    }
    
    /**
     * Sets the log level dynamically during runtime.
     * Useful for debugging or changing verbosity without restart.
     * 
     * @param {string} level - The new log level (info, warn, error)
     * @returns {boolean} True if level was set successfully, false otherwise
     */
    setLogLevel(level) {
        if (LOG_LEVELS.hasOwnProperty(level)) {
            this.logLevel = level;
            this.currentLogLevel = LOG_LEVELS[level];
            this.info(`Log level changed to: ${level}`);
            return true;
        } else {
            this.warn(`Invalid log level attempted: ${level}. Valid levels: ${Object.keys(LOG_LEVELS).join(', ')}`);
            return false;
        }
    }
    
    /**
     * Gets the current log level configuration.
     * 
     * @returns {string} The current log level
     */
    getLogLevel() {
        return this.logLevel;
    }
    
    /**
     * Checks if a specific log level is enabled.
     * 
     * @param {string} level - The log level to check
     * @returns {boolean} True if the level is enabled, false otherwise
     */
    isLevelEnabled(level) {
        return LOG_LEVELS.hasOwnProperty(level) && this.currentLogLevel <= LOG_LEVELS[level];
    }
}

// Create singleton instance
const logger = new Logger();

// Export the singleton logger instance for use throughout the application
// This ensures consistent logging behavior across all backend modules
module.exports = { logger };