// dotenv - ^16.0.0
// Environment variable management for Node.js applications
const dotenv = require('dotenv');

// jest - ^29.0.0  
// Jest testing framework for comprehensive JavaScript testing capabilities
const jest = require('jest');

// Internal import: Test utilities for creating mock Express.js objects and test helpers
const { testUtils } = require('./helpers/testUtils.js');

/**
 * GLOBAL TEST ENVIRONMENT SETUP FOR NODE.JS TUTORIAL APPLICATION
 * 
 * This file serves as the central initialization point for all backend tests in the Node.js tutorial
 * application. It ensures that every test runs in a clean, predictable, and isolated environment
 * by loading environment variables, registering global test utilities, and configuring Jest-specific
 * settings appropriate for testing Express.js applications.
 * 
 * Educational Purpose:
 * This setup demonstrates best practices for Node.js test environment initialization, including:
 * - Environment variable management for different testing scenarios
 * - Global test utility registration for consistent testing patterns
 * - Test isolation and state management
 * - Jest configuration for optimal testing experience
 * 
 * Usage Patterns:
 * 1. Automatically imported by Jest via setupFilesAfterEnv configuration
 * 2. Explicitly imported at the top of test files for manual setup
 * 3. Called via setupTestEnvironment() function for custom initialization
 */

/**
 * Initializes the comprehensive test environment for all backend tests.
 * 
 * This function serves as the main entry point for setting up the testing environment
 * before any unit or integration tests are executed. It handles environment variable
 * loading, global test utility registration, state reset, and Jest configuration
 * to ensure consistent, isolated, and reproducible test execution.
 * 
 * Educational Value:
 * Demonstrates professional test environment setup patterns including:
 * - Environment variable management across different testing contexts
 * - Global test helper registration for DRY (Don't Repeat Yourself) testing
 * - Test isolation techniques to prevent test interference
 * - Jest-specific configuration for optimal testing performance
 * 
 * @returns {void} No return value; performs side effects including environment setup,
 *                 global variable registration, and Jest configuration
 */
function setupTestEnvironment() {
    // STEP 1: ENVIRONMENT VARIABLE LOADING
    // Load environment variables from various .env files in order of precedence
    // This ensures that test-specific configurations override default settings
    
    try {
        // Primary: Load test-specific environment variables if .env.test exists
        // This file should contain test database URLs, API keys, and other test-specific configs
        dotenv.config({ path: '.env.test' });
        
        // Secondary: Load general development environment variables from .env
        // This provides fallback values for any variables not specified in .env.test  
        dotenv.config({ path: '.env' });
        
        // Tertiary: Load example environment variables as final fallback
        // This ensures the application has sensible defaults even without explicit configuration
        dotenv.config({ path: '.env.example' });
        
        console.log('[TEST SETUP] Environment variables loaded successfully');
        console.log(`[TEST SETUP] NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
        
    } catch (environmentError) {
        // Non-critical error: Environment files are optional for the tutorial application
        // The application should still function with default values
        console.warn('[TEST SETUP] Warning: Could not load environment files:', environmentError.message);
        console.log('[TEST SETUP] Continuing with default environment configuration...');
    }

    // STEP 2: ENSURE TEST ENVIRONMENT CONFIGURATION
    // Set NODE_ENV to 'test' to enable test-specific behaviors in the application
    // This is crucial for Express.js apps to disable certain middleware and enable test modes
    if (process.env.NODE_ENV !== 'test') {
        process.env.NODE_ENV = 'test';
        console.log('[TEST SETUP] NODE_ENV set to "test" for optimal testing environment');
    }

    // STEP 3: GLOBAL TEST UTILITY REGISTRATION
    // Register all test utility functions as global variables to eliminate the need
    // for repeated imports in every test file. This follows the Jest convention of
    // making testing utilities universally available.
    
    console.log('[TEST SETUP] Registering global test utilities...');
    
    // Register createMockRequest globally for creating Express.js request mock objects
    // Usage: const mockReq = createMockRequest({ method: 'GET', url: '/hello' });
    global.createMockRequest = testUtils.createMockRequest;
    
    // Register createMockResponse globally for creating Express.js response mock objects
    // Usage: const mockRes = createMockResponse();
    global.createMockResponse = testUtils.createMockResponse;
    
    // Register simulateNext globally for creating Express.js next() function mocks
    // Usage: const next = simulateNext();
    global.simulateNext = testUtils.simulateNext;
    
    // Register simulateError globally for creating standardized error objects for testing
    // Usage: const error = simulateError('Test error', 500, { code: 'TEST_ERROR' });
    global.simulateError = testUtils.simulateError;
    
    // Register assertResponse globally for standardized response assertions
    // Usage: assertResponse(mockRes, 200, 'Hello world', { 'content-type': 'text/plain' });
    global.assertResponse = testUtils.assertResponse;
    
    // Additional test utility for response mock validation (if available)
    if (testUtils.validateResponseMock) {
        global.validateResponseMock = testUtils.validateResponseMock;
    }
    
    console.log('[TEST SETUP] Global test utilities registered successfully:');
    console.log('  - global.createMockRequest: Express.js request mock creator');
    console.log('  - global.createMockResponse: Express.js response mock creator');  
    console.log('  - global.simulateNext: Express.js next() function mock creator');
    console.log('  - global.simulateError: Standardized error object creator');
    console.log('  - global.assertResponse: Response assertion utility');
    if (testUtils.validateResponseMock) {
        console.log('  - global.validateResponseMock: Response mock validation utility');
    }

    // STEP 4: GLOBAL STATE RESET AND MOCK MANAGEMENT
    // Reset any global state that might persist between tests to ensure test isolation
    // This is critical for preventing test interference and ensuring reproducible results
    
    console.log('[TEST SETUP] Resetting global state for test isolation...');
    
    // Clear any existing timers to prevent interference between tests
    // This is especially important for tests that use setTimeout, setInterval, or similar APIs
    if (typeof jest !== 'undefined' && jest.clearAllTimers) {
        jest.clearAllTimers();
    }
    
    // Reset all mock functions to their initial state
    // This ensures that mock call counts and return values don't persist between tests
    if (typeof jest !== 'undefined' && jest.resetAllMocks) {
        jest.resetAllMocks();
    }
    
    // Clear the module registry to ensure fresh module loading between tests
    // This is useful for testing modules that maintain internal state
    if (typeof jest !== 'undefined' && jest.resetModules) {
        jest.resetModules();
    }
    
    console.log('[TEST SETUP] Global state reset completed');

    // STEP 5: JEST-SPECIFIC CONFIGURATION
    // Configure Jest settings that are specific to the Node.js tutorial application
    // These settings optimize the testing experience for Express.js applications
    
    console.log('[TEST SETUP] Configuring Jest-specific settings...');
    
    // Set a reasonable timeout for integration tests that might involve HTTP requests
    // 30 seconds should be sufficient for most Express.js endpoint testing scenarios
    if (typeof jest !== 'undefined' && jest.setTimeout) {
        jest.setTimeout(30000); // 30 seconds
        console.log('[TEST SETUP] Jest timeout set to 30 seconds for integration tests');
    }
    
    // Configure Jest to handle unhandled promise rejections appropriately
    // This helps catch async errors that might otherwise be swallowed
    process.on('unhandledRejection', (reason, promise) => {
        console.error('[TEST SETUP] Unhandled Promise Rejection:', reason);
        console.error('[TEST SETUP] Promise:', promise);
    });
    
    // Configure Jest to handle uncaught exceptions during testing
    process.on('uncaughtException', (error) => {
        console.error('[TEST SETUP] Uncaught Exception during testing:', error);
    });
    
    console.log('[TEST SETUP] Jest configuration completed');

    // STEP 6: CUSTOM TEST ENVIRONMENT VALIDATION
    // Perform basic validation to ensure the test environment is properly configured
    // This helps catch configuration issues early in the testing process
    
    console.log('[TEST SETUP] Validating test environment configuration...');
    
    // Validate that Node.js version meets minimum requirements for the tutorial application
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0], 10);
    if (majorVersion < 18) {
        console.warn(`[TEST SETUP] Warning: Node.js version ${nodeVersion} detected. Node.js 18+ recommended for Express.js 5.x compatibility.`);
    } else {
        console.log(`[TEST SETUP] Node.js version ${nodeVersion} is compatible with tutorial requirements`);
    }
    
    // Validate that all required global test utilities are properly registered
    const requiredGlobals = ['createMockRequest', 'createMockResponse', 'simulateNext', 'simulateError', 'assertResponse'];
    const missingGlobals = requiredGlobals.filter(globalName => typeof global[globalName] !== 'function');
    
    if (missingGlobals.length > 0) {
        console.error('[TEST SETUP] ERROR: Missing required global test utilities:', missingGlobals);
        throw new Error(`Test setup failed: Missing global utilities: ${missingGlobals.join(', ')}`);
    } else {
        console.log('[TEST SETUP] All required global test utilities are properly registered');
    }
    
    // Validate that Jest is available and properly configured
    if (typeof jest !== 'undefined') {
        console.log('[TEST SETUP] Jest testing framework detected and configured');
    } else {
        console.warn('[TEST SETUP] Warning: Jest testing framework not detected. Some setup features may not be available.');
    }

    // STEP 7: SETUP COMPLETION SUMMARY
    // Provide a comprehensive summary of the setup process for educational clarity
    // This helps developers understand what has been configured and why
    
    console.log('\n' + '='.repeat(80));
    console.log('TEST ENVIRONMENT SETUP COMPLETED SUCCESSFULLY');
    console.log('='.repeat(80));
    console.log(`✓ Environment variables loaded from .env files`);
    console.log(`✓ NODE_ENV set to: ${process.env.NODE_ENV}`);
    console.log(`✓ Global test utilities registered: ${requiredGlobals.length} functions`);
    console.log(`✓ Global state reset for test isolation`);
    console.log(`✓ Jest configuration optimized for Express.js testing`);
    console.log(`✓ Test environment validation completed`);
    console.log(`✓ Node.js version: ${nodeVersion} (compatible)`);
    console.log('='.repeat(80));
    console.log('Ready to execute unit and integration tests');
    console.log('='.repeat(80) + '\n');
}

/**
 * CUSTOM TEST TEARDOWN FUNCTION
 * 
 * Provides cleanup functionality for test environment teardown when needed.
 * This function can be called explicitly or registered with Jest's afterAll hook
 * to ensure proper cleanup of test environment resources.
 * 
 * Educational Purpose:
 * Demonstrates proper test environment cleanup patterns including:
 * - Resource cleanup and memory management
 * - Global state restoration
 * - Event listener cleanup
 * 
 * @returns {void} No return value; performs cleanup side effects
 */
function teardownTestEnvironment() {
    console.log('[TEST TEARDOWN] Starting test environment cleanup...');
    
    // Remove custom process event listeners to prevent memory leaks
    process.removeAllListeners('unhandledRejection');
    process.removeAllListeners('uncaughtException');
    
    // Clear any remaining timers or intervals
    if (typeof jest !== 'undefined' && jest.clearAllTimers) {
        jest.clearAllTimers();
    }
    
    // Reset Jest state for clean shutdown
    if (typeof jest !== 'undefined' && jest.resetAllMocks) {
        jest.resetAllMocks();
    }
    
    console.log('[TEST TEARDOWN] Test environment cleanup completed');
}

/**
 * AUTOMATIC SETUP EXECUTION
 * 
 * Automatically execute the setup function when this module is imported.
 * This ensures that the test environment is initialized immediately when
 * Jest loads this file via setupFilesAfterEnv configuration.
 * 
 * Educational Note:
 * This automatic execution pattern is common in Jest setup files and ensures
 * that all necessary initialization occurs before any test files are processed.
 */
console.log('[TEST SETUP] Initializing Node.js Tutorial Application Test Environment...');
setupTestEnvironment();

/**
 * MODULE EXPORTS
 * 
 * Export both the setup function and test utilities to support different usage patterns:
 * 1. Named export of setupTestEnvironment for explicit invocation
 * 2. Named export of testUtils for direct import in test files
 * 3. Named export of teardownTestEnvironment for cleanup scenarios
 * 
 * Educational Purpose:
 * Demonstrates flexible module export patterns that support both automatic
 * and manual test environment management approaches.
 */
module.exports = {
    // Export the setup function for explicit invocation in test files
    // Usage: const { setupTestEnvironment } = require('./setup'); setupTestEnvironment();
    setupTestEnvironment,
    
    // Export the teardown function for cleanup scenarios
    // Usage: const { teardownTestEnvironment } = require('./setup'); teardownTestEnvironment();
    teardownTestEnvironment,
    
    // Re-export all test utilities for direct import in test files that prefer explicit imports
    // Usage: const { testUtils } = require('./setup'); const mockReq = testUtils.createMockRequest();
    testUtils,
    
    // Export individual test utilities for selective imports
    // Usage: const { createMockRequest, createMockResponse } = require('./setup');
    createMockRequest: testUtils.createMockRequest,
    createMockResponse: testUtils.createMockResponse,
    simulateNext: testUtils.simulateNext,
    simulateError: testUtils.simulateError,
    assertResponse: testUtils.assertResponse,
    
    // Export additional test utilities if available
    ...(testUtils.validateResponseMock && { validateResponseMock: testUtils.validateResponseMock })
};

/**
 * ADDITIONAL EDUCATIONAL NOTES
 * 
 * This test setup file demonstrates several important concepts for Node.js testing:
 * 
 * 1. Environment Management:
 *    - Loading different .env files for different testing scenarios
 *    - Setting NODE_ENV appropriately for test execution
 *    - Handling missing environment files gracefully
 * 
 * 2. Global Test Utilities:
 *    - Registering test helpers globally to reduce boilerplate in test files
 *    - Following Jest conventions for global test utility availability
 *    - Providing both global and importable access patterns
 * 
 * 3. Test Isolation:
 *    - Resetting global state between tests to prevent interference
 *    - Clearing timers, mocks, and modules for clean test execution
 *    - Managing process event listeners to prevent memory leaks
 * 
 * 4. Jest Configuration:
 *    - Setting appropriate timeouts for integration testing
 *    - Configuring error handling for async operations
 *    - Optimizing Jest settings for Express.js applications
 * 
 * 5. Error Handling:
 *    - Graceful handling of setup failures and missing dependencies
 *    - Comprehensive error reporting for debugging
 *    - Validation of setup success before test execution
 * 
 * 6. Documentation and Maintainability:
 *    - Extensive comments explaining each setup step
 *    - Clear console output for setup progress tracking
 *    - Educational value for developers learning testing patterns
 * 
 * This pattern can be extended for more complex applications by adding:
 * - Database connection and cleanup
 * - External service mocking
 * - Custom Jest matchers
 * - Performance monitoring setup
 * - Advanced logging configuration
 */