/**
 * Integration Test Suite for Express Middleware in Node.js Tutorial Backend
 * 
 * This comprehensive integration test suite validates the real behavior and interaction
 * of core middleware components (requestLogger, notFoundHandler, errorHandler) within
 * both isolated mock contexts and running Express application instances. The suite
 * ensures proper logging, 404 handling, error handling, and middleware execution order
 * through extensive test coverage designed for educational clarity and maintainability.
 * 
 * Testing Strategy:
 * - Isolated middleware testing using mock Express contexts for unit-level validation
 * - End-to-end testing using real Express applications with Supertest for integration validation
 * - Comprehensive spy verification for logging and response method calls
 * - Environment-aware testing for both development and production configurations
 * - Edge case coverage including error propagation and middleware interaction patterns
 * 
 * Educational Value:
 * - Demonstrates best practices for Express.js middleware testing
 * - Shows proper use of Jest spies and mocks for middleware validation
 * - Illustrates integration testing patterns for Node.js applications
 * - Provides examples of comprehensive test documentation and organization
 * - Models production-ready testing approaches for middleware components
 * 
 * Key Testing Areas:
 * 1. Request Logger Middleware Integration - Logs all requests including errors and 404s
 * 2. Not Found Handler Middleware Integration - Handles unmatched routes with proper logging
 * 3. Error Handler Middleware Integration - Processes errors with environment-aware responses
 * 4. Middleware Interaction and Order - Validates proper execution sequence and flow
 * 
 * @fileoverview Comprehensive integration tests for Express middleware components
 * @author Node.js Tutorial Project
 * @version 1.0.0
 * @requires jest ^29.0.0
 * @requires express ^5.1.0
 * @requires supertest ^7.1.1
 */

// External testing dependencies for comprehensive integration testing
import express from 'express'; // v5.1.0 - Latest Express.js for modern middleware patterns
import request from 'supertest'; // v7.1.1 - HTTP testing library for integration tests

// Internal middleware imports - Components under test
import { requestLogger } from '../../../src/backend/middleware/requestLogger.js';
import { notFoundHandler } from '../../../src/backend/middleware/notFoundHandler.js';
import { errorHandler } from '../../../src/backend/middleware/errorHandler.js';

// Test helper utilities for comprehensive testing support
import { mockExpressContext } from '../../helpers/mockExpress';
import { simulateError, assertResponse } from '../../helpers/testUtils';

// Mock logger utilities to spy on logging behavior during tests
// This allows verification that logging occurs as expected without actual console output
jest.mock('../../../src/backend/utils/logger.js', () => ({
    logInfo: jest.fn(),
    logWarn: jest.fn(),
    logError: jest.fn()
}));

// Import mocked logger functions for spy assertions and verification
import { logInfo, logWarn, logError } from '../../../src/backend/utils/logger.js';

/**
 * Helper function to create and configure an Express app instance with middleware under test
 * 
 * This utility function creates a complete Express application with all middleware components
 * registered in the correct execution order for comprehensive integration testing. It provides
 * a consistent test environment for end-to-end middleware flow validation using Supertest.
 * 
 * Middleware Registration Order:
 * 1. requestLogger - First to capture all incoming requests
 * 2. Test routes - Sample endpoints for positive path testing
 * 3. Error simulation route - For testing error handling middleware
 * 4. notFoundHandler - After all routes to catch unmatched requests
 * 5. errorHandler - Last to process any errors from middleware or routes
 * 
 * Educational Value:
 * - Demonstrates proper Express middleware registration order
 * - Shows how to create test applications for integration testing
 * - Illustrates the importance of middleware sequence in Express applications
 * - Provides a reusable pattern for testing Express application configurations
 * 
 * @returns {express.Application} Configured Express app instance ready for Supertest integration testing
 * 
 * @example
 * // Usage in integration tests
 * const app = setupAppWithMiddleware();
 * const response = await request(app).get('/test').expect(200);
 * expect(response.text).toBe('Test response');
 */
function setupAppWithMiddleware(): express.Application {
    // Step 1: Create a new Express application instance
    const app = express();
    
    // Step 2: Register requestLogger as the first middleware to capture all requests
    // This ensures that even 404 and error scenarios are logged for observability
    app.use(requestLogger);
    
    // Step 3: Register test routes for positive path validation
    // These routes provide known endpoints for testing successful request processing
    app.get('/test', (req, res) => {
        res.status(200).send('Test response');
    });
    
    app.get('/hello', (req, res) => {
        res.status(200).send('Hello world');
    });
    
    // Step 4: Register error simulation route for testing error handling middleware
    // This route intentionally throws an error to test error propagation and handling
    app.get('/error', (req, res, next) => {
        const testError = new Error('Intentional test error');
        (testError as any).status = 500;
        next(testError); // Pass error to error handling middleware
    });
    
    // Step 5: Register async error route to test Express 5 promise-aware error handling
    // This demonstrates automatic error catching for rejected promises
    app.get('/async-error', async (req, res) => {
        throw new Error('Async test error'); // Automatically caught by Express 5
    });
    
    // Step 6: Register notFoundHandler after all routes to catch unmatched requests
    // This must come after all route definitions to properly handle 404 scenarios
    app.use(notFoundHandler);
    
    // Step 7: Register errorHandler as the final middleware to process all errors
    // This must be the last middleware to catch errors from all previous middleware
    app.use(errorHandler);
    
    return app;
}

/**
 * Main test suite encompassing all middleware integration testing scenarios
 * 
 * This comprehensive test suite validates the behavior of Express middleware components
 * both individually and in combination, ensuring proper functionality, logging, and
 * error handling across various scenarios and environments.
 */
describe('Express Middleware Integration Tests', () => {
    // Global test configuration and cleanup
    beforeEach(() => {
        // Clear all mock function calls before each test to ensure clean test state
        jest.clearAllMocks();
        
        // Reset NODE_ENV to development for consistent test environment
        process.env.NODE_ENV = 'development';
    });
    
    afterEach(() => {
        // Restore original NODE_ENV after each test
        delete process.env.NODE_ENV;
    });

    /**
     * Request Logger Middleware Integration Test Suite
     * 
     * Validates that requestLogger middleware correctly logs all incoming HTTP requests
     * including method, path, status code, and response time for successful requests,
     * 404 errors, and server errors. Tests both isolated middleware behavior and
     * integration within the complete Express application stack.
     */
    describe('Request Logger Middleware Integration', () => {
        
        /**
         * Test: Request logger should log standard GET requests to valid routes
         * 
         * Validates that the request logger captures and logs successful GET requests
         * with accurate timing, status codes, and request details. This test uses
         * both isolated mock testing and end-to-end application testing approaches.
         */
        it('should log a standard GET request to a valid route', async () => {
            // Isolated middleware testing with mock Express context
            const { req, res, next } = mockExpressContext({
                method: 'GET',
                url: '/hello'
            });
            
            // Simulate response completion by manually setting status code
            res.statusCode = 200;
            
            // Execute requestLogger middleware with mock context
            requestLogger(req, res, next);
            
            // Verify that next() was called to continue middleware chain
            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(); // Called without error
            
            // Simulate response completion to trigger logging
            const finishCallback = res.on.mock.calls.find((call: any[]) => call[0] === 'finish')[1];
            finishCallback();
            
            // Verify that logInfo was called with proper request details
            expect(logInfo).toHaveBeenCalledTimes(1);
            expect(logInfo).toHaveBeenCalledWith(
                expect.stringMatching(/\[GET\] \/hello 200 \d+ms/),
                expect.objectContaining({
                    method: 'GET',
                    url: '/hello',
                    status: 200,
                    responseTime: expect.any(Number)
                })
            );
        });
        
        /**
         * Test: Request logger should log requests resulting in 404 Not Found
         * 
         * Ensures that unmatched routes are properly logged by the request logger
         * middleware, even when they result in 404 responses from the notFoundHandler.
         */
        it('should log a request resulting in a 404 (unmatched route)', async () => {
            // End-to-end testing with real Express application
            const app = setupAppWithMiddleware();
            
            // Make request to non-existent endpoint
            const response = await request(app)
                .get('/nonexistent')
                .expect(404);
            
            // Verify 404 response structure
            expect(response.body).toEqual({
                error: true,
                message: 'Resource not found',
                details: expect.objectContaining({
                    method: 'GET',
                    path: '/nonexistent'
                })
            });
            
            // Verify that request was logged by requestLogger
            expect(logInfo).toHaveBeenCalledWith(
                expect.stringMatching(/\[GET\] \/nonexistent 404 \d+ms/),
                expect.objectContaining({
                    method: 'GET',
                    url: '/nonexistent',
                    status: 404,
                    responseTime: expect.any(Number)
                })
            );
            
            // Verify that 404 was also logged by notFoundHandler
            expect(logWarn).toHaveBeenCalledWith(
                '404 Not Found - Request to undefined endpoint',
                expect.objectContaining({
                    method: 'GET',
                    path: '/nonexistent'
                })
            );
        });
        
        /**
         * Test: Request logger should log requests that trigger errors
         * 
         * Validates that the request logger captures requests that result in server
         * errors, ensuring comprehensive logging coverage for all request outcomes.
         */
        it('should log a request that triggers an error and is handled by errorHandler', async () => {
            // End-to-end testing with error simulation
            const app = setupAppWithMiddleware();
            
            // Make request to error-generating endpoint
            const response = await request(app)
                .get('/error')
                .expect(500);
            
            // Verify error response structure
            expect(response.body).toEqual({
                error: true,
                message: 'Intentional test error',
                details: expect.objectContaining({
                    originalMessage: 'Intentional test error',
                    statusCode: 500
                })
            });
            
            // Verify that request was logged by requestLogger
            expect(logInfo).toHaveBeenCalledWith(
                expect.stringMatching(/\[GET\] \/error 500 \d+ms/),
                expect.objectContaining({
                    method: 'GET',
                    url: '/error',
                    status: 500,
                    responseTime: expect.any(Number)
                })
            );
            
            // Verify that error was logged by errorHandler
            expect(logError).toHaveBeenCalledWith(
                'Request processing failed - Error handled by errorHandler middleware',
                expect.objectContaining({
                    errorMessage: 'Intentional test error',
                    statusCode: 500
                })
            );
        });
        
        /**
         * Test: Request logger should handle timing edge cases and fallback scenarios
         * 
         * Tests the request logger's error resilience and timing accuracy under
         * various conditions including timing edge cases and potential logging failures.
         */
        it('should handle logging errors gracefully with fallback timing', () => {
            // Create mock context with potential edge case scenarios
            const { req, res, next } = mockExpressContext({
                method: 'POST',
                url: '/test-fallback'
            });
            
            res.statusCode = 201;
            
            // Mock process.hrtime to simulate timing edge case
            const originalHrtime = process.hrtime;
            process.hrtime = jest.fn()
                .mockReturnValueOnce([0, 0])  // Start time
                .mockReturnValueOnce([0, 1000000]); // End time (1ms)
            
            // Execute middleware
            requestLogger(req, res, next);
            
            // Trigger response completion
            const finishCallback = res.on.mock.calls.find((call: any[]) => call[0] === 'finish')[1];
            finishCallback();
            
            // Verify logging occurred with calculated timing
            expect(logInfo).toHaveBeenCalledWith(
                expect.stringMatching(/\[POST\] \/test-fallback 201 1ms/),
                expect.objectContaining({
                    method: 'POST',
                    url: '/test-fallback',
                    status: 201,
                    responseTime: 1
                })
            );
            
            // Restore original hrtime
            process.hrtime = originalHrtime;
        });
    });

    /**
     * Not Found Handler Middleware Integration Test Suite
     * 
     * Validates that notFoundHandler middleware correctly intercepts unmatched routes,
     * logs 404 events with appropriate details, and returns standardized error responses
     * with proper HTTP status codes and response formatting.
     */
    describe('Not Found Handler Middleware Integration', () => {
        
        /**
         * Test: Not found handler should return 404 and correct error structure
         * 
         * Ensures that unmatched routes receive proper 404 responses with standardized
         * error structure and appropriate logging for observability.
         */
        it('should return 404 and correct error structure for an unmatched route', () => {
            // Isolated middleware testing with mock context
            const { req, res } = mockExpressContext({
                method: 'GET',
                url: '/nonexistent-endpoint'
            });
            
            // Set up mock User-Agent and IP for comprehensive logging
            req.get = jest.fn((header: string) => {
                if (header === 'User-Agent') return 'Jest Test Runner';
                return undefined;
            });
            req.ip = '127.0.0.1';
            
            // Execute notFoundHandler middleware
            notFoundHandler(req, res, undefined as any);
            
            // Verify that proper warning was logged
            expect(logWarn).toHaveBeenCalledTimes(1);
            expect(logWarn).toHaveBeenCalledWith(
                '404 Not Found - Request to undefined endpoint',
                expect.objectContaining({
                    method: 'GET',
                    path: '/nonexistent-endpoint',
                    userAgent: 'Jest Test Runner',
                    remoteAddress: '127.0.0.1'
                })
            );
            
            // Verify response formatting using assertResponse helper
            assertResponse(res, 404, {
                error: true,
                message: 'Resource not found',
                details: expect.objectContaining({
                    method: 'GET',
                    path: '/nonexistent-endpoint'
                })
            });
        });
        
        /**
         * Test: Not found handler should log 404 events with comprehensive details
         * 
         * Validates that 404 events are logged with complete context information
         * including HTTP method, path, user agent, and client IP address.
         */
        it('should log the 404 event with method and path details', async () => {
            // End-to-end testing for comprehensive logging validation
            const app = setupAppWithMiddleware();
            
            // Make request with custom headers for logging verification
            await request(app)
                .get('/unknown/path')
                .set('User-Agent', 'Integration Test Client')
                .expect(404);
            
            // Verify comprehensive 404 logging
            expect(logWarn).toHaveBeenCalledWith(
                '404 Not Found - Request to undefined endpoint',
                expect.objectContaining({
                    method: 'GET',
                    path: '/unknown/path',
                    timestamp: expect.any(String),
                    userAgent: 'Integration Test Client'
                })
            );
        });
        
        /**
         * Test: Not found handler should handle various HTTP methods consistently
         * 
         * Ensures that 404 handling works correctly for all HTTP methods, not just GET,
         * and that logging captures the appropriate method information.
         */
        it('should handle 404 for different HTTP methods consistently', async () => {
            const app = setupAppWithMiddleware();
            
            // Test POST request to non-existent endpoint
            await request(app)
                .post('/nonexistent')
                .expect(404);
            
            // Test PUT request to non-existent endpoint  
            await request(app)
                .put('/nonexistent')
                .expect(404);
            
            // Test DELETE request to non-existent endpoint
            await request(app)
                .delete('/nonexistent')
                .expect(404);
            
            // Verify that all methods were logged correctly
            expect(logWarn).toHaveBeenCalledTimes(3);
            
            // Verify POST logging
            expect(logWarn).toHaveBeenNthCalledWith(1,
                '404 Not Found - Request to undefined endpoint',
                expect.objectContaining({
                    method: 'POST',
                    path: '/nonexistent'
                })
            );
            
            // Verify PUT logging
            expect(logWarn).toHaveBeenNthCalledWith(2,
                '404 Not Found - Request to undefined endpoint',
                expect.objectContaining({
                    method: 'PUT',
                    path: '/nonexistent'
                })
            );
            
            // Verify DELETE logging
            expect(logWarn).toHaveBeenNthCalledWith(3,
                '404 Not Found - Request to undefined endpoint',
                expect.objectContaining({
                    method: 'DELETE',
                    path: '/nonexistent'
                })
            );
        });
    });

    /**
     * Error Handler Middleware Integration Test Suite
     * 
     * Validates that errorHandler middleware correctly processes synchronous and
     * asynchronous errors, logs comprehensive error details, and returns appropriate
     * error responses with environment-aware detail exposure.
     */
    describe('Error Handler Middleware Integration', () => {
        
        /**
         * Test: Error handler should catch synchronous errors and format responses
         * 
         * Ensures that synchronous errors thrown in route handlers are properly
         * caught, logged, and formatted into standardized error responses.
         */
        it('should catch synchronous errors thrown in a route and return a formatted error response', () => {
            // Create test error with specific properties
            const testError = simulateError('Synchronous test error', 400, {
                code: 'VALIDATION_ERROR',
                field: 'email'
            });
            
            // Isolated error handler testing with mock context
            const { req, res } = mockExpressContext({
                method: 'POST',
                url: '/test-error'
            });
            
            // Set up request context for logging
            req.params = { id: '123' };
            req.query = { filter: 'active' };
            req.ip = '192.168.1.100';
            
            // Execute errorHandler middleware
            errorHandler(testError, req, res, undefined as any);
            
            // Verify comprehensive error logging
            expect(logError).toHaveBeenCalledTimes(1);
            expect(logError).toHaveBeenCalledWith(
                'Request processing failed - Error handled by errorHandler middleware',
                expect.objectContaining({
                    errorMessage: 'Synchronous test error',
                    errorName: 'Error',
                    statusCode: 400,
                    request: expect.objectContaining({
                        method: 'POST',
                        url: '/test-error',
                        params: { id: '123' },
                        query: { filter: 'active' },
                        ip: '192.168.1.100'
                    }),
                    stack: expect.stringContaining('Error: Synchronous test error')
                })
            );
            
            // Verify error response formatting
            assertResponse(res, 400, {
                error: true,
                message: 'Synchronous test error',
                details: expect.objectContaining({
                    originalMessage: 'Synchronous test error',
                    statusCode: 400,
                    stack: expect.stringContaining('Error: Synchronous test error')
                })
            });
        });
        
        /**
         * Test: Error handler should catch errors passed via next(err)
         * 
         * Validates that errors passed through the Express error handling mechanism
         * via next(err) are properly processed and formatted.
         */
        it('should catch errors passed via next(err) and return a formatted error response', async () => {
            // End-to-end testing with error propagation
            const app = setupAppWithMiddleware();
            
            // Test the error endpoint that calls next(err)
            const response = await request(app)
                .get('/error')
                .expect(500);
            
            // Verify error response structure
            expect(response.body).toEqual({
                error: true,
                message: 'Intentional test error',
                details: expect.objectContaining({
                    originalMessage: 'Intentional test error',
                    statusCode: 500,
                    name: 'Error'
                })
            });
            
            // Verify error logging occurred
            expect(logError).toHaveBeenCalledWith(
                'Request processing failed - Error handled by errorHandler middleware',
                expect.objectContaining({
                    errorMessage: 'Intentional test error',
                    statusCode: 500
                })
            );
        });
        
        /**
         * Test: Error handler should handle Express 5 automatic promise rejection
         * 
         * Tests Express 5's promise-aware error handling capability where rejected
         * promises in async route handlers are automatically caught.
         */
        it('should catch async errors automatically with Express 5 promise handling', async () => {
            const app = setupAppWithMiddleware();
            
            // Test async error endpoint
            const response = await request(app)
                .get('/async-error')
                .expect(500);
            
            // Verify async error response
            expect(response.body).toEqual({
                error: true,
                message: 'Async test error',
                details: expect.objectContaining({
                    originalMessage: 'Async test error',
                    statusCode: 500
                })
            });
            
            // Verify async error logging
            expect(logError).toHaveBeenCalledWith(
                'Request processing failed - Error handled by errorHandler middleware',
                expect.objectContaining({
                    errorMessage: 'Async test error'
                })
            );
        });
        
        /**
         * Test: Error handler should not leak stack traces in production mode
         * 
         * Ensures that sensitive error details like stack traces are not exposed
         * to clients in production environments for security purposes.
         */
        it('should not leak stack traces or internal details in production mode', () => {
            // Set production environment
            process.env.NODE_ENV = 'production';
            
            // Create error with sensitive information
            const sensitiveError = simulateError('Database connection failed', 500, {
                password: 'secret123',
                connectionString: 'mongodb://admin:secret@localhost:27017/prod'
            });
            
            const { req, res } = mockExpressContext({
                method: 'GET',
                url: '/secure-endpoint'
            });
            
            // Execute error handler in production mode
            errorHandler(sensitiveError, req, res, undefined as any);
            
            // Verify that response uses generic error message in production
            assertResponse(res, 500, {
                error: true,
                message: 'An unexpected error occurred'
                // Note: No details property should be present in production
            });
            
            // Verify that sensitive details are not in response
            expect(res.body.details).toBeUndefined();
            expect(res.body.stack).toBeUndefined();
            
            // Verify that error is still logged (but not exposed to client)
            expect(logError).toHaveBeenCalledWith(
                'Request processing failed - Error handled by errorHandler middleware',
                expect.objectContaining({
                    errorMessage: 'Database connection failed',
                    statusCode: 500
                })
            );
        });
        
        /**
         * Test: Error handler should process errors without status codes
         * 
         * Validates that errors without explicit status codes default to 500
         * Internal Server Error and are handled appropriately.
         */
        it('should handle errors without status codes and default to 500', () => {
            // Create error without status code
            const genericError = new Error('Generic error without status');
            
            const { req, res } = mockExpressContext({
                method: 'GET',
                url: '/generic-error'
            });
            
            // Execute error handler
            errorHandler(genericError, req, res, undefined as any);
            
            // Verify default 500 status code is used
            assertResponse(res, 500, {
                error: true,
                message: 'Generic error without status',
                details: expect.objectContaining({
                    statusCode: 500,
                    originalMessage: 'Generic error without status'
                })
            });
            
            // Verify logging with default status
            expect(logError).toHaveBeenCalledWith(
                'Request processing failed - Error handled by errorHandler middleware',
                expect.objectContaining({
                    statusCode: 500,
                    errorMessage: 'Generic error without status'
                })
            );
        });
    });

    /**
     * Middleware Interaction and Order Test Suite
     * 
     * Validates that middleware components execute in the correct order and that
     * error and 404 handlers are only triggered under appropriate conditions.
     * Tests the complete middleware pipeline flow and interaction patterns.
     */
    describe('Middleware Interaction and Order', () => {
        
        /**
         * Test: Middleware execution order for successful requests
         * 
         * Ensures that requestLogger executes before route handlers and that
         * 404/error handlers are not triggered for successful requests.
         */
        it('should execute requestLogger before route and error/404 handlers', async () => {
            const app = setupAppWithMiddleware();
            
            // Make successful request to test endpoint
            const response = await request(app)
                .get('/hello')
                .expect(200);
            
            // Verify successful response
            expect(response.text).toBe('Hello world');
            
            // Verify that only request logging occurred (no warnings or errors)
            expect(logInfo).toHaveBeenCalledTimes(1);
            expect(logInfo).toHaveBeenCalledWith(
                expect.stringMatching(/\[GET\] \/hello 200 \d+ms/),
                expect.objectContaining({
                    method: 'GET',
                    url: '/hello',
                    status: 200
                })
            );
            
            // Verify that 404 and error handlers were not triggered
            expect(logWarn).not.toHaveBeenCalled();
            expect(logError).not.toHaveBeenCalled();
        });
        
        /**
         * Test: Not found handler execution after all routes
         * 
         * Validates that notFoundHandler is only triggered after all route
         * matching has been attempted and no routes match the request.
         */
        it('should ensure notFoundHandler is only called after all routes', async () => {
            const app = setupAppWithMiddleware();
            
            // Test that defined routes work normally
            await request(app).get('/test').expect(200);
            await request(app).get('/hello').expect(200);
            
            // Verify only request logging occurred for successful routes
            expect(logInfo).toHaveBeenCalledTimes(2);
            expect(logWarn).not.toHaveBeenCalled();
            expect(logError).not.toHaveBeenCalled();
            
            // Clear mocks for focused testing
            jest.clearAllMocks();
            
            // Test that undefined route triggers 404 handler
            await request(app).get('/undefined-route').expect(404);
            
            // Verify that both request logging and 404 handling occurred
            expect(logInfo).toHaveBeenCalledTimes(1); // Request logging
            expect(logWarn).toHaveBeenCalledTimes(1); // 404 logging
            expect(logError).not.toHaveBeenCalled();   // No error occurred
        });
        
        /**
         * Test: Error handler execution for error conditions only
         * 
         * Ensures that errorHandler is only triggered when actual errors occur
         * and not for successful requests or 404 scenarios.
         */
        it('should ensure errorHandler is only called for errors', async () => {
            const app = setupAppWithMiddleware();
            
            // Test successful request - should not trigger error handler
            await request(app).get('/test').expect(200);
            expect(logError).not.toHaveBeenCalled();
            
            // Test 404 request - should not trigger error handler
            await request(app).get('/nonexistent').expect(404);
            expect(logError).not.toHaveBeenCalled();
            
            // Clear previous logs for focused testing
            jest.clearAllMocks();
            
            // Test error request - should trigger error handler
            await request(app).get('/error').expect(500);
            
            // Verify that error handler was triggered
            expect(logError).toHaveBeenCalledTimes(1);
            expect(logError).toHaveBeenCalledWith(
                'Request processing failed - Error handled by errorHandler middleware',
                expect.objectContaining({
                    errorMessage: 'Intentional test error',
                    statusCode: 500
                })
            );
        });
        
        /**
         * Test: Complete middleware pipeline flow validation
         * 
         * Tests the entire middleware pipeline from request to response,
         * ensuring proper flow through all middleware components.
         */
        it('should execute complete middleware pipeline in correct order', async () => {
            const app = setupAppWithMiddleware();
            
            // Track execution order by monitoring all logging calls
            const executionOrder: string[] = [];
            
            // Wrap logger functions to track execution order
            (logInfo as jest.Mock).mockImplementation((...args) => {
                executionOrder.push('REQUEST_LOGGED');
            });
            
            (logWarn as jest.Mock).mockImplementation((...args) => {
                executionOrder.push('404_LOGGED');
            });
            
            (logError as jest.Mock).mockImplementation((...args) => {
                executionOrder.push('ERROR_LOGGED');
            });
            
            // Test 1: Successful request flow
            await request(app).get('/hello').expect(200);
            expect(executionOrder).toEqual(['REQUEST_LOGGED']);
            
            // Reset for next test
            executionOrder.length = 0;
            
            // Test 2: 404 request flow
            await request(app).get('/nonexistent').expect(404);
            expect(executionOrder).toEqual(['404_LOGGED', 'REQUEST_LOGGED']);
            
            // Reset for next test
            executionOrder.length = 0;
            
            // Test 3: Error request flow
            await request(app).get('/error').expect(500);
            expect(executionOrder).toEqual(['ERROR_LOGGED', 'REQUEST_LOGGED']);
        });
        
        /**
         * Test: Middleware error propagation and handling
         * 
         * Validates that errors are properly propagated through the middleware
         * chain and handled by the appropriate error handling middleware.
         */
        it('should properly propagate errors through middleware chain', () => {
            // Create error with custom properties
            const customError = simulateError('Middleware propagation test', 422, {
                code: 'CUSTOM_ERROR',
                details: 'Test error propagation'
            });
            
            const { req, res, next } = mockExpressContext({
                method: 'POST',
                url: '/middleware-test'
            });
            
            // Simulate middleware that propagates error
            const testMiddleware = (error: Error, req: any, res: any, next: any) => {
                // Add additional context to error
                (error as any).middleware = 'test-middleware';
                next(error); // Propagate to error handler
            };
            
            // Execute middleware chain simulation
            testMiddleware(customError, req, res, (err: Error) => {
                // This simulates the error being passed to errorHandler
                errorHandler(err, req, res, undefined as any);
            });
            
            // Verify error was processed with additional context
            expect(logError).toHaveBeenCalledWith(
                'Request processing failed - Error handled by errorHandler middleware',
                expect.objectContaining({
                    errorMessage: 'Middleware propagation test',
                    statusCode: 422
                })
            );
            
            // Verify response formatting
            assertResponse(res, 422, {
                error: true,
                message: 'Middleware propagation test',
                details: expect.objectContaining({
                    statusCode: 422,
                    originalMessage: 'Middleware propagation test'
                })
            });
        });
    });

    /**
     * Environment-Specific Behavior Test Suite
     * 
     * Validates that middleware components behave appropriately in different
     * environments (development, test, production) with proper detail exposure
     * and security considerations.
     */
    describe('Environment-Specific Behavior', () => {
        
        /**
         * Test: Development environment error detail exposure
         * 
         * Ensures that development environments include detailed error information
         * including stack traces and request context for debugging purposes.
         */
        it('should include detailed error information in development environment', () => {
            process.env.NODE_ENV = 'development';
            
            const detailError = simulateError('Development error', 500);
            const { req, res } = mockExpressContext({
                method: 'GET',
                url: '/dev-test',
                headers: { 'X-Custom-Header': 'test-value' }
            });
            
            errorHandler(detailError, req, res, undefined as any);
            
            // Verify detailed response in development
            expect(res.body).toEqual({
                error: true,
                message: 'Development error',
                details: expect.objectContaining({
                    stack: expect.stringContaining('Development error'),
                    originalMessage: 'Development error',
                    statusCode: 500,
                    request: expect.objectContaining({
                        method: 'GET',
                        url: '/dev-test'
                    })
                })
            });
        });
        
        /**
         * Test: Production environment security measures
         * 
         * Validates that production environments exclude sensitive information
         * and provide only safe, generic error responses to clients.
         */
        it('should exclude sensitive information in production environment', () => {
            process.env.NODE_ENV = 'production';
            
            const sensitiveError = simulateError('Sensitive error with details', 500);
            const { req, res } = mockExpressContext();
            
            errorHandler(sensitiveError, req, res, undefined as any);
            
            // Verify minimal response in production
            expect(res.body).toEqual({
                error: true,
                message: 'An unexpected error occurred'
                // No details property should be present
            });
            
            // Verify no sensitive details are exposed
            expect(res.body.details).toBeUndefined();
            expect(res.body.stack).toBeUndefined();
            expect(res.body.request).toBeUndefined();
        });
        
        /**
         * Test: Test environment behavior consistency
         * 
         * Ensures that test environments behave consistently with development
         * for debugging while maintaining proper test isolation.
         */
        it('should behave consistently in test environment', () => {
            process.env.NODE_ENV = 'test';
            
            const testError = simulateError('Test environment error', 400);
            const { req, res } = mockExpressContext();
            
            errorHandler(testError, req, res, undefined as any);
            
            // Verify test environment includes details like development
            expect(res.body).toEqual({
                error: true,
                message: 'Test environment error',
                details: expect.objectContaining({
                    originalMessage: 'Test environment error',
                    statusCode: 400,
                    stack: expect.stringContaining('Test environment error')
                })
            });
        });
    });

    /**
     * Edge Cases and Error Resilience Test Suite
     * 
     * Tests middleware behavior under edge conditions, error scenarios,
     * and unusual input to ensure robust operation and graceful degradation.
     */
    describe('Edge Cases and Error Resilience', () => {
        
        /**
         * Test: Request logger resilience to missing request properties
         * 
         * Validates that the request logger handles missing or undefined
         * request properties gracefully without causing application errors.
         */
        it('should handle missing request properties gracefully', () => {
            const { req, res, next } = mockExpressContext();
            
            // Remove standard properties to test edge cases
            delete req.method;
            delete req.originalUrl;
            delete req.url;
            
            res.statusCode = 200;
            
            // Execute requestLogger with missing properties
            requestLogger(req, res, next);
            
            // Verify middleware continues execution
            expect(next).toHaveBeenCalledTimes(1);
            
            // Trigger logging
            const finishCallback = res.on.mock.calls.find((call: any[]) => call[0] === 'finish')[1];
            finishCallback();
            
            // Verify logging occurred with fallback values
            expect(logInfo).toHaveBeenCalledWith(
                expect.stringMatching(/\[UNKNOWN\] \/ 200 \d+ms/),
                expect.objectContaining({
                    method: 'UNKNOWN',
                    url: '/',
                    status: 200
                })
            );
        });
        
        /**
         * Test: Error handler with malformed error objects
         * 
         * Ensures error handler can process malformed or unusual error objects
         * without causing secondary errors or application crashes.
         */
        it('should handle malformed error objects safely', () => {
            // Create malformed error object
            const malformedError: any = {
                message: 'Malformed error',
                // Missing standard Error properties
                toString: () => 'Custom error string'
            };
            
            const { req, res } = mockExpressContext();
            
            // Execute error handler with malformed error
            errorHandler(malformedError, req, res, undefined as any);
            
            // Verify error is handled gracefully
            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({
                error: true,
                message: 'Malformed error',
                details: expect.objectContaining({
                    originalMessage: 'Malformed error',
                    statusCode: 500
                })
            });
            
            // Verify logging occurred
            expect(logError).toHaveBeenCalledTimes(1);
        });
        
        /**
         * Test: Not found handler with unusual request headers
         * 
         * Tests not found handler behavior with missing or unusual request
         * headers to ensure robust operation under various client conditions.
         */
        it('should handle requests with missing headers gracefully', () => {
            const { req, res } = mockExpressContext({
                url: '/missing-headers'
            });
            
            // Remove header-related properties
            req.get = jest.fn(() => undefined);
            delete req.ip;
            delete req.connection;
            
            // Execute notFoundHandler
            notFoundHandler(req, res, undefined as any);
            
            // Verify logging with fallback values
            expect(logWarn).toHaveBeenCalledWith(
                '404 Not Found - Request to undefined endpoint',
                expect.objectContaining({
                    method: 'GET',
                    path: '/missing-headers',
                    userAgent: 'Unknown',
                    remoteAddress: 'Unknown'
                })
            );
            
            // Verify response is still formatted correctly
            assertResponse(res, 404, {
                error: true,
                message: 'Resource not found',
                details: expect.objectContaining({
                    method: 'GET',
                    path: '/missing-headers'
                })
            });
        });
    });
});