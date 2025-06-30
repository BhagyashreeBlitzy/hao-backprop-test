// Jest testing framework for mocking, spying, and assertions - v29.0.0
import * as jest from 'jest';

/**
 * Creates a mock Express.js request object for use in unit and integration tests.
 * Allows simulation of HTTP method, URL, headers, body, params, and query as needed.
 * 
 * @param options - Optional configuration object for request properties
 * @param options.method - HTTP method (default: 'GET')
 * @param options.url - Request URL (default: '/')
 * @param options.headers - Request headers object
 * @param options.body - Request body data
 * @param options.params - Route parameters object
 * @param options.query - Query string parameters object
 * @returns Mock request object with specified properties, suitable for passing to route handlers or middleware
 */
export function createMockRequest(options: {
  method?: string;
  url?: string;
  headers?: Record<string, string | string[]>;
  body?: any;
  params?: Record<string, string>;
  query?: Record<string, string | string[]>;
} = {}): any {
  // Initialize a plain object with default Express.js request properties
  const mockRequest = {
    method: 'GET',
    url: '/',
    headers: {},
    body: {},
    params: {},
    query: {},
    baseUrl: '',
    originalUrl: '',
    path: '',
    protocol: 'http',
    secure: false,
    ip: '127.0.0.1',
    ips: [],
    hostname: 'localhost',
    fresh: false,
    stale: true,
    xhr: false,
    route: undefined,
    cookies: {},
    signedCookies: {},
    get: jest.fn((header: string) => mockRequest.headers[header.toLowerCase()]),
    header: jest.fn((header: string) => mockRequest.headers[header.toLowerCase()]),
    accepts: jest.fn(),
    acceptsCharsets: jest.fn(),
    acceptsEncodings: jest.fn(),
    acceptsLanguages: jest.fn(),
    is: jest.fn(),
    param: jest.fn((key: string) => mockRequest.params[key] || mockRequest.query[key] || mockRequest.body[key]),
    range: jest.fn()
  };

  // Override properties with any provided options
  if (options.method) {
    mockRequest.method = options.method;
  }
  
  if (options.url) {
    mockRequest.url = options.url;
    mockRequest.originalUrl = options.url;
    mockRequest.path = options.url.split('?')[0];
  }
  
  if (options.headers) {
    mockRequest.headers = { ...mockRequest.headers, ...options.headers };
  }
  
  if (options.body) {
    mockRequest.body = options.body;
  }
  
  if (options.params) {
    mockRequest.params = { ...mockRequest.params, ...options.params };
  }
  
  if (options.query) {
    mockRequest.query = { ...mockRequest.query, ...options.query };
  }

  // Return the mock request object
  return mockRequest;
}

/**
 * Creates a mock Express.js response object with spies for status, send, json, set, and end methods.
 * Captures status code, headers, and body for assertion in tests.
 * 
 * @param overrides - Optional partial properties to override the default mock response shape
 * @returns Mock response object with spy methods and properties for statusCode, headers, body, and methods for chaining
 */
export function createMockResponse(overrides: {
  statusCode?: number;
  headers?: Record<string, string>;
  body?: any;
} = {}): any {
  // Create an object with statusCode, headers, and body properties
  const mockResponse = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    body: null as any,
    locals: {},
    headersSent: false,
    finished: false,
    
    // Implement status method as jest.fn() spy that updates statusCode and supports chaining
    status: jest.fn(function(this: any, code: number) {
      this.statusCode = code;
      return this; // Support method chaining
    }),
    
    // Implement send method as jest.fn() spy that captures response body
    send: jest.fn(function(this: any, data: any) {
      this.body = data;
      this.finished = true;
      return this; // Support method chaining
    }),
    
    // Implement json method as jest.fn() spy that captures JSON response
    json: jest.fn(function(this: any, data: any) {
      this.body = data;
      this.set('Content-Type', 'application/json');
      this.finished = true;
      return this; // Support method chaining
    }),
    
    // Implement set method as jest.fn() spy that captures headers
    set: jest.fn(function(this: any, field: string | Record<string, string>, value?: string) {
      if (typeof field === 'string' && value !== undefined) {
        this.headers[field] = value;
      } else if (typeof field === 'object') {
        Object.assign(this.headers, field);
      }
      return this; // Support method chaining
    }),
    
    // Implement end method as jest.fn() spy that marks response as finished
    end: jest.fn(function(this: any, data?: any) {
      if (data !== undefined) {
        this.body = data;
      }
      this.finished = true;
      return this; // Support method chaining
    }),
    
    // Additional Express response methods as spies
    get: jest.fn(function(this: any, field: string) {
      return this.headers[field];
    }),
    
    header: jest.fn(function(this: any, field: string, value?: string) {
      if (value !== undefined) {
        this.headers[field] = value;
        return this;
      }
      return this.headers[field];
    }),
    
    cookie: jest.fn(function(this: any, name: string, value: string, options?: any) {
      return this;
    }),
    
    clearCookie: jest.fn(function(this: any, name: string, options?: any) {
      return this;
    }),
    
    redirect: jest.fn(function(this: any, statusOrUrl: number | string, url?: string) {
      if (typeof statusOrUrl === 'number') {
        this.statusCode = statusOrUrl;
        if (url) {
          this.set('Location', url);
        }
      } else {
        this.statusCode = 302;
        this.set('Location', statusOrUrl);
      }
      this.finished = true;
      return this;
    }),
    
    type: jest.fn(function(this: any, contentType: string) {
      this.set('Content-Type', contentType);
      return this;
    }),
    
    attachment: jest.fn(function(this: any, filename?: string) {
      if (filename) {
        this.set('Content-Disposition', `attachment; filename="${filename}"`);
      } else {
        this.set('Content-Disposition', 'attachment');
      }
      return this;
    })
  };

  // Apply any overrides to the mock response object
  if (overrides.statusCode !== undefined) {
    mockResponse.statusCode = overrides.statusCode;
  }
  
  if (overrides.headers) {
    Object.assign(mockResponse.headers, overrides.headers);
  }
  
  if (overrides.body !== undefined) {
    mockResponse.body = overrides.body;
  }

  // Return the mock response object
  return mockResponse;
}

/**
 * Creates a mock next() function for use in Express.js middleware tests.
 * Allows verification of whether next() was called and with what arguments.
 * 
 * @returns A jest.fn() spy function to be passed as the next argument in middleware tests
 */
export function simulateNext(): jest.MockedFunction<(err?: any) => void> {
  // Return jest.fn() to act as the next() function
  // Allows assertions on call count and arguments
  return jest.fn((err?: any) => {
    // Optional callback behavior for more realistic simulation
    if (err) {
      // In real Express, next(err) would trigger error handling middleware
      // For testing, we just capture the error argument
    }
  });
}

/**
 * Creates a standard or custom Error object for use in error handler and middleware tests.
 * Supports setting status, message, and additional properties.
 * 
 * @param message - Optional error message (default: 'Test error')
 * @param status - Optional HTTP status code to assign to error.status
 * @param props - Optional additional properties to assign to the error object
 * @returns An Error object with the specified message, status, and properties
 */
export function simulateError(
  message: string = 'Test error',
  status?: number,
  props?: Record<string, any>
): Error {
  // Create a new Error object with the provided message
  const error = new Error(message);
  
  // If status is provided, assign it to error.status
  if (status !== undefined) {
    (error as any).status = status;
    (error as any).statusCode = status; // Some libraries check statusCode instead
  }
  
  // Assign any additional properties from props to the error object
  if (props) {
    Object.assign(error, props);
  }
  
  // Return the error object
  return error;
}

/**
 * Asserts that a mock response object matches the expected status, body, and headers.
 * Used to DRY up assertions in route, middleware, and utility tests.
 * 
 * @param res - Mock response object created by createMockResponse
 * @param expectedStatus - Expected HTTP status code
 * @param expectedBody - Expected response body content
 * @param expectedHeaders - Optional expected headers object
 * @throws Assertion errors if the response does not match expectations
 */
export function assertResponse(
  res: any,
  expectedStatus: number,
  expectedBody: any,
  expectedHeaders?: Record<string, string>
): void {
  // Assert that res.statusCode equals expectedStatus
  expect(res.statusCode).toBe(expectedStatus);
  
  // Assert that res.body (or the captured body) matches expectedBody  
  expect(res.body).toEqual(expectedBody);
  
  // If expectedHeaders are provided, assert that each header matches the value in res.headers
  if (expectedHeaders) {
    Object.entries(expectedHeaders).forEach(([headerName, expectedValue]) => {
      expect(res.headers[headerName]).toBe(expectedValue);
    });
  }
  
  // Additional assertions for common scenarios
  if (expectedStatus >= 200 && expectedStatus < 300) {
    // For successful responses, ensure the response was finished
    expect(res.finished).toBe(true);
  }
  
  // Throw assertion errors if any check fails (handled by Jest expect() calls above)
}

/**
 * Consolidated test utilities object containing all helper functions.
 * Provides convenient access to all test utilities for global registration or bulk importing.
 */
export const testUtils = {
  createMockRequest,
  createMockResponse,
  simulateNext,
  simulateError,
  assertResponse
};

// Additional utility functions for enhanced testing capabilities

/**
 * Creates a mock Express application instance for testing purposes.
 * Useful for testing middleware and application-level functionality.
 * 
 * @returns Mock Express app with common methods stubbed
 */
export function createMockApp(): any {
  return {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
    use: jest.fn(),
    listen: jest.fn(),
    set: jest.fn(),
    locals: {},
    mountpath: '/',
    enabled: jest.fn(() => true),
    disabled: jest.fn(() => false),
    enable: jest.fn(),
    disable: jest.fn(),
    engine: jest.fn(),
    param: jest.fn(),
    path: jest.fn(),
    render: jest.fn()
  };
}

/**
 * Creates a standardized test environment setup for HTTP endpoint testing.
 * Provides consistent configuration for route and middleware testing.
 * 
 * @param options - Configuration options for the test environment
 * @returns Object containing configured test utilities and helpers
 */
export function setupTestEnvironment(options: {
  mockApp?: boolean;
  defaultHeaders?: Record<string, string>;
  defaultQuery?: Record<string, string>;
} = {}): {
  createRequest: (overrides?: any) => any;
  createResponse: (overrides?: any) => any;
  createNext: () => jest.MockedFunction<(err?: any) => void>;
  mockApp?: any;
} {
  const { mockApp = false, defaultHeaders = {}, defaultQuery = {} } = options;
  
  return {
    createRequest: (overrides = {}) => createMockRequest({
      headers: { ...defaultHeaders, ...(overrides.headers || {}) },
      query: { ...defaultQuery, ...(overrides.query || {}) },
      ...overrides
    }),
    createResponse: (overrides = {}) => createMockResponse(overrides),
    createNext: () => simulateNext(),
    ...(mockApp && { mockApp: createMockApp() })
  };
}

/**
 * Validates that a Jest spy function was called with expected arguments.
 * Provides detailed assertion messages for better test debugging.
 * 
 * @param spy - Jest spy function to validate
 * @param expectedCalls - Array of expected call arguments
 */
export function assertSpyCalls(
  spy: jest.MockedFunction<any>,
  expectedCalls: any[][]
): void {
  expect(spy).toHaveBeenCalledTimes(expectedCalls.length);
  
  expectedCalls.forEach((expectedArgs, callIndex) => {
    expect(spy).toHaveBeenNthCalledWith(callIndex + 1, ...expectedArgs);
  });
}

/**
 * Creates a mock timer for testing time-based functionality.
 * Useful for testing timeouts, intervals, and time-sensitive operations.
 * 
 * @returns Object with timer control methods
 */
export function createMockTimer(): {
  advanceTime: (ms: number) => void;
  runAllTimers: () => void;
  clearAllTimers: () => void;
  restore: () => void;
} {
  jest.useFakeTimers();
  
  return {
    advanceTime: (ms: number) => jest.advanceTimersByTime(ms),
    runAllTimers: () => jest.runAllTimers(),
    clearAllTimers: () => jest.clearAllTimers(),
    restore: () => jest.useRealTimers()
  };
}

// Export all utilities for convenient access
export {
  createMockApp,
  setupTestEnvironment,
  assertSpyCalls,
  createMockTimer
};