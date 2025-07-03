/**
 * @fileoverview Unit Test Suite for Hello Router Module
 * 
 * This test suite validates the backend route modules, specifically focusing on the '/hello' endpoint router.
 * It ensures that the router correctly handles GET requests to '/hello', returns the canonical 'Hello world' response,
 * enforces HTTP method restrictions (405 for unsupported methods), and integrates with error handling.
 * 
 * The tests verify that the router is modular, stateless, and compliant with all technical and business requirements
 * for the Node.js tutorial application. Uses Supertest for request simulation and Jest for assertions.
 * 
 * Test Coverage:
 * - Validates '/hello' endpoint returns exact 'Hello world' message for GET requests
 * - Ensures router processes only GET requests to '/hello' 
 * - Verifies 405 Method Not Allowed responses for unsupported methods (POST, PUT, DELETE, PATCH)
 * - Checks correct HTTP status codes, headers, and response bodies for all scenarios
 * - Confirms integration with centralized error handling
 * 
 * @author Generated for Node.js Tutorial Application
 * @version 1.0.0
 */

// External dependencies - Jest testing framework
const { describe, it, expect } = require('jest'); // v29.7.0 - JavaScript testing framework for assertions and test organization

// Internal dependencies - Module under test
const { router } = require('../../../src/backend/routes/hello.js'); // Express Router instance for the '/hello' endpoint to be tested

// Internal dependencies - Test utilities and fixtures
const { makeRequest, assertHelloResponse, assertErrorResponse } = require('../../helpers/testUtils.js'); // Reusable test helpers for HTTP requests and response assertions
const { METHOD_NOT_ALLOWED_RESPONSE } = require('../../fixtures/responses.js'); // Canonical response body for 405 Method Not Allowed errors

/**
 * Top-level test suite for all /hello endpoint router tests.
 * 
 * This describe block contains all unit tests for the hello router module,
 * organized into logical groups for different HTTP methods and error scenarios.
 * The tests ensure the router meets all technical specifications and business requirements.
 */
describe('Hello Router', () => {
    
    /**
     * Test suite for valid GET requests to the /hello endpoint.
     * 
     * This describe block contains tests that validate the successful operation
     * of the GET /hello endpoint, ensuring it returns the correct response format,
     * status codes, and content as specified in the technical requirements.
     */
    describe('GET /hello', () => {
        
        /**
         * Tests that a GET request to '/hello' returns status 200, content-type text/plain,
         * and the canonical 'Hello world' response.
         * 
         * This test validates:
         * - HTTP status code is 200 (OK)
         * - Content-Type header includes text/plain
         * - Response body exactly matches the canonical 'Hello world' message
         * - Response is generated within acceptable time limits
         * 
         * @test {Function} test_GET_hello_returns_hello_world
         * @throws {AssertionError} If any response validation fails
         */
        it('should return Hello world message with status 200 and correct content-type', async () => {
            // Step 1: Use makeRequest to send a GET request to '/hello' on the router
            const response = await makeRequest(router, 'GET', '/hello');
            
            // Step 2: Call assertHelloResponse to validate status, content-type, and body
            assertHelloResponse(response);
        });
        
    });
    
    /**
     * Test suite for unsupported HTTP methods on the /hello endpoint.
     * 
     * This describe block contains tests that validate the router's enforcement
     * of HTTP method restrictions, ensuring proper 405 Method Not Allowed responses
     * for all unsupported methods as specified in the technical requirements.
     */
    describe('Method Not Allowed', () => {
        
        /**
         * Tests that a POST request to '/hello' returns status 405 and the canonical
         * Method Not Allowed response.
         * 
         * This test validates:
         * - HTTP status code is 405 (Method Not Allowed)
         * - Response body matches the canonical METHOD_NOT_ALLOWED_RESPONSE
         * - Router correctly rejects unsupported POST method
         * - Error handling integration works as expected
         * 
         * @test {Function} test_POST_hello_returns_405
         * @throws {AssertionError} If status code or response body validation fails
         */
        it('should return 405 Method Not Allowed for POST requests', async () => {
            // Step 1: Use makeRequest to send a POST request to '/hello' on the router
            const response = await makeRequest(router, 'POST', '/hello');
            
            // Step 2: Call assertErrorResponse to validate status 405 and body equals METHOD_NOT_ALLOWED_RESPONSE
            assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
        });
        
        /**
         * Tests that a PUT request to '/hello' returns status 405 and the canonical
         * Method Not Allowed response.
         * 
         * This test validates:
         * - HTTP status code is 405 (Method Not Allowed)
         * - Response body matches the canonical METHOD_NOT_ALLOWED_RESPONSE
         * - Router correctly rejects unsupported PUT method
         * - Error handling integration works as expected
         * 
         * @test {Function} test_PUT_hello_returns_405
         * @throws {AssertionError} If status code or response body validation fails
         */
        it('should return 405 Method Not Allowed for PUT requests', async () => {
            // Step 1: Use makeRequest to send a PUT request to '/hello' on the router
            const response = await makeRequest(router, 'PUT', '/hello');
            
            // Step 2: Call assertErrorResponse to validate status 405 and body equals METHOD_NOT_ALLOWED_RESPONSE
            assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
        });
        
        /**
         * Tests that a DELETE request to '/hello' returns status 405 and the canonical
         * Method Not Allowed response.
         * 
         * This test validates:
         * - HTTP status code is 405 (Method Not Allowed)
         * - Response body matches the canonical METHOD_NOT_ALLOWED_RESPONSE
         * - Router correctly rejects unsupported DELETE method
         * - Error handling integration works as expected
         * 
         * @test {Function} test_DELETE_hello_returns_405
         * @throws {AssertionError} If status code or response body validation fails
         */
        it('should return 405 Method Not Allowed for DELETE requests', async () => {
            // Step 1: Use makeRequest to send a DELETE request to '/hello' on the router
            const response = await makeRequest(router, 'DELETE', '/hello');
            
            // Step 2: Call assertErrorResponse to validate status 405 and body equals METHOD_NOT_ALLOWED_RESPONSE
            assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
        });
        
        /**
         * Tests that a PATCH request to '/hello' returns status 405 and the canonical
         * Method Not Allowed response.
         * 
         * This test validates:
         * - HTTP status code is 405 (Method Not Allowed)
         * - Response body matches the canonical METHOD_NOT_ALLOWED_RESPONSE
         * - Router correctly rejects unsupported PATCH method
         * - Error handling integration works as expected
         * 
         * @test {Function} test_PATCH_hello_returns_405
         * @throws {AssertionError} If status code or response body validation fails
         */
        it('should return 405 Method Not Allowed for PATCH requests', async () => {
            // Step 1: Use makeRequest to send a PATCH request to '/hello' on the router
            const response = await makeRequest(router, 'PATCH', '/hello');
            
            // Step 2: Call assertErrorResponse to validate status 405 and body equals METHOD_NOT_ALLOWED_RESPONSE
            assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
        });
        
    });
    
});