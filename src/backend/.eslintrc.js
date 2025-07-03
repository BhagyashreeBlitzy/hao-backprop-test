// ESLint configuration for Node.js tutorial backend
// Establishes linting rules, environments, parser options, and plugin integrations
// to enforce code quality, style consistency, and best practices across the backend codebase.
// Ensures maintainability, readability, and educational clarity, supporting onboarding
// and collaborative development. Integrates with Prettier for formatting and Jest for test file linting.

module.exports = {
  // Environment configuration - specifies which environments this code is designed to run in
  // and what global variables are available
  env: {
    // Node.js global variables and Node.js scoping
    node: true,
    // ES2022 globals and syntax support
    es2022: true,
    // Jest global variables for testing environment
    jest: true,
  },

  // Extend from recommended configurations to inherit best practices
  extends: [
    // ESLint's recommended rules for catching common errors and problematic patterns
    'eslint:recommended',
    // Prettier plugin recommended configuration - integrates Prettier formatting with ESLint
    // Runs Prettier as an ESLint rule and reports differences as individual ESLint issues
    'plugin:prettier/recommended',
  ],

  // Plugins to add additional rules and functionality
  plugins: [
    // Prettier plugin for code formatting integration
    'prettier', // eslint-plugin-prettier ^5.0.0
    // Jest plugin for testing-specific rules
    'jest', // eslint-plugin-jest ^27.0.0
  ],

  // Parser options to specify ECMAScript version and module type
  parserOptions: {
    // ECMAScript version - ES2022 for modern JavaScript features
    ecmaVersion: 2022,
    // Module type - ES modules for import/export syntax
    sourceType: 'module',
  },

  // Custom rules configuration
  rules: {
    // Prettier integration rule - enforces Prettier formatting as ESLint errors
    'prettier/prettier': [
      'error',
      {
        // Prettier configuration options for consistent formatting
        printWidth: 100, // Maximum line length
        tabWidth: 2, // Number of spaces per indentation level
        useTabs: false, // Use spaces instead of tabs
        semi: true, // Require semicolons at the end of statements
        singleQuote: true, // Use single quotes instead of double quotes
        trailingComma: 'es5', // Trailing commas where valid in ES5 (objects, arrays, etc.)
        bracketSpacing: true, // Print spaces between brackets in object literals
        arrowParens: 'always', // Always include parentheses around arrow function parameters
        endOfLine: 'lf', // Use Line Feed only (Unix-style line endings)
      },
    ],

    // Console usage rule - allow console statements for educational/debugging purposes
    'no-console': 'off',

    // Unused variables rule - warn about unused variables but allow underscore prefix for ignored params
    'no-unused-vars': [
      'warn',
      {
        // Ignore parameters that start with underscore (conventional for unused params)
        argsIgnorePattern: '^_',
      },
    ],

    // Jest-specific rules for test code quality
    // Warn about disabled tests (test.skip, describe.skip, it.skip)
    'jest/no-disabled-tests': 'warn',
    // Error on focused tests (test.only, describe.only, it.only) to prevent accidental commits
    'jest/no-focused-tests': 'error',
    // Error on identical test titles within the same describe block
    'jest/no-identical-title': 'error',
    // Warn about using .length instead of .toHaveLength() matcher
    'jest/prefer-to-have-length': 'warn',
    // Error on invalid expect() usage
    'jest/valid-expect': 'error',
  },

  // Override configurations for specific file patterns
  overrides: [
    {
      // Apply Jest-specific configuration to test files
      files: ['**/test/**/*.js'],
      env: {
        // Enable Jest environment for test files
        jest: true,
      },
      plugins: ['jest'],
      extends: [
        // Use Jest plugin's recommended configuration for test files
        'plugin:jest/recommended',
      ],
      rules: {
        // Jest-specific rules for test files
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
      },
    },
  ],
};