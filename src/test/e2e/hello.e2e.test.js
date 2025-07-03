/**
 * @fileoverview End-to-End (E2E) Test Suite for /hello Endpoint
 * 
 * Comprehensive E2E test suite for the '/hello' endpoint of the Node.js Hello World
 * tutorial backend. This suite validates the complete request-response lifecycle by
 * running HTTP requests against the fully configured Express app instance, ensuring
 * the endpoint returns the canonical 'Hello world' message, enforces correct HTTP
 * method handling, and integrates with the application's real middleware, routing,
 * and error handling.
 * 
 * The tests ensure compliance with all technical requirements for response content,
 * status codes, headers, and error scenarios in a production-like environment. The
 * E2E tests validate the full HTTP stack including Express middleware, routing,
 * error handling, and response generation.
 * 
 * Test Coverage:
 * - GET /hello endpoint success scenarios (200 OK with canonical response)
 * - HTTP method validation (405 Method Not Allowed for unsupported methods)
 * - Response content validation (exact message matching)
 * - Response headers validation (Content-Type verification)
 * - Error handling validation (consistent error responses)
 * 
 * The suite uses Jest as the testing framework and Supertest for HTTP assertions,
 * with shared test utilities and canonical response fixtures for maintainable
 * and DRY assertions. All tests run against the actual Express application
 * instance with full middleware stack active.
 * 
 * @author Generated for Node.js Tutorial Application
 * @version 1.0.0
 * @requires jest v29.7.0 - JavaScript testing framework
 * @requires supertest v7.1.1 - HTTP assertion library (via test utilities)
 */

// =============================================================================
// EXTERNAL DEPENDENCIES
// =============================================================================

/**
 * Jest Testing Framework Components
 * 
 * Jest is a delightful JavaScript Testing Framework with a focus on simplicity.
 * It works out of the box for most JavaScript projects and provides built-in
 * test runner, assertion library, and mocking capabilities.
 * 
 * @external jest
 * @see {@link https://jestjs.io/docs/api|Jest API Documentation}
 * @version 29.7.0
 */

/**
 * Test Suite Definition Function
 * 
 * The describe function is used to group related tests together and provide
 * a clear structure for the test suite. It creates a test suite block that
 * contains multiple individual test cases.
 * 
 * @function describe
 * @param {string} name - Name of the test suite
 * @param {Function} fn - Function containing the test cases
 */
const { describe } = require('jest'); // Jest v29.7.0 - Test suite grouping

/**
 * Individual Test Case Definition Function
 * 
 * The it function defines individual test cases within a test suite. Each
 * test case should test a specific behavior or requirement and provide
 * clear pass/fail results.
 * 
 * @function it
 * @param {string} name - Name of the test case
 * @param {Function} fn - Function containing the test logic
 */
const { it } = require('jest'); // Jest v29.7.0 - Individual test case definition

/**
 * Assertion Library
 * 
 * The expect function provides assertion capabilities for writing test
 * expectations. It offers a wide range of matchers for validating test
 * results and generating meaningful error messages.
 * 
 * @function expect
 * @param {*} actual - The actual value to test
 * @returns {Object} Expectation object with matcher methods
 */
const { expect } = require('jest'); // Jest v29.7.0 - Assertion library

// =============================================================================
// INTERNAL DEPENDENCIES
// =============================================================================

/**
 * Express Application Instance
 * 
 * Import the fully configured Express application instance from the backend
 * app.js module. This instance includes all middleware, routers, and error
 * handlers configured for production use, ensuring E2E tests validate the
 * complete application stack.
 * 
 * The app instance is destructured from the module exports and represents
 * the target for all HTTP requests in the E2E test suite.
 * 
 * @see {@link ../../backend/app.js|Express Application Module}
 */
const { app } = require('../../backend/app.js');

/**
 * Test Utility Functions
 * 
 * Import reusable test utility functions from the centralized test helpers
 * module. These utilities provide DRY functionality for making HTTP requests
 * and validating responses across all test suites.
 * 
 * Imported Functions:
 * - makeRequest: Helper for sending HTTP requests using Supertest
 * - assertHelloResponse: Reusable assertion for /hello endpoint validation
 * - assertErrorResponse: Reusable assertion for error response validation
 * 
 * @see {@link ../helpers/testUtils.js|Test Utilities Module}
 */
const { makeRequest, assertHelloResponse, assertErrorResponse } = require('../helpers/testUtils.js');

/**
 * Canonical Response Constants
 * 
 * Import canonical response message constants from the test fixtures module.
 * These constants ensure consistent validation of response content across
 * all test suites and provide a single source of truth for expected responses.
 * 
 * Imported Constants:
 * - HELLO_RESPONSE: Canonical "Hello world" message for /hello endpoint
 * - METHOD_NOT_ALLOWED_RESPONSE: Standard 405 error message
 * 
 * @see {@link ../fixtures/responses.js|Response Fixtures Module}
 */
const { HELLO_RESPONSE, METHOD_NOT_ALLOWED_RESPONSE } = require('../fixtures/responses.js');

// =============================================================================
// E2E TEST SUITE
// =============================================================================

/**
 * Main E2E Test Suite for /hello Endpoint
 * 
 * This test suite contains comprehensive end-to-end tests for the /hello endpoint,
 * validating the complete HTTP request-response cycle against the fully configured
 * Express application instance. The tests ensure the endpoint meets all technical
 * requirements for functionality, error handling, and standards compliance.
 * 
 * Test Suite Scope:
 * - HTTP method validation (GET success, others return 405)
 * - Response content validation (exact message matching)
 * - Response headers validation (Content-Type verification)
 * - Status code validation (200 for success, 405 for unsupported methods)
 * - Error handling validation (consistent error responses)
 * 
 * The suite uses the actual Express application instance with all middleware,
 * routing, and error handling active, providing true end-to-end validation
 * of the application's behavior in a production-like environment.
 * 
 * Requirements Addressed:
 * - Hello World Endpoint (F-002): GET /hello returns exact "Hello world" message
 * - Request Processing (F-003): Endpoint accepts GET requests, rejects others
 * - Response Generation (F-004): Correct status codes, headers, and content
 * - Testing Strategy (6.6): E2E validation using Jest and Supertest
 * 
 * @suite E2E /hello endpoint
 */
describe('E2E /hello endpoint', () => {
    
    /**
     * Test Case: GET /hello Returns 200 and Canonical Message
     * 
     * Validates that the /hello endpoint responds correctly to GET requests
     * with the expected status code, content type, and response body. This
     * test ensures the primary functionality of the Hello World endpoint
     * meets all technical requirements.
     * 
     * Test Steps:
     * 1. Send GET request to /hello endpoint using makeRequest helper
     * 2. Validate response using assertHelloResponse for DRY assertions
     * 3. Verify status code is 200 (OK)
     * 4. Verify Content-Type header includes 'text/plain'
     * 5. Verify response body matches HELLO_RESPONSE constant
     * 
     * Expected Behavior:
     * - HTTP status: 200 OK
     * - Content-Type: text/plain (or text/plain; charset=utf-8)
     * - Response body: "Hello world" (exact match)
     * 
     * Requirements Validated:
     * - F-002-RQ-001: GET route for '/hello' endpoint returns success
     * - F-002-RQ-002: Returns canonical "Hello world" message
     * - F-004-RQ-001: Generates HTTP 200 OK response with proper headers
     * 
     * @test GET /hello returns 200 and canonical message
     */
    it('GET /hello returns 200 and canonical message', async () => {
        // Step 1: Send GET request to /hello endpoint
        const response = await makeRequest(app, 'get', '/hello');
        
        // Step 2: Validate complete response using shared assertion helper
        // This performs all required validations: status, content-type, body
        assertHelloResponse(response);
    });
    
    /**
     * Test Case: POST /hello Returns 405 Method Not Allowed
     * 
     * Validates that the /hello endpoint correctly rejects POST requests
     * with a 405 Method Not Allowed status code and the canonical error
     * message. This test ensures proper HTTP method validation.
     * 
     * Test Steps:
     * 1. Send POST request to /hello endpoint using makeRequest helper
     * 2. Validate error response using assertErrorResponse helper
     * 3. Verify status code is 405 (Method Not Allowed)
     * 4. Verify response body matches METHOD_NOT_ALLOWED_RESPONSE
     * 
     * Expected Behavior:
     * - HTTP status: 405 Method Not Allowed
     * - Response body: "Method Not Allowed" (exact match)
     * 
     * Requirements Validated:
     * - F-003-RQ-001: Accepts GET method only, rejects other methods
     * - Error handling for unsupported HTTP methods
     * - Consistent error response format
     * 
     * @test POST /hello returns 405 Method Not Allowed
     */
    it('POST /hello returns 405 Method Not Allowed', async () => {
        // Step 1: Send POST request to /hello endpoint
        const response = await makeRequest(app, 'post', '/hello');
        
        // Step 2: Validate error response with expected status and message
        assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
    });
    
    /**
     * Test Case: PUT /hello Returns 405 Method Not Allowed
     * 
     * Validates that the /hello endpoint correctly rejects PUT requests
     * with a 405 Method Not Allowed status code and the canonical error
     * message. This test ensures comprehensive HTTP method validation.
     * 
     * Test Steps:
     * 1. Send PUT request to /hello endpoint using makeRequest helper
     * 2. Validate error response using assertErrorResponse helper
     * 3. Verify status code is 405 (Method Not Allowed)
     * 4. Verify response body matches METHOD_NOT_ALLOWED_RESPONSE
     * 
     * Expected Behavior:
     * - HTTP status: 405 Method Not Allowed
     * - Response body: "Method Not Allowed" (exact match)
     * 
     * Requirements Validated:
     * - F-003-RQ-001: Accepts GET method only, rejects other methods
     * - Comprehensive HTTP method validation
     * - Consistent error response format across all unsupported methods
     * 
     * @test PUT /hello returns 405 Method Not Allowed
     */
    it('PUT /hello returns 405 Method Not Allowed', async () => {
        // Step 1: Send PUT request to /hello endpoint
        const response = await makeRequest(app, 'put', '/hello');
        
        // Step 2: Validate error response with expected status and message
        assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
    });
    
    /**
     * Test Case: DELETE /hello Returns 405 Method Not Allowed
     * 
     * Validates that the /hello endpoint correctly rejects DELETE requests
     * with a 405 Method Not Allowed status code and the canonical error
     * message. This test completes the HTTP method validation coverage.
     * 
     * Test Steps:
     * 1. Send DELETE request to /hello endpoint using makeRequest helper
     * 2. Validate error response using assertErrorResponse helper
     * 3. Verify status code is 405 (Method Not Allowed)
     * 4. Verify response body matches METHOD_NOT_ALLOWED_RESPONSE
     * 
     * Expected Behavior:
     * - HTTP status: 405 Method Not Allowed
     * - Response body: "Method Not Allowed" (exact match)
     * 
     * Requirements Validated:
     * - F-003-RQ-001: Accepts GET method only, rejects other methods
     * - Complete HTTP method validation coverage
     * - Consistent error response format for all unsupported methods
     * 
     * @test DELETE /hello returns 405 Method Not Allowed
     */
    it('DELETE /hello returns 405 Method Not Allowed', async () => {
        // Step 1: Send DELETE request to /hello endpoint
        const response = await makeRequest(app, 'delete', '/hello');
        
        // Step 2: Validate error response with expected status and message
        assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
    });
    
});