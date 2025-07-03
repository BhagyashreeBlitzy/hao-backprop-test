// Internal imports
const { logger } = require('../utils/logger.js'); // Logger utility for configuration loading, validation warnings, and error reporting

// External imports
const process = require('process'); // Node.js 18+ - Access environment variables for server configuration

// Global constants for server configuration defaults
const DEFAULT_PORT = 3000;
const DEFAULT_HOST = 'localhost';
const DEFAULT_ENV = 'development';

// Valid environment modes for validation
const VALID_ENVIRONMENTS = ['development', 'production', 'test'];

// Port range constants for validation
const MIN_PORT = 1024;
const MAX_PORT = 65535;

/**
 * Validates and normalizes the port value from environment or default.
 * Ensures the port is a valid integer within the allowed range (1024-65535).
 * Logs a warning and falls back to default if invalid.
 * 
 * @param {string|number} portValue - The port value to validate (from environment or default)
 * @returns {number} A valid port number for server binding
 */
function validatePort(portValue) {
    // If portValue is undefined or empty, return DEFAULT_PORT
    if (portValue === undefined || portValue === null || portValue === '') {
        logger.info('No port specified, using default port', { defaultPort: DEFAULT_PORT });
        return DEFAULT_PORT;
    }
    
    // Parse portValue as integer
    const parsedPort = parseInt(portValue, 10);
    
    // If parsed value is not a number or is outside 1024-65535, log a warning and return DEFAULT_PORT
    if (isNaN(parsedPort) || parsedPort < MIN_PORT || parsedPort > MAX_PORT) {
        logger.warn(`Invalid port value: ${portValue}. Port must be an integer between ${MIN_PORT} and ${MAX_PORT}. Using default port.`, {
            providedPort: portValue,
            parsedPort: parsedPort,
            defaultPort: DEFAULT_PORT,
            validRange: `${MIN_PORT}-${MAX_PORT}`
        });
        return DEFAULT_PORT;
    }
    
    // Return the validated port number
    logger.info('Port validation successful', { validatedPort: parsedPort });
    return parsedPort;
}

/**
 * Validates the host value from environment or default.
 * Ensures the host is a non-empty string.
 * 
 * @param {string} hostValue - The host value to validate (from environment or default)
 * @returns {string} A valid host string for server binding
 */
function validateHost(hostValue) {
    // If hostValue is undefined, empty, or not a string, return DEFAULT_HOST
    if (hostValue === undefined || hostValue === null || typeof hostValue !== 'string' || hostValue.trim() === '') {
        if (hostValue !== undefined && hostValue !== null) {
            logger.warn('Invalid host value provided. Host must be a non-empty string. Using default host.', {
                providedHost: hostValue,
                hostType: typeof hostValue,
                defaultHost: DEFAULT_HOST
            });
        } else {
            logger.info('No host specified, using default host', { defaultHost: DEFAULT_HOST });
        }
        return DEFAULT_HOST;
    }
    
    // Return the validated host string
    const trimmedHost = hostValue.trim();
    logger.info('Host validation successful', { validatedHost: trimmedHost });
    return trimmedHost;
}

/**
 * Validates the environment mode (NODE_ENV) from environment or default.
 * Ensures the environment is one of 'development', 'production', or 'test'.
 * 
 * @param {string} envValue - The environment value to validate (from NODE_ENV or default)
 * @returns {string} A valid environment string
 */
function validateEnv(envValue) {
    // If envValue is not one of the valid environments, log a warning and return DEFAULT_ENV
    if (!envValue || typeof envValue !== 'string' || !VALID_ENVIRONMENTS.includes(envValue.toLowerCase())) {
        if (envValue) {
            logger.warn(`Invalid environment value: ${envValue}. Environment must be one of: ${VALID_ENVIRONMENTS.join(', ')}. Using default environment.`, {
                providedEnv: envValue,
                validEnvironments: VALID_ENVIRONMENTS,
                defaultEnv: DEFAULT_ENV
            });
        } else {
            logger.info('No environment specified, using default environment', { defaultEnv: DEFAULT_ENV });
        }
        return DEFAULT_ENV;
    }
    
    // Return the validated environment string
    const validatedEnv = envValue.toLowerCase();
    logger.info('Environment validation successful', { validatedEnv: validatedEnv });
    return validatedEnv;
}

/**
 * Loads and validates server configuration from environment variables.
 * Provides fallback defaults for missing or invalid configuration values.
 * Logs the configuration loading process for operational transparency.
 * 
 * @returns {object} The complete server configuration object
 */
function loadServerConfiguration() {
    logger.info('Loading server configuration from environment variables');
    
    // Read environment variables with validation
    const port = validatePort(process.env.PORT);
    const host = validateHost(process.env.HOST);
    const env = validateEnv(process.env.NODE_ENV);
    
    // Create configuration object
    const config = {
        port: port,
        host: host,
        env: env
    };
    
    // Log successful configuration loading
    logger.info('Server configuration loaded successfully', {
        configuration: config,
        source: 'environment variables with fallback defaults'
    });
    
    return config;
}

/**
 * Validates the complete server configuration object.
 * Ensures all required properties are present and valid.
 * 
 * @param {object} config - The server configuration object to validate
 * @returns {boolean} True if configuration is valid, false otherwise
 */
function validateServerConfiguration(config) {
    logger.info('Validating server configuration object');
    
    // Check if config is an object
    if (!config || typeof config !== 'object') {
        logger.error('Server configuration is not a valid object', { config: config });
        return false;
    }
    
    // Validate required properties
    const requiredProperties = ['port', 'host', 'env'];
    for (const prop of requiredProperties) {
        if (!(prop in config)) {
            logger.error(`Missing required configuration property: ${prop}`, { 
                config: config,
                requiredProperties: requiredProperties
            });
            return false;
        }
    }
    
    // Validate property types
    if (typeof config.port !== 'number' || config.port < MIN_PORT || config.port > MAX_PORT) {
        logger.error('Invalid port in configuration object', { 
            port: config.port,
            portType: typeof config.port,
            validRange: `${MIN_PORT}-${MAX_PORT}`
        });
        return false;
    }
    
    if (typeof config.host !== 'string' || config.host.trim() === '') {
        logger.error('Invalid host in configuration object', { 
            host: config.host,
            hostType: typeof config.host
        });
        return false;
    }
    
    if (typeof config.env !== 'string' || !VALID_ENVIRONMENTS.includes(config.env)) {
        logger.error('Invalid environment in configuration object', { 
            env: config.env,
            envType: typeof config.env,
            validEnvironments: VALID_ENVIRONMENTS
        });
        return false;
    }
    
    logger.info('Server configuration validation successful');
    return true;
}

// Load and validate server configuration
const serverConfig = loadServerConfiguration();

// Final validation of the complete configuration object
if (!validateServerConfiguration(serverConfig)) {
    logger.error('Server configuration validation failed. Application cannot start with invalid configuration.');
    process.exit(1);
}

// Log final configuration for operational transparency
logger.info('Server configuration ready for use', {
    finalConfiguration: serverConfig,
    configurationSource: 'Validated environment variables with secure defaults',
    ready: true
});

// Export the server configuration object for use by the main server entry point
// This serves as the single source of truth for server settings throughout the backend
module.exports = { serverConfig };