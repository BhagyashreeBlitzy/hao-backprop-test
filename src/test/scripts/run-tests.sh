#!/bin/bash

# ==============================================================================
# Node.js Tutorial Application - Test Orchestration Script
# ==============================================================================
#
# This shell script orchestrates the execution of the Node.js tutorial application's 
# test suite, providing a single entry point for running all unit, integration, and 
# performance tests. It ensures that the test environment is correctly configured, 
# all dependencies are installed, and test results are validated according to the 
# project's quality gates.
#
# Key Features:
# - Automated test environment configuration and validation
# - TypeScript/Jest-based test runner integration via npx ts-node
# - Post-test validation and coverage enforcement
# - Robust error handling with appropriate CI/CD exit codes
# - Educational clarity for demonstrating testing best practices
# - Support for both local development and CI/CD pipeline execution
#
# CI/CD Integration:
# This script serves as the primary test execution entry point for GitHub Actions 
# and other CI/CD systems. It provides clear, actionable feedback through 
# structured console output and enforces quality gates to ensure code quality 
# standards are maintained across all environments.
#
# Usage:
# - Local development: ./run-tests.sh
# - CI/CD pipeline: npm run test (via package.json script)
# - Docker container: docker run --rm app npm test
#
# Educational Value:
# This script demonstrates professional practices for:
# - Shell script development and testing automation
# - CI/CD pipeline integration patterns
# - Error handling and process management in bash
# - Environment management and dependency validation
# - Quality gate implementation and enforcement
#
# Requirements:
# - Node.js v22.x LTS or higher
# - npm package manager (bundled with Node.js)
# - TypeScript and Jest dependencies installed
# - Bash shell environment (Linux, macOS, or WSL on Windows)
#
# @fileoverview Test orchestration script for automated test execution and validation
# @author Node.js Tutorial Team
# @version 1.0.0
# @requires bash >=4.0
# @requires node >=22.0.0
# @requires npm (bundled with Node.js)
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
readonly SCRIPT_NAME="run-tests.sh"
readonly SCRIPT_VERSION="1.0.0"
readonly SCRIPT_START_TIME=$(date +%s)

# Project structure constants
readonly PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
readonly TEST_ROOT="${PROJECT_ROOT}/test"
readonly SCRIPTS_DIR="${TEST_ROOT}/scripts"

# Test runner and validation script paths
readonly TEST_RUNNER_PATH="${TEST_ROOT}/ci/test-runner.ts"
readonly VALIDATE_SCRIPT_PATH="${SCRIPTS_DIR}/validate-tests.js"
readonly JEST_CONFIG_PATH="${TEST_ROOT}/jest.config.ts"

# Environment configuration
readonly NODE_ENV="test"
readonly TEST_TIMEOUT="300" # 5 minutes maximum test execution time

# CI/CD integration constants
readonly CI_LOG_PREFIX="[CI-TEST]"
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
    
    # Validate test runner file exists
    if [[ ! -f "$TEST_RUNNER_PATH" ]]; then
        log_error "Test runner not found at: $TEST_RUNNER_PATH"
        log_error "Please ensure the test-runner.ts file exists"
        exit $FAILURE_EXIT_CODE
    fi
    
    # Validate validation script exists
    if [[ ! -f "$VALIDATE_SCRIPT_PATH" ]]; then
        log_error "Validation script not found at: $VALIDATE_SCRIPT_PATH"
        log_error "Please ensure the validate-tests.js file exists"
        exit $FAILURE_EXIT_CODE
    fi
    
    # Validate Jest configuration exists
    if [[ ! -f "$JEST_CONFIG_PATH" ]]; then
        log_error "Jest configuration not found at: $JEST_CONFIG_PATH"
        log_error "Please ensure the jest.config.ts file exists"
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
    local critical_deps=("jest" "typescript" "ts-node")
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

# Configure test environment variables
setup_test_environment() {
    log_info "Setting up test environment..."
    
    # Set NODE_ENV to test mode
    export NODE_ENV="$NODE_ENV"
    log_info "NODE_ENV set to: $NODE_ENV"
    
    # Set Jest configuration path
    export JEST_CONFIG="$JEST_CONFIG_PATH"
    log_info "JEST_CONFIG set to: $JEST_CONFIG"
    
    # Set test runner path for validation
    export TEST_RUNNER="$TEST_RUNNER_PATH"
    log_info "TEST_RUNNER set to: $TEST_RUNNER"
    
    # Set validation script path
    export VALIDATE_SCRIPT="$VALIDATE_SCRIPT_PATH"
    log_info "VALIDATE_SCRIPT set to: $VALIDATE_SCRIPT"
    
    # Set test timeout
    export TEST_TIMEOUT="$TEST_TIMEOUT"
    log_info "TEST_TIMEOUT set to: ${TEST_TIMEOUT}s"
    
    # Disable npm update notifications during testing
    export NO_UPDATE_NOTIFIER="1"
    
    # Set CI environment indicators if not already set
    if [[ -z "${CI:-}" ]]; then
        export CI="false"
    fi
    
    log_success "Test environment setup completed"
}

# Display environment information for CI transparency
display_environment_info() {
    log_info "Environment Information:"
    log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_info "Operating System: $(uname -s) $(uname -r)"
    log_info "Architecture: $(uname -m)"
    log_info "Node.js Version: $(node --version)"
    log_info "npm Version: $(npm --version)"
    log_info "Working Directory: $(pwd)"
    log_info "Project Root: $PROJECT_ROOT"
    log_info "Environment: $NODE_ENV"
    log_info "CI Mode: ${CI:-false}"
    log_info "Script Version: $SCRIPT_VERSION"
    log_info "Execution Start: $(date)"
    log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# ==============================================================================
# TEST EXECUTION FUNCTIONS
# ==============================================================================

# Execute the TypeScript test runner using npx ts-node
execute_test_runner() {
    local section_start_time=$(date +%s)
    
    print_section_header "EXECUTING TEST RUNNER"
    
    log_info "Invoking TypeScript test runner..."
    log_info "Command: npx ts-node \"$TEST_RUNNER_PATH\""
    
    # Change to project root directory for proper path resolution
    cd "$PROJECT_ROOT"
    
    # Execute the test runner with timeout protection
    local test_runner_exit_code=0
    
    if timeout "$TEST_TIMEOUT" npx ts-node "$TEST_RUNNER_PATH"; then
        log_success "Test runner completed successfully"
        test_runner_exit_code=0
    else
        local timeout_exit=$?
        if [[ $timeout_exit -eq 124 ]]; then
            log_error "Test runner timed out after ${TEST_TIMEOUT} seconds"
            log_error "Consider optimizing tests or increasing TEST_TIMEOUT"
        else
            log_error "Test runner failed with exit code: $timeout_exit"
        fi
        test_runner_exit_code=$timeout_exit
    fi
    
    local section_duration=$(calculate_execution_time $section_start_time)
    log_info "Test runner execution time: $section_duration"
    
    return $test_runner_exit_code
}

# Execute post-test validation using Node.js
execute_test_validation() {
    local section_start_time=$(date +%s)
    
    print_section_header "EXECUTING TEST VALIDATION"
    
    log_info "Invoking test results validation..."
    log_info "Command: node \"$VALIDATE_SCRIPT_PATH\""
    
    # Change to project root directory for proper path resolution
    cd "$PROJECT_ROOT"
    
    # Execute the validation script
    local validation_exit_code=0
    
    if node "$VALIDATE_SCRIPT_PATH"; then
        log_success "Test validation completed successfully"
        validation_exit_code=0
    else
        validation_exit_code=$?
        log_error "Test validation failed with exit code: $validation_exit_code"
    fi
    
    local section_duration=$(calculate_execution_time $section_start_time)
    log_info "Test validation execution time: $section_duration"
    
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
    log_error "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    log_error "Troubleshooting Steps:"
    log_error "1. Ensure Node.js v22.x LTS is installed and in PATH"
    log_error "2. Run 'npm install' to install all dependencies"
    log_error "3. Verify all test files exist in expected locations"
    log_error "4. Check for any syntax errors in TypeScript files"
    log_error "5. Review previous error messages for specific issues"
    
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
    # rm -f /tmp/test-runner-*.tmp 2>/dev/null || true
    
    log_debug "Cleanup completed"
}

# Signal handlers for graceful shutdown
handle_interrupt() {
    print_section_header "SCRIPT INTERRUPTED"
    
    log_warning "Test execution interrupted by user (SIGINT/SIGTERM)"
    log_info "Performing cleanup and exiting..."
    
    cleanup_on_exit
    exit $FAILURE_EXIT_CODE
}

# ==============================================================================
# MAIN EXECUTION FUNCTION
# ==============================================================================

# Main orchestration function that coordinates all test execution steps
main() {
    # Set up error handling
    trap 'handle_unexpected_error $LINENO' ERR
    trap 'handle_interrupt' INT TERM
    
    # Script initialization
    print_section_header "NODE.JS TUTORIAL TEST ORCHESTRATION"
    
    log_info "Starting test orchestration script: $SCRIPT_NAME v$SCRIPT_VERSION"
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
    setup_test_environment
    display_environment_info
    
    # Step 3: Test Execution
    local test_runner_success=false
    local validation_success=false
    
    # Execute test runner
    if execute_test_runner; then
        test_runner_success=true
        log_success "✅ Test runner execution: PASSED"
    else
        log_error "❌ Test runner execution: FAILED"
        
        print_section_header "TEST EXECUTION FAILED"
        log_error "Test execution failed - build cannot proceed"
        log_error "Please review test failures and fix issues before committing"
        
        log_error "Next Steps:"
        log_error "1. Review test failure messages above"
        log_error "2. Fix failing tests in your code"
        log_error "3. Run tests locally: npm test"
        log_error "4. Commit changes once all tests pass"
        
        cleanup_on_exit
        exit $FAILURE_EXIT_CODE
    fi
    
    # Execute validation if tests passed
    if [[ "$test_runner_success" == "true" ]]; then
        if execute_test_validation; then
            validation_success=true
            log_success "✅ Test validation: PASSED"
        else
            log_error "❌ Test validation: FAILED"
            
            print_section_header "TEST VALIDATION FAILED"
            log_error "Test validation failed - coverage or quality gates not met"
            log_error "Please improve test coverage or fix validation issues"
            
            log_error "Next Steps:"
            log_error "1. Review coverage report in coverage/ directory"
            log_error "2. Add tests to improve coverage metrics"
            log_error "3. Fix any code quality issues identified"
            log_error "4. Re-run tests to verify improvements"
            
            cleanup_on_exit
            exit $FAILURE_EXIT_CODE
        fi
    fi
    
    # Step 4: Success Summary
    if [[ "$test_runner_success" == "true" && "$validation_success" == "true" ]]; then
        print_section_header "TEST ORCHESTRATION COMPLETE - SUCCESS"
        
        local total_duration=$(calculate_execution_time $SCRIPT_START_TIME)
        
        log_success "🎉 ALL TESTS AND VALIDATIONS PASSED!"
        log_success "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        log_success "✅ Test Execution: PASSED"
        log_success "✅ Coverage Validation: PASSED"
        log_success "✅ Quality Gates: PASSED"
        log_success "🚀 Build is ready to proceed!"
        log_success "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        log_success "Total execution time: $total_duration"
        log_success "Completed at: $(date)"
        log_success "Ready for deployment! 🚀"
        
        cleanup_on_exit
        exit $SUCCESS_EXIT_CODE
    else
        print_section_header "TEST ORCHESTRATION FAILED"
        
        log_error "Test orchestration did not complete successfully"
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
    echo "Node.js Tutorial Application Test Orchestration Script"
    echo ""
    echo "This script orchestrates the execution of all tests and quality gates"
    echo "for the Node.js tutorial application, providing a single entry point"
    echo "for both local development and CI/CD pipeline integration."
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message and exit"
    echo "  -v, --version  Show script version and exit"
    echo "  -d, --debug    Enable debug output"
    echo ""
    echo "Environment Variables:"
    echo "  DEBUG=true     Enable debug logging"
    echo "  CI=true        Indicate CI/CD environment"
    echo "  TEST_TIMEOUT   Test execution timeout in seconds (default: 300)"
    echo ""
    echo "Examples:"
    echo "  $0                    # Run all tests with default settings"
    echo "  $0 --debug            # Run with debug output enabled"
    echo "  DEBUG=true $0         # Run with debug output via environment"
    echo "  TEST_TIMEOUT=600 $0   # Run with extended timeout"
    echo ""
    echo "Exit Codes:"
    echo "  0    Success - All tests passed and quality gates met"
    echo "  1    Failure - Tests failed or quality gates not met"
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