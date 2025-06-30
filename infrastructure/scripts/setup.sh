#!/usr/bin/env bash

# =============================================================================
# NODE.JS TUTORIAL BACKEND - ENVIRONMENT SETUP SCRIPT
# =============================================================================
# 
# This script automates the environment setup for the Node.js tutorial backend
# application. It validates the local environment, checks for required tools,
# installs dependencies, and ensures proper configuration.
#
# COMPATIBILITY:
# - Bash >=5.0
# - Node.js >=18.0.0 (recommended: v22.x LTS)
# - npm >=9.0.0
# - Docker >=20.10
# - Docker Compose >=1.29
#
# USAGE:
#   ./setup.sh [OPTIONS]
#   source ./setup.sh [OPTIONS]
#
# OPTIONS:
#   --help          Display this help message
#   --skip-docker   Skip Docker and Docker Compose version checks
#   --force-install Force reinstallation of dependencies
#   --verbose       Enable verbose output
#   --check-only    Only perform version checks without installation
#
# EDUCATIONAL PURPOSE:
# This script demonstrates best practices for Node.js environment setup,
# including version validation, dependency management, and configuration
# handling suitable for onboarding and CI/CD workflows.
#
# AUTHORS: Node.js Tutorial Team
# VERSION: 1.0.0
# LICENSE: MIT
# =============================================================================

# -----------------------------------------------------------------------------
# SCRIPT CONFIGURATION AND SAFETY SETTINGS
# -----------------------------------------------------------------------------

# Exit immediately if a command exits with a non-zero status
set -e

# Exit immediately if an undefined variable is used
set -u

# The return value of a pipeline is the value of the last command to exit with
# a non-zero status, or zero if all commands in the pipeline exit successfully
set -o pipefail

# Enable extended debugging (optional, controlled by DEBUG environment variable)
if [[ "${DEBUG:-}" == "true" ]]; then
    set -x
fi

# -----------------------------------------------------------------------------
# GLOBAL CONSTANTS AND DIRECTORY RESOLUTION
# -----------------------------------------------------------------------------

# Resolve script directory using BASH_SOURCE for reliable path detection
readonly SETUP_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Define project structure paths relative to script location
readonly PROJECT_ROOT="$(cd "$SETUP_SCRIPT_DIR/../.." && pwd)"
readonly BACKEND_DIR="$PROJECT_ROOT/src/backend"
readonly PACKAGE_JSON="$BACKEND_DIR/package.json"
readonly ENV_EXAMPLE_FILE="$BACKEND_DIR/.env.example"
readonly ENV_FILE="$BACKEND_DIR/.env"

# Version requirements based on technical specifications
readonly MIN_NODE_VERSION="18.0.0"
readonly RECOMMENDED_NODE_VERSION="22.11.0"
readonly MIN_NPM_VERSION="9.0.0"
readonly MIN_DOCKER_VERSION="20.10"
readonly MIN_DOCKER_COMPOSE_VERSION="1.29"

# Color codes for enhanced output readability
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly WHITE='\033[1;37m'
readonly NC='\033[0m' # No Color

# Script execution flags (can be modified by command line arguments)
SKIP_DOCKER_CHECK=false
FORCE_INSTALL=false
VERBOSE_MODE=false
CHECK_ONLY=false

# -----------------------------------------------------------------------------
# UTILITY FUNCTIONS FOR OUTPUT AND LOGGING
# -----------------------------------------------------------------------------

# Function: log_info
# Purpose: Display informational messages with consistent formatting
# Parameters: $1 - Message to display
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Function: log_success
# Purpose: Display success messages with green highlighting
# Parameters: $1 - Success message to display
log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Function: log_warning
# Purpose: Display warning messages with yellow highlighting
# Parameters: $1 - Warning message to display
log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function: log_error
# Purpose: Display error messages with red highlighting
# Parameters: $1 - Error message to display
log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

# Function: log_verbose
# Purpose: Display verbose debug information when verbose mode is enabled
# Parameters: $1 - Debug message to display
log_verbose() {
    if [[ "$VERBOSE_MODE" == "true" ]]; then
        echo -e "${PURPLE}[VERBOSE]${NC} $1"
    fi
}

# Function: print_separator
# Purpose: Print a visual separator for output organization
print_separator() {
    echo -e "${CYAN}===============================================================================${NC}"
}

# -----------------------------------------------------------------------------
# CORE SETUP FUNCTIONS
# -----------------------------------------------------------------------------

# Function: print_usage
# Purpose: Display comprehensive usage instructions and available options
# Returns: void (prints to stdout)
print_usage() {
    cat << 'EOF'
===============================================================================
NODE.JS TUTORIAL BACKEND - ENVIRONMENT SETUP SCRIPT
===============================================================================

DESCRIPTION:
    Automates environment setup for the Node.js tutorial backend application.
    Validates local environment, checks required tools, installs dependencies,
    and ensures proper configuration files are present.

USAGE:
    ./setup.sh [OPTIONS]
    source ./setup.sh [OPTIONS]

OPTIONS:
    --help              Display this help message and exit
    --skip-docker       Skip Docker and Docker Compose version checks
    --force-install     Force reinstallation of Node.js dependencies
    --verbose           Enable verbose output for debugging
    --check-only        Only perform version checks without installation

REQUIREMENTS:
    - Bash >=5.0
    - Node.js >=18.0.0 (recommended: v22.x LTS)
    - npm >=9.0.0 (bundled with Node.js)
    - Docker >=20.10 (optional, for containerization)
    - Docker Compose >=1.29 (optional, for orchestration)

EXAMPLES:
    # Standard setup
    ./setup.sh

    # Setup with verbose output
    ./setup.sh --verbose

    # Check versions only
    ./setup.sh --check-only

    # Skip Docker checks for development-only setup
    ./setup.sh --skip-docker

EDUCATIONAL NOTES:
    This script demonstrates Node.js environment setup best practices:
    - Version validation and compatibility checking
    - Dependency management with npm ci for reproducible builds
    - Environment configuration with .env file handling
    - Error handling and user feedback patterns
    - Bash scripting techniques for infrastructure automation

For more information, see: src/backend/README.md

===============================================================================
EOF
}

# Function: parse_arguments
# Purpose: Parse command-line arguments and set corresponding flags
# Parameters: All command-line arguments passed to script ($@)
# Returns: void (sets global flag variables)
parse_arguments() {
    log_verbose "Parsing command-line arguments: $*"
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --help|-h)
                print_usage
                exit 0
                ;;
            --skip-docker)
                SKIP_DOCKER_CHECK=true
                log_verbose "Docker checks will be skipped"
                shift
                ;;
            --force-install)
                FORCE_INSTALL=true
                log_verbose "Dependencies will be force-reinstalled"
                shift
                ;;
            --verbose|-v)
                VERBOSE_MODE=true
                log_verbose "Verbose mode enabled"
                shift
                ;;
            --check-only)
                CHECK_ONLY=true
                log_verbose "Check-only mode enabled"
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                log_info "Use --help for usage information"
                exit 1
                ;;
        esac
    done
}

# Function: version_compare
# Purpose: Compare two semantic version strings
# Parameters: $1 - First version, $2 - Second version
# Returns: 0 if $1 >= $2, 1 otherwise
version_compare() {
    local version1="$1"
    local version2="$2"
    
    # Remove 'v' prefix if present
    version1="${version1#v}"
    version2="${version2#v}"
    
    # Split versions into arrays
    IFS='.' read -ra ver1_parts <<< "$version1"
    IFS='.' read -ra ver2_parts <<< "$version2"
    
    # Compare major, minor, patch versions
    for i in {0..2}; do
        local v1="${ver1_parts[i]:-0}"
        local v2="${ver2_parts[i]:-0}"
        
        # Remove non-numeric suffixes (e.g., "1.2.3-beta" -> "1.2.3")
        v1="${v1%%[^0-9]*}"
        v2="${v2%%[^0-9]*}"
        
        if (( v1 > v2 )); then
            return 0
        elif (( v1 < v2 )); then
            return 1
        fi
    done
    
    return 0  # Versions are equal
}

# Function: check_node_npm_versions
# Purpose: Validate Node.js and npm installations and versions
# Returns: void (exits with error if requirements not met)
check_node_npm_versions() {
    log_info "Checking Node.js and npm versions..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed or not in PATH"
        log_info "Please install Node.js v${RECOMMENDED_NODE_VERSION} (LTS) from: https://nodejs.org/"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed or not in PATH"
        log_info "npm should be bundled with Node.js. Please reinstall Node.js."
        exit 1
    fi
    
    # Get installed versions
    local node_version
    local npm_version
    node_version=$(node --version)
    npm_version=$(npm --version)
    
    log_verbose "Detected Node.js version: $node_version"
    log_verbose "Detected npm version: $npm_version"
    
    # Validate Node.js version
    if ! version_compare "$node_version" "$MIN_NODE_VERSION"; then
        log_error "Node.js version $node_version is below minimum required version $MIN_NODE_VERSION"
        log_info "Please upgrade to Node.js v${RECOMMENDED_NODE_VERSION} (LTS) or higher"
        log_info "Download from: https://nodejs.org/ or use a version manager like nvm"
        exit 1
    fi
    
    # Validate npm version
    if ! version_compare "$npm_version" "$MIN_NPM_VERSION"; then
        log_error "npm version $npm_version is below minimum required version $MIN_NPM_VERSION"
        log_info "Please upgrade npm with: npm install -g npm@latest"
        exit 1
    fi
    
    # Check if using recommended Node.js version
    if ! version_compare "$node_version" "$RECOMMENDED_NODE_VERSION"; then
        log_warning "Node.js version $node_version is below recommended version $RECOMMENDED_NODE_VERSION (LTS)"
        log_info "Consider upgrading to Node.js v${RECOMMENDED_NODE_VERSION} for optimal compatibility"
    fi
    
    log_success "Node.js $node_version and npm $npm_version meet requirements"
    
    # Display additional Node.js information in verbose mode
    if [[ "$VERBOSE_MODE" == "true" ]]; then
        log_verbose "Node.js installation path: $(which node)"
        log_verbose "npm installation path: $(which npm)"
        log_verbose "Node.js architecture: $(node -e 'console.log(process.arch)')"
        log_verbose "Node.js platform: $(node -e 'console.log(process.platform)')"
    fi
}

# Function: check_docker_tools
# Purpose: Validate Docker and Docker Compose installations and versions
# Returns: void (exits with error if Docker is required but not available)
check_docker_tools() {
    if [[ "$SKIP_DOCKER_CHECK" == "true" ]]; then
        log_info "Skipping Docker and Docker Compose version checks (--skip-docker)"
        return 0
    fi
    
    log_info "Checking Docker and Docker Compose availability..."
    
    local docker_available=false
    local docker_compose_available=false
    
    # Check Docker installation
    if command -v docker &> /dev/null; then
        local docker_version
        docker_version=$(docker --version | grep -oP 'Docker version \K[0-9]+\.[0-9]+(\.[0-9]+)?')
        log_verbose "Detected Docker version: $docker_version"
        
        if version_compare "$docker_version" "$MIN_DOCKER_VERSION"; then
            docker_available=true
            log_success "Docker $docker_version meets requirements"
        else
            log_warning "Docker version $docker_version is below minimum required version $MIN_DOCKER_VERSION"
        fi
    else
        log_warning "Docker is not installed or not in PATH"
    fi
    
    # Check Docker Compose installation
    if command -v docker-compose &> /dev/null; then
        local compose_version
        compose_version=$(docker-compose --version | grep -oP 'docker-compose version \K[0-9]+\.[0-9]+(\.[0-9]+)?')
        log_verbose "Detected Docker Compose version: $compose_version"
        
        if version_compare "$compose_version" "$MIN_DOCKER_COMPOSE_VERSION"; then
            docker_compose_available=true
            log_success "Docker Compose $compose_version meets requirements"
        else
            log_warning "Docker Compose version $compose_version is below minimum required version $MIN_DOCKER_COMPOSE_VERSION"
        fi
    elif docker compose version &> /dev/null; then
        # Check for newer 'docker compose' command (part of Docker CLI)
        local compose_version
        compose_version=$(docker compose version --short)
        log_verbose "Detected Docker Compose (plugin) version: $compose_version"
        
        if version_compare "$compose_version" "$MIN_DOCKER_COMPOSE_VERSION"; then
            docker_compose_available=true
            log_success "Docker Compose (plugin) $compose_version meets requirements"
        else
            log_warning "Docker Compose (plugin) version $compose_version is below minimum required version $MIN_DOCKER_COMPOSE_VERSION"
        fi
    else
        log_warning "Docker Compose is not installed or not in PATH"
    fi
    
    # Provide installation guidance if Docker tools are missing
    if [[ "$docker_available" == "false" ]] || [[ "$docker_compose_available" == "false" ]]; then
        log_info "Docker and Docker Compose are optional for local development"
        log_info "To install Docker, visit: https://docs.docker.com/get-docker/"
        log_info "To skip Docker checks in future runs, use: ./setup.sh --skip-docker"
    fi
    
    # Display Docker system information in verbose mode
    if [[ "$VERBOSE_MODE" == "true" ]] && [[ "$docker_available" == "true" ]]; then
        log_verbose "Docker installation path: $(which docker)"
        if docker info &> /dev/null; then
            log_verbose "Docker daemon is running"
        else
            log_verbose "Docker daemon is not running or accessible"
        fi
    fi
}

# Function: validate_project_structure
# Purpose: Ensure required project files and directories exist
# Returns: void (exits with error if critical files are missing)
validate_project_structure() {
    log_info "Validating project structure..."
    
    # Check if backend directory exists
    if [[ ! -d "$BACKEND_DIR" ]]; then
        log_error "Backend directory not found: $BACKEND_DIR"
        log_info "This script should be run from the project root or infrastructure/scripts directory"
        exit 1
    fi
    
    # Check if package.json exists
    if [[ ! -f "$PACKAGE_JSON" ]]; then
        log_error "package.json not found: $PACKAGE_JSON"
        log_info "Ensure you are running this script from the correct project directory"
        exit 1
    fi
    
    log_verbose "Backend directory: $BACKEND_DIR"
    log_verbose "Package.json path: $PACKAGE_JSON"
    log_verbose "Environment example file: $ENV_EXAMPLE_FILE"
    log_verbose "Environment file: $ENV_FILE"
    
    log_success "Project structure validation completed"
}

# Function: install_node_dependencies
# Purpose: Install Node.js dependencies using npm ci for reproducible builds
# Returns: void (exits with error if installation fails)
install_node_dependencies() {
    if [[ "$CHECK_ONLY" == "true" ]]; then
        log_info "Skipping dependency installation (--check-only mode)"
        return 0
    fi
    
    log_info "Installing Node.js dependencies..."
    
    # Change to backend directory for npm operations
    cd "$BACKEND_DIR" || {
        log_error "Failed to change to backend directory: $BACKEND_DIR"
        exit 1
    }
    
    # Check if package-lock.json exists for npm ci
    if [[ -f "package-lock.json" ]]; then
        log_verbose "package-lock.json found, using npm ci for reproducible installation"
        
        # Remove node_modules if force install is requested
        if [[ "$FORCE_INSTALL" == "true" ]] && [[ -d "node_modules" ]]; then
            log_info "Removing existing node_modules directory (--force-install)"
            rm -rf node_modules
        fi
        
        # Use npm ci for clean, reproducible installation
        if [[ "$VERBOSE_MODE" == "true" ]]; then
            npm ci --verbose
        else
            npm ci
        fi
    else
        log_warning "package-lock.json not found, using npm install"
        log_info "Consider committing package-lock.json for reproducible builds"
        
        # Use npm install as fallback
        if [[ "$VERBOSE_MODE" == "true" ]]; then
            npm install --verbose
        else
            npm install
        fi
    fi
    
    log_success "Node.js dependencies installed successfully"
    
    # Display dependency information in verbose mode
    if [[ "$VERBOSE_MODE" == "true" ]]; then
        log_verbose "Installed packages:"
        npm list --depth=0 2>/dev/null || true
        
        # Show package sizes if du command is available
        if command -v du &> /dev/null && [[ -d "node_modules" ]]; then
            local node_modules_size
            node_modules_size=$(du -sh node_modules 2>/dev/null | cut -f1)
            log_verbose "node_modules directory size: $node_modules_size"
        fi
    fi
    
    # Return to original directory
    cd - > /dev/null || true
}

# Function: validate_env_file
# Purpose: Ensure .env file exists, creating from .env.example if necessary
# Returns: void (ensures .env file is present or exits with error)
validate_env_file() {
    log_info "Validating environment configuration file..."
    
    # Check if .env file already exists
    if [[ -f "$ENV_FILE" ]]; then
        log_success ".env file is present: $ENV_FILE"
        
        # Validate basic .env file structure in verbose mode
        if [[ "$VERBOSE_MODE" == "true" ]]; then
            local env_lines
            env_lines=$(grep -c "^[A-Z_][A-Z0-9_]*=" "$ENV_FILE" 2>/dev/null || echo "0")
            log_verbose ".env file contains $env_lines environment variable definitions"
        fi
        
        return 0
    fi
    
    # Check if .env.example exists to copy from
    if [[ -f "$ENV_EXAMPLE_FILE" ]]; then
        log_warning ".env file not found, copying from .env.example"
        
        # Copy .env.example to .env
        if cp "$ENV_EXAMPLE_FILE" "$ENV_FILE"; then
            log_success ".env file created from .env.example template"
            log_info "Please review and customize $ENV_FILE as needed for your environment"
            
            # Display important environment variables that may need customization
            log_info "Key environment variables to review:"
            log_info "  - PORT: HTTP server port (default: 3000)"
            log_info "  - HOST: Server host binding (default: localhost)"
            log_info "  - NODE_ENV: Application environment (default: development)"
        else
            log_error "Failed to copy .env.example to .env"
            exit 1
        fi
    else
        log_error "Neither .env nor .env.example found in $BACKEND_DIR"
        log_info "Environment configuration is required for proper application setup"
        log_info "Expected files:"
        log_info "  - $ENV_FILE (runtime configuration)"
        log_info "  - $ENV_EXAMPLE_FILE (configuration template)"
        exit 1
    fi
}

# Function: run_basic_health_checks
# Purpose: Perform basic validation of the setup environment
# Returns: void (logs health check results)
run_basic_health_checks() {
    if [[ "$CHECK_ONLY" == "true" ]]; then
        log_info "Skipping health checks (--check-only mode)"
        return 0
    fi
    
    log_info "Running basic health checks..."
    
    # Change to backend directory for health checks
    cd "$BACKEND_DIR" || {
        log_error "Failed to change to backend directory for health checks"
        exit 1
    }
    
    # Check if main application file exists
    local main_file
    main_file=$(node -pe "require('./package.json').main" 2>/dev/null || echo "server.js")
    
    if [[ -f "$main_file" ]]; then
        log_success "Main application file found: $main_file"
    else
        log_warning "Main application file not found: $main_file"
        log_info "Check package.json 'main' field or ensure server.js exists"
    fi
    
    # Validate package.json structure
    if node -pe "JSON.parse(require('fs').readFileSync('package.json', 'utf8')); 'valid'" &>/dev/null; then
        log_success "package.json has valid JSON structure"
    else
        log_error "package.json has invalid JSON structure"
        exit 1
    fi
    
    # Check critical dependencies in package.json
    local express_version
    express_version=$(node -pe "require('./package.json').dependencies.express" 2>/dev/null || echo "not found")
    
    if [[ "$express_version" != "not found" ]]; then
        log_success "Express.js dependency found: $express_version"
    else
        log_warning "Express.js dependency not found in package.json"
    fi
    
    # Return to original directory
    cd - > /dev/null || true
    
    log_success "Basic health checks completed"
}

# Function: print_success
# Purpose: Display setup completion summary and next steps
# Returns: void (prints summary to stdout)
print_success() {
    print_separator
    log_success "Environment setup completed successfully!"
    print_separator
    
    echo ""
    echo -e "${WHITE}SETUP SUMMARY:${NC}"
    echo -e "  ${GREEN}✓${NC} Node.js and npm versions validated"
    
    if [[ "$SKIP_DOCKER_CHECK" == "false" ]]; then
        echo -e "  ${GREEN}✓${NC} Docker tools availability checked"
    else
        echo -e "  ${YELLOW}~${NC} Docker tools check skipped"
    fi
    
    echo -e "  ${GREEN}✓${NC} Project structure validated"
    
    if [[ "$CHECK_ONLY" == "false" ]]; then
        echo -e "  ${GREEN}✓${NC} Node.js dependencies installed"
        echo -e "  ${GREEN}✓${NC} Environment configuration validated"
        echo -e "  ${GREEN}✓${NC} Basic health checks completed"
    else
        echo -e "  ${YELLOW}~${NC} Installation steps skipped (check-only mode)"
    fi
    
    echo ""
    echo -e "${WHITE}NEXT STEPS:${NC}"
    echo ""
    echo -e "  ${CYAN}1. Start the development server:${NC}"
    echo -e "     cd src/backend && npm start"
    echo ""
    echo -e "  ${CYAN}2. Test the application:${NC}"
    echo -e "     curl http://localhost:3000/hello"
    echo ""
    echo -e "  ${CYAN}3. Development workflow:${NC}"
    echo -e "     cd src/backend && npm run dev  ${YELLOW}# Auto-restart on changes${NC}"
    echo ""
    echo -e "  ${CYAN}4. Run tests:${NC}"
    echo -e "     cd src/backend && npm test"
    echo ""
    echo -e "  ${CYAN}5. Docker deployment (optional):${NC}"
    echo -e "     docker-compose -f infrastructure/docker/docker-compose.yml up"
    echo ""
    echo -e "${WHITE}DOCUMENTATION:${NC}"
    echo -e "  • Backend README: ${CYAN}src/backend/README.md${NC}"
    echo -e "  • API Documentation: ${CYAN}http://localhost:3000/docs${NC} (when server is running)"
    echo -e "  • Health Check: ${CYAN}http://localhost:3000/health${NC} (when server is running)"
    echo ""
    echo -e "${WHITE}TROUBLESHOOTING:${NC}"
    echo -e "  • Re-run with verbose output: ${CYAN}./setup.sh --verbose${NC}"
    echo -e "  • Force dependency reinstall: ${CYAN}./setup.sh --force-install${NC}"
    echo -e "  • Check only without changes: ${CYAN}./setup.sh --check-only${NC}"
    echo ""
    print_separator
    echo -e "${GREEN}Happy coding with Node.js! 🚀${NC}"
    print_separator
}

# -----------------------------------------------------------------------------
# MAIN EXECUTION FLOW
# -----------------------------------------------------------------------------

# Function: main
# Purpose: Main execution flow orchestrating all setup steps
# Parameters: All command-line arguments ($@)
# Returns: void (exits with appropriate status code)
main() {
    # Display script header
    print_separator
    echo -e "${WHITE}NODE.JS TUTORIAL BACKEND - ENVIRONMENT SETUP${NC}"
    echo -e "${CYAN}Automating environment validation, dependency installation, and configuration${NC}"
    print_separator
    echo ""
    
    # Parse command-line arguments
    parse_arguments "$@"
    
    # Execute setup steps in logical order
    log_info "Starting environment setup process..."
    echo ""
    
    # Step 1: Validate project structure
    validate_project_structure
    echo ""
    
    # Step 2: Check Node.js and npm versions
    check_node_npm_versions
    echo ""
    
    # Step 3: Check Docker tools (optional)
    check_docker_tools
    echo ""
    
    # Step 4: Install Node.js dependencies
    install_node_dependencies
    echo ""
    
    # Step 5: Validate environment configuration
    validate_env_file
    echo ""
    
    # Step 6: Run basic health checks
    run_basic_health_checks
    echo ""
    
    # Step 7: Display success summary
    print_success
}

# -----------------------------------------------------------------------------
# SCRIPT EXECUTION ENTRY POINT
# -----------------------------------------------------------------------------

# Only execute main function if script is run directly (not sourced)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    # Trap signals for graceful cleanup
    trap 'log_error "Setup interrupted by user"; exit 130' INT TERM
    
    # Execute main function with all provided arguments
    main "$@"
    
    # Exit with success status
    exit 0
fi

# -----------------------------------------------------------------------------
# EXPORTED FUNCTIONS FOR EXTERNAL USE
# -----------------------------------------------------------------------------

# Export functions for use in other scripts when this file is sourced
# This allows other infrastructure scripts (deploy.sh, monitoring-setup.sh) 
# to leverage these setup utilities

# shellcheck disable=SC2034
{
    # Mark functions as available for export
    export -f print_usage
    export -f parse_arguments
    export -f check_node_npm_versions
    export -f check_docker_tools
    export -f install_node_dependencies
    export -f validate_env_file
    export -f print_success
    export -f log_info
    export -f log_success
    export -f log_warning
    export -f log_error
    export -f log_verbose
    export -f version_compare
}

# Export global constants for use in other scripts
export SETUP_SCRIPT_DIR
export BACKEND_DIR
export PACKAGE_JSON
export ENV_EXAMPLE_FILE
export ENV_FILE

# =============================================================================
# END OF SETUP SCRIPT
# =============================================================================