/**
 * Unit Test Suite for Express Error-Handling Middleware
 * 
 * This test suite validates the errorHandler middleware's capability to:
 * - Distinguish between operational (HttpError) and programmer/system errors
 * - Log errors using the Logger utility with appropriate metadata
 * - Send standardized, secure error responses to clients
 * - Handle environment-aware response formatting (production vs development)
 * - Follow Express middleware contract for error handling
 * - Prevent double response sending and handle headersSent state
 * 
 * The tests cover all code paths including production and development/test modes,
 * ensuring comprehensive validation of error handling logic according to the
 * technical specification requirements.
 * 
 * @fileoverview Unit tests for Express error-handling middleware
 * @version 1.0.0
 * @author Tutorial Implementation Team
 */

// =============================================================================
// IMPORTS
// =============================================================================

// Testing framework - Jest v29.7.0
const { jest, describe, beforeEach, afterEach, it, expect } = require('jest'); // v29.7.0

// Module under test
const { errorHandler } = require('../../../backend/middleware/errorHandler.js');

// Dependencies for testing
const { Logger } = require('../../../backend/utils/logger.js');
const { HttpError, InternalServerError } = require('../../../backend/utils/errorTypes.js');

// Test utilities for DRY request simulation and assertion logic
const testUtils = require('../../helpers/testUtils.js');

// Response fixtures for consistent validation
const responses = require('../../fixtures/responses.js');

// =============================================================================
// GLOBAL VARIABLES
// =============================================================================

/**
 * Backup of original process.env.NODE_ENV for environment mocking
 * Used to restore the original environment after each test
 */
let originalEnv;

// =============================================================================
// TEST HELPER FUNCTIONS
// =============================================================================

/**
 * Creates mock Express req, res, and next objects for unit testing middleware
 * 
 * This function generates mock objects that simulate Express.js request, response,
 * and next function behavior. The res object includes Jest spy functions for
 * status(), json(), and a configurable headersSent property to test various
 * Express middleware scenarios.
 * 
 * @function mockReqResNext
 * @returns {Object} Object containing mock req, res, and next functions
 * @returns {Object} returns.req - Mock Express request object
 * @returns {Object} returns.res - Mock Express response object with Jest spies
 * @returns {Function} returns.next - Mock Express next function as Jest spy
 * 
 * @example
 * const { req, res, next } = mockReqResNext();
 * // Use in middleware tests
 * errorHandler(error, req, res, next);
 * expect(res.status).toHaveBeenCalledWith(500);
 */
function mockReqResNext() {
  // Create empty req object with common Express properties
  const req = {
    originalUrl: '/test',
    url: '/test',
    method: 'GET',
    ip: '127.0.0.1',
    connection: {
      remoteAddress: '127.0.0.1'
    },
    get: jest.fn().mockReturnValue('test-user-agent')
  };
  
  // Create res object with jest.fn() for status and json, and headersSent property
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    headersSent: false
  };
  
  // Create next as jest.fn()
  const next = jest.fn();
  
  return { req, res, next };
}

// =============================================================================
// TEST SUITE
// =============================================================================

describe('errorHandler middleware', () => {
  
  // =============================================================================
  // SETUP AND TEARDOWN
  // =============================================================================
  
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock Logger.error to prevent actual logging during tests
    jest.spyOn(Logger, 'error').mockImplementation(() => {});
    
    // Backup original NODE_ENV
    originalEnv = process.env.NODE_ENV;
  });
  
  afterEach(() => {
    // Restore NODE_ENV to original value
    process.env.NODE_ENV = originalEnv;
    
    // Restore all mocks
    jest.restoreAllMocks();
  });
  
  // =============================================================================
  // OPERATIONAL ERROR HANDLING TESTS
  // =============================================================================
  
  describe('Operational vs programmer error handling', () => {
    
    it('should handle HttpError (operational error) correctly', async () => {
      // Set NODE_ENV to 'production' for this test
      process.env.NODE_ENV = 'production';
      
      // Create an HttpError with status 400, message 'Bad Request', and details
      const httpError = new HttpError(400, 'Bad Request', { field: 'email', issue: 'format' });
      
      // Create mock req/res/next objects
      const { req, res, next } = mockReqResNext();
      
      // Invoke errorHandler with the error and mock objects
      errorHandler(httpError, req, res, next);
      
      // Assert Logger.error was called with correct arguments
      expect(Logger.error).toHaveBeenCalledWith(
        'HTTP 400 Error: Bad Request',
        expect.objectContaining({
          status: 400,
          message: 'Bad Request',
          url: '/test',
          method: 'GET',
          ip: '127.0.0.1',
          userAgent: 'test-user-agent',
          timestamp: expect.any(String),
          details: { field: 'email', issue: 'format' }
        })
      );
      
      // Assert res.status was called with 400
      expect(res.status).toHaveBeenCalledWith(400);
      
      // Assert res.json was called with production-safe response (no stack)
      expect(res.json).toHaveBeenCalledWith({
        status: 400,
        message: 'Bad Request',
        details: { field: 'email', issue: 'format' }
      });
      
      // Assert next was not called (response was sent)
      expect(next).not.toHaveBeenCalled();
    });
    
    it('should handle unknown (programmer/system) errors as InternalServerError', async () => {
      // Set NODE_ENV to 'production' for this test
      process.env.NODE_ENV = 'production';
      
      // Create a plain Error (not HttpError)
      const plainError = new Error('Something broke');
      
      // Create mock req/res/next objects
      const { req, res, next } = mockReqResNext();
      
      // Invoke errorHandler with the error and mock objects
      errorHandler(plainError, req, res, next);
      
      // Assert Logger.error was called with correct arguments
      expect(Logger.error).toHaveBeenCalledWith(
        'HTTP 500 Error: Internal Server Error',
        expect.objectContaining({
          status: 500,
          message: 'Internal Server Error',
          url: '/test',
          method: 'GET',
          ip: '127.0.0.1',
          userAgent: 'test-user-agent',
          timestamp: expect.any(String),
          details: expect.objectContaining({
            originalName: 'Error',
            originalMessage: 'Something broke'
          })
        })
      );
      
      // Assert res.status was called with 500
      expect(res.status).toHaveBeenCalledWith(500);
      
      // Assert res.json was called with production-safe response
      expect(res.json).toHaveBeenCalledWith({
        status: 500,
        message: 'Internal Server Error'
      });
      
      // Assert next was not called (response was sent)
      expect(next).not.toHaveBeenCalled();
    });
    
    it('should handle errors with no message gracefully', async () => {
      // Set NODE_ENV to 'production'
      process.env.NODE_ENV = 'production';
      
      // Create an error with no message
      const errorWithNoMessage = new Error();
      errorWithNoMessage.message = '';
      
      // Create mock req/res/next objects
      const { req, res, next } = mockReqResNext();
      
      // Invoke errorHandler
      errorHandler(errorWithNoMessage, req, res, next);
      
      // Assert Logger.error was called
      expect(Logger.error).toHaveBeenCalledWith(
        'HTTP 500 Error: Internal Server Error',
        expect.objectContaining({
          status: 500,
          message: 'Internal Server Error',
          details: expect.objectContaining({
            originalName: 'Error',
            originalMessage: 'An unexpected error occurred'
          })
        })
      );
      
      // Assert proper response was sent
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 500,
        message: 'Internal Server Error'
      });
    });
    
  });
  
  // =============================================================================
  // ENVIRONMENT-SPECIFIC BEHAVIOR TESTS
  // =============================================================================
  
  describe('Environment-specific behavior (production, development, test)', () => {
    
    it('should include stack trace and details in development environment', async () => {
      // Set NODE_ENV to 'development'
      process.env.NODE_ENV = 'development';
      
      // Create an HttpError with details
      const httpError = new HttpError(422, 'Validation failed', { 
        field: 'email', 
        issue: 'format',
        value: 'invalid-email'
      });
      
      // Create mock req/res/next objects
      const { req, res, next } = mockReqResNext();
      
      // Invoke errorHandler
      errorHandler(httpError, req, res, next);
      
      // Assert res.json was called with details and stack trace
      expect(res.json).toHaveBeenCalledWith({
        status: 422,
        message: 'Validation failed',
        details: { field: 'email', issue: 'format', value: 'invalid-email' },
        stack: expect.any(String)
      });
    });
    
    it('should include stack trace and details in test environment', async () => {
      // Set NODE_ENV to 'test'
      process.env.NODE_ENV = 'test';
      
      // Create an HttpError with details
      const httpError = new HttpError(409, 'Conflict detected', { 
        resource: 'user',
        conflictField: 'email'
      });
      
      // Create mock req/res/next objects
      const { req, res, next } = mockReqResNext();
      
      // Invoke errorHandler
      errorHandler(httpError, req, res, next);
      
      // Assert res.json was called with details and stack trace
      expect(res.json).toHaveBeenCalledWith({
        status: 409,
        message: 'Conflict detected',
        details: { resource: 'user', conflictField: 'email' },
        stack: expect.any(String)
      });
    });
    
    it('should exclude stack trace in production environment', async () => {
      // Set NODE_ENV to 'production'
      process.env.NODE_ENV = 'production';
      
      // Create an HttpError
      const httpError = new HttpError(403, 'Forbidden access', { 
        resource: 'admin-panel',
        permission: 'read'
      });
      
      // Create mock req/res/next objects
      const { req, res, next } = mockReqResNext();
      
      // Invoke errorHandler
      errorHandler(httpError, req, res, next);
      
      // Assert res.json was called without stack trace
      const jsonCallArgs = res.json.mock.calls[0][0];
      expect(jsonCallArgs).toEqual({
        status: 403,
        message: 'Forbidden access',
        details: { resource: 'admin-panel', permission: 'read' }
      });
      
      // Explicitly check that stack is not included
      expect(jsonCallArgs).not.toHaveProperty('stack');
    });
    
    it('should sanitize sensitive details in production environment', async () => {
      // Set NODE_ENV to 'production'
      process.env.NODE_ENV = 'production';
      
      // Create an error with sensitive details
      const plainError = new Error('Database connection failed');
      plainError.sensitiveInfo = 'password123';
      
      // Create mock req/res/next objects
      const { req, res, next } = mockReqResNext();
      
      // Invoke errorHandler
      errorHandler(plainError, req, res, next);
      
      // Assert res.json was called with sanitized response
      expect(res.json).toHaveBeenCalledWith({
        status: 500,
        message: 'Internal Server Error'
      });
      
      // Verify sensitive details are not exposed
      const jsonCallArgs = res.json.mock.calls[0][0];
      expect(jsonCallArgs).not.toHaveProperty('details');
    });
    
  });
  
  // =============================================================================
  // LOGGER INTEGRATION TESTS
  // =============================================================================
  
  describe('Logger integration', () => {
    
    it('should log all errors using Logger.error with comprehensive metadata', async () => {
      // Set NODE_ENV to 'development'
      process.env.NODE_ENV = 'development';
      
      // Create a custom HttpError
      const httpError = new HttpError(401, 'Unauthorized', { 
        reason: 'invalid_token',
        tokenType: 'Bearer'
      });
      
      // Create mock req/res/next with custom properties
      const { req, res, next } = mockReqResNext();
      req.originalUrl = '/api/users/123';
      req.method = 'POST';
      req.ip = '192.168.1.100';
      req.get.mockReturnValue('Mozilla/5.0 (test-browser)');
      
      // Invoke errorHandler
      errorHandler(httpError, req, res, next);
      
      // Assert Logger.error was called with correct message and metadata
      expect(Logger.error).toHaveBeenCalledWith(
        'HTTP 401 Error: Unauthorized',
        expect.objectContaining({
          status: 401,
          message: 'Unauthorized',
          url: '/api/users/123',
          method: 'POST',
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (test-browser)',
          timestamp: expect.any(String),
          details: { reason: 'invalid_token', tokenType: 'Bearer' },
          stack: expect.any(String)
        })
      );
    });
    
    it('should log programmer errors with wrapped InternalServerError details', async () => {
      // Set NODE_ENV to 'test'
      process.env.NODE_ENV = 'test';
      
      // Create a TypeError (programmer error)
      const typeError = new TypeError('Cannot read property of undefined');
      
      // Create mock req/res/next objects
      const { req, res, next } = mockReqResNext();
      
      // Invoke errorHandler
      errorHandler(typeError, req, res, next);
      
      // Assert Logger.error was called with wrapped error information
      expect(Logger.error).toHaveBeenCalledWith(
        'HTTP 500 Error: Internal Server Error',
        expect.objectContaining({
          status: 500,
          message: 'Internal Server Error',
          details: expect.objectContaining({
            originalName: 'TypeError',
            originalMessage: 'Cannot read property of undefined',
            originalStack: expect.any(String)
          })
        })
      );
    });
    
    it('should log with fallback values when request properties are missing', async () => {
      // Set NODE_ENV to 'development'
      process.env.NODE_ENV = 'development';
      
      // Create an HttpError
      const httpError = new HttpError(400, 'Bad Request');
      
      // Create minimal req object with missing properties
      const req = {
        method: 'GET'
      };
      
      const { res, next } = mockReqResNext();
      
      // Invoke errorHandler
      errorHandler(httpError, req, res, next);
      
      // Assert Logger.error was called with fallback values
      expect(Logger.error).toHaveBeenCalledWith(
        'HTTP 400 Error: Bad Request',
        expect.objectContaining({
          status: 400,
          message: 'Bad Request',
          url: undefined,
          method: 'GET',
          ip: undefined,
          userAgent: undefined,
          timestamp: expect.any(String)
        })
      );
    });
    
  });
  
  // =============================================================================
  // EXPRESS CONTRACT COMPLIANCE TESTS
  // =============================================================================
  
  describe('Express contract compliance', () => {
    
    it('should not send headers twice if already sent', async () => {
      // Set NODE_ENV to 'production'
      process.env.NODE_ENV = 'production';
      
      // Create an HttpError
      const httpError = new HttpError(500, 'Internal Server Error');
      
      // Create mock req/res/next with headersSent = true
      const { req, res, next } = mockReqResNext();
      res.headersSent = true;
      
      // Invoke errorHandler
      errorHandler(httpError, req, res, next);
      
      // Assert res.status and res.json were not called
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      
      // Assert next was called with the error
      expect(next).toHaveBeenCalledWith(httpError);
      
      // Assert special logging for headersSent condition
      expect(Logger.error).toHaveBeenCalledWith(
        'Cannot send error response - headers already sent',
        expect.objectContaining({
          url: '/test',
          method: 'GET',
          status: 500
        })
      );
    });
    
    it('should call next() when response fails to send', async () => {
      // Set NODE_ENV to 'production'
      process.env.NODE_ENV = 'production';
      
      // Create an HttpError
      const httpError = new HttpError(500, 'Internal Server Error');
      
      // Create mock req/res/next with failing json method
      const { req, res, next } = mockReqResNext();
      const jsonError = new Error('Response send failed');
      res.json.mockImplementation(() => {
        throw jsonError;
      });
      
      // Invoke errorHandler
      errorHandler(httpError, req, res, next);
      
      // Assert Logger.error was called for the failed response
      expect(Logger.error).toHaveBeenCalledWith(
        'Failed to send error response',
        expect.objectContaining({
          originalError: 'Internal Server Error',
          responseError: 'Response send failed',
          url: '/test',
          method: 'GET'
        })
      );
    });
    
    it('should handle complete response failure gracefully', async () => {
      // Set NODE_ENV to 'production'
      process.env.NODE_ENV = 'production';
      
      // Create an HttpError
      const httpError = new HttpError(500, 'Internal Server Error');
      
      // Create mock req/res/next with both status and json failing
      const { req, res, next } = mockReqResNext();
      const responseError = new Error('Complete response failure');
      res.status.mockImplementation(() => {
        throw responseError;
      });
      
      // Invoke errorHandler
      errorHandler(httpError, req, res, next);
      
      // Since status() throws, it should attempt fallback response
      expect(Logger.error).toHaveBeenCalledWith(
        'Failed to send error response',
        expect.objectContaining({
          originalError: 'Internal Server Error',
          responseError: 'Complete response failure'
        })
      );
    });
    
    it('should not call next() when response is successfully sent', async () => {
      // Set NODE_ENV to 'production'
      process.env.NODE_ENV = 'production';
      
      // Create an HttpError
      const httpError = new HttpError(400, 'Bad Request');
      
      // Create mock req/res/next objects
      const { req, res, next } = mockReqResNext();
      
      // Invoke errorHandler
      errorHandler(httpError, req, res, next);
      
      // Assert response was sent successfully
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 400,
        message: 'Bad Request'
      });
      
      // Assert next was not called when response is sent
      expect(next).not.toHaveBeenCalled();
    });
    
  });
  
  // =============================================================================
  // EDGE CASE TESTS
  // =============================================================================
  
  describe('Edge cases and error boundary handling', () => {
    
    it('should handle null error gracefully', async () => {
      // Set NODE_ENV to 'production'
      process.env.NODE_ENV = 'production';
      
      // Pass null as error
      const nullError = null;
      
      // Create mock req/res/next objects
      const { req, res, next } = mockReqResNext();
      
      // Invoke errorHandler
      errorHandler(nullError, req, res, next);
      
      // Assert it's treated as a programmer error
      expect(Logger.error).toHaveBeenCalledWith(
        'HTTP 500 Error: Internal Server Error',
        expect.objectContaining({
          status: 500,
          message: 'Internal Server Error',
          details: expect.objectContaining({
            originalName: 'Unknown',
            originalMessage: 'An unexpected error occurred'
          })
        })
      );
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 500,
        message: 'Internal Server Error'
      });
    });
    
    it('should handle undefined error gracefully', async () => {
      // Set NODE_ENV to 'production'
      process.env.NODE_ENV = 'production';
      
      // Pass undefined as error
      const undefinedError = undefined;
      
      // Create mock req/res/next objects
      const { req, res, next } = mockReqResNext();
      
      // Invoke errorHandler
      errorHandler(undefinedError, req, res, next);
      
      // Assert it's treated as a programmer error
      expect(Logger.error).toHaveBeenCalledWith(
        'HTTP 500 Error: Internal Server Error',
        expect.objectContaining({
          status: 500,
          message: 'Internal Server Error'
        })
      );
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 500,
        message: 'Internal Server Error'
      });
    });
    
    it('should handle errors with circular references in details', async () => {
      // Set NODE_ENV to 'development'
      process.env.NODE_ENV = 'development';
      
      // Create an error with circular reference
      const circularObj = {};
      circularObj.self = circularObj;
      const httpError = new HttpError(400, 'Bad Request', circularObj);
      
      // Create mock req/res/next objects
      const { req, res, next } = mockReqResNext();
      
      // Invoke errorHandler
      errorHandler(httpError, req, res, next);
      
      // Assert it handles the circular reference gracefully
      expect(Logger.error).toHaveBeenCalledWith(
        'HTTP 400 Error: Bad Request',
        expect.objectContaining({
          status: 400,
          message: 'Bad Request'
        })
      );
      
      // Should still send a response despite circular reference
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });
    
    it('should handle InternalServerError instances correctly', async () => {
      // Set NODE_ENV to 'development'
      process.env.NODE_ENV = 'development';
      
      // Create an InternalServerError (which extends HttpError)
      const internalError = new InternalServerError('Database connection failed', {
        database: 'postgres',
        host: 'localhost'
      });
      
      // Create mock req/res/next objects
      const { req, res, next } = mockReqResNext();
      
      // Invoke errorHandler
      errorHandler(internalError, req, res, next);
      
      // Assert it's treated as an HttpError (not wrapped again)
      expect(Logger.error).toHaveBeenCalledWith(
        'HTTP 500 Error: Database connection failed',
        expect.objectContaining({
          status: 500,
          message: 'Database connection failed',
          details: { database: 'postgres', host: 'localhost' }
        })
      );
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 500,
        message: 'Database connection failed',
        details: { database: 'postgres', host: 'localhost' },
        stack: expect.any(String)
      });
    });
    
  });
  
});