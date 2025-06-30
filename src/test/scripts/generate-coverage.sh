#!/bin/bash

# ==============================================================================
# Node.js Tutorial Application - Code Coverage Generation Script
# ==============================================================================
#
# This shell script automates the generation of code coverage reports for the 
# Node.js tutorial application's test suite. It is designed to be used both 
# locally and in CI/CD pipelines to ensure that code coverage is collected, 
# reported, and validated against quality gates.
#
# Key Features:
# - Orchestrates Jest execution with coverage enabled
# - Manages coverage output directories and formats
# - Invokes post-processing validation scripts to enforce thresholds
# - Robust error handling with appropriate CI/CD exit codes
# - Educational clarity for demonstrating coverage best practices
# - Support for both local development and CI/CD pipeline execution
#
# Coverage Formats Generated:
# - Text: Console output for immediate feedback during test runs
# - LCOV: Industry-standard format for CI/CD integration and external tools
# - HTML: Interactive browser-based reports for detailed analysis
#
# CI/CD Integration:
# This script serves as the primary coverage generation entry point for GitHub 
# Actions and other CI/CD systems. It provides clear, actionable feedback through 
# structured console output and enforces quality gates to ensure coverage 
# standards are maintained across all environments.
#
# Usage:
# - Local development: ./generate-coverage.sh
# - CI/CD pipeline: npm run coverage (via package.json script)
# - Docker container: docker run --rm app npm run coverage
#
# Educational Value:
# This script demonstrates professional practices for:
# - Automated code coverage collection and reporting
# - CI/CD pipeline integration patterns
# - Quality gate implementation and enforcement
# - Shell script development and error handling
# - Coverage threshold enforcement and validation
#
# Requirements:
# - Node.js v22.x LTS or higher
# - npm package manager (bundled with Node.js)
# - Jest and dependencies installed via npm install
# - Bash shell environment (Linux, macOS, or WSL on Windows)
#
# @fileoverview Code coverage generation script for automated coverage collection and validation
# @author Node.js Tutorial Team
# @version 1.0.0
# @requires bash >=4.0
# @requires node >=22.0.0
# @requires npm (bundled with Node.js)
# @requires jest ^29.7.0
# ==============================================================================

# Exit immediately if any command fails (fail-fast behavior for CI/CD)
set -e

# Exit if any variable is unset (prevent undefined variable usage)
set -u

# Make pipe failures cause script to fail (ensure pipeline error detection)
set -o pipefail

# ==============================================================================
# GLOBAL CONFIGURATION AND CONSTANTS
# ==============================================================================

# Color codes for enhanced console output readability
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m' # No Color

# Script metadata and version information
readonly SCRIPT_NAME="generate-coverage.sh"
readonly SCRIPT_VERSION="1.0.0"
readonly SCRIPT_START_TIME=$(date +%s)

# Project structure constants
readonly PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
readonly TEST_ROOT="${PROJECT_ROOT}/test"
readonly SCRIPTS_DIR="${TEST_ROOT}/scripts"

# Jest configuration and coverage paths
readonly JEST_CONFIG="${TEST_ROOT}/jest.config.ts"
readonly COVERAGE_DIR="${PROJECT_ROOT}/coverage"

# Coverage reporter configuration
readonly COVERAGE_REPORTERS="text,lcov,html"

# Validation script path
readonly VALIDATE_SCRIPT_PATH="${SCRIPTS_DIR}/validate-tests.js"

# Environment configuration
readonly NODE_ENV="test"
readonly COVERAGE_TIMEOUT="600" # 10 minutes maximum coverage generation time

# CI/CD integration constants
readonly CI_LOG_PREFIX="[CI-COVERAGE]"
readonly SUCCESS_EXIT_CODE=0
readonly FAILURE_EXIT_CODE=1

# ==============================================================================
# UTILITY FUNCTIONS
# ==============================================================================

# Logging functions with timestamp and color support for CI readability
log_info() {
    echo -e "${BLUE}${CI_LOG_PREFIX} [INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1" >&1
}

log_success() {
    echo -e "${GREEN}${CI_LOG_PREFIX} [SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1" >&1
}

log_warning() {
    echo -e "${YELLOW}${CI_LOG_PREFIX} [WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1" >&2
}

log_error() {
    echo -e "${RED}${CI_LOG_PREFIX} [ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1" >&2
}

log_debug() {
    if [[ "${DEBUG:-false}" == "true" ]]; then
        echo -e "${PURPLE}${CI_LOG_PREFIX} [DEBUG]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1" >&2
    fi
}

# Enhanced section headers for CI log readability
print_section_header() {
    local section_title="$1"
    local section_length=${#section_title}
    local padding_length=$((60 - section_length))
    local padding=""
    
    # Create padding string
    for ((i=0; i<$padding_length; i++)); do
        padding="${padding}="
    done
    
    echo -e "\n${CYAN}${CI_LOG_PREFIX} ===============================================================================${NC}"
    echo -e "${CYAN}${CI_LOG_PREFIX} ${section_title}${padding}${NC}"
    echo -e "${CYAN}${CI_LOG_PREFIX} ===============================================================================${NC}\n"
}

# Calculate and display execution time
calculate_execution_time() {
    local start_time="$1"
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    local minutes=$((duration / 60))
    local seconds=$((duration % 60))
    
    if [[ $minutes -gt 0 ]]; then
        echo "${minutes}m ${seconds}s"
    else
        echo "${seconds}s"
    fi
}

# ==============================================================================
# VALIDATION FUNCTIONS
# ==============================================================================

# Validate Node.js installation and version requirements
validate_nodejs_environment() {
    log_info "Validating Node.js environment..."
    
    # Check if Node.js is installed
    if ! command -v node >/dev/null 2>&1; then
        log_error "Node.js is not installed or not in PATH"
        log_error "Please install Node.js v22.x LTS from https://nodejs.org/"
        exit $FAILURE_EXIT_CODE
    fi
    
    # Get Node.js version
    local node_version=$(node --version)
    log_info "Node.js version: ${node_version}"
    
    # Extract major version number
    local major_version=$(echo "$node_version" | sed 's/v\([0-9]*\).*/\1/')
    
    # Validate minimum version requirement (Node.js 18+)
    if [[ $major_version -lt 18 ]]; then
        log_error "Node.js version ${node_version} is not supported"
        log_error "Please upgrade to Node.js v22.x LTS or higher"
        exit $FAILURE_EXIT_CODE
    fi
    
    log_success "Node.js environment validation passed"
}

# Validate npm installation and configuration
validate_npm_environment() {
    log_info "Validating npm environment..."
    
    # Check if npm is installed
    if ! command -v npm >/dev/null 2>&1; then
        log_error "npm is not installed or not in PATH"
        log_error "npm should be bundled with Node.js installation"
        exit $FAILURE_EXIT_CODE
    fi
    
    # Get npm version
    local npm_version=$(npm --version)
    log_info "npm version: ${npm_version}"
    
    log_success "npm environment validation passed"
}

# Validate project structure and required files
validate_project_structure() {
    log_info "Validating project structure..."
    
    # Check if we're in the correct project directory
    if [[ ! -f "${PROJECT_ROOT}/package.json" ]]; then
        log_error "package.json not found at expected location: ${PROJECT_ROOT}/package.json"
        log_error "Please run this script from the project root or correct directory"
        exit $FAILURE_EXIT_CODE
    fi
    
    # Validate Jest configuration exists
    if [[ ! -f "$JEST_CONFIG" ]]; then
        log_error "Jest configuration not found at: $JEST_CONFIG"
        log_error "Please ensure the jest.config.ts file exists"
        exit $FAILURE_EXIT_CODE
    fi
    
    # Validate validation script exists
    if [[ ! -f "$VALIDATE_SCRIPT_PATH" ]]; then
        log_error "Validation script not found at: $VALIDATE_SCRIPT_PATH"
        log_error "Please ensure the validate-tests.js file exists"
        exit $FAILURE_EXIT_CODE
    fi
    
    log_success "Project structure validation passed"
}

# Validate dependencies are installed
validate_dependencies() {
    log_info "Validating project dependencies..."
    
    # Check if node_modules exists
    if [[ ! -d "${PROJECT_ROOT}/node_modules" ]]; then
        log_warning "node_modules directory not found"
        log_info "Installing dependencies..."
        
        if ! npm install --silent; then
            log_error "Failed to install dependencies"
            log_error "Please run 'npm install' manually and resolve any issues"
            exit $FAILURE_EXIT_CODE
        fi
        
        log_success "Dependencies installed successfully"
    else
        log_info "Dependencies are already installed"
    fi
    
    # Verify critical dependencies are available
    local critical_deps=("jest" "typescript" "@types/jest")
    for dep in "${critical_deps[@]}"; do
        if ! npm list "$dep" >/dev/null 2>&1; then
            log_warning "Critical dependency '$dep' may not be properly installed"
        fi
    done
    
    log_success "Dependency validation completed"
}

# ==============================================================================
# ENVIRONMENT SETUP FUNCTIONS
# ==============================================================================

# Configure coverage generation environment variables
setup_coverage_environment() {
    log_info "Setting up coverage generation environment..."
    
    # Set NODE_ENV to test mode
    export NODE_ENV="$NODE_ENV"
    log_info "NODE_ENV set to: $NODE_ENV"
    
    # Set Jest configuration path
    export JEST_CONFIG="$JEST_CONFIG"
    log_info "JEST_CONFIG set to: $JEST_CONFIG"
    
    # Set coverage directory
    export COVERAGE_DIR="$COVERAGE_DIR"
    log_info "COVERAGE_DIR set to: $COVERAGE_DIR"
    
    # Set coverage reporters
    export COVERAGE_REPORTERS="$COVERAGE_REPORTERS"
    log_info "COVERAGE_REPORTERS set to: $COVERAGE_REPORTERS"
    
    # Set validation script path
    export VALIDATE_SCRIPT="$VALIDATE_SCRIPT_PATH"
    log_info "VALIDATE_SCRIPT set to: $VALIDATE_SCRIPT"
    
    # Set coverage timeout
    export COVERAGE_TIMEOUT="$COVERAGE_TIMEOUT"
    log_info "COVERAGE_TIMEOUT set to: ${COVERAGE_TIMEOUT}s"
    
    # Disable npm update notifications during coverage generation
    export NO_UPDATE_NOTIFIER="1"
    
    # Set CI environment indicators if not already set
    if [[ -z "${CI:-}" ]]; then
        export CI="false"
    fi
    
    log_success "Coverage environment setup completed"
}

# Display environment information for CI transparency
display_environment_info() {
    log_info "Coverage Generation Environment Information:"
    log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_info "Operating System: $(uname -s) $(uname -r)"
    log_info "Architecture: $(uname -m)"
    log_info "Node.js Version: $(node --version)"
    log_info "npm Version: $(npm --version)"
    log_info "Working Directory: $(pwd)"
    log_info "Project Root: $PROJECT_ROOT"
    log_info "Test Root: $TEST_ROOT"
    log_info "Jest Config: $JEST_CONFIG"
    log_info "Coverage Directory: $COVERAGE_DIR"
    log_info "Coverage Reporters: $COVERAGE_REPORTERS"
    log_info "Environment: $NODE_ENV"
    log_info "CI Mode: ${CI:-false}"
    log_info "Script Version: $SCRIPT_VERSION"
    log_info "Execution Start: $(date)"
    log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# ==============================================================================
# COVERAGE GENERATION FUNCTIONS
# ==============================================================================

# Clean previous coverage artifacts to ensure fresh coverage data
clean_coverage_artifacts() {
    local section_start_time=$(date +%s)
    
    print_section_header "CLEANING PREVIOUS COVERAGE ARTIFACTS"
    
    log_info "Cleaning previous coverage artifacts..."
    
    # Remove existing coverage directory if it exists
    if [[ -d "$COVERAGE_DIR" ]]; then
        log_info "Removing existing coverage directory: $COVERAGE_DIR"
        if rm -rf "$COVERAGE_DIR"; then
            log_success "Previous coverage artifacts cleaned successfully"
        else
            log_warning "Failed to remove some coverage artifacts (may be in use)"
        fi
    else
        log_info "No previous coverage artifacts found"
    fi
    
    # Create fresh coverage directory
    log_info "Creating fresh coverage directory..."
    if mkdir -p "$COVERAGE_DIR"; then
        log_success "Coverage directory created: $COVERAGE_DIR"
    else
        log_error "Failed to create coverage directory: $COVERAGE_DIR"
        exit $FAILURE_EXIT_CODE
    fi
    
    local section_duration=$(calculate_execution_time $section_start_time)
    log_info "Coverage cleanup completed in: $section_duration"
}

# Execute Jest with coverage enabled using the project configuration
execute_jest_coverage() {
    local section_start_time=$(date +%s)
    
    print_section_header "EXECUTING JEST WITH COVERAGE"
    
    log_info "Invoking Jest with coverage collection enabled..."
    log_info "Jest configuration: $JEST_CONFIG"
    log_info "Coverage directory: $COVERAGE_DIR"
    log_info "Coverage reporters: $COVERAGE_REPORTERS"
    
    # Change to project root directory for proper path resolution
    cd "$PROJECT_ROOT"
    
    # Prepare Jest command with coverage options
    local jest_command="npx jest --config=\"$JEST_CONFIG\" --coverage --coverageDirectory=\"$COVERAGE_DIR\""
    
    log_info "Jest command: $jest_command"
    
    # Execute Jest with timeout protection
    local jest_exit_code=0
    
    log_info "Starting Jest test execution with coverage collection..."
    
    if timeout "$COVERAGE_TIMEOUT" npx jest \
        --config="$JEST_CONFIG" \
        --coverage \
        --coverageDirectory="$COVERAGE_DIR" \
        --coverageReporters=text,lcov,html \
        --verbose \
        --no-cache \
        --runInBand; then
        log_success "Jest coverage generation completed successfully"
        jest_exit_code=0
    else
        local timeout_exit=$?
        if [[ $timeout_exit -eq 124 ]]; then
            log_error "Jest coverage generation timed out after ${COVERAGE_TIMEOUT} seconds"
            log_error "Consider optimizing tests or increasing COVERAGE_TIMEOUT"
        else
            log_error "Jest coverage generation failed with exit code: $timeout_exit"
        fi
        jest_exit_code=$timeout_exit
    fi
    
    local section_duration=$(calculate_execution_time $section_start_time)
    log_info "Jest coverage execution time: $section_duration"
    
    return $jest_exit_code
}

# Verify that coverage reports were generated in all required formats
verify_coverage_reports() {
    local section_start_time=$(date +%s)
    
    print_section_header "VERIFYING COVERAGE REPORTS"
    
    log_info "Verifying coverage reports were generated..."
    
    local reports_valid=true
    
    # Check for coverage summary JSON file (required for validation)
    local coverage_summary="${COVERAGE_DIR}/coverage-summary.json"
    if [[ -f "$coverage_summary" ]]; then
        log_success "✅ Coverage summary JSON: $coverage_summary"
    else
        log_error "❌ Coverage summary JSON not found: $coverage_summary"
        reports_valid=false
    fi
    
    # Check for LCOV report (required for CI/CD integration)
    local lcov_report="${COVERAGE_DIR}/lcov.info"
    if [[ -f "$lcov_report" ]]; then
        log_success "✅ LCOV report: $lcov_report"
    else
        log_error "❌ LCOV report not found: $lcov_report"
        reports_valid=false
    fi
    
    # Check for HTML report directory (required for detailed analysis)
    local html_report_dir="${COVERAGE_DIR}/lcov-report"
    if [[ -d "$html_report_dir" ]] && [[ -f "${html_report_dir}/index.html" ]]; then
        log_success "✅ HTML report: ${html_report_dir}/index.html"
    else
        log_error "❌ HTML report not found: ${html_report_dir}/index.html"
        reports_valid=false
    fi
    
    # Display coverage directory contents for debugging
    log_info "Coverage directory contents:"
    if ls -la "$COVERAGE_DIR" 2>/dev/null; then
        log_info "Coverage directory listing successful"
    else
        log_error "Failed to list coverage directory contents"
        reports_valid=false
    fi
    
    local section_duration=$(calculate_execution_time $section_start_time)
    log_info "Coverage report verification time: $section_duration"
    
    if [[ "$reports_valid" != "true" ]]; then
        log_error "Coverage report verification failed"
        log_error "Some required coverage report formats are missing"
        return $FAILURE_EXIT_CODE
    else
        log_success "All required coverage reports verified successfully"
        return $SUCCESS_EXIT_CODE
    fi
}

# Display coverage summary to console for immediate feedback
display_coverage_summary() {
    local section_start_time=$(date +%s)
    
    print_section_header "DISPLAYING COVERAGE SUMMARY"
    
    log_info "Displaying coverage summary for immediate feedback..."
    
    # Check if coverage summary exists
    local coverage_summary="${COVERAGE_DIR}/coverage-summary.json"
    if [[ ! -f "$coverage_summary" ]]; then
        log_warning "Coverage summary file not found: $coverage_summary"
        log_warning "Skipping coverage summary display"
        return
    fi
    
    # Display coverage summary using Node.js to parse JSON
    log_info "Coverage Summary:"
    log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Use Node.js to extract and format coverage data
    if command -v node >/dev/null 2>&1; then
        node -e "
            try {
                const fs = require('fs');
                const coverage = JSON.parse(fs.readFileSync('$coverage_summary', 'utf8'));
                const total = coverage.total;
                
                console.log('   Lines:      ' + total.lines.pct.toFixed(2) + '% (' + total.lines.covered + '/' + total.lines.total + ')');
                console.log('   Functions:  ' + total.functions.pct.toFixed(2) + '% (' + total.functions.covered + '/' + total.functions.total + ')');
                console.log('   Branches:   ' + total.branches.pct.toFixed(2) + '% (' + total.branches.covered + '/' + total.branches.total + ')');
                console.log('   Statements: ' + total.statements.pct.toFixed(2) + '% (' + total.statements.covered + '/' + total.statements.total + ')');
            } catch (error) {
                console.error('Failed to parse coverage summary:', error.message);
            }
        " 2>/dev/null || log_warning "Failed to parse coverage summary"
    else
        log_warning "Node.js not available for coverage summary parsing"
    fi
    
    log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_info "Detailed coverage report available at: ${COVERAGE_DIR}/lcov-report/index.html"
    
    local section_duration=$(calculate_execution_time $section_start_time)
    log_info "Coverage summary display time: $section_duration"
}

# Execute test validation using the validate-tests.js script
execute_test_validation() {
    local section_start_time=$(date +%s)
    
    print_section_header "EXECUTING COVERAGE VALIDATION"
    
    log_info "Invoking coverage validation script..."
    log_info "Validation script: $VALIDATE_SCRIPT_PATH"
    
    # Change to project root directory for proper path resolution
    cd "$PROJECT_ROOT"
    
    # Execute the validation script
    local validation_exit_code=0
    
    if node "$VALIDATE_SCRIPT_PATH"; then
        log_success "Coverage validation completed successfully"
        validation_exit_code=0
    else
        validation_exit_code=$?
        log_error "Coverage validation failed with exit code: $validation_exit_code"
    fi
    
    local section_duration=$(calculate_execution_time $section_start_time)
    log_info "Coverage validation execution time: $section_duration"
    
    return $validation_exit_code
}

# ==============================================================================
# ERROR HANDLING AND CLEANUP
# ==============================================================================

# Comprehensive error handler for unexpected failures
handle_unexpected_error() {
    local exit_code=$?
    local line_number=$1
    
    print_section_header "UNEXPECTED ERROR DETECTED"
    
    log_error "Unexpected error occurred at line $line_number"
    log_error "Exit code: $exit_code"
    log_error "Command that failed: ${BASH_COMMAND}"
    
    log_error "Environment Debug Information:"
    log_error "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_error "Working Directory: $(pwd)"
    log_error "User: $(whoami)"
    log_error "Path: $PATH"
    log_error "Node.js Available: $(command -v node || echo 'NOT FOUND')"
    log_error "npm Available: $(command -v npm || echo 'NOT FOUND')"
    log_error "Jest Config: $JEST_CONFIG"
    log_error "Coverage Dir: $COVERAGE_DIR"
    log_error "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    log_error "Troubleshooting Steps:"
    log_error "1. Ensure Node.js v22.x LTS is installed and in PATH"
    log_error "2. Run 'npm install' to install all dependencies"
    log_error "3. Verify Jest configuration exists at expected location"
    log_error "4. Check for any syntax errors in test files"
    log_error "5. Review previous error messages for specific issues"
    log_error "6. Ensure sufficient disk space for coverage reports"
    
    # Perform cleanup
    cleanup_on_exit
    
    exit $FAILURE_EXIT_CODE
}

# Cleanup function for graceful script termination
cleanup_on_exit() {
    log_debug "Performing cleanup operations..."
    
    # Reset working directory to original location
    cd "$PROJECT_ROOT" 2>/dev/null || true
    
    # Clean up any temporary files (if created in future versions)
    # rm -f /tmp/coverage-*.tmp 2>/dev/null || true
    
    log_debug "Cleanup completed"
}

# Signal handlers for graceful shutdown
handle_interrupt() {
    print_section_header "SCRIPT INTERRUPTED"
    
    log_warning "Coverage generation interrupted by user (SIGINT/SIGTERM)"
    log_info "Performing cleanup and exiting..."
    
    cleanup_on_exit
    exit $FAILURE_EXIT_CODE
}

# ==============================================================================
# MAIN EXECUTION FUNCTION
# ==============================================================================

# Main orchestration function that coordinates all coverage generation steps
main() {
    # Set up error handling
    trap 'handle_unexpected_error $LINENO' ERR
    trap 'handle_interrupt' INT TERM
    
    # Script initialization
    print_section_header "NODE.JS TUTORIAL COVERAGE GENERATION"
    
    log_info "Starting coverage generation script: $SCRIPT_NAME v$SCRIPT_VERSION"
    log_info "Process ID: $$"
    log_info "Execution started at: $(date)"
    
    # Step 1: Environment Validation
    print_section_header "ENVIRONMENT VALIDATION"
    validate_nodejs_environment
    validate_npm_environment
    validate_project_structure
    validate_dependencies
    
    # Step 2: Environment Setup
    print_section_header "ENVIRONMENT SETUP"
    setup_coverage_environment
    display_environment_info
    
    # Step 3: Coverage Generation Process
    local coverage_success=false
    local validation_success=false
    
    # Clean previous coverage artifacts
    clean_coverage_artifacts
    
    # Execute Jest with coverage
    if execute_jest_coverage; then
        coverage_success=true
        log_success "✅ Jest coverage generation: PASSED"
        
        # Verify coverage reports were generated
        if verify_coverage_reports; then
            log_success "✅ Coverage report verification: PASSED"
            
            # Display coverage summary for immediate feedback
            display_coverage_summary
        else
            log_error "❌ Coverage report verification: FAILED"
            
            print_section_header "COVERAGE REPORT VERIFICATION FAILED"
            log_error "Coverage reports were not generated properly"
            log_error "Jest may have completed but failed to generate all required report formats"
            
            log_error "Next Steps:"
            log_error "1. Check Jest configuration for coverage reporters"
            log_error "2. Ensure sufficient disk space for coverage files"
            log_error "3. Verify Jest version compatibility"
            log_error "4. Run Jest manually: npx jest --coverage"
            
            cleanup_on_exit
            exit $FAILURE_EXIT_CODE
        fi
    else
        log_error "❌ Jest coverage generation: FAILED"
        
        print_section_header "COVERAGE GENERATION FAILED"
        log_error "Jest coverage generation failed - build cannot proceed"
        log_error "Please review test failures and fix issues before committing"
        
        log_error "Next Steps:"
        log_error "1. Review Jest error messages above"
        log_error "2. Fix failing tests in your code"
        log_error "3. Run tests locally: npm test"
        log_error "4. Generate coverage locally: npx jest --coverage"
        log_error "5. Commit changes once all tests pass"
        
        cleanup_on_exit
        exit $FAILURE_EXIT_CODE
    fi
    
    # Step 4: Coverage Validation
    if [[ "$coverage_success" == "true" ]]; then
        if execute_test_validation; then
            validation_success=true
            log_success "✅ Coverage validation: PASSED"
        else
            log_error "❌ Coverage validation: FAILED"
            
            print_section_header "COVERAGE VALIDATION FAILED"
            log_error "Coverage validation failed - coverage thresholds not met"
            log_error "Please improve test coverage or fix validation issues"
            
            log_error "Next Steps:"
            log_error "1. Review coverage report: open ${COVERAGE_DIR}/lcov-report/index.html"
            log_error "2. Add tests to improve coverage metrics"
            log_error "3. Focus on uncovered lines, functions, and branches"
            log_error "4. Re-run coverage generation to verify improvements"
            log_error "5. Ensure all quality gates are met before merging"
            
            cleanup_on_exit
            exit $FAILURE_EXIT_CODE
        fi
    fi
    
    # Step 5: Success Summary
    if [[ "$coverage_success" == "true" && "$validation_success" == "true" ]]; then
        print_section_header "COVERAGE GENERATION COMPLETE - SUCCESS"
        
        local total_duration=$(calculate_execution_time $SCRIPT_START_TIME)
        
        log_success "🎉 ALL COVERAGE GENERATION AND VALIDATION PASSED!"
        log_success "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        log_success "✅ Jest Coverage Generation: PASSED"
        log_success "✅ Coverage Report Verification: PASSED"
        log_success "✅ Coverage Threshold Validation: PASSED"
        log_success "✅ Quality Gates: PASSED"
        log_success "🚀 Build is ready to proceed!"
        log_success "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        log_success "Coverage reports available:"
        log_success "   • HTML Report: ${COVERAGE_DIR}/lcov-report/index.html"
        log_success "   • LCOV Report: ${COVERAGE_DIR}/lcov.info"
        log_success "   • JSON Summary: ${COVERAGE_DIR}/coverage-summary.json"
        log_success "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        log_success "Total execution time: $total_duration"
        log_success "Completed at: $(date)"
        log_success "Ready for deployment! 🚀"
        
        cleanup_on_exit
        exit $SUCCESS_EXIT_CODE
    else
        print_section_header "COVERAGE GENERATION FAILED"
        
        log_error "Coverage generation did not complete successfully"
        log_error "Please review error messages and resolve issues"
        
        cleanup_on_exit
        exit $FAILURE_EXIT_CODE
    fi
}

# ==============================================================================
# SCRIPT ENTRY POINT
# ==============================================================================

# Script usage information
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Node.js Tutorial Application Coverage Generation Script"
    echo ""
    echo "This script automates the generation of code coverage reports for the"
    echo "Node.js tutorial application's test suite. It orchestrates Jest execution"
    echo "with coverage enabled, manages output directories, and enforces coverage"
    echo "quality gates through automated validation."
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message and exit"
    echo "  -v, --version  Show script version and exit"
    echo "  -d, --debug    Enable debug output"
    echo ""
    echo "Environment Variables:"
    echo "  DEBUG=true          Enable debug logging"
    echo "  CI=true             Indicate CI/CD environment"
    echo "  COVERAGE_TIMEOUT    Coverage generation timeout in seconds (default: 600)"
    echo ""
    echo "Examples:"
    echo "  $0                       # Generate coverage with default settings"
    echo "  $0 --debug               # Generate with debug output enabled"
    echo "  DEBUG=true $0            # Generate with debug output via environment"
    echo "  COVERAGE_TIMEOUT=900 $0  # Generate with extended timeout"
    echo ""
    echo "Coverage Reports Generated:"
    echo "  • Text format: Console output for immediate feedback"
    echo "  • LCOV format: Industry-standard for CI/CD integration"
    echo "  • HTML format: Interactive browser-based detailed analysis"
    echo ""
    echo "Quality Gates Enforced:"
    echo "  • Line coverage: 90% minimum threshold"
    echo "  • Function coverage: 100% minimum threshold"
    echo "  • Branch coverage: 85% minimum threshold"
    echo "  • Statement coverage: 90% minimum threshold"
    echo ""
    echo "Exit Codes:"
    echo "  0    Success - Coverage generated and validated successfully"
    echo "  1    Failure - Coverage generation failed or thresholds not met"
    echo ""
}

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_usage
                exit $SUCCESS_EXIT_CODE
                ;;
            -v|--version)
                echo "$SCRIPT_NAME version $SCRIPT_VERSION"
                echo "Node.js Tutorial Application Coverage Generation Script"
                echo "Supports Jest v29.7.0 with Node.js v22.x LTS"
                exit $SUCCESS_EXIT_CODE
                ;;
            -d|--debug)
                export DEBUG="true"
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                show_usage
                exit $FAILURE_EXIT_CODE
                ;;
        esac
    done
}

# Entry point - parse arguments and execute main function
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    # Parse command line arguments
    parse_arguments "$@"
    
    # Execute main function
    main
fi