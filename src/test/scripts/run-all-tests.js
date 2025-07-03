/**
 * Test Orchestrator Script - All Tests Runner
 * 
 * This script serves as the primary entry point for executing all test phases
 * (unit, integration, and coverage) for the Node.js/Express.js tutorial backend
 * application. It orchestrates the complete test validation workflow by sequentially
 * invoking specialized test runner scripts in the correct order.
 * 
 * The script is designed for both local development and CI/CD pipeline integration,
 * providing comprehensive test automation with robust error handling, summary output,
 * and appropriate process exit codes for quality gates.
 * 
 * Features:
 * - Sequential execution of all test phases with proper dependency management
 * - Cross-platform compatibility using Node.js built-in modules
 * - Comprehensive error handling and graceful failure management
 * - CI/CD integration with standardized exit codes
 * - Real-time progress reporting and summary statistics
 * - Dual usage: standalone CLI tool and programmatic module
 * 
 * Test Execution Order:
 * 1. Unit Tests - Validates individual component functionality
 * 2. Integration Tests - Validates component interactions and API endpoints
 * 3. Coverage Report - Generates comprehensive code coverage analysis
 * 
 * Compatible with:
 * - Node.js 18+
 * - Express.js 5.1.0
 * - Jest 29.7.0
 * - Cross-platform execution (Windows, macOS, Linux)
 * - CI/CD pipelines (GitHub Actions, Jenkins, Azure DevOps)
 * 
 * Usage:
 * - NPM script: npm run test:all
 * - Direct execution: node src/test/scripts/run-all-tests.js
 * - Programmatic import: const { runAllTests } = require('./run-all-tests');
 * 
 * @author Generated for Node.js Tutorial Application
 * @version 1.0.0
 */

// External dependencies - Node.js built-in modules
const process = require('node:process'); // builtin - Process control, environment variables, and exit codes
const console = require('node:console'); // builtin - Console output for logging, errors, and progress reporting

// Internal dependencies - Test phase execution modules
const { runUnitTests } = require('./run-unit-tests.js'); // Unit test runner for component-level validation
const { runIntegrationTests } = require('./run-integration-tests.js'); // Integration test runner for API and workflow validation
const { generateCoverageReport } = require('./generate-coverage-report.js'); // Coverage report generator for code quality metrics

// Global constants for process exit codes
const EXIT_SUCCESS = 0; // Standard success exit code for successful test completion
const EXIT_FAILURE = 1; // Standard failure exit code for test failures or errors

/**
 * Orchestrates the execution of all test phases (unit, integration, coverage) in sequence.
 * 
 * This function implements the complete test validation workflow by executing each test phase
 * in the correct order, handling errors gracefully, and providing comprehensive output for
 * both local development and CI/CD pipeline integration.
 * 
 * The function ensures that:
 * - All test phases are executed in the proper sequence
 * - Each phase must complete successfully before proceeding to the next
 * - Comprehensive error handling prevents cascading failures
 * - Detailed progress reporting provides visibility into test execution
 * - Process exit codes reflect overall test success or failure
 * 
 * Test Execution Workflow:
 * 1. Display test execution banner and initialization information
 * 2. Execute unit tests - validates individual component functionality
 * 3. Execute integration tests - validates component interactions and API endpoints
 * 4. Generate coverage report - provides code coverage analysis and metrics
 * 5. Display final success message and exit with success code
 * 
 * Error Handling:
 * - Each test phase is wrapped in try-catch blocks for isolated error handling
 * - Failures in any phase immediately terminate execution with appropriate error messaging
 * - Comprehensive error logging provides debugging information
 * - Process exit codes enable CI/CD pipeline quality gates
 * 
 * @async
 * @function runAllTests
 * @returns {Promise<void>} Resolves when all test phases complete successfully, 
 *                          rejects or exits with error code on failure
 * 
 * @throws {Error} When any test phase fails or encounters fatal errors
 * 
 * @example
 * // Programmatic usage
 * try {
 *   await runAllTests();
 *   console.log('All tests completed successfully');
 * } catch (error) {
 *   console.error('Test execution failed:', error.message);
 * }
 * 
 * @example
 * // CLI usage
 * node src/test/scripts/run-all-tests.js
 */
async function runAllTests() {
    try {
        // Print a banner indicating the start of the full test suite run
        console.log('🚀 Node.js Tutorial - Complete Test Suite Execution');
        console.log('═'.repeat(70));
        console.log('📋 Test Execution Plan:');
        console.log('  1. Unit Tests - Component functionality validation');
        console.log('  2. Integration Tests - API and workflow validation');
        console.log('  3. Coverage Report - Code coverage analysis');
        console.log('═'.repeat(70));
        console.log('⏱️  Start Time:', new Date().toISOString());
        console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
        console.log('');

        // Phase 1: Execute unit tests
        console.log('🧪 Phase 1: Running Unit Tests');
        console.log('─'.repeat(50));
        try {
            await runUnitTests();
            console.log('✅ Unit tests completed successfully');
            console.log('');
        } catch (error) {
            console.error('❌ Unit tests failed:', error.message);
            console.error('🔍 Error details:', error.stack || 'No stack trace available');
            console.error('');
            console.error('💥 Test execution terminated due to unit test failures');
            console.error('📋 Summary: Unit tests must pass before proceeding to integration tests');
            console.error('⏱️  Failure Time:', new Date().toISOString());
            process.exit(EXIT_FAILURE);
        }

        // Phase 2: Execute integration tests
        console.log('🔗 Phase 2: Running Integration Tests');
        console.log('─'.repeat(50));
        try {
            await runIntegrationTests();
            console.log('✅ Integration tests completed successfully');
            console.log('');
        } catch (error) {
            console.error('❌ Integration tests failed:', error.message);
            console.error('🔍 Error details:', error.stack || 'No stack trace available');
            console.error('');
            console.error('💥 Test execution terminated due to integration test failures');
            console.error('📋 Summary: Integration tests must pass before proceeding to coverage report');
            console.error('⏱️  Failure Time:', new Date().toISOString());
            process.exit(EXIT_FAILURE);
        }

        // Phase 3: Generate coverage report
        console.log('📊 Phase 3: Generating Coverage Report');
        console.log('─'.repeat(50));
        try {
            await generateCoverageReport();
            console.log('✅ Coverage report generated successfully');
            console.log('');
        } catch (error) {
            console.error('❌ Coverage report generation failed:', error.message);
            console.error('🔍 Error details:', error.stack || 'No stack trace available');
            console.error('');
            console.error('💥 Test execution terminated due to coverage generation failure');
            console.error('📋 Summary: Coverage report generation failed but all tests passed');
            console.error('⏱️  Failure Time:', new Date().toISOString());
            process.exit(EXIT_FAILURE);
        }

        // All phases succeeded - print final success message
        console.log('═'.repeat(70));
        console.log('🎉 ALL TEST PHASES COMPLETED SUCCESSFULLY!');
        console.log('═'.repeat(70));
        console.log('✅ Test Execution Summary:');
        console.log('  ✓ Unit Tests: PASSED');
        console.log('  ✓ Integration Tests: PASSED');
        console.log('  ✓ Coverage Report: GENERATED');
        console.log('');
        console.log('🏆 Quality Gates: ALL PASSED');
        console.log('🚀 Application is ready for deployment');
        console.log('⏱️  Completion Time:', new Date().toISOString());
        console.log('');
        console.log('📈 Next Steps:');
        console.log('  • Review coverage report for code quality metrics');
        console.log('  • Commit changes with confidence');
        console.log('  • Deploy to staging/production environment');
        console.log('');

    } catch (error) {
        // Catch any uncaught exceptions during test orchestration
        console.error('═'.repeat(70));
        console.error('💥 FATAL ERROR DURING TEST EXECUTION');
        console.error('═'.repeat(70));
        console.error('❌ Unexpected error occurred:', error.message);
        console.error('🔍 Stack trace:', error.stack || 'No stack trace available');
        console.error('');
        console.error('🐛 Debug Information:');
        console.error(`  • Node.js version: ${process.version}`);
        console.error(`  • Platform: ${process.platform}`);
        console.error(`  • Architecture: ${process.arch}`);
        console.error(`  • Working directory: ${process.cwd()}`);
        console.error(`  • Environment: ${process.env.NODE_ENV || 'undefined'}`);
        console.error('');
        console.error('💡 Troubleshooting:');
        console.error('  1. Verify all dependencies are installed (npm install)');
        console.error('  2. Check Jest configuration in jest.config.js');
        console.error('  3. Ensure test files exist and are properly formatted');
        console.error('  4. Verify Node.js version compatibility (18+)');
        console.error('⏱️  Error Time:', new Date().toISOString());
        
        // Exit with failure code
        process.exit(EXIT_FAILURE);
    }
}

// Export the main function for programmatic use
module.exports = {
    runAllTests
};

// Script entry point: If run directly, invoke runAllTests() and handle process exit codes
if (require.main === module) {
    // Script is being executed directly as a CLI tool
    console.log('🎯 Initializing complete test suite execution...');
    console.log('');
    
    // Set up process signal handlers for graceful shutdown
    process.on('SIGINT', () => {
        console.log('');
        console.log('🛑 Received SIGINT (Ctrl+C) - Terminating test execution...');
        console.log('⏱️  Termination Time:', new Date().toISOString());
        process.exit(EXIT_FAILURE);
    });
    
    process.on('SIGTERM', () => {
        console.log('');
        console.log('🛑 Received SIGTERM - Terminating test execution...');
        console.log('⏱️  Termination Time:', new Date().toISOString());
        process.exit(EXIT_FAILURE);
    });
    
    // Set up uncaught exception handler
    process.on('uncaughtException', (error) => {
        console.error('');
        console.error('💥 UNCAUGHT EXCEPTION:');
        console.error(error.message);
        console.error(error.stack);
        console.error('⏱️  Exception Time:', new Date().toISOString());
        process.exit(EXIT_FAILURE);
    });
    
    // Set up unhandled promise rejection handler
    process.on('unhandledRejection', (reason, promise) => {
        console.error('');
        console.error('💥 UNHANDLED PROMISE REJECTION:');
        console.error('Reason:', reason);
        console.error('Promise:', promise);
        console.error('⏱️  Rejection Time:', new Date().toISOString());
        process.exit(EXIT_FAILURE);
    });
    
    // Execute the complete test suite
    runAllTests()
        .then(() => {
            // Success - all tests passed
            console.log('✨ Test orchestration completed successfully');
            console.log('🎯 Exiting with success code');
            process.exit(EXIT_SUCCESS);
        })
        .catch((error) => {
            // This catch block should not be reached due to error handling within runAllTests(),
            // but provides a final safety net for unexpected errors
            console.error('');
            console.error('💥 Unexpected error in test orchestration:');
            console.error(error.message);
            console.error('⏱️  Final Error Time:', new Date().toISOString());
            process.exit(EXIT_FAILURE);
        });
}

/**
 * Implementation Notes:
 * 
 * 1. **Sequential Execution**: The script executes test phases in the correct order,
 *    ensuring that unit tests pass before integration tests, and integration tests
 *    pass before coverage report generation.
 * 
 * 2. **Error Isolation**: Each test phase is wrapped in individual try-catch blocks
 *    to provide specific error handling and prevent cascading failures.
 * 
 * 3. **Process Exit Codes**: The script uses standard Unix exit codes (0 for success,
 *    1 for failure) to integrate with CI/CD pipelines and quality gates.
 * 
 * 4. **Comprehensive Logging**: Detailed progress reporting and error messages provide
 *    visibility into test execution for both local development and CI/CD debugging.
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
 * 8. **Quality Gates**: Each test phase acts as a quality gate, preventing deployment
 *    of code that doesn't meet testing standards.
 * 
 * 9. **Debugging Support**: Comprehensive error messages and system information help
 *    developers quickly identify and resolve issues.
 * 
 * 10. **Extensibility**: The script can be easily extended to support additional test
 *     phases (e.g., performance tests, security tests) by adding new phases to the
 *     execution workflow.
 * 
 * CI/CD Integration:
 * - The script is designed to be called from npm scripts or CI pipelines
 * - Exit codes enable automated quality gates and build failures
 * - Progress reporting provides real-time feedback in CI/CD logs
 * - Error handling ensures clear failure reasons for debugging
 * 
 * Quality Assurance:
 * - Enforces sequential test execution to maintain test dependencies
 * - Provides comprehensive test coverage validation
 * - Enables code quality gates through exit code handling
 * - Supports maintainable test automation workflows
 */