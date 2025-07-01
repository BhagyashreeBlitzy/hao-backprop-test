/**
 * Orchestrator Script for Node.js/Express.js Tutorial Test Suite Execution
 * 
 * This script provides a comprehensive test automation orchestrator that executes all
 * test phases (unit, integration, and coverage) in a single coordinated workflow.
 * It is designed to be the primary entry point for complete test validation,
 * suitable for local development, CI/CD pipelines, and automated quality assurance.
 * 
 * The orchestrator sequentially invokes specialized test runner scripts, ensuring
 * that all test types are executed in the correct order with proper error handling,
 * comprehensive logging, and appropriate process exit codes. It provides a unified
 * interface for test execution while maintaining the modularity of individual test
 * phase scripts.
 * 
 * Features:
 * - Sequential execution of unit tests, integration tests, and coverage generation
 * - Comprehensive error handling with detailed failure reporting
 * - Real-time progress tracking and execution summaries
 * - Cross-platform compatibility (Windows, macOS, Linux)
 * - CI/CD pipeline integration with proper exit codes
 * - Both programmatic usage and CLI execution support
 * - Robust process management and resource cleanup
 * - Detailed logging for debugging and monitoring
 * 
 * Usage:
 * - Direct execution: node run-all-tests.js
 * - Programmatic: const { runAllTests } = require('./run-all-tests')
 * - NPM script: npm run test:all (references this script)
 * - CI/CD: Single command for complete test validation
 * 
 * Dependencies:
 * - ./run-unit-tests.js (unit test execution)
 * - ./run-integration-tests.js (integration test execution)
 * - ./generate-coverage-report.js (coverage report generation)
 * - Node.js 18+ (required for Express.js 5.1.0 compatibility)
 * 
 * @fileOverview Complete test suite orchestration for Node.js/Express.js tutorial
 * @author Tutorial Development Team
 * @version 1.0.0
 * @since Node.js 18+
 */

// Import Node.js built-in modules for process control and logging
const process = require('node:process'); // builtin - Process control, exit codes, and environment variables
const console = require('node:console'); // builtin - Enhanced console logging and output formatting

// Import individual test phase execution functions
const { runUnitTests } = require('./run-unit-tests.js'); // Unit test execution with Jest
const { runIntegrationTests } = require('./run-integration-tests.js'); // Integration test execution with Jest  
const { generateCoverageReport } = require('./generate-coverage-report.js'); // Coverage report generation with Jest

// Global constants for process exit codes
// These constants ensure consistent exit code handling across all test phases
const EXIT_SUCCESS = 0; // Standard success exit code for successful test completion
const EXIT_FAILURE = 1; // Standard failure exit code for test failures or errors

/**
 * Orchestrates the execution of all test phases (unit, integration, coverage) in sequence.
 * 
 * This function implements a comprehensive test automation workflow that:
 * 1. Displays a startup banner with execution information
 * 2. Sequentially executes unit tests, integration tests, and coverage generation
 * 3. Handles errors at each phase with detailed reporting and immediate failure
 * 4. Provides progress tracking and execution summaries
 * 5. Implements proper cleanup and resource management
 * 6. Exits with appropriate status codes for CI/CD integration
 * 
 * The orchestrator ensures that all test phases are executed in the optimal order:
 * - Unit tests first (fastest feedback, fundamental validation)
 * - Integration tests second (higher-level system validation)
 * - Coverage generation last (comprehensive reporting across all test types)
 * 
 * Each phase must complete successfully before proceeding to the next phase.
 * Any failure in a phase immediately terminates the orchestration with detailed
 * error reporting and appropriate exit codes.
 * 
 * @async
 * @function runAllTests
 * @returns {Promise<void>} Resolves when all test phases complete successfully,
 *                          rejects or exits with error code on any phase failure
 * @throws {Error} Throws error for test phase failures or orchestration issues
 * 
 * @example
 * // Programmatic usage
 * const { runAllTests } = require('./run-all-tests');
 * try {
 *   await runAllTests();
 *   console.log('All tests completed successfully');
 * } catch (error) {
 *   console.error('Test execution failed:', error.message);
 * }
 * 
 * @example
 * // CLI usage
 * node run-all-tests.js
 * 
 * @example
 * // NPM script usage
 * npm run test:all
 */
async function runAllTests() {
  // Record start time for execution duration tracking
  const startTime = Date.now();
  
  try {
    // Step 1: Print startup banner and execution information
    console.log('🎯 Node.js/Express.js Tutorial - Complete Test Suite Orchestrator');
    console.log('================================================================');
    console.log('');
    console.log('📋 Test Execution Plan:');
    console.log('   1️⃣  Unit Tests        - Fast, isolated component validation');
    console.log('   2️⃣  Integration Tests - End-to-end system behavior validation');
    console.log('   3️⃣  Coverage Reports  - Comprehensive code quality analysis');
    console.log('');
    console.log('🌍 Environment Information:');
    console.log(`   Node.js Version: ${process.version}`);
    console.log(`   Platform: ${process.platform}`);
    console.log(`   Architecture: ${process.arch}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Working Directory: ${process.cwd()}`);
    console.log('');
    console.log('🚀 Starting complete test suite execution...');
    console.log('');

    // Step 2: Execute Unit Tests Phase
    console.log('=== PHASE 1: UNIT TESTS ===');
    console.log('🧪 Executing unit test suite...');
    console.log('   Purpose: Validate individual components and functions');
    console.log('   Scope: Isolated unit-level functionality testing');
    console.log('   Framework: Jest with Supertest for HTTP endpoint testing');
    console.log('');
    
    try {
      await runUnitTests();
      console.log('');
      console.log('✅ Unit Tests Phase: SUCCESS');
      console.log('   All unit tests passed successfully');
      console.log('   Component-level validation completed');
      console.log('');
    } catch (unitTestError) {
      // Handle unit test failures with detailed error reporting
      console.error('');
      console.error('❌ Unit Tests Phase: FAILED');
      console.error('   Unit test execution encountered failures');
      console.error(`   Error Details: ${unitTestError.message}`);
      console.error('');
      console.error('🔍 Unit Test Failure Analysis:');
      console.error('   • Check individual test case implementations');
      console.error('   • Verify component logic and expected behaviors');
      console.error('   • Review test assertions and mock configurations');
      console.error('   • Ensure test environment setup is correct');
      console.error('');
      console.error('💡 Recommended Actions:');
      console.error('   1. Run unit tests individually: npm run test:unit');
      console.error('   2. Check Jest configuration in jest.config.js');
      console.error('   3. Review failing test output for specific issues');
      console.error('   4. Fix identified issues before retrying');
      console.error('');
      console.error('❌ TEST SUITE EXECUTION TERMINATED - Unit Tests Failed');
      
      // Exit with failure code for script usage
      if (require.main === module) {
        process.exit(EXIT_FAILURE);
      }
      
      // Re-throw error for programmatic usage
      throw new Error(`Unit tests failed: ${unitTestError.message}`);
    }

    // Step 3: Execute Integration Tests Phase
    console.log('=== PHASE 2: INTEGRATION TESTS ===');
    console.log('🔗 Executing integration test suite...');
    console.log('   Purpose: Validate end-to-end system behavior and interactions');
    console.log('   Scope: HTTP request-response cycles and routing logic');
    console.log('   Framework: Jest with Supertest for API integration testing');
    console.log('');
    
    try {
      await runIntegrationTests();
      console.log('');
      console.log('✅ Integration Tests Phase: SUCCESS');
      console.log('   All integration tests passed successfully');
      console.log('   System-level validation completed');
      console.log('');
    } catch (integrationTestError) {
      // Handle integration test failures with detailed error reporting
      console.error('');
      console.error('❌ Integration Tests Phase: FAILED');
      console.error('   Integration test execution encountered failures');
      console.error(`   Error Details: ${integrationTestError.message}`);
      console.error('');
      console.error('🔍 Integration Test Failure Analysis:');
      console.error('   • Check HTTP endpoint implementations and routing');
      console.error('   • Verify Express.js application configuration');
      console.error('   • Review request-response handling logic');
      console.error('   • Ensure server startup and shutdown processes');
      console.error('');
      console.error('💡 Recommended Actions:');
      console.error('   1. Run integration tests individually: npm run test:integration');
      console.error('   2. Test HTTP endpoints manually with curl or Postman');
      console.error('   3. Check Express.js application and route configurations');
      console.error('   4. Review server logs for runtime errors');
      console.error('');
      console.error('❌ TEST SUITE EXECUTION TERMINATED - Integration Tests Failed');
      
      // Exit with failure code for script usage
      if (require.main === module) {
        process.exit(EXIT_FAILURE);
      }
      
      // Re-throw error for programmatic usage
      throw new Error(`Integration tests failed: ${integrationTestError.message}`);
    }

    // Step 4: Execute Coverage Report Generation Phase
    console.log('=== PHASE 3: COVERAGE REPORT GENERATION ===');
    console.log('📊 Generating comprehensive coverage reports...');
    console.log('   Purpose: Analyze code coverage across all test types');
    console.log('   Scope: Unit and integration test coverage analysis');
    console.log('   Output: HTML reports, LCOV data, and summary statistics');
    console.log('');
    
    try {
      await generateCoverageReport();
      console.log('');
      console.log('✅ Coverage Report Generation Phase: SUCCESS');
      console.log('   Coverage reports generated successfully');
      console.log('   Code quality analysis completed');
      console.log('');
    } catch (coverageError) {
      // Handle coverage generation failures with detailed error reporting
      console.error('');
      console.error('❌ Coverage Report Generation Phase: FAILED');
      console.error('   Coverage report generation encountered errors');
      console.error(`   Error Details: ${coverageError.message}`);
      console.error('');
      console.error('🔍 Coverage Generation Failure Analysis:');
      console.error('   • Check Jest configuration for coverage settings');
      console.error('   • Verify coverage collection patterns and thresholds');
      console.error('   • Ensure proper file permissions for report output');
      console.error('   • Review Jest CLI execution and dependency availability');
      console.error('');
      console.error('💡 Recommended Actions:');
      console.error('   1. Run coverage generation individually: npm run test:coverage');
      console.error('   2. Check Jest configuration in jest.config.js');
      console.error('   3. Verify write permissions for coverage directory');
      console.error('   4. Ensure Jest and related dependencies are installed');
      console.error('');
      console.error('❌ TEST SUITE EXECUTION TERMINATED - Coverage Generation Failed');
      
      // Exit with failure code for script usage
      if (require.main === module) {
        process.exit(EXIT_FAILURE);
      }
      
      // Re-throw error for programmatic usage
      throw new Error(`Coverage generation failed: ${coverageError.message}`);
    }

    // Step 5: Calculate execution duration and display final success summary
    const endTime = Date.now();
    const executionDuration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('================================================================');
    console.log('🎉 COMPLETE TEST SUITE EXECUTION: SUCCESS');
    console.log('================================================================');
    console.log('');
    console.log('📊 Final Execution Summary:');
    console.log('   ✅ Unit Tests: PASSED - Component validation successful');
    console.log('   ✅ Integration Tests: PASSED - System validation successful');
    console.log('   ✅ Coverage Reports: GENERATED - Quality analysis completed');
    console.log(`   ⏱️  Total Execution Time: ${executionDuration} seconds`);
    console.log('');
    console.log('🚀 Quality Assurance Results:');
    console.log('   • All test phases completed successfully');
    console.log('   • Code quality gates satisfied');
    console.log('   • Application ready for deployment');
    console.log('   • CI/CD pipeline validation passed');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('   • Review coverage reports in coverage/index.html');
    console.log('   • Check detailed test output for any warnings');
    console.log('   • Proceed with application deployment or integration');
    console.log('   • Monitor application performance in target environment');
    console.log('');
    console.log('🎯 Test Suite Orchestration Completed Successfully!');
    console.log('');

    // Exit with success code for script usage
    if (require.main === module) {
      process.exit(EXIT_SUCCESS);
    }
    
    // Resolve promise for programmatic usage
    return;
    
  } catch (error) {
    // Handle uncaught exceptions during test orchestration
    const endTime = Date.now();
    const executionDuration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.error('');
    console.error('================================================================');
    console.error('💥 COMPLETE TEST SUITE EXECUTION: CRITICAL FAILURE');
    console.error('================================================================');
    console.error('');
    console.error('❌ Orchestration Error Details:');
    console.error(`   Error Message: ${error.message}`);
    console.error(`   Execution Duration: ${executionDuration} seconds`);
    console.error(`   Failure Point: Test phase orchestration`);
    console.error('');
    
    // Display stack trace in development environment
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG) {
      console.error('🐛 Debug Information:');
      console.error(`   Stack Trace: ${error.stack}`);
      console.error(`   Error Code: ${error.code || 'UNKNOWN'}`);
      console.error('');
    }
    
    console.error('🔧 Troubleshooting Recommendations:');
    console.error('   1. Check Node.js version compatibility (18+ required)');
    console.error('   2. Verify all test dependencies are installed');
    console.error('   3. Ensure Jest configuration is valid');
    console.error('   4. Check file permissions and accessibility');
    console.error('   5. Review system resources and available memory');
    console.error('');
    console.error('🆘 Support Resources:');
    console.error('   • Run individual test phases for isolated debugging');
    console.error('   • Check Jest documentation for configuration issues');
    console.error('   • Review Node.js and Express.js compatibility requirements');
    console.error('   • Enable debug mode with NODE_ENV=development');
    console.error('');
    console.error('❌ Test Suite Orchestration Failed - Please Address Issues Above');
    console.error('');

    // Exit with failure code for script usage
    if (require.main === module) {
      process.exit(EXIT_FAILURE);
    }
    
    // Re-throw error for programmatic usage
    throw error;
  }
}

/**
 * Handles uncaught exceptions and unhandled promise rejections.
 * 
 * This function provides a safety net for unexpected errors that might occur
 * during test orchestration, ensuring graceful failure with appropriate logging
 * and exit codes.
 * 
 * @private
 * @function handleUnexpectedErrors
 * @returns {void} No return value, handles process-level error events
 */
function handleUnexpectedErrors() {
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('');
    console.error('💥 UNCAUGHT EXCEPTION - Test Orchestration Critical Error');
    console.error('================================================================');
    console.error(`Error: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    console.error('');
    console.error('This is a critical error that requires immediate attention.');
    console.error('Please review the error details and fix the underlying issue.');
    console.error('');
    process.exit(EXIT_FAILURE);
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('');
    console.error('💥 UNHANDLED PROMISE REJECTION - Test Orchestration Error');
    console.error('================================================================');
    console.error(`Rejection Reason: ${reason}`);
    console.error(`Promise: ${promise}`);
    console.error('');
    console.error('An asynchronous operation failed without proper error handling.');
    console.error('Please review the promise chain and add appropriate error handling.');
    console.error('');
    process.exit(EXIT_FAILURE);
  });
}

// Script entry point: Execute runAllTests when run directly
if (require.main === module) {
  // Initialize unexpected error handling
  handleUnexpectedErrors();
  
  // Display CLI mode banner
  console.log('🎯 Test Suite Orchestrator - CLI Mode');
  console.log('This script executes all test phases for complete validation');
  console.log('');
  
  // Execute complete test suite with error handling
  runAllTests().catch((error) => {
    // Additional error handling for CLI mode
    console.error('❌ CLI execution failed with error:', error.message);
    
    // Provide CLI-specific guidance
    console.error('');
    console.error('💡 CLI Usage Tips:');
    console.error('   • Use --verbose flag for detailed output');
    console.error('   • Set DEBUG=true for additional debugging information');
    console.error('   • Check individual test phases: npm run test:unit, test:integration');
    console.error('   • Review Jest configuration and dependencies');
    console.error('');
    
    process.exit(EXIT_FAILURE);
  });
}

// Export the main function for programmatic usage
module.exports = {
  runAllTests
};

/**
 * Integration and Usage Examples:
 * 
 * 1. NPM Script Integration (package.json):
 *    "scripts": {
 *      "test:all": "node src/test/scripts/run-all-tests.js",
 *      "test": "npm run test:all"
 *    }
 * 
 * 2. CI/CD Pipeline Integration (.github/workflows/ci.yml):
 *    - name: Run Complete Test Suite
 *      run: npm run test:all
 * 
 * 3. Programmatic Usage:
 *    const { runAllTests } = require('./run-all-tests');
 *    try {
 *      await runAllTests();
 *      console.log('All tests completed successfully');
 *    } catch (error) {
 *      console.error('Tests failed:', error.message);
 *      process.exit(1);
 *    }
 * 
 * 4. Local Development Workflow:
 *    # Complete test validation
 *    node src/test/scripts/run-all-tests.js
 *    
 *    # Individual phase testing
 *    node src/test/scripts/run-unit-tests.js
 *    node src/test/scripts/run-integration-tests.js
 *    node src/test/scripts/generate-coverage-report.js
 * 
 * 5. Cross-Platform Execution:
 *    Windows: node src\test\scripts\run-all-tests.js
 *    macOS/Linux: node src/test/scripts/run-all-tests.js
 * 
 * Quality Assurance Features:
 * - Sequential execution ensures proper test phase dependencies
 * - Comprehensive error handling with detailed failure analysis
 * - Progress tracking and execution summaries for monitoring
 * - Robust process management with proper exit codes
 * - Cross-platform compatibility with consistent behavior
 * - CI/CD integration with quality gate enforcement
 * - Detailed logging for debugging and troubleshooting
 * - Resource cleanup and process termination handling
 * 
 * Performance Characteristics:
 * - Optimal execution order (unit → integration → coverage)
 * - Fail-fast behavior for immediate feedback on issues
 * - Efficient resource utilization through sequential execution
 * - Minimal overhead from orchestration logic
 * - Scalable architecture for additional test phases
 * 
 * Extensibility Options:
 * - Additional test phases can be easily integrated
 * - Custom reporting and notification systems
 * - Integration with external quality assurance tools
 * - Support for parallel execution strategies
 * - Enhanced monitoring and metrics collection
 */