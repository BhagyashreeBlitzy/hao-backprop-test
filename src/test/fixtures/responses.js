/**
 * Canonical Response Message Constants for Test Suites
 * 
 * This file defines the standard response message constants used across all test suites
 * (unit, integration, e2e) to ensure DRY, maintainable, and robust test assertions.
 * 
 * These constants centralize the expected plain text and error response bodies for:
 * - /hello endpoint success response (200 OK)
 * - HTTP error scenarios (404, 405, 500)
 * 
 * The values must match exactly what is returned by the backend routes and error handlers
 * as specified in the technical requirements. If the application's response messages change,
 * only this file needs to be updated for all tests to remain valid.
 * 
 * Used by:
 * - Test helpers (e.g., src/test/helpers/testUtils.js)  
 * - Direct test case imports for consistent assertions
 * - All test suites to validate correct response content and error messages
 */

/**
 * Canonical plain text response for the /hello endpoint (status 200)
 * Used in all tests to validate correct message delivery from GET /hello requests
 * @type {string}
 */
const HELLO_RESPONSE = "Hello world";

/**
 * Standard response body for 404 Not Found errors
 * Used in tests to validate correct error handling for invalid routes
 * @type {string}
 */
const NOT_FOUND_RESPONSE = "Not Found";

/**
 * Standard response body for 405 Method Not Allowed errors  
 * Used in tests to validate correct error handling for unsupported HTTP methods
 * @type {string}
 */
const METHOD_NOT_ALLOWED_RESPONSE = "Method Not Allowed";

/**
 * Standard response body for 500 Internal Server Error
 * Used in tests to validate correct error handling for unexpected server errors
 * @type {string}
 */
const INTERNAL_SERVER_ERROR_RESPONSE = "Internal Server Error";

// Export all response constants as named exports for use in test suites
module.exports = {
  HELLO_RESPONSE,
  NOT_FOUND_RESPONSE,
  METHOD_NOT_ALLOWED_RESPONSE,
  INTERNAL_SERVER_ERROR_RESPONSE
};