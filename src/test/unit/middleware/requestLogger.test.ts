/**
 * Unit Test Suite for Request Logger Middleware
 * 
 * This comprehensive test suite validates the requestLogger Express.js middleware
 * functionality, ensuring proper HTTP request logging with method, path, status,
 * and response time information. The tests verify that the middleware fulfills
 * educational, observability, and maintainability requirements as specified in
 * the Technical Specifications section 6.6 TESTING STRATEGY.
 * 
 * Testing Strategy:
 * - Uses Jest as the testing framework (v29.0.0) for comprehensive testing capabilities
 * - Employs mockExpressContext for DRY Express.js request/response/next simulation
 * - Implements spy functions for logInfo to assert correct logging behavior
 * - Tests both successful and error scenarios for complete coverage
 * - Validates middleware behavior against edge cases and error conditions
 * - Ensures educational clarity through descriptive test names and assertions
 * 
 * Coverage Areas:
 * - Successful request logging with proper metadata
 * - Error status code handling and logging
 * - Edge cases with missing or custom properties
 * - Middleware chain continuation via next() calls
 * - Response time measurement validation
 * - Error resilience and graceful degradation
 * 
 * Educational Value:
 * This test suite demonstrates best practices for Express.js middleware testing,
 * including proper mocking, spying, and assertion patterns. It serves as a
 * reference implementation for testing HTTP middleware in Node.js applications.
 * 
 * @fileoverview Unit tests for requestLogger Express middleware
 * @version 1.0.0
 */

// Import the requestLogger middleware function under test
// This is the primary subject being tested - the middleware that logs HTTP requests
import { requestLogger } from '../../../backend/middleware/requestLogger.js';

// Import the logInfo function to spy on logging behavior
// This allows us to verify that the middleware calls the logger with correct parameters
import { logInfo } from '../../../backend/utils/logger.js';

// Import the composite Express context mock factory
// This provides req, res, and next objects for middleware testing
import { mockExpressContext } from '../../helpers/mockExpress';

// Import additional test utilities for comprehensive testing scenarios
// These support edge cases and error simulation
import { assertResponse, simulateError } from '../../helpers/testUtils';

// Jest testing framework - v29.0.0
// Global Jest functions are available without explicit import

/**
 * Main test suite for the requestLogger middleware
 * 
 * This describe block contains all unit tests for request logging behavior,
 * log output verification, and next() invocation patterns. The tests are
 * organized to cover normal operation, error conditions, and edge cases
 * to ensure comprehensive middleware validation.
 */
describe('requestLogger middleware', () => {
    
    /**
     * Test Environment Setup and Cleanup
     * 
     * Before each test, reset all mocks and spies to ensure test isolation
     * and prevent interference between test cases. This is critical for
     * reliable test execution and accurate assertion verification.
     */
    beforeEach(() => {
        // Clear all Jest mocks and spies to ensure clean test state
        // This prevents test pollution and ensures each test starts fresh
        jest.clearAllMocks();
        
        // Reset any module-level state or cached values
        // Important for middleware that may have internal state
        jest.resetModules();
    });
    
    /**
     * Cleanup after each test to prevent memory leaks and resource conflicts
     * Restore any system-level mocks or timers that may have been modified
     */
    afterEach(() => {
        // Restore any mocked system functions to their original implementations
        jest.restoreAllMocks();
    });

    /**
     * Test: Should log method, url, status, and response time for a successful request
     * 
     * This test validates the core functionality of the requestLogger middleware
     * by simulating a successful HTTP GET request and verifying that all required
     * request details are logged correctly with proper formatting and metadata.
     * 
     * Success Criteria:
     * - logInfo is called exactly once with formatted message
     * - Log message contains method, URL, status code, and response time
     * - Response time is a positive number with 'ms' suffix
     * - Metadata object contains structured request information
     * - next() is called to continue middleware chain
     */
    it('should log method, url, status, and response time for a successful request', async () => {
        // Arrange: Set up test data and expectations
        const testMethod = 'GET';
        const testUrl = '/hello';
        const testStatus = 200;
        
        // Create mock Express context with specific request properties
        const { req, res, next } = mockExpressContext({
            method: testMethod,
            url: testUrl
        });
        
        // Pre-configure response status code for successful request
        res.statusCode = testStatus;
        
        // Create spy on logInfo to capture logging calls
        const logInfoSpy = jest.spyOn({ logInfo }, 'logInfo');
        
        // Act: Execute the requestLogger middleware
        requestLogger(req, res, next);
        
        // Simulate the response 'finish' event to trigger logging
        // This mimics the natural Express.js response lifecycle
        const finishCallback = res.on.mock.calls.find(
            (call: any[]) => call[0] === 'finish'
        )[1];
        finishCallback();
        
        // Assert: Verify logging behavior and middleware continuation
        
        // Verify logInfo was called exactly once
        expect(logInfoSpy).toHaveBeenCalledTimes(1);
        
        // Extract the call arguments for detailed verification
        const [logMessage, logMetadata] = logInfoSpy.mock.calls[0];
        
        // Verify log message format contains all required elements
        expect(logMessage).toMatch(/^\[GET\] \/hello 200 \d+ms$/);
        expect(logMessage).toContain('[GET]');
        expect(logMessage).toContain('/hello');
        expect(logMessage).toContain('200');
        expect(logMessage).toMatch(/\d+ms$/); // Response time with 'ms' suffix
        
        // Verify structured metadata contains correct properties
        expect(logMetadata).toEqual({
            method: testMethod,
            url: testUrl,
            status: testStatus,
            responseTime: expect.any(Number)
        });
        
        // Verify response time is a positive number
        expect(logMetadata.responseTime).toBeGreaterThan(0);
        expect(typeof logMetadata.responseTime).toBe('number');
        
        // Verify next() was called to continue middleware chain
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(); // Called without error
        
        // Verify response event listener was attached
        expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
    });

    /**
     * Test: Should log correct status for error responses
     * 
     * This test ensures that the middleware correctly handles and logs error
     * status codes (4xx and 5xx) with appropriate formatting and metadata.
     * This is critical for debugging and monitoring error conditions.
     */
    it('should log correct status for error responses', async () => {
        // Arrange: Set up error response scenario
        const errorStatus = 500;
        const testMethod = 'POST';
        const testUrl = '/hello';
        
        // Create mock context for error scenario
        const { req, res, next } = mockExpressContext({
            method: testMethod,
            url: testUrl
        });
        
        // Configure response for server error
        res.statusCode = errorStatus;
        
        const logInfoSpy = jest.spyOn({ logInfo }, 'logInfo');
        
        // Act: Execute middleware and trigger finish event
        requestLogger(req, res, next);
        
        const finishCallback = res.on.mock.calls.find(
            (call: any[]) => call[0] === 'finish'
        )[1];
        finishCallback();
        
        // Assert: Verify error status is logged correctly
        expect(logInfoSpy).toHaveBeenCalledTimes(1);
        
        const [logMessage, logMetadata] = logInfoSpy.mock.calls[0];
        
        // Verify error status appears in log message
        expect(logMessage).toContain('500');
        expect(logMessage).toMatch(/^\[POST\] \/hello 500 \d+ms$/);
        
        // Verify metadata contains error status
        expect(logMetadata.status).toBe(errorStatus);
        expect(logMetadata.method).toBe(testMethod);
        expect(logMetadata.url).toBe(testUrl);
        
        // Verify middleware chain continues even for errors
        expect(next).toHaveBeenCalledTimes(1);
    });

    /**
     * Test: Should handle missing or custom properties gracefully
     * 
     * This test validates the middleware's robustness when dealing with
     * edge cases such as missing URL, method, or status code properties.
     * The middleware should provide sensible defaults and continue functioning.
     */
    it('should handle missing or custom properties gracefully', async () => {
        // Arrange: Create request with minimal properties
        const { req, res, next } = mockExpressContext({
            // Intentionally omit method and url to test defaults
        });
        
        // Test scenario where originalUrl is available but url is not
        req.originalUrl = '/custom-path';
        req.url = undefined;
        req.method = undefined;
        res.statusCode = undefined;
        
        const logInfoSpy = jest.spyOn({ logInfo }, 'logInfo');
        
        // Act: Execute middleware with incomplete request data
        requestLogger(req, res, next);
        
        const finishCallback = res.on.mock.calls.find(
            (call: any[]) => call[0] === 'finish'
        )[1];
        finishCallback();
        
        // Assert: Verify graceful handling of missing properties
        expect(logInfoSpy).toHaveBeenCalledTimes(1);
        
        const [logMessage, logMetadata] = logInfoSpy.mock.calls[0];
        
        // Verify default values are used for missing properties
        expect(logMessage).toContain('UNKNOWN'); // Default method
        expect(logMessage).toContain('/custom-path'); // originalUrl used
        expect(logMessage).toContain('0'); // Default status
        
        // Verify metadata uses appropriate defaults
        expect(logMetadata.method).toBe('UNKNOWN');
        expect(logMetadata.url).toBe('/custom-path');
        expect(logMetadata.status).toBe(0);
        expect(logMetadata.responseTime).toBeGreaterThan(0);
        
        // Ensure middleware chain continues despite missing properties
        expect(next).toHaveBeenCalledTimes(1);
    });

    /**
     * Test: Should always call next() to continue middleware chain
     * 
     * This test ensures that the requestLogger middleware always passes control
     * to the next middleware in the chain, regardless of logging success or failure.
     * This is critical for maintaining proper Express.js middleware flow.
     */
    it('should always call next() to continue middleware chain', () => {
        // Arrange: Create standard mock context
        const { req, res, next } = mockExpressContext({
            method: 'GET',
            url: '/test'
        });
        
        // Act: Execute the middleware
        requestLogger(req, res, next);
        
        // Assert: Verify next() is called immediately
        // The middleware should not wait for the response to finish
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(); // No error passed
        
        // Verify the middleware sets up event listener but doesn't block
        expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
    });

    /**
     * Test: Should log even if downstream middleware throws
     * 
     * This test validates that the request logging continues to function
     * even when subsequent middleware or error conditions occur. The
     * logging should be resilient and capture request information regardless
     * of downstream failures.
     */
    it('should log even if downstream middleware throws', async () => {
        // Arrange: Set up scenario where downstream processing fails
        const { req, res, next } = mockExpressContext({
            method: 'GET',
            url: '/error-test'
        });
        
        res.statusCode = 500; // Simulate error status from downstream
        
        const logInfoSpy = jest.spyOn({ logInfo }, 'logInfo');
        
        // Act: Execute middleware and simulate error scenario
        requestLogger(req, res, next);
        
        // Simulate downstream error by triggering finish event with error status
        const finishCallback = res.on.mock.calls.find(
            (call: any[]) => call[0] === 'finish'
        )[1];
        finishCallback();
        
        // Assert: Verify logging occurs despite downstream errors
        expect(logInfoSpy).toHaveBeenCalledTimes(1);
        
        const [logMessage, logMetadata] = logInfoSpy.mock.calls[0];
        
        // Verify error scenario is logged correctly
        expect(logMessage).toContain('500');
        expect(logMessage).toContain('/error-test');
        expect(logMetadata.status).toBe(500);
        
        // Verify middleware chain continuation
        expect(next).toHaveBeenCalledTimes(1);
    });

    /**
     * Test: Should log response time as a positive number
     * 
     * This test specifically validates the response time measurement functionality,
     * ensuring that the middleware accurately calculates and logs response times
     * as positive numbers with appropriate precision.
     */
    it('should log response time as a positive number', async () => {
        // Arrange: Set up timing test scenario
        const { req, res, next } = mockExpressContext({
            method: 'GET',
            url: '/timing-test'
        });
        
        res.statusCode = 200;
        const logInfoSpy = jest.spyOn({ logInfo }, 'logInfo');
        
        // Act: Execute middleware with controlled timing
        const startTime = Date.now();
        requestLogger(req, res, next);
        
        // Simulate some processing time before response finishes
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const finishCallback = res.on.mock.calls.find(
            (call: any[]) => call[0] === 'finish'
        )[1];
        finishCallback();
        
        const endTime = Date.now();
        
        // Assert: Verify response time characteristics
        expect(logInfoSpy).toHaveBeenCalledTimes(1);
        
        const [logMessage, logMetadata] = logInfoSpy.mock.calls[0];
        
        // Verify response time is a positive number
        expect(logMetadata.responseTime).toBeGreaterThan(0);
        expect(typeof logMetadata.responseTime).toBe('number');
        expect(Number.isInteger(logMetadata.responseTime)).toBe(true);
        
        // Verify response time is reasonable (should be at least 10ms due to setTimeout)
        expect(logMetadata.responseTime).toBeGreaterThanOrEqual(10);
        
        // Verify log message format includes response time with 'ms' suffix
        expect(logMessage).toMatch(/\d+ms$/);
        
        // Extract response time from log message for additional validation
        const responseTimeMatch = logMessage.match(/(\d+)ms$/);
        expect(responseTimeMatch).toBeTruthy();
        if (responseTimeMatch) {
            const loggedResponseTime = parseInt(responseTimeMatch[1], 10);
            expect(loggedResponseTime).toBe(logMetadata.responseTime);
        }
    });

    /**
     * Test: Should handle logging errors gracefully
     * 
     * This test ensures that if the logging system itself fails, the middleware
     * continues to function and doesn't disrupt the request/response cycle.
     * This demonstrates error resilience and graceful degradation.
     */
    it('should handle logging errors gracefully', async () => {
        // Arrange: Set up scenario where logging fails
        const { req, res, next } = mockExpressContext({
            method: 'GET',
            url: '/logging-error-test'
        });
        
        res.statusCode = 200;
        
        // Mock logInfo to throw an error
        const logInfoSpy = jest.spyOn({ logInfo }, 'logInfo')
            .mockImplementation(() => {
                throw new Error('Logging system failure');
            });
        
        // Spy on console.log to verify fallback logging
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        
        // Act: Execute middleware when logging system fails
        requestLogger(req, res, next);
        
        const finishCallback = res.on.mock.calls.find(
            (call: any[]) => call[0] === 'finish'
        )[1];
        
        // Execute the finish callback and verify no error is thrown
        expect(() => finishCallback()).not.toThrow();
        
        // Assert: Verify graceful error handling
        
        // Verify the logging system was called and failed
        expect(logInfoSpy).toHaveBeenCalledTimes(1);
        
        // Verify fallback console logging was used
        expect(consoleSpy).toHaveBeenCalledTimes(1);
        
        // Verify fallback log contains request information
        const fallbackLog = consoleSpy.mock.calls[0][0];
        expect(fallbackLog).toContain('[GET]');
        expect(fallbackLog).toContain('/logging-error-test');
        expect(fallbackLog).toContain('200');
        expect(fallbackLog).toContain('[LOG_ERROR]');
        
        // Verify middleware chain continues despite logging failure
        expect(next).toHaveBeenCalledTimes(1);
        
        // Cleanup
        consoleSpy.mockRestore();
    });

    /**
     * Test: Should prefer originalUrl over url when both are available
     * 
     * This test validates that the middleware correctly prioritizes originalUrl
     * over url for logging, which is important for proxied requests and
     * applications using URL rewriting.
     */
    it('should prefer originalUrl over url when both are available', async () => {
        // Arrange: Set up request with both url and originalUrl
        const { req, res, next } = mockExpressContext();
        
        // Set both url and originalUrl with different values
        req.url = '/rewritten-path';
        req.originalUrl = '/original-path?param=value';
        req.method = 'GET';
        res.statusCode = 200;
        
        const logInfoSpy = jest.spyOn({ logInfo }, 'logInfo');
        
        // Act: Execute middleware
        requestLogger(req, res, next);
        
        const finishCallback = res.on.mock.calls.find(
            (call: any[]) => call[0] === 'finish'
        )[1];
        finishCallback();
        
        // Assert: Verify originalUrl is used in logging
        expect(logInfoSpy).toHaveBeenCalledTimes(1);
        
        const [logMessage, logMetadata] = logInfoSpy.mock.calls[0];
        
        // Verify originalUrl is used instead of url
        expect(logMessage).toContain('/original-path?param=value');
        expect(logMessage).not.toContain('/rewritten-path');
        expect(logMetadata.url).toBe('/original-path?param=value');
    });

    /**
     * Test: Should handle various HTTP methods correctly
     * 
     * This test validates that the middleware correctly logs different HTTP
     * methods (GET, POST, PUT, DELETE, PATCH) with proper formatting.
     */
    it('should handle various HTTP methods correctly', async () => {
        // Test data for different HTTP methods
        const testMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];
        
        const logInfoSpy = jest.spyOn({ logInfo }, 'logInfo');
        
        // Test each HTTP method
        for (const method of testMethods) {
            // Arrange: Create context for each method
            const { req, res, next } = mockExpressContext({
                method,
                url: `/test-${method.toLowerCase()}`
            });
            
            res.statusCode = 200;
            
            // Act: Execute middleware
            requestLogger(req, res, next);
            
            const finishCallback = res.on.mock.calls.find(
                (call: any[]) => call[0] === 'finish'
            )[1];
            finishCallback();
        }
        
        // Assert: Verify all methods were logged correctly
        expect(logInfoSpy).toHaveBeenCalledTimes(testMethods.length);
        
        // Verify each method appears in the logs
        testMethods.forEach((method, index) => {
            const [logMessage, logMetadata] = logInfoSpy.mock.calls[index];
            expect(logMessage).toContain(`[${method}]`);
            expect(logMetadata.method).toBe(method);
            expect(logMetadata.url).toBe(`/test-${method.toLowerCase()}`);
        });
    });

    /**
     * Test: Should handle concurrent requests independently
     * 
     * This test ensures that the middleware correctly handles multiple
     * concurrent requests without interference or shared state issues.
     */
    it('should handle concurrent requests independently', async () => {
        // Arrange: Create multiple concurrent request contexts
        const requests = [
            { method: 'GET', url: '/concurrent-1' },
            { method: 'POST', url: '/concurrent-2' },
            { method: 'PUT', url: '/concurrent-3' }
        ];
        
        const logInfoSpy = jest.spyOn({ logInfo }, 'logInfo');
        const contexts = requests.map(req => mockExpressContext(req));
        
        // Set different status codes for each request
        contexts.forEach((context, index) => {
            context.res.statusCode = 200 + index;
        });
        
        // Act: Execute all middleware concurrently
        contexts.forEach(({ req, res, next }) => {
            requestLogger(req, res, next);
        });
        
        // Trigger finish events for all requests
        contexts.forEach(({ res }) => {
            const finishCallback = res.on.mock.calls.find(
                (call: any[]) => call[0] === 'finish'
            )[1];
            finishCallback();
        });
        
        // Assert: Verify independent logging for each request
        expect(logInfoSpy).toHaveBeenCalledTimes(3);
        
        // Verify each request was logged with correct details
        requests.forEach((request, index) => {
            const [logMessage, logMetadata] = logInfoSpy.mock.calls[index];
            expect(logMessage).toContain(`[${request.method}]`);
            expect(logMessage).toContain(request.url);
            expect(logMessage).toContain(`${200 + index}`);
            expect(logMetadata.method).toBe(request.method);
            expect(logMetadata.url).toBe(request.url);
            expect(logMetadata.status).toBe(200 + index);
        });
        
        // Verify all next() functions were called
        contexts.forEach(({ next }) => {
            expect(next).toHaveBeenCalledTimes(1);
        });
    });
});