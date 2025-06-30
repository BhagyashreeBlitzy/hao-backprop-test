// Jest Testing Framework - ^29.0.0
// Comprehensive JavaScript testing framework with built-in features like assertions, mocking, and coverage
// Jest aims to work out of the box, config free, on most JavaScript projects

/**
 * JEST CONFIGURATION FOR NODE.JS TUTORIAL APPLICATION BACKEND
 * 
 * This configuration file serves as the central testing setup for the Node.js tutorial application,
 * defining all Jest settings required to run unit and integration tests for the backend Express.js
 * server. The configuration ensures that all tests execute in a consistent, isolated, and 
 * reproducible environment, supporting educational clarity, maintainability, and full code coverage
 * as required by the technical specification.
 * 
 * Educational Purpose:
 * This configuration demonstrates best practices for Node.js/Express.js test configuration,
 * including documentation, maintainability, and onboarding support for new developers or students.
 * All settings are explained to provide learning value and understanding of Jest capabilities.
 * 
 * Key Features:
 * - Node.js test environment optimized for server-side testing
 * - Global test setup via setupFilesAfterEnv for consistent environment initialization
 * - Comprehensive test file pattern matching for unit and integration tests
 * - Code coverage collection and reporting for quality assurance
 * - Module resolution and path configuration for clean imports
 * - Performance optimization with appropriate timeouts and ignore patterns
 * 
 * Testing Strategy Integration:
 * This configuration supports the testing strategy outlined in the technical specification,
 * ensuring all tests run in a clean, predictable environment by configuring Jest to use
 * setup files, global test helpers, and environment variables.
 */

/**
 * Generates the comprehensive Jest configuration object for the backend test suite.
 * 
 * This function creates and returns a Jest configuration object that specifies the test
 * environment, setup files, test file patterns, coverage collection settings, and module
 * resolution configuration. The configuration is optimized for Express.js applications
 * and educational clarity.
 * 
 * Educational Value:
 * Demonstrates how Jest configuration objects are structured and the purpose of each
 * configuration option. Shows best practices for test environment setup, coverage
 * collection, and test organization patterns.
 * 
 * @returns {Object} Complete Jest configuration object for use by the Jest CLI and test runner
 */
function generateJestConfig() {
    return {
        // STEP 1: Test Environment Configuration
        // Specify 'node' environment to match backend/server-side context
        // This ensures that Node.js APIs are available and browser-specific APIs are not
        testEnvironment: 'node',

        // STEP 2: Setup Files Configuration
        // Set setupFilesAfterEnv to include global test environment setup
        // This ensures that environment variables, global test helpers, and mocks are
        // loaded before any tests run, providing consistent test execution context
        setupFilesAfterEnv: [
            '<rootDir>/tests/setup.js'
        ],

        // STEP 3: Test File Pattern Matching
        // Define testMatch patterns to include all .test.js files in unit and integration directories
        // This supports organized test structure with clear separation of test types
        testMatch: [
            '<rootDir>/tests/unit/**/*.test.js',
            '<rootDir>/tests/integration/**/*.test.js'
        ],

        // STEP 4: Code Coverage Configuration
        // Enable collectCoverage to generate coverage reports for quality assurance
        // Coverage helps identify untested code paths and ensures comprehensive testing
        collectCoverage: true,

        // Specify collectCoverageFrom to include all backend source files except test files and configuration
        // This ensures coverage metrics reflect actual application code, not test utilities
        collectCoverageFrom: [
            'src/backend/**/*.js',
            '!src/backend/tests/**',
            '!src/backend/jest.config.js',
            '!src/backend/**/index.js'
        ],

        // STEP 5: Coverage Reporting Configuration
        // Set coverageDirectory to 'coverage' for organized output of coverage reports
        // This creates a dedicated directory for coverage artifacts
        coverageDirectory: 'coverage',

        // Configure coverageReporters to include multiple formats for different use cases
        // - 'text': Console output for immediate feedback during development
        // - 'lcov': Industry-standard format for CI/CD integration and code coverage tools
        // - 'html': Human-readable HTML reports for detailed local review
        coverageReporters: [
            'text',
            'lcov', 
            'html'
        ],

        // STEP 6: Test Path Ignore Patterns
        // Set testPathIgnorePatterns to exclude directories that should not contain tests
        // This improves test discovery performance and prevents accidental test execution
        testPathIgnorePatterns: [
            '/node_modules/',
            '/build/',
            '/dist/'
        ],

        // STEP 7: Test Timeout Configuration
        // Set testTimeout to 10000ms (10 seconds) to accommodate integration tests
        // Integration tests may require more time for HTTP requests and Express.js app initialization
        testTimeout: 10000,

        // STEP 8: Module Resolution Configuration (Optional Enhancement)
        // Configure moduleNameMapping for cleaner imports if needed in the future
        // Currently not required for the simple tutorial application structure
        moduleNameMapper: {
            // Example: '^@/(.*)$': '<rootDir>/src/$1'
            // This would allow imports like: import something from '@/backend/app'
        },

        // STEP 9: Test Result Processing
        // Configure verbose output for detailed test reporting during development
        // This provides clear feedback on test execution progress and results
        verbose: true,

        // STEP 10: Error Handling Configuration
        // Configure Jest to handle errors appropriately for Node.js/Express.js testing
        errorOnDeprecated: true,

        // STEP 11: Module File Extensions
        // Specify which file extensions Jest should recognize for modules
        // This ensures proper handling of JavaScript files and potential future TypeScript files
        moduleFileExtensions: [
            'js',
            'json'
        ],

        // STEP 12: Transform Configuration
        // Configure how Jest should transform files before testing
        // For the tutorial application, no transformation is needed as we use modern Node.js
        transform: {
            // No transforms needed for Node.js v22.x with ES2015+ support
        },

        // STEP 13: Global Test Configuration
        // Configure global variables available in all test files
        // The setup.js file handles global test utility registration
        globals: {
            // Global test timeout configuration
            testTimeout: 10000
        },

        // STEP 14: Test Runner Configuration
        // Configure Jest test runner options for optimal performance and clarity
        maxWorkers: '50%', // Use half of available CPU cores for parallel test execution
        bail: false, // Continue running tests even if some fail (useful for comprehensive feedback)
        clearMocks: true, // Automatically clear mock calls between tests for isolation
        restoreMocks: true, // Automatically restore mock implementation between tests

        // STEP 15: Coverage Threshold Configuration (Optional Quality Gate)
        // Uncomment and configure coverage thresholds to enforce minimum coverage requirements
        // This ensures that new code maintains or improves test coverage
        coverageThreshold: {
            global: {
                branches: 85,
                functions: 90,
                lines: 90,
                statements: 90
            }
        }
    };
}

/**
 * JEST CONFIGURATION EXPORT
 * 
 * Export the Jest configuration object for use by the Jest CLI and test runner.
 * This configuration ensures all backend tests are executed with the correct environment,
 * setup, and coverage settings, providing a foundation for maintainable testing practices.
 * 
 * Usage Patterns:
 * 1. Jest automatically loads this configuration when running 'npm test' or 'jest' from the backend directory
 * 2. The setupFilesAfterEnv entry ensures that all global test helpers and environment variables are available in every test file
 * 3. Coverage is collected for all backend source files except test files, configuration, and index.js files
 * 4. Test files are matched using the testMatch patterns, supporting both unit and integration test organization
 * 5. The configuration is compatible with CI/CD pipelines and local development, supporting educational clarity and maintainability
 * 
 * Educational Notes:
 * This configuration file demonstrates several important Jest concepts:
 * 
 * 1. Test Environment Selection:
 *    - Using 'node' environment for server-side testing
 *    - Ensuring Node.js APIs are available in tests
 *    - Optimizing for Express.js application testing
 * 
 * 2. Setup File Integration:
 *    - Leveraging setupFilesAfterEnv for global test environment initialization
 *    - Ensuring consistent test execution context across all test files
 *    - Supporting global test utility registration for DRY testing patterns
 * 
 * 3. Test Organization:
 *    - Using testMatch patterns for organized test structure
 *    - Separating unit and integration tests for clarity
 *    - Supporting scalable test organization as the application grows
 * 
 * 4. Coverage Configuration:
 *    - Collecting coverage from application code, not test utilities
 *    - Supporting multiple report formats for different use cases
 *    - Enabling quality gates through coverage thresholds
 * 
 * 5. Performance Optimization:
 *    - Using appropriate timeouts for integration testing
 *    - Excluding unnecessary paths from test discovery
 *    - Enabling parallel test execution for faster feedback
 * 
 * 6. Educational Value:
 *    - Extensive documentation for learning purposes
 *    - Clear organization and naming conventions
 *    - Best practices demonstration for professional development
 * 
 * Extensibility:
 * This configuration is designed to be extensible as new test patterns, helpers, or requirements emerge.
 * If new test helpers or setup logic are required, they should be added to tests/setup.js and referenced
 * through the global registration pattern established there. The configuration supports both local and
 * CI/CD test execution, and is compatible with Supertest, dotenv, and all backend test utilities.
 * 
 * Maintenance:
 * This file is intended to be maintained as the single point of configuration for backend test execution,
 * coverage, and environment setup. Regular updates should be made to keep pace with Jest framework updates
 * and evolving testing requirements while maintaining the educational clarity and simplicity that makes
 * this configuration valuable for learning Node.js testing patterns.
 */
module.exports = generateJestConfig();