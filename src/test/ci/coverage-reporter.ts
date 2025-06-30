/**
 * Code Coverage Reporter for Node.js Tutorial Application
 * 
 * This TypeScript script reads, validates, and reports code coverage results for the Node.js 
 * tutorial application's test suite as part of the CI/CD pipeline. It enforces minimum coverage 
 * thresholds, outputs a detailed coverage report for CI logs, and fails the build if any 
 * threshold is not met.
 * 
 * Features:
 * - Reads Jest coverage-summary.json file
 * - Validates coverage against centralized thresholds
 * - Provides color-coded CLI output for CI readability
 * - Fails CI build with non-zero exit code if thresholds not met
 * - Demonstrates best practices for code quality gates
 * 
 * Usage:
 * - Run via: npx ts-node src/test/ci/coverage-reporter.ts
 * - Typically invoked after test execution in CI pipeline
 * - Can be integrated into npm scripts for automation
 * 
 * Educational Value:
 * This script demonstrates professional practices for:
 * - Code coverage validation and reporting
 * - CI/CD quality gate implementation
 * - TypeScript error handling patterns
 * - Educational clarity in code structure
 */

import fs from 'fs'; // Node.js built-in file system module
import path from 'path'; // Node.js built-in path utilities module
import process from 'process'; // Node.js built-in process module
import chalk from 'chalk'; // chalk@^5.3.0 - Terminal string styling library

// Import coverage thresholds from centralized configuration
import { COVERAGE_THRESHOLDS } from '../../test/config/coverage-thresholds.js';

/**
 * Global constants for coverage directory and summary file paths.
 * These paths follow Jest's default coverage output structure.
 */
const COVERAGE_DIR: string = path.resolve(process.cwd(), 'coverage');
const COVERAGE_SUMMARY_PATH: string = path.join(COVERAGE_DIR, 'coverage-summary.json');

/**
 * Type definitions for coverage data structures.
 * These types ensure type safety when working with Jest coverage output.
 */
interface CoverageMetric {
  total: number;
  covered: number;
  skipped: number;
  pct: number;
}

interface CoverageSummary {
  total: {
    lines: CoverageMetric;
    functions: CoverageMetric;
    statements: CoverageMetric;
    branches: CoverageMetric;
  };
}

interface ValidationResult {
  passed: boolean;
  failedMetrics: Array<{
    metric: string;
    actual: number;
    required: number;
  }>;
}

/**
 * Reads and parses the coverage-summary.json file from the coverage directory.
 * 
 * This function handles the critical task of loading Jest coverage data, providing
 * robust error handling for missing or malformed coverage files. It serves as the
 * data source for all subsequent coverage validation operations.
 * 
 * @returns {CoverageSummary} Parsed coverage summary object with global metrics
 * @throws {Error} Exits process with code 1 if coverage file is missing or invalid
 */
function readCoverageSummary(): CoverageSummary {
  try {
    // Check if coverage summary file exists
    if (!fs.existsSync(COVERAGE_SUMMARY_PATH)) {
      console.error(chalk.red('❌ Error: Coverage summary file not found'));
      console.error(chalk.red(`   Expected path: ${COVERAGE_SUMMARY_PATH}`));
      console.error(chalk.yellow('   Make sure to run tests with coverage before running this script'));
      console.error(chalk.yellow('   Example: npm test -- --coverage'));
      process.exit(1);
    }

    // Read and parse the coverage summary file
    console.log(chalk.blue('📊 Reading coverage summary from:'));
    console.log(chalk.gray(`   ${COVERAGE_SUMMARY_PATH}`));
    
    const fileContents = fs.readFileSync(COVERAGE_SUMMARY_PATH, 'utf8');
    const coverageSummary: CoverageSummary = JSON.parse(fileContents);
    
    // Validate that the coverage summary has the expected structure
    if (!coverageSummary.total || 
        !coverageSummary.total.lines || 
        !coverageSummary.total.functions || 
        !coverageSummary.total.statements || 
        !coverageSummary.total.branches) {
      console.error(chalk.red('❌ Error: Invalid coverage summary format'));
      console.error(chalk.red('   Coverage summary is missing required metrics'));
      process.exit(1);
    }
    
    console.log(chalk.green('✅ Coverage summary loaded successfully'));
    return coverageSummary;
    
  } catch (error) {
    console.error(chalk.red('❌ Error: Failed to read coverage summary'));
    console.error(chalk.red(`   ${error instanceof Error ? error.message : 'Unknown error'}`));
    console.error(chalk.yellow('   Please ensure Jest coverage has been generated'));
    process.exit(1);
  }
}

/**
 * Compares actual coverage metrics to the required thresholds and returns a result object.
 * 
 * This function implements the core coverage validation logic, comparing each metric
 * (lines, functions, branches, statements) against the centralized thresholds defined
 * in coverage-thresholds.ts. It provides detailed feedback on which metrics pass or fail.
 * 
 * @param {CoverageSummary} coverageSummary - Parsed coverage data from Jest
 * @param {object} thresholds - Coverage thresholds from centralized configuration
 * @returns {ValidationResult} Result object with pass/fail status and failed metrics details
 */
function validateCoverage(coverageSummary: CoverageSummary, thresholds: typeof COVERAGE_THRESHOLDS.global): ValidationResult {
  const failedMetrics: Array<{ metric: string; actual: number; required: number }> = [];
  
  console.log(chalk.blue('\n🔍 Validating coverage against thresholds:'));
  
  // Define the coverage metrics to validate
  const metricsToValidate = [
    { name: 'lines', actual: coverageSummary.total.lines.pct, required: thresholds.lines },
    { name: 'functions', actual: coverageSummary.total.functions.pct, required: thresholds.functions },
    { name: 'branches', actual: coverageSummary.total.branches.pct, required: thresholds.branches },
    { name: 'statements', actual: coverageSummary.total.statements.pct, required: thresholds.statements }
  ];
  
  // Validate each metric against its threshold
  for (const metric of metricsToValidate) {
    const passed = metric.actual >= metric.required;
    
    if (passed) {
      console.log(chalk.green(`   ✅ ${metric.name.padEnd(10)}: ${metric.actual.toFixed(1)}% (≥ ${metric.required}%)`));
    } else {
      console.log(chalk.red(`   ❌ ${metric.name.padEnd(10)}: ${metric.actual.toFixed(1)}% (< ${metric.required}%)`));
      failedMetrics.push({
        metric: metric.name,
        actual: metric.actual,
        required: metric.required
      });
    }
  }
  
  const passed = failedMetrics.length === 0;
  
  console.log(chalk.blue('\n📋 Validation Summary:'));
  if (passed) {
    console.log(chalk.green('   🎉 All coverage thresholds met!'));
  } else {
    console.log(chalk.red(`   ⚠️  ${failedMetrics.length} metric(s) below threshold`));
  }
  
  return { passed, failedMetrics };
}

/**
 * Outputs a formatted coverage report to the console, highlighting pass/fail status for each metric.
 * 
 * This function provides comprehensive, human-readable coverage reporting with color-coded
 * output optimized for CI logs. It displays both actual coverage percentages and covered/total
 * counts for each metric, making it easy to understand coverage status at a glance.
 * 
 * @param {CoverageSummary} coverageSummary - Parsed coverage data from Jest
 * @param {ValidationResult} validationResult - Results from coverage validation
 * @returns {void} Prints the report to stdout
 */
function printCoverageReport(coverageSummary: CoverageSummary, validationResult: ValidationResult): void {
  console.log(chalk.blue('\n📊 COVERAGE REPORT'));
  console.log(chalk.blue('=================='));
  
  // Helper function to format coverage metrics consistently
  const formatMetric = (metric: CoverageMetric, name: string, threshold: number): void => {
    const percentage = metric.pct;
    const passed = percentage >= threshold;
    const statusIcon = passed ? '✅' : '❌';
    const colorFn = passed ? chalk.green : chalk.red;
    
    console.log(colorFn(`${statusIcon} ${name.padEnd(11)}: ${percentage.toFixed(2).padStart(6)}% (${metric.covered}/${metric.total}) [threshold: ${threshold}%]`));
  };
  
  // Display coverage for each metric type
  console.log(chalk.blue('\nCoverage Metrics:'));
  formatMetric(coverageSummary.total.lines, 'Lines', COVERAGE_THRESHOLDS.global.lines);
  formatMetric(coverageSummary.total.functions, 'Functions', COVERAGE_THRESHOLDS.global.functions);
  formatMetric(coverageSummary.total.branches, 'Branches', COVERAGE_THRESHOLDS.global.branches);
  formatMetric(coverageSummary.total.statements, 'Statements', COVERAGE_THRESHOLDS.global.statements);
  
  // Summary section
  console.log(chalk.blue('\n📈 Summary:'));
  if (validationResult.passed) {
    console.log(chalk.green('   🎉 SUCCESS: All coverage thresholds have been met!'));
    console.log(chalk.green('   ✨ Your code maintains excellent test coverage standards.'));
  } else {
    console.log(chalk.red('   ❌ FAILURE: Coverage thresholds not met'));
    console.log(chalk.red(`   📉 ${validationResult.failedMetrics.length} metric(s) below required thresholds:`));
    
    validationResult.failedMetrics.forEach(failure => {
      const deficit = (failure.required - failure.actual).toFixed(1);
      console.log(chalk.red(`      • ${failure.metric}: ${failure.actual.toFixed(1)}% (need ${deficit}% more to reach ${failure.required}%)`));
    });
    
    console.log(chalk.yellow('\n💡 To improve coverage:'));
    console.log(chalk.yellow('   • Add tests for uncovered lines and functions'));
    console.log(chalk.yellow('   • Test conditional branches (if/else, switch cases)'));
    console.log(chalk.yellow('   • Ensure all code paths are executed in tests'));
    console.log(chalk.yellow('   • Review coverage report: open coverage/lcov-report/index.html'));
  }
  
  // Additional information for CI/CD
  console.log(chalk.blue('\n🔧 Coverage Details:'));
  console.log(chalk.gray(`   Coverage directory: ${COVERAGE_DIR}`));
  console.log(chalk.gray(`   Summary file: ${COVERAGE_SUMMARY_PATH}`));
  console.log(chalk.gray(`   Generated: ${new Date().toISOString()}`));
}

/**
 * Main entry point for the coverage reporter script.
 * 
 * This function orchestrates the entire coverage reporting process: reading coverage data,
 * validating against thresholds, printing detailed reports, and setting appropriate exit codes
 * for CI/CD integration. It demonstrates comprehensive error handling and provides clear
 * feedback for both successful and failed coverage validation.
 * 
 * The function implements the standard Node.js pattern for CLI tools by using process.exit()
 * to communicate success (0) or failure (1) to the parent process, enabling proper CI/CD
 * pipeline behavior.
 * 
 * @returns {Promise<void>} Resolves if coverage is valid, otherwise exits process with non-zero code
 */
async function main(): Promise<void> {
  try {
    console.log(chalk.blue('🚀 Node.js Tutorial Application - Coverage Reporter'));
    console.log(chalk.blue('==================================================='));
    console.log(chalk.gray(`Started at: ${new Date().toISOString()}\n`));
    
    // Step 1: Read the coverage summary from Jest output
    console.log(chalk.blue('Step 1: Loading coverage data...'));
    const coverageSummary = readCoverageSummary();
    
    // Step 2: Validate coverage against centralized thresholds
    console.log(chalk.blue('\nStep 2: Validating coverage thresholds...'));
    const validationResult = validateCoverage(coverageSummary, COVERAGE_THRESHOLDS.global);
    
    // Step 3: Print comprehensive coverage report
    console.log(chalk.blue('\nStep 3: Generating coverage report...'));
    printCoverageReport(coverageSummary, validationResult);
    
    // Step 4: Set appropriate exit code for CI/CD integration
    console.log(chalk.blue('\n🏁 Coverage Reporter Complete'));
    console.log(chalk.gray(`Finished at: ${new Date().toISOString()}`));
    
    if (validationResult.passed) {
      console.log(chalk.green('\n✅ Coverage validation PASSED - Build can proceed'));
      process.exit(0); // Success exit code for CI/CD
    } else {
      console.log(chalk.red('\n❌ Coverage validation FAILED - Build should fail'));
      console.log(chalk.red('Please improve test coverage before merging'));
      process.exit(1); // Failure exit code for CI/CD
    }
    
  } catch (error) {
    // Comprehensive error handling for unexpected issues
    console.error(chalk.red('\n💥 UNEXPECTED ERROR in Coverage Reporter'));
    console.error(chalk.red('=========================================='));
    console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    
    if (error instanceof Error && error.stack) {
      console.error(chalk.gray('\nStack trace:'));
      console.error(chalk.gray(error.stack));
    }
    
    console.error(chalk.yellow('\n🔧 Troubleshooting:'));
    console.error(chalk.yellow('   • Ensure Jest coverage has been generated'));
    console.error(chalk.yellow('   • Check that coverage-summary.json exists'));
    console.error(chalk.yellow('   • Verify coverage-thresholds.ts is accessible'));
    console.error(chalk.yellow('   • Run: npm test -- --coverage'));
    
    process.exit(1); // Error exit code for CI/CD
  }
}

// Export the main function for potential programmatic usage
export { main };

// Execute main function if script is run directly
if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('Fatal error:'), error);
    process.exit(1);
  });
}