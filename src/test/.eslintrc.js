/**
 * ESLint Configuration for Test Suite
 * 
 * This configuration file defines linting rules, environments, and parser options
 * specifically tailored for the test codebase in the 'src/test' directory.
 * It ensures code quality, consistency, and best practices for all test scripts,
 * including unit, integration, performance, and end-to-end tests.
 * 
 * The configuration supports:
 * - Modern JavaScript (ES2022+) syntax and features
 * - Node.js environment and global variables
 * - Jest testing framework with specific linting rules
 * - Common testing patterns and best practices
 * 
 * @version 1.0.0
 * @author Development Team
 * @since 2025-01-01
 */

module.exports = {
  /**
   * Environment Configuration
   * 
   * Defines the environments where the test code will run, enabling
   * appropriate global variables and features for each environment.
   */
  env: {
    /**
     * Jest Testing Framework Environment
     * Enables Jest-specific global variables and functions such as:
     * - describe, it, test, expect
     * - beforeAll, beforeEach, afterAll, afterEach
     * - jest object and its methods
     */
    jest: true,

    /**
     * Node.js Environment
     * Enables Node.js global variables and Node.js scoping:
     * - global, process, Buffer, __dirname, __filename
     * - require, module, exports
     * - Node.js built-in modules and APIs
     */
    node: true,

    /**
     * ECMAScript 2022 Environment
     * Enables ES2022 global variables and syntax features:
     * - Modern JavaScript features and APIs
     * - Latest ECMAScript standard support
     * - Advanced language constructs
     */
    es2022: true
  },

  /**
   * Extended Configurations
   * 
   * Inherits rules from established configuration presets to provide
   * a solid foundation of linting rules and best practices.
   */
  extends: [
    /**
     * ESLint Recommended Rules
     * Core ESLint rules that catch common JavaScript errors and
     * enforce fundamental best practices for code quality.
     */
    "eslint:recommended",

    /**
     * Jest Plugin Recommended Rules
     * eslint-plugin-jest ^27.6.0
     * Specialized rules for Jest testing framework that enforce:
     * - Proper test structure and organization
     * - Best practices for assertions and expectations
     * - Prevention of common testing antipatterns
     * - Consistency in test descriptions and setup
     */
    "plugin:jest/recommended",

    /**
     * Node.js Plugin Recommended Rules
     * eslint-plugin-node ^11.1.0
     * Node.js-specific rules that ensure:
     * - Proper use of Node.js APIs and modules
     * - Correct handling of asynchronous operations
     * - Prevention of Node.js-specific pitfalls
     * - Enforcement of Node.js best practices
     */
    "plugin:node/recommended"
  ],

  /**
   * Plugin Configuration
   * 
   * Registers ESLint plugins that provide additional rules and
   * functionality specific to testing frameworks and environments.
   */
  plugins: [
    /**
     * Jest Plugin
     * eslint-plugin-jest ^27.6.0
     * Provides Jest-specific linting rules and environment support
     * for comprehensive testing code analysis and quality enforcement.
     */
    "jest",

    /**
     * Node.js Plugin  
     * eslint-plugin-node ^11.1.0
     * Adds Node.js-specific linting rules and environment support
     * for server-side JavaScript development best practices.
     */
    "node"
  ],

  /**
   * Parser Options Configuration
   * 
   * Configures the JavaScript parser to handle modern syntax
   * and language features used in the test codebase.
   */
  parserOptions: {
    /**
     * ECMAScript Version
     * Set to 2022 to support the latest JavaScript features including:
     * - Private class fields and methods
     * - Top-level await
     * - Class static blocks
     * - Error.cause property
     * - Array.prototype.at() method
     * - Object.hasOwn() method
     */
    ecmaVersion: 2022,

    /**
     * Source Type
     * Set to 'module' to enable ES6 module syntax:
     * - import/export statements
     * - Dynamic imports
     * - Module-level strict mode
     * - Top-level await support
     */
    sourceType: "module"
  },

  /**
   * Global Variables Configuration
   * 
   * Defines global variables that are available in the test environment
   * to prevent ESLint from flagging them as undefined.
   */
  globals: {
    /**
     * Jest Framework Globals
     * Core Jest functions and objects available globally in test files
     */
    jest: "readonly",
    describe: "readonly",
    it: "readonly",
    beforeAll: "readonly",
    afterAll: "readonly",
    beforeEach: "readonly",
    afterEach: "readonly",
    expect: "readonly"
  },

  /**
   * Custom Rules Configuration
   * 
   * Defines specific linting rules tailored for test code quality,
   * consistency, and best practices. Rules are configured to balance
   * strict quality enforcement with practical development workflows.
   */
  rules: {
    /**
     * Variable Usage Rules
     * 
     * Controls how variables are declared and used in test code.
     */

    /**
     * No Unused Variables
     * Warns about variables that are declared but never used.
     * Exception: Variables starting with underscore are ignored
     * (common pattern for intentionally unused parameters).
     */
    "no-unused-vars": ["warn", { 
      argsIgnorePattern: "^_" 
    }],

    /**
     * No Undefined Variables
     * Prevents use of undefined variables, ensuring all variables
     * are properly declared before use.
     */
    "no-undef": "error",

    /**
     * Console Usage
     * Allows console statements in test files for debugging
     * and test output purposes.
     */
    "no-console": "off",

    /**
     * Jest-Specific Rules
     * 
     * Enforces Jest testing framework best practices and patterns.
     */

    /**
     * No Disabled Tests
     * Warns about disabled tests (using .skip or .todo) to ensure
     * tests are not accidentally left disabled in the codebase.
     */
    "jest/no-disabled-tests": "warn",

    /**
     * No Focused Tests
     * Prevents focused tests (using .only) from being committed,
     * ensuring all tests run in the test suite.
     */
    "jest/no-focused-tests": "error",

    /**
     * No Identical Test Titles
     * Prevents duplicate test descriptions within the same test suite,
     * ensuring clear and unique test identification.
     */
    "jest/no-identical-title": "error",

    /**
     * Valid Expect Usage
     * Ensures proper usage of Jest expect assertions,
     * preventing common mistakes in test assertions.
     */
    "jest/valid-expect": "error",

    /**
     * Node.js-Specific Rules
     * 
     * Configures Node.js plugin rules for test environment compatibility.
     */

    /**
     * Allow Unpublished Requires
     * Disables warnings for requiring modules that are not published
     * to npm, common in test environments with dev dependencies.
     */
    "node/no-unpublished-require": "off",

    /**
     * Allow Missing Imports
     * Disables warnings for missing import statements,
     * allowing flexibility in test file organization.
     */
    "node/no-missing-import": "off",

    /**
     * Allow Missing Requires
     * Disables warnings for missing require statements,
     * accommodating test-specific module loading patterns.
     */
    "node/no-missing-require": "off"
  }
};