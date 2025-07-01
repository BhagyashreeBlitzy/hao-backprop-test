/**
 * Configuration Index Module for Node.js Hello World Tutorial Application
 * 
 * This module serves as the canonical entry point for all configuration needs
 * across the backend application. It aggregates and re-exports both static
 * configuration constants (from constants.js) and runtime-resolved environment
 * variables (from env.js) through a unified interface.
 * 
 * By providing a single import source for all configuration, this module:
 * - Promotes maintainability by centralizing configuration access
 * - Reduces import path complexity across the codebase
 * - Enforces clear separation between static and dynamic configuration
 * - Supports robust, platform-agnostic, and predictable application setup
 * - Ensures consistent configuration usage patterns throughout the backend
 * 
 * This design pattern supports enterprise-grade configuration management
 * while maintaining simplicity for educational purposes and ease of testing.
 * 
 * @fileoverview Unified configuration interface for backend application
 * @author Node.js Tutorial Team
 * @version 1.0.0
 */

// Import all static configuration constants
const {
    DEFAULT_PORT,
    DEFAULT_HOST,
    DEFAULT_ENV,
    ENVIRONMENTS,
    APP_NAME,
    RESPONSE_MESSAGES
} = require('./constants'); // ./constants.js

// Import all resolved environment configuration
const {
    env,
    port,
    host,
    getConfig
} = require('./env'); // ./env.js

/**
 * Unified configuration exports
 * 
 * Re-exports all configuration constants and resolved environment variables
 * as named exports to provide a single, consistent interface for all backend
 * modules. This aggregation ensures that importing modules can access both
 * static defaults and runtime-resolved values from the same source.
 * 
 * Static Constants (from constants.js):
 * - DEFAULT_PORT: Default port for Express.js server if not specified in environment
 * - DEFAULT_HOST: Default host for server binding if not specified in environment
 * - DEFAULT_ENV: Default environment mode if NODE_ENV is not set
 * - ENVIRONMENTS: Supported environment names for runtime configuration and validation
 * - APP_NAME: Application name for logging, identification, and metadata
 * - RESPONSE_MESSAGES: Standardized response messages for endpoints and error handling
 * 
 * Runtime Configuration (from env.js):
 * - env: The resolved runtime environment mode (development, production, or test)
 * - port: The resolved port number for the server to listen on
 * - host: The resolved host for the server to bind to
 * - getConfig: Function that returns the current environment configuration object
 */
module.exports = {
    // Static configuration constants
    DEFAULT_PORT,
    DEFAULT_HOST,
    DEFAULT_ENV,
    ENVIRONMENTS,
    APP_NAME,
    RESPONSE_MESSAGES,
    
    // Runtime-resolved configuration
    env,
    port,
    host,
    getConfig
};