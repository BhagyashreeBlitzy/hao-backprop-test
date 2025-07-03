/**
 * @fileoverview Test Response Fixtures
 * 
 * This module defines canonical response message constants for use in all test suites
 * (unit, integration, e2e). It centralizes the expected plain text and error response
 * bodies for the /hello endpoint and error scenarios (404, 405, 500), ensuring DRY,
 * maintainable, and robust test assertions.
 * 
 * These constants are used by test helpers and test cases to validate that the
 * application returns the correct response content and error messages as specified
 * in the technical requirements.
 * 
 * @author Generated for Node.js Tutorial Application
 * @version 1.0.0
 */

/**
 * Canonical plain text response for the /hello endpoint (status 200).
 * This constant ensures all tests validate the exact expected message
 * returned by the Hello World endpoint.
 * 
 * @constant {string} HELLO_RESPONSE
 * @description The exact response message returned by GET /hello endpoint
 * @example
 * // Usage in test assertions
 * expect(response.text).toBe(HELLO_RESPONSE);
 */
const HELLO_RESPONSE = "Hello world";

/**
 * Standard response body for 404 Not Found errors.
 * This constant is used in tests to validate correct error handling
 * for invalid routes and ensure consistent error messaging.
 * 
 * @constant {string} NOT_FOUND_RESPONSE
 * @description The exact error message returned for 404 Not Found scenarios
 * @example
 * // Usage in test assertions
 * expect(response.text).toBe(NOT_FOUND_RESPONSE);
 */
const NOT_FOUND_RESPONSE = "Not Found";

/**
 * Standard response body for 405 Method Not Allowed errors.
 * This constant is used in tests to validate correct error handling
 * for unsupported HTTP methods and ensure consistent error messaging.
 * 
 * @constant {string} METHOD_NOT_ALLOWED_RESPONSE
 * @description The exact error message returned for 405 Method Not Allowed scenarios
 * @example
 * // Usage in test assertions
 * expect(response.text).toBe(METHOD_NOT_ALLOWED_RESPONSE);
 */
const METHOD_NOT_ALLOWED_RESPONSE = "Method Not Allowed";

/**
 * Standard response body for 500 Internal Server Error.
 * This constant is used in tests to validate correct error handling
 * for unexpected server errors and ensure consistent error messaging.
 * 
 * @constant {string} INTERNAL_SERVER_ERROR_RESPONSE
 * @description The exact error message returned for 500 Internal Server Error scenarios
 * @example
 * // Usage in test assertions
 * expect(response.text).toBe(INTERNAL_SERVER_ERROR_RESPONSE);
 */
const INTERNAL_SERVER_ERROR_RESPONSE = "Internal Server Error";

/**
 * Export all response constants for use in test suites.
 * 
 * These exports enable test helpers (e.g., src/test/helpers/testUtils.js)
 * and test cases to import and use the canonical response messages.
 * 
 * If the application's response messages change, only this file needs
 * to be updated for all tests to remain valid, supporting maintainability
 * and reducing duplication across the test suite.
 * 
 * The values must match exactly what is returned by the backend routes
 * and error handlers as specified in the technical requirements.
 */
module.exports = {
    HELLO_RESPONSE,
    NOT_FOUND_RESPONSE,
    METHOD_NOT_ALLOWED_RESPONSE,
    INTERNAL_SERVER_ERROR_RESPONSE
};