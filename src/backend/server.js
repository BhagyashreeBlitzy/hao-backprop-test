/**
 * HTTP Server Entry Point for Node.js Tutorial Backend
 * 
 * This file serves as the primary server entry point for the Node.js tutorial application.
 * It imports the fully configured Express app instance, resolves server configuration
 * (port, host, environment) from the centralized config module, and starts the HTTP server.
 * It handles server startup, logs server status and errors using the centralized logger,
 * and ensures graceful error handling on startup failures.
 * 
 * This file is responsible for binding the Express app to the network and is the canonical
 * entry point for running the backend in both development and production environments.
 * 
 * Key Responsibilities:
 * - Import and initialize the fully configured Express application instance
 * - Resolve server configuration from centralized configuration management
 * - Start the HTTP server and bind to the configured port and host
 * - Handle server startup errors gracefully with comprehensive logging
 * - Provide educational examples of Node.js server lifecycle management
 * - Demonstrate production-ready error handling and process management
 * 
 * Educational Value:
 * This file demonstrates several critical concepts for Node.js server development:
 * - Separation of concerns between app configuration and server startup
 * - Centralized configuration management and environment variable handling
 * - Comprehensive error handling for server lifecycle events
 * - Production-ready logging and monitoring practices
 * - Process-level error handling and graceful shutdown patterns
 * 
 * Technical Requirements Addressed:
 * - F-001: HTTP Server Initialization - Starts Express.js application and binds to network
 * - F-001: Server Configuration - Resolves port, host, and environment from config
 * - F-003: Error Handling Feature - Handles startup errors and logs all events
 * - Educational clarity through comprehensive documentation and maintainable code
 * 
 * Express 5 and Node.js v22 Compatibility:
 * - Leverages Express 5.1.0 features with automatic promise rejection handling
 * - Compatible with Node.js v22.x LTS for production stability and long-term support
 * - Implements modern JavaScript patterns and error handling capabilities
 * - Demonstrates current industry best practices for Node.js server development
 * 
 * Usage:
 * - Development: node server.js
 * - Production: NODE_ENV=production PORT=8080 HOST=0.0.0.0 node server.js
 * - Testing: NODE_ENV=test npm test (imports this file for testing)
 * 
 * @fileoverview Primary HTTP server entry point for Node.js tutorial application
 * @author Node.js Tutorial Project
 * @version 1.0.0
 * @requires ./app.js - Fully configured Express application instance
 * @requires ./config/index.js - Centralized server configuration
 * @requires ./utils/logger.js - Standardized logging utilities
 * @requires process - Node.js process management (built-in)
 */

// =============================================================================
// INTERNAL DEPENDENCIES
// =============================================================================

/**
 * Fully Configured Express Application Instance
 * 
 * Imports the complete Express.js application instance from app.js, which includes
 * all configured middleware, mounted routes (including /hello endpoint), error
 * handlers, and request processing pipeline. This application instance is ready
 * for immediate use by the HTTP server.
 * 
 * Application Features:
 * - Complete middleware stack with request logging and JSON parsing
 * - Main router mounted with /hello endpoint returning "Hello world"
 * - Comprehensive error handling with 404 and centralized error middleware
 * - Express 5 compatibility with automatic promise rejection handling
 * - Production-ready configuration with educational documentation
 * 
 * Import Details:
 * - Default export from app.js providing configured Express application
 * - No additional configuration required - app is ready for server binding
 * - Supports both development and production server startup scenarios
 * - Used by HTTP server creation via app.listen(PORT, HOST, callback)
 * 
 * Educational Value:
 * - Demonstrates separation of concerns between app configuration and server startup
 * - Shows proper Node.js module import patterns for Express applications
 * - Illustrates clean architecture with reusable application components
 * - Provides foundation for understanding Express.js application lifecycle
 * 
 * @type {express.Application}
 * @see {@link ./app.js} Express application configuration and initialization
 */
const app = require('./app.js');

/**
 * Server Configuration Values
 * 
 * Imports the resolved server configuration values from the centralized config
 * module, including port, host, and environment settings. These values have been
 * processed from environment variables with proper validation and fallback defaults.
 * 
 * Configuration Values:
 * - PORT: Numeric port for server binding (default: 3000, from PORT env var)
 * - HOST: Host address for server binding (default: 'localhost', from HOST env var)
 * - NODE_ENV: Node.js environment setting (default: 'development', from NODE_ENV env var)
 * 
 * Configuration Features:
 * - Environment variable resolution with type conversion and validation
 * - Fallback defaults ensuring server can always start successfully
 * - Production-ready configuration supporting multiple deployment environments
 * - Centralized configuration management for maintainability and clarity
 * 
 * Import Details:
 * - Named exports from config/index.js providing individual configuration values
 * - Values are pre-validated and type-converted for immediate use
 * - Supports development, testing, and production environment configurations
 * - Used directly by server startup and logging operations
 * 
 * Educational Value:
 * - Demonstrates centralized configuration management patterns
 * - Shows proper environment variable handling and validation
 * - Illustrates configuration separation from business logic
 * - Provides examples of production-ready configuration practices
 * 
 * @type {number} PORT - Resolved server port number
 * @type {string} HOST - Resolved server host address
 * @type {string} NODE_ENV - Resolved Node.js environment
 * @see {@link ./config/index.js} Centralized configuration aggregation
 * @see {@link ./config/server.js} Server configuration implementation
 */
const { PORT, HOST, NODE_ENV } = require('./config/index.js');

/**
 * Standardized Logging Functions
 * 
 * Imports the centralized logging utilities providing consistent, timestamped
 * logging with structured output for server startup, operational events, and
 * error conditions. These functions ensure all server lifecycle events are
 * properly logged with standardized formatting.
 * 
 * Logging Functions:
 * - logInfo: Information-level logging for server startup and operational events
 * - logError: Error-level logging for server startup failures and fatal errors
 * 
 * Logging Features:
 * - Standardized timestamp formatting in ISO 8601 UTC format
 * - Application identification and log level classification
 * - Environment-aware colorization for enhanced development experience
 * - Structured metadata support for comprehensive error context
 * - Integration with console output suitable for development and production
 * 
 * Import Details:
 * - Named exports from utils/logger.js providing selective logging functions
 * - Functions are ready for immediate use without additional configuration
 * - Consistent formatting across all application logging operations
 * - Used by server startup, error handling, and operational status reporting
 * 
 * Educational Value:
 * - Demonstrates centralized logging patterns and best practices
 * - Shows proper separation of logging concerns from business logic
 * - Illustrates production-ready observability and monitoring practices
 * - Provides foundation for understanding application logging architecture
 * 
 * @type {Function} logInfo - Information-level logging function
 * @type {Function} logError - Error-level logging function
 * @see {@link ./utils/logger.js} Centralized logging utilities implementation
 */
const { logInfo, logError } = require('./utils/logger.js');

// =============================================================================
// EXTERNAL DEPENDENCIES
// =============================================================================

/**
 * Node.js Process Management
 * 
 * The built-in Node.js process object provides access to environment variables,
 * process exit functionality, and unhandled exception handling capabilities.
 * This is used for graceful error handling and process lifecycle management.
 * 
 * Process Features Used:
 * - process.exit(code) for controlled process termination on fatal errors
 * - process.on() for handling unhandled exceptions and promise rejections
 * - Built-in Node.js global object requiring no import statement
 * 
 * Educational Value:
 * - Demonstrates proper Node.js process management patterns
 * - Shows production-ready error handling and process lifecycle control
 * - Illustrates best practices for server startup and shutdown procedures
 * 
 * @external process
 * @see {@link https://nodejs.org/api/process.html} Node.js Process Documentation
 * @version Node.js v22.x LTS
 */
// Note: process is a Node.js global object and doesn't require explicit import

// =============================================================================
// SERVER STARTUP IMPLEMENTATION
// =============================================================================

/**
 * Start Express HTTP Server
 * 
 * This function starts the Express HTTP server by binding the app instance to the
 * configured port and host. It logs server status, handles startup errors gracefully,
 * and implements comprehensive error handling for all server lifecycle events.
 * 
 * Server Startup Process:
 * 1. Call app.listen(PORT, HOST, callback) to start the HTTP server
 * 2. Log successful startup with server URL and environment information
 * 3. Attach error event listener for startup errors (EADDRINUSE, EACCES, etc.)
 * 4. Handle process-level fatal errors (uncaughtException, unhandledRejection)
 * 5. Exit process with appropriate codes on fatal errors
 * 
 * Error Handling Strategy:
 * - Server startup errors: Log error details and exit with code 1
 * - Port in use (EADDRINUSE): User-friendly message with port information
 * - Permission denied (EACCES): User-friendly message about port permissions
 * - Other errors: Generic error handling with full error logging
 * - Process-level errors: Comprehensive logging and graceful shutdown
 * 
 * Educational Value:
 * - Demonstrates proper Express.js server startup patterns
 * - Shows comprehensive error handling for production environments
 * - Illustrates best practices for server lifecycle management
 * - Provides examples of user-friendly error messaging and logging
 * 
 * Production Features:
 * - Graceful error handling preventing server crashes
 * - Comprehensive logging for debugging and monitoring
 * - User-friendly error messages for common issues
 * - Process-level error handling for maximum reliability
 * 
 * @function startServer
 * @returns {void} Binds Express app to network and manages server lifecycle
 */
function startServer() {
    try {
        // =====================================================================
        // STEP 1: START HTTP SERVER WITH CONFIGURATION
        // =====================================================================
        
        /**
         * Create and Start HTTP Server
         * 
         * Starts the Express HTTP server by calling app.listen() with the resolved
         * configuration values. This binds the Express application to the specified
         * port and host, making it available to receive HTTP requests.
         * 
         * Server Configuration:
         * - PORT: Resolved from environment with fallback to 3000
         * - HOST: Resolved from environment with fallback to 'localhost'
         * - Callback: Executed when server successfully starts listening
         * 
         * Express.js Server Creation:
         * - app.listen() returns an http.Server instance
         * - Server begins accepting connections immediately after binding
         * - Callback indicates successful network binding and readiness
         * 
         * @type {http.Server}
         */
        const server = app.listen(PORT, HOST, () => {
            // =================================================================
            // STEP 2: LOG SUCCESSFUL SERVER STARTUP
            // =================================================================
            
            /**
             * Log Server Startup Success
             * 
             * Logs a comprehensive startup message indicating the server is
             * successfully listening and ready to accept HTTP requests. This
             * provides essential operational visibility and debugging information.
             * 
             * Startup Message Format:
             * "Server listening on http://HOST:PORT (env: NODE_ENV)"
             * 
             * Information Included:
             * - Complete server URL for immediate access and testing
             * - Host and port configuration for debugging and documentation
             * - Environment setting for operational awareness
             * - Timestamp and application identification via logInfo function
             * 
             * Educational Value:
             * - Demonstrates proper server startup logging practices
             * - Shows how to provide useful operational information
             * - Illustrates best practices for server readiness indication
             */
            const serverUrl = `http://${HOST}:${PORT}`;
            logInfo(`Server listening on ${serverUrl} (env: ${NODE_ENV})`);
            logInfo('Press Ctrl+C to stop the server');
        });
        
        // =====================================================================
        // STEP 3: HANDLE SERVER STARTUP ERRORS
        // =====================================================================
        
        /**
         * Server Error Event Handler
         * 
         * Attaches an error event listener to the server instance to handle
         * errors that occur during server startup or operation. This provides
         * comprehensive error handling with user-friendly messages and proper
         * process termination.
         * 
         * Common Server Errors:
         * - EADDRINUSE: Port already in use by another process
         * - EACCES: Permission denied (usually for ports < 1024)
         * - ENOTFOUND: Host resolution failure
         * - Other network-related errors
         * 
         * Error Handling Strategy:
         * - Log detailed error information for debugging
         * - Provide user-friendly error messages for common issues
         * - Exit process with non-zero code to indicate failure
         * - Prevent server from running in an inconsistent state
         * 
         * Educational Value:
         * - Demonstrates proper Node.js event handling patterns
         * - Shows how to handle common server startup errors
         * - Illustrates best practices for error logging and process management
         * - Provides examples of user-friendly error messaging
         */
        server.on('error', (error) => {
            /**
             * Handle Specific Server Error Types
             * 
             * Provides specialized error handling for common server startup
             * errors with user-friendly messages and appropriate logging.
             * Falls back to generic error handling for unknown error types.
             */
            if (error.code === 'EADDRINUSE') {
                // Port already in use error
                const errorMessage = `Port ${PORT} is already in use. Please choose a different port or stop the process using port ${PORT}.`;
                logError('Server startup failed - Port already in use', {
                    error: error.message,
                    port: PORT,
                    host: HOST,
                    code: error.code,
                    suggestion: `Try setting PORT environment variable to a different value (e.g., PORT=3001)`
                });
                logError(errorMessage);
            } else if (error.code === 'EACCES') {
                // Permission denied error (usually for ports < 1024)
                const errorMessage = `Permission denied for port ${PORT}. Ports below 1024 require administrator privileges.`;
                logError('Server startup failed - Permission denied', {
                    error: error.message,
                    port: PORT,
                    host: HOST,
                    code: error.code,
                    suggestion: `Try using a port above 1024 (e.g., PORT=3000) or run with administrator privileges`
                });
                logError(errorMessage);
            } else {
                // Generic error handling for other server errors
                logError('Server startup failed with unexpected error', {
                    error: error.message,
                    stack: error.stack,
                    port: PORT,
                    host: HOST,
                    code: error.code || 'UNKNOWN',
                    errno: error.errno,
                    syscall: error.syscall
                });
                logError(`Failed to start server: ${error.message}`);
            }
            
            /**
             * Exit Process on Server Startup Failure
             * 
             * Terminates the Node.js process with exit code 1 to indicate
             * failure. This prevents the application from running in an
             * inconsistent state and allows process managers to detect
             * startup failures.
             * 
             * Exit Code 1: General error - indicates unsuccessful termination
             * - Standard Unix convention for process failure
             * - Allows process managers (PM2, systemd, etc.) to detect failures
             * - Enables proper error handling in deployment scripts
             * - Prevents application from running in undefined state
             */
            process.exit(1);
        });
        
        // =====================================================================
        // STEP 4: HANDLE PROCESS-LEVEL FATAL ERRORS
        // =====================================================================
        
        /**
         * Uncaught Exception Handler
         * 
         * Handles uncaught exceptions that could crash the Node.js process.
         * While uncaught exceptions should be avoided through proper error
         * handling, this provides a safety net for unexpected errors.
         * 
         * Exception Handling Strategy:
         * - Log comprehensive error information for debugging
         * - Attempt graceful shutdown of the server
         * - Exit process to prevent undefined behavior
         * - Provide educational guidance on proper error handling
         * 
         * Educational Note:
         * Uncaught exceptions indicate programming errors that should be
         * fixed rather than handled here. This handler serves as a safety
         * net and debugging aid, not a solution to poor error handling.
         */
        process.on('uncaughtException', (error) => {
            logError('Uncaught Exception - Process will exit', {
                error: error.message,
                stack: error.stack,
                type: 'uncaughtException',
                timestamp: new Date().toISOString(),
                processInfo: {
                    pid: process.pid,
                    version: process.version,
                    platform: process.platform
                }
            });
            
            logError('Critical Error: Uncaught exception occurred. This indicates a programming error that should be fixed.');
            logError('Process will exit to prevent undefined behavior.');
            
            // Attempt graceful server shutdown if server exists
            if (server && server.listening) {
                server.close(() => {
                    logError('Server closed due to uncaught exception');
                    process.exit(1);
                });
                
                // Force exit if graceful shutdown takes too long
                setTimeout(() => {
                    logError('Forced process exit due to graceful shutdown timeout');
                    process.exit(1);
                }, 5000);
            } else {
                process.exit(1);
            }
        });
        
        /**
         * Unhandled Promise Rejection Handler
         * 
         * Handles promise rejections that are not caught by application code.
         * Express 5 automatically handles promise rejections in middleware,
         * but this provides additional safety for other async operations.
         * 
         * Rejection Handling Strategy:
         * - Log comprehensive rejection information for debugging
         * - Attempt graceful shutdown of the server
         * - Exit process to prevent undefined behavior
         * - Provide educational guidance on proper promise handling
         * 
         * Educational Note:
         * Unhandled promise rejections often indicate missing .catch() handlers
         * or improper async/await error handling. This handler helps identify
         * these issues during development and provides safety in production.
         */
        process.on('unhandledRejection', (reason, promise) => {
            logError('Unhandled Promise Rejection - Process will exit', {
                reason: reason ? reason.toString() : 'Unknown reason',
                stack: reason && reason.stack ? reason.stack : 'No stack trace',
                promise: promise.toString(),
                type: 'unhandledRejection',
                timestamp: new Date().toISOString(),
                processInfo: {
                    pid: process.pid,
                    version: process.version,
                    platform: process.platform
                }
            });
            
            logError('Critical Error: Unhandled promise rejection occurred. This indicates missing error handling in async operations.');
            logError('Process will exit to prevent undefined behavior.');
            
            // Attempt graceful server shutdown if server exists
            if (server && server.listening) {
                server.close(() => {
                    logError('Server closed due to unhandled promise rejection');
                    process.exit(1);
                });
                
                // Force exit if graceful shutdown takes too long
                setTimeout(() => {
                    logError('Forced process exit due to graceful shutdown timeout');
                    process.exit(1);
                }, 5000);
            } else {
                process.exit(1);
            }
        });
        
        /**
         * Graceful Shutdown Signal Handlers
         * 
         * Handles SIGTERM and SIGINT signals for graceful server shutdown.
         * This allows the server to close active connections and clean up
         * resources before terminating the process.
         * 
         * Shutdown Signals:
         * - SIGTERM: Termination signal (sent by process managers)
         * - SIGINT: Interrupt signal (Ctrl+C in terminal)
         * 
         * Graceful Shutdown Process:
         * - Log shutdown initiation
         * - Stop accepting new connections
         * - Close existing connections gracefully
         * - Exit process with success code
         * 
         * Educational Value:
         * - Demonstrates proper signal handling in Node.js applications
         * - Shows best practices for graceful server shutdown
         * - Illustrates production-ready process lifecycle management
         */
        const gracefulShutdown = (signal) => {
            logInfo(`Received ${signal} signal - initiating graceful shutdown`);
            
            server.close((error) => {
                if (error) {
                    logError('Error during server shutdown', {
                        error: error.message,
                        stack: error.stack,
                        signal: signal
                    });
                    process.exit(1);
                } else {
                    logInfo('Server closed successfully');
                    logInfo('Graceful shutdown complete');
                    process.exit(0);
                }
            });
            
            // Force exit if graceful shutdown takes too long
            setTimeout(() => {
                logError('Graceful shutdown timeout - forcing process exit');
                process.exit(1);
            }, 10000);
        };
        
        // Register signal handlers for graceful shutdown
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        
    } catch (startupError) {
        // =====================================================================
        // STEP 5: HANDLE STARTUP EXCEPTION
        // =====================================================================
        
        /**
         * Handle Server Startup Exception
         * 
         * Catches any synchronous errors that occur during server startup
         * and provides comprehensive error logging before terminating the
         * process. This serves as a final safety net for startup failures.
         * 
         * Startup Error Handling:
         * - Log detailed error information for debugging
         * - Provide context about the startup failure
         * - Exit process with appropriate error code
         * - Ensure no partial server initialization remains
         */
        logError('Critical error during server startup', {
            error: startupError.message,
            stack: startupError.stack,
            type: 'startupException',
            config: {
                port: PORT,
                host: HOST,
                env: NODE_ENV
            },
            timestamp: new Date().toISOString()
        });
        
        logError('Server startup failed completely. Please check configuration and try again.');
        process.exit(1);
    }
}

// =============================================================================
// SERVER STARTUP EXECUTION
// =============================================================================

/**
 * Execute Server Startup
 * 
 * Immediately invokes the startServer function to begin the HTTP server
 * startup process. This is the main execution entry point when the file
 * is run directly (e.g., via `node server.js`).
 * 
 * Execution Flow:
 * 1. Import all dependencies and configuration
 * 2. Execute startServer function
 * 3. Server startup process begins immediately
 * 4. Process continues running to handle HTTP requests
 * 5. Error handlers manage any startup or runtime failures
 * 
 * Educational Value:
 * - Demonstrates immediate function execution patterns
 * - Shows proper Node.js application entry point structure
 * - Illustrates server lifecycle management
 * - Provides example of production-ready server startup
 * 
 * Usage Context:
 * - Development: `node server.js`
 * - Production: `NODE_ENV=production PORT=8080 HOST=0.0.0.0 node server.js`
 * - Process Management: Used by PM2, systemd, Docker, etc.
 * - Testing: Imported by test files but startup can be controlled
 */
startServer();

// =============================================================================
// IMPLEMENTATION NOTES AND EDUCATIONAL GUIDANCE
// =============================================================================

/**
 * Implementation Notes for Node.js HTTP Server Architecture
 * 
 * This section provides comprehensive guidance for understanding and extending
 * the HTTP server implementation and architecture patterns demonstrated in this file.
 * 
 * 1. **Separation of Concerns:**
 *    - app.js handles Express application configuration and middleware setup
 *    - server.js handles HTTP server startup, network binding, and process management
 *    - config/ modules handle configuration resolution and environment management
 *    - utils/ modules provide shared utilities like logging and constants
 * 
 * 2. **Error Handling Strategy:**
 *    - Server startup errors are handled gracefully with user-friendly messages
 *    - Process-level errors (uncaught exceptions, unhandled rejections) trigger cleanup
 *    - Graceful shutdown handlers ensure proper resource cleanup on termination
 *    - All errors are logged with comprehensive context for debugging
 * 
 * 3. **Configuration Management:**
 *    - Environment variables provide deployment flexibility
 *    - Fallback defaults ensure server can start in any environment
 *    - Centralized configuration prevents duplication and inconsistency
 *    - Configuration validation happens at startup, not runtime
 * 
 * 4. **Logging and Observability:**
 *    - Standardized logging format with timestamps and structured metadata
 *    - Environment-aware behavior (colorization in development)
 *    - Comprehensive error context for debugging and monitoring
 *    - Integration points for future monitoring and alerting systems
 * 
 * 5. **Production Readiness:**
 *    - Graceful error handling prevents server crashes and undefined behavior
 *    - Signal handlers support proper shutdown in production environments
 *    - Process exit codes enable proper integration with process managers
 *    - Comprehensive logging supports monitoring and debugging
 * 
 * 6. **Educational Objectives:**
 *    - Demonstrates modern Node.js and Express.js development patterns
 *    - Shows best practices for server lifecycle management
 *    - Illustrates production-ready error handling and observability
 *    - Provides foundation for understanding web server architecture
 * 
 * 7. **Express 5 and Node.js v22 Features:**
 *    - Leverages Express 5's automatic promise rejection handling
 *    - Compatible with Node.js v22.x LTS for long-term stability
 *    - Uses modern JavaScript features and error handling patterns
 *    - Demonstrates current industry best practices
 * 
 * 8. **Scalability Considerations:**
 *    - Stateless server design supports horizontal scaling
 *    - Clean separation of concerns enables modular development
 *    - Configuration management supports multi-environment deployment
 *    - Error handling patterns scale to complex distributed systems
 */

/**
 * Extension Guidelines for Future Development
 * 
 * **Adding HTTPS Support:**
 * 1. Import Node.js https and fs modules for certificate handling
 * 2. Add SSL certificate configuration to config modules
 * 3. Create HTTPS server using https.createServer(options, app)
 * 4. Update logging to reflect HTTPS endpoints and security features
 * 
 * **Adding Clustering Support:**
 * 1. Import Node.js cluster module for multi-process management
 * 2. Implement master/worker process logic with proper error handling
 * 3. Add worker process monitoring and automatic restart capabilities
 * 4. Update logging to include process identification and coordination
 * 
 * **Adding Health Checks:**
 * 1. Create health check endpoint in routes (GET /health, /readiness, /liveness)
 * 2. Add server status monitoring and dependency health verification
 * 3. Implement health check response caching and performance optimization
 * 4. Update logging to include health check results and system status
 * 
 * **Adding Metrics and Monitoring:**
 * 1. Integrate application performance monitoring (APM) tools
 * 2. Add custom metrics collection for request rates, response times, errors
 * 3. Implement metrics endpoints for Prometheus or other monitoring systems
 * 4. Add structured logging for log aggregation and analysis tools
 * 
 * **Adding Rate Limiting:**
 * 1. Implement rate limiting middleware at the application level
 * 2. Add rate limiting configuration to centralized config management
 * 3. Integrate rate limiting with logging and monitoring systems
 * 4. Add rate limiting bypass for health checks and monitoring endpoints
 * 
 * **Adding Container Support:**
 * 1. Create Dockerfile with proper Node.js base image and security practices
 * 2. Add container health checks and signal handling for orchestration
 * 3. Optimize container startup time and resource usage
 * 4. Add container-specific logging and monitoring integration
 */

/**
 * Common Issues and Troubleshooting Guide
 * 
 * **Port Already in Use (EADDRINUSE):**
 * - Check for other processes using the port: `lsof -i :3000` (macOS/Linux) or `netstat -ano | findstr :3000` (Windows)
 * - Kill the process using the port or choose a different port
 * - Use PORT environment variable to specify alternative port: `PORT=3001 node server.js`
 * 
 * **Permission Denied (EACCES):**
 * - Ports below 1024 require administrator privileges on Unix systems
 * - Use a port above 1024 for development: `PORT=3000 node server.js`
 * - For production deployment on port 80/443, use reverse proxy or process manager
 * 
 * **Server Not Responding:**
 * - Verify server startup logs for successful binding message
 * - Check firewall settings and network connectivity
 * - Ensure HOST configuration allows external connections (0.0.0.0 for all interfaces)
 * - Verify application routes are properly configured and mounted
 * 
 * **Memory Leaks and Performance Issues:**
 * - Monitor process memory usage and garbage collection patterns
 * - Use Node.js profiling tools (--inspect flag) for performance analysis
 * - Check for unhandled promise rejections and event listener leaks
 * - Implement proper error handling and resource cleanup
 * 
 * **Configuration Problems:**
 * - Verify environment variables are properly set and accessible
 * - Check configuration validation and fallback behavior in config modules
 * - Review server startup logs for configuration warnings and errors
 * - Test configuration in different environments (development, staging, production)
 */