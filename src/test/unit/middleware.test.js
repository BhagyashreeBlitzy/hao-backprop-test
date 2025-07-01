/**
 * Unit Test Suite for Backend Express Middleware Modules
 * 
 * This comprehensive test suite validates the errorHandler and requestLogger middleware
 * modules in isolation from the full application. Tests ensure middleware functions
 * conform to Express interface specifications, handle edge cases correctly, and
 * interact with the Logger utility as expected.
 * 
 * Test Coverage:
 * - errorHandler: Operational vs programmer error handling, logging, response formatting
 * - requestLogger: Request/response logging, ignored paths, status-based log levels
 * - Express middleware contract compliance and proper next() handling
 * - Environment-aware behavior (production vs development)
 * - Error conditions and edge cases
 * 
 * Testing Framework: Jest ^29.7.0
 * HTTP Testing: Supertest ^7.1.1
 * Test Utilities: Custom helpers for DRY request/response simulation
 * 
 * @fileoverview Unit tests for Express middleware modules
 * @author Backend Development Team
 * @version 1.0.0
 */

// Internal imports - Middleware under test
const { errorHandler } = require('../../../src/backend/middleware/errorHandler.js');
const { requestLogger } = require('../../../src/backend/middleware/requestLogger.js');

// Internal imports - Dependencies and utilities
const { Logger } = require('../../../src/backend/utils/logger.js');
const { HttpError, InternalServerError } = require('../../../src/backend/utils/errorTypes.js');
const { makeRequest, assertErrorResponse } = require('../../helpers/testUtils.js');

// External imports - Testing framework and utilities
const jest = require('jest'); // ^29.7.0 - Test framework for mocking and assertions
const supertest = require('supertest'); // ^7.1.1 - HTTP request simulation for middleware testing

// Global mock objects and utilities for test isolation
let MOCK_REQ;
let MOCK_RES;
let MOCK_NEXT;
let ORIGINAL_ENV;

/**
 * Sets up fresh mock objects and resets all mocks before each test
 * Ensures complete test isolation and prevents test interference
 * 
 * Mock Objects Created:
 * - MOCK_REQ: Express request object with method, url, headers, query
 * - MOCK_RES: Express response object with status, json, send, headersSent, on
 * - MOCK_NEXT: Jest mock function for next() calls
 * - Logger method mocks: info, warn, error, debug
 * 
 * @function setupMocks
 * @returns {object} Object containing mocked req, res, next, and Logger methods
 */
function setupMocks() {
    // Create comprehensive mock request object
    MOCK_REQ = {
        method: 'GET',
        url: '/hello',
        path: '/hello',
        headers: {
            'host': 'localhost:3000',
            'user-agent': 'test-agent',
            'accept': 'text/plain'
        },
        query: {},
        get: jest.fn((headerName) => MOCK_REQ.headers[headerName.toLowerCase()])
    };

    // Create comprehensive mock response object with all required methods
    MOCK_RES = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        get: jest.fn(),
        set: jest.fn().mockReturnThis(),
        headersSent: false,
        statusCode: 200,
        // Event emitter functionality for response events
        on: jest.fn(),
        emit: jest.fn(),
        // Internal event listener storage for simulation
        _events: {},
        _addEventListener: function(event, callback) {
            if (!this._events[event]) {
                this._events[event] = [];
            }
            this._events[event].push(callback);
        },
        _triggerEvent: function(event, ...args) {
            if (this._events[event]) {
                this._events[event].forEach(callback => callback(...args));
            }
        }
    };

    // Override res.on to use internal event system
    MOCK_RES.on.mockImplementation((event, callback) => {
        MOCK_RES._addEventListener(event, callback);
        return MOCK_RES;
    });

    // Create mock next function
    MOCK_NEXT = jest.fn();

    // Mock all Logger methods to capture calls without actual output
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
 * Test setup and teardown configuration
 * Ensures clean test environment and proper mock management
 */
describe('Backend Express Middleware Unit Tests', () => {
    // Store original environment for restoration
    beforeAll(() => {
        ORIGINAL_ENV = process.env.NODE_ENV;
    });

    // Reset all mocks and setup fresh mock objects before each test
    beforeEach(() => {
        jest.clearAllMocks();
        setupMocks();
    });

    // Restore original environment after all tests
    afterAll(() => {
        process.env.NODE_ENV = ORIGINAL_ENV;
        jest.restoreAllMocks();
    });

    /**
     * Error Handler Middleware Test Suite
     * Tests the errorHandler middleware for correct error processing,
     * logging, and response generation across different error types
     */
    describe('errorHandler Middleware', () => {
        /**
         * Tests errorHandler correctly processes operational errors (HttpError instances)
         * Validates proper status code, message handling, and logging behavior
         */
        describe('operational error handling', () => {
            /**
             * Test errorHandler with HttpError - should preserve status and message
             */
            function testErrorHandlerOperationalError() {
                it('should handle HttpError instances correctly', async () => {
                    // Create a mock HttpError with specific status, message, and details
                    const testError = new HttpError(404, 'Resource not found', {
                        resource: 'user',
                        id: '123'
                    });

                    // Set environment to development for full error details
                    process.env.NODE_ENV = 'development';

                    // Invoke errorHandler with mock req, res, next, and error
                    errorHandler(testError, MOCK_REQ, MOCK_RES, MOCK_NEXT);

                    // Assert res.status called with correct HTTP status
                    expect(MOCK_RES.status).toHaveBeenCalledWith(404);
                    
                    // Assert res.json called with correct error structure
                    expect(MOCK_RES.json).toHaveBeenCalledWith({
                        status: 404,
                        message: 'Resource not found',
                        details: {
                            resource: 'user',
                            id: '123'
                        },
                        stack: expect.any(String)
                    });

                    // Assert Logger.error called with comprehensive context
                    expect(Logger.error).toHaveBeenCalledWith(
                        'Express error handler caught error',
                        expect.objectContaining({
                            status: 404,
                            message: 'Resource not found',
                            method: 'GET',
                            url: '/hello',
                            details: {
                                resource: 'user',
                                id: '123'
                            },
                            stack: expect.any(String)
                        })
                    );

                    // Assert next() was NOT called (response sent successfully)
                    expect(MOCK_NEXT).not.toHaveBeenCalled();
                });
            }

            /**
             * Test errorHandler production behavior - should omit stack trace
             */
            it('should omit stack trace in production environment', async () => {
                // Create a mock HttpError
                const testError = new HttpError(400, 'Bad request', {
                    field: 'email',
                    reason: 'invalid format'
                });

                // Set environment to production
                process.env.NODE_ENV = 'production';

                // Invoke errorHandler
                errorHandler(testError, MOCK_REQ, MOCK_RES, MOCK_NEXT);

                // Assert response excludes stack trace
                expect(MOCK_RES.json).toHaveBeenCalledWith({
                    status: 400,
                    message: 'Bad request',
                    details: {
                        field: 'email',
                        reason: 'invalid format'
                    }
                });

                // Verify no stack trace in response
                const responseCall = MOCK_RES.json.mock.calls[0][0];
                expect(responseCall).not.toHaveProperty('stack');
            });

            /**
             * Test errorHandler with production environment filtering sensitive details
             */
            it('should filter sensitive details in production', async () => {
                // Create HttpError with mix of safe and sensitive details
                const testError = new HttpError(422, 'Validation failed', {
                    field: 'email', // Safe to expose
                    reason: 'invalid', // Safe to expose
                    internalCode: 'DB_CONSTRAINT_VIOLATION', // Should be filtered
                    originalStack: 'sensitive stack trace', // Should be filtered
                    systemInfo: { memory: '8GB' } // Object - should be filtered
                });

                // Set environment to production
                process.env.NODE_ENV = 'production';

                // Invoke errorHandler
                errorHandler(testError, MOCK_REQ, MOCK_RES, MOCK_NEXT);

                // Assert response includes only safe details
                expect(MOCK_RES.json).toHaveBeenCalledWith({
                    status: 422,
                    message: 'Validation failed',
                    details: {
                        field: 'email',
                        reason: 'invalid'
                    }
                });

                // Verify sensitive details are excluded
                const responseCall = MOCK_RES.json.mock.calls[0][0];
                expect(responseCall.details).not.toHaveProperty('internalCode');
                expect(responseCall.details).not.toHaveProperty('originalStack');
                expect(responseCall.details).not.toHaveProperty('systemInfo');
            });

            // Execute the operational error test
            testErrorHandlerOperationalError();
        });

        /**
         * Tests errorHandler correctly processes unknown errors
         * Validates wrapping in InternalServerError and proper handling
         */
        describe('unknown error handling', () => {
            /**
             * Test errorHandler with unknown Error - should wrap in InternalServerError
             */
            function testErrorHandlerUnknownError() {
                it('should wrap unknown errors in InternalServerError', async () => {
                    // Create a generic Error object (not HttpError)
                    const unknownError = new Error('Database connection failed');
                    unknownError.code = 'ECONNREFUSED';

                    // Set environment to development
                    process.env.NODE_ENV = 'development';

                    // Invoke errorHandler with unknown error
                    errorHandler(unknownError, MOCK_REQ, MOCK_RES, MOCK_NEXT);

                    // Assert res.status called with 500 (InternalServerError default)
                    expect(MOCK_RES.status).toHaveBeenCalledWith(500);
                    
                    // Assert res.json called with wrapped error structure
                    expect(MOCK_RES.json).toHaveBeenCalledWith({
                        status: 500,
                        message: 'Internal Server Error',
                        details: expect.objectContaining({
                            originalName: 'Error',
                            originalMessage: 'Database connection failed',
                            originalCode: 'ECONNREFUSED',
                            originalStack: expect.any(String)
                        }),
                        stack: expect.any(String)
                    });

                    // Assert Logger.error called with original error context
                    expect(Logger.error).toHaveBeenCalledWith(
                        'Express error handler caught error',
                        expect.objectContaining({
                            status: 500,
                            message: 'Internal Server Error',
                            method: 'GET',
                            url: '/hello',
                            details: expect.objectContaining({
                                originalName: 'Error',
                                originalMessage: 'Database connection failed',
                                originalCode: 'ECONNREFUSED'
                            })
                        })
                    );

                    // Assert next() was NOT called
                    expect(MOCK_NEXT).not.toHaveBeenCalled();
                });
            }

            /**
             * Test errorHandler with unknown error in production
             */
            it('should return generic message for unknown errors in production', async () => {
                // Create unknown error with sensitive information
                const unknownError = new Error('Internal system failure: DB credentials invalid');
                unknownError.sensitiveData = 'password123';

                // Set environment to production
                process.env.NODE_ENV = 'production';

                // Invoke errorHandler
                errorHandler(unknownError, MOCK_REQ, MOCK_RES, MOCK_NEXT);

                // Assert response is generic and safe
                expect(MOCK_RES.json).toHaveBeenCalledWith({
                    status: 500,
                    message: 'Internal Server Error'
                });

                // Verify no stack trace or sensitive details in response
                const responseCall = MOCK_RES.json.mock.calls[0][0];
                expect(responseCall).not.toHaveProperty('stack');
                expect(responseCall).not.toHaveProperty('details');
            });

            // Execute the unknown error test
            testErrorHandlerUnknownError();
        });

        /**
         * Tests errorHandler behavior when headers are already sent
         * Validates proper delegation to Express default error handler
         */
        describe('headers already sent', () => {
            it('should call next() when headers are already sent', async () => {
                // Create test error
                const testError = new HttpError(400, 'Bad request');

                // Set headersSent to true to simulate headers already sent
                MOCK_RES.headersSent = true;

                // Invoke errorHandler
                errorHandler(testError, MOCK_REQ, MOCK_RES, MOCK_NEXT);

                // Assert res.status and res.json were NOT called
                expect(MOCK_RES.status).not.toHaveBeenCalled();
                expect(MOCK_RES.json).not.toHaveBeenCalled();

                // Assert next() was called with the error
                expect(MOCK_NEXT).toHaveBeenCalledWith(testError);

                // Assert error was still logged
                expect(Logger.error).toHaveBeenCalledWith(
                    'Cannot send error response - headers already sent',
                    expect.objectContaining({
                        status: 400,
                        message: 'Bad request',
                        url: '/hello',
                        method: 'GET'
                    })
                );
            });
        });

        /**
         * Tests errorHandler behavior when response sending fails
         * Validates proper error handling during response generation
         */
        describe('response error handling', () => {
            it('should handle errors during response sending', async () => {
                // Create test error
                const testError = new HttpError(404, 'Not found');

                // Mock res.json to throw an error
                const responseError = new Error('Response serialization failed');
                MOCK_RES.json.mockImplementation(() => {
                    throw responseError;
                });

                // Invoke errorHandler
                errorHandler(testError, MOCK_REQ, MOCK_RES, MOCK_NEXT);

                // Assert Logger.error was called for response error
                expect(Logger.error).toHaveBeenCalledWith(
                    'Error occurred while sending error response',
                    expect.objectContaining({
                        originalError: {
                            status: 404,
                            message: 'Not found'
                        },
                        responseError: {
                            name: 'Error',
                            message: 'Response serialization failed',
                            stack: expect.any(String)
                        },
                        url: '/hello',
                        method: 'GET'
                    })
                );

                // Assert next() was called with original error
                expect(MOCK_NEXT).toHaveBeenCalledWith(testError);
            });
        });
    });

    /**
     * Request Logger Middleware Test Suite
     * Tests the requestLogger middleware for correct request/response logging,
     * timing, and status-based log level determination
     */
    describe('requestLogger Middleware', () => {
        /**
         * Tests requestLogger correctly logs normal requests
         * Validates request logging, response logging, and timing calculation
         */
        describe('normal request logging', () => {
            /**
             * Test requestLogger basic functionality
             */
            function testRequestLoggerBasic() {
                it('should log incoming requests and outgoing responses', async () => {
                    // Mock high-resolution timer
                    const mockHrTime = jest.spyOn(process, 'hrtime');
                    mockHrTime.bigint = jest.fn()
                        .mockReturnValueOnce(1000000000n) // Start time (1 second in nanoseconds)
                        .mockReturnValueOnce(1025000000n); // End time (1.025 seconds)

                    // Set up request for normal endpoint
                    MOCK_REQ.path = '/hello';
                    MOCK_REQ.url = '/hello';
                    MOCK_REQ.method = 'GET';
                    MOCK_REQ.query = {};

                    // Invoke requestLogger
                    requestLogger(MOCK_REQ, MOCK_RES, MOCK_NEXT);

                    // Assert incoming request was logged
                    expect(Logger.info).toHaveBeenCalledWith(
                        'Incoming request',
                        expect.objectContaining({
                            method: 'GET',
                            url: '/hello',
                            headers: expect.objectContaining({
                                host: 'localhost:3000',
                                'user-agent': 'test-agent',
                                accept: 'text/plain'
                            })
                        })
                    );

                    // Assert next() was called
                    expect(MOCK_NEXT).toHaveBeenCalled();

                    // Simulate response completion
                    MOCK_RES.statusCode = 200;
                    MOCK_RES._triggerEvent('finish');

                    // Assert response completion was logged
                    expect(Logger.info).toHaveBeenCalledWith(
                        'Completed request',
                        expect.objectContaining({
                            method: 'GET',
                            url: '/hello',
                            statusCode: 200,
                            responseTime: '25.00ms'
                        })
                    );

                    // Restore mock
                    mockHrTime.mockRestore();
                });
            }

            /**
             * Test requestLogger with query parameters
             */
            it('should include query parameters in request logging', async () => {
                // Set up request with query parameters
                MOCK_REQ.query = { search: 'test', limit: '10' };
                MOCK_REQ.url = '/hello?search=test&limit=10';

                // Invoke requestLogger
                requestLogger(MOCK_REQ, MOCK_RES, MOCK_NEXT);

                // Assert query parameters are included in log
                expect(Logger.info).toHaveBeenCalledWith(
                    'Incoming request',
                    expect.objectContaining({
                        method: 'GET',
                        url: '/hello?search=test&limit=10',
                        query: {
                            search: 'test',
                            limit: '10'
                        }
                    })
                );
            });

            // Execute the basic request logger test
            testRequestLoggerBasic();
        });

        /**
         * Tests requestLogger correctly skips ignored paths
         * Validates that health check and static asset paths are not logged
         */
        describe('ignored path handling', () => {
            it('should skip logging for /health endpoint', async () => {
                // Set up request for health check endpoint
                MOCK_REQ.path = '/health';
                MOCK_REQ.url = '/health';

                // Invoke requestLogger
                requestLogger(MOCK_REQ, MOCK_RES, MOCK_NEXT);

                // Assert NO logging occurred
                expect(Logger.info).not.toHaveBeenCalled();
                expect(Logger.warn).not.toHaveBeenCalled();
                expect(Logger.error).not.toHaveBeenCalled();

                // Assert next() was still called
                expect(MOCK_NEXT).toHaveBeenCalled();
            });

            it('should skip logging for /favicon.ico', async () => {
                // Set up request for favicon
                MOCK_REQ.path = '/favicon.ico';
                MOCK_REQ.url = '/favicon.ico';

                // Invoke requestLogger
                requestLogger(MOCK_REQ, MOCK_RES, MOCK_NEXT);

                // Assert NO logging occurred
                expect(Logger.info).not.toHaveBeenCalled();
                expect(Logger.warn).not.toHaveBeenCalled();
                expect(Logger.error).not.toHaveBeenCalled();

                // Assert next() was still called
                expect(MOCK_NEXT).toHaveBeenCalled();
            });
        });

        /**
         * Tests requestLogger uses appropriate log levels for different response status codes
         * Validates warn/error logging for 4xx/5xx responses
         */
        describe('error status logging', () => {
            /**
             * Test requestLogger error status handling
             */
            function testRequestLoggerErrorStatus() {
                it('should use Logger.warn for 4xx status codes', async () => {
                    // Mock timing
                    const mockHrTime = jest.spyOn(process, 'hrtime');
                    mockHrTime.bigint = jest.fn()
                        .mockReturnValueOnce(1000000000n)
                        .mockReturnValueOnce(1015000000n); // 15ms response time

                    // Invoke requestLogger
                    requestLogger(MOCK_REQ, MOCK_RES, MOCK_NEXT);

                    // Simulate 404 response
                    MOCK_RES.statusCode = 404;
                    MOCK_RES._triggerEvent('finish');

                    // Assert Logger.warn was used for 4xx status
                    expect(Logger.warn).toHaveBeenCalledWith(
                        'Completed request with client error',
                        expect.objectContaining({
                            method: 'GET',
                            url: '/hello',
                            statusCode: 404,
                            responseTime: '15.00ms'
                        })
                    );

                    // Restore mock
                    mockHrTime.mockRestore();
                });

                it('should use Logger.error for 5xx status codes', async () => {
                    // Mock timing
                    const mockHrTime = jest.spyOn(process, 'hrtime');
                    mockHrTime.bigint = jest.fn()
                        .mockReturnValueOnce(1000000000n)
                        .mockReturnValueOnce(1050000000n); // 50ms response time

                    // Invoke requestLogger
                    requestLogger(MOCK_REQ, MOCK_RES, MOCK_NEXT);

                    // Simulate 500 response
                    MOCK_RES.statusCode = 500;
                    MOCK_RES._triggerEvent('finish');

                    // Assert Logger.error was used for 5xx status
                    expect(Logger.error).toHaveBeenCalledWith(
                        'Completed request with server error',
                        expect.objectContaining({
                            method: 'GET',
                            url: '/hello',
                            statusCode: 500,
                            responseTime: '50.00ms'
                        })
                    );

                    // Restore mock
                    mockHrTime.mockRestore();
                });
            }

            // Execute the error status tests
            testRequestLoggerErrorStatus();
        });

        /**
         * Tests requestLogger with response size logging
         * Validates Content-Length header inclusion in logs
         */
        describe('response metadata logging', () => {
            it('should include response size when Content-Length header is present', async () => {
                // Mock timing
                const mockHrTime = jest.spyOn(process, 'hrtime');
                mockHrTime.bigint = jest.fn()
                    .mockReturnValueOnce(1000000000n)
                    .mockReturnValueOnce(1030000000n); // 30ms response time

                // Mock res.get to return Content-Length
                MOCK_RES.get.mockImplementation((header) => {
                    if (header === 'Content-Length') return '11';
                    return undefined;
                });

                // Invoke requestLogger
                requestLogger(MOCK_REQ, MOCK_RES, MOCK_NEXT);

                // Simulate successful response
                MOCK_RES.statusCode = 200;
                MOCK_RES._triggerEvent('finish');

                // Assert response size is included
                expect(Logger.info).toHaveBeenCalledWith(
                    'Completed request',
                    expect.objectContaining({
                        method: 'GET',
                        url: '/hello',
                        statusCode: 200,
                        responseTime: '30.00ms',
                        responseSize: '11 bytes'
                    })
                );

                // Restore mock
                mockHrTime.mockRestore();
            });
        });

        /**
         * Tests requestLogger with user context
         * Validates user information inclusion when available
         */
        describe('user context logging', () => {
            it('should include user context when available', async () => {
                // Add user context to request
                MOCK_REQ.user = {
                    id: 'user123',
                    username: 'testuser'
                };

                // Invoke requestLogger
                requestLogger(MOCK_REQ, MOCK_RES, MOCK_NEXT);

                // Assert user context is included in request log
                expect(Logger.info).toHaveBeenCalledWith(
                    'Incoming request',
                    expect.objectContaining({
                        method: 'GET',
                        url: '/hello',
                        user: {
                            id: 'user123',
                            username: 'testuser'
                        }
                    })
                );

                // Simulate response completion
                MOCK_RES.statusCode = 200;
                MOCK_RES._triggerEvent('finish');

                // Assert user ID is included in response log
                expect(Logger.info).toHaveBeenCalledWith(
                    'Completed request',
                    expect.objectContaining({
                        method: 'GET',
                        url: '/hello',
                        statusCode: 200,
                        user: { id: 'user123' }
                    })
                );
            });
        });
    });

    /**
     * Integration tests for middleware interaction
     * Tests middleware behavior in common usage scenarios
     */
    describe('Middleware Integration', () => {
        /**
         * Tests middleware behavior with Express-like request flow
         */
        it('should work together in Express-like pipeline', async () => {
            // Simulate a request that goes through requestLogger then hits an error
            const testError = new HttpError(404, 'Not found');

            // First, invoke requestLogger
            requestLogger(MOCK_REQ, MOCK_RES, MOCK_NEXT);

            // Verify requestLogger called next()
            expect(MOCK_NEXT).toHaveBeenCalled();

            // Verify request was logged
            expect(Logger.info).toHaveBeenCalledWith(
                'Incoming request',
                expect.objectContaining({
                    method: 'GET',
                    url: '/hello'
                })
            );

            // Clear previous mock calls
            jest.clearAllMocks();
            setupMocks();

            // Now simulate an error and invoke errorHandler
            errorHandler(testError, MOCK_REQ, MOCK_RES, MOCK_NEXT);

            // Verify error was handled correctly
            expect(MOCK_RES.status).toHaveBeenCalledWith(404);
            expect(Logger.error).toHaveBeenCalledWith(
                'Express error handler caught error',
                expect.objectContaining({
                    status: 404,
                    message: 'Not found'
                })
            );
        });
    });

    /**
     * Edge case and error condition tests
     * Tests middleware behavior under unusual conditions
     */
    describe('Edge Cases and Error Conditions', () => {
        /**
         * Tests errorHandler with null/undefined errors
         */
        it('should handle null or undefined errors gracefully', async () => {
            // Test with null error
            errorHandler(null, MOCK_REQ, MOCK_RES, MOCK_NEXT);

            // Should wrap in InternalServerError
            expect(MOCK_RES.status).toHaveBeenCalledWith(500);
            expect(MOCK_RES.json).toHaveBeenCalledWith({
                status: 500,
                message: 'Internal Server Error',
                details: expect.objectContaining({
                    originalName: 'Error',
                    originalMessage: 'Unknown error occurred'
                }),
                stack: expect.any(String)
            });
        });

        /**
         * Tests requestLogger with missing request properties
         */
        it('should handle requests with missing properties', async () => {
            // Create request with minimal properties
            const minimalReq = {
                method: 'GET',
                path: '/test',
                url: '/test',
                headers: {},
                query: {},
                get: jest.fn(() => undefined)
            };

            // Invoke requestLogger with minimal request
            requestLogger(minimalReq, MOCK_RES, MOCK_NEXT);

            // Should still log the request
            expect(Logger.info).toHaveBeenCalledWith(
                'Incoming request',
                expect.objectContaining({
                    method: 'GET',
                    url: '/test',
                    headers: expect.any(Object)
                })
            );

            // Should call next()
            expect(MOCK_NEXT).toHaveBeenCalled();
        });
    });
});