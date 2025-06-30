/**
 * Centralized Code Coverage Thresholds Configuration
 * 
 * This file defines and exports the global code coverage thresholds for the Node.js tutorial 
 * application's test suite. These thresholds ensure that all test runs (local and CI/CD) 
 * enforce consistent quality gates to maintain code quality and prevent untested code from 
 * being merged into the codebase.
 * 
 * Coverage Types:
 * - branches: Percentage of branches (conditional statements) that must be tested
 * - functions: Percentage of functions that must be tested
 * - lines: Percentage of code lines that must be executed during testing
 * - statements: Percentage of statements that must be executed during testing
 * 
 * These thresholds are referenced by:
 * - jest.config.ts (as COVERAGE_THRESHOLDS.global for the coverageThreshold property)
 * - test-environment.ts (to inject coverage requirements into the global test environment)
 * 
 * Quality Gate Enforcement:
 * - Jest will fail builds that do not meet these minimum requirements
 * - CI/CD pipelines use these thresholds to prevent merging of insufficiently tested code
 * - Local test runs provide immediate feedback on coverage requirements
 * 
 * Educational Value:
 * This configuration demonstrates best practices for centralizing and documenting code 
 * coverage requirements in a Node.js/TypeScript project, supporting onboarding and 
 * learning about quality gates in software development.
 */

/**
 * Global code coverage thresholds for the tutorial application.
 * 
 * These values are enforced by Jest and CI/CD pipelines to maintain code quality.
 * All values are easily adjustable to raise or lower coverage standards as the 
 * project matures and requirements evolve.
 * 
 * Current Thresholds:
 * - 85% branch coverage: Ensures most conditional paths are tested
 * - 100% function coverage: All functions must have at least one test
 * - 90% line coverage: High line coverage for comprehensive testing
 * - 90% statement coverage: High statement coverage for thorough validation
 */
export const COVERAGE_THRESHOLDS = {
  global: {
    /**
     * Branch coverage threshold (85%)
     * Ensures that conditional statements (if/else, switch, ternary) are adequately tested.
     * This threshold balances comprehensive testing with practical development velocity.
     */
    branches: 85,

    /**
     * Function coverage threshold (100%)
     * Requires that every function in the codebase has at least one test case.
     * This strict requirement ensures no function is left completely untested.
     */
    functions: 100,

    /**
     * Line coverage threshold (90%)
     * Ensures that 90% of executable lines are executed during test runs.
     * This high threshold promotes thorough testing while allowing some flexibility.
     */
    lines: 90,

    /**
     * Statement coverage threshold (90%)
     * Requires that 90% of statements are executed during testing.
     * This metric complements line coverage for comprehensive test validation.
     */
    statements: 90
  }
} as const;

/**
 * Type definition for coverage thresholds structure.
 * This type ensures type safety when importing and using the coverage thresholds
 * in other parts of the application.
 */
export type CoverageThresholds = typeof COVERAGE_THRESHOLDS;

/**
 * Default export for convenience when importing the entire configuration.
 * This allows for both named imports (import { COVERAGE_THRESHOLDS }) and 
 * default imports (import coverageThresholds) based on usage preferences.
 */
export default COVERAGE_THRESHOLDS;