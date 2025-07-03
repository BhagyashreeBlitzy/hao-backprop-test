/**
 * Unit Test Suite for Express Middleware Modules
 * 
 * This comprehensive test suite validates the functionality of backend Express middleware
 * modules in isolation, specifically focusing on errorHandler and requestLogger middleware.
 * The tests ensure correct error handling, logging behavior, and adherence to Express.js
 * middleware contracts while maintaining isolation from the full application context.
 * 
 * Test Coverage:
 * - errorHandler middleware: operational vs programmer error handling, environment-aware
 *   stack trace exposure, header-sent state validation, and Logger integration
 * - requestLogger middleware: request/response logging with performance metrics, path
 *   filtering, status code-based log level selection, and Logger integration
 * 
 * Requirements Addressed:
 * - Testing Strategy (6.6): Comprehensive unit testing with Jest and mocking
 * - Error Management (1.3.1): Validates error handling and logging functionality
 * - Monitoring and Observability (6.5): Tests request/response logging behavior
 * - Response Generation Feature (2.1.4): Ensures proper status codes and responses
 * 
 * Testing Framework: Jest v29.7.0 with comprehensive mocking and assertion capabilities
 * HTTP Testing: Supertest v7.1.1 for middleware testing in isolation
 * 
 * @fileoverview Unit tests for Express middleware modules
 * @version 1.0.0
 * @author Tutorial Implementation Team
 */

// =============================================================================
// EXTERNAL DEPENDENCIES
// =============================================================================

/**
 * Jest testing framework with built-in mocking, assertions, and test runner
 * @external jest
 * @see {@link https://jestjs.io/docs/getting-started} Jest v29.7.0 Documentation
 */
const jest = require('jest'); // v29.7.0 - JavaScript testing framework

/**
 * Supertest HTTP testing library for Express.js applications
 * Enables programmatic HTTP request testing for middleware in isolation
 * @external supertest
 * @see {@link https://github.com/visionmedia/supertest} Supertest v7.1.1 Documentation
 */
const supertest = require('supertest'); // v7.1.1 - HTTP testing library for Express applications

// =============================================================================
// INTERNAL DEPENDENCIES - UNITS UNDER TEST
// =============================================================================

/**
 * Express error-handling middleware under test
 * Handles operational and programmer errors with standardized response formatting
 */
const { errorHandler } = require('../../../src/backend/middleware/errorHandler.js');

/**
 * Express request logging middleware under test
 * Provides comprehensive HTTP request and response logging with performance metrics
 */
const { requestLogger } = require('../../../src/backend/middleware/requestLogger.js');

// =============================================================================
// INTERNAL DEPENDENCIES - UTILITIES AND FIXTURES
// =============================================================================

/**
 * Centralized logging utility for structured logging (mocked in tests)
 * Provides static methods for info, warn, error, and debug logging
 */
const { Logger } = require('../../../src/backend/utils/logger.js');

/**
 * Custom HTTP error classes for operational error testing
 * HttpError: Base class for HTTP errors with status codes and messages
 * InternalServerError: Specific error type for 500 Internal Server Error scenarios
 */
const { HttpError, InternalServerError } = require('../../../src/backend/utils/errorTypes.js');

/**
 * Test utility functions for DRY request simulation and assertion helpers
 * Provides reusable functions for HTTP request testing and response validation
 */
const { makeRequest, assertErrorResponse } = require('../../helpers/testUtils.js');

// =============================================================================
// TEST CONFIGURATION AND SETUP
// =============================================================================

/**
 * Global test configuration and mock setup
 * Ensures consistent test environment and proper mock isolation
 */
beforeAll(() => {
    // Suppress console output during tests to maintain clean test results
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    
    // Set test environment
    process.env.NODE_ENV = 'test';
});

/**
 * Cleanup after all tests complete
 * Restores original console methods and cleans up test environment
 */
afterAll(() => {
    // Restore console methods
    console.log.mockRestore();
    console.error.mockRestore();
    console.warn.mockRestore();
    
    // Clean up environment
    delete process.env.NODE_ENV;
});

// =============================================================================
// GLOBAL MOCK OBJECTS AND UTILITIES
// =============================================================================

/**
 * Mock Express request object for middleware testing
 * Provides essential request properties and methods needed by middleware
 */
let MOCK_REQ;

/**
 * Mock Express response object with spies for middleware testing
 * Includes all response methods used by middleware with Jest spy functionality
 */
let MOCK_RES;

/**
 * Jest mock function for Express next() middleware continuation
 * Tracks calls and arguments for middleware chain validation
 */
let MOCK_NEXT;

/**
 * Initializes and resets mock request, response, and next objects for each test
 * Ensures test isolation and consistent mock state across all test cases
 * 
 * This function creates fresh mock objects with Jest spies for tracking method calls
 * and provides realistic Express.js request/response object behavior for middleware testing.
 * 
 * @function setupMocks
 * @returns {Object} Object containing mocked req, res, next, and Logger methods
 * 
 * @example
 * // Usage in test setup
 * beforeEach(() => {
 *     const mocks = setupMocks();
 *     // mocks.req, mocks.res, mocks.next are ready for use
 * });
 */
function setupMocks() {
    // Create fresh mock request object with essential properties
    MOCK_REQ = {
        method: 'GET',
        url: '/hello',
        originalUrl: '/hello',
        path: '/hello',
        ip: '127.0.0.1',
        connection: {
            remoteAddress: '127.0.0.1'
        },
        headers: {
            'user-agent': 'test-agent',
            'content-type': 'application/json'
        },
        query: {},
        params: {},
        body: {},
        // Express request helper methods
        get: jest.fn((headerName) => {
            return MOCK_REQ.headers[headerName.toLowerCase()] || null;
        })
    };

    // Create fresh mock response object with Jest spies
    MOCK_RES = {
        statusCode: 200,
        headersSent: false,
        headers: {},
        // Response methods with Jest spies
        status: jest.fn(function(code) {
            this.statusCode = code;
            return this; // Enable method chaining
        }),
        send: jest.fn(function(data) {
            this.headersSent = true;
            return this;
        }),
        json: jest.fn(function(data) {
            this.headersSent = true;
            return this;
        }),
        set: jest.fn(function(header, value) {
            this.headers[header.toLowerCase()] = value;
            return this;
        }),
        get: jest.fn(function(header) {
            return this.headers[header.toLowerCase()] || null;
        }),
        // Event emitter methods for response lifecycle
        on: jest.fn(),
        emit: jest.fn(),
        // Response helper methods
        setHeader: jest.fn(),
        getHeader: jest.fn(),
        removeHeader: jest.fn()
    };

    // Create fresh mock next function
    MOCK_NEXT = jest.fn();

    // Mock all Logger methods to capture log calls without actual output
    jest.spyOn(Logger, 'info').mockImplementation(() => {});
    jest.spyOn(Logger, 'warn').mockImplementation(() => {});
    jest.spyOn(Logger, 'error').mockImplementation(() => {});
    jest.spyOn(Logger, 'debug').mockImplementation(() => {});

    return {
        req: MOCK_REQ,
        res: MOCK_RES,
        next: MOCK_NEXT,
        logger: {
            info: Logger.info,
            warn: Logger.warn,
            error: Logger.error,
            debug: Logger.debug
        }
    };
}

/**
 * Reset all mocks before each test to ensure isolation
 * Prevents test interference and maintains consistent mock state
 */
beforeEach(() => {
    // Clear all mock call history and implementations
    jest.clearAllMocks();
    
    // Reset Logger method mocks
    if (Logger.info.mockClear) Logger.info.mockClear();
    if (Logger.warn.mockClear) Logger.warn.mockClear();
    if (Logger.error.mockClear) Logger.error.mockClear();
    if (Logger.debug.mockClear) Logger.debug.mockClear();
    
    // Initialize fresh mocks for each test
    setupMocks();
});

// =============================================================================
// ERROR HANDLER MIDDLEWARE TESTS
// =============================================================================

/**
 * Test suite for errorHandler middleware functionality
 * 
 * This suite validates that the errorHandler middleware correctly processes
 * different types of errors, logs them appropriately, and returns standardized
 * error responses while maintaining security and proper Express.js middleware behavior.
 */
describe('errorHandler Middleware', () => {
    
    /**
     * Test that errorHandler correctly handles operational errors (HttpError instances)
     * 
     * This test validates that when an HttpError is passed to the middleware,
     * it is properly processed, logged, and returns the correct status code and message
     * while respecting environment-specific stack trace exposure rules.
     */
    describe('Operational Error Handling', () => {
        
        /**
         * Tests that errorHandler correctly handles an operational (HttpError) error:
         * logs it, returns correct status/message, and omits stack in production
         */
        it('should handle HttpError instances correctly', () => {
            // Arrange: Create a mock HttpError with status, message, and details
            const mockHttpError = new HttpError(400, 'Bad Request', { 
                field: 'email', 
                issue: 'invalid format' 
            });
            
            // Act: Invoke errorHandler with mock req, res, next, and error
            errorHandler(mockHttpError, MOCK_REQ, MOCK_RES, MOCK_NEXT);
            
            // Assert: Verify response status and JSON were called correctly
            expect(MOCK_RES.status).toHaveBeenCalledWith(400);
            expect(MOCK_RES.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 400,
                    message: 'Bad Request',
                    details: expect.objectContaining({
                        field: 'email',
                        issue: 'invalid format'
                    })
                })
            );
            
            // Assert: Verify Logger.error was called with correct arguments
            expect(Logger.error).toHaveBeenCalledWith(
                'HTTP 400 Error: Bad Request',
                expect.objectContaining({
                    status: 400,
                    message: 'Bad Request',
                    url: '/hello',
                    method: 'GET',
                    ip: '127.0.0.1',
                    details: expect.objectContaining({
                        field: 'email',
                        issue: 'invalid format'
                    })
                })
            );
            
            // Assert: Verify next() was not called (error was handled)
            expect(MOCK_NEXT).not.toHaveBeenCalled();
        });
        
        /**
         * Tests that errorHandler omits stack traces in production environment
         * and includes them in development environment for operational errors
         */
        it('should handle stack trace exposure based on environment', () => {
            // Arrange: Create an HttpError with stack trace
            const mockHttpError = new HttpError(404, 'Not Found', { resource: 'user' });
            
            // Test production environment (stack trace should be omitted)
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';
            
            // Act: Invoke errorHandler in production environment
            errorHandler(mockHttpError, MOCK_REQ, MOCK_RES, MOCK_NEXT);
            
            // Assert: Verify response does not include stack trace
            expect(MOCK_RES.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 404,
                    message: 'Not Found',
                    details: expect.objectContaining({
                        resource: 'user'
                    })
                })
            );
            
            // Verify stack trace is not included in response
            const responseCall = MOCK_RES.json.mock.calls[0][0];
            expect(responseCall.stack).toBeUndefined();
            
            // Reset environment
            process.env.NODE_ENV = originalEnv;
        });
        
        /**
         * Tests that errorHandler includes stack traces in development environment
         * for debugging purposes while omitting them in production
         */
        it('should include stack traces in development environment', () => {
            // Arrange: Create an HttpError with stack trace
            const mockHttpError = new HttpError(500, 'Internal Server Error');
            
            // Test development environment (stack trace should be included)
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'development';
            
            // Act: Invoke errorHandler in development environment
            errorHandler(mockHttpError, MOCK_REQ, MOCK_RES, MOCK_NEXT);
            
            // Assert: Verify response includes stack trace for debugging
            const responseCall = MOCK_RES.json.mock.calls[0][0];
            expect(responseCall.stack).toBeDefined();
            
            // Reset environment
            process.env.NODE_ENV = originalEnv;
        });
    });
    
    /**
     * Test suite for handling unknown/programmer errors that are not HttpError instances
     * 
     * This suite validates that the errorHandler middleware correctly wraps unknown
     * errors in InternalServerError instances and provides appropriate responses
     * while maintaining security and logging requirements.
     */
    describe('Unknown Error Handling', () => {
        
        /**
         * Tests that errorHandler wraps unknown errors as InternalServerError,
         * logs them, and returns 500 with generic message
         */
        it('should wrap unknown errors as InternalServerError', () => {
            // Arrange: Create a generic Error object (not HttpError)
            const genericError = new Error('Database connection failed');
            
            // Act: Invoke errorHandler with generic error
            errorHandler(genericError, MOCK_REQ, MOCK_RES, MOCK_NEXT);
            
            // Assert: Verify response status and JSON were called with 500
            expect(MOCK_RES.status).toHaveBeenCalledWith(500);
            expect(MOCK_RES.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 500,
                    message: 'Internal Server Error',
                    details: expect.objectContaining({
                        originalName: 'Error',
                        originalMessage: 'Database connection failed'
                    })
                })
            );
            
            // Assert: Verify Logger.error was called with original error details
            expect(Logger.error).toHaveBeenCalledWith(
                'HTTP 500 Error: Internal Server Error',
                expect.objectContaining({
                    status: 500,
                    message: 'Internal Server Error',
                    url: '/hello',
                    method: 'GET',
                    details: expect.objectContaining({
                        originalName: 'Error',
                        originalMessage: 'Database connection failed'
                    })
                })
            );
            
            // Assert: Verify next() was not called (error was handled)
            expect(MOCK_NEXT).not.toHaveBeenCalled();
        });
        
        /**
         * Tests that errorHandler handles errors with missing properties gracefully
         * and provides appropriate fallback values
         */
        it('should handle errors with missing properties gracefully', () => {
            // Arrange: Create an error with minimal properties
            const minimalError = {};
            
            // Act: Invoke errorHandler with minimal error
            errorHandler(minimalError, MOCK_REQ, MOCK_RES, MOCK_NEXT);
            
            // Assert: Verify response uses fallback values
            expect(MOCK_RES.status).toHaveBeenCalledWith(500);
            expect(MOCK_RES.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 500,
                    message: 'Internal Server Error',
                    details: expect.objectContaining({
                        originalName: 'Unknown',
                        originalMessage: 'An unexpected error occurred'
                    })
                })
            );
            
            // Assert: Verify Logger.error was called with fallback values
            expect(Logger.error).toHaveBeenCalledWith(
                'HTTP 500 Error: Internal Server Error',
                expect.objectContaining({
                    status: 500,
                    message: 'Internal Server Error'
                })
            );
        });
    });
    
    /**
     * Test suite for headers already sent scenario
     * 
     * This suite validates that the errorHandler middleware correctly detects
     * when response headers have already been sent and delegates to Express
     * default error handling to prevent response corruption.
     */
    describe('Headers Already Sent Handling', () => {
        
        /**
         * Tests that errorHandler does not send response if res.headersSent is true,
         * and calls next() to delegate to Express default error handling
         */
        it('should not send response if headers already sent', () => {
            // Arrange: Create an HttpError and set headers as already sent
            const mockHttpError = new HttpError(400, 'Bad Request');
            MOCK_RES.headersSent = true;
            
            // Act: Invoke errorHandler with headers already sent
            errorHandler(mockHttpError, MOCK_REQ, MOCK_RES, MOCK_NEXT);
            
            // Assert: Verify response methods were not called
            expect(MOCK_RES.status).not.toHaveBeenCalled();
            expect(MOCK_RES.json).not.toHaveBeenCalled();
            
            // Assert: Verify next() was called to delegate to Express default handler
            expect(MOCK_NEXT).toHaveBeenCalledWith(mockHttpError);
            
            // Assert: Verify condition was logged
            expect(Logger.error).toHaveBeenCalledWith(
                'Cannot send error response - headers already sent',
                expect.objectContaining({
                    url: '/hello',
                    method: 'GET',
                    status: 400
                })
            );
        });
        
        /**
         * Tests that errorHandler handles response send failures gracefully
         * and attempts fallback error responses
         */
        it('should handle response send failures gracefully', () => {
            // Arrange: Create an HttpError and make res.json throw an error
            const mockHttpError = new HttpError(400, 'Bad Request');
            const sendError = new Error('Response send failed');
            MOCK_RES.json.mockImplementationOnce(() => {
                throw sendError;
            });
            
            // Act: Invoke errorHandler with response send failure
            errorHandler(mockHttpError, MOCK_REQ, MOCK_RES, MOCK_NEXT);
            
            // Assert: Verify initial response attempt was made
            expect(MOCK_RES.status).toHaveBeenCalledWith(400);
            expect(MOCK_RES.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 400,
                    message: 'Bad Request'
                })
            );
            
            // Assert: Verify failure was logged
            expect(Logger.error).toHaveBeenCalledWith(
                'Failed to send error response',
                expect.objectContaining({
                    originalError: 'Bad Request',
                    responseError: 'Response send failed'
                })
            );
        });
    });
});

// =============================================================================
// REQUEST LOGGER MIDDLEWARE TESTS
// =============================================================================

/**
 * Test suite for requestLogger middleware functionality
 * 
 * This suite validates that the requestLogger middleware correctly logs
 * incoming requests and outgoing responses with appropriate metadata,
 * performance metrics, and log levels while respecting path filtering rules.
 */
describe('requestLogger Middleware', () => {
    
    /**
     * Test suite for normal request logging behavior
     * 
     * This suite validates that the requestLogger middleware correctly logs
     * incoming requests and outgoing responses with structured metadata
     * and performance timing information.
     */
    describe('Normal Request Logging', () => {
        
        /**
         * Tests that requestLogger logs incoming requests and outgoing responses
         * with correct structure, and calls next() to continue middleware chain
         */
        it('should log incoming request and outgoing response', () => {
            // Arrange: Set up request metadata
            MOCK_REQ.method = 'GET';
            MOCK_REQ.url = '/hello';
            MOCK_REQ.path = '/hello';
            
            // Act: Invoke requestLogger middleware
            requestLogger(MOCK_REQ, MOCK_RES, MOCK_NEXT);
            
            // Assert: Verify next() was called to continue middleware chain
            expect(MOCK_NEXT).toHaveBeenCalled();
            
            // Assert: Verify incoming request was logged
            expect(Logger.info).toHaveBeenCalledWith(
                'Incoming HTTP request',
                expect.objectContaining({
                    method: 'GET',
                    url: '/hello',
                    userAgent: 'test-agent',
                    contentType: 'application/json',
                    remoteAddress: '127.0.0.1'
                })
            );
            
            // Simulate response finish event to trigger completion logging
            const finishCallback = MOCK_RES.on.mock.calls.find(call => call[0] === 'finish')[1];
            finishCallback();
            
            // Assert: Verify response completion was logged
            expect(Logger.info).toHaveBeenCalledWith(
                'HTTP request completed',
                expect.objectContaining({
                    method: 'GET',
                    url: '/hello',
                    statusCode: 200,
                    responseTime: expect.any(Number)
                })
            );
        });
        
        /**
         * Tests that requestLogger calculates and logs response time accurately
         * using high-resolution timing for performance monitoring
         */
        it('should calculate and log response time accurately', () => {
            // Arrange: Set up request
            MOCK_REQ.method = 'POST';
            MOCK_REQ.url = '/api/users';
            MOCK_REQ.path = '/api/users';
            
            // Act: Invoke requestLogger middleware
            requestLogger(MOCK_REQ, MOCK_RES, MOCK_NEXT);
            
            // Simulate some processing time delay
            const finishCallback = MOCK_RES.on.mock.calls.find(call => call[0] === 'finish')[1];
            
            // Mock hrtime to simulate elapsed time
            const mockStartTime = BigInt(1000000000); // 1 second in nanoseconds
            const mockEndTime = BigInt(1150000000);   // 1.15 seconds in nanoseconds
            
            jest.spyOn(process, 'hrtime').mockReturnValue({
                bigint: jest.fn()
                    .mockReturnValueOnce(mockStartTime)
                    .mockReturnValueOnce(mockEndTime)
            });
            
            // Trigger response completion
            finishCallback();
            
            // Assert: Verify response time was calculated and logged
            expect(Logger.info).toHaveBeenCalledWith(
                'HTTP request completed',
                expect.objectContaining({
                    method: 'POST',
                    url: '/api/users',
                    statusCode: 200,
                    responseTime: expect.any(Number)
                })
            );
            
            // Cleanup mock
            process.hrtime.mockRestore();
        });
        
        /**
         * Tests that requestLogger includes query parameters in request metadata
         * when present in the request
         */
        it('should include query parameters when present', () => {
            // Arrange: Set up request with query parameters
            MOCK_REQ.method = 'GET';
            MOCK_REQ.url = '/search?q=test&limit=10';
            MOCK_REQ.path = '/search';
            MOCK_REQ.query = { q: 'test', limit: '10' };
            
            // Act: Invoke requestLogger middleware
            requestLogger(MOCK_REQ, MOCK_RES, MOCK_NEXT);
            
            // Assert: Verify query parameters were included in logged metadata
            expect(Logger.info).toHaveBeenCalledWith(
                'Incoming HTTP request',
                expect.objectContaining({
                    method: 'GET',
                    url: '/search?q=test&limit=10',
                    queryParams: { q: 'test', limit: '10' }
                })
            );
        });
        
        /**
         * Tests that requestLogger includes content length in metadata
         * for requests with body content
         */
        it('should include content length when present', () => {
            // Arrange: Set up request with content length
            MOCK_REQ.method = 'POST';
            MOCK_REQ.url = '/api/users';
            MOCK_REQ.path = '/api/users';
            MOCK_REQ.headers['content-length'] = '123';
            
            // Act: Invoke requestLogger middleware
            requestLogger(MOCK_REQ, MOCK_RES, MOCK_NEXT);
            
            // Assert: Verify content length was included in logged metadata
            expect(Logger.info).toHaveBeenCalledWith(
                'Incoming HTTP request',
                expect.objectContaining({
                    method: 'POST',
                    url: '/api/users',
                    contentLength: 123
                })
            );
        });
    });
    
    /**
     * Test suite for ignored path filtering behavior
     * 
     * This suite validates that the requestLogger middleware correctly skips
     * logging for specified paths (health checks, favicon) to reduce log noise
     * while maintaining normal middleware chain continuation.
     */
    describe('Ignored Path Filtering', () => {
        
        /**
         * Tests that requestLogger skips logging for /health endpoint
         * to reduce log noise from health check requests
         */
        it('should skip logging for /health endpoint', () => {
            // Arrange: Set up health check request
            MOCK_REQ.method = 'GET';
            MOCK_REQ.url = '/health';
            MOCK_REQ.path = '/health';
            
            // Act: Invoke requestLogger middleware
            requestLogger(MOCK_REQ, MOCK_RES, MOCK_NEXT);
            
            // Assert: Verify next() was called to continue middleware chain
            expect(MOCK_NEXT).toHaveBeenCalled();
            
            // Assert: Verify no logging occurred for ignored path
            expect(Logger.info).not.toHaveBeenCalled();
            expect(Logger.warn).not.toHaveBeenCalled();
            expect(Logger.error).not.toHaveBeenCalled();
        });
        
        /**
         * Tests that requestLogger skips logging for /favicon.ico requests
         * to reduce log noise from automatic browser favicon requests
         */
        it('should skip logging for /favicon.ico requests', () => {
            // Arrange: Set up favicon request
            MOCK_REQ.method = 'GET';
            MOCK_REQ.url = '/favicon.ico';
            MOCK_REQ.path = '/favicon.ico';
            
            // Act: Invoke requestLogger middleware
            requestLogger(MOCK_REQ, MOCK_RES, MOCK_NEXT);
            
            // Assert: Verify next() was called to continue middleware chain
            expect(MOCK_NEXT).toHaveBeenCalled();
            
            // Assert: Verify no logging occurred for ignored path
            expect(Logger.info).not.toHaveBeenCalled();
            expect(Logger.warn).not.toHaveBeenCalled();
            expect(Logger.error).not.toHaveBeenCalled();
        });
        
        /**
         * Tests that requestLogger processes normal paths that are not in the ignored list
         * to ensure filtering only affects specified paths
         */
        it('should process normal paths that are not ignored', () => {
            // Arrange: Set up normal request path
            MOCK_REQ.method = 'GET';
            MOCK_REQ.url = '/api/users';
            MOCK_REQ.path = '/api/users';
            
            // Act: Invoke requestLogger middleware
            requestLogger(MOCK_REQ, MOCK_RES, MOCK_NEXT);
            
            // Assert: Verify next() was called to continue middleware chain
            expect(MOCK_NEXT).toHaveBeenCalled();
            
            // Assert: Verify logging occurred for non-ignored path
            expect(Logger.info).toHaveBeenCalledWith(
                'Incoming HTTP request',
                expect.objectContaining({
                    method: 'GET',
                    url: '/api/users'
                })
            );
        });
    });
    
    /**
     * Test suite for status code-based log level selection
     * 
     * This suite validates that the requestLogger middleware correctly selects
     * appropriate log levels based on HTTP response status codes for operational
     * monitoring and alerting purposes.
     */
    describe('Status Code-Based Log Level Selection', () => {
        
        /**
         * Tests that requestLogger uses Logger.warn for 4xx client error responses
         * to distinguish client errors from server errors in monitoring systems
         */
        it('should use Logger.warn for 4xx client errors', () => {
            // Arrange: Set up request and simulate 404 response
            MOCK_REQ.method = 'GET';
            MOCK_REQ.url = '/nonexistent';
            MOCK_REQ.path = '/nonexistent';
            MOCK_RES.statusCode = 404;
            
            // Act: Invoke requestLogger middleware
            requestLogger(MOCK_REQ, MOCK_RES, MOCK_NEXT);
            
            // Simulate response finish event
            const finishCallback = MOCK_RES.on.mock.calls.find(call => call[0] === 'finish')[1];
            finishCallback();
            
            // Assert: Verify Logger.warn was used for 4xx status code
            expect(Logger.warn).toHaveBeenCalledWith(
                'HTTP request completed with error',
                expect.objectContaining({
                    method: 'GET',
                    url: '/nonexistent',
                    statusCode: 404
                })
            );
            
            // Assert: Verify other log levels were not used
            expect(Logger.info).toHaveBeenCalledTimes(1); // Only for incoming request
            expect(Logger.error).not.toHaveBeenCalledWith(
                expect.stringContaining('HTTP request completed'),
                expect.any(Object)
            );
        });
        
        /**
         * Tests that requestLogger uses Logger.error for 5xx server error responses
         * to trigger appropriate alerting for server-side issues
         */
        it('should use Logger.error for 5xx server errors', () => {
            // Arrange: Set up request and simulate 500 response
            MOCK_REQ.method = 'POST';
            MOCK_REQ.url = '/api/users';
            MOCK_REQ.path = '/api/users';
            MOCK_RES.statusCode = 500;
            
            // Act: Invoke requestLogger middleware
            requestLogger(MOCK_REQ, MOCK_RES, MOCK_NEXT);
            
            // Simulate response finish event
            const finishCallback = MOCK_RES.on.mock.calls.find(call => call[0] === 'finish')[1];
            finishCallback();
            
            // Assert: Verify Logger.error was used for 5xx status code
            expect(Logger.error).toHaveBeenCalledWith(
                'HTTP request completed with error',
                expect.objectContaining({
                    method: 'POST',
                    url: '/api/users',
                    statusCode: 500
                })
            );
            
            // Assert: Verify other log levels were not used for completion
            expect(Logger.info).toHaveBeenCalledTimes(1); // Only for incoming request
            expect(Logger.warn).not.toHaveBeenCalledWith(
                expect.stringContaining('HTTP request completed'),
                expect.any(Object)
            );
        });
        
        /**
         * Tests that requestLogger uses Logger.info for successful 2xx responses
         * to maintain normal operational logging for successful requests
         */
        it('should use Logger.info for successful 2xx responses', () => {
            // Arrange: Set up request and simulate 200 response
            MOCK_REQ.method = 'GET';
            MOCK_REQ.url = '/hello';
            MOCK_REQ.path = '/hello';
            MOCK_RES.statusCode = 200;
            
            // Act: Invoke requestLogger middleware
            requestLogger(MOCK_REQ, MOCK_RES, MOCK_NEXT);
            
            // Simulate response finish event
            const finishCallback = MOCK_RES.on.mock.calls.find(call => call[0] === 'finish')[1];
            finishCallback();
            
            // Assert: Verify Logger.info was used for 2xx status code
            expect(Logger.info).toHaveBeenCalledWith(
                'HTTP request completed',
                expect.objectContaining({
                    method: 'GET',
                    url: '/hello',
                    statusCode: 200
                })
            );
            
            // Assert: Verify Logger.info was called twice (incoming + completion)
            expect(Logger.info).toHaveBeenCalledTimes(2);
            
            // Assert: Verify other log levels were not used for completion
            expect(Logger.warn).not.toHaveBeenCalledWith(
                expect.stringContaining('HTTP request completed'),
                expect.any(Object)
            );
            expect(Logger.error).not.toHaveBeenCalledWith(
                expect.stringContaining('HTTP request completed'),
                expect.any(Object)
            );
        });
        
        /**
         * Tests that requestLogger uses Logger.info for 3xx redirection responses
         * to maintain normal operational logging for redirect scenarios
         */
        it('should use Logger.info for 3xx redirection responses', () => {
            // Arrange: Set up request and simulate 301 response
            MOCK_REQ.method = 'GET';
            MOCK_REQ.url = '/old-endpoint';
            MOCK_REQ.path = '/old-endpoint';
            MOCK_RES.statusCode = 301;
            
            // Act: Invoke requestLogger middleware
            requestLogger(MOCK_REQ, MOCK_RES, MOCK_NEXT);
            
            // Simulate response finish event
            const finishCallback = MOCK_RES.on.mock.calls.find(call => call[0] === 'finish')[1];
            finishCallback();
            
            // Assert: Verify Logger.info was used for 3xx status code
            expect(Logger.info).toHaveBeenCalledWith(
                'HTTP request completed',
                expect.objectContaining({
                    method: 'GET',
                    url: '/old-endpoint',
                    statusCode: 301
                })
            );
            
            // Assert: Verify Logger.info was called twice (incoming + completion)
            expect(Logger.info).toHaveBeenCalledTimes(2);
        });
    });
    
    /**
     * Test suite for error handling during logging operations
     * 
     * This suite validates that the requestLogger middleware handles errors
     * gracefully during metadata extraction and logging operations without
     * breaking the request processing flow.
     */
    describe('Error Handling During Logging', () => {
        
        /**
         * Tests that requestLogger handles metadata extraction errors gracefully
         * without breaking the request processing flow
         */
        it('should handle metadata extraction errors gracefully', () => {
            // Arrange: Set up request that will cause metadata extraction error
            MOCK_REQ.method = 'GET';
            MOCK_REQ.url = '/hello';
            MOCK_REQ.path = '/hello';
            
            // Mock get method to throw an error
            MOCK_REQ.get = jest.fn(() => {
                throw new Error('Header extraction failed');
            });
            
            // Act: Invoke requestLogger middleware
            requestLogger(MOCK_REQ, MOCK_RES, MOCK_NEXT);
            
            // Assert: Verify next() was still called despite error
            expect(MOCK_NEXT).toHaveBeenCalled();
            
            // Assert: Verify error was logged
            expect(Logger.error).toHaveBeenCalledWith(
                'Failed to extract request metadata',
                expect.any(Error)
            );
        });
        
        /**
         * Tests that requestLogger handles response logging errors gracefully
         * without affecting the response completion flow
         */
        it('should handle response logging errors gracefully', () => {
            // Arrange: Set up request
            MOCK_REQ.method = 'GET';
            MOCK_REQ.url = '/hello';
            MOCK_REQ.path = '/hello';
            
            // Mock hrtime to throw an error
            jest.spyOn(process, 'hrtime').mockImplementation(() => {
                throw new Error('Timing calculation failed');
            });
            
            // Act: Invoke requestLogger middleware
            requestLogger(MOCK_REQ, MOCK_RES, MOCK_NEXT);
            
            // Simulate response finish event
            const finishCallback = MOCK_RES.on.mock.calls.find(call => call[0] === 'finish')[1];
            finishCallback();
            
            // Assert: Verify response logging error was handled
            expect(Logger.error).toHaveBeenCalledWith(
                'Failed to log response completion',
                expect.any(Error)
            );
            
            // Cleanup mock
            process.hrtime.mockRestore();
        });
    });
    
    /**
     * Test suite for response metadata extraction
     * 
     * This suite validates that the requestLogger middleware correctly extracts
     * and includes response metadata such as content type and length in the
     * completion logs for comprehensive request monitoring.
     */
    describe('Response Metadata Extraction', () => {
        
        /**
         * Tests that requestLogger includes response content type and length
         * in completion logs when available
         */
        it('should include response content type and length when available', () => {
            // Arrange: Set up request and response with content metadata
            MOCK_REQ.method = 'GET';
            MOCK_REQ.url = '/hello';
            MOCK_REQ.path = '/hello';
            MOCK_RES.statusCode = 200;
            MOCK_RES.headers['content-type'] = 'text/plain';
            MOCK_RES.headers['content-length'] = '11';
            
            // Mock get method to return headers
            MOCK_RES.get = jest.fn((headerName) => {
                return MOCK_RES.headers[headerName.toLowerCase()] || null;
            });
            
            // Act: Invoke requestLogger middleware
            requestLogger(MOCK_REQ, MOCK_RES, MOCK_NEXT);
            
            // Simulate response finish event
            const finishCallback = MOCK_RES.on.mock.calls.find(call => call[0] === 'finish')[1];
            finishCallback();
            
            // Assert: Verify response metadata was included in completion log
            expect(Logger.info).toHaveBeenCalledWith(
                'HTTP request completed',
                expect.objectContaining({
                    method: 'GET',
                    url: '/hello',
                    statusCode: 200,
                    contentType: 'text/plain',
                    contentLength: 11,
                    responseTime: expect.any(Number)
                })
            );
        });
        
        /**
         * Tests that requestLogger handles missing response metadata gracefully
         * with appropriate fallback values
         */
        it('should handle missing response metadata gracefully', () => {
            // Arrange: Set up request with minimal response metadata
            MOCK_REQ.method = 'GET';
            MOCK_REQ.url = '/hello';
            MOCK_REQ.path = '/hello';
            MOCK_RES.statusCode = 200;
            
            // Mock get method to return null for missing headers
            MOCK_RES.get = jest.fn(() => null);
            
            // Act: Invoke requestLogger middleware
            requestLogger(MOCK_REQ, MOCK_RES, MOCK_NEXT);
            
            // Simulate response finish event
            const finishCallback = MOCK_RES.on.mock.calls.find(call => call[0] === 'finish')[1];
            finishCallback();
            
            // Assert: Verify response metadata includes fallback values
            expect(Logger.info).toHaveBeenCalledWith(
                'HTTP request completed',
                expect.objectContaining({
                    method: 'GET',
                    url: '/hello',
                    statusCode: 200,
                    contentType: 'Not specified',
                    responseTime: expect.any(Number)
                })
            );
            
            // Verify contentLength is not included when not present
            const responseCall = Logger.info.mock.calls[1][1];
            expect(responseCall.contentLength).toBeUndefined();
        });
    });
});