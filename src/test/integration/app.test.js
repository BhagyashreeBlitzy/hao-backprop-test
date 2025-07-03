/**
 * @fileoverview Integration Test Suite for Express Application
 * 
 * This integration test suite validates the end-to-end behavior of the Express application
 * by making HTTP requests to the fully configured app instance and verifying that all
 * middleware, routing, and error handling components work together as specified in the
 * technical requirements.
 * 
 * The test suite focuses on the /hello endpoint and comprehensive error handling,
 * ensuring that the application correctly processes requests, generates appropriate
 * responses, and handles error scenarios with the proper status codes and messages.
 * 
 * Test Strategy:
 * - Uses Supertest to make in-memory HTTP requests to the Express app
 * - Leverages centralized test helpers and fixtures for DRY, maintainable assertions
 * - Tests both successful request flows and error scenarios
 * - Validates HTTP status codes, headers, and response bodies
 * - Ensures compliance with technical specification requirements
 * 
 * Test Coverage:
 * - Hello World Endpoint: GET /hello returns canonical "Hello world" response
 * - Request Processing: Validates proper request handling and response generation
 * - Error Management: Tests 404, 405, and other error scenarios
 * - HTTP Method Validation: Ensures only supported methods are allowed
 * - Content-Type Headers: Validates proper HTTP header configuration
 * - Query Parameter Handling: Tests endpoint behavior with query parameters
 * 
 * Technical Requirements Addressed:
 * - F-002: Hello World Endpoint - Validates GET /hello returns "Hello world"
 * - F-003: Request Processing - Ensures proper HTTP request handling
 * - F-004: Response Generation - Validates correct response format and content
 * - Error Management: Tests standardized error responses for invalid routes/methods
 * - Testing Strategy: Implements integration tests using Supertest and Jest
 * 
 * @author Generated for Node.js Tutorial Application
 * @version 1.0.0
 * @since 2024-01-01
 */

// =============================================================================
// EXTERNAL DEPENDENCIES
// =============================================================================

/**
 * Jest Testing Framework - Version 29.7.0
 * 
 * Jest is a delightful JavaScript Testing Framework with a focus on simplicity.
 * It works out of the box for most JavaScript projects and provides built-in
 * test runner, assertion library, and mocking capabilities.
 * 
 * Features used in this test suite:
 * - describe() for organizing test suites
 * - it() for defining individual test cases
 * - expect() for making assertions
 * - Built-in test discovery and execution
 * - Automatic mocking capabilities
 * - Code coverage reporting
 * 
 * @external jest
 * @see {@link https://jestjs.io/docs/getting-started|Jest Documentation}
 * @version 29.7.0
 */
const { describe, it, expect } = require('jest'); // v29.7.0 - JavaScript testing framework

// =============================================================================
// INTERNAL DEPENDENCIES
// =============================================================================

/**
 * Express Application Instance
 * 
 * Import the fully configured Express application instance from the main app
 * module. This instance includes all middleware, routing, and error handling
 * components configured for production use.
 * 
 * The app instance is used as the target for Supertest HTTP requests in the
 * integration tests, allowing us to test the complete request-response cycle
 * without starting an actual HTTP server.
 * 
 * @see {@link ../../../src/backend/app.js|Main Express Application Module}
 */
const { app } = require('../../../src/backend/app.js');

/**
 * Test Utility Functions
 * 
 * Import reusable test helper functions that provide standardized HTTP request
 * execution and response assertion capabilities. These helpers ensure DRY,
 * maintainable, and robust test code across all test suites.
 * 
 * Imported Functions:
 * - makeRequest: Sends HTTP requests using Supertest
 * - assertHelloResponse: Validates canonical /hello responses
 * - assertErrorResponse: Validates error responses with status and body
 * 
 * @see {@link ../helpers/testUtils.js|Test Utility Functions}
 */
const { makeRequest, assertHelloResponse, assertErrorResponse } = require('../helpers/testUtils.js');

/**
 * Test Response Fixtures
 * 
 * Import canonical response message constants for consistent test assertions.
 * These fixtures centralize the expected response content and error messages,
 * ensuring that tests validate exact response bodies as specified in the
 * technical requirements.
 * 
 * Imported Constants:
 * - HELLO_RESPONSE: Canonical "Hello world" message
 * - NOT_FOUND_RESPONSE: Standard 404 error message
 * - METHOD_NOT_ALLOWED_RESPONSE: Standard 405 error message
 * 
 * @see {@link ../fixtures/responses.js|Test Response Fixtures}
 */
const { 
    HELLO_RESPONSE, 
    NOT_FOUND_RESPONSE, 
    METHOD_NOT_ALLOWED_RESPONSE 
} = require('../fixtures/responses.js');

// =============================================================================
// INTEGRATION TEST SUITE
// =============================================================================

/**
 * Main Integration Test Suite for Express Application
 * 
 * This test suite validates the complete Express application functionality
 * by testing the integration between middleware, routing, and error handling
 * components. It ensures that all technical requirements are met through
 * comprehensive HTTP request-response validation.
 * 
 * Test Organization:
 * - Hello World Endpoint Tests: Core functionality validation
 * - Error Handling Tests: Comprehensive error scenario coverage
 * - HTTP Method Validation: Ensures proper method support
 * - Content-Type Validation: Verifies correct HTTP headers
 * - Query Parameter Handling: Tests endpoint behavior with parameters
 * 
 * Testing Approach:
 * - Uses Supertest for in-memory HTTP requests
 * - Leverages centralized test helpers for consistent assertions
 * - Tests both success and failure scenarios
 * - Validates technical specification compliance
 * 
 * @suite Express App Integration
 * @description Integration tests for the Express application instance
 */
describe('Express App Integration', () => {
    
    // =========================================================================
    // HELLO WORLD ENDPOINT TESTS
    // =========================================================================
    
    /**
     * Test Suite for /hello Endpoint Core Functionality
     * 
     * This nested test suite focuses on the core /hello endpoint functionality,
     * validating that it properly handles GET requests and returns the canonical
     * "Hello world" response with correct HTTP status codes and headers.
     * 
     * @suite Hello World Endpoint
     * @description Core functionality tests for GET /hello endpoint
     */
    describe('Hello World Endpoint', () => {
        
        /**
         * Test: GET /hello returns 200 and canonical response
         * 
         * This test validates the primary functionality of the /hello endpoint
         * by sending a GET request and verifying that it returns:
         * - HTTP status code 200 (OK)
         * - Content-Type header containing 'text/plain'
         * - Response body exactly matching the canonical HELLO_RESPONSE
         * 
         * This test addresses the core requirement F-002 (Hello World Endpoint)
         * from the technical specification.
         * 
         * @test GET /hello success scenario
         * @requirement F-002 Hello World Endpoint
         */
        it('should return 200 and canonical response for GET /hello', async () => {
            // Step 1: Send GET request to /hello endpoint using test helper
            const response = await makeRequest(app, 'GET', '/hello');
            
            // Step 2: Validate response using centralized assertion helper
            assertHelloResponse(response);
        });
        
        /**
         * Test: GET /hello returns correct Content-Type header
         * 
         * This test specifically validates that the /hello endpoint returns
         * the correct Content-Type header value of 'text/plain', ensuring
         * proper HTTP header configuration for plain text responses.
         * 
         * @test Content-Type header validation
         * @requirement F-004 Response Generation
         */
        it('should return correct Content-Type header for GET /hello', async () => {
            // Step 1: Send GET request to /hello endpoint
            const response = await makeRequest(app, 'GET', '/hello');
            
            // Step 2: Validate response status is 200
            expect(response.status).toBe(200);
            
            // Step 3: Validate Content-Type header contains 'text/plain'
            expect(response.headers['content-type']).toMatch(/text\/plain/);
        });
        
        /**
         * Test: GET /hello returns correct body content
         * 
         * This test specifically validates that the /hello endpoint returns
         * the exact response body content as specified in the technical
         * requirements, ensuring response consistency.
         * 
         * @test Response body validation
         * @requirement F-002 Hello World Endpoint
         */
        it('should return correct body content for GET /hello', async () => {
            // Step 1: Send GET request to /hello endpoint
            const response = await makeRequest(app, 'GET', '/hello');
            
            // Step 2: Validate response status is 200
            expect(response.status).toBe(200);
            
            // Step 3: Validate response body matches canonical HELLO_RESPONSE
            expect(response.text).toBe(HELLO_RESPONSE);
        });
        
        /**
         * Test: GET /hello with query parameters returns canonical response
         * 
         * This test validates that the /hello endpoint properly handles
         * requests with query parameters and still returns the canonical
         * response, ensuring consistent behavior regardless of query parameters.
         * 
         * @test Query parameter handling
         * @requirement F-003 Request Processing
         */
        it('should return canonical response for GET /hello with query params', async () => {
            // Step 1: Send GET request with query parameters
            const response = await makeRequest(app, 'GET', '/hello', {
                query: { foo: 'bar', test: 'value' }
            });
            
            // Step 2: Validate response using centralized assertion helper
            assertHelloResponse(response);
        });
        
    });
    
    // =========================================================================
    // ERROR HANDLING TESTS
    // =========================================================================
    
    /**
     * Test Suite for Error Handling and Invalid Scenarios
     * 
     * This nested test suite focuses on error handling capabilities,
     * validating that the application properly handles invalid routes,
     * unsupported HTTP methods, and other error scenarios with appropriate
     * status codes and error messages.
     * 
     * @suite Error Handling
     * @description Comprehensive error scenario tests
     */
    describe('Error Handling', () => {
        
        /**
         * Test: GET /invalid returns 404 Not Found
         * 
         * This test validates that the application properly handles requests
         * to non-existent routes by returning a 404 status code and the
         * canonical "Not Found" error message.
         * 
         * @test 404 Not Found error handling
         * @requirement Error Management
         */
        it('should return 404 Not Found for GET /invalid', async () => {
            // Step 1: Send GET request to non-existent route
            const response = await makeRequest(app, 'GET', '/invalid');
            
            // Step 2: Validate error response using centralized assertion helper
            assertErrorResponse(response, 404, NOT_FOUND_RESPONSE);
        });
        
        /**
         * Test: POST /hello returns 405 Method Not Allowed
         * 
         * This test validates that the /hello endpoint properly rejects
         * unsupported HTTP methods (POST) and returns a 405 status code
         * with the canonical "Method Not Allowed" error message.
         * 
         * @test 405 Method Not Allowed error handling
         * @requirement Error Management
         */
        it('should return 405 Method Not Allowed for POST /hello', async () => {
            // Step 1: Send POST request to /hello endpoint (unsupported method)
            const response = await makeRequest(app, 'POST', '/hello');
            
            // Step 2: Validate error response using centralized assertion helper
            assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
        });
        
        /**
         * Test: HEAD /hello returns 405 Method Not Allowed
         * 
         * This test validates that the /hello endpoint properly rejects
         * unsupported HTTP methods (HEAD) and returns a 405 status code
         * with the canonical "Method Not Allowed" error message.
         * 
         * @test 405 Method Not Allowed error handling for HEAD
         * @requirement Error Management
         */
        it('should return 405 Method Not Allowed for HEAD /hello', async () => {
            // Step 1: Send HEAD request to /hello endpoint (unsupported method)
            const response = await makeRequest(app, 'HEAD', '/hello');
            
            // Step 2: Validate error response using centralized assertion helper
            assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
        });
        
        /**
         * Test: PUT /hello returns 405 Method Not Allowed
         * 
         * This test validates that the /hello endpoint properly rejects
         * unsupported HTTP methods (PUT) and returns a 405 status code
         * with the canonical "Method Not Allowed" error message.
         * 
         * @test 405 Method Not Allowed error handling for PUT
         * @requirement Error Management
         */
        it('should return 405 Method Not Allowed for PUT /hello', async () => {
            // Step 1: Send PUT request to /hello endpoint (unsupported method)
            const response = await makeRequest(app, 'PUT', '/hello');
            
            // Step 2: Validate error response using centralized assertion helper
            assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
        });
        
        /**
         * Test: DELETE /hello returns 405 Method Not Allowed
         * 
         * This test validates that the /hello endpoint properly rejects
         * unsupported HTTP methods (DELETE) and returns a 405 status code
         * with the canonical "Method Not Allowed" error message.
         * 
         * @test 405 Method Not Allowed error handling for DELETE
         * @requirement Error Management
         */
        it('should return 405 Method Not Allowed for DELETE /hello', async () => {
            // Step 1: Send DELETE request to /hello endpoint (unsupported method)
            const response = await makeRequest(app, 'DELETE', '/hello');
            
            // Step 2: Validate error response using centralized assertion helper
            assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
        });
        
    });
    
    // =========================================================================
    // HTTP PROTOCOL COMPLIANCE TESTS
    // =========================================================================
    
    /**
     * Test Suite for HTTP Protocol Compliance
     * 
     * This nested test suite validates that the application properly implements
     * HTTP protocol standards, including proper status codes, headers, and
     * response formats for various scenarios.
     * 
     * @suite HTTP Protocol Compliance
     * @description Tests for HTTP standard compliance
     */
    describe('HTTP Protocol Compliance', () => {
        
        /**
         * Test: Response includes proper HTTP headers
         * 
         * This test validates that the application includes proper HTTP headers
         * in responses, ensuring compliance with HTTP standards and security
         * best practices.
         * 
         * @test HTTP header validation
         * @requirement F-004 Response Generation
         */
        it('should include proper HTTP headers in responses', async () => {
            // Step 1: Send GET request to /hello endpoint
            const response = await makeRequest(app, 'GET', '/hello');
            
            // Step 2: Validate response status is 200
            expect(response.status).toBe(200);
            
            // Step 3: Validate presence of essential HTTP headers
            expect(response.headers).toHaveProperty('content-type');
            expect(response.headers).toHaveProperty('content-length');
            expect(response.headers).toHaveProperty('date');
            
            // Step 4: Validate Content-Type header value
            expect(response.headers['content-type']).toMatch(/text\/plain/);
        });
        
        /**
         * Test: Response includes correct Content-Length header
         * 
         * This test validates that the application includes the correct
         * Content-Length header that matches the actual response body length.
         * 
         * @test Content-Length header validation
         * @requirement F-004 Response Generation
         */
        it('should include correct Content-Length header', async () => {
            // Step 1: Send GET request to /hello endpoint
            const response = await makeRequest(app, 'GET', '/hello');
            
            // Step 2: Validate response status is 200
            expect(response.status).toBe(200);
            
            // Step 3: Validate Content-Length header matches response body length
            const expectedLength = HELLO_RESPONSE.length.toString();
            expect(response.headers['content-length']).toBe(expectedLength);
        });
        
    });
    
    // =========================================================================
    // EDGE CASE TESTS
    // =========================================================================
    
    /**
     * Test Suite for Edge Cases and Corner Scenarios
     * 
     * This nested test suite validates the application's behavior in edge cases
     * and unusual scenarios that might not be covered by standard functional tests.
     * 
     * @suite Edge Cases
     * @description Tests for edge cases and corner scenarios
     */
    describe('Edge Cases', () => {
        
        /**
         * Test: GET /hello with special characters in query parameters
         * 
         * This test validates that the /hello endpoint properly handles
         * requests with special characters in query parameters without
         * affecting the canonical response.
         * 
         * @test Special character handling in query parameters
         * @requirement F-003 Request Processing
         */
        it('should handle special characters in query parameters', async () => {
            // Step 1: Send GET request with special characters in query
            const response = await makeRequest(app, 'GET', '/hello', {
                query: { 
                    special: 'test@example.com',
                    encoded: 'hello%20world',
                    unicode: '测试'
                }
            });
            
            // Step 2: Validate response using centralized assertion helper
            assertHelloResponse(response);
        });
        
        /**
         * Test: GET /hello with empty query parameters
         * 
         * This test validates that the /hello endpoint properly handles
         * requests with empty query parameter values.
         * 
         * @test Empty query parameter handling
         * @requirement F-003 Request Processing
         */
        it('should handle empty query parameters', async () => {
            // Step 1: Send GET request with empty query parameters
            const response = await makeRequest(app, 'GET', '/hello', {
                query: { empty: '', blank: null }
            });
            
            // Step 2: Validate response using centralized assertion helper
            assertHelloResponse(response);
        });
        
        /**
         * Test: GET /hello with case variations in path
         * 
         * This test validates that the application properly handles case
         * sensitivity in route paths, ensuring that only exact matches
         * are accepted.
         * 
         * @test Case sensitivity in route paths
         * @requirement F-002 Hello World Endpoint
         */
        it('should handle case sensitivity in route paths', async () => {
            // Step 1: Test uppercase variation - should return 404
            const responseUpper = await makeRequest(app, 'GET', '/HELLO');
            assertErrorResponse(responseUpper, 404, NOT_FOUND_RESPONSE);
            
            // Step 2: Test mixed case variation - should return 404
            const responseMixed = await makeRequest(app, 'GET', '/Hello');
            assertErrorResponse(responseMixed, 404, NOT_FOUND_RESPONSE);
            
            // Step 3: Test correct lowercase - should return 200
            const responseCorrect = await makeRequest(app, 'GET', '/hello');
            assertHelloResponse(responseCorrect);
        });
        
    });
    
    // =========================================================================
    // PERFORMANCE VALIDATION TESTS
    // =========================================================================
    
    /**
     * Test Suite for Basic Performance Validation
     * 
     * This nested test suite includes basic performance validation tests
     * to ensure the application meets basic response time requirements
     * as specified in the technical documentation.
     * 
     * @suite Performance Validation
     * @description Basic performance and response time tests
     */
    describe('Performance Validation', () => {
        
        /**
         * Test: GET /hello responds within acceptable time limit
         * 
         * This test validates that the /hello endpoint responds within
         * the specified time limit (100ms) as required by the technical
         * specification performance criteria.
         * 
         * @test Response time validation
         * @requirement Performance Criteria (< 100ms)
         */
        it('should respond within acceptable time limit', async () => {
            // Step 1: Record start time
            const startTime = Date.now();
            
            // Step 2: Send GET request to /hello endpoint
            const response = await makeRequest(app, 'GET', '/hello');
            
            // Step 3: Calculate response time
            const responseTime = Date.now() - startTime;
            
            // Step 4: Validate response correctness
            assertHelloResponse(response);
            
            // Step 5: Validate response time is within acceptable limit
            expect(responseTime).toBeLessThan(100); // 100ms as per technical spec
        });
        
    });
    
});