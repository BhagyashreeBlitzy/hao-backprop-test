/**
 * Node.js Tutorial Application - CI/CD Test Runner
 * 
 * This TypeScript script orchestrates the execution of the Node.js tutorial application's
 * test suite as part of the CI/CD pipeline. It programmatically invokes Jest using the
 * configuration from jest.config.ts, ensures the custom test environment is loaded,
 * collects and outputs test results and code coverage, and invokes the coverage-reporter.ts
 * script to enforce coverage quality gates.
 * 
 * Key Features:
 * - Programmatic Jest test execution with custom configuration
 * - Environment variable management for test mode
 * - Comprehensive test result collection and reporting
 * - Code coverage validation through coverage-reporter integration
 * - Robust error handling with appropriate CI/CD exit codes
 * - Educational clarity for demonstrating testing best practices
 * 
 * CI/CD Integration:
 * This script serves as the single entry point for automated test execution and coverage
 * validation in the CI/CD pipeline. It ensures that all tests are executed with the
 * correct configuration and environment, providing clear, actionable feedback for
 * contributors and maintainers.
 * 
 * Usage:
 * - Run via: npx ts-node src/test/ci/test-runner.ts
 * - Integrated into CI pipeline via GitHub Actions
 * - Can be executed as npm scripts for automation
 * 
 * Educational Value:
 * This script demonstrates professional practices for:
 * - Programmatic test orchestration in Node.js/TypeScript projects
 * - CI/CD integration patterns for quality assurance
 * - Test environment management and configuration
 * - Coverage validation and quality gate enforcement
 * 
 * @fileoverview CI/CD test runner for automated test execution and coverage validation
 * @author Node.js Tutorial Team
 * @version 1.0.0
 * @requires jest ^29.7.0
 * @requires ts-node latest
 */

// Import Jest's programmatic CLI interface for test execution
import { runCLI } from 'jest'; // jest@^29.7.0 - JavaScript testing framework

// Import Node.js built-in modules for path and process management
import * as path from 'path'; // Node.js built-in path utilities module
import * as process from 'process'; // Node.js built-in process module v22.x LTS

// Import Jest configuration for programmatic test execution
import jestConfig from '../../test/jest.config.ts'; // Jest configuration object with environment, coverage, and reporting settings

// Import coverage reporter for post-test coverage validation
import { main as runCoverageReporter } from './coverage-reporter.ts'; // Coverage validation and reporting functionality

/**
 * Global constants for test execution configuration.
 * These constants define the test environment and project structure.
 */
const PROJECT_ROOT: string = path.resolve(process.cwd());
const JEST_CONFIG_PATH: string = path.resolve(__dirname, '../../test/jest.config.ts');

/**
 * Type definitions for Jest test results and execution status.
 * These types ensure type safety when working with Jest's programmatic API.
 */
interface JestTestResults {
  success: boolean;
  numTotalTestSuites: number;
  numPassedTestSuites: number;
  numFailedTestSuites: number;
  numTotalTests: number;
  numPassedTests: number;
  numFailedTests: number;
  testResults: Array<{
    testFilePath: string;
    status: string;
    message: string;
  }>;
  coverageMap?: any;
}

interface TestRunnerResult {
  success: boolean;
  results: JestTestResults;
  coverageGenerated: boolean;
}

/**
 * Programmatically invokes Jest's runCLI with the imported configuration, collects test results,
 * and outputs results to the console and coverage reporters.
 * 
 * This function handles the critical task of executing the test suite programmatically, providing
 * robust error handling for test execution failures and comprehensive result reporting. It serves
 * as the primary test orchestration mechanism for CI/CD integration.
 * 
 * Key Responsibilities:
 * - Environment variable configuration for test mode
 * - Jest configuration resolution and validation
 * - Programmatic test suite execution
 * - Result collection and analysis
 * - Console output formatting for CI readability
 * 
 * @returns {Promise<TestRunnerResult>} Resolves with Jest test results object, including success/failure status and coverage output
 * @throws {Error} Exits process with code 1 if Jest execution fails or configuration is invalid
 */
async function runJestTests(): Promise<TestRunnerResult> {
  try {
    // Set NODE_ENV to 'test' to ensure all code runs in test mode
    console.log('🔧 Setting up test environment...');
    process.env.NODE_ENV = 'test';
    console.log(`   Environment: ${process.env.NODE_ENV}`);
    console.log(`   Node.js Version: ${process.version}`);
    console.log(`   Project Root: ${PROJECT_ROOT}`);
    
    // Resolve the path to the Jest configuration file
    console.log('\n📋 Loading Jest configuration...');
    console.log(`   Configuration Path: ${JEST_CONFIG_PATH}`);
    
    // Validate Jest configuration object
    if (!jestConfig) {
      console.error('❌ Error: Jest configuration could not be loaded');
      console.error('   Please ensure jest.config.ts exists and exports a valid configuration');
      process.exit(1);
    }
    
    // Display key configuration settings for CI transparency
    console.log('   Configuration Loaded Successfully:');
    console.log(`   - Test Environment: ${jestConfig.testEnvironment}`);
    console.log(`   - Coverage Collection: ${jestConfig.collectCoverage}`);
    console.log(`   - Coverage Directory: ${jestConfig.coverageDirectory}`);
    console.log(`   - Test Match Patterns: ${JSON.stringify(jestConfig.testMatch)}`);
    
    // Prepare Jest CLI options for programmatic execution
    const jestOptions = {
      projects: [PROJECT_ROOT],
      runInBand: true, // Run tests serially for consistent CI output
      verbose: true, // Detailed test output for CI logs
      colors: false, // Disable colors for clean CI logs
      coverage: jestConfig.collectCoverage,
      coverageDirectory: jestConfig.coverageDirectory,
      coverageReporters: jestConfig.coverageReporters,
      coverageThreshold: jestConfig.coverageThreshold,
      silent: false, // Allow console output from tests
      testTimeout: 10000, // 10 second timeout for individual tests
    };
    
    console.log('\n🚀 Starting Jest test execution...');
    console.log('   Test Execution Options:');
    console.log(`   - Run in Band: ${jestOptions.runInBand}`);
    console.log(`   - Verbose Output: ${jestOptions.verbose}`);
    console.log(`   - Coverage Collection: ${jestOptions.coverage}`);
    console.log(`   - Test Timeout: ${jestOptions.testTimeout}ms`);
    
    // Call runCLI from Jest with the configuration and project root
    console.log('\n⚡ Executing test suites...');
    const startTime = Date.now();
    
    const { results } = await runCLI(jestOptions, [PROJECT_ROOT]);
    
    const executionTime = Date.now() - startTime;
    console.log(`\n⏱️  Test execution completed in ${executionTime}ms`);
    
    // Process and analyze test results
    const testResults: JestTestResults = {
      success: results.success,
      numTotalTestSuites: results.numTotalTestSuites,
      numPassedTestSuites: results.numPassedTestSuites,
      numFailedTestSuites: results.numFailedTestSuites,
      numTotalTests: results.numTotalTests,
      numPassedTests: results.numPassedTests,
      numFailedTests: results.numFailedTests,
      testResults: results.testResults.map(result => ({
        testFilePath: result.testFilePath,
        status: result.status,
        message: result.message || ''
      })),
      coverageMap: results.coverageMap
    };
    
    // Display comprehensive test results summary
    console.log('\n📊 TEST EXECUTION SUMMARY');
    console.log('========================');
    console.log(`Test Suites: ${testResults.numPassedTestSuites}/${testResults.numTotalTestSuites} passed`);
    console.log(`Tests:       ${testResults.numPassedTests}/${testResults.numTotalTests} passed`);
    console.log(`Execution Time: ${executionTime}ms`);
    
    // Display individual test suite results
    if (testResults.testResults.length > 0) {
      console.log('\n📝 Individual Test Suite Results:');
      testResults.testResults.forEach((testResult, index) => {
        const status = testResult.status === 'passed' ? '✅' : '❌';
        const fileName = path.basename(testResult.testFilePath);
        console.log(`   ${status} ${fileName} - ${testResult.status}`);
        
        if (testResult.message && testResult.status !== 'passed') {
          console.log(`      Error: ${testResult.message}`);
        }
      });
    }
    
    // Determine if coverage was generated
    const coverageGenerated = testResults.success && jestConfig.collectCoverage;
    
    if (coverageGenerated) {
      console.log('\n📈 Code coverage generated successfully');
      console.log(`   Coverage reports available in: ${jestConfig.coverageDirectory}`);
    }
    
    // Return comprehensive test execution results
    return {
      success: testResults.success,
      results: testResults,
      coverageGenerated
    };
    
  } catch (error) {
    // Comprehensive error handling for Jest execution failures
    console.error('\n💥 JEST EXECUTION ERROR');
    console.error('=======================');
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    if (error instanceof Error && error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    
    console.error('\n🔧 Troubleshooting:');
    console.error('   • Ensure all test files have valid syntax');
    console.error('   • Check that jest.config.ts is properly configured');
    console.error('   • Verify that all test dependencies are installed');
    console.error('   • Run: npm install to update dependencies');
    
    // Re-throw error to be handled by main function
    throw error;
  }
}

/**
 * Main entry point for the test runner script. Orchestrates test execution and coverage
 * validation for CI/CD integration.
 * 
 * This function implements the complete test runner workflow, including Jest execution,
 * result analysis, and coverage validation. It provides comprehensive error handling
 * and appropriate exit codes for CI/CD pipeline integration.
 * 
 * The function demonstrates the standard Node.js pattern for CLI tools by using process.exit()
 * to communicate success (0) or failure (1) to the parent process, enabling proper CI/CD
 * pipeline behavior.
 * 
 * Workflow:
 * 1. Execute Jest test suites with proper configuration
 * 2. Analyze test results for failures or errors
 * 3. If tests fail, log summary and exit with failure code
 * 4. If tests pass, invoke coverage reporter for validation
 * 5. If coverage validation fails, exit with failure code
 * 6. If all validation passes, exit with success code
 * 
 * @returns {Promise<void>} Resolves if all tests and coverage pass, otherwise exits process with non-zero code
 */
async function main(): Promise<void> {
  try {
    console.log('🚀 Node.js Tutorial Application - CI/CD Test Runner');
    console.log('===================================================');
    console.log(`Started at: ${new Date().toISOString()}`);
    console.log(`Process ID: ${process.pid}`);
    console.log(`Working Directory: ${process.cwd()}\n`);
    
    // Step 1: Invoke runJestTests to execute all test suites with the correct configuration
    console.log('Step 1: Executing Jest test suites...');
    const testRunnerResult = await runJestTests();
    
    // Step 2: Check the results object for test failures or errors
    console.log('\nStep 2: Analyzing test results...');
    
    if (!testRunnerResult.success) {
      // If any test failed, log a summary and exit with code 1
      console.error('\n❌ TEST EXECUTION FAILED');
      console.error('========================');
      console.error('One or more tests failed. Build cannot proceed.');
      console.error('\n📋 Failure Summary:');
      console.error(`   Failed Test Suites: ${testRunnerResult.results.numFailedTestSuites}`);
      console.error(`   Failed Tests: ${testRunnerResult.results.numFailedTests}`);
      console.error(`   Total Test Suites: ${testRunnerResult.results.numTotalTestSuites}`);
      console.error(`   Total Tests: ${testRunnerResult.results.numTotalTests}`);
      
      // Display specific test failures for debugging
      const failedTests = testRunnerResult.results.testResults.filter(result => result.status !== 'passed');
      if (failedTests.length > 0) {
        console.error('\n🔍 Failed Test Details:');
        failedTests.forEach(test => {
          console.error(`   ❌ ${path.basename(test.testFilePath)}: ${test.message}`);
        });
      }
      
      console.error('\n💡 Next Steps:');
      console.error('   • Review test failures above');
      console.error('   • Fix failing tests before committing');
      console.error('   • Run tests locally: npm test');
      console.error('   • Check test logs for detailed error information');
      
      console.error(`\n🏁 Test Runner Failed at: ${new Date().toISOString()}`);
      process.exit(1);
    }
    
    // Step 3: If all tests passed, log success and proceed to coverage validation
    console.log('\n✅ ALL TESTS PASSED');
    console.log('===================');
    console.log('🎉 Test execution completed successfully!');
    console.log(`   Passed Test Suites: ${testRunnerResult.results.numPassedTestSuites}/${testRunnerResult.results.numTotalTestSuites}`);
    console.log(`   Passed Tests: ${testRunnerResult.results.numPassedTests}/${testRunnerResult.results.numTotalTests}`);
    
    // Step 4: If coverage was generated, invoke coverage reporter for validation
    if (testRunnerResult.coverageGenerated) {
      console.log('\nStep 3: Validating code coverage...');
      console.log('Invoking coverage reporter for quality gate validation...');
      
      try {
        // Invoke the main function from coverage-reporter.ts to validate and report code coverage
        await runCoverageReporter();
        
        // If coverage validation succeeds, the coverage reporter will exit with code 0
        // If we reach this point, coverage validation passed
        console.log('\n✅ COVERAGE VALIDATION PASSED');
        console.log('Code coverage meets all required thresholds');
        
      } catch (coverageError) {
        // If coverage validation fails, the coverage reporter will have already logged details
        // and exited with code 1, but if we catch an error here, handle it gracefully
        console.error('\n❌ COVERAGE VALIDATION FAILED');
        console.error('Coverage validation encountered an error');
        console.error(`Error: ${coverageError instanceof Error ? coverageError.message : 'Unknown coverage error'}`);
        
        console.error('\n💡 Coverage Validation Troubleshooting:');
        console.error('   • Check that coverage files were generated');
        console.error('   • Verify coverage thresholds in configuration');
        console.error('   • Review coverage report: open coverage/lcov-report/index.html');
        console.error('   • Add tests to improve coverage metrics');
        
        process.exit(1);
      }
    } else {
      console.log('\nStep 3: Skipping coverage validation (coverage collection disabled)');
      console.log('Coverage collection is not enabled in Jest configuration');
    }
    
    // Step 5: If all tests and coverage pass, log success message and exit with code 0
    console.log('\n🎊 CI/CD TEST RUNNER COMPLETE - SUCCESS');
    console.log('=======================================');
    console.log('✅ All tests passed successfully');
    console.log('✅ Code coverage validation passed');
    console.log('✅ Build is ready to proceed');
    console.log('\n📊 Final Summary:');
    console.log(`   Test Suites: ${testRunnerResult.results.numPassedTestSuites}/${testRunnerResult.results.numTotalTestSuites} passed (100%)`);
    console.log(`   Tests: ${testRunnerResult.results.numPassedTests}/${testRunnerResult.results.numTotalTests} passed (100%)`);
    console.log(`   Coverage: Validated against thresholds`);
    
    console.log(`\n🏁 Test Runner Completed Successfully at: ${new Date().toISOString()}`);
    console.log('Ready for deployment! 🚀');
    
    // Exit with success code for CI/CD
    process.exit(0);
    
  } catch (error) {
    // Comprehensive error handling for unexpected issues
    console.error('\n💥 UNEXPECTED ERROR IN TEST RUNNER');
    console.error('===================================');
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    if (error instanceof Error && error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    
    console.error('\n🔧 General Troubleshooting:');
    console.error('   • Ensure Node.js and npm are properly installed');
    console.error('   • Check that all dependencies are installed: npm install');
    console.error('   • Verify Jest configuration is valid');
    console.error('   • Run tests manually: npx jest');
    console.error('   • Review test environment setup');
    
    console.error('\n📞 Support Information:');
    console.error('   • Check project documentation for setup instructions');
    console.error('   • Review CI/CD pipeline configuration');
    console.error('   • Validate environment variables and paths');
    
    console.error(`\n🏁 Test Runner Failed with Unexpected Error at: ${new Date().toISOString()}`);
    
    // Exit with error code for CI/CD
    process.exit(1);
  }
}

// Export the main function for potential programmatic usage
export { main };

// Execute main function if script is run directly
if (require.main === module) {
  // Handle unhandled promise rejections gracefully
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    console.error('Test runner encountered an unhandled promise rejection');
    process.exit(1);
  });
  
  // Handle uncaught exceptions gracefully
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    console.error('Test runner encountered an uncaught exception');
    process.exit(1);
  });
  
  // Execute main function with error handling
  main().catch(error => {
    console.error('Fatal error in test runner main function:', error);
    process.exit(1);
  });
}