/**
 * Test and Coverage Validation Script for Node.js Tutorial Application
 * 
 * This Node.js script validates that all tests have passed and that code coverage thresholds 
 * are met after test execution. It serves as a critical quality gate in both local development 
 * and CI/CD environments, ensuring that code changes meet the project's quality standards 
 * before being merged or deployed.
 * 
 * Key Features:
 * - Reads and validates Jest test results from jest-results.json
 * - Enforces minimum coverage requirements as defined in project configuration
 * - Provides detailed, color-coded console output for CI log readability
 * - Fails the build if any test fails or if coverage is insufficient
 * - Integrates with existing coverage reporting infrastructure
 * - Designed for robust, educationally clear, and production-ready quality gate enforcement
 * 
 * Usage:
 * - Run as: node validate-tests.js
 * - Typically invoked by test orchestration scripts (run-tests.sh, generate-coverage.sh)
 * - Supports both local development and CI/CD pipeline integration
 * 
 * Educational Value:
 * This script demonstrates professional practices for:
 * - Automated test and coverage validation in Node.js/TypeScript projects
 * - Quality gate implementation and enforcement
 * - CI/CD pipeline integration patterns
 * - Error handling and process management
 * - Educational clarity in code structure and documentation
 */

// External dependencies
const fs = require('fs'); // Node.js built-in file system module
const path = require('path'); // Node.js built-in path utilities module
const process = require('process'); // Node.js built-in process module v22.x LTS
const chalk = require('chalk'); // chalk@^5.3.0 - Terminal string styling library

// Internal dependencies
const { main: coverageReporterMain } = require('../ci/coverage-reporter.ts');

/**
 * Global constants for test results and coverage file paths.
 * These paths follow Jest's default output structure and are used throughout
 * the validation process to locate and read test execution artifacts.
 */
const JEST_RESULTS_PATH = path.resolve(process.cwd(), 'coverage', 'jest-results.json');
const COVERAGE_SUMMARY_PATH = path.resolve(process.cwd(), 'coverage', 'coverage-summary.json');

/**
 * Reads and parses the Jest test results file (jest-results.json) to determine if all tests passed.
 * 
 * This function handles the critical task of loading Jest test execution data, providing
 * robust error handling for missing or malformed test result files. It serves as the
 * primary data source for test validation operations and ensures the build fails
 * gracefully if test results are not available.
 * 
 * @returns {object} Parsed Jest test results object, including success/failure status and summary
 * @throws {Error} Exits process with code 1 if test results file is missing or invalid
 */
function readTestResults() {
  try {
    // Check if Jest test results file exists
    if (!fs.existsSync(JEST_RESULTS_PATH)) {
      console.error(chalk.red('❌ Error: Jest test results file not found'));
      console.error(chalk.red(`   Expected path: ${JEST_RESULTS_PATH}`));
      console.error(chalk.yellow('   Make sure to run tests before running this validation script'));
      console.error(chalk.yellow('   Example: npm test'));
      process.exit(1);
    }

    // Read and parse the Jest test results file
    console.log(chalk.blue('📋 Reading Jest test results from:'));
    console.log(chalk.gray(`   ${JEST_RESULTS_PATH}`));
    
    const fileContents = fs.readFileSync(JEST_RESULTS_PATH, 'utf8');
    const testResults = JSON.parse(fileContents);
    
    // Validate that the test results have the expected structure
    if (!testResults || typeof testResults !== 'object') {
      console.error(chalk.red('❌ Error: Invalid Jest test results format'));
      console.error(chalk.red('   Test results file is missing required structure'));
      process.exit(1);
    }
    
    console.log(chalk.green('✅ Jest test results loaded successfully'));
    return testResults;
    
  } catch (error) {
    console.error(chalk.red('❌ Error: Failed to read Jest test results'));
    console.error(chalk.red(`   ${error instanceof Error ? error.message : 'Unknown error'}`));
    console.error(chalk.yellow('   Please ensure Jest tests have been executed'));
    console.error(chalk.yellow('   Example: npm test'));
    process.exit(1);
  }
}

/**
 * Checks the parsed Jest test results for any failed tests or errors.
 * 
 * This function implements the core test validation logic, analyzing Jest test results
 * to determine if all tests passed successfully. It examines test suite results,
 * individual test outcomes, and overall execution status to provide comprehensive
 * validation feedback.
 * 
 * @param {object} testResults - Parsed Jest test results object from readTestResults()
 * @returns {object} Result object with pass/fail status and details of any failed tests
 */
function validateTestResults(testResults) {
  try {
    // Initialize validation result structure
    const validationResult = {
      passed: true,
      failedTests: [],
      totalTests: 0,
      passedTests: 0,
      failedTestCount: 0,
      skippedTests: 0,
      testSuites: 0,
      failedSuites: 0
    };

    // Extract test statistics from Jest results
    // Jest results structure may vary, so we handle multiple possible formats
    if (testResults.numTotalTests !== undefined) {
      validationResult.totalTests = testResults.numTotalTests || 0;
      validationResult.passedTests = testResults.numPassedTests || 0;
      validationResult.failedTestCount = testResults.numFailedTests || 0;
      validationResult.skippedTests = testResults.numPendingTests || 0;
    }

    if (testResults.numTotalTestSuites !== undefined) {
      validationResult.testSuites = testResults.numTotalTestSuites || 0;
      validationResult.failedSuites = testResults.numFailedTestSuites || 0;
    }

    // Check for test failures
    const hasFailedTests = validationResult.failedTestCount > 0;
    const hasFailedSuites = validationResult.failedSuites > 0;
    const overallSuccess = testResults.success === true || (!hasFailedTests && !hasFailedSuites);

    // Collect details of failed tests if available
    if (testResults.testResults && Array.isArray(testResults.testResults)) {
      testResults.testResults.forEach(testSuite => {
        if (testSuite.status === 'failed' || testSuite.numFailingTests > 0) {
          validationResult.failedTests.push({
            testSuite: testSuite.name || 'Unknown suite',
            failureMessage: testSuite.failureMessage || 'No failure message available',
            numFailingTests: testSuite.numFailingTests || 0
          });
        }
      });
    }

    // Determine overall validation result
    validationResult.passed = overallSuccess && !hasFailedTests && !hasFailedSuites;

    console.log(chalk.blue('\n🔍 Test Results Validation:'));
    console.log(chalk.gray(`   Total Tests: ${validationResult.totalTests}`));
    console.log(chalk.gray(`   Passed Tests: ${validationResult.passedTests}`));
    console.log(chalk.gray(`   Failed Tests: ${validationResult.failedTestCount}`));
    console.log(chalk.gray(`   Skipped Tests: ${validationResult.skippedTests}`));
    console.log(chalk.gray(`   Test Suites: ${validationResult.testSuites}`));
    console.log(chalk.gray(`   Failed Suites: ${validationResult.failedSuites}`));

    return validationResult;

  } catch (error) {
    console.error(chalk.red('❌ Error: Failed to validate test results'));
    console.error(chalk.red(`   ${error instanceof Error ? error.message : 'Unknown error'}`));
    
    // Return a failed validation result
    return {
      passed: false,
      failedTests: [{ 
        testSuite: 'Validation Error', 
        failureMessage: error instanceof Error ? error.message : 'Unknown validation error',
        numFailingTests: 1
      }],
      totalTests: 0,
      passedTests: 0,
      failedTestCount: 1,
      skippedTests: 0,
      testSuites: 0,
      failedSuites: 1
    };
  }
}

/**
 * Outputs a formatted test results report to the console, highlighting pass/fail status and summary statistics.
 * 
 * This function provides comprehensive, human-readable test reporting with color-coded
 * output optimized for CI logs. It displays test execution statistics, failure details,
 * and actionable guidance for developers to address any test failures.
 * 
 * @param {object} testResults - Original Jest test results object
 * @param {object} validationResult - Validation result from validateTestResults()
 * @returns {void} Prints the report to stdout
 */
function printTestResultsReport(testResults, validationResult) {
  console.log(chalk.blue('\n📊 TEST RESULTS REPORT'));
  console.log(chalk.blue('====================='));
  
  // Display test execution summary
  console.log(chalk.blue('\nTest Execution Summary:'));
  console.log(chalk.gray(`   Total Test Suites: ${validationResult.testSuites}`));
  console.log(chalk.gray(`   Total Tests: ${validationResult.totalTests}`));
  
  // Display test results with color coding
  if (validationResult.passedTests > 0) {
    console.log(chalk.green(`   ✅ Passed Tests: ${validationResult.passedTests}`));
  }
  
  if (validationResult.failedTestCount > 0) {
    console.log(chalk.red(`   ❌ Failed Tests: ${validationResult.failedTestCount}`));
  }
  
  if (validationResult.skippedTests > 0) {
    console.log(chalk.yellow(`   ⏭️  Skipped Tests: ${validationResult.skippedTests}`));
  }

  // Display suite-level results
  if (validationResult.failedSuites > 0) {
    console.log(chalk.red(`   ❌ Failed Test Suites: ${validationResult.failedSuites}`));
  }

  // Display overall test status
  console.log(chalk.blue('\nOverall Test Status:'));
  if (validationResult.passed) {
    console.log(chalk.green('   🎉 SUCCESS: All tests passed!'));
    console.log(chalk.green('   ✨ Your code maintains excellent test coverage and quality.'));
    
    // Display execution time if available
    if (testResults.startTime && testResults.endTime) {
      const executionTime = testResults.endTime - testResults.startTime;
      console.log(chalk.gray(`   ⏱️  Execution Time: ${executionTime}ms`));
    }
  } else {
    console.log(chalk.red('   ❌ FAILURE: Some tests failed'));
    console.log(chalk.red(`   📉 ${validationResult.failedTestCount} test(s) did not pass`));
    
    // Display detailed failure information
    if (validationResult.failedTests.length > 0) {
      console.log(chalk.red('\n💥 Failed Test Details:'));
      validationResult.failedTests.forEach((failure, index) => {
        console.log(chalk.red(`   ${index + 1}. ${failure.testSuite}`));
        if (failure.numFailingTests > 0) {
          console.log(chalk.red(`      • ${failure.numFailingTests} failing test(s)`));
        }
        if (failure.failureMessage) {
          // Display first few lines of failure message to avoid overwhelming output
          const messageLines = failure.failureMessage.split('\n').slice(0, 3);
          messageLines.forEach(line => {
            if (line.trim()) {
              console.log(chalk.red(`      • ${line.trim()}`));
            }
          });
        }
      });
    }
    
    console.log(chalk.yellow('\n💡 To fix test failures:'));
    console.log(chalk.yellow('   • Review the failing test cases above'));
    console.log(chalk.yellow('   • Run tests individually: npm test -- --testNamePattern="test name"'));
    console.log(chalk.yellow('   • Check your code changes against test expectations'));
    console.log(chalk.yellow('   • Update tests if requirements have changed'));
  }
  
  // Additional information for CI/CD
  console.log(chalk.blue('\n🔧 Test Execution Details:'));
  console.log(chalk.gray(`   Results file: ${JEST_RESULTS_PATH}`));
  console.log(chalk.gray(`   Generated: ${new Date().toISOString()}`));
  
  // Display Jest version if available
  if (testResults.jestVersion) {
    console.log(chalk.gray(`   Jest Version: ${testResults.jestVersion}`));
  }
}

/**
 * Main entry point for the validation script. Orchestrates reading, validating, and reporting test and coverage results.
 * 
 * This function serves as the primary orchestration point for the entire validation process.
 * It coordinates test result validation, coverage reporting, and quality gate enforcement,
 * ensuring that the build fails appropriately if any quality requirements are not met.
 * 
 * The function implements the standard Node.js pattern for CLI tools by using process.exit()
 * to communicate success (0) or failure (1) to the parent process, enabling proper CI/CD
 * pipeline behavior.
 * 
 * @returns {Promise<void>} Resolves if all tests and coverage pass, otherwise exits the process with a non-zero code
 */
async function main() {
  try {
    console.log(chalk.blue('🚀 Node.js Tutorial Application - Test & Coverage Validator'));
    console.log(chalk.blue('==============================================================='));
    console.log(chalk.gray(`Started at: ${new Date().toISOString()}\n`));
    
    // Step 1: Read the Jest test results
    console.log(chalk.blue('Step 1: Loading test results...'));
    const testResults = readTestResults();
    
    // Step 2: Validate the test results
    console.log(chalk.blue('\nStep 2: Validating test results...'));
    const validationResult = validateTestResults(testResults);
    
    // Step 3: Print comprehensive test results report
    console.log(chalk.blue('\nStep 3: Generating test results report...'));
    printTestResultsReport(testResults, validationResult);
    
    // Step 4: Check if tests passed before proceeding to coverage validation
    if (!validationResult.passed) {
      console.log(chalk.red('\n❌ TEST VALIDATION FAILED'));
      console.log(chalk.red('Test failures detected - coverage validation skipped'));
      console.log(chalk.red('Please fix failing tests before proceeding'));
      process.exit(1);
    }
    
    // Step 5: All tests passed, proceed with coverage validation
    console.log(chalk.green('\n✅ All tests passed - proceeding with coverage validation'));
    console.log(chalk.blue('\nStep 4: Validating code coverage...'));
    
    try {
      // Invoke the coverage reporter main function
      await coverageReporterMain();
      
      // If we reach this point, both tests and coverage validation passed
      console.log(chalk.blue('\n🏁 Test & Coverage Validation Complete'));
      console.log(chalk.gray(`Finished at: ${new Date().toISOString()}`));
      console.log(chalk.green('\n🎉 SUCCESS: All tests passed and coverage requirements met!'));
      console.log(chalk.green('✅ Build quality gates satisfied - deployment ready'));
      
      process.exit(0); // Success exit code for CI/CD
      
    } catch (coverageError) {
      // Coverage validation failed
      console.log(chalk.red('\n❌ COVERAGE VALIDATION FAILED'));
      console.log(chalk.red('Tests passed but coverage requirements not met'));
      console.log(chalk.red(`Coverage error: ${coverageError instanceof Error ? coverageError.message : 'Unknown coverage error'}`));
      console.log(chalk.yellow('\nPlease improve test coverage before merging'));
      process.exit(1); // Failure exit code for CI/CD
    }
    
  } catch (error) {
    // Comprehensive error handling for unexpected issues
    console.error(chalk.red('\n💥 UNEXPECTED ERROR in Test & Coverage Validator'));
    console.error(chalk.red('==================================================='));
    console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    
    if (error instanceof Error && error.stack) {
      console.error(chalk.gray('\nStack trace:'));
      console.error(chalk.gray(error.stack));
    }
    
    console.error(chalk.yellow('\n🔧 Troubleshooting:'));
    console.error(chalk.yellow('   • Ensure tests have been executed: npm test'));
    console.error(chalk.yellow('   • Check that jest-results.json exists in coverage directory'));
    console.error(chalk.yellow('   • Verify Jest configuration is correct'));
    console.error(chalk.yellow('   • Check that coverage-reporter.ts is accessible'));
    console.error(chalk.yellow('   • Review test execution logs for errors'));
    
    console.error(chalk.red('\n❌ VALIDATION FAILED - Build cannot proceed'));
    process.exit(1); // Error exit code for CI/CD
  }
}

// Export the main function for potential programmatic usage
module.exports = { main };

// Execute main function if script is run directly
if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('Fatal error in test validation:'), error);
    process.exit(1);
  });
}