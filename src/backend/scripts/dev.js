// External imports
const process = require('process'); // Node.js 18+ - Access environment variables, handle process-level events (uncaughtException, unhandledRejection), and manage process exit codes

// Internal imports
const { startServer } = require('../server.js'); // Invokes the main server startup logic, which binds the Express app to the configured port and host, and handles lifecycle events
const { logger } = require('../utils/logger.js'); // Provides standardized logging for startup, environment, and error events in development mode

/**
 * Development Script Entry Point for Node.js Tutorial Backend
 * 
 * This script serves as the primary development entry point for the Node.js tutorial
 * backend application, designed to be executed by nodemon (or directly via npm run dev)
 * to start the backend server in development mode. It implements development workflow
 * automation, ensuring the correct environment is set, invoking the main server startup
 * logic, and providing developer-friendly logging and error handling.
 * 
 * Key Responsibilities:
 * - Ensures NODE_ENV is set to 'development' for proper development configuration
 * - Provides clear, developer-friendly console output for server startup and errors
 * - Invokes the main server startup logic with development-specific initialization
 * - Handles uncaught exceptions and unhandled promise rejections for developer feedback
 * - Maintains strict separation from production startup logic for clarity and maintainability
 * 
 * Educational Focus:
 * This script is intentionally simple and focused on development ergonomics, demonstrating
 * best practices for Node.js development workflows while maintaining educational clarity.
 * It relies on nodemon.json for file watching and hot-reload configuration, with all
 * application logic, routing, and middleware handled by app.js and server.js.
 * 
 * Development Workflow Integration:
 * - Executed by nodemon via 'npm run dev' for hot-reload development
 * - Provides rapid feedback for developers with clear startup and error logging
 * - Ensures consistent development environment setup across different machines
 * - Supports development-only features and enhanced logging for debugging
 * 
 * Production Separation:
 * This script is not intended for production use; production startup is handled by
 * scripts/start.js to maintain clear separation between development and production
 * startup logic for security, performance, and maintainability.
 */

// Global constants for development environment configuration
const DEV_ENV = "development";

/**
 * Ensures the NODE_ENV environment variable is set to 'development' for the current process.
 * 
 * This function implements development environment validation and configuration, ensuring
 * that the application runs with proper development settings. It checks if NODE_ENV is
 * already set and handles three scenarios: not set, set to 'development', or set to a
 * different value. Provides appropriate logging for each scenario to give developers
 * clear visibility into environment configuration.
 * 
 * Environment Handling Strategy:
 * 1. If NODE_ENV is not set: Sets to 'development' and logs informational message
 * 2. If NODE_ENV is 'development': No action needed, continues silently
 * 3. If NODE_ENV is set to other value: Logs warning and overwrites with 'development'
 * 
 * This approach ensures consistent development environment regardless of how the script
 * is invoked, while providing clear feedback about any environment changes made.
 * 
 * Educational Value:
 * Demonstrates proper environment variable management, conditional logic, and logging
 * practices for Node.js applications, showing how to handle configuration edge cases.
 * 
 * @returns {void} Side effect: sets process.env.NODE_ENV to 'development' if not already set
 */
function setDevelopmentEnv() {
    // Check current NODE_ENV value
    const currentEnv = process.env.NODE_ENV;
    
    if (!currentEnv) {
        // NODE_ENV is not set, assign development value
        process.env.NODE_ENV = DEV_ENV;
        logger.info('Environment variable NODE_ENV was not set, initialized to development mode', {
            previousValue: 'undefined',
            newValue: DEV_ENV,
            setBy: 'development script',
            timestamp: new Date().toISOString()
        });
    } else if (currentEnv !== DEV_ENV) {
        // NODE_ENV is set to a different value, log warning and overwrite
        logger.warn('Environment variable NODE_ENV was set to different value, overriding for development mode', {
            previousValue: currentEnv,
            newValue: DEV_ENV,
            action: 'environment_override',
            reason: 'development script execution',
            timestamp: new Date().toISOString()
        });
        process.env.NODE_ENV = DEV_ENV;
    }
    // If currentEnv === DEV_ENV, no action needed - already in development mode
}

/**
 * Main entry point for the development script.
 * 
 * This function orchestrates the complete development server startup process, implementing
 * the core requirements for development workflow automation. It sets the environment,
 * logs startup information, invokes the server startup logic, and establishes comprehensive
 * error handling for developer feedback and debugging support.
 * 
 * Startup Process Flow:
 * 1. Environment Configuration: Ensures NODE_ENV is set to 'development'
 * 2. Startup Logging: Provides clear indication that development server is starting
 * 3. Server Initialization: Invokes the main server startup logic from server.js
 * 4. Error Handling Setup: Establishes process-level error handlers for development feedback
 * 
 * Error Handling Strategy:
 * - Catches uncaught exceptions and provides detailed logging for debugging
 * - Handles unhandled promise rejections to prevent silent failures
 * - Exits with appropriate error codes for process management and monitoring
 * - Provides developer-friendly error messages with context and troubleshooting hints
 * 
 * Development Features:
 * - Enhanced logging for development visibility and debugging
 * - Graceful error handling that doesn't crash the development workflow
 * - Integration with nodemon for hot-reload and file watching
 * - Clear separation from production startup logic
 * 
 * Educational Demonstration:
 * Shows proper process management, error handling patterns, logging practices,
 * and development workflow integration for Node.js applications.
 * 
 * @returns {void} Side effect: starts the server and logs status/errors to the console
 */
function main() {
    // Step 1: Ensure development environment is properly configured
    setDevelopmentEnv();
    
    // Step 2: Log development server startup initiation
    logger.info('Starting Node.js tutorial backend server in development mode', {
        environment: process.env.NODE_ENV,
        script: 'development entry point',
        processId: process.pid,
        nodeVersion: process.version,
        platform: process.platform,
        timestamp: new Date().toISOString(),
        developmentFeatures: {
            hotReload: 'enabled via nodemon',
            enhancedLogging: 'enabled',
            errorHandling: 'developer-friendly'
        }
    });
    
    // Step 3: Invoke the main server startup logic
    // This delegates to server.js which handles Express app creation, port binding,
    // middleware setup, route registration, and server lifecycle management
    try {
        logger.info('Invoking main server startup logic for development environment', {
            serverModule: '../server.js',
            startupFunction: 'startServer',
            environment: 'development'
        });
        
        // Call the main server startup function from server.js
        // This function handles all Express configuration, port binding, and server startup
        startServer();
        
    } catch (error) {
        // Handle any synchronous errors during server startup invocation
        logger.error('Failed to invoke server startup logic in development script', {
            error: error.message,
            errorStack: error.stack,
            errorName: error.name,
            function: 'startServer',
            module: '../server.js',
            environment: process.env.NODE_ENV,
            troubleshooting: 'Check server.js for configuration issues or dependency problems'
        });
        
        // Exit with error code to indicate startup failure
        process.exit(1);
    }
    
    // Step 4: Set up process-level error handlers for development feedback
    // These handlers provide comprehensive error logging and graceful error management
    // specifically tailored for development workflow and debugging support
    
    // Handle uncaught exceptions - synchronous errors that bubble to process level
    process.on('uncaughtException', (error) => {
        logger.error('Uncaught exception in development server - process will exit for safety', {
            error: error.message,
            errorStack: error.stack,
            errorName: error.name,
            errorCode: error.code,
            processId: process.pid,
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString(),
            eventType: 'uncaughtException',
            developmentNote: 'This error was caught to prevent silent failures during development',
            troubleshooting: 'Review the stack trace above to identify the source of the uncaught exception',
            restartAction: 'Nodemon will automatically restart the server after fixing the error'
        });
        
        // Log additional debugging context for development
        logger.error('Development server context at time of uncaught exception', {
            memoryUsage: process.memoryUsage(),
            uptime: `${process.uptime()} seconds`,
            workingDirectory: process.cwd(),
            arguments: process.argv,
            environmentVariables: {
                NODE_ENV: process.env.NODE_ENV,
                PORT: process.env.PORT,
                HOST: process.env.HOST
            }
        });
        
        // Exit with error code - nodemon will restart automatically
        process.exit(1);
    });
    
    // Handle unhandled promise rejections - async errors not caught by application code
    process.on('unhandledRejection', (reason, promise) => {
        logger.error('Unhandled promise rejection in development server - process will exit for safety', {
            reason: reason instanceof Error ? reason.message : String(reason),
            reasonStack: reason instanceof Error ? reason.stack : undefined,
            reasonType: typeof reason,
            promise: promise.toString(),
            processId: process.pid,
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString(),
            eventType: 'unhandledRejection',
            developmentNote: 'This rejection was caught to prevent silent failures during development',
            troubleshooting: 'Add proper .catch() handlers to promises or use try-catch in async functions',
            restartAction: 'Nodemon will automatically restart the server after fixing the error'
        });
        
        // Log additional debugging context for development
        logger.error('Development server context at time of unhandled rejection', {
            memoryUsage: process.memoryUsage(),
            uptime: `${process.uptime()} seconds`,
            environment: process.env.NODE_ENV,
            nodeVersion: process.version
        });
        
        // Exit with error code - nodemon will restart automatically
        process.exit(1);
    });
    
    // Log successful error handler setup
    logger.info('Development error handlers registered successfully', {
        handlers: ['uncaughtException', 'unhandledRejection'],
        purpose: 'developer feedback and debugging support',
        behavior: 'log errors and exit for nodemon restart',
        environment: 'development only'
    });
    
    // Note: SIGINT and SIGTERM handling is managed by server.js for graceful shutdown
    // This maintains separation of concerns between development startup and server lifecycle
    logger.info('Development server startup completed, delegating lifecycle management to server.js', {
        lifecycleEvents: 'SIGINT, SIGTERM handled by server.js',
        errorEvents: 'uncaughtException, unhandledRejection handled by development script',
        hotReload: 'nodemon file watching active',
        restartTrigger: 'file changes will trigger automatic restart'
    });
}

// Execute main development script function
// This starts the entire development server initialization process
main();