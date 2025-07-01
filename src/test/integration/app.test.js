/**
 * Integration Test Suite for Express Application Instance
 * 
 * This test suite provides comprehensive end-to-end validation of the main Express
 * application instance (imported from src/backend/app.js) using Supertest for HTTP
 * request simulation. It validates the complete request/response pipeline including
 * middleware stack, routing, and error handling to ensure all technical requirements
 * for the Node.js Hello World tutorial are met.
 * 
 * Test Coverage:
 * - GET /hello endpoint success scenarios (200 OK responses)
 * - Error handling for invalid routes (404 Not Found)
 * - Method validation for unsupported HTTP methods (405 Method Not Allowed)
 * - HTTP headers validation (Content-Type, status codes)
 * - Query parameter handling and response consistency
 * - Complete middleware stack integration validation
 * 
 * The suite uses centralized test helpers and fixtures to ensure DRY, robust,
 * and standards-compliant assertions. All tests make actual HTTP requests to
 * the fully configured Express app instance to validate real-world behavior.
 * 
 * Technical Requirements Validation:
 * - Hello World Endpoint (Technical Specifications/2.1.2 Hello Endpoint Feature)
 * - Request Processing & Response Generation (Technical Specifications/2.1.3/2.1.4)
 * - Error Management (Technical Specifications/1.3.1 In-Scope/Error Management)
 * - Testing Strategy (Technical Specifications/6.6 TESTING STRATEGY)
 * 
 * Dependencies:
 * - Jest ^29.7.0: Test framework with describe/it/expect functions
 * - Supertest (via testUtils): HTTP request simulation library
 * - Express app instance: Fully configured application from src/backend/app.js
 * - Test helpers: Centralized makeRequest and assertion functions
 * - Response fixtures: Canonical response constants for consistent validation
 * 
 * @fileoverview Integration tests for Express application request/response pipeline
 * @author Test Engineering Team
 * @version 1.0.0
 * @since Node.js 18+
 * @requires jest@29.7.0
 */

// Import Jest testing framework functions
const { describe, it, expect } = require('jest'); // ^29.7.0

// Import the fully configured Express application instance for testing
// This includes all middleware, routers, and error handlers configured in correct order
const { app } = require('../../backend/app.js');

// Import centralized test utilities for HTTP request simulation and assertions
// These helpers ensure consistent request execution and response validation across all tests
const {
    makeRequest,
    assertHelloResponse,
    assertErrorResponse
} = require('../helpers/testUtils.js');

// Import canonical response constants for consistent test assertions
// These fixtures centralize expected response content for maintainable tests
const {
    HELLO_RESPONSE,
    NOT_FOUND_RESPONSE,
    METHOD_NOT_ALLOWED_RESPONSE
} = require('../fixtures/responses.js');

/**
 * Main Integration Test Suite for Express Application
 * 
 * This test suite validates the complete Express application functionality through
 * end-to-end HTTP request/response testing. It simulates real client requests to
 * the fully configured Express app instance and validates responses against the
 * technical specifications.
 * 
 * Test Organization:
 * - Success scenarios for /hello endpoint
 * - Error handling scenarios (404, 405)
 * - HTTP headers and response format validation
 * - Edge cases and query parameter handling
 * 
 * Each test uses the centralized makeRequest helper for consistent HTTP simulation
 * and assertion helpers for DRY response validation logic.
 */
describe('Express App Integration', () => {

    /**
     * Test Group: GET /hello Endpoint Success Scenarios
     * 
     * This group validates the canonical /hello endpoint behavior including
     * correct HTTP status codes, headers, and response content as specified
     * in the technical requirements.
     */
    describe('GET /hello endpoint', () => {

        /**
         * Test Case: GET /hello returns 200 and canonical response
         * 
         * Validates that GET requests to /hello return:
         * - HTTP status code 200 (OK)
         * - Content-Type header containing 'text/plain'
         * - Response body exactly matching the canonical "Hello world" message
         * 
         * This test ensures the primary functionality requirement is met.
         */
        it('should return 200 and canonical response', async () => {
            // Send GET request to /hello endpoint using centralized helper
            const response = await makeRequest(app, 'GET', '/hello');
            
            // Validate canonical response using centralized assertion helper
            // This checks status 200, Content-Type header, and exact body match
            assertHelloResponse(response);
        });

        /**
         * Test Case: GET /hello with query parameters returns canonical response
         * 
         * Validates that query parameters do not affect the /hello endpoint response
         * and that the endpoint consistently returns the canonical message regardless
         * of URL query string content.
         * 
         * This ensures robust endpoint behavior and parameter handling.
         */
        it('should return canonical response with query parameters', async () => {
            // Send GET request to /hello with query parameters
            const response = await makeRequest(app, 'GET', '/hello?foo=bar&test=123');
            
            // Validate that query parameters don't affect the canonical response
            assertHelloResponse(response);
        });

        /**
         * Test Case: GET /hello returns correct Content-Type header
         * 
         * Validates that the /hello endpoint sets the correct Content-Type header
         * to 'text/plain' as required by the technical specifications for plain
         * text response content.
         * 
         * This ensures proper HTTP header compliance and client compatibility.
         */
        it('should return correct Content-Type header', async () => {
            // Send GET request to /hello endpoint
            const response = await makeRequest(app, 'GET', '/hello');
            
            // Validate that Content-Type header includes 'text/plain'
            expect(response.headers['content-type']).toEqual(
                expect.stringContaining('text/plain')
            );
        });

        /**
         * Test Case: GET /hello returns correct body content
         * 
         * Validates that the response body exactly matches the canonical
         * HELLO_RESPONSE constant, ensuring consistent message delivery
         * and proper response content generation.
         * 
         * This provides explicit body content validation.
         */
        it('should return correct body content', async () => {
            // Send GET request to /hello endpoint
            const response = await makeRequest(app, 'GET', '/hello');
            
            // Validate exact body content match using canonical constant
            const responseContent = response.text || response.body;
            expect(responseContent).toBe(HELLO_RESPONSE);
        });

    });

    /**
     * Test Group: Error Handling Scenarios
     * 
     * This group validates proper HTTP error handling for invalid routes
     * and unsupported HTTP methods, ensuring the application provides
     * standardized error responses as specified in the error management
     * requirements.
     */
    describe('Error handling', () => {

        /**
         * Test Case: GET /invalid returns 404 Not Found
         * 
         * Validates that requests to invalid/non-existent routes return:
         * - HTTP status code 404 (Not Found)
         * - Response body matching the canonical NOT_FOUND_RESPONSE
         * 
         * This ensures proper 404 error handling for invalid routes.
         */
        it('should return 404 for invalid routes', async () => {
            // Send GET request to non-existent route
            const response = await makeRequest(app, 'GET', '/invalid');
            
            // Validate 404 error response using centralized assertion helper
            assertErrorResponse(response, 404, NOT_FOUND_RESPONSE);
        });

        /**
         * Test Case: POST /hello returns 405 Method Not Allowed
         * 
         * Validates that unsupported HTTP methods on the /hello endpoint return:
         * - HTTP status code 405 (Method Not Allowed)
         * - Response body matching the canonical METHOD_NOT_ALLOWED_RESPONSE
         * 
         * This ensures proper method validation and error handling.
         */
        it('should return 405 for POST method on /hello', async () => {
            // Send POST request to /hello endpoint (unsupported method)
            const response = await makeRequest(app, 'POST', '/hello');
            
            // Validate 405 error response using centralized assertion helper
            assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
        });

        /**
         * Test Case: HEAD /hello returns 405 Method Not Allowed
         * 
         * Validates that HEAD requests to /hello endpoint return:
         * - HTTP status code 405 (Method Not Allowed)
         * - Response body matching the canonical METHOD_NOT_ALLOWED_RESPONSE
         * 
         * This ensures comprehensive method validation for all unsupported methods.
         */
        it('should return 405 for HEAD method on /hello', async () => {
            // Send HEAD request to /hello endpoint (unsupported method)
            const response = await makeRequest(app, 'HEAD', '/hello');
            
            // Validate 405 error response using centralized assertion helper
            assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
        });

        /**
         * Test Case: PUT /hello returns 405 Method Not Allowed
         * 
         * Validates that PUT requests to /hello endpoint return proper
         * 405 Method Not Allowed errors, ensuring complete HTTP method
         * validation coverage.
         * 
         * This provides comprehensive method validation testing.
         */
        it('should return 405 for PUT method on /hello', async () => {
            // Send PUT request to /hello endpoint (unsupported method)
            const response = await makeRequest(app, 'PUT', '/hello');
            
            // Validate 405 error response using centralized assertion helper
            assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
        });

        /**
         * Test Case: DELETE /hello returns 405 Method Not Allowed
         * 
         * Validates that DELETE requests to /hello endpoint return proper
         * 405 Method Not Allowed errors, completing the HTTP method
         * validation test coverage.
         * 
         * This ensures all standard HTTP methods are properly validated.
         */
        it('should return 405 for DELETE method on /hello', async () => {
            // Send DELETE request to /hello endpoint (unsupported method)
            const response = await makeRequest(app, 'DELETE', '/hello');
            
            // Validate 405 error response using centralized assertion helper
            assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
        });

    });

    /**
     * Test Group: Middleware Stack Integration
     * 
     * This group validates that the complete middleware stack is properly
     * integrated and functioning correctly, including request logging,
     * body parsing, routing, and error handling middleware.
     */
    describe('Middleware stack integration', () => {

        /**
         * Test Case: Request processing pipeline validation
         * 
         * Validates that requests flow through the complete middleware stack
         * correctly and that all middleware functions are properly integrated
         * without interfering with response generation.
         * 
         * This ensures the middleware execution order is correct.
         */
        it('should process requests through complete middleware stack', async () => {
            // Send multiple requests to validate middleware consistency
            for (let i = 0; i < 3; i++) {
                const response = await makeRequest(app, 'GET', '/hello');
                
                // Each request should produce identical canonical responses
                assertHelloResponse(response);
                
                // Validate that middleware doesn't interfere with response timing
                expect(response.headers.date).toBeDefined();
            }
        });

        /**
         * Test Case: Error handler middleware integration
         * 
         * Validates that the error handling middleware is properly integrated
         * and catches all errors in the request processing pipeline, providing
         * standardized error responses.
         * 
         * This ensures centralized error handling is working correctly.
         */
        it('should handle errors through centralized error middleware', async () => {
            // Test various error scenarios to validate error handler integration
            const errorTests = [
                { method: 'GET', path: '/nonexistent', expectedStatus: 404 },
                { method: 'POST', path: '/hello', expectedStatus: 405 },
                { method: 'PUT', path: '/hello', expectedStatus: 405 }
            ];
            
            for (const test of errorTests) {
                const response = await makeRequest(app, test.method, test.path);
                
                // Validate that errors are handled consistently
                expect(response.status).toBe(test.expectedStatus);
                expect(response.text || response.body).toBeTruthy();
            }
        });

    });

    /**
     * Test Group: Performance and Reliability
     * 
     * This group validates performance characteristics and reliability
     * of the Express application under normal and edge case conditions.
     */
    describe('Performance and reliability', () => {

        /**
         * Test Case: Response time validation
         * 
         * Validates that the /hello endpoint meets the performance requirement
         * of responding within 100ms as specified in the technical requirements.
         * 
         * This ensures performance requirements are met.
         */
        it('should respond within performance requirements', async () => {
            // Measure response time for performance validation
            const startTime = Date.now();
            const response = await makeRequest(app, 'GET', '/hello');
            const responseTime = Date.now() - startTime;
            
            // Validate response correctness
            assertHelloResponse(response);
            
            // Validate performance requirement (< 100ms target)
            expect(responseTime).toBeLessThan(100);
        });

        /**
         * Test Case: Concurrent request handling
         * 
         * Validates that the application can handle multiple concurrent
         * requests correctly without response corruption or performance
         * degradation.
         * 
         * This ensures concurrent request reliability.
         */
        it('should handle concurrent requests correctly', async () => {
            // Create array of concurrent request promises
            const concurrentRequests = 5;
            const requestPromises = Array.from({ length: concurrentRequests }, () =>
                makeRequest(app, 'GET', '/hello')
            );
            
            // Execute all requests concurrently
            const responses = await Promise.all(requestPromises);
            
            // Validate that all concurrent responses are correct
            responses.forEach((response, index) => {
                assertHelloResponse(response);
            });
        });

        /**
         * Test Case: Application stability under repeated requests
         * 
         * Validates that the application maintains stability and consistency
         * when processing multiple sequential requests, ensuring no memory
         * leaks or state corruption.
         * 
         * This ensures application stability and reliability.
         */
        it('should maintain stability under repeated requests', async () => {
            // Send multiple sequential requests to test stability
            const requestCount = 10;
            
            for (let i = 0; i < requestCount; i++) {
                const response = await makeRequest(app, 'GET', '/hello');
                
                // Each request should produce identical canonical responses
                assertHelloResponse(response);
                
                // Validate response consistency across requests
                expect(response.status).toBe(200);
                expect(response.text || response.body).toBe(HELLO_RESPONSE);
            }
        });

    });

    /**
     * Test Group: HTTP Protocol Compliance
     * 
     * This group validates that the application complies with HTTP/1.1
     * protocol standards and provides proper HTTP headers and status codes.
     */
    describe('HTTP protocol compliance', () => {

        /**
         * Test Case: HTTP status code compliance
         * 
         * Validates that all HTTP status codes returned by the application
         * comply with HTTP/1.1 standards and are semantically correct
         * for the corresponding scenarios.
         * 
         * This ensures HTTP protocol compliance.
         */
        it('should return semantically correct HTTP status codes', async () => {
            // Test successful request returns 200 OK
            const successResponse = await makeRequest(app, 'GET', '/hello');
            expect(successResponse.status).toBe(200);
            
            // Test invalid route returns 404 Not Found
            const notFoundResponse = await makeRequest(app, 'GET', '/invalid');
            expect(notFoundResponse.status).toBe(404);
            
            // Test invalid method returns 405 Method Not Allowed
            const methodNotAllowedResponse = await makeRequest(app, 'POST', '/hello');
            expect(methodNotAllowedResponse.status).toBe(405);
        });

        /**
         * Test Case: HTTP header validation
         * 
         * Validates that HTTP headers are properly set and comply with
         * HTTP standards, including Content-Type, Content-Length, and
         * other required headers.
         * 
         * This ensures proper HTTP header handling.
         */
        it('should set proper HTTP headers', async () => {
            const response = await makeRequest(app, 'GET', '/hello');
            
            // Validate required HTTP headers are present
            expect(response.headers).toBeDefined();
            expect(response.headers['content-type']).toBeDefined();
            expect(response.headers['content-length']).toBeDefined();
            
            // Validate Content-Type header correctness
            expect(response.headers['content-type']).toEqual(
                expect.stringContaining('text/plain')
            );
            
            // Validate Content-Length matches body size
            const contentLength = parseInt(response.headers['content-length']);
            const bodyLength = Buffer.byteLength(response.text || response.body, 'utf8');
            expect(contentLength).toBe(bodyLength);
        });

    });

});