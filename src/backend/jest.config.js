/**
 * Jest Configuration for Backend Node.js/Express.js Application
 * 
 * This configuration file defines the test environment, coverage collection, test file patterns,
 * setup scripts, and module resolution for all backend test types (unit, integration, performance, e2e).
 * Ensures tests run in a Node.js environment, supports code coverage reporting, and integrates
 * with test setup scripts for consistent, maintainable, and reproducible test execution.
 * 
 * Compatible with:
 * - Node.js 18+
 * - Express.js 5.1.0
 * - Jest 29.7.0
 * - CI/CD pipelines
 * 
 * Referenced by: npm scripts in package.json and test runners in local and CI environments
 * Purpose: Canonical Jest configuration for backend test suite with comprehensive test type support
 */

module.exports = {
  // Test environment configuration - Node.js environment for backend testing
  // Ensures all tests run in server-side context compatible with Express.js applications
  testEnvironment: 'node',

  // Root directory for test discovery and relative path resolution
  // Points to the test directory where all test files and setup scripts are located
  // This enables centralized test management and consistent path resolution across test types
  rootDir: '../test',

  // Setup scripts executed after Jest environment initialization
  // The setup.js file configures test environment variables, global mocks, and environment setup
  // Runs before any test files to ensure consistent test environment across all test types
  setupFilesAfterEnv: [
    '<rootDir>/setup.js'
  ],

  // Code coverage configuration - enabled for comprehensive test quality measurement
  // Provides insights into test effectiveness and code paths exercised by test suite
  collectCoverage: true,

  // Coverage output directory - relative to rootDir for centralized coverage reporting
  // Places coverage reports in dedicated directory for easy access and CI integration
  coverageDirectory: '<rootDir>/../coverage',

  // Coverage report formats for different consumption scenarios
  // - 'text': Console output for immediate feedback during development
  // - 'html': Detailed HTML report for comprehensive coverage analysis
  coverageReporters: [
    'text',
    'html'
  ],

  // Test file discovery patterns for comprehensive test type support
  // Supports all backend test categories as defined in testing strategy:
  // - Unit tests: Isolated component testing
  // - Integration tests: Component interaction testing  
  // - Performance tests: Load and performance validation
  // - End-to-end tests: Complete workflow validation
  testMatch: [
    '<rootDir>/unit/**/*.test.js',
    '<rootDir>/integration/**/*.test.js', 
    '<rootDir>/performance/**/*.perf.test.js',
    '<rootDir>/e2e/**/*.e2e.test.js'
  ],

  // Module file extensions for test file and module resolution
  // Supports JavaScript and JSON modules commonly used in Node.js backend applications
  // Ensures proper module loading and test execution across different file types
  moduleFileExtensions: [
    'js',
    'json'
  ],

  // Test execution timeout configuration (10 seconds)
  // Accommodates various test types including performance tests that may require longer execution
  // Provides reasonable timeout for integration and e2e tests while preventing hanging tests
  testTimeout: 10000,

  // Error handling configuration for robust test execution
  // Ensures proper error propagation and test failure reporting
  errorOnDeprecated: true,

  // Test execution configuration for optimal performance and reliability
  // Prevents test interference and ensures clean test execution environment
  clearMocks: true,
  restoreMocks: true,

  // Verbose output configuration for detailed test execution information
  // Helpful for debugging test issues and understanding test execution flow
  verbose: false,

  // File watching configuration for development workflow optimization
  // Ignores coverage directory and node_modules to prevent unnecessary test reruns
  watchPathIgnorePatterns: [
    '<rootDir>/../coverage/',
    '<rootDir>/../node_modules/'
  ],

  // Transform configuration - no transformation needed for Node.js environment
  // Jest runs JavaScript files directly in Node.js without transpilation
  transform: {},

  // Module path mapping for consistent import resolution
  // Enables clean imports and consistent module resolution across test files
  moduleNameMapping: {},

  // Global teardown configuration for proper resource cleanup
  // Ensures tests don't leave hanging resources or interfere with subsequent test runs
  forceExit: false,
  detectOpenHandles: true,

  // Test result processor configuration for CI/CD integration
  // Supports standard test result formats for integration with build systems
  reporters: [
    'default'
  ],

  // Coverage collection configuration for comprehensive code analysis
  // Focuses coverage collection on application code while excluding test files and dependencies
  collectCoverageFrom: [
    '<rootDir>/../src/**/*.js',
    '!<rootDir>/../src/**/*.test.js',
    '!<rootDir>/../src/**/*.spec.js',
    '!<rootDir>/../coverage/**',
    '!<rootDir>/../node_modules/**'
  ],

  // Coverage thresholds for quality gates and CI/CD pipeline integration
  // Ensures minimum code coverage standards are maintained across the backend codebase
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
};