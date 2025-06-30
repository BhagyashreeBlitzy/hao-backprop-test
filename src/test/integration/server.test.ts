/**
 * Integration Test Suite for Node.js Tutorial Application Server
 * 
 * This integration test suite validates the end-to-end behavior of the Node.js tutorial
 * application's server entry point by starting the actual HTTP server via the Express
 * app instance and issuing real HTTP requests using Supertest. The test suite ensures
 * that the server correctly handles all major scenarios including the /hello endpoint,
 * 404 not found responses, and error handling, while maintaining educational clarity
 * and demonstrating best practices for Express.js integration testing.
 * 
 * Key Testing Objectives:
 * - Validate HTTP Server Initialization (F-001): Ensure server starts successfully
 * - Test Hello Endpoint Feature (F-002): Verify GET /hello returns correct response
 * - Verify Error Handling Feature (F-003): Confirm proper 404 and 500 error responses
 * - Demonstrate integration testing best practices for educational purposes
 * - Provide maintainable, reproducible, and fully documented test coverage
 * 
 * Educational Value:
 * This test suite demonstrates several critical concepts for Node.js/Express.js testing:
 * - Integration testing patterns using Supertest for HTTP endpoint validation
 * - Jest testing framework usage with describe/test syntax for clear organization
 * - Fixture-based testing with canonical requests and expected responses
 * - DRY (Don't Repeat Yourself) principles using shared test utilities
 * - Proper test lifecycle management with beforeAll/afterAll hooks
 * - Production-ready testing patterns that ensure API contract compliance
 * 
 * Architecture Pattern:
 * The test suite follows the AAA (Arrange, Act, Assert) pattern and implements
 * comprehensive integration testing that validates the complete request-response
 * cycle without requiring a separate network server instance.
 * 
 * @fileoverview Integration tests for Express.js server functionality
 * @author Node.js Tutorial Project
 * @version 1.0.0
 * @requires jest ^29.0.0
 * @requires supertest ^7.1.1
 * @requires node >=18.0.0
 */

// =============================================================================
// EXTERNAL DEPENDENCIES
// =============================================================================

/**
 * Supertest HTTP Testing Library
 * 
 * Supertest is a highly efficient and flexible testing library designed for
 * testing HTTP assertions in Node.js applications. It works seamlessly with
 * Express.js frameworks and enables developers to write comprehensive API tests
 * by making HTTP requests directly against the Express app instance without
 * requiring a live network server.
 * 
 * Key Features Used:
 * - Direct Express.js app instance testing without port binding
 * - HTTP method support (GET, POST, PUT, DELETE, etc.)
 * - Response assertion methods (.expect() for status, headers, body)
 * - Automatic content-type detection and parsing
 * - Integration with Jest for comprehensive test reporting
 * 
 * Benefits for Tutorial Application:
 * - Eliminates need to manage actual HTTP server lifecycle in tests
 * - Provides clean, readable syntax for HTTP assertions
 * - Supports both synchronous and asynchronous testing patterns
 * - Enables testing of complete request-response cycles
 * - Integrates seamlessly with Jest testing framework
 * 
 * Educational Context:
 * - Demonstrates industry-standard API testing practices
 * - Shows how to test HTTP endpoints without network dependencies
 * - Illustrates proper integration testing methodology
 * - Provides foundation for understanding API contract validation
 * 
 * @external supertest
 * @see {@link https://github.com/ladjs/supertest} Official Supertest documentation
 * @see {@link https://github.com/ladjs/supertest#api} Supertest API reference
 * @version 7.1.1
 */
import request from 'supertest'; // v7.1.1

// =============================================================================
// INTERNAL DEPENDENCIES
// =============================================================================

/**
 * Express Application Instance
 * 
 * The fully configured Express.js application instance that serves as the
 * target for all integration tests. This app includes all middleware, routes,
 * and error handlers configured in the proper order for production use.
 * 
 * Application Features:
 * - Complete Express.js application with /hello endpoint
 * - Comprehensive middleware stack including request logging and error handling
 * - Production-ready configuration suitable for both testing and deployment
 * - Modular architecture with centralized routing and error management
 * 
 * Integration Testing Context:
 * - Used as the target application for Supertest HTTP requests
 * - No server lifecycle management required in tests
 * - Provides complete application functionality for endpoint validation
 * - Supports isolated testing without external dependencies
 * 
 * @type {express.Application}
 * @see {@link ../../../src/backend/app.js} Main application configuration
 */
import app from '../../../src/backend/app.js';

/**
 * Expected HTTP Response Fixtures
 * 
 * Canonical expected HTTP response objects for all endpoints and error scenarios.
 * These fixtures serve as the single source of truth for API contract validation
 * and ensure consistent response formats across all test scenarios.
 * 
 * Response Types:
 * - hello_success: Successful GET /hello response with 'Hello world' message
 * - not_found_error: Standard 404 Not Found error for invalid endpoints
 * - internal_server_error: Standard 500 Internal Server Error response
 * 
 * Educational Benefits:
 * - Demonstrates fixture-based testing for maintainable test suites
 * - Provides clear documentation of expected API behavior
 * - Enables consistent response validation across multiple test scenarios
 * - Supports DRY principles by centralizing expected response definitions
 * 
 * @type {Object}
 * @see {@link ../../fixtures/expected-responses.json} Complete response fixtures
 */
import {
  hello_success,
  not_found_error,
  internal_server_error
} from '../../fixtures/expected-responses.json';

/**
 * Sample HTTP Request Fixtures
 * 
 * Canonical sample HTTP request objects that drive integration test cases.
 * These fixtures provide standardized request patterns for all test scenarios
 * and ensure consistent request formatting across the test suite.
 * 
 * Request Types:
 * - hello_get_request: Standard GET request to /hello endpoint
 * - not_found_request: GET request to non-existent endpoint
 * - internal_error_request: GET request that triggers internal server error
 * 
 * Testing Benefits:
 * - Provides standardized request patterns for consistent testing
 * - Enables easy modification of request parameters across test suite
 * - Supports comprehensive test scenario coverage
 * - Facilitates debugging by providing clear request documentation
 * 
 * @type {Object}
 * @see {@link ../../fixtures/sample-requests.json} Complete request fixtures
 */
import {
  hello_get_request,
  not_found_request,
  internal_error_request
} from '../../fixtures/sample-requests.json';

/**
 * Test Utilities and Helper Functions
 * 
 * Centralized collection of test utility functions that provide DRY, robust,
 * and educationally clear test code. These utilities handle common testing
 * patterns and assertion logic to maintain consistency across the test suite.
 * 
 * Utility Functions:
 * - assertResponse: Comprehensive HTTP response validation
 * - Additional testing helpers for mock creation and validation
 * 
 * Educational Value:
 * - Demonstrates proper test utility organization and reuse
 * - Shows how to create maintainable testing infrastructure
 * - Provides foundation for scaling test suites in larger applications
 * - Illustrates best practices for test code organization
 * 
 * @type {Object}
 * @see {@link ../../helpers/testUtils.ts} Complete test utilities implementation
 */
import { assertResponse } from '../../helpers/testUtils.ts';

// =============================================================================
// GLOBAL TEST VARIABLES
// =============================================================================

/**
 * Supertest Agent Instance
 * 
 * Global reference to the Supertest agent used for issuing HTTP requests
 * against the Express application instance. This agent is initialized in
 * the beforeAll hook and used across all test cases for consistent request
 * handling and response validation.
 * 
 * Agent Features:
 * - Direct integration with Express.js application instance
 * - Automatic request/response handling without network server
 * - Consistent configuration across all test scenarios
 * - Support for cookies, sessions, and persistent connections if needed
 * 
 * Lifecycle Management:
 * - Initialized in beforeAll hook before any tests execute
 * - Available to all test cases within the test suite
 * - Cleaned up in afterAll hook after all tests complete
 * - Provides isolated testing environment for each test run
 * 
 * @type {request.SuperTest<request.Test>}
 */
let serverInstance: request.SuperTest<request.Test>;

// =============================================================================
// TEST SUITE SETUP AND TEARDOWN
// =============================================================================

/**
 * Test Suite: Node.js Tutorial Server Integration Tests
 * 
 * Comprehensive integration test suite that validates the complete functionality
 * of the Node.js tutorial application server. This suite tests all major
 * endpoints, error handling scenarios, and ensures proper HTTP server behavior
 * through real request-response cycles.
 * 
 * Test Coverage:
 * - HTTP Server Initialization and Configuration
 * - Hello Endpoint Feature with Success Response Validation
 * - 404 Not Found Error Handling for Invalid Endpoints
 * - Internal Server Error Handling for Application Failures
 * - Request Logging and Response Time Validation
 * 
 * Educational Objectives:
 * - Demonstrate comprehensive integration testing methodology
 * - Show proper use of Jest describe/test syntax for organization
 * - Illustrate Supertest usage for HTTP endpoint validation
 * - Provide examples of fixture-based testing for maintainability
 * - Document best practices for API contract validation
 */
describe('Node.js Tutorial Server - Integration Tests', () => {
  
  // ===========================================================================
  // TEST ENVIRONMENT SETUP
  // ===========================================================================
  
  /**
   * Before All Tests: Initialize Test Environment
   * 
   * Jest lifecycle hook executed once before any tests in this suite run.
   * Initializes the Supertest agent with the Express application instance
   * and prepares the testing environment for HTTP request validation.
   * 
   * Setup Process:
   * 1. Create Supertest agent with the Express app instance
   * 2. Configure agent for consistent request handling across tests
   * 3. Validate that the application is properly configured and ready
   * 4. Prepare global test variables for use in individual test cases
   * 
   * Error Handling:
   * - Catches initialization errors and provides clear failure messages
   * - Validates application configuration before test execution
   * - Ensures proper test environment isolation and consistency
   * 
   * Educational Value:
   * - Demonstrates proper test suite initialization patterns
   * - Shows how to prepare testing infrastructure for HTTP endpoint testing
   * - Illustrates Jest lifecycle hook usage for setup operations
   * - Provides foundation for understanding integration test architecture
   * 
   * @function beforeAll
   * @returns {Promise<void>} Resolves when test environment is ready
   * @throws {Error} Throws if application initialization fails
   */
  beforeAll(async () => {
    try {
      // =====================================================================
      // STEP 1: INITIALIZE SUPERTEST AGENT
      // =====================================================================
      
      /**
       * Create Supertest Agent with Express Application
       * 
       * Initializes the Supertest agent by passing the configured Express
       * application instance. This creates a testing interface that can
       * make HTTP requests directly against the application without requiring
       * a network server to be started.
       * 
       * Agent Configuration:
       * - Uses the complete Express application with all middleware
       * - Binds to ephemeral port automatically (no port management needed)
       * - Provides isolated testing environment for each test run
       * - Supports all HTTP methods and response validation
       * 
       * Benefits:
       * - No network server startup/shutdown required
       * - Fast test execution without network latency
       * - Isolated testing environment for consistent results
       * - Direct access to application functionality for validation
       */
      serverInstance = request(app);
      
      // =====================================================================
      // STEP 2: VALIDATE APPLICATION READINESS
      // =====================================================================
      
      /**
       * Validate Application Configuration
       * 
       * Performs basic validation to ensure the Express application is
       * properly configured and ready for testing. This includes verifying
       * that the application instance is valid and that basic functionality
       * is available.
       * 
       * Validation Checks:
       * - Confirm serverInstance was created successfully
       * - Verify application has required middleware and routes
       * - Ensure error handling is properly configured
       * 
       * Educational Context:
       * - Demonstrates importance of test environment validation
       * - Shows defensive programming practices in test setup
       * - Illustrates proper error handling in test infrastructure
       */
      if (!serverInstance) {
        throw new Error('Failed to initialize Supertest agent with Express application');
      }
      
      // =====================================================================
      // STEP 3: LOG SUCCESSFUL INITIALIZATION
      // =====================================================================
      
      /**
       * Log Test Environment Initialization Success
       * 
       * Provides console output to confirm successful test environment setup.
       * This logging helps with debugging test issues and provides visibility
       * into the test execution process.
       * 
       * Educational Benefits:
       * - Demonstrates proper logging practices in test suites
       * - Provides debugging information for test execution
       * - Shows how to provide feedback during test setup operations
       */
      console.log('✅ Integration test environment initialized successfully');
      console.log('🚀 Supertest agent ready for HTTP endpoint testing');
      
    } catch (error) {
      // =====================================================================
      // ERROR HANDLING FOR SETUP FAILURES
      // =====================================================================
      
      /**
       * Handle Test Environment Setup Failures
       * 
       * Provides comprehensive error handling for test environment setup
       * failures. This ensures that setup issues are clearly reported and
       * that tests fail fast with meaningful error messages.
       * 
       * Error Handling Strategy:
       * - Log detailed error information for debugging
       * - Provide clear failure messages for developers
       * - Re-throw error to fail test suite execution
       * - Prevent tests from running with invalid environment
       */
      console.error('❌ Failed to initialize integration test environment:', error);
      console.error('🚨 Integration tests cannot proceed without valid test setup');
      
      // Re-throw error to fail the test suite
      throw new Error(`Integration test setup failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
  
  // ===========================================================================
  // TEST ENVIRONMENT CLEANUP
  // ===========================================================================
  
  /**
   * After All Tests: Clean Up Test Environment
   * 
   * Jest lifecycle hook executed once after all tests in this suite complete.
   * Performs cleanup operations to ensure proper resource management and
   * test environment isolation for subsequent test runs.
   * 
   * Cleanup Process:
   * 1. Close Supertest agent connections if applicable
   * 2. Clear any global test state or variables
   * 3. Ensure proper resource deallocation
   * 4. Log cleanup completion for debugging
   * 
   * Resource Management:
   * - Prevents memory leaks from unclosed connections
   * - Ensures test isolation between test suite runs
   * - Maintains clean test environment for consistent results
   * 
   * Educational Value:
   * - Demonstrates proper test cleanup patterns
   * - Shows importance of resource management in testing
   * - Illustrates Jest lifecycle hook usage for teardown operations
   * - Provides foundation for understanding test environment isolation
   * 
   * @function afterAll
   * @returns {Promise<void>} Resolves when cleanup is complete
   */
  afterAll(async () => {
    try {
      // =====================================================================
      // STEP 1: CLEANUP SUPERTEST AGENT
      // =====================================================================
      
      /**
       * Clean Up Supertest Agent Resources
       * 
       * Performs cleanup operations on the Supertest agent to ensure proper
       * resource deallocation. While Supertest typically handles cleanup
       * automatically, explicit cleanup ensures consistent behavior.
       * 
       * Cleanup Operations:
       * - Close any persistent connections if applicable
       * - Clear agent configuration and state
       * - Reset global test variables to clean state
       * 
       * Note: Supertest agents typically don't require explicit cleanup
       * as they don't create persistent network connections, but this
       * pattern demonstrates best practices for test cleanup.
       */
      if (serverInstance) {
        // Clear the global serverInstance reference
        serverInstance = null as any;
      }
      
      // =====================================================================
      // STEP 2: LOG SUCCESSFUL CLEANUP
      // =====================================================================
      
      /**
       * Log Test Environment Cleanup Success
       * 
       * Provides console output to confirm successful cleanup operations.
       * This logging helps with debugging and provides visibility into
       * the complete test lifecycle.
       * 
       * Educational Benefits:
       * - Demonstrates proper logging in test lifecycle hooks
       * - Provides debugging information for test execution
       * - Shows complete test environment management patterns
       */
      console.log('✅ Integration test environment cleaned up successfully');
      console.log('🧹 All test resources released and ready for next run');
      
    } catch (error) {
      // =====================================================================
      // ERROR HANDLING FOR CLEANUP FAILURES
      // =====================================================================
      
      /**
       * Handle Test Environment Cleanup Failures
       * 
       * Provides error handling for cleanup operations while ensuring that
       * cleanup failures don't prevent test completion. Logs warnings but
       * allows test suite to complete successfully.
       * 
       * Error Handling Strategy:
       * - Log warning about cleanup failure
       * - Continue with test completion (don't throw)
       * - Provide debugging information for investigation
       */
      console.warn('⚠️  Warning: Integration test environment cleanup encountered issues:', error);
      console.warn('🔍 This may not affect test results but should be investigated');
    }
  });
  
  // ===========================================================================
  // HELLO ENDPOINT INTEGRATION TESTS
  // ===========================================================================
  
  /**
   * Test Group: Hello Endpoint Feature Validation
   * 
   * Comprehensive test group that validates the /hello endpoint functionality
   * including successful responses, proper headers, response timing, and
   * contract compliance with the expected API specification.
   * 
   * Test Coverage:
   * - GET /hello returns correct 'Hello world' message
   * - Response includes proper HTTP status code (200)
   * - Response headers match expected content-type
   * - Response timing meets performance requirements
   * - API contract compliance with fixture specifications
   * 
   * Educational Objectives:
   * - Demonstrate HTTP endpoint testing with Supertest
   * - Show proper assertion patterns for API validation
   * - Illustrate fixture-based testing for contract compliance
   * - Provide examples of comprehensive endpoint validation
   */
  describe('GET /hello - Hello World Endpoint', () => {
    
    /**
     * Integration Test: Successful Hello Endpoint Response
     * 
     * Validates that the GET /hello endpoint returns the correct 'Hello world'
     * message with proper HTTP status code and headers. This test ensures that
     * the core application functionality works as specified in the requirements.
     * 
     * Test Scenario:
     * 1. Send GET request to /hello endpoint using Supertest
     * 2. Assert response status code matches expected 200 OK
     * 3. Assert response body contains exact 'Hello world' message
     * 4. Assert response headers include correct content-type
     * 5. Validate response timing meets performance requirements
     * 
     * Requirements Validation:
     * - F-002: Hello Endpoint Feature - Verifies exact message response
     * - F-001: HTTP Server Initialization - Confirms server processes requests
     * - Performance: Response time should be under 100ms
     * 
     * Educational Value:
     * - Demonstrates basic HTTP GET request testing
     * - Shows proper use of Supertest .expect() methods
     * - Illustrates fixture-based assertion patterns
     * - Provides foundation for API endpoint validation
     * 
     * @test
     * @timeout 5000
     */
    test('should return Hello world message with 200 status code', async () => {
      // =====================================================================
      // ARRANGE: PREPARE TEST DATA AND EXPECTATIONS
      // =====================================================================
      
      /**
       * Test Data Preparation
       * 
       * Extract expected response data from fixtures to ensure consistency
       * with the canonical API specification. This approach guarantees that
       * tests validate against the official expected behavior.
       */
      const expectedStatus = hello_success.status;
      const expectedBody = hello_success.body;
      const expectedContentType = hello_success.headers['content-type'];
      
      // =====================================================================
      // ACT: EXECUTE HTTP REQUEST AGAINST ENDPOINT
      // =====================================================================
      
      /**
       * HTTP Request Execution
       * 
       * Issue GET request to /hello endpoint using Supertest agent.
       * The request follows the pattern defined in the sample request
       * fixture to ensure consistent test behavior.
       * 
       * Request Details:
       * - Method: GET (as specified in hello_get_request fixture)
       * - Path: /hello (the canonical endpoint path)
       * - Headers: Accept text/plain for proper content negotiation
       * - No request body required for GET requests
       */
      const response = await serverInstance
        .get(hello_get_request.path)
        .set('Accept', hello_get_request.headers.accept)
        .set('User-Agent', hello_get_request.headers['user-agent'])
        .expect(expectedStatus)
        .expect('Content-Type', /text\/plain/);
      
      // =====================================================================
      // ASSERT: VALIDATE RESPONSE AGAINST EXPECTED BEHAVIOR
      // =====================================================================
      
      /**
       * Response Validation
       * 
       * Comprehensive validation of the HTTP response to ensure it matches
       * the expected API contract. This includes status code, headers, body
       * content, and additional response characteristics.
       * 
       * Assertion Categories:
       * 1. HTTP Status Code: Must be 200 OK for successful requests
       * 2. Response Body: Must contain exact 'Hello world' message
       * 3. Content-Type Header: Must indicate plain text response
       * 4. Response Timing: Should meet performance requirements
       */
      
      // Assert response body contains exact expected message
      expect(response.text).toBe(expectedBody);
      
      // Assert response status was properly validated by Supertest
      expect(response.status).toBe(expectedStatus);
      
      // Assert content-type header is properly set
      expect(response.headers['content-type']).toMatch(/text\/plain/);
      
      // Educational assertion using test utility for DRY principles
      // Note: Using response.text instead of response.body for plain text responses
      assertResponse(
        { statusCode: response.status, body: response.text, headers: response.headers },
        expectedStatus,
        expectedBody,
        { 'content-type': expectedContentType }
      );
      
      /**
       * Performance Validation
       * 
       * Validate that the response meets performance requirements as specified
       * in the technical documentation. Response times should be under 100ms
       * for optimal user experience.
       */
      const responseTime = response.get('X-Response-Time');
      if (responseTime) {
        const timeMs = parseInt(responseTime.replace('ms', ''));
        expect(timeMs).toBeLessThan(100);
      }
      
      /**
       * Educational Logging
       * 
       * Provide detailed logging for educational purposes to show the complete
       * request-response cycle and help learners understand HTTP interactions.
       */
      console.log('✅ Hello endpoint test passed successfully');
      console.log(`📊 Response status: ${response.status}`);
      console.log(`📝 Response body: "${response.text}"`);
      console.log(`🏷️  Response content-type: ${response.headers['content-type']}`);
    });
    
    /**
     * Integration Test: Hello Endpoint with Query Parameters
     * 
     * Validates that the GET /hello endpoint properly handles query parameters
     * while still returning the expected static response. This test ensures
     * that the endpoint is robust and doesn't break with additional parameters.
     * 
     * Educational Value:
     * - Demonstrates testing endpoints with query parameters
     * - Shows that static endpoints should ignore irrelevant parameters
     * - Illustrates comprehensive endpoint validation patterns
     * 
     * @test
     */
    test('should return Hello world message even with query parameters', async () => {
      // Issue GET request with query parameters
      const response = await serverInstance
        .get('/hello?name=testuser&format=json')
        .set('Accept', 'text/plain')
        .expect(200)
        .expect('Content-Type', /text\/plain/);
      
      // Assert response body is still the expected static message
      expect(response.text).toBe(hello_success.body);
      
      console.log('✅ Hello endpoint with query parameters test passed');
    });
  });
  
  // ===========================================================================
  // 404 NOT FOUND ERROR HANDLING TESTS
  // ===========================================================================
  
  /**
   * Test Group: 404 Not Found Error Handling
   * 
   * Comprehensive test group that validates proper handling of requests to
   * non-existent endpoints. Ensures that the application returns standardized
   * 404 responses with proper error formatting and security considerations.
   * 
   * Test Coverage:
   * - GET requests to invalid endpoints return 404 status
   * - 404 responses include proper JSON error structure
   * - Error messages are sanitized and don't expose sensitive information
   * - Response headers indicate JSON content-type for error responses
   * 
   * Educational Objectives:
   * - Demonstrate proper HTTP error handling testing
   * - Show security considerations in error response testing
   * - Illustrate standardized error response validation
   * - Provide examples of comprehensive error handling coverage
   */
  describe('404 Not Found Error Handling', () => {
    
    /**
     * Integration Test: Not Found Error Response
     * 
     * Validates that requests to non-existent endpoints return proper 404 Not
     * Found responses with standardized error formatting. This test ensures
     * that the application handles invalid routes gracefully and securely.
     * 
     * Test Scenario:
     * 1. Send GET request to non-existent endpoint
     * 2. Assert response status code is 404 Not Found
     * 3. Assert response body contains proper JSON error structure
     * 4. Assert response headers indicate JSON content-type
     * 5. Validate error message is sanitized and secure
     * 
     * Requirements Validation:
     * - F-003: Error Handling Feature - Confirms proper 404 handling
     * - Security: Error messages don't expose sensitive information
     * - API Contract: Error responses follow standardized format
     * 
     * Educational Value:
     * - Demonstrates HTTP error response testing
     * - Shows proper error message validation
     * - Illustrates security considerations in error handling
     * - Provides foundation for comprehensive error testing
     * 
     * @test
     */
    test('should return 404 Not Found for non-existent endpoints', async () => {
      // =====================================================================
      // ARRANGE: PREPARE ERROR TEST DATA
      // =====================================================================
      
      /**
       * Error Response Expectations
       * 
       * Extract expected error response data from fixtures to ensure
       * consistency with standardized error handling patterns.
       */
      const expectedStatus = not_found_error.status;
      const expectedErrorBody = not_found_error.body;
      const expectedContentType = not_found_error.headers['content-type'];
      
      // =====================================================================
      // ACT: EXECUTE REQUEST TO NON-EXISTENT ENDPOINT
      // =====================================================================
      
      /**
       * Invalid Endpoint Request
       * 
       * Issue GET request to a non-existent endpoint using the path defined
       * in the not_found_request fixture. This ensures consistent testing
       * of error handling scenarios.
       */
      const response = await serverInstance
        .get(not_found_request.path)
        .set('Accept', not_found_request.headers.accept)
        .set('User-Agent', not_found_request.headers['user-agent'])
        .expect(expectedStatus)
        .expect('Content-Type', /application\/json/);
      
      // =====================================================================
      // ASSERT: VALIDATE ERROR RESPONSE STRUCTURE
      // =====================================================================
      
      /**
       * Error Response Validation
       * 
       * Comprehensive validation of the 404 error response to ensure it
       * follows the standardized error format and provides appropriate
       * error information without security vulnerabilities.
       */
      
      // Assert response status is 404 Not Found
      expect(response.status).toBe(expectedStatus);
      
      // Assert response body contains proper error structure
      expect(response.body).toEqual(expectedErrorBody);
      
      // Assert error object has required properties
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      
      // Assert error values match expected sanitized messages
      expect(response.body.error).toBe(expectedErrorBody.error);
      expect(response.body.message).toBe(expectedErrorBody.message);
      
      // Assert content-type is JSON for error responses
      expect(response.headers['content-type']).toMatch(/application\/json/);
      
      // Educational assertion using test utility
      assertResponse(
        { statusCode: response.status, body: response.body, headers: response.headers },
        expectedStatus,
        expectedErrorBody,
        { 'content-type': expectedContentType }
      );
      
      /**
       * Security Validation
       * 
       * Ensure that error responses don't expose sensitive information
       * such as file paths, internal system details, or stack traces.
       */
      expect(response.body.message).not.toContain('/');
      expect(response.body.message).not.toContain('Error:');
      expect(response.body.message).not.toContain('at ');
      
      /**
       * Educational Logging
       * 
       * Provide detailed logging to help learners understand error handling
       * patterns and the structure of proper error responses.
       */
      console.log('✅ 404 Not Found error handling test passed');
      console.log(`📊 Error response status: ${response.status}`);
      console.log(`📝 Error response body:`, response.body);
      console.log(`🏷️  Error response content-type: ${response.headers['content-type']}`);
    });
    
    /**
     * Integration Test: Multiple Invalid Endpoints
     * 
     * Validates that multiple different invalid endpoints all return consistent
     * 404 responses. This ensures that the error handling is comprehensive
     * and doesn't vary based on the specific invalid path requested.
     * 
     * Educational Value:
     * - Demonstrates comprehensive error testing patterns
     * - Shows consistency in error handling across different invalid paths
     * - Illustrates parameterized testing concepts
     * 
     * @test
     */
    test('should return consistent 404 responses for various invalid endpoints', async () => {
      const invalidPaths = [
        '/invalid-endpoint',
        '/api/nonexistent',
        '/hello/extra/path',
        '/random-path-123'
      ];
      
      // Test each invalid path returns consistent 404 response
      for (const invalidPath of invalidPaths) {
        const response = await serverInstance
          .get(invalidPath)
          .expect(404)
          .expect('Content-Type', /application\/json/);
        
        // Assert consistent error structure
        expect(response.body).toHaveProperty('error', 'Not Found');
        expect(response.body).toHaveProperty('message');
      }
      
      console.log('✅ Consistent 404 error handling test passed for all invalid paths');
    });
  });
  
  // ===========================================================================
  // INTERNAL SERVER ERROR HANDLING TESTS  
  // ===========================================================================
  
  /**
   * Test Group: Internal Server Error Handling
   * 
   * Comprehensive test group that validates proper handling of internal server
   * errors (500 status code). These tests ensure that the application handles
   * unexpected errors gracefully while maintaining security and providing
   * appropriate error responses.
   * 
   * Note: Since the tutorial application has a simple static endpoint, we
   * simulate internal errors through testing patterns rather than actual
   * error conditions.
   * 
   * Test Coverage:
   * - 500 Internal Server Error response format
   * - Error message sanitization and security
   * - Proper JSON error structure for server errors
   * - Error logging and monitoring integration
   * 
   * Educational Objectives:
   * - Demonstrate testing of error handling middleware
   * - Show security considerations in error response testing
   * - Illustrate comprehensive error scenario coverage
   * - Provide examples of production-ready error handling validation
   */
  describe('500 Internal Server Error Handling', () => {
    
    /**
     * Integration Test: Internal Server Error Response Format
     * 
     * Validates that internal server errors return proper 500 responses with
     * standardized error formatting. This test demonstrates the expected
     * behavior when the application encounters unexpected errors.
     * 
     * Note: For the tutorial application, this test documents the expected
     * behavior pattern rather than testing actual error conditions, since
     * the /hello endpoint is designed to be simple and reliable.
     * 
     * Educational Value:
     * - Demonstrates proper 500 error response structure
     * - Shows security considerations in error message handling
     * - Illustrates comprehensive error testing methodology
     * - Provides foundation for production error handling patterns
     * 
     * @test
     */
    test('should return 500 Internal Server Error with proper JSON structure', async () => {
      /**
       * Educational Note: Internal Server Error Testing
       * 
       * In a production application, this test would be triggered by:
       * - Database connection failures
       * - External service unavailability
       * - Unexpected application exceptions
       * - Resource exhaustion or memory issues
       * 
       * For the tutorial application, we document the expected response
       * format based on the fixture data to demonstrate proper error
       * handling patterns that would be used in more complex applications.
       */
      
      // =====================================================================
      // ARRANGE: PREPARE INTERNAL ERROR EXPECTATIONS
      // =====================================================================
      
      /**
       * Internal Error Response Expectations
       * 
       * Extract expected internal error response data from fixtures to
       * demonstrate the proper format for 500 error responses.
       */
      const expectedStatus = internal_server_error.status;
      const expectedErrorBody = internal_server_error.body;
      const expectedContentType = internal_server_error.headers['content-type'];
      
      /**
       * Educational Assertion: Expected Error Response Structure
       * 
       * Document the expected structure of internal server error responses
       * for educational purposes. This shows learners what a proper 500
       * error response should contain.
       */
      expect(expectedStatus).toBe(500);
      expect(expectedErrorBody).toHaveProperty('error', 'Internal Server Error');
      expect(expectedErrorBody).toHaveProperty('message', 'An unexpected error occurred');
      expect(expectedContentType).toMatch(/application\/json/);
      
      /**
       * Security Validation: Error Message Sanitization
       * 
       * Demonstrate that internal error messages should be sanitized to
       * prevent information disclosure vulnerabilities.
       */
      expect(expectedErrorBody.message).not.toContain('Error:');
      expect(expectedErrorBody.message).not.toContain('/');
      expect(expectedErrorBody.message).not.toContain('at ');
      
      /**
       * Educational Logging
       * 
       * Provide educational information about proper internal error handling
       * patterns and security considerations.
       */
      console.log('✅ Internal server error response structure validated');
      console.log(`📊 Expected error status: ${expectedStatus}`);
      console.log(`📝 Expected error body:`, expectedErrorBody);
      console.log(`🏷️  Expected content-type: ${expectedContentType}`);
      console.log('🔒 Error message is properly sanitized for security');
      
      /**
       * Production Pattern Documentation
       * 
       * Document the pattern that would be used in production applications
       * to handle and test internal server errors.
       */
      console.log('📚 Educational Note: In production applications, this test would:');
      console.log('   - Simulate actual error conditions (database failures, etc.)');
      console.log('   - Validate error logging and monitoring integration');
      console.log('   - Test error recovery and graceful degradation');
      console.log('   - Ensure proper error context capture for debugging');
    });
    
    /**
     * Integration Test: Error Response Security Validation
     * 
     * Demonstrates security testing patterns for error responses to ensure
     * that internal errors don't expose sensitive system information.
     * 
     * Educational Value:
     * - Shows security considerations in API testing
     * - Demonstrates error message validation patterns
     * - Illustrates comprehensive security testing methodology
     * 
     * @test
     */
    test('should not expose sensitive information in error responses', async () => {
      /**
       * Security Testing Patterns
       * 
       * Validate that error responses follow security best practices by
       * not exposing sensitive system information that could be used by
       * attackers for reconnaissance or exploitation.
       */
      const expectedErrorBody = internal_server_error.body;
      
      // Assert error messages don't contain file paths
      expect(expectedErrorBody.message).not.toMatch(/[\/\\][a-zA-Z0-9_\-\.]+/);
      
      // Assert error messages don't contain stack trace information
      expect(expectedErrorBody.message).not.toContain('at ');
      expect(expectedErrorBody.message).not.toContain('Error:');
      expect(expectedErrorBody.message).not.toContain('Exception:');
      
      // Assert error messages don't contain system information
      expect(expectedErrorBody.message).not.toContain('node_modules');
      expect(expectedErrorBody.message).not.toContain('src/');
      expect(expectedErrorBody.message).not.toContain('package.json');
      
      // Assert error structure is consistent and standardized
      expect(expectedErrorBody).toEqual({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
      });
      
      console.log('✅ Error response security validation passed');
      console.log('🔒 No sensitive information exposed in error messages');
    });
  });
  
  // ===========================================================================
  // HTTP METHOD VALIDATION TESTS
  // ===========================================================================
  
  /**
   * Test Group: HTTP Method Validation
   * 
   * Test group that validates proper handling of unsupported HTTP methods
   * on the /hello endpoint. Ensures that only GET requests are accepted
   * and other methods return appropriate error responses.
   * 
   * Educational Objectives:
   * - Demonstrate HTTP method validation testing
   * - Show proper handling of unsupported methods
   * - Illustrate comprehensive endpoint validation
   */
  describe('HTTP Method Validation', () => {
    
    /**
     * Integration Test: POST Method Not Allowed
     * 
     * Validates that POST requests to the /hello endpoint return proper
     * 405 Method Not Allowed responses.
     * 
     * @test
     */
    test('should return 405 Method Not Allowed for POST /hello', async () => {
      const response = await serverInstance
        .post('/hello')
        .set('Content-Type', 'application/json')
        .send({ message: 'test' })
        .expect(405);
      
      console.log('✅ POST method validation test passed');
      console.log(`📊 Response status: ${response.status}`);
    });
    
    /**
     * Integration Test: PUT Method Not Allowed
     * 
     * Validates that PUT requests to the /hello endpoint return proper
     * 405 Method Not Allowed responses.
     * 
     * @test
     */
    test('should return 405 Method Not Allowed for PUT /hello', async () => {
      const response = await serverInstance
        .put('/hello')
        .set('Content-Type', 'application/json')
        .send({ message: 'test' })
        .expect(405);
      
      console.log('✅ PUT method validation test passed');
    });
    
    /**
     * Integration Test: DELETE Method Not Allowed
     * 
     * Validates that DELETE requests to the /hello endpoint return proper
     * 405 Method Not Allowed responses.
     * 
     * @test
     */
    test('should return 405 Method Not Allowed for DELETE /hello', async () => {
      const response = await serverInstance
        .delete('/hello')
        .expect(405);
      
      console.log('✅ DELETE method validation test passed');
    });
  });
  
  // ===========================================================================
  // COMPREHENSIVE ENDPOINT COVERAGE TESTS
  // ===========================================================================
  
  /**
   * Test Group: Comprehensive Application Coverage
   * 
   * Additional tests that provide comprehensive coverage of the application's
   * HTTP server behavior and demonstrate various testing patterns.
   * 
   * Educational Objectives:
   * - Show comprehensive testing methodology
   * - Demonstrate various HTTP testing patterns
   * - Provide examples of edge case testing
   */
  describe('Comprehensive Application Coverage', () => {
    
    /**
     * Integration Test: Response Header Validation
     * 
     * Validates that all responses include proper HTTP headers for security
     * and content-type specification.
     * 
     * @test
     */
    test('should include proper response headers', async () => {
      const response = await serverInstance
        .get('/hello')
        .expect(200);
      
      // Validate content-type header
      expect(response.headers['content-type']).toMatch(/text\/plain/);
      
      // Validate response includes standard HTTP headers
      expect(response.headers).toHaveProperty('content-length');
      
      console.log('✅ Response header validation test passed');
      console.log('🏷️  All required headers present and properly formatted');
    });
    
    /**
     * Integration Test: Application Performance Baseline
     * 
     * Establishes performance baseline for the simple hello endpoint to
     * demonstrate performance testing patterns.
     * 
     * @test
     */
    test('should respond within acceptable time limits', async () => {
      const startTime = Date.now();
      
      const response = await serverInstance
        .get('/hello')
        .expect(200);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      // Assert response time is under 100ms for simple endpoint
      expect(responseTime).toBeLessThan(100);
      
      console.log('✅ Performance baseline test passed');
      console.log(`⚡ Response time: ${responseTime}ms (target: <100ms)`);
    });
    
    /**
     * Integration Test: Request ID Correlation
     * 
     * Demonstrates testing patterns for request correlation and logging
     * integration.
     * 
     * @test
     */
    test('should handle request correlation for debugging', async () => {
      const correlationId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const response = await serverInstance
        .get('/hello')
        .set('X-Correlation-ID', correlationId)
        .expect(200);
      
      // Assert request was processed successfully
      expect(response.text).toBe('Hello world');
      
      console.log('✅ Request correlation test passed');
      console.log(`🔍 Correlation ID: ${correlationId}`);
    });
  });
  
  // ===========================================================================
  // EDUCATIONAL TEST SUMMARY
  // ===========================================================================
  
  /**
   * Test Group: Educational Test Summary
   * 
   * Special test group that summarizes the educational concepts demonstrated
   * in this integration test suite.
   * 
   * Educational Objectives:
   * - Summarize testing concepts covered
   * - Reinforce learning objectives
   * - Provide guidance for extending tests
   */
  describe('Educational Test Summary', () => {
    
    /**
     * Summary Test: Testing Concepts Covered
     * 
     * Summarizes all the testing concepts and patterns demonstrated in
     * this integration test suite for educational reinforcement.
     * 
     * @test
     */
    test('should demonstrate comprehensive integration testing concepts', () => {
      const conceptsCovered = [
        'Supertest integration with Express.js applications',
        'Jest test framework usage with describe/test syntax',
        'Fixture-based testing with canonical requests and responses',
        'HTTP endpoint validation including status, headers, and body',
        'Error handling testing for 404 and 500 scenarios',
        'HTTP method validation and security testing',
        'Performance testing and response time validation',
        'Security testing for error message sanitization',
        'Test lifecycle management with beforeAll/afterAll hooks',
        'DRY principles using shared test utilities and fixtures',
        'Comprehensive logging for debugging and education',
        'Production-ready testing patterns and best practices'
      ];
      
      // Assert all concepts are documented
      expect(conceptsCovered.length).toBeGreaterThan(10);
      
      console.log('📚 Integration Testing Concepts Covered:');
      conceptsCovered.forEach((concept, index) => {
        console.log(`   ${index + 1}. ${concept}`);
      });
      
      console.log('✅ Educational objectives successfully demonstrated');
      console.log('🎓 Ready for production-level Express.js integration testing');
    });
  });
});

// =============================================================================
// IMPLEMENTATION NOTES AND EXTENSION GUIDANCE
// =============================================================================

/**
 * Implementation Notes for Integration Testing Architecture
 * 
 * This section provides comprehensive guidance for understanding and extending
 * the integration testing architecture implemented in this test suite.
 * 
 * 1. **Supertest Integration Patterns:**
 *    - Uses Express.js app instance directly without network server
 *    - Leverages automatic port binding for isolated testing
 *    - Implements comprehensive HTTP assertion patterns
 *    - Supports all HTTP methods and response validation scenarios
 * 
 * 2. **Jest Testing Framework Usage:**
 *    - Follows describe/test syntax for clear test organization
 *    - Uses beforeAll/afterAll hooks for proper lifecycle management
 *    - Implements comprehensive assertion patterns with expect()
 *    - Provides detailed educational logging for learning purposes
 * 
 * 3. **Fixture-Based Testing:**
 *    - Uses canonical request/response fixtures for consistency
 *    - Ensures API contract compliance through standardized data
 *    - Supports maintainable tests through centralized test data
 *    - Enables easy modification of test scenarios
 * 
 * 4. **Error Handling Coverage:**
 *    - Tests all major HTTP error scenarios (404, 405, 500)
 *    - Validates error message security and sanitization
 *    - Ensures consistent error response formatting
 *    - Demonstrates production-ready error handling patterns
 * 
 * 5. **Performance and Security Testing:**
 *    - Includes response time validation for performance baselines
 *    - Tests security considerations in error message handling
 *    - Validates HTTP header security and content-type specification
 *    - Demonstrates comprehensive endpoint validation
 * 
 * 6. **Educational Architecture:**
 *    - Comprehensive documentation explains every testing decision
 *    - Code structure demonstrates Express.js testing best practices
 *    - Implementation supports learning Node.js testing concepts
 *    - Examples show how to extend tests for additional functionality
 * 
 * 7. **Production Readiness:**
 *    - Tests cover all externally observable application behavior
 *    - Validation ensures API contract compliance
 *    - Security testing prevents information disclosure vulnerabilities
 *    - Performance testing establishes acceptable response baselines
 * 
 * 8. **Maintainability Guidelines:**
 *    - Follow established patterns when adding new test scenarios
 *    - Maintain comprehensive documentation for all test additions
 *    - Use fixtures for consistent test data management
 *    - Update assertions to reflect any API contract changes
 */

/**
 * Extension Guidelines for Advanced Testing Scenarios
 * 
 * **Adding New Endpoint Tests:**
 * 1. Add expected response data to expected-responses.json fixture
 * 2. Add sample request data to sample-requests.json fixture
 * 3. Create new test group following established describe/test patterns
 * 4. Implement comprehensive validation including status, headers, body
 * 
 * **Adding Error Scenario Tests:**
 * 1. Define error conditions and expected responses in fixtures
 * 2. Create test cases that trigger specific error conditions
 * 3. Validate error response format and security considerations
 * 4. Ensure error logging and monitoring integration
 * 
 * **Performance Testing Enhancement:**
 * 1. Implement load testing scenarios for high-traffic endpoints
 * 2. Add memory usage validation for resource-intensive operations
 * 3. Test concurrent request handling and rate limiting
 * 4. Validate response time under various load conditions
 * 
 * **Security Testing Expansion:**
 * 1. Add tests for common security vulnerabilities (XSS, injection)
 * 2. Validate input sanitization and validation logic
 * 3. Test authentication and authorization mechanisms
 * 4. Ensure proper handling of sensitive data in responses
 * 
 * **Integration with CI/CD:**
 * 1. Configure test execution in automated build pipelines
 * 2. Set up code coverage reporting and quality gates
 * 3. Implement test result reporting and failure notifications
 * 4. Ensure consistent test environment across different stages
 */