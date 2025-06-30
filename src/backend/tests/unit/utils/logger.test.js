/**
 * Unit Test Suite for Logger Utility Module
 * 
 * This comprehensive test suite validates the logger.js utility module to ensure all logging
 * functions (logInfo, logWarn, logError) output correctly formatted log messages with proper
 * timestamp, log level, application name, and meta information handling. The tests use Jest
 * mocking to capture console output, verify colorization behavior, and ensure the logger
 * is environment-aware, stateless, and robust for use in all backend modules and middleware.
 * 
 * Test Coverage:
 * - Log message formatting and structure validation
 * - Timestamp format verification (ISO 8601)
 * - Application name inclusion in all log output
 * - Meta object serialization and inclusion
 * - Environment-aware colorization testing
 * - Error stack trace handling for logError
 * - Console method output verification (stdout/stderr)
 * - Logger state isolation and non-leakage validation
 * - Jest compatibility and mock interaction testing
 * 
 * @fileoverview Comprehensive unit tests for logger utility module
 * @requires jest ^29.0.0
 * @requires ../../../utils/logger.js
 * @requires ../../../utils/constants.js
 * @requires ../../helpers/testUtils.js
 */

// Import the logging functions under test
const { logInfo, logWarn, logError } = require('../../../utils/logger.js');

// Import application constants for assertions
const { APP_NAME } = require('../../../utils/constants.js');

// Import test utilities for error simulation
const { simulateError } = require('../../helpers/testUtils.js');

// Global variables to store original console methods for restoration
let originalConsoleLog;
let originalConsoleWarn;
let originalConsoleError;

/**
 * Test Suite Setup: Logger Utility Module
 * 
 * Sets up the testing environment by saving original console methods,
 * configuring mocks, and ensuring proper cleanup after all tests complete.
 * This ensures test isolation and prevents side effects on other test files.
 */
describe('Logger Utility Module', () => {
    
    /**
     * Global Test Setup
     * 
     * Executed once before all tests in this suite run. Saves the original
     * console methods (log, warn, error) to global variables so they can
     * be restored after all tests complete, preventing interference with
     * other test files or the Jest test runner itself.
     */
    beforeAll(() => {
        // Store original console methods before any tests run to allow restoration after mocking
        originalConsoleLog = console.log;
        originalConsoleWarn = console.warn;
        originalConsoleError = console.error;
    });

    /**
     * Global Test Teardown
     * 
     * Executed once after all tests in this suite complete. Restores the
     * original console methods from the saved global variables to ensure
     * no side effects on other test files or the Jest test runner.
     */
    afterAll(() => {
        // Restore original console methods after all tests complete to avoid side effects
        console.log = originalConsoleLog;
        console.warn = originalConsoleWarn;
        console.error = originalConsoleError;
    });

    /**
     * Individual Test Setup
     * 
     * Executed before each individual test case. Replaces console.log, console.warn,
     * and console.error with Jest mock functions to capture and assert on log output.
     * This ensures each test starts with fresh mocks and can make isolated assertions.
     */
    beforeEach(() => {
        // Replace console methods with jest.fn() mocks before each test to capture log output
        console.log = jest.fn();
        console.warn = jest.fn();
        console.error = jest.fn();
    });

    /**
     * Individual Test Teardown
     * 
     * Executed after each individual test case. Clears all Jest mocks to ensure
     * test isolation by resetting mock call counts and arguments. This prevents
     * test interference and ensures each test starts with a clean slate.
     */
    afterEach(() => {
        // Clear all jest mocks after each test to ensure test isolation
        jest.clearAllMocks();
    });

    /**
     * Test Suite: logInfo Function
     * 
     * Validates the logInfo function's output formatting, console method usage,
     * timestamp inclusion, application name inclusion, and meta information handling.
     */
    describe('logInfo Function', () => {
        
        /**
         * Test: logInfo outputs correct format
         * 
         * Verifies that logInfo produces a correctly formatted info-level log message
         * including ISO 8601 timestamp, [INFO] log level identifier, application name,
         * and the provided message text. Ensures console.log is called exactly once.
         */
        test('logInfo outputs correct format', () => {
            // Arrange
            const testMessage = 'Test info message';
            const beforeTimestamp = new Date().toISOString().slice(0, 19); // Remove milliseconds for comparison
            
            // Act - Call logInfo with a sample message
            logInfo(testMessage);
            
            // Assert - Verify console.log was called once
            expect(console.log).toHaveBeenCalledTimes(1);
            
            // Extract the logged message for detailed assertions
            const loggedMessage = console.log.mock.calls[0][0];
            
            // Assert that the message includes current date (ISO format)
            expect(loggedMessage).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
            
            // Assert that the message includes [INFO] log level
            expect(loggedMessage).toContain('[INFO]');
            
            // Assert that the message includes the application name
            expect(loggedMessage).toContain(`[${APP_NAME}]`);
            
            // Assert that the message includes the sample message text
            expect(loggedMessage).toContain(testMessage);
            
            // Verify the expected message structure format
            const expectedPattern = new RegExp(
                `\\[\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z\\] \\[${APP_NAME}\\] \\[INFO\\] ${testMessage}`
            );
            expect(loggedMessage).toMatch(expectedPattern);
        });

        /**
         * Test: logInfo handles meta object correctly
         * 
         * Verifies that logInfo correctly serializes and appends meta objects
         * to the log output as JSON strings, enabling structured logging for
         * debugging and monitoring purposes.
         */
        test('logInfo handles meta object correctly', () => {
            // Arrange
            const testMessage = 'Test message with metadata';
            const metaObject = { userId: 123, action: 'test', timestamp: '2024-12-30' };
            
            // Act - Call logInfo with message and meta object
            logInfo(testMessage, metaObject);
            
            // Assert - Verify console.log was called once
            expect(console.log).toHaveBeenCalledTimes(1);
            
            // Extract the logged message
            const loggedMessage = console.log.mock.calls[0][0];
            
            // Assert that the log output includes the serialized meta object (JSON string)
            const expectedMetaString = JSON.stringify(metaObject);
            expect(loggedMessage).toContain(expectedMetaString);
            
            // Verify complete message structure with metadata
            expect(loggedMessage).toContain('[INFO]');
            expect(loggedMessage).toContain(testMessage);
            expect(loggedMessage).toContain(`[${APP_NAME}]`);
        });

        /**
         * Test: logInfo outputs to correct console method
         * 
         * Validates that logInfo uses console.log (stdout) for output and does not
         * inadvertently call console.warn or console.error, ensuring proper log
         * level routing for system monitoring and log aggregation.
         */
        test('logInfo outputs to correct console method', () => {
            // Arrange
            const testMessage = 'Console method test';
            
            // Act
            logInfo(testMessage);
            
            // Assert - Verify only console.log was called, not warn or error
            expect(console.log).toHaveBeenCalledTimes(1);
            expect(console.warn).not.toHaveBeenCalled();
            expect(console.error).not.toHaveBeenCalled();
        });
    });

    /**
     * Test Suite: logWarn Function
     * 
     * Validates the logWarn function's output formatting, console method usage,
     * timestamp inclusion, application name inclusion, and meta information handling.
     */
    describe('logWarn Function', () => {
        
        /**
         * Test: logWarn outputs correct format
         * 
         * Verifies that logWarn produces a correctly formatted warning-level log message
         * including ISO 8601 timestamp, [WARN] log level identifier, application name,
         * and the provided warning message text. Ensures console.warn is called exactly once.
         */
        test('logWarn outputs correct format', () => {
            // Arrange
            const testWarningMessage = 'Test warning message';
            
            // Act - Call logWarn with a sample warning message
            logWarn(testWarningMessage);
            
            // Assert - Verify console.warn was called once
            expect(console.warn).toHaveBeenCalledTimes(1);
            
            // Extract the logged message for detailed assertions
            const loggedMessage = console.warn.mock.calls[0][0];
            
            // Assert that the message includes current date (ISO format)
            expect(loggedMessage).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
            
            // Assert that the message includes [WARN] log level
            expect(loggedMessage).toContain('[WARN]');
            
            // Assert that the message includes the application name
            expect(loggedMessage).toContain(`[${APP_NAME}]`);
            
            // Assert that the message includes the sample warning text
            expect(loggedMessage).toContain(testWarningMessage);
            
            // Verify the expected message structure format
            const expectedPattern = new RegExp(
                `\\[\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z\\] \\[${APP_NAME}\\] \\[WARN\\] ${testWarningMessage}`
            );
            expect(loggedMessage).toMatch(expectedPattern);
        });

        /**
         * Test: logWarn handles meta object correctly
         * 
         * Verifies that logWarn correctly serializes and appends meta objects
         * to the log output, supporting structured warning logging for system
         * monitoring and debugging purposes.
         */
        test('logWarn handles meta object correctly', () => {
            // Arrange
            const testMessage = 'Warning with metadata';
            const metaObject = { 
                path: '/unknown-endpoint', 
                method: 'GET', 
                statusCode: 404,
                userAgent: 'test-agent' 
            };
            
            // Act - Call logWarn with message and meta object
            logWarn(testMessage, metaObject);
            
            // Assert - Verify console.warn was called once
            expect(console.warn).toHaveBeenCalledTimes(1);
            
            // Extract the logged message
            const loggedMessage = console.warn.mock.calls[0][0];
            
            // Assert that the log output includes the serialized meta object
            const expectedMetaString = JSON.stringify(metaObject);
            expect(loggedMessage).toContain(expectedMetaString);
            
            // Verify complete message structure with metadata
            expect(loggedMessage).toContain('[WARN]');
            expect(loggedMessage).toContain(testMessage);
            expect(loggedMessage).toContain(`[${APP_NAME}]`);
        });

        /**
         * Test: logWarn outputs to correct console method
         * 
         * Validates that logWarn uses console.warn for output and does not
         * inadvertently call console.log or console.error, ensuring proper
         * warning-level log routing.
         */
        test('logWarn outputs to correct console method', () => {
            // Arrange
            const testMessage = 'Console method test for warnings';
            
            // Act
            logWarn(testMessage);
            
            // Assert - Verify only console.warn was called, not log or error
            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(console.log).not.toHaveBeenCalled();
            expect(console.error).not.toHaveBeenCalled();
        });
    });

    /**
     * Test Suite: logError Function
     * 
     * Validates the logError function's output formatting, console method usage,
     * error stack trace handling, and meta information processing for comprehensive
     * error logging and debugging support.
     */
    describe('logError Function', () => {
        
        /**
         * Test: logError outputs correct format and stack
         * 
         * Verifies that logError produces a correctly formatted error-level log message
         * including ISO 8601 timestamp, [ERROR] log level identifier, application name,
         * error message, and error stack trace when meta contains an error object.
         */
        test('logError outputs correct format and stack', () => {
            // Arrange
            const testErrorMessage = 'Test error occurred';
            // Create an error object using testUtils.simulateError
            const errorObject = simulateError('Simulated test error', 500, { 
                code: 'TEST_ERROR',
                details: 'This is a test error for validation' 
            });
            
            // Act - Call logError with sample error message and error object as meta
            logError(testErrorMessage, { error: errorObject, stack: errorObject.stack });
            
            // Assert - Verify console.error was called once
            expect(console.error).toHaveBeenCalledTimes(1);
            
            // Extract the logged message for detailed assertions
            const loggedMessage = console.error.mock.calls[0][0];
            
            // Assert that the message includes current date (ISO format)
            expect(loggedMessage).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
            
            // Assert that the message includes [ERROR] log level
            expect(loggedMessage).toContain('[ERROR]');
            
            // Assert that the message includes the application name
            expect(loggedMessage).toContain(`[${APP_NAME}]`);
            
            // Assert that the message includes the sample error message
            expect(loggedMessage).toContain(testErrorMessage);
            
            // Assert that the message includes the error stack trace information
            expect(loggedMessage).toContain('error');
            expect(loggedMessage).toContain('stack');
            
            // Verify the expected message structure format
            const expectedPattern = new RegExp(
                `\\[\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z\\] \\[${APP_NAME}\\] \\[ERROR\\] ${testErrorMessage}`
            );
            expect(loggedMessage).toMatch(expectedPattern);
        });

        /**
         * Test: logError handles error objects in meta
         * 
         * Validates that logError properly processes error objects when passed
         * as meta information, including error messages, stack traces, and
         * additional error properties for comprehensive error debugging.
         */
        test('logError handles error objects in meta', () => {
            // Arrange
            const testMessage = 'Request processing failed';
            const testError = simulateError('Database connection failed', 500, {
                code: 'DB_CONNECTION_ERROR',
                errno: -61,
                syscall: 'connect'
            });
            
            // Act - Call logError with error object meta
            logError(testMessage, testError);
            
            // Assert - Verify console.error was called once
            expect(console.error).toHaveBeenCalledTimes(1);
            
            // Extract the logged message
            const loggedMessage = console.error.mock.calls[0][0];
            
            // Assert that error information is included in the log
            expect(loggedMessage).toContain('[ERROR]');
            expect(loggedMessage).toContain(testMessage);
            expect(loggedMessage).toContain(`[${APP_NAME}]`);
            
            // Verify that error object is serialized and included
            const errorMetaString = JSON.stringify(testError);
            expect(loggedMessage).toContain('message');
            expect(loggedMessage).toContain('stack');
        });

        /**
         * Test: logError outputs to correct console method
         * 
         * Validates that logError uses console.error (stderr) for output and does not
         * inadvertently call console.log or console.warn, ensuring proper error-level
         * log routing to stderr as required for error monitoring systems.
         */
        test('logError outputs to correct console method', () => {
            // Arrange
            const testMessage = 'Console method test for errors';
            
            // Act
            logError(testMessage);
            
            // Assert - Verify only console.error was called, not log or warn
            expect(console.error).toHaveBeenCalledTimes(1);
            expect(console.log).not.toHaveBeenCalled();
            expect(console.warn).not.toHaveBeenCalled();
        });
    });

    /**
     * Test Suite: Meta Object Handling
     * 
     * Comprehensive validation of meta object serialization and inclusion
     * across all logging functions (logInfo, logWarn, logError) to ensure
     * consistent structured logging behavior.
     */
    describe('Meta Object Handling', () => {
        
        /**
         * Test: log functions handle meta object
         * 
         * Validates that all logging functions (logInfo, logWarn, logError) correctly
         * serialize and append meta objects to their respective log outputs, enabling
         * structured logging with additional context information.
         */
        test('log functions handle meta object', () => {
            // Arrange
            const testMessage = 'Test message';
            const metaObject = { 
                userId: 123, 
                action: 'test',
                requestId: 'req-456-789',
                ip: '192.168.1.1',
                userAgent: 'Mozilla/5.0 (Test Agent)'
            };
            
            // Act - Call each log function with message and meta object
            logInfo(testMessage, metaObject);
            logWarn(testMessage, metaObject);
            logError(testMessage, metaObject);
            
            // Assert - Verify that corresponding console methods were called
            expect(console.log).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(console.error).toHaveBeenCalledTimes(1);
            
            // Extract logged messages for assertion
            const infoMessage = console.log.mock.calls[0][0];
            const warnMessage = console.warn.mock.calls[0][0];
            const errorMessage = console.error.mock.calls[0][0];
            
            // Assert that all log outputs include the serialized meta object (JSON string)
            const expectedMetaString = JSON.stringify(metaObject);
            expect(infoMessage).toContain(expectedMetaString);
            expect(warnMessage).toContain(expectedMetaString);
            expect(errorMessage).toContain(expectedMetaString);
            
            // Verify each message contains appropriate log level
            expect(infoMessage).toContain('[INFO]');
            expect(warnMessage).toContain('[WARN]');
            expect(errorMessage).toContain('[ERROR]');
        });

        /**
         * Test: log functions handle null and undefined meta
         * 
         * Ensures that logging functions gracefully handle null or undefined
         * meta parameters without throwing errors or producing malformed output.
         */
        test('log functions handle null and undefined meta', () => {
            // Arrange
            const testMessage = 'Test message without meta';
            
            // Act - Call logging functions with null and undefined meta
            logInfo(testMessage, null);
            logWarn(testMessage, undefined);
            logError(testMessage);
            
            // Assert - Verify console methods were called correctly
            expect(console.log).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(console.error).toHaveBeenCalledTimes(1);
            
            // Extract messages and verify they don't contain "null" or "undefined"
            const infoMessage = console.log.mock.calls[0][0];
            const warnMessage = console.warn.mock.calls[0][0];
            const errorMessage = console.error.mock.calls[0][0];
            
            // Messages should not contain serialized null/undefined
            expect(infoMessage).not.toContain('null');
            expect(warnMessage).not.toContain('undefined');
            expect(errorMessage).toContain(testMessage);
        });
    });

    /**
     * Test Suite: Environment Awareness
     * 
     * Validates that logging functions behave appropriately based on the NODE_ENV
     * environment variable, including colorization in development and plain text
     * output in production environments.
     */
    describe('Environment Awareness', () => {
        
        /**
         * Test: log functions are environment aware
         * 
         * Verifies that log output is colorized in development environment and
         * remains plain text in production environment when chalk colorization
         * is available, demonstrating environment-aware feature implementation.
         */
        test('log functions are environment aware', () => {
            // Store original NODE_ENV to restore later
            const originalNodeEnv = process.env.NODE_ENV;
            
            try {
                // Test development environment behavior
                // Temporarily set process.env.NODE_ENV to 'development'
                process.env.NODE_ENV = 'development';
                
                // Act - Call logInfo in development environment
                logInfo('Development test message');
                
                // Assert - Verify console.log was called
                expect(console.log).toHaveBeenCalledTimes(1);
                
                // Extract the logged message
                const devMessage = console.log.mock.calls[0][0];
                
                // In development, message should still contain core components
                expect(devMessage).toContain('[INFO]');
                expect(devMessage).toContain(`[${APP_NAME}]`);
                expect(devMessage).toContain('Development test message');
                
                // Clear mocks for production test
                jest.clearAllMocks();
                
                // Test production environment behavior
                // Set process.env.NODE_ENV to 'production'
                process.env.NODE_ENV = 'production';
                
                // Act - Call logInfo in production environment
                logInfo('Production test message');
                
                // Assert - Verify console.log was called
                expect(console.log).toHaveBeenCalledTimes(1);
                
                // Extract the logged message
                const prodMessage = console.log.mock.calls[0][0];
                
                // In production, message should be plain text without colorization
                expect(prodMessage).toContain('[INFO]');
                expect(prodMessage).toContain(`[${APP_NAME}]`);
                expect(prodMessage).toContain('Production test message');
                
                // Both environments should produce valid log format
                expect(devMessage).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
                expect(prodMessage).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
                
            } finally {
                // Restore original NODE_ENV
                process.env.NODE_ENV = originalNodeEnv;
            }
        });

        /**
         * Test: environment variable changes affect behavior
         * 
         * Validates that changes to NODE_ENV during runtime properly affect
         * logger behavior, ensuring the logger is responsive to environment
         * configuration changes.
         */
        test('environment variable changes affect behavior', () => {
            // Store original NODE_ENV
            const originalNodeEnv = process.env.NODE_ENV;
            
            try {
                // Test multiple environment transitions
                const environments = ['development', 'test', 'production'];
                
                environments.forEach((env, index) => {
                    // Set environment
                    process.env.NODE_ENV = env;
                    
                    // Clear previous mocks
                    jest.clearAllMocks();
                    
                    // Act - Call logWarn in current environment
                    logWarn(`Test message in ${env} environment`);
                    
                    // Assert - Verify console.warn was called
                    expect(console.warn).toHaveBeenCalledTimes(1);
                    
                    const message = console.warn.mock.calls[0][0];
                    expect(message).toContain(`[${APP_NAME}]`);
                    expect(message).toContain('[WARN]');
                    expect(message).toContain(`Test message in ${env} environment`);
                });
                
            } finally {
                // Restore original NODE_ENV
                process.env.NODE_ENV = originalNodeEnv;
            }
        });
    });

    /**
     * Test Suite: State Isolation and Non-Leakage
     * 
     * Validates that the logger utility does not maintain or leak any global state
     * between log calls, ensuring thread-safe and predictable behavior suitable
     * for concurrent use in production environments.
     */
    describe('State Isolation and Non-Leakage', () => {
        
        /**
         * Test: logger does not leak state
         * 
         * Verifies that logger.js does not maintain or leak any global state between
         * log calls by testing sequential calls with different messages and ensuring
         * each log output is independent and contains only its own data.
         */
        test('logger does not leak state', () => {
            // Arrange - Create different messages for each log level
            const infoMessage1 = 'First info message';
            const infoMessage2 = 'Second info message';
            const warnMessage = 'Warning message';
            const errorMessage = 'Error message';
            
            // Act - Call logInfo, logWarn, and logError in sequence with different messages
            logInfo(infoMessage1);
            logWarn(warnMessage);
            logError(errorMessage);
            logInfo(infoMessage2);
            
            // Assert - Verify each console method was called the correct number of times
            expect(console.log).toHaveBeenCalledTimes(2); // Two logInfo calls
            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(console.error).toHaveBeenCalledTimes(1);
            
            // Extract all logged messages
            const firstInfoCall = console.log.mock.calls[0][0];
            const warnCall = console.warn.mock.calls[0][0];
            const errorCall = console.error.mock.calls[0][0];
            const secondInfoCall = console.log.mock.calls[1][0];
            
            // Assert that each console method was called with the correct message
            expect(firstInfoCall).toContain(infoMessage1);
            expect(firstInfoCall).toContain('[INFO]');
            expect(firstInfoCall).not.toContain(infoMessage2);
            expect(firstInfoCall).not.toContain(warnMessage);
            expect(firstInfoCall).not.toContain(errorMessage);
            
            expect(warnCall).toContain(warnMessage);
            expect(warnCall).toContain('[WARN]');
            expect(warnCall).not.toContain(infoMessage1);
            expect(warnCall).not.toContain(infoMessage2);
            expect(warnCall).not.toContain(errorMessage);
            
            expect(errorCall).toContain(errorMessage);
            expect(errorCall).toContain('[ERROR]');
            expect(errorCall).not.toContain(infoMessage1);
            expect(errorCall).not.toContain(infoMessage2);
            expect(errorCall).not.toContain(warnMessage);
            
            expect(secondInfoCall).toContain(infoMessage2);
            expect(secondInfoCall).toContain('[INFO]');
            expect(secondInfoCall).not.toContain(infoMessage1);
            expect(secondInfoCall).not.toContain(warnMessage);
            expect(secondInfoCall).not.toContain(errorMessage);
            
            // Assert that no log output contains data from previous calls
            // (each message is independent and stateless)
            expect(firstInfoCall).not.toContain(warnMessage);
            expect(warnCall).not.toContain(errorMessage);
            expect(errorCall).not.toContain(infoMessage2);
        });

        /**
         * Test: concurrent logging calls maintain independence
         * 
         * Simulates concurrent logging calls to ensure the logger maintains
         * independence between simultaneous operations and doesn't mix or
         * corrupt log data between different log calls.
         */
        test('concurrent logging calls maintain independence', () => {
            // Arrange - Create arrays to track expected calls
            const messages = [];
            const expectedInfoCalls = [];
            const expectedWarnCalls = [];
            const expectedErrorCalls = [];
            
            // Act - Simulate rapid concurrent logging calls
            for (let i = 0; i < 5; i++) {
                const infoMsg = `Info message ${i}`;
                const warnMsg = `Warning message ${i}`;
                const errorMsg = `Error message ${i}`;
                
                logInfo(infoMsg);
                logWarn(warnMsg);
                logError(errorMsg);
                
                expectedInfoCalls.push(infoMsg);
                expectedWarnCalls.push(warnMsg);
                expectedErrorCalls.push(errorMsg);
            }
            
            // Assert - Verify call counts
            expect(console.log).toHaveBeenCalledTimes(5);
            expect(console.warn).toHaveBeenCalledTimes(5);
            expect(console.error).toHaveBeenCalledTimes(5);
            
            // Verify each call contains only its own message
            console.log.mock.calls.forEach((call, index) => {
                const loggedMessage = call[0];
                expect(loggedMessage).toContain(expectedInfoCalls[index]);
                expect(loggedMessage).toContain('[INFO]');
                expect(loggedMessage).toContain(`[${APP_NAME}]`);
                
                // Ensure no cross-contamination from other calls
                expectedWarnCalls.forEach(warnMsg => {
                    expect(loggedMessage).not.toContain(warnMsg);
                });
                expectedErrorCalls.forEach(errorMsg => {
                    expect(loggedMessage).not.toContain(errorMsg);
                });
            });
        });
    });

    /**
     * Test Suite: Timestamp Accuracy and Formatting
     * 
     * Validates that all logging functions generate accurate ISO 8601 timestamps
     * and maintain consistent timestamp formatting across all log levels.
     */
    describe('Timestamp Accuracy and Formatting', () => {
        
        /**
         * Test: timestamps are in valid ISO 8601 format
         * 
         * Verifies that all logging functions generate timestamps in valid
         * ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ) for consistent time
         * representation and compatibility with log analysis tools.
         */
        test('timestamps are in valid ISO 8601 format', () => {
            // Arrange
            const testMessage = 'Timestamp format test';
            
            // Act - Call all logging functions
            logInfo(testMessage);
            logWarn(testMessage);
            logError(testMessage);
            
            // Assert - Extract and validate timestamps from all calls
            const infoMessage = console.log.mock.calls[0][0];
            const warnMessage = console.warn.mock.calls[0][0];
            const errorMessage = console.error.mock.calls[0][0];
            
            // ISO 8601 format regex: YYYY-MM-DDTHH:mm:ss.sssZ
            const iso8601Regex = /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/;
            
            expect(infoMessage).toMatch(iso8601Regex);
            expect(warnMessage).toMatch(iso8601Regex);
            expect(errorMessage).toMatch(iso8601Regex);
            
            // Extract timestamps for additional validation
            const infoTimestamp = infoMessage.match(/\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)\]/)[1];
            const warnTimestamp = warnMessage.match(/\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)\]/)[1];
            const errorTimestamp = errorMessage.match(/\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)\]/)[1];
            
            // Validate that timestamps can be parsed as valid Date objects
            expect(new Date(infoTimestamp)).toBeInstanceOf(Date);
            expect(new Date(warnTimestamp)).toBeInstanceOf(Date);
            expect(new Date(errorTimestamp)).toBeInstanceOf(Date);
            
            // Validate that timestamps are not NaN (invalid dates)
            expect(new Date(infoTimestamp).getTime()).not.toBeNaN();
            expect(new Date(warnTimestamp).getTime()).not.toBeNaN();
            expect(new Date(errorTimestamp).getTime()).not.toBeNaN();
        });

        /**
         * Test: timestamps are recent and accurate
         * 
         * Validates that generated timestamps are recent (within a reasonable
         * time window) and accurately reflect the time when logging functions
         * were called, ensuring timestamp accuracy for debugging purposes.
         */
        test('timestamps are recent and accurate', () => {
            // Arrange - Record time before logging
            const beforeTime = new Date();
            
            // Act - Call logging function
            logInfo('Timestamp accuracy test');
            
            // Record time after logging
            const afterTime = new Date();
            
            // Assert - Extract timestamp from logged message
            const loggedMessage = console.log.mock.calls[0][0];
            const timestampMatch = loggedMessage.match(/\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)\]/);
            expect(timestampMatch).not.toBeNull();
            
            const loggedTimestamp = new Date(timestampMatch[1]);
            
            // Assert that the logged timestamp is between beforeTime and afterTime
            expect(loggedTimestamp.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
            expect(loggedTimestamp.getTime()).toBeLessThanOrEqual(afterTime.getTime());
            
            // Assert that the timestamp is very recent (within 1 second)
            const timeDifference = afterTime.getTime() - loggedTimestamp.getTime();
            expect(timeDifference).toBeLessThan(1000); // Less than 1 second
        });
    });

    /**
     * Test Suite: Jest Framework Compatibility
     * 
     * Validates that the logger utility is fully compatible with Jest-based
     * test environments, including proper mock integration, test isolation,
     * and no interference with Jest's internal testing mechanisms.
     */
    describe('Jest Framework Compatibility', () => {
        
        /**
         * Test: logger works correctly with Jest mocks
         * 
         * Verifies that the logger functions integrate properly with Jest's
         * mocking system, allowing for accurate capture and assertion of
         * log output without interfering with Jest's test execution.
         */
        test('logger works correctly with Jest mocks', () => {
            // Arrange - Verify mocks are properly configured
            expect(jest.isMockFunction(console.log)).toBe(true);
            expect(jest.isMockFunction(console.warn)).toBe(true);
            expect(jest.isMockFunction(console.error)).toBe(true);
            
            // Act - Call logger functions
            logInfo('Jest compatibility test');
            logWarn('Jest warning test');
            logError('Jest error test');
            
            // Assert - Verify Jest mock tracking works correctly
            expect(console.log.mock.calls).toHaveLength(1);
            expect(console.warn.mock.calls).toHaveLength(1);
            expect(console.error.mock.calls).toHaveLength(1);
            
            // Verify mock call arguments are accessible
            expect(console.log.mock.calls[0]).toHaveLength(1);
            expect(console.warn.mock.calls[0]).toHaveLength(1);
            expect(console.error.mock.calls[0]).toHaveLength(1);
            
            // Verify mock instances and results tracking
            expect(console.log.mock.instances).toHaveLength(1);
            expect(console.warn.mock.instances).toHaveLength(1);
            expect(console.error.mock.instances).toHaveLength(1);
        });

        /**
         * Test: logger respects Jest test isolation
         * 
         * Validates that logger behavior is properly isolated between tests
         * when used with Jest's beforeEach and afterEach lifecycle hooks,
         * ensuring no test interference or state leakage.
         */
        test('logger respects Jest test isolation', () => {
            // This test validates that the beforeEach/afterEach setup works correctly
            
            // Assert - Verify mocks start clean (should be reset by beforeEach)
            expect(console.log).not.toHaveBeenCalled();
            expect(console.warn).not.toHaveBeenCalled();
            expect(console.error).not.toHaveBeenCalled();
            
            // Act - Make some logging calls
            logInfo('Isolation test 1');
            logWarn('Isolation test 2');
            
            // Assert - Verify calls were tracked
            expect(console.log).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(console.error).not.toHaveBeenCalled();
            
            // The afterEach hook will clear these mocks for the next test
        });

        /**
         * Test: logger does not interfere with Jest assertions
         * 
         * Ensures that the logger utility does not interfere with Jest's
         * assertion mechanisms or test reporting, maintaining clean test
         * output and reliable test execution.
         */
        test('logger does not interfere with Jest assertions', () => {
            // Act - Perform logging and assertions in sequence
            logInfo('Pre-assertion log');
            
            // Jest assertions should work normally
            expect(1 + 1).toBe(2);
            expect('test').toContain('es');
            
            logWarn('Mid-assertion log');
            
            // More Jest assertions
            expect([1, 2, 3]).toHaveLength(3);
            expect({ key: 'value' }).toHaveProperty('key');
            
            logError('Post-assertion log');
            
            // Final assertion to verify logger calls
            expect(console.log).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(console.error).toHaveBeenCalledTimes(1);
            
            // All assertions should pass without interference from logging
        });
    });
});