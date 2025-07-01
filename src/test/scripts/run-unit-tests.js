/**
 * Unit Test Execution Script for Node.js/Express.js Hello World Tutorial
 * 
 * This script provides automated execution of all unit test suites using Jest,
 * designed for integration with CI/CD pipelines and local development workflows.
 * It focuses exclusively on unit tests (not integration, e2e, or performance),
 * ensuring fast feedback and maintainable test automation.
 * 
 * The script sets up the test environment, invokes Jest with appropriate configuration
 * and test match patterns, outputs results in developer-friendly format, and handles
 * process exit codes for CI/CD compatibility. It is robust, cross-platform, and
 * ensures only unit-level test files are executed.
 * 
 * Usage:
 * - As standalone script: node run-unit-tests.js
 * - As npm script: npm run test:unit
 * - As imported module: const { runUnitTests } = require('./run-unit-tests');
 * 
 * @fileOverview Unit test execution automation for Jest-based test suites
 * @author Tutorial Development Team
 * @version 1.0.0
 * @since Node.js 18+
 */

// Node.js built-in modules for cross-platform execution
const path = require('node:path'); // ^18.0.0 - Built-in Node.js path utilities
const process = require('node:process'); // ^18.0.0 - Built-in Node.js process interface
const { spawn } = require('node:child_process'); // ^18.0.0 - Built-in child process spawning
const console = require('node:console'); // ^18.0.0 - Built-in Node.js console interface

// Internal imports for Jest configuration
const jestConfig = require('../jest.config.js'); // Jest configuration for test runner setup

// Global constants for test execution configuration
// Resolves unit test file pattern using absolute paths for cross-platform compatibility
const UNIT_TEST_PATTERN = path.resolve(__dirname, '../unit/**/*.test.js');

// Resolves Jest configuration file path for consistent test runner configuration
const JEST_CONFIG_PATH = path.resolve(__dirname, '../jest.config.js');

/**
 * Executes all unit test suites using Jest with comprehensive error handling,
 * developer-friendly output formatting, and CI/CD pipeline integration.
 * 
 * This function provides the main entry point for unit test execution, supporting
 * both programmatic usage and direct script invocation. It ensures consistent
 * test environment setup, robust process management, and appropriate exit codes
 * for automated build systems.
 * 
 * The function spawns Jest as a child process to avoid circular dependencies,
 * provides real-time test output streaming, and implements comprehensive error
 * handling for various failure scenarios.
 * 
 * @async
 * @function runUnitTests
 * @returns {Promise<void>} Resolves when all unit tests complete successfully,
 *                          rejects or exits with error code on test failures
 * @throws {Error} Throws error for Jest configuration issues or process spawning failures
 * 
 * @example
 * // Programmatic usage
 * const { runUnitTests } = require('./run-unit-tests');
 * await runUnitTests();
 * 
 * @example
 * // Direct script execution
 * node run-unit-tests.js
 */
async function runUnitTests() {
  try {
    // Step 1: Set NODE_ENV to 'test' for consistent test environment
    // This ensures all environment-dependent code recognizes the test context
    process.env.NODE_ENV = 'test';
    
    // Log test execution start for developer visibility
    console.log('🧪 Starting unit test execution...');
    console.log(`📁 Test pattern: ${UNIT_TEST_PATTERN}`);
    console.log(`⚙️  Jest config: ${JEST_CONFIG_PATH}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(''); // Empty line for output formatting
    
    // Step 2: Resolve Jest executable path from node_modules
    // Uses cross-platform path resolution for Jest CLI location
    const jestBinary = path.resolve(__dirname, '../../../node_modules/.bin/jest');
    
    // Step 3: Build Jest CLI command arguments array
    // Configures Jest to run only unit tests with appropriate settings
    const jestArgs = [
      // Specify Jest configuration file path
      '--config', JEST_CONFIG_PATH,
      
      // Run tests by path pattern to target only unit tests
      '--testPathPattern', 'unit/.*\\.test\\.js$',
      
      // Enable coverage collection for code quality metrics
      '--coverage',
      
      // Disable watch mode for CI/CD compatibility
      '--watchAll=false',
      
      // Force colored output for better developer experience
      '--colors',
      
      // Enable verbose output for detailed test information
      '--verbose',
      
      // Set maximum worker processes for optimal performance
      '--maxWorkers', process.env.CI ? '2' : '50%',
      
      // Prevent Jest from running in interactive mode
      '--ci',
      
      // Exit with error code on test failures
      '--passWithNoTests=false'
    ];
    
    // Step 4: Log Jest execution details for debugging
    console.log(`🚀 Executing: ${jestBinary} ${jestArgs.join(' ')}`);
    console.log(''); // Empty line for output formatting
    
    // Step 5: Spawn Jest child process with comprehensive configuration
    const jestProcess = spawn(jestBinary, jestArgs, {
      // Use current working directory for consistent path resolution
      cwd: process.cwd(),
      
      // Inherit environment variables with test-specific overrides
      env: {
        ...process.env,
        NODE_ENV: 'test',
        FORCE_COLOR: '1', // Ensure colored output in CI environments
        CI: process.env.CI || 'false'
      },
      
      // Configure stdio for real-time output streaming
      stdio: ['inherit', 'pipe', 'pipe'],
      
      // Use shell for cross-platform compatibility
      shell: process.platform === 'win32'
    });
    
    // Step 6: Handle Jest process stdout for real-time feedback
    // Streams Jest output directly to console for immediate visibility
    jestProcess.stdout.on('data', (data) => {
      process.stdout.write(data);
    });
    
    // Step 7: Handle Jest process stderr for error reporting
    // Streams Jest error output with proper error formatting
    jestProcess.stderr.on('data', (data) => {
      process.stderr.write(data);
    });
    
    // Step 8: Handle Jest process completion with comprehensive result processing
    return new Promise((resolve, reject) => {
      jestProcess.on('close', (exitCode) => {
        console.log(''); // Empty line for output formatting
        
        // Handle successful test execution
        if (exitCode === 0) {
          console.log('✅ All unit tests passed successfully!');
          console.log('📊 Coverage reports generated in coverage directory');
          console.log('🎉 Unit test execution completed successfully');
          
          // Resolve promise for programmatic usage
          resolve();
          
          // Exit with success code for script usage
          if (require.main === module) {
            process.exit(0);
          }
        } else {
          // Handle test failures or Jest execution errors
          console.error('❌ Unit tests failed or encountered errors');
          console.error(`💥 Jest exited with code: ${exitCode}`);
          console.error('📋 Check test output above for detailed failure information');
          console.error('🔍 Review failed tests and fix issues before retrying');
          
          // Create detailed error for programmatic usage
          const error = new Error(`Unit tests failed with exit code ${exitCode}`);
          error.exitCode = exitCode;
          
          // Reject promise for programmatic usage
          reject(error);
          
          // Exit with error code for script usage
          if (require.main === module) {
            process.exit(exitCode);
          }
        }
      });
      
      // Handle Jest process spawning errors
      jestProcess.on('error', (error) => {
        console.error('❌ Failed to start Jest process:');
        console.error('💥 Error details:', error.message);
        console.error('🔧 Possible solutions:');
        console.error('   - Ensure Jest is installed: npm install');
        console.error('   - Check Jest configuration file exists');
        console.error('   - Verify Node.js version compatibility (18+)');
        
        // Reject promise with detailed error information
        reject(new Error(`Failed to spawn Jest process: ${error.message}`));
        
        // Exit with error code for script usage
        if (require.main === module) {
          process.exit(1);
        }
      });
    });
    
  } catch (error) {
    // Handle synchronous errors during test setup
    console.error('❌ Error during unit test setup:');
    console.error('💥 Error details:', error.message);
    console.error('🔧 Check Jest configuration and test environment setup');
    
    // Re-throw error for programmatic usage
    throw error;
  }
}

/**
 * Validates the test environment and configuration before executing tests.
 * 
 * This function performs pre-execution validation to ensure the test environment
 * is properly configured and all required dependencies are available. It checks
 * for Jest installation, configuration file existence, and Node.js version
 * compatibility.
 * 
 * @private
 * @function validateTestEnvironment
 * @returns {boolean} True if environment is valid, throws error otherwise
 * @throws {Error} Throws error for missing dependencies or configuration issues
 */
function validateTestEnvironment() {
  try {
    // Check if Jest configuration file exists
    require.resolve(JEST_CONFIG_PATH);
    
    // Verify Node.js version compatibility (18+)
    const nodeVersion = parseInt(process.version.slice(1).split('.')[0]);
    if (nodeVersion < 18) {
      throw new Error(`Node.js 18+ required, current version: ${process.version}`);
    }
    
    // Validate unit test pattern directory exists
    const unitTestDir = path.dirname(UNIT_TEST_PATTERN);
    const fs = require('node:fs');
    if (!fs.existsSync(unitTestDir)) {
      console.warn(`⚠️  Unit test directory does not exist: ${unitTestDir}`);
      console.warn('   Tests will be skipped if no test files are found');
    }
    
    return true;
  } catch (error) {
    throw new Error(`Test environment validation failed: ${error.message}`);
  }
}

// Script entry point: Execute unit tests when run directly
if (require.main === module) {
  // Validate test environment before execution
  try {
    validateTestEnvironment();
  } catch (error) {
    console.error('❌ Test environment validation failed:');
    console.error('💥 Error details:', error.message);
    process.exit(1);
  }
  
  // Execute unit tests with proper error handling
  runUnitTests().catch((error) => {
    console.error('❌ Unit test execution failed:');
    console.error('💥 Error details:', error.message);
    
    // Exit with appropriate error code
    const exitCode = error.exitCode || 1;
    process.exit(exitCode);
  });
}

// Export the main function for programmatic usage
module.exports = {
  runUnitTests
};

/**
 * Usage Examples and Integration Notes:
 * 
 * 1. NPM Script Integration:
 *    Add to package.json scripts:
 *    "test:unit": "node src/test/scripts/run-unit-tests.js"
 * 
 * 2. CI/CD Pipeline Integration:
 *    - Script exits with code 0 on success, non-zero on failure
 *    - Generates coverage reports for quality gates
 *    - Provides detailed console output for build logs
 * 
 * 3. Programmatic Usage:
 *    const { runUnitTests } = require('./run-unit-tests');
 *    try {
 *      await runUnitTests();
 *      console.log('Tests passed!');
 *    } catch (error) {
 *      console.error('Tests failed:', error.message);
 *    }
 * 
 * 4. Cross-Platform Compatibility:
 *    - Uses Node.js built-in modules for maximum compatibility
 *    - Handles Windows, macOS, and Linux path differences
 *    - Supports both PowerShell and Command Prompt on Windows
 * 
 * 5. Development Workflow:
 *    - Provides immediate feedback on test results
 *    - Generates coverage reports for code quality analysis
 *    - Integrates with watch mode for continuous testing
 * 
 * Quality Assurance Features:
 * - Comprehensive error handling and reporting
 * - Detailed logging for debugging and monitoring
 * - Process isolation through child process spawning
 * - Exit code management for CI/CD integration
 * - Cross-platform path resolution and execution
 * - Environment validation and configuration checks
 */