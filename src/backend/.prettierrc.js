/**
 * Prettier Configuration for Backend Node.js/Express.js Application
 * 
 * This configuration file defines code formatting rules to ensure consistent
 * code style across the backend development environment. It supports the
 * requirements for Development Environment Consistency and Code Quality
 * as outlined in the technical specifications.
 * 
 * Compatible with:
 * - Node.js 22.x LTS (as specified in tech stack)
 * - Express.js 5.1.0 applications
 * - ECMAScript 2015+ (ES6+) standards
 * - Modern JavaScript development practices
 * 
 * Used by:
 * - Prettier CLI tool
 * - Editor integrations (VS Code, WebStorm, etc.)
 * - CI/CD pipelines for automated formatting
 * - Development team for consistent code style
 */

module.exports = {
  // Enforce semicolons at the end of statements for JavaScript clarity
  semi: true,
  
  // Use single quotes for strings to maintain consistency with Node.js conventions
  singleQuote: true,
  
  // Add trailing commas where valid in ES5 (objects, arrays, etc.)
  // Helps with cleaner git diffs and easier code maintenance
  trailingComma: 'es5',
  
  // Limit line length to 100 characters for better readability
  // Balances code density with readability on modern screens
  printWidth: 100,
  
  // Use 2 spaces for indentation to match Node.js community standards
  tabWidth: 2,
  
  // Use spaces instead of tabs for consistent cross-platform formatting
  useTabs: false,
  
  // Add spaces inside object literal braces for improved readability
  bracketSpacing: true,
  
  // Always include parentheses around arrow function parameters
  // Ensures consistency and clarity in function definitions
  arrowParens: 'always',
  
  // Use Line Feed (LF) line endings for cross-platform compatibility
  // Ensures consistent line endings across different operating systems
  endOfLine: 'lf'
};