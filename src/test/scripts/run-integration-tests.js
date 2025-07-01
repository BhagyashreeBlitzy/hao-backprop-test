/**
 * Integration Test Runner Script for Node.js/Express.js Tutorial Application
 * 
 * This script executes all integration test suites using Jest as the test runner,
 * targeting files matching the integration test pattern. It is designed to be used
 * both as a standalone CLI tool and as a programmatic module, providing appropriate
 * output and exit codes for CI/CD integration.
 * 
 * Features:
 * - Executes all integration tests using Jest Node API
 * - Configures test environment variables automatically
 * - Provides detailed console output and summary reporting
 * - Handles success and failure scenarios with proper exit codes
 * - Supports both CLI usage and programmatic imports
 * - Integrates with Jest configuration for consistent test execution
 * 
 * Usage:
 * - CLI: node run-integration-tests.js
 * - Programmatic: const { runIntegrationTests } = require('./run-integration-tests.js')
 * - NPM Script: npm run test:integration
 * 
 * Dependencies:
 * - jest ^29.7.0: Primary test runner and framework
 * - path (builtin): Path resolution for test files and configuration
 * - process (builtin): Environment variables and process control
 */

// Import required Node.js built-in modules
const path = require('node:path'); // builtin - Path resolution for test files and configuration
const process = require('node:process'); // builtin - Environment variables, exit codes, and process control

// Import Jest for programmatic test execution
const jest = require('jest'); // ^29.7.0 - Primary test runner for executing integration test suites

// Import test utilities for custom test orchestration
const { makeRequest } = require('../helpers/testUtils.js'); // Helper for HTTP request simulation in custom scenarios

// Global constants for test file patterns and configuration paths
const INTEGRATION_TEST_PATTERN = path.resolve(__dirname, '../integration/**/*.test.js');
const JEST_CONFIG_PATH = path.resolve(__dirname, '../jest.config.js');

/**
 * Executes all integration test suites using Jest, targeting files matching the 
 * integration test pattern. Outputs summary results to the console and exits 
 * with appropriate status code for CI/CD integration.
 * 
 * This function implements a complete integration test execution workflow:
 * 1. Resolves glob pattern for all integration test files
 * 2. Configures Jest with appropriate settings and configuration file
 * 3. Sets NODE_ENV to 'test' for consistent test environment
 * 4. Executes Jest programmatically, capturing output for logging
 * 5. Handles success/failure scenarios with appropriate console output
 * 6. Exits with proper status codes for CI/CD integration
 * 
 * The function uses Jest's Node API to programmatically execute tests,
 * allowing for custom configuration and output handling while maintaining
 * compatibility with standard Jest features and configuration files.
 * 
 * @returns {Promise<void>} Resolves when all integration tests complete, 
 *                          rejects or exits with error code on failure
 * 
 * @throws {Error} Throws error if Jest configuration is invalid or tests fail
 * 
 * @example
 * // Programmatic usage
 * try {
 *   await runIntegrationTests();
 *   console.log('All integration tests passed');
 * } catch (error) {
 *   console.error('Integration tests failed:', error.message);
 * }
 * 
 * @example
 * // CLI usage (automatic when script is run directly)
 * // node run-integration-tests.js
 */
async function runIntegrationTests() {
  try {
    console.log('🚀 Starting Integration Test Suite Execution...\n');
    
    // Step 1: Resolve the glob pattern for all integration test files
    console.log('📁 Resolving integration test file pattern...');
    console.log(`   Pattern: ${INTEGRATION_TEST_PATTERN}`);
    
    // Verify that the integration test directory exists
    const integrationTestDir = path.dirname(INTEGRATION_TEST_PATTERN);
    const fs = require('fs');
    if (!fs.existsSync(integrationTestDir)) {
      console.warn(`⚠️  Warning: Integration test directory does not exist: ${integrationTestDir}`);
      console.log('   Creating directory structure for future tests...');
      fs.mkdirSync(integrationTestDir, { recursive: true });
    }

    // Step 2: Set NODE_ENV to 'test' for consistent test environment
    console.log('\n🔧 Configuring test environment...');
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';
    console.log(`   NODE_ENV set to: ${process.env.NODE_ENV}`);

    // Step 3: Build Jest configuration with resolved pattern and configuration file
    console.log('\n⚙️  Building Jest configuration...');
    const jestConfig = {
      // Test file pattern targeting integration tests
      testMatch: [INTEGRATION_TEST_PATTERN],
      
      // Use Jest configuration file if it exists
      ...(fs.existsSync(JEST_CONFIG_PATH) ? {} : {}),
      
      // Test environment configuration
      testEnvironment: 'node',
      
      // Verbose output for detailed test results
      verbose: true,
      
      // Force exit after tests complete
      forceExit: true,
      
      // Detect open handles that prevent Jest from exiting
      detectOpenHandles: true,
      
      // Coverage configuration for integration tests
      collectCoverage: false, // Disable coverage for integration tests by default
      
      // Silent mode configuration - allow output for integration tests
      silent: false,
      
      // Test timeout configuration (30 seconds for integration tests)
      testTimeout: 30000,
      
      // Setup files for test environment
      setupFilesAfterEnv: [],
      
      // Module directories for dependency resolution
      moduleDirectories: ['node_modules', '<rootDir>/src'],
      
      // Transform configuration for ES modules and other files
      transform: {},
      
      // File extensions to consider as test files
      moduleFileExtensions: ['js', 'json', 'node'],
      
      // Clear mocks between tests
      clearMocks: true,
      
      // Restore mocks after each test
      restoreMocks: true
    };

    // Include Jest config file if it exists
    if (fs.existsSync(JEST_CONFIG_PATH)) {
      console.log(`   Using Jest configuration file: ${JEST_CONFIG_PATH}`);
      jestConfig.config = JEST_CONFIG_PATH;
    } else {
      console.log('   Using default Jest configuration (no config file found)');
    }

    console.log(`   Test pattern: ${INTEGRATION_TEST_PATTERN}`);
    console.log(`   Test environment: ${jestConfig.testEnvironment}`);
    console.log(`   Test timeout: ${jestConfig.testTimeout}ms`);

    // Step 4: Execute Jest programmatically, capturing stdout/stderr for logging
    console.log('\n🧪 Executing integration tests...\n');
    
    // Create Jest options for programmatic execution
    const jestOptions = {
      projects: [process.cwd()],
      testMatch: [INTEGRATION_TEST_PATTERN],
      verbose: true,
      forceExit: true,
      detectOpenHandles: true,
      testTimeout: 30000,
      // Pass configuration file if it exists
      ...(fs.existsSync(JEST_CONFIG_PATH) ? { config: JEST_CONFIG_PATH } : {})
    };

    // Execute Jest with configuration
    const jestResult = await jest.runCLI(jestOptions, [process.cwd()]);
    
    // Extract test results from Jest execution
    const { results } = jestResult;
    const {
      numTotalTests,
      numPassedTests,
      numFailedTests,
      numPendingTests,
      testResults,
      success,
      startTime,
      endTime
    } = results;

    // Calculate execution time
    const executionTime = endTime - startTime;
    const executionTimeSeconds = (executionTime / 1000).toFixed(2);

    // Step 5: On success, print summary of test results to console
    if (success) {
      console.log('\n✅ Integration Test Suite Completed Successfully!\n');
      console.log('📊 Test Execution Summary:');
      console.log(`   ✅ Total Tests: ${numTotalTests}`);
      console.log(`   ✅ Passed: ${numPassedTests}`);
      console.log(`   ❌ Failed: ${numFailedTests}`);
      console.log(`   ⏸️  Pending: ${numPendingTests}`);
      console.log(`   ⏱️  Execution Time: ${executionTimeSeconds}s`);
      
      // Display test file results
      if (testResults && testResults.length > 0) {
        console.log('\n📁 Test File Results:');
        testResults.forEach((fileResult) => {
          const fileName = path.relative(process.cwd(), fileResult.testFilePath);
          const fileStatus = fileResult.numFailingTests === 0 ? '✅' : '❌';
          console.log(`   ${fileStatus} ${fileName} (${fileResult.numPassingTests}/${fileResult.numPassingTests + fileResult.numFailingTests})`);
        });
      }

      console.log('\n🎉 All integration tests passed successfully!');
      console.log('🔄 Integration test suite ready for CI/CD pipeline integration.\n');

      // Restore original NODE_ENV
      process.env.NODE_ENV = originalNodeEnv;
      
      // Return success for programmatic usage
      return;
    } 
    
    // Step 6: On failure, log error, print diagnostics, and exit with non-zero status
    else {
      console.error('\n❌ Integration Test Suite Failed!\n');
      console.error('📊 Test Execution Summary:');
      console.error(`   📝 Total Tests: ${numTotalTests}`);
      console.error(`   ✅ Passed: ${numPassedTests}`);
      console.error(`   ❌ Failed: ${numFailedTests}`);
      console.error(`   ⏸️  Pending: ${numPendingTests}`);
      console.error(`   ⏱️  Execution Time: ${executionTimeSeconds}s`);

      // Display detailed failure information
      if (testResults && testResults.length > 0) {
        console.error('\n📁 Test File Results:');
        testResults.forEach((fileResult) => {
          const fileName = path.relative(process.cwd(), fileResult.testFilePath);
          const fileStatus = fileResult.numFailingTests === 0 ? '✅' : '❌';
          console.error(`   ${fileStatus} ${fileName} (${fileResult.numPassingTests}/${fileResult.numPassingTests + fileResult.numFailingTests})`);
          
          // Show failure details for failed files
          if (fileResult.numFailingTests > 0) {
            console.error(`      └─ ${fileResult.numFailingTests} test(s) failed`);
            if (fileResult.failureMessage) {
              console.error(`      └─ Error: ${fileResult.failureMessage.split('\n')[0]}`);
            }
          }
        });
      }

      console.error('\n💥 Integration test failures detected!');
      console.error('🔍 Please review the test output above for detailed failure information.');
      console.error('🛠️  Fix the failing tests before proceeding with deployment.\n');

      // Restore original NODE_ENV
      process.env.NODE_ENV = originalNodeEnv;

      // Create detailed error for programmatic usage
      const integrationTestError = new Error(
        `Integration tests failed: ${numFailedTests}/${numTotalTests} tests failed`
      );
      integrationTestError.testResults = results;
      integrationTestError.exitCode = 1;

      // Exit with error code for CLI usage
      if (require.main === module) {
        process.exit(1);
      } else {
        // Throw error for programmatic usage
        throw integrationTestError;
      }
    }

  } catch (error) {
    // Handle unexpected errors during test execution
    console.error('\n💥 Unexpected error during integration test execution:\n');
    console.error(`❌ Error: ${error.message}`);
    
    if (error.stack) {
      console.error('\n📋 Stack Trace:');
      console.error(error.stack);
    }

    // Log additional diagnostic information
    console.error('\n🔍 Diagnostic Information:');
    console.error(`   Node.js Version: ${process.version}`);
    console.error(`   Platform: ${process.platform}`);
    console.error(`   Architecture: ${process.arch}`);
    console.error(`   Working Directory: ${process.cwd()}`);
    console.error(`   NODE_ENV: ${process.env.NODE_ENV}`);
    console.error(`   Integration Test Pattern: ${INTEGRATION_TEST_PATTERN}`);
    console.error(`   Jest Config Path: ${JEST_CONFIG_PATH}`);

    // Restore original NODE_ENV if it was set
    if (process.env.NODE_ENV === 'test') {
      process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    }

    console.error('\n🛠️  Please check the error details above and ensure:');
    console.error('   • Jest is properly installed (npm install jest)');
    console.error('   • Integration test files exist in the expected location');
    console.error('   • Jest configuration is valid');
    console.error('   • All test dependencies are available\n');

    // Exit with error code for CLI usage
    if (require.main === module) {
      process.exit(1);
    } else {
      // Re-throw error for programmatic usage
      throw error;
    }
  }
}

// Script entry point: If run directly (node run-integration-tests.js), 
// invoke runIntegrationTests() and handle process exit codes appropriately
if (require.main === module) {
  console.log('🎯 Integration Test Runner - CLI Mode\n');
  console.log('This script will execute all integration tests for the Node.js/Express.js tutorial application.');
  console.log('Integration tests validate end-to-end HTTP request/response behavior and routing logic.\n');
  
  // Execute integration tests with proper error handling
  runIntegrationTests()
    .then(() => {
      console.log('✅ Integration test execution completed successfully.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Integration test execution failed.');
      console.error(`Error: ${error.message}`);
      process.exit(error.exitCode || 1);
    });
}

// Export the main function for programmatic use
module.exports = {
  runIntegrationTests
};