/**
 * Unit Test Suite for Centralized Logger Utility
 * 
 * This test suite validates the correct behavior of all static logging methods
 * (info, warn, error, debug) of the Logger utility under different environment
 * conditions (development, production, test). It ensures logs are formatted as
 * specified, output to the correct streams, and suppressed or enabled according
 * to environment configuration.
 * 
 * The test suite uses Jest mocks to capture log output from process.stdout and
 * process.stderr for assertions, verifies error logging includes stack traces
 * when Error objects are provided, and ensures debug logs are only emitted in
 * non-production environments.
 * 
 * Coverage includes:
 * - All logging methods (info, warn, error, debug)
 * - Environment-aware logging behavior
 * - Log formatting and structure validation
 * - Output stream routing (stdout vs stderr)
 * - Error object handling with stack traces
 * - Metadata object serialization
 * - Environment suppression logic
 * 
 * Requirements Addressed:
 * - Monitoring and Observability: Validates structured, environment-aware output
 * - Error Management: Ensures error logs include stack traces and use stderr
 * - Testing Strategy: Unit tests with mocks, isolation, and reproducibility
 * 
 * @fileoverview Unit tests for Logger utility with comprehensive coverage
 * @version 1.0.0
 * @author Tutorial Implementation Team
 */

// =============================================================================
// IMPORTS
// =============================================================================

/**
 * Jest testing framework - v29.7.0
 * Provides test runner, assertion library, and mocking capabilities
 */
const { jest, describe, it, expect, beforeEach, afterEach } = require('jest');

/**
 * Logger class under test
 * Provides static logging methods for info, warn, error, and debug levels
 * with environment-aware output and formatting
 */
const { Logger } = require('../../../src/backend/utils/logger.js');

/**
 * Environment configuration for testing different environment settings
 * Used to simulate/test different environment settings (development, production, test)
 * for environment-aware logger behavior
 */
const { env } = require('../../../src/backend/config/env.js');

/**
 * Test utilities for reusable test helpers
 * Provides test helpers for DRY assertions and request simulation
 */
const * as testUtils = require('../../helpers/testUtils.js');

// =============================================================================
// GLOBAL TEST VARIABLES
// =============================================================================

/**
 * Backup of original process.env to restore after each test
 * Prevents cross-test contamination and ensures test isolation
 */
let originalEnv;

/**
 * Jest mock/spy for process.stdout.write to capture info/warn/debug logs
 * Allows assertions on stdout output without affecting test runner output
 */
let mockStdout;

/**
 * Jest mock/spy for process.stderr.write to capture error logs
 * Allows assertions on stderr output without affecting test runner output
 */
let mockStderr;

// =============================================================================
// TEST SETUP AND TEARDOWN FUNCTIONS
// =============================================================================

/**
 * Sets up mocks for process.stdout and process.stderr, and stubs environment
 * variables for logger tests. This function is called before each test to ensure
 * proper test isolation and prevent side effects between tests.
 * 
 * Setup Process:
 * 1. Backup current process.env for later restoration
 * 2. Mock process.stdout.write and process.stderr.write using jest.spyOn
 * 3. Clear any existing mock calls to ensure clean state
 * 4. Set up environment variables for specific test scenarios
 * 
 * @function setupLoggerTestEnvironment
 * @returns {void} Side effect: process streams are mocked, environment is set for test
 */
function setupLoggerTestEnvironment() {
    // Backup original process.env to restore after test
    originalEnv = { ...process.env };
    
    // Mock process.stdout.write to capture info, warn, and debug logs
    mockStdout = jest.spyOn(process.stdout, 'write').mockImplementation(() => {});
    
    // Mock process.stderr.write to capture error logs
    mockStderr = jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
    
    // Clear any existing mock calls from previous tests
    mockStdout.mockClear();
    mockStderr.mockClear();
}

/**
 * Restores process.env and unmocks process streams after each test.
 * This function ensures that test isolation is maintained and no side effects
 * persist between tests.
 * 
 * Restoration Process:
 * 1. Restore original process.env from backup
 * 2. Restore original process.stdout.write implementation
 * 3. Restore original process.stderr.write implementation
 * 4. Clean up mock references
 * 
 * @function restoreLoggerTestEnvironment
 * @returns {void} Side effect: process streams and environment are restored
 */
function restoreLoggerTestEnvironment() {
    // Restore original process.env
    process.env = originalEnv;
    
    // Restore original process.stdout.write
    if (mockStdout) {
        mockStdout.mockRestore();
    }
    
    // Restore original process.stderr.write
    if (mockStderr) {
        mockStderr.mockRestore();
    }
    
    // Clean up mock references
    mockStdout = null;
    mockStderr = null;
    originalEnv = null;
}

// =============================================================================
// MAIN TEST SUITE
// =============================================================================

describe('Logger Utility', () => {
    
    // Set up test environment before each test
    beforeEach(() => {
        setupLoggerTestEnvironment();
    });
    
    // Clean up test environment after each test
    afterEach(() => {
        restoreLoggerTestEnvironment();
    });
    
    // ==========================================================================
    // LOGGER.INFO TESTS
    // ==========================================================================
    
    describe('Logger.info', () => {
        
        it('should log formatted message to stdout in development environment', () => {
            // Set NODE_ENV to 'development'
            process.env.NODE_ENV = 'development';
            
            // Call Logger.info with test message
            Logger.info('Test info message');
            
            // Assert that process.stdout.write was called
            expect(mockStdout).toHaveBeenCalledTimes(1);
            
            // Get the logged message
            const loggedMessage = mockStdout.mock.calls[0][0];
            
            // Assert that the logged message contains required elements
            expect(loggedMessage).toContain('[info]');
            expect(loggedMessage).toContain('Test info message');
            expect(loggedMessage).toContain('nodejs-hello-world-tutorial');
            expect(loggedMessage).toContain('development');
            expect(loggedMessage).toMatch(/^\[[0-9T:.\-Z]+\]/); // Timestamp format
            
            // Assert that stderr was not called
            expect(mockStderr).not.toHaveBeenCalled();
        });
        
        it('should log formatted message to stdout in production environment', () => {
            // Set NODE_ENV to 'production'
            process.env.NODE_ENV = 'production';
            
            // Call Logger.info with test message
            Logger.info('Prod info message');
            
            // Assert that process.stdout.write was called
            expect(mockStdout).toHaveBeenCalledTimes(1);
            
            // Get the logged message
            const loggedMessage = mockStdout.mock.calls[0][0];
            
            // Assert that the logged message contains required elements
            expect(loggedMessage).toContain('[info]');
            expect(loggedMessage).toContain('Prod info message');
            expect(loggedMessage).toContain('nodejs-hello-world-tutorial');
            expect(loggedMessage).toContain('production');
            expect(loggedMessage).toMatch(/^\[[0-9T:.\-Z]+\]/); // Timestamp format
            
            // Assert that stderr was not called
            expect(mockStderr).not.toHaveBeenCalled();
        });
        
        it('should not log message in test environment', () => {
            // Set NODE_ENV to 'test'
            process.env.NODE_ENV = 'test';
            
            // Call Logger.info with test message
            Logger.info('Should not log');
            
            // Assert that process.stdout.write was not called
            expect(mockStdout).not.toHaveBeenCalled();
            
            // Assert that stderr was not called
            expect(mockStderr).not.toHaveBeenCalled();
        });
        
        it('should include metadata in log output when provided', () => {
            // Set NODE_ENV to 'development'
            process.env.NODE_ENV = 'development';
            
            // Call Logger.info with message and metadata
            const testMeta = { userId: 123, action: 'login' };
            Logger.info('User action', testMeta);
            
            // Assert that process.stdout.write was called
            expect(mockStdout).toHaveBeenCalledTimes(1);
            
            // Get the logged message
            const loggedMessage = mockStdout.mock.calls[0][0];
            
            // Assert that the logged message contains metadata as JSON
            expect(loggedMessage).toContain('"userId":123');
            expect(loggedMessage).toContain('"action":"login"');
            expect(loggedMessage).toContain('User action');
        });
        
    });
    
    // ==========================================================================
    // LOGGER.WARN TESTS
    // ==========================================================================
    
    describe('Logger.warn', () => {
        
        it('should log formatted message to stdout in development environment', () => {
            // Set NODE_ENV to 'development'
            process.env.NODE_ENV = 'development';
            
            // Call Logger.warn with test message
            Logger.warn('Test warn message');
            
            // Assert that process.stdout.write was called
            expect(mockStdout).toHaveBeenCalledTimes(1);
            
            // Get the logged message
            const loggedMessage = mockStdout.mock.calls[0][0];
            
            // Assert that the logged message contains required elements
            expect(loggedMessage).toContain('[warn]');
            expect(loggedMessage).toContain('Test warn message');
            expect(loggedMessage).toContain('nodejs-hello-world-tutorial');
            expect(loggedMessage).toContain('development');
            expect(loggedMessage).toMatch(/^\[[0-9T:.\-Z]+\]/); // Timestamp format
            
            // Assert that stderr was not called
            expect(mockStderr).not.toHaveBeenCalled();
        });
        
        it('should log formatted message to stdout in production environment', () => {
            // Set NODE_ENV to 'production'
            process.env.NODE_ENV = 'production';
            
            // Call Logger.warn with test message
            Logger.warn('Prod warn message');
            
            // Assert that process.stdout.write was called
            expect(mockStdout).toHaveBeenCalledTimes(1);
            
            // Get the logged message
            const loggedMessage = mockStdout.mock.calls[0][0];
            
            // Assert that the logged message contains required elements
            expect(loggedMessage).toContain('[warn]');
            expect(loggedMessage).toContain('Prod warn message');
            expect(loggedMessage).toContain('nodejs-hello-world-tutorial');
            expect(loggedMessage).toContain('production');
            expect(loggedMessage).toMatch(/^\[[0-9T:.\-Z]+\]/); // Timestamp format
            
            // Assert that stderr was not called
            expect(mockStderr).not.toHaveBeenCalled();
        });
        
        it('should not log message in test environment', () => {
            // Set NODE_ENV to 'test'
            process.env.NODE_ENV = 'test';
            
            // Call Logger.warn with test message
            Logger.warn('Should not log');
            
            // Assert that process.stdout.write was not called
            expect(mockStdout).not.toHaveBeenCalled();
            
            // Assert that stderr was not called
            expect(mockStderr).not.toHaveBeenCalled();
        });
        
        it('should include metadata in log output when provided', () => {
            // Set NODE_ENV to 'development'
            process.env.NODE_ENV = 'development';
            
            // Call Logger.warn with message and metadata
            const testMeta = { threshold: 1000, current: 950 };
            Logger.warn('Rate limit approaching', testMeta);
            
            // Assert that process.stdout.write was called
            expect(mockStdout).toHaveBeenCalledTimes(1);
            
            // Get the logged message
            const loggedMessage = mockStdout.mock.calls[0][0];
            
            // Assert that the logged message contains metadata as JSON
            expect(loggedMessage).toContain('"threshold":1000');
            expect(loggedMessage).toContain('"current":950');
            expect(loggedMessage).toContain('Rate limit approaching');
        });
        
    });
    
    // ==========================================================================
    // LOGGER.ERROR TESTS
    // ==========================================================================
    
    describe('Logger.error', () => {
        
        it('should log formatted message to stderr in development environment', () => {
            // Set NODE_ENV to 'development'
            process.env.NODE_ENV = 'development';
            
            // Call Logger.error with test message
            Logger.error('Test error message');
            
            // Assert that process.stderr.write was called
            expect(mockStderr).toHaveBeenCalledTimes(1);
            
            // Get the logged message
            const loggedMessage = mockStderr.mock.calls[0][0];
            
            // Assert that the logged message contains required elements
            expect(loggedMessage).toContain('[error]');
            expect(loggedMessage).toContain('Test error message');
            expect(loggedMessage).toContain('nodejs-hello-world-tutorial');
            expect(loggedMessage).toContain('development');
            expect(loggedMessage).toMatch(/^\[[0-9T:.\-Z]+\]/); // Timestamp format
            
            // Assert that stdout was not called
            expect(mockStdout).not.toHaveBeenCalled();
        });
        
        it('should log formatted message to stderr in production environment', () => {
            // Set NODE_ENV to 'production'
            process.env.NODE_ENV = 'production';
            
            // Call Logger.error with test message
            Logger.error('Prod error message');
            
            // Assert that process.stderr.write was called
            expect(mockStderr).toHaveBeenCalledTimes(1);
            
            // Get the logged message
            const loggedMessage = mockStderr.mock.calls[0][0];
            
            // Assert that the logged message contains required elements
            expect(loggedMessage).toContain('[error]');
            expect(loggedMessage).toContain('Prod error message');
            expect(loggedMessage).toContain('nodejs-hello-world-tutorial');
            expect(loggedMessage).toContain('production');
            expect(loggedMessage).toMatch(/^\[[0-9T:.\-Z]+\]/); // Timestamp format
            
            // Assert that stdout was not called
            expect(mockStdout).not.toHaveBeenCalled();
        });
        
        it('should not log message in test environment', () => {
            // Set NODE_ENV to 'test'
            process.env.NODE_ENV = 'test';
            
            // Call Logger.error with test message
            Logger.error('Should not log');
            
            // Assert that process.stderr.write was not called
            expect(mockStderr).not.toHaveBeenCalled();
            
            // Assert that stdout was not called
            expect(mockStdout).not.toHaveBeenCalled();
        });
        
        it('should include stack trace when Error object is provided', () => {
            // Set NODE_ENV to 'development'
            process.env.NODE_ENV = 'development';
            
            // Create a test error with stack trace
            const testError = new Error('Test error with stack');
            
            // Call Logger.error with error object
            Logger.error('Error with stack', testError);
            
            // Assert that process.stderr.write was called
            expect(mockStderr).toHaveBeenCalledTimes(1);
            
            // Get the logged message
            const loggedMessage = mockStderr.mock.calls[0][0];
            
            // Assert that the logged message contains error details
            expect(loggedMessage).toContain('Error with stack');
            expect(loggedMessage).toContain('"name":"Error"');
            expect(loggedMessage).toContain('"message":"Test error with stack"');
            expect(loggedMessage).toContain('"stack"');
            expect(loggedMessage).toContain('at '); // Stack trace marker
        });
        
        it('should handle Error objects with custom properties', () => {
            // Set NODE_ENV to 'development'
            process.env.NODE_ENV = 'development';
            
            // Create a test error with custom properties
            const testError = new Error('Custom error');
            testError.code = 'CUSTOM_ERROR';
            testError.statusCode = 400;
            
            // Call Logger.error with enhanced error object
            Logger.error('Custom error occurred', testError);
            
            // Assert that process.stderr.write was called
            expect(mockStderr).toHaveBeenCalledTimes(1);
            
            // Get the logged message
            const loggedMessage = mockStderr.mock.calls[0][0];
            
            // Assert that the logged message contains custom properties
            expect(loggedMessage).toContain('"code":"CUSTOM_ERROR"');
            expect(loggedMessage).toContain('"statusCode":400');
            expect(loggedMessage).toContain('"message":"Custom error"');
        });
        
        it('should include metadata in log output when provided', () => {
            // Set NODE_ENV to 'development'
            process.env.NODE_ENV = 'development';
            
            // Call Logger.error with message and metadata
            const testMeta = { userId: 123, operation: 'database_query' };
            Logger.error('Database operation failed', testMeta);
            
            // Assert that process.stderr.write was called
            expect(mockStderr).toHaveBeenCalledTimes(1);
            
            // Get the logged message
            const loggedMessage = mockStderr.mock.calls[0][0];
            
            // Assert that the logged message contains metadata as JSON
            expect(loggedMessage).toContain('"userId":123');
            expect(loggedMessage).toContain('"operation":"database_query"');
            expect(loggedMessage).toContain('Database operation failed');
        });
        
    });
    
    // ==========================================================================
    // LOGGER.DEBUG TESTS
    // ==========================================================================
    
    describe('Logger.debug', () => {
        
        it('should log formatted message to stdout in development environment', () => {
            // Set NODE_ENV to 'development'
            process.env.NODE_ENV = 'development';
            
            // Call Logger.debug with test message
            Logger.debug('Dev debug message');
            
            // Assert that process.stdout.write was called
            expect(mockStdout).toHaveBeenCalledTimes(1);
            
            // Get the logged message
            const loggedMessage = mockStdout.mock.calls[0][0];
            
            // Assert that the logged message contains required elements
            expect(loggedMessage).toContain('[debug]');
            expect(loggedMessage).toContain('Dev debug message');
            expect(loggedMessage).toContain('nodejs-hello-world-tutorial');
            expect(loggedMessage).toContain('development');
            expect(loggedMessage).toMatch(/^\[[0-9T:.\-Z]+\]/); // Timestamp format
            
            // Assert that stderr was not called
            expect(mockStderr).not.toHaveBeenCalled();
        });
        
        it('should log formatted message to stdout in test environment', () => {
            // Set NODE_ENV to 'test'
            process.env.NODE_ENV = 'test';
            
            // Call Logger.debug with test message
            Logger.debug('Test debug message');
            
            // Assert that process.stdout.write was called
            expect(mockStdout).toHaveBeenCalledTimes(1);
            
            // Get the logged message
            const loggedMessage = mockStdout.mock.calls[0][0];
            
            // Assert that the logged message contains required elements
            expect(loggedMessage).toContain('[debug]');
            expect(loggedMessage).toContain('Test debug message');
            expect(loggedMessage).toContain('nodejs-hello-world-tutorial');
            expect(loggedMessage).toContain('test');
            expect(loggedMessage).toMatch(/^\[[0-9T:.\-Z]+\]/); // Timestamp format
            
            // Assert that stderr was not called
            expect(mockStderr).not.toHaveBeenCalled();
        });
        
        it('should not log message in production environment', () => {
            // Set NODE_ENV to 'production'
            process.env.NODE_ENV = 'production';
            
            // Call Logger.debug with test message
            Logger.debug('Should not log');
            
            // Assert that process.stdout.write was not called
            expect(mockStdout).not.toHaveBeenCalled();
            
            // Assert that stderr was not called
            expect(mockStderr).not.toHaveBeenCalled();
        });
        
        it('should include metadata in log output when provided', () => {
            // Set NODE_ENV to 'development'
            process.env.NODE_ENV = 'development';
            
            // Call Logger.debug with message and metadata
            const testMeta = { requestId: 'req-123', processingTime: 45 };
            Logger.debug('Request processing details', testMeta);
            
            // Assert that process.stdout.write was called
            expect(mockStdout).toHaveBeenCalledTimes(1);
            
            // Get the logged message
            const loggedMessage = mockStdout.mock.calls[0][0];
            
            // Assert that the logged message contains metadata as JSON
            expect(loggedMessage).toContain('"requestId":"req-123"');
            expect(loggedMessage).toContain('"processingTime":45');
            expect(loggedMessage).toContain('Request processing details');
        });
        
    });
    
    // ==========================================================================
    // COMPREHENSIVE INTEGRATION TESTS
    // ==========================================================================
    
    describe('Logger Integration', () => {
        
        it('should include app name and environment in all log outputs', () => {
            // Set NODE_ENV to 'development'
            process.env.NODE_ENV = 'development';
            
            // Test all log levels
            Logger.info('App context test');
            Logger.warn('App context test');
            Logger.error('App context test');
            Logger.debug('App context test');
            
            // Assert that stdout was called for info, warn, debug
            expect(mockStdout).toHaveBeenCalledTimes(3);
            
            // Assert that stderr was called for error
            expect(mockStderr).toHaveBeenCalledTimes(1);
            
            // Check stdout logs contain app name and environment
            mockStdout.mock.calls.forEach(call => {
                const loggedMessage = call[0];
                expect(loggedMessage).toContain('nodejs-hello-world-tutorial');
                expect(loggedMessage).toContain('development');
            });
            
            // Check stderr logs contain app name and environment
            mockStderr.mock.calls.forEach(call => {
                const loggedMessage = call[0];
                expect(loggedMessage).toContain('nodejs-hello-world-tutorial');
                expect(loggedMessage).toContain('development');
            });
        });
        
        it('should handle circular reference in metadata gracefully', () => {
            // Set NODE_ENV to 'development'
            process.env.NODE_ENV = 'development';
            
            // Create object with circular reference
            const circularObj = { name: 'test' };
            circularObj.self = circularObj;
            
            // Call Logger.info with circular metadata
            Logger.info('Circular reference test', circularObj);
            
            // Assert that process.stdout.write was called
            expect(mockStdout).toHaveBeenCalledTimes(1);
            
            // Get the logged message
            const loggedMessage = mockStdout.mock.calls[0][0];
            
            // Assert that the logged message contains error message for circular reference
            expect(loggedMessage).toContain('Circular reference test');
            expect(loggedMessage).toContain('Metadata serialization error');
        });
        
        it('should handle empty metadata object correctly', () => {
            // Set NODE_ENV to 'development'
            process.env.NODE_ENV = 'development';
            
            // Call Logger.info with empty metadata
            Logger.info('Empty metadata test', {});
            
            // Assert that process.stdout.write was called
            expect(mockStdout).toHaveBeenCalledTimes(1);
            
            // Get the logged message
            const loggedMessage = mockStdout.mock.calls[0][0];
            
            // Assert that the logged message does not contain metadata
            expect(loggedMessage).toContain('Empty metadata test');
            expect(loggedMessage).not.toContain('{}');
        });
        
        it('should handle null metadata correctly', () => {
            // Set NODE_ENV to 'development'
            process.env.NODE_ENV = 'development';
            
            // Call Logger.info with null metadata
            Logger.info('Null metadata test', null);
            
            // Assert that process.stdout.write was called
            expect(mockStdout).toHaveBeenCalledTimes(1);
            
            // Get the logged message
            const loggedMessage = mockStdout.mock.calls[0][0];
            
            // Assert that the logged message does not contain metadata
            expect(loggedMessage).toContain('Null metadata test');
            expect(loggedMessage).not.toContain('null');
        });
        
        it('should format timestamps in ISO8601 format', () => {
            // Set NODE_ENV to 'development'
            process.env.NODE_ENV = 'development';
            
            // Call Logger.info
            Logger.info('Timestamp test');
            
            // Assert that process.stdout.write was called
            expect(mockStdout).toHaveBeenCalledTimes(1);
            
            // Get the logged message
            const loggedMessage = mockStdout.mock.calls[0][0];
            
            // Extract timestamp from log message
            const timestampMatch = loggedMessage.match(/^\[([^\]]+)\]/);
            expect(timestampMatch).toBeTruthy();
            
            // Validate ISO8601 format
            const timestamp = timestampMatch[1];
            expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
            
            // Validate that timestamp is a valid date
            const date = new Date(timestamp);
            expect(date.toISOString()).toBe(timestamp);
        });
        
        it('should support complex metadata objects', () => {
            // Set NODE_ENV to 'development'
            process.env.NODE_ENV = 'development';
            
            // Create complex metadata object
            const complexMeta = {
                user: { id: 123, name: 'John Doe' },
                request: { method: 'GET', url: '/api/users' },
                performance: { duration: 150, memoryUsage: 85.5 },
                tags: ['api', 'user', 'success'],
                timestamp: new Date().toISOString()
            };
            
            // Call Logger.info with complex metadata
            Logger.info('Complex metadata test', complexMeta);
            
            // Assert that process.stdout.write was called
            expect(mockStdout).toHaveBeenCalledTimes(1);
            
            // Get the logged message
            const loggedMessage = mockStdout.mock.calls[0][0];
            
            // Assert that the logged message contains all metadata elements
            expect(loggedMessage).toContain('Complex metadata test');
            expect(loggedMessage).toContain('"id":123');
            expect(loggedMessage).toContain('"name":"John Doe"');
            expect(loggedMessage).toContain('"method":"GET"');
            expect(loggedMessage).toContain('"url":"/api/users"');
            expect(loggedMessage).toContain('"duration":150');
            expect(loggedMessage).toContain('"memoryUsage":85.5');
            expect(loggedMessage).toContain('["api","user","success"]');
        });
        
    });
    
    // ==========================================================================
    // LOGGER CLASS INSTANTIATION TESTS
    // ==========================================================================
    
    describe('Logger Class Instantiation', () => {
        
        it('should throw error when attempting to instantiate Logger class', () => {
            // Attempt to instantiate Logger class
            expect(() => {
                new Logger();
            }).toThrow('Logger is a static utility class and should not be instantiated');
        });
        
        it('should throw error with correct message when instantiated', () => {
            // Attempt to instantiate Logger class
            expect(() => {
                new Logger();
            }).toThrow('Use Logger.info(), Logger.warn(), Logger.error(), or Logger.debug() instead');
        });
        
    });
    
    // ==========================================================================
    // ENVIRONMENT EDGE CASES
    // ==========================================================================
    
    describe('Environment Edge Cases', () => {
        
        it('should handle undefined NODE_ENV gracefully', () => {
            // Set NODE_ENV to undefined
            delete process.env.NODE_ENV;
            
            // Call Logger.info (should default to development behavior)
            Logger.info('Undefined env test');
            
            // Assert that logging occurred (development behavior)
            expect(mockStdout).toHaveBeenCalledTimes(1);
            
            // Get the logged message
            const loggedMessage = mockStdout.mock.calls[0][0];
            
            // Assert that the logged message contains default environment
            expect(loggedMessage).toContain('Undefined env test');
            expect(loggedMessage).toContain('development'); // Default from env.js
        });
        
        it('should handle invalid NODE_ENV gracefully', () => {
            // Set NODE_ENV to invalid value
            process.env.NODE_ENV = 'invalid';
            
            // Call Logger.info (should default to development behavior)
            Logger.info('Invalid env test');
            
            // Assert that logging occurred (development behavior)
            expect(mockStdout).toHaveBeenCalledTimes(1);
            
            // Get the logged message
            const loggedMessage = mockStdout.mock.calls[0][0];
            
            // Assert that the logged message contains default environment
            expect(loggedMessage).toContain('Invalid env test');
            expect(loggedMessage).toContain('development'); // Default from env.js
        });
        
    });
    
});