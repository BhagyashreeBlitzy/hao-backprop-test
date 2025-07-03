/**
 * @fileoverview Test Utility Module
 * 
 * Centralized test utility module providing reusable helpers for HTTP request simulation
 * and assertion logic across all test suites (unit, integration, e2e, performance) for
 * the Node.js/Express.js tutorial application.
 * 
 * This module exposes DRY functions for making HTTP requests to the Express app or routers
 * using Supertest, and for asserting canonical responses for the /hello endpoint and error
 * scenarios. Ensures all tests use consistent logic for request execution and response
 * validation, supporting maintainable, robust, and standards-compliant test code.
 * 
 * The helpers are designed to work with both Express app instances and routers, and to
 * support all HTTP methods and error scenarios required by the technical specification.
 * 
 * @author Generated for Node.js Tutorial Application
 * @version 1.0.0
 */

// External dependencies
const supertest = require('supertest'); // v7.1.1 - HTTP testing library for Express applications
const { expect } = require('jest'); // v29.7.0 - Jest assertion library for test expectations

// Internal dependencies - canonical response constants
const {
    HELLO_RESPONSE,
    NOT_FOUND_RESPONSE,
    METHOD_NOT_ALLOWED_RESPONSE,
    INTERNAL_SERVER_ERROR_RESPONSE
} = require('../fixtures/responses.js');

/**
 * Sends an HTTP request to the provided Express app or router using Supertest.
 * 
 * This function creates a Supertest agent for the provided Express application or router
 * and sends an HTTP request with the specified method, path, and optional configuration.
 * Supports all HTTP methods (GET, POST, PUT, DELETE, etc.) and allows customization
 * of headers, query parameters, and request body.
 * 
 * The function is designed to work with both Express app instances and Express routers,
 * making it versatile for unit testing individual routers or integration testing
 * complete applications.
 * 
 * @param {Object} appOrRouter - Express application instance or router to test
 * @param {string} method - HTTP method to use (GET, POST, PUT, DELETE, etc.)
 * @param {string} path - Request path/endpoint to test (e.g., '/hello', '/users')
 * @param {Object} [options={}] - Optional configuration object
 * @param {Object} [options.headers] - HTTP headers to include in request
 * @param {Object} [options.query] - Query parameters to include in URL
 * @param {*} [options.body] - Request body data (for POST, PUT, etc.)
 * @returns {Promise<Object>} Supertest response object containing status, headers, and body
 * 
 * @example
 * // Basic GET request
 * const response = await makeRequest(app, 'GET', '/hello');
 * 
 * @example
 * // POST request with body and headers
 * const response = await makeRequest(app, 'POST', '/users', {
 *   body: { name: 'John Doe' },
 *   headers: { 'Content-Type': 'application/json' }
 * });
 * 
 * @example
 * // GET request with query parameters
 * const response = await makeRequest(app, 'GET', '/search', {
 *   query: { q: 'test', limit: 10 }
 * });
 */
async function makeRequest(appOrRouter, method, path, options = {}) {
    // Step 1: Create a Supertest agent for the provided app or router
    const agent = supertest(appOrRouter);
    
    // Step 2: Configure the request with the specified HTTP method and path
    // Convert method to lowercase for Supertest method calls
    const methodLowerCase = method.toLowerCase();
    let request = agent[methodLowerCase](path);
    
    // Step 3: Apply any headers from options
    if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
            request = request.set(key, value);
        });
    }
    
    // Step 4: Apply any query parameters from options
    if (options.query) {
        request = request.query(options.query);
    }
    
    // Step 5: Apply request body if provided (for POST, PUT, etc.)
    if (options.body) {
        request = request.send(options.body);
    }
    
    // Step 6: Send the request and await the response
    const response = await request;
    
    // Step 7: Return the Supertest response object
    return response;
}

/**
 * Reusable assertion for validating the canonical /hello endpoint response.
 * 
 * This function performs comprehensive validation of the /hello endpoint response
 * to ensure it meets the technical specification requirements. It checks for:
 * - HTTP status code 200 (OK)
 * - Content-Type header includes 'text/plain'
 * - Response body exactly matches the canonical HELLO_RESPONSE constant
 * 
 * The function is designed to be used across all test suites (unit, integration,
 * e2e, performance) to ensure consistent validation logic for the hello endpoint.
 * If the canonical response changes, only the fixtures file needs to be updated.
 * 
 * @param {Object} response - Supertest response object from makeRequest or direct supertest call
 * @param {number} response.status - HTTP status code
 * @param {Object} response.headers - HTTP response headers
 * @param {string} response.text - Response body as text
 * @returns {void} Throws assertion errors if expectations are not met
 * 
 * @throws {AssertionError} When status is not 200
 * @throws {AssertionError} When content-type is not text/plain
 * @throws {AssertionError} When response body doesn't match canonical message
 * 
 * @example
 * // Usage in test cases
 * const response = await makeRequest(app, 'GET', '/hello');
 * assertHelloResponse(response);
 * 
 * @example
 * // Direct usage with supertest
 * const response = await supertest(app).get('/hello');
 * assertHelloResponse(response);
 */
function assertHelloResponse(response) {
    // Step 1: Assert response status is 200
    expect(response.status).toBe(200);
    
    // Step 2: Assert response content-type includes 'text/plain'
    expect(response.headers['content-type']).toMatch(/text\/plain/);
    
    // Step 3: Assert response text equals the canonical HELLO_RESPONSE
    expect(response.text).toBe(HELLO_RESPONSE);
}

/**
 * Reusable assertion for validating error responses (404, 405, 500, etc.).
 * 
 * This function performs validation of error responses to ensure they meet the
 * technical specification requirements for error handling. It checks for:
 * - Correct HTTP status code (404, 405, 500, etc.)
 * - Response body exactly matches the expected canonical error message
 * 
 * The function is designed to work with all error scenarios defined in the
 * technical specification and uses the canonical error response constants
 * to ensure consistent error message validation across all test suites.
 * 
 * @param {Object} response - Supertest response object from makeRequest or direct supertest call
 * @param {number} response.status - HTTP status code
 * @param {string} response.text - Response body as text
 * @param {number} expectedStatus - Expected HTTP status code (404, 405, 500, etc.)
 * @param {string} expectedBody - Expected response body text (canonical error message)
 * @returns {void} Throws assertion errors if expectations are not met
 * 
 * @throws {AssertionError} When status doesn't match expectedStatus
 * @throws {AssertionError} When response body doesn't match expectedBody
 * 
 * @example
 * // Test 404 Not Found error
 * const response = await makeRequest(app, 'GET', '/invalid-path');
 * assertErrorResponse(response, 404, NOT_FOUND_RESPONSE);
 * 
 * @example
 * // Test 405 Method Not Allowed error
 * const response = await makeRequest(app, 'POST', '/hello');
 * assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
 * 
 * @example
 * // Test 500 Internal Server Error
 * const response = await makeRequest(app, 'GET', '/error-trigger');
 * assertErrorResponse(response, 500, INTERNAL_SERVER_ERROR_RESPONSE);
 */
function assertErrorResponse(response, expectedStatus, expectedBody) {
    // Step 1: Assert response status equals expectedStatus
    expect(response.status).toBe(expectedStatus);
    
    // Step 2: Assert response text equals expectedBody
    expect(response.text).toBe(expectedBody);
}

/**
 * Export all test utility functions for use in test suites.
 * 
 * These exports enable test files across all test suites (unit, integration, e2e,
 * performance) to import and use the reusable HTTP request and assertion helpers.
 * 
 * The exported functions support:
 * - DRY (Don't Repeat Yourself) test code principles
 * - Maintainable test suites with centralized logic
 * - Robust test assertions with canonical response validation
 * - Standards-compliant HTTP testing patterns
 * 
 * Usage across test suites:
 * - Unit tests: Testing individual route handlers and middleware
 * - Integration tests: Testing complete request-response cycles
 * - E2E tests: Testing full application workflows
 * - Performance tests: Testing response times and correctness under load
 * 
 * The helpers are compatible with both Express app instances and Express routers,
 * making them versatile for different testing scenarios and component isolation.
 */
module.exports = {
    makeRequest,
    assertHelloResponse,
    assertErrorResponse
};