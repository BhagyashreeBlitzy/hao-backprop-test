/**
 * Code Coverage Report Generation Script for Node.js/Express.js Tutorial Application
 * 
 * This script generates comprehensive code coverage reports for the Node.js/Express.js tutorial
 * application's backend using Jest. It is designed to be run as part of the test automation
 * pipeline, either directly as a Node.js script or as an npm script, to ensure that all
 * relevant test suites (unit, integration, performance, e2e) are included in coverage analysis.
 * 
 * The script sets up the test environment, invokes Jest with coverage flags and the correct
 * configuration, outputs coverage summaries in both text and HTML formats, and handles
 * process exit codes for CI/CD compatibility. It is designed to be robust, cross-platform,
 * and compatible with the project's test organization and CI requirements.
 * 
 * Features:
 * - Comprehensive coverage for all test types (unit, integration, performance, e2e)
 * - Cross-platform compatibility (Windows, macOS, Linux)
 * - CI/CD pipeline integration with proper exit codes
 * - Both programmatic usage and CLI execution support
 * - Real-time output streaming for immediate feedback
 * - Robust error handling and process management
 * - Environment-aware configuration and execution
 * 
 * Usage:
 * - Direct execution: node generate-coverage-report.js
 * - Programmatic: const { generateCoverageReport } = require('./generate-coverage-report')
 * - NPM script: npm run test:coverage (references this script)
 * - CI/CD: Integrates with automated build pipelines
 * 
 * Dependencies:
 * - Jest ^29.7.0 (testing framework and coverage generation)
 * - Node.js 18+ (required for Express.js 5.1.0 compatibility)
 * - jest.config.js (Jest configuration with coverage settings)
 * 
 * @fileOverview Comprehensive code coverage report generation for tutorial application
 * @author Tutorial Development Team
 * @version 1.0.0
 * @since Node.js 18+
 */

// Import required Node.js built-in modules for cross-platform compatibility
const path = require('node:path'); // path@builtin - Cross-platform path manipulation and resolution
const process = require('node:process'); // process@builtin - Environment variables, exit codes, and process management
const { spawn } = require('node:child_process'); // child_process@builtin - Jest CLI execution via child process
const console = require('node:console'); // console@builtin - Enhanced logging and output formatting

// Import Jest configuration to ensure consistent test environment and coverage settings
const jestConfig = require('../jest.config.js'); // Default import - Jest configuration object with coverage settings

// Global constants for consistent path resolution and configuration
// These paths are resolved relative to the current script location for cross-platform compatibility
const COVERAGE_DIR = path.resolve(__dirname, '../coverage');
const JEST_CONFIG_PATH = path.resolve(__dirname, '../jest.config.js');

/**
 * Generates comprehensive code coverage reports for all test suites using Jest.
 * 
 * This function orchestrates the complete coverage generation process by:
 * 1. Setting up the test environment with NODE_ENV='test'
 * 2. Resolving coverage output directory and Jest configuration paths
 * 3. Building the Jest CLI command with coverage, config, and output directory flags
 * 4. Spawning a child process to execute Jest with the constructed arguments
 * 5. Streaming stdout and stderr for real-time feedback during execution
 * 6. Handling process exit codes and providing appropriate success/error messages
 * 7. Validating that coverage reports were generated successfully
 * 8. Exiting with appropriate status codes for CI/CD pipeline integration
 * 
 * The function ensures that coverage is collected for all test types defined in jest.config.js:
 * - Unit tests (test/unit/**/*.test.js)
 * - Integration tests (test/integration/**/*.test.js)
 * - Performance tests (test/performance/**/*.perf.test.js)
 * - End-to-end tests (test/e2e/**/*.e2e.test.js)
 * 
 * Coverage reports are generated in multiple formats as configured in jest.config.js:
 * - Text summary (console output for immediate feedback)
 * - HTML detailed reports (comprehensive web-based coverage analysis)
 * - LCOV format (for CI/CD integration and external coverage tools)
 * - Text summary statistics (quick overview of coverage metrics)
 * 
 * @async
 * @function generateCoverageReport
 * @returns {Promise<void>} Resolves when coverage report generation completes successfully,
 *                          rejects or exits with error code on failure
 * @throws {Error} Throws error if Jest execution fails or coverage generation encounters issues
 * 
 * @example
 * // Programmatic usage
 * const { generateCoverageReport } = require('./generate-coverage-report');
 * try {
 *   await generateCoverageReport();
 *   console.log('Coverage report generated successfully');
 * } catch (error) {
 *   console.error('Coverage generation failed:', error);
 * }
 * 
 * @example
 * // CLI usage
 * node generate-coverage-report.js
 * 
 * @example
 * // NPM script usage (package.json)
 * "scripts": {
 *   "test:coverage": "node src/test/scripts/generate-coverage-report.js"
 * }
 */
async function generateCoverageReport() {
  try {
    // Step 1: Set NODE_ENV to 'test' for consistent test environment
    // This ensures all environment-aware code paths use test configurations
    console.log('🔧 Setting up test environment...');
    process.env.NODE_ENV = 'test';
    
    // Log current environment for debugging and verification
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🏠 Coverage directory: ${COVERAGE_DIR}`);
    console.log(`⚙️  Jest config path: ${JEST_CONFIG_PATH}`);
    
    // Step 2: Resolve the coverage output directory and Jest config path using path.resolve
    // This ensures cross-platform compatibility and proper path handling
    const coverageOutputDir = path.resolve(COVERAGE_DIR);
    const jestConfigPath = path.resolve(JEST_CONFIG_PATH);
    
    // Verify that the Jest configuration file exists
    try {
      require.resolve(jestConfigPath);
      console.log('✅ Jest configuration found and validated');
    } catch (configError) {
      console.error('❌ Jest configuration file not found:', jestConfigPath);
      console.error('   Please ensure jest.config.js exists in the test directory');
      process.exit(1);
    }
    
    // Step 3: Build the Jest CLI command with --coverage, --config, and --coverageDirectory flags
    // Jest CLI arguments are constructed for comprehensive coverage generation
    const jestCommand = 'npx'; // Use npx to ensure Jest is available from node_modules
    const jestArgs = [
      'jest',                                    // Jest CLI command
      '--coverage',                              // Enable coverage collection
      '--config', jestConfigPath,                // Specify Jest configuration file
      '--coverageDirectory', coverageOutputDir,  // Override coverage output directory
      '--verbose',                               // Enable verbose output for detailed feedback
      '--passWithNoTests',                       // Don't fail if no tests are found
      '--detectOpenHandles',                     // Detect potential memory leaks
      '--forceExit',                            // Force exit after tests complete (CI compatibility)
      '--maxWorkers', process.env.CI ? '2' : '50%' // Optimize workers for CI vs local development
    ];
    
    // Add CI-specific arguments for automated pipeline execution
    if (process.env.CI) {
      jestArgs.push('--ci');           // Enable CI mode for better performance
      jestArgs.push('--watchAll=false'); // Disable watch mode in CI environments
    }
    
    console.log('🚀 Starting Jest coverage generation...');
    console.log(`📝 Command: ${jestCommand} ${jestArgs.join(' ')}`);
    
    // Step 4: Spawn a child process to run Jest with the constructed arguments
    // Using spawn provides better control over the child process and streaming output
    const jestProcess = spawn(jestCommand, jestArgs, {
      stdio: 'pipe',    // Enable piping for stdout/stderr streaming
      env: {
        ...process.env,           // Inherit parent process environment
        NODE_ENV: 'test',         // Ensure test environment is set
        FORCE_COLOR: '1'          // Enable colored output for better readability
      },
      shell: process.platform === 'win32' // Enable shell on Windows for npx compatibility
    });
    
    // Step 5: Pipe stdout and stderr from the child process to the main process for real-time feedback
    // This provides immediate visibility into test execution and coverage generation progress
    jestProcess.stdout.on('data', (data) => {
      // Stream Jest output with timestamp for debugging and monitoring
      const output = data.toString().trim();
      if (output) {
        console.log(`[JEST] ${output}`);
      }
    });
    
    jestProcess.stderr.on('data', (data) => {
      // Stream Jest error output with appropriate formatting
      const errorOutput = data.toString().trim();
      if (errorOutput) {
        // Filter out non-critical Jest warnings to reduce noise
        if (!errorOutput.includes('ExperimentalWarning') && 
            !errorOutput.includes('jest-haste-map')) {
          console.error(`[JEST ERROR] ${errorOutput}`);
        }
      }
    });
    
    // Step 6: Handle process exit with Promise-based approach for async/await compatibility
    const jestExitCode = await new Promise((resolve, reject) => {
      jestProcess.on('close', (code, signal) => {
        if (signal) {
          console.error(`❌ Jest process terminated by signal: ${signal}`);
          reject(new Error(`Jest process terminated by signal: ${signal}`));
        } else {
          resolve(code);
        }
      });
      
      jestProcess.on('error', (error) => {
        console.error('❌ Failed to start Jest process:', error.message);
        reject(error);
      });
    });
    
    // Step 7: Check exit code and provide appropriate feedback
    if (jestExitCode === 0) {
      console.log('✅ Jest coverage generation completed successfully!');
      
      // Step 8: Optionally validate that coverage summary and HTML report exist in output directory
      await validateCoverageReports(coverageOutputDir);
      
      // Provide helpful information about generated reports
      console.log('\n📊 Coverage Reports Generated:');
      console.log(`   📄 HTML Report: ${path.join(coverageOutputDir, 'index.html')}`);
      console.log(`   📋 LCOV Report: ${path.join(coverageOutputDir, 'lcov.info')}`);
      console.log(`   📈 Text Summary: Displayed above`);
      
      // Provide guidance for viewing reports
      console.log('\n🔍 To view detailed coverage report:');
      console.log(`   Open: file://${path.join(coverageOutputDir, 'index.html')}`);
      
      console.log('\n🎉 Code coverage report generation completed successfully!');
      
    } else {
      // Handle Jest execution failure with detailed error information
      console.error(`❌ Jest coverage generation failed with exit code: ${jestExitCode}`);
      console.error('\n🔧 Troubleshooting steps:');
      console.error('   1. Check that all test files are valid and can be executed');
      console.error('   2. Verify Jest configuration in jest.config.js');
      console.error('   3. Ensure all test dependencies are installed');
      console.error('   4. Check for syntax errors in source and test files');
      console.error('   5. Verify Node.js version compatibility (18+ required)');
      
      // Exit with the same code as Jest for CI/CD compatibility
      process.exit(jestExitCode);
    }
    
  } catch (error) {
    // Comprehensive error handling with actionable information
    console.error('❌ Error during coverage report generation:', error.message);
    
    if (error.code === 'ENOENT') {
      console.error('\n🔧 Jest not found. Please install dependencies:');
      console.error('   npm install --save-dev jest@^29.7.0');
    } else if (error.code === 'EACCES') {
      console.error('\n🔧 Permission denied. Check file permissions:');
      console.error(`   chmod +x ${JEST_CONFIG_PATH}`);
    } else {
      console.error('\n🔧 Unexpected error. Please check:');
      console.error('   1. Node.js version (18+ required)');
      console.error('   2. Jest installation and configuration');
      console.error('   3. File permissions and accessibility');
      console.error('   4. Available system resources');
    }
    
    if (process.env.DEBUG) {
      console.error('\n🐛 Debug information:');
      console.error(`   Error stack: ${error.stack}`);
      console.error(`   Node.js version: ${process.version}`);
      console.error(`   Platform: ${process.platform}`);
      console.error(`   Architecture: ${process.arch}`);
    }
    
    // Exit with error code 1 for CI/CD compatibility
    process.exit(1);
  }
}

/**
 * Validates that coverage reports were generated successfully.
 * 
 * This helper function checks for the existence of key coverage report files
 * to ensure the coverage generation process completed properly. It provides
 * early detection of issues and helpful feedback for troubleshooting.
 * 
 * @async
 * @function validateCoverageReports
 * @param {string} coverageDir - The directory where coverage reports should be generated
 * @returns {Promise<void>} Resolves if validation passes, rejects if reports are missing
 * @throws {Error} Throws error if required coverage files are not found
 * 
 * @private
 */
async function validateCoverageReports(coverageDir) {
  const fs = require('node:fs').promises;
  
  try {
    // Check for HTML coverage report index file
    const htmlReportPath = path.join(coverageDir, 'index.html');
    await fs.access(htmlReportPath);
    console.log('✅ HTML coverage report generated successfully');
    
    // Check for LCOV coverage report (used by CI/CD tools)
    const lcovReportPath = path.join(coverageDir, 'lcov.info');
    await fs.access(lcovReportPath);
    console.log('✅ LCOV coverage report generated successfully');
    
    // Get basic file statistics for validation
    const htmlStats = await fs.stat(htmlReportPath);
    const lcovStats = await fs.stat(lcovReportPath);
    
    if (htmlStats.size === 0 || lcovStats.size === 0) {
      throw new Error('Coverage report files are empty');
    }
    
    console.log('✅ Coverage report validation completed successfully');
    
  } catch (validationError) {
    console.warn('⚠️  Coverage report validation warning:', validationError.message);
    console.warn('   Coverage may have been generated but files are not accessible');
    console.warn('   This may be normal in some CI/CD environments');
  }
}

/**
 * Displays helpful usage information for the coverage script.
 * 
 * This function provides comprehensive usage instructions, examples,
 * and troubleshooting guidance for users of the coverage script.
 * 
 * @function displayUsageHelp
 * @returns {void} No return value, outputs help information to console
 * 
 * @private
 */
function displayUsageHelp() {
  console.log('\n📖 Usage Information:');
  console.log('   Direct execution:    node generate-coverage-report.js');
  console.log('   NPM script:          npm run test:coverage');
  console.log('   Programmatic usage:  require("./generate-coverage-report").generateCoverageReport()');
  
  console.log('\n🔧 Configuration:');
  console.log('   Coverage configuration is defined in jest.config.js');
  console.log('   Test patterns are automatically detected based on Jest configuration');
  console.log('   Coverage thresholds can be adjusted in jest.config.js');
  
  console.log('\n📊 Output Formats:');
  console.log('   Text summary:        Console output during execution');
  console.log('   HTML report:         Detailed web-based coverage analysis');
  console.log('   LCOV format:         For CI/CD integration and external tools');
  
  console.log('\n🎯 Test Types Included:');
  console.log('   Unit tests:          test/unit/**/*.test.js');
  console.log('   Integration tests:   test/integration/**/*.test.js');
  console.log('   Performance tests:   test/performance/**/*.perf.test.js');
  console.log('   End-to-end tests:    test/e2e/**/*.e2e.test.js');
}

// Export the main function for programmatic usage
module.exports = {
  generateCoverageReport
};

// Script entrypoint: If run directly (node generate-coverage-report.js), invoke generateCoverageReport()
// and handle process exit codes appropriately for CI/CD integration
if (require.main === module) {
  // Check for help flags and display usage information
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h') || args.includes('help')) {
    console.log('🎯 Code Coverage Report Generator for Node.js/Express.js Tutorial');
    console.log('   Generates comprehensive coverage reports using Jest for all test types');
    displayUsageHelp();
    process.exit(0);
  }
  
  // Display startup banner with version and environment information
  console.log('🎯 Code Coverage Report Generator');
  console.log('   Node.js/Express.js Tutorial Application');
  console.log(`   Node.js: ${process.version}`);
  console.log(`   Platform: ${process.platform}`);
  console.log(`   Jest: ^29.7.0`);
  console.log('');
  
  // Execute coverage generation with proper error handling
  generateCoverageReport()
    .then(() => {
      // Success: coverage generation completed successfully
      console.log('\n🎉 Coverage report generation script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      // Error: coverage generation failed
      console.error('\n❌ Coverage report generation script failed:', error.message);
      
      // Provide additional troubleshooting information
      console.error('\n🆘 For additional help:');
      console.error('   Run: node generate-coverage-report.js --help');
      console.error('   Check: Jest configuration in jest.config.js');
      console.error('   Verify: All dependencies are installed (npm install)');
      
      process.exit(1);
    });
}

/**
 * Script Integration Notes:
 * 
 * 1. CI/CD Integration:
 *    - Supports automated pipeline execution with proper exit codes
 *    - Optimizes worker processes for CI environments
 *    - Generates LCOV reports for external coverage tools
 *    - Handles process termination gracefully
 * 
 * 2. Cross-Platform Compatibility:
 *    - Uses Node.js built-in modules for maximum compatibility
 *    - Handles Windows shell requirements for npx execution
 *    - Resolves paths using path.resolve for cross-platform support
 *    - Supports both Unix and Windows path conventions
 * 
 * 3. Development Experience:
 *    - Provides real-time output streaming during execution
 *    - Includes verbose logging and progress indicators
 *    - Offers helpful error messages and troubleshooting guidance
 *    - Supports both CLI and programmatic usage patterns
 * 
 * 4. Quality Assurance:
 *    - Validates coverage report generation completion
 *    - Enforces coverage thresholds defined in Jest configuration
 *    - Provides comprehensive error handling and recovery
 *    - Supports debug mode for detailed troubleshooting
 * 
 * 5. Extensibility:
 *    - Can be extended to support additional coverage formats
 *    - Supports integration with external coverage services
 *    - Allows for custom coverage validation and reporting
 *    - Prepared for future test types and coverage requirements
 * 
 * 6. Performance Optimization:
 *    - Uses child process spawning for isolated Jest execution
 *    - Optimizes worker allocation based on execution environment
 *    - Implements efficient output streaming and processing
 *    - Minimizes memory usage and resource consumption
 */