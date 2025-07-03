/**
 * Configuration Constants for Node.js Hello World Tutorial Application
 * 
 * This file defines all static, environment-agnostic configuration constants
 * for the backend application. It provides default values for environment
 * variables, supported environment names, application metadata, and
 * standardized response messages.
 * 
 * This is the single source of truth for all constants used in:
 * - Environment configuration
 * - Error handling
 * - Response generation
 * - Server initialization
 * 
 * All constants are exported as named exports for explicit import and
 * tree-shaking support.
 */

// =============================================================================
// SERVER CONFIGURATION CONSTANTS
// =============================================================================

/**
 * Default port for the Express.js server
 * Used when PORT environment variable is not set
 * Complies with HTTP Server Implementation requirement (F-001)
 */
const DEFAULT_PORT = 3000;

/**
 * Default host for server binding
 * Used when HOST environment variable is not set
 * Ensures localhost binding for development environments
 */
const DEFAULT_HOST = 'localhost';

/**
 * Default environment mode
 * Used when NODE_ENV environment variable is not set
 * Ensures development mode as the fallback for safety
 */
const DEFAULT_ENV = 'development';

// =============================================================================
// ENVIRONMENT CONFIGURATION CONSTANTS
// =============================================================================

/**
 * Supported environment names for runtime configuration and validation
 * These constants ensure consistency across environment checks and
 * provide a single source of truth for environment string values
 * 
 * Addresses Deployment and Environment Configuration requirement (8.2.5)
 */
const ENVIRONMENTS = {
  /**
   * Development environment identifier
   * Used for local development with enhanced debugging and logging
   */
  DEVELOPMENT: 'development',

  /**
   * Production environment identifier
   * Used for live deployment with optimized performance and security
   */
  PRODUCTION: 'production',

  /**
   * Test environment identifier
   * Used for automated testing with specific configurations
   */
  TEST: 'test'
};

// =============================================================================
// APPLICATION METADATA CONSTANTS
// =============================================================================

/**
 * Application name for identification and metadata
 * Used in logging, monitoring, and deployment configurations
 * Provides consistent application identification across all systems
 */
const APP_NAME = 'nodejs-hello-world-tutorial';

// =============================================================================
// RESPONSE MESSAGE CONSTANTS
// =============================================================================

/**
 * Standardized response messages for endpoints and error handling
 * Ensures consistent messaging across all API responses and error conditions
 * 
 * Addresses multiple requirements:
 * - Hello World Endpoint requirement (F-002)
 * - Response Generation Feature requirement (F-004)
 * - Error handling for HTTP status codes (404, 405, 500)
 */
const RESPONSE_MESSAGES = {
  /**
   * Success response message for the /hello endpoint
   * Used by the Hello World endpoint to maintain consistent response content
   */
  HELLO: 'Hello world',

  /**
   * Error message for 404 Not Found responses
   * Used when requested resources or endpoints are not found
   */
  NOT_FOUND: 'Not Found',

  /**
   * Error message for 405 Method Not Allowed responses
   * Used when HTTP methods are not supported for specific endpoints
   */
  METHOD_NOT_ALLOWED: 'Method Not Allowed',

  /**
   * Error message for 500 Internal Server Error responses
   * Used for unexpected server errors while maintaining security
   * by not exposing internal implementation details
   */
  INTERNAL_ERROR: 'Internal Server Error'
};

// =============================================================================
// EXPORTS
// =============================================================================

/**
 * Named exports for all configuration constants
 * Allows for explicit imports and tree-shaking optimization
 * 
 * Usage examples:
 * import { DEFAULT_PORT, ENVIRONMENTS } from './config/constants.js';
 * import { RESPONSE_MESSAGES } from './config/constants.js';
 * 
 * This export pattern supports:
 * - Explicit imports for better code clarity
 * - Tree-shaking for optimized bundles
 * - Static analysis for dependency tracking
 * - Consistent naming across the application
 */
module.exports = {
  DEFAULT_PORT,
  DEFAULT_HOST,
  DEFAULT_ENV,
  ENVIRONMENTS,
  APP_NAME,
  RESPONSE_MESSAGES
};