/**
 * Code Coverage Report Generation Script
 * 
 * This script generates a comprehensive code coverage report for the Node.js/Express.js 
 * tutorial application's backend using Jest. It is designed to be run as part of the 
 * test automation pipeline, either directly or as an npm script, to ensure that all 
 * relevant test suites (unit, integration, performance, e2e) are included in the 
 * coverage analysis.
 * 
 * The script sets up the test environment, invokes Jest with coverage flags and the 
 * correct configuration, outputs coverage summaries in both text and HTML formats, 
 * and handles process exit codes for CI/CD compatibility.
 * 
 * Features:
 * - Robust cross-platform execution using Node.js built-in modules
 * - CI/CD pipeline integration with proper exit code handling
 * - Real-time output streaming for immediate feedback
 * - Comprehensive coverage report generation (text and HTML)
 * - Environment-aware configuration and error handling
 * - Programmatic API for integration with other tools
 * 
 * Compatible with:
 * - Node.js 18+
 * - Express.js 5.1.0
 * - Jest 29.7.0
 * - CI/CD pipelines (GitHub Actions, Jenkins, etc.)
 * - Cross-platform environments (Windows, macOS, Linux)
 * 
 * Usage:
 * - Direct execution: node generate-coverage-report.js
 * - NPM script: npm run test:coverage
 * - CI/CD pipeline: npm run test:ci
 * - Programmatic: const { generateCoverageReport } = require('./generate-coverage-report');
 */

// Node.js built-in modules for cross-platform compatibility
const path = require('node:path'); // path@builtin - Node.js built-in path utilities
const process = require('node:process'); // process@builtin - Node.js built-in process utilities
const { spawn } = require('node:child_process'); // child_process@builtin - Node.js built-in child process utilities
const console = require('node:console'); // console@builtin - Node.js built-in console utilities

// Import Jest configuration for test runner setup
const jestConfig = require('../jest.config.js');

// Global constants for coverage report generation
const COVERAGE_DIR = path.resolve(__dirname, '../coverage');
const JEST_CONFIG_PATH = path.resolve(__dirname, '../jest.config.js');

/**
 * Generates a comprehensive code coverage report for all test suites
 * 
 * This function runs Jest with coverage enabled for all test types (unit, integration, 
 * performance, e2e), outputs coverage summary in text and HTML formats, and exits with 
 * appropriate status code for CI/CD integration.
 * 
 * The function ensures consistent test environment setup, proper Jest configuration,
 * and robust error handling for both local development and CI/CD pipeline execution.
 * 
 * @returns {Promise<void>} Resolves when coverage report generation completes successfully,
 *                          rejects or exits with error code on failure
 * 
 * @throws {Error} Throws error if Jest configuration is invalid or coverage generation fails
 * 
 * @example
 * // Direct usage
 * generateCoverageReport()
 *   .then(() => console.log('Coverage report generated successfully'))
 *   .catch(error => console.error('Coverage generation failed:', error));
 * 
 * @example
 * // CI/CD integration
 * if (require.main === module) {
 *   generateCoverageReport();
 * }
 */
async function generateCoverageReport() {
  try {
    // Step 1: Set NODE_ENV to 'test' for consistent test environment
    // This ensures environment-aware code paths, configuration, and error handling
    // are properly set for test execution across all platforms
    process.env.NODE_ENV = 'test';
    
    console.log('🧪 Starting code coverage report generation...');
    console.log(`📁 Coverage directory: ${COVERAGE_DIR}`);
    console.log(`⚙️  Jest configuration: ${JEST_CONFIG_PATH}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    
    // Step 2: Resolve the coverage output directory and Jest config path using path.resolve
    // This ensures cross-platform compatibility and proper path resolution relative to script location
    const coverageOutputDir = path.resolve(COVERAGE_DIR);
    const jestConfigPath = path.resolve(JEST_CONFIG_PATH);
    
    // Validate that Jest configuration exists and is accessible
    try {
      require(jestConfigPath);
      console.log('✅ Jest configuration loaded successfully');
    } catch (configError) {
      console.error('❌ Failed to load Jest configuration:', configError.message);
      process.exit(1);
    }
    
    // Step 3: Build the Jest CLI command with --coverage, --config, and --coverageDirectory flags
    // This ensures comprehensive coverage collection across all test types and proper output formatting
    const jestCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const jestArgs = [
      'jest',
      '--coverage',
      '--config', jestConfigPath,
      '--coverageDirectory', coverageOutputDir,
      '--coverageReporters', 'text',
      '--coverageReporters', 'html',
      '--watchAll=false', // Disable watch mode for CI/CD compatibility
      '--passWithNoTests', // Allow execution even if no tests are found
      '--silent=false', // Enable output for real-time feedback
      '--verbose=false' // Reduce verbose output for cleaner CI logs
    ];
    
    console.log('🚀 Executing Jest with coverage collection...');
    console.log(`📝 Command: ${jestCommand} ${jestArgs.join(' ')}`);
    
    // Step 4: Spawn a child process to run Jest with the constructed arguments
    // This ensures isolation from the parent process and robust error handling
    const jestProcess = spawn(jestCommand, jestArgs, {
      stdio: 'pipe', // Pipe stdout/stderr for real-time feedback
      shell: true,   // Enable shell for cross-platform compatibility
      env: {
        ...process.env,
        NODE_ENV: 'test', // Ensure test environment is explicitly set
        FORCE_COLOR: '1'  // Enable colored output for better readability
      }
    });
    
    // Step 5: Pipe stdout and stderr from the child process to the main process for real-time feedback
    // This provides immediate visibility into test execution progress and coverage generation
    jestProcess.stdout.on('data', (data) => {
      process.stdout.write(data);
    });
    
    jestProcess.stderr.on('data', (data) => {
      process.stderr.write(data);
    });
    
    // Handle process errors (e.g., command not found, spawn failures)
    jestProcess.on('error', (error) => {
      console.error('❌ Failed to start Jest process:', error.message);
      process.exit(1);
    });
    
    // Step 6: On process exit, check the exit code and handle success/failure scenarios
    jestProcess.on('close', (exitCode) => {
      console.log(`\n📊 Jest process completed with exit code: ${exitCode}`);
      
      if (exitCode === 0) {
        // Success case: Jest completed successfully with coverage generation
        console.log('✅ Code coverage report generated successfully!');
        console.log(`📄 Text coverage summary displayed above`);
        console.log(`🌐 HTML coverage report: ${path.join(coverageOutputDir, 'index.html')}`);
        console.log(`📁 Full coverage details: ${coverageOutputDir}`);
        
        // Optional: Validate that coverage files exist
        const fs = require('fs');
        const htmlReportPath = path.join(coverageOutputDir, 'index.html');
        
        if (fs.existsSync(htmlReportPath)) {
          console.log('✅ HTML coverage report file created successfully');
        } else {
          console.warn('⚠️  HTML coverage report file not found (this may be expected in some configurations)');
        }
        
        // Exit with success code for CI/CD integration
        process.exit(0);
      } else {
        // Failure case: Jest failed or tests failed
        console.error('❌ Code coverage report generation failed');
        console.error(`💥 Jest exited with code: ${exitCode}`);
        console.error('🔍 Check test failures or configuration issues above');
        
        // Exit with the same error code as Jest for CI/CD integration
        process.exit(exitCode);
      }
    });
    
    // Return a promise that resolves when the process completes successfully
    return new Promise((resolve, reject) => {
      jestProcess.on('close', (exitCode) => {
        if (exitCode === 0) {
          resolve();
        } else {
          reject(new Error(`Jest process exited with code ${exitCode}`));
        }
      });
      
      jestProcess.on('error', (error) => {
        reject(error);
      });
    });
    
  } catch (error) {
    // Handle any unexpected errors during coverage generation setup
    console.error('❌ Unexpected error during coverage report generation:', error.message);
    console.error('🔍 Stack trace:', error.stack);
    process.exit(1);
  }
}

// Export the main function for programmatic use
module.exports = {
  generateCoverageReport
};

// Script entrypoint: If run directly, invoke generateCoverageReport() and handle process exit codes
if (require.main === module) {
  console.log('🎯 Running coverage report generation script...');
  console.log('⏰ Start time:', new Date().toISOString());
  
  // Execute the coverage report generation
  generateCoverageReport()
    .then(() => {
      console.log('⏰ Completion time:', new Date().toISOString());
      console.log('🎉 Coverage report generation completed successfully!');
    })
    .catch((error) => {
      console.error('⏰ Error time:', new Date().toISOString());
      console.error('💥 Coverage report generation failed:', error.message);
      process.exit(1);
    });
}

/**
 * Usage Examples:
 * 
 * 1. Direct execution:
 *    node src/test/scripts/generate-coverage-report.js
 * 
 * 2. NPM script integration (package.json):
 *    {
 *      "scripts": {
 *        "test:coverage": "node src/test/scripts/generate-coverage-report.js",
 *        "test:ci": "node src/test/scripts/generate-coverage-report.js"
 *      }
 *    }
 * 
 * 3. Programmatic usage:
 *    const { generateCoverageReport } = require('./src/test/scripts/generate-coverage-report');
 *    await generateCoverageReport();
 * 
 * 4. CI/CD pipeline integration:
 *    - GitHub Actions: npm run test:coverage
 *    - Jenkins: npm run test:ci
 *    - Azure DevOps: npm run test:coverage
 * 
 * Quality Assurance Notes:
 * - The script enforces code quality gates by ensuring coverage is always up-to-date
 * - Can be extended to fail the build if coverage thresholds are not met
 * - Provides comprehensive reporting for code review and quality assessment
 * - Supports both local development and automated CI/CD pipeline execution
 * 
 * Extensibility Notes:
 * - Can be extended to support custom coverage reporters
 * - Can be modified to upload coverage artifacts to CI/CD systems
 * - Can be integrated with code quality dashboards (SonarQube, CodeClimate, etc.)
 * - Supports additional Jest configuration options as needed
 * 
 * Cross-platform Compatibility:
 * - Uses Node.js built-in modules for maximum compatibility
 * - Handles Windows/Unix path differences automatically
 * - Supports shell command execution across platforms
 * - Provides consistent behavior on macOS, Linux, and Windows
 */