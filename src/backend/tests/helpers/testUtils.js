// Jest testing framework - ^29.0.0
// Provides comprehensive testing utilities and mocking capabilities for the Node.js tutorial application
const jest = require('jest');

/**
 * Creates a mock Express.js request object for use in unit and integration tests.
 * Allows simulation of HTTP method, URL, headers, body, params, and query as needed.
 * 
 * @param {Object} options - Optional configuration object for the mock request
 * @param {string} options.method - HTTP method (default: 'GET')
 * @param {string} options.url - Request URL path (default: '/')
 * @param {Object} options.headers - Request headers object (default: {})
 * @param {any} options.body - Request body content (default: {})
 * @param {Object} options.params - Route parameters object (default: {})
 * @param {Object} options.query - Query string parameters object (default: {})
 * @returns {Object} A mock request object with the specified properties, suitable for passing to route handlers or middleware
 * 
 * @example
 * const mockReq = createMockRequest({
 *   method: 'GET',
 *   url: '/hello',
 *   headers: { 'content-type': 'application/json' },
 *   query: { param: 'value' }
 * });
 */
function createMockRequest(options = {}) {
    // Initialize a plain object with default Express.js request properties
    const mockRequest = {
        method: 'GET',
        url: '/',
        path: '/',
        headers: {},
        body: {},
        params: {},
        query: {},
        cookies: {},
        session: {},
        user: null,
        ip: '127.0.0.1',
        protocol: 'http',
        secure: false,
        xhr: false,
        fresh: false,
        stale: true,
        hostname: 'localhost',
        originalUrl: '/',
        baseUrl: '',
        subdomains: [],
        route: null,
        app: null,
        res: null,
        next: null
    };

    // Override properties with any provided options (method, url, headers, body, params, query)
    if (options.method) {
        mockRequest.method = options.method.toUpperCase();
    }
    
    if (options.url) {
        mockRequest.url = options.url;
        mockRequest.path = options.url.split('?')[0]; // Extract path without query string
        mockRequest.originalUrl = options.url;
    }
    
    if (options.headers) {
        mockRequest.headers = { ...mockRequest.headers, ...options.headers };
        // Set derived properties based on headers
        if (options.headers['content-type']) {
            mockRequest.get = jest.fn((headerName) => {
                return mockRequest.headers[headerName.toLowerCase()] || mockRequest.headers[headerName];
            });
        }
    }
    
    if (options.body !== undefined) {
        mockRequest.body = options.body;
    }
    
    if (options.params) {
        mockRequest.params = { ...mockRequest.params, ...options.params };
    }
    
    if (options.query) {
        mockRequest.query = { ...mockRequest.query, ...options.query };
    }

    // Add common Express request methods as Jest mocks
    if (!mockRequest.get) {
        mockRequest.get = jest.fn((headerName) => {
            return mockRequest.headers[headerName.toLowerCase()] || mockRequest.headers[headerName];
        });
    }
    
    mockRequest.header = mockRequest.get; // Alias for get method
    mockRequest.is = jest.fn(); // Content-Type checking method
    mockRequest.param = jest.fn((name) => {
        return mockRequest.params[name] || mockRequest.query[name] || mockRequest.body[name];
    });
    mockRequest.range = jest.fn();
    mockRequest.accepts = jest.fn();
    mockRequest.acceptsCharsets = jest.fn();
    mockRequest.acceptsEncodings = jest.fn();
    mockRequest.acceptsLanguages = jest.fn();

    // Return the mock request object
    return mockRequest;
}

/**
 * Creates a mock Express.js response object with spies for status, send, json, set, and end methods.
 * Captures status code, headers, and body for assertion in tests.
 * 
 * @returns {Object} A mock response object with spy methods and properties for statusCode, headers, body, and methods for chaining
 * 
 * @example
 * const mockRes = createMockResponse();
 * mockRes.status(200).json({ message: 'Hello world' });
 * expect(mockRes.statusCode).toBe(200);
 * expect(mockRes.body).toEqual({ message: 'Hello world' });
 */
function createMockResponse() {
    // Create an object with statusCode, headers, and body properties
    const mockResponse = {
        statusCode: 200,
        headers: {},
        body: null,
        locals: {},
        finished: false,
        headersSent: false,
        req: null,
        app: null
    };

    // Implement status, send, json, set, and end methods as jest.fn() spies
    // Each method updates the corresponding property and supports chaining (returns this)
    
    /**
     * Sets the HTTP status code for the response
     * @param {number} code - HTTP status code
     * @returns {Object} The mock response object for chaining
     */
    mockResponse.status = jest.fn((code) => {
        mockResponse.statusCode = code;
        return mockResponse; // Support method chaining
    });

    /**
     * Sends a response with optional data
     * @param {any} data - Response data to send
     * @returns {Object} The mock response object for chaining
     */
    mockResponse.send = jest.fn((data) => {
        // Capture the response body and headers for later assertion
        mockResponse.body = data;
        mockResponse.finished = true;
        return mockResponse; // Support method chaining
    });

    /**
     * Sends a JSON response
     * @param {any} data - JSON data to send
     * @returns {Object} The mock response object for chaining
     */
    mockResponse.json = jest.fn((data) => {
        // Set content-type header for JSON responses
        mockResponse.headers['content-type'] = 'application/json; charset=utf-8';
        // Capture the response body and headers for later assertion
        mockResponse.body = data;
        mockResponse.finished = true;
        return mockResponse; // Support method chaining
    });

    /**
     * Sets response headers
     * @param {string|Object} field - Header name or object of header key-value pairs
     * @param {string} value - Header value (if field is a string)
     * @returns {Object} The mock response object for chaining
     */
    mockResponse.set = jest.fn((field, value) => {
        if (typeof field === 'object' && field !== null) {
            // Set multiple headers from object
            Object.assign(mockResponse.headers, field);
        } else if (typeof field === 'string' && value !== undefined) {
            // Set single header
            mockResponse.headers[field.toLowerCase()] = value;
        }
        return mockResponse; // Support method chaining
    });

    /**
     * Alias for set method (Express.js compatibility)
     */
    mockResponse.header = mockResponse.set;

    /**
     * Sets a single header value
     * @param {string} name - Header name
     * @param {string} value - Header value
     * @returns {Object} The mock response object for chaining
     */
    mockResponse.setHeader = jest.fn((name, value) => {
        mockResponse.headers[name.toLowerCase()] = value;
        return mockResponse;
    });

    /**
     * Gets a header value
     * @param {string} name - Header name
     * @returns {string|undefined} Header value
     */
    mockResponse.getHeader = jest.fn((name) => {
        return mockResponse.headers[name.toLowerCase()];
    });

    /**
     * Ends the response process
     * @param {any} data - Optional data to send before ending
     * @returns {Object} The mock response object for chaining
     */
    mockResponse.end = jest.fn((data) => {
        if (data !== undefined) {
            mockResponse.body = data;
        }
        mockResponse.finished = true;
        return mockResponse; // Support method chaining
    });

    /**
     * Redirects the request
     * @param {number|string} status - Status code or URL
     * @param {string} url - URL (if status is a number)
     * @returns {Object} The mock response object for chaining
     */
    mockResponse.redirect = jest.fn((status, url) => {
        if (typeof status === 'string') {
            // Only URL provided, default to 302 redirect
            mockResponse.statusCode = 302;
            mockResponse.headers.location = status;
        } else {
            // Status code and URL provided
            mockResponse.statusCode = status;
            mockResponse.headers.location = url;
        }
        mockResponse.finished = true;
        return mockResponse;
    });

    /**
     * Sets response cookies
     * @param {string} name - Cookie name
     * @param {string} value - Cookie value
     * @param {Object} options - Cookie options
     * @returns {Object} The mock response object for chaining
     */
    mockResponse.cookie = jest.fn((name, value, options = {}) => {
        if (!mockResponse.headers['set-cookie']) {
            mockResponse.headers['set-cookie'] = [];
        }
        const cookieString = `${name}=${value}`;
        mockResponse.headers['set-cookie'].push(cookieString);
        return mockResponse;
    });

    /**
     * Clears response cookies
     * @param {string} name - Cookie name to clear
     * @param {Object} options - Cookie options
     * @returns {Object} The mock response object for chaining
     */
    mockResponse.clearCookie = jest.fn((name, options = {}) => {
        return mockResponse.cookie(name, '', { ...options, expires: new Date(0) });
    });

    // Return the mock response object
    return mockResponse;
}

/**
 * Creates a mock next() function for use in Express.js middleware tests.
 * Allows verification of whether next() was called and with what arguments.
 * 
 * @returns {Function} A jest.fn() spy function to be passed as the next argument in middleware tests
 * 
 * @example
 * const next = simulateNext();
 * middleware(req, res, next);
 * expect(next).toHaveBeenCalled();
 * expect(next).toHaveBeenCalledWith(error);
 */
function simulateNext() {
    // Return jest.fn() to act as the next() function
    // Allows assertions on call count and arguments
    const nextFunction = jest.fn();
    
    // Add additional helper methods for more detailed testing
    nextFunction.calledWith = (expectedArg) => {
        const calls = nextFunction.mock.calls;
        return calls.some(call => {
            if (expectedArg === undefined) {
                return call.length === 0;
            }
            return call.length === 1 && call[0] === expectedArg;
        });
    };
    
    nextFunction.calledWithError = () => {
        const calls = nextFunction.mock.calls;
        return calls.some(call => call.length === 1 && call[0] instanceof Error);
    };
    
    nextFunction.notCalled = () => {
        return nextFunction.mock.calls.length === 0;
    };

    return nextFunction;
}

/**
 * Creates a standard or custom Error object for use in error handler and middleware tests.
 * Supports setting status, message, and additional properties.
 * 
 * @param {string} message - Error message (optional, default: 'Test error')
 * @param {number} status - HTTP status code (optional, e.g., 500)
 * @param {Object} props - Additional properties to assign to the error (optional)
 * @returns {Error} An Error object with the specified message, status, and properties
 * 
 * @example
 * const error = simulateError('Not found', 404, { code: 'NOT_FOUND' });
 * expect(error.message).toBe('Not found');
 * expect(error.status).toBe(404);
 * expect(error.code).toBe('NOT_FOUND');
 */
function simulateError(message = 'Test error', status = null, props = {}) {
    // Create a new Error object with the provided message
    const error = new Error(message);
    
    // If status is provided, assign it to error.status
    if (status !== null && typeof status === 'number') {
        error.status = status;
        error.statusCode = status; // Common alias used by some middleware
    }
    
    // Assign any additional properties from props to the error object
    if (props && typeof props === 'object') {
        Object.assign(error, props);
    }
    
    // Add common error properties for better testing support
    error.name = error.name || 'Error';
    error.timestamp = error.timestamp || new Date().toISOString();
    
    // Enhanced error properties for better debugging in tests
    if (!error.stack) {
        Error.captureStackTrace(error, simulateError);
    }
    
    // Return the error object
    return error;
}

/**
 * Asserts that a mock response object matches the expected status, body, and headers.
 * Used to DRY up assertions in route, middleware, and utility tests.
 * 
 * @param {Object} res - Mock response object created by createMockResponse()
 * @param {number} expectedStatus - Expected HTTP status code
 * @param {any} expectedBody - Expected response body content
 * @param {Object} expectedHeaders - Expected response headers (optional)
 * @throws {Error} Throws assertion errors if the response does not match expectations
 * 
 * @example
 * assertResponse(mockRes, 200, 'Hello world', { 'content-type': 'text/plain' });
 * assertResponse(mockRes, 404, { error: 'Not found' });
 */
function assertResponse(res, expectedStatus, expectedBody, expectedHeaders = null) {
    // Assert that res.statusCode equals expectedStatus
    if (res.statusCode !== expectedStatus) {
        throw new Error(
            `Expected status code ${expectedStatus}, but got ${res.statusCode}`
        );
    }
    
    // Assert that res.body (or the captured body) matches expectedBody
    if (expectedBody !== undefined) {
        if (typeof expectedBody === 'object' && expectedBody !== null) {
            // Deep comparison for objects
            try {
                expect(res.body).toEqual(expectedBody);
            } catch (error) {
                throw new Error(
                    `Expected body to equal ${JSON.stringify(expectedBody)}, but got ${JSON.stringify(res.body)}`
                );
            }
        } else {
            // Direct comparison for primitives
            if (res.body !== expectedBody) {
                throw new Error(
                    `Expected body to be ${JSON.stringify(expectedBody)}, but got ${JSON.stringify(res.body)}`
                );
            }
        }
    }
    
    // If expectedHeaders are provided, assert that each header matches the value in res.headers
    if (expectedHeaders && typeof expectedHeaders === 'object') {
        for (const [headerName, expectedValue] of Object.entries(expectedHeaders)) {
            const actualValue = res.headers[headerName.toLowerCase()];
            
            if (typeof expectedValue === 'string' && actualValue) {
                // For string headers, support partial matching (useful for content-type with charset)
                if (!actualValue.includes(expectedValue)) {
                    throw new Error(
                        `Expected header '${headerName}' to contain '${expectedValue}', but got '${actualValue}'`
                    );
                }
            } else if (actualValue !== expectedValue) {
                throw new Error(
                    `Expected header '${headerName}' to be '${expectedValue}', but got '${actualValue}'`
                );
            }
        }
    }
    
    // Additional validation for common response patterns
    if (res.finished !== true && (res.body !== null || res.statusCode !== 200)) {
        throw new Error('Response should be marked as finished after sending data');
    }
}

/**
 * Validates that a mock response object has the expected structure and spy function calls.
 * Useful for ensuring mocks were called correctly in tests.
 * 
 * @param {Object} res - Mock response object to validate
 * @param {Object} expectations - Object containing expected method calls
 * @throws {Error} Throws assertion errors if method call expectations are not met
 * 
 * @example
 * validateResponseMock(mockRes, {
 *   status: { called: true, calledWith: [200] },
 *   json: { called: true, calledWith: [{ message: 'Hello' }] }
 * });
 */
function validateResponseMock(res, expectations = {}) {
    const methods = ['status', 'send', 'json', 'set', 'end', 'redirect', 'cookie'];
    
    for (const method of methods) {
        if (expectations[method]) {
            const expectation = expectations[method];
            const mockMethod = res[method];
            
            if (expectation.called !== undefined) {
                const wasCalled = mockMethod.mock.calls.length > 0;
                if (expectation.called !== wasCalled) {
                    throw new Error(
                        `Expected ${method} to ${expectation.called ? 'be called' : 'not be called'}, but it was${wasCalled ? '' : 'n\'t'}`
                    );
                }
            }
            
            if (expectation.calledWith) {
                const lastCall = mockMethod.mock.calls[mockMethod.mock.calls.length - 1];
                if (!lastCall || !arraysEqual(lastCall, expectation.calledWith)) {
                    throw new Error(
                        `Expected ${method} to be called with ${JSON.stringify(expectation.calledWith)}, but was called with ${JSON.stringify(lastCall)}`
                    );
                }
            }
            
            if (expectation.callCount !== undefined) {
                if (mockMethod.mock.calls.length !== expectation.callCount) {
                    throw new Error(
                        `Expected ${method} to be called ${expectation.callCount} times, but was called ${mockMethod.mock.calls.length} times`
                    );
                }
            }
        }
    }
}

/**
 * Helper function for deep array comparison
 * @private
 */
function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (typeof a[i] === 'object' && typeof b[i] === 'object') {
            if (!objectsEqual(a[i], b[i])) return false;
        } else if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

/**
 * Helper function for deep object comparison
 * @private
 */
function objectsEqual(a, b) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
        if (!keysB.includes(key)) return false;
        if (typeof a[key] === 'object' && typeof b[key] === 'object') {
            if (!objectsEqual(a[key], b[key])) return false;
        } else if (a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}

// Export all functions individually for direct imports
module.exports = {
    createMockRequest,
    createMockResponse,
    simulateNext,
    simulateError,
    assertResponse,
    validateResponseMock,
    
    // Export all test utility helpers as a single object for convenient import and global registration in setup.js
    testUtils: {
        createMockRequest,
        createMockResponse,
        simulateNext,
        simulateError,
        assertResponse,
        validateResponseMock
    }
};