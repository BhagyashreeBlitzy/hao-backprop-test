// ESLint configuration for the test suite of the Node.js tutorial application
// This configuration ensures consistent code quality, style, and best practices
// for all test files, helpers, and fixtures in the test environment.
// 
// Supports: TypeScript (.ts), JavaScript (.js), Jest testing framework, Node.js environment
// Version requirements: ESLint ^8.56.0, TypeScript ESLint ^6.19.0, Jest plugin ^27.6.0

module.exports = {
  // Indicates this is the root configuration - stops ESLint from looking in parent directories
  root: true,

  // Environment configuration - defines global variables and language features
  env: {
    // Node.js global variables and Node.js scoping (console, process, Buffer, etc.)
    node: true,
    
    // ES2020 language features (optional chaining, nullish coalescing, etc.)
    es2020: true,
    
    // Jest global test functions (describe, it, test, expect, beforeEach, afterEach, etc.)
    jest: true
  },

  // Parser for TypeScript files - required for linting .ts and .tsx files
  // @typescript-eslint/parser version ^6.19.0
  parser: '@typescript-eslint/parser',

  // Parser configuration options
  parserOptions: {
    // ECMAScript version for parsing (supports modern JavaScript features)
    ecmaVersion: 2020,
    
    // Source code type - 'module' for ES6 imports/exports
    sourceType: 'module',
    
    // TypeScript project configuration file for type-aware linting
    project: './tsconfig.json'
  },

  // ESLint plugins - extend ESLint with additional rules and functionality
  plugins: [
    // TypeScript-specific linting rules and type-aware analysis
    // @typescript-eslint/eslint-plugin version ^6.19.0
    '@typescript-eslint',
    
    // Jest-specific linting rules for testing best practices
    // eslint-plugin-jest version ^27.6.0
    'jest',
    
    // Node.js-specific linting rules for server-side development
    // eslint-plugin-node version ^11.1.0
    'node'
  ],

  // Extends - inherit rules from popular style guides and plugin recommendations
  extends: [
    // ESLint's recommended rules (syntax errors, problematic patterns)
    'eslint:recommended',
    
    // TypeScript ESLint recommended rules (type safety, TypeScript best practices)
    'plugin:@typescript-eslint/recommended',
    
    // Jest plugin recommended rules (testing best practices, assertion patterns)
    'plugin:jest/recommended',
    
    // Node.js plugin recommended rules (Node.js API usage, CommonJS patterns)
    'plugin:node/recommended'
  ],

  // Custom rule configuration - override default rules or add specific requirements
  rules: {
    // Code style and formatting rules
    
    // Require semicolons at the end of statements (consistency and ASI safety)
    'semi': ['error', 'always'],
    
    // Enforce single quotes with escape avoidance (consistency and readability)
    'quotes': ['error', 'single', { 'avoidEscape': true }],

    // Variable and import management
    
    // Disable base ESLint unused vars rule (conflicts with TypeScript version)
    'no-unused-vars': 'off',
    
    // TypeScript-aware unused variables rule with underscore prefix ignore pattern
    '@typescript-eslint/no-unused-vars': [
      'error', 
      { 
        // Ignore variables starting with underscore (convention for intentionally unused)
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_'
      }
    ],

    // Development and debugging rules
    
    // Allow console statements in test files (useful for debugging tests)
    'no-console': 'off',

    // Jest-specific test quality rules
    
    // Warn about disabled tests (should be temporary)
    'jest/no-disabled-tests': 'warn',
    
    // Error on focused tests (prevent accidental test isolation)
    'jest/no-focused-tests': 'error',
    
    // Error on duplicate test titles (causes confusion and potential false positives)
    'jest/no-identical-title': 'error',
    
    // Validate expect() usage and structure
    'jest/valid-expect': 'error',

    // Node.js compatibility rules (relaxed for test environment)
    
    // Disable ES syntax checking (TypeScript and Babel handle transpilation)
    'node/no-unsupported-features/es-syntax': 'off',
    
    // Disable missing import checking (TypeScript handles import resolution)
    'node/no-missing-import': 'off',
    
    // Disable unpublished import checking (test dependencies are dev dependencies)
    'node/no-unpublished-import': 'off'
  },

  // Override configurations for specific file patterns
  overrides: [
    {
      // Target test files, test directories, and helper files
      files: [
        '*.test.ts',          // TypeScript test files
        '*.test.js',          // JavaScript test files
        '**/test/**/*.ts',    // All TypeScript files in test directories
        '**/test/**/*.js',    // All JavaScript files in test directories
        '**/helpers/**/*.ts'  // Test helper files
      ],
      
      // Additional environment for test files
      env: {
        jest: true  // Ensure Jest globals are available
      },
      
      // Additional plugins for test files
      plugins: ['jest'],
      
      // Additional rule sets for test files
      extends: ['plugin:jest/recommended'],
      
      // Test-specific rule overrides
      rules: {
        // Jest testing quality rules
        
        // Warn if tests don't contain expect assertions (potential incomplete tests)
        'jest/expect-expect': 'warn',
        
        // Warn about commented-out tests (should be removed or re-enabled)
        'jest/no-commented-out-tests': 'warn'
      }
    }
  ]
};