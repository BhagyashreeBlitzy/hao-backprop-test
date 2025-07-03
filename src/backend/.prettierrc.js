// Prettier configuration for backend Node.js/Express.js source code
// This configuration enforces consistent code style across the development team
// and CI/CD pipelines to improve code maintainability and reduce review friction

module.exports = {
  // Enforce semicolons at the end of statements for better error prevention
  semi: true,
  
  // Use single quotes for strings to maintain consistency with Node.js conventions
  singleQuote: true,
  
  // Add trailing commas where valid in ES5 (objects, arrays, etc.)
  // This reduces git diff noise when adding new items
  trailingComma: 'es5',
  
  // Wrap lines at 100 characters for better readability on modern monitors
  // while maintaining compatibility with various development environments
  printWidth: 100,
  
  // Use 2 spaces for indentation to match Node.js/Express.js conventions
  tabWidth: 2,
  
  // Use spaces instead of tabs for better cross-platform compatibility
  useTabs: false,
  
  // Add spaces inside object brackets for improved readability
  // Example: { foo: bar } instead of {foo: bar}
  bracketSpacing: true,
  
  // Always include parentheses around arrow function parameters
  // for consistency and clarity, even for single parameters
  arrowParens: 'always',
  
  // Use LF (Line Feed) line endings for Unix/Linux compatibility
  // and consistent behavior across development environments
  endOfLine: 'lf'
};