/**
 * Integration Test Suite for Hello Router
 * 
 * This test suite validates the integration behavior of the Express router(s) responsible
 * for API endpoints, specifically focusing on the /hello route. It uses Supertest to make
 * HTTP requests to the router and validates that all canonical request/response scenarios
 * work correctly, including success cases, method enforcement, and error handling.
 * 
 * The tests ensure that the router(s) are standards-compliant, robust, and correctly
 * integrated for use in the main application. All tests use centralized test helpers
 * and fixtures for DRY, maintainable, and standards-compliant assertions.
 * 
 * Requirements Tested:
 * - Hello World Endpoint (GET /hello returns canonical response)
 * - Request Processing & Response Generation (correct status codes, headers, body)
 * - Error Management (404, 405 error handling with standardized responses)
 * - Testing Strategy (integration tests using Supertest and Jest)
 * 
 * @author Generated for Node.js Tutorial Application
 * @version 1.0.0
 */

// External dependencies
const { describe, it, expect } = require('jest'); // v29.7.0 - Test framework and assertion library
const supertest = require('supertest'); // v7.1.1 - HTTP testing library for Express routers
const express = require('express'); // v5.1.0 - Used to create test app instance for mounting router

// Internal dependencies - Router under test
const { router } = require('../../../src/backend/routes/hello.js'); // Express Router instance with /hello endpoint

// Internal dependencies - Test utilities
const { 
    makeRequest, 
    assertHelloResponse, 
    assertErrorResponse 
} = require('../helpers/testUtils.js'); // Reusable test helpers for HTTP requests and assertions

// Internal dependencies - Test fixtures
const {
    HELLO_RESPONSE,
    NOT_FOUND_RESPONSE,
    METHOD_NOT_ALLOWED_RESPONSE
} = require('../fixtures/responses.js'); // Canonical response constants for assertions

/**
 * Create a minimal Express app instance for mounting the router under test.
 * 
 * This approach allows us to test the router in isolation while still validating
 * the complete HTTP request-response cycle. The app serves as a minimal container
 * for the router, enabling Supertest to make actual HTTP requests.
 * 
 * @type {express.Application}
 */
const testApp = express();

// Mount the hello router at the root path for testing
// This makes the /hello endpoint available for HTTP requests
testApp.use('/', router);

/**
 * Main Integration Test Suite for Hello Router
 * 
 * This test suite validates the complete integration behavior of the hello router,
 * ensuring all request/response scenarios work correctly and meet the technical
 * specification requirements.
 */
describe('Hello Router Integration', () => {
    /**
     * Test: GET /hello returns 200 and canonical response
     * 
     * Validates that the /hello endpoint correctly handles GET requests and returns
     * the canonical "Hello world" response with proper status and headers.
     * 
     * Requirements addressed:
     * - Hello World Endpoint (2.1.2)
     * - Request Processing & Response Generation (2.1.3/2.1.4)
     */
    it('GET /hello returns 200 and canonical response', async () => {
        // Make HTTP GET request to /hello endpoint using centralized helper
        const response = await makeRequest(testApp, 'get', '/hello');
        
        // Validate response using centralized assertion helper
        assertHelloResponse(response);
    });

    /**
     * Test: GET /invalid returns 404 Not Found
     * 
     * Validates that requests to non-existent routes return proper 404 errors
     * with standardized error responses.
     * 
     * Requirements addressed:
     * - Error Management (404 handling)
     * - Request Processing (invalid route handling)
     */
    it('GET /invalid returns 404 Not Found', async () => {
        // Make HTTP GET request to non-existent route
        const response = await makeRequest(testApp, 'get', '/invalid');
        
        // Validate 404 error response using centralized assertion helper
        assertErrorResponse(response, 404, NOT_FOUND_RESPONSE);
    });

    /**
     * Test: POST /hello returns 405 Method Not Allowed
     * 
     * Validates that the /hello endpoint correctly enforces HTTP method restrictions
     * by returning 405 errors for unsupported POST requests.
     * 
     * Requirements addressed:
     * - Error Management (405 method enforcement)
     * - Request Processing (method validation)
     */
    it('POST /hello returns 405 Method Not Allowed', async () => {
        // Make HTTP POST request to /hello endpoint (unsupported method)
        const response = await makeRequest(testApp, 'post', '/hello');
        
        // Validate 405 error response using centralized assertion helper
        assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
    });

    /**
     * Test: HEAD /hello returns 405 Method Not Allowed
     * 
     * Validates that the /hello endpoint correctly enforces HTTP method restrictions
     * by returning 405 errors for unsupported HEAD requests.
     * 
     * Requirements addressed:
     * - Error Management (405 method enforcement)
     * - Request Processing (method validation)
     */
    it('HEAD /hello returns 405 Method Not Allowed', async () => {
        // Make HTTP HEAD request to /hello endpoint (unsupported method)
        const response = await makeRequest(testApp, 'head', '/hello');
        
        // Validate 405 error response using centralized assertion helper
        assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
    });

    /**
     * Test: GET /hello with query params returns canonical response
     * 
     * Validates that the /hello endpoint correctly handles GET requests with
     * query parameters and still returns the canonical response.
     * 
     * Requirements addressed:
     * - Hello World Endpoint (query parameter handling)
     * - Request Processing (parameter parsing)
     */
    it('GET /hello with query params returns canonical response', async () => {
        // Make HTTP GET request to /hello with query parameters
        const response = await makeRequest(testApp, 'get', '/hello?foo=bar&test=value');
        
        // Validate response using centralized assertion helper
        // The response should be identical regardless of query parameters
        assertHelloResponse(response);
    });

    /**
     * Test: GET /hello returns correct Content-Type header
     * 
     * Validates that the /hello endpoint sets the correct Content-Type header
     * for plain text responses as specified in the technical requirements.
     * 
     * Requirements addressed:
     * - Response Generation (correct headers)
     * - Hello World Endpoint (content type specification)
     */
    it('GET /hello returns correct Content-Type header', async () => {
        // Make HTTP GET request to /hello endpoint
        const response = await makeRequest(testApp, 'get', '/hello');
        
        // Validate that Content-Type header includes 'text/plain'
        expect(response.headers['content-type']).toMatch(/text\/plain/);
    });

    /**
     * Test: GET /hello returns correct body content
     * 
     * Validates that the /hello endpoint returns the exact canonical response
     * body content as specified in the technical requirements.
     * 
     * Requirements addressed:
     * - Hello World Endpoint (response content validation)
     * - Response Generation (body content)
     */
    it('GET /hello returns correct body content', async () => {
        // Make HTTP GET request to /hello endpoint
        const response = await makeRequest(testApp, 'get', '/hello');
        
        // Validate that response body exactly matches canonical response
        expect(response.text).toBe(HELLO_RESPONSE);
    });

    /**
     * Test: PUT /hello returns 405 Method Not Allowed
     * 
     * Validates that the /hello endpoint correctly enforces HTTP method restrictions
     * by returning 405 errors for unsupported PUT requests.
     * 
     * Requirements addressed:
     * - Error Management (405 method enforcement)
     * - Request Processing (method validation)
     */
    it('PUT /hello returns 405 Method Not Allowed', async () => {
        // Make HTTP PUT request to /hello endpoint (unsupported method)
        const response = await makeRequest(testApp, 'put', '/hello');
        
        // Validate 405 error response using centralized assertion helper
        assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
    });

    /**
     * Test: DELETE /hello returns 405 Method Not Allowed
     * 
     * Validates that the /hello endpoint correctly enforces HTTP method restrictions
     * by returning 405 errors for unsupported DELETE requests.
     * 
     * Requirements addressed:
     * - Error Management (405 method enforcement)
     * - Request Processing (method validation)
     */
    it('DELETE /hello returns 405 Method Not Allowed', async () => {
        // Make HTTP DELETE request to /hello endpoint (unsupported method)
        const response = await makeRequest(testApp, 'delete', '/hello');
        
        // Validate 405 error response using centralized assertion helper
        assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
    });

    /**
     * Test: PATCH /hello returns 405 Method Not Allowed
     * 
     * Validates that the /hello endpoint correctly enforces HTTP method restrictions
     * by returning 405 errors for unsupported PATCH requests.
     * 
     * Requirements addressed:
     * - Error Management (405 method enforcement)
     * - Request Processing (method validation)
     */
    it('PATCH /hello returns 405 Method Not Allowed', async () => {
        // Make HTTP PATCH request to /hello endpoint (unsupported method)
        const response = await makeRequest(testApp, 'patch', '/hello');
        
        // Validate 405 error response using centralized assertion helper
        assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
    });

    /**
     * Test: OPTIONS /hello returns 405 Method Not Allowed
     * 
     * Validates that the /hello endpoint correctly enforces HTTP method restrictions
     * by returning 405 errors for unsupported OPTIONS requests.
     * 
     * Requirements addressed:
     * - Error Management (405 method enforcement)
     * - Request Processing (method validation)
     */
    it('OPTIONS /hello returns 405 Method Not Allowed', async () => {
        // Make HTTP OPTIONS request to /hello endpoint (unsupported method)
        const response = await makeRequest(testApp, 'options', '/hello');
        
        // Validate 405 error response using centralized assertion helper
        assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
    });

    /**
     * Test: GET /hello responds within performance threshold
     * 
     * Validates that the /hello endpoint responds within the specified performance
     * threshold of 100ms as defined in the technical requirements.
     * 
     * Requirements addressed:
     * - Performance Requirements (response time < 100ms)
     * - Quality Assurance (performance validation)
     */
    it('GET /hello responds within performance threshold', async () => {
        // Record start time for performance measurement
        const startTime = Date.now();
        
        // Make HTTP GET request to /hello endpoint
        const response = await makeRequest(testApp, 'get', '/hello');
        
        // Calculate response time
        const responseTime = Date.now() - startTime;
        
        // Validate that response is successful
        assertHelloResponse(response);
        
        // Validate that response time is within threshold (100ms)
        expect(responseTime).toBeLessThan(100);
    });

    /**
     * Test: Router handles multiple concurrent requests correctly
     * 
     * Validates that the router can handle multiple concurrent requests
     * and return consistent responses for all requests.
     * 
     * Requirements addressed:
     * - Scalability (concurrent request handling)
     * - Request Processing (parallel processing)
     */
    it('Router handles multiple concurrent requests correctly', async () => {
        // Create array of concurrent request promises
        const concurrentRequests = Array.from({ length: 10 }, () => 
            makeRequest(testApp, 'get', '/hello')
        );
        
        // Execute all requests concurrently
        const responses = await Promise.all(concurrentRequests);
        
        // Validate that all responses are correct
        responses.forEach(response => {
            assertHelloResponse(response);
        });
    });

    /**
     * Test: Router maintains consistent response format
     * 
     * Validates that the router consistently returns the same response format
     * across multiple requests to ensure reliability.
     * 
     * Requirements addressed:
     * - Response Generation (consistency)
     * - Quality Assurance (response format validation)
     */
    it('Router maintains consistent response format', async () => {
        // Make multiple sequential requests
        const responses = [];
        for (let i = 0; i < 5; i++) {
            const response = await makeRequest(testApp, 'get', '/hello');
            responses.push(response);
        }
        
        // Validate that all responses are identical
        responses.forEach(response => {
            assertHelloResponse(response);
            expect(response.status).toBe(200);
            expect(response.text).toBe(HELLO_RESPONSE);
            expect(response.headers['content-type']).toMatch(/text\/plain/);
        });
    });
});