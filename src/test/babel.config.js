// @babel/preset-env@^7.24.0
// Babel configuration for Node.js Hello World tutorial test suite
// This file configures Babel to transpile modern JavaScript (ES6+) syntax in test files
// and backend code under test, ensuring compatibility with Node.js 18+ runtime and Jest test runner

module.exports = {
  // Configure Babel presets for test environment
  presets: [
    [
      // @babel/preset-env transpiles modern JavaScript to Node.js-compatible code
      '@babel/preset-env',
      {
        // Target Node.js 18+ for compatibility with Express.js 5.0 and modern JavaScript features
        targets: {
          node: '18'
        }
      }
    ]
  ]
};