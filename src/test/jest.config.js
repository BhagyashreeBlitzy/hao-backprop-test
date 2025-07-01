/**
 * Jest Configuration File for Node.js Hello World Tutorial Test Suite
 * 
 * This configuration file defines the complete Jest testing environment for the Node.js 
 * Hello World tutorial backend application. It provides a robust, maintainable, and 
 * reproducible test configuration for all test types including unit, integration, 
 * performance, and end-to-end tests.
 * 
 * The configuration ensures all tests run in a Node.js environment with code coverage 
 * collection, proper test file matching patterns, and integration with test environment 
 * setup scripts. It is designed for compatibility with Node.js 18+, Express.js 5.1.0, 
 * and CI/CD pipelines.
 * 
 * Referenced by:
 * - npm scripts in package.json (test, test:coverage, test:watch)
 * - CI/CD workflows (.github/workflows/ci.yml)
 * - Local development test runners
 * - Cross-platform test execution environments
 * 
 * Dependencies:
 * - Jest ^29.7.0 (primary testing framework)
 * - setup.js (test environment initialization script)
 * 
 * @fileOverview Jest configuration for comprehensive test suite support
 * @author Tutorial Development Team
 * @version 1.0.0
 * @since Node.js 18+
 */

module.exports = {
  // Test Environment Configuration
  // Specifies the test environment in which Jest will run tests
  // 'node' environment is required for backend Node.js/Express.js testing
  testEnvironment: 'node',

  // Root Directory Configuration
  // Defines the root directory for Jest to search for tests and modules
  // Points to the test directory structure: src/test/
  rootDir: '../test',

  // Test Environment Setup Configuration
  // Specifies scripts to run after Jest environment setup but before test files
  // Ensures consistent test environment initialization across all test types
  setupFilesAfterEnv: [
    '<rootDir>/setup.js'
  ],

  // Code Coverage Configuration
  // Enables comprehensive code coverage collection during test execution
  // Provides visibility into test effectiveness and code quality metrics
  collectCoverage: true,

  // Code Coverage Collection Patterns
  // Specifies which files to include in coverage collection
  // Focuses on application source code while excluding test files and node_modules
  collectCoverageFrom: [
    '<rootDir>/../**/*.js',
    '!<rootDir>/../node_modules/**',
    '!<rootDir>/../test/**',
    '!<rootDir>/../coverage/**',
    '!<rootDir>/../**/*.test.js',
    '!<rootDir>/../**/*.spec.js',
    '!<rootDir>/../**/*.config.js'
  ],

  // Coverage Output Directory
  // Defines where coverage reports will be generated
  // Accessible for both local development and CI/CD pipeline consumption
  coverageDirectory: '<rootDir>/../coverage',

  // Coverage Report Formats
  // Specifies the types of coverage reports to generate
  // 'text' provides console output, 'html' provides detailed web-based reports
  coverageReporters: [
    'text',           // Console output for immediate feedback
    'html',           // Detailed HTML reports for in-depth analysis
    'lcov',           // LCOV format for CI/CD integration
    'text-summary'    // Summary statistics for quick overview
  ],

  // Coverage Thresholds
  // Enforces minimum code coverage requirements to maintain code quality
  // Aligns with testing strategy requirements from technical specification
  coverageThreshold: {
    global: {
      branches: 80,      // Branch coverage minimum
      functions: 90,     // Function coverage minimum  
      lines: 90,         // Line coverage minimum
      statements: 90     // Statement coverage minimum
    }
  },

  // Test File Matching Patterns
  // Defines patterns for locating different types of test files
  // Supports comprehensive test strategy with unit, integration, performance, and e2e tests
  testMatch: [
    '<rootDir>/unit/**/*.test.js',           // Unit tests
    '<rootDir>/integration/**/*.test.js',    // Integration tests
    '<rootDir>/performance/**/*.perf.test.js', // Performance tests
    '<rootDir>/e2e/**/*.e2e.test.js'         // End-to-end tests
  ],

  // Module File Extensions
  // Specifies which file extensions Jest should recognize as modules
  // Supports standard JavaScript and JSON files
  moduleFileExtensions: [
    'js',
    'json'
  ],

  // Test Timeout Configuration
  // Sets the default timeout for all tests in milliseconds
  // Provides sufficient time for HTTP requests and asynchronous operations
  testTimeout: 10000,

  // Test Path Ignore Patterns
  // Specifies directories and files to exclude from test discovery
  // Improves test performance by avoiding unnecessary file scanning
  testPathIgnorePatterns: [
    '<rootDir>/../node_modules/',
    '<rootDir>/../coverage/',
    '<rootDir>/../dist/',
    '<rootDir>/../build/'
  ],

  // Module Path Ignore Patterns
  // Specifies module paths to ignore during module resolution
  // Prevents Jest from scanning irrelevant directories
  modulePathIgnorePatterns: [
    '<rootDir>/../coverage/',
    '<rootDir>/../dist/',
    '<rootDir>/../build/'
  ],

  // Transform Configuration
  // Specifies how to transform files before testing
  // No transformation needed for standard Node.js JavaScript files
  transform: {},

  // Clear Mocks Configuration
  // Automatically clears mock calls and instances between tests
  // Ensures test isolation and prevents test interference
  clearMocks: true,

  // Restore Mocks Configuration
  // Automatically restores mock state between tests
  // Maintains clean test environment for reliable results
  restoreMocks: true,

  // Verbose Output Configuration
  // Controls the verbosity of test output
  // Can be overridden by command line flags or environment variables
  verbose: process.env.JEST_VERBOSE === 'true' || false,

  // Detect Open Handles Configuration
  // Helps identify potential memory leaks and open handles
  // Useful for debugging test environment issues
  detectOpenHandles: process.env.NODE_ENV === 'test',

  // Force Exit Configuration
  // Forces Jest to exit after all tests complete
  // Prevents hanging processes in CI/CD environments
  forceExit: process.env.CI === 'true',

  // Error Handling Configuration
  // Configures how Jest handles different types of errors
  errorOnDeprecated: true,

  // Test Results Processor
  // Optional custom test results processing
  // Currently not required for basic tutorial application
  // testResultsProcessor: undefined,

  // Watch Plugins Configuration
  // Enhances watch mode functionality for development
  // Provides interactive test running experience
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],

  // Notify Configuration
  // Controls desktop notifications for test results
  // Enhances developer experience during active development
  notify: process.env.NODE_ENV === 'development',

  // Notification Mode
  // Specifies when to show notifications
  notifyMode: 'failure-change',

  // Global Setup and Teardown
  // Optional global setup/teardown scripts
  // Currently not required for stateless tutorial application
  // globalSetup: undefined,
  // globalTeardown: undefined,

  // Maximum Worker Configuration
  // Controls the number of worker processes for parallel test execution
  // Optimizes performance based on available system resources
  maxWorkers: process.env.CI ? 2 : '50%',

  // Cache Directory
  // Specifies where Jest stores its cache
  // Improves subsequent test run performance
  cacheDirectory: '<rootDir>/../node_modules/.cache/jest',

  // Project Configuration
  // Enables multi-project Jest configurations if needed in the future
  // Currently configured as single project
  projects: undefined,

  // Runner Configuration
  // Specifies the test runner to use
  // Default Jest runner is sufficient for current requirements
  runner: 'jest-runner',

  // Test Sequence Configuration
  // Controls test execution order and parallelization
  // Maintains deterministic test results
  randomize: false,

  // Snapshot Configuration
  // Controls snapshot testing behavior
  // Currently not applicable for API testing but included for completeness
  updateSnapshot: process.env.UPDATE_SNAPSHOTS === 'true',

  // Bail Configuration
  // Controls whether Jest stops after first test failure
  // Useful for CI/CD pipelines to fail fast
  bail: process.env.CI ? 1 : 0,

  // Collect Coverage From Additional Patterns
  // Ensures comprehensive coverage collection including edge cases
  collectCoverageFrom: [
    '<rootDir>/../src/**/*.js',
    '!<rootDir>/../src/test/**',
    '!<rootDir>/../**/*.test.js',
    '!<rootDir>/../**/*.spec.js',
    '!<rootDir>/../**/*.config.js',
    '!<rootDir>/../**/node_modules/**'
  ],

  // Module Name Mapping
  // Maps module names to different paths for testing
  // Useful for aliasing or mocking modules
  moduleNameMapping: {
    // Add module mappings here if needed for future enhancements
  },

  // Setup Files (executed before setupFilesAfterEnv)
  // Additional setup files that run before the test environment is set up
  // Currently not required but reserved for future needs
  setupFiles: [],

  // Globals Configuration
  // Defines global variables available in all test files
  // Minimal configuration for educational tutorial application
  globals: {
    'NODE_ENV': 'test'
  }
};

/**
 * Configuration Notes:
 * 
 * 1. Test Environment: Configured for Node.js backend testing with Express.js compatibility
 * 2. Coverage: Comprehensive coverage collection with quality thresholds
 * 3. Test Discovery: Supports multiple test types (unit, integration, performance, e2e)
 * 4. CI/CD Compatibility: Optimized for automated pipeline execution
 * 5. Development Experience: Enhanced with watch plugins and notifications
 * 6. Performance: Configured for efficient test execution and caching
 * 7. Quality Assurance: Enforces coverage thresholds and error handling
 * 8. Extensibility: Prepared for future enhancements and additional test types
 * 
 * Integration Points:
 * - package.json: npm scripts reference this configuration
 * - setup.js: Test environment initialization script
 * - CI workflows: Automated test execution in pipelines
 * - Local development: Watch mode and interactive testing
 * 
 * Compatibility:
 * - Node.js 18+: Required for Express.js 5.1.0 compatibility
 * - Jest 29.7.0: Latest stable version with modern features
 * - Cross-platform: Windows, macOS, Linux support
 * - CI/CD: GitHub Actions, Jenkins, and other pipeline systems
 */