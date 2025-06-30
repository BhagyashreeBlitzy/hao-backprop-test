// Import focused test utilities for Express.js request, response, and next function mocking
import { mockRequest } from './mockRequest';
import { mockResponse } from './mockResponse';
import { simulateNext } from './testUtils';

/**
 * Factory function to create a complete mock Express.js context for use in unit and integration tests.
 * 
 * This composite utility function provides a single entry point for generating the full Express.js
 * middleware and route handler context (req, res, next) that is commonly required in backend testing
 * scenarios. It combines the focused mock utilities from mockRequest.ts, mockResponse.ts, and 
 * testUtils.ts to ensure consistency and DRY (Don't Repeat Yourself) principles across the test suite.
 * 
 * Educational Value:
 * This utility demonstrates proper test architecture patterns for Express.js applications,
 * showing how to compose focused testing utilities into a comprehensive testing context.
 * It supports maintainable test code by providing a single point of configuration for the
 * complete Express.js testing environment, which is essential for testing middleware,
 * route handlers, and error handling logic.
 * 
 * Design Pattern:
 * This factory function follows the Composite pattern, combining multiple specialized
 * mock objects into a single, cohesive testing context. This approach ensures that
 * all tests use consistent mock implementations while allowing for customization
 * through parameter overrides when needed for specific test scenarios.
 * 
 * Testing Strategy Integration:
 * The function supports the comprehensive testing strategy outlined in the technical
 * specifications, enabling both unit tests (individual component testing) and 
 * integration tests (full request-response cycle testing) through a unified interface.
 * It ensures all mocks are Jest-compatible for assertion and verification capabilities.
 * 
 * @param reqOverrides - Optional partial properties to override the default mock request object.
 *                      Supports all standard Express.js request properties including method,
 *                      url, headers, body, params, and query. These overrides allow tests
 *                      to simulate specific request scenarios without manually constructing
 *                      the entire request object.
 * @param resOverrides - Optional partial properties to override the default mock response object.
 *                      Supports statusCode, headers, and body overrides to pre-configure
 *                      the response object for specific test scenarios. This enables testing
 *                      of response state and method call verification.
 * 
 * @returns An object containing three properties:
 *          - req: Mock Express.js request object with customizable properties and Jest spy methods
 *          - res: Mock Express.js response object with spy methods for status, send, json, set, end, etc.
 *          - next: Jest spy function to simulate the Express.js next() middleware function
 * 
 * @example
 * // Basic usage with default mock objects
 * const { req, res, next } = mockExpressContext();
 * routeHandler(req, res, next);
 * expect(res.status).toHaveBeenCalledWith(200);
 * expect(res.send).toHaveBeenCalledWith('Hello world');
 * 
 * @example
 * // Usage with request overrides for specific test scenarios
 * const { req, res, next } = mockExpressContext({
 *   method: 'POST',
 *   url: '/hello',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: { message: 'test data' }
 * });
 * 
 * @example
 * // Usage with response overrides for pre-configured response state
 * const { req, res, next } = mockExpressContext(
 *   { url: '/hello' },
 *   { statusCode: 404, headers: { 'Content-Type': 'application/json' } }
 * );
 * 
 * @example
 * // Object destructuring for specific mock components
 * const { req, res } = mockExpressContext();
 * // Use only req and res when next() is not needed
 * 
 * @example
 * // Full middleware testing context
 * const context = mockExpressContext();
 * middlewareFunction(context.req, context.res, context.next);
 * expect(context.next).toHaveBeenCalledTimes(1);
 * expect(context.next).toHaveBeenCalledWith(); // Called without error
 * 
 * @example
 * // Error handling middleware testing
 * const { req, res, next } = mockExpressContext();
 * const testError = new Error('Test error');
 * errorHandlerMiddleware(testError, req, res, next);
 * expect(res.status).toHaveBeenCalledWith(500);
 * expect(next).not.toHaveBeenCalled(); // Error handled, not passed through
 */
export function mockExpressContext(
  reqOverrides: {
    method?: string;
    url?: string;
    headers?: Record<string, string | string[]>;
    body?: any;
    params?: Record<string, string>;
    query?: Record<string, string | string[]>;
  } = {},
  resOverrides: {
    statusCode?: number;
    headers?: Record<string, string>;
    body?: any;
  } = {}
): {
  req: any;
  res: any;
  next: jest.MockedFunction<(err?: any) => void>;
} {
  // Step 1: Create mock Express.js request object using the mockRequest utility
  // This delegates to the focused request mocking utility from mockRequest.ts,
  // ensuring consistency with other tests that use request mocking independently
  const req = mockRequest(reqOverrides);

  // Step 2: Create mock Express.js response object using the mockResponse utility
  // This delegates to the focused response mocking utility from mockResponse.ts,
  // providing all standard Express response methods as Jest spies for assertion
  const res = mockResponse(resOverrides);

  // Step 3: Create mock next() function using the simulateNext utility
  // This provides a Jest spy function that can be used to verify middleware
  // behavior, error propagation, and control flow in Express applications
  const next = simulateNext();

  // Step 4: Return the complete Express.js context as a structured object
  // This object provides the three core parameters required by Express middleware
  // and route handlers, enabling comprehensive testing of Express functionality
  return {
    req,
    res,
    next
  };
}

// Export the mockExpressContext function as the primary interface for this module
// This follows the module pattern established by the other test helper utilities
// and provides a clear, semantic entry point for Express.js context mocking
export default mockExpressContext;