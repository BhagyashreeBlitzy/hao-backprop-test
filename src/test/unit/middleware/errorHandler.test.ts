/**
 * Unit Tests for Express Error Handling Middleware
 * 
 * This test suite provides comprehensive validation of the errorHandler middleware,
 * ensuring that it correctly logs errors, formats error responses, handles different
 * error types and status codes, and never leaks sensitive information in production.
 * 
 * Test Coverage:
 * - Error logging verification with proper message and metadata
 * - Response formatting with appropriate status codes and messages
 * - Environment-specific behavior (development vs production)
 * - Security validation (no information leakage in production)
 * - Edge cases and error object variations
 * - Middleware behavior (next() function handling)
 * 
 * Testing Strategy:
 * - Uses Jest as the test runner for consistency with the project
 * - Leverages mockExpressContext for simulating Express req/res/next
 * - Uses simulateError and assertResponse for DRY test patterns
 * - Mocks external dependencies (logger) for isolated unit testing
 * - Tests both production and development environments through NODE_ENV manipulation
 * 
 * Educational Value:
 * - Demonstrates best practices for testing Express middleware
 * - Shows how to mock Express contexts and external dependencies
 * - Illustrates environment-aware testing patterns
 * - Provides examples of comprehensive error handling test coverage
 * 
 * @fileoverview Unit tests for Express error handling middleware
 * @author Node.js Tutorial Project
 * @version 1.0.0
 * @requires jest ^29.0.0
 */

// Import Jest testing framework for mocking, spying, and assertions
import * as jest from 'jest'; // v29.0.0

// Import the errorHandler middleware under test
import { errorHandler } from '../../../backend/middleware/errorHandler.js';

// Import test helper utilities for mocking Express context and error simulation
import { mockExpressContext } from '../../helpers/mockExpress';
import { simulateError, assertResponse } from '../../helpers/testUtils';

// Store original environment for restoration after tests
let originalEnv: string | undefined;

/**
 * Main test suite for the errorHandler middleware
 * 
 * This describe block contains all unit tests for the Express error handling middleware,
 * validating its behavior across different scenarios, environments, and error types.
 * The tests ensure proper error logging, response formatting, security practices,
 * and integration with the Express.js middleware architecture.
 */
describe('errorHandler middleware', () => {
    // Set up test environment before all tests
    beforeAll(() => {
        // Store the original NODE_ENV value for restoration after tests
        originalEnv = process.env.NODE_ENV;
        
        // Mock the logger module to isolate the errorHandler from external dependencies
        // This allows us to verify logging behavior without actual console output
        jest.mock('../../../backend/utils/logger.js', () => ({
            logError: jest.fn()
        }));
    });

    // Clean up test environment after all tests
    afterAll(() => {
        // Restore the original NODE_ENV to prevent side effects on other tests
        if (originalEnv !== undefined) {
            process.env.NODE_ENV = originalEnv;
        } else {
            delete process.env.NODE_ENV;
        }
        
        // Clear all mocks to prevent interference with other test files
        jest.clearAllMocks();
        
        // Restore original module implementations
        jest.restoreAllMocks();
    });

    // Clear mocks before each test to ensure test isolation
    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Test: Production environment error handling
     * 
     * Verifies that in production, errorHandler returns a 500 status and generic error message
     * without leaking stack traces, error details, or internal information to clients.
     * This test validates security practices for production deployments.
     */
    test('Should return 500 and generic error message for unhandled errors in production', () => {
        // Set environment to production to test security behavior
        process.env.NODE_ENV = 'production';
        
        // Create mock Express context (req, res, next)
        const { req, res, next } = mockExpressContext();
        
        // Simulate a generic error that would occur in production
        const testError = simulateError('Internal database connection failed');
        
        // Invoke the errorHandler middleware with the simulated error
        errorHandler(testError, req, res, next);
        
        // Assert that response has 500 status and generic error message
        assertResponse(res, 500, {
            error: true,
            message: 'An unexpected error occurred'
        });
        
        // Verify that no sensitive information is included in the response
        expect(res.body.details).toBeUndefined();
        expect(res.body.stack).toBeUndefined();
        expect(res.body.originalMessage).toBeUndefined();
        
        // Verify that next() was not called (error was handled)
        expect(next).not.toHaveBeenCalled();
    });

    /**
     * Test: Custom error status and message handling
     * 
     * Verifies that errorHandler correctly uses the status code and message from
     * custom error objects, allowing for specific HTTP error responses while
     * maintaining security practices in production.
     */
    test('Should return provided status code and message for custom errors', () => {
        // Set environment to production to ensure generic message is used
        process.env.NODE_ENV = 'production';
        
        // Create mock Express context
        const { req, res, next } = mockExpressContext();
        
        // Simulate a custom error with specific status code and message
        const customError = simulateError('Resource not found', 404);
        
        // Invoke the errorHandler with the custom error
        errorHandler(customError, req, res, next);
        
        // Assert that response uses the custom status code but generic message in production
        assertResponse(res, 404, {
            error: true,
            message: 'An unexpected error occurred' // Generic message in production
        });
        
        // Verify that next() was not called
        expect(next).not.toHaveBeenCalled();
    });

    /**
     * Test: Development environment error details
     * 
     * Verifies that in development, errorHandler includes stack trace, error details,
     * and request context in the error response for debugging purposes. This test
     * ensures developers have access to comprehensive error information.
     */
    test('Should include stack trace and details in development environment', () => {
        // Set environment to development to enable detailed error information
        process.env.NODE_ENV = 'development';
        
        // Create mock Express context with sample request properties
        const { req, res, next } = mockExpressContext({
            method: 'GET',
            url: '/hello',
            headers: { 'User-Agent': 'Test Browser' }
        });
        
        // Simulate an error with custom properties
        const developmentError = simulateError('Detailed error for debugging', 500, {
            code: 'DB_CONNECTION_ERROR',
            details: 'Connection timeout after 5000ms'
        });
        
        // Invoke the errorHandler with the development error
        errorHandler(developmentError, req, res, next);
        
        // Assert that response includes the actual error message in development
        assertResponse(res, 500, {
            error: true,
            message: 'Detailed error for debugging',
            details: expect.objectContaining({
                stack: expect.any(String),
                originalMessage: 'Detailed error for debugging',
                name: 'Error',
                statusCode: 500,
                request: expect.objectContaining({
                    method: 'GET',
                    url: '/hello',
                    userAgent: 'Test Browser'
                }),
                timestamp: expect.any(String)
            })
        });
        
        // Verify that detailed information is included in development
        expect(res.body.details.stack).toBeDefined();
        expect(res.body.details.request).toBeDefined();
        
        // Verify that next() was not called
        expect(next).not.toHaveBeenCalled();
    });

    /**
     * Test: Error logging functionality
     * 
     * Verifies that errorHandler calls logError with the correct error message and
     * metadata information, ensuring all errors are properly captured for monitoring,
     * debugging, and security analysis.
     */
    test('Should log errors using logError with correct message and meta', () => {
        // Import the mocked logger to verify its call behavior
        const { logError } = require('../../../backend/utils/logger.js');
        
        // Set environment to development for comprehensive logging
        process.env.NODE_ENV = 'development';
        
        // Create mock Express context with request information
        const { req, res, next } = mockExpressContext({
            method: 'POST',
            url: '/hello',
            params: { id: '123' },
            query: { filter: 'active' }
        });
        
        // Simulate an error with additional properties
        const errorWithProperties = simulateError('Database query failed', 500, {
            code: 'QUERY_ERROR',
            errno: -1,
            syscall: 'connect'
        });
        
        // Invoke the errorHandler
        errorHandler(errorWithProperties, req, res, next);
        
        // Verify that logError was called with correct parameters
        expect(logError).toHaveBeenCalledTimes(1);
        expect(logError).toHaveBeenCalledWith(
            'Request processing failed - Error handled by errorHandler middleware',
            expect.objectContaining({
                errorMessage: 'Database query failed',
                errorName: 'Error',
                statusCode: 500,
                request: expect.objectContaining({
                    method: 'POST',
                    url: '/hello',
                    params: { id: '123' },
                    query: { filter: 'active' }
                }),
                stack: expect.any(String),
                errorDetails: expect.any(Object),
                errorCode: 'QUERY_ERROR',
                errno: -1,
                syscall: 'connect'
            })
        );
    });

    /**
     * Test: Next function handling
     * 
     * Verifies that errorHandler does not call next() after handling an error,
     * ensuring that the response is properly terminated and no additional
     * middleware or error handlers are invoked.
     */
    test('Should not call next() after handling error (response ends)', () => {
        // Set environment to production
        process.env.NODE_ENV = 'production';
        
        // Create mock Express context
        const { req, res, next } = mockExpressContext();
        
        // Simulate a standard error
        const error = simulateError('Standard error');
        
        // Invoke the errorHandler
        errorHandler(error, req, res, next);
        
        // Verify that next() was not called
        expect(next).not.toHaveBeenCalled();
        
        // Verify that response was properly formatted and sent
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            error: true,
            message: 'An unexpected error occurred'
        }));
    });

    /**
     * Test: Production security sanitization
     * 
     * Verifies that in production, errorHandler does not include stack traces,
     * internal error details, or sensitive information in the response, ensuring
     * security best practices and preventing information disclosure attacks.
     */
    test('Should sanitize error details in production (no stack, no internal info)', () => {
        // Set environment to production
        process.env.NODE_ENV = 'production';
        
        // Create mock Express context
        const { req, res, next } = mockExpressContext();
        
        // Simulate an error with sensitive internal information
        const sensitiveError = simulateError('Database connection string: postgres://user:pass@host/db', 500, {
            internalCode: 'DB_AUTH_FAILURE',
            stack: 'Error: Database connection failed\n    at connect (/app/db.js:25:15)',
            connectionDetails: {
                host: 'internal-db.company.com',
                port: 5432,
                credentials: 'admin:secretpassword'
            }
        });
        
        // Invoke the errorHandler
        errorHandler(sensitiveError, req, res, next);
        
        // Assert that response contains only safe, generic information
        assertResponse(res, 500, {
            error: true,
            message: 'An unexpected error occurred'
        });
        
        // Verify that no sensitive information is leaked
        expect(res.body.details).toBeUndefined();
        expect(res.body.stack).toBeUndefined();
        expect(res.body.internalCode).toBeUndefined();
        expect(res.body.connectionDetails).toBeUndefined();
        expect(res.body.originalMessage).toBeUndefined();
        
        // Ensure the response does not contain any part of the sensitive error message
        expect(JSON.stringify(res.body)).not.toContain('Database connection string');
        expect(JSON.stringify(res.body)).not.toContain('postgres://');
        expect(JSON.stringify(res.body)).not.toContain('secretpassword');
    });

    /**
     * Test: Graceful handling of incomplete error objects
     * 
     * Verifies that errorHandler gracefully handles error objects that lack
     * standard properties like message or status, defaulting to appropriate
     * fallback values while maintaining consistent response behavior.
     */
    test('Should handle errors with no message or status gracefully', () => {
        // Set environment to production
        process.env.NODE_ENV = 'production';
        
        // Create mock Express context
        const { req, res, next } = mockExpressContext();
        
        // Create a minimal error object without message or status
        const incompleteError = new Error();
        delete (incompleteError as any).message;
        delete (incompleteError as any).status;
        delete (incompleteError as any).statusCode;
        
        // Invoke the errorHandler with the incomplete error
        errorHandler(incompleteError, req, res, next);
        
        // Verify that response uses default values
        assertResponse(res, 500, {
            error: true,
            message: 'An unexpected error occurred'
        });
        
        // Verify that next() was not called
        expect(next).not.toHaveBeenCalled();
    });

    /**
     * Test: Error objects with additional properties
     * 
     * Verifies that errorHandler can handle error objects with extra properties
     * and does not leak them in production responses, while ensuring proper
     * logging of all available error information for debugging purposes.
     */
    test('Should support error objects with additional properties (e.g., code, meta)', () => {
        // Set environment to production to test property sanitization
        process.env.NODE_ENV = 'production';
        
        // Create mock Express context
        const { req, res, next } = mockExpressContext();
        
        // Simulate an error with many additional properties
        const errorWithExtras = simulateError('Validation failed', 422, {
            code: 'VALIDATION_ERROR',
            field: 'email',
            value: 'invalid-email',
            meta: {
                attempts: 3,
                lastAttempt: '2024-01-01T00:00:00Z',
                userAgent: 'TestAgent/1.0'
            },
            internalId: 'ERR-12345',
            severity: 'high',
            category: 'user_input'
        });
        
        // Invoke the errorHandler
        errorHandler(errorWithExtras, req, res, next);
        
        // Verify that response does not include extra properties in production
        assertResponse(res, 422, {
            error: true,
            message: 'An unexpected error occurred'
        });
        
        // Ensure no additional properties are leaked in the response
        expect(res.body.code).toBeUndefined();
        expect(res.body.field).toBeUndefined();
        expect(res.body.meta).toBeUndefined();
        expect(res.body.internalId).toBeUndefined();
        expect(res.body.severity).toBeUndefined();
        expect(res.body.category).toBeUndefined();
        
        // Verify that next() was not called
        expect(next).not.toHaveBeenCalled();
    });

    /**
     * Test: Development environment error message preservation
     * 
     * Verifies that in development environments, the actual error message is
     * preserved in the response for debugging purposes, while still maintaining
     * the structured error response format.
     */
    test('Should preserve actual error message in development environment', () => {
        // Set environment to development
        process.env.NODE_ENV = 'development';
        
        // Create mock Express context
        const { req, res, next } = mockExpressContext();
        
        // Simulate an error with a specific debugging message
        const debugError = simulateError('Database connection timeout after 5000ms', 503);
        
        // Invoke the errorHandler
        errorHandler(debugError, req, res, next);
        
        // Verify that the actual error message is preserved in development
        assertResponse(res, 503, {
            error: true,
            message: 'Database connection timeout after 5000ms',
            details: expect.objectContaining({
                originalMessage: 'Database connection timeout after 5000ms',
                stack: expect.any(String)
            })
        });
        
        // Verify that next() was not called
        expect(next).not.toHaveBeenCalled();
    });

    /**
     * Test: Status code precedence handling
     * 
     * Verifies that errorHandler correctly prioritizes status codes from error objects,
     * checking both 'status' and 'statusCode' properties and falling back to 500
     * when neither is available.
     */
    test('Should handle status code precedence correctly', () => {
        // Set environment to production
        process.env.NODE_ENV = 'production';
        
        // Create mock Express context
        const { req, res, next } = mockExpressContext();
        
        // Test with 'status' property
        const errorWithStatus = simulateError('Error with status', undefined, { status: 404 });
        errorHandler(errorWithStatus, req, res, next);
        expect(res.status).toHaveBeenCalledWith(404);
        
        // Reset mocks for next test
        jest.clearAllMocks();
        const { req: req2, res: res2, next: next2 } = mockExpressContext();
        
        // Test with 'statusCode' property
        const errorWithStatusCode = simulateError('Error with statusCode', undefined, { statusCode: 403 });
        errorHandler(errorWithStatusCode, req2, res2, next2);
        expect(res2.status).toHaveBeenCalledWith(403);
        
        // Reset mocks for next test
        jest.clearAllMocks();
        const { req: req3, res: res3, next: next3 } = mockExpressContext();
        
        // Test with both properties (status should take precedence)
        const errorWithBoth = new Error('Error with both');
        (errorWithBoth as any).status = 400;
        (errorWithBoth as any).statusCode = 409;
        errorHandler(errorWithBoth, req3, res3, next3);
        expect(res3.status).toHaveBeenCalledWith(400);
    });
});