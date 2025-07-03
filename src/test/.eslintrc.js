/**
 * ESLint Configuration for Test Suite
 * 
 * This configuration file defines linting rules, environments, and parser options
 * specifically for the test codebase in the 'src/test' directory. It ensures code
 * quality, consistency, and best practices for all test scripts including unit,
 * integration, performance, and end-to-end tests.
 * 
 * Features:
 * - Modern JavaScript (ES2022+) support
 * - Jest testing framework integration
 * - Node.js environment support
 * - Custom rules for testing code quality
 * - Global variables for Jest functions
 * 
 * Dependencies:
 * - eslint ^8.56.0 - Core linting engine
 * - eslint-plugin-jest ^27.6.0 - Jest-specific linting rules
 * - eslint-plugin-node ^11.1.0 - Node.js-specific linting rules
 */

module.exports = {
  // Environment configuration - defines global variables and Node.js/Jest environments
  env: {
    jest: true,        // Enable Jest global variables (describe, it, expect, etc.)
    node: true,        // Enable Node.js global variables and Node.js scoping
    es2022: true       // Enable ES2022+ global variables and syntax
  },

  // Extend recommended configurations for comprehensive rule coverage
  extends: [
    'eslint:recommended',       // ESLint's recommended rules for JavaScript
    'plugin:jest/recommended',  // Jest-specific recommended rules
    'plugin:node/recommended'   // Node.js-specific recommended rules
  ],

  // Plugin registration - enables additional rule sets
  plugins: [
    'jest',  // Jest-specific linting rules and environment support
    'node'   // Node.js-specific linting rules and environment support
  ],

  // Parser options for modern JavaScript features
  parserOptions: {
    ecmaVersion: 2022,     // Support ES2022+ syntax including top-level await
    sourceType: 'module'   // Enable ES modules (import/export statements)
  },

  // Global variables explicitly defined for Jest testing framework
  globals: {
    jest: 'readonly',        // Jest global object
    describe: 'readonly',    // Test suite definition
    it: 'readonly',          // Individual test case definition
    beforeAll: 'readonly',   // Setup before all tests in a suite
    afterAll: 'readonly',    // Cleanup after all tests in a suite
    beforeEach: 'readonly',  // Setup before each test
    afterEach: 'readonly',   // Cleanup after each test
    expect: 'readonly'       // Jest assertion library
  },

  // Custom rules configuration for test-specific requirements
  rules: {
    // Variable and scope rules
    'no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_'  // Allow unused parameters starting with underscore
    }],
    'no-undef': 'error',           // Prevent use of undefined variables
    'no-console': 'off',           // Allow console statements in tests for debugging

    // Jest-specific rules for test quality
    'jest/no-disabled-tests': 'warn',      // Warn about skipped tests (test.skip, describe.skip)
    'jest/no-focused-tests': 'error',      // Error on focused tests (test.only, describe.only)
    'jest/no-identical-title': 'error',    // Prevent duplicate test titles
    'jest/valid-expect': 'error',          // Ensure proper expect() usage

    // Node.js rules - relaxed for test environment
    'node/no-unpublished-require': 'off',  // Allow requiring devDependencies in tests
    'node/no-missing-import': 'off',       // Disable missing import checks (handled by bundler)
    'node/no-missing-require': 'off'       // Disable missing require checks (handled by bundler)
  }
};