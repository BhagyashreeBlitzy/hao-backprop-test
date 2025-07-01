/**
 * Unit Test Suite for Hello Router Module
 * 
 * This test suite validates the backend route modules, focusing on the '/hello' endpoint router.
 * It ensures that the router correctly handles GET requests to '/hello', returns the canonical
 * 'Hello world' response, enforces HTTP method restrictions (405 for unsupported methods),
 * and integrates with error handling.
 * 
 * The tests verify that the router is modular, stateless, and compliant with all technical
 * and business requirements for the Node.js tutorial application. Uses Supertest for request
 * simulation and Jest for assertions with DRY helpers and canonical response fixtures.
 * 
 * Test Coverage:
 * - GET /hello endpoint returns correct response (200, "Hello world")
 * - POST /hello returns 405 Method Not Allowed
 * - PUT /hello returns 405 Method Not Allowed
 * - DELETE /hello returns 405 Method Not Allowed
 * - PATCH /hello returns 405 Method Not Allowed
 * 
 * @fileoverview Unit tests for hello router endpoint validation
 * @author Backend Development Team
 * @version 1.0.0
 * @since Node.js 18+
 */

// Import Jest testing framework functions
const { describe, it, expect } = require('jest'); // ^29.7.0 - JavaScript testing framework with built-in assertions

// Import the Express Router instance for the '/hello' endpoint to be tested in isolation
const { router } = require('../../../src/backend/routes/hello.js');

// Import reusable test helpers for DRY and robust test code
const { 
    makeRequest,           // Helper for simulating HTTP requests using Supertest
    assertHelloResponse,   // Reusable assertion for validating canonical /hello responses
    assertErrorResponse    // Reusable assertion for validating error responses
} = require('../../helpers/testUtils.js');

// Import canonical response fixtures for consistent test assertions
const { 
    METHOD_NOT_ALLOWED_RESPONSE // Canonical response body for 405 Method Not Allowed errors
} = require('../../fixtures/responses.js');

/**
 * Top-level test suite for all /hello endpoint router tests
 * 
 * This describe block organizes all tests related to the hello router functionality,
 * including successful GET requests and error handling for unsupported HTTP methods.
 * The tests ensure 100% coverage of the router's public API and validate compliance
 * with technical requirements.
 */
describe('Hello Router', () => {

    /**
     * Test suite for valid GET requests to the /hello endpoint
     * 
     * This describe block contains tests that validate the primary functionality
     * of the hello router - processing GET requests and returning the canonical
     * "Hello world" response with proper status codes and headers.
     */
    describe('GET /hello', () => {

        /**
         * Tests that a GET request to '/hello' returns the canonical response
         * 
         * This test validates that the router correctly handles GET requests to '/hello'
         * by returning status 200, content-type text/plain, and the exact 'Hello world'
         * response as specified in the technical requirements.
         * 
         * Test Steps:
         * 1. Use makeRequest to send a GET request to '/hello' on the router
         * 2. Await the response from the router
         * 3. Call assertHelloResponse to validate status, content-type, and body
         * 
         * Expected Result:
         * - HTTP Status: 200 OK
         * - Content-Type: text/plain; charset=utf-8
         * - Response Body: "Hello world"
         * 
         * @test {Function} test_GET_hello_returns_hello_world
         */
        it('should return Hello world for GET requests', async () => {
            // Step 1: Use makeRequest to send a GET request to '/hello' on the router
            // The makeRequest helper uses Supertest to simulate HTTP requests to the router
            const response = await makeRequest(router, 'GET', '/hello');
            
            // Step 2: Call assertHelloResponse to validate status, content-type, and body
            // The assertHelloResponse helper validates all aspects of the canonical response
            // including HTTP status 200, content-type header, and exact message match
            assertHelloResponse(response);
        });

    });

    /**
     * Test suite for unsupported HTTP methods on the /hello endpoint
     * 
     * This describe block contains tests that validate the router's error handling
     * for unsupported HTTP methods. Each test ensures that non-GET requests to
     * '/hello' return a 405 Method Not Allowed error with the canonical error message.
     */
    describe('Method Not Allowed', () => {

        /**
         * Tests that a POST request to '/hello' returns 405 Method Not Allowed
         * 
         * This test validates that the router correctly rejects POST requests to '/hello'
         * by returning status 405 and the canonical Method Not Allowed response message.
         * 
         * Test Steps:
         * 1. Use makeRequest to send a POST request to '/hello' on the router
         * 2. Await the response from the router
         * 3. Call assertErrorResponse to validate status 405 and canonical error body
         * 
         * Expected Result:
         * - HTTP Status: 405 Method Not Allowed
         * - Response Body: "Method Not Allowed"
         * 
         * @test {Function} test_POST_hello_returns_405
         */
        it('should return 405 for POST requests', async () => {
            // Step 1: Use makeRequest to send a POST request to '/hello' on the router
            // The makeRequest helper simulates unsupported HTTP methods for testing
            const response = await makeRequest(router, 'POST', '/hello');
            
            // Step 2: Call assertErrorResponse to validate status 405 and canonical error body
            // Validates that the response has status 405 and body equals METHOD_NOT_ALLOWED_RESPONSE
            assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
        });

        /**
         * Tests that a PUT request to '/hello' returns 405 Method Not Allowed
         * 
         * This test validates that the router correctly rejects PUT requests to '/hello'
         * by returning status 405 and the canonical Method Not Allowed response message.
         * 
         * Test Steps:
         * 1. Use makeRequest to send a PUT request to '/hello' on the router
         * 2. Await the response from the router
         * 3. Call assertErrorResponse to validate status 405 and canonical error body
         * 
         * Expected Result:
         * - HTTP Status: 405 Method Not Allowed
         * - Response Body: "Method Not Allowed"
         * 
         * @test {Function} test_PUT_hello_returns_405
         */
        it('should return 405 for PUT requests', async () => {
            // Step 1: Use makeRequest to send a PUT request to '/hello' on the router
            // The makeRequest helper simulates unsupported HTTP methods for testing
            const response = await makeRequest(router, 'PUT', '/hello');
            
            // Step 2: Call assertErrorResponse to validate status 405 and canonical error body
            // Validates that the response has status 405 and body equals METHOD_NOT_ALLOWED_RESPONSE
            assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
        });

        /**
         * Tests that a DELETE request to '/hello' returns 405 Method Not Allowed
         * 
         * This test validates that the router correctly rejects DELETE requests to '/hello'
         * by returning status 405 and the canonical Method Not Allowed response message.
         * 
         * Test Steps:
         * 1. Use makeRequest to send a DELETE request to '/hello' on the router
         * 2. Await the response from the router
         * 3. Call assertErrorResponse to validate status 405 and canonical error body
         * 
         * Expected Result:
         * - HTTP Status: 405 Method Not Allowed
         * - Response Body: "Method Not Allowed"
         * 
         * @test {Function} test_DELETE_hello_returns_405
         */
        it('should return 405 for DELETE requests', async () => {
            // Step 1: Use makeRequest to send a DELETE request to '/hello' on the router
            // The makeRequest helper simulates unsupported HTTP methods for testing
            const response = await makeRequest(router, 'DELETE', '/hello');
            
            // Step 2: Call assertErrorResponse to validate status 405 and canonical error body
            // Validates that the response has status 405 and body equals METHOD_NOT_ALLOWED_RESPONSE
            assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
        });

        /**
         * Tests that a PATCH request to '/hello' returns 405 Method Not Allowed
         * 
         * This test validates that the router correctly rejects PATCH requests to '/hello'
         * by returning status 405 and the canonical Method Not Allowed response message.
         * 
         * Test Steps:
         * 1. Use makeRequest to send a PATCH request to '/hello' on the router
         * 2. Await the response from the router
         * 3. Call assertErrorResponse to validate status 405 and canonical error body
         * 
         * Expected Result:
         * - HTTP Status: 405 Method Not Allowed
         * - Response Body: "Method Not Allowed"
         * 
         * @test {Function} test_PATCH_hello_returns_405
         */
        it('should return 405 for PATCH requests', async () => {
            // Step 1: Use makeRequest to send a PATCH request to '/hello' on the router
            // The makeRequest helper simulates unsupported HTTP methods for testing
            const response = await makeRequest(router, 'PATCH', '/hello');
            
            // Step 2: Call assertErrorResponse to validate status 405 and canonical error body
            // Validates that the response has status 405 and body equals METHOD_NOT_ALLOWED_RESPONSE
            assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
        });

    });

});