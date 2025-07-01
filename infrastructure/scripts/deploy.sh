#!/bin/bash

# =============================================================================
# Docker Compose Stack Deployment Script for Node.js/Express.js Tutorial
# =============================================================================
#
# This script automates the deployment of the complete Node.js/Express.js tutorial
# backend and supporting infrastructure using Docker Compose. It ensures reproducible,
# robust, and observable multi-container deployment for local development, CI/CD,
# and educational demonstration scenarios.
#
# Architecture Overview:
# - Backend: Node.js/Express.js application with health checks
# - NGINX: Reverse proxy and load balancer for production-like setup
# - Prometheus: Metrics collection and monitoring
# - Grafana: Metrics visualization and dashboarding
# - Integrated backup support for disaster recovery
# - Comprehensive health check validation and error handling
#
# Requirements:
# - Docker Engine (20+) with BuildKit support
# - Docker Compose (1.29+ or Compose V2) for orchestration
# - curl (7.68+) for health check verification
# - Core utilities: grep, sleep, echo, date (coreutils 8+)
# - Sufficient system resources for multi-container deployment
# - Network connectivity for image pulling and health checks
#
# Usage Examples:
#   ./deploy.sh                           # Standard deployment
#   ./deploy.sh --env production          # Production environment deployment
#   ./deploy.sh --backup                  # Deploy with pre-deployment backup
#   ./deploy.sh --env local --no-backup   # Local deployment without backup
#   ./deploy.sh --help                    # Display usage instructions
#
# Exit Codes:
#   0 - Deployment completed successfully
#   1 - General deployment error or service failure
#   2 - Invalid arguments or missing dependencies
#   3 - Docker/Docker Compose unavailable
#   4 - Service health check failure or timeout
#   5 - Backup operation failure (when backup enabled)
#
# Author: Infrastructure Team
# Version: 1.0.0
# Last Modified: $(date '+%Y-%m-%d')

# =============================================================================
# Global Variables and Configuration
# =============================================================================

# Script metadata and versioning
readonly SCRIPT_NAME="$(basename "${0}")"
readonly SCRIPT_VERSION="1.0.0"
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." &> /dev/null && pwd)"

# Docker Compose configuration paths
readonly COMPOSE_FILE="${PROJECT_ROOT}/infrastructure/docker-compose.yml"
readonly BACKUP_SCRIPT="${SCRIPT_DIR}/backup.sh"

# Default configuration with environment variable override support
readonly DEFAULT_DEPLOY_ENV="${DEPLOY_ENV:-local}"
readonly DEFAULT_BACKUP_BEFORE_DEPLOY="${BACKUP_BEFORE_DEPLOY:-0}"
readonly DEFAULT_HEALTHCHECK_TIMEOUT="${HEALTHCHECK_TIMEOUT:-120}"

# Runtime variables (set by argument parsing)
DEPLOY_ENV="${DEFAULT_DEPLOY_ENV}"
BACKUP_BEFORE_DEPLOY="${DEFAULT_BACKUP_BEFORE_DEPLOY}"
HEALTHCHECK_TIMEOUT="${DEFAULT_HEALTHCHECK_TIMEOUT}"
VERBOSE=false

# Service definitions for health checking and management
readonly SERVICES=("backend" "nginx" "prometheus" "grafana")
readonly SERVICE_PORTS=("3000" "80" "9090" "3001")
readonly SERVICE_HEALTH_ENDPOINTS=("/health" "/health" "/-/healthy" "/api/health")

# Color codes for enhanced output formatting
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[0;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m' # No Color

# Logging levels and prefixes
readonly LOG_ERROR="[ERROR]"
readonly LOG_WARN="[WARN]"
readonly LOG_INFO="[INFO]"
readonly LOG_DEBUG="[DEBUG]"
readonly LOG_SUCCESS="[SUCCESS]"

# =============================================================================
# Utility Functions for Logging and Error Management
# =============================================================================

# Enhanced logging function with timestamp and color support
# Arguments: log_level, message, [additional_args...]
# Usage: log_message "INFO" "Deployment started" "$deploy_env"
log_message() {
    local level="$1"
    local message="$2"
    shift 2
    local timestamp
    timestamp="$(date '+%Y-%m-%d %H:%M:%S')"
    
    case "${level}" in
        "ERROR")
            echo -e "${RED}${timestamp} ${LOG_ERROR} ${message}${NC}" "$@" >&2
            ;;
        "WARN")
            echo -e "${YELLOW}${timestamp} ${LOG_WARN} ${message}${NC}" "$@" >&2
            ;;
        "INFO")
            echo -e "${BLUE}${timestamp} ${LOG_INFO} ${message}${NC}" "$@"
            ;;
        "SUCCESS")
            echo -e "${GREEN}${timestamp} ${LOG_SUCCESS} ${message}${NC}" "$@"
            ;;
        "DEBUG")
            if [[ "${VERBOSE}" == "true" ]]; then
                echo -e "${PURPLE}${timestamp} ${LOG_DEBUG} ${message}${NC}" "$@"
            fi
            ;;
        *)
            echo -e "${timestamp} [${level}] ${message}" "$@"
            ;;
    esac
}

# Error handling function with cleanup and exit
# Arguments: error_message, exit_code
# Usage: handle_error "Docker build failed" 1
handle_error() {
    local error_message="$1"
    local exit_code="${2:-1}"
    
    log_message "ERROR" "${error_message}"
    log_message "ERROR" "Deployment failed with exit code ${exit_code}"
    log_message "INFO" "Check logs above for detailed error information"
    log_message "INFO" "Use 'docker-compose -f ${COMPOSE_FILE} logs' for service logs"
    
    # Provide troubleshooting guidance
    case "${exit_code}" in
        1)
            log_message "INFO" "General error - check Docker daemon and compose file syntax"
            ;;
        2)
            log_message "INFO" "Configuration error - verify arguments and dependencies"
            ;;
        3)
            log_message "INFO" "Docker unavailable - ensure Docker daemon is running"
            ;;
        4)
            log_message "INFO" "Health check failure - services may need more time to start"
            log_message "INFO" "Try increasing HEALTHCHECK_TIMEOUT or check service logs"
            ;;
        5)
            log_message "INFO" "Backup failure - check backup script and permissions"
            ;;
    esac
    
    exit "${exit_code}"
}

# Dependency validation function
# Validates required external tools and Docker environment
# Usage: validate_dependencies
validate_dependencies() {
    local missing_deps=()
    
    # Check required command-line utilities (coreutils 8+, curl 7.68+)
    local required_commands=("docker" "docker-compose" "curl" "grep" "sleep" "echo" "date")
    
    for cmd in "${required_commands[@]}"; do
        if ! command -v "${cmd}" &> /dev/null; then
            missing_deps+=("${cmd}")
        fi
    done
    
    if [[ ${#missing_deps[@]} -gt 0 ]]; then
        handle_error "Missing required dependencies: ${missing_deps[*]}" 2
    fi
    
    # Validate Docker daemon availability (Docker Engine 20+)
    if ! docker info &> /dev/null; then
        handle_error "Docker daemon is not running or not accessible" 3
    fi
    
    # Validate Docker Compose availability (1.29+ or Compose V2)
    if ! docker-compose version &> /dev/null; then
        handle_error "Docker Compose is not available or not functioning" 3
    fi
    
    # Validate Docker Compose file existence and syntax
    if [[ ! -f "${COMPOSE_FILE}" ]]; then
        handle_error "Docker Compose file not found: ${COMPOSE_FILE}" 2
    fi
    
    if ! docker-compose -f "${COMPOSE_FILE}" config &> /dev/null; then
        handle_error "Docker Compose file syntax validation failed: ${COMPOSE_FILE}" 2
    fi
    
    # Validate backup script availability if backup is enabled
    if [[ "${BACKUP_BEFORE_DEPLOY}" == "1" && ! -x "${BACKUP_SCRIPT}" ]]; then
        handle_error "Backup script not found or not executable: ${BACKUP_SCRIPT}" 2
    fi
    
    log_message "DEBUG" "All dependencies validated successfully"
}

# =============================================================================
# Core Deployment Functions
# =============================================================================

# Display comprehensive usage instructions and examples
# Usage: print_usage
print_usage() {
    cat << EOF
${CYAN}${SCRIPT_NAME} v${SCRIPT_VERSION}${NC}
Docker Compose Stack Deployment Script for Node.js/Express.js Tutorial

${YELLOW}DESCRIPTION:${NC}
    Automates deployment of the Node.js/Express.js tutorial backend and supporting
    infrastructure using Docker Compose. Ensures reproducible, robust, and observable
    multi-container deployment for local development, CI/CD, and educational scenarios.

${YELLOW}USAGE:${NC}
    ${SCRIPT_NAME} [OPTIONS]

${YELLOW}OPTIONS:${NC}
    -h, --help                  Display this help message and exit
    -e, --env ENVIRONMENT       Set deployment environment (default: ${DEFAULT_DEPLOY_ENV})
    -b, --backup                Enable pre-deployment backup
    -n, --no-backup             Disable pre-deployment backup (default)
    -t, --timeout SECONDS       Health check timeout in seconds (default: ${DEFAULT_HEALTHCHECK_TIMEOUT})
    -v, --verbose               Enable verbose logging and debug output

${YELLOW}EXAMPLES:${NC}
    ${SCRIPT_NAME}                          # Standard local deployment
    ${SCRIPT_NAME} --env production         # Production environment deployment
    ${SCRIPT_NAME} --backup                 # Deploy with pre-deployment backup
    ${SCRIPT_NAME} --env local --no-backup  # Local deployment without backup
    ${SCRIPT_NAME} --timeout 180            # Custom health check timeout
    ${SCRIPT_NAME} --verbose                # Enable detailed logging

${YELLOW}ENVIRONMENT VARIABLES:${NC}
    DEPLOY_ENV                  Default deployment environment (default: local)
    BACKUP_BEFORE_DEPLOY        Enable backup by default (0=disabled, 1=enabled)
    HEALTHCHECK_TIMEOUT         Default health check timeout in seconds (default: 120)

${YELLOW}DEPLOYMENT ENVIRONMENTS:${NC}
    local                       Local development with standard settings
    development                 Development environment with enhanced logging
    staging                     Staging environment with production-like setup
    production                  Production environment with optimal performance

${YELLOW}SERVICES DEPLOYED:${NC}
    Backend Service:
    • Node.js/Express.js application (port 3000)
    • Health endpoint: /health
    • Main endpoint: /hello

    NGINX Reverse Proxy:
    • HTTP traffic routing (port 80)
    • Production-like proxy configuration
    • Health endpoint: /health (proxied)

    Monitoring Stack:
    • Prometheus metrics collection (port 9090)
    • Grafana visualization dashboard (port 3001)
    • Pre-configured monitoring dashboards

${YELLOW}ACCESS ENDPOINTS:${NC}
    Application (via NGINX):    http://localhost
    Application Health:         http://localhost/health
    Backend Direct:             http://localhost:3000 (development only)
    Prometheus UI:              http://localhost:9090
    Grafana Dashboard:          http://localhost:3001 (admin/admin)

${YELLOW}DEPLOYMENT PHASES:${NC}
    1. Dependency Validation    Verify Docker, Compose, and required tools
    2. Optional Backup          Create infrastructure backup if enabled
    3. Image Building           Build all service images with optimization
    4. Service Startup          Start all services in correct dependency order
    5. Health Verification      Wait for all services to pass health checks
    6. Access Instructions      Display endpoint URLs and credentials

${YELLOW}EXIT CODES:${NC}
    0    Deployment completed successfully
    1    General deployment error or service failure
    2    Invalid arguments or missing dependencies
    3    Docker/Docker Compose unavailable
    4    Service health check failure or timeout
    5    Backup operation failure (when backup enabled)

${YELLOW}REQUIREMENTS:${NC}
    • Docker Engine 20+ with BuildKit support
    • Docker Compose 1.29+ or Compose V2
    • curl 7.68+ for health check verification
    • GNU coreutils 8+ (grep, sleep, echo, date)
    • Sufficient system resources for multi-container deployment
    • Network connectivity for image pulling and health checks

${YELLOW}TROUBLESHOOTING:${NC}
    Service Logs:               docker-compose -f ${COMPOSE_FILE} logs [service]
    Service Status:             docker-compose -f ${COMPOSE_FILE} ps
    Stop Services:              docker-compose -f ${COMPOSE_FILE} down
    Remove Volumes:             docker-compose -f ${COMPOSE_FILE} down -v
    Health Check:               curl http://localhost/health

${YELLOW}SUPPORT:${NC}
    For issues and support, refer to the project documentation or
    contact the infrastructure team.

EOF
}

# Parse and validate command-line arguments
# Sets global variables: DEPLOY_ENV, BACKUP_BEFORE_DEPLOY, HEALTHCHECK_TIMEOUT, VERBOSE
# Usage: parse_args "$@"
parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -h|--help)
                print_usage
                exit 0
                ;;
            -e|--env)
                if [[ -n "$2" && ! "$2" =~ ^- ]]; then
                    DEPLOY_ENV="$2"
                    log_message "INFO" "Deployment environment set to: ${DEPLOY_ENV}"
                    shift 2
                else
                    handle_error "Environment argument requires a value (local, development, staging, production)" 2
                fi
                ;;
            -b|--backup)
                BACKUP_BEFORE_DEPLOY="1"
                log_message "INFO" "Pre-deployment backup enabled"
                shift
                ;;
            -n|--no-backup)
                BACKUP_BEFORE_DEPLOY="0"
                log_message "INFO" "Pre-deployment backup disabled"
                shift
                ;;
            -t|--timeout)
                if [[ -n "$2" && "$2" =~ ^[0-9]+$ ]]; then
                    HEALTHCHECK_TIMEOUT="$2"
                    log_message "INFO" "Health check timeout set to ${HEALTHCHECK_TIMEOUT} seconds"
                    shift 2
                else
                    handle_error "Timeout argument must be a positive integer (seconds)" 2
                fi
                ;;
            -v|--verbose)
                VERBOSE=true
                log_message "DEBUG" "Verbose logging enabled"
                shift
                ;;
            *)
                handle_error "Unknown option: $1. Use --help for usage information." 2
                ;;
        esac
    done
    
    # Validate environment value
    case "${DEPLOY_ENV}" in
        local|development|staging|production)
            log_message "DEBUG" "Valid deployment environment: ${DEPLOY_ENV}"
            ;;
        *)
            handle_error "Invalid environment: ${DEPLOY_ENV}. Must be one of: local, development, staging, production" 2
            ;;
    esac
    
    log_message "DEBUG" "Command-line arguments parsed successfully"
}

# Execute pre-deployment backup using backup.sh script
# Returns: 0 on success or skip, non-zero on failure
# Usage: run_backup
run_backup() {
    if [[ "${BACKUP_BEFORE_DEPLOY}" != "1" ]]; then
        log_message "DEBUG" "Pre-deployment backup is disabled - skipping"
        return 0
    fi
    
    log_message "INFO" "=== Pre-Deployment Backup Phase ==="
    log_message "INFO" "Executing pre-deployment backup using backup.sh"
    
    if [[ ! -x "${BACKUP_SCRIPT}" ]]; then
        handle_error "Backup script not found or not executable: ${BACKUP_SCRIPT}" 5
    fi
    
    # Execute backup script with appropriate verbosity
    local backup_args=()
    if [[ "${VERBOSE}" == "true" ]]; then
        backup_args+=("--verbose")
    fi
    
    log_message "DEBUG" "Executing backup command: ${BACKUP_SCRIPT} ${backup_args[*]}"
    
    if "${BACKUP_SCRIPT}" "${backup_args[@]}"; then
        log_message "SUCCESS" "Pre-deployment backup completed successfully"
        return 0
    else
        local backup_exit_code=$?
        handle_error "Pre-deployment backup failed with exit code ${backup_exit_code}" 5
    fi
}

# Build all Docker images using docker-compose with BuildKit optimization
# Returns: 0 on success, non-zero on failure
# Usage: docker_compose_build
docker_compose_build() {
    log_message "INFO" "=== Image Building Phase ==="
    log_message "INFO" "Building Docker images with docker-compose"
    
    # Set Docker BuildKit for improved build performance and caching
    export DOCKER_BUILDKIT=1
    export COMPOSE_DOCKER_CLI_BUILD=1
    
    # Configure build arguments based on deployment environment
    local build_args=()
    case "${DEPLOY_ENV}" in
        production)
            build_args+=("--build-arg" "NODE_ENV=production")
            build_args+=("--build-arg" "BUILD_TARGET=production")
            ;;
        staging)
            build_args+=("--build-arg" "NODE_ENV=staging")
            build_args+=("--build-arg" "BUILD_TARGET=production")
            ;;
        development)
            build_args+=("--build-arg" "NODE_ENV=development")
            build_args+=("--build-arg" "BUILD_TARGET=development")
            ;;
        local)
            build_args+=("--build-arg" "NODE_ENV=development")
            build_args+=("--build-arg" "BUILD_TARGET=development")
            ;;
    esac
    
    # Construct docker-compose build command
    local compose_build_cmd=(
        docker-compose
        -f "${COMPOSE_FILE}"
        build
        --no-cache
        --parallel
        "${build_args[@]}"
    )
    
    log_message "DEBUG" "Executing build command: ${compose_build_cmd[*]}"
    
    if "${compose_build_cmd[@]}"; then
        log_message "SUCCESS" "All Docker images built successfully"
        
        # Display image information if verbose mode is enabled
        if [[ "${VERBOSE}" == "true" ]]; then
            log_message "DEBUG" "Built images:"
            docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}" | head -10
        fi
        
        return 0
    else
        local build_exit_code=$?
        handle_error "Docker image build failed with exit code ${build_exit_code}" 1
    fi
}

# Start all services using docker-compose in detached mode with dependency ordering
# Returns: 0 on success, non-zero on failure
# Usage: docker_compose_up
docker_compose_up() {
    log_message "INFO" "=== Service Startup Phase ==="
    log_message "INFO" "Starting all services with docker-compose"
    
    # Set environment variables for the deployment
    export NODE_ENV="${DEPLOY_ENV}"
    export DEPLOY_ENVIRONMENT="${DEPLOY_ENV}"
    
    # Construct docker-compose up command with appropriate options
    local compose_up_cmd=(
        docker-compose
        -f "${COMPOSE_FILE}"
        up
        -d
        --remove-orphans
        --force-recreate
    )
    
    # Add timeout for service startup
    local compose_timeout=300  # 5 minutes timeout for service startup
    
    log_message "DEBUG" "Executing startup command: ${compose_up_cmd[*]}"
    log_message "INFO" "Starting services with ${compose_timeout}s timeout..."
    
    if timeout "${compose_timeout}" "${compose_up_cmd[@]}"; then
        log_message "SUCCESS" "All services started successfully"
        
        # Display service status
        log_message "INFO" "Service status:"
        docker-compose -f "${COMPOSE_FILE}" ps
        
        return 0
    else
        local startup_exit_code=$?
        if [[ ${startup_exit_code} -eq 124 ]]; then
            handle_error "Service startup timed out after ${compose_timeout} seconds" 1
        else
            handle_error "Service startup failed with exit code ${startup_exit_code}" 1
        fi
    fi
}

# Wait for all services to pass their health checks with comprehensive monitoring
# Returns: 0 on success, non-zero on failure/timeout
# Usage: wait_for_healthchecks
wait_for_healthchecks() {
    log_message "INFO" "=== Health Check Verification Phase ==="
    log_message "INFO" "Waiting for all services to become healthy (timeout: ${HEALTHCHECK_TIMEOUT}s)"
    
    local start_time
    start_time="$(date '+%s')"
    local check_interval=5
    local services_healthy=0
    local total_services=${#SERVICES[@]}
    
    # Health check status tracking
    declare -A service_status
    declare -A service_last_check
    
    # Initialize service status tracking
    for service in "${SERVICES[@]}"; do
        service_status["$service"]="unknown"
        service_last_check["$service"]=0
    done
    
    log_message "INFO" "Monitoring ${total_services} services: ${SERVICES[*]}"
    
    while true; do
        local current_time
        current_time="$(date '+%s')"
        local elapsed_time=$((current_time - start_time))
        
        # Check if overall timeout exceeded
        if [[ ${elapsed_time} -ge ${HEALTHCHECK_TIMEOUT} ]]; then
            log_message "ERROR" "Health check timeout exceeded (${HEALTHCHECK_TIMEOUT}s)"
            log_message "ERROR" "Service health status summary:"
            for service in "${SERVICES[@]}"; do
                log_message "ERROR" "  ${service}: ${service_status[$service]}"
            done
            handle_error "Health check verification failed due to timeout" 4
        fi
        
        services_healthy=0
        
        # Check each service health status
        for i in "${!SERVICES[@]}"; do
            local service="${SERVICES[$i]}"
            local port="${SERVICE_PORTS[$i]}"
            local health_endpoint="${SERVICE_HEALTH_ENDPOINTS[$i]}"
            local service_url="http://localhost:${port}${health_endpoint}"
            
            # Skip frequent checks for already healthy services
            local last_check="${service_last_check[$service]}"
            if [[ "${service_status[$service]}" == "healthy" && $((current_time - last_check)) -lt 30 ]]; then
                ((services_healthy++))
                continue
            fi
            
            service_last_check["$service"]=${current_time}
            
            # Perform health check with timeout and error handling
            local health_check_result
            if health_check_result=$(curl -f -s -m 10 "${service_url}" 2>/dev/null); then
                if [[ "${service_status[$service]}" != "healthy" ]]; then
                    log_message "SUCCESS" "Service ${service} is now healthy"
                    service_status["$service"]="healthy"
                fi
                ((services_healthy++))
            else
                # Check if service container is running
                local container_status
                container_status=$(docker-compose -f "${COMPOSE_FILE}" ps -q "${service}" | xargs -r docker inspect --format='{{.State.Status}}' 2>/dev/null || echo "not_found")
                
                case "${container_status}" in
                    "running")
                        if [[ "${service_status[$service]}" != "starting" ]]; then
                            log_message "INFO" "Service ${service} is running but not yet healthy"
                            service_status["$service"]="starting"
                        fi
                        ;;
                    "exited"|"dead")
                        log_message "ERROR" "Service ${service} container has exited"
                        service_status["$service"]="failed"
                        # Show container logs for debugging
                        log_message "ERROR" "Last 10 lines of ${service} logs:"
                        docker-compose -f "${COMPOSE_FILE}" logs --tail=10 "${service}" >&2
                        ;;
                    "not_found")
                        log_message "ERROR" "Service ${service} container not found"
                        service_status["$service"]="missing"
                        ;;
                    *)
                        if [[ "${service_status[$service]}" != "unknown" ]]; then
                            log_message "WARN" "Service ${service} status: ${container_status}"
                            service_status["$service"]="unknown"
                        fi
                        ;;
                esac
            fi
            
            log_message "DEBUG" "Service ${service} health check: ${service_status[$service]} (${elapsed_time}s elapsed)"
        done
        
        # Check if all services are healthy
        if [[ ${services_healthy} -eq ${total_services} ]]; then
            log_message "SUCCESS" "All ${total_services} services are healthy!"
            log_message "INFO" "Total health check time: ${elapsed_time} seconds"
            return 0
        fi
        
        # Progress update every 30 seconds
        if [[ $((elapsed_time % 30)) -eq 0 && ${elapsed_time} -gt 0 ]]; then
            log_message "INFO" "Health check progress: ${services_healthy}/${total_services} services healthy (${elapsed_time}s elapsed)"
        fi
        
        # Wait before next check cycle
        sleep ${check_interval}
    done
}

# Display access instructions and service information
# Usage: print_access_instructions
print_access_instructions() {
    log_message "INFO" "=== Deployment Complete - Access Information ==="
    
    cat << EOF

${GREEN}🎉 Deployment Successful!${NC}

${YELLOW}📍 Service Access URLs:${NC}
┌─────────────────────────────────────────────────────────────┐
│ ${CYAN}Application (via NGINX Proxy):${NC}  http://localhost        │
│ ${CYAN}Application Health Check:${NC}       http://localhost/health │
│ ${CYAN}Hello World Endpoint:${NC}           http://localhost/hello  │
├─────────────────────────────────────────────────────────────┤
│ ${PURPLE}Backend Service (Direct):${NC}       http://localhost:3000   │
│ ${PURPLE}Backend Health (Direct):${NC}        http://localhost:3000/health │
├─────────────────────────────────────────────────────────────┤
│ ${BLUE}Prometheus Monitoring:${NC}          http://localhost:9090   │
│ ${BLUE}Prometheus Health:${NC}              http://localhost:9090/-/healthy │
├─────────────────────────────────────────────────────────────┤
│ ${GREEN}Grafana Dashboard:${NC}              http://localhost:3001   │
│ ${GREEN}Grafana Health:${NC}                 http://localhost:3001/api/health │
└─────────────────────────────────────────────────────────────┘

${YELLOW}🔐 Default Credentials:${NC}
• Grafana: ${CYAN}admin${NC} / ${CYAN}admin${NC} (change after first login)

${YELLOW}🚀 Quick Test Commands:${NC}
# Test the main application endpoint
${CYAN}curl http://localhost/hello${NC}

# Check overall system health
${CYAN}curl http://localhost/health${NC}

# View Prometheus metrics
${CYAN}curl http://localhost:9090/api/v1/targets${NC}

${YELLOW}📊 Monitoring and Observability:${NC}
• Prometheus collects metrics from all services automatically
• Grafana provides pre-configured dashboards for system monitoring
• NGINX access logs are available for request analysis
• All services include comprehensive health check endpoints

${YELLOW}🛠 Management Commands:${NC}
# View service logs
${CYAN}docker-compose -f ${COMPOSE_FILE} logs [service_name]${NC}

# Check service status
${CYAN}docker-compose -f ${COMPOSE_FILE} ps${NC}

# Stop all services
${CYAN}docker-compose -f ${COMPOSE_FILE} down${NC}

# Stop and remove volumes (complete cleanup)
${CYAN}docker-compose -f ${COMPOSE_FILE} down -v${NC}

${YELLOW}📈 Performance Testing:${NC}
# Basic load testing with curl
${CYAN}for i in {1..10}; do curl -w "%{time_total}\\n" -o /dev/null -s http://localhost/hello; done${NC}

# Monitor resource usage
${CYAN}docker stats${NC}

${YELLOW}🔍 Troubleshooting:${NC}
• Check service logs: ${CYAN}docker-compose logs [service]${NC}
• Verify health endpoints are responding
• Ensure no port conflicts with other services
• Check Docker daemon status and available resources

${GREEN}Environment: ${DEPLOY_ENV}${NC}
${GREEN}Backup Enabled: $([ "${BACKUP_BEFORE_DEPLOY}" = "1" ] && echo "Yes" || echo "No")${NC}
${GREEN}Health Check Timeout: ${HEALTHCHECK_TIMEOUT}s${NC}

EOF

    # Display deployment summary
    local deployment_time
    deployment_time="$(date '+%Y-%m-%d %H:%M:%S')"
    
    log_message "SUCCESS" "Deployment completed successfully at ${deployment_time}"
    log_message "INFO" "All services are running and healthy"
    log_message "INFO" "The Node.js/Express.js tutorial environment is ready for use"
    
    # Educational notes for tutorial users
    if [[ "${DEPLOY_ENV}" == "local" || "${DEPLOY_ENV}" == "development" ]]; then
        log_message "INFO" ""
        log_message "INFO" "📚 Educational Notes:"
        log_message "INFO" "• This deployment demonstrates production-like infrastructure patterns"
        log_message "INFO" "• NGINX acts as a reverse proxy (production best practice)"
        log_message "INFO" "• Prometheus and Grafana provide observability and monitoring"
        log_message "INFO" "• All services use health checks for reliability"
        log_message "INFO" "• Docker Compose orchestrates the multi-container application"
    fi
}

# =============================================================================
# Main Deployment Orchestration Function
# =============================================================================

# Main deployment orchestration function
# Coordinates all deployment phases with comprehensive error handling and logging
# Returns: 0 on success, non-zero on failure
# Usage: main "$@"
main() {
    local start_time
    start_time="$(date '+%s')"
    
    # Script initialization and banner
    log_message "INFO" ""
    log_message "INFO" "╔══════════════════════════════════════════════════════════════╗"
    log_message "INFO" "║        Node.js/Express.js Tutorial Stack Deployment         ║"
    log_message "INFO" "║                    ${SCRIPT_NAME} v${SCRIPT_VERSION}                    ║"
    log_message "INFO" "╚══════════════════════════════════════════════════════════════╝"
    log_message "INFO" ""
    
    # Environment and configuration display
    log_message "INFO" "🔧 Deployment Configuration:"
    log_message "INFO" "  • Project Root: ${PROJECT_ROOT}"
    log_message "INFO" "  • Compose File: ${COMPOSE_FILE}"
    log_message "INFO" "  • Environment: ${DEPLOY_ENV}"
    log_message "INFO" "  • Backup Enabled: $([ "${BACKUP_BEFORE_DEPLOY}" = "1" ] && echo "Yes" || echo "No")"
    log_message "INFO" "  • Health Check Timeout: ${HEALTHCHECK_TIMEOUT}s"
    log_message "INFO" "  • Verbose Logging: $([ "${VERBOSE}" = "true" ] && echo "Yes" || echo "No")"
    log_message "INFO" ""
    
    # Phase 1: Initialize environment and validate prerequisites
    log_message "INFO" "=== Phase 1: Environment Validation ==="
    validate_dependencies
    parse_args "$@"
    
    # Phase 2: Optional pre-deployment backup
    if [[ "${BACKUP_BEFORE_DEPLOY}" == "1" ]]; then
        log_message "INFO" "=== Phase 2: Pre-Deployment Backup ==="
        run_backup || handle_error "Pre-deployment backup failed" 5
    else
        log_message "INFO" "=== Phase 2: Pre-Deployment Backup (Skipped) ==="
        log_message "DEBUG" "Backup disabled - proceeding to build phase"
    fi
    
    # Phase 3: Build all Docker images
    log_message "INFO" "=== Phase 3: Docker Image Building ==="
    docker_compose_build || handle_error "Docker image build failed" 1
    
    # Phase 4: Start all services
    log_message "INFO" "=== Phase 4: Service Deployment ==="
    docker_compose_up || handle_error "Service startup failed" 1
    
    # Phase 5: Verify service health
    log_message "INFO" "=== Phase 5: Health Check Verification ==="
    wait_for_healthchecks || handle_error "Health check verification failed" 4
    
    # Phase 6: Display access information and completion
    log_message "INFO" "=== Phase 6: Deployment Completion ==="
    print_access_instructions
    
    # Calculate and report deployment statistics
    local end_time duration_seconds
    end_time="$(date '+%s')"
    duration_seconds=$((end_time - start_time))
    local duration_minutes=$((duration_seconds / 60))
    local duration_remainder=$((duration_seconds % 60))
    
    log_message "SUCCESS" ""
    log_message "SUCCESS" "🎯 Deployment Summary:"
    log_message "SUCCESS" "  • Total Duration: ${duration_minutes}m ${duration_remainder}s"
    log_message "SUCCESS" "  • Services Deployed: ${#SERVICES[@]} (${SERVICES[*]})"
    log_message "SUCCESS" "  • Environment: ${DEPLOY_ENV}"
    log_message "SUCCESS" "  • Status: All services healthy and ready"
    log_message "SUCCESS" ""
    log_message "SUCCESS" "✅ Node.js/Express.js Tutorial Stack Deployment Complete!"
    log_message "SUCCESS" "   Visit http://localhost/hello to test your application"
    log_message "SUCCESS" ""
    
    return 0
}

# =============================================================================
# Signal Handling and Script Execution
# =============================================================================

# Trap signals for graceful cleanup on interruption
# Ensures proper cleanup of partially deployed services
cleanup_on_signal() {
    local signal="$1"
    log_message "WARN" "Received ${signal} signal - initiating graceful shutdown"
    log_message "INFO" "Stopping any running services..."
    
    # Attempt to stop services gracefully
    if [[ -f "${COMPOSE_FILE}" ]]; then
        docker-compose -f "${COMPOSE_FILE}" down --timeout 30 2>/dev/null || true
    fi
    
    handle_error "Deployment interrupted by ${signal} signal" 130
}

# Set up signal traps for graceful shutdown
trap 'cleanup_on_signal "SIGINT"' INT
trap 'cleanup_on_signal "SIGTERM"' TERM

# Execute main function with all command-line arguments
# This allows the script to be sourced for testing while still being executable
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi

# =============================================================================
# End of Script
# =============================================================================
#
# Usage Examples and Integration:
#
# 1. Standard Local Development:
#    cd /path/to/project
#    ./infrastructure/scripts/deploy.sh
#
# 2. Production Deployment with Backup:
#    ./deploy.sh --env production --backup --timeout 300
#
# 3. CI/CD Pipeline Integration:
#    - name: Deploy Tutorial Stack
#      run: |
#        ./infrastructure/scripts/deploy.sh --env staging --verbose
#        # Wait for deployment verification
#        curl --retry 5 --retry-delay 10 http://localhost/health
#
# 4. Development with Enhanced Monitoring:
#    ./deploy.sh --env development --verbose --timeout 180
#
# 5. Quick Local Setup:
#    ./deploy.sh --no-backup --timeout 60
#
# 6. Disaster Recovery Deployment:
#    ./deploy.sh --backup --env production --verbose
#
# Maintenance and Operations:
# - Monitor service health: watch -n 5 'curl -s http://localhost/health'
# - View real-time logs: docker-compose logs -f
# - Scale services: docker-compose up --scale backend=3
# - Update single service: docker-compose build backend && docker-compose up -d backend
#
# Security Considerations:
# - Change default Grafana credentials after deployment
# - Review and update NGINX security headers as needed
# - Implement proper authentication for production environments
# - Regular security updates for base images and dependencies
# - Monitor access logs and implement rate limiting if needed
#
# Performance Optimization:
# - Adjust resource limits in docker-compose.yml based on load
# - Monitor Prometheus metrics for performance bottlenecks
# - Implement horizontal scaling for high-traffic scenarios
# - Optimize Docker images for faster build and startup times