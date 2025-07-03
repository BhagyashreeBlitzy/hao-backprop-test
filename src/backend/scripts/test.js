/**
 * Backend Test Runner Script
 * 
 * This script serves as the main entry point for executing the backend test suite
 * in the Node.js tutorial application. It programmatically runs Jest with the
 * project's configuration, handles coverage collection, and ensures proper exit
 * codes for CI/CD integration.
 * 
 * Key Features:
 * - Loads Jest configuration from jest.config.js
 * - Executes comprehensive test suite with coverage
 * - Provides real-time test output and feedback
 * - Handles process exit codes for automation
 * - Supports both local development and CI/CD pipelines
 * - Educational clarity with extensive documentation
 * 
 * Usage:
 * - npm test (via package.json script)
 * - node scripts/test.js (direct execution)
 * - CI/CD pipeline integration
 * 
 * @version 1.0.0
 * @requires jest@^29.0.0
 * @requires node@18+
 * @author Node.js Tutorial Team
 * @since 2024-01-01
 */

const { spawn } = require('child_process'); // Node.js 18+ - Process spawning utilities
const path = require('path'); // Node.js 18+ - Path manipulation utilities
const process = require('process'); // Node.js 18+ - Process control and environment

// Import Jest configuration from the project's jest.config.js file
const jestConfig = require('../jest.config.js');

/**
 * Main Test Runner Function
 * 
 * Executes the Jest test runner with the loaded configuration, collects coverage,
 * and exits the process with the appropriate code based on test results.
 * 
 * This function handles the complete test execution lifecycle:
 * 1. Imports and validates the Jest configuration
 * 2. Resolves the path to the Jest CLI executable
 * 3. Spawns a child process to run Jest with configuration
 * 4. Pipes stdout and stderr for real-time feedback
 * 5. Handles process exit codes for automation
 * 6. Provides comprehensive error handling
 * 
 * Process Exit Codes:
 * - 0: All tests passed successfully
 * - 1: Test failures or execution errors occurred
 * 
 * @function runTests
 * @returns {void} Side effect: runs tests and exits process
 * @throws {Error} If Jest configuration cannot be loaded or Jest fails to execute
 * 
 * @example
 * // Direct execution
 * runTests();
 * 
 * @example
 * // Via npm script
 * npm test
 * 
 * @example
 * // In CI/CD pipeline
 * node scripts/test.js
 */
function runTests() {
  try {
    // Log test execution start with configuration information
    console.log('🚀 Starting Node.js Tutorial Backend Test Suite...');
    console.log('📋 Test Configuration:');
    console.log(`   Environment: ${jestConfig.testEnvironment}`);
    console.log(`   Coverage: ${jestConfig.collectCoverage ? 'Enabled' : 'Disabled'}`);
    console.log(`   Coverage Directory: ${jestConfig.coverageDirectory}`);
    console.log(`   Coverage Reporters: ${jestConfig.coverageReporters.join(', ')}`);
    console.log(`   Coverage Thresholds: ${JSON.stringify(jestConfig.coverageThreshold.global)}`);
    console.log('');

    // Resolve the path to the Jest CLI executable
    // This ensures we're using the project's installed Jest version
    let jestCliPath;
    try {
      // Try to resolve Jest CLI from node_modules
      jestCliPath = require.resolve('jest/bin/jest.js');
    } catch (resolveError) {
      // Fallback to global Jest installation if local not found
      console.warn('⚠️  Local Jest installation not found, trying global installation...');
      jestCliPath = 'jest';
    }

    // Prepare Jest command line arguments
    const jestArgs = [
      // Pass the configuration file path
      '--config', path.resolve(__dirname, '../jest.config.js'),
      // Enable coverage collection
      '--coverage',
      // Set coverage directory
      '--coverageDirectory', jestConfig.coverageDirectory,
      // Disable watch mode for CI/CD compatibility
      '--watchAll=false',
      // Force Jest to exit after completion
      '--forceExit',
      // Enable verbose output for educational clarity
      '--verbose',
      // Use specified number of workers
      '--maxWorkers', jestConfig.maxWorkers || '50%',
      // Set test timeout
      '--testTimeout', (jestConfig.testTimeout || 10000).toString(),
      // Enable error detection
      '--detectOpenHandles',
      // Pass any additional arguments from process.argv
      ...process.argv.slice(2)
    ];

    console.log('🔧 Jest Configuration Loaded Successfully');
    console.log(`📂 Jest CLI Path: ${jestCliPath}`);
    console.log(`⚙️  Jest Arguments: ${jestArgs.join(' ')}`);
    console.log('');

    // Spawn Jest process with configuration
    const jestProcess = spawn(process.execPath, [jestCliPath, ...jestArgs], {
      stdio: 'inherit', // Inherit stdio for real-time output
      cwd: process.cwd(), // Use current working directory
      env: {
        ...process.env,
        // Set Node environment for testing
        NODE_ENV: 'test',
        // Ensure Jest runs in CI mode if in CI environment
        CI: process.env.CI || 'false',
        // Force color output for better readability
        FORCE_COLOR: '1'
      }
    });

    // Handle Jest process events
    jestProcess.on('close', (code) => {
      console.log('');
      
      if (code === 0) {
        // All tests passed successfully
        console.log('✅ All tests passed successfully!');
        console.log('📊 Coverage report generated in:', jestConfig.coverageDirectory);
        console.log('🎉 Test execution completed with success');
        
        // Exit with success code
        process.exit(0);
      } else {
        // Tests failed or encountered errors
        console.error('❌ Test execution failed');
        console.error(`💥 Jest exited with code: ${code}`);
        console.error('🔍 Please review the test output above for details');
        
        // Exit with failure code
        process.exit(1);
      }
    });

    // Handle Jest process errors
    jestProcess.on('error', (error) => {
      console.error('');
      console.error('💥 Failed to execute Jest test runner');
      console.error('🔍 Error details:', error.message);
      console.error('📋 Possible causes:');
      console.error('   - Jest is not installed (run: npm install)');
      console.error('   - Node.js version incompatibility');
      console.error('   - Jest configuration errors');
      console.error('   - File system permissions');
      console.error('');
      console.error('🛠️  Troubleshooting steps:');
      console.error('   1. Verify Jest installation: npm ls jest');
      console.error('   2. Check Node.js version: node --version');
      console.error('   3. Validate Jest configuration: jest --showConfig');
      console.error('   4. Review file permissions');
      
      // Exit with failure code
      process.exit(1);
    });

    // Handle process termination signals
    process.on('SIGINT', () => {
      console.log('');
      console.log('🛑 Test execution interrupted by user');
      console.log('🔄 Terminating Jest process...');
      
      // Kill Jest process gracefully
      jestProcess.kill('SIGINT');
      
      // Exit with failure code
      process.exit(1);
    });

    process.on('SIGTERM', () => {
      console.log('');
      console.log('🛑 Test execution terminated by system');
      console.log('🔄 Terminating Jest process...');
      
      // Kill Jest process gracefully
      jestProcess.kill('SIGTERM');
      
      // Exit with failure code
      process.exit(1);
    });

  } catch (configError) {
    // Handle configuration loading errors
    console.error('');
    console.error('💥 Failed to load Jest configuration');
    console.error('🔍 Configuration error:', configError.message);
    console.error('📋 Possible causes:');
    console.error('   - jest.config.js file is missing or corrupted');
    console.error('   - Syntax errors in configuration file');
    console.error('   - Invalid configuration options');
    console.error('   - Module resolution issues');
    console.error('');
    console.error('🛠️  Troubleshooting steps:');
    console.error('   1. Verify jest.config.js exists and is valid');
    console.error('   2. Check configuration syntax');
    console.error('   3. Validate configuration options');
    console.error('   4. Review Jest documentation');
    
    // Exit with failure code
    process.exit(1);
  }
}

/**
 * Process Environment Validation
 * 
 * Validates that the current environment meets the requirements for
 * running the test suite. This includes Node.js version, Jest availability,
 * and necessary configuration files.
 * 
 * @function validateEnvironment
 * @returns {boolean} True if environment is valid, false otherwise
 */
function validateEnvironment() {
  try {
    // Check Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 18) {
      console.error('❌ Node.js version 18 or higher is required');
      console.error(`📋 Current version: ${nodeVersion}`);
      console.error('🔄 Please upgrade Node.js to continue');
      return false;
    }

    // Check Jest availability
    try {
      require.resolve('jest');
    } catch (jestError) {
      console.error('❌ Jest is not installed or not accessible');
      console.error('📋 Please install Jest: npm install --save-dev jest');
      return false;
    }

    // Check Jest configuration file
    const configPath = path.resolve(__dirname, '../jest.config.js');
    try {
      require(configPath);
    } catch (configError) {
      console.error('❌ Jest configuration file is missing or invalid');
      console.error(`📋 Configuration path: ${configPath}`);
      console.error('🔍 Error:', configError.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Environment validation failed');
    console.error('🔍 Error:', error.message);
    return false;
  }
}

/**
 * Main Execution Block
 * 
 * Entry point for the test script. Validates the environment and
 * executes the test runner if everything is properly configured.
 * 
 * This block handles:
 * - Environment validation
 * - Error handling for setup issues
 * - Graceful script termination
 */
if (require.main === module) {
  // Script is being executed directly
  console.log('🧪 Node.js Tutorial Backend Test Runner');
  console.log('📝 Validating test environment...');
  
  // Validate environment before running tests
  if (!validateEnvironment()) {
    console.error('');
    console.error('💥 Environment validation failed');
    console.error('🛠️  Please resolve the issues above and try again');
    process.exit(1);
  }
  
  console.log('✅ Environment validation passed');
  console.log('');
  
  // Execute the test runner
  runTests();
} else {
  // Script is being imported as a module
  // Export the runTests function for programmatic use
  module.exports = { runTests, validateEnvironment };
}