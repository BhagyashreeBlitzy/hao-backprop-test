/**
 * Jest Configuration for Backend Node.js/Express.js Application
 * 
 * This configuration file defines the test environment, coverage collection,
 * test file patterns, setup scripts, and module resolution for all backend
 * test types (unit, integration, performance, e2e).
 * 
 * Ensures tests run in a Node.js environment, supports code coverage reporting,
 * and integrates with test setup scripts. Designed for compatibility with
 * Node.js 18+, Express.js 5.1.0, and CI/CD pipelines.
 * 
 * This file is referenced by npm scripts and test runners to provide a
 * consistent, maintainable, and reproducible test configuration for backend code.
 * 
 * @version 1.0.0
 * @requires jest ^29.7.0
 * @requires node >=18.0.0
 */

module.exports = {
  // Test Environment Configuration
  // Use 'node' environment for backend testing (vs 'jsdom' for frontend)
  // This ensures tests run in a Node.js context with proper module resolution
  testEnvironment: 'node',

  // Root Directory Configuration
  // Points to the test directory relative to this config file
  // This allows Jest to find test files and setup scripts correctly
  rootDir: '../test',

  // Setup Scripts Configuration
  // Executes setup.js after Jest environment is established but before tests run
  // This initializes NODE_ENV, global mocks, and test-specific configurations
  setupFilesAfterEnv: ['<rootDir>/setup.js'],

  // Code Coverage Configuration
  // Enables automatic code coverage collection during test execution
  // Critical for quality assurance and pre-deployment validation
  collectCoverage: true,

  // Coverage Output Directory
  // Specifies where coverage reports and artifacts are stored
  // Relative to rootDir, places coverage in test/coverage directory
  coverageDirectory: '<rootDir>/../coverage',

  // Coverage Reporters Configuration
  // 'text' provides console output for immediate feedback
  // 'html' generates browsable coverage reports for detailed analysis
  coverageReporters: ['text', 'html'],

  // Test File Pattern Matching
  // Defines glob patterns for discovering test files across all test types
  // Supports unit, integration, performance, and e2e test organization
  testMatch: [
    // Unit tests - isolated component and function testing
    '<rootDir>/unit/**/*.test.js',
    
    // Integration tests - component interaction and API testing
    '<rootDir>/integration/**/*.test.js',
    
    // Performance tests - load testing and response time validation
    '<rootDir>/performance/**/*.perf.test.js',
    
    // End-to-end tests - full application workflow testing
    '<rootDir>/e2e/**/*.e2e.test.js'
  ],

  // Module File Extensions
  // Specifies file extensions Jest should recognize and process
  // Supports standard JavaScript and JSON files for backend testing
  moduleFileExtensions: ['js', 'json'],

  // Test Timeout Configuration
  // Sets global timeout for all tests (10 seconds)
  // Accommodates integration tests, API calls, and performance tests
  // Can be overridden per test suite or individual test if needed
  testTimeout: 10000,

  // Additional Jest Configuration Options
  // These can be uncommented and configured as needed for specific requirements

  // Collect Coverage From Specific Files
  // collectCoverageFrom: [
  //   'src/**/*.js',
  //   '!src/**/*.test.js',
  //   '!src/**/node_modules/**'
  // ],

  // Coverage Thresholds (Quality Gates)
  // coverageThreshold: {
  //   global: {
  //     branches: 80,
  //     functions: 80,
  //     lines: 80,
  //     statements: 80
  //   }
  // },

  // Module Path Mapping (if needed for imports)
  // moduleNameMapping: {
  //   '^@/(.*)$': '<rootDir>/src/$1'
  // },

  // Transform Configuration (if transpilation needed)
  // transform: {
  //   '^.+\\.js$': 'babel-jest'
  // },

  // Test Environment Options
  // testEnvironmentOptions: {
  //   NODE_ENV: 'test'
  // },

  // Verbose Output (uncomment for detailed test output)
  // verbose: true,

  // Silent Mode (uncomment to suppress console output during tests)
  // silent: false,

  // Fail Fast (uncomment to stop on first test failure)
  // bail: false,

  // Force Exit (uncomment to force Jest to exit after tests complete)
  // forceExit: false,

  // Clear Mocks (automatically clear mock calls between tests)
  // clearMocks: true,

  // Reset Mocks (reset mock implementation between tests)
  // resetMocks: false,

  // Restore Mocks (restore original implementation after tests)
  // restoreMocks: false
};

/**
 * Configuration Notes:
 * 
 * 1. Node.js Environment: This configuration ensures all tests run in a Node.js
 *    environment, which is essential for backend testing with Express.js and
 *    other server-side modules.
 * 
 * 2. Test Organization: The testMatch patterns support a structured test
 *    organization with separate directories for different test types, enabling
 *    clear separation of concerns and targeted test execution.
 * 
 * 3. Coverage Reporting: Code coverage is enabled by default with both text
 *    and HTML reporters, providing immediate feedback and detailed analysis
 *    capabilities for quality assurance.
 * 
 * 4. Setup Integration: The setupFilesAfterEnv configuration ensures the
 *    test environment is properly initialized with NODE_ENV and any required
 *    global configurations before test execution.
 * 
 * 5. CI/CD Compatibility: This configuration is designed to work seamlessly
 *    with automated CI/CD pipelines, providing consistent test execution
 *    across different environments.
 * 
 * 6. Extensibility: The configuration includes commented sections for common
 *    extensions and customizations that may be needed as the project grows.
 * 
 * 7. Performance: The 10-second timeout accommodates various test types
 *    including integration tests that may involve API calls or database
 *    operations (when applicable).
 * 
 * 8. Maintainability: File patterns and directory structures are organized
 *    to support easy maintenance and clear test categorization.
 */