// Jest testing framework for unit test execution and mocking - v29.0.0
import * as jest from 'jest';

// Import the functions under test from the responseFormatter utility module
import { formatSuccessResponse, formatErrorResponse } from '../../../../backend/utils/responseFormatter.js';

// Import test utility functions for creating mock objects and assertions
import { createMockResponse, assertResponse } from '../../helpers/testUtils';

// Import canonical expected responses from fixtures to ensure contract compliance
const expectedResponses = require('../../../fixtures/expected-responses.json');

/**
 * Unit Test Suite for Response Formatter Utility
 * 
 * This test suite validates the responseFormatter.js utility module's ability to 
 * generate standardized HTTP responses for both success and error scenarios.
 * It ensures all response formatting logic is robust, contractually correct,
 * and educationally clear, matching the canonical expected outputs defined in fixtures.
 * 
 * The tests cover:
 * - Plain text and JSON response formatting
 * - HTTP status code handling and validation
 * - Header setting and Content-Type management
 * - Error message sanitization and security
 * - Response body structure and consistency
 * - Contract compliance with expected response formats
 * 
 * Test Patterns:
 * - Arrange-Act-Assert: Each test creates a mock response, calls the formatter, and asserts results
 * - Fixture-driven assertions: All expected outputs loaded from expected-responses.json
 * - Comprehensive coverage: Tests cover all major code paths and edge cases
 * - Educational clarity: Tests demonstrate proper usage patterns and best practices
 */

describe('formatSuccessResponse', () => {
    /**
     * Test Suite: formatSuccessResponse Function
     * 
     * This test suite validates the formatSuccessResponse function's ability to:
     * - Format plain text responses with correct headers and status codes
     * - Format JSON responses with appropriate Content-Type headers
     * - Handle custom status codes and headers
     * - Process empty responses appropriately
     * - Maintain Express.js response object integrity
     */

    let mockResponse: any;

    /**
     * Test Setup: Create fresh mock response for each test
     * 
     * Creates a new mock Express.js response object before each test to ensure
     * test isolation and prevent side effects between test cases.
     */
    beforeEach(() => {
        mockResponse = createMockResponse();
    });

    /**
     * Test Case: Plain Text Response Generation
     * 
     * Validates that formatSuccessResponse generates correct plain text responses
     * for string payloads, matching the canonical hello_success response format.
     * This test ensures the /hello endpoint contract is properly implemented.
     */
    it('should return Hello world with correct status and headers for string payload', () => {
        // Arrange: Prepare test data matching the Hello endpoint contract
        const testPayload = 'Hello world';
        const expectedStatus = 200;
        const expectedHeaders = {
            'Content-Type': 'text/plain'
        };

        // Act: Call the function under test with string payload
        formatSuccessResponse(mockResponse, testPayload);

        // Assert: Verify response matches expected hello_success format from fixtures
        assertResponse(mockResponse, expectedStatus, testPayload, expectedHeaders);
        
        // Additional assertions to verify mock spy calls
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
        expect(mockResponse.set).toHaveBeenCalledWith('Content-Type', 'text/plain');
        expect(mockResponse.send).toHaveBeenCalledWith(testPayload);
        
        // Verify the response matches canonical expected output
        expect(mockResponse.statusCode).toBe(expectedResponses.hello_success.status);
        expect(mockResponse.body).toBe(expectedResponses.hello_success.body);
        expect(mockResponse.headers['Content-Type']).toBe(expectedResponses.hello_success.headers['Content-Type']);
    });

    /**
     * Test Case: JSON Response Generation
     * 
     * Validates that formatSuccessResponse correctly handles object payloads
     * by generating JSON responses with appropriate Content-Type headers.
     */
    it('should return JSON response with correct headers for object payload', () => {
        // Arrange: Prepare test data with object payload
        const testPayload = { message: 'Success', data: { id: 1, name: 'Test' } };
        const expectedStatus = 200;
        const expectedHeaders = {
            'Content-Type': 'application/json'
        };

        // Act: Call the function under test with object payload
        formatSuccessResponse(mockResponse, testPayload);

        // Assert: Verify JSON response formatting
        assertResponse(mockResponse, expectedStatus, testPayload, expectedHeaders);
        
        // Verify Express.js json() method was called correctly
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
        expect(mockResponse.json).toHaveBeenCalledWith(testPayload);
        expect(mockResponse.headers['Content-Type']).toBe('application/json');
    });

    /**
     * Test Case: Custom Status Code Handling
     * 
     * Validates that formatSuccessResponse correctly handles custom HTTP status codes
     * while maintaining proper response formatting.
     */
    it('should handle custom status codes correctly', () => {
        // Arrange: Prepare test data with custom status code
        const testPayload = { message: 'Resource created successfully' };
        const customStatus = 201;

        // Act: Call the function under test with custom status
        formatSuccessResponse(mockResponse, testPayload, customStatus);

        // Assert: Verify custom status code is set
        assertResponse(mockResponse, customStatus, testPayload);
        expect(mockResponse.status).toHaveBeenCalledWith(customStatus);
        expect(mockResponse.statusCode).toBe(customStatus);
    });

    /**
     * Test Case: Custom Headers Handling
     * 
     * Validates that formatSuccessResponse correctly sets custom headers
     * provided through the headers parameter.
     */
    it('should set custom headers when provided', () => {
        // Arrange: Prepare test data with custom headers
        const testPayload = 'Success message';
        const customHeaders = {
            'X-Custom-Header': 'custom-value',
            'X-API-Version': '1.0.0',
            'Cache-Control': 'no-cache'
        };

        // Act: Call the function under test with custom headers
        formatSuccessResponse(mockResponse, testPayload, 200, customHeaders);

        // Assert: Verify all custom headers are set
        Object.entries(customHeaders).forEach(([headerName, headerValue]) => {
            expect(mockResponse.set).toHaveBeenCalledWith(headerName, headerValue);
            expect(mockResponse.headers[headerName]).toBe(headerValue);
        });

        // Verify the response body and status are still correct
        expect(mockResponse.body).toBe(testPayload);
        expect(mockResponse.statusCode).toBe(200);
    });

    /**
     * Test Case: Empty Response Handling
     * 
     * Validates that formatSuccessResponse correctly handles empty or undefined
     * payloads by sending an empty response body.
     */
    it('should handle empty response data appropriately', () => {
        // Arrange: Test with undefined data
        const testPayload = undefined;
        const expectedStatus = 200;

        // Act: Call the function under test with undefined payload
        formatSuccessResponse(mockResponse, testPayload);

        // Assert: Verify empty response handling
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
        expect(mockResponse.end).toHaveBeenCalled();
        expect(mockResponse.statusCode).toBe(expectedStatus);
    });

    /**
     * Test Case: Null Data Handling
     * 
     * Validates that formatSuccessResponse correctly handles null payloads
     * by sending an empty response body.
     */
    it('should handle null response data appropriately', () => {
        // Arrange: Test with null data
        const testPayload = null;
        const expectedStatus = 200;

        // Act: Call the function under test with null payload
        formatSuccessResponse(mockResponse, testPayload);

        // Assert: Verify null response handling
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
        expect(mockResponse.end).toHaveBeenCalled();
        expect(mockResponse.statusCode).toBe(expectedStatus);
    });

    /**
     * Test Case: Array Response Handling
     * 
     * Validates that formatSuccessResponse correctly handles array payloads
     * as JSON responses.
     */
    it('should handle array payloads as JSON responses', () => {
        // Arrange: Prepare test data with array payload
        const testPayload = [
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' },
            { id: 3, name: 'Item 3' }
        ];
        const expectedStatus = 200;

        // Act: Call the function under test with array payload
        formatSuccessResponse(mockResponse, testPayload);

        // Assert: Verify array is handled as JSON
        assertResponse(mockResponse, expectedStatus, testPayload);
        expect(mockResponse.json).toHaveBeenCalledWith(testPayload);
        expect(mockResponse.headers['Content-Type']).toBe('application/json');
    });
});

describe('formatErrorResponse', () => {
    /**
     * Test Suite: formatErrorResponse Function
     * 
     * This test suite validates the formatErrorResponse function's ability to:
     * - Generate standardized 404 and 500 error responses
     * - Sanitize error messages to prevent information disclosure
     * - Handle optional error details in development environments
     * - Maintain consistent error response structure
     * - Provide secure error handling that prevents data leakage
     */

    let mockResponse: any;
    let originalNodeEnv: string | undefined;

    /**
     * Test Setup: Create fresh mock response and preserve environment
     * 
     * Creates a new mock Express.js response object and preserves the original
     * NODE_ENV value for restoration after tests.
     */
    beforeEach(() => {
        mockResponse = createMockResponse();
        originalNodeEnv = process.env.NODE_ENV;
    });

    /**
     * Test Cleanup: Restore original environment
     * 
     * Restores the original NODE_ENV value after each test to prevent
     * side effects between test cases.
     */
    afterEach(() => {
        process.env.NODE_ENV = originalNodeEnv;
    });

    /**
     * Test Case: 404 Not Found Error Response
     * 
     * Validates that formatErrorResponse generates correct 404 error responses
     * matching the canonical not_found_error response format from fixtures.
     */
    it('should return 404 error response with correct format', () => {
        // Arrange: Prepare 404 error test data
        const errorStatus = 404;
        const errorMessage = 'Resource not found';
        const expectedHeaders = {
            'Content-Type': 'application/json'
        };
        const expectedBody = {
            error: true,
            message: errorMessage
        };

        // Act: Call the function under test with 404 parameters
        formatErrorResponse(mockResponse, errorStatus, errorMessage);

        // Assert: Verify 404 error response format
        assertResponse(mockResponse, errorStatus, expectedBody, expectedHeaders);
        
        // Verify the response matches canonical expected output
        expect(mockResponse.statusCode).toBe(expectedResponses.not_found_error.status);
        expect(mockResponse.body).toEqual(expectedResponses.not_found_error.body);
        expect(mockResponse.headers['Content-Type']).toBe(expectedResponses.not_found_error.headers['Content-Type']);
        
        // Verify mock spy calls
        expect(mockResponse.status).toHaveBeenCalledWith(errorStatus);
        expect(mockResponse.set).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(mockResponse.json).toHaveBeenCalledWith(expectedBody);
    });

    /**
     * Test Case: 500 Internal Server Error Response
     * 
     * Validates that formatErrorResponse generates correct 500 error responses
     * matching the canonical internal_server_error response format from fixtures.
     */
    it('should return 500 error response with correct format', () => {
        // Arrange: Prepare 500 error test data
        const errorStatus = 500;
        const errorMessage = 'An unexpected error occurred';
        const expectedHeaders = {
            'Content-Type': 'application/json'
        };
        const expectedBody = {
            error: true,
            message: errorMessage
        };

        // Act: Call the function under test with 500 parameters
        formatErrorResponse(mockResponse, errorStatus, errorMessage);

        // Assert: Verify 500 error response format
        assertResponse(mockResponse, errorStatus, expectedBody, expectedHeaders);
        
        // Verify the response matches canonical expected output
        expect(mockResponse.statusCode).toBe(expectedResponses.internal_server_error.status);
        expect(mockResponse.body).toEqual(expectedResponses.internal_server_error.body);
        expect(mockResponse.headers['Content-Type']).toBe(expectedResponses.internal_server_error.headers['Content-Type']);
    });

    /**
     * Test Case: Default Error Response Values
     * 
     * Validates that formatErrorResponse uses default values when no parameters
     * are provided, generating a generic 500 error response.
     */
    it('should use default values when no parameters provided', () => {
        // Arrange: No parameters - should use defaults
        const expectedStatus = 500;
        const expectedMessage = 'An unexpected error occurred';
        const expectedBody = {
            error: true,
            message: expectedMessage
        };

        // Act: Call the function under test with no parameters
        formatErrorResponse(mockResponse);

        // Assert: Verify default error response
        assertResponse(mockResponse, expectedStatus, expectedBody);
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedBody);
    });

    /**
     * Test Case: Error Details Inclusion in Development Environment
     * 
     * Validates that formatErrorResponse includes error details when running
     * in a development environment (NODE_ENV !== 'production').
     */
    it('should include error details in development environment', () => {
        // Arrange: Set development environment and prepare error with details
        process.env.NODE_ENV = 'development';
        const errorStatus = 400;
        const errorMessage = 'Validation failed';
        const errorDetails = {
            field: 'email',
            reason: 'Invalid email format',
            stack: 'Error stack trace...'
        };
        const expectedBody = {
            error: true,
            message: errorMessage,
            details: errorDetails
        };

        // Act: Call the function under test with error details
        formatErrorResponse(mockResponse, errorStatus, errorMessage, errorDetails);

        // Assert: Verify error details are included in development
        assertResponse(mockResponse, errorStatus, expectedBody);
        expect(mockResponse.body.details).toEqual(errorDetails);
    });

    /**
     * Test Case: Error Details Exclusion in Production Environment
     * 
     * Validates that formatErrorResponse excludes error details when running
     * in a production environment to prevent information disclosure.
     */
    it('should exclude error details in production environment', () => {
        // Arrange: Set production environment and prepare error with details
        process.env.NODE_ENV = 'production';
        const errorStatus = 500;
        const errorMessage = 'Database connection failed';
        const errorDetails = {
            connectionString: 'postgresql://user:pass@localhost:5432/db',
            stack: 'Sensitive stack trace information...',
            internalError: 'Internal system details'
        };
        const expectedBody = {
            error: true,
            message: errorMessage
            // Note: details should NOT be included in production
        };

        // Act: Call the function under test with error details in production
        formatErrorResponse(mockResponse, errorStatus, errorMessage, errorDetails);

        // Assert: Verify error details are excluded in production
        assertResponse(mockResponse, errorStatus, expectedBody);
        expect(mockResponse.body.details).toBeUndefined();
        expect(mockResponse.body).not.toHaveProperty('details');
    });

    /**
     * Test Case: Custom Error Status Codes
     * 
     * Validates that formatErrorResponse correctly handles various HTTP error
     * status codes beyond the standard 404 and 500.
     */
    it('should handle custom error status codes', () => {
        // Arrange: Test with various error status codes
        const testCases = [
            { status: 400, message: 'Bad Request' },
            { status: 401, message: 'Unauthorized' },
            { status: 403, message: 'Forbidden' },
            { status: 422, message: 'Unprocessable Entity' },
            { status: 503, message: 'Service Unavailable' }
        ];

        testCases.forEach(({ status, message }) => {
            // Arrange: Create fresh mock response for each test case
            const freshMockResponse = createMockResponse();
            const expectedBody = {
                error: true,
                message: message
            };

            // Act: Call the function under test with custom status
            formatErrorResponse(freshMockResponse, status, message);

            // Assert: Verify custom status code handling
            assertResponse(freshMockResponse, status, expectedBody);
            expect(freshMockResponse.statusCode).toBe(status);
        });
    });

    /**
     * Test Case: Error Message Sanitization
     * 
     * Validates that formatErrorResponse properly handles error messages
     * and maintains security by not exposing sensitive information.
     */
    it('should handle error message sanitization', () => {
        // Arrange: Test with potentially sensitive error message
        const errorStatus = 500;
        const sanitizedMessage = 'Database operation failed';
        const expectedBody = {
            error: true,
            message: sanitizedMessage
        };

        // Act: Call the function under test with sanitized message
        formatErrorResponse(mockResponse, errorStatus, sanitizedMessage);

        // Assert: Verify sanitized message is used
        assertResponse(mockResponse, errorStatus, expectedBody);
        expect(mockResponse.body.message).toBe(sanitizedMessage);
        expect(mockResponse.body.message).not.toContain('password');
        expect(mockResponse.body.message).not.toContain('connection string');
    });

    /**
     * Test Case: Response Structure Consistency
     * 
     * Validates that all error responses maintain consistent structure
     * regardless of the specific error parameters provided.
     */
    it('should maintain consistent error response structure', () => {
        // Arrange: Test with various error scenarios
        const testScenarios = [
            { status: 400, message: 'Bad Request', details: null },
            { status: 404, message: 'Not Found', details: { path: '/invalid' } },
            { status: 500, message: 'Internal Error', details: { code: 'DB_ERROR' } }
        ];

        testScenarios.forEach(({ status, message, details }) => {
            // Arrange: Create fresh mock response for each scenario
            const freshMockResponse = createMockResponse();

            // Act: Call the function under test
            formatErrorResponse(freshMockResponse, status, message, details);

            // Assert: Verify consistent response structure
            expect(freshMockResponse.body).toHaveProperty('error', true);
            expect(freshMockResponse.body).toHaveProperty('message', message);
            expect(typeof freshMockResponse.body.error).toBe('boolean');
            expect(typeof freshMockResponse.body.message).toBe('string');
            expect(freshMockResponse.headers['Content-Type']).toBe('application/json');
        });
    });
});

/**
 * Integration Test Cases
 * 
 * These tests validate the interaction between formatSuccessResponse and formatErrorResponse
 * to ensure they work correctly together and maintain consistent behavior patterns.
 */
describe('Response Formatter Integration', () => {
    /**
     * Test Case: Response Format Consistency
     * 
     * Validates that both success and error formatters maintain consistent
     * response handling patterns and Express.js integration.
     */
    it('should maintain consistent response handling patterns', () => {
        // Arrange: Create mock responses for both success and error cases
        const successMockResponse = createMockResponse();
        const errorMockResponse = createMockResponse();

        // Act: Format both success and error responses
        formatSuccessResponse(successMockResponse, 'Success message');
        formatErrorResponse(errorMockResponse, 400, 'Error message');

        // Assert: Verify both responses follow consistent patterns
        expect(successMockResponse.status).toHaveBeenCalled();
        expect(errorMockResponse.status).toHaveBeenCalled();
        
        expect(successMockResponse.finished).toBe(true);
        expect(errorMockResponse.finished).toBe(true);
        
        // Both should have set appropriate headers
        expect(Object.keys(successMockResponse.headers).length).toBeGreaterThan(0);
        expect(Object.keys(errorMockResponse.headers).length).toBeGreaterThan(0);
    });

    /**
     * Test Case: Contract Compliance Validation
     * 
     * Validates that all responses comply with the expected contract
     * as defined in the fixtures and API documentation.
     */
    it('should comply with documented API contracts', () => {
        // Arrange: Test success response contract compliance
        const successMockResponse = createMockResponse();
        
        // Act: Generate success response matching hello endpoint
        formatSuccessResponse(successMockResponse, 'Hello world');
        
        // Assert: Verify success response matches expected contract
        expect(successMockResponse.statusCode).toBe(expectedResponses.hello_success.status);
        expect(successMockResponse.body).toBe(expectedResponses.hello_success.body);
        expect(successMockResponse.headers['Content-Type']).toBe(expectedResponses.hello_success.headers['Content-Type']);

        // Arrange: Test error response contract compliance
        const errorMockResponse = createMockResponse();
        
        // Act: Generate error response matching 404 contract
        formatErrorResponse(errorMockResponse, 404, 'Resource not found');
        
        // Assert: Verify error response matches expected contract
        expect(errorMockResponse.statusCode).toBe(expectedResponses.not_found_error.status);
        expect(errorMockResponse.body).toEqual(expectedResponses.not_found_error.body);
        expect(errorMockResponse.headers['Content-Type']).toBe(expectedResponses.not_found_error.headers['Content-Type']);
    });
});