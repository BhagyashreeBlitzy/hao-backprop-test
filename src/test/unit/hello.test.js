/**
 * Unit Test Suite for '/hello' Endpoint Router
 * 
 * This test suite validates the router defined in src/backend/routes/hello.js to ensure
 * it correctly handles GET requests to '/hello' by returning the canonical 'Hello world'
 * response, enforces method restrictions (405 for non-GET methods), and integrates with
 * error handling as specified in the technical requirements.
 * 
 * The tests use Supertest to simulate HTTP requests directly to the router instance,
 * isolating the router functionality from the full application context. This provides
 * fast feedback and ensures the router's contract, error handling, and response format
 * are correct in isolation.
 * 
 * Test Coverage:
 * - GET /hello returns 200 with canonical "Hello world" message
 * - All other HTTP methods (POST, PUT, DELETE, PATCH, HEAD, OPTIONS) return 405
 * - Query parameters are handled gracefully without affecting the response
 * - Response headers and content types are correctly set
 * 
 * Dependencies:
 * - Jest ^29.7.0: Testing framework and assertions
 * - Supertest integration via testUtils helpers
 * - Shared test fixtures for canonical response validation
 * 
 * @fileoverview Unit tests for the /hello endpoint router
 * @author Test Development Team
 * @version 1.0.0
 * @since Node.js 18+
 */

// Import Jest testing functions for test structure and assertions
const { describe, it, expect } = require('jest'); // ^29.7.0 - JavaScript testing framework

// Import the router instance under test from the hello route module
// This is the Express router that handles all /hello endpoint functionality
const { router } = require('../../../backend/routes/hello.js');

// Import reusable test helper functions for DRY and maintainable test code
// These helpers provide consistent HTTP request simulation and response validation
const { 
    makeRequest,           // Helper for sending HTTP requests to the router using Supertest
    assertHelloResponse,   // Reusable assertion for validating canonical /hello responses
    assertErrorResponse    // Reusable assertion for validating error responses (405, 404, etc.)
} = require('../../helpers/testUtils.js');

// Import canonical response fixture for method not allowed errors
// This ensures consistent error message validation across all test suites
const { METHOD_NOT_ALLOWED_RESPONSE } = require('../../fixtures/responses.js');

/**
 * Main test suite for the '/hello' endpoint router
 * 
 * This test suite groups all unit tests for the hello router functionality,
 * including success scenarios (GET requests) and error scenarios (unsupported methods).
 * The tests validate the router in isolation from the full Express application.
 * 
 * Test Organization:
 * - Success scenarios: GET /hello endpoint functionality
 * - Error scenarios: Method not allowed for unsupported HTTP methods
 * - Edge cases: Query parameters and request variations
 * 
 * The suite uses descriptive test names and comprehensive assertions to ensure
 * the router meets all technical specifications and handles edge cases properly.
 */
describe('/hello router', () => {
    
    /**
     * Test Case: GET /hello returns 200 and canonical message
     * 
     * Validates that the router correctly handles GET requests to the /hello endpoint
     * by returning a 200 status code with the canonical "Hello world" message.
     * This test verifies the primary functionality of the tutorial application.
     * 
     * Expectations:
     * - HTTP status code: 200 (OK)
     * - Content-Type: text/plain; charset=utf-8
     * - Response body: "Hello world" (exact match)
     * - Response headers: Properly set by Express.js
     */
    it('should return 200 and canonical message for GET /hello', async () => {
        // Step 1: Send GET request to /hello endpoint using makeRequest helper
        // This simulates a client making a GET request directly to the router
        const response = await makeRequest(router, 'get', '/hello');
        
        // Step 2: Validate the response using the shared assertHelloResponse helper
        // This ensures consistent validation of status, headers, and body content
        assertHelloResponse(response);
    });

    /**
     * Test Case: POST /hello returns 405 Method Not Allowed
     * 
     * Validates that the router correctly rejects POST requests to the /hello endpoint
     * with a 405 Method Not Allowed status and the canonical error message.
     * This test ensures proper HTTP method enforcement.
     * 
     * Expectations:
     * - HTTP status code: 405 (Method Not Allowed)
     * - Response body: "Method Not Allowed" (exact match from fixture)
     * - Error handling: Proper integration with centralized error handling
     */
    it('should return 405 Method Not Allowed for POST /hello', async () => {
        // Step 1: Send POST request to /hello endpoint using makeRequest helper
        // This simulates a client attempting an unsupported HTTP method
        const response = await makeRequest(router, 'post', '/hello');
        
        // Step 2: Validate the error response using assertErrorResponse helper
        // This ensures consistent error handling with proper status and message
        assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
    });

    /**
     * Test Case: PUT /hello returns 405 Method Not Allowed
     * 
     * Validates that the router correctly rejects PUT requests to the /hello endpoint
     * with a 405 Method Not Allowed status and the canonical error message.
     * This test ensures comprehensive HTTP method restriction enforcement.
     * 
     * Expectations:
     * - HTTP status code: 405 (Method Not Allowed)
     * - Response body: "Method Not Allowed" (exact match from fixture)
     * - Consistent error format across all unsupported methods
     */
    it('should return 405 Method Not Allowed for PUT /hello', async () => {
        // Step 1: Send PUT request to /hello endpoint using makeRequest helper
        // This tests another common HTTP method that should be rejected
        const response = await makeRequest(router, 'put', '/hello');
        
        // Step 2: Validate the error response matches expected 405 behavior
        // Uses shared error assertion for consistency across method tests
        assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
    });

    /**
     * Test Case: DELETE /hello returns 405 Method Not Allowed
     * 
     * Validates that the router correctly rejects DELETE requests to the /hello endpoint
     * with a 405 Method Not Allowed status and the canonical error message.
     * This test ensures REST API method restrictions are properly enforced.
     * 
     * Expectations:
     * - HTTP status code: 405 (Method Not Allowed)
     * - Response body: "Method Not Allowed" (exact match from fixture)
     * - Proper error handling for destructive HTTP methods
     */
    it('should return 405 Method Not Allowed for DELETE /hello', async () => {
        // Step 1: Send DELETE request to /hello endpoint using makeRequest helper
        // This tests rejection of destructive HTTP methods
        const response = await makeRequest(router, 'delete', '/hello');
        
        // Step 2: Validate the error response follows the established pattern
        // Ensures consistent error handling across all unsupported methods
        assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
    });

    /**
     * Test Case: PATCH /hello returns 405 Method Not Allowed
     * 
     * Validates that the router correctly rejects PATCH requests to the /hello endpoint
     * with a 405 Method Not Allowed status and the canonical error message.
     * This test ensures partial update methods are properly restricted.
     * 
     * Expectations:
     * - HTTP status code: 405 (Method Not Allowed)
     * - Response body: "Method Not Allowed" (exact match from fixture)
     * - Comprehensive method enforcement including modern HTTP methods
     */
    it('should return 405 Method Not Allowed for PATCH /hello', async () => {
        // Step 1: Send PATCH request to /hello endpoint using makeRequest helper
        // This tests rejection of partial update HTTP methods
        const response = await makeRequest(router, 'patch', '/hello');
        
        // Step 2: Validate the error response maintains consistency
        // Ensures all HTTP methods follow the same error handling pattern
        assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
    });

    /**
     * Test Case: HEAD /hello returns 405 Method Not Allowed
     * 
     * Validates that the router correctly rejects HEAD requests to the /hello endpoint
     * with a 405 Method Not Allowed status and the canonical error message.
     * This test ensures metadata-only requests are properly handled.
     * 
     * Expectations:
     * - HTTP status code: 405 (Method Not Allowed)
     * - Response body: "Method Not Allowed" (exact match from fixture)
     * - Proper handling of HTTP methods used for metadata retrieval
     */
    it('should return 405 Method Not Allowed for HEAD /hello', async () => {
        // Step 1: Send HEAD request to /hello endpoint using makeRequest helper
        // This tests rejection of header-only HTTP requests
        const response = await makeRequest(router, 'head', '/hello');
        
        // Step 2: Validate the error response follows the established standard
        // Ensures comprehensive method restriction including metadata methods
        assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
    });

    /**
     * Test Case: OPTIONS /hello returns 405 Method Not Allowed
     * 
     * Validates that the router correctly rejects OPTIONS requests to the /hello endpoint
     * with a 405 Method Not Allowed status and the canonical error message.
     * This test ensures CORS preflight and capability discovery methods are restricted.
     * 
     * Expectations:
     * - HTTP status code: 405 (Method Not Allowed)
     * - Response body: "Method Not Allowed" (exact match from fixture)
     * - Proper handling of HTTP methods used for capability discovery
     */
    it('should return 405 Method Not Allowed for OPTIONS /hello', async () => {
        // Step 1: Send OPTIONS request to /hello endpoint using makeRequest helper
        // This tests rejection of capability discovery HTTP requests
        const response = await makeRequest(router, 'options', '/hello');
        
        // Step 2: Validate the error response maintains the established pattern
        // Ensures complete method enforcement including CORS-related methods
        assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
    });

    /**
     * Test Case: GET /hello with query params returns canonical message
     * 
     * Validates that the router handles GET requests with query parameters gracefully,
     * returning the same canonical "Hello world" message regardless of query parameters.
     * This test ensures robustness and demonstrates that the endpoint is stateless.
     * 
     * This is an optional test for robustness as specified in the requirements,
     * ensuring the endpoint handles various client request patterns consistently.
     * 
     * Expectations:
     * - HTTP status code: 200 (OK)
     * - Content-Type: text/plain; charset=utf-8
     * - Response body: "Hello world" (same as without query params)
     * - Query parameters are ignored (stateless behavior)
     */
    it('should return canonical message for GET /hello with query params', async () => {
        // Step 1: Send GET request to /hello with query parameters
        // This tests the router's behavior with additional URL parameters
        const response = await makeRequest(router, 'get', '/hello?foo=bar&test=123');
        
        // Step 2: Validate the response is identical to the base case
        // This ensures query parameters don't affect the core functionality
        assertHelloResponse(response);
    });
});