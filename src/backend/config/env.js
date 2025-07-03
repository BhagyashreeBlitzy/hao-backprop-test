/**
 * Environment Configuration Module
 * 
 * Resolves, validates, and exports all runtime environment variables and 
 * configuration values for the backend. This module reads environment variables
 * (e.g., process.env.PORT, process.env.HOST, process.env.NODE_ENV), applies 
 * defaults from config/constants.js, validates against supported environments,
 * and exposes the resolved configuration for use throughout the backend.
 * 
 * Features:
 * - Platform-agnostic configuration resolution
 * - Robust validation of environment variables
 * - Secure fallback to default values
 * - Single source of truth for runtime configuration
 * - Utility functions for configuration retrieval
 * 
 * Requirements Addressed:
 * - HTTP Server Implementation (F-001): Provides validated port, host, and 
 *   environment configuration for Express.js server initialization
 * - Deployment and Environment Configuration (8.2.5): Ensures platform-agnostic
 *   deployment with proper environment variable parsing and validation
 * - Security and Error Handling (2.4.4): Validates configuration values to
 *   prevent misconfiguration and security vulnerabilities
 * 
 * Usage:
 * import { env, port, host, getConfig } from './config/env.js';
 * 
 * @fileoverview Environment configuration resolver with validation
 * @version 1.0.0
 * @author Tutorial Implementation
 */

// =============================================================================
// IMPORTS
// =============================================================================

/**
 * Import configuration constants and defaults
 * These constants provide fallback values and validation constraints
 * for environment variable resolution
 */
const {
  DEFAULT_PORT,
  DEFAULT_HOST,
  DEFAULT_ENV,
  ENVIRONMENTS
} = require('./constants');

/**
 * Node.js built-in process module for environment variable access
 * @external process
 * @see {@link https://nodejs.org/api/process.html} Node.js 18+ process documentation
 */
// process is a global object in Node.js - no explicit import needed

// =============================================================================
// ENVIRONMENT VARIABLE RESOLUTION FUNCTIONS
// =============================================================================

/**
 * Resolves the runtime environment mode from process.env.NODE_ENV
 * 
 * Validates the environment value against supported environments and falls back
 * to DEFAULT_ENV if the value is not set or invalid. This ensures that only
 * supported environment modes are used throughout the application.
 * 
 * Validation Rules:
 * - Must be one of: 'development', 'production', 'test'
 * - Case-sensitive matching
 * - Falls back to 'development' for safety
 * 
 * @function resolveEnv
 * @returns {string} The resolved environment mode (development, production, or test)
 * 
 * @example
 * // With NODE_ENV=production
 * const env = resolveEnv();
 * console.log(env); // 'production'
 * 
 * @example
 * // With NODE_ENV not set
 * const env = resolveEnv();
 * console.log(env); // 'development'
 * 
 * @example
 * // With NODE_ENV=invalid
 * const env = resolveEnv();
 * console.log(env); // 'development'
 */
function resolveEnv() {
  // Read NODE_ENV from environment variables
  const rawEnv = process.env.NODE_ENV;
  
  // Validate environment against supported values
  const supportedEnvs = Object.values(ENVIRONMENTS);
  const isValidEnv = rawEnv && supportedEnvs.includes(rawEnv);
  
  // Return validated environment or fallback to default
  return isValidEnv ? rawEnv : DEFAULT_ENV;
}

/**
 * Resolves the server port from process.env.PORT
 * 
 * Validates the port value as a valid integer within the allowed range
 * (1024-65535) and falls back to DEFAULT_PORT if the value is not set,
 * invalid, or outside the acceptable range. This ensures reliable server
 * binding across different deployment environments.
 * 
 * Validation Rules:
 * - Must be a valid integer
 * - Must be within range 1024-65535 (non-privileged ports)
 * - Falls back to 3000 for development
 * - Supports platform-specific port assignment (e.g., Heroku, Render)
 * 
 * @function resolvePort
 * @returns {number} The resolved port number
 * 
 * @example
 * // With PORT=8080
 * const port = resolvePort();
 * console.log(port); // 8080
 * 
 * @example
 * // With PORT not set
 * const port = resolvePort();
 * console.log(port); // 3000
 * 
 * @example
 * // With PORT=80 (privileged port)
 * const port = resolvePort();
 * console.log(port); // 3000 (fallback)
 * 
 * @example
 * // With PORT="abc" (invalid)
 * const port = resolvePort();
 * console.log(port); // 3000 (fallback)
 */
function resolvePort() {
  // Read PORT from environment variables
  const rawPort = process.env.PORT;
  
  // Parse port as integer
  const parsedPort = parseInt(rawPort, 10);
  
  // Validate port as valid integer in allowed range
  const isValidPort = !isNaN(parsedPort) && 
                     parsedPort >= 1024 && 
                     parsedPort <= 65535;
  
  // Return validated port or fallback to default
  return isValidPort ? parsedPort : DEFAULT_PORT;
}

/**
 * Resolves the server host from process.env.HOST
 * 
 * Provides a simple fallback mechanism for host configuration. In most
 * deployment scenarios, the host is automatically determined by the platform,
 * but this function allows for explicit host binding when needed.
 * 
 * Validation Rules:
 * - Uses provided HOST value if set
 * - Falls back to 'localhost' for local development
 * - Supports platform-specific host binding (e.g., 0.0.0.0 for containers)
 * 
 * @function resolveHost
 * @returns {string} The resolved host string
 * 
 * @example
 * // With HOST=0.0.0.0
 * const host = resolveHost();
 * console.log(host); // '0.0.0.0'
 * 
 * @example
 * // With HOST not set
 * const host = resolveHost();
 * console.log(host); // 'localhost'
 * 
 * @example
 * // With HOST=127.0.0.1
 * const host = resolveHost();
 * console.log(host); // '127.0.0.1'
 */
function resolveHost() {
  // Read HOST from environment variables
  const rawHost = process.env.HOST;
  
  // Return provided host or fallback to default
  return rawHost || DEFAULT_HOST;
}

/**
 * Returns the current environment configuration object
 * 
 * Provides a complete configuration object containing all resolved environment
 * values. This function is used for server/app initialization and for logging
 * and debugging purposes. It ensures all configuration values are resolved
 * consistently and provides a single point of access for complete configuration.
 * 
 * Configuration Object Structure:
 * - env: Resolved environment mode (development, production, test)
 * - port: Resolved port number (1024-65535)
 * - host: Resolved host string
 * 
 * @function getConfig
 * @returns {Object} Configuration object with env, port, and host properties
 * @returns {string} returns.env - The resolved environment mode
 * @returns {number} returns.port - The resolved port number  
 * @returns {string} returns.host - The resolved host string
 * 
 * @example
 * // Get complete configuration
 * const config = getConfig();
 * console.log(config);
 * // Output: { env: 'development', port: 3000, host: 'localhost' }
 * 
 * @example
 * // Use for server initialization
 * const config = getConfig();
 * console.log(`Starting server on ${config.host}:${config.port} in ${config.env} mode`);
 * 
 * @example
 * // Use for logging and debugging
 * const config = getConfig();
 * console.log('Application Configuration:', JSON.stringify(config, null, 2));
 */
function getConfig() {
  // Resolve all configuration values
  const env = resolveEnv();
  const port = resolvePort();
  const host = resolveHost();
  
  // Return complete configuration object
  return {
    env,
    port,
    host
  };
}

// =============================================================================
// RESOLVED CONFIGURATION VALUES
// =============================================================================

/**
 * Resolved runtime environment mode
 * 
 * The current environment mode resolved from NODE_ENV with validation
 * against supported environments. Used throughout the application for
 * environment-specific behavior and configuration.
 * 
 * @constant {string} env
 * @default 'development'
 * 
 * @example
 * import { env } from './config/env.js';
 * if (env === 'production') {
 *   // Production-specific code
 * }
 */
const env = resolveEnv();

/**
 * Resolved server port number
 * 
 * The port number for the Express.js server to listen on, resolved from
 * the PORT environment variable with validation and fallback to default.
 * Ensures reliable server binding across different deployment platforms.
 * 
 * @constant {number} port
 * @default 3000
 * 
 * @example
 * import { port } from './config/env.js';
 * app.listen(port, () => {
 *   console.log(`Server running on port ${port}`);
 * });
 */
const port = resolvePort();

/**
 * Resolved server host string
 * 
 * The host address for the Express.js server to bind to, resolved from
 * the HOST environment variable with fallback to default. Supports
 * platform-specific host binding requirements.
 * 
 * @constant {string} host
 * @default 'localhost'
 * 
 * @example
 * import { host } from './config/env.js';
 * app.listen(port, host, () => {
 *   console.log(`Server running on ${host}:${port}`);
 * });
 */
const host = resolveHost();

// =============================================================================
// MODULE EXPORTS
// =============================================================================

/**
 * Export resolved configuration values and utility functions
 * 
 * Provides both individual configuration values and a utility function
 * for retrieving the complete configuration object. This export pattern
 * supports various usage scenarios and import patterns.
 * 
 * Named Exports:
 * - env: Resolved environment mode
 * - port: Resolved port number
 * - host: Resolved host string
 * - getConfig: Function to retrieve complete configuration object
 * 
 * @example
 * // Import individual values
 * import { env, port, host } from './config/env.js';
 * 
 * @example
 * // Import configuration function
 * import { getConfig } from './config/env.js';
 * const config = getConfig();
 * 
 * @example
 * // Import all exports
 * import { env, port, host, getConfig } from './config/env.js';
 */
module.exports = {
  env,
  port,
  host,
  getConfig
};