// Babel configuration for the Node.js Hello World tutorial backend test suite
// This file configures Babel to transpile modern JavaScript (ES6+) syntax in test files
// and backend code under test, ensuring compatibility with Node.js 18+ runtime and Jest test runner.
// 
// Key Features:
// - Enables latest JavaScript features (async/await, ES modules, etc.) in all test types
// - Ensures consistent, reproducible test execution across environments and CI/CD pipelines
// - Optimized for Node.js 18+ without unnecessary transpilation for older runtimes
// - Compatible with Jest test runner and npm test scripts
//
// Dependencies:
// - @babel/preset-env ^7.24.0: Transpiles modern JavaScript to Node.js-compatible code

module.exports = {
  // Presets define the transformations applied to the code
  // @babel/preset-env automatically determines the Babel plugins needed based on target environment
  presets: [
    [
      '@babel/preset-env', // @babel/preset-env ^7.24.0
      {
        // Target Node.js 18+ for compatibility with Express.js 5.0 and modern JavaScript features
        // This ensures that ES6+ features like async/await, arrow functions, destructuring,
        // template literals, and ES modules are properly transpiled for the Node.js runtime
        targets: {
          node: '18'
        }
        // Additional options can be added here if needed for future test requirements:
        // - modules: 'commonjs' (default) - for CommonJS module compatibility
        // - loose: false (default) - for spec-compliant transformations
        // - debug: false (default) - set to true for debugging transformation details
      }
    ]
  ]
  
  // Additional Babel configuration options available for future enhancements:
  // - plugins: [] - for additional Babel plugins (e.g., decorators, experimental features)
  // - env: {} - for environment-specific configurations (test, development, production)
  // - ignore: [] - for files/patterns to exclude from transpilation
  // - only: [] - for files/patterns to include in transpilation
  // - sourceMaps: true - for source map generation during testing
  
  // This configuration is referenced by:
  // - Jest test runner (via jest.config.js)
  // - npm test scripts (package.json)
  // - CI/CD pipelines (.github/workflows/ci.yml)
  // - Any tools requiring Babel for test execution or code coverage
};