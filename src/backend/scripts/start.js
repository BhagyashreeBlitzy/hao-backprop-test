// External imports
const process = require('process'); // Node.js 18+ - Access process-level events for error handling and clean shutdown

// Internal imports
const { startServer } = require('../server.js'); // Main server startup logic that binds the Express app to the configured port and host
const { logger } = require('../utils/logger.js'); // Centralized logger utility for logging fatal process-level errors to the console

/**
 * Node.js Tutorial Backend Server Entry Point
 * 
 * This script serves as the canonical entry point for starting the backend server
 * in development, production, or test environments. It ensures that the server is
 * started in a controlled, observable, and maintainable way, following production-ready
 * patterns for educational and real-world Node.js/Express.js applications.
 * 
 * Key Responsibilities:
 * - Register process-level error handlers for uncaught exceptions and unhandled rejections
 * - Delegate actual server startup to server.js for separation of concerns and testability
 * - Log fatal errors and ensure clean process exit with appropriate exit codes
 * - Prevent silent failures and provide operational transparency
 * - Support process managers, containerization, and CI/CD pipelines
 * 
 * Architecture Pattern:
 * This follows the Script Entry Point pattern with clean separation between script
 * execution and server lifecycle management. The script focuses on process-level
 * concerns while delegating server logic to dedicated modules.
 * 
 * Production Readiness Features:
 * - Process-level error handling with comprehensive logging
 * - Clean exit codes for monitoring and process management
 * - Operational transparency through detailed error logging
 * - Support for npm scripts, nodemon, Docker CMD, and process managers
 * - Educational clarity with extensive documentation
 * 
 * Educational Value:
 * Demonstrates best practices for Node.js application entry points, process management,
 * error handling patterns, and separation of concerns suitable for both learning
 * environments and production deployments.
 */

// Global flag to ensure process error handlers are registered only once
// This prevents duplicate event listener registration during testing or module reloading
let isProcessErrorHandlerRegistered = false;

/**
 * Registers process-level error handlers for uncaught exceptions and unhandled promise rejections.
 * 
 * This function implements comprehensive process-level error handling to ensure that
 * all fatal errors are properly logged and the process exits cleanly, preventing
 * silent failures and providing operational transparency for monitoring and debugging.
 * 
 * Process Events Handled:
 * - uncaughtException: Catches synchronous errors that escape application error handling
 * - unhandledRejection: Catches rejected promises that aren't handled by application code
 * 
 * Error Handling Strategy:
 * - Log comprehensive error details with context and stack traces
 * - Provide operational information for troubleshooting and monitoring
 * - Exit with non-zero exit code (1) to indicate failure to process managers
 * - Prevent duplicate handler registration with global flag
 * - Ensure clean shutdown without hanging processes
 * 
 * Safety Features:
 * - One-time registration protection with isProcessErrorHandlerRegistered flag
 * - Immediate process exit to prevent undefined behavior after fatal errors
 * - Comprehensive logging for post-mortem analysis and debugging
 * - Process information logging for operational context
 * 
 * @returns {void} Sets up process event listeners for fatal error handling
 */
function registerProcessErrorHandlers() {
    // Check if process error handlers are already registered
    if (isProcessErrorHandlerRegistered) {
        logger.info('Process error handlers already registered - skipping duplicate registration', {
            processId: process.pid,
            alreadyRegistered: true
        });
        return;
    }
    
    logger.info('Registering process-level error handlers for startup safety', {
        processId: process.pid,
        nodeVersion: process.version,
        platform: process.platform,
        handlers: ['uncaughtException', 'unhandledRejection'],
        purpose: 'startup error handling'
    });
    
    // Handle uncaught exceptions
    // These are synchronous errors that escape application error handling
    process.on('uncaughtException', (error) => {
        logger.error('Uncaught exception during server startup - process will exit', {
            error: error.message,
            errorName: error.name,
            errorStack: error.stack,
            processId: process.pid,
            timestamp: new Date().toISOString(),
            eventType: 'uncaughtException',
            phase: 'startup',
            nodeVersion: process.version,
            platform: process.platform
        });
        
        // Log additional process context for debugging
        logger.error('Process context at time of uncaught exception', {
            memoryUsage: process.memoryUsage(),
            uptime: process.uptime(),
            cwd: process.cwd(),
            argv: process.argv.slice(0, 3), // Log first 3 args to avoid sensitive data
            env: process.env.NODE_ENV || 'not set'
        });
        
        // Exit immediately with error code 1 to indicate failure
        // This prevents undefined behavior and ensures process managers are notified
        process.exit(1);
    });
    
    // Handle unhandled promise rejections
    // These are rejected promises that aren't caught by application code
    process.on('unhandledRejection', (reason, promise) => {
        logger.error('Unhandled promise rejection during server startup - process will exit', {
            reason: reason instanceof Error ? reason.message : String(reason),
            reasonName: reason instanceof Error ? reason.name : 'Unknown',
            reasonStack: reason instanceof Error ? reason.stack : undefined,
            promise: promise.toString(),
            processId: process.pid,
            timestamp: new Date().toISOString(),
            eventType: 'unhandledRejection',
            phase: 'startup',
            nodeVersion: process.version,
            platform: process.platform
        });
        
        // Log additional process context for debugging
        logger.error('Process context at time of unhandled rejection', {
            memoryUsage: process.memoryUsage(),
            uptime: process.uptime(),
            cwd: process.cwd(),
            env: process.env.NODE_ENV || 'not set'
        });
        
        // Exit immediately with error code 1 to indicate failure
        // This prevents undefined behavior and ensures process managers are notified
        process.exit(1);
    });
    
    // Mark handlers as registered to prevent duplicate registration
    isProcessErrorHandlerRegistered = true;
    
    logger.info('Process error handlers registered successfully', {
        processId: process.pid,
        registered: true,
        handlers: ['uncaughtException', 'unhandledRejection'],
        protection: 'enabled'
    });
}

/**
 * Main execution flow for the server startup script.
 * 
 * This function coordinates the server startup process with proper error handling:
 * 1. Registers process-level error handlers for startup safety
 * 2. Invokes the main server startup logic from server.js
 * 3. Handles any synchronous errors during startup
 * 4. Provides operational logging for monitoring and debugging
 * 
 * Error Handling:
 * - Process-level errors are handled by registered event handlers
 * - Synchronous startup errors are caught and logged with context
 * - All errors result in process exit with appropriate exit codes
 * - Comprehensive logging ensures troubleshooting information is available
 * 
 * @returns {void} Initiates server startup with comprehensive error handling
 */
function main() {
    logger.info('Starting Node.js tutorial backend server', {
        processId: process.pid,
        nodeVersion: process.version,
        platform: process.platform,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        scriptPath: __filename,
        cwd: process.cwd()
    });
    
    try {
        // Register process-level error handlers before server startup
        // This ensures any startup errors are properly caught and logged
        registerProcessErrorHandlers();
        
        // Invoke the main server startup logic
        // This delegates to server.js for the actual HTTP server initialization
        logger.info('Invoking server startup logic', {
            delegateTo: 'server.js',
            function: 'startServer',
            processId: process.pid
        });
        
        startServer();
        
        logger.info('Server startup initiated successfully', {
            processId: process.pid,
            timestamp: new Date().toISOString(),
            status: 'startup_initiated'
        });
        
    } catch (error) {
        // Handle any synchronous errors during startup
        logger.error('Fatal error during server startup process', {
            error: error.message,
            errorName: error.name,
            errorStack: error.stack,
            processId: process.pid,
            timestamp: new Date().toISOString(),
            phase: 'startup',
            nodeVersion: process.version,
            platform: process.platform
        });
        
        // Log additional context for debugging
        logger.error('Startup failure context', {
            memoryUsage: process.memoryUsage(),
            uptime: process.uptime(),
            cwd: process.cwd(),
            environment: process.env.NODE_ENV || 'not set',
            scriptPath: __filename
        });
        
        // Exit with error code 1 to indicate startup failure
        process.exit(1);
    }
}

// Execute main startup function
// This is the entry point that begins the server startup process
main();