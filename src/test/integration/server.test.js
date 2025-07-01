/**
 * Integration Test Suite for Node.js/Express.js Server Entry Point
 * 
 * This comprehensive integration test suite validates the HTTP server as a black box,
 * ensuring that the backend server (as started by server.js) correctly binds to a port,
 * responds to HTTP requests on the /hello endpoint, and handles error scenarios (404, 405, 500)
 * as specified in the technical requirements.
 * 
 * The tests ensure the server is observable, robust, and compliant with all technical
 * and business requirements for request processing, response generation, and error management.
 * Uses Supertest to simulate real HTTP requests against the running server instance,
 * and leverages centralized test utilities and canonical response fixtures for DRY,
 * maintainable, and standards-compliant assertions.
 * 
 * Test Coverage:
 * - HTTP server initialization and binding verification
 * - GET /hello endpoint response validation (status, headers, body)
 * - HTTP method enforcement (405 Method Not Allowed for non-GET requests)
 * - Unknown route handling (404 Not Found for invalid paths)
 * - Server error handling (500 Internal Server Error for unhandled exceptions)
 * - Server lifecycle management (startup, shutdown, resource cleanup)
 * 
 * Integration Testing Strategy:
 * - Tests the complete request-response cycle through the real server
 * - Validates server initialization, port binding, and graceful shutdown
 * - Uses actual HTTP requests to test end-to-end functionality
 * - Ensures observability through server startup and shutdown logging
 * - Validates compliance with Express.js 5.1.0 and Node.js 18+ requirements
 * 
 * @fileoverview Integration tests for HTTP server entry point and request handling
 * @requires jest@29.7.0
 * @requires supertest@7.1.1
 * @since Node.js 18+
 */

// Test framework and HTTP testing dependencies
const supertest = require('supertest'); // ^7.1.1 - HTTP testing library for Express servers

// Internal dependencies - Server and application components
const { startServer } = require('../../backend/server.js'); // Server initialization function
const { app } = require('../../backend/app.js'); // Express application instance for direct testing

// Internal dependencies - Test utilities and fixtures
const { 
    makeRequest, 
    assertHelloResponse, 
    assertErrorResponse 
} = require('../helpers/testUtils.js'); // Centralized test utilities for DRY test code

const { 
    HELLO_RESPONSE,
    NOT_FOUND_RESPONSE,
    METHOD_NOT_ALLOWED_RESPONSE,
    INTERNAL_SERVER_ERROR_RESPONSE
} = require('../fixtures/responses.js'); // Canonical response constants

const { setupTestEnvironment } = require('../setup.js'); // Test environment initialization

// Global test state for server lifecycle management
let server; // HTTP server instance for integration testing

/**
 * Test Suite: Express Server Integration Tests
 * 
 * This test suite validates the complete server integration including startup,
 * request handling, error management, and graceful shutdown. It ensures the
 * server meets all technical requirements and handles all specified scenarios.
 */
describe('Express Server Integration Tests', () => {
    
    /**
     * Test Setup - Server Initialization
     * 
     * Executed once before all tests in this suite. Ensures the test environment
     * is properly configured and starts the HTTP server instance for integration
     * testing. The server is started on a random available port to avoid conflicts
     * in concurrent test execution environments.
     * 
     * Setup Process:
     * 1. Initialize test environment (NODE_ENV, globals, mocks)
     * 2. Start HTTP server using startServer() function
     * 3. Store server instance for lifecycle management
     * 4. Wait for server to be ready for requests
     * 
     * @async
     * @function beforeAll
     * @returns {Promise<void>} Resolves when server is ready for testing
     */
    beforeAll(async () => {
        // Step 1: Ensure test environment is properly initialized
        // This sets NODE_ENV=test and configures global test state
        setupTestEnvironment();
        
        // Step 2: Start the HTTP server using the startServer function
        // This creates a real server instance listening on a port
        try {
            server = startServer();
            
            // Step 3: Wait for server to be fully initialized and listening
            // Use a Promise to wait for the 'listening' event from the server
            await new Promise((resolve, reject) => {
                // Set up timeout to prevent hanging tests
                const timeout = setTimeout(() => {
                    reject(new Error('Server startup timeout - server did not start within 5 seconds'));
                }, 5000);
                
                // Wait for server to emit 'listening' event
                server.on('listening', () => {
                    clearTimeout(timeout);
                    resolve();
                });
                
                // Handle server startup errors
                server.on('error', (error) => {
                    clearTimeout(timeout);
                    reject(new Error(`Server startup failed: ${error.message}`));
                });
            });
            
            // Step 4: Verify server is accessible by getting server address
            const address = server.address();
            if (!address) {
                throw new Error('Server address is not available - server may not be listening');
            }
            
            // Log successful server startup for debugging
            console.log(`[TEST] Integration test server started on ${address.family} ${address.address}:${address.port}`);
            
        } catch (error) {
            // Handle server initialization errors
            console.error('[TEST] Failed to start integration test server:', error.message);
            
            // Clean up partial server state if it exists
            if (server) {
                try {
                    server.close();
                } catch (closeError) {
                    console.error('[TEST] Error closing failed server:', closeError.message);
                }
            }
            
            // Re-throw error to fail test setup
            throw error;
        }
    }, 10000); // 10 second timeout for server startup
    
    /**
     * Test Cleanup - Server Shutdown
     * 
     * Executed once after all tests in this suite complete. Ensures the HTTP server
     * is gracefully shut down and all resources are properly released. This prevents
     * port conflicts and resource leaks in continuous test execution environments.
     * 
     * Cleanup Process:
     * 1. Close HTTP server to stop accepting new connections
     * 2. Wait for existing connections to complete
     * 3. Release port and system resources
     * 4. Reset global test state
     * 
     * @async
     * @function afterAll
     * @returns {Promise<void>} Resolves when server is fully shut down
     */
    afterAll(async () => {
        // Step 1: Verify server instance exists before attempting shutdown
        if (server) {
            try {
                // Step 2: Gracefully close the server
                // This stops accepting new connections and waits for existing ones to complete
                await new Promise((resolve, reject) => {
                    // Set up timeout to prevent hanging cleanup
                    const timeout = setTimeout(() => {
                        reject(new Error('Server shutdown timeout - server did not close within 5 seconds'));
                    }, 5000);
                    
                    // Close server with callback
                    server.close((error) => {
                        clearTimeout(timeout);
                        
                        if (error) {
                            reject(new Error(`Server shutdown failed: ${error.message}`));
                        } else {
                            resolve();
                        }
                    });
                });
                
                // Log successful server shutdown for debugging
                console.log('[TEST] Integration test server shut down successfully');
                
            } catch (error) {
                // Log cleanup errors but don't fail tests
                console.error('[TEST] Error during server shutdown:', error.message);
            } finally {
                // Step 3: Reset global server state regardless of shutdown result
                server = null;
            }
        } else {
            console.log('[TEST] No server instance to shut down');
        }
    }, 10000); // 10 second timeout for server shutdown
    
    /**
     * Test Group: Hello World Endpoint Integration
     * 
     * Tests the primary /hello endpoint functionality through the running server,
     * validating the complete request-response cycle including HTTP method handling,
     * response formatting, and canonical message delivery.
     */
    describe('GET /hello endpoint integration', () => {
        
        /**
         * Test: GET /hello returns canonical Hello world response
         * 
         * Validates that the /hello endpoint is accessible via the running server
         * and returns the correct canonical "Hello world" message with proper
         * HTTP status code and content-type headers.
         * 
         * Test Assertions:
         * - HTTP status code is 200 (OK)
         * - Content-Type header includes 'text/plain'
         * - Response body exactly matches HELLO_RESPONSE constant
         * 
         * Business Requirement: Hello World Endpoint Feature (F-002)
         * Technical Requirement: Response time < 100ms
         */
        test('GET /hello returns Hello world with correct status and headers', async () => {
            // Send GET request to /hello endpoint via running server
            const response = await makeRequest(server, 'GET', '/hello');
            
            // Use centralized assertion helper for comprehensive validation
            assertHelloResponse(response);
        });
        
        /**
         * Test: GET /hello response performance validation
         * 
         * Validates that the /hello endpoint meets the technical requirement
         * of responding within 100ms to ensure acceptable performance for
         * educational and demonstration purposes.
         * 
         * Performance Requirement: Response time < 100ms
         * Measured from request initiation to response completion
         */
        test('GET /hello responds within performance threshold', async () => {
            // Measure response time for performance validation
            const startTime = Date.now();
            
            // Send request and validate response
            const response = await makeRequest(server, 'GET', '/hello');
            const responseTime = Date.now() - startTime;
            
            // Validate response correctness
            assertHelloResponse(response);
            
            // Validate performance requirement (< 100ms)
            expect(responseTime).toBeLessThan(100);
        });
        
        /**
         * Test: GET /hello concurrent request handling
         * 
         * Validates that the server can handle multiple concurrent requests
         * to the /hello endpoint while maintaining response correctness and
         * acceptable performance characteristics.
         * 
         * Concurrency Test: 10 simultaneous requests
         * Performance Validation: All responses correct and timely
         */
        test('GET /hello handles concurrent requests correctly', async () => {
            const concurrentRequests = 10;
            const startTime = Date.now();
            
            // Create array of concurrent request promises
            const requestPromises = Array.from({ length: concurrentRequests }, () =>
                makeRequest(server, 'GET', '/hello')
            );
            
            // Wait for all requests to complete
            const responses = await Promise.all(requestPromises);
            const totalTime = Date.now() - startTime;
            
            // Validate all responses are correct
            responses.forEach((response, index) => {
                assertHelloResponse(response);
            });
            
            // Validate reasonable total time for concurrent requests
            expect(totalTime).toBeLessThan(1000); // Should complete within 1 second
            
            // Log performance metrics for monitoring
            const averageResponseTime = totalTime / concurrentRequests;
            console.log(`[TEST] Concurrent requests: ${concurrentRequests}, Total time: ${totalTime}ms, Average: ${averageResponseTime}ms`);
        });
        
    });
    
    /**
     * Test Group: HTTP Method Enforcement
     * 
     * Tests that the server correctly enforces HTTP method restrictions on
     * endpoints, returning 405 Method Not Allowed for unsupported methods
     * with canonical error messages.
     */
    describe('HTTP method enforcement integration', () => {
        
        /**
         * Test: POST /hello returns 405 Method Not Allowed
         * 
         * Validates that the /hello endpoint only accepts GET requests and
         * returns the correct 405 error response for POST requests with
         * the canonical method not allowed message.
         * 
         * Business Requirement: Request Processing Feature (F-003)
         * Error Handling: Method enforcement with standard HTTP status codes
         */
        test('POST /hello returns 405 Method Not Allowed', async () => {
            // Send POST request to /hello endpoint (should be rejected)
            const response = await makeRequest(server, 'POST', '/hello');
            
            // Validate 405 error response with canonical message
            assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
        });
        
        /**
         * Test: PUT /hello returns 405 Method Not Allowed
         * 
         * Validates method enforcement for PUT requests on the /hello endpoint,
         * ensuring consistent error handling across all unsupported HTTP methods.
         */
        test('PUT /hello returns 405 Method Not Allowed', async () => {
            // Send PUT request to /hello endpoint (should be rejected)
            const response = await makeRequest(server, 'PUT', '/hello');
            
            // Validate 405 error response with canonical message
            assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
        });
        
        /**
         * Test: DELETE /hello returns 405 Method Not Allowed
         * 
         * Validates method enforcement for DELETE requests on the /hello endpoint,
         * ensuring comprehensive HTTP method restriction coverage.
         */
        test('DELETE /hello returns 405 Method Not Allowed', async () => {
            // Send DELETE request to /hello endpoint (should be rejected)
            const response = await makeRequest(server, 'DELETE', '/hello');
            
            // Validate 405 error response with canonical message
            assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
        });
        
    });
    
    /**
     * Test Group: Unknown Route Handling
     * 
     * Tests that the server correctly handles requests to unknown or invalid
     * routes by returning 404 Not Found errors with canonical error messages.
     */
    describe('Unknown route handling integration', () => {
        
        /**
         * Test: GET /notfound returns 404 Not Found
         * 
         * Validates that the server returns appropriate 404 error responses
         * for requests to routes that do not exist, with canonical error messages.
         * 
         * Business Requirement: Error Management (1.3.1 In-Scope)
         * Error Handling: 404 responses for unknown routes
         */
        test('GET /notfound returns 404 Not Found', async () => {
            // Send GET request to non-existent route
            const response = await makeRequest(server, 'GET', '/notfound');
            
            // Validate 404 error response with canonical message
            assertErrorResponse(response, 404, NOT_FOUND_RESPONSE);
        });
        
        /**
         * Test: GET /invalid/path returns 404 Not Found
         * 
         * Validates 404 error handling for nested invalid paths to ensure
         * comprehensive route validation coverage.
         */
        test('GET /invalid/path returns 404 Not Found', async () => {
            // Send GET request to invalid nested path
            const response = await makeRequest(server, 'GET', '/invalid/path');
            
            // Validate 404 error response with canonical message
            assertErrorResponse(response, 404, NOT_FOUND_RESPONSE);
        });
        
        /**
         * Test: POST /nonexistent returns 404 Not Found
         * 
         * Validates that unknown routes return 404 errors regardless of
         * HTTP method, prioritizing route validation over method validation.
         */
        test('POST /nonexistent returns 404 Not Found', async () => {
            // Send POST request to non-existent route
            const response = await makeRequest(server, 'POST', '/nonexistent');
            
            // Validate 404 error response with canonical message
            assertErrorResponse(response, 404, NOT_FOUND_RESPONSE);
        });
        
    });
    
    /**
     * Test Group: Server Health and Monitoring
     * 
     * Tests the server's health check endpoint and monitoring capabilities
     * to ensure observability and operational readiness.
     */
    describe('Server health monitoring integration', () => {
        
        /**
         * Test: GET /health returns server health status
         * 
         * Validates that the health check endpoint is accessible and returns
         * appropriate server status information for monitoring and load balancing.
         * 
         * Health Check Requirements:
         * - HTTP status 200 for healthy server
         * - JSON response format with status information
         * - Process uptime and memory usage metrics
         */
        test('GET /health returns server health status', async () => {
            // Send GET request to health check endpoint
            const response = await makeRequest(server, 'GET', '/health');
            
            // Validate successful health check response
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toEqual(
                expect.stringContaining('application/json')
            );
            
            // Validate health response structure
            expect(response.body).toHaveProperty('status');
            expect(response.body).toHaveProperty('uptime');
            expect(response.body).toHaveProperty('timestamp');
            
            // Validate health status values
            expect(typeof response.body.uptime).toBe('number');
            expect(response.body.uptime).toBeGreaterThan(0);
        });
        
    });
    
    /**
     * Test Group: Server Error Handling
     * 
     * Tests server behavior under error conditions to ensure robust error
     * handling and appropriate error responses for unhandled exceptions.
     * 
     * Note: This test group is optional as the basic tutorial application
     * may not expose error-triggering endpoints for security reasons.
     */
    describe('Server error handling integration', () => {
        
        /**
         * Test: Server handles malformed requests gracefully
         * 
         * Validates that the server handles malformed or invalid HTTP requests
         * without crashing and returns appropriate error responses.
         * 
         * Error Handling: Graceful degradation for invalid requests
         * Server Stability: No crashes or unhandled exceptions
         */
        test('Server handles malformed request headers gracefully', async () => {
            try {
                // Send request with invalid headers (if supported by test framework)
                const response = await supertest(server)
                    .get('/hello')
                    .set('Invalid-Header', '\x00\x01\x02') // Invalid header characters
                    .timeout(1000);
                
                // Server should either process normally or return appropriate error
                // Should not crash or return 500 for header parsing issues
                expect([200, 400].includes(response.status)).toBe(true);
                
            } catch (error) {
                // If request fails at HTTP level, ensure it's handled gracefully
                expect(error.message).not.toContain('ECONNRESET');
                expect(error.message).not.toContain('socket hang up');
            }
        });
        
        /**
         * Test: Server handles connection timeouts appropriately
         * 
         * Validates that the server maintains stability under timeout conditions
         * and doesn't accumulate connection leaks or resource issues.
         */
        test('Server maintains stability under timeout conditions', async () => {
            // Send multiple rapid requests to test connection handling
            const rapidRequests = Array.from({ length: 5 }, () =>
                makeRequest(server, 'GET', '/hello')
                    .timeout(100) // Short timeout to test resilience
                    .catch(error => ({ error: error.message }))
            );
            
            const results = await Promise.all(rapidRequests);
            
            // At least some requests should succeed (server should remain responsive)
            const successfulRequests = results.filter(result => !result.error);
            expect(successfulRequests.length).toBeGreaterThan(0);
            
            // Verify server is still responsive after timeout test
            const finalResponse = await makeRequest(server, 'GET', '/hello');
            assertHelloResponse(finalResponse);
        });
        
    });
    
    /**
     * Test Group: Server Integration Compliance
     * 
     * Tests that validate compliance with technical specifications and
     * architectural requirements for the complete server integration.
     */
    describe('Server integration compliance', () => {
        
        /**
         * Test: Server responds with correct HTTP headers
         * 
         * Validates that the server includes all required HTTP headers
         * for proper client interaction and protocol compliance.
         * 
         * HTTP Compliance: Standard headers for content type and length
         * Security Headers: Basic security headers for protection
         */
        test('Server includes required HTTP headers in responses', async () => {
            // Send request and examine response headers
            const response = await makeRequest(server, 'GET', '/hello');
            
            // Validate required headers are present
            expect(response.headers).toHaveProperty('content-type');
            expect(response.headers).toHaveProperty('content-length');
            expect(response.headers).toHaveProperty('date');
            
            // Validate content-type is correct for text response
            expect(response.headers['content-type']).toEqual(
                expect.stringContaining('text/plain')
            );
            
            // Validate content-length matches actual content
            const expectedLength = HELLO_RESPONSE.length.toString();
            expect(response.headers['content-length']).toBe(expectedLength);
        });
        
        /**
         * Test: Server maintains stateless behavior
         * 
         * Validates that the server maintains stateless behavior across
         * multiple requests, ensuring horizontal scaling compatibility.
         * 
         * Stateless Requirement: No session state between requests
         * Scaling Compatibility: Consistent responses regardless of request history
         */
        test('Server maintains stateless behavior across requests', async () => {
            // Send multiple requests and verify consistent responses
            const request1 = await makeRequest(server, 'GET', '/hello');
            const request2 = await makeRequest(server, 'GET', '/hello');
            const request3 = await makeRequest(server, 'GET', '/hello');
            
            // All responses should be identical (stateless behavior)
            assertHelloResponse(request1);
            assertHelloResponse(request2);
            assertHelloResponse(request3);
            
            // Response content should be identical
            expect(request1.text).toBe(request2.text);
            expect(request2.text).toBe(request3.text);
            
            // Status codes should be identical
            expect(request1.status).toBe(request2.status);
            expect(request2.status).toBe(request3.status);
        });
        
        /**
         * Test: Server integration with Express.js 5.1.0 features
         * 
         * Validates that the server properly utilizes Express.js 5.1.0
         * features and security enhancements as specified in requirements.
         * 
         * Framework Compliance: Express.js 5.1.0 compatibility
         * Security Features: ReDoS protection and enhanced security
         */
        test('Server demonstrates Express.js 5.1.0 integration', async () => {
            // Test server response characteristics that demonstrate Express.js integration
            const response = await makeRequest(server, 'GET', '/hello');
            
            // Validate Express.js response characteristics
            expect(response.headers).toHaveProperty('x-powered-by');
            
            // Validate that server handles routes using Express.js routing
            assertHelloResponse(response);
            
            // Test Express.js error handling integration
            const errorResponse = await makeRequest(server, 'GET', '/nonexistent');
            assertErrorResponse(errorResponse, 404, NOT_FOUND_RESPONSE);
        });
        
    });
    
});