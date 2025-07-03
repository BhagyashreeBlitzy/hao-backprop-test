/**
 * Configuration Aggregation Module
 * 
 * This module serves as the canonical entry point for all backend configuration
 * needs, aggregating and re-exporting both static constants and runtime-resolved
 * environment variables. It provides a unified interface that promotes maintainability,
 * reduces import path complexity, and enforces clear separation between static
 * and dynamic configuration.
 * 
 * Architecture Pattern: Configuration Aggregation Pattern
 * - Centralizes configuration imports and exports
 * - Provides single source of truth for all configuration
 * - Supports tree-shaking and explicit imports
 * - Maintains clear separation of concerns
 * 
 * Requirements Addressed:
 * - HTTP Server Implementation (F-001): Unified configuration interface for
 *   Express.js server initialization with static defaults and runtime values
 * - Deployment and Environment Configuration (8.2.5): Single source of truth
 *   for platform-agnostic deployment and maintainable code structure
 * - Security and Error Handling (2.4.4): Ensures only validated and safe
 *   configuration values are exposed, reducing misconfiguration risks
 * 
 * Usage Examples:
 * ```javascript
 * // Import individual configuration values
 * import { DEFAULT_PORT, env, host } from './config';
 * 
 * // Import multiple related configurations
 * import { ENVIRONMENTS, RESPONSE_MESSAGES } from './config';
 * 
 * // Import configuration utility function
 * import { getConfig } from './config';
 * 
 * // Use in server initialization
 * const config = getConfig();
 * app.listen(config.port, config.host);
 * ```
 * 
 * @fileoverview Configuration aggregation and re-export module
 * @version 1.0.0
 * @author Backend Configuration Team
 * @since 1.0.0
 */

// =============================================================================
// STATIC CONFIGURATION IMPORTS
// =============================================================================

/**
 * Import all static configuration constants from constants.js
 * 
 * These constants provide default values, supported environment names,
 * application metadata, and standardized response messages that remain
 * consistent across all deployment environments.
 * 
 * Static constants include:
 * - DEFAULT_PORT: Default port for Express.js server (3000)
 * - DEFAULT_HOST: Default host for server binding ('localhost')
 * - DEFAULT_ENV: Default environment mode ('development')
 * - ENVIRONMENTS: Object containing supported environment names
 * - APP_NAME: Application name for identification and logging
 * - RESPONSE_MESSAGES: Standardized response messages for endpoints
 * 
 * @see {@link ./constants.js} Static configuration constants module
 */
const {
  DEFAULT_PORT,
  DEFAULT_HOST,
  DEFAULT_ENV,
  ENVIRONMENTS,
  APP_NAME,
  RESPONSE_MESSAGES
} = require('./constants');

// =============================================================================
// RUNTIME CONFIGURATION IMPORTS
// =============================================================================

/**
 * Import all runtime-resolved configuration values from env.js
 * 
 * These values are resolved at runtime from environment variables with
 * validation and fallback to defaults. They provide the actual configuration
 * values that the application uses during execution.
 * 
 * Runtime configuration includes:
 * - env: Resolved environment mode (development, production, test)
 * - port: Resolved port number with validation (1024-65535)
 * - host: Resolved host address with fallback to default
 * - getConfig: Utility function returning complete configuration object
 * 
 * @see {@link ./env.js} Runtime environment configuration module
 */
const {
  env,
  port,
  host,
  getConfig
} = require('./env');

// =============================================================================
// CONFIGURATION AGGREGATION AND RE-EXPORTS
// =============================================================================

/**
 * Aggregated configuration exports providing unified access to all backend
 * configuration needs. This module pattern ensures that:
 * 
 * 1. **Single Entry Point**: All configuration can be imported from one location
 * 2. **Explicit Imports**: Named exports support tree-shaking and clarity
 * 3. **Type Safety**: Consistent export structure across the application
 * 4. **Maintainability**: Changes to underlying modules don't affect consumers
 * 5. **Platform Agnostic**: Works across all deployment environments
 * 
 * Export Categories:
 * 
 * **Static Constants (from constants.js):**
 * - DEFAULT_PORT: Fallback port for server initialization
 * - DEFAULT_HOST: Fallback host for server binding
 * - DEFAULT_ENV: Fallback environment mode
 * - ENVIRONMENTS: Supported environment names object
 * - APP_NAME: Application identifier string
 * - RESPONSE_MESSAGES: Standardized response messages object
 * 
 * **Runtime Configuration (from env.js):**
 * - env: Current resolved environment mode
 * - port: Current resolved port number
 * - host: Current resolved host address
 * - getConfig: Function returning complete configuration object
 * 
 * **Integration Examples:**
 * 
 * ```javascript
 * // Server initialization with resolved configuration
 * const { port, host, env } = require('./config');
 * app.listen(port, host, () => {
 *   console.log(`Server running on ${host}:${port} in ${env} mode`);
 * });
 * 
 * // Environment-specific behavior using constants
 * const { ENVIRONMENTS, env } = require('./config');
 * if (env === ENVIRONMENTS.PRODUCTION) {
 *   // Production-specific configuration
 * }
 * 
 * // Response generation with standardized messages
 * const { RESPONSE_MESSAGES } = require('./config');
 * res.status(200).send(RESPONSE_MESSAGES.HELLO);
 * 
 * // Complete configuration object for initialization
 * const { getConfig } = require('./config');
 * const config = getConfig();
 * initializeApplication(config);
 * ```
 * 
 * **Security Considerations:**
 * - All exported values are validated through their source modules
 * - No direct environment variable access prevents injection attacks
 * - Default values ensure safe fallback behavior
 * - Runtime validation prevents misconfiguration issues
 * 
 * **Performance Characteristics:**
 * - Minimal memory footprint through direct re-exports
 * - No runtime overhead beyond source module resolution
 * - Supports tree-shaking for optimized bundles
 * - Cached module resolution for repeated imports
 * 
 * @exports {Object} All configuration constants and runtime values
 */
module.exports = {
  // Static Configuration Constants
  // These values remain consistent across all environments and deployments
  DEFAULT_PORT,      // number: Default port for Express.js server (3000)
  DEFAULT_HOST,      // string: Default host for server binding ('localhost')
  DEFAULT_ENV,       // string: Default environment mode ('development')
  ENVIRONMENTS,      // Object: Supported environment names (development, production, test)
  APP_NAME,          // string: Application name for identification and logging
  RESPONSE_MESSAGES, // Object: Standardized response messages for endpoints and errors

  // Runtime Configuration Values
  // These values are resolved at runtime from environment variables
  env,               // string: Current resolved environment mode
  port,              // number: Current resolved port number
  host,              // string: Current resolved host address
  getConfig          // Function: Returns complete configuration object
};

/**
 * Module Export Documentation
 * 
 * This module follows the CommonJS export pattern for compatibility with
 * Node.js environments while maintaining support for both individual named
 * imports and bulk imports.
 * 
 * **Import Patterns Supported:**
 * 
 * ```javascript
 * // Individual named imports (recommended for tree-shaking)
 * const { DEFAULT_PORT, env } = require('./config');
 * 
 * // Multiple related imports
 * const { ENVIRONMENTS, RESPONSE_MESSAGES } = require('./config');
 * 
 * // Bulk import for initialization modules
 * const config = require('./config');
 * const server = initializeServer(config);
 * 
 * // Destructuring with renaming
 * const { 
 *   env: currentEnv, 
 *   port: serverPort,
 *   getConfig: getServerConfig 
 * } = require('./config');
 * ```
 * 
 * **Module Dependency Chain:**
 * ```
 * index.js (this file)
 * ├── constants.js (static configuration)
 * └── env.js (runtime configuration)
 *     └── constants.js (defaults and validation)
 * ```
 * 
 * This structure ensures proper dependency resolution and prevents circular
 * imports while maintaining clear separation of concerns between static
 * constants and runtime configuration resolution.
 */