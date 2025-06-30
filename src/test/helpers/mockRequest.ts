// Import the core test utility function for creating mock Express request objects
import { createMockRequest } from './testUtils';

/**
 * Factory function to create a mock Express.js request object for use in tests.
 * 
 * This is a focused utility specifically designed for test scenarios that require only
 * a mock Express request object (not the full Express context with app, response, etc.).
 * It provides a semantic wrapper around the core createMockRequest utility to enhance
 * code clarity and maintainability across the test suite.
 * 
 * The mock request object includes all standard Express.js request properties and methods,
 * with sensible defaults that can be overridden as needed for specific test scenarios.
 * This approach supports DRY (Don't Repeat Yourself) principles and ensures consistency
 * across all test files that require request mocking.
 * 
 * @param overrides - Optional partial properties to override the default mock request shape
 * @param overrides.method - HTTP method (defaults to 'GET' if not specified)
 * @param overrides.url - Request URL path (defaults to '/' if not specified)
 * @param overrides.headers - Request headers object for simulating client headers
 * @param overrides.body - Request body data for testing POST/PUT/PATCH scenarios
 * @param overrides.params - Route parameters object for testing parameterized routes
 * @param overrides.query - Query string parameters object for testing query handling
 * 
 * @returns A mock Express.js request object with the specified properties, suitable for
 *          passing to route handlers, middleware functions, or any code that expects
 *          an Express request object. All Express request methods are mocked with Jest
 *          spy functions to enable assertion and verification in tests.
 * 
 * @example
 * // Basic usage with defaults (GET request to '/')
 * const req = mockRequest();
 * 
 * @example
 * // Override specific properties for targeted testing
 * const req = mockRequest({
 *   method: 'POST',
 *   url: '/hello',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: { message: 'test data' }
 * });
 * 
 * @example
 * // Test route parameters and query strings
 * const req = mockRequest({
 *   url: '/users/123?active=true',
 *   params: { id: '123' },
 *   query: { active: 'true' }
 * });
 */
export function mockRequest(overrides: {
  method?: string;
  url?: string;
  headers?: Record<string, string | string[]>;
  body?: any;
  params?: Record<string, string>;
  query?: Record<string, string | string[]>;
} = {}): any {
  // Delegate to the core createMockRequest utility function
  // This maintains a single point of implementation for request mocking logic
  // while providing a semantic alias for educational clarity and focused usage
  return createMockRequest(overrides);
}

// Export the mockRequest function as the primary interface for this module
// This supports both named imports and direct function usage patterns
export default mockRequest;