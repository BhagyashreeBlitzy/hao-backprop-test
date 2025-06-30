/**
 * Unit Test Suite for notFoundHandler Express Middleware
 * 
 * This comprehensive test suite validates the notFoundHandler middleware functionality,
 * ensuring it correctly handles unmatched routes by logging events, returning standardized
 * 404 Not Found responses, and maintaining proper security practices across different
 * environments. The tests demonstrate best practices for Express.js middleware testing
 * using Jest and Supertest with centralized test utilities.
 * 
 * Key Testing Areas:
 * - HTTP 404 response handling for unmatched routes
 * - Centralized logging integration with proper warning level
 * - Middleware execution flow (not calling next())
 * - Standardized error response structure validation
 * - Environment-specific response behavior (development vs production)
 * - Security considerations (information disclosure prevention)
 * 
 * Educational Value:
 * - Demonstrates comprehensive Express.js middleware testing patterns
 * - Shows proper use of Jest mocking and spying capabilities
 * - Illustrates environment-aware testing strategies
 * - Provides examples of DRY testing with reusable utilities
 * - Models security-conscious testing practices
 * 
 * @fileoverview Unit tests for notFoundHandler Express middleware
 * @author Node.js Tutorial Project
 * @version 1.0.0
 * @requires jest ^29.0.0
 */

// Jest testing framework - ^29.0.0
// Comprehensive testing framework with built-in mocking, assertions, and coverage reporting
const jest = require('jest');

// Import the middleware under test
// The notFoundHandler middleware handles unmatched routes by logging and returning 404 responses
const { notFoundHandler } = require('../../../middleware/notFoundHandler.js');

// Import centralized test utilities for Express.js object mocking and assertions
// These utilities provide DRY, robust testing infrastructure for middleware validation
const { 
    createMockRequest, 
    createMockResponse, 
    simulateNext, 
    assertResponse 
} = require('../../helpers/testUtils.js');

// Import HTTP status code constant for assertion validation
// HTTP_NOT_FOUND represents the standard 404 status code used by the middleware
const { HTTP_NOT_FOUND } = require('../../../utils/httpStatusCodes.js');

// Import logger utility for spying on logging behavior
// The middleware uses logWarn to record 404 events for observability
const { logWarn } = require('../../../utils/logger.js');

// Import constants for response message validation
// NOT_FOUND_MESSAGE provides the standardized error message returned by the middleware
const { NOT_FOUND_MESSAGE } = require('../../../utils/constants.js');

// Import response formatter for validation of response structure
// formatErrorResponse is used by the middleware to generate consistent error responses
const { formatErrorResponse } = require('../../../utils/responseFormatter.js');

/**
 * Main test suite for the notFoundHandler middleware
 * 
 * This test suite provides comprehensive coverage of the notFoundHandler middleware
 * functionality, validating all critical behaviors including response generation,
 * logging integration, middleware flow control, and environment-specific behavior.
 * 
 * Test Organization:
 * - Setup and teardown for clean test environment
 * - Core functionality tests (404 response, logging, middleware flow)
 * - Response format validation tests
 * - Environment-specific behavior tests (development vs production)
 * - Security validation tests (information disclosure prevention)
 * 
 * Testing Strategy:
 * - Use real middleware function with mocked dependencies
 * - Validate both behavior and side effects (logging, response structure)
 * - Test different request scenarios and environment configurations
 * - Ensure security best practices are maintained
 */
describe('notFoundHandler', () => {
    // Store original NODE_ENV for restoration after environment-specific tests
    let originalNodeEnv;
    
    /**
     * Test setup executed before each individual test case
     * 
     * Establishes a clean, predictable test environment by:
     * - Storing original environment variables for restoration
     * - Clearing all Jest mocks to prevent test interference
     * - Resetting module state for consistent test execution
     * 
     * This ensures each test runs in isolation without side effects
     * from previous test executions, supporting reproducible test results.
     */
    beforeEach(() => {
        // Store original NODE_ENV for restoration in environment-specific tests
        originalNodeEnv = process.env.NODE_ENV;
        
        // Clear all Jest mocks to prevent interference between tests
        // This ensures spies and mocks start with clean state for each test
        jest.clearAllMocks();
        
        // Reset module registry to ensure fresh module loading if needed
        // This prevents cached module state from affecting test execution
        jest.resetModules();
    });
    
    /**
     * Test cleanup executed after each individual test case
     * 
     * Restores the test environment to its original state by:
     * - Restoring original environment variables
     * - Clearing any remaining mock state
     * - Ensuring no test artifacts remain for subsequent tests
     * 
     * This maintains test isolation and prevents environment modifications
     * from affecting other tests in the suite.
     */
    afterEach(() => {
        // Restore original NODE_ENV to prevent environment pollution
        process.env.NODE_ENV = originalNodeEnv;
        
        // Final cleanup of all mocks to ensure clean state
        jest.restoreAllMocks();
    });
    
    /**
     * Test: Should return 404 Not Found for unmatched route
     * 
     * Validates that the notFoundHandler middleware responds with the correct
     * HTTP 404 status code and standardized error message when handling
     * requests to unmatched routes. This is the core functionality test
     * ensuring the middleware fulfills its primary responsibility.
     * 
     * Test Scenario:
     * - Create mock request to non-existent endpoint
     * - Create mock response object for capturing response data
     * - Execute middleware and validate response properties
     * - Ensure proper HTTP compliance and consistent error structure
     */
    it('should return 404 Not Found for unmatched route', () => {
        // Arrange: Set up test scenario with mock Express.js objects
        // Create mock request simulating GET request to non-existent endpoint
        const mockReq = createMockRequest({
            method: 'GET',
            url: '/nonexistent-endpoint'
        });
        
        // Create mock response object with spies for capturing response behavior
        const mockRes = createMockResponse();
        
        // Create mock next function to verify middleware flow control
        const mockNext = simulateNext();
        
        // Act: Execute the notFoundHandler middleware with mock objects
        notFoundHandler(mockReq, mockRes, mockNext);
        
        // Assert: Validate response status and structure using centralized utility
        assertResponse(mockRes, HTTP_NOT_FOUND, {
            error: true,
            message: NOT_FOUND_MESSAGE
        });
        
        // Validate that next() was not called (middleware terminates request cycle)
        expect(mockNext).not.toHaveBeenCalled();
        
        // Validate that response was properly formatted as JSON
        expect(mockRes.json).toHaveBeenCalledWith({
            error: true,
            message: NOT_FOUND_MESSAGE
        });
        
        // Validate that response status was set correctly
        expect(mockRes.status).toHaveBeenCalledWith(HTTP_NOT_FOUND);
    });
    
    /**
     * Test: Should log a warning with method and path
     * 
     * Validates that the notFoundHandler middleware properly logs 404 events
     * using the centralized logging utility. This test ensures observability
     * requirements are met by verifying that unmatched route events are
     * captured with appropriate log level and contextual information.
     * 
     * Test Scenario:
     * - Spy on the logWarn function to capture logging behavior
     * - Create mock request with specific method and path
     * - Execute middleware and validate logging was performed
     * - Verify log message includes relevant request context
     */
    it('should log a warning with method and path', () => {
        // Arrange: Set up spy on logging function to capture logging behavior
        const logWarnSpy = jest.spyOn(require('../../../utils/logger.js'), 'logWarn');
        
        // Create mock request with specific method and path for log validation
        const mockReq = createMockRequest({
            method: 'POST',
            url: '/undefined-api-endpoint'
        });
        
        // Create mock response and next function
        const mockRes = createMockResponse();
        const mockNext = simulateNext();
        
        // Act: Execute the notFoundHandler middleware
        notFoundHandler(mockReq, mockRes, mockNext);
        
        // Assert: Validate that warning was logged with appropriate message and metadata
        expect(logWarnSpy).toHaveBeenCalledTimes(1);
        
        // Validate log message contains descriptive text about 404 event
        const logCall = logWarnSpy.mock.calls[0];
        expect(logCall[0]).toContain('404 Not Found');
        expect(logCall[0]).toContain('undefined endpoint');
        
        // Validate log metadata includes request details for debugging
        expect(logCall[1]).toEqual(expect.objectContaining({
            method: 'POST',
            path: '/undefined-api-endpoint',
            timestamp: expect.any(String),
            userAgent: expect.any(String),
            remoteAddress: expect.any(String)
        }));
        
        // Cleanup: Restore original logging function
        logWarnSpy.mockRestore();
    });
    
    /**
     * Test: Should not call next()
     * 
     * Validates that the notFoundHandler middleware does not call the next()
     * function, ensuring the middleware properly terminates the request-response
     * cycle. This is critical for proper middleware flow control and prevents
     * the request from continuing to subsequent middleware after a 404 response.
     * 
     * Test Scenario:
     * - Create complete mock request/response/next setup
     * - Execute middleware and verify next() is never called
     * - Ensure response termination occurs within the middleware
     */
    it('should not call next()', () => {
        // Arrange: Set up mock objects for middleware execution
        const mockReq = createMockRequest({
            method: 'DELETE',
            url: '/invalid-resource'
        });
        const mockRes = createMockResponse();
        const mockNext = simulateNext();
        
        // Act: Execute the notFoundHandler middleware
        notFoundHandler(mockReq, mockRes, mockNext);
        
        // Assert: Verify that next() was never called
        expect(mockNext).not.toHaveBeenCalled();
        
        // Verify that response was sent (indicating proper termination)
        expect(mockRes.json).toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalled();
        
        // Verify response completion
        expect(mockRes.finished).toBe(true);
    });
    
    /**
     * Test: Should return standardized error response format
     * 
     * Validates that the notFoundHandler middleware returns error responses
     * that conform to the application's standardized error response structure.
     * This ensures API consistency and proper client-side error handling
     * across all endpoints and error scenarios.
     * 
     * Test Scenario:
     * - Execute middleware with standard request
     * - Validate response structure matches application error format
     * - Ensure required fields are present with correct types
     * - Verify response format consistency with other error handlers
     */
    it('should return standardized error response format', () => {
        // Arrange: Set up mock objects for response format validation
        const mockReq = createMockRequest({
            method: 'GET',
            url: '/test-endpoint'
        });
        const mockRes = createMockResponse();
        const mockNext = simulateNext();
        
        // Act: Execute the notFoundHandler middleware
        notFoundHandler(mockReq, mockRes, mockNext);
        
        // Assert: Validate response structure matches standardized error format
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: expect.any(Boolean),
                message: expect.any(String)
            })
        );
        
        // Validate specific field values
        const responseBody = mockRes.json.mock.calls[0][0];
        expect(responseBody.error).toBe(true);
        expect(responseBody.message).toBe(NOT_FOUND_MESSAGE);
        
        // Validate Content-Type header for JSON response
        expect(mockRes.set).toHaveBeenCalledWith('Content-Type', 'application/json');
        
        // Validate HTTP status code consistency
        expect(mockRes.status).toHaveBeenCalledWith(HTTP_NOT_FOUND);
    });
    
    /**
     * Test: Should not leak internal details in production
     * 
     * Validates that the notFoundHandler middleware maintains security best
     * practices by preventing information disclosure in production environments.
     * This test ensures that internal system details, stack traces, or debugging
     * information are not exposed to clients in production deployments.
     * 
     * Test Scenario:
     * - Set NODE_ENV to 'production'
     * - Execute middleware and capture response
     * - Verify response contains only safe, generic information
     * - Ensure no sensitive details are included in response body
     */
    it('should not leak internal details in production', () => {
        // Arrange: Set production environment to test security behavior
        process.env.NODE_ENV = 'production';
        
        // Create mock request with various properties that should not be exposed
        const mockReq = createMockRequest({
            method: 'GET',
            url: '/secret-internal-endpoint',
            headers: {
                'user-agent': 'Test Browser/1.0',
                'authorization': 'Bearer sensitive-token'
            }
        });
        const mockRes = createMockResponse();
        const mockNext = simulateNext();
        
        // Act: Execute the notFoundHandler middleware in production mode
        notFoundHandler(mockReq, mockRes, mockNext);
        
        // Assert: Validate response contains only safe, generic information
        const responseBody = mockRes.json.mock.calls[0][0];
        
        // Verify standard error structure is present
        expect(responseBody).toEqual({
            error: true,
            message: NOT_FOUND_MESSAGE
        });
        
        // Verify no internal details are included
        expect(responseBody).not.toHaveProperty('details');
        expect(responseBody).not.toHaveProperty('stack');
        expect(responseBody).not.toHaveProperty('headers');
        expect(responseBody).not.toHaveProperty('request');
        expect(responseBody).not.toHaveProperty('path');
        expect(responseBody).not.toHaveProperty('method');
        
        // Verify response doesn't contain sensitive information
        const responseString = JSON.stringify(responseBody);
        expect(responseString).not.toContain('sensitive-token');
        expect(responseString).not.toContain('secret-internal');
        expect(responseString).not.toContain('authorization');
    });
    
    /**
     * Test: Should include request details in development
     * 
     * Validates that the notFoundHandler middleware includes helpful debugging
     * information in development environments while maintaining security in
     * production. This test ensures developers have access to detailed error
     * context for debugging purposes during development and testing.
     * 
     * Test Scenario:
     * - Set NODE_ENV to 'development'
     * - Execute middleware and capture response
     * - Verify response includes detailed request information
     * - Ensure debugging details are present for development assistance
     */
    it('should include request details in development', () => {
        // Arrange: Set development environment to enable detailed error responses
        process.env.NODE_ENV = 'development';
        
        // Create mock request with specific details that should be included in development
        const mockReq = createMockRequest({
            method: 'PUT',
            url: '/debug-endpoint?param=value',
            headers: {
                'user-agent': 'Development Client/1.0',
                'content-type': 'application/json'
            }
        });
        const mockRes = createMockResponse();
        const mockNext = simulateNext();
        
        // Act: Execute the notFoundHandler middleware in development mode
        notFoundHandler(mockReq, mockRes, mockNext);
        
        // Assert: Validate response includes development debugging details
        const responseBody = mockRes.json.mock.calls[0][0];
        
        // Verify standard error structure is present
        expect(responseBody.error).toBe(true);
        expect(responseBody.message).toBe(NOT_FOUND_MESSAGE);
        
        // Verify development details are included
        expect(responseBody).toHaveProperty('details');
        expect(responseBody.details).toEqual(expect.objectContaining({
            method: 'PUT',
            path: '/debug-endpoint?param=value',
            requestedAt: expect.any(String)
        }));
        
        // Verify timestamp format is valid ISO 8601
        expect(responseBody.details.requestedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        
        // Verify request details match original request
        expect(responseBody.details.method).toBe('PUT');
        expect(responseBody.details.path).toBe('/debug-endpoint?param=value');
    });
    
    /**
     * Test: Should handle various HTTP methods consistently
     * 
     * Validates that the notFoundHandler middleware handles all HTTP methods
     * consistently, ensuring uniform behavior regardless of the request method
     * used to access unmatched routes. This test covers comprehensive HTTP
     * method support for complete middleware validation.
     * 
     * Test Scenario:
     * - Test multiple HTTP methods (GET, POST, PUT, DELETE, PATCH)
     * - Verify consistent response format for all methods
     * - Ensure logging behavior is uniform across methods
     * - Validate no method-specific handling differences
     */
    it('should handle various HTTP methods consistently', () => {
        // Arrange: Define HTTP methods to test for consistent behavior
        const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
        
        // Act & Assert: Test each HTTP method for consistent behavior
        httpMethods.forEach(method => {
            // Set up fresh mocks for each method test
            const mockReq = createMockRequest({
                method: method,
                url: '/unmatched-route-for-' + method.toLowerCase()
            });
            const mockRes = createMockResponse();
            const mockNext = simulateNext();
            
            // Clear previous mocks to ensure clean test state
            jest.clearAllMocks();
            
            // Execute middleware
            notFoundHandler(mockReq, mockRes, mockNext);
            
            // Validate consistent response for all methods
            assertResponse(mockRes, HTTP_NOT_FOUND, {
                error: true,
                message: NOT_FOUND_MESSAGE
            });
            
            // Verify next() is not called regardless of method
            expect(mockNext).not.toHaveBeenCalled();
            
            // Verify response structure is consistent
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: true,
                message: NOT_FOUND_MESSAGE
            });
        });
    });
    
    /**
     * Test: Should handle requests with query parameters and fragments
     * 
     * Validates that the notFoundHandler middleware properly processes and logs
     * requests with complex URLs including query parameters, fragments, and
     * encoded characters. This ensures comprehensive URL handling and proper
     * logging of complete request information for debugging purposes.
     * 
     * Test Scenario:
     * - Create requests with complex URLs (query params, encoded chars)
     * - Execute middleware and validate URL handling
     * - Verify logging includes complete URL information
     * - Ensure no URL parsing issues affect middleware operation
     */
    it('should handle requests with query parameters and fragments', () => {
        // Arrange: Set up spy on logging to capture URL details
        const logWarnSpy = jest.spyOn(require('../../../utils/logger.js'), 'logWarn');
        
        // Create mock request with complex URL structure
        const complexUrl = '/api/users/123?sort=name&filter=active&page=2#section';
        const mockReq = createMockRequest({
            method: 'GET',
            url: complexUrl
        });
        const mockRes = createMockResponse();
        const mockNext = simulateNext();
        
        // Act: Execute the notFoundHandler middleware
        notFoundHandler(mockReq, mockRes, mockNext);
        
        // Assert: Validate standard 404 response
        assertResponse(mockRes, HTTP_NOT_FOUND, {
            error: true,
            message: NOT_FOUND_MESSAGE
        });
        
        // Validate logging includes complete URL information
        expect(logWarnSpy).toHaveBeenCalledTimes(1);
        const logCall = logWarnSpy.mock.calls[0];
        
        // Verify log metadata includes the complete URL
        expect(logCall[1]).toEqual(expect.objectContaining({
            method: 'GET',
            path: complexUrl,
            timestamp: expect.any(String)
        }));
        
        // Cleanup: Restore logging spy
        logWarnSpy.mockRestore();
    });
    
    /**
     * Test: Should maintain response headers consistency
     * 
     * Validates that the notFoundHandler middleware sets appropriate HTTP
     * headers for error responses, ensuring proper Content-Type and other
     * standard headers are included. This test verifies HTTP compliance
     * and proper response formatting for client consumption.
     * 
     * Test Scenario:
     * - Execute middleware and capture response headers
     * - Verify Content-Type header is set to application/json
     * - Ensure no unexpected headers are added
     * - Validate header values match expected format
     */
    it('should maintain response headers consistency', () => {
        // Arrange: Set up mock objects for header validation
        const mockReq = createMockRequest({
            method: 'GET',
            url: '/header-test-endpoint'
        });
        const mockRes = createMockResponse();
        const mockNext = simulateNext();
        
        // Act: Execute the notFoundHandler middleware
        notFoundHandler(mockReq, mockRes, mockNext);
        
        // Assert: Validate response headers are set correctly
        expect(mockRes.set).toHaveBeenCalledWith('Content-Type', 'application/json');
        
        // Verify status code header behavior
        expect(mockRes.status).toHaveBeenCalledWith(HTTP_NOT_FOUND);
        
        // Verify response is properly formatted as JSON
        expect(mockRes.json).toHaveBeenCalledWith({
            error: true,
            message: NOT_FOUND_MESSAGE
        });
        
        // Verify no unexpected headers are set
        const setHeaderCalls = mockRes.set.mock.calls;
        expect(setHeaderCalls).toHaveLength(1);
        expect(setHeaderCalls[0]).toEqual(['Content-Type', 'application/json']);
    });
    
    /**
     * Test: Should handle edge cases and malformed requests
     * 
     * Validates that the notFoundHandler middleware gracefully handles edge
     * cases such as requests with undefined properties, malformed URLs, or
     * missing request data. This ensures robust error handling and prevents
     * middleware crashes under unusual request conditions.
     * 
     * Test Scenario:
     * - Create requests with edge case properties (undefined URL, null method)
     * - Execute middleware and verify it handles cases gracefully
     * - Ensure no errors are thrown during processing
     * - Validate consistent response format even with malformed input
     */
    it('should handle edge cases and malformed requests', () => {
        // Test case 1: Request with undefined URL
        const mockReqNoUrl = createMockRequest({
            method: 'GET',
            url: undefined
        });
        const mockResNoUrl = createMockResponse();
        const mockNextNoUrl = simulateNext();
        
        // Should not throw error with undefined URL
        expect(() => {
            notFoundHandler(mockReqNoUrl, mockResNoUrl, mockNextNoUrl);
        }).not.toThrow();
        
        // Should still return 404 response
        expect(mockResNoUrl.status).toHaveBeenCalledWith(HTTP_NOT_FOUND);
        
        // Test case 2: Request with null method
        const mockReqNoMethod = createMockRequest({
            method: null,
            url: '/test-endpoint'
        });
        const mockResNoMethod = createMockResponse();
        const mockNextNoMethod = simulateNext();
        
        // Should not throw error with null method
        expect(() => {
            notFoundHandler(mockReqNoMethod, mockResNoMethod, mockNextNoMethod);
        }).not.toThrow();
        
        // Should still return 404 response
        expect(mockResNoMethod.status).toHaveBeenCalledWith(HTTP_NOT_FOUND);
        
        // Test case 3: Request with empty string URL
        const mockReqEmptyUrl = createMockRequest({
            method: 'GET',
            url: ''
        });
        const mockResEmptyUrl = createMockResponse();
        const mockNextEmptyUrl = simulateNext();
        
        // Should handle empty URL gracefully
        expect(() => {
            notFoundHandler(mockReqEmptyUrl, mockResEmptyUrl, mockNextEmptyUrl);
        }).not.toThrow();
        
        // Should return consistent response format
        assertResponse(mockResEmptyUrl, HTTP_NOT_FOUND, {
            error: true,
            message: NOT_FOUND_MESSAGE
        });
    });
});