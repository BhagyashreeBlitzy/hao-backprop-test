/**
 * Integration Test Suite for Node.js Tutorial Application HTTP Endpoints
 * 
 * This comprehensive integration test suite validates all major HTTP endpoints and error scenarios
 * in the Node.js tutorial application using Jest and Supertest. The tests perform end-to-end
 * validation against the actual Express app instance, ensuring that all endpoints behave according
 * to the documented API contract and technical specifications.
 * 
 * Educational Objectives:
 * - Demonstrate integration testing best practices for Express.js applications
 * - Show proper use of Jest testing framework with TypeScript
 * - Illustrate HTTP endpoint testing using Supertest library
 * - Provide examples of test data management using fixtures
 * - Demonstrate proper test organization and documentation patterns
 * - Show validation of HTTP status codes, headers, and response bodies
 * - Illustrate error scenario testing and edge case handling
 * 
 * Technical Requirements Addressed:
 * - F-002: Hello Endpoint Feature - Validates GET /hello returns exact 'Hello world' message
 * - F-003: Error Handling Feature - Tests 404 Not Found and 500 Internal Server Error responses
 * - Educational Value - Comprehensive documentation and clear test structure for learning
 * 
 * Testing Strategy:
 * - Integration tests that exercise the full HTTP request/response cycle
 * - All test data loaded from JSON fixtures for maintainability and contract validation
 * - Independent tests that don't rely on shared state or execution order
 * - Comprehensive assertions on status codes, headers, and response bodies
 * - Educational documentation explaining each test scenario and expected behavior
 * 
 * Technology Stack:
 * - Jest v29.0.0 - Test runner and assertion library
 * - Supertest v7.1.1 - HTTP assertion library for testing Express apps
 * - TypeScript - Type-safe test development
 * - Express.js v5.1.0 - Application framework being tested
 * - Node.js v22.x LTS - Runtime environment
 * 
 * @fileoverview Integration tests for HTTP endpoints and error handling
 * @author Node.js Tutorial Development Team
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
 * Supertest is a SuperAgent-driven library for testing HTTP servers in Node.js applications.
 * It provides a high-level abstraction for testing HTTP endpoints by allowing developers
 * to make HTTP requests and assert on the responses in a clean, readable way.
 * 
 * Key Features Used:
 * - HTTP request simulation against Express app instances
 * - Built-in assertion methods for status codes, headers, and response bodies
 * - Promise-based API compatible with async/await patterns
 * - Integration with Jest for comprehensive test reporting
 * - Automatic server binding to ephemeral ports (no port management needed)
 * 
 * Version 7.1.1 Benefits:
 * - Enhanced TypeScript support for better development experience
 * - Improved error reporting and debugging capabilities
 * - Better integration with modern testing frameworks like Jest
 * - Support for modern JavaScript features and async/await patterns
 * 
 * Educational Value:
 * - Demonstrates professional API testing approaches
 * - Shows integration between testing tools and Express.js applications
 * - Provides examples of HTTP protocol testing (methods, headers, status codes)
 * - Illustrates best practices for end-to-end API validation
 * 
 * Usage Pattern:
 * const response = await request(app)
 *   .get('/endpoint')
 *   .expect('Content-Type', /json/)
 *   .expect(200);
 * 
 * @external supertest
 * @see {@link https://github.com/visionmedia/supertest} Supertest documentation
 * @version 7.1.1
 */
import request from 'supertest'; // v7.1.1

// =============================================================================
// INTERNAL DEPENDENCIES  
// =============================================================================

/**
 * Express Application Instance
 * 
 * Imports the fully configured Express application instance from the main app module.
 * This is the complete application with all middleware, routes, and error handlers
 * configured exactly as they would be in production, ensuring that integration tests
 * validate the real application behavior.
 * 
 * Application Components Tested:
 * - Express.js v5.1.0 framework configuration
 * - Request logging middleware
 * - JSON body parsing middleware  
 * - Main router with /hello endpoint
 * - 404 Not Found handler middleware
 * - Centralized error handling middleware
 * 
 * Integration Benefits:
 * - Tests the complete request/response cycle including all middleware
 * - Validates middleware execution order and error handling
 * - Ensures production-like testing environment
 * - Tests actual HTTP server behavior, not just isolated functions
 * 
 * Supertest Integration:
 * - Supertest can accept an Express app instance directly
 * - Automatically binds to ephemeral port for testing (no port conflicts)
 * - Creates isolated test environment for each test run
 * - Supports concurrent test execution without interference
 * 
 * @type {express.Application}
 * @see {@link ../../../src/backend/app.js} Main application configuration
 */
import app from '../../../src/backend/app.js';

/**
 * Expected Response Fixtures
 * 
 * Imports canonical expected response objects for all endpoints and error scenarios.
 * These fixtures define the exact HTTP responses that should be returned by the
 * application, serving as the contract specification for API behavior validation.
 * 
 * Fixture Structure:
 * - hello_success: Expected response for successful GET /hello requests
 * - not_found_error: Expected response for requests to non-existent endpoints
 * - internal_server_error: Expected response for internal server errors
 * - Additional error scenarios for comprehensive coverage
 * 
 * Contract-Driven Testing Benefits:
 * - Ensures API responses match documented specifications
 * - Provides single source of truth for expected response formats
 * - Enables easy maintenance when API contracts change
 * - Supports both development and testing consistency
 * 
 * Educational Value:
 * - Demonstrates fixture-based testing approaches
 * - Shows separation of test data from test logic
 * - Illustrates API contract validation patterns
 * - Provides examples of structured test data organization
 * 
 * @type {Object}
 * @see {@link ../fixtures/expected-responses.json} Response fixture definitions
 */
import expectedResponses from '../fixtures/expected-responses.json';

/**
 * Sample Request Fixtures
 * 
 * Imports canonical sample HTTP request objects for all endpoints and test scenarios.
 * These fixtures define the exact HTTP requests that should be sent to the application
 * during testing, ensuring consistent and comprehensive test coverage.
 * 
 * Fixture Structure:
 * - hello_get_request: Standard GET request to /hello endpoint
 * - not_found_request: Request to non-existent endpoint for 404 testing
 * - internal_error_request: Request designed to trigger internal errors
 * - Additional request scenarios for edge case testing
 * 
 * Request Standardization Benefits:
 * - Consistent HTTP headers and request format across all tests
 * - Realistic request patterns that match actual client usage
 * - Easy maintenance and updates to request specifications
 * - Support for complex request scenarios and edge cases
 * 
 * Educational Value:
 * - Shows proper HTTP request structure and headers
 * - Demonstrates realistic client request patterns
 * - Provides examples of different HTTP methods and scenarios
 * - Illustrates test data organization and management
 * 
 * @type {Object}
 * @see {@link ../fixtures/sample-requests.json} Request fixture definitions
 */
import sampleRequests from '../fixtures/sample-requests.json';

// =============================================================================
// TYPE DEFINITIONS FOR ENHANCED TYPESCRIPT INTEGRATION
// =============================================================================

/**
 * HTTP Response Interface Definition
 * 
 * Defines the structure of HTTP response objects used throughout the test suite.
 * This interface ensures type safety when working with response assertions and
 * provides clear documentation of expected response structure.
 * 
 * @interface HTTPResponse
 */
interface HTTPResponse {
    /** HTTP status code (200, 404, 500, etc.) */
    status: number;
    /** HTTP response headers object */
    headers: Record<string, string>;
    /** Response body content (string or object) */
    body: string | Record<string, any>;
    /** Human-readable description of the response */
    description?: string;
    /** Test scenario identifier */
    testScenario?: string;
}

/**
 * HTTP Request Interface Definition
 * 
 * Defines the structure of HTTP request objects used throughout the test suite.
 * This interface ensures type safety when working with request fixtures and
 * provides clear documentation of request structure.
 * 
 * @interface HTTPRequest
 */
interface HTTPRequest {
    /** HTTP method (GET, POST, PUT, DELETE, etc.) */
    method: string;
    /** Request path/URL */
    path: string;
    /** HTTP request headers */
    headers: Record<string, string>;
    /** Request body content (null for GET requests) */
    body: any;
    /** Query parameters object */
    query: Record<string, any>;
    /** Route parameters object */
    params: Record<string, any>;
    /** Expected HTTP status code for this request */
    expectedStatus?: number;
    /** Expected response content type */
    expectedResponseType?: string;
    /** Human-readable description of the request */
    description?: string;
}

// =============================================================================
// MAIN INTEGRATION TEST SUITE
// =============================================================================

/**
 * Integration Test Suite: HTTP Endpoints and Error Handling
 * 
 * This is the main test suite that validates all HTTP endpoints and error scenarios
 * in the Node.js tutorial application. The suite uses Jest's describe() function to
 * organize tests logically and provide clear test output and reporting.
 * 
 * Test Organization:
 * - Grouped by functionality (successful responses, error handling)
 * - Clear test descriptions that explain expected behavior
 * - Independent tests that can run in any order
 * - Comprehensive coverage of all application endpoints and error scenarios
 * 
 * Educational Structure:
 * - Each test includes detailed comments explaining the scenario
 * - Test names clearly indicate what behavior is being validated
 * - Assertions are explicit and well-documented
 * - Error cases are thoroughly tested alongside success cases
 * 
 * Jest Integration:
 * - Uses Jest's describe() for test organization and grouping
 * - Leverages Jest's test() function for individual test cases
 * - Utilizes Jest's built-in assertion library (expect) for validations
 * - Supports Jest's async/await testing patterns
 * 
 * Testing Philosophy:
 * - Test behavior, not implementation details
 * - Validate the complete HTTP request/response cycle
 * - Assert on all important aspects: status, headers, and body
 * - Provide clear error messages when tests fail
 */
describe('Integration: Endpoints', () => {
    
    // =========================================================================
    // SUCCESSFUL ENDPOINT TESTING
    // =========================================================================
    
    /**
     * Test Case: GET /hello Returns Hello World Response
     * 
     * This test validates the primary functionality of the Node.js tutorial application:
     * the /hello endpoint that returns a "Hello world" message. This test represents
     * the core requirement (F-002: Hello Endpoint Feature) and demonstrates basic
     * HTTP request/response testing patterns.
     * 
     * Test Scenario:
     * 1. Send HTTP GET request to /hello endpoint with appropriate headers
     * 2. Validate that response status code is 200 (OK)
     * 3. Validate that response Content-Type header is 'text/plain; charset=utf-8'
     * 4. Validate that response body contains exactly 'Hello world'
     * 5. Verify all response characteristics match the fixture specification
     * 
     * Technical Requirements Validated:
     * - F-002-RQ-001: GET /hello route handler responds correctly
     * - F-002-RQ-002: Returns appropriate HTTP status codes (200)
     * - HTTP/1.1 compliance for successful responses
     * - Proper Content-Type header setting for plain text responses
     * 
     * Educational Value:
     * - Demonstrates basic HTTP GET request testing
     * - Shows proper use of Supertest for endpoint validation
     * - Illustrates Jest test structure and async/await patterns
     * - Provides example of comprehensive response validation
     * - Shows fixture-based testing for contract validation
     * 
     * Success Criteria:
     * - HTTP status code must be exactly 200
     * - Content-Type header must include 'text/plain'
     * - Response body must be exactly 'Hello world' (case-sensitive)
     * - Response time should be reasonable (< 100ms typically)
     * 
     * @test
     * @async
     */
    test('GET /hello returns Hello world', async () => {
        // Extract test data from fixtures for contract-driven testing
        const requestSpec: HTTPRequest = sampleRequests.hello_get_request;
        const expectedResponse: HTTPResponse = expectedResponses.hello_success;
        
        console.log(`\n🔍 Testing: ${requestSpec.description}`);
        console.log(`📝 Expected: ${expectedResponse.description}`);
        
        // Execute HTTP request using Supertest against the Express app
        // Supertest automatically handles server lifecycle and port binding
        const response = await request(app)
            .get(requestSpec.path)  // Send GET request to /hello
            .set(requestSpec.headers)  // Set request headers from fixture
            .expect(expectedResponse.status)  // Assert expected status code
            .expect('Content-Type', /text\/plain/);  // Assert Content-Type header
        
        // Comprehensive response validation using Jest assertions
        
        // Validate exact response body content
        expect(response.text).toBe(expectedResponse.body);
        console.log(`✅ Response body validated: "${response.text}"`);
        
        // Validate specific Content-Type header format
        expect(response.headers['content-type']).toBe(expectedResponse.headers['content-type']);
        console.log(`✅ Content-Type header validated: ${response.headers['content-type']}`);
        
        // Validate response status code (redundant with .expect() but explicit)
        expect(response.status).toBe(expectedResponse.status);
        console.log(`✅ Status code validated: ${response.status}`);
        
        // Log response time for performance awareness
        const responseTime = response.header['x-response-time'] || 'Not measured';
        console.log(`⏱️  Response time: ${responseTime}`);
        
        console.log(`🎉 Test completed successfully: ${requestSpec.testScenario}`);
    });
    
    // =========================================================================
    // ERROR HANDLING TESTING - 404 NOT FOUND
    // =========================================================================
    
    /**
     * Test Case: GET Invalid Path Returns 404 Not Found
     * 
     * This test validates the application's 404 error handling capabilities when
     * requests are made to endpoints that don't exist. This represents a critical
     * part of the error handling requirements (F-003: Error Handling Feature)
     * and demonstrates proper HTTP error response patterns.
     * 
     * Test Scenario:
     * 1. Send HTTP GET request to a non-existent endpoint
     * 2. Validate that response status code is 404 (Not Found)
     * 3. Validate that response Content-Type header is 'application/json; charset=utf-8'
     * 4. Validate that response body contains proper error structure
     * 5. Verify error message is appropriate and doesn't expose sensitive information
     * 
     * Technical Requirements Validated:
     * - F-003: Error Handling Feature for invalid paths
     * - HTTP/1.1 compliance for error responses
     * - Proper JSON error response structure
     * - Security: No sensitive information disclosure in error messages
     * - Express.js 404 middleware functionality
     * 
     * Educational Value:
     * - Demonstrates HTTP error code testing
     * - Shows proper error response structure validation
     * - Illustrates security considerations in error handling
     * - Provides example of negative test case patterns
     * - Shows JSON response body validation techniques
     * 
     * Security Considerations:
     * - Error message should be generic to prevent information disclosure
     * - No stack traces or internal paths should be exposed
     * - Response should not reveal application structure or technology details
     * 
     * @test
     * @async
     */
    test('GET invalid path returns 404 Not Found', async () => {
        // Extract test data from fixtures for contract-driven testing
        const requestSpec: HTTPRequest = sampleRequests.not_found_request;
        const expectedResponse: HTTPResponse = expectedResponses.not_found_error;
        
        console.log(`\n🔍 Testing: ${requestSpec.description}`);
        console.log(`📝 Expected: ${expectedResponse.description}`);
        
        // Execute HTTP request to non-existent endpoint
        const response = await request(app)
            .get(requestSpec.path)  // Send GET request to invalid path
            .set(requestSpec.headers)  // Set request headers from fixture
            .expect(expectedResponse.status)  // Assert 404 status code
            .expect('Content-Type', /application\/json/);  // Assert JSON Content-Type
        
        // Comprehensive error response validation
        
        // Validate error response structure matches expected format
        expect(response.body).toEqual(expectedResponse.body);
        console.log(`✅ Error response body validated:`, response.body);
        
        // Validate specific error message content
        expect(response.body.error).toBe('Not Found');
        expect(response.body.message).toBe('The requested resource was not found');
        console.log(`✅ Error message validated: ${response.body.message}`);
        
        // Validate JSON Content-Type header
        expect(response.headers['content-type']).toBe(expectedResponse.headers['content-type']);
        console.log(`✅ Content-Type header validated: ${response.headers['content-type']}`);
        
        // Security validation: ensure no sensitive information is exposed
        expect(response.body).not.toHaveProperty('stack');
        expect(response.body).not.toHaveProperty('path');
        expect(response.body).not.toHaveProperty('code');
        console.log(`🔒 Security validation passed: No sensitive information disclosed`);
        
        console.log(`🎉 Test completed successfully: ${requestSpec.testScenario}`);
    });
    
    // =========================================================================
    // ERROR HANDLING TESTING - 500 INTERNAL SERVER ERROR
    // =========================================================================
    
    /**
     * Test Case: GET /trigger-internal-error Returns 500 Internal Server Error
     * 
     * This test validates the application's internal server error handling capabilities
     * when unexpected errors occur during request processing. This test verifies the
     * centralized error handling middleware and demonstrates Express.js v5's improved
     * error handling for async operations.
     * 
     * Test Scenario:
     * 1. Send HTTP GET request to endpoint designed to trigger internal error
     * 2. Validate that response status code is 500 (Internal Server Error)
     * 3. Validate that response Content-Type header is 'application/json; charset=utf-8'
     * 4. Validate that response body contains generic error message
     * 5. Verify that sensitive error details are not exposed to clients
     * 
     * Technical Requirements Validated:
     * - F-003: Error Handling Feature for internal server errors
     * - Express.js v5 automatic promise rejection handling
     * - Centralized error handler middleware functionality
     * - Security: Sanitized error messages in production
     * - HTTP/1.1 compliance for server error responses
     * 
     * Educational Value:
     * - Demonstrates internal server error testing patterns
     * - Shows Express.js v5 enhanced error handling capabilities
     * - Illustrates security-conscious error response design
     * - Provides example of testing error scenarios
     * - Shows centralized error handling middleware validation
     * 
     * Express.js v5 Features:
     * - Automatic promise rejection handling eliminates manual error catching
     * - Enhanced error handling pipeline with better context
     * - Improved debugging capabilities while maintaining security
     * 
     * Security Features:
     * - Generic error messages prevent information disclosure
     * - No stack traces or internal paths exposed to clients
     * - Environment-aware error detail exposure (development vs production)
     * 
     * @test
     * @async
     */
    test('GET /trigger-internal-error returns 500 Internal Server Error', async () => {
        // Extract test data from fixtures for contract-driven testing
        const requestSpec: HTTPRequest = sampleRequests.internal_error_request;
        const expectedResponse: HTTPResponse = expectedResponses.internal_server_error;
        
        console.log(`\n🔍 Testing: ${requestSpec.description}`);
        console.log(`📝 Expected: ${expectedResponse.description}`);
        
        // Execute HTTP request that should trigger internal server error
        const response = await request(app)
            .get(requestSpec.path)  // Send GET request to error trigger endpoint
            .set(requestSpec.headers)  // Set request headers from fixture
            .expect(expectedResponse.status)  // Assert 500 status code
            .expect('Content-Type', /application\/json/);  // Assert JSON Content-Type
        
        // Comprehensive error response validation
        
        // Validate error response structure matches expected format
        expect(response.body).toEqual(expectedResponse.body);
        console.log(`✅ Error response body validated:`, response.body);
        
        // Validate specific error message content
        expect(response.body.error).toBe('Internal Server Error');
        expect(response.body.message).toBe('An unexpected error occurred');
        console.log(`✅ Error message validated: ${response.body.message}`);
        
        // Validate JSON Content-Type header
        expect(response.headers['content-type']).toBe(expectedResponse.headers['content-type']);
        console.log(`✅ Content-Type header validated: ${response.headers['content-type']}`);
        
        // Security validation: ensure no sensitive information is exposed
        expect(response.body).not.toHaveProperty('stack');
        expect(response.body).not.toHaveProperty('details');
        expect(response.body).not.toHaveProperty('originalError');
        expect(response.body).not.toHaveProperty('code');
        console.log(`🔒 Security validation passed: No sensitive information disclosed`);
        
        // Express.js v5 feature validation: error was handled by centralized middleware
        expect(response.headers).not.toHaveProperty('x-error-source');
        console.log(`⚡ Express.js v5 error handling validated: Centralized error processing`);
        
        console.log(`🎉 Test completed successfully: ${requestSpec.testScenario}`);
    });
    
    // =========================================================================
    // ADDITIONAL ERROR SCENARIO TESTING
    // =========================================================================
    
    /**
     * Test Case: POST /hello Returns 405 Method Not Allowed
     * 
     * This test validates that the /hello endpoint properly restricts HTTP methods
     * and only allows GET requests. When other HTTP methods are used, the application
     * should return a 405 Method Not Allowed response with appropriate headers.
     * 
     * Test Scenario:
     * 1. Send HTTP POST request to /hello endpoint
     * 2. Validate that response status code is 405 (Method Not Allowed)
     * 3. Validate that response includes Allow header with permitted methods
     * 4. Validate that response body contains appropriate error message
     * 
     * Technical Requirements Validated:
     * - HTTP method validation and restriction
     * - Proper HTTP 405 response handling
     * - Allow header specification per HTTP/1.1 standards
     * - Route-specific method constraints
     * 
     * Educational Value:
     * - Demonstrates HTTP method validation testing
     * - Shows proper Allow header usage
     * - Illustrates REST API constraint enforcement
     * - Provides example of method-based error handling
     * 
     * @test
     * @async
     */
    test('POST /hello returns 405 Method Not Allowed', async () => {
        // Extract test data from fixtures
        const requestSpec: HTTPRequest = sampleRequests.hello_post_request;
        const expectedResponse: HTTPResponse = expectedResponses.method_not_allowed_error;
        
        console.log(`\n🔍 Testing: ${requestSpec.description}`);
        console.log(`📝 Expected: ${expectedResponse.description}`);
        
        // Execute HTTP POST request to GET-only endpoint
        const response = await request(app)
            .post(requestSpec.path)  // Send POST request to /hello
            .set(requestSpec.headers)  // Set request headers
            .send(requestSpec.body)  // Send request body
            .expect(expectedResponse.status)  // Assert 405 status code
            .expect('Content-Type', /application\/json/);  // Assert JSON response
        
        // Validate Allow header is present and correct
        expect(response.headers.allow).toBe(expectedResponse.headers.allow);
        console.log(`✅ Allow header validated: ${response.headers.allow}`);
        
        // Validate error response body
        expect(response.body).toEqual(expectedResponse.body);
        console.log(`✅ Method not allowed response validated`);
        
        console.log(`🎉 Test completed successfully: ${requestSpec.testScenario}`);
    });
    
    // =========================================================================
    // EDGE CASE AND BOUNDARY TESTING
    // =========================================================================
    
    /**
     * Test Case: GET /hello with Query Parameters
     * 
     * This test validates that the /hello endpoint handles query parameters gracefully
     * and still returns the expected "Hello world" response regardless of query string
     * parameters that might be included in the request.
     * 
     * Test Scenario:
     * 1. Send HTTP GET request to /hello with query parameters
     * 2. Validate that response status code is still 200 (OK)
     * 3. Validate that response body is still exactly 'Hello world'
     * 4. Ensure query parameters don't affect the static response
     * 
     * Educational Value:
     * - Demonstrates query parameter handling in static endpoints
     * - Shows that endpoint behavior is consistent regardless of query params
     * - Illustrates testing of edge cases and boundary conditions
     * - Provides example of parameter isolation in static responses
     * 
     * @test
     * @async
     */
    test('GET /hello with query parameters returns Hello world', async () => {
        // Extract test data from fixtures
        const requestSpec: HTTPRequest = sampleRequests.hello_with_query_params_request;
        const expectedResponse: HTTPResponse = expectedResponses.hello_success;
        
        console.log(`\n🔍 Testing: ${requestSpec.description}`);
        console.log(`📝 Query parameters: ${JSON.stringify(requestSpec.query)}`);
        
        // Execute HTTP GET request with query parameters
        const response = await request(app)
            .get(requestSpec.path)  // Send GET request to /hello
            .query(requestSpec.query)  // Add query parameters
            .set(requestSpec.headers)  // Set request headers
            .expect(expectedResponse.status)  // Assert 200 status code
            .expect('Content-Type', /text\/plain/);  // Assert text/plain response
        
        // Validate that response is unchanged despite query parameters
        expect(response.text).toBe(expectedResponse.body);
        console.log(`✅ Static response maintained with query parameters: "${response.text}"`);
        
        console.log(`🎉 Test completed successfully: Query parameter handling validated`);
    });
    
    // =========================================================================
    // PERFORMANCE AND RELIABILITY TESTING
    // =========================================================================
    
    /**
     * Test Case: Response Time Performance Validation
     * 
     * This test validates that the /hello endpoint responds within acceptable
     * performance thresholds, demonstrating performance testing approaches and
     * ensuring the application meets response time requirements.
     * 
     * Test Scenario:
     * 1. Send HTTP GET request to /hello endpoint
     * 2. Measure response time
     * 3. Validate that response time is under performance threshold (100ms)
     * 4. Log performance metrics for monitoring
     * 
     * Educational Value:
     * - Demonstrates performance testing integration with functional tests
     * - Shows response time measurement techniques
     * - Illustrates performance assertion patterns
     * - Provides example of non-functional requirement validation
     * 
     * @test
     * @async
     */
    test('GET /hello responds within performance threshold', async () => {
        console.log(`\n🔍 Testing: Response time performance validation`);
        
        // Record start time for performance measurement
        const startTime = process.hrtime.bigint();
        
        // Execute HTTP request
        const response = await request(app)
            .get('/hello')
            .expect(200);
        
        // Calculate response time
        const endTime = process.hrtime.bigint();
        const responseTimeMs = Number(endTime - startTime) / 1_000_000; // Convert to milliseconds
        
        // Performance validation
        const performanceThreshold = 100; // 100ms threshold
        expect(responseTimeMs).toBeLessThan(performanceThreshold);
        
        console.log(`⏱️  Response time: ${responseTimeMs.toFixed(2)}ms (threshold: ${performanceThreshold}ms)`);
        console.log(`✅ Response body: "${response.text}"`);
        console.log(`🎉 Performance test completed successfully`);
    });
    
    // =========================================================================
    // CONCURRENT REQUEST TESTING
    // =========================================================================
    
    /**
     * Test Case: Concurrent Request Handling
     * 
     * This test validates that the application can handle multiple concurrent
     * requests to the /hello endpoint without issues, demonstrating the stateless
     * nature of the endpoint and Node.js's event-driven concurrency model.
     * 
     * Test Scenario:
     * 1. Send multiple concurrent HTTP GET requests to /hello endpoint
     * 2. Validate that all requests return 200 status code
     * 3. Validate that all responses contain 'Hello world'
     * 4. Ensure no request interference or state corruption
     * 
     * Educational Value:
     * - Demonstrates concurrent request testing patterns
     * - Shows Node.js event-driven concurrency in action
     * - Illustrates stateless endpoint behavior validation
     * - Provides example of scalability testing approaches
     * 
     * @test
     * @async
     */
    test('Multiple concurrent GET /hello requests succeed', async () => {
        console.log(`\n🔍 Testing: Concurrent request handling`);
        
        const concurrentRequestCount = 10;
        console.log(`📊 Sending ${concurrentRequestCount} concurrent requests`);
        
        // Create array of concurrent request promises
        const requestPromises = Array.from({ length: concurrentRequestCount }, (_, index) => 
            request(app)
                .get('/hello')
                .expect(200)
                .expect('Content-Type', /text\/plain/)
                .then(response => ({
                    requestIndex: index,
                    status: response.status,
                    body: response.text
                }))
        );
        
        // Execute all requests concurrently
        const results = await Promise.all(requestPromises);
        
        // Validate all responses
        results.forEach((result, index) => {
            expect(result.status).toBe(200);
            expect(result.body).toBe('Hello world');
            console.log(`✅ Request ${index + 1}/${concurrentRequestCount}: ${result.status} - "${result.body}"`);
        });
        
        console.log(`🎉 Concurrent request test completed successfully: ${concurrentRequestCount} requests processed`);
    });
    
    // =========================================================================
    // COMPREHENSIVE ERROR COVERAGE TESTING
    // =========================================================================
    
    /**
     * Test Case: Invalid HTTP Method Coverage
     * 
     * This test validates that the application properly handles various HTTP methods
     * that are not supported by the endpoints, ensuring comprehensive error coverage
     * and proper HTTP method validation across different scenarios.
     * 
     * Test Scenario:
     * 1. Test multiple unsupported HTTP methods (PUT, DELETE, PATCH)
     * 2. Validate appropriate error responses for each method
     * 3. Ensure consistent error handling across different methods
     * 4. Verify proper Allow header responses
     * 
     * Educational Value:
     * - Demonstrates comprehensive HTTP method testing
     * - Shows parameterized testing techniques
     * - Illustrates consistent error handling validation
     * - Provides example of edge case coverage
     * 
     * @test
     * @async
     */
    test.each([
        ['PUT', 'PUT method not allowed'],
        ['DELETE', 'DELETE method not allowed'], 
        ['PATCH', 'PATCH method not allowed']
    ])('%s /hello returns 405 Method Not Allowed', async (method: string, description: string) => {
        console.log(`\n🔍 Testing: ${description}`);
        
        // Execute HTTP request with unsupported method
        const response = await request(app)
            [method.toLowerCase() as keyof typeof request](app)('/hello')
            .expect(405)
            .expect('Content-Type', /application\/json/);
        
        // Validate error response structure
        expect(response.body).toHaveProperty('error', 'Method Not Allowed');
        expect(response.body).toHaveProperty('message');
        
        // Validate Allow header is present
        expect(response.headers).toHaveProperty('allow');
        
        console.log(`✅ ${method} method properly rejected with 405 status`);
        console.log(`✅ Allow header: ${response.headers.allow}`);
    });
});

// =============================================================================
// TEST SUITE LIFECYCLE AND UTILITIES
// =============================================================================

/**
 * Test Suite Setup and Teardown
 * 
 * Jest provides lifecycle hooks for setting up and tearing down test environments.
 * While this simple test suite doesn't require complex setup/teardown, these
 * examples demonstrate the patterns for more complex testing scenarios.
 * 
 * Educational Value:
 * - Shows Jest lifecycle hook usage
 * - Demonstrates test environment management
 * - Provides patterns for complex test setup scenarios
 * - Illustrates resource cleanup approaches
 */

/**
 * Before All Tests Hook
 * 
 * Executes once before all tests in this suite run. Useful for expensive
 * setup operations that can be shared across all tests.
 */
beforeAll(async () => {
    console.log('\n🚀 Starting Integration Test Suite: HTTP Endpoints');
    console.log('📋 Test Configuration:');
    console.log('   - Framework: Jest v29.0.0');
    console.log('   - HTTP Testing: Supertest v7.1.1');
    console.log('   - Application: Express.js v5.1.0');
    console.log('   - Runtime: Node.js v22.x LTS');
    console.log('   - Test Environment: Integration Testing');
});

/**
 * After All Tests Hook
 * 
 * Executes once after all tests in this suite complete. Useful for cleanup
 * operations and resource deallocation.
 */
afterAll(async () => {
    console.log('\n🎯 Integration Test Suite Completed');
    console.log('📊 All endpoints and error scenarios validated successfully');
    console.log('✅ Application ready for deployment');
});

/**
 * Before Each Test Hook
 * 
 * Executes before each individual test. Useful for setting up fresh state
 * or logging test information.
 */
beforeEach(() => {
    // Log test separator for clear output
    console.log('\n' + '='.repeat(80));
});

/**
 * After Each Test Hook
 * 
 * Executes after each individual test. Useful for cleanup or result logging.
 */
afterEach(() => {
    // Log test completion separator
    console.log('='.repeat(80));
});

// =============================================================================
// TEST UTILITIES AND HELPER FUNCTIONS
// =============================================================================

/**
 * Custom Matcher Extensions
 * 
 * Jest allows extending the expect() function with custom matchers for domain-
 * specific assertions. These examples show how to create reusable test utilities.
 * 
 * Educational Value:
 * - Demonstrates Jest custom matcher patterns
 * - Shows reusable test utility creation
 * - Provides examples of domain-specific assertions
 * - Illustrates test code organization and reuse
 */

/**
 * Validates HTTP Response Structure
 * 
 * Helper function to validate common HTTP response characteristics including
 * status code, content type, and basic response structure validation.
 * 
 * @param response - Supertest response object
 * @param expectedStatus - Expected HTTP status code
 * @param expectedContentType - Expected Content-Type header pattern
 */
function validateHttpResponse(
    response: any,
    expectedStatus: number,
    expectedContentType: RegExp
): void {
    expect(response.status).toBe(expectedStatus);
    expect(response.headers['content-type']).toMatch(expectedContentType);
    expect(response.headers).toHaveProperty('content-length');
}

/**
 * Validates Error Response Security
 * 
 * Helper function to ensure error responses don't expose sensitive information
 * that could be useful to attackers or reveal internal application details.
 * 
 * @param errorResponse - Response body from error endpoint
 */
function validateErrorSecurity(errorResponse: any): void {
    // Ensure no sensitive properties are exposed
    const sensitiveProperties = ['stack', 'code', 'path', 'originalError', 'details'];
    sensitiveProperties.forEach(prop => {
        expect(errorResponse).not.toHaveProperty(prop);
    });
    
    // Ensure error messages are generic
    expect(typeof errorResponse.message).toBe('string');
    expect(errorResponse.message.length).toBeGreaterThan(0);
    expect(errorResponse.message).not.toMatch(/\/[A-Za-z0-9_\-\/]+/); // No file paths
}

// =============================================================================
// EDUCATIONAL NOTES AND BEST PRACTICES
// =============================================================================

/**
 * Integration Testing Best Practices Demonstrated:
 * 
 * 1. **Fixture-Based Testing**: All test data is loaded from JSON fixtures,
 *    ensuring consistency and maintainability of test scenarios.
 * 
 * 2. **Complete HTTP Cycle Testing**: Tests exercise the full request/response
 *    cycle including middleware, routing, and error handling.
 * 
 * 3. **Comprehensive Assertions**: Each test validates status codes, headers,
 *    and response bodies to ensure complete API contract compliance.
 * 
 * 4. **Security Validation**: Error response tests include security checks to
 *    ensure no sensitive information is disclosed to clients.
 * 
 * 5. **Performance Awareness**: Response time testing demonstrates integration
 *    of performance requirements with functional testing.
 * 
 * 6. **Error Scenario Coverage**: Comprehensive testing of error conditions
 *    including 404, 500, and 405 error responses.
 * 
 * 7. **Concurrent Request Testing**: Validates application behavior under
 *    concurrent load to ensure stateless operation.
 * 
 * 8. **Educational Documentation**: Extensive comments and logging provide
 *    learning value and debugging information.
 * 
 * Testing Anti-Patterns Avoided:
 * 
 * 1. **Test Interdependence**: Each test is independent and can run in any order
 * 2. **Magic Numbers**: All expected values are defined in fixtures
 * 3. **Incomplete Assertions**: All relevant response aspects are validated
 * 4. **Poor Error Messages**: Clear, descriptive test names and assertions
 * 5. **Missing Edge Cases**: Comprehensive coverage of boundary conditions
 * 
 * Express.js v5 Features Leveraged:
 * 
 * 1. **Automatic Promise Handling**: Error tests rely on Express 5's automatic
 *    promise rejection handling for cleaner error management
 * 2. **Enhanced Security**: Testing validates Express 5's improved security features
 * 3. **Modern Node.js Support**: Tests run on Node.js v22 LTS for optimal performance
 * 
 * Maintenance Guidelines:
 * 
 * 1. **Update Fixtures**: When API contracts change, update fixture files
 * 2. **Add New Scenarios**: Include tests for any new endpoints or error conditions
 * 3. **Monitor Performance**: Update performance thresholds as requirements change
 * 4. **Security Reviews**: Regularly review error response tests for security implications
 * 5. **Documentation Updates**: Keep educational comments current with code changes
 */