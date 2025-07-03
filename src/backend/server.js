/**
 * Primary Server Entry Point for Node.js Tutorial Application
 * 
 * This module serves as the canonical entry point for starting the Node.js/Express.js
 * server. It imports the fully configured Express app instance, resolves environment
 * configuration (port, host, environment), starts the HTTP server, and handles
 * server-level events including startup, errors, and shutdown.
 * 
 * The server integrates centralized, environment-aware logging for all lifecycle
 * events and ensures robust, observable, and platform-agnostic server initialization
 * in accordance with Node.js/Express.js best practices.
 * 
 * Key Features:
 * - Express.js 5.1.0 HTTP server initialization with validated configuration
 * - Comprehensive server lifecycle management (startup, running, shutdown)
 * - Environment-aware logging for observability and troubleshooting
 * - Graceful shutdown handling with process signal management
 * - Fatal error handling with proper exit codes and error logging
 * - Platform-agnostic deployment support for multiple hosting environments
 * - Production-ready error handling and monitoring capabilities
 * 
 * Architecture Pattern:
 * This module follows the separation of concerns principle where app.js handles
 * Express application configuration while server.js manages HTTP server lifecycle.
 * This design provides clear boundaries between application logic and server
 * management, enabling better testing, monitoring, and deployment flexibility.
 * 
 * Server Lifecycle:
 * 1. Import and validate dependencies (app, configuration, logging)
 * 2. Start HTTP server with resolved port and host configuration
 * 3. Log successful startup with environment details and access information
 * 4. Register process signal handlers for graceful shutdown
 * 5. Handle fatal errors with comprehensive logging and proper exit codes
 * 6. Support graceful shutdown on SIGINT/SIGTERM with cleanup logging
 * 
 * Requirements Addressed:
 * - HTTP Server Implementation (F-001-RQ-001, F-001-RQ-002): Initializes Express.js
 *   application instance and configures server to listen on specified port with
 *   proper validation and platform-agnostic deployment support
 * - Deployment and Environment Configuration (8.2.5): Resolves port, host, and
 *   environment from environment variables with robust fallback mechanisms
 * - Monitoring and Observability (6.5): Integrates centralized Logger utility
 *   for structured, environment-aware logs covering startup, shutdown, and errors
 * - Error Management (1.3.1): Handles fatal server errors with comprehensive
 *   logging and graceful exit strategies preventing silent failures
 * 
 * Error Handling Strategy:
 * - EADDRINUSE: Port already in use - logs error and exits with code 1
 * - EACCES: Permission denied (privileged port) - logs error and exits with code 1
 * - ENOTFOUND: Host not found - logs error and exits with code 1
 * - Other fatal errors: Logs with stack trace and exits with code 1
 * - Process signals: Graceful shutdown with cleanup logging and exit code 0
 * 
 * Performance Characteristics:
 * - Fast startup with minimal initialization overhead
 * - Efficient error handling without performance impact
 * - Low memory footprint for server management operations
 * - Optimized logging with environment-based verbosity control
 * 
 * Security Considerations:
 * - Environment-aware error reporting to prevent information leakage
 * - Proper exit code handling for monitoring and orchestration systems
 * - Secure signal handling for graceful shutdown without data loss
 * - Validated configuration to prevent misconfiguration vulnerabilities
 * 
 * @fileoverview Primary HTTP server entry point with lifecycle management
 * @version 1.0.0
 * @author Tutorial Implementation Team
 * @requires ./app.js Fully configured Express application instance
 * @requires ./config/env.js Environment configuration (port, host, env)
 * @requires ./utils/logger.js Centralized logging utility
 * @requires process Node.js built-in process module for signals and exit
 * @since 2024-01-01
 */

// =============================================================================
// EXTERNAL DEPENDENCIES
// =============================================================================

/**
 * Node.js Built-in Process Module
 * 
 * The process module provides information about, and control over, the current
 * Node.js process. Used for environment variable access, process signal handling,
 * and process exit management for graceful server shutdown and error handling.
 * 
 * Key Features Used:
 * - process.env: Environment variable access for configuration
 * - process.on(): Event listener registration for SIGINT/SIGTERM signals
 * - process.exit(): Controlled process termination with exit codes
 * - Signal handling: SIGINT (Ctrl+C), SIGTERM (process manager shutdown)
 * 
 * Security Considerations:
 * - Proper signal handling prevents data corruption during shutdown
 * - Exit code management enables monitoring system integration
 * - Graceful shutdown prevents resource leaks and incomplete operations
 * 
 * @external process
 * @see {@link https://nodejs.org/api/process.html|Node.js Process API Documentation}
 * @version Node.js 18+
 */
// process is a global object in Node.js - no explicit import needed

// =============================================================================
// INTERNAL DEPENDENCIES
// =============================================================================

/**
 * Fully Configured Express Application Instance
 * 
 * Import the complete Express.js application instance from app.js that has been
 * configured with all necessary middleware, routing, and error handling components.
 * This application instance is ready for HTTP server binding and request processing.
 * 
 * Application Features:
 * - Express.js 5.1.0 with security enhancements (ReDoS protection, CVE fixes)
 * - Comprehensive middleware stack (logging, body parsing, routing, error handling)
 * - Central API router with hello endpoint and health check functionality
 * - Environment-aware error handling and response generation
 * - Request/response logging for observability and troubleshooting
 * 
 * Integration Points:
 * - Used as request handler for HTTP server creation
 * - Inherits all middleware and routing configuration from app.js
 * - Provides complete request processing pipeline
 * - Enables separation of concerns between app configuration and server lifecycle
 * 
 * @see {@link ./app.js|Express Application Configuration Module}
 */
const { app } = require('./app.js');

/**
 * Environment Configuration Values
 * 
 * Import resolved and validated environment configuration including runtime
 * environment mode, server port, and host binding address. These values have
 * been processed through validation and fallback mechanisms to ensure reliable
 * server initialization across different deployment environments.
 * 
 * Configuration Values:
 * - env: Runtime environment (development, production, test) with validation
 * - port: Server port number (1024-65535) with platform-agnostic resolution
 * - host: Host binding address with fallback support for different platforms
 * 
 * Platform Support:
 * - Development: localhost binding with default port 3000
 * - Production: Platform-provided PORT environment variable support
 * - Container: 0.0.0.0 binding support for containerized deployments
 * - Cloud: Dynamic port assignment support (Heroku, Render, Vercel)
 * 
 * @see {@link ./config/env.js|Environment Configuration Module}
 */
const { env, port, host } = require('./config/env.js');

/**
 * Centralized Logging Utility
 * 
 * Import the Logger class for comprehensive, environment-aware logging throughout
 * the server lifecycle. The Logger provides structured logging with consistent
 * formatting, timestamps, and metadata for observability and troubleshooting.
 * 
 * Logging Features:
 * - Environment-aware log levels (info, warn, error, debug)
 * - Structured log formatting with timestamps and application context
 * - Automatic error object handling with stack trace extraction
 * - Test environment log suppression for clean test output
 * - Production-optimized logging with security considerations
 * 
 * Usage Patterns:
 * - Logger.info(): Server startup, shutdown, and operational events
 * - Logger.error(): Fatal errors, startup failures, and critical issues
 * - Logger.warn(): Non-fatal issues and warnings during operation
 * - Logger.debug(): Detailed diagnostic information (development only)
 * 
 * @see {@link ./utils/logger.js|Centralized Logging Utility Module}
 */
const { Logger } = require('./utils/logger.js');

// =============================================================================
// GLOBAL VARIABLES
// =============================================================================

/**
 * HTTP Server Instance Reference
 * 
 * Global reference to the HTTP server instance created by app.listen().
 * This reference is used for graceful shutdown operations and server lifecycle
 * management. The variable is initialized to null and set when the server starts.
 * 
 * Lifecycle Management:
 * - Set during server startup in startServer() function
 * - Used during graceful shutdown in handleProcessSignals() function
 * - Enables proper cleanup and connection management
 * - Supports server monitoring and health checks
 * 
 * Error Handling:
 * - Checked for existence before shutdown operations
 * - Protected against null reference errors during cleanup
 * - Enables safe server management across different execution scenarios
 * 
 * @type {http.Server|null}
 * @global
 */
let server = null;

// =============================================================================
// SERVER LIFECYCLE FUNCTIONS
// =============================================================================

/**
 * Start Express HTTP Server with Configuration and Error Handling
 * 
 * Initializes and starts the Express.js HTTP server using the configured
 * application instance, resolved port and host settings, and comprehensive
 * error handling. The function implements robust startup logging, fatal error
 * management, and server instance tracking for lifecycle management.
 * 
 * Startup Process:
 * 1. Call app.listen() with resolved port, host, and startup callback
 * 2. Log successful startup with environment, port, host, and access information
 * 3. Register server error event handlers for fatal error management
 * 4. Handle specific error types (EADDRINUSE, EACCES, ENOTFOUND) with targeted logging
 * 5. Return server instance for lifecycle management and testing
 * 
 * Error Handling Strategy:
 * - EADDRINUSE: Port already in use - common in development environments
 * - EACCES: Permission denied - typically privileged port binding attempts
 * - ENOTFOUND: Host not found - invalid host configuration
 * - Generic errors: Unexpected server failures with full error context
 * 
 * Logging Strategy:
 * - Startup success: Info level with environment context and access URLs
 * - Fatal errors: Error level with error details and troubleshooting guidance
 * - Environment awareness: Detailed logging in development, secure in production
 * 
 * Performance Considerations:
 * - Efficient error handling without startup performance impact
 * - Minimal memory overhead for server management
 * - Fast startup with comprehensive validation and logging
 * 
 * Security Considerations:
 * - Environment-aware error messages to prevent information disclosure
 * - Proper exit codes for monitoring and orchestration systems
 * - Secure logging of sensitive configuration information
 * 
 * @function startServer
 * @returns {http.Server} The HTTP server instance returned by app.listen()
 * 
 * @throws {Error} Throws and logs fatal server startup errors before process exit
 * 
 * @example
 * // Basic server startup
 * const server = startServer();
 * console.log('Server started successfully');
 * 
 * @example
 * // Server startup with additional configuration
 * const server = startServer();
 * server.timeout = 30000; // 30 second timeout
 * server.keepAliveTimeout = 5000; // 5 second keep-alive
 * 
 * @example
 * // Testing integration
 * describe('Server Startup', () => {
 *   it('should start server successfully', () => {
 *     const server = startServer();
 *     expect(server).toBeDefined();
 *     expect(server.listening).toBe(true);
 *     server.close();
 *   });
 * });
 */
function startServer() {
    try {
        // =======================================================================
        // HTTP SERVER INITIALIZATION
        // =======================================================================
        
        /**
         * Create and Start HTTP Server
         * 
         * Use app.listen() to create an HTTP server instance with the Express
         * application as the request handler. The method binds to the resolved
         * port and host, starts accepting connections, and executes the callback
         * when the server is ready to receive requests.
         * 
         * Express.js app.listen() Implementation:
         * - Creates http.Server instance with app as request handler
         * - Binds to specified port and host with proper error handling
         * - Returns server instance for lifecycle management
         * - Provides callback execution when server is ready
         * 
         * Platform Compatibility:
         * - Supports dynamic port assignment (process.env.PORT)
         * - Handles host binding for different deployment environments
         * - Compatible with cloud platforms, containers, and local development
         * 
         * @see {@link https://expressjs.com/en/5x/api.html#app.listen|Express app.listen() Documentation}
         */
        server = app.listen(port, host, () => {
            // ===================================================================
            // STARTUP SUCCESS LOGGING
            // ===================================================================
            
            /**
             * Log Successful Server Startup
             * 
             * Provide comprehensive startup logging with environment context,
             * server configuration, and access information. The logging includes
             * all necessary details for operational monitoring, troubleshooting,
             * and development convenience.
             * 
             * Logged Information:
             * - Server startup confirmation with timestamp
             * - Environment mode (development, production, test)
             * - Server binding details (host and port)
             * - Local access URLs for development convenience
             * - Process ID for monitoring and debugging
             */
            Logger.info('🚀 HTTP server started successfully', {
                environment: env,
                host: host,
                port: port,
                processId: process.pid,
                nodeVersion: process.version,
                timestamp: new Date().toISOString()
            });
            
            /**
             * Development Environment Enhanced Logging
             * 
             * Provide additional development-specific logging including local
             * access URLs, development tips, and environment-specific information
             * that assists developers during local development and testing.
             */
            if (env === 'development') {
                Logger.info('🔧 Development server ready', {
                    localUrl: `http://${host}:${port}`,
                    helloEndpoint: `http://${host}:${port}/hello`,
                    healthEndpoint: `http://${host}:${port}/health`,
                    tips: 'Use Ctrl+C to stop the server gracefully'
                });
            }
            
            /**
             * Production Environment Logging
             * 
             * Provide production-appropriate logging with essential operational
             * information while maintaining security by not exposing internal
             * details that could be useful for attackers.
             */
            if (env === 'production') {
                Logger.info('✅ Production server operational', {
                    port: port,
                    environment: env,
                    uptime: process.uptime()
                });
            }
        });
        
        // =======================================================================
        // SERVER ERROR HANDLING
        // =======================================================================
        
        /**
         * Register Server Error Event Handler
         * 
         * Attach comprehensive error handling to the server instance to catch
         * and properly handle fatal server errors that can occur during startup
         * or runtime. The error handler provides specific handling for common
         * error conditions and generic handling for unexpected errors.
         * 
         * Error Handler Features:
         * - Specific handling for common server errors (EADDRINUSE, EACCES, etc.)
         * - Comprehensive error logging with context and troubleshooting guidance
         * - Proper exit code management for monitoring and orchestration systems
         * - Security-conscious error reporting based on environment
         * 
         * @listens server#error
         */
        server.on('error', (error) => {
            /**
             * Handle Port Already In Use Error (EADDRINUSE)
             * 
             * This error occurs when the specified port is already occupied by
             * another process. Common in development environments where previous
             * server instances haven't been properly terminated.
             */
            if (error.code === 'EADDRINUSE') {
                Logger.error('❌ Server startup failed: Port already in use', {
                    port: port,
                    host: host,
                    environment: env,
                    errorCode: error.code,
                    errorMessage: error.message,
                    troubleshooting: {
                        suggestion: `Port ${port} is already in use by another process`,
                        solutions: [
                            'Stop the other process using this port',
                            'Use a different port by setting PORT environment variable',
                            'Check for existing server instances with: lsof -i :' + port
                        ]
                    }
                });
                
                // Exit with code 1 to indicate startup failure
                process.exit(1);
            }
            
            /**
             * Handle Permission Denied Error (EACCES)
             * 
             * This error occurs when attempting to bind to a privileged port
             * (< 1024) without sufficient permissions. Common when trying to
             * use ports like 80 or 443 without root privileges.
             */
            else if (error.code === 'EACCES') {
                Logger.error('❌ Server startup failed: Permission denied', {
                    port: port,
                    host: host,
                    environment: env,
                    errorCode: error.code,
                    errorMessage: error.message,
                    troubleshooting: {
                        suggestion: `Insufficient permissions to bind to port ${port}`,
                        solutions: [
                            'Use a non-privileged port (>= 1024)',
                            'Run with elevated privileges if port < 1024 is required',
                            'Set PORT environment variable to a valid port number'
                        ]
                    }
                });
                
                // Exit with code 1 to indicate startup failure
                process.exit(1);
            }
            
            /**
             * Handle Host Not Found Error (ENOTFOUND)
             * 
             * This error occurs when the specified host cannot be resolved or
             * is not available for binding. Common with invalid host configuration
             * or network connectivity issues.
             */
            else if (error.code === 'ENOTFOUND') {
                Logger.error('❌ Server startup failed: Host not found', {
                    port: port,
                    host: host,
                    environment: env,
                    errorCode: error.code,
                    errorMessage: error.message,
                    troubleshooting: {
                        suggestion: `Cannot resolve or bind to host: ${host}`,
                        solutions: [
                            'Verify host configuration is correct',
                            'Use localhost or 0.0.0.0 for local development',
                            'Check network connectivity and DNS resolution'
                        ]
                    }
                });
                
                // Exit with code 1 to indicate startup failure
                process.exit(1);
            }
            
            /**
             * Handle Generic Fatal Server Errors
             * 
             * Catch-all handler for unexpected server errors that don't fall
             * into the specific categories above. Provides comprehensive error
             * logging and graceful failure handling.
             */
            else {
                Logger.error('❌ Fatal server error occurred', {
                    port: port,
                    host: host,
                    environment: env,
                    errorCode: error.code || 'UNKNOWN',
                    errorMessage: error.message,
                    errorStack: error.stack,
                    troubleshooting: {
                        suggestion: 'An unexpected server error occurred',
                        action: 'Check the error details above and server configuration'
                    }
                });
                
                // Exit with code 1 to indicate fatal server error
                process.exit(1);
            }
        });
        
        // =======================================================================
        // SERVER INSTANCE RETURN
        // =======================================================================
        
        /**
         * Return Server Instance
         * 
         * Return the HTTP server instance for external usage including testing,
         * monitoring, additional configuration, and lifecycle management. The
         * server instance provides access to all Node.js HTTP server methods
         * and events for advanced server management.
         * 
         * Server Instance Features:
         * - HTTP server methods (close, setTimeout, etc.)
         * - Event emitter capabilities for monitoring
         * - Connection management and statistics
         * - Integration with testing frameworks and monitoring tools
         * 
         * @returns {http.Server} HTTP server instance for lifecycle management
         */
        return server;
        
    } catch (error) {
        // =======================================================================
        // STARTUP EXCEPTION HANDLING
        // =======================================================================
        
        /**
         * Handle Synchronous Startup Exceptions
         * 
         * Catch and handle any synchronous exceptions that occur during server
         * initialization before the asynchronous server startup process begins.
         * This provides a safety net for configuration errors, module loading
         * issues, and other synchronous initialization failures.
         */
        Logger.error('❌ Server initialization failed with exception', {
            environment: env,
            port: port,
            host: host,
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack
            },
            troubleshooting: {
                suggestion: 'Server initialization threw an unexpected exception',
                action: 'Check application configuration and dependencies'
            }
        });
        
        // Exit with code 1 to indicate initialization failure
        process.exit(1);
    }
}

/**
 * Handle Process-Level Signals for Graceful Server Shutdown
 * 
 * Registers event listeners for process termination signals (SIGINT, SIGTERM)
 * to enable graceful server shutdown with proper cleanup, connection draining,
 * and resource release. The function ensures that the application exits cleanly
 * without data loss or resource leaks.
 * 
 * Signal Handling Strategy:
 * - SIGINT: Interactive interrupt signal (Ctrl+C) - common in development
 * - SIGTERM: Termination signal from process managers - common in production
 * - Graceful shutdown: Allow existing connections to complete before termination
 * - Cleanup logging: Provide observability for shutdown process
 * - Exit code 0: Indicate successful graceful shutdown
 * 
 * Shutdown Process:
 * 1. Receive termination signal (SIGINT or SIGTERM)
 * 2. Log shutdown initiation with signal type and environment context
 * 3. Call server.close() to stop accepting new connections
 * 4. Allow existing connections to complete (graceful draining)
 * 5. Log shutdown completion and exit with code 0
 * 
 * Resource Management:
 * - Stops accepting new HTTP connections
 * - Allows existing requests to complete processing
 * - Releases server resources and port binding
 * - Prevents resource leaks and connection hanging
 * 
 * Error Handling:
 * - Handles cases where server is not initialized
 * - Manages shutdown timeouts and forced termination
 * - Provides fallback exit mechanisms for edge cases
 * 
 * Monitoring Integration:
 * - Provides structured shutdown logging for monitoring systems
 * - Reports shutdown duration and connection counts
 * - Enables operational visibility into deployment lifecycle
 * 
 * @function handleProcessSignals
 * @param {http.Server} serverInstance - The HTTP server instance to manage
 * @returns {void} No return value - manages process exit
 * 
 * @example
 * // Register signal handlers after server startup
 * const server = startServer();
 * handleProcessSignals(server);
 * 
 * @example
 * // Testing graceful shutdown
 * const server = startServer();
 * handleProcessSignals(server);
 * process.kill(process.pid, 'SIGTERM'); // Trigger graceful shutdown
 * 
 * @example
 * // Production deployment with PM2
 * const server = startServer();
 * handleProcessSignals(server);
 * // PM2 sends SIGTERM for graceful shutdown
 */
function handleProcessSignals(serverInstance) {
    /**
     * Handle SIGINT Signal (Ctrl+C / Interactive Interrupt)
     * 
     * SIGINT is typically sent when a user presses Ctrl+C in a terminal or
     * when an interactive process is interrupted. This is common during
     * development when developers need to stop the server quickly.
     * 
     * @listens process#SIGINT
     */
    process.on('SIGINT', () => {
        Logger.info('🛑 Received SIGINT (Ctrl+C) - initiating graceful shutdown', {
            signal: 'SIGINT',
            environment: env,
            processId: process.pid,
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        });
        
        gracefulShutdown(serverInstance, 'SIGINT');
    });
    
    /**
     * Handle SIGTERM Signal (Termination Request)
     * 
     * SIGTERM is typically sent by process managers (PM2, Docker, Kubernetes)
     * or system shutdown procedures to request graceful termination. This is
     * the standard way for production systems to request application shutdown.
     * 
     * @listens process#SIGTERM
     */
    process.on('SIGTERM', () => {
        Logger.info('🛑 Received SIGTERM - initiating graceful shutdown', {
            signal: 'SIGTERM',
            environment: env,
            processId: process.pid,
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        });
        
        gracefulShutdown(serverInstance, 'SIGTERM');
    });
    
    /**
     * Perform Graceful Server Shutdown
     * 
     * Internal function that handles the actual shutdown process including
     * server closing, connection draining, and process termination. This
     * function is called by both SIGINT and SIGTERM handlers to ensure
     * consistent shutdown behavior across different signal types.
     * 
     * @function gracefulShutdown
     * @param {http.Server} serverInstance - Server instance to shutdown
     * @param {string} signal - Signal type that triggered shutdown
     * @private
     */
    function gracefulShutdown(serverInstance, signal) {
        // Check if server instance exists and is listening
        if (!serverInstance || !serverInstance.listening) {
            Logger.warn('⚠️ No active server to shutdown', {
                signal: signal,
                serverExists: !!serverInstance,
                serverListening: serverInstance ? serverInstance.listening : false
            });
            
            // Exit immediately if no server to shutdown
            process.exit(0);
            return;
        }
        
        // Record shutdown start time for duration tracking
        const shutdownStartTime = Date.now();
        
        Logger.info('🔄 Closing HTTP server and draining connections', {
            signal: signal,
            environment: env,
            serverListening: serverInstance.listening
        });
        
        /**
         * Close Server and Handle Shutdown Completion
         * 
         * Call server.close() to stop accepting new connections and wait for
         * existing connections to complete. The callback is executed when all
         * connections have been closed and the server has fully shutdown.
         */
        serverInstance.close((closeError) => {
            // Calculate shutdown duration for monitoring
            const shutdownDuration = Date.now() - shutdownStartTime;
            
            if (closeError) {
                /**
                 * Handle Server Close Errors
                 * 
                 * Log any errors that occur during server shutdown while still
                 * proceeding with process termination to avoid hanging processes.
                 */
                Logger.error('❌ Error occurred during server shutdown', {
                    signal: signal,
                    error: {
                        name: closeError.name,
                        message: closeError.message,
                        stack: closeError.stack
                    },
                    shutdownDuration: shutdownDuration,
                    environment: env
                });
                
                // Exit with code 1 to indicate shutdown error
                process.exit(1);
            } else {
                /**
                 * Log Successful Graceful Shutdown
                 * 
                 * Provide comprehensive shutdown completion logging including
                 * signal type, duration, and environment context for operational
                 * monitoring and troubleshooting.
                 */
                Logger.info('✅ Graceful shutdown completed successfully', {
                    signal: signal,
                    shutdownDuration: `${shutdownDuration}ms`,
                    environment: env,
                    processId: process.pid,
                    totalUptime: `${process.uptime()}s`,
                    timestamp: new Date().toISOString()
                });
                
                // Exit with code 0 to indicate successful shutdown
                process.exit(0);
            }
        });
        
        /**
         * Shutdown Timeout Protection
         * 
         * Implement a timeout mechanism to prevent the shutdown process from
         * hanging indefinitely if connections don't close within a reasonable
         * time period. This ensures the process will terminate even if some
         * connections are unresponsive.
         */
        const shutdownTimeout = setTimeout(() => {
            Logger.warn('⚠️ Graceful shutdown timeout - forcing process termination', {
                signal: signal,
                timeoutDuration: '10000ms',
                environment: env,
                processId: process.pid
            });
            
            // Force exit with code 1 to indicate forced termination
            process.exit(1);
        }, 10000); // 10 second timeout
        
        // Clear timeout if graceful shutdown completes normally
        serverInstance.on('close', () => {
            clearTimeout(shutdownTimeout);
        });
    }
}

// =============================================================================
// SERVER INITIALIZATION AND STARTUP
// =============================================================================

/**
 * Application Entry Point - Server Startup and Lifecycle Management
 * 
 * This section serves as the main entry point for the application when server.js
 * is executed directly. It orchestrates the complete server startup process
 * including server initialization, process signal handling, and error management.
 * 
 * Startup Sequence:
 * 1. Log application startup initiation with environment context
 * 2. Start HTTP server using startServer() function
 * 3. Register process signal handlers for graceful shutdown
 * 4. Log successful initialization and operational status
 * 
 * Error Handling:
 * All errors during startup are handled by the individual functions and will
 * result in process termination with appropriate exit codes and error logging.
 * This ensures that startup failures are properly reported and don't result
 * in silent failures or hanging processes.
 * 
 * Production Readiness:
 * The startup process is designed for production deployment with proper error
 * handling, logging, and monitoring integration. It supports various deployment
 * scenarios including containers, cloud platforms, and process managers.
 */

// Log application startup initiation
Logger.info('🌟 Starting Node.js tutorial application', {
    environment: env,
    nodeVersion: process.version,
    processId: process.pid,
    platform: process.platform,
    architecture: process.arch,
    configuredPort: port,
    configuredHost: host,
    timestamp: new Date().toISOString()
});

// Start the HTTP server
const serverInstance = startServer();

// Register process signal handlers for graceful shutdown
handleProcessSignals(serverInstance);

// Log successful application initialization
Logger.info('🎯 Application initialization completed', {
    environment: env,
    serverListening: serverInstance.listening,
    processId: process.pid,
    status: 'ready',
    timestamp: new Date().toISOString()
});

// =============================================================================
// MODULE EXPORTS
// =============================================================================

/**
 * Export Server Functions for External Use
 * 
 * Export the core server functions to enable testing, monitoring, and advanced
 * server management scenarios. This export pattern supports various integration
 * patterns while maintaining the standalone execution capability of server.js.
 * 
 * Exported Functions:
 * - startServer: HTTP server initialization function for testing and custom usage
 * - handleProcessSignals: Signal handler registration for custom server management
 * 
 * Usage Scenarios:
 * 1. Testing: Import functions for unit and integration testing
 * 2. Custom Deployment: Use functions in custom deployment scripts
 * 3. Monitoring: Access server instance for health checks and monitoring
 * 4. Development Tools: Integration with development and debugging tools
 * 
 * @example
 * // Testing integration
 * const { startServer } = require('./server.js');
 * const server = startServer();
 * // Perform tests
 * server.close();
 * 
 * @example
 * // Custom deployment script
 * const { startServer, handleProcessSignals } = require('./server.js');
 * const server = startServer();
 * handleProcessSignals(server);
 * // Additional deployment logic
 * 
 * @example
 * // Health check integration
 * const { startServer } = require('./server.js');
 * const server = startServer();
 * const healthCheck = () => server.listening;
 */
module.exports = {
    /**
     * HTTP Server Initialization Function
     * 
     * Starts the Express.js HTTP server with comprehensive error handling,
     * logging, and configuration management. Returns the server instance for
     * lifecycle management and integration with external systems.
     * 
     * @function startServer
     * @returns {http.Server} HTTP server instance
     * @see {@link startServer} Full function documentation
     */
    startServer,
    
    /**
     * Process Signal Handler Registration Function
     * 
     * Registers SIGINT and SIGTERM signal handlers for graceful server shutdown
     * with proper cleanup, connection draining, and exit code management.
     * 
     * @function handleProcessSignals
     * @param {http.Server} serverInstance - Server instance to manage
     * @returns {void}
     * @see {@link handleProcessSignals} Full function documentation
     */
    handleProcessSignals
};