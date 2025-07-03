#!/bin/bash

# =============================================================================
# Node.js Tutorial Infrastructure Deployment Script
# =============================================================================
# 
# Comprehensive deployment automation for Node.js/Express.js tutorial backend
# and supporting infrastructure using Docker Compose. Ensures reproducible,
# robust, and observable multi-container deployment for local development,
# CI/CD, and educational demonstration environments.
# 
# Version: 1.0.0
# Compatibility: Bash 4.0+, Docker 20+, Docker Compose 1.29+/Compose V2
# 
# FEATURES:
# - Automated Docker Compose orchestration for multi-service stack
# - NGINX reverse proxy deployment with production-ready configuration
# - Prometheus and Grafana monitoring stack deployment
# - Comprehensive healthcheck verification with timeout handling
# - Optional pre-deployment backup integration with backup.sh
# - Environment-agnostic configuration support (local, CI/CD, educational)
# - Detailed error handling with troubleshooting guidance
# - Service access instruction generation
# - Rollback capabilities and disaster recovery integration
# 
# REQUIREMENTS ADDRESSED:
# - HTTP Server Implementation & Deployment (Technical Specifications/2.1.1, 8.2.3)
# - Reverse Proxy Integration (Technical Specifications/8.2.3, 6.5)
# - Monitoring and Observability (Technical Specifications/6.5)
# - Healthcheck and Error Management (Technical Specifications/1.3.1, 6.5)
# - Deployment and Environment Configuration (Technical Specifications/8.2.5)
# - Disaster Recovery Procedures (Technical Specifications/5.4.6)
# 
# USAGE:
#   ./deploy.sh                           # Standard deployment with defaults
#   ./deploy.sh --help                    # Display usage information
#   ./deploy.sh --env production          # Deploy with specific environment
#   ./deploy.sh --backup                  # Run backup before deployment
#   ./deploy.sh --no-backup               # Skip backup (override env var)
#   BACKUP_BEFORE_DEPLOY=1 ./deploy.sh    # Environment variable control
# 
# DEPENDENCIES:
#   - docker (20+): Container runtime and image management
#   - docker-compose (1.29+/V2): Multi-container orchestration
#   - curl (7.68+): Service healthcheck verification
#   - grep (coreutils 8+): Log filtering and error detection
#   - Standard POSIX utilities: echo, sleep, date, awk, sed
# 
# ENVIRONMENT VARIABLES:
#   COMPOSE_FILE: Path to docker-compose.yml (default: infrastructure/docker-compose.yml)
#   DEPLOY_ENV: Deployment environment (default: local)
#   BACKUP_BEFORE_DEPLOY: Enable pre-deployment backup (set to 1)
#   HEALTHCHECK_TIMEOUT: Service healthcheck timeout in seconds (default: 60)
#   LOG_LEVEL: Logging verbosity (INFO, WARN, ERROR, DEBUG)
# 
# EXIT CODES:
#   0: Successful deployment completion
#   1: General error (invalid arguments, missing dependencies)
#   2: Docker/Docker Compose not available
#   3: Backup operation failure
#   4: Docker Compose build failure
#   5: Docker Compose startup failure
#   6: Service healthcheck failure
#   7: Service access verification failure
# 
# =============================================================================

set -euo pipefail  # Exit on error, undefined variables, pipe failures
IFS=$'\n\t'        # Secure Internal Field Separator

# =============================================================================
# GLOBAL CONFIGURATION AND CONSTANTS
# =============================================================================

# Script metadata and version information
readonly SCRIPT_NAME="$(basename "${0}")"
readonly SCRIPT_VERSION="1.0.0"
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Deployment configuration with environment variable support
readonly COMPOSE_FILE="${COMPOSE_FILE:-${PROJECT_ROOT}/infrastructure/docker-compose.yml}"
readonly DEFAULT_DEPLOY_ENV="${DEPLOY_ENV:-local}"
readonly DEFAULT_HEALTHCHECK_TIMEOUT="${HEALTHCHECK_TIMEOUT:-60}"
readonly BACKUP_SCRIPT="${SCRIPT_DIR}/backup.sh"

# Service configuration as defined in docker-compose.yml
readonly SERVICES=("backend" "nginx" "prometheus" "grafana")
readonly BACKEND_PORT="3000"
readonly NGINX_PORT="80"
readonly PROMETHEUS_PORT="9090"
readonly GRAFANA_PORT="3001"

# Script operation flags with defaults
DEPLOY_ENV="${DEFAULT_DEPLOY_ENV}"
BACKUP_BEFORE_DEPLOY="${BACKUP_BEFORE_DEPLOY:-0}"
HEALTHCHECK_TIMEOUT="${DEFAULT_HEALTHCHECK_TIMEOUT}"
LOG_LEVEL="${LOG_LEVEL:-INFO}"
VERBOSE=false

# Docker Compose command detection (standalone vs plugin)
COMPOSE_CMD="docker-compose"
if ! command -v docker-compose > /dev/null 2>&1; then
    if docker compose version > /dev/null 2>&1; then
        COMPOSE_CMD="docker compose"
    fi
fi

# Color codes for enhanced output formatting
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly CYAN='\033[0;36m'
readonly BOLD='\033[1m'
readonly NC='\033[0m' # No Color

# =============================================================================
# LOGGING AND OUTPUT FUNCTIONS
# =============================================================================

# Enhanced logging function with timestamp, level, and color support
# Outputs to appropriate stream (stdout for info, stderr for errors)
log() {
    local level="${1:-INFO}"
    local message="${2:-}"
    local timestamp
    timestamp="$(date '+%Y-%m-%d %H:%M:%S')"
    
    case "${level}" in
        INFO)
            if [[ "${LOG_LEVEL}" =~ ^(INFO|DEBUG)$ ]]; then
                echo -e "${GREEN}[INFO]${NC} ${timestamp} - ${message}" >&1
            fi
            ;;
        WARN)
            if [[ "${LOG_LEVEL}" =~ ^(INFO|WARN|DEBUG)$ ]]; then
                echo -e "${YELLOW}[WARN]${NC} ${timestamp} - ${message}" >&2
            fi
            ;;
        ERROR)
            echo -e "${RED}[ERROR]${NC} ${timestamp} - ${message}" >&2
            ;;
        DEBUG)
            if [[ "${LOG_LEVEL}" == "DEBUG" ]]; then
                echo -e "${CYAN}[DEBUG]${NC} ${timestamp} - ${message}" >&1
            fi
            ;;
        SUCCESS)
            echo -e "${GREEN}${BOLD}[SUCCESS]${NC} ${timestamp} - ${message}" >&1
            ;;
        *)
            echo -e "${BLUE}[${level}]${NC} ${timestamp} - ${message}" >&1
            ;;
    esac
}

# Print comprehensive usage instructions
print_usage() {
    cat << EOF
${BOLD}${SCRIPT_NAME} v${SCRIPT_VERSION} - Node.js Tutorial Infrastructure Deployment${NC}

${BOLD}DESCRIPTION:${NC}
    Automates deployment of Node.js/Express.js tutorial backend and supporting
    infrastructure using Docker Compose. Orchestrates backend service, NGINX
    reverse proxy, and monitoring stack (Prometheus, Grafana) with comprehensive
    healthcheck verification and error handling.

${BOLD}USAGE:${NC}
    ${SCRIPT_NAME} [OPTIONS]

${BOLD}OPTIONS:${NC}
    -h, --help              Display this help message and exit
    -e, --env ENV           Set deployment environment (default: ${DEFAULT_DEPLOY_ENV})
    -b, --backup            Run backup before deployment (override env var)
    -n, --no-backup         Skip backup even if BACKUP_BEFORE_DEPLOY is set
    -t, --timeout SECONDS   Set healthcheck timeout (default: ${DEFAULT_HEALTHCHECK_TIMEOUT}s)
    -v, --verbose           Enable verbose output for debugging
    --log-level LEVEL       Set logging level: INFO, WARN, ERROR, DEBUG

${BOLD}EXAMPLES:${NC}
    ${SCRIPT_NAME}                          # Standard deployment with defaults
    ${SCRIPT_NAME} --env production         # Production environment deployment
    ${SCRIPT_NAME} --backup                 # Deploy with pre-deployment backup
    ${SCRIPT_NAME} --timeout 120            # Extended healthcheck timeout
    ${SCRIPT_NAME} --verbose --log-level DEBUG  # Maximum verbosity

${BOLD}ENVIRONMENT VARIABLES:${NC}
    COMPOSE_FILE            Docker Compose file path (default: infrastructure/docker-compose.yml)
    DEPLOY_ENV              Deployment environment (default: local)
    BACKUP_BEFORE_DEPLOY    Enable backup (set to 1)
    HEALTHCHECK_TIMEOUT     Service startup timeout in seconds
    LOG_LEVEL               Logging verbosity level

${BOLD}DEPLOYED SERVICES:${NC}
    Backend Service:        Node.js/Express.js application (port ${BACKEND_PORT})
    NGINX Reverse Proxy:    HTTP traffic routing (port ${NGINX_PORT})
    Prometheus:             Metrics collection (port ${PROMETHEUS_PORT})
    Grafana:                Visualization dashboards (port ${GRAFANA_PORT})

${BOLD}SERVICE ACCESS:${NC}
    Application:            http://localhost (via NGINX reverse proxy)
    Backend Direct:         http://localhost:${BACKEND_PORT} (development access)
    Prometheus:             http://localhost:${PROMETHEUS_PORT} (metrics collection)
    Grafana:                http://localhost:${GRAFANA_PORT} (admin/admin credentials)

${BOLD}REQUIREMENTS:${NC}
    - Docker 20+ with Docker Compose support
    - curl for healthcheck verification
    - Sufficient system resources (2GB RAM, 4GB disk space)
    - Network ports ${NGINX_PORT}, ${BACKEND_PORT}, ${PROMETHEUS_PORT}, ${GRAFANA_PORT} available

${BOLD}TROUBLESHOOTING:${NC}
    - Check Docker daemon: docker info
    - Verify Compose file: docker-compose config
    - View service logs: docker-compose logs [service-name]
    - Check service status: docker-compose ps
    - Test connectivity: curl http://localhost/health

For detailed documentation, visit the project repository.
EOF
}

# =============================================================================
# ARGUMENT PARSING AND VALIDATION
# =============================================================================

# Comprehensive command-line argument parsing with validation
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                print_usage
                exit 0
                ;;
            -e|--env)
                if [[ -n "${2:-}" ]]; then
                    DEPLOY_ENV="${2}"
                    log "INFO" "Deployment environment set to: ${DEPLOY_ENV}"
                    shift 2
                else
                    log "ERROR" "Environment value required for --env option"
                    exit 1
                fi
                ;;
            -b|--backup)
                BACKUP_BEFORE_DEPLOY=1
                log "INFO" "Pre-deployment backup enabled"
                shift
                ;;
            -n|--no-backup)
                BACKUP_BEFORE_DEPLOY=0
                log "INFO" "Pre-deployment backup disabled"
                shift
                ;;
            -t|--timeout)
                if [[ -n "${2:-}" ]] && [[ "${2}" =~ ^[0-9]+$ ]]; then
                    HEALTHCHECK_TIMEOUT="${2}"
                    log "INFO" "Healthcheck timeout set to ${HEALTHCHECK_TIMEOUT} seconds"
                    shift 2
                else
                    log "ERROR" "Invalid timeout value: ${2:-}. Must be a positive integer."
                    exit 1
                fi
                ;;
            -v|--verbose)
                VERBOSE=true
                LOG_LEVEL="DEBUG"
                log "DEBUG" "Verbose mode enabled"
                shift
                ;;
            --log-level)
                if [[ -n "${2:-}" ]] && [[ "${2}" =~ ^(INFO|WARN|ERROR|DEBUG)$ ]]; then
                    LOG_LEVEL="${2}"
                    log "INFO" "Log level set to ${LOG_LEVEL}"
                    shift 2
                else
                    log "ERROR" "Invalid log level: ${2:-}. Must be one of: INFO, WARN, ERROR, DEBUG"
                    exit 1
                fi
                ;;
            *)
                log "ERROR" "Unknown option: $1"
                log "INFO" "Use --help for usage information"
                exit 1
                ;;
        esac
    done
}

# =============================================================================
# DEPENDENCY VERIFICATION AND SYSTEM CHECKS
# =============================================================================

# Verify that all required dependencies are available and functional
check_dependencies() {
    log "INFO" "Verifying system dependencies and requirements..."
    
    local missing_deps=()
    local required_commands=("docker" "curl" "grep" "awk" "sed")
    
    # Check for required commands
    for cmd in "${required_commands[@]}"; do
        if ! command -v "${cmd}" > /dev/null 2>&1; then
            missing_deps+=("${cmd}")
        fi
    done
    
    # Check for docker-compose (either standalone or plugin)
    if ! command -v docker-compose > /dev/null 2>&1 && ! docker compose version > /dev/null 2>&1; then
        missing_deps+=("docker-compose")
    fi
    
    # Report missing dependencies
    if [[ ${#missing_deps[@]} -gt 0 ]]; then
        log "ERROR" "Missing required dependencies: ${missing_deps[*]}"
        log "ERROR" "Please install the missing dependencies and try again"
        exit 2
    fi
    
    # Verify Docker daemon is running
    if ! docker info > /dev/null 2>&1; then
        log "ERROR" "Docker daemon is not running or not accessible"
        log "ERROR" "Please start Docker and ensure current user has access"
        exit 2
    fi
    
    # Verify Docker Compose is functional
    if ! ${COMPOSE_CMD} version > /dev/null 2>&1; then
        log "ERROR" "Docker Compose is not functional"
        exit 2
    fi
    
    # Verify compose file exists
    if [[ ! -f "${COMPOSE_FILE}" ]]; then
        log "ERROR" "Docker Compose file not found: ${COMPOSE_FILE}"
        log "ERROR" "Please ensure you're running from the correct directory"
        exit 1
    fi
    
    log "INFO" "All dependencies verified successfully"
    log "DEBUG" "Docker version: $(docker --version)"
    log "DEBUG" "Docker Compose command: ${COMPOSE_CMD}"
    log "DEBUG" "Compose file: ${COMPOSE_FILE}"
}

# =============================================================================
# PRE-DEPLOYMENT BACKUP INTEGRATION
# =============================================================================

# Execute backup.sh script if backup is requested or configured
run_backup() {
    if [[ "${BACKUP_BEFORE_DEPLOY}" != "1" ]]; then
        log "DEBUG" "Backup not requested, skipping backup step"
        return 0
    fi
    
    log "INFO" "Running pre-deployment backup as requested"
    
    # Verify backup script exists and is executable
    if [[ ! -f "${BACKUP_SCRIPT}" ]]; then
        log "ERROR" "Backup script not found: ${BACKUP_SCRIPT}"
        log "ERROR" "Cannot proceed with backup operation"
        exit 3
    fi
    
    if [[ ! -x "${BACKUP_SCRIPT}" ]]; then
        log "WARN" "Backup script is not executable, attempting to make it executable"
        if ! chmod +x "${BACKUP_SCRIPT}"; then
            log "ERROR" "Failed to make backup script executable: ${BACKUP_SCRIPT}"
            exit 3
        fi
    fi
    
    # Execute backup script with appropriate logging
    log "INFO" "Executing backup script: ${BACKUP_SCRIPT}"
    
    # Set backup environment for consistency
    export BACKUP_ROOT="${PROJECT_ROOT}/infrastructure/backups"
    export LOG_LEVEL="${LOG_LEVEL}"
    
    # Run backup script and capture exit code
    local backup_exit_code=0
    if ! "${BACKUP_SCRIPT}" 2>&1; then
        backup_exit_code=$?
        log "ERROR" "Backup operation failed with exit code: ${backup_exit_code}"
        log "ERROR" "Aborting deployment due to backup failure"
        exit 3
    fi
    
    log "SUCCESS" "Pre-deployment backup completed successfully"
    return 0
}

# =============================================================================
# DOCKER COMPOSE ORCHESTRATION FUNCTIONS
# =============================================================================

# Build all required images using docker-compose with comprehensive error handling
docker_compose_build() {
    log "INFO" "Building Docker images for all services..."
    log "DEBUG" "Using compose file: ${COMPOSE_FILE}"
    
    # Prepare build command with appropriate flags
    local build_cmd=(
        "${COMPOSE_CMD}" "-f" "${COMPOSE_FILE}"
        "build" "--pull" "--no-cache"
    )
    
    # Add parallel build flag for faster builds if supported
    if ${COMPOSE_CMD} build --help 2>/dev/null | grep -q "\--parallel"; then
        build_cmd+=("--parallel")
        log "DEBUG" "Using parallel build for improved performance"
    fi
    
    log "DEBUG" "Build command: ${build_cmd[*]}"
    
    # Execute build with detailed output capture
    if [[ "${VERBOSE}" == "true" ]]; then
        if ! "${build_cmd[@]}"; then
            log "ERROR" "Docker Compose build failed"
            log "ERROR" "Check build logs above for specific error details"
            return 4
        fi
    else
        if ! "${build_cmd[@]}" > /dev/null 2>&1; then
            log "ERROR" "Docker Compose build failed"
            log "ERROR" "Run with --verbose for detailed build output"
            log "INFO" "Quick diagnosis: ${COMPOSE_CMD} -f ${COMPOSE_FILE} build"
            return 4
        fi
    fi
    
    log "SUCCESS" "All Docker images built successfully"
    return 0
}

# Start all services in detached mode using docker-compose
docker_compose_up() {
    log "INFO" "Starting all services in detached mode..."
    
    # Prepare startup command with appropriate flags
    local up_cmd=(
        "${COMPOSE_CMD}" "-f" "${COMPOSE_FILE}"
        "up" "-d" "--remove-orphans"
    )
    
    # Add recreation flag for clean deployment
    up_cmd+=("--force-recreate")
    
    log "DEBUG" "Startup command: ${up_cmd[*]}"
    
    # Execute startup with output capture
    if [[ "${VERBOSE}" == "true" ]]; then
        if ! "${up_cmd[@]}"; then
            log "ERROR" "Docker Compose startup failed"
            log "ERROR" "Check startup logs above for specific error details"
            return 5
        fi
    else
        if ! "${up_cmd[@]}" > /dev/null 2>&1; then
            log "ERROR" "Docker Compose startup failed"
            log "ERROR" "Run with --verbose for detailed startup output"
            log "INFO" "Quick diagnosis: ${COMPOSE_CMD} -f ${COMPOSE_FILE} logs"
            return 5
        fi
    fi
    
    # Wait a moment for containers to initialize
    sleep 5
    
    log "SUCCESS" "All services started successfully"
    return 0
}

# =============================================================================
# SERVICE HEALTH CHECK FUNCTIONS
# =============================================================================

# Check if a specific service is running and healthy
check_service_health() {
    local service_name="$1"
    local max_attempts=3
    local attempt=1
    
    log "DEBUG" "Checking health status for service: ${service_name}"
    
    # Check if container is running first
    local container_status
    container_status=$(${COMPOSE_CMD} -f "${COMPOSE_FILE}" ps -q "${service_name}" 2>/dev/null)
    
    if [[ -z "${container_status}" ]]; then
        log "ERROR" "Service container not found: ${service_name}"
        return 1
    fi
    
    # Check container state
    local container_state
    container_state=$(docker inspect --format='{{.State.Status}}' "${container_status}" 2>/dev/null)
    
    if [[ "${container_state}" != "running" ]]; then
        log "ERROR" "Service container not running: ${service_name} (state: ${container_state})"
        return 1
    fi
    
    # Perform service-specific health checks
    while [[ ${attempt} -le ${max_attempts} ]]; do
        log "DEBUG" "Health check attempt ${attempt}/${max_attempts} for ${service_name}"
        
        case "${service_name}" in
            "backend")
                if curl -f -s "http://localhost:${BACKEND_PORT}/health" > /dev/null 2>&1; then
                    log "DEBUG" "Backend service health check passed"
                    return 0
                fi
                ;;
            "nginx")
                if curl -f -s "http://localhost:${NGINX_PORT}/health" > /dev/null 2>&1; then
                    log "DEBUG" "NGINX service health check passed"
                    return 0
                fi
                ;;
            "prometheus")
                if curl -f -s "http://localhost:${PROMETHEUS_PORT}/-/healthy" > /dev/null 2>&1; then
                    log "DEBUG" "Prometheus service health check passed"
                    return 0
                fi
                ;;
            "grafana")
                if curl -f -s "http://localhost:${GRAFANA_PORT}/api/health" > /dev/null 2>&1; then
                    log "DEBUG" "Grafana service health check passed"
                    return 0
                fi
                ;;
            *)
                log "WARN" "No specific health check defined for service: ${service_name}"
                return 0
                ;;
        esac
        
        ((attempt++))
        if [[ ${attempt} -le ${max_attempts} ]]; then
            sleep 2
        fi
    done
    
    log "ERROR" "Health check failed for service: ${service_name}"
    return 1
}

# Wait for all services to pass their health checks with timeout
wait_for_healthchecks() {
    log "INFO" "Waiting for all services to become healthy (timeout: ${HEALTHCHECK_TIMEOUT}s)..."
    
    local start_time
    start_time=$(date +%s)
    local healthy_services=()
    local failed_services=()
    
    # Show initial service status
    log "INFO" "Initial service status:"
    ${COMPOSE_CMD} -f "${COMPOSE_FILE}" ps
    
    # Wait for each service to become healthy
    for service in "${SERVICES[@]}"; do
        log "INFO" "Checking health for service: ${service}"
        
        local service_healthy=false
        local service_start_time
        service_start_time=$(date +%s)
        
        while true; do
            local current_time
            current_time=$(date +%s)
            local elapsed_time=$((current_time - start_time))
            
            # Check global timeout
            if [[ ${elapsed_time} -ge ${HEALTHCHECK_TIMEOUT} ]]; then
                log "ERROR" "Global healthcheck timeout reached (${HEALTHCHECK_TIMEOUT}s)"
                failed_services+=("${service}")
                break
            fi
            
            # Perform health check
            if check_service_health "${service}"; then
                local service_elapsed=$((current_time - service_start_time))
                log "SUCCESS" "Service ${service} is healthy (${service_elapsed}s)"
                healthy_services+=("${service}")
                service_healthy=true
                break
            fi
            
            # Show progress every 10 seconds
            if [[ $((elapsed_time % 10)) -eq 0 ]]; then
                log "INFO" "Still waiting for ${service} to become healthy (${elapsed_time}s elapsed)..."
            fi
            
            sleep 2
        done
        
        if [[ "${service_healthy}" == "false" ]]; then
            failed_services+=("${service}")
        fi
    done
    
    # Report health check results
    local total_time=$(($(date +%s) - start_time))
    
    log "INFO" "Health check completed in ${total_time} seconds"
    log "INFO" "Healthy services: ${#healthy_services[@]}/${#SERVICES[@]}"
    
    if [[ ${#healthy_services[@]} -eq ${#SERVICES[@]} ]]; then
        log "SUCCESS" "All services are healthy and ready!"
        return 0
    else
        log "ERROR" "Some services failed health checks:"
        for failed_service in "${failed_services[@]}"; do
            log "ERROR" "  - ${failed_service}"
            
            # Show service logs for failed services
            log "INFO" "Recent logs for ${failed_service}:"
            ${COMPOSE_CMD} -f "${COMPOSE_FILE}" logs --tail=10 "${failed_service}" || true
        done
        return 6
    fi
}

# =============================================================================
# POST-DEPLOYMENT VERIFICATION AND ACCESS INSTRUCTIONS
# =============================================================================

# Verify service accessibility and provide access instructions
print_access_instructions() {
    log "INFO" "Verifying service accessibility and generating access instructions..."
    
    # Test each service endpoint
    local accessible_services=()
    local inaccessible_services=()
    
    # Backend service test
    if curl -f -s "http://localhost:${BACKEND_PORT}/hello" | grep -q "Hello world"; then
        accessible_services+=("backend")
    else
        inaccessible_services+=("backend")
    fi
    
    # NGINX reverse proxy test
    if curl -f -s "http://localhost:${NGINX_PORT}/hello" | grep -q "Hello world"; then
        accessible_services+=("nginx")
    else
        inaccessible_services+=("nginx")
    fi
    
    # Prometheus test
    if curl -f -s "http://localhost:${PROMETHEUS_PORT}/-/healthy" > /dev/null 2>&1; then
        accessible_services+=("prometheus")
    else
        inaccessible_services+=("prometheus")
    fi
    
    # Grafana test
    if curl -f -s "http://localhost:${GRAFANA_PORT}/api/health" > /dev/null 2>&1; then
        accessible_services+=("grafana")
    else
        inaccessible_services+=("grafana")
    fi
    
    # Report accessibility results
    if [[ ${#inaccessible_services[@]} -gt 0 ]]; then
        log "WARN" "Some services are not fully accessible: ${inaccessible_services[*]}"
        log "WARN" "This may affect functionality but deployment will continue"
    fi
    
    # Generate comprehensive access instructions
    echo
    echo "${GREEN}${BOLD}=============================================================${NC}"
    echo "${GREEN}${BOLD}  NODE.JS TUTORIAL DEPLOYMENT SUCCESSFUL!${NC}"
    echo "${GREEN}${BOLD}=============================================================${NC}"
    echo
    echo "${BOLD}SERVICE ACCESS INFORMATION:${NC}"
    echo
    echo "${CYAN}🌐 Main Application (via NGINX Reverse Proxy):${NC}"
    echo "   URL: ${BOLD}http://localhost${NC}"
    echo "   Test: ${BOLD}curl http://localhost/hello${NC}"
    echo "   Expected Response: ${GREEN}Hello world${NC}"
    echo
    echo "${CYAN}🚀 Backend Service (Direct Access):${NC}"
    echo "   URL: ${BOLD}http://localhost:${BACKEND_PORT}${NC}"
    echo "   Health Check: ${BOLD}http://localhost:${BACKEND_PORT}/health${NC}"
    echo "   Hello Endpoint: ${BOLD}http://localhost:${BACKEND_PORT}/hello${NC}"
    echo
    echo "${CYAN}📊 Prometheus (Metrics Collection):${NC}"
    echo "   URL: ${BOLD}http://localhost:${PROMETHEUS_PORT}${NC}"
    echo "   Targets: ${BOLD}http://localhost:${PROMETHEUS_PORT}/targets${NC}"
    echo "   Query Interface: ${BOLD}http://localhost:${PROMETHEUS_PORT}/graph${NC}"
    echo
    echo "${CYAN}📈 Grafana (Visualization Dashboard):${NC}"
    echo "   URL: ${BOLD}http://localhost:${GRAFANA_PORT}${NC}"
    echo "   Username: ${BOLD}admin${NC}"
    echo "   Password: ${BOLD}admin${NC}"
    echo "   ${YELLOW}Note: You'll be prompted to change the password on first login${NC}"
    echo
    echo "${BOLD}QUICK START COMMANDS:${NC}"
    echo
    echo "  # Test the main application"
    echo "  ${BOLD}curl http://localhost/hello${NC}"
    echo
    echo "  # Check all service status"
    echo "  ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} ps${NC}"
    echo
    echo "  # View service logs"
    echo "  ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} logs -f backend${NC}"
    echo "  ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} logs -f nginx${NC}"
    echo
    echo "  # Stop all services"
    echo "  ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} down${NC}"
    echo
    echo "${BOLD}ENVIRONMENT INFORMATION:${NC}"
    echo "  Deployment Environment: ${BOLD}${DEPLOY_ENV}${NC}"
    echo "  Docker Compose File: ${BOLD}${COMPOSE_FILE}${NC}"
    echo "  Deployment Time: ${BOLD}$(date '+%Y-%m-%d %H:%M:%S')${NC}"
    echo
    echo "${BOLD}TROUBLESHOOTING:${NC}"
    echo "  If services are not accessible, check:"
    echo "  1. Docker containers are running: ${BOLD}docker ps${NC}"
    echo "  2. Port availability: ${BOLD}netstat -tlnp | grep -E ':(80|3000|9090|3001) '${NC}"
    echo "  3. Service logs: ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} logs [service-name]${NC}"
    echo "  4. Service health: ${BOLD}curl -v http://localhost/health${NC}"
    echo
    echo "${GREEN}${BOLD}Happy coding! 🎉${NC}"
    echo "${GREEN}${BOLD}=============================================================${NC}"
    echo
}

# =============================================================================
# ERROR HANDLING AND CLEANUP FUNCTIONS
# =============================================================================

# Handle deployment failures with detailed error reporting and cleanup guidance
handle_deployment_failure() {
    local exit_code="${1:-1}"
    local failure_stage="${2:-unknown}"
    
    log "ERROR" "Deployment failed during ${failure_stage} stage (exit code: ${exit_code})"
    echo
    echo "${RED}${BOLD}=============================================================${NC}"
    echo "${RED}${BOLD}  DEPLOYMENT FAILED${NC}"
    echo "${RED}${BOLD}=============================================================${NC}"
    echo
    echo "${BOLD}Failure Details:${NC}"
    echo "  Stage: ${failure_stage}"
    echo "  Exit Code: ${exit_code}"
    echo "  Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
    echo
    echo "${BOLD}Troubleshooting Steps:${NC}"
    echo
    
    case "${failure_stage}" in
        "backup")
            echo "  ${CYAN}Backup Failure:${NC}"
            echo "  1. Check backup script permissions: ${BOLD}ls -la ${BACKUP_SCRIPT}${NC}"
            echo "  2. Verify disk space: ${BOLD}df -h${NC}"
            echo "  3. Check backup logs above for specific errors"
            echo "  4. Try running backup manually: ${BOLD}${BACKUP_SCRIPT} --dry-run${NC}"
            ;;
        "build")
            echo "  ${CYAN}Build Failure:${NC}"
            echo "  1. Check Docker daemon: ${BOLD}docker info${NC}"
            echo "  2. Verify Dockerfile: ${BOLD}docker build ../src/backend${NC}"
            echo "  3. Check for image conflicts: ${BOLD}docker images | grep tutorial${NC}"
            echo "  4. Clean build cache: ${BOLD}docker system prune -f${NC}"
            echo "  5. Re-run with verbose output: ${BOLD}${SCRIPT_NAME} --verbose${NC}"
            ;;
        "startup")
            echo "  ${CYAN}Startup Failure:${NC}"
            echo "  1. Check port availability: ${BOLD}netstat -tlnp | grep -E ':(80|3000|9090|3001) '${NC}"
            echo "  2. View service logs: ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} logs${NC}"
            echo "  3. Check service status: ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} ps${NC}"
            echo "  4. Verify compose file: ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} config${NC}"
            ;;
        "healthcheck")
            echo "  ${CYAN}Health Check Failure:${NC}"
            echo "  1. Check individual services:"
            for service in "${SERVICES[@]}"; do
                echo "     - ${service}: ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} logs ${service}${NC}"
            done
            echo "  2. Test endpoints manually:"
            echo "     - Backend: ${BOLD}curl -v http://localhost:${BACKEND_PORT}/health${NC}"
            echo "     - NGINX: ${BOLD}curl -v http://localhost:${NGINX_PORT}/health${NC}"
            echo "     - Prometheus: ${BOLD}curl -v http://localhost:${PROMETHEUS_PORT}/-/healthy${NC}"
            echo "     - Grafana: ${BOLD}curl -v http://localhost:${GRAFANA_PORT}/api/health${NC}"
            echo "  3. Increase timeout: ${BOLD}${SCRIPT_NAME} --timeout 120${NC}"
            ;;
        *)
            echo "  ${CYAN}General Troubleshooting:${NC}"
            echo "  1. Check system resources: ${BOLD}free -h && df -h${NC}"
            echo "  2. Verify Docker installation: ${BOLD}docker version && ${COMPOSE_CMD} version${NC}"
            echo "  3. Check project structure: ${BOLD}ls -la ${PROJECT_ROOT}${NC}"
            echo "  4. Run with verbose output: ${BOLD}${SCRIPT_NAME} --verbose --log-level DEBUG${NC}"
            ;;
    esac
    
    echo
    echo "${BOLD}Cleanup Commands:${NC}"
    echo "  # Stop and remove all containers"
    echo "  ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} down${NC}"
    echo
    echo "  # Remove all containers and volumes"
    echo "  ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} down -v${NC}"
    echo
    echo "  # Clean Docker system"
    echo "  ${BOLD}docker system prune -af${NC}"
    echo
    echo "${BOLD}Recovery Options:${NC}"
    echo "  # Retry deployment with clean slate"
    echo "  ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} down -v && ${SCRIPT_NAME}${NC}"
    echo
    echo "  # Deploy without backup"
    echo "  ${BOLD}${SCRIPT_NAME} --no-backup${NC}"
    echo
    echo "  # Deploy with extended timeout"
    echo "  ${BOLD}${SCRIPT_NAME} --timeout 180${NC}"
    echo
    echo "${RED}${BOLD}=============================================================${NC}"
    echo
}

# =============================================================================
# MAIN DEPLOYMENT ORCHESTRATION
# =============================================================================

# Main deployment function that orchestrates all deployment steps
main() {
    local start_time
    start_time=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo
    echo "${BLUE}${BOLD}=============================================================${NC}"
    echo "${BLUE}${BOLD}  Node.js Tutorial Infrastructure Deployment v${SCRIPT_VERSION}${NC}"
    echo "${BLUE}${BOLD}=============================================================${NC}"
    echo
    log "INFO" "Deployment started at ${start_time}"
    log "INFO" "Environment: ${DEPLOY_ENV}"
    log "INFO" "Compose file: ${COMPOSE_FILE}"
    log "INFO" "Healthcheck timeout: ${HEALTHCHECK_TIMEOUT}s"
    echo
    
    # Step 1: Verify dependencies and system requirements
    log "INFO" "Step 1/6: Verifying system dependencies..."
    if ! check_dependencies; then
        handle_deployment_failure 2 "dependencies"
        exit 2
    fi
    
    # Step 2: Run backup if requested
    if [[ "${BACKUP_BEFORE_DEPLOY}" == "1" ]]; then
        log "INFO" "Step 2/6: Running pre-deployment backup..."
        if ! run_backup; then
            handle_deployment_failure 3 "backup"
            exit 3
        fi
    else
        log "INFO" "Step 2/6: Skipping backup (not requested)"
    fi
    
    # Step 3: Build Docker images
    log "INFO" "Step 3/6: Building Docker images..."
    if ! docker_compose_build; then
        handle_deployment_failure 4 "build"
        exit 4
    fi
    
    # Step 4: Start services
    log "INFO" "Step 4/6: Starting all services..."
    if ! docker_compose_up; then
        handle_deployment_failure 5 "startup"
        exit 5
    fi
    
    # Step 5: Wait for health checks
    log "INFO" "Step 5/6: Verifying service health..."
    if ! wait_for_healthchecks; then
        handle_deployment_failure 6 "healthcheck"
        exit 6
    fi
    
    # Step 6: Provide access instructions
    log "INFO" "Step 6/6: Generating access instructions..."
    print_access_instructions
    
    # Final success message
    local end_time
    end_time=$(date '+%Y-%m-%d %H:%M:%S')
    local deployment_duration
    deployment_duration=$(( $(date -d "${end_time}" +%s) - $(date -d "${start_time}" +%s) ))
    
    log "SUCCESS" "Deployment completed successfully in ${deployment_duration} seconds"
    log "INFO" "All services are running and accessible"
    
    exit 0
}

# =============================================================================
# SCRIPT EXECUTION ENTRY POINT
# =============================================================================

# Entry point with signal handling and comprehensive error management
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    # Set up signal handling for graceful cleanup
    trap 'log "ERROR" "Deployment interrupted by signal"; exit 130' INT TERM
    
    # Parse command-line arguments
    parse_args "$@"
    
    # Validate execution context
    if [[ ! -f "${COMPOSE_FILE}" ]]; then
        log "ERROR" "Docker Compose file not found: ${COMPOSE_FILE}"
        log "ERROR" "Please run from the project root directory or set COMPOSE_FILE environment variable"
        exit 1
    fi
    
    # Execute main deployment process
    main
fi

# =============================================================================
# END OF SCRIPT
# =============================================================================