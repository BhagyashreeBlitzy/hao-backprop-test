/**
 * @fileoverview Integration Test Runner Script
 * 
 * Script to execute all integration test suites for the Node.js/Express.js tutorial application.
 * This script is intended to be run as part of the test automation pipeline or manually by
 * developers to validate the correctness of all integration-level logic, including end-to-end
 * HTTP request/response behavior for the /hello endpoint, error handling, and routing.
 * 
 * The script leverages Jest as the test runner and provides output suitable for CI/CD
 * integration, including exit codes and summary reporting. It ensures that all integration
 * tests pass and provides comprehensive feedback for debugging and quality assurance.
 * 
 * This script is designed to be invoked by the all-tests orchestrator or directly as an
 * npm script, and supports both programmatic usage and CLI execution.
 * 
 * @author Generated for Node.js Tutorial Application
 * @version 1.0.0
 */

// External dependencies
const jest = require('jest'); // v29.7.0 - Primary test runner for executing all integration test suites
const path = require('node:path'); // builtin - Path resolution for locating integration test files and configuration
const process = require('node:process'); // builtin - Access to environment variables, exit codes, and process control

// Internal dependencies
const { makeRequest } = require('../helpers/testUtils.js'); // HTTP request helpers for custom test orchestration

/**
 * Glob pattern for locating all integration test files.
 * Resolves to all .test.js files in the integration test directory and subdirectories.
 * Pattern matches: src/test/integration/**/*.test.js
 * 
 * @constant {string} INTEGRATION_TEST_PATTERN
 */
const INTEGRATION_TEST_PATTERN = path.resolve(__dirname, '../integration/**/*.test.js');

/**
 * Path to the Jest configuration file.
 * Resolves to the jest.config.js file in the test directory for consistent test configuration.
 * 
 * @constant {string} JEST_CONFIG_PATH
 */
const JEST_CONFIG_PATH = path.resolve(__dirname, '../jest.config.js');

/**
 * Executes all integration test suites using Jest, targeting files matching the integration
 * test pattern. Outputs summary results to the console and exits with appropriate status
 * code for CI/CD integration.
 * 
 * This function orchestrates the complete integration testing workflow:
 * 1. Configures the test environment for consistent execution
 * 2. Resolves the glob pattern for all integration test files
 * 3. Builds Jest configuration with the test pattern and config file
 * 4. Executes Jest using the programmatic API
 * 5. Processes test results and provides comprehensive output
 * 6. Handles success/failure scenarios with appropriate exit codes
 * 
 * The function is designed to work both as a standalone script and as a programmatic
 * module, supporting integration with CI/CD pipelines and manual developer workflows.
 * 
 * @async
 * @function runIntegrationTests
 * @returns {Promise<void>} Resolves when all integration tests complete, rejects or exits with error code on failure
 * 
 * @throws {Error} When Jest configuration cannot be resolved
 * @throws {Error} When test pattern matching fails
 * @throws {Error} When Jest execution encounters fatal errors
 * 
 * @example
 * // Programmatic usage
 * await runIntegrationTests();
 * 
 * @example
 * // CLI usage
 * node run-integration-tests.js
 */
async function runIntegrationTests() {
    try {
        // Step 1: Set NODE_ENV to 'test' for consistent test environment
        process.env.NODE_ENV = 'test';
        
        console.log('🚀 Starting integration test execution...');
        console.log(`📁 Test pattern: ${INTEGRATION_TEST_PATTERN}`);
        console.log(`⚙️  Jest config: ${JEST_CONFIG_PATH}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
        console.log('');
        
        // Step 2: Resolve the glob pattern for all integration test files
        const testPattern = INTEGRATION_TEST_PATTERN;
        
        // Step 3: Build the Jest configuration with the resolved pattern and configuration file
        const jestConfig = {
            // Use the Jest configuration file for consistent test settings
            config: JEST_CONFIG_PATH,
            
            // Set the test pattern to target only integration tests
            testMatch: [testPattern],
            
            // Enable verbose output for detailed test results
            verbose: true,
            
            // Run tests serially to avoid port conflicts and race conditions
            runInBand: true,
            
            // Set test environment to Node.js for server-side testing
            testEnvironment: 'node',
            
            // Disable watch mode for CI/CD compatibility
            watchman: false,
            
            // Enable coverage collection for integration tests
            collectCoverage: true,
            
            // Set coverage directory for integration test coverage
            coverageDirectory: path.resolve(__dirname, '../coverage/integration'),
            
            // Configure coverage reporting for CI/CD integration
            coverageReporters: ['text', 'json', 'html'],
            
            // Set coverage collection patterns for integration tests
            collectCoverageFrom: [
                'src/**/*.js',
                '!src/test/**',
                '!src/**/*.test.js'
            ],
            
            // Configure test result processor for summary reporting
            testResultsProcessor: undefined,
            
            // Set test timeout for integration tests (longer than unit tests)
            testTimeout: 10000,
            
            // Configure setup files for integration test environment
            setupFilesAfterEnv: [],
            
            // Configure module paths for consistent imports
            moduleDirectories: ['node_modules', path.resolve(__dirname, '../..')],
            
            // Configure test reporter for CI/CD integration
            reporters: ['default']
        };
        
        // Step 4: Execute Jest using the programmatic API, capturing stdout/stderr for logging
        console.log('🔍 Executing Jest with integration test configuration...');
        console.log('');
        
        const jestResult = await jest.runCLI(jestConfig, [process.cwd()]);
        
        // Step 5: Process test results and extract summary information
        const results = jestResult.results;
        const globalConfig = jestResult.globalConfig;
        
        // Extract test execution statistics
        const testStats = {
            totalTests: results.numTotalTests,
            passedTests: results.numPassedTests,
            failedTests: results.numFailedTests,
            pendingTests: results.numPendingTests,
            todoTests: results.numTodoTests,
            totalTestSuites: results.numTotalTestSuites,
            passedTestSuites: results.numPassedTestSuites,
            failedTestSuites: results.numFailedTestSuites,
            testRunTime: results.testResults.reduce((total, result) => total + result.perfStats.end - result.perfStats.start, 0)
        };
        
        // Step 6: On success, print a summary of the test results to the console
        if (results.success) {
            console.log('');
            console.log('✅ Integration tests completed successfully!');
            console.log('');
            console.log('📊 Test Summary:');
            console.log(`   Total Tests: ${testStats.totalTests}`);
            console.log(`   Passed: ${testStats.passedTests}`);
            console.log(`   Failed: ${testStats.failedTests}`);
            console.log(`   Pending: ${testStats.pendingTests}`);
            console.log(`   Test Suites: ${testStats.passedTestSuites}/${testStats.totalTestSuites} passed`);
            console.log(`   Execution Time: ${testStats.testRunTime}ms`);
            console.log('');
            
            // Display coverage information if available
            if (results.coverageMap && results.coverageMap.data) {
                console.log('📋 Coverage Summary:');
                // Coverage details would be displayed by Jest's built-in reporter
                console.log('   See coverage report for detailed information');
                console.log('');
            }
            
            console.log('🎉 All integration tests passed - ready for deployment!');
            
            // Return success for programmatic usage
            return;
        } else {
            // Step 7: On failure, log the error, print diagnostics, and exit with a non-zero status code
            console.log('');
            console.log('❌ Integration tests failed!');
            console.log('');
            console.log('📊 Test Summary:');
            console.log(`   Total Tests: ${testStats.totalTests}`);
            console.log(`   Passed: ${testStats.passedTests}`);
            console.log(`   Failed: ${testStats.failedTests}`);
            console.log(`   Pending: ${testStats.pendingTests}`);
            console.log(`   Test Suites: ${testStats.passedTestSuites}/${testStats.totalTestSuites} passed`);
            console.log(`   Execution Time: ${testStats.testRunTime}ms`);
            console.log('');
            
            // Display failed test details
            if (results.testResults && results.testResults.length > 0) {
                console.log('🔍 Failed Test Details:');
                results.testResults.forEach((testResult, index) => {
                    if (testResult.numFailingTests > 0) {
                        console.log(`   ${index + 1}. ${testResult.testFilePath}`);
                        console.log(`      Failed: ${testResult.numFailingTests}/${testResult.numTotalTests} tests`);
                        
                        // Display specific test failures
                        testResult.testResults.forEach(test => {
                            if (test.status === 'failed') {
                                console.log(`      - ${test.title}`);
                                if (test.failureMessages && test.failureMessages.length > 0) {
                                    test.failureMessages.forEach(message => {
                                        console.log(`        ${message.split('\n')[0]}`);
                                    });
                                }
                            }
                        });
                        console.log('');
                    }
                });
            }
            
            console.log('💡 Run tests with --verbose flag for more detailed output');
            console.log('');
            
            // Exit with error code for CI/CD integration
            process.exit(1);
        }
        
    } catch (error) {
        // Handle Jest configuration errors, test pattern resolution errors, and other fatal errors
        console.error('');
        console.error('💥 Fatal error during integration test execution:');
        console.error('');
        console.error(`Error: ${error.message}`);
        console.error('');
        
        // Log stack trace in development environment
        if (process.env.NODE_ENV === 'development') {
            console.error('Stack trace:');
            console.error(error.stack);
            console.error('');
        }
        
        // Provide troubleshooting guidance
        console.error('🔧 Troubleshooting tips:');
        console.error('   1. Verify Jest configuration file exists and is valid');
        console.error('   2. Check integration test file pattern matches existing files');
        console.error('   3. Ensure all dependencies are installed (npm install)');
        console.error('   4. Verify Node.js version compatibility (18+)');
        console.error('');
        
        // Exit with error code for CI/CD integration
        process.exit(1);
    }
}

// Script entry point: If run directly (node run-integration-tests.js), invoke runIntegrationTests()
// and handle process exit codes appropriately
if (require.main === module) {
    // Script is being run directly as a CLI tool
    console.log('🧪 Integration Test Runner v1.0.0');
    console.log('=====================================');
    console.log('');
    
    // Execute the integration tests
    runIntegrationTests()
        .then(() => {
            // Success case - tests passed
            console.log('');
            console.log('✨ Integration test execution completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            // Error case - unexpected failure (Jest execution failures are handled within the function)
            console.error('');
            console.error('💥 Unexpected error during test execution:');
            console.error(error.message);
            console.error('');
            process.exit(1);
        });
} else {
    // Module is being imported programmatically
    // Export the function for use by other scripts or test orchestrators
    module.exports = { runIntegrationTests };
}

// Export for programmatic usage
module.exports = {
    runIntegrationTests
};