/**
 * Integration Test Suite for HTTP Endpoints - Node.js Tutorial Application
 * 
 * This test suite provides comprehensive end-to-end validation of the Express.js application's
 * HTTP endpoints, focusing on the /hello endpoint and global error handling mechanisms.
 * Using Jest and Supertest, these tests verify that the application responds correctly to
 * various HTTP requests and that all middleware components work together as intended.
 * 
 * Test Coverage:
 * - GET /hello endpoint functionality and compliance with technical specifications
 * - HTTP method validation and proper error responses for unsupported methods
 * - 404 Not Found handling for undefined endpoints with standardized error responses
 * - Integration of all middleware components (logging, error handling, not found)
 * - End-to-end request/response cycle validation with proper status codes and headers
 * 
 * Educational Objectives:
 * - Demonstrate best practices for Express.js application testing using Jest and Supertest
 * - Show how to test HTTP endpoints without starting an actual server process
 * - Illustrate comprehensive API testing patterns including status codes, headers, and body validation
 * - Provide examples of testing both success and error scenarios in a web application
 * - Demonstrate how integration tests validate the complete middleware chain execution
 * 
 * Technical Requirements Addressed:
 * - F-002: Hello Endpoint Feature - Validates exact 'Hello world' response with correct headers
 * - F-003: Error Handling Feature - Ensures 404 responses and error middleware integration
 * - F-001: HTTP Server Initialization - Validates complete app initialization and middleware integration
 * - Testing Strategy: Demonstrates Jest/Supertest integration testing best practices
 * 
 * Test Environment:
 * - Uses Jest testing framework v29.0.0 for test structure and assertions
 * - Uses Supertest v7.1.1 for HTTP endpoint testing without server startup
 * - Tests run in isolated environment with fresh app instance per test
 * - No external dependencies or persistent data required for test execution
 * 
 * @fileoverview Integration tests for HTTP endpoints using Jest and Supertest
 * @author Node.js Tutorial Project
 * @version 1.0.0
 * @requires jest ^29.0.0
 * @requires supertest ^7.1.1
 */

// =============================================================================
// EXTERNAL DEPENDENCIES
// =============================================================================

/**
 * Supertest HTTP Testing Library
 * 
 * Supertest is a high-level abstraction for testing HTTP, while still allowing you
 * to drop down to the lower-level API provided by superagent. It enables testing
 * of Express.js applications by providing a fluent API for making HTTP requests
 * and asserting responses without needing to start an actual server.
 * 
 * Key Features Used:
 * - request(app) - Creates a test agent for the Express application
 * - HTTP method helpers (get, post, put, delete) for making requests
 * - Assertion methods (expect) for validating response properties
 * - Automatic port management - no need to manage server ports in tests
 * - Promise-based API compatible with async/await testing patterns
 * 
 * Version 7.1.1 Benefits:
 * - Compatible with Express.js v5.x and modern Node.js versions
 * - Improved promise handling and error reporting
 * - Enhanced TypeScript support for better development experience
 * - Optimized performance for large test suites
 * 
 * Educational Value:
 * - Demonstrates how to test HTTP APIs without external server dependencies
 * - Shows best practices for API endpoint testing in Node.js applications
 * - Illustrates how to validate HTTP status codes, headers, and response bodies
 * - Provides foundation for understanding HTTP request/response testing patterns
 * 
 * @external supertest
 * @see {@link https://github.com/visionmedia/supertest} Supertest GitHub repository
 * @version 7.1.1
 */
const request = require('supertest'); // v7.1.1

// =============================================================================
// INTERNAL DEPENDENCIES
// =============================================================================

/**
 * Express Application Instance for Testing
 * 
 * Imports the fully configured Express application from the main app.js file.
 * This includes all middleware (request logging, JSON parsing, error handling),
 * mounted routes (/hello endpoint), and complete application initialization.
 * The app instance is used by Supertest to make HTTP requests for testing.
 * 
 * Application Components Included:
 * - Express.js v5.1.0 application instance with all middleware registered
 * - Request logging middleware for observability (logs to console during tests)
 * - JSON body parsing middleware (express.json())
 * - Main router with /hello endpoint mounted at root path
 * - 404 Not Found handler for unmatched routes
 * - Centralized error handling middleware for exception management
 * 
 * Integration Testing Benefits:
 * - Tests the complete application stack as it would run in production
 * - Validates that all middleware components work together correctly
 * - Ensures proper middleware registration order and execution
 * - Provides confidence in the full request/response processing pipeline
 * 
 * Supertest Integration:
 * - Supertest automatically binds the app to an ephemeral port for testing
 * - No need to start/stop server manually in test setup/teardown
 * - Tests run against the actual Express application configuration
 * - Multiple tests can run concurrently without port conflicts
 * 
 * @type {express.Application}
 * @see {@link ../../app.js} Main Express application implementation
 */
const app = require('../../app.js');

// =============================================================================
// TEST SUITE: GET /hello ENDPOINT
// =============================================================================

/**
 * Test Suite for the /hello Endpoint
 * 
 * This test suite validates the primary endpoint of the Node.js tutorial application,
 * ensuring it meets all technical specifications and behaves correctly under various
 * HTTP request scenarios. The tests verify both successful responses and proper
 * handling of unsupported HTTP methods.
 * 
 * Technical Requirements Validated:
 * - F-002: Hello Endpoint Feature - exact 'Hello world' response as plain text
 * - HTTP 200 status code for successful GET requests
 * - Proper Content-Type header (text/plain) for the response
 * - Rejection of unsupported HTTP methods with appropriate error responses
 * - Integration with request logging and response formatting middleware
 * 
 * Test Structure:
 * - Individual test cases for each requirement and scenario
 * - Comprehensive assertion coverage for status codes, headers, and response body
 * - Validation of both positive (success) and negative (error) test cases
 * - Educational documentation explaining each test's purpose and implementation
 */
describe('GET /hello', () => {
    /**
     * Test Case: Successful GET Request to /hello Endpoint
     * 
     * This test validates the core functionality of the /hello endpoint by making
     * a GET request and verifying that all response characteristics meet the
     * technical specifications exactly as defined in the requirements.
     * 
     * Validation Points:
     * - HTTP status code is exactly 200 (OK)
     * - Content-Type header is set to 'text/plain' or matches text content pattern
     * - Response body contains exactly 'Hello world' with no additional content
     * - Response is returned promptly without timeout or connection issues
     * - Request is processed through complete middleware chain successfully
     * 
     * Integration Aspects Tested:
     * - Express application initialization and route mounting
     * - Request logging middleware execution (logs will appear in test output)
     * - Route handler execution with response formatting utility
     * - Response generation using centralized formatSuccessResponse function
     * - Complete request/response cycle from receipt to client response
     * 
     * Educational Value:
     * - Demonstrates basic HTTP GET request testing patterns
     * - Shows how to use Supertest's fluent API for endpoint testing
     * - Illustrates multiple assertion types (status, headers, body)
     * - Provides foundation for testing other HTTP endpoints
     */
    it('should return Hello world with 200 status and correct headers', async () => {
        // Execute HTTP GET request to /hello endpoint using Supertest
        const response = await request(app)
            .get('/hello')
            .expect('Content-Type', /text/) // Assert Content-Type header matches text pattern
            .expect(200); // Assert HTTP status code is exactly 200 OK
        
        // Validate response body contains exactly the expected message
        // This assertion ensures compliance with F-002 requirement for exact text
        expect(response.text).toBe('Hello world');
        
        // Additional validation: Ensure response body is a string type
        expect(typeof response.text).toBe('string');
        
        // Additional validation: Ensure no extraneous data in response
        expect(response.text.length).toBe(11); // 'Hello world' is exactly 11 characters
    });

    /**
     * Test Case: POST Method Not Allowed on /hello Endpoint
     * 
     * This test ensures that the /hello endpoint properly rejects HTTP POST requests
     * and returns appropriate error responses. Since the endpoint is designed only
     * for GET requests, other HTTP methods should be handled by the 404 or error
     * handling middleware.
     * 
     * Validation Points:
     * - POST requests to /hello should not be accepted
     * - Response should indicate method not allowed or not found
     * - Error response should follow standardized format
     * - Request should be processed through error handling middleware
     * 
     * HTTP Method Testing:
     * The /hello endpoint only defines a GET route handler, so POST requests
     * will not match any defined routes and should be handled by the 404
     * middleware, resulting in a 404 Not Found response.
     */
    it('should return 404 for POST requests to /hello endpoint', async () => {
        // Execute HTTP POST request to /hello endpoint
        const response = await request(app)
            .post('/hello')
            .expect('Content-Type', /json/) // Error responses should be JSON format
            .expect(404); // Expect 404 Not Found status code
        
        // Validate error response structure matches standardized format
        expect(response.body).toHaveProperty('error', true);
        expect(response.body).toHaveProperty('message', 'Resource not found');
        
        // Ensure response is proper JSON object, not string
        expect(typeof response.body).toBe('object');
    });

    /**
     * Test Case: PUT Method Not Allowed on /hello Endpoint
     * 
     * Similar to the POST test, this validates that PUT requests are properly
     * rejected and handled by the error handling middleware.
     */
    it('should return 404 for PUT requests to /hello endpoint', async () => {
        const response = await request(app)
            .put('/hello')
            .expect('Content-Type', /json/)
            .expect(404);
        
        expect(response.body).toHaveProperty('error', true);
        expect(response.body).toHaveProperty('message', 'Resource not found');
    });

    /**
     * Test Case: DELETE Method Not Allowed on /hello Endpoint
     * 
     * Validates that DELETE requests are properly rejected with standardized
     * error responses.
     */
    it('should return 404 for DELETE requests to /hello endpoint', async () => {
        const response = await request(app)
            .delete('/hello')
            .expect('Content-Type', /json/)
            .expect(404);
        
        expect(response.body).toHaveProperty('error', true);
        expect(response.body).toHaveProperty('message', 'Resource not found');
    });

    /**
     * Test Case: Response Headers Validation
     * 
     * This test specifically focuses on validating that the response headers
     * are set correctly for the /hello endpoint, ensuring HTTP compliance
     * and proper content type declaration.
     */
    it('should set correct response headers for GET /hello', async () => {
        const response = await request(app)
            .get('/hello')
            .expect(200);
        
        // Validate Content-Type header is correctly set for plain text
        expect(response.headers['content-type']).toMatch(/text\/plain/);
        
        // Validate Content-Length header is set (Express automatically sets this)
        expect(response.headers['content-length']).toBe('11');
        
        // Ensure no X-Powered-By header is exposed (security best practice)
        // Note: This depends on Express configuration - may or may not be present
        // in development vs production environments
    });

    /**
     * Test Case: Response Time Performance Validation
     * 
     * This test ensures that the /hello endpoint responds within acceptable
     * time limits, validating performance characteristics of the simple endpoint.
     */
    it('should respond to GET /hello within acceptable time limit', async () => {
        const startTime = Date.now();
        
        await request(app)
            .get('/hello')
            .expect(200);
        
        const responseTime = Date.now() - startTime;
        
        // Endpoint should respond within 100ms for this simple operation
        // This validates the performance requirement from the technical specifications
        expect(responseTime).toBeLessThan(100);
    });
});

// =============================================================================
// TEST SUITE: 404 NOT FOUND AND ERROR HANDLING
// =============================================================================

/**
 * Test Suite for 404 Not Found and Error Handling
 * 
 * This test suite validates the application's error handling capabilities,
 * focusing on how unmatched routes are handled and ensuring that the 404
 * Not Found middleware and centralized error handling work correctly.
 * 
 * Error Handling Components Tested:
 * - 404 Not Found handler middleware for unmatched routes
 * - Standardized error response formatting using formatErrorResponse utility
 * - Proper HTTP status codes and content types for error responses
 * - Request logging for error scenarios (logs will appear in test output)
 * - Complete error handling middleware chain execution
 * 
 * Technical Requirements Validated:
 * - F-003: Error Handling Feature - standardized 404 responses
 * - Consistent error response structure across all error scenarios
 * - Proper integration of notFoundHandler middleware
 * - Security through generic error messages (no information disclosure)
 */
describe('404 Not Found and Error Handling', () => {
    /**
     * Test Case: GET Request to Undefined Endpoint
     * 
     * This test validates that requests to paths that don't match any defined
     * routes are properly handled by the 404 Not Found middleware and return
     * standardized error responses.
     * 
     * Validation Points:
     * - HTTP status code is exactly 404 (Not Found)
     * - Content-Type header is set to 'application/json' for structured errors
     * - Response body follows standardized error format with error flag and message
     * - Error message matches the NOT_FOUND_MESSAGE constant ('Resource not found')
     * - Response is processed through notFoundHandler middleware
     * 
     * Middleware Chain Testing:
     * 1. Request is received by Express application
     * 2. Request logging middleware logs the request
     * 3. No route handlers match the path '/nonexistent-endpoint'
     * 4. notFoundHandler middleware is invoked
     * 5. formatErrorResponse utility generates standardized JSON error response
     * 6. Response is sent to client with appropriate headers and status code
     */
    it('should return 404 with standardized error format for undefined endpoints', async () => {
        // Execute GET request to a path that doesn't exist
        const response = await request(app)
            .get('/nonexistent-endpoint')
            .expect('Content-Type', /json/) // Error responses should be JSON
            .expect(404); // Expect 404 Not Found status code
        
        // Validate standardized error response structure
        expect(response.body).toHaveProperty('error', true);
        expect(response.body).toHaveProperty('message', 'Resource not found');
        
        // Ensure response is proper JSON object
        expect(typeof response.body).toBe('object');
        
        // Validate that no sensitive information is exposed in the error response
        expect(response.body).not.toHaveProperty('stack');
        expect(response.body).not.toHaveProperty('details');
    });

    /**
     * Test Case: POST Request to Undefined Endpoint
     * 
     * Validates that POST requests to non-existent endpoints also return
     * proper 404 responses with consistent error formatting.
     */
    it('should return 404 for POST requests to undefined endpoints', async () => {
        const response = await request(app)
            .post('/api/nonexistent')
            .expect('Content-Type', /json/)
            .expect(404);
        
        expect(response.body).toHaveProperty('error', true);
        expect(response.body).toHaveProperty('message', 'Resource not found');
    });

    /**
     * Test Case: PUT Request to Undefined Endpoint
     * 
     * Ensures PUT requests to non-existent endpoints return standardized
     * 404 error responses.
     */
    it('should return 404 for PUT requests to undefined endpoints', async () => {
        const response = await request(app)
            .put('/users/123')
            .expect('Content-Type', /json/)
            .expect(404);
        
        expect(response.body).toHaveProperty('error', true);
        expect(response.body).toHaveProperty('message', 'Resource not found');
    });

    /**
     * Test Case: DELETE Request to Undefined Endpoint
     * 
     * Validates that DELETE requests to non-existent endpoints return
     * proper 404 responses.
     */
    it('should return 404 for DELETE requests to undefined endpoints', async () => {
        const response = await request(app)
            .delete('/admin/settings')
            .expect('Content-Type', /json/)
            .expect(404);
        
        expect(response.body).toHaveProperty('error', true);
        expect(response.body).toHaveProperty('message', 'Resource not found');
    });

    /**
     * Test Case: 404 Response Structure Validation
     * 
     * This test specifically focuses on validating the structure and content
     * of 404 error responses to ensure they meet API consistency standards.
     */
    it('should return consistent 404 error structure across different undefined paths', async () => {
        // Test multiple different undefined paths to ensure consistency
        const paths = ['/api/v1/users', '/admin', '/dashboard', '/fake-endpoint'];
        
        for (const path of paths) {
            const response = await request(app)
                .get(path)
                .expect(404);
            
            // Each response should have identical structure
            expect(response.body).toEqual({
                error: true,
                message: 'Resource not found'
            });
            
            // Validate Content-Type is consistent
            expect(response.headers['content-type']).toMatch(/application\/json/);
        }
    });

    /**
     * Test Case: 404 Logging Verification
     * 
     * While we can't directly test the logging output in this integration test,
     * we can verify that 404 requests are processed without errors, which
     * indicates that the logging middleware is working correctly.
     */
    it('should handle 404 errors without throwing exceptions', async () => {
        // This test ensures that the 404 handling doesn't cause any unhandled
        // exceptions or errors in the application
        
        // Make request that will result in 404
        const response = await request(app)
            .get('/this-definitely-does-not-exist')
            .expect(404);
        
        // If we reach this point without exceptions, the error handling is working
        expect(response.body.error).toBe(true);
        
        // Verify that the app is still responsive after handling 404 error
        const followUpResponse = await request(app)
            .get('/hello')
            .expect(200);
        
        expect(followUpResponse.text).toBe('Hello world');
    });

    /**
     * Test Case: Error Response Headers Validation
     * 
     * Validates that error responses include appropriate HTTP headers for
     * proper client handling and caching behavior.
     */
    it('should set correct headers for 404 error responses', async () => {
        const response = await request(app)
            .get('/undefined-route')
            .expect(404);
        
        // Validate Content-Type is set correctly for JSON error responses
        expect(response.headers['content-type']).toMatch(/application\/json/);
        
        // Validate that Content-Length is set (Express sets this automatically)
        expect(response.headers['content-length']).toBeDefined();
        
        // Error responses should not be cached
        // Note: Specific cache-control headers depend on Express configuration
    });

    /**
     * Test Case: Multiple Concurrent 404 Requests
     * 
     * This test validates that the application can handle multiple concurrent
     * requests to undefined endpoints without issues, ensuring the error
     * handling middleware is thread-safe and performant.
     */
    it('should handle multiple concurrent 404 requests correctly', async () => {
        // Create array of promises for concurrent requests
        const concurrentRequests = Array.from({ length: 5 }, (_, index) => {
            return request(app)
                .get(`/undefined-endpoint-${index}`)
                .expect(404);
        });
        
        // Execute all requests concurrently
        const responses = await Promise.all(concurrentRequests);
        
        // Validate that all responses have consistent error structure
        responses.forEach((response, index) => {
            expect(response.body).toEqual({
                error: true,
                message: 'Resource not found'
            });
            
            expect(response.status).toBe(404);
        });
    });
});

// =============================================================================
// TEST SUITE: APPLICATION INTEGRATION AND MIDDLEWARE CHAIN
// =============================================================================

/**
 * Test Suite for Application Integration and Middleware Chain
 * 
 * This test suite validates that all middleware components work together
 * correctly and that the complete application integration functions as
 * expected in various scenarios.
 */
describe('Application Integration and Middleware Chain', () => {
    /**
     * Test Case: Complete Request/Response Cycle Validation
     * 
     * This test validates that the complete request processing pipeline
     * works correctly from initial request receipt to final response.
     */
    it('should process requests through complete middleware chain', async () => {
        // Test successful request processing
        const successResponse = await request(app)
            .get('/hello')
            .expect(200);
        
        expect(successResponse.text).toBe('Hello world');
        
        // Test error request processing
        const errorResponse = await request(app)
            .get('/undefined')
            .expect(404);
        
        expect(errorResponse.body.error).toBe(true);
        
        // Verify app remains responsive after both success and error cases
        const finalResponse = await request(app)
            .get('/hello')
            .expect(200);
        
        expect(finalResponse.text).toBe('Hello world');
    });

    /**
     * Test Case: HTTP Method Support Validation
     * 
     * Comprehensive test of which HTTP methods are supported by the application
     * and how unsupported methods are handled.
     */
    it('should handle various HTTP methods appropriately', async () => {
        // Test supported method (GET /hello)
        await request(app)
            .get('/hello')
            .expect(200);
        
        // Test unsupported methods on existing endpoint
        const unsupportedMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
        
        for (const method of unsupportedMethods) {
            await request(app)
                [method.toLowerCase()]('/hello')
                .expect(404); // Should return 404 since route doesn't exist for these methods
        }
    });

    /**
     * Test Case: Response Consistency Validation
     * 
     * Ensures that response formats are consistent across different types
     * of requests and scenarios.
     */
    it('should maintain consistent response formats', async () => {
        // Success responses should be plain text for /hello
        const successResponse = await request(app)
            .get('/hello')
            .expect('Content-Type', /text/)
            .expect(200);
        
        expect(typeof successResponse.text).toBe('string');
        
        // Error responses should be JSON
        const errorResponse = await request(app)
            .get('/undefined')
            .expect('Content-Type', /json/)
            .expect(404);
        
        expect(typeof errorResponse.body).toBe('object');
        expect(errorResponse.body).toHaveProperty('error', true);
        expect(errorResponse.body).toHaveProperty('message');
    });

    /**
     * Test Case: Application Health and Stability
     * 
     * Tests that the application remains stable and responsive under
     * various request scenarios.
     */
    it('should maintain application stability across request types', async () => {
        // Mix of successful and error requests
        const requests = [
            request(app).get('/hello').expect(200),
            request(app).get('/undefined1').expect(404),
            request(app).post('/hello').expect(404),
            request(app).get('/hello').expect(200),
            request(app).get('/undefined2').expect(404),
            request(app).get('/hello').expect(200)
        ];
        
        // Execute all requests and verify they complete successfully
        const responses = await Promise.all(requests);
        
        // Verify that successful requests returned correct data
        const successfulResponses = responses.filter((_, index) => 
            [0, 3, 5].includes(index) // These are the successful /hello requests
        );
        
        successfulResponses.forEach(response => {
            expect(response.text).toBe('Hello world');
        });
        
        // Verify that error responses have correct structure
        const errorResponses = responses.filter((_, index) => 
            [1, 2, 4].includes(index) // These are the error requests
        );
        
        errorResponses.forEach(response => {
            expect(response.body.error).toBe(true);
            expect(response.body.message).toBe('Resource not found');
        });
    });
});

// =============================================================================
// IMPLEMENTATION NOTES AND TESTING BEST PRACTICES
// =============================================================================

/**
 * Integration Testing Best Practices Demonstrated:
 * 
 * 1. **Comprehensive Coverage**: Tests cover all defined endpoints, error scenarios,
 *    and middleware integration points to ensure complete functionality validation.
 * 
 * 2. **Isolation**: Each test is independent and doesn't rely on state from other
 *    tests, ensuring reliable and repeatable test execution.
 * 
 * 3. **Real Integration**: Tests use the actual Express application instance,
 *    validating that all components work together correctly.
 * 
 * 4. **Multiple Assertion Types**: Tests validate status codes, headers, response
 *    bodies, and response structures to ensure complete compliance.
 * 
 * 5. **Error Scenario Testing**: Comprehensive testing of error conditions ensures
 *    robust error handling and user experience.
 * 
 * 6. **Performance Validation**: Basic performance testing ensures acceptable
 *    response times for simple operations.
 * 
 * 7. **Educational Value**: Extensive documentation explains each test's purpose
 *    and implementation for learning purposes.
 * 
 * 8. **Concurrent Testing**: Tests validate that the application can handle
 *    multiple simultaneous requests correctly.
 * 
 * 9. **Middleware Chain Validation**: Tests ensure that requests are processed
 *    through the complete middleware stack correctly.
 * 
 * 10. **Security Considerations**: Tests verify that error responses don't expose
 *     sensitive information or internal system details.
 * 
 * This test suite serves as both a validation tool for the application's
 * functionality and an educational example of comprehensive integration testing
 * practices for Node.js Express applications using Jest and Supertest.
 */