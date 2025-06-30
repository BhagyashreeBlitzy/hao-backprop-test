/**
 * Jest Configuration for Node.js Tutorial Application Test Suite
 * 
 * This file serves as the centralized configuration for all Jest testing within the Node.js 
 * tutorial application. It establishes consistent test execution environments, enforces code 
 * coverage quality gates, and provides educational clarity for testing best practices in 
 * Node.js/TypeScript projects.
 * 
 * The configuration supports:
 * - Unit testing for individual functions and components
 * - Integration testing for HTTP endpoints and middleware
 * - Performance testing for response time validation
 * - Code coverage enforcement with strict thresholds
 * - TypeScript preprocessing via ts-jest transformer
 * - Custom test environment with global helpers and utilities
 * 
 * Educational Objectives:
 * - Demonstrate comprehensive Jest configuration patterns
 * - Show proper test organization and file discovery
 * - Illustrate code coverage threshold enforcement
 * - Provide foundation for CI/CD quality gates
 * - Establish testing best practices for onboarding
 * 
 * This configuration is designed to work seamlessly across:
 * - Local development environments
 * - CI/CD pipeline execution (GitHub Actions)
 * - Code coverage reporting and analysis
 * - Test result generation and monitoring
 * 
 * @fileoverview Centralized Jest configuration for Node.js tutorial application
 * @author Node.js Tutorial Team
 * @version 1.0.0
 * @requires ts-jest ^29.1.0
 * @requires jest ^29.0.0
 */

// Import centralized code coverage thresholds for consistent quality enforcement
import { COVERAGE_THRESHOLDS } from './config/coverage-thresholds.ts';

/**
 * Jest Configuration Object
 * 
 * This configuration object defines all Jest settings for the Node.js tutorial application's
 * test suite. Each property is carefully configured to support educational objectives while
 * maintaining production-ready quality standards.
 * 
 * The configuration follows Jest v29.x best practices and integrates with TypeScript via
 * ts-jest transformer. All settings are documented for educational clarity and onboarding.
 */
export default {
  /**
   * Preset Configuration: ts-jest
   * 
   * Uses the ts-jest preset which provides out-of-the-box TypeScript support for Jest.
   * This preset automatically configures TypeScript compilation, source maps, and
   * appropriate file extensions for seamless TypeScript testing.
   * 
   * Benefits:
   * - Zero-configuration TypeScript support
   * - Automatic TypeScript compilation during testing
   * - Source map support for accurate debugging
   * - Optimized performance for TypeScript projects
   * 
   * @see https://kulshekhar.github.io/ts-jest/
   */
  preset: 'ts-jest',

  /**
   * Test Environment Configuration
   * 
   * Specifies a custom test environment that extends the default Node.js environment
   * with application-specific globals, helpers, and configuration. The custom test
   * environment ensures consistent test execution across all test suites.
   * 
   * The custom environment provides:
   * - Global test utilities and helpers
   * - Application-specific configuration injection
   * - Consistent environment variables
   * - Shared test setup and teardown logic
   * 
   * Path is relative to Jest configuration file location.
   */
  testEnvironment: '<rootDir>/config/test-environment.ts',

  /**
   * Test File Discovery Patterns
   * 
   * Defines glob patterns for discovering and executing test files. The configuration
   * supports both unit tests and integration tests with clear organizational structure.
   * All test files must follow the .test.ts naming convention for automatic discovery.
   * 
   * Test Organization:
   * - unit/: Individual function and component tests
   * - integration/: HTTP endpoint and middleware integration tests
   * 
   * File Naming Convention: *.test.ts
   * This convention clearly identifies test files and prevents accidental execution
   * of non-test TypeScript files.
   */
  testMatch: [
    '<rootDir>/unit/**/*.test.ts',
    '<rootDir>/integration/**/*.test.ts'
  ],

  /**
   * File Transformation Configuration
   * 
   * Configures ts-jest transformer for processing TypeScript files during test execution.
   * This ensures that both test files and source files written in TypeScript are properly
   * compiled and executed within the Jest environment.
   * 
   * The transform configuration uses a regular expression to match all TypeScript files
   * (.ts and .tsx extensions) and processes them through the ts-jest transformer.
   * 
   * Transform Process:
   * 1. TypeScript files are identified by regex pattern
   * 2. ts-jest compiles TypeScript to JavaScript
   * 3. Compiled JavaScript is executed by Jest
   * 4. Source maps maintain debugging capabilities
   */
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },

  /**
   * Module File Extensions
   * 
   * Specifies the file extensions that Jest will recognize and process during test
   * execution. The order defines the resolution priority when importing modules
   * without explicit extensions.
   * 
   * Extension Priority:
   * 1. .ts - TypeScript source files (highest priority)
   * 2. .tsx - TypeScript React components
   * 3. .js - JavaScript files (fallback compatibility)
   * 4. .json - JSON configuration and data files
   * 
   * This configuration ensures proper module resolution for TypeScript projects
   * while maintaining compatibility with JavaScript dependencies.
   */
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],

  /**
   * Code Coverage Collection
   * 
   * Enables comprehensive code coverage collection during test execution. When enabled,
   * Jest instruments the source code to track which lines, functions, branches, and
   * statements are executed during testing.
   * 
   * Coverage collection provides:
   * - Line coverage: Percentage of code lines executed
   * - Function coverage: Percentage of functions called
   * - Branch coverage: Percentage of conditional branches taken
   * - Statement coverage: Percentage of statements executed
   * 
   * This data is essential for quality gates and identifying untested code paths.
   */
  collectCoverage: true,

  /**
   * Coverage Output Directory
   * 
   * Specifies the directory where Jest will generate code coverage reports and artifacts.
   * The coverage directory contains various report formats including HTML, LCOV, and
   * text summaries for different consumption scenarios.
   * 
   * Coverage Artifacts:
   * - HTML reports for browser viewing
   * - LCOV files for CI/CD integration
   * - Text summaries for console output
   * - JSON data for programmatic analysis
   * 
   * Path is relative to Jest configuration file location.
   */
  coverageDirectory: '<rootDir>/coverage',

  /**
   * Coverage Report Formats
   * 
   * Configures multiple coverage report formats to support different use cases and
   * consumption scenarios. Each format serves specific purposes in the development
   * and CI/CD workflow.
   * 
   * Report Formats:
   * - text: Console output for immediate feedback during test runs
   * - lcov: Industry-standard format for CI/CD integration and external tools
   * - html: Interactive browser-based reports for detailed analysis
   * 
   * Multiple formats ensure coverage data is accessible across all workflow stages
   * from local development to production deployment validation.
   */
  coverageReporters: ['text', 'lcov', 'html'],

  /**
   * Code Coverage Thresholds
   * 
   * Enforces minimum code coverage requirements by importing centralized thresholds
   * from the coverage-thresholds configuration file. These thresholds serve as
   * quality gates that prevent insufficient test coverage from passing CI/CD pipelines.
   * 
   * Threshold Categories:
   * - branches: 85% - Conditional statement coverage
   * - functions: 100% - All functions must be tested
   * - lines: 90% - Line execution coverage
   * - statements: 90% - Statement execution coverage
   * 
   * Imported from: ./config/coverage-thresholds.ts
   * Centralized configuration ensures consistent quality standards across all
   * test execution environments and provides single source of truth for coverage
   * requirements that can be adjusted as project quality standards evolve.
   * 
   * Jest will fail the test suite if any threshold is not met, providing immediate
   * feedback on coverage deficiencies and preventing deployment of insufficiently
   * tested code.
   */
  coverageThreshold: COVERAGE_THRESHOLDS.global,

  /**
   * Setup Files After Environment
   * 
   * Specifies setup files that are executed after the test environment is established
   * but before individual test files run. These setup files configure global test
   * utilities, shared configuration, and common test helpers.
   * 
   * Setup File Purpose:
   * - Register global test utilities and matchers
   * - Configure shared test configuration
   * - Initialize common test helpers and mocks
   * - Set up database connections or external service mocks
   * 
   * The setup.js file provides centralized initialization logic that ensures
   * consistent test environment configuration across all test suites. This approach
   * promotes DRY (Don't Repeat Yourself) principles and simplifies test maintenance.
   * 
   * Path is relative to Jest configuration file location.
   */
  setupFilesAfterEnv: ['<rootDir>/setup.js'],

  /**
   * Test Root Directories
   * 
   * Defines the root directories where Jest will search for test files and related
   * resources. This configuration organizes test files into logical categories and
   * ensures efficient test discovery and execution.
   * 
   * Directory Structure:
   * - unit/: Unit tests for individual functions and components
   * - integration/: Integration tests for HTTP endpoints and middleware
   * - helpers/: Shared test utilities, fixtures, and helper functions
   * 
   * Benefits of Organized Test Structure:
   * - Clear separation of test types and concerns
   * - Efficient test discovery and filtering
   * - Logical organization for team collaboration
   * - Scalable structure for future test expansion
   * 
   * All paths are relative to the Jest configuration file location and use Jest's
   * <rootDir> placeholder for consistent path resolution across environments.
   */
  roots: ['<rootDir>/unit', '<rootDir>/integration', '<rootDir>/helpers']
};