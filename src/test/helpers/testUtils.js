/**
 * Centralized Test Utility Module for HTTP Request Simulation and Assertion Logic
 * 
 * This module provides reusable test helpers for HTTP request simulation and assertion logic
 * across all test suites (unit, integration, e2e, performance) for the Node.js/Express.js
 * tutorial application. It exposes DRY functions for making HTTP requests to Express apps
 * or routers using Supertest, and for asserting canonical responses for the /hello endpoint
 * and error scenarios.
 * 
 * Key Features:
 * - Consistent HTTP request simulation across all test suites
 * - Standardized assertion logic for canonical responses
 * - Support for all HTTP methods and request configurations
 * - Centralized error response validation
 * - Maintainable and robust test code patterns
 * 
 * Usage:
 * - Import by all test suites (unit, integration, e2e, performance)
 * - Ensures consistent request execution and response validation
 * - Supports both Express app instances and routers
 * - If canonical response messages change, only this file and fixtures need updates
 * 
 * Dependencies:
 * - supertest ^7.1.1: HTTP request simulation for Express apps/routers
 * - jest ^29.7.0: Assertion library with expect() function
 * - Canonical response constants from fixtures/responses.js
 */

// Import canonical response constants for consistent test assertions
const {
  HELLO_RESPONSE,
  NOT_FOUND_RESPONSE,
  METHOD_NOT_ALLOWED_RESPONSE,
  INTERNAL_SERVER_ERROR_RESPONSE
} = require('../fixtures/responses.js');

// Import Supertest for HTTP request simulation and Jest for assertions
const supertest = require('supertest'); // ^7.1.1 - HTTP testing library for Express apps
const { expect } = require('jest'); // ^29.7.0 - Assertion library for test expectations

/**
 * Sends an HTTP request to the provided Express app or router using Supertest
 * 
 * This function creates a reusable HTTP request helper that supports all HTTP methods,
 * paths, headers, and payloads. It works with both Express application instances and
 * Express routers, providing a consistent interface for request simulation across
 * all test suites.
 * 
 * The function uses Supertest to create an agent for the provided app/router,
 * configures the request with the specified method and path, applies any optional
 * headers, query parameters, or body data, and returns the Supertest response
 * object for further assertions.
 * 
 * @param {object} appOrRouter - Express application instance or Express router to test
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, PATCH, etc.)
 * @param {string} path - Request path/URL (e.g., '/hello', '/api/users')
 * @param {object} [options={}] - Optional request configuration object
 * @param {object} [options.headers] - Custom headers to include in request
 * @param {object} [options.query] - Query parameters to append to URL
 * @param {*} [options.body] - Request body data (JSON, form data, etc.)
 * @param {string} [options.contentType] - Content-Type header override
 * @param {object} [options.auth] - Authentication credentials (if needed)
 * @returns {Promise<object>} Supertest response object containing status, headers, and body
 * 
 * @example
 * // Basic GET request
 * const response = await makeRequest(app, 'GET', '/hello');
 * 
 * @example
 * // POST request with body and headers
 * const response = await makeRequest(app, 'POST', '/api/users', {
 *   headers: { 'Content-Type': 'application/json' },
 *   body: { name: 'John', email: 'john@example.com' }
 * });
 * 
 * @example
 * // GET request with query parameters
 * const response = await makeRequest(app, 'GET', '/api/search', {
 *   query: { q: 'test', limit: 10 }
 * });
 */
async function makeRequest(appOrRouter, method, path, options = {}) {
  try {
    // Validate required parameters
    if (!appOrRouter) {
      throw new Error('appOrRouter parameter is required for makeRequest()');
    }
    if (!method || typeof method !== 'string') {
      throw new Error('method parameter must be a non-empty string');
    }
    if (!path || typeof path !== 'string') {
      throw new Error('path parameter must be a non-empty string');
    }
    if (options && typeof options !== 'object') {
      throw new Error('options parameter must be an object when provided');
    }

    // Normalize HTTP method to uppercase for consistency
    const normalizedMethod = method.toUpperCase();
    
    // Create Supertest agent for the provided Express app or router
    const request = supertest(appOrRouter);
    
    // Initialize request with the specified HTTP method and path
    let testRequest;
    switch (normalizedMethod) {
      case 'GET':
        testRequest = request.get(path);
        break;
      case 'POST':
        testRequest = request.post(path);
        break;
      case 'PUT':
        testRequest = request.put(path);
        break;
      case 'DELETE':
        testRequest = request.delete(path);
        break;
      case 'PATCH':
        testRequest = request.patch(path);
        break;
      case 'HEAD':
        testRequest = request.head(path);
        break;
      case 'OPTIONS':
        testRequest = request.options(path);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    // Apply custom headers if provided
    if (options.headers && typeof options.headers === 'object') {
      Object.entries(options.headers).forEach(([key, value]) => {
        testRequest.set(key, value);
      });
    }

    // Apply query parameters if provided
    if (options.query && typeof options.query === 'object') {
      testRequest.query(options.query);
    }

    // Apply request body if provided and method supports it
    if (options.body !== undefined && ['POST', 'PUT', 'PATCH'].includes(normalizedMethod)) {
      // Set content type if explicitly provided
      if (options.contentType) {
        testRequest.set('Content-Type', options.contentType);
      }
      
      // Send the body data
      testRequest.send(options.body);
    }

    // Apply authentication if provided
    if (options.auth && typeof options.auth === 'object') {
      if (options.auth.username && options.auth.password) {
        testRequest.auth(options.auth.username, options.auth.password);
      } else if (options.auth.token) {
        testRequest.set('Authorization', `Bearer ${options.auth.token}`);
      }
    }

    // Send the request and await the response
    const response = await testRequest;
    
    // Return the Supertest response object for further assertions
    return response;
    
  } catch (error) {
    // Enhance error message for better debugging
    const enhancedError = new Error(
      `makeRequest failed for ${method} ${path}: ${error.message}`
    );
    enhancedError.originalError = error;
    throw enhancedError;
  }
}

/**
 * Reusable assertion for validating the canonical /hello endpoint response
 * 
 * This function provides standardized assertion logic for validating responses
 * from the /hello endpoint across all test suites. It ensures consistent
 * validation of the canonical response including status code, content type,
 * and exact body content match.
 * 
 * The assertion checks:
 * - HTTP status code is exactly 200 (OK)
 * - Content-Type header includes 'text/plain'
 * - Response body exactly matches the canonical HELLO_RESPONSE constant
 * 
 * This centralized assertion ensures that all tests validate the /hello endpoint
 * using identical logic. If the canonical response format changes, only this
 * function and the response fixtures need to be updated.
 * 
 * @param {object} response - Supertest response object from makeRequest() or direct Supertest call
 * @param {number} response.status - HTTP status code from the response
 * @param {object} response.headers - HTTP headers object from the response
 * @param {string} response.text - Plain text response body content
 * @param {*} response.body - Parsed response body (may be string or object)
 * @returns {void} - Throws assertion errors if expectations are not met
 * 
 * @throws {Error} Assertion error if status code is not 200
 * @throws {Error} Assertion error if Content-Type header is incorrect
 * @throws {Error} Assertion error if response body doesn't match expected content
 * 
 * @example
 * // Basic usage with makeRequest helper
 * const response = await makeRequest(app, 'GET', '/hello');
 * assertHelloResponse(response);
 * 
 * @example
 * // Direct usage with Supertest response
 * const response = await supertest(app).get('/hello');
 * assertHelloResponse(response);
 */
function assertHelloResponse(response) {
  try {
    // Validate that response object is provided
    if (!response || typeof response !== 'object') {
      throw new Error('Response object is required for assertHelloResponse()');
    }

    // Assert that the HTTP status code is exactly 200 (OK)
    expect(response.status).toBe(200);
    
    // Assert that the Content-Type header includes 'text/plain'
    // This handles variations like 'text/plain; charset=utf-8'
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('text/plain')
    );
    
    // Assert that the response body exactly matches the canonical HELLO_RESPONSE
    // Use response.text for plain text responses, fallback to response.body
    const responseContent = response.text || response.body;
    expect(responseContent).toBe(HELLO_RESPONSE);
    
  } catch (error) {
    // Enhance assertion error with context for better debugging
    if (error.matcherResult || error.name === 'JestAssertionError') {
      // Re-throw Jest assertion errors with additional context
      const enhancedError = new Error(
        `assertHelloResponse failed: ${error.message}\n` +
        `Response status: ${response.status}\n` +
        `Response content-type: ${response.headers?.['content-type']}\n` +
        `Response body: ${JSON.stringify(response.text || response.body)}\n` +
        `Expected body: ${JSON.stringify(HELLO_RESPONSE)}`
      );
      enhancedError.originalError = error;
      throw enhancedError;
    } else {
      // Handle other errors (e.g., missing response object)
      throw error;
    }
  }
}

/**
 * Reusable assertion for validating error responses (404, 405, 500, etc.)
 * 
 * This function provides standardized assertion logic for validating HTTP error
 * responses across all test suites. It ensures consistent validation of error
 * scenarios including status codes and error message content.
 * 
 * The assertion checks:
 * - HTTP status code matches the expected error status
 * - Response body exactly matches the expected canonical error message
 * 
 * This centralized assertion ensures that all tests validate error responses
 * using identical logic. It supports validation of standard HTTP error codes
 * like 404 (Not Found), 405 (Method Not Allowed), and 500 (Internal Server Error).
 * 
 * @param {object} response - Supertest response object from makeRequest() or direct Supertest call
 * @param {number} response.status - HTTP status code from the response
 * @param {string} response.text - Plain text response body content
 * @param {*} response.body - Parsed response body (may be string or object)
 * @param {number} expectedStatus - Expected HTTP status code (e.g., 404, 405, 500)
 * @param {string} expectedBody - Expected response body content to match exactly
 * @returns {void} - Throws assertion errors if expectations are not met
 * 
 * @throws {Error} Assertion error if status code doesn't match expected value
 * @throws {Error} Assertion error if response body doesn't match expected content
 * @throws {Error} Parameter validation error for invalid inputs
 * 
 * @example
 * // Validate 404 Not Found error
 * const response = await makeRequest(app, 'GET', '/invalid-route');
 * assertErrorResponse(response, 404, NOT_FOUND_RESPONSE);
 * 
 * @example
 * // Validate 405 Method Not Allowed error
 * const response = await makeRequest(app, 'POST', '/hello');
 * assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
 * 
 * @example
 * // Validate 500 Internal Server Error
 * const response = await makeRequest(app, 'GET', '/error-endpoint');
 * assertErrorResponse(response, 500, INTERNAL_SERVER_ERROR_RESPONSE);
 */
function assertErrorResponse(response, expectedStatus, expectedBody) {
  try {
    // Validate required parameters
    if (!response || typeof response !== 'object') {
      throw new Error('Response object is required for assertErrorResponse()');
    }
    if (!expectedStatus || typeof expectedStatus !== 'number') {
      throw new Error('expectedStatus must be a valid HTTP status code number');
    }
    if (expectedBody === undefined || expectedBody === null) {
      throw new Error('expectedBody parameter is required for assertErrorResponse()');
    }
    if (typeof expectedBody !== 'string') {
      throw new Error('expectedBody must be a string');
    }

    // Validate that expectedStatus is a valid HTTP error status code
    if (expectedStatus < 400 || expectedStatus >= 600) {
      throw new Error(`expectedStatus ${expectedStatus} is not a valid HTTP error status code (400-599)`);
    }

    // Assert that the HTTP status code matches the expected error status
    expect(response.status).toBe(expectedStatus);
    
    // Assert that the response body exactly matches the expected error message
    // Use response.text for plain text responses, fallback to response.body
    const responseContent = response.text || response.body;
    expect(responseContent).toBe(expectedBody);
    
  } catch (error) {
    // Enhance assertion error with context for better debugging
    if (error.matcherResult || error.name === 'JestAssertionError') {
      // Re-throw Jest assertion errors with additional context
      const enhancedError = new Error(
        `assertErrorResponse failed: ${error.message}\n` +
        `Expected status: ${expectedStatus}\n` +
        `Actual status: ${response.status}\n` +
        `Expected body: ${JSON.stringify(expectedBody)}\n` +
        `Actual body: ${JSON.stringify(response.text || response.body)}`
      );
      enhancedError.originalError = error;
      throw enhancedError;
    } else {
      // Handle other errors (e.g., parameter validation)
      throw error;
    }
  }
}

/**
 * Helper function to create common test scenarios for error validation
 * 
 * This utility function provides pre-configured error scenarios for common
 * HTTP error cases, making it easier to test standard error responses
 * consistently across test suites.
 * 
 * @param {object} appOrRouter - Express application instance or router to test
 * @returns {object} Object containing common error test scenarios
 */
function createErrorTestScenarios(appOrRouter) {
  return {
    /**
     * Test 404 Not Found error for invalid routes
     * @param {string} invalidPath - Path that should return 404
     * @returns {Promise<object>} Test scenario result
     */
    async testNotFound(invalidPath = '/invalid-route') {
      const response = await makeRequest(appOrRouter, 'GET', invalidPath);
      assertErrorResponse(response, 404, NOT_FOUND_RESPONSE);
      return { response, status: 'passed' };
    },

    /**
     * Test 405 Method Not Allowed error for unsupported methods
     * @param {string} path - Valid path with unsupported method
     * @param {string} method - HTTP method that should not be allowed
     * @returns {Promise<object>} Test scenario result
     */
    async testMethodNotAllowed(path = '/hello', method = 'POST') {
      const response = await makeRequest(appOrRouter, method, path);
      assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
      return { response, status: 'passed' };
    }
  };
}

/**
 * Helper function to create performance test utilities
 * 
 * This utility function provides helpers for performance and concurrency tests
 * to validate response times and correctness under load, supporting the
 * performance requirements specified in the technical documentation.
 * 
 * @param {object} appOrRouter - Express application instance or router to test
 * @returns {object} Object containing performance test utilities
 */
function createPerformanceTestUtils(appOrRouter) {
  return {
    /**
     * Test response time for a given endpoint
     * @param {string} method - HTTP method to test
     * @param {string} path - Endpoint path to test
     * @param {number} maxResponseTime - Maximum acceptable response time in ms
     * @returns {Promise<object>} Performance test result
     */
    async testResponseTime(method = 'GET', path = '/hello', maxResponseTime = 100) {
      const startTime = Date.now();
      const response = await makeRequest(appOrRouter, method, path);
      const responseTime = Date.now() - startTime;
      
      expect(responseTime).toBeLessThan(maxResponseTime);
      
      return {
        response,
        responseTime,
        maxResponseTime,
        status: 'passed'
      };
    },

    /**
     * Test concurrent requests to validate performance under load
     * @param {string} method - HTTP method to test
     * @param {string} path - Endpoint path to test
     * @param {number} concurrentRequests - Number of concurrent requests
     * @returns {Promise<object>} Concurrency test result
     */
    async testConcurrentRequests(method = 'GET', path = '/hello', concurrentRequests = 10) {
      const startTime = Date.now();
      
      // Create array of concurrent request promises
      const requestPromises = Array.from({ length: concurrentRequests }, () =>
        makeRequest(appOrRouter, method, path)
      );
      
      // Wait for all requests to complete
      const responses = await Promise.all(requestPromises);
      const totalTime = Date.now() - startTime;
      
      // Validate that all responses are successful
      responses.forEach((response, index) => {
        expect(response.status).toBe(200);
        if (path === '/hello') {
          assertHelloResponse(response);
        }
      });
      
      return {
        responses,
        concurrentRequests,
        totalTime,
        averageResponseTime: totalTime / concurrentRequests,
        status: 'passed'
      };
    }
  };
}

// Export all test utility functions for use across test suites
module.exports = {
  // Core utility functions
  makeRequest,
  assertHelloResponse,
  assertErrorResponse,
  
  // Advanced utility functions
  createErrorTestScenarios,
  createPerformanceTestUtils,
  
  // Re-export response constants for convenience
  HELLO_RESPONSE,
  NOT_FOUND_RESPONSE,
  METHOD_NOT_ALLOWED_RESPONSE,
  INTERNAL_SERVER_ERROR_RESPONSE
};