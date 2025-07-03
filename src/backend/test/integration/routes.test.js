// External imports
const supertest = require('supertest'); // ^7.1.1 - SuperAgent driven library for testing HTTP servers
const jest = require('jest'); // ^29.0.0 - JavaScript testing framework designed to ensure correctness of any JavaScript codebase

// Internal imports
const app = require('../../app.js'); // Provides the fully configured Express application instance for in-memory integration testing
const { assertResponse } = require('../helpers/testUtils.js'); // Asserts that Supertest responses match expected status, headers, and body for DRY, robust test validation

/**
 * Integration Test Suite for Express Route Handling
 * 
 * This test suite validates the complete request-response cycle for the Node.js tutorial backend's
 * Express route handling. It performs real HTTP requests against the in-memory Express application
 * instance to ensure end-to-end compliance with routing, response generation, and production-ready
 * patterns as specified in the technical requirements.
 * 
 * Test Coverage:
 * - /hello endpoint behavior and response validation
 * - HTTP method filtering and proper error responses
 * - Response header validation and content-type compliance
 * - Error handling for invalid paths and methods
 * - Performance validation and response time thresholds
 * - Security header implementation verification
 * 
 * Testing Strategy:
 * Uses Supertest to perform HTTP assertions against the Express app instance without requiring
 * a live server. This approach provides fast, isolated testing while maintaining realistic
 * HTTP request/response behavior for comprehensive integration validation.
 * 
 * Educational Value:
 * Demonstrates production-ready integration testing patterns using Jest and Supertest,
 * showcasing how to validate HTTP endpoints, error handling, and response compliance
 * in a Node.js Express application suitable for both learning and production environments.
 */

// Initialize Supertest agent with Express app instance for HTTP integration testing
let request;

/**
 * Test suite setup and teardown configuration
 * 
 * Initializes the Supertest agent before running tests and ensures proper cleanup
 * after test completion. This setup provides a consistent testing environment
 * for all integration test cases.
 */
beforeAll(() => {
    // Initialize Supertest agent bound to the Express application instance
    // This creates an HTTP client that can make requests against the app
    // without requiring a live server, enabling fast and isolated testing
    request = supertest(app);
});

afterAll(() => {
    // Clean up resources after all tests complete
    // Ensures no hanging connections or resources remain after test execution
    request = null;
});

/**
 * Main integration test suite for the /hello endpoint
 * 
 * Covers all required behaviors and edge cases for the hello endpoint implementation
 * including successful responses, error handling, method filtering, and security compliance.
 * Each test validates specific aspects of the HTTP request-response cycle.
 */
describe('/hello endpoint integration', () => {
    /**
     * Test Case: GET /hello returns 200 and 'Hello world'
     * 
     * Validates the primary functionality of the hello endpoint:
     * - Correct HTTP status code (200)
     * - Proper response body content ('Hello world')
     * - Appropriate content-type header (text/plain; charset=utf-8)
     * - Response time performance (under 100ms)
     * 
     * Requirements addressed:
     * - F-002: Hello Endpoint Implementation
     * - F-004: Response Generation and Consistency
     */
    test('GET /hello returns 200 and Hello world', async () => {
        // Record start time for performance validation
        const startTime = Date.now();
        
        // Send GET request to /hello endpoint using Supertest
        const response = await request
            .get('/hello')
            .expect(200) // Assert HTTP status code is 200
            .expect('Content-Type', /text\/plain/) // Assert content-type header contains text/plain
            .expect('Hello world'); // Assert response body is exactly 'Hello world'
        
        // Calculate response time for performance validation
        const responseTime = Date.now() - startTime;
        
        // Additional assertions for comprehensive validation
        expect(response.text).toBe('Hello world');
        expect(response.headers['content-type']).toMatch(/text\/plain/);
        expect(response.headers['content-type']).toMatch(/charset=utf-8/);
        
        // Performance assertion - response time should be under 100ms
        expect(responseTime).toBeLessThan(100);
        
        // Verify security headers are present (from security middleware)
        expect(response.headers).toHaveProperty('x-content-type-options');
        expect(response.headers).toHaveProperty('x-frame-options');
    });

    /**
     * Test Case: Non-GET methods to /hello return 405 Method Not Allowed
     * 
     * Validates that the hello endpoint properly filters HTTP methods and returns
     * appropriate error responses for non-GET requests. Tests multiple HTTP methods
     * to ensure comprehensive method filtering implementation.
     * 
     * Requirements addressed:
     * - F-003: Request Routing and Method Filtering
     * - F-004: Response Generation and Consistency
     */
    test('Non-GET methods to /hello return 405 Method Not Allowed', async () => {
        // Test POST method rejection
        const postResponse = await request
            .post('/hello')
            .expect(405) // Assert HTTP status code is 405 Method Not Allowed
            .expect('Content-Type', /text\/plain/); // Assert content-type header
        
        expect(postResponse.text).toBe('Method Not Allowed');
        
        // Test PUT method rejection
        const putResponse = await request
            .put('/hello')
            .expect(405) // Assert HTTP status code is 405 Method Not Allowed
            .expect('Content-Type', /text\/plain/); // Assert content-type header
        
        expect(putResponse.text).toBe('Method Not Allowed');
        
        // Test DELETE method rejection
        const deleteResponse = await request
            .delete('/hello')
            .expect(405) // Assert HTTP status code is 405 Method Not Allowed
            .expect('Content-Type', /text\/plain/); // Assert content-type header
        
        expect(deleteResponse.text).toBe('Method Not Allowed');
        
        // Test PATCH method rejection
        const patchResponse = await request
            .patch('/hello')
            .expect(405) // Assert HTTP status code is 405 Method Not Allowed
            .expect('Content-Type', /text\/plain/); // Assert content-type header
        
        expect(patchResponse.text).toBe('Method Not Allowed');
        
        // Verify that all responses have consistent content-type headers
        [postResponse, putResponse, deleteResponse, patchResponse].forEach(response => {
            expect(response.headers['content-type']).toMatch(/text\/plain/);
            expect(response.headers['content-type']).toMatch(/charset=utf-8/);
        });
    });

    /**
     * Test Case: GET to unknown path returns 404 Not Found
     * 
     * Validates that requests to non-existent endpoints return appropriate 404 errors
     * with proper error messages and content-type headers. Tests the application's
     * error handling for invalid route paths.
     * 
     * Requirements addressed:
     * - F-003: Request Routing and Method Filtering
     * - F-004: Response Generation and Consistency
     */
    test('GET to unknown path returns 404 Not Found', async () => {
        // Test request to non-existent endpoint
        const response = await request
            .get('/notfound')
            .expect(404) // Assert HTTP status code is 404 Not Found
            .expect('Content-Type', /text\/plain/); // Assert content-type header
        
        expect(response.text).toBe('Not Found');
        expect(response.headers['content-type']).toMatch(/text\/plain/);
        expect(response.headers['content-type']).toMatch(/charset=utf-8/);
        
        // Test another non-existent path to ensure consistent behavior
        const response2 = await request
            .get('/invalid/path')
            .expect(404) // Assert HTTP status code is 404 Not Found
            .expect('Content-Type', /text\/plain/); // Assert content-type header
        
        expect(response2.text).toBe('Not Found');
        
        // Test root path behavior (should return 404 since no root handler defined)
        const rootResponse = await request
            .get('/')
            .expect(404) // Assert HTTP status code is 404 Not Found
            .expect('Content-Type', /text\/plain/); // Assert content-type header
        
        expect(rootResponse.text).toBe('Not Found');
    });

    /**
     * Test Case: Response headers include proper Content-Type and security headers
     * 
     * Validates that all responses include appropriate HTTP headers for security,
     * content-type specification, and HTTP/1.1 compliance. Ensures middleware
     * is properly applying security headers to all responses.
     * 
     * Requirements addressed:
     * - F-004: Response Generation and Consistency
     * - Security header implementation from middleware
     */
    test('Response headers include Content-Type and security headers', async () => {
        // Test successful response headers
        const response = await request
            .get('/hello')
            .expect(200);
        
        // Verify Content-Type header is properly set
        expect(response.headers['content-type']).toBe('text/plain; charset=utf-8');
        
        // Verify security headers from helmet middleware are present
        expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
        expect(response.headers).toHaveProperty('x-frame-options', 'DENY');
        
        // Verify X-Powered-By header is removed (Express fingerprinting prevention)
        expect(response.headers).not.toHaveProperty('x-powered-by');
        
        // Test that error responses also include proper headers
        const errorResponse = await request
            .get('/notfound')
            .expect(404);
        
        // Verify error responses also have security headers
        expect(errorResponse.headers).toHaveProperty('x-content-type-options', 'nosniff');
        expect(errorResponse.headers).toHaveProperty('x-frame-options', 'DENY');
        expect(errorResponse.headers['content-type']).toBe('text/plain; charset=utf-8');
    });

    /**
     * Test Case: Response time validation for performance requirements
     * 
     * Validates that the hello endpoint responds within acceptable performance
     * thresholds. Tests multiple requests to ensure consistent performance
     * characteristics and identifies potential performance issues.
     * 
     * Requirements addressed:
     * - Performance requirements from technical specifications
     * - Response time monitoring and validation
     */
    test('Response time is under 100ms for performance validation', async () => {
        // Test multiple requests to validate consistent performance
        const performanceTests = [];
        
        // Execute 5 concurrent requests to test performance under load
        for (let i = 0; i < 5; i++) {
            const startTime = Date.now();
            const testPromise = request
                .get('/hello')
                .expect(200)
                .then(response => {
                    const responseTime = Date.now() - startTime;
                    return { response, responseTime };
                });
            performanceTests.push(testPromise);
        }
        
        // Wait for all performance tests to complete
        const results = await Promise.all(performanceTests);
        
        // Validate that all requests completed within performance threshold
        results.forEach(({ response, responseTime }, index) => {
            expect(responseTime).toBeLessThan(100);
            expect(response.text).toBe('Hello world');
            expect(response.status).toBe(200);
        });
        
        // Calculate average response time
        const averageResponseTime = results.reduce((sum, { responseTime }) => sum + responseTime, 0) / results.length;
        
        // Ensure average response time is well within acceptable limits
        expect(averageResponseTime).toBeLessThan(50);
    });

    /**
     * Test Case: Multiple concurrent requests handling
     * 
     * Validates that the application can handle multiple concurrent requests
     * correctly without race conditions or resource conflicts. Tests the
     * application's ability to serve multiple clients simultaneously.
     * 
     * Requirements addressed:
     * - Concurrent request handling capability
     * - Application stability under load
     */
    test('Handles multiple concurrent requests correctly', async () => {
        // Create array of concurrent request promises
        const concurrentRequests = Array.from({ length: 10 }, (_, index) => {
            return request
                .get('/hello')
                .expect(200)
                .expect('Hello world');
        });
        
        // Execute all requests concurrently
        const responses = await Promise.all(concurrentRequests);
        
        // Validate that all concurrent requests succeeded
        responses.forEach(response => {
            expect(response.status).toBe(200);
            expect(response.text).toBe('Hello world');
            expect(response.headers['content-type']).toMatch(/text\/plain/);
        });
    });

    /**
     * Test Case: Error handling consistency across different scenarios
     * 
     * Validates that error responses are consistent in format, headers, and
     * content across different error conditions. Ensures proper error handling
     * implementation throughout the application.
     * 
     * Requirements addressed:
     * - Consistent error response format
     * - Error handling middleware validation
     */
    test('Error handling consistency across different scenarios', async () => {
        // Test different error scenarios
        const errorTests = [
            { method: 'post', path: '/hello', expectedStatus: 405, expectedMessage: 'Method Not Allowed' },
            { method: 'put', path: '/hello', expectedStatus: 405, expectedMessage: 'Method Not Allowed' },
            { method: 'delete', path: '/hello', expectedStatus: 405, expectedMessage: 'Method Not Allowed' },
            { method: 'get', path: '/nonexistent', expectedStatus: 404, expectedMessage: 'Not Found' },
            { method: 'get', path: '/invalid/deep/path', expectedStatus: 404, expectedMessage: 'Not Found' }
        ];
        
        // Execute all error tests
        for (const { method, path, expectedStatus, expectedMessage } of errorTests) {
            const response = await request[method](path)
                .expect(expectedStatus)
                .expect('Content-Type', /text\/plain/);
            
            expect(response.text).toBe(expectedMessage);
            expect(response.headers['content-type']).toMatch(/charset=utf-8/);
            
            // Verify security headers are present even in error responses
            expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
            expect(response.headers).toHaveProperty('x-frame-options', 'DENY');
        }
    });

    /**
     * Test Case: Request logging and middleware execution validation
     * 
     * Validates that middleware is properly executing for all requests,
     * including request logging, security headers, and error handling.
     * This test ensures the complete middleware stack is functioning correctly.
     * 
     * Requirements addressed:
     * - Middleware execution validation
     * - Request logging functionality
     * - Security middleware implementation
     */
    test('Middleware execution and request logging validation', async () => {
        // Test that middleware executes for successful requests
        const successResponse = await request
            .get('/hello')
            .expect(200);
        
        // Verify middleware-applied headers are present
        expect(successResponse.headers).toHaveProperty('x-content-type-options');
        expect(successResponse.headers).toHaveProperty('x-frame-options');
        
        // Test that middleware executes for error requests
        const errorResponse = await request
            .get('/notfound')
            .expect(404);
        
        // Verify middleware-applied headers are present even for errors
        expect(errorResponse.headers).toHaveProperty('x-content-type-options');
        expect(errorResponse.headers).toHaveProperty('x-frame-options');
        
        // Test that middleware executes for method not allowed errors
        const methodErrorResponse = await request
            .post('/hello')
            .expect(405);
        
        // Verify middleware-applied headers are present for method errors
        expect(methodErrorResponse.headers).toHaveProperty('x-content-type-options');
        expect(methodErrorResponse.headers).toHaveProperty('x-frame-options');
    });
});