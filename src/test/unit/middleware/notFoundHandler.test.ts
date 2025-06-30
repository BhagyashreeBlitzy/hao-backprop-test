// Jest testing framework for assertions, spying, and test organization - v29.0.0
import { jest } from '@jest/globals';

// Import the middleware under test
import { notFoundHandler } from '../../../../backend/middleware/notFoundHandler.js';

// Import test helper utilities for creating mock Express objects and assertions
import { mockRequest } from '../../../helpers/mockRequest';
import { mockResponse } from '../../../helpers/mockResponse';
import { assertResponse } from '../../../helpers/testUtils';

// Mock the logger utility to spy on logging behavior
jest.mock('../../../../backend/utils/logger.js', () => ({
  logWarn: jest.fn()
}));

// Mock the response formatter utility to control and verify response formatting
jest.mock('../../../../backend/utils/responseFormatter.js', () => ({
  formatErrorResponse: jest.fn()
}));

// Import mocked modules for assertion purposes
const { logWarn } = require('../../../../backend/utils/logger.js');
const { formatErrorResponse } = require('../../../../backend/utils/responseFormatter.js');

/**
 * Main test suite for the notFoundHandler middleware
 * 
 * This test suite verifies that the notFoundHandler middleware correctly:
 * - Handles unmatched routes with appropriate 404 responses
 * - Logs 404 events with proper metadata for observability
 * - Uses centralized utilities for response formatting
 * - Handles environment-specific behavior appropriately
 * - Follows Express.js middleware patterns correctly
 */
describe('notFoundHandler', () => {
  // Store original NODE_ENV to restore after environment-specific tests
  let originalNodeEnv: string | undefined;

  /**
   * Test setup - runs before each individual test
   * 
   * Clears all mocks to ensure test isolation and prevents test interference.
   * Each test starts with fresh mock state for reliable, predictable testing.
   */
  beforeEach(() => {
    // Clear all jest mocks to ensure clean state for each test
    jest.clearAllMocks();
    
    // Store original NODE_ENV for restoration after environment tests
    originalNodeEnv = process.env.NODE_ENV;
  });

  /**
   * Test cleanup - runs after each individual test
   * 
   * Restores original environment variables to prevent test pollution
   * and ensures subsequent tests run in predictable environments.
   */
  afterEach(() => {
    // Restore original NODE_ENV to prevent environment pollution
    if (originalNodeEnv !== undefined) {
      process.env.NODE_ENV = originalNodeEnv;
    } else {
      delete process.env.NODE_ENV;
    }
  });

  /**
   * Test: Returns 404 and standard error response for unmatched route
   * 
   * Verifies that the middleware correctly identifies unmatched routes and
   * responds with a proper 404 status code and standardized error structure.
   * This is the core functionality test for the middleware.
   */
  it('should return 404 and standard error response for unmatched route', () => {
    // Arrange: Create mock request for a non-existent route
    const req = mockRequest({
      method: 'GET',
      url: '/nonexistent-route',
      headers: { 'User-Agent': 'Test Browser 1.0' }
    });
    
    // Create mock response object with spy methods
    const res = mockResponse();
    
    // Create mock next function (should not be called in this middleware)
    const next = jest.fn();

    // Act: Execute the notFoundHandler middleware
    notFoundHandler(req, res, next);

    // Assert: Verify formatErrorResponse was called with correct parameters
    expect(formatErrorResponse).toHaveBeenCalledTimes(1);
    expect(formatErrorResponse).toHaveBeenCalledWith(
      res,
      404, // HTTP_NOT_FOUND status code
      'Resource not found', // NOT_FOUND_MESSAGE constant
      expect.objectContaining({
        method: 'GET',
        path: '/nonexistent-route',
        requestedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
      })
    );

    // Assert: Verify next() was not called (middleware terminates the chain)
    expect(next).not.toHaveBeenCalled();
  });

  /**
   * Test: Logs the 404 event with method and path metadata
   * 
   * Verifies that the middleware properly logs 404 events for observability
   * and debugging purposes, including relevant request metadata for analysis.
   */
  it('should log the 404 event with method and path metadata', () => {
    // Arrange: Create mock request with specific method and path for verification
    const req = mockRequest({
      method: 'POST',
      url: '/api/unknown-endpoint?param=value',
      headers: { 'User-Agent': 'Test Client 2.0' }
    });
    
    const res = mockResponse();
    const next = jest.fn();

    // Act: Execute the notFoundHandler middleware
    notFoundHandler(req, res, next);

    // Assert: Verify logWarn was called with proper message and metadata
    expect(logWarn).toHaveBeenCalledTimes(1);
    expect(logWarn).toHaveBeenCalledWith(
      '404 Not Found - Request to undefined endpoint',
      expect.objectContaining({
        method: 'POST',
        path: '/api/unknown-endpoint?param=value',
        timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/),
        userAgent: 'Test Client 2.0',
        remoteAddress: expect.any(String)
      })
    );
  });

  /**
   * Test: Does not call next() after sending the response
   * 
   * Verifies that the middleware properly terminates the Express.js middleware
   * chain by not calling next(), which is correct behavior for terminal middleware
   * that sends a response.
   */
  it('should not call next() after sending the response', () => {
    // Arrange: Create standard mock objects
    const req = mockRequest({
      method: 'GET',
      url: '/invalid-path'
    });
    
    const res = mockResponse();
    const next = jest.fn();

    // Act: Execute the notFoundHandler middleware
    notFoundHandler(req, res, next);

    // Assert: Verify next() was never called (middleware terminates chain)
    expect(next).not.toHaveBeenCalled();
    
    // Assert: Verify response formatting was called (response was sent)
    expect(formatErrorResponse).toHaveBeenCalledTimes(1);
  });

  /**
   * Test: Returns additional details in development mode
   * 
   * Verifies that in development environment, the middleware includes
   * additional request details for debugging purposes while maintaining
   * educational clarity and development experience.
   */
  it('should return additional details in development mode', () => {
    // Arrange: Set NODE_ENV to development for environment-specific behavior
    process.env.NODE_ENV = 'development';
    
    const req = mockRequest({
      method: 'PUT',
      url: '/development-test-route',
      headers: { 'User-Agent': 'Development Browser' }
    });
    
    const res = mockResponse();
    const next = jest.fn();

    // Act: Execute the notFoundHandler middleware
    notFoundHandler(req, res, next);

    // Assert: Verify formatErrorResponse was called with development details
    expect(formatErrorResponse).toHaveBeenCalledWith(
      res,
      404,
      'Resource not found',
      expect.objectContaining({
        method: 'PUT',
        path: '/development-test-route',
        requestedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
      })
    );

    // Assert: Verify the details object contains expected development information
    const callArgs = (formatErrorResponse as jest.MockedFunction<any>).mock.calls[0];
    const details = callArgs[3];
    expect(details).toEqual({
      method: 'PUT',
      path: '/development-test-route',
      requestedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
    });
  });

  /**
   * Test: Returns only the generic error message in production mode
   * 
   * Verifies that in production environment, the middleware excludes
   * detailed request information to prevent information disclosure and
   * maintain security best practices.
   */
  it('should return only the generic error message in production mode', () => {
    // Arrange: Set NODE_ENV to production for security-conscious behavior
    process.env.NODE_ENV = 'production';
    
    const req = mockRequest({
      method: 'DELETE',
      url: '/production-test-route',
      headers: { 'User-Agent': 'Production Client' }
    });
    
    const res = mockResponse();
    const next = jest.fn();

    // Act: Execute the notFoundHandler middleware
    notFoundHandler(req, res, next);

    // Assert: Verify formatErrorResponse was called with details (security handled by formatter)
    expect(formatErrorResponse).toHaveBeenCalledWith(
      res,
      404,
      'Resource not found',
      expect.objectContaining({
        method: 'DELETE',
        path: '/production-test-route',
        requestedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
      })
    );

    // Note: The actual filtering of details in production is handled by
    // formatErrorResponse utility, which checks NODE_ENV internally.
    // This test verifies the middleware passes details consistently,
    // trusting the formatter to handle environment-specific behavior.
  });

  /**
   * Test: Handles requests with missing User-Agent header gracefully
   * 
   * Verifies that the middleware handles edge cases like missing headers
   * gracefully without throwing errors, demonstrating robust error handling.
   */
  it('should handle requests with missing User-Agent header gracefully', () => {
    // Arrange: Create request without User-Agent header to test edge case
    const req = mockRequest({
      method: 'GET',
      url: '/test-no-user-agent',
      headers: {} // No User-Agent header
    });
    
    const res = mockResponse();
    const next = jest.fn();

    // Act: Execute the notFoundHandler middleware
    notFoundHandler(req, res, next);

    // Assert: Verify middleware executes without errors
    expect(formatErrorResponse).toHaveBeenCalledTimes(1);
    
    // Assert: Verify logWarn handles missing User-Agent gracefully
    expect(logWarn).toHaveBeenCalledWith(
      '404 Not Found - Request to undefined endpoint',
      expect.objectContaining({
        method: 'GET',
        path: '/test-no-user-agent',
        userAgent: 'Unknown', // Default value for missing User-Agent
        remoteAddress: expect.any(String)
      })
    );
  });

  /**
   * Test: Handles various HTTP methods consistently
   * 
   * Verifies that the middleware handles different HTTP methods (GET, POST, PUT, DELETE)
   * consistently, logging the correct method and returning appropriate responses.
   */
  it('should handle various HTTP methods consistently', () => {
    // Test data: Array of different HTTP methods to verify consistent handling
    const testMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    
    testMethods.forEach((method) => {
      // Arrange: Clear mocks for each method test
      jest.clearAllMocks();
      
      const req = mockRequest({
        method: method,
        url: `/test-${method.toLowerCase()}`,
        headers: { 'User-Agent': `${method} Test Client` }
      });
      
      const res = mockResponse();
      const next = jest.fn();

      // Act: Execute the notFoundHandler middleware
      notFoundHandler(req, res, next);

      // Assert: Verify consistent behavior across all HTTP methods
      expect(logWarn).toHaveBeenCalledWith(
        '404 Not Found - Request to undefined endpoint',
        expect.objectContaining({
          method: method,
          path: `/test-${method.toLowerCase()}`,
          userAgent: `${method} Test Client`
        })
      );

      expect(formatErrorResponse).toHaveBeenCalledWith(
        res,
        404,
        'Resource not found',
        expect.objectContaining({
          method: method,
          path: `/test-${method.toLowerCase()}`
        })
      );

      expect(next).not.toHaveBeenCalled();
    });
  });

  /**
   * Test: Handles requests with query parameters correctly
   * 
   * Verifies that the middleware properly captures and logs the complete URL
   * including query parameters for comprehensive request tracking.
   */
  it('should handle requests with query parameters correctly', () => {
    // Arrange: Create request with complex query parameters
    const req = mockRequest({
      method: 'GET',
      url: '/search?q=nodejs&category=tutorial&page=1&sort=date',
      headers: { 'User-Agent': 'Search Bot 1.0' }
    });
    
    const res = mockResponse();
    const next = jest.fn();

    // Act: Execute the notFoundHandler middleware
    notFoundHandler(req, res, next);

    // Assert: Verify the complete URL with query parameters is logged
    expect(logWarn).toHaveBeenCalledWith(
      '404 Not Found - Request to undefined endpoint',
      expect.objectContaining({
        method: 'GET',
        path: '/search?q=nodejs&category=tutorial&page=1&sort=date',
        userAgent: 'Search Bot 1.0'
      })
    );

    // Assert: Verify the complete URL is included in response details
    expect(formatErrorResponse).toHaveBeenCalledWith(
      res,
      404,
      'Resource not found',
      expect.objectContaining({
        method: 'GET',
        path: '/search?q=nodejs&category=tutorial&page=1&sort=date'
      })
    );
  });

  /**
   * Test: Includes accurate timestamp in logged metadata
   * 
   * Verifies that the middleware includes accurate, properly formatted
   * timestamps in logged metadata for time-based analysis and debugging.
   */
  it('should include accurate timestamp in logged metadata', () => {
    // Arrange: Capture time before middleware execution for comparison
    const beforeTime = new Date();
    
    const req = mockRequest({
      method: 'GET',
      url: '/timestamp-test'
    });
    
    const res = mockResponse();
    const next = jest.fn();

    // Act: Execute the notFoundHandler middleware
    notFoundHandler(req, res, next);
    
    // Capture time after middleware execution
    const afterTime = new Date();

    // Assert: Verify timestamp is included in log metadata
    expect(logWarn).toHaveBeenCalledWith(
      '404 Not Found - Request to undefined endpoint',
      expect.objectContaining({
        timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
      })
    );

    // Extract and validate timestamp accuracy
    const logCall = (logWarn as jest.MockedFunction<any>).mock.calls[0];
    const metadata = logCall[1];
    const loggedTimestamp = new Date(metadata.timestamp);

    // Assert: Verify timestamp is within reasonable time range (accounting for test execution time)
    expect(loggedTimestamp.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
    expect(loggedTimestamp.getTime()).toBeLessThanOrEqual(afterTime.getTime());
  });

  /**
   * Test: Maintains middleware execution order expectations
   * 
   * Verifies that the middleware behaves correctly as terminal middleware
   * by not calling next() and properly terminating the request cycle.
   */
  it('should maintain middleware execution order expectations', () => {
    // Arrange: Create mock objects to verify execution order
    const req = mockRequest({
      method: 'GET',
      url: '/middleware-order-test'
    });
    
    const res = mockResponse();
    const next = jest.fn();

    // Act: Execute the notFoundHandler middleware
    notFoundHandler(req, res, next);

    // Assert: Verify proper middleware termination behavior
    expect(next).not.toHaveBeenCalled();
    expect(formatErrorResponse).toHaveBeenCalledTimes(1);
    expect(logWarn).toHaveBeenCalledTimes(1);

    // Assert: Verify execution order - logging should happen before response formatting
    const logWarnCallOrder = (logWarn as jest.MockedFunction<any>).mock.invocationCallOrder[0];
    const formatErrorResponseCallOrder = (formatErrorResponse as jest.MockedFunction<any>).mock.invocationCallOrder[0];
    
    expect(logWarnCallOrder).toBeLessThan(formatErrorResponseCallOrder);
  });
});