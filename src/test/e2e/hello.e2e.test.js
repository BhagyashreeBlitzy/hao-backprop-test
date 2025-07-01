/**
 * End-to-End (E2E) Test Suite for '/hello' Endpoint
 * 
 * This comprehensive E2E test suite validates the complete request-response lifecycle
 * for the '/hello' endpoint of the Node.js Hello World tutorial backend. The tests
 * run against the fully configured Express app instance with all middleware active,
 * ensuring production-like behavior validation.
 * 
 * Test Coverage:
 * - GET /hello endpoint returns canonical 'Hello world' message with status 200
 * - Validates correct HTTP method handling (GET only)
 * - Ensures proper error responses for unsupported methods (405 for POST, PUT, DELETE)
 * - Validates response headers and content types
 * - Tests real middleware integration and error handling
 * 
 * Features:
 * - Uses Supertest for HTTP request simulation against Express app
 * - Leverages shared test utilities for DRY assertions and maintainable code
 * - Utilizes canonical response fixtures for consistent expected values
 * - Implements comprehensive error scenario testing
 * - Follows Jest testing framework patterns with describe/it structure
 * 
 * Technical Requirements Validated:
 * - Hello World Endpoint (Technical Specifications/2.1.2)
 * - Request Processing (Technical Specifications/2.1.3) 
 * - Response Generation (Technical Specifications/2.1.4)
 * - Testing Strategy (Technical Specifications/6.6)
 * 
 * @fileoverview E2E test suite for /hello endpoint functionality
 * @author Backend Development Team
 * @version 1.0.0
 * @since Node.js 18+
 * @requires jest@29.7.0
 * @requires supertest@7.1.1
 */

// External Dependencies - Jest Testing Framework
const { describe, it, expect } = require('jest'); // ^29.7.0 - JavaScript testing framework

// Internal Dependencies - Express Application
// Import the fully configured Express app instance with all middleware, routers, and error handlers
const { app } = require('../../backend/app.js');

// Internal Dependencies - Test Utilities
// Import reusable test helpers for HTTP requests and DRY assertions
const { 
  makeRequest, 
  assertHelloResponse, 
  assertErrorResponse 
} = require('../helpers/testUtils.js');

// Internal Dependencies - Canonical Response Fixtures
// Import expected response constants for consistent test assertions
const { 
  HELLO_RESPONSE, 
  METHOD_NOT_ALLOWED_RESPONSE 
} = require('../fixtures/responses.js');

/**
 * Main E2E Test Suite for '/hello' Endpoint
 * 
 * This test suite contains comprehensive end-to-end validation scenarios for the
 * '/hello' endpoint, testing the complete HTTP request-response cycle including
 * method validation, response generation, error handling, and middleware integration.
 * 
 * The tests run against the actual Express application instance with all middleware
 * active, providing production-like validation of:
 * - Complete request processing pipeline
 * - Middleware execution order and behavior
 * - Route handler logic and response generation
 * - Error handling and HTTP status code enforcement
 * - Response header configuration and content type handling
 * 
 * Test Execution Strategy:
 * Each test case uses the shared test utilities for consistent request execution
 * and response validation, ensuring maintainable and DRY test code. The assertions
 * validate both successful responses and error scenarios using canonical fixtures.
 */
describe('E2E /hello endpoint', () => {
  
  /**
   * Test Case: GET /hello returns 200 and canonical message
   * 
   * Validates that the '/hello' endpoint correctly handles GET requests by:
   * - Processing the request through the complete middleware stack
   * - Executing the route handler logic
   * - Returning HTTP status 200 (OK)
   * - Setting correct Content-Type header (text/plain)
   * - Delivering the exact canonical 'Hello world' message
   * 
   * This test ensures the primary functionality works end-to-end with all
   * middleware, routing, and response generation components integrated.
   * 
   * Technical Requirements Validated:
   * - F-002-RQ-001: Define GET route for '/hello' endpoint
   * - F-002-RQ-002: Return "Hello world" message
   * - F-004-RQ-001: Generate HTTP 200 OK response
   */
  it('GET /hello returns 200 and canonical message', async () => {
    // Send GET request to /hello endpoint using shared test utility
    const response = await makeRequest(app, 'get', '/hello');
    
    // Use shared assertion helper for DRY, canonical validation
    // This validates status 200, Content-Type text/plain, and exact message match
    assertHelloResponse(response);
  });

  /**
   * Test Case: POST /hello returns 405 Method Not Allowed
   * 
   * Validates that the '/hello' endpoint correctly rejects POST requests by:
   * - Processing the request through middleware stack
   * - Detecting unsupported HTTP method
   * - Returning HTTP status 405 (Method Not Allowed)
   * - Delivering the canonical error message
   * 
   * This test ensures proper HTTP method enforcement and error handling
   * for requests using unsupported methods on the '/hello' endpoint.
   * 
   * Technical Requirements Validated:
   * - F-003-RQ-001: Accept only GET requests for '/hello'
   * - HTTP method validation and error response generation
   */
  it('POST /hello returns 405 Method Not Allowed', async () => {
    // Send POST request to /hello endpoint using shared test utility
    const response = await makeRequest(app, 'post', '/hello');
    
    // Use shared error assertion helper for consistent error validation
    // This validates status 405 and exact error message match
    assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
  });

  /**
   * Test Case: PUT /hello returns 405 Method Not Allowed
   * 
   * Validates that the '/hello' endpoint correctly rejects PUT requests by:
   * - Processing the request through middleware stack
   * - Detecting unsupported HTTP method
   * - Returning HTTP status 405 (Method Not Allowed)
   * - Delivering the canonical error message
   * 
   * This test ensures comprehensive HTTP method validation beyond just
   * POST requests, validating that PUT requests are also properly rejected.
   * 
   * Technical Requirements Validated:
   * - F-003-RQ-001: Accept only GET requests for '/hello'
   * - HTTP method validation for PUT requests
   */
  it('PUT /hello returns 405 Method Not Allowed', async () => {
    // Send PUT request to /hello endpoint using shared test utility
    const response = await makeRequest(app, 'put', '/hello');
    
    // Use shared error assertion helper for consistent error validation
    // This validates status 405 and exact error message match
    assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
  });

  /**
   * Test Case: DELETE /hello returns 405 Method Not Allowed
   * 
   * Validates that the '/hello' endpoint correctly rejects DELETE requests by:
   * - Processing the request through middleware stack
   * - Detecting unsupported HTTP method
   * - Returning HTTP status 405 (Method Not Allowed)
   * - Delivering the canonical error message
   * 
   * This test completes the HTTP method validation coverage by ensuring
   * DELETE requests are properly rejected with appropriate error responses.
   * 
   * Technical Requirements Validated:
   * - F-003-RQ-001: Accept only GET requests for '/hello'
   * - HTTP method validation for DELETE requests
   */
  it('DELETE /hello returns 405 Method Not Allowed', async () => {
    // Send DELETE request to /hello endpoint using shared test utility
    const response = await makeRequest(app, 'delete', '/hello');
    
    // Use shared error assertion helper for consistent error validation
    // This validates status 405 and exact error message match
    assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
  });

});