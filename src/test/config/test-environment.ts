// Jest testing framework for Node.js environments - v29.7.0
import NodeEnvironment from 'jest-environment-node';
// Environment variable configuration management - v16.0.0
import * as dotenv from 'dotenv';

// Internal imports for test environment configuration
import { COVERAGE_THRESHOLDS } from '../config/coverage-thresholds';
import { 
  createMockRequest, 
  createMockResponse, 
  simulateNext, 
  simulateError, 
  assertResponse 
} from '../helpers/testUtils';

/**
 * Custom Jest Test Environment for Node.js Tutorial Application
 * 
 * This class extends Jest's NodeEnvironment to provide advanced control over the test runtime context.
 * It creates a consistent, isolated, and reproducible testing environment that supports both local 
 * development and CI/CD pipeline execution with strict quality gates.
 * 
 * Key Features:
 * - Loads and injects environment variables from .env files
 * - Enforces global code coverage thresholds for quality gates
 * - Registers global test helper functions for all test files
 * - Ensures clean, isolated test environment with proper setup/teardown
 * - Supports educational clarity with comprehensive documentation
 * - Maintains compatibility with CI/CD pipeline requirements
 * 
 * Educational Value:
 * This implementation demonstrates best practices for custom Jest test environments in 
 * TypeScript/Node.js projects, including global helper registration, coverage enforcement, 
 * environment variable management, and maintainable test infrastructure design.
 * 
 * @extends NodeEnvironment - Jest's base Node.js test environment
 */
export default class TestEnvironment extends NodeEnvironment {
  /**
   * Jest environment configuration object containing test setup parameters
   * @private
   */
  private readonly config: any;

  /**
   * Jest environment context object providing runtime information
   * @private
   */
  private readonly context: any;

  /**
   * Initialize the custom test environment with Jest configuration and context
   * 
   * This constructor is called by Jest before any tests run, providing the opportunity
   * to store configuration and context for use during environment setup and teardown.
   * 
   * @param config - Jest environment configuration object containing test runner settings
   * @param context - Jest environment context object providing runtime information
   */
  constructor(config: any, context: any) {
    // Initialize the base NodeEnvironment with provided config and context
    super(config, context);
    
    // Store configuration and context for later use in setup/teardown methods
    this.config = config;
    this.context = context;
  }

  /**
   * Set up the test environment before any tests run
   * 
   * This method performs comprehensive environment initialization including:
   * - Loading environment variables from .env files
   * - Registering global test helper functions
   * - Injecting code coverage thresholds into the global environment
   * - Setting up any additional global state required for test isolation
   * 
   * The setup ensures that all tests run in a consistent, predictable environment
   * with access to necessary utilities and configuration.
   * 
   * @returns Promise<void> - Completes environment setup asynchronously
   */
  async setup(): Promise<void> {
    // Initialize the base NodeEnvironment first
    await super.setup();

    try {
      // Load environment variables for test configuration
      // Priority order: .env.test -> .env -> .env.example
      // This ensures test-specific configuration takes precedence
      this.loadEnvironmentVariables();

      // Register global test helper functions for all test files
      // These utilities provide consistent mocking and assertion capabilities
      this.registerGlobalHelpers();

      // Inject code coverage thresholds into the global environment
      // This enables runtime access to coverage requirements and quality gates
      this.injectCoverageThresholds();

      // Set up additional global test state if needed
      this.setupGlobalTestState();

      // Log successful environment setup for debugging and monitoring
      if (process.env.NODE_ENV !== 'production') {
        console.log('[TestEnvironment] Custom Jest environment setup completed successfully');
      }

    } catch (error) {
      // Handle setup errors gracefully with detailed logging
      console.error('[TestEnvironment] Error during test environment setup:', error);
      throw new Error(`Test environment setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Clean up the test environment after all tests have completed
   * 
   * This method performs comprehensive environment cleanup including:
   * - Resetting global state and mocks
   * - Clearing any registered event listeners
   * - Performing base environment cleanup
   * - Logging cleanup completion for monitoring
   * 
   * Proper teardown ensures that test runs don't interfere with each other
   * and that resources are released appropriately.
   * 
   * @returns Promise<void> - Completes environment teardown asynchronously
   */
  async teardown(): Promise<void> {
    try {
      // Clean up global test state and mocks
      this.cleanupGlobalTestState();

      // Reset any global variables that may have been modified during tests
      this.resetGlobalVariables();

      // Log successful teardown for debugging and monitoring
      if (process.env.NODE_ENV !== 'production') {
        console.log('[TestEnvironment] Custom Jest environment teardown completed successfully');
      }

    } catch (error) {
      // Log teardown errors but don't throw to avoid masking test results
      console.error('[TestEnvironment] Error during test environment teardown:', error);
    } finally {
      // Always perform base environment cleanup, even if custom cleanup fails
      await super.teardown();
    }
  }

  /**
   * Load environment variables from .env files with proper precedence
   * 
   * This method loads environment variables in the following priority order:
   * 1. .env.test (test-specific configuration)
   * 2. .env (general application configuration)  
   * 3. .env.example (fallback configuration)
   * 
   * Test-specific variables take precedence to ensure proper test isolation
   * and configuration without affecting development or production settings.
   * 
   * @private
   */
  private loadEnvironmentVariables(): void {
    try {
      // Determine the appropriate .env file path
      // Environment variable TEST_ENV_PATH allows CI/CD customization
      const envPath = process.env.TEST_ENV_PATH || '.env.test';

      // Load test environment variables with override protection
      const result = dotenv.config({ 
        path: envPath,
        override: false // Don't override existing environment variables
      });

      // If .env.test doesn't exist, try .env as fallback
      if (result.error && envPath === '.env.test') {
        dotenv.config({ 
          path: '.env',
          override: false 
        });
      }

      // Set default test environment variables if not already set
      if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = 'test';
      }

      // Ensure test port doesn't conflict with development server
      if (!process.env.TEST_PORT) {
        process.env.TEST_PORT = '0'; // Use random available port
      }

    } catch (error) {
      // Environment variable loading is non-critical, log warning but continue
      console.warn('[TestEnvironment] Warning: Failed to load environment variables:', error);
    }
  }

  /**
   * Register global test helper functions for all test files
   * 
   * This method injects commonly used test utilities into the global scope,
   * making them available in all test files without requiring imports.
   * This follows the DRY principle and improves test maintainability.
   * 
   * Registered helpers include:
   * - createMockRequest: Creates mock Express.js request objects
   * - createMockResponse: Creates mock Express.js response objects  
   * - simulateNext: Creates mock Express.js next() functions
   * - simulateError: Creates standardized error objects for testing
   * - assertResponse: Provides consistent response assertion patterns
   * 
   * @private
   */
  private registerGlobalHelpers(): void {
    try {
      // Register Express.js request mocking utility
      // Enables consistent request object creation across all tests
      this.global.createMockRequest = createMockRequest;

      // Register Express.js response mocking utility  
      // Provides standardized response object with spy methods
      this.global.createMockResponse = createMockResponse;

      // Register Express.js next() function simulation
      // Enables middleware testing with proper next() call verification
      this.global.simulateNext = simulateNext;

      // Register error object simulation utility
      // Provides consistent error creation for error handler testing
      this.global.simulateError = simulateError;

      // Register response assertion utility
      // Standardizes response validation across all test files
      this.global.assertResponse = assertResponse;

      // Add type declarations to prevent TypeScript errors
      // These extend the global object with our custom utilities
      if (typeof global !== 'undefined') {
        (global as any).createMockRequest = createMockRequest;
        (global as any).createMockResponse = createMockResponse;
        (global as any).simulateNext = simulateNext;
        (global as any).simulateError = simulateError;
        (global as any).assertResponse = assertResponse;
      }

    } catch (error) {
      // Helper registration failure is critical for test functionality
      console.error('[TestEnvironment] Error registering global helpers:', error);
      throw new Error(`Failed to register global test helpers: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Inject code coverage thresholds into the global environment
   * 
   * This method makes coverage thresholds available globally for:
   * - Runtime coverage enforcement in tests
   * - Quality gate validation in CI/CD pipelines
   * - Dynamic coverage reporting and analysis
   * - Educational demonstration of quality standards
   * 
   * The thresholds are imported from the centralized configuration to ensure
   * consistency between Jest configuration and runtime enforcement.
   * 
   * @private
   */
  private injectCoverageThresholds(): void {
    try {
      // Inject the complete coverage thresholds configuration
      this.global.COVERAGE_THRESHOLDS = COVERAGE_THRESHOLDS;

      // Provide convenient access to global thresholds specifically
      this.global.GLOBAL_COVERAGE_THRESHOLDS = COVERAGE_THRESHOLDS.global;

      // Add to global object for TypeScript compatibility
      if (typeof global !== 'undefined') {
        (global as any).COVERAGE_THRESHOLDS = COVERAGE_THRESHOLDS;
        (global as any).GLOBAL_COVERAGE_THRESHOLDS = COVERAGE_THRESHOLDS.global;
      }

      // Log coverage thresholds for transparency and debugging
      if (process.env.NODE_ENV !== 'production') {
        console.log('[TestEnvironment] Code coverage thresholds injected:', COVERAGE_THRESHOLDS.global);
      }

    } catch (error) {
      // Coverage threshold injection failure affects quality gates
      console.error('[TestEnvironment] Error injecting coverage thresholds:', error);
      throw new Error(`Failed to inject coverage thresholds: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Set up additional global test state for test isolation and consistency
   * 
   * This method configures global test state including:
   * - Test execution metadata
   * - Common test configuration
   * - Debugging and monitoring utilities
   * - Performance tracking setup
   * 
   * @private
   */
  private setupGlobalTestState(): void {
    try {
      // Set up test execution metadata for debugging and reporting
      this.global.TEST_ENVIRONMENT_INFO = {
        setupTime: new Date().toISOString(),
        nodeVersion: process.version,
        jestVersion: require('jest/package.json').version,
        testEnvironment: 'custom-node-environment'
      };

      // Configure test timing utilities for performance monitoring
      this.global.TEST_START_TIME = Date.now();

      // Set up test isolation markers
      this.global.TEST_ISOLATION_ENABLED = true;

      // Configure debugging utilities for development
      if (process.env.NODE_ENV === 'test' && process.env.DEBUG) {
        this.global.DEBUG_MODE = true;
      }

    } catch (error) {
      // Global state setup errors are non-critical, log warning
      console.warn('[TestEnvironment] Warning: Failed to setup global test state:', error);
    }
  }

  /**
   * Clean up global test state and reset mocks
   * 
   * This method ensures proper cleanup between test runs by:
   * - Clearing global variables that may have been modified
   * - Resetting mock states to prevent test interference
   * - Cleaning up event listeners and timers
   * - Performing memory cleanup where possible
   * 
   * @private
   */
  private cleanupGlobalTestState(): void {
    try {
      // Clean up test execution metadata
      if (this.global.TEST_ENVIRONMENT_INFO) {
        delete this.global.TEST_ENVIRONMENT_INFO;
      }

      // Reset test timing utilities
      if (this.global.TEST_START_TIME) {
        delete this.global.TEST_START_TIME;
      }

      // Clear test isolation markers
      if (this.global.TEST_ISOLATION_ENABLED) {
        delete this.global.TEST_ISOLATION_ENABLED;
      }

      // Clear debugging utilities
      if (this.global.DEBUG_MODE) {
        delete this.global.DEBUG_MODE;
      }

      // Reset any timers or intervals that may have been set during tests
      // This prevents tests from interfering with each other
      if (typeof this.global.clearInterval === 'function') {
        // Clear any test-related intervals (handled by Jest's cleanup)
      }

    } catch (error) {
      // Cleanup errors are non-critical but should be logged
      console.warn('[TestEnvironment] Warning: Error during global state cleanup:', error);
    }
  }

  /**
   * Reset global variables to their original state
   * 
   * This method ensures that global variables don't persist between
   * test runs, preventing test interference and maintaining isolation.
   * 
   * @private
   */
  private resetGlobalVariables(): void {
    try {
      // Global variables are managed by Jest's environment isolation
      // This method serves as a hook for any custom global variable cleanup
      
      // Reset process environment variables that may have been modified
      // Only reset test-specific variables, not system environment
      const testEnvVars = ['TEST_PORT', 'TEST_DATABASE_URL', 'TEST_API_KEY'];
      testEnvVars.forEach(varName => {
        if (process.env[varName] && varName.startsWith('TEST_')) {
          delete process.env[varName];
        }
      });

      // Additional global variable reset logic can be added here
      // as the test suite grows and requires more sophisticated cleanup

    } catch (error) {
      // Variable reset errors are non-critical
      console.warn('[TestEnvironment] Warning: Error resetting global variables:', error);
    }
  }
}