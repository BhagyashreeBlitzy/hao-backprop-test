/**
 * Primary Server Entry Point for Node.js Tutorial Application
 * 
 * This module serves as the main entry point for starting the HTTP server,
 * responsible for importing the fully configured Express app instance,
 * resolving environment configuration (port, host, environment), starting
 * the HTTP server, and handling server-level events (startup, errors, shutdown).
 * 
 * Integrates centralized, environment-aware logging for startup, shutdown, and
 * fatal error events. Ensures robust, observable, and platform-agnostic server
 * initialization in accordance with Node.js/Express.js and project best practices.
 * 
 * Features:
 * - HTTP server initialization with validated environment configuration
 * - Comprehensive startup, shutdown, and error event logging using Logger utility
 * - Fatal error handling for EADDRINUSE, EACCES, and other server startup failures
 * - Graceful shutdown handling for SIGINT and SIGTERM process signals
 * - Platform-agnostic server binding compatible with local and cloud deployments
 * - Observable server lifecycle with structured logging for troubleshooting
 * - Stateless design supporting horizontal scaling and load balancing
 * - Environment-aware behavior for development, production, and test contexts
 * 
 * Server Lifecycle:
 * 1. Import fully configured Express app and environment configuration
 * 2. Start HTTP server with app.listen() on resolved port and host
 * 3. Log successful startup with port, host, environment, and timestamp
 * 4. Attach error handlers for fatal server errors (port conflicts, permissions)
 * 5. Attach process signal handlers for graceful shutdown (SIGINT, SIGTERM)
 * 6. On shutdown signal, close server gracefully and log completion
 * 
 * Error Handling:
 * - Server startup errors: Log with Logger.error and exit with non-zero code
 * - Process signals: Log shutdown intent, close server, log completion, exit(0)
 * - Unhandled exceptions: Caught by Express error middleware, not server-level
 * 
 * @fileoverview Primary server entry point with lifecycle management and observability
 * @author Node.js Tutorial Team
 * @version 1.0.0
 * @since Node.js 18+
 * @requires express@5.1.0
 */

// Internal Dependencies - Application and Configuration
const { app } = require('./app.js'); // Fully configured Express application instance
const { env, port, host } = require('./config/env.js'); // Resolved environment configuration
const { Logger } = require('./utils/logger.js'); // Centralized logging utility

// External Dependencies - Node.js Built-in Modules
// Node.js 18+ - Built-in process module for environment variables and signal handling
const process = require('process');

/**
 * Starts the Express HTTP server on the resolved port and host
 * 
 * This function initializes the HTTP server by calling app.listen() with the
 * resolved port, host, and callback configuration. It handles server startup
 * success by logging comprehensive startup information and attaches error
 * event handlers to catch fatal startup errors like port conflicts or
 * permission issues.
 * 
 * The server startup process includes:
 * 1. Call app.listen(port, host, callback) to bind server to network interface
 * 2. In success callback, log startup details with Logger.info including timestamp
 * 3. Attach 'error' event handler to server for fatal error handling
 * 4. On fatal error, log error details with Logger.error and exit process
 * 5. Return server instance for process signal handling and testing
 * 
 * Fatal Error Handling:
 * - EADDRINUSE: Port already in use by another process
 * - EACCES: Insufficient permissions to bind to port (typically ports < 1024)
 * - ENOTFOUND: Host resolution failure
 * - Other system-level server binding errors
 * 
 * @function startServer
 * @returns {http.Server} The HTTP server instance returned by app.listen()
 * 
 * @example
 * // Start server and handle shutdown
 * const server = startServer();
 * handleProcessSignals(server);
 * 
 * @example
 * // Server startup with automatic logging
 * const server = startServer();
 * // Logs: [timestamp] [info] [app-name] [env] Server started successfully on http://localhost:3000
 */
function startServer() {
    // Step 1: Call app.listen(port, host, callback) to start the server
    const server = app.listen(port, host, () => {
        // Step 2: In the callback, log startup message with Logger.info
        // Include port, host, environment, and timestamp for comprehensive startup logging
        Logger.info(`Server started successfully on http://${host}:${port}`, {
            port: port,
            host: host,
            environment: env,
            timestamp: new Date().toISOString(),
            nodeVersion: process.version,
            pid: process.pid
        });
        
        // Log additional environment information for troubleshooting
        Logger.info(`Application ready to accept requests`, {
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            platform: process.platform,
            arch: process.arch
        });
    });
    
    // Step 3: Attach error event handler to the server to catch fatal errors
    server.on('error', (error) => {
        // Step 4: If a fatal error occurs, log the error with Logger.error
        Logger.error(`Fatal server error occurred during startup`, {
            errorCode: error.code,
            errorMessage: error.message,
            errorStack: error.stack,
            port: port,
            host: host,
            environment: env,
            timestamp: new Date().toISOString()
        });
        
        // Handle specific error types with descriptive messages
        switch (error.code) {
            case 'EADDRINUSE':
                Logger.error(`Port ${port} is already in use. Please choose a different port or stop the conflicting process.`);
                break;
            case 'EACCES':
                Logger.error(`Permission denied to bind to port ${port}. Use a port >= 1024 or run with appropriate permissions.`);
                break;
            case 'ENOTFOUND':
                Logger.error(`Host ${host} could not be resolved. Please check the host configuration.`);
                break;
            default:
                Logger.error(`Unexpected server error: ${error.message}`);
        }
        
        // Step 5: Exit the process with a non-zero code to signal failure
        process.exit(1);
    });
    
    // Additional server event handlers for comprehensive observability
    server.on('listening', () => {
        const address = server.address();
        Logger.info(`Server is now listening and ready to accept connections`, {
            address: address,
            family: address?.family,
            actualPort: address?.port
        });
    });
    
    server.on('close', () => {
        Logger.info(`Server closed and no longer accepting connections`);
    });
    
    // Step 6: Return the server instance for signal handling and testing
    return server;
}

/**
 * Handles process-level signals (SIGINT, SIGTERM) for graceful shutdown
 * 
 * This function sets up process signal handlers to ensure the server shuts down
 * gracefully when receiving termination signals. It handles both SIGINT (Ctrl+C)
 * and SIGTERM (process manager termination) by logging shutdown intent, closing
 * the server to stop accepting new connections, waiting for existing requests
 * to complete, and then exiting the process cleanly.
 * 
 * Graceful Shutdown Process:
 * 1. Listen for SIGINT and SIGTERM signals on process
 * 2. On signal receipt, log shutdown message with Logger.info
 * 3. Call server.close() to stop accepting new connections
 * 4. Allow existing requests to complete processing
 * 5. After server closes, log final shutdown message and exit with code 0
 * 6. Include timeout mechanism to force exit if graceful shutdown takes too long
 * 
 * Signal Handling:
 * - SIGINT: Interrupt signal (Ctrl+C in terminal)
 * - SIGTERM: Termination signal (process manager, Docker, Kubernetes)
 * - Graceful: Allows in-flight requests to complete before shutdown
 * - Timeout: Forces exit after 10 seconds if graceful shutdown fails
 * 
 * @function handleProcessSignals
 * @param {http.Server} server - The HTTP server instance to close gracefully
 * @returns {void} No return value. Ensures process exits cleanly.
 * 
 * @example
 * // Setup graceful shutdown after starting server
 * const server = startServer();
 * handleProcessSignals(server);
 * 
 * @example
 * // Graceful shutdown logging output
 * // [timestamp] [info] [app-name] [env] Received SIGTERM signal, initiating graceful shutdown
 * // [timestamp] [info] [app-name] [env] Server closed gracefully, exiting process
 */
function handleProcessSignals(server) {
    // Graceful shutdown timeout (10 seconds)
    const GRACEFUL_SHUTDOWN_TIMEOUT = 10000;
    
    /**
     * Common shutdown handler for both SIGINT and SIGTERM signals
     * Implements the graceful shutdown sequence with timeout protection
     * 
     * @inner
     * @function handleShutdown
     * @param {string} signal - The signal name that triggered shutdown
     */
    function handleShutdown(signal) {
        // Step 2: On signal, log a shutdown message with Logger.info
        Logger.info(`Received ${signal} signal, initiating graceful shutdown`, {
            signal: signal,
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            pid: process.pid
        });
        
        // Set up shutdown timeout to force exit if graceful shutdown hangs
        const shutdownTimeout = setTimeout(() => {
            Logger.error(`Graceful shutdown timeout exceeded, forcing process exit`, {
                timeoutMs: GRACEFUL_SHUTDOWN_TIMEOUT,
                signal: signal
            });
            process.exit(1);
        }, GRACEFUL_SHUTDOWN_TIMEOUT);
        
        // Step 3: Call server.close() to stop accepting new connections and finish existing requests
        server.close((closeError) => {
            // Clear the shutdown timeout since close completed
            clearTimeout(shutdownTimeout);
            
            if (closeError) {
                // If server.close() encounters an error, log it but still exit
                Logger.error(`Error during server close`, {
                    error: closeError.message,
                    signal: signal
                });
                process.exit(1);
            } else {
                // Step 4: After server closes, log a final shutdown message and exit the process with code 0
                Logger.info(`Server closed gracefully, exiting process`, {
                    signal: signal,
                    totalUptime: process.uptime(),
                    exitCode: 0,
                    timestamp: new Date().toISOString()
                });
                
                // Exit with success code
                process.exit(0);
            }
        });
    }
    
    // Step 1: Listen for SIGINT and SIGTERM signals on process
    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    
    // Handle unexpected process termination
    process.on('SIGHUP', () => handleShutdown('SIGHUP'));
    
    // Log that signal handlers are registered
    Logger.info(`Process signal handlers registered for graceful shutdown`, {
        signals: ['SIGINT', 'SIGTERM', 'SIGHUP'],
        pid: process.pid
    });
}

// Server Initialization and Lifecycle Management
// Only start server and handle signals if this file is run directly (not imported for testing)
if (require.main === module) {
    try {
        // Log application startup initiation
        Logger.info(`Initializing Node.js Hello World Tutorial Application`, {
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch,
            environment: env,
            timestamp: new Date().toISOString()
        });
        
        // Start the HTTP server
        const server = startServer();
        
        // Setup graceful shutdown handling
        handleProcessSignals(server);
        
        // Log successful initialization
        Logger.info(`Application initialization completed successfully`);
        
    } catch (initializationError) {
        // Handle any initialization errors
        Logger.error(`Failed to initialize application`, {
            error: initializationError.message,
            stack: initializationError.stack,
            timestamp: new Date().toISOString()
        });
        process.exit(1);
    }
}

/**
 * Named exports for the server module
 * 
 * Exports the startServer function for use in scripts, tests, or other modules
 * that need to programmatically start the HTTP server. The function returns
 * the server instance which can be used for testing or additional configuration.
 * 
 * Export Structure:
 * - startServer: Function to start HTTP server and return server instance
 * 
 * Integration Patterns:
 * ```javascript
 * // Testing usage
 * const { startServer } = require('./server.js');
 * const server = startServer();
 * // Run tests against server
 * server.close();
 * ```
 * 
 * ```javascript
 * // Custom initialization
 * const { startServer } = require('./server.js');
 * const server = startServer();
 * handleProcessSignals(server);
 * ```
 * 
 * Server Instance Capabilities:
 * - HTTP request handling via configured Express app
 * - Event emission for 'listening', 'error', 'close' events
 * - Graceful shutdown via server.close() method
 * - Network address information via server.address() method
 * - Connection management and keep-alive handling
 * 
 * @exports startServer
 */
module.exports = {
    /**
     * Starts the HTTP server and returns the server instance
     * 
     * Initializes the Express HTTP server on the configured port and host,
     * sets up comprehensive logging for startup events, attaches error handlers
     * for fatal server errors, and returns the server instance for additional
     * configuration or testing purposes.
     * 
     * The returned server instance can be used for:
     * - Process signal handling setup
     * - Testing and integration scenarios
     * - Additional server event listeners
     * - Programmatic server shutdown
     * 
     * @type {function}
     * @returns {http.Server} HTTP server instance from app.listen()
     */
    startServer
};