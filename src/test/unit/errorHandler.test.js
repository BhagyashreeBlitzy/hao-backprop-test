/**
 * Unit Test Suite for Express Error-Handling Middleware (errorHandler)
 * 
 * This comprehensive test suite verifies that the errorHandler middleware correctly:
 * - Distinguishes between operational (HttpError) and programmer/system errors
 * - Logs all errors using the Logger utility with proper context
 * - Sends standardized, secure error responses to clients
 * - Implements environment-aware response formatting (production vs development)
 * - Handles all error types according to technical specification requirements
 * - Complies with Express.js error middleware contract
 * - Prevents information leakage in production environments
 * 
 * Test Coverage:
 * - HttpError instances (operational errors) with proper status/message preservation
 * - Unknown errors wrapped as InternalServerError instances
 * - Environment-specific response formatting (stack traces, details)
 * - Headers already sent scenario handling
 * - Express middleware pipeline compliance (next() calls)
 * - Logger integration with structured error context
 * - Security considerations for production vs development environments
 * 
 * Dependencies:
 * - Jest ^29.7.0: Test framework and assertion library
 * - Supertest ^7.1.1: HTTP testing utility (used indirectly via testUtils)
 * - Application modules: errorHandler, Logger, error types, testUtils
 * 
 * @fileoverview Comprehensive unit tests for Express errorHandler middleware
 * @author Backend Development Team
 * @version 1.0.0
 * @since Node.js 18+
 */

// Internal imports - Application modules under test and utilities
const { errorHandler } = require('../../../backend/middleware/errorHandler.js'); // Express error-handling middleware under test
const { Logger } = require('../../../backend/utils/logger.js'); // Centralized logging utility - will be mocked
const { HttpError, InternalServerError } = require('../../../backend/utils/errorTypes.js'); // Custom error classes for testing scenarios
const testUtils = require('../../helpers/testUtils.js'); // Test utilities for DRY request simulation and assertions

// External imports - Testing framework and utilities
const jest = require('jest'); // ^29.7.0 - Test framework for mocking and assertions

/**
 * Global test environment setup
 * Captures original NODE_ENV for restoration after tests
 * Ensures test isolation and prevents environment pollution
 */
let originalEnv;

/**
 * Test Suite: errorHandler middleware
 * 
 * Comprehensive test coverage for the Express error-handling middleware
 * including all error types, environment configurations, and edge cases
 */
describe('errorHandler middleware', () => {
    /**
     * Test setup executed before each individual test
     * - Resets all Jest mocks to ensure test isolation
     * - Captures original NODE_ENV for restoration
     * - Mocks Logger.error to prevent actual logging during tests
     */
    beforeEach(() => {
        // Reset all mocks to ensure clean state for each test
        jest.clearAllMocks();
        
        // Capture original NODE_ENV for restoration
        originalEnv = process.env.NODE_ENV;
        
        // Mock Logger.error to prevent actual logging during tests
        // Allows verification of logging calls without polluting test output
        jest.spyOn(Logger, 'error').mockImplementation(() => {});
    });

    /**
     * Test cleanup executed after each individual test
     * - Restores original NODE_ENV to prevent test interference
     * - Ensures environment state is clean for subsequent tests
     */
    afterEach(() => {
        // Restore original NODE_ENV to prevent test interference
        process.env.NODE_ENV = originalEnv;
        
        // Restore all mocked functions to their original implementations
        jest.restoreAllMocks();
    });

    /**
     * Test helper function: Creates mock Express req, res, and next objects
     * 
     * Generates properly structured mock objects that simulate Express.js
     * request/response cycle for middleware testing. Includes all necessary
     * properties and methods required by the errorHandler middleware.
     * 
     * @returns {Object} Mock objects { req, res, next }
     * @returns {Object} returns.req - Mock Express request object
     * @returns {Object} returns.res - Mock Express response object with jest.fn() methods
     * @returns {Function} returns.next - Mock Express next function as jest.fn()
     */
    function mockReqResNext() {
        // Create empty req object simulating Express request
        const req = {
            method: 'GET',
            url: '/hello',
            get: jest.fn((header) => {
                // Mock User-Agent header for logging context
                if (header === 'User-Agent') {
                    return 'Jest-Test-Agent/1.0';
                }
                return undefined;
            })
        };
        
        // Create res object with jest.fn() for status and json methods
        // headersSent property can be toggled to simulate Express behavior
        const res = {
            status: jest.fn().mockReturnThis(), // Chainable method
            json: jest.fn().mockReturnThis(),   // Chainable method
            headersSent: false                  // Default: headers not sent
        };
        
        // Create next as jest.fn() for Express middleware pipeline
        const next = jest.fn();
        
        // Return the complete mock object set
        return { req, res, next };
    }

    /**
     * Test Group: HttpError (operational error) handling
     * 
     * Verifies that operational errors (HttpError instances) are handled correctly
     * with proper status code preservation, message handling, and logging
     */
    describe('Handles HttpError (operational error) correctly', () => {
        /**
         * Test: Production environment error handling
         * 
         * Verifies that HttpError instances are handled correctly in production:
         * - Error is logged with full context
         * - Response includes status and message
         * - Stack traces are omitted for security
         * - Sensitive details are filtered
         */
        it('should handle HttpError in production environment', () => {
            // Set NODE_ENV to 'production' for environment-aware behavior
            process.env.NODE_ENV = 'production';
            
            // Create HttpError instance with status, message, and details
            const testError = new HttpError(400, 'Bad Request', {
                field: 'email',           // Safe detail (should be included)
                reason: 'invalid format', // Safe detail (should be included)
                internalCode: 'AUTH_001', // Unsafe detail (should be filtered)
                dbConnection: 'secret'    // Unsafe detail (should be filtered)
            });
            
            // Create mock Express objects
            const { req, res, next } = mockReqResNext();
            
            // Invoke errorHandler with the HttpError
            errorHandler(testError, req, res, next);
            
            // Assert Logger.error was called with correct arguments
            expect(Logger.error).toHaveBeenCalledWith(
                'Express error handler caught error',
                expect.objectContaining({
                    status: 400,
                    message: 'Bad Request',
                    method: 'GET',
                    url: '/hello',
                    userAgent: 'Jest-Test-Agent/1.0',
                    details: expect.objectContaining({
                        field: 'email',
                        reason: 'invalid format'
                    }),
                    stack: expect.any(String)
                })
            );
            
            // Assert res.status was called with correct status code
            expect(res.status).toHaveBeenCalledWith(400);
            
            // Assert res.json was called with production-safe response
            expect(res.json).toHaveBeenCalledWith({
                status: 400,
                message: 'Bad Request',
                details: {
                    field: 'email',
                    reason: 'invalid format'
                }
                // No stack trace in production
            });
            
            // Assert next was not called (response was sent)
            expect(next).not.toHaveBeenCalled();
        });

        /**
         * Test: Development environment error handling
         * 
         * Verifies that HttpError instances include full debugging information
         * in development environments, including stack traces and all details
         */
        it('should include stack trace and details in development environment', () => {
            // Set NODE_ENV to 'development' for full error details
            process.env.NODE_ENV = 'development';
            
            // Create HttpError with comprehensive details
            const testError = new HttpError(422, 'Validation Failed', {
                field: 'password',
                reason: 'too short',
                minLength: 8,
                actualLength: 6
            });
            
            // Create mock Express objects
            const { req, res, next } = mockReqResNext();
            
            // Invoke errorHandler with the HttpError
            errorHandler(testError, req, res, next);
            
            // Assert Logger.error was called with complete context
            expect(Logger.error).toHaveBeenCalledWith(
                'Express error handler caught error',
                expect.objectContaining({
                    status: 422,
                    message: 'Validation Failed',
                    method: 'GET',
                    url: '/hello',
                    details: expect.objectContaining({
                        field: 'password',
                        reason: 'too short',
                        minLength: 8,
                        actualLength: 6
                    }),
                    stack: expect.any(String)
                })
            );
            
            // Assert res.status was called with correct status code
            expect(res.status).toHaveBeenCalledWith(422);
            
            // Assert res.json was called with full development response
            expect(res.json).toHaveBeenCalledWith({
                status: 422,
                message: 'Validation Failed',
                details: {
                    field: 'password',
                    reason: 'too short',
                    minLength: 8,
                    actualLength: 6
                },
                stack: expect.any(String) // Stack trace included in development
            });
            
            // Assert next was not called (response was sent)
            expect(next).not.toHaveBeenCalled();
        });

        /**
         * Test: HttpError without details
         * 
         * Verifies that HttpError instances without details are handled
         * correctly with minimal response structure
         */
        it('should handle HttpError without details', () => {
            // Set NODE_ENV to 'production' for baseline testing
            process.env.NODE_ENV = 'production';
            
            // Create HttpError without details
            const testError = new HttpError(404, 'Resource not found');
            
            // Create mock Express objects
            const { req, res, next } = mockReqResNext();
            
            // Invoke errorHandler with the HttpError
            errorHandler(testError, req, res, next);
            
            // Assert Logger.error was called with appropriate context
            expect(Logger.error).toHaveBeenCalledWith(
                'Express error handler caught error',
                expect.objectContaining({
                    status: 404,
                    message: 'Resource not found',
                    method: 'GET',
                    url: '/hello',
                    userAgent: 'Jest-Test-Agent/1.0',
                    stack: expect.any(String)
                })
            );
            
            // Assert res.status was called with correct status code
            expect(res.status).toHaveBeenCalledWith(404);
            
            // Assert res.json was called with minimal response structure
            expect(res.json).toHaveBeenCalledWith({
                status: 404,
                message: 'Resource not found'
                // No details property when not provided
            });
            
            // Assert next was not called (response was sent)
            expect(next).not.toHaveBeenCalled();
        });
    });

    /**
     * Test Group: Unknown (programmer/system) error handling
     * 
     * Verifies that non-HttpError instances are wrapped in InternalServerError
     * and handled with appropriate security and logging considerations
     */
    describe('Handles unknown (programmer/system) errors as InternalServerError', () => {
        /**
         * Test: Plain Error wrapping
         * 
         * Verifies that standard JavaScript Error instances are wrapped
         * in InternalServerError with proper context preservation
         */
        it('should wrap plain Error in InternalServerError', () => {
            // Set NODE_ENV to 'production' for secure error handling
            process.env.NODE_ENV = 'production';
            
            // Create a plain JavaScript Error
            const testError = new Error('Something broke');
            
            // Create mock Express objects
            const { req, res, next } = mockReqResNext();
            
            // Invoke errorHandler with the plain Error
            errorHandler(testError, req, res, next);
            
            // Assert Logger.error was called with wrapped error context
            expect(Logger.error).toHaveBeenCalledWith(
                'Express error handler caught error',
                expect.objectContaining({
                    status: 500,
                    message: 'Internal Server Error',
                    method: 'GET',
                    url: '/hello',
                    userAgent: 'Jest-Test-Agent/1.0',
                    details: expect.objectContaining({
                        originalName: 'Error',
                        originalMessage: 'Something broke',
                        originalStack: expect.any(String)
                    }),
                    stack: expect.any(String)
                })
            );
            
            // Assert res.status was called with 500 status code
            expect(res.status).toHaveBeenCalledWith(500);
            
            // Assert res.json was called with generic error response
            expect(res.json).toHaveBeenCalledWith({
                status: 500,
                message: 'Internal Server Error'
                // No sensitive details exposed in production
            });
            
            // Assert next was not called (response was sent)
            expect(next).not.toHaveBeenCalled();
        });

        /**
         * Test: System error with code property
         * 
         * Verifies that system errors with additional properties (like error codes)
         * are properly wrapped and logged while maintaining security
         */
        it('should handle system errors with error codes', () => {
            // Set NODE_ENV to 'development' for detailed error information
            process.env.NODE_ENV = 'development';
            
            // Create a system error with code property
            const testError = new Error('ECONNREFUSED: Connection refused');
            testError.code = 'ECONNREFUSED';
            testError.errno = -61;
            
            // Create mock Express objects
            const { req, res, next } = mockReqResNext();
            
            // Invoke errorHandler with the system error
            errorHandler(testError, req, res, next);
            
            // Assert Logger.error was called with system error context
            expect(Logger.error).toHaveBeenCalledWith(
                'Express error handler caught error',
                expect.objectContaining({
                    status: 500,
                    message: 'Internal Server Error',
                    method: 'GET',
                    url: '/hello',
                    details: expect.objectContaining({
                        originalName: 'Error',
                        originalMessage: 'ECONNREFUSED: Connection refused',
                        originalCode: 'ECONNREFUSED',
                        originalStack: expect.any(String)
                    }),
                    stack: expect.any(String)
                })
            );
            
            // Assert res.status was called with 500 status code
            expect(res.status).toHaveBeenCalledWith(500);
            
            // Assert res.json was called with development response including details
            expect(res.json).toHaveBeenCalledWith({
                status: 500,
                message: 'Internal Server Error',
                details: expect.objectContaining({
                    originalName: 'Error',
                    originalMessage: 'ECONNREFUSED: Connection refused',
                    originalCode: 'ECONNREFUSED',
                    originalStack: expect.any(String)
                }),
                stack: expect.any(String)
            });
            
            // Assert next was not called (response was sent)
            expect(next).not.toHaveBeenCalled();
        });

        /**
         * Test: Undefined/null error handling
         * 
         * Verifies that undefined or null errors are handled gracefully
         * with fallback error creation
         */
        it('should handle undefined/null errors gracefully', () => {
            // Set NODE_ENV to 'production' for secure handling
            process.env.NODE_ENV = 'production';
            
            // Create an error-like object without proper Error inheritance
            const testError = null;
            
            // Create mock Express objects
            const { req, res, next } = mockReqResNext();
            
            // Invoke errorHandler with null error
            errorHandler(testError, req, res, next);
            
            // Assert Logger.error was called with appropriate fallback context
            expect(Logger.error).toHaveBeenCalledWith(
                'Express error handler caught error',
                expect.objectContaining({
                    status: 500,
                    message: 'Internal Server Error',
                    method: 'GET',
                    url: '/hello',
                    userAgent: 'Jest-Test-Agent/1.0'
                })
            );
            
            // Assert res.status was called with 500 status code
            expect(res.status).toHaveBeenCalledWith(500);
            
            // Assert res.json was called with generic error response
            expect(res.json).toHaveBeenCalledWith({
                status: 500,
                message: 'Internal Server Error'
            });
            
            // Assert next was not called (response was sent)
            expect(next).not.toHaveBeenCalled();
        });
    });

    /**
     * Test Group: Environment-specific behavior
     * 
     * Verifies that the middleware behaves differently in production vs
     * development/test environments for security and debugging purposes
     */
    describe('Environment-specific behavior (production, development, test)', () => {
        /**
         * Test: Production environment security
         * 
         * Verifies that production environment properly filters sensitive
         * information and provides secure error responses
         */
        it('should omit stack traces in production environment', () => {
            // Set NODE_ENV to 'production' for security testing
            process.env.NODE_ENV = 'production';
            
            // Create HttpError with potentially sensitive details
            const testError = new HttpError(403, 'Access denied', {
                userId: 12345,
                role: 'user',
                requiredRole: 'admin',
                sessionId: 'secret-session-123',
                internalSystemId: 'sys-456'
            });
            
            // Create mock Express objects
            const { req, res, next } = mockReqResNext();
            
            // Invoke errorHandler with the HttpError
            errorHandler(testError, req, res, next);
            
            // Assert Logger.error was called with full internal context
            expect(Logger.error).toHaveBeenCalledWith(
                'Express error handler caught error',
                expect.objectContaining({
                    status: 403,
                    message: 'Access denied',
                    details: expect.objectContaining({
                        userId: 12345,
                        role: 'user',
                        requiredRole: 'admin',
                        sessionId: 'secret-session-123',
                        internalSystemId: 'sys-456'
                    }),
                    stack: expect.any(String)
                })
            );
            
            // Assert res.json was called with filtered production response
            expect(res.json).toHaveBeenCalledWith({
                status: 403,
                message: 'Access denied',
                details: {
                    // Only safe, non-object details should be included
                    // Complex objects and sensitive data should be filtered
                }
            });
            
            // Verify stack trace is not included in client response
            const responseCall = res.json.mock.calls[0][0];
            expect(responseCall).not.toHaveProperty('stack');
        });

        /**
         * Test: Development environment debugging
         * 
         * Verifies that development environment provides comprehensive
         * error information for debugging purposes
         */
        it('should include comprehensive error details in development', () => {
            // Set NODE_ENV to 'development' for debugging features
            process.env.NODE_ENV = 'development';
            
            // Create HttpError with debugging details
            const testError = new HttpError(500, 'Database connection failed', {
                host: 'localhost',
                port: 5432,
                database: 'tutorial_db',
                error_code: 'CONNECTION_TIMEOUT',
                retry_count: 3,
                last_attempt: new Date().toISOString()
            });
            
            // Create mock Express objects
            const { req, res, next } = mockReqResNext();
            
            // Invoke errorHandler with the HttpError
            errorHandler(testError, req, res, next);
            
            // Assert res.json was called with complete development response
            expect(res.json).toHaveBeenCalledWith({
                status: 500,
                message: 'Database connection failed',
                details: {
                    host: 'localhost',
                    port: 5432,
                    database: 'tutorial_db',
                    error_code: 'CONNECTION_TIMEOUT',
                    retry_count: 3,
                    last_attempt: expect.any(String)
                },
                stack: expect.any(String) // Stack trace included for debugging
            });
        });

        /**
         * Test: Test environment behavior
         * 
         * Verifies that test environment behaves like development
         * with full error information for test debugging
         */
        it('should behave like development in test environment', () => {
            // Set NODE_ENV to 'test' for test-specific behavior
            process.env.NODE_ENV = 'test';
            
            // Create HttpError for test scenario
            const testError = new HttpError(400, 'Validation error', {
                field: 'email',
                value: 'invalid-email',
                constraint: 'format'
            });
            
            // Create mock Express objects
            const { req, res, next } = mockReqResNext();
            
            // Invoke errorHandler with the HttpError
            errorHandler(testError, req, res, next);
            
            // Assert res.json was called with full test response
            expect(res.json).toHaveBeenCalledWith({
                status: 400,
                message: 'Validation error',
                details: {
                    field: 'email',
                    value: 'invalid-email',
                    constraint: 'format'
                },
                stack: expect.any(String) // Stack trace included in test environment
            });
        });
    });

    /**
     * Test Group: Express contract compliance
     * 
     * Verifies that the middleware properly handles Express.js-specific
     * scenarios like headers already sent and proper next() function usage
     */
    describe('Express contract compliance', () => {
        /**
         * Test: Headers already sent scenario
         * 
         * Verifies that the middleware does not attempt to send a response
         * when headers have already been sent, and properly calls next()
         */
        it('should not send headers twice if already sent', () => {
            // Set NODE_ENV to 'production' for standard behavior
            process.env.NODE_ENV = 'production';
            
            // Create HttpError for testing
            const testError = new HttpError(400, 'Bad Request');
            
            // Create mock Express objects with headers already sent
            const { req, res, next } = mockReqResNext();
            res.headersSent = true; // Simulate headers already sent
            
            // Invoke errorHandler with headers already sent
            errorHandler(testError, req, res, next);
            
            // Assert Logger.error was called to log the situation
            expect(Logger.error).toHaveBeenCalledWith(
                'Cannot send error response - headers already sent',
                expect.objectContaining({
                    status: 400,
                    message: 'Bad Request',
                    url: '/hello',
                    method: 'GET'
                })
            );
            
            // Assert res.status and res.json were not called
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
            
            // Assert next was called with the error for Express pipeline
            expect(next).toHaveBeenCalledWith(testError);
        });

        /**
         * Test: Response sending error handling
         * 
         * Verifies that errors during response sending are handled gracefully
         * with appropriate logging and next() calls
         */
        it('should handle response sending errors gracefully', () => {
            // Set NODE_ENV to 'production' for standard behavior
            process.env.NODE_ENV = 'production';
            
            // Create HttpError for testing
            const testError = new HttpError(500, 'Server Error');
            
            // Create mock Express objects with failing res.json
            const { req, res, next } = mockReqResNext();
            const responseError = new Error('Response sending failed');
            res.json.mockImplementation(() => {
                throw responseError;
            });
            
            // Invoke errorHandler with response sending failure
            errorHandler(testError, req, res, next);
            
            // Assert Logger.error was called for both original error and response error
            expect(Logger.error).toHaveBeenCalledWith(
                'Express error handler caught error',
                expect.objectContaining({
                    status: 500,
                    message: 'Server Error'
                })
            );
            
            expect(Logger.error).toHaveBeenCalledWith(
                'Error occurred while sending error response',
                expect.objectContaining({
                    originalError: {
                        status: 500,
                        message: 'Server Error'
                    },
                    responseError: {
                        name: 'Error',
                        message: 'Response sending failed',
                        stack: expect.any(String)
                    },
                    url: '/hello',
                    method: 'GET'
                })
            );
            
            // Assert next was called with original error for Express pipeline
            expect(next).toHaveBeenCalledWith(testError);
        });

        /**
         * Test: Successful response completion
         * 
         * Verifies that when response is sent successfully, next() is not called
         * to maintain proper Express.js middleware contract
         */
        it('should not call next() when response is sent successfully', () => {
            // Set NODE_ENV to 'production' for standard behavior
            process.env.NODE_ENV = 'production';
            
            // Create HttpError for testing
            const testError = new HttpError(404, 'Not Found');
            
            // Create mock Express objects
            const { req, res, next } = mockReqResNext();
            
            // Invoke errorHandler successfully
            errorHandler(testError, req, res, next);
            
            // Assert response was sent successfully
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: 404,
                message: 'Not Found'
            });
            
            // Assert next was not called (response sent successfully)
            expect(next).not.toHaveBeenCalled();
        });
    });

    /**
     * Test Group: Logger integration
     * 
     * Verifies that all errors are logged with appropriate context
     * and structured information for observability
     */
    describe('Logger integration', () => {
        /**
         * Test: Comprehensive logging context
         * 
         * Verifies that Logger.error is called with complete context
         * including request information, error details, and metadata
         */
        it('should log all errors with comprehensive context', () => {
            // Set NODE_ENV to 'development' for full context
            process.env.NODE_ENV = 'development';
            
            // Create HttpError with detailed context
            const testError = new HttpError(422, 'Validation Failed', {
                validationErrors: [
                    { field: 'email', message: 'Invalid format' },
                    { field: 'password', message: 'Too short' }
                ],
                requestId: 'req-12345',
                timestamp: new Date().toISOString()
            });
            
            // Create mock Express objects with detailed request info
            const { req, res, next } = mockReqResNext();
            req.method = 'POST';
            req.url = '/api/users';
            req.get.mockImplementation((header) => {
                if (header === 'User-Agent') {
                    return 'Mozilla/5.0 (Test Browser)';
                }
                return undefined;
            });
            
            // Invoke errorHandler with detailed context
            errorHandler(testError, req, res, next);
            
            // Assert Logger.error was called with comprehensive context
            expect(Logger.error).toHaveBeenCalledWith(
                'Express error handler caught error',
                expect.objectContaining({
                    status: 422,
                    message: 'Validation Failed',
                    method: 'POST',
                    url: '/api/users',
                    userAgent: 'Mozilla/5.0 (Test Browser)',
                    details: expect.objectContaining({
                        validationErrors: [
                            { field: 'email', message: 'Invalid format' },
                            { field: 'password', message: 'Too short' }
                        ],
                        requestId: 'req-12345',
                        timestamp: expect.any(String)
                    }),
                    stack: expect.any(String)
                })
            );
        });

        /**
         * Test: Logger error handling
         * 
         * Verifies that the middleware continues to function even if
         * logging fails, ensuring error responses are still sent
         */
        it('should continue processing even if logging fails', () => {
            // Set NODE_ENV to 'production' for standard behavior
            process.env.NODE_ENV = 'production';
            
            // Mock Logger.error to throw an error
            Logger.error.mockImplementation(() => {
                throw new Error('Logging system failure');
            });
            
            // Create HttpError for testing
            const testError = new HttpError(500, 'Internal Server Error');
            
            // Create mock Express objects
            const { req, res, next } = mockReqResNext();
            
            // Invoke errorHandler with logging failure
            // This should not throw an error
            expect(() => {
                errorHandler(testError, req, res, next);
            }).not.toThrow();
            
            // Assert response was still sent despite logging failure
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: 500,
                message: 'Internal Server Error'
            });
            
            // Assert next was not called (response sent successfully)
            expect(next).not.toHaveBeenCalled();
        });

        /**
         * Test: Structured logging format
         * 
         * Verifies that error logging follows a consistent, structured
         * format suitable for log aggregation and analysis
         */
        it('should log errors in structured format', () => {
            // Set NODE_ENV to 'production' for baseline behavior
            process.env.NODE_ENV = 'production';
            
            // Create multiple error types for testing
            const httpError = new HttpError(403, 'Forbidden', { resource: 'admin' });
            const systemError = new Error('System failure');
            
            // Create mock Express objects
            const { req, res, next } = mockReqResNext();
            
            // Test HttpError logging
            errorHandler(httpError, req, res, next);
            
            // Verify structured logging format for HttpError
            expect(Logger.error).toHaveBeenCalledWith(
                'Express error handler caught error',
                expect.objectContaining({
                    // Required fields for structured logging
                    status: expect.any(Number),
                    message: expect.any(String),
                    method: expect.any(String),
                    url: expect.any(String),
                    userAgent: expect.any(String),
                    stack: expect.any(String)
                })
            );
            
            // Reset mocks for second test
            jest.clearAllMocks();
            Logger.error.mockImplementation(() => {});
            
            // Test system error logging
            errorHandler(systemError, req, res, next);
            
            // Verify structured logging format for wrapped system error
            expect(Logger.error).toHaveBeenCalledWith(
                'Express error handler caught error',
                expect.objectContaining({
                    status: 500,
                    message: 'Internal Server Error',
                    method: expect.any(String),
                    url: expect.any(String),
                    userAgent: expect.any(String),
                    details: expect.objectContaining({
                        originalName: 'Error',
                        originalMessage: 'System failure',
                        originalStack: expect.any(String)
                    }),
                    stack: expect.any(String)
                })
            );
        });
    });

    /**
     * Test Group: Edge cases and error scenarios
     * 
     * Verifies that the middleware handles unusual conditions and
     * edge cases gracefully without breaking the application
     */
    describe('Edge cases and error scenarios', () => {
        /**
         * Test: Circular reference in error details
         * 
         * Verifies that circular references in error details don't
         * cause JSON serialization errors during logging
         */
        it('should handle circular references in error details', () => {
            // Set NODE_ENV to 'development' for full details
            process.env.NODE_ENV = 'development';
            
            // Create error with circular reference
            const circularObject = { name: 'test' };
            circularObject.self = circularObject; // Create circular reference
            
            const testError = new HttpError(400, 'Circular reference error', {
                circular: circularObject
            });
            
            // Create mock Express objects
            const { req, res, next } = mockReqResNext();
            
            // Invoke errorHandler with circular reference
            // This should not throw a JSON serialization error
            expect(() => {
                errorHandler(testError, req, res, next);
            }).not.toThrow();
            
            // Assert response was sent successfully
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalled();
            
            // Assert next was not called (response sent successfully)
            expect(next).not.toHaveBeenCalled();
        });

        /**
         * Test: Very large error objects
         * 
         * Verifies that large error objects are handled efficiently
         * without causing memory or performance issues
         */
        it('should handle large error objects efficiently', () => {
            // Set NODE_ENV to 'production' for performance testing
            process.env.NODE_ENV = 'production';
            
            // Create error with large details object
            const largeDetails = {};
            for (let i = 0; i < 1000; i++) {
                largeDetails[`field_${i}`] = `value_${i}`.repeat(100);
            }
            
            const testError = new HttpError(413, 'Payload too large', largeDetails);
            
            // Create mock Express objects
            const { req, res, next } = mockReqResNext();
            
            // Measure execution time
            const startTime = Date.now();
            errorHandler(testError, req, res, next);
            const executionTime = Date.now() - startTime;
            
            // Assert execution completed within reasonable time (< 100ms)
            expect(executionTime).toBeLessThan(100);
            
            // Assert response was sent successfully
            expect(res.status).toHaveBeenCalledWith(413);
            expect(res.json).toHaveBeenCalledWith({
                status: 413,
                message: 'Payload too large'
                // Large details filtered out in production
            });
            
            // Assert next was not called (response sent successfully)
            expect(next).not.toHaveBeenCalled();
        });

        /**
         * Test: Error with no stack trace
         * 
         * Verifies that errors without stack traces are handled
         * gracefully without breaking the logging or response
         */
        it('should handle errors without stack traces', () => {
            // Set NODE_ENV to 'development' for stack trace testing
            process.env.NODE_ENV = 'development';
            
            // Create error without stack trace
            const testError = new HttpError(400, 'No stack error');
            delete testError.stack; // Remove stack trace
            
            // Create mock Express objects
            const { req, res, next } = mockReqResNext();
            
            // Invoke errorHandler with no stack trace
            errorHandler(testError, req, res, next);
            
            // Assert Logger.error was called without stack trace
            expect(Logger.error).toHaveBeenCalledWith(
                'Express error handler caught error',
                expect.objectContaining({
                    status: 400,
                    message: 'No stack error',
                    method: 'GET',
                    url: '/hello',
                    userAgent: 'Jest-Test-Agent/1.0'
                    // No stack property when not available
                })
            );
            
            // Assert response was sent without stack trace
            expect(res.json).toHaveBeenCalledWith({
                status: 400,
                message: 'No stack error'
                // No stack property when not available
            });
        });
    });
});