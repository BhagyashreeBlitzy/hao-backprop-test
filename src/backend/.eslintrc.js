// ESLint configuration for backend Node.js/Express.js application
// This configuration enforces code quality, consistency, and best practices
// across the backend codebase, integrating with Prettier for formatting
// and supporting both local development and CI workflows

module.exports = {
  // Environment configuration for Node.js, ES2021, and Jest testing
  env: {
    node: true,        // Node.js global variables and Node.js scoping
    es2021: true,      // ES2021 globals and syntax support
    jest: true         // Jest testing framework globals
  },

  // Extended configurations for comprehensive linting rules
  extends: [
    'eslint:recommended',           // ESLint recommended rules
    'plugin:node/recommended',      // Node.js best practices
    'plugin:import/recommended',    // Import/export validation
    'plugin:prettier/recommended'   // Prettier integration (must be last)
  ],

  // Plugin activation for specialized linting capabilities
  plugins: [
    'prettier',  // Prettier formatting integration
    'node',      // Node.js specific rules
    'import'     // Import/export statement validation
  ],

  // Parser configuration for modern JavaScript features
  parserOptions: {
    ecmaVersion: 2021,    // Support ES2021 features
    sourceType: 'module'  // Enable ES modules alongside CommonJS
  },

  // Custom rule configurations for code quality and consistency
  rules: {
    // Prettier integration - treat formatting issues as errors
    'prettier/prettier': [
      'error',
      {
        // Prettier configuration matching .prettierrc.js
        semi: true,                    // Enforce semicolons
        singleQuote: true,            // Use single quotes
        trailingComma: 'es5',         // Trailing commas in ES5-valid positions
        printWidth: 100,              // Line length limit
        tabWidth: 2,                  // 2-space indentation
        useTabs: false,               // Use spaces instead of tabs
        bracketSpacing: true,         // Spaces in object literals
        arrowParens: 'always',        // Parentheses around arrow function parameters
        endOfLine: 'lf'               // Unix line endings
      }
    ],

    // Console usage - allow info, warn, error but warn on general console usage
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error', 'info']
      }
    ],

    // Node.js specific rules
    'node/no-unsupported-features/es-syntax': [
      'error',
      {
        ignores: ['modules']  // Allow ES modules syntax
      }
    ],
    'node/no-missing-import': [
      'error',
      {
        tryExtensions: ['.js', '.json']  // Supported file extensions
      }
    ],

    // Import/export organization and validation
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',    // Node.js built-in modules
          'external',   // npm packages
          'internal',   // Internal modules
          'parent',     // Parent directory imports
          'sibling',    // Sibling directory imports
          'index'       // Index file imports
        ],
        'newlines-between': 'always'  // Enforce newlines between import groups
      }
    ],
    'import/no-unresolved': 'error',        // Prevent unresolved imports
    'import/newline-after-import': 'warn',  // Newline after import statements

    // Code quality rules
    'no-unused-vars': [
      'warn',
      {
        args: 'none',              // Don't check unused function arguments
        ignoreRestSiblings: true   // Ignore unused rest sibling properties
      }
    ],
    'no-var': 'error',             // Disallow var declarations
    'prefer-const': 'error',       // Prefer const for non-reassigned variables
    'eqeqeq': ['error', 'always'], // Require strict equality (===)
    'curly': 'error'               // Require curly braces for all control statements
  },

  // Global variables available in Node.js environment
  globals: {
    module: 'readonly',     // CommonJS module object
    require: 'readonly',    // CommonJS require function
    __dirname: 'readonly',  // Current directory path
    process: 'readonly'     // Node.js process object
  }
};