// Jest testing framework - ^29.0.0
// Provides comprehensive testing utilities, assertion methods, and mocking capabilities for unit testing
const jest = require('jest');

// Import the functions under test from the responseFormatter utility module
const { 
    formatSuccessResponse, 
    formatErrorResponse 
} = require('../../../utils/responseFormatter.js');

// Import test utilities for creating mock Express.js objects and performing DRY assertions
const { 
    createMockResponse, 
    assertResponse 
} = require('../../helpers/testUtils.js');

/**
 * Unit Tests for Response Formatter Utility
 * 
 * This test suite validates the responseFormatter.js module, which provides standardized
 * HTTP response formatting for the Node.js tutorial backend. The tests ensure that both
 * formatSuccessResponse and formatErrorResponse functions produce correct, consistent
 * responses with proper status codes, headers, and body content.
 * 
 * Test Coverage:
 * - Success responses with various data types (string, object, undefined)
 * - Error responses with custom status codes and messages
 * - Environment-specific behavior (development vs production)
 * - Custom headers and status codes
 * - Edge cases and error handling scenarios
 * 
 * Educational Value:
 * - Demonstrates proper unit testing patterns for utility functions
 * - Shows how to test Express.js response objects using mocks
 * - Illustrates environment-specific testing techniques
 * - Provides examples of comprehensive test coverage
 */

// Store the original NODE_ENV value to restore after environment-specific tests
let originalEnv;

// Jest setup and teardown hooks for environment variable management
beforeAll(() => {
    // Store the original NODE_ENV value before any tests run
    originalEnv = process.env.NODE_ENV;
});

afterAll(() => {
    // Restore the original NODE_ENV value after all tests complete
    process.env.NODE_ENV = originalEnv;
});

afterEach(() => {
    // Reset NODE_ENV to original value after each test to prevent test pollution
    process.env.NODE_ENV = originalEnv;
});

/**
 * Test Suite: formatSuccessResponse Function
 * 
 * Tests the formatSuccessResponse utility function to ensure it correctly formats
 * and sends standardized HTTP success responses. Validates proper handling of
 * different data types, status codes, headers, and response termination.
 * 
 * Test scenarios:
 * - Plain text responses (for /hello endpoint compatibility)
 * - JSON object responses
 * - Empty responses (no data provided)
 * - Custom HTTP status codes
 * - Custom response headers
 * - Proper Content-Type header setting
 */
describe('formatSuccessResponse', () => {
    
    /**
     * Test: Plain text response formatting
     * 
     * Validates that string data is sent as plain text with correct Content-Type header.
     * This test specifically covers the /hello endpoint use case where plain text
     * "Hello world" response is required.
     * 
     * Arrange: Create mock response object and prepare test data
     * Act: Call formatSuccessResponse with string data
     * Assert: Verify status code, Content-Type header, and response body
     */
    test('should format plain text response with correct headers', () => {
        // Arrange: Create a mock Express.js response object
        const mockRes = createMockResponse();
        const testData = 'Hello world';
        
        // Act: Call the function under test with string data
        formatSuccessResponse(mockRes, testData);
        
        // Assert: Verify the response has correct status, headers, and body
        assertResponse(mockRes, 200, testData, { 'content-type': 'text/plain' });
        
        // Additional assertions for method calls
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.set).toHaveBeenCalledWith('Content-Type', 'text/plain');
        expect(mockRes.send).toHaveBeenCalledWith(testData);
        expect(mockRes.finished).toBe(true);
    });
    
    /**
     * Test: JSON object response formatting
     * 
     * Validates that object data is sent as JSON with correct Content-Type header.
     * Tests the automatic JSON serialization and proper header setting for
     * structured data responses.
     * 
     * Arrange: Create mock response object and prepare JSON object
     * Act: Call formatSuccessResponse with object data
     * Assert: Verify JSON response structure and headers
     */
    test('should format JSON response with correct headers', () => {
        // Arrange: Create mock response and test data object
        const mockRes = createMockResponse();
        const testData = { message: 'Success', data: { id: 1, name: 'Test' } };
        
        // Act: Call the function under test with object data
        formatSuccessResponse(mockRes, testData);
        
        // Assert: Verify JSON response formatting
        assertResponse(mockRes, 200, testData, { 'content-type': 'application/json' });
        
        // Additional assertions for method calls
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(testData);
        expect(mockRes.finished).toBe(true);
    });
    
    /**
     * Test: Empty response handling
     * 
     * Validates that undefined data results in an empty response body with
     * proper status code. Tests the edge case where no response data is needed.
     * 
     * Arrange: Create mock response object
     * Act: Call formatSuccessResponse with undefined data
     * Assert: Verify empty response with correct status
     */
    test('should handle empty response with undefined data', () => {
        // Arrange: Create mock response object
        const mockRes = createMockResponse();
        
        // Act: Call function with undefined data (no second parameter)
        formatSuccessResponse(mockRes, undefined);
        
        // Assert: Verify empty response
        assertResponse(mockRes, 200, undefined);
        
        // Additional assertions for method calls
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.end).toHaveBeenCalled();
        expect(mockRes.finished).toBe(true);
    });
    
    /**
     * Test: Null data handling
     * 
     * Validates that null data also results in an empty response, similar to undefined.
     * Tests explicit null handling for comprehensive edge case coverage.
     * 
     * Arrange: Create mock response object
     * Act: Call formatSuccessResponse with null data
     * Assert: Verify empty response behavior
     */
    test('should handle empty response with null data', () => {
        // Arrange: Create mock response object
        const mockRes = createMockResponse();
        
        // Act: Call function with explicit null data
        formatSuccessResponse(mockRes, null);
        
        // Assert: Verify empty response
        assertResponse(mockRes, 200, undefined);
        
        // Additional assertions for method calls
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.end).toHaveBeenCalled();
        expect(mockRes.finished).toBe(true);
    });
    
    /**
     * Test: Custom status code handling
     * 
     * Validates that custom HTTP status codes are correctly set on the response.
     * Tests the optional status parameter functionality for different success scenarios.
     * 
     * Arrange: Create mock response object and test data
     * Act: Call formatSuccessResponse with custom status code
     * Assert: Verify custom status code is set correctly
     */
    test('should set custom status code when provided', () => {
        // Arrange: Create mock response and test data
        const mockRes = createMockResponse();
        const testData = { message: 'Resource created successfully' };
        const customStatus = 201;
        
        // Act: Call function with custom status code
        formatSuccessResponse(mockRes, testData, customStatus);
        
        // Assert: Verify custom status code
        assertResponse(mockRes, customStatus, testData);
        
        // Additional assertions for method calls
        expect(mockRes.status).toHaveBeenCalledWith(customStatus);
        expect(mockRes.json).toHaveBeenCalledWith(testData);
    });
    
    /**
     * Test: Custom headers handling
     * 
     * Validates that custom headers are correctly set on the response object.
     * Tests the optional headers parameter functionality and ensures custom
     * headers don't interfere with required Content-Type headers.
     * 
     * Arrange: Create mock response, test data, and custom headers
     * Act: Call formatSuccessResponse with custom headers
     * Assert: Verify custom headers are set correctly
     */
    test('should set custom headers when provided', () => {
        // Arrange: Create mock response, test data, and custom headers
        const mockRes = createMockResponse();
        const testData = 'Custom response';
        const customHeaders = {
            'X-Custom-Header': 'Custom Value',
            'X-Request-ID': '12345',
            'Cache-Control': 'no-cache'
        };
        
        // Act: Call function with custom headers
        formatSuccessResponse(mockRes, testData, 200, customHeaders);
        
        // Assert: Verify response with custom headers
        assertResponse(mockRes, 200, testData, { 'content-type': 'text/plain' });
        
        // Additional assertions for custom header setting
        expect(mockRes.set).toHaveBeenCalledWith('X-Custom-Header', 'Custom Value');
        expect(mockRes.set).toHaveBeenCalledWith('X-Request-ID', '12345');
        expect(mockRes.set).toHaveBeenCalledWith('Cache-Control', 'no-cache');
        expect(mockRes.set).toHaveBeenCalledWith('Content-Type', 'text/plain');
    });
    
    /**
     * Test: Combined custom status and headers
     * 
     * Validates that both custom status codes and headers work together correctly.
     * Tests the full parameter combination functionality.
     * 
     * Arrange: Create mock response with test data, custom status, and headers
     * Act: Call formatSuccessResponse with all parameters
     * Assert: Verify all customizations are applied correctly
     */
    test('should handle custom status code and headers together', () => {
        // Arrange: Create mock response and test parameters
        const mockRes = createMockResponse();
        const testData = { message: 'Created', id: 123 };
        const customStatus = 201;
        const customHeaders = { 'Location': '/api/resource/123' };
        
        // Act: Call function with all optional parameters
        formatSuccessResponse(mockRes, testData, customStatus, customHeaders);
        
        // Assert: Verify all customizations
        assertResponse(mockRes, customStatus, testData);
        
        // Additional assertions for specific customizations
        expect(mockRes.status).toHaveBeenCalledWith(customStatus);
        expect(mockRes.set).toHaveBeenCalledWith('Location', '/api/resource/123');
        expect(mockRes.json).toHaveBeenCalledWith(testData);
    });
    
    /**
     * Test: Array data handling
     * 
     * Validates that array data is properly sent as JSON response.
     * Tests handling of array data structures which should be JSON serialized.
     * 
     * Arrange: Create mock response and array test data
     * Act: Call formatSuccessResponse with array data
     * Assert: Verify JSON response formatting for arrays
     */
    test('should format array data as JSON response', () => {
        // Arrange: Create mock response and array test data
        const mockRes = createMockResponse();
        const testData = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
        
        // Act: Call function with array data
        formatSuccessResponse(mockRes, testData);
        
        // Assert: Verify JSON response for array
        assertResponse(mockRes, 200, testData, { 'content-type': 'application/json' });
        
        // Additional assertions for method calls
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(testData);
    });
    
    /**
     * Test: Invalid headers handling
     * 
     * Validates that the function handles invalid headers gracefully.
     * Tests error handling when headers parameter is not an object.
     * 
     * Arrange: Create mock response and invalid headers
     * Act: Call formatSuccessResponse with invalid headers
     * Assert: Verify function continues to work despite invalid headers
     */
    test('should handle invalid headers gracefully', () => {
        // Arrange: Create mock response and test data
        const mockRes = createMockResponse();
        const testData = 'Test response';
        
        // Act: Call function with non-object headers (should be ignored)
        formatSuccessResponse(mockRes, testData, 200, 'invalid-headers');
        
        // Assert: Verify normal response processing despite invalid headers
        assertResponse(mockRes, 200, testData, { 'content-type': 'text/plain' });
        
        // Verify that invalid headers were ignored (set should only be called for Content-Type)
        expect(mockRes.set).toHaveBeenCalledWith('Content-Type', 'text/plain');
        expect(mockRes.set).toHaveBeenCalledTimes(1);
    });
});

/**
 * Test Suite: formatErrorResponse Function
 * 
 * Tests the formatErrorResponse utility function to ensure it correctly formats
 * and sends standardized HTTP error responses. Validates proper error handling,
 * environment-specific behavior, and security considerations.
 * 
 * Test scenarios:
 * - Default error responses (500 with generic message)
 * - Custom status codes and error messages
 * - Development vs production environment behavior
 * - Error details inclusion/exclusion based on environment
 * - Consistent JSON error response structure
 */
describe('formatErrorResponse', () => {
    
    /**
     * Test: Default error response
     * 
     * Validates the default error response behavior when no parameters are provided.
     * Tests that default values (500 status, generic message) are used correctly.
     * 
     * Arrange: Create mock response object
     * Act: Call formatErrorResponse with no parameters
     * Assert: Verify default error response structure
     */
    test('should format default error response', () => {
        // Arrange: Create mock response object
        const mockRes = createMockResponse();
        
        // Act: Call function with no parameters (all defaults)
        formatErrorResponse(mockRes);
        
        // Assert: Verify default error response
        const expectedBody = {
            error: true,
            message: 'An unexpected error occurred'
        };
        assertResponse(mockRes, 500, expectedBody, { 'content-type': 'application/json' });
        
        // Additional assertions for method calls
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.set).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(mockRes.json).toHaveBeenCalledWith(expectedBody);
    });
    
    /**
     * Test: Custom status code and message
     * 
     * Validates that custom HTTP status codes and error messages are handled correctly.
     * Tests the flexibility of the error response function for different error scenarios.
     * 
     * Arrange: Create mock response and custom error parameters
     * Act: Call formatErrorResponse with custom status and message
     * Assert: Verify custom error response formatting
     */
    test('should format error response with custom status and message', () => {
        // Arrange: Create mock response and custom parameters
        const mockRes = createMockResponse();
        const customStatus = 404;
        const customMessage = 'Resource not found';
        
        // Act: Call function with custom parameters
        formatErrorResponse(mockRes, customStatus, customMessage);
        
        // Assert: Verify custom error response
        const expectedBody = {
            error: true,
            message: customMessage
        };
        assertResponse(mockRes, customStatus, expectedBody, { 'content-type': 'application/json' });
        
        // Additional assertions for method calls
        expect(mockRes.status).toHaveBeenCalledWith(customStatus);
        expect(mockRes.json).toHaveBeenCalledWith(expectedBody);
    });
    
    /**
     * Test: Error details in development environment
     * 
     * Validates that error details are included in the response when NODE_ENV
     * is not set to 'production'. Tests the development debugging functionality.
     * 
     * Arrange: Set NODE_ENV to development, create mock response and error details
     * Act: Call formatErrorResponse with error details
     * Assert: Verify error details are included in response
     */
    test('should include error details in development environment', () => {
        // Arrange: Set environment to development
        process.env.NODE_ENV = 'development';
        
        const mockRes = createMockResponse();
        const customStatus = 400;
        const customMessage = 'Validation failed';
        const errorDetails = {
            field: 'email',
            reason: 'Invalid email format',
            code: 'VALIDATION_ERROR'
        };
        
        // Act: Call function with error details
        formatErrorResponse(mockRes, customStatus, customMessage, errorDetails);
        
        // Assert: Verify error details are included in development
        const expectedBody = {
            error: true,
            message: customMessage,
            details: errorDetails
        };
        assertResponse(mockRes, customStatus, expectedBody);
        
        // Additional assertions
        expect(mockRes.json).toHaveBeenCalledWith(expectedBody);
    });
    
    /**
     * Test: Error details excluded in production environment
     * 
     * Validates that error details are NOT included in the response when NODE_ENV
     * is set to 'production'. Tests the security feature that prevents information
     * disclosure in production environments.
     * 
     * Arrange: Set NODE_ENV to production, create mock response and error details
     * Act: Call formatErrorResponse with error details
     * Assert: Verify error details are excluded from response
     */
    test('should exclude error details in production environment', () => {
        // Arrange: Set environment to production
        process.env.NODE_ENV = 'production';
        
        const mockRes = createMockResponse();
        const customStatus = 500;
        const customMessage = 'Internal server error';
        const errorDetails = {
            stack: 'Error stack trace...',
            query: 'SELECT * FROM users',
            internalError: 'Database connection failed'
        };
        
        // Act: Call function with error details
        formatErrorResponse(mockRes, customStatus, customMessage, errorDetails);
        
        // Assert: Verify error details are excluded in production
        const expectedBody = {
            error: true,
            message: customMessage
            // Note: details should NOT be present
        };
        assertResponse(mockRes, customStatus, expectedBody);
        
        // Additional assertion to ensure details are not included
        expect(mockRes.json).toHaveBeenCalledWith(expectedBody);
        expect(mockRes.body).not.toHaveProperty('details');
    });
    
    /**
     * Test: Error details in test environment
     * 
     * Validates that error details are included when NODE_ENV is set to 'test'.
     * Tests that non-production environments support debugging information.
     * 
     * Arrange: Set NODE_ENV to test, create mock response and error details
     * Act: Call formatErrorResponse with error details
     * Assert: Verify error details are included in test environment
     */
    test('should include error details in test environment', () => {
        // Arrange: Set environment to test
        process.env.NODE_ENV = 'test';
        
        const mockRes = createMockResponse();
        const errorDetails = {
            testContext: 'Unit test error',
            mockData: { id: 123 }
        };
        
        // Act: Call function with error details
        formatErrorResponse(mockRes, 422, 'Test validation error', errorDetails);
        
        // Assert: Verify error details are included in test environment
        const expectedBody = {
            error: true,
            message: 'Test validation error',
            details: errorDetails
        };
        assertResponse(mockRes, 422, expectedBody);
    });
    
    /**
     * Test: Error details handling with no details provided
     * 
     * Validates that the function works correctly when no error details are provided,
     * regardless of environment. Tests the optional nature of the details parameter.
     * 
     * Arrange: Set environment to development, create mock response
     * Act: Call formatErrorResponse without error details
     * Assert: Verify response structure without details property
     */
    test('should handle missing error details gracefully', () => {
        // Arrange: Set environment to development (where details would be included if provided)
        process.env.NODE_ENV = 'development';
        
        const mockRes = createMockResponse();
        
        // Act: Call function without error details parameter
        formatErrorResponse(mockRes, 400, 'Bad request');
        
        // Assert: Verify response without details property
        const expectedBody = {
            error: true,
            message: 'Bad request'
            // Note: details should not be present when not provided
        };
        assertResponse(mockRes, 400, expectedBody);
        
        // Additional assertion to ensure details property is not present
        expect(mockRes.body).not.toHaveProperty('details');
    });
    
    /**
     * Test: Null error details handling
     * 
     * Validates that null error details are handled gracefully and don't cause
     * issues with the response formatting.
     * 
     * Arrange: Set environment to development, create mock response
     * Act: Call formatErrorResponse with null details
     * Assert: Verify response structure handles null details correctly
     */
    test('should handle null error details gracefully', () => {
        // Arrange: Set environment to development
        process.env.NODE_ENV = 'development';
        
        const mockRes = createMockResponse();
        
        // Act: Call function with explicit null details
        formatErrorResponse(mockRes, 400, 'Bad request', null);
        
        // Assert: Verify response without details property
        const expectedBody = {
            error: true,
            message: 'Bad request'
        };
        assertResponse(mockRes, 400, expectedBody);
        
        // Additional assertion to ensure details property is not present
        expect(mockRes.body).not.toHaveProperty('details');
    });
    
    /**
     * Test: Various HTTP error status codes
     * 
     * Validates that different HTTP error status codes are handled correctly.
     * Tests common error scenarios with appropriate status codes.
     * 
     * Arrange: Create test cases for different error status codes
     * Act: Call formatErrorResponse with various status codes
     * Assert: Verify each status code is set correctly
     */
    test('should handle various HTTP error status codes', () => {
        // Test cases for different error status codes
        const testCases = [
            { status: 400, message: 'Bad Request' },
            { status: 401, message: 'Unauthorized' },
            { status: 403, message: 'Forbidden' },
            { status: 404, message: 'Not Found' },
            { status: 422, message: 'Unprocessable Entity' },
            { status: 500, message: 'Internal Server Error' },
            { status: 503, message: 'Service Unavailable' }
        ];
        
        testCases.forEach(({ status, message }) => {
            // Arrange: Create fresh mock response for each test case
            const mockRes = createMockResponse();
            
            // Act: Call function with specific status code
            formatErrorResponse(mockRes, status, message);
            
            // Assert: Verify correct status code and message
            const expectedBody = {
                error: true,
                message: message
            };
            assertResponse(mockRes, status, expectedBody);
        });
    });
    
    /**
     * Test: Consistent JSON response structure
     * 
     * Validates that all error responses maintain a consistent JSON structure
     * with the required 'error' flag and 'message' property.
     * 
     * Arrange: Create mock response
     * Act: Call formatErrorResponse multiple times with different parameters
     * Assert: Verify consistent response structure in all cases
     */
    test('should maintain consistent JSON response structure', () => {
        // Test multiple scenarios to ensure consistent structure
        const testScenarios = [
            { status: 400, message: 'Bad Request', details: null },
            { status: 404, message: 'Not Found', details: { resource: 'user' } },
            { status: 500, message: 'Server Error', details: { stack: 'trace' } }
        ];
        
        // Set to development to test details inclusion
        process.env.NODE_ENV = 'development';
        
        testScenarios.forEach(({ status, message, details }) => {
            // Arrange: Create fresh mock response
            const mockRes = createMockResponse();
            
            // Act: Call function with scenario parameters
            formatErrorResponse(mockRes, status, message, details);
            
            // Assert: Verify consistent structure
            expect(mockRes.body).toHaveProperty('error', true);
            expect(mockRes.body).toHaveProperty('message', message);
            expect(mockRes.statusCode).toBe(status);
            expect(mockRes.headers['content-type']).toBe('application/json');
            
            // Verify details handling
            if (details) {
                expect(mockRes.body).toHaveProperty('details', details);
            }
        });
    });
    
    /**
     * Test: Content-Type header setting
     * 
     * Validates that the Content-Type header is always set to 'application/json'
     * for error responses, ensuring consistent API behavior.
     * 
     * Arrange: Create mock response
     * Act: Call formatErrorResponse
     * Assert: Verify Content-Type header is set correctly
     */
    test('should always set Content-Type header to application/json', () => {
        // Arrange: Create mock response
        const mockRes = createMockResponse();
        
        // Act: Call function with any parameters
        formatErrorResponse(mockRes, 404, 'Resource not found');
        
        // Assert: Verify Content-Type header
        expect(mockRes.set).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(mockRes.headers['content-type']).toBe('application/json');
    });
    
    /**
     * Test: Response termination
     * 
     * Validates that the response is properly terminated after sending the error response.
     * Tests that the finished flag is set correctly.
     * 
     * Arrange: Create mock response
     * Act: Call formatErrorResponse
     * Assert: Verify response is marked as finished
     */
    test('should properly terminate the response', () => {
        // Arrange: Create mock response
        const mockRes = createMockResponse();
        
        // Act: Call function
        formatErrorResponse(mockRes, 500, 'Internal error');
        
        // Assert: Verify response termination
        expect(mockRes.finished).toBe(true);
        expect(mockRes.json).toHaveBeenCalled();
    });
});

/**
 * Integration-style tests for both functions
 * 
 * These tests validate the interaction between both response formatting functions
 * and ensure they work correctly together in realistic scenarios.
 */
describe('Response formatter integration', () => {
    
    /**
     * Test: Success and error responses use different Content-Type handling
     * 
     * Validates that success responses support multiple content types while
     * error responses always use JSON format.
     * 
     * Arrange: Create mock responses for both scenarios
     * Act: Call both functions with similar data
     * Assert: Verify different Content-Type handling
     */
    test('should handle Content-Type differently for success vs error responses', () => {
        // Arrange: Create separate mock responses
        const successRes = createMockResponse();
        const errorRes = createMockResponse();
        
        // Act: Call both functions with string data
        formatSuccessResponse(successRes, 'Hello world');
        formatErrorResponse(errorRes, 200, 'Hello world');
        
        // Assert: Verify different Content-Type handling
        expect(successRes.headers['content-type']).toBe('text/plain');
        expect(errorRes.headers['content-type']).toBe('application/json');
        
        // Verify response bodies are different formats
        expect(successRes.body).toBe('Hello world');
        expect(errorRes.body).toEqual({
            error: true,
            message: 'Hello world'
        });
    });
    
    /**
     * Test: Both functions properly terminate responses
     * 
     * Validates that both formatting functions properly terminate HTTP responses
     * and mark them as finished.
     * 
     * Arrange: Create mock responses
     * Act: Call both formatting functions
     * Assert: Verify both responses are properly terminated
     */
    test('should properly terminate responses in both success and error cases', () => {
        // Arrange: Create mock responses
        const successRes = createMockResponse();
        const errorRes = createMockResponse();
        
        // Act: Call both functions
        formatSuccessResponse(successRes, { message: 'Success' });
        formatErrorResponse(errorRes, 400, 'Bad request');
        
        // Assert: Verify both responses are finished
        expect(successRes.finished).toBe(true);
        expect(errorRes.finished).toBe(true);
    });
});