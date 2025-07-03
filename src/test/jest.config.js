/**
 * Jest Configuration for Node.js Hello World Tutorial Backend Test Suite
 * 
 * This file provides a canonical Jest configuration for the test suite,
 * ensuring all test code is executed in a Node.js environment with code
 * coverage enabled and results output to the coverage directory.
 * 
 * The configuration supports all test types (unit, integration, performance, e2e)
 * as per the technical specification and is compatible with CI/CD pipelines
 * and cross-platform test execution.
 * 
 * Compatible with:
 * - Node.js 18+
 * - Express.js 5.1.0
 * - Jest 29.7.0
 * - CI/CD pipelines
 * 
 * Referenced by:
 * - npm scripts in package.json
 * - Test runners in local and CI environments
 * - Continuous Integration workflows
 */

module.exports = {
  /**
   * The test environment that will be used for testing.
   * Jest environment for Node.js applications running server-side code.
   * 
   * @type {string}
   */
  testEnvironment: 'node',

  /**
   * The root directory that Jest should scan for tests and modules within.
   * Set relative to the jest.config.js file location to point to the test directory.
   * 
   * @type {string}
   */
  rootDir: '../test',

  /**
   * A list of paths to modules that run some code to configure or
   * set up the testing framework before each test file in the suite is executed.
   * 
   * Points to the test environment setup script that initializes globals,
   * mocks, or environment variables before tests run.
   * 
   * @type {Array<string>}
   */
  setupFilesAfterEnv: [
    '<rootDir>/setup.js'
  ],

  /**
   * Indicates whether the coverage information should be collected while executing the test.
   * Because collection coverage slows down test execution, this is enabled by default
   * for comprehensive test validation.
   * 
   * @type {boolean}
   */
  collectCoverage: true,

  /**
   * The directory where Jest should output its coverage files.
   * Coverage results are placed one level up from the test directory
   * to maintain project structure organization.
   * 
   * @type {string}
   */
  coverageDirectory: '<rootDir>/../coverage',

  /**
   * A list of reporter names that Jest uses when writing coverage reports.
   * 
   * - 'text': Console output for immediate feedback during development
   * - 'html': HTML report for detailed coverage analysis and CI integration
   * 
   * @type {Array<string>}
   */
  coverageReporters: [
    'text',
    'html'
  ],

  /**
   * The glob patterns Jest uses to detect test files.
   * Supports all test types as defined in the testing strategy:
   * 
   * - Unit tests: Basic functionality and component testing
   * - Integration tests: Component interaction and API testing
   * - Performance tests: Load and response time validation
   * - End-to-end tests: Complete workflow validation
   * 
   * @type {Array<string>}
   */
  testMatch: [
    '<rootDir>/unit/**/*.test.js',
    '<rootDir>/integration/**/*.test.js',
    '<rootDir>/performance/**/*.perf.test.js',
    '<rootDir>/e2e/**/*.e2e.test.js'
  ],

  /**
   * An array of file extensions your modules use.
   * Jest will attempt to scan for test files with these extensions.
   * 
   * Supports JavaScript source files and JSON configuration files
   * commonly used in Node.js applications.
   * 
   * @type {Array<string>}
   */
  moduleFileExtensions: [
    'js',
    'json'
  ],

  /**
   * Default timeout of a test in milliseconds.
   * Set to accommodate various test types including performance tests
   * that may require additional execution time.
   * 
   * @type {number}
   */
  testTimeout: 10000,

  /**
   * Indicates whether each individual test should be reported during the run.
   * Disabled to reduce console noise during test execution while maintaining
   * appropriate feedback for CI/CD pipeline integration.
   * 
   * @type {boolean}
   */
  verbose: false,

  /**
   * The paths to modules that provide some setup code to configure
   * or modify the testing environment before tests run.
   * 
   * This configuration ensures consistent test environment initialization
   * across all test execution contexts (local, CI, cross-platform).
   * 
   * @type {Object}
   */
  testEnvironmentOptions: {
    /**
     * Node.js specific test environment options.
     * Ensures proper Node.js runtime configuration for testing.
     */
  },

  /**
   * A set of global variables that need to be available in all test environments.
   * These are set by the setup script and Jest execution context.
   * 
   * NODE_ENV: Set to 'test' via setup.js or cross-env in npm scripts
   * JEST_WORKER_ID: Set by Jest to isolate test workers
   */
  
  /**
   * The number of seconds after which a test is considered as slow and reported as such in the results.
   * Helps identify performance issues in the test suite itself.
   * 
   * @type {number}
   */
  slowTestThreshold: 5,

  /**
   * Prevents tests from printing messages through the console.
   * Set to false to allow console output during test development and debugging.
   * 
   * @type {boolean}
   */
  silent: false,

  /**
   * Indicates whether Jest should run in watch mode.
   * Controlled via command line options rather than configuration.
   * 
   * @type {boolean}
   */
  watchmode: false
};

/**
 * Configuration Notes:
 * 
 * 1. This configuration is nearly identical to src/backend/jest.config.js,
 *    but is placed in the test folder to allow test-specific overrides
 *    or future extensions.
 * 
 * 2. The configuration ensures all tests are run in a consistent, isolated,
 *    and reproducible environment, with code coverage and test setup
 *    handled centrally.
 * 
 * 3. The configuration is designed to be maintainable, extensible, and
 *    compatible with both local development and automated CI/CD pipelines.
 * 
 * 4. If additional setup or configuration is needed for new test types
 *    or future requirements, this file is the canonical place to add it.
 * 
 * 5. The setupFilesAfterEnv entry points to the test setup script
 *    (setup.js) that initializes environment variables and global mocks
 *    as needed.
 * 
 * Usage:
 * - Referenced by npm scripts: npm test, npm run test:coverage
 * - Used by CI workflows for automated testing
 * - Supports local development with npm run test:watch
 * - Integrates with IDEs that support Jest configuration
 */