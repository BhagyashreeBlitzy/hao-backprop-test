// ESLint configuration for Node.js tutorial backend application
// Compatible with Node.js v18+ and Express.js v5.1.0
// Optimized for educational clarity and modern JavaScript development

module.exports = {
  // Environment configuration for Node.js, ES2022, and Jest
  env: {
    node: true,        // Node.js global variables and Node.js scoping
    es2022: true,      // ES2022 globals and automatically sets the ecmaVersion parser option to 13
    jest: true         // Jest global variables for testing environment
  },

  // Extend recommended configurations for comprehensive rule coverage
  extends: [
    'eslint:recommended',          // ESLint's recommended rules for general JavaScript
    'plugin:node/recommended',     // Node.js specific best practices and patterns
    'plugin:jest/recommended',     // Jest testing framework recommended rules
    'plugin:jest/style'           // Jest style and formatting rules
  ],

  // Parser options for modern JavaScript features
  parserOptions: {
    ecmaVersion: 2022,    // ES2022 syntax support for Node.js v22.x LTS compatibility
    sourceType: 'module'  // ECMAScript modules support
  },

  // Plugins for specialized linting capabilities
  plugins: [
    'node',  // Node.js specific linting rules and environment
    'jest'   // Jest testing framework specific rules
  ],

  // Custom rules configuration for educational clarity and code quality
  rules: {
    // Variable and function usage rules
    'no-unused-vars': ['warn', {
      args: 'after-used',           // Allow unused arguments if used arguments follow
      argsIgnorePattern: '^_',      // Ignore arguments starting with underscore
      varsIgnorePattern: '^_'       // Ignore variables starting with underscore
    }],

    // Console usage - allowed for educational purposes and debugging
    'no-console': 'off',            // Allow console.log for educational logging

    // Code style and formatting rules
    'semi': ['error', 'always'],    // Require semicolons for statement termination
    'quotes': ['error', 'single', { // Enforce single quotes with escape avoidance
      avoidEscape: true
    }],
    'indent': ['error', 2, {        // 2-space indentation with switch case handling
      SwitchCase: 1
    }],
    'comma-dangle': ['error', 'never'], // Disallow trailing commas

    // Code quality and safety rules
    'eqeqeq': ['error', 'always'],  // Require strict equality (=== and !==)
    'curly': ['error', 'all'],      // Require curly braces for all control statements

    // Node.js specific rules configuration
    'node/no-unsupported-features/es-syntax': 'off', // Allow modern ES syntax (Node.js v18+ support)
    'node/no-missing-import': 'error',      // Ensure all imports resolve correctly
    'node/no-unpublished-import': 'off',    // Allow dev dependencies in development

    // Jest testing framework rules
    'jest/no-disabled-tests': 'warn',       // Warn about disabled tests (it.skip, describe.skip)
    'jest/no-focused-tests': 'error',       // Error on focused tests (it.only, describe.only)
    'jest/no-identical-title': 'error',     // Prevent identical test titles
    'jest/prefer-to-have-length': 'warn',   // Prefer toHaveLength() over .length comparison
    'jest/valid-expect': 'error'            // Ensure expect() calls are valid
  },

  // Override rules for specific file patterns
  overrides: [
    {
      // Test files specific configuration
      files: [
        '**/tests/**/*.js',  // Test directory files
        '**/*.test.js'       // Test suffix files
      ],
      env: {
        jest: true,  // Jest testing environment
        node: true   // Node.js environment for test files
      },
      plugins: ['jest'],
      rules: {
        // Allow unused expressions in test files (for expect assertions)
        'no-unused-expressions': 'off',
        // Allow dev dependencies in test files
        'node/no-unpublished-import': 'off'
      }
    }
  ]
};