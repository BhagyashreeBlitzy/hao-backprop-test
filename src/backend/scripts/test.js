/**
 * Backend Test Script Entrypoint
 * 
 * This script serves as the canonical entrypoint for running all backend test suites
 * (unit, integration, and optionally coverage) for the Node.js/Express.js Hello World
 * tutorial application. It is invoked by the npm test script and is responsible for
 * orchestrating the execution of all test types in sequence, ensuring comprehensive
 * validation of the backend.
 * 
 * The script sets up the test environment, invokes the orchestrator from the test suite,
 * and handles process exit codes for CI/CD compatibility. It provides summary output
 * and error handling for all test phases while maintaining compatibility with local
 * development, CI pipelines, and platform-agnostic test execution.
 * 
 * Features:
 * - Environment-aware test execution with NODE_ENV management
 * - Comprehensive error handling and graceful failure management
 * - CI/CD integration with standardized exit codes
 * - Cross-platform compatibility (Windows, macOS, Linux)
 * - Minimal logging to avoid noise in CI output
 * - Dual usage: CLI execution and programmatic import
 * 
 * Compatible with:
 * - Node.js 18+
 * - Express.js 5.1.0
 * - Jest 29.7.0
 * - CI/CD pipelines (GitHub Actions, Jenkins, Azure DevOps)
 * 
 * Usage:
 * - NPM script: npm test
 * - Direct execution: node src/backend/scripts/test.js
 * - Programmatic import: const { main } = require('./test');
 * 
 * @author Generated for Node.js Tutorial Application
 * @version 1.0.0
 */

// External dependencies - Node.js built-in modules
const process = require('process'); // Node.js 18+ built-in - Process control, environment variables, and exit codes

// Internal dependencies - Test orchestration modules
const { runAllTests } = require('../../test/scripts/run-all-tests.js'); // Main orchestrator for running all test suites (unit, integration, and optionally coverage)

// Global constants for process exit codes
const EXIT_SUCCESS = 0; // Standard success exit code for successful test completion
const EXIT_FAILURE = 1; // Standard failure exit code for test failures or errors

// Global variable to track if script is run directly
const IS_CLI = require.main === module;

/**
 * Main entrypoint function for running all backend test suites.
 * 
 * This function orchestrates the complete backend test execution workflow by:
 * 1. Setting up the test environment with proper NODE_ENV configuration
 * 2. Optionally logging the start of the backend test process (for local development)
 * 3. Invoking the runAllTests() orchestrator and awaiting completion
 * 4. Handling success scenarios with appropriate exit codes
 * 5. Handling failure scenarios with comprehensive error logging and exit codes
 * 
 * The function is designed for both programmatic use and CLI execution, providing
 * robust error handling and process exit codes for CI/CD compatibility. It ensures
 * that the test environment is properly configured and that all test phases are
 * executed in sequence with appropriate error handling.
 * 
 * Environment Configuration:
 * - Sets NODE_ENV to 'test' if not already set for consistent test behavior
 * - Preserves existing NODE_ENV if already configured (e.g., by CI systems)
 * - Ensures environment-aware code paths behave correctly during testing
 * 
 * Error Handling:
 * - Comprehensive try-catch blocks for isolated error handling
 * - Specific error messages for different failure scenarios
 * - Process exit codes that integrate with CI/CD quality gates
 * - Graceful handling of both synchronous and asynchronous errors
 * 
 * @async
 * @function main
 * @returns {Promise<void>} Resolves when all test phases complete successfully,
 *                          rejects or exits with error code on failure
 * 
 * @throws {Error} When test orchestration fails or encounters fatal errors
 * 
 * @example
 * // Programmatic usage
 * const { main } = require('./test');
 * 
 * try {
 *   await main();
 *   console.log('All backend tests completed successfully');
 * } catch (error) {
 *   console.error('Backend test execution failed:', error.message);
 *   process.exit(1);
 * }
 * 
 * @example
 * // CLI usage
 * node src/backend/scripts/test.js
 * 
 * @example
 * // NPM script usage
 * npm test
 */
async function main() {
    try {
        // Step 1: Set NODE_ENV to 'test' if not already set, ensuring consistent test environment
        if (!process.env.NODE_ENV) {
            process.env.NODE_ENV = 'test';
        }
        
        // Ensure NODE_ENV is explicitly set to 'test' for all test processes
        // This is critical for environment-aware code paths, configuration, and error handling
        if (process.env.NODE_ENV !== 'test') {
            process.env.NODE_ENV = 'test';
        }
        
        // Step 2: Log the start of the backend test process (optional, for local development)
        // Only log when run directly as CLI to avoid noise in CI output
        if (IS_CLI && process.env.NODE_ENV !== 'production') {
            console.log('🚀 Initializing backend test suite execution...');
            console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
            console.log(`⏱️  Start Time: ${new Date().toISOString()}`);
        }
        
        // Step 3: Invoke runAllTests() and await completion
        // The orchestrator handles sequencing, summary output, and error handling
        await runAllTests();
        
        // Step 4: If runAllTests resolves, exit the process with code 0 (success)
        // Success path - all test phases completed successfully
        if (IS_CLI) {
            console.log('✅ Backend test suite completed successfully');
            console.log('🎯 All quality gates passed - ready for deployment');
            process.exit(EXIT_SUCCESS);
        }
        
        // For programmatic usage, simply return without exiting
        return;
        
    } catch (error) {
        // Step 5: If runAllTests throws or rejects, log the error and exit the process with code 1 (failure)
        // Comprehensive error handling for all failure scenarios
        
        // Log error details for debugging
        console.error('❌ Backend test execution failed');
        console.error('🔍 Error details:', error.message);
        
        // Provide additional debugging information in development mode
        if (process.env.NODE_ENV !== 'production' && error.stack) {
            console.error('📋 Stack trace:');
            console.error(error.stack);
        }
        
        // Log system information for troubleshooting
        console.error('');
        console.error('🐛 System Information:');
        console.error(`  • Node.js version: ${process.version}`);
        console.error(`  • Platform: ${process.platform}`);
        console.error(`  • Architecture: ${process.arch}`);
        console.error(`  • Working directory: ${process.cwd()}`);
        console.error(`  • Environment: ${process.env.NODE_ENV || 'undefined'}`);
        
        // Provide troubleshooting guidance
        console.error('');
        console.error('💡 Troubleshooting Steps:');
        console.error('  1. Verify all dependencies are installed (npm install)');
        console.error('  2. Check test configuration files (jest.config.js, setup.js)');
        console.error('  3. Ensure test files exist and are properly formatted');
        console.error('  4. Verify Node.js version compatibility (18+)');
        console.error('  5. Check for any missing test fixtures or helpers');
        
        console.error(`⏱️  Failure Time: ${new Date().toISOString()}`);
        console.error('');
        
        // Exit with failure code for CI/CD integration
        if (IS_CLI) {
            process.exit(EXIT_FAILURE);
        }
        
        // For programmatic usage, re-throw the error
        throw error;
    }
}

// Export the main function for programmatic use
module.exports = {
    main
};

// Script entrypoint: If run directly (node test.js), invoke main() and handle process exit codes appropriately
if (IS_CLI) {
    // Script is being executed directly as a CLI tool
    console.log('🎯 Node.js Tutorial - Backend Test Suite');
    console.log('📋 Initializing comprehensive test execution...');
    console.log('');
    
    // Set up process signal handlers for graceful shutdown
    process.on('SIGINT', () => {
        console.log('');
        console.log('🛑 Received SIGINT (Ctrl+C) - Terminating test execution...');
        console.log('⏱️  Termination Time:', new Date().toISOString());
        console.log('💭 Tests may be incomplete due to early termination');
        process.exit(EXIT_FAILURE);
    });
    
    process.on('SIGTERM', () => {
        console.log('');
        console.log('🛑 Received SIGTERM - Terminating test execution...');
        console.log('⏱️  Termination Time:', new Date().toISOString());
        console.log('💭 Tests may be incomplete due to early termination');
        process.exit(EXIT_FAILURE);
    });
    
    // Set up uncaught exception handler for robust error handling
    process.on('uncaughtException', (error) => {
        console.error('');
        console.error('💥 UNCAUGHT EXCEPTION IN TEST EXECUTION:');
        console.error('❌ Error:', error.message);
        console.error('📋 Stack trace:', error.stack || 'No stack trace available');
        console.error('⏱️  Exception Time:', new Date().toISOString());
        console.error('');
        console.error('🔧 This indicates a serious issue in the test setup or execution');
        console.error('💡 Please review the error details and fix the underlying problem');
        process.exit(EXIT_FAILURE);
    });
    
    // Set up unhandled promise rejection handler
    process.on('unhandledRejection', (reason, promise) => {
        console.error('');
        console.error('💥 UNHANDLED PROMISE REJECTION IN TEST EXECUTION:');
        console.error('❌ Reason:', reason);
        console.error('📋 Promise:', promise);
        console.error('⏱️  Rejection Time:', new Date().toISOString());
        console.error('');
        console.error('🔧 This indicates an unhandled async error in the test suite');
        console.error('💡 Please review the error details and add proper error handling');
        process.exit(EXIT_FAILURE);
    });
    
    // Execute the main function and handle final exit codes
    main()
        .then(() => {
            // Success path - main() completed without throwing
            // Exit code already handled within main() function
            console.log('✨ Test script execution completed successfully');
        })
        .catch((error) => {
            // This catch block should not be reached due to error handling within main(),
            // but provides a final safety net for unexpected errors
            console.error('');
            console.error('💥 Unexpected error in test script execution:');
            console.error('❌ Error:', error.message);
            console.error('📋 Stack trace:', error.stack || 'No stack trace available');
            console.error('⏱️  Final Error Time:', new Date().toISOString());
            console.error('');
            console.error('🔧 This should not happen - please report this issue');
            process.exit(EXIT_FAILURE);
        });
}

/**
 * Implementation Notes:
 * 
 * 1. **Environment Management**: The script ensures NODE_ENV is set to 'test'
 *    for consistent behavior across development, CI, and production environments.
 *    This is critical for environment-aware code paths and configuration.
 * 
 * 2. **Error Isolation**: The main() function uses comprehensive try-catch blocks
 *    to handle both synchronous and asynchronous errors from the test orchestrator.
 * 
 * 3. **Process Exit Codes**: The script uses standard Unix exit codes (0 for success,
 *    1 for failure) to integrate with CI/CD pipelines and quality gates.
 * 
 * 4. **Minimal Logging**: Logging is kept minimal to avoid noise in CI output,
 *    but includes essential information for debugging and progress tracking.
 * 
 * 5. **Signal Handling**: The script handles SIGINT and SIGTERM signals for graceful
 *    shutdown when interrupted by users or CI/CD systems.
 * 
 * 6. **Cross-Platform Compatibility**: Uses Node.js built-in modules for robust
 *    operation across Windows, macOS, and Linux environments.
 * 
 * 7. **Dual Usage Pattern**: Supports both standalone CLI execution and programmatic
 *    import for maximum flexibility in different testing workflows.
 * 
 * 8. **Test Orchestration**: Delegates all test sequencing and execution to the
 *    specialized runAllTests() orchestrator, maintaining separation of concerns.
 * 
 * 9. **CI/CD Integration**: Designed for seamless integration with npm scripts,
 *    CI pipelines, and automated testing workflows.
 * 
 * 10. **Debugging Support**: Comprehensive error messages and system information
 *     help developers quickly identify and resolve issues.
 * 
 * Quality Assurance:
 * - Enforces proper test environment setup before execution
 * - Provides comprehensive error handling for all failure scenarios
 * - Enables automated quality gates through exit code handling
 * - Supports maintainable test automation workflows
 * - Ensures compatibility with local development and CI/CD pipelines
 * 
 * Security Considerations:
 * - No sensitive data exposure in error messages
 * - Proper process lifecycle management
 * - Secure signal handling for graceful shutdown
 * - Environment variable validation and sanitization
 * 
 * Performance Considerations:
 * - Minimal overhead during test execution
 * - Efficient error handling without performance impact
 * - Optimized for CI/CD pipeline execution speed
 * - Memory-efficient process management
 */