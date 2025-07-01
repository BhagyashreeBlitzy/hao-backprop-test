/**
 * Integration Test Suite for Hello Router - Route-Level HTTP Request/Response Validation
 * 
 * This integration test suite validates the Express router for the '/hello' endpoint using
 * Supertest to simulate real HTTP requests and responses. It ensures that the router correctly
 * handles all canonical success and error scenarios, including method enforcement, proper
 * status codes, headers, and response content.
 * 
 * The test suite focuses on router-level integration testing by directly testing the
 * exported router instance from src/backend/routes/hello.js. It uses centralized test
 * helpers and fixtures to ensure DRY, maintainable, and standards-compliant assertions.
 * 
 * Test Coverage:
 * - GET /hello canonical success response (200, content-type, body)
 * - Invalid route handling (404 Not Found)
 * - Unsupported HTTP methods (405 Method Not Allowed)
 * - Query parameter handling (should not affect response)
 * - Header validation (Content-Type correctness)
 * - Response time performance requirements
 * 
 * Dependencies:
 * - Jest ^29.7.0: Test framework with built-in assertions and test runner
 * - Supertest ^7.1.1: HTTP testing library for Express routers and apps
 * - Express 5.1.0: Router instance under test with method enforcement
 * 
 * Technical Requirements Validated:
 * - HTTP/1.1 protocol compliance
 * - Response time < 100ms target
 * - Proper Content-Type headers (text/plain; charset=utf-8)
 * - Canonical response message consistency
 * - HTTP status code correctness (200, 404, 405)
 * - Method enforcement and error handling integration
 * 
 * @fileoverview Integration tests for Express hello router with comprehensive HTTP validation
 * @author Backend Testing Team
 * @version 1.0.0
 * @since Node.js 18+
 * @requires jest@^29.7.0
 * @requires supertest@^7.1.1
 * @requires express@5.1.0
 */

// Import Jest testing framework functions for test organization and assertions
// Jest ^29.7.0 - JavaScript testing framework with built-in assertions and mocking
const { describe, it, expect } = require('jest');

// Import Supertest for HTTP request simulation to Express routers
// Supertest ^7.1.1 - HTTP testing library that works with Express apps and routers
const supertest = require('supertest');

// Import Express for creating a minimal app instance to mount the router for testing
// Express 5.1.0 - Web framework for Node.js with enhanced security and performance
const express = require('express');

// Import the Express router instance under test from the hello routes module
// This router contains the '/hello' endpoint with GET support and method enforcement
const { router } = require('../../../src/backend/routes/hello.js');

// Import centralized test helpers for consistent HTTP request simulation and assertions
// These helpers provide DRY, maintainable test code with standardized validation logic
const {
    makeRequest,
    assertHelloResponse, 
    assertErrorResponse
} = require('../helpers/testUtils.js');

// Import canonical response constants for consistent test assertions
// These constants ensure that tests validate against the exact expected response content
const {
    HELLO_RESPONSE,
    NOT_FOUND_RESPONSE,
    METHOD_NOT_ALLOWED_RESPONSE
} = require('../fixtures/responses.js');

/**
 * Create a minimal Express application instance for mounting the router under test
 * 
 * This approach allows us to test the router in isolation while still providing
 * the Express application context needed for Supertest HTTP request simulation.
 * The minimal app contains only the essential middleware and router mounting
 * needed for integration testing.
 * 
 * App Configuration:
 * - Minimal Express app with no additional middleware
 * - Router mounted at the root level (router defines its own '/hello' path)
 * - No additional error handling (uses Express.js default error handling)
 * - Suitable for testing router behavior in isolation
 */
const app = express();

// Mount the hello router on the Express app for HTTP request testing
// The router internally defines the '/hello' route, so no additional path is needed
app.use(router);

/**
 * Main Integration Test Suite for Hello Router
 * 
 * This test suite validates the complete request-response cycle for the hello router,
 * ensuring that all HTTP interactions work correctly according to the technical
 * specifications. It covers both success scenarios and error handling.
 * 
 * Test Organization:
 * - Success scenarios: Valid GET requests and response validation
 * - Error scenarios: Invalid routes and unsupported methods
 * - Edge cases: Query parameters, header validation, performance requirements
 * 
 * Integration Level:
 * - Tests the router as a complete unit with HTTP protocol simulation
 * - Validates end-to-end request processing and response generation
 * - Ensures proper integration with Express.js framework features
 */
describe('Hello Router Integration', () => {
    
    /**
     * Test Suite: Successful GET /hello Endpoint Scenarios
     * 
     * This test group validates all successful request scenarios for the
     * '/hello' endpoint, ensuring that the canonical response is delivered
     * correctly with proper status codes, headers, and content.
     */
    describe('GET /hello Success Scenarios', () => {
        
        /**
         * Test: GET /hello returns 200 status and canonical response
         * 
         * This test validates the primary functionality of the hello endpoint:
         * - HTTP status code 200 (OK)
         * - Content-Type header includes 'text/plain'
         * - Response body exactly matches HELLO_RESPONSE constant
         * 
         * Uses centralized helpers for consistent assertion logic.
         */
        it('should return 200 and canonical response', async () => {
            // Send GET request to /hello using the centralized makeRequest helper
            const response = await makeRequest(app, 'get', '/hello');
            
            // Validate the response using the centralized assertHelloResponse helper
            // This ensures consistent validation of status, content-type, and body
            assertHelloResponse(response);
        });
        
        /**
         * Test: GET /hello with query parameters still returns canonical response
         * 
         * This test ensures that query parameters do not affect the static
         * response behavior of the hello endpoint. The endpoint should ignore
         * query parameters and return the same canonical response.
         */
        it('should return canonical response with query parameters', async () => {
            // Send GET request with query parameters to verify they don't affect response
            const response = await makeRequest(app, 'get', '/hello?foo=bar&test=123');
            
            // Validate that the response is identical to requests without query parameters
            assertHelloResponse(response);
        });
        
        /**
         * Test: GET /hello returns correct Content-Type header
         * 
         * This test specifically validates the Content-Type header to ensure
         * proper MIME type declaration for plain text responses.
         * 
         * Expected: 'text/plain; charset=utf-8' or similar text/plain variation
         */
        it('should return correct Content-Type header', async () => {
            // Send GET request to /hello endpoint
            const response = await makeRequest(app, 'get', '/hello');
            
            // Validate HTTP status code is 200
            expect(response.status).toBe(200);
            
            // Validate Content-Type header includes 'text/plain'
            // This handles variations like 'text/plain; charset=utf-8'
            expect(response.headers['content-type']).toEqual(
                expect.stringContaining('text/plain')
            );
        });
        
        /**
         * Test: GET /hello returns correct response body content
         * 
         * This test specifically validates the response body content to ensure
         * it exactly matches the canonical HELLO_RESPONSE constant.
         */
        it('should return correct body content', async () => {
            // Send GET request to /hello endpoint
            const response = await makeRequest(app, 'get', '/hello');
            
            // Validate HTTP status code is 200
            expect(response.status).toBe(200);
            
            // Validate response body exactly matches the canonical HELLO_RESPONSE
            // Use response.text for plain text responses
            expect(response.text).toBe(HELLO_RESPONSE);
        });
        
        /**
         * Test: GET /hello responds within performance requirements
         * 
         * This test validates that the endpoint meets the performance requirements
         * specified in the technical documentation (< 100ms response time).
         */
        it('should respond within 100ms performance target', async () => {
            // Record start time for performance measurement
            const startTime = Date.now();
            
            // Send GET request to /hello endpoint
            const response = await makeRequest(app, 'get', '/hello');
            
            // Calculate response time
            const responseTime = Date.now() - startTime;
            
            // Validate response is successful
            assertHelloResponse(response);
            
            // Validate response time meets performance requirements
            expect(responseTime).toBeLessThan(100);
        });
    });
    
    /**
     * Test Suite: Error Handling and Method Enforcement
     * 
     * This test group validates proper error handling for invalid routes
     * and unsupported HTTP methods, ensuring that the router correctly
     * returns appropriate HTTP error responses.
     */
    describe('Error Handling', () => {
        
        /**
         * Test: GET request to invalid route returns 404 Not Found
         * 
         * This test validates that requests to non-existent routes return
         * proper 404 status codes with standardized error messages.
         */
        it('should return 404 Not Found for invalid routes', async () => {
            // Send GET request to an invalid/non-existent route
            const response = await makeRequest(app, 'get', '/invalid');
            
            // Validate 404 error response using centralized assertion helper
            assertErrorResponse(response, 404, NOT_FOUND_RESPONSE);
        });
        
        /**
         * Test: POST request to /hello returns 405 Method Not Allowed
         * 
         * This test validates HTTP method enforcement for the hello endpoint,
         * ensuring that unsupported methods return proper error responses.
         */
        it('should return 405 Method Not Allowed for POST requests', async () => {
            // Send POST request to /hello (unsupported method)
            const response = await makeRequest(app, 'post', '/hello');
            
            // Validate 405 error response using centralized assertion helper
            assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
        });
        
        /**
         * Test: HEAD request to /hello returns 405 Method Not Allowed
         * 
         * This test validates method enforcement for HEAD requests,
         * ensuring consistent error handling across all unsupported methods.
         */
        it('should return 405 Method Not Allowed for HEAD requests', async () => {
            // Send HEAD request to /hello (unsupported method)
            const response = await makeRequest(app, 'head', '/hello');
            
            // Validate 405 error response using centralized assertion helper
            assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
        });
        
        /**
         * Test: PUT request to /hello returns 405 Method Not Allowed
         * 
         * This test validates method enforcement for PUT requests,
         * ensuring comprehensive coverage of unsupported HTTP methods.
         */
        it('should return 405 Method Not Allowed for PUT requests', async () => {
            // Send PUT request to /hello (unsupported method)
            const response = await makeRequest(app, 'put', '/hello');
            
            // Validate 405 error response using centralized assertion helper
            assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
        });
        
        /**
         * Test: DELETE request to /hello returns 405 Method Not Allowed
         * 
         * This test validates method enforcement for DELETE requests,
         * ensuring complete HTTP method validation coverage.
         */
        it('should return 405 Method Not Allowed for DELETE requests', async () => {
            // Send DELETE request to /hello (unsupported method)
            const response = await makeRequest(app, 'delete', '/hello');
            
            // Validate 405 error response using centralized assertion helper
            assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
        });
        
        /**
         * Test: PATCH request to /hello returns 405 Method Not Allowed
         * 
         * This test validates method enforcement for PATCH requests,
         * ensuring all common HTTP methods are properly restricted.
         */
        it('should return 405 Method Not Allowed for PATCH requests', async () => {
            // Send PATCH request to /hello (unsupported method)
            const response = await makeRequest(app, 'patch', '/hello');
            
            // Validate 405 error response using centralized assertion helper
            assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
        });
    });
    
    /**
     * Test Suite: Edge Cases and Additional Validation
     * 
     * This test group covers edge cases and additional validation scenarios
     * that ensure the router behaves correctly under various conditions.
     */
    describe('Edge Cases and Additional Validation', () => {
        
        /**
         * Test: Multiple consecutive requests return consistent responses
         * 
         * This test validates that the router maintains consistency across
         * multiple requests, ensuring stateless behavior and response reliability.
         */
        it('should return consistent responses for multiple requests', async () => {
            // Send multiple consecutive requests
            const requests = Array.from({ length: 5 }, () => 
                makeRequest(app, 'get', '/hello')
            );
            
            // Wait for all requests to complete
            const responses = await Promise.all(requests);
            
            // Validate that all responses are identical and correct
            responses.forEach(response => {
                assertHelloResponse(response);
            });
        });
        
        /**
         * Test: Request with various header combinations
         * 
         * This test validates that the router handles different client headers
         * correctly without affecting the response content or behavior.
         */
        it('should handle requests with various headers correctly', async () => {
            // Send request with custom headers to test header handling
            const response = await makeRequest(app, 'get', '/hello', {
                headers: {
                    'User-Agent': 'Integration-Test-Client/1.0',
                    'Accept': 'text/plain, */*',
                    'Accept-Encoding': 'gzip, deflate',
                    'Connection': 'keep-alive'
                }
            });
            
            // Validate that custom headers don't affect the canonical response
            assertHelloResponse(response);
        });
        
        /**
         * Test: Case sensitivity validation for routes
         * 
         * This test ensures that route matching is case-sensitive as expected
         * by Express.js default configuration.
         */
        it('should handle case-sensitive route matching', async () => {
            // Test uppercase route variation (should return 404)
            const upperCaseResponse = await makeRequest(app, 'get', '/HELLO');
            assertErrorResponse(upperCaseResponse, 404, NOT_FOUND_RESPONSE);
            
            // Test mixed case route variation (should return 404)
            const mixedCaseResponse = await makeRequest(app, 'get', '/Hello');
            assertErrorResponse(mixedCaseResponse, 404, NOT_FOUND_RESPONSE);
            
            // Confirm correct lowercase route still works
            const correctResponse = await makeRequest(app, 'get', '/hello');
            assertHelloResponse(correctResponse);
        });
    });
});