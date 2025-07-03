// External imports
const process = require('process'); // Node.js 18+ - Access environment variables, handle process-level events (uncaughtException, unhandledRejection), and manage process exit

// Internal imports
const app = require('./app.js'); // Fully configured Express application instance, including all middleware, routes, and error handling. Used as the request handler for the HTTP server.
const { serverConfig } = require('./config/index.js'); // Validated server configuration object providing port, host, and environment mode. Used to control server binding and logging.
const { logger } = require('./utils/logger.js'); // Centralized logger utility for structured info, warn, and error logging. Used for all server lifecycle and error messages.

/**
 * Main Server Entry Point for Node.js Tutorial Application
 * 
 * This module serves as the primary server initialization and startup entry point
 * for the Node.js tutorial backend application. It implements production-ready
 * HTTP server initialization patterns following the F-001: HTTP Server Initialization
 * requirements from the technical specification.
 * 
 * Key Responsibilities:
 * - Initialize and start the HTTP server using the configured Express application
 * - Bind to the validated port and host configuration with proper error handling
 * - Implement comprehensive logging for server lifecycle events and errors
 * - Handle graceful error scenarios including port binding failures and process exceptions
 * - Register process-level event handlers for uncaught exceptions and unhandled rejections
 * - Export the server instance for testing and process management integration
 * 
 * Architecture Pattern:
 * This follows the Server Factory pattern with centralized configuration management,
 * where the server initialization is separated from the Express application configuration.
 * This enables easy testing, deployment flexibility, and clear separation of concerns.
 * 
 * Production Readiness Features:
 * - Graceful error handling with appropriate exit codes
 * - Comprehensive operational logging for monitoring and debugging
 * - Process-level exception handling to prevent unhandled crashes
 * - Signal handling for graceful shutdown support
 * - Configuration validation and secure defaults
 * - Educational clarity with detailed documentation
 * 
 * Educational Value:
 * Demonstrates best practices for Node.js server initialization, Express.js integration,
 * error handling patterns, process management, and production deployment readiness
 * suitable for both learning environments and real-world applications.
 */

// Global server instance variable
// This will hold the HTTP server instance after successful startup
// Used for graceful shutdown, testing, and process management
let server = undefined;

/**
 * Initializes and starts the HTTP server using the Express app instance.
 * 
 * This function implements the core server startup logic following the F-001-RQ-001
 * through F-001-RQ-004 requirements from the technical specification. It handles
 * server binding, startup logging, and error scenarios with appropriate process
 * management and operational transparency.
 * 
 * Server Initialization Process:
 * 1. Attempts to bind the Express application to the configured port and host
 * 2. Logs successful startup with server details and environment information
 * 3. Handles binding errors (port in use, permission denied, etc.) with detailed logging
 * 4. Stores the server instance globally for lifecycle management
 * 5. Ensures proper process exit codes for operational monitoring
 * 
 * Error Handling:
 * - Port binding failures: Logs detailed error information and exits with code 1
 * - Permission errors: Logs access issues and exits with code 1
 * - Network errors: Logs network-related failures and exits with code 1
 * - Configuration errors: Logs configuration issues and exits with code 1
 * 
 * Logging Implementation:
 * - Startup success: Info-level logging with port, host, and environment details
 * - Binding errors: Error-level logging with error details and troubleshooting context
 * - Process management: Operational logging for monitoring and debugging
 * 
 * @returns {void} Starts the server and logs status or errors
 */
function startServer() {
    logger.info('Initializing HTTP server startup process', {
        port: serverConfig.port,
        host: serverConfig.host,
        environment: serverConfig.env,
        nodeVersion: process.version,
        processId: process.pid
    });
    
    try {
        // Attempt to start the Express application listening on the configured port and host
        // This creates the HTTP server instance and binds it to the network interface
        server = app.listen(serverConfig.port, serverConfig.host, () => {
            // Server successfully started and listening
            // Log comprehensive startup information for operational transparency
            logger.info('HTTP server started successfully and listening for connections', {
                port: serverConfig.port,
                host: serverConfig.host,
                environment: serverConfig.env,
                url: `http://${serverConfig.host}:${serverConfig.port}`,
                processId: process.pid,
                nodeVersion: process.version,
                timestamp: new Date().toISOString(),
                status: 'listening'
            });
            
            // Log environment-specific startup information
            if (serverConfig.env === 'development') {
                logger.info('Development server ready for local development', {
                    accessUrl: `http://${serverConfig.host}:${serverConfig.port}`,
                    apiEndpoints: ['/hello'],
                    developmentMode: true
                });
            } else if (serverConfig.env === 'production') {
                logger.info('Production server ready for client requests', {
                    environment: 'production',
                    productionMode: true,
                    securityHeaders: 'enabled',
                    errorHandling: 'production'
                });
            }
        });
        
        // Handle server-level errors after successful creation
        server.on('error', (error) => {
            logger.error('HTTP server encountered an error during operation', {
                error: error.message,
                errorCode: error.code,
                errorStack: error.stack,
                port: serverConfig.port,
                host: serverConfig.host,
                serverState: 'error'
            });
            
            // Handle specific server operation errors
            if (error.code === 'EADDRINUSE') {
                logger.error(`Port ${serverConfig.port} is already in use by another process`, {
                    port: serverConfig.port,
                    host: serverConfig.host,
                    errorCode: error.code,
                    troubleshooting: 'Try using a different port or stop the process using this port'
                });
            } else if (error.code === 'EACCES') {
                logger.error(`Permission denied accessing port ${serverConfig.port}`, {
                    port: serverConfig.port,
                    host: serverConfig.host,
                    errorCode: error.code,
                    troubleshooting: 'Try using a port above 1024 or run with appropriate permissions'
                });
            }
            
            // Exit process with error code
            process.exit(1);
        });
        
        // Handle server close events
        server.on('close', () => {
            logger.info('HTTP server closed successfully', {
                port: serverConfig.port,
                host: serverConfig.host,
                timestamp: new Date().toISOString(),
                status: 'closed'
            });
        });
        
    } catch (error) {
        // Handle synchronous errors during server creation
        logger.error('Failed to start HTTP server due to initialization error', {
            error: error.message,
            errorStack: error.stack,
            port: serverConfig.port,
            host: serverConfig.host,
            environment: serverConfig.env,
            nodeVersion: process.version,
            processId: process.pid
        });
        
        // Provide specific error handling for common issues
        if (error.code === 'EADDRINUSE') {
            logger.error(`Cannot bind to port ${serverConfig.port} - port is already in use`, {
                port: serverConfig.port,
                host: serverConfig.host,
                errorCode: error.code,
                solution: 'Choose a different port or stop the process using this port',
                troubleshooting: `Use 'lsof -i :${serverConfig.port}' to find the process using this port`
            });
        } else if (error.code === 'EACCES') {
            logger.error(`Permission denied binding to port ${serverConfig.port}`, {
                port: serverConfig.port,
                host: serverConfig.host,
                errorCode: error.code,
                solution: 'Use a port number above 1024 or run with appropriate permissions',
                troubleshooting: 'Ports below 1024 require root/administrator privileges'
            });
        } else if (error.code === 'ENOTFOUND') {
            logger.error(`Cannot resolve host ${serverConfig.host}`, {
                port: serverConfig.port,
                host: serverConfig.host,
                errorCode: error.code,
                solution: 'Check host configuration and network connectivity',
                troubleshooting: 'Verify the host address is correct and accessible'
            });
        }
        
        // Exit process with non-zero exit code to indicate failure
        process.exit(1);
    }
}

/**
 * Registers process-level event handlers for uncaught exceptions and unhandled promise rejections.
 * 
 * This function implements comprehensive process-level error handling following
 * the F-001-RQ-004 graceful error handling requirements. It ensures all fatal
 * errors are properly logged and the process exits cleanly, preventing silent
 * failures and providing operational transparency.
 * 
 * Process Events Handled:
 * - uncaughtException: Catches synchronous errors that bubble up to the process level
 * - unhandledRejection: Catches rejected promises that aren't handled by application code
 * - SIGTERM: Handles termination signals for graceful shutdown
 * - SIGINT: Handles interrupt signals (Ctrl+C) for graceful shutdown
 * 
 * Error Handling Strategy:
 * - Log comprehensive error details including stack traces and process information
 * - Attempt graceful server shutdown if server instance exists
 * - Provide operational context and troubleshooting information
 * - Exit with appropriate exit codes for monitoring and process management
 * - Prevent information leakage while maintaining operational transparency
 * 
 * Graceful Shutdown Process:
 * 1. Log the shutdown initiation with signal information
 * 2. Stop accepting new connections
 * 3. Close existing connections gracefully
 * 4. Log shutdown completion
 * 5. Exit with appropriate exit code
 * 
 * @returns {void} Sets up process event listeners
 */
function handleProcessEvents() {
    logger.info('Registering process-level event handlers for graceful error handling', {
        processId: process.pid,
        nodeVersion: process.version,
        platform: process.platform,
        eventHandlers: ['uncaughtException', 'unhandledRejection', 'SIGTERM', 'SIGINT']
    });
    
    // Handle uncaught exceptions
    // These are synchronous errors that bubble up to the process level
    process.on('uncaughtException', (error) => {
        logger.error('Uncaught exception encountered - process will exit', {
            error: error.message,
            errorStack: error.stack,
            errorName: error.name,
            processId: process.pid,
            timestamp: new Date().toISOString(),
            eventType: 'uncaughtException',
            serverRunning: server ? 'yes' : 'no'
        });
        
        // Log additional context for debugging
        logger.error('Uncaught exception context', {
            memoryUsage: process.memoryUsage(),
            uptime: process.uptime(),
            cwd: process.cwd(),
            argv: process.argv,
            environment: serverConfig.env
        });
        
        // Attempt graceful shutdown if server exists
        if (server) {
            logger.info('Attempting graceful server shutdown due to uncaught exception');
            server.close(() => {
                logger.info('Server closed gracefully after uncaught exception');
                process.exit(1);
            });
            
            // Force exit after timeout to prevent hanging
            setTimeout(() => {
                logger.error('Forced process exit after graceful shutdown timeout');
                process.exit(1);
            }, 5000);
        } else {
            // Exit immediately if no server to close
            process.exit(1);
        }
    });
    
    // Handle unhandled promise rejections
    // These are rejected promises that aren't caught by application code
    process.on('unhandledRejection', (reason, promise) => {
        logger.error('Unhandled promise rejection encountered - process will exit', {
            reason: reason instanceof Error ? reason.message : String(reason),
            reasonStack: reason instanceof Error ? reason.stack : undefined,
            promise: promise,
            processId: process.pid,
            timestamp: new Date().toISOString(),
            eventType: 'unhandledRejection',
            serverRunning: server ? 'yes' : 'no'
        });
        
        // Log additional context for debugging
        logger.error('Unhandled rejection context', {
            memoryUsage: process.memoryUsage(),
            uptime: process.uptime(),
            environment: serverConfig.env,
            nodeVersion: process.version
        });
        
        // Attempt graceful shutdown if server exists
        if (server) {
            logger.info('Attempting graceful server shutdown due to unhandled rejection');
            server.close(() => {
                logger.info('Server closed gracefully after unhandled rejection');
                process.exit(1);
            });
            
            // Force exit after timeout to prevent hanging
            setTimeout(() => {
                logger.error('Forced process exit after graceful shutdown timeout');
                process.exit(1);
            }, 5000);
        } else {
            // Exit immediately if no server to close
            process.exit(1);
        }
    });
    
    // Handle SIGTERM signal for graceful shutdown
    // This signal is typically sent by process managers for graceful termination
    process.on('SIGTERM', () => {
        logger.info('SIGTERM signal received - initiating graceful shutdown', {
            signal: 'SIGTERM',
            processId: process.pid,
            timestamp: new Date().toISOString(),
            serverRunning: server ? 'yes' : 'no'
        });
        
        if (server) {
            logger.info('Closing HTTP server gracefully due to SIGTERM');
            server.close(() => {
                logger.info('HTTP server closed gracefully after SIGTERM signal');
                process.exit(0);
            });
            
            // Force exit after timeout to prevent hanging
            setTimeout(() => {
                logger.warn('Forced process exit after SIGTERM graceful shutdown timeout');
                process.exit(0);
            }, 10000);
        } else {
            logger.info('No server to close - exiting immediately');
            process.exit(0);
        }
    });
    
    // Handle SIGINT signal for graceful shutdown (Ctrl+C)
    // This signal is typically sent by users or development tools
    process.on('SIGINT', () => {
        logger.info('SIGINT signal received - initiating graceful shutdown', {
            signal: 'SIGINT',
            processId: process.pid,
            timestamp: new Date().toISOString(),
            serverRunning: server ? 'yes' : 'no',
            environment: serverConfig.env
        });
        
        if (server) {
            logger.info('Closing HTTP server gracefully due to SIGINT');
            server.close(() => {
                logger.info('HTTP server closed gracefully after SIGINT signal');
                process.exit(0);
            });
            
            // Force exit after timeout to prevent hanging
            setTimeout(() => {
                logger.warn('Forced process exit after SIGINT graceful shutdown timeout');
                process.exit(0);
            }, 10000);
        } else {
            logger.info('No server to close - exiting immediately');
            process.exit(0);
        }
    });
    
    logger.info('Process event handlers registered successfully', {
        registeredEvents: ['uncaughtException', 'unhandledRejection', 'SIGTERM', 'SIGINT'],
        gracefulShutdown: 'enabled',
        processId: process.pid
    });
}

// Initialize process event handlers before starting the server
// This ensures error handling is in place before any server operations
handleProcessEvents();

// Start the HTTP server
// This is the main entry point that begins the server lifecycle
startServer();

// Export the server instance for external use
// This enables integration testing, process management, and graceful shutdown scripts
// The server variable will be undefined until startServer() creates the instance
module.exports = { server };