/**
 * Jest Configuration for Node.js Tutorial Backend
 * 
 * This configuration file defines the Jest testing framework setup for the Node.js tutorial
 * backend application. It configures the test environment, coverage collection, thresholds,
 * and reporting to ensure robust, maintainable, and production-quality test coverage.
 * 
 * Features:
 * - Node.js test environment optimized for server-side testing
 * - Comprehensive code coverage collection and reporting
 * - Multiple coverage report formats for different use cases
 * - Enforced coverage thresholds for quality assurance
 * - Educational clarity with extensive documentation
 * - CI/CD integration support
 * 
 * @version 1.0.0
 * @requires jest@^29.0.0
 * @author Node.js Tutorial Team
 * @since 2024-01-01
 */

module.exports = {
  /**
   * Test Environment Configuration
   * 
   * Specifies the test environment for Jest execution. Using 'node' environment
   * for server-side JavaScript testing with Node.js APIs available.
   * 
   * Options:
   * - 'node': Node.js environment with Node.js globals and APIs
   * - 'jsdom': Browser-like environment (not needed for backend testing)
   * 
   * @type {string}
   * @default 'node'
   */
  testEnvironment: 'node',

  /**
   * Coverage Collection Configuration
   * 
   * Enables automatic code coverage collection during test execution.
   * Coverage data is collected for all executed code paths and provides
   * insights into test completeness and code quality.
   * 
   * Benefits:
   * - Identifies untested code paths
   * - Supports quality assurance metrics
   * - Enables coverage-based quality gates
   * - Provides visibility into test effectiveness
   * 
   * @type {boolean}
   * @default true
   */
  collectCoverage: true,

  /**
   * Coverage Output Directory
   * 
   * Specifies the directory where coverage reports are generated.
   * This directory contains all coverage artifacts including HTML reports,
   * LCOV files, and JSON coverage data.
   * 
   * Directory Structure:
   * - coverage/
   *   ├── html/          # HTML coverage reports
   *   ├── lcov/          # LCOV coverage data
   *   └── coverage.json  # Raw coverage data
   * 
   * @type {string}
   * @default 'coverage'
   */
  coverageDirectory: 'coverage',

  /**
   * Coverage Reporters Configuration
   * 
   * Defines the output formats for coverage reports. Multiple reporters
   * support different use cases and integration requirements.
   * 
   * Reporter Types:
   * - 'text': Console output for immediate feedback during development
   * - 'lcov': LCOV format for CI/CD integration and external tools
   * - 'html': Interactive HTML reports for detailed coverage analysis
   * 
   * Use Cases:
   * - Development: Real-time coverage feedback via console
   * - CI/CD: LCOV format for automated quality gates
   * - Analysis: HTML reports for detailed coverage review
   * 
   * @type {Array<string>}
   * @default ['text', 'lcov', 'html']
   */
  coverageReporters: ['text', 'lcov', 'html'],

  /**
   * Coverage Thresholds Configuration
   * 
   * Defines minimum coverage requirements for different coverage metrics.
   * Tests fail if coverage falls below these thresholds, ensuring
   * consistent code quality and test completeness.
   * 
   * Threshold Categories:
   * - branches: Decision branches (if/else, switch, ternary)
   * - functions: Function declarations and expressions
   * - lines: Executable lines of code
   * - statements: Individual statements
   * 
   * Quality Standards:
   * - High-quality projects typically maintain 80%+ coverage
   * - Critical functions should have 90%+ coverage
   * - Branch coverage ensures decision logic testing
   * - Statement coverage verifies code execution
   * 
   * @type {Object}
   */
  coverageThreshold: {
    /**
     * Global Coverage Thresholds
     * 
     * Applied to the entire codebase to ensure overall quality.
     * These thresholds represent industry best practices for
     * educational and production-ready applications.
     * 
     * Threshold Rationale:
     * - branches: 70% - Ensures most decision paths are tested
     * - functions: 90% - High function coverage for API reliability
     * - lines: 80% - Comprehensive line coverage for quality assurance
     * - statements: 80% - Statement execution verification
     * 
     * @type {Object}
     */
    global: {
      /**
       * Branch Coverage Threshold
       * 
       * Minimum percentage of decision branches that must be executed
       * during testing. Branch coverage ensures that conditional logic
       * (if/else, switch, ternary operators) is properly tested.
       * 
       * @type {number}
       * @minimum 0
       * @maximum 100
       * @default 70
       */
      branches: 70,

      /**
       * Function Coverage Threshold
       * 
       * Minimum percentage of functions that must be invoked during
       * testing. Function coverage ensures that all exported functions
       * and methods are exercised by the test suite.
       * 
       * @type {number}
       * @minimum 0
       * @maximum 100
       * @default 90
       */
      functions: 90,

      /**
       * Line Coverage Threshold
       * 
       * Minimum percentage of executable lines that must be executed
       * during testing. Line coverage provides a comprehensive view
       * of code execution completeness.
       * 
       * @type {number}
       * @minimum 0
       * @maximum 100
       * @default 80
       */
      lines: 80,

      /**
       * Statement Coverage Threshold
       * 
       * Minimum percentage of statements that must be executed during
       * testing. Statement coverage ensures that individual code
       * statements are properly exercised.
       * 
       * @type {number}
       * @minimum 0
       * @maximum 100
       * @default 80
       */
      statements: 80
    }
  },

  /**
   * Test File Patterns
   * 
   * Jest automatically discovers test files based on naming conventions.
   * Default patterns include:
   * - **/__tests__/**/*.js
   * - **/?(*.)+(spec|test).js
   * 
   * This configuration uses Jest defaults for maximum compatibility
   * with standard Node.js project structures.
   * 
   * @type {Array<string>}
   * @default undefined (uses Jest defaults)
   */
  // testMatch: undefined, // Use Jest defaults

  /**
   * Setup and Teardown Configuration
   * 
   * These configurations can be uncommented and customized for
   * advanced testing scenarios requiring global setup/teardown.
   * 
   * @type {string}
   * @default undefined
   */
  // setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  // globalSetup: '<rootDir>/test/globalSetup.js',
  // globalTeardown: '<rootDir>/test/globalTeardown.js',

  /**
   * Module and Transform Configuration
   * 
   * These configurations can be customized for projects requiring
   * module resolution or code transformation.
   * 
   * @type {Object}
   * @default undefined
   */
  // moduleNameMapper: {
  //   '^@/(.*)$': '<rootDir>/src/$1'
  // },
  // transform: {
  //   '^.+\\.js$': 'babel-jest'
  // },

  /**
   * Verbose Output Configuration
   * 
   * Controls the verbosity of test output. Can be enabled for
   * detailed test execution information during development.
   * 
   * @type {boolean}
   * @default false
   */
  verbose: false,

  /**
   * Bail Configuration
   * 
   * Controls whether Jest stops running tests after the first
   * test failure. Useful for fast feedback during development.
   * 
   * @type {boolean}
   * @default false
   */
  bail: false,

  /**
   * Cache Configuration
   * 
   * Enables Jest's caching mechanism for improved performance
   * across test runs. Cache is stored in node_modules/.cache/jest.
   * 
   * @type {boolean}
   * @default true
   */
  cache: true,

  /**
   * Clear Mocks Configuration
   * 
   * Automatically clears mock calls and instances between tests
   * to prevent test interference and ensure test isolation.
   * 
   * @type {boolean}
   * @default false
   */
  clearMocks: true,

  /**
   * Collect Coverage From Configuration
   * 
   * Specifies which files to include in coverage collection.
   * This configuration can be customized to include or exclude
   * specific files or directories.
   * 
   * @type {Array<string>}
   * @default undefined
   */
  // collectCoverageFrom: [
  //   'src/**/*.js',
  //   '!src/index.js', // Exclude entry point
  //   '!src/**/*.test.js' // Exclude test files
  // ],

  /**
   * Error Handling Configuration
   * 
   * Controls how Jest handles errors during test execution.
   * These settings ensure robust error reporting and debugging.
   * 
   * @type {boolean}
   * @default false
   */
  errorOnDeprecated: true,

  /**
   * Watch Mode Configuration
   * 
   * These configurations optimize Jest's watch mode for
   * development workflow and file change detection.
   * 
   * @type {boolean}
   * @default true
   */
  watchman: true,

  /**
   * Timeout Configuration
   * 
   * Sets the default timeout for test execution. Adjusted for
   * typical Node.js server testing scenarios.
   * 
   * @type {number}
   * @default 5000
   */
  testTimeout: 10000,

  /**
   * Maximum Worker Configuration
   * 
   * Controls the number of worker processes Jest uses for
   * parallel test execution. Optimized for CI/CD environments.
   * 
   * @type {string|number}
   * @default '50%'
   */
  maxWorkers: '50%',

  /**
   * Notification Configuration
   * 
   * Controls whether Jest shows system notifications for
   * test results. Useful for development workflow.
   * 
   * @type {boolean}
   * @default false
   */
  notify: false,

  /**
   * Force Exit Configuration
   * 
   * Forces Jest to exit after all tests complete, preventing
   * hanging processes in CI/CD environments.
   * 
   * @type {boolean}
   * @default false
   */
  forceExit: false,

  /**
   * Detect Open Handles Configuration
   * 
   * Enables detection of handles that prevent Jest from
   * exiting cleanly. Useful for debugging resource leaks.
   * 
   * @type {boolean}
   * @default false
   */
  detectOpenHandles: true,

  /**
   * Detect Leaked Handles Configuration
   * 
   * Enables detection of leaked handles that may cause
   * memory leaks or prevent clean process termination.
   * 
   * @type {boolean}
   * @default false
   */
  detectLeaks: false,

  /**
   * Coverage Path Ignore Patterns
   * 
   * Specifies patterns for files to exclude from coverage
   * collection. Useful for excluding vendor code or test utilities.
   * 
   * @type {Array<string>}
   * @default undefined
   */
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/dist/',
    '/build/'
  ],

  /**
   * Test Path Ignore Patterns
   * 
   * Specifies patterns for files to exclude from test discovery.
   * Prevents Jest from treating non-test files as test files.
   * 
   * @type {Array<string>}
   * @default undefined
   */
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/dist/',
    '/build/'
  ]
};