/**
 * ESLint Configuration for Backend Node.js/Express.js Application
 * 
 * This configuration file defines linting rules, environments, parser options,
 * plugins, and code style guidelines to enforce code quality, consistency, and
 * best practices across the backend codebase.
 * 
 * Key Features:
 * - Integrates with Prettier for formatting consistency
 * - Supports Node.js 22.x LTS and Express.js 5.1.0
 * - Enforces ECMAScript 2021 standards
 * - Compatible with Jest testing framework
 * - Provides comprehensive error detection and code quality enforcement
 * 
 * Dependencies:
 * - eslint ^8.56.0 - Core linting engine for JavaScript/Node.js code
 * - eslint-config-prettier ^9.1.0 - Disables conflicting ESLint rules
 * - eslint-plugin-prettier ^5.1.3 - Runs Prettier as ESLint rule
 * - prettier ^3.2.5 - Code formatter for consistent style
 * - eslint-plugin-node ^11.1.0 - Node.js-specific linting rules
 * - eslint-plugin-import ^2.29.1 - Import/export syntax validation
 * 
 * Used by:
 * - ESLint CLI tool and editor integrations
 * - CI/CD pipelines for code quality gates
 * - Pre-commit hooks for quality enforcement
 * - Development team for consistent coding standards
 */

module.exports = {
  // Define the environments where the code will run
  env: {
    // Enable Node.js global variables and Node.js scoping
    node: true,
    // Enable ECMAScript 2021 global variables and features
    es2021: true,
    // Enable Jest testing framework globals (describe, it, expect, etc.)
    jest: true
  },

  // Extend recommended configurations and integrations
  extends: [
    // ESLint recommended rules for general JavaScript best practices
    'eslint:recommended',
    // Node.js plugin recommended rules for server-side development
    'plugin:node/recommended',
    // Import plugin recommended rules for module management
    'plugin:import/recommended',
    // Prettier integration - must be last to override conflicting rules
    'plugin:prettier/recommended'
  ],

  // Enable plugins for additional linting capabilities
  plugins: [
    // Prettier integration for formatting as linting rules
    'prettier',
    // Node.js specific linting rules and best practices
    'node',
    // Import/export statement validation and optimization
    'import'
  ],

  // Configure the JavaScript parser options
  parserOptions: {
    // Use ECMAScript 2021 syntax features
    ecmaVersion: 2021,
    // Enable ES6 modules for import/export statements
    sourceType: 'module'
  },

  // Define specific linting rules with their configurations
  rules: {
    // Prettier integration - enforce formatting as errors with specific config
    'prettier/prettier': [
      'error',
      {
        // Match the imported Prettier configuration from .prettierrc.js
        semi: true,                    // Enforce semicolons
        singleQuote: true,            // Use single quotes
        trailingComma: 'es5',         // Trailing commas in ES5 contexts
        printWidth: 100,              // Line length limit
        tabWidth: 2,                  // 2-space indentation
        useTabs: false,               // Use spaces, not tabs
        bracketSpacing: true,         // Spaces in object literals
        arrowParens: 'always',        // Parentheses around arrow function params
        endOfLine: 'lf'               // Unix-style line endings
      }
    ],

    // Console usage rules - allow informational logging but warn about debug console
    'no-console': [
      'warn',
      {
        // Allow specific console methods for proper logging
        allow: ['warn', 'error', 'info']
      }
    ],

    // Node.js specific rules for modern JavaScript features
    'node/no-unsupported-features/es-syntax': [
      'error',
      {
        // Allow ES6 modules syntax despite Node.js compatibility
        ignores: ['modules']
      }
    ],

    // Node.js import resolution configuration
    'node/no-missing-import': [
      'error',
      {
        // Specify file extensions to try when resolving imports
        tryExtensions: ['.js', '.json']
      }
    ],

    // Import statement organization and formatting
    'import/order': [
      'warn',
      {
        // Define import groups in order of precedence
        groups: [
          'builtin',    // Node.js built-in modules (fs, path, etc.)
          'external',   // Third-party packages from node_modules
          'internal',   // Internal application modules
          'parent',     // Parent directory imports (../)
          'sibling',    // Sibling file imports (./)
          'index'       // Index file imports
        ],
        // Add newlines between different import groups
        'newlines-between': 'always'
      }
    ],

    // Ensure all imports can be resolved
    'import/no-unresolved': 'error',

    // Enforce newline after import statements
    'import/newline-after-import': 'warn',

    // Variable usage and declaration rules
    'no-unused-vars': [
      'warn',
      {
        // Don't check function arguments for unused variables
        args: 'none',
        // Ignore unused variables in object destructuring rest properties
        ignoreRestSiblings: true
      }
    ],

    // Modern JavaScript practices
    'no-var': 'error',           // Enforce let/const instead of var
    'prefer-const': 'error',     // Prefer const for variables that are never reassigned

    // Code quality and safety rules
    'eqeqeq': ['error', 'always'],  // Require strict equality (=== and !==)
    'curly': 'error'                // Require curly braces for all control statements
  },

  // Define global variables that should be available in all files
  globals: {
    // Node.js CommonJS global for module exports
    module: 'readonly',
    // Node.js CommonJS global for requiring modules
    require: 'readonly',
    // Node.js global for current directory path
    __dirname: 'readonly',
    // Node.js global process object
    process: 'readonly'
  }
};