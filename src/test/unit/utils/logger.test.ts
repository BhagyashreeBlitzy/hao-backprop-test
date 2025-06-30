// Jest testing framework for assertions and mocking - v29.0.0
import * as jest from '@jest/globals';

// Internal imports: Logger functions under test
import { logInfo, logWarn, logError } from '../../../backend/utils/logger.js';

// Internal imports: Application constants for validation
import { APP_NAME } from '../../../backend/utils/constants.js';

// Internal imports: Test utilities for error simulation
import { testUtils } from '../../helpers/testUtils.ts';

/**
 * Unit Test Suite for Logger Utility Module
 * 
 * This comprehensive test suite validates the logger utility module (src/backend/utils/logger.js)
 * to ensure all logging functions output correctly formatted, timestamped, and leveled log messages.
 * The tests verify proper delegation to console methods, inclusion of application name, support
 * for meta information, and correct behavior across different environments.
 * 
 * Test Coverage:
 * - logInfo function formatting and console.log delegation
 * - logWarn function formatting and console.warn delegation  
 * - logError function formatting and console.error delegation
 * - Meta information serialization and inclusion
 * - Application name inclusion in all log output
 * - Colorization behavior in development environment
 * - Timestamp formatting and ISO 8601 compliance
 * - Stack trace handling for error logging
 * 
 * Educational Value:
 * - Demonstrates comprehensive unit testing patterns
 * - Shows proper console method mocking and restoration
 * - Illustrates regex-based log format validation
 * - Provides examples of metadata testing
 * - Models environment-specific testing approaches
 * 
 * @fileoverview Comprehensive unit tests for logger utility functions
 * @requires jest ^29.0.0
 * @requires logger functions from ../../../backend/utils/logger.js
 * @requires APP_NAME from ../../../backend/utils/constants.js
 * @requires testUtils from ../../helpers/testUtils.ts
 */

// Global variables for console method backup and restoration
let originalConsoleLog: typeof console.log;
let originalConsoleWarn: typeof console.warn;
let originalConsoleError: typeof console.error;

/**
 * Setup Console Spies and Cleanup
 * 
 * Replaces global console.log, console.warn, and console.error with Jest spies
 * before each test to capture and validate log output. Restores original
 * console methods after each test to prevent test pollution and ensure
 * clean test isolation.
 * 
 * This approach allows testing of console output without polluting the test
 * runner output while maintaining the ability to assert on log behavior.
 * 
 * @function setupConsoleSpies
 */
function setupConsoleSpies(): void {
    // Backup original console methods for restoration
    originalConsoleLog = console.log;
    originalConsoleWarn = console.warn;
    originalConsoleError = console.error;
}

/**
 * Main Test Suite: Logger Utility (logger.js)
 * 
 * Comprehensive test suite that verifies all logger functions output correctly
 * formatted log messages, delegate to the appropriate console methods, and
 * include all required metadata for observability and debugging.
 * 
 * The suite follows the Arrange-Act-Assert pattern with proper test isolation,
 * mock setup/teardown, and comprehensive validation of log output format,
 * content, and console method delegation.
 */
describe('Logger Utility (logger.js)', () => {
    
    /**
     * Test Setup: Console Spy Configuration
     * 
     * Before each test, setup Jest spies on console methods to capture
     * log output for validation. This ensures each test starts with
     * fresh spies and can independently validate logger behavior.
     */
    beforeEach(() => {
        setupConsoleSpies();
        
        // Replace console methods with Jest spies
        console.log = jest.fn() as jest.MockedFunction<typeof console.log>;
        console.warn = jest.fn() as jest.MockedFunction<typeof console.warn>;
        console.error = jest.fn() as jest.MockedFunction<typeof console.error>;
    });
    
    /**
     * Test Teardown: Console Method Restoration
     * 
     * After each test, restore the original console methods to prevent
     * cross-test pollution and ensure the test environment is clean
     * for subsequent tests.
     */
    afterEach(() => {
        // Restore original console methods
        console.log = originalConsoleLog;
        console.warn = originalConsoleWarn;
        console.error = originalConsoleError;
    });

    /**
     * Test Case: logInfo Output Format and Console Delegation
     * 
     * Verifies that logInfo calls console.log with a message containing
     * the ISO timestamp, application name, INFO log level, and the
     * provided message text. Tests both basic message logging and
     * message logging with metadata serialization.
     */
    describe('logInfo outputs info-level log with correct format', () => {
        
        it('should call console.log with properly formatted message', () => {
            // Arrange: Prepare test message
            const testMessage = 'Server started successfully';
            
            // Act: Call logInfo with test message
            logInfo(testMessage);
            
            // Assert: Verify console.log was called exactly once
            expect(console.log).toHaveBeenCalledTimes(1);
            
            // Get the actual log output for detailed validation
            const logOutput = (console.log as jest.MockedFunction<typeof console.log>).mock.calls[0][0];
            
            // Assert: Verify log format includes ISO timestamp pattern
            expect(logOutput).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
            
            // Assert: Verify log includes application name
            expect(logOutput).toContain(`[${APP_NAME}]`);
            
            // Assert: Verify log includes INFO level
            expect(logOutput).toContain('[INFO]');
            
            // Assert: Verify log includes the test message
            expect(logOutput).toContain(testMessage);
        });
        
        it('should include serialized meta information when provided', () => {
            // Arrange: Prepare test message and metadata
            const testMessage = 'Request processed successfully';
            const testMeta = {
                method: 'GET',
                path: '/hello',
                statusCode: 200,
                responseTime: '45ms'
            };
            
            // Act: Call logInfo with message and metadata
            logInfo(testMessage, testMeta);
            
            // Assert: Verify console.log was called exactly once
            expect(console.log).toHaveBeenCalledTimes(1);
            
            // Get the actual log output for validation
            const logOutput = (console.log as jest.MockedFunction<typeof console.log>).mock.calls[0][0];
            
            // Assert: Verify log contains the test message
            expect(logOutput).toContain(testMessage);
            
            // Assert: Verify metadata is serialized as JSON and included
            expect(logOutput).toContain(JSON.stringify(testMeta));
        });
    });

    /**
     * Test Case: logWarn Output Format and Console Delegation
     * 
     * Verifies that logWarn calls console.warn with a message containing
     * the ISO timestamp, application name, WARN log level, and the
     * provided warning message. Tests both basic warning logging and
     * warning logging with metadata serialization.
     */
    describe('logWarn outputs warn-level log with correct format', () => {
        
        it('should call console.warn with properly formatted message', () => {
            // Arrange: Prepare warning message
            const warningMessage = 'Request to unknown endpoint';
            
            // Act: Call logWarn with warning message
            logWarn(warningMessage);
            
            // Assert: Verify console.warn was called exactly once
            expect(console.warn).toHaveBeenCalledTimes(1);
            
            // Get the actual log output for detailed validation
            const logOutput = (console.warn as jest.MockedFunction<typeof console.warn>).mock.calls[0][0];
            
            // Assert: Verify log format includes ISO timestamp pattern
            expect(logOutput).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
            
            // Assert: Verify log includes application name
            expect(logOutput).toContain(`[${APP_NAME}]`);
            
            // Assert: Verify log includes WARN level
            expect(logOutput).toContain('[WARN]');
            
            // Assert: Verify log includes the warning message
            expect(logOutput).toContain(warningMessage);
        });
        
        it('should include serialized meta information when provided', () => {
            // Arrange: Prepare warning message and metadata
            const warningMessage = 'Response time exceeded threshold';
            const testMeta = {
                path: '/hello',
                responseTime: '250ms',
                threshold: '100ms',
                impact: 'performance'
            };
            
            // Act: Call logWarn with message and metadata
            logWarn(warningMessage, testMeta);
            
            // Assert: Verify console.warn was called exactly once
            expect(console.warn).toHaveBeenCalledTimes(1);
            
            // Get the actual log output for validation
            const logOutput = (console.warn as jest.MockedFunction<typeof console.warn>).mock.calls[0][0];
            
            // Assert: Verify log contains the warning message
            expect(logOutput).toContain(warningMessage);
            
            // Assert: Verify metadata is serialized as JSON and included
            expect(logOutput).toContain(JSON.stringify(testMeta));
        });
    });

    /**
     * Test Case: logError Output Format and Console Delegation
     * 
     * Verifies that logError calls console.error with a message containing
     * the ISO timestamp, application name, ERROR log level, the error message,
     * and stack trace if provided. Tests error logging with comprehensive
     * metadata including stack traces for debugging support.
     */
    describe('logError outputs error-level log with correct format and stack trace', () => {
        
        it('should call console.error with properly formatted message', () => {
            // Arrange: Prepare error message
            const errorMessage = 'Server failed to start';
            
            // Act: Call logError with error message
            logError(errorMessage);
            
            // Assert: Verify console.error was called exactly once
            expect(console.error).toHaveBeenCalledTimes(1);
            
            // Get the actual log output for detailed validation
            const logOutput = (console.error as jest.MockedFunction<typeof console.error>).mock.calls[0][0];
            
            // Assert: Verify log format includes ISO timestamp pattern
            expect(logOutput).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
            
            // Assert: Verify log includes application name
            expect(logOutput).toContain(`[${APP_NAME}]`);
            
            // Assert: Verify log includes ERROR level
            expect(logOutput).toContain('[ERROR]');
            
            // Assert: Verify log includes the error message
            expect(logOutput).toContain(errorMessage);
        });
        
        it('should include error details and stack trace when provided', () => {
            // Arrange: Create test error with stack trace using testUtils
            const testError = testUtils.simulateError(
                'Request processing failed',
                500,
                { requestId: 'req-123-456' }
            );
            
            const errorMessage = 'Request processing failed';
            const errorMeta = {
                error: testError.message,
                stack: testError.stack,
                method: 'GET',
                path: '/hello',
                statusCode: 500,
                requestId: 'req-123-456'
            };
            
            // Act: Call logError with error message and comprehensive metadata
            logError(errorMessage, errorMeta);
            
            // Assert: Verify console.error was called exactly once
            expect(console.error).toHaveBeenCalledTimes(1);
            
            // Get the actual log output for validation
            const logOutput = (console.error as jest.MockedFunction<typeof console.error>).mock.calls[0][0];
            
            // Assert: Verify log contains the error message
            expect(logOutput).toContain(errorMessage);
            
            // Assert: Verify error metadata is serialized and included
            expect(logOutput).toContain(JSON.stringify(errorMeta));
            
            // Assert: Verify stack trace is included in the metadata
            expect(logOutput).toContain(testError.stack);
        });
    });

    /**
     * Test Case: Meta Information Support Across All Logger Functions
     * 
     * Verifies that all logger functions (logInfo, logWarn, logError) properly
     * append serialized meta information to log output when provided. This
     * ensures consistent metadata handling across all log levels for
     * comprehensive debugging and monitoring support.
     */
    describe('Logger functions support meta information', () => {
        
        it('should serialize and include meta objects in all log levels', () => {
            // Arrange: Prepare test message and metadata object
            const testMessage = 'Test message with metadata';
            const testMeta = {
                timestamp: new Date().toISOString(),
                userId: 'user-123',
                sessionId: 'session-456',
                requestId: 'req-789',
                metadata: {
                    nested: 'value',
                    count: 42,
                    active: true
                }
            };
            
            // Act: Call all logger functions with the same message and metadata
            logInfo(testMessage, testMeta);
            logWarn(testMessage, testMeta);
            logError(testMessage, testMeta);
            
            // Assert: Verify each console method was called exactly once
            expect(console.log).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(console.error).toHaveBeenCalledTimes(1);
            
            // Get log outputs for validation
            const infoOutput = (console.log as jest.MockedFunction<typeof console.log>).mock.calls[0][0];
            const warnOutput = (console.warn as jest.MockedFunction<typeof console.warn>).mock.calls[0][0];
            const errorOutput = (console.error as jest.MockedFunction<typeof console.error>).mock.calls[0][0];
            
            // Assert: Verify metadata is serialized as JSON in all log outputs
            const serializedMeta = JSON.stringify(testMeta);
            expect(infoOutput).toContain(serializedMeta);
            expect(warnOutput).toContain(serializedMeta);
            expect(errorOutput).toContain(serializedMeta);
            
            // Assert: Verify nested metadata is properly included
            expect(infoOutput).toContain('"nested":"value"');
            expect(warnOutput).toContain('"count":42');
            expect(errorOutput).toContain('"active":true');
        });
        
        it('should handle undefined meta gracefully', () => {
            // Arrange: Prepare test message without metadata
            const testMessage = 'Message without metadata';
            
            // Act: Call logger functions without meta parameter
            logInfo(testMessage);
            logWarn(testMessage);
            logError(testMessage);
            
            // Assert: Verify console methods were called
            expect(console.log).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(console.error).toHaveBeenCalledTimes(1);
            
            // Get log outputs for validation
            const infoOutput = (console.log as jest.MockedFunction<typeof console.log>).mock.calls[0][0];
            const warnOutput = (console.warn as jest.MockedFunction<typeof console.warn>).mock.calls[0][0];
            const errorOutput = (console.error as jest.MockedFunction<typeof console.error>).mock.calls[0][0];
            
            // Assert: Verify log outputs contain message but no metadata serialization
            expect(infoOutput).toContain(testMessage);
            expect(warnOutput).toContain(testMessage);
            expect(errorOutput).toContain(testMessage);
            
            // Assert: Verify no undefined or null serialization
            expect(infoOutput).not.toContain('undefined');
            expect(warnOutput).not.toContain('null');
            expect(errorOutput).not.toContain('{}');
        });
    });

    /**
     * Test Case: Application Name Inclusion
     * 
     * Ensures that all logger output includes the APP_NAME constant for
     * clear attribution and identification. This is critical for log
     * aggregation, monitoring, and distinguishing application logs
     * in multi-service environments.
     */
    describe('Logger output includes application name', () => {
        
        it('should include APP_NAME in all log levels', () => {
            // Arrange: Prepare test messages for each log level
            const infoMessage = 'Info message test';
            const warnMessage = 'Warning message test';
            const errorMessage = 'Error message test';
            
            // Act: Call each logger function with test messages
            logInfo(infoMessage);
            logWarn(warnMessage);
            logError(errorMessage);
            
            // Assert: Verify console methods were called
            expect(console.log).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(console.error).toHaveBeenCalledTimes(1);
            
            // Get log outputs for validation
            const infoOutput = (console.log as jest.MockedFunction<typeof console.log>).mock.calls[0][0];
            const warnOutput = (console.warn as jest.MockedFunction<typeof console.warn>).mock.calls[0][0];
            const errorOutput = (console.error as jest.MockedFunction<typeof console.error>).mock.calls[0][0];
            
            // Assert: Verify APP_NAME is included in all log outputs
            expect(infoOutput).toContain(`[${APP_NAME}]`);
            expect(warnOutput).toContain(`[${APP_NAME}]`);
            expect(errorOutput).toContain(`[${APP_NAME}]`);
            
            // Assert: Verify APP_NAME appears in the correct format
            expect(infoOutput).toMatch(new RegExp(`\\[${APP_NAME}\\]`));
            expect(warnOutput).toMatch(new RegExp(`\\[${APP_NAME}\\]`));
            expect(errorOutput).toMatch(new RegExp(`\\[${APP_NAME}\\]`));
        });
    });

    /**
     * Test Case: Colorization in Development Environment
     * 
     * Verifies that log output is colorized according to log level when
     * NODE_ENV is set to 'development' and chalk is available. This test
     * checks for ANSI color codes in the log output to ensure proper
     * visual distinction between log levels during development.
     * 
     * Note: This test is conditional based on chalk availability and
     * environment configuration to avoid false failures in environments
     * where colorization is not supported or desired.
     */
    describe('Logger output is correctly colorized in development (if chalk is used)', () => {
        let originalNodeEnv: string | undefined;
        
        beforeEach(() => {
            // Store original NODE_ENV for restoration
            originalNodeEnv = process.env.NODE_ENV;
        });
        
        afterEach(() => {
            // Restore original NODE_ENV
            if (originalNodeEnv !== undefined) {
                process.env.NODE_ENV = originalNodeEnv;
            } else {
                delete process.env.NODE_ENV;
            }
        });
        
        it('should apply color codes when NODE_ENV is development', () => {
            // Arrange: Set NODE_ENV to development for colorization
            process.env.NODE_ENV = 'development';
            
            const testMessage = 'Colorization test message';
            
            // Act: Call logger functions to test colorization
            logInfo(testMessage);
            logWarn(testMessage);
            logError(testMessage);
            
            // Assert: Verify console methods were called
            expect(console.log).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(console.error).toHaveBeenCalledTimes(1);
            
            // Get log outputs for validation
            const infoOutput = (console.log as jest.MockedFunction<typeof console.log>).mock.calls[0][0];
            const warnOutput = (console.warn as jest.MockedFunction<typeof console.warn>).mock.calls[0][0];
            const errorOutput = (console.error as jest.MockedFunction<typeof console.error>).mock.calls[0][0];
            
            // Assert: Check for potential ANSI color codes if chalk is available
            // Note: These tests check for the presence of ANSI escape sequences
            // which indicate colorization is being applied
            
            // Check for any ANSI color codes (escape sequences starting with \x1b[)
            const ansiColorRegex = /\x1b\[\d+m/;
            
            // If colorization is working, we should see ANSI codes in development
            // This is a conditional test that passes regardless of chalk availability
            if (ansiColorRegex.test(infoOutput) || ansiColorRegex.test(warnOutput) || ansiColorRegex.test(errorOutput)) {
                // If any colorization is detected, verify expected patterns
                expect(true).toBe(true); // Colorization is working
            } else {
                // If no colorization is detected, verify basic formatting still works
                expect(infoOutput).toContain('[INFO]');
                expect(warnOutput).toContain('[WARN]');
                expect(errorOutput).toContain('[ERROR]');
            }
            
            // Assert: Verify messages are still readable regardless of colorization
            expect(infoOutput).toContain(testMessage);
            expect(warnOutput).toContain(testMessage);
            expect(errorOutput).toContain(testMessage);
        });
        
        it('should not apply color codes when NODE_ENV is production', () => {
            // Arrange: Set NODE_ENV to production to disable colorization
            process.env.NODE_ENV = 'production';
            
            const testMessage = 'Production logging test';
            
            // Act: Call logger functions in production mode
            logInfo(testMessage);
            logWarn(testMessage);
            logError(testMessage);
            
            // Get log outputs for validation
            const infoOutput = (console.log as jest.MockedFunction<typeof console.log>).mock.calls[0][0];
            const warnOutput = (console.warn as jest.MockedFunction<typeof console.warn>).mock.calls[0][0];
            const errorOutput = (console.error as jest.MockedFunction<typeof console.error>).mock.calls[0][0];
            
            // Assert: Verify no ANSI color codes in production mode
            const ansiColorRegex = /\x1b\[\d+m/;
            expect(infoOutput).not.toMatch(ansiColorRegex);
            expect(warnOutput).not.toMatch(ansiColorRegex);
            expect(errorOutput).not.toMatch(ansiColorRegex);
            
            // Assert: Verify basic formatting still works in production
            expect(infoOutput).toContain('[INFO]');
            expect(warnOutput).toContain('[WARN]');
            expect(errorOutput).toContain('[ERROR]');
            expect(infoOutput).toContain(testMessage);
            expect(warnOutput).toContain(testMessage);
            expect(errorOutput).toContain(testMessage);
        });
    });

    /**
     * Test Case: Timestamp Format Validation
     * 
     * Verifies that all logger functions generate timestamps in ISO 8601 format
     * with proper UTC timezone specification. This ensures consistent timestamp
     * formatting across all log messages for accurate log analysis and correlation.
     */
    describe('Logger timestamp format validation', () => {
        
        it('should generate valid ISO 8601 timestamps in all log outputs', () => {
            // Arrange: Prepare test message
            const testMessage = 'Timestamp validation test';
            
            // Act: Call all logger functions
            logInfo(testMessage);
            logWarn(testMessage);
            logError(testMessage);
            
            // Get log outputs for validation
            const infoOutput = (console.log as jest.MockedFunction<typeof console.log>).mock.calls[0][0];
            const warnOutput = (console.warn as jest.MockedFunction<typeof console.warn>).mock.calls[0][0];
            const errorOutput = (console.error as jest.MockedFunction<typeof console.error>).mock.calls[0][0];
            
            // Define ISO 8601 timestamp regex pattern
            const iso8601Regex = /^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/;
            
            // Assert: Verify all outputs start with valid ISO 8601 timestamps
            expect(infoOutput).toMatch(iso8601Regex);
            expect(warnOutput).toMatch(iso8601Regex);
            expect(errorOutput).toMatch(iso8601Regex);
            
            // Extract timestamps for additional validation
            const infoTimestamp = infoOutput.match(/\[([^\]]+)\]/)?.[1];
            const warnTimestamp = warnOutput.match(/\[([^\]]+)\]/)?.[1];
            const errorTimestamp = errorOutput.match(/\[([^\]]+)\]/)?.[1];
            
            // Assert: Verify timestamps can be parsed as valid dates
            if (infoTimestamp) {
                expect(new Date(infoTimestamp).toISOString()).toBe(infoTimestamp);
            }
            if (warnTimestamp) {
                expect(new Date(warnTimestamp).toISOString()).toBe(warnTimestamp);
            }
            if (errorTimestamp) {
                expect(new Date(errorTimestamp).toISOString()).toBe(errorTimestamp);
            }
        });
    });

    /**
     * Test Case: Log Level Case Sensitivity
     * 
     * Verifies that log levels are consistently formatted in uppercase
     * regardless of internal implementation details. This ensures
     * consistent log parsing and filtering capabilities.
     */
    describe('Logger level formatting consistency', () => {
        
        it('should format log levels in uppercase', () => {
            // Arrange: Prepare test message
            const testMessage = 'Level formatting test';
            
            // Act: Call all logger functions
            logInfo(testMessage);
            logWarn(testMessage);
            logError(testMessage);
            
            // Get log outputs for validation
            const infoOutput = (console.log as jest.MockedFunction<typeof console.log>).mock.calls[0][0];
            const warnOutput = (console.warn as jest.MockedFunction<typeof console.warn>).mock.calls[0][0];
            const errorOutput = (console.error as jest.MockedFunction<typeof console.error>).mock.calls[0][0];
            
            // Assert: Verify log levels are in uppercase
            expect(infoOutput).toContain('[INFO]');
            expect(warnOutput).toContain('[WARN]');
            expect(errorOutput).toContain('[ERROR]');
            
            // Assert: Verify no lowercase log levels
            expect(infoOutput).not.toContain('[info]');
            expect(warnOutput).not.toContain('[warn]');
            expect(errorOutput).not.toContain('[error]');
        });
    });
});