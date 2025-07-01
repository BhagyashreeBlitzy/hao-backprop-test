/**
 * Script Entry Point for Node.js Hello World Tutorial Backend Server
 * 
 * This script serves as the canonical entry point for starting the backend HTTP server process.
 * It loads environment configuration, initializes logging, and invokes the main server startup
 * logic with comprehensive error handling and process exit semantics.
 * 
 * Designed to be robust, observable, and environment-aware, this script ensures the server
 * starts reliably in development, production, and test environments. It supports both direct
 * execution via Node.js and programmatic invocation for testing scenarios.
 * 
 * Features:
 * - Environment-aware server startup with configuration loading
 * - Centralized error handling with structured logging
 * - Process exit management with appropriate exit codes
 * - Startup banner logging with environment context
 * - Support for npm start and direct Node.js execution
 * - Testable architecture with exported main function
 * - Observable server lifecycle with comprehensive logging
 * 
 * Usage:
 * - Direct execution: node src/backend/scripts/start.js
 * - NPM script: npm start (configured in package.json)
 * - Programmatic: const { main } = require('./src/backend/scripts/start.js'); main();
 * - Testing: Import main function for test harness integration
 * 
 * Error Handling:
 * - Startup errors are logged with Logger.error and result in process.exit(1)
 * - Server startup failures are handled by server.js with appropriate error codes
 * - Uncaught exceptions during startup are logged with full context
 * - Process exits with non-zero code on fatal errors for CI/CD compatibility
 * 
 * Environment Support:
 * - Development: Full logging with startup details and environment information
 * - Production: Essential logging with performance metrics
 * - Test: Suppressed logging to reduce test output noise
 * - Platform-agnostic: Compatible with local development and cloud deployment
 * 
 * @fileoverview Canonical entry point for backend server startup with robust error handling
 * @author Node.js Tutorial Team
 * @version 1.0.0
 * @since Node.js 18+
 * @requires express@5.1.0
 */

// Internal Dependencies - Server startup and configuration
const { startServer } = require('../server.js'); // Main function to start the Express HTTP server
const { env } = require('../config/env.js'); // Current runtime environment for logging context
const { Logger } = require('../utils/logger.js'); // Centralized logging utility for structured output

// External Dependencies - Node.js Built-in Modules
// Node.js 18+ - Built-in process module for environment variables and process management
const process = require('process');

/**
 * Main entry point function for starting the backend server process
 * 
 * This function orchestrates the complete server startup sequence, including logging
 * startup intent, invoking the server initialization logic, and handling any errors
 * that occur during the startup process. It ensures robust error handling with
 * appropriate logging and process exit codes.
 * 
 * The startup sequence includes:
 * 1. Log startup banner with environment context and process information
 * 2. Invoke startServer() to initialize the Express HTTP server
 * 3. Handle successful startup (server handles its own success logging)
 * 4. Catch and handle any startup errors with comprehensive error logging
 * 5. Exit process with appropriate code (0 for success, 1 for failure)
 * 
 * Error Handling Strategy:
 * - Catches all errors thrown during server startup process
 * - Logs errors with full context including stack traces and environment info
 * - Exits with code 1 to signal failure to process managers and CI/CD systems
 * - Ensures no unhandled promise rejections or uncaught exceptions
 * 
 * Logging Strategy:
 * - Environment-aware logging using centralized Logger utility
 * - Startup banner includes process metadata for troubleshooting
 * - Error logs include comprehensive context for debugging
 * - Structured logging format compatible with log aggregation systems
 * 
 * @async
 * @function main
 * @returns {Promise<void>} Resolves when server starts successfully, rejects on startup failure
 * @throws {Error} Throws startup errors that are caught and handled internally
 * 
 * @example
 * // Direct invocation for server startup
 * main().then(() => {
 *     console.log('Server startup completed');
 * }).catch((error) => {
 *     console.error('Server startup failed:', error);
 * });
 * 
 * @example
 * // Testing usage
 * const { main } = require('./start.js');
 * await main(); // Server starts and can be tested
 */
async function main() {
    try {
        // Step 1: Log startup banner with environment context and process information
        Logger.info(`Starting Node.js Hello World Tutorial Backend Server`, {
            environment: env,
            nodeVersion: process.version,
            platform: process.platform,
            architecture: process.arch,
            processId: process.pid,
            timestamp: new Date().toISOString(),
            startupIntent: 'Initializing HTTP server with Express.js framework'
        });
        
        // Log additional startup context for comprehensive observability
        Logger.info(`Backend server initialization commenced`, {
            workingDirectory: process.cwd(),
            memoryUsage: process.memoryUsage(),
            uptime: process.uptime(),
            environmentVariables: {
                nodeEnv: process.env.NODE_ENV,
                port: process.env.PORT,
                host: process.env.HOST
            }
        });
        
        // Step 2: Invoke startServer() to start the Express HTTP server
        // The startServer() function handles:
        // - Express app.listen() with port and host configuration
        // - Server startup success logging with comprehensive details
        // - Server error event handling for fatal startup errors
        // - Process signal handling for graceful shutdown (SIGINT, SIGTERM)
        Logger.info(`Invoking server startup logic`, {
            serverModule: '../server.js',
            startupFunction: 'startServer',
            expectedBehavior: 'Express HTTP server initialization with error handling'
        });
        
        // Call startServer() which returns the HTTP server instance
        // Server startup success/failure is handled within server.js
        // This function delegates all server logic to the server module
        const server = startServer();
        
        // Step 3: Log successful startup orchestration completion
        // Note: Detailed server startup logging is handled by server.js
        Logger.info(`Server startup orchestration completed successfully`, {
            serverInstance: 'HTTP server instance created and configured',
            serverModule: 'server.js',
            signalHandlers: 'Process signal handlers attached for graceful shutdown',
            readiness: 'Backend server ready to accept HTTP requests'
        });
        
        // Return void - server continues running until process termination
        // The server instance lifecycle is managed by server.js
        return;
        
    } catch (error) {
        // Step 4: Catch and handle any startup errors with comprehensive logging
        Logger.error(`Fatal error occurred during backend server startup`, {
            errorName: error.name,
            errorMessage: error.message,
            errorStack: error.stack,
            errorCode: error.code || 'UNKNOWN_STARTUP_ERROR',
            environment: env,
            processId: process.pid,
            timestamp: new Date().toISOString(),
            startupPhase: 'Server initialization',
            recoveryAction: 'Process will exit with non-zero code'
        });
        
        // Log additional context for troubleshooting startup failures
        Logger.error(`Server startup context at time of failure`, {
            nodeVersion: process.version,
            platform: process.platform,
            workingDirectory: process.cwd(),
            memoryUsage: process.memoryUsage(),
            environmentVariables: {
                nodeEnv: process.env.NODE_ENV || 'undefined',
                port: process.env.PORT || 'undefined',
                host: process.env.HOST || 'undefined'
            },
            errorAnalysis: {
                possibleCauses: [
                    'Port already in use (EADDRINUSE)',
                    'Insufficient permissions (EACCES)',
                    'Invalid configuration values',
                    'Missing dependencies or imports',
                    'System resource limitations'
                ],
                troubleshootingSteps: [
                    'Check if port is available',
                    'Verify environment variables',
                    'Ensure Node.js version >= 18',
                    'Validate Express.js installation',
                    'Review server.js configuration'
                ]
            }
        });
        
        // Step 5: Exit process with code 1 to signal startup failure
        // This ensures proper error handling for process managers, Docker, and CI/CD
        Logger.error(`Exiting process due to fatal startup error`, {
            exitCode: 1,
            reason: 'Backend server startup failed',
            timestamp: new Date().toISOString()
        });
        
        // Exit with non-zero code to indicate failure
        process.exit(1);
    }
}

// Global Entry Point - Direct Execution Detection
// Check if this script is being run directly (not imported as a module)
// This pattern allows the script to be both executable and testable
if (require.main === module) {
    // Script is being executed directly via Node.js or npm start
    Logger.info(`Backend server startup script invoked directly`, {
        executionMode: 'direct',
        scriptPath: __filename,
        commandLineArgs: process.argv,
        invocationMethod: 'Direct Node.js execution or npm script'
    });
    
    // Call main() function to start the server
    // Use IIFE (Immediately Invoked Function Expression) to handle async main()
    (async () => {
        try {
            await main();
        } catch (error) {
            // This catch block handles errors from the main() function
            // Most errors are handled within main(), but this provides additional safety
            Logger.error(`Unhandled error in main execution`, {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            process.exit(1);
        }
    })();
} else {
    // Script is being imported as a module (e.g., for testing)
    Logger.debug(`Backend server startup script imported as module`, {
        executionMode: 'imported',
        parentModule: require.main?.filename || 'unknown',
        importContext: 'Module imported for programmatic use or testing'
    });
}

/**
 * Named exports for the startup script module
 * 
 * Exports the main function for programmatic invocation, testing scenarios,
 * and integration with other scripts or modules that need to start the server.
 * 
 * Export Structure:
 * - main: Async function that starts the backend server with full error handling
 * 
 * Integration Patterns:
 * ```javascript
 * // Testing usage
 * const { main } = require('./src/backend/scripts/start.js');
 * await main(); // Start server for testing
 * ```
 * 
 * ```javascript
 * // Custom orchestration
 * const { main } = require('./src/backend/scripts/start.js');
 * try {
 *     await main();
 *     console.log('Server started successfully');
 * } catch (error) {
 *     console.error('Startup failed:', error);
 * }
 * ```
 * 
 * Main Function Capabilities:
 * - Complete server startup orchestration with error handling
 * - Environment-aware logging throughout startup process
 * - Graceful error handling with structured logging
 * - Process exit management with appropriate exit codes
 * - Integration with server.js for actual HTTP server management
 * - Comprehensive startup context logging for troubleshooting
 * 
 * @exports main
 */
module.exports = {
    /**
     * Main entry point function for backend server startup
     * 
     * Orchestrates the complete server startup sequence including environment
     * configuration loading, logging initialization, server startup invocation,
     * and comprehensive error handling. Designed for both direct execution
     * and programmatic invocation in testing scenarios.
     * 
     * @type {function}
     * @async
     * @returns {Promise<void>} Promise that resolves on successful startup
     */
    main
};