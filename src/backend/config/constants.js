/**
 * Configuration Constants for Node.js Hello World Tutorial Application
 * 
 * This file defines all static, environment-agnostic configuration constants
 * for the backend application. It serves as the single source of truth for
 * default values, environment names, application metadata, and standardized
 * response messages used across the entire backend codebase.
 * 
 * All constants are exported as named exports to support tree-shaking and
 * explicit import patterns, ensuring maintainability and consistency.
 * 
 * @fileoverview Constants for environment configuration, error handling, and response generation
 * @author Node.js Tutorial Team
 * @version 1.0.0
 */

/**
 * Default port for the Express.js HTTP server
 * Used as fallback when PORT environment variable is not set
 * Supports both development and production deployment scenarios
 * 
 * @constant {number}
 * @default 3000
 */
const DEFAULT_PORT = 3000;

/**
 * Default host for server binding
 * Used as fallback when HOST environment variable is not set
 * Ensures localhost binding for development environments
 * 
 * @constant {string}
 * @default 'localhost'
 */
const DEFAULT_HOST = 'localhost';

/**
 * Default environment mode for application runtime
 * Used as fallback when NODE_ENV environment variable is not set
 * Ensures development mode as the default for safety and debugging
 * 
 * @constant {string}
 * @default 'development'
 */
const DEFAULT_ENV = 'development';

/**
 * Supported environment names for runtime configuration and validation
 * Provides standardized environment identifiers used throughout the application
 * for environment-specific behavior and configuration validation
 * 
 * @constant {Object}
 * @property {string} DEVELOPMENT - Development environment identifier
 * @property {string} PRODUCTION - Production environment identifier
 * @property {string} TEST - Test environment identifier
 */
const ENVIRONMENTS = {
    /**
     * Development environment identifier
     * Used for local development with debug features enabled
     */
    DEVELOPMENT: 'development',
    
    /**
     * Production environment identifier
     * Used for production deployment with optimized performance
     */
    PRODUCTION: 'production',
    
    /**
     * Test environment identifier
     * Used for automated testing and CI/CD pipelines
     */
    TEST: 'test'
};

/**
 * Application name for logging, identification, and metadata
 * Used in server startup messages, health checks, and deployment identification
 * Provides consistent application naming across all system components
 * 
 * @constant {string}
 * @default 'nodejs-hello-world-tutorial'
 */
const APP_NAME = 'nodejs-hello-world-tutorial';

/**
 * Standardized response messages for endpoints and error handling
 * Provides consistent messaging across all HTTP responses and error scenarios
 * Ensures uniform user experience and simplifies message maintenance
 * 
 * @constant {Object}
 * @property {string} HELLO - Success message for the /hello endpoint
 * @property {string} NOT_FOUND - Standard 404 error message
 * @property {string} METHOD_NOT_ALLOWED - Standard 405 error message
 * @property {string} INTERNAL_ERROR - Standard 500 error message
 */
const RESPONSE_MESSAGES = {
    /**
     * Success response message for the '/hello' endpoint
     * Primary response content for the tutorial application
     */
    HELLO: 'Hello world',
    
    /**
     * Standard 404 Not Found error message
     * Used when requested resource or endpoint is not available
     */
    NOT_FOUND: 'Not Found',
    
    /**
     * Standard 405 Method Not Allowed error message
     * Used when HTTP method is not supported for the requested endpoint
     */
    METHOD_NOT_ALLOWED: 'Method Not Allowed',
    
    /**
     * Standard 500 Internal Server Error message
     * Used for unexpected server errors and exception handling
     */
    INTERNAL_ERROR: 'Internal Server Error'
};

/**
 * Named exports for all configuration constants
 * Supports tree-shaking and explicit import patterns for optimal bundle size
 * Ensures consistent constant usage across the application
 */
module.exports = {
    DEFAULT_PORT,
    DEFAULT_HOST,
    DEFAULT_ENV,
    ENVIRONMENTS,
    APP_NAME,
    RESPONSE_MESSAGES
};