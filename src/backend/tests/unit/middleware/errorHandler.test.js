/**
 * Unit Test Suite for Express Error Handler Middleware
 * 
 * This comprehensive test suite validates the errorHandler middleware implementation,
 * ensuring robust error handling, proper logging, standardized response formatting,
 * and environment-aware behavior. The tests leverage Jest as the testing framework
 * and utilize shared test utilities for consistent mocking and assertion patterns.
 * 
 * Test Coverage:
 * - Error handling with status and message properties
 * - Error handling without status/message (default fallbacks)
 * - Environment-specific behavior (development vs production)
 * - Logging functionality and error context capture
 * - Response formatting and standardization
 * - Edge cases and error object variations
 * - Integration with Express middleware patterns
 * 
 * Educational Value:
 * - Demonstrates best practices for testing Express middleware
 * - Shows comprehensive mocking strategies for dependencies
 * - Illustrates environment-aware testing patterns
 * - Provides examples of error simulation and validation
 * - Models production-ready testing approaches
 * 
 * @fileoverview Unit tests for Express errorHandler middleware
 * @author Node.js Tutorial Project
 * @version 1.0.0
 * @requires jest ^29.0.0
 */

// Import the middleware under test
const { errorHandler } = require('../../../middleware/errorHandler.js');

// Import utilities that need to be mocked/spied
const { logError } = require('../../../utils/logger.js');
const { formatErrorResponse } = require('../../../utils/responseFormatter.js');
const { HTTP_INTERNAL_SERVER_ERROR } = require('../../../utils/httpStatusCodes.js');
const { GENERIC_ERROR_MESSAGE } = require('../../..//constants.js');

// Import test utilities for mocking Express objects and error simulation
const {
    createMockRequest,
    createMockResponse,
    simulateNext,
    simulateError,
    assertResponse
} = require('../../helpers/testUtils.js');

// Mock external dependencies to isolate errorHandler testing
// This ensures tests focus on errorHandler logic without side effects
jest.mock('../../../utils/logger.js', () => ({
    logError: jest.fn()
}));

jest.mock('../../../utils/responseFormatter.js', () => ({
    formatErrorResponse: jest.fn()
}));

/**
 * Main test suite for errorHandler middleware
 * 
 * Groups all errorHandler tests under a descriptive test suite with proper
 * setup, teardown, and organized test cases for comprehensive coverage.
 */
describe('errorHandler middleware', () => {
    // Test environment variables for controlling test behavior
    let originalNodeEnv;
    
    /**
     * Before each test setup
     * 
     * Resets all mocks and spies to ensure clean state between tests.
     * This prevents test pollution and ensures each test runs independently.
     */
    beforeEach(() => {
        // Clear all mock function calls and return values
        jest.clearAllMocks();
        
        // Store original NODE_ENV to restore after tests
        originalNodeEnv = process.env.NODE_ENV;
    });
    
    /**
     * After each test cleanup
     * 
     * Restores original environment variables to prevent test side effects.
     */
    afterEach(() => {
        // Restore original NODE_ENV value
        process.env.NODE_ENV = originalNodeEnv;
    });
    
    /**
     * Test: Error handling with status and message properties
     * 
     * Validates that errorHandler correctly processes errors that include
     * both status code and message properties, ensuring proper logging
     * and response formatting.
     */
    describe('Error handling with status and message', () => {
        it('should handle error with status and message correctly', () => {
            // Arrange: Create mock objects and error
            const mockReq = createMockRequest({
                method: 'GET',
                url: '/hello',
                headers: { 'user-agent': 'Test Agent' }
            });
            const mockRes = createMockResponse();
            const mockNext = simulateNext();
            
            // Create error with status and message
            const testError = simulateError('Resource not found', 404, {
                name: 'NotFoundError'
            });
            
            // Act: Call errorHandler with the error
            errorHandler(testError, mockReq, mockRes, mockNext);
            
            // Assert: Verify logError was called with correct parameters
            expect(logError).toHaveBeenCalledTimes(1);
            expect(logError).toHaveBeenCalledWith(
                'Request processing failed - Error handled by errorHandler middleware',
                expect.objectContaining({
                    errorMessage: 'Resource not found',
                    errorName: 'NotFoundError',
                    statusCode: 404
                })
            );
            
            // Assert: Verify formatErrorResponse was called with correct parameters
            expect(formatErrorResponse).toHaveBeenCalledTimes(1);
            expect(formatErrorResponse).toHaveBeenCalledWith(
                mockRes,
                404,
                'Resource not found',
                expect.any(Object) // Error details in development
            );
            
            // Assert: Verify next() was not called (error was handled)
            expect(mockNext).not.toHaveBeenCalled();
        });
        
        it('should handle error with statusCode property instead of status', () => {
            // Arrange: Create mock objects and error with statusCode
            const mockReq = createMockRequest();
            const mockRes = createMockResponse();
            const mockNext = simulateNext();
            
            // Create error with statusCode instead of status
            const testError = simulateError('Bad request', null, {
                statusCode: 400,
                name: 'ValidationError'
            });
            
            // Act: Call errorHandler with the error
            errorHandler(testError, mockReq, mockRes, mockNext);
            
            // Assert: Verify correct status code is used
            expect(formatErrorResponse).toHaveBeenCalledWith(
                mockRes,
                400,
                'Bad request',
                expect.any(Object)
            );
        });
    });
    
    /**
     * Test: Error handling without status or message properties
     * 
     * Validates that errorHandler provides appropriate defaults when
     * error objects lack status or message properties.
     */
    describe('Error handling without status/message', () => {
        it('should use default status and message for errors without them', () => {
            // Arrange: Create mock objects and basic error
            const mockReq = createMockRequest();
            const mockRes = createMockResponse();
            const mockNext = simulateNext();
            
            // Create error without status or custom message
            const testError = new Error(); // No message, no status
            
            // Act: Call errorHandler with the error
            errorHandler(testError, mockReq, mockRes, mockNext);
            
            // Assert: Verify default values are used
            expect(formatErrorResponse).toHaveBeenCalledWith(
                mockRes,
                HTTP_INTERNAL_SERVER_ERROR,
                GENERIC_ERROR_MESSAGE,
                expect.any(Object)
            );
            
            // Assert: Verify logging with default message
            expect(logError).toHaveBeenCalledWith(
                'Request processing failed - Error handled by errorHandler middleware',
                expect.objectContaining({
                    errorMessage: 'Unknown error',
                    statusCode: HTTP_INTERNAL_SERVER_ERROR
                })
            );
        });
        
        it('should handle error with message but no status', () => {
            // Arrange: Create error with message only
            const mockReq = createMockRequest();
            const mockRes = createMockResponse();
            const mockNext = simulateNext();
            
            const testError = simulateError('Something went wrong');
            
            // Act: Call errorHandler
            errorHandler(testError, mockReq, mockRes, mockNext);
            
            // Assert: Verify default status with custom message
            expect(formatErrorResponse).toHaveBeenCalledWith(
                mockRes,
                HTTP_INTERNAL_SERVER_ERROR,
                'Something went wrong',
                expect.any(Object)
            );
        });
        
        it('should handle error with status but no message', () => {
            // Arrange: Create error with status only
            const mockReq = createMockRequest();
            const mockRes = createMockResponse();
            const mockNext = simulateNext();
            
            const testError = simulateError('', 403); // Empty message, custom status
            
            // Act: Call errorHandler
            errorHandler(testError, mockReq, mockRes, mockNext);
            
            // Assert: Verify custom status with generic message
            expect(formatErrorResponse).toHaveBeenCalledWith(
                mockRes,
                403,
                GENERIC_ERROR_MESSAGE,
                expect.any(Object)
            );
        });
    });
    
    /**
     * Test: Environment-specific behavior
     * 
     * Validates that errorHandler behaves differently in production
     * vs development environments, particularly regarding error detail exposure.
     */
    describe('Environment-specific behavior', () => {
        it('should include stack trace and request context in development', () => {
            // Arrange: Set development environment
            process.env.NODE_ENV = 'development';
            
            const mockReq = createMockRequest({
                method: 'POST',
                url: '/hello?test=1',
                headers: { 'user-agent': 'Development Browser' },
                params: { id: '123' },
                query: { test: '1' }
            });
            const mockRes = createMockResponse();
            const mockNext = simulateNext();
            
            const testError = simulateError('Development error', 500);
            
            // Act: Call errorHandler
            errorHandler(testError, mockReq, mockRes, mockNext);
            
            // Assert: Verify development details are included
            expect(logError).toHaveBeenCalledWith(
                'Request processing failed - Error handled by errorHandler middleware',
                expect.objectContaining({
                    errorMessage: 'Development error',
                    request: expect.objectContaining({
                        method: 'POST',
                        url: '/hello?test=1',
                        params: { id: '123' },
                        query: { test: '1' },
                        userAgent: 'Development Browser'
                    }),
                    stack: expect.stringContaining('Error: Development error')
                })
            );
            
            // Assert: Verify error details are passed to formatter
            expect(formatErrorResponse).toHaveBeenCalledWith(
                mockRes,
                500,
                'Development error',
                expect.objectContaining({
                    stack: expect.any(String),
                    originalMessage: 'Development error',
                    request: expect.any(Object)
                })
            );
        });
        
        it('should omit stack trace and use generic message in production', () => {
            // Arrange: Set production environment
            process.env.NODE_ENV = 'production';
            
            const mockReq = createMockRequest({
                method: 'GET',
                url: '/hello'
            });
            const mockRes = createMockResponse();
            const mockNext = simulateNext();
            
            const testError = simulateError('Internal database error', 500);
            
            // Act: Call errorHandler
            errorHandler(testError, mockReq, mockRes, mockNext);
            
            // Assert: Verify production security - no request context in logs
            expect(logError).toHaveBeenCalledWith(
                'Request processing failed - Error handled by errorHandler middleware',
                expect.objectContaining({
                    errorMessage: 'Internal database error',
                    statusCode: 500
                })
            );
            
            // Assert: Verify no stack trace or request context in logs
            const logCall = logError.mock.calls[0][1];
            expect(logCall).not.toHaveProperty('request');
            expect(logCall).not.toHaveProperty('stack');
            
            // Assert: Verify generic message and no details for client
            expect(formatErrorResponse).toHaveBeenCalledWith(
                mockRes,
                500,
                GENERIC_ERROR_MESSAGE,
                null // No details in production
            );
        });
        
        it('should include details in test environment', () => {
            // Arrange: Set test environment
            process.env.NODE_ENV = 'test';
            
            const mockReq = createMockRequest();
            const mockRes = createMockResponse();
            const mockNext = simulateNext();
            
            const testError = simulateError('Test error', 422);
            
            // Act: Call errorHandler
            errorHandler(testError, mockReq, mockRes, mockNext);
            
            // Assert: Verify test environment includes details like development
            expect(formatErrorResponse).toHaveBeenCalledWith(
                mockRes,
                422,
                'Test error',
                expect.objectContaining({
                    stack: expect.any(String),
                    originalMessage: 'Test error'
                })
            );
        });
    });
    
    /**
     * Test: Custom error properties and edge cases
     * 
     * Validates that errorHandler correctly handles errors with
     * custom properties and various edge case scenarios.
     */
    describe('Custom error properties and edge cases', () => {
        it('should handle errors with custom properties', () => {
            // Arrange: Create error with custom properties
            const mockReq = createMockRequest();
            const mockRes = createMockResponse();
            const mockNext = simulateNext();
            
            const testError = simulateError('Custom error', 422, {
                code: 'VALIDATION_FAILED',
                errno: -2,
                syscall: 'connect',
                field: 'email'
            });
            
            // Act: Call errorHandler
            errorHandler(testError, mockReq, mockRes, mockNext);
            
            // Assert: Verify custom properties are logged
            expect(logError).toHaveBeenCalledWith(
                'Request processing failed - Error handled by errorHandler middleware',
                expect.objectContaining({
                    errorCode: 'VALIDATION_FAILED',
                    errno: -2,
                    syscall: 'connect'
                })
            );
        });
        
        it('should handle Error objects with only custom name', () => {
            // Arrange: Create error with custom name
            const mockReq = createMockRequest();
            const mockRes = createMockResponse();
            const mockNext = simulateNext();
            
            const testError = new Error('Custom named error');
            testError.name = 'CustomError';
            
            // Act: Call errorHandler
            errorHandler(testError, mockReq, mockRes, mockNext);
            
            // Assert: Verify custom name is captured
            expect(logError).toHaveBeenCalledWith(
                'Request processing failed - Error handled by errorHandler middleware',
                expect.objectContaining({
                    errorName: 'CustomError',
                    errorMessage: 'Custom named error'
                })
            );
        });
        
        it('should handle null or undefined error objects gracefully', () => {
            // Arrange: Test with null error (edge case)
            const mockReq = createMockRequest();
            const mockRes = createMockResponse();
            const mockNext = simulateNext();
            
            // Create minimal error-like object
            const nullishError = {
                message: null,
                name: undefined
            };
            
            // Act: Call errorHandler
            errorHandler(nullishError, mockReq, mockRes, mockNext);
            
            // Assert: Verify graceful handling of null/undefined properties
            expect(logError).toHaveBeenCalledWith(
                'Request processing failed - Error handled by errorHandler middleware',
                expect.objectContaining({
                    errorMessage: 'Unknown error',
                    errorName: 'Error'
                })
            );
        });
    });
    
    /**
     * Test: Request context capture
     * 
     * Validates that errorHandler correctly captures and logs
     * request context information for debugging purposes.
     */
    describe('Request context capture', () => {
        it('should capture comprehensive request context in development', () => {
            // Arrange: Set development environment with comprehensive request
            process.env.NODE_ENV = 'development';
            
            const mockReq = createMockRequest({
                method: 'PUT',
                url: '/users/123?include=profile&sort=name',
                headers: {
                    'user-agent': 'Mozilla/5.0 Test Browser',
                    'content-type': 'application/json'
                },
                params: { id: '123' },
                query: { include: 'profile', sort: 'name' }
            });
            
            // Mock connection for IP address
            mockReq.connection = { remoteAddress: '192.168.1.100' };
            
            const mockRes = createMockResponse();
            const mockNext = simulateNext();
            const testError = simulateError('Request context test', 400);
            
            // Act: Call errorHandler
            errorHandler(testError, mockReq, mockRes, mockNext);
            
            // Assert: Verify comprehensive request context capture
            expect(logError).toHaveBeenCalledWith(
                'Request processing failed - Error handled by errorHandler middleware',
                expect.objectContaining({
                    request: expect.objectContaining({
                        method: 'PUT',
                        url: '/users/123?include=profile&sort=name',
                        params: { id: '123' },
                        query: { include: 'profile', sort: 'name' },
                        ip: '192.168.1.100',
                        userAgent: 'Mozilla/5.0 Test Browser'
                    })
                })
            );
        });
        
        it('should handle missing request properties gracefully', () => {
            // Arrange: Create minimal request object
            process.env.NODE_ENV = 'development';
            
            const mockReq = createMockRequest();
            delete mockReq.connection; // Remove connection object
            delete mockReq.headers; // Remove headers
            
            const mockRes = createMockResponse();
            const mockNext = simulateNext();
            const testError = simulateError('Minimal request test');
            
            // Act: Call errorHandler
            errorHandler(testError, mockReq, mockRes, mockNext);
            
            // Assert: Verify graceful handling of missing properties
            expect(logError).toHaveBeenCalledWith(
                'Request processing failed - Error handled by errorHandler middleware',
                expect.objectContaining({
                    request: expect.objectContaining({
                        ip: 'unknown',
                        userAgent: 'unknown'
                    })
                })
            );
        });
    });
    
    /**
     * Test: Logging functionality
     * 
     * Validates that errorHandler correctly calls the logging utility
     * with appropriate parameters and context information.
     */
    describe('Logging functionality', () => {
        it('should log all error details for monitoring and debugging', () => {
            // Arrange: Create comprehensive error scenario
            const mockReq = createMockRequest({
                method: 'POST',
                url: '/api/data',
                headers: { 'user-agent': 'API Client' }
            });
            const mockRes = createMockResponse();
            const mockNext = simulateNext();
            
            const testError = simulateError('Database connection failed', 503, {
                name: 'DatabaseError',
                code: 'ECONNREFUSED'
            });
            
            // Act: Call errorHandler
            errorHandler(testError, mockReq, mockRes, mockNext);
            
            // Assert: Verify logError call structure
            expect(logError).toHaveBeenCalledTimes(1);
            expect(logError).toHaveBeenCalledWith(
                'Request processing failed - Error handled by errorHandler middleware',
                expect.objectContaining({
                    errorMessage: 'Database connection failed',
                    errorName: 'DatabaseError',
                    statusCode: 503,
                    errorCode: 'ECONNREFUSED'
                })
            );
        });
        
        it('should log different error types with appropriate categorization', () => {
            // Test logging different error scenarios
            const testCases = [
                {
                    error: simulateError('Unauthorized access', 401, { name: 'AuthError' }),
                    expectedLog: {
                        errorMessage: 'Unauthorized access',
                        errorName: 'AuthError',
                        statusCode: 401
                    }
                },
                {
                    error: simulateError('Rate limit exceeded', 429, { name: 'RateLimitError' }),
                    expectedLog: {
                        errorMessage: 'Rate limit exceeded',
                        errorName: 'RateLimitError',
                        statusCode: 429
                    }
                }
            ];
            
            testCases.forEach((testCase, index) => {
                // Arrange
                const mockReq = createMockRequest();
                const mockRes = createMockResponse();
                const mockNext = simulateNext();
                
                // Clear previous mock calls
                jest.clearAllMocks();
                
                // Act
                errorHandler(testCase.error, mockReq, mockRes, mockNext);
                
                // Assert
                expect(logError).toHaveBeenCalledWith(
                    'Request processing failed - Error handled by errorHandler middleware',
                    expect.objectContaining(testCase.expectedLog)
                );
            });
        });
    });
    
    /**
     * Test: Response formatting integration
     * 
     * Validates that errorHandler correctly integrates with the
     * formatErrorResponse utility for consistent response formatting.
     */
    describe('Response formatting integration', () => {
        it('should call formatErrorResponse with correct parameters for client errors', () => {
            // Arrange: Create client error scenario
            const mockReq = createMockRequest();
            const mockRes = createMockResponse();
            const mockNext = simulateNext();
            
            const clientError = simulateError('Invalid input data', 400);
            
            // Act: Call errorHandler
            errorHandler(clientError, mockReq, mockRes, mockNext);
            
            // Assert: Verify formatErrorResponse call
            expect(formatErrorResponse).toHaveBeenCalledTimes(1);
            expect(formatErrorResponse).toHaveBeenCalledWith(
                mockRes,
                400,
                'Invalid input data',
                expect.any(Object) // Error details object
            );
        });
        
        it('should call formatErrorResponse with correct parameters for server errors', () => {
            // Arrange: Create server error scenario
            const mockReq = createMockRequest();
            const mockRes = createMockResponse();
            const mockNext = simulateNext();
            
            const serverError = simulateError('Internal processing error', 500);
            
            // Act: Call errorHandler
            errorHandler(serverError, mockReq, mockRes, mockNext);
            
            // Assert: Verify formatErrorResponse call
            expect(formatErrorResponse).toHaveBeenCalledWith(
                mockRes,
                500,
                'Internal processing error',
                expect.any(Object)
            );
        });
        
        it('should ensure formatErrorResponse is called exactly once per error', () => {
            // Arrange: Multiple error handling calls
            const mockReq = createMockRequest();
            const mockRes = createMockResponse();
            const mockNext = simulateNext();
            
            const testError = simulateError('Single response test');
            
            // Act: Call errorHandler
            errorHandler(testError, mockReq, mockRes, mockNext);
            
            // Assert: Verify single formatErrorResponse call
            expect(formatErrorResponse).toHaveBeenCalledTimes(1);
            
            // Verify no additional calls after completion
            expect(formatErrorResponse.mock.calls.length).toBe(1);
        });
    });
    
    /**
     * Test: Next function handling
     * 
     * Validates that errorHandler correctly manages the Express next()
     * function and does not call it for handled errors.
     */
    describe('Next function handling', () => {
        it('should not call next() for handled errors', () => {
            // Arrange: Standard error handling scenario
            const mockReq = createMockRequest();
            const mockRes = createMockResponse();
            const mockNext = simulateNext();
            
            const handledError = simulateError('This error is handled', 400);
            
            // Act: Call errorHandler
            errorHandler(handledError, mockReq, mockRes, mockNext);
            
            // Assert: Verify next() is not called
            expect(mockNext).not.toHaveBeenCalled();
            expect(mockNext.mock.calls.length).toBe(0);
        });
        
        it('should terminate error handling chain properly', () => {
            // Arrange: Multiple error types
            const errorTypes = [
                simulateError('Client error', 400),
                simulateError('Server error', 500),
                simulateError('Custom error', 422)
            ];
            
            errorTypes.forEach((error) => {
                // Arrange for each error type
                const mockReq = createMockRequest();
                const mockRes = createMockResponse();
                const mockNext = simulateNext();
                
                // Clear mocks between iterations
                jest.clearAllMocks();
                
                // Act: Call errorHandler
                errorHandler(error, mockReq, mockRes, mockNext);
                
                // Assert: Verify proper termination
                expect(mockNext).not.toHaveBeenCalled();
                expect(formatErrorResponse).toHaveBeenCalledTimes(1);
                expect(logError).toHaveBeenCalledTimes(1);
            });
        });
    });
    
    /**
     * Test: Edge cases and error resilience
     * 
     * Validates that errorHandler handles unusual scenarios and
     * maintains resilience in edge cases.
     */
    describe('Edge cases and error resilience', () => {
        it('should handle errors with circular references gracefully', () => {
            // Arrange: Create error with circular reference
            const mockReq = createMockRequest();
            const mockRes = createMockResponse();
            const mockNext = simulateNext();
            
            const circularError = simulateError('Circular reference error', 500);
            circularError.circular = circularError; // Create circular reference
            
            // Act: Call errorHandler (should not throw)
            expect(() => {
                errorHandler(circularError, mockReq, mockRes, mockNext);
            }).not.toThrow();
            
            // Assert: Verify basic functionality still works
            expect(logError).toHaveBeenCalled();
            expect(formatErrorResponse).toHaveBeenCalled();
        });
        
        it('should handle very large error objects without performance issues', () => {
            // Arrange: Create error with large data
            const mockReq = createMockRequest();
            const mockRes = createMockResponse();
            const mockNext = simulateNext();
            
            const largeError = simulateError('Large error object', 500);
            largeError.largeData = new Array(1000).fill('x').join('');
            
            // Act: Call errorHandler and measure performance
            const startTime = Date.now();
            errorHandler(largeError, mockReq, mockRes, mockNext);
            const endTime = Date.now();
            
            // Assert: Verify reasonable performance (less than 100ms)
            expect(endTime - startTime).toBeLessThan(100);
            
            // Assert: Verify functionality
            expect(logError).toHaveBeenCalled();
            expect(formatErrorResponse).toHaveBeenCalled();
        });
        
        it('should maintain consistent behavior across multiple error handling calls', () => {
            // Arrange: Multiple sequential error handling calls
            const errors = [
                simulateError('First error', 400),
                simulateError('Second error', 404),
                simulateError('Third error', 500)
            ];
            
            const mockReq = createMockRequest();
            const mockNext = simulateNext();
            
            errors.forEach((error, index) => {
                // Create fresh response for each error
                const mockRes = createMockResponse();
                
                // Clear mocks to isolate each call
                jest.clearAllMocks();
                
                // Act: Call errorHandler
                errorHandler(error, mockReq, mockRes, mockNext);
                
                // Assert: Verify consistent behavior
                expect(logError).toHaveBeenCalledTimes(1);
                expect(formatErrorResponse).toHaveBeenCalledTimes(1);
                expect(mockNext).not.toHaveBeenCalled();
            });
        });
    });
    
    /**
     * Test: Full integration scenarios
     * 
     * Validates errorHandler behavior in realistic, full-stack scenarios
     * that closely mirror production usage patterns.
     */
    describe('Full integration scenarios', () => {
        it('should handle realistic HTTP error scenario end-to-end', () => {
            // Arrange: Realistic HTTP error scenario
            process.env.NODE_ENV = 'development';
            
            const mockReq = createMockRequest({
                method: 'POST',
                url: '/api/users',
                headers: {
                    'content-type': 'application/json',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'authorization': 'Bearer token123'
                },
                body: { name: 'John Doe', email: 'john@example.com' },
                params: {},
                query: { validate: 'true' }
            });
            
            const mockRes = createMockResponse();
            const mockNext = simulateNext();
            
            // Simulate realistic validation error
            const validationError = simulateError('Email format is invalid', 422, {
                name: 'ValidationError',
                field: 'email',
                code: 'INVALID_FORMAT'
            });
            
            // Act: Call errorHandler
            errorHandler(validationError, mockReq, mockRes, mockNext);
            
            // Assert: Verify comprehensive error handling
            expect(logError).toHaveBeenCalledWith(
                'Request processing failed - Error handled by errorHandler middleware',
                expect.objectContaining({
                    errorMessage: 'Email format is invalid',
                    errorName: 'ValidationError',
                    statusCode: 422,
                    errorCode: 'INVALID_FORMAT',
                    request: expect.objectContaining({
                        method: 'POST',
                        url: '/api/users',
                        query: { validate: 'true' },
                        userAgent: expect.stringContaining('Mozilla/5.0')
                    }),
                    stack: expect.any(String)
                })
            );
            
            expect(formatErrorResponse).toHaveBeenCalledWith(
                mockRes,
                422,
                'Email format is invalid',
                expect.objectContaining({
                    stack: expect.any(String),
                    originalMessage: 'Email format is invalid',
                    name: 'ValidationError',
                    statusCode: 422,
                    request: expect.any(Object),
                    timestamp: expect.any(String)
                })
            );
            
            expect(mockNext).not.toHaveBeenCalled();
        });
        
        it('should demonstrate production security behavior', () => {
            // Arrange: Production environment with sensitive error
            process.env.NODE_ENV = 'production';
            
            const mockReq = createMockRequest({
                method: 'GET',
                url: '/admin/sensitive-data',
                headers: { 'user-agent': 'Production Client' }
            });
            
            const mockRes = createMockResponse();
            const mockNext = simulateNext();
            
            // Simulate sensitive internal error
            const sensitiveError = simulateError(
                'Database connection failed: Connection refused on host db.internal.company.com:5432',
                500,
                {
                    name: 'DatabaseConnectionError',
                    host: 'db.internal.company.com',
                    port: 5432,
                    code: 'ECONNREFUSED'
                }
            );
            
            // Act: Call errorHandler
            errorHandler(sensitiveError, mockReq, mockRes, mockNext);
            
            // Assert: Verify production security measures
            expect(logError).toHaveBeenCalledWith(
                'Request processing failed - Error handled by errorHandler middleware',
                expect.objectContaining({
                    errorMessage: 'Database connection failed: Connection refused on host db.internal.company.com:5432',
                    statusCode: 500,
                    errorCode: 'ECONNREFUSED'
                })
            );
            
            // Assert: Verify client receives generic message
            expect(formatErrorResponse).toHaveBeenCalledWith(
                mockRes,
                500,
                GENERIC_ERROR_MESSAGE,
                null // No details in production
            );
            
            // Assert: Verify no sensitive details exposed to client
            const formatCall = formatErrorResponse.mock.calls[0];
            expect(formatCall[2]).toBe(GENERIC_ERROR_MESSAGE); // Generic message
            expect(formatCall[3]).toBeNull(); // No details
        });
    });
});