// External imports
const jest = require('jest'); // Jest ^29.0.0 - JavaScript testing framework for mocking, spying, and assertions

// Internal imports
const { logger } = require('../../utils/logger.js');

/**
 * Creates a mock Express request object for use in unit and integration tests.
 * Provides a flexible foundation for testing route handlers and middleware by
 * allowing customization of HTTP method, path, query parameters, body, and headers.
 * 
 * This utility enables DRY test practices by centralizing request object creation
 * and ensuring consistent mock structure across all test suites.
 * 
 * @param {Object} options - Optional configuration object for request customization
 * @param {string} options.method - HTTP method (default: 'GET')
 * @param {string} options.path - Request path (default: '/')
 * @param {Object} options.query - Query parameters object (default: {})
 * @param {Object} options.body - Request body object (default: {})
 * @param {Object} options.headers - HTTP headers object (default: {})
 * @returns {Object} Mock Express request object with specified properties
 * 
 * @example
 * // Create basic GET request
 * const mockReq = createMockRequest();
 * 
 * // Create customized request
 * const mockReq = createMockRequest({
 *   method: 'POST',
 *   path: '/hello',
 *   body: { message: 'test' },
 *   headers: { 'content-type': 'application/json' }
 * });
 */
function createMockRequest(options = {}) {
    // Initialize a plain JavaScript object with default Express request properties
    const mockRequest = {
        // HTTP method - default to GET for typical endpoint testing
        method: options.method || 'GET',
        
        // Request path - default to root path
        path: options.path || '/',
        
        // URL property for full request URL (combines path with query)
        url: options.path || '/',
        
        // Query parameters object - for URL query string parsing
        query: options.query || {},
        
        // Request body object - for POST/PUT request data
        body: options.body || {},
        
        // HTTP headers object - for request header access
        headers: options.headers || {},
        
        // Request parameters from URL path parameters (e.g., /users/:id)
        params: {},
        
        // Original URL before any modifications
        originalUrl: options.path || '/',
        
        // Base URL for the request
        baseUrl: '',
        
        // HTTP protocol version
        protocol: 'http',
        
        // Request hostname
        hostname: 'localhost',
        
        // Client IP address
        ip: '127.0.0.1',
        
        // Indicates if request is secure (HTTPS)
        secure: false,
        
        // Express application instance reference
        app: {},
        
        // Route instance reference
        route: {}
    };
    
    // Override default properties if provided in options
    // This allows for flexible test scenario creation
    if (options.method) mockRequest.method = options.method;
    if (options.path) {
        mockRequest.path = options.path;
        mockRequest.url = options.path;
        mockRequest.originalUrl = options.path;
    }
    if (options.query) mockRequest.query = options.query;
    if (options.body) mockRequest.body = options.body;
    if (options.headers) mockRequest.headers = options.headers;
    
    // Return the fully configured mock request object
    return mockRequest;
}

/**
 * Creates a mock Express response object with Jest spies for status, set, and send methods.
 * Captures response state (status code, headers, body) for comprehensive test assertions.
 * 
 * This utility provides a complete mock response object that behaves like Express response
 * objects while allowing test code to assert on response properties and method calls.
 * Each method supports method chaining as expected in Express.js applications.
 * 
 * @returns {Object} Mock Express response object with spy methods and captured state
 * 
 * @example
 * // Create mock response and test handler
 * const mockRes = createMockResponse();
 * await routeHandler(mockReq, mockRes);
 * 
 * // Assert response was configured correctly
 * expect(mockRes.status).toHaveBeenCalledWith(200);
 * expect(mockRes.send).toHaveBeenCalledWith('Hello world');
 * expect(mockRes.statusCode).toBe(200);
 */
function createMockResponse() {
    // Create an object to store response state for later assertion
    const responseState = {
        statusCode: 200,    // Default HTTP status code
        headers: {},        // Response headers collection
        body: null,         // Response body content
        locals: {}          // Response locals for template rendering
    };
    
    // Create Jest spy functions for Express response methods
    const mockResponse = {
        // Response state properties for assertion
        statusCode: responseState.statusCode,
        headers: responseState.headers,
        body: responseState.body,
        locals: responseState.locals,
        
        /**
         * Mock status method - sets HTTP status code
         * @param {number} code - HTTP status code
         * @returns {Object} Mock response object for chaining
         */
        status: jest.fn().mockImplementation(function(code) {
            responseState.statusCode = code;
            mockResponse.statusCode = code;
            return mockResponse; // Enable method chaining
        }),
        
        /**
         * Mock set method - sets response headers
         * @param {string|Object} field - Header field name or headers object
         * @param {string} value - Header value (if field is string)
         * @returns {Object} Mock response object for chaining
         */
        set: jest.fn().mockImplementation(function(field, value) {
            if (typeof field === 'object') {
                // Handle object of headers
                Object.assign(responseState.headers, field);
                Object.assign(mockResponse.headers, field);
            } else {
                // Handle single header field
                responseState.headers[field] = value;
                mockResponse.headers[field] = value;
            }
            return mockResponse; // Enable method chaining
        }),
        
        /**
         * Mock send method - sends response body
         * @param {*} body - Response body content
         * @returns {Object} Mock response object for chaining
         */
        send: jest.fn().mockImplementation(function(body) {
            responseState.body = body;
            mockResponse.body = body;
            return mockResponse; // Enable method chaining
        }),
        
        /**
         * Mock json method - sends JSON response
         * @param {Object} obj - JSON object to send
         * @returns {Object} Mock response object for chaining
         */
        json: jest.fn().mockImplementation(function(obj) {
            responseState.body = obj;
            mockResponse.body = obj;
            // Automatically set content-type header for JSON responses
            responseState.headers['content-type'] = 'application/json';
            mockResponse.headers['content-type'] = 'application/json';
            return mockResponse; // Enable method chaining
        }),
        
        /**
         * Mock end method - ends response
         * @param {string} data - Optional response data
         * @returns {Object} Mock response object for chaining
         */
        end: jest.fn().mockImplementation(function(data) {
            if (data) {
                responseState.body = data;
                mockResponse.body = data;
            }
            return mockResponse; // Enable method chaining
        }),
        
        /**
         * Mock redirect method - sends redirect response
         * @param {number|string} statusOrUrl - Status code or redirect URL
         * @param {string} url - Redirect URL (if first param is status)
         * @returns {Object} Mock response object for chaining
         */
        redirect: jest.fn().mockImplementation(function(statusOrUrl, url) {
            if (typeof statusOrUrl === 'number') {
                responseState.statusCode = statusOrUrl;
                mockResponse.statusCode = statusOrUrl;
                responseState.headers['location'] = url;
                mockResponse.headers['location'] = url;
            } else {
                responseState.statusCode = 302;
                mockResponse.statusCode = 302;
                responseState.headers['location'] = statusOrUrl;
                mockResponse.headers['location'] = statusOrUrl;
            }
            return mockResponse; // Enable method chaining
        }),
        
        /**
         * Mock cookie method - sets response cookie
         * @param {string} name - Cookie name
         * @param {string} value - Cookie value
         * @param {Object} options - Cookie options
         * @returns {Object} Mock response object for chaining
         */
        cookie: jest.fn().mockImplementation(function(name, value, options) {
            // Store cookie information for assertion
            if (!mockResponse.cookies) mockResponse.cookies = {};
            mockResponse.cookies[name] = { value, options };
            return mockResponse; // Enable method chaining
        }),
        
        /**
         * Mock clearCookie method - clears response cookie
         * @param {string} name - Cookie name
         * @param {Object} options - Cookie options
         * @returns {Object} Mock response object for chaining
         */
        clearCookie: jest.fn().mockImplementation(function(name, options) {
            // Store clear cookie information for assertion
            if (!mockResponse.clearedCookies) mockResponse.clearedCookies = {};
            mockResponse.clearedCookies[name] = options;
            return mockResponse; // Enable method chaining
        })
    };
    
    // Return the fully configured mock response object
    return mockResponse;
}

/**
 * Temporarily replaces logger.info, logger.warn, and logger.error with Jest spies
 * to capture log output during test execution. Provides a restore function to
 * clean up spies after test completion.
 * 
 * This utility enables comprehensive testing of logging behavior throughout the
 * application, ensuring that appropriate logs are generated during request processing,
 * error handling, and server events. Critical for monitoring and observability validation.
 * 
 * @returns {Object} Object containing spy functions and restore method
 * @property {Function} infoSpy - Jest spy for logger.info method
 * @property {Function} warnSpy - Jest spy for logger.warn method  
 * @property {Function} errorSpy - Jest spy for logger.error method
 * @property {Function} restore - Function to restore original logger methods
 * 
 * @example
 * // Capture logger output during test
 * const { infoSpy, warnSpy, errorSpy, restore } = captureLogger();
 * 
 * // Execute code that should log
 * await someFunction();
 * 
 * // Assert logging behavior
 * expect(infoSpy).toHaveBeenCalledWith('Expected log message');
 * expect(errorSpy).not.toHaveBeenCalled();
 * 
 * // Clean up spies
 * restore();
 */
function captureLogger() {
    // Store original logger methods for restoration
    const originalInfo = logger.info;
    const originalWarn = logger.warn;
    const originalError = logger.error;
    
    // Create Jest spy functions to replace logger methods
    const infoSpy = jest.fn();
    const warnSpy = jest.fn();
    const errorSpy = jest.fn();
    
    // Replace logger methods with spies
    logger.info = infoSpy;
    logger.warn = warnSpy;
    logger.error = errorSpy;
    
    // Return spy functions and restore capability
    return {
        infoSpy,
        warnSpy,
        errorSpy,
        
        /**
         * Restores original logger methods after test completion.
         * Critical for preventing side effects between tests and maintaining
         * logger functionality for subsequent test runs.
         */
        restore: function() {
            logger.info = originalInfo;
            logger.warn = originalWarn;
            logger.error = originalError;
        }
    };
}

/**
 * Asserts that a mock response object has the expected status code, headers, and body.
 * Provides comprehensive response validation for unit and integration tests,
 * ensuring that route handlers and middleware generate correct HTTP responses.
 * 
 * This utility centralizes response assertion logic, promoting DRY test practices
 * and consistent validation across all test suites. Validates HTTP protocol
 * compliance and application-specific response requirements.
 * 
 * @param {Object} res - Mock response object to validate
 * @param {number} expectedStatus - Expected HTTP status code
 * @param {Object} expectedHeaders - Expected response headers (key-value pairs, optional)
 * @param {*} expectedBody - Expected response body content
 * @throws {Error} Assertion errors if expectations are not met
 * 
 * @example
 * // Basic response assertion
 * assertResponse(mockRes, 200, null, 'Hello world');
 * 
 * // Response assertion with headers
 * assertResponse(mockRes, 200, { 'content-type': 'text/plain' }, 'Hello world');
 * 
 * // JSON response assertion
 * assertResponse(mockRes, 200, { 'content-type': 'application/json' }, { message: 'success' });
 */
function assertResponse(res, expectedStatus, expectedHeaders, expectedBody) {
    // Assert that response status code matches expected value
    expect(res.statusCode).toBe(expectedStatus);
    
    // Assert that status method was called with correct status code
    expect(res.status).toHaveBeenCalledWith(expectedStatus);
    
    // Assert response headers if provided
    if (expectedHeaders && typeof expectedHeaders === 'object') {
        for (const [headerName, headerValue] of Object.entries(expectedHeaders)) {
            // Check that header was set correctly
            expect(res.headers[headerName]).toBe(headerValue);
            
            // Verify set method was called with header
            expect(res.set).toHaveBeenCalledWith(
                expect.stringMatching(new RegExp(headerName, 'i')),
                headerValue
            );
        }
    }
    
    // Assert response body content matches expected value
    expect(res.body).toBe(expectedBody);
    
    // Assert that send method was called with expected body
    expect(res.send).toHaveBeenCalledWith(expectedBody);
    
    // Verify that method calls occurred in the expected order
    // Status should be called before send
    if (res.status.mock.calls.length > 0 && res.send.mock.calls.length > 0) {
        const statusCallOrder = res.status.mock.invocationCallOrder[0];
        const sendCallOrder = res.send.mock.invocationCallOrder[0];
        expect(statusCallOrder).toBeLessThan(sendCallOrder);
    }
}

// Export all utility functions for use in test suites
module.exports = {
    createMockRequest,
    createMockResponse,
    captureLogger,
    assertResponse
};