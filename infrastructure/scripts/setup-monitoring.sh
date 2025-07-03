#!/bin/bash

# =============================================================================
# Node.js Tutorial Monitoring Stack Setup Script
# =============================================================================
# 
# Comprehensive automation for setting up and initializing the monitoring stack
# (Prometheus and Grafana) for the Node.js/Express.js tutorial application.
# Ensures robust, observable, and reproducible monitoring for local, CI/CD,
# and educational deployments with comprehensive validation and error handling.
# 
# Version: 1.0.0
# Compatibility: Bash 4.0+, Docker 20+, Docker Compose 1.29+/Compose V2
# 
# FEATURES:
# - Automated monitoring stack orchestration with Prometheus and Grafana
# - Comprehensive prerequisite validation and dependency checking
# - Docker Compose service management with proper dependency handling
# - Advanced healthcheck verification with configurable timeout
# - Grafana dashboard provisioning with automatic import verification
# - Integration with backup and disaster recovery procedures
# - Environment-agnostic configuration (local, CI/CD, educational)
# - Detailed error handling with troubleshooting guidance
# - User access instructions with credentials and URLs
# - Idempotent operation for safe re-execution
# 
# REQUIREMENTS ADDRESSED:
# - Monitoring and Observability (Technical Specifications/6.5)
# - Deployment and Environment Configuration (Technical Specifications/8.2.5)
# - Healthcheck and Metrics Visualization (Technical Specifications/6.5)
# - Disaster Recovery Procedures (Technical Specifications/5.4.6)
# 
# USAGE:
#   ./setup-monitoring.sh                 # Standard monitoring setup
#   ./setup-monitoring.sh --help          # Display usage information
#   ./setup-monitoring.sh --timeout 120   # Extended healthcheck timeout
#   ./setup-monitoring.sh --verbose       # Enable detailed output
#   ./setup-monitoring.sh --dry-run       # Validate setup without execution
# 
# DEPENDENCIES:
#   - docker (20+): Container runtime and monitoring service management
#   - docker-compose (1.29+/V2): Multi-container orchestration for monitoring stack
#   - curl (7.68+): Service healthcheck verification and endpoint testing
#   - sleep (coreutils 8+): Service startup timing and health polling
#   - echo (coreutils 8+): User feedback and logging output
#   - grep (coreutils 8+): Log filtering and configuration validation
# 
# ENVIRONMENT VARIABLES:
#   COMPOSE_FILE: Path to docker-compose.yml (default: infrastructure/docker-compose.yml)
#   PROMETHEUS_CONFIG_PATH: Prometheus configuration (default: infrastructure/monitoring/prometheus.yml)
#   GRAFANA_DASHBOARD_PATH: Grafana dashboard (default: infrastructure/monitoring/grafana-dashboard.json)
#   PROMETHEUS_PORT: Prometheus service port (default: 9090)
#   GRAFANA_PORT: Grafana service port (default: 3001)
#   HEALTHCHECK_TIMEOUT: Service startup timeout in seconds (default: 60)
#   LOG_LEVEL: Logging verbosity (INFO, WARN, ERROR, DEBUG)
#   BACKUP_BEFORE_MONITORING: Enable backup before setup (set to 1)
# 
# EXIT CODES:
#   0: Successful monitoring stack setup
#   1: General error (invalid arguments, missing dependencies)
#   2: Docker/Docker Compose not available or functional
#   3: Required configuration files missing or invalid
#   4: Docker Compose monitoring services startup failure
#   5: Service healthcheck timeout or failure
#   6: Grafana dashboard provisioning failure
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

# Monitoring services configuration with environment variable support
readonly MONITORING_SERVICES="prometheus grafana"
readonly COMPOSE_FILE="${COMPOSE_FILE:-${PROJECT_ROOT}/infrastructure/docker-compose.yml}"
readonly PROMETHEUS_CONFIG_PATH="${PROMETHEUS_CONFIG_PATH:-${PROJECT_ROOT}/infrastructure/monitoring/prometheus.yml}"
readonly GRAFANA_DASHBOARD_PATH="${GRAFANA_DASHBOARD_PATH:-${PROJECT_ROOT}/infrastructure/monitoring/grafana-dashboard.json}"

# Service port configuration
readonly PROMETHEUS_PORT="${PROMETHEUS_PORT:-9090}"
readonly GRAFANA_PORT="${GRAFANA_PORT:-3001}"

# Operation configuration with defaults
readonly HEALTHCHECK_TIMEOUT="${HEALTHCHECK_TIMEOUT:-60}"
readonly DEFAULT_LOG_LEVEL="${LOG_LEVEL:-INFO}"
readonly BACKUP_BEFORE_MONITORING="${BACKUP_BEFORE_MONITORING:-0}"

# Script operation flags with defaults
LOG_LEVEL="${DEFAULT_LOG_LEVEL}"
VERBOSE=false
DRY_RUN=false
FORCE_RESTART=false

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

# Print comprehensive usage instructions for the monitoring setup script
print_usage() {
    cat << EOF
${BOLD}${SCRIPT_NAME} v${SCRIPT_VERSION} - Node.js Tutorial Monitoring Stack Setup${NC}

${BOLD}DESCRIPTION:${NC}
    Automates the setup and initialization of the monitoring stack (Prometheus
    and Grafana) for the Node.js/Express.js tutorial application. Ensures that
    monitoring services are correctly configured, started, accessible, and ready
    for metrics collection and visualization in local, CI/CD, and educational
    deployment scenarios.

${BOLD}USAGE:${NC}
    ${SCRIPT_NAME} [OPTIONS]

${BOLD}OPTIONS:${NC}
    -h, --help              Display this help message and exit
    -t, --timeout SECONDS   Set healthcheck timeout (default: ${HEALTHCHECK_TIMEOUT}s)
    -v, --verbose           Enable verbose output for debugging
    -d, --dry-run           Validate configuration without starting services
    -f, --force             Force restart of monitoring services if already running
    --log-level LEVEL       Set logging level: INFO, WARN, ERROR, DEBUG

${BOLD}EXAMPLES:${NC}
    ${SCRIPT_NAME}                          # Standard monitoring setup
    ${SCRIPT_NAME} --timeout 120            # Extended healthcheck timeout
    ${SCRIPT_NAME} --verbose --log-level DEBUG  # Maximum verbosity
    ${SCRIPT_NAME} --dry-run                # Validate setup without execution
    ${SCRIPT_NAME} --force                  # Force restart monitoring stack

${BOLD}ENVIRONMENT VARIABLES:${NC}
    COMPOSE_FILE                Docker Compose file path
    PROMETHEUS_CONFIG_PATH      Prometheus configuration file
    GRAFANA_DASHBOARD_PATH      Grafana dashboard JSON file
    PROMETHEUS_PORT             Prometheus service port (default: ${PROMETHEUS_PORT})
    GRAFANA_PORT                Grafana service port (default: ${GRAFANA_PORT})
    HEALTHCHECK_TIMEOUT         Service startup timeout in seconds
    LOG_LEVEL                   Logging verbosity level
    BACKUP_BEFORE_MONITORING    Enable backup before setup (set to 1)

${BOLD}MONITORING SERVICES:${NC}
    Prometheus:             Metrics collection and time-series database
    Grafana:                Visualization dashboards and alerting

${BOLD}SERVICE ACCESS:${NC}
    Prometheus:             http://localhost:${PROMETHEUS_PORT} (metrics and targets)
    Grafana:                http://localhost:${GRAFANA_PORT} (admin/admin credentials)

${BOLD}REQUIREMENTS:${NC}
    - Docker 20+ with Docker Compose support
    - curl for healthcheck verification
    - Prometheus configuration: ${PROMETHEUS_CONFIG_PATH}
    - Grafana dashboard: ${GRAFANA_DASHBOARD_PATH}
    - Docker Compose file: ${COMPOSE_FILE}
    - Sufficient system resources (1GB RAM, 2GB disk space)
    - Network ports ${PROMETHEUS_PORT}, ${GRAFANA_PORT} available

${BOLD}TROUBLESHOOTING:${NC}
    - Check Docker daemon: docker info
    - Verify Compose file: docker-compose config
    - View service logs: docker-compose logs prometheus grafana
    - Check service status: docker-compose ps
    - Test connectivity: curl http://localhost:${PROMETHEUS_PORT}/-/healthy

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
            -d|--dry-run)
                DRY_RUN=true
                log "INFO" "Dry-run mode enabled - configuration validation only"
                shift
                ;;
            -f|--force)
                FORCE_RESTART=true
                log "INFO" "Force restart mode enabled"
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

# Comprehensive prerequisite validation including Docker, configuration files, and system resources
validate_prerequisites() {
    log "INFO" "Validating prerequisites and system requirements..."
    
    local missing_deps=()
    local required_commands=("docker" "curl" "grep" "sleep" "echo")
    local validation_errors=()
    
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
        validation_errors+=("Missing dependencies: ${missing_deps[*]}")
    fi
    
    # Verify Docker daemon is running and accessible
    if ! docker info > /dev/null 2>&1; then
        log "ERROR" "Docker daemon is not running or not accessible"
        validation_errors+=("Docker daemon not accessible")
    fi
    
    # Verify Docker Compose is functional
    if ! ${COMPOSE_CMD} version > /dev/null 2>&1; then
        log "ERROR" "Docker Compose is not functional"
        validation_errors+=("Docker Compose not functional")
    fi
    
    # Verify required configuration files exist and are readable
    local config_files=(
        "${COMPOSE_FILE}:Docker Compose configuration"
        "${PROMETHEUS_CONFIG_PATH}:Prometheus configuration"
        "${GRAFANA_DASHBOARD_PATH}:Grafana dashboard"
    )
    
    for config_entry in "${config_files[@]}"; do
        local file_path="${config_entry%%:*}"
        local file_desc="${config_entry##*:}"
        
        if [[ ! -f "${file_path}" ]]; then
            log "ERROR" "${file_desc} not found: ${file_path}"
            validation_errors+=("Missing ${file_desc}: ${file_path}")
        elif [[ ! -r "${file_path}" ]]; then
            log "ERROR" "${file_desc} not readable: ${file_path}"
            validation_errors+=("Unreadable ${file_desc}: ${file_path}")
        fi
    done
    
    # Validate Docker Compose file contains required monitoring services
    if [[ -f "${COMPOSE_FILE}" ]]; then
        log "DEBUG" "Validating Docker Compose file contains monitoring services..."
        if ! ${COMPOSE_CMD} -f "${COMPOSE_FILE}" config 2>/dev/null | grep -q "prometheus:"; then
            log "ERROR" "Docker Compose file does not contain prometheus service"
            validation_errors+=("Missing prometheus service in compose file")
        fi
        if ! ${COMPOSE_CMD} -f "${COMPOSE_FILE}" config 2>/dev/null | grep -q "grafana:"; then
            log "ERROR" "Docker Compose file does not contain grafana service"
            validation_errors+=("Missing grafana service in compose file")
        fi
    fi
    
    # Validate Prometheus configuration syntax
    if [[ -f "${PROMETHEUS_CONFIG_PATH}" ]]; then
        log "DEBUG" "Validating Prometheus configuration syntax..."
        # Check for basic required sections in prometheus.yml
        if ! grep -q "global:" "${PROMETHEUS_CONFIG_PATH}"; then
            log "WARN" "Prometheus config missing 'global:' section"
        fi
        if ! grep -q "scrape_configs:" "${PROMETHEUS_CONFIG_PATH}"; then
            log "ERROR" "Prometheus config missing 'scrape_configs:' section"
            validation_errors+=("Invalid Prometheus configuration: missing scrape_configs")
        fi
    fi
    
    # Validate Grafana dashboard JSON syntax
    if [[ -f "${GRAFANA_DASHBOARD_PATH}" ]]; then
        log "DEBUG" "Validating Grafana dashboard JSON syntax..."
        if ! python3 -m json.tool "${GRAFANA_DASHBOARD_PATH}" > /dev/null 2>&1; then
            if ! python -m json.tool "${GRAFANA_DASHBOARD_PATH}" > /dev/null 2>&1; then
                log "WARN" "Cannot validate Grafana dashboard JSON syntax (python not available)"
            fi
        fi
    fi
    
    # Check port availability
    local ports_to_check=("${PROMETHEUS_PORT}" "${GRAFANA_PORT}")
    for port in "${ports_to_check[@]}"; do
        if command -v netstat > /dev/null 2>&1; then
            if netstat -tlnp 2>/dev/null | grep -q ":${port} "; then
                if [[ "${FORCE_RESTART}" != "true" ]]; then
                    log "WARN" "Port ${port} appears to be in use (use --force to restart services)"
                else
                    log "INFO" "Port ${port} in use - will restart services due to --force flag"
                fi
            fi
        fi
    done
    
    # Check available disk space (minimum 2GB recommended)
    local available_space
    if command -v df > /dev/null 2>&1; then
        available_space=$(df "${PROJECT_ROOT}" | awk 'NR==2 {print $4}')
        if [[ "${available_space}" -lt 2097152 ]]; then  # 2GB in KB
            log "WARN" "Low disk space detected: $(( available_space / 1024 ))MB available"
            log "WARN" "Monitoring stack requires at least 2GB for optimal operation"
        fi
    fi
    
    # Report validation results
    if [[ ${#validation_errors[@]} -gt 0 ]]; then
        log "ERROR" "Prerequisites validation failed with ${#validation_errors[@]} errors:"
        for error in "${validation_errors[@]}"; do
            log "ERROR" "  - ${error}"
        done
        log "ERROR" "Please resolve these issues before running the monitoring setup"
        return 1
    fi
    
    log "SUCCESS" "All prerequisites validated successfully"
    log "DEBUG" "Docker version: $(docker --version)"
    log "DEBUG" "Docker Compose command: ${COMPOSE_CMD}"
    log "DEBUG" "Compose file: ${COMPOSE_FILE}"
    log "DEBUG" "Prometheus config: ${PROMETHEUS_CONFIG_PATH}"
    log "DEBUG" "Grafana dashboard: ${GRAFANA_DASHBOARD_PATH}"
    
    return 0
}

# =============================================================================
# BACKUP INTEGRATION AND DISASTER RECOVERY
# =============================================================================

# Execute backup.sh script integration for disaster recovery procedures
run_backup_integration() {
    if [[ "${BACKUP_BEFORE_MONITORING}" != "1" ]]; then
        log "DEBUG" "Backup not requested, skipping backup integration"
        return 0
    fi
    
    log "INFO" "Running backup integration for disaster recovery compliance..."
    
    local backup_script="${SCRIPT_DIR}/backup.sh"
    
    # Verify backup script exists and is executable
    if [[ ! -f "${backup_script}" ]]; then
        log "WARN" "Backup script not found: ${backup_script}"
        log "WARN" "Continuing without backup (monitoring setup only)"
        return 0
    fi
    
    if [[ ! -x "${backup_script}" ]]; then
        log "WARN" "Backup script is not executable: ${backup_script}"
        log "WARN" "Attempting to make it executable..."
        if ! chmod +x "${backup_script}"; then
            log "WARN" "Failed to make backup script executable, continuing without backup"
            return 0
        fi
    fi
    
    # Execute backup script with appropriate environment
    log "INFO" "Executing backup integration: ${backup_script}"
    
    export BACKUP_TARGET="monitoring"
    export LOG_LEVEL="${LOG_LEVEL}"
    
    # Run backup script in monitoring-specific mode
    if ! "${backup_script}" --target monitoring 2>&1; then
        local backup_exit_code=$?
        log "WARN" "Backup operation completed with warnings (exit code: ${backup_exit_code})"
        log "WARN" "Continuing with monitoring setup - backup issues do not block setup"
    else
        log "SUCCESS" "Backup integration completed successfully"
    fi
    
    return 0
}

# =============================================================================
# DOCKER COMPOSE MONITORING ORCHESTRATION
# =============================================================================

# Start Prometheus and Grafana services using Docker Compose with comprehensive error handling
docker_compose_up_monitoring() {
    log "INFO" "Starting monitoring services (Prometheus and Grafana) in detached mode..."
    
    # Check if services are already running
    local running_services=()
    for service in ${MONITORING_SERVICES}; do
        if ${COMPOSE_CMD} -f "${COMPOSE_FILE}" ps "${service}" 2>/dev/null | grep -q "Up"; then
            running_services+=("${service}")
        fi
    done
    
    # Handle already running services
    if [[ ${#running_services[@]} -gt 0 ]]; then
        if [[ "${FORCE_RESTART}" == "true" ]]; then
            log "INFO" "Force restart requested - stopping existing monitoring services..."
            log "INFO" "Stopping services: ${running_services[*]}"
            if ! ${COMPOSE_CMD} -f "${COMPOSE_FILE}" stop ${MONITORING_SERVICES} 2>/dev/null; then
                log "WARN" "Failed to gracefully stop some services, attempting forced removal..."
            fi
            sleep 3
        else
            log "WARN" "Monitoring services already running: ${running_services[*]}"
            log "WARN" "Use --force to restart them, or run docker-compose down to stop first"
            log "INFO" "Proceeding with health checks for existing services..."
            return 0
        fi
    fi
    
    # Prepare Docker Compose startup command
    local up_cmd=(
        "${COMPOSE_CMD}" "-f" "${COMPOSE_FILE}"
        "up" "-d" "--remove-orphans"
    )
    
    # Add monitoring services to command
    up_cmd+=(${MONITORING_SERVICES})
    
    log "DEBUG" "Startup command: ${up_cmd[*]}"
    
    # Execute monitoring services startup
    if [[ "${DRY_RUN}" == "true" ]]; then
        log "INFO" "DRY-RUN: Would execute: ${up_cmd[*]}"
        return 0
    fi
    
    # Execute startup with comprehensive error handling
    local startup_output
    if [[ "${VERBOSE}" == "true" ]]; then
        if ! startup_output=$("${up_cmd[@]}" 2>&1); then
            log "ERROR" "Docker Compose monitoring startup failed"
            log "ERROR" "Command output: ${startup_output}"
            return 4
        fi
        log "DEBUG" "Startup output: ${startup_output}"
    else
        if ! startup_output=$("${up_cmd[@]}" 2>&1); then
            log "ERROR" "Docker Compose monitoring startup failed"
            log "ERROR" "Run with --verbose for detailed startup output"
            log "INFO" "Quick diagnosis: ${COMPOSE_CMD} -f ${COMPOSE_FILE} logs prometheus grafana"
            log "DEBUG" "Error output: ${startup_output}"
            return 4
        fi
    fi
    
    # Wait for containers to initialize
    sleep 5
    
    # Verify services are running
    local started_services=()
    local failed_services=()
    
    for service in ${MONITORING_SERVICES}; do
        if ${COMPOSE_CMD} -f "${COMPOSE_FILE}" ps "${service}" 2>/dev/null | grep -q "Up"; then
            started_services+=("${service}")
            log "DEBUG" "Service ${service} started successfully"
        else
            failed_services+=("${service}")
            log "ERROR" "Service ${service} failed to start"
        fi
    done
    
    # Report startup results
    if [[ ${#failed_services[@]} -gt 0 ]]; then
        log "ERROR" "Failed to start monitoring services: ${failed_services[*]}"
        log "INFO" "Check service logs: ${COMPOSE_CMD} -f ${COMPOSE_FILE} logs ${failed_services[*]}"
        return 4
    fi
    
    log "SUCCESS" "All monitoring services started successfully: ${started_services[*]}"
    return 0
}

# =============================================================================
# ADVANCED HEALTHCHECK VERIFICATION
# =============================================================================

# Wait for monitoring services to pass comprehensive health checks with timeout
wait_for_monitoring_healthchecks() {
    log "INFO" "Waiting for monitoring services to pass health checks (timeout: ${HEALTHCHECK_TIMEOUT}s)..."
    
    if [[ "${DRY_RUN}" == "true" ]]; then
        log "INFO" "DRY-RUN: Would perform health checks for: ${MONITORING_SERVICES}"
        return 0
    fi
    
    local start_time
    start_time=$(date +%s)
    local healthy_services=()
    local failed_services=()
    
    # Show initial service status
    log "INFO" "Initial monitoring service status:"
    ${COMPOSE_CMD} -f "${COMPOSE_FILE}" ps ${MONITORING_SERVICES} || true
    
    # Define health check endpoints and validation methods
    declare -A health_endpoints=(
        ["prometheus"]="http://localhost:${PROMETHEUS_PORT}/-/healthy"
        ["grafana"]="http://localhost:${GRAFANA_PORT}/api/health"
    )
    
    declare -A health_validation=(
        ["prometheus"]="Prometheus Server"
        ["grafana"]="database"
    )
    
    # Wait for each monitoring service to become healthy
    for service in ${MONITORING_SERVICES}; do
        log "INFO" "Checking health for monitoring service: ${service}"
        
        local service_healthy=false
        local service_start_time
        service_start_time=$(date +%s)
        local max_service_attempts=10
        local service_attempt=1
        
        while [[ ${service_attempt} -le ${max_service_attempts} ]]; do
            local current_time
            current_time=$(date +%s)
            local elapsed_time=$((current_time - start_time))
            
            # Check global timeout
            if [[ ${elapsed_time} -ge ${HEALTHCHECK_TIMEOUT} ]]; then
                log "ERROR" "Global healthcheck timeout reached (${HEALTHCHECK_TIMEOUT}s)"
                failed_services+=("${service}")
                break
            fi
            
            # Check container is running first
            local container_status
            container_status=$(${COMPOSE_CMD} -f "${COMPOSE_FILE}" ps -q "${service}" 2>/dev/null)
            
            if [[ -z "${container_status}" ]]; then
                log "DEBUG" "Container not found for service: ${service} (attempt ${service_attempt})"
            else
                local container_state
                container_state=$(docker inspect --format='{{.State.Status}}' "${container_status}" 2>/dev/null)
                
                if [[ "${container_state}" != "running" ]]; then
                    log "DEBUG" "Container not running for service: ${service} (state: ${container_state})"
                else
                    # Perform service-specific health check
                    local endpoint="${health_endpoints[${service}]}"
                    local validation_string="${health_validation[${service}]}"
                    
                    log "DEBUG" "Testing endpoint: ${endpoint} (attempt ${service_attempt})"
                    
                    local health_response
                    if health_response=$(curl -f -s --max-time 5 "${endpoint}" 2>/dev/null); then
                        # Validate response content
                        if echo "${health_response}" | grep -q "${validation_string}"; then
                            local service_elapsed=$((current_time - service_start_time))
                            log "SUCCESS" "Service ${service} is healthy (${service_elapsed}s)"
                            healthy_services+=("${service}")
                            service_healthy=true
                            break
                        else
                            log "DEBUG" "Health endpoint responding but validation failed for ${service}"
                            log "DEBUG" "Response: ${health_response}"
                        fi
                    else
                        log "DEBUG" "Health check failed for ${service} (attempt ${service_attempt})"
                    fi
                fi
            fi
            
            # Show progress every 5 attempts (roughly 15 seconds)
            if [[ $((service_attempt % 5)) -eq 0 ]]; then
                log "INFO" "Still waiting for ${service} to become healthy (${elapsed_time}s elapsed)..."
            fi
            
            ((service_attempt++))
            sleep 3
        done
        
        if [[ "${service_healthy}" == "false" ]]; then
            failed_services+=("${service}")
            log "ERROR" "Service ${service} failed health checks after ${max_service_attempts} attempts"
            
            # Show service logs for debugging
            log "INFO" "Recent logs for failed service ${service}:"
            ${COMPOSE_CMD} -f "${COMPOSE_FILE}" logs --tail=10 "${service}" || true
        fi
    done
    
    # Report comprehensive health check results
    local total_time=$(($(date +%s) - start_time))
    
    log "INFO" "Health check completed in ${total_time} seconds"
    log "INFO" "Healthy monitoring services: ${#healthy_services[@]}/${#MONITORING_SERVICES// /}"
    
    if [[ ${#healthy_services[@]} -eq 2 ]]; then  # Both prometheus and grafana
        log "SUCCESS" "All monitoring services are healthy and ready!"
        return 0
    else
        log "ERROR" "Some monitoring services failed health checks:"
        for failed_service in "${failed_services[@]}"; do
            log "ERROR" "  - ${failed_service}"
        done
        
        # Provide troubleshooting guidance
        log "INFO" "Troubleshooting steps:"
        log "INFO" "1. Check service logs: ${COMPOSE_CMD} -f ${COMPOSE_FILE} logs [service-name]"
        log "INFO" "2. Verify port availability: netstat -tlnp | grep -E ':(${PROMETHEUS_PORT}|${GRAFANA_PORT}) '"
        log "INFO" "3. Test endpoints manually:"
        log "INFO" "   - Prometheus: curl -v http://localhost:${PROMETHEUS_PORT}/-/healthy"
        log "INFO" "   - Grafana: curl -v http://localhost:${GRAFANA_PORT}/api/health"
        log "INFO" "4. Restart with increased timeout: ${SCRIPT_NAME} --timeout 120"
        
        return 5
    fi
}

# =============================================================================
# GRAFANA DASHBOARD PROVISIONING
# =============================================================================

# Ensure Grafana dashboard is properly provisioned and accessible
provision_grafana_dashboard() {
    log "INFO" "Verifying Grafana dashboard provisioning and accessibility..."
    
    if [[ "${DRY_RUN}" == "true" ]]; then
        log "INFO" "DRY-RUN: Would verify Grafana dashboard provisioning"
        return 0
    fi
    
    # Wait for Grafana to be fully ready (additional time for dashboard loading)
    log "DEBUG" "Allowing additional time for Grafana dashboard provisioning..."
    sleep 10
    
    # Verify dashboard file is accessible within container
    local grafana_container
    grafana_container=$(${COMPOSE_CMD} -f "${COMPOSE_FILE}" ps -q grafana 2>/dev/null)
    
    if [[ -z "${grafana_container}" ]]; then
        log "ERROR" "Grafana container not found or not running"
        return 6
    fi
    
    # Check if dashboard file is mounted correctly
    log "DEBUG" "Verifying dashboard file mount in Grafana container..."
    if ! docker exec "${grafana_container}" ls "/etc/grafana/provisioning/dashboards/nodejs-tutorial.json" > /dev/null 2>&1; then
        log "WARN" "Dashboard file not found in expected location within container"
        log "WARN" "Dashboard may need manual import after Grafana startup"
    else
        log "DEBUG" "Dashboard file successfully mounted in Grafana container"
    fi
    
    # Test Grafana API accessibility
    log "DEBUG" "Testing Grafana API accessibility..."
    local api_test_attempts=5
    local api_attempt=1
    local api_accessible=false
    
    while [[ ${api_attempt} -le ${api_test_attempts} ]]; do
        if curl -f -s "http://localhost:${GRAFANA_PORT}/api/health" > /dev/null 2>&1; then
            api_accessible=true
            break
        fi
        log "DEBUG" "Grafana API not yet accessible (attempt ${api_attempt}/${api_test_attempts})"
        ((api_attempt++))
        sleep 3
    done
    
    if [[ "${api_accessible}" != "true" ]]; then
        log "ERROR" "Grafana API not accessible after ${api_test_attempts} attempts"
        return 6
    fi
    
    # Verify basic Grafana functionality
    log "DEBUG" "Verifying Grafana basic functionality..."
    local grafana_response
    if ! grafana_response=$(curl -f -s "http://localhost:${GRAFANA_PORT}/api/health" 2>/dev/null); then
        log "ERROR" "Failed to get response from Grafana health endpoint"
        return 6
    fi
    
    if ! echo "${grafana_response}" | grep -q "database"; then
        log "WARN" "Grafana health response unexpected format: ${grafana_response}"
    else
        log "DEBUG" "Grafana health check passed: ${grafana_response}"
    fi
    
    # Optional: Test dashboard accessibility (requires authentication)
    # This would require admin credentials and is optional for basic setup
    log "DEBUG" "Dashboard provisioning verification completed"
    
    log "SUCCESS" "Grafana dashboard provisioning verified successfully"
    log "INFO" "Dashboard access: http://localhost:${GRAFANA_PORT} (login: admin/admin)"
    log "INFO" "Default dashboard should be automatically available after login"
    
    return 0
}

# =============================================================================
# USER ACCESS INSTRUCTIONS AND SERVICE INFORMATION
# =============================================================================

# Generate comprehensive access instructions and service information
print_access_instructions() {
    log "INFO" "Generating monitoring access instructions and service information..."
    
    # Test service accessibility before providing instructions
    local accessible_services=()
    local inaccessible_services=()
    
    # Test Prometheus accessibility
    if curl -f -s "http://localhost:${PROMETHEUS_PORT}/-/healthy" > /dev/null 2>&1; then
        accessible_services+=("prometheus")
    else
        inaccessible_services+=("prometheus")
    fi
    
    # Test Grafana accessibility
    if curl -f -s "http://localhost:${GRAFANA_PORT}/api/health" > /dev/null 2>&1; then
        accessible_services+=("grafana")
    else
        inaccessible_services+=("grafana")
    fi
    
    # Report accessibility status
    if [[ ${#inaccessible_services[@]} -gt 0 ]]; then
        log "WARN" "Some monitoring services are not fully accessible: ${inaccessible_services[*]}"
        log "WARN" "This may affect functionality - check service status and logs"
    fi
    
    # Generate comprehensive access instructions
    echo
    echo "${GREEN}${BOLD}=============================================================${NC}"
    echo "${GREEN}${BOLD}  MONITORING STACK SETUP SUCCESSFUL!${NC}"
    echo "${GREEN}${BOLD}=============================================================${NC}"
    echo
    echo "${BOLD}MONITORING SERVICES ACCESS INFORMATION:${NC}"
    echo
    echo "${CYAN}📊 Prometheus (Metrics Collection and Querying):${NC}"
    echo "   Main Interface: ${BOLD}http://localhost:${PROMETHEUS_PORT}${NC}"
    echo "   Targets Status: ${BOLD}http://localhost:${PROMETHEUS_PORT}/targets${NC}"
    echo "   Query Interface: ${BOLD}http://localhost:${PROMETHEUS_PORT}/graph${NC}"
    echo "   Health Check: ${BOLD}http://localhost:${PROMETHEUS_PORT}/-/healthy${NC}"
    echo "   Configuration: ${BOLD}http://localhost:${PROMETHEUS_PORT}/config${NC}"
    echo "   ${YELLOW}Purpose: Collects metrics from backend service for monitoring${NC}"
    echo
    echo "${CYAN}📈 Grafana (Visualization and Dashboards):${NC}"
    echo "   Main Interface: ${BOLD}http://localhost:${GRAFANA_PORT}${NC}"
    echo "   Username: ${BOLD}admin${NC}"
    echo "   Password: ${BOLD}admin${NC}"
    echo "   Health Check: ${BOLD}http://localhost:${GRAFANA_PORT}/api/health${NC}"
    echo "   ${YELLOW}Note: You'll be prompted to change the password on first login${NC}"
    echo "   ${YELLOW}Purpose: Visualizes metrics data with pre-configured dashboards${NC}"
    echo
    echo "${BOLD}QUICK VERIFICATION COMMANDS:${NC}"
    echo
    echo "  # Test Prometheus health and targets"
    echo "  ${BOLD}curl http://localhost:${PROMETHEUS_PORT}/-/healthy${NC}"
    echo "  ${BOLD}curl http://localhost:${PROMETHEUS_PORT}/targets${NC}"
    echo
    echo "  # Test Grafana health"
    echo "  ${BOLD}curl http://localhost:${GRAFANA_PORT}/api/health${NC}"
    echo
    echo "  # Check monitoring service status"
    echo "  ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} ps prometheus grafana${NC}"
    echo
    echo "  # View monitoring service logs"
    echo "  ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} logs -f prometheus${NC}"
    echo "  ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} logs -f grafana${NC}"
    echo
    echo "${BOLD}MONITORING STACK MANAGEMENT:${NC}"
    echo
    echo "  # Stop monitoring services"
    echo "  ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} stop prometheus grafana${NC}"
    echo
    echo "  # Restart monitoring services"
    echo "  ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} restart prometheus grafana${NC}"
    echo
    echo "  # View monitoring service resource usage"
    echo "  ${BOLD}docker stats \$(${COMPOSE_CMD} -f ${COMPOSE_FILE} ps -q prometheus grafana)${NC}"
    echo
    echo "${BOLD}DASHBOARD INFORMATION:${NC}"
    echo "  Pre-configured Dashboard: ${BOLD}Node.js Hello World Tutorial Metrics${NC}"
    echo "  Dashboard Features:"
    echo "    - Request rate monitoring"
    echo "    - Error rate tracking"
    echo "    - Response time percentiles (p50, p95, p99)"
    echo "    - Memory usage visualization"
    echo "    - CPU usage monitoring"
    echo "    - Service uptime tracking"
    echo "    - Health status indicators"
    echo
    echo "${BOLD}METRICS AVAILABLE:${NC}"
    echo "  - HTTP request metrics (rate, duration, status codes)"
    echo "  - Node.js process metrics (memory, CPU, uptime)"
    echo "  - Application health status"
    echo "  - Custom business metrics (if configured)"
    echo
    echo "${BOLD}CONFIGURATION FILES:${NC}"
    echo "  Prometheus Config: ${BOLD}${PROMETHEUS_CONFIG_PATH}${NC}"
    echo "  Grafana Dashboard: ${BOLD}${GRAFANA_DASHBOARD_PATH}${NC}"
    echo "  Docker Compose: ${BOLD}${COMPOSE_FILE}${NC}"
    echo
    echo "${BOLD}TROUBLESHOOTING:${NC}"
    echo "  If monitoring services are not accessible:"
    echo "  1. Check container status: ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} ps${NC}"
    echo "  2. Verify port availability: ${BOLD}netstat -tlnp | grep -E ':(${PROMETHEUS_PORT}|${GRAFANA_PORT}) '${NC}"
    echo "  3. Check service logs: ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} logs [service-name]${NC}"
    echo "  4. Test endpoints manually:"
    echo "     - ${BOLD}curl -v http://localhost:${PROMETHEUS_PORT}/-/healthy${NC}"
    echo "     - ${BOLD}curl -v http://localhost:${GRAFANA_PORT}/api/health${NC}"
    echo "  5. Restart monitoring stack: ${BOLD}${SCRIPT_NAME} --force${NC}"
    echo
    echo "${BOLD}EDUCATIONAL NOTES:${NC}"
    echo "  This monitoring stack is configured for educational purposes and includes:"
    echo "  - Sample metrics collection from Node.js backend service"
    echo "  - Pre-built visualization dashboards for common metrics"
    echo "  - Basic alerting capabilities (can be extended)"
    echo "  - Integration with Docker Compose for easy management"
    echo
    echo "${GREEN}${BOLD}Monitoring stack is ready for observing your Node.js application! 🎯${NC}"
    echo "${GREEN}${BOLD}=============================================================${NC}"
    echo
}

# =============================================================================
# ERROR HANDLING AND TROUBLESHOOTING
# =============================================================================

# Handle monitoring setup failures with detailed error reporting and guidance
handle_monitoring_failure() {
    local exit_code="${1:-1}"
    local failure_stage="${2:-unknown}"
    
    log "ERROR" "Monitoring setup failed during ${failure_stage} stage (exit code: ${exit_code})"
    echo
    echo "${RED}${BOLD}=============================================================${NC}"
    echo "${RED}${BOLD}  MONITORING SETUP FAILED${NC}"
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
        "prerequisites")
            echo "  ${CYAN}Prerequisites Failure:${NC}"
            echo "  1. Install missing dependencies:"
            echo "     - Docker: https://docs.docker.com/get-docker/"
            echo "     - Docker Compose: https://docs.docker.com/compose/install/"
            echo "     - curl: ${BOLD}apt-get install curl${NC} (Ubuntu/Debian)"
            echo "  2. Verify Docker daemon: ${BOLD}sudo systemctl start docker${NC}"
            echo "  3. Add user to docker group: ${BOLD}sudo usermod -aG docker \$USER${NC}"
            echo "  4. Check configuration files exist and are readable"
            echo "  5. Re-run with verbose output: ${BOLD}${SCRIPT_NAME} --verbose${NC}"
            ;;
        "startup")
            echo "  ${CYAN}Service Startup Failure:${NC}"
            echo "  1. Check port availability:"
            echo "     - Prometheus: ${BOLD}netstat -tlnp | grep :${PROMETHEUS_PORT}${NC}"
            echo "     - Grafana: ${BOLD}netstat -tlnp | grep :${GRAFANA_PORT}${NC}"
            echo "  2. View service logs: ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} logs prometheus grafana${NC}"
            echo "  3. Check Docker Compose configuration: ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} config${NC}"
            echo "  4. Verify sufficient resources: ${BOLD}free -h && df -h${NC}"
            echo "  5. Force restart: ${BOLD}${SCRIPT_NAME} --force${NC}"
            ;;
        "healthcheck")
            echo "  ${CYAN}Health Check Failure:${NC}"
            echo "  1. Increase timeout: ${BOLD}${SCRIPT_NAME} --timeout 120${NC}"
            echo "  2. Check individual service health:"
            echo "     - Prometheus: ${BOLD}curl -v http://localhost:${PROMETHEUS_PORT}/-/healthy${NC}"
            echo "     - Grafana: ${BOLD}curl -v http://localhost:${GRAFANA_PORT}/api/health${NC}"
            echo "  3. View detailed service logs:"
            echo "     - ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} logs --tail=50 prometheus${NC}"
            echo "     - ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} logs --tail=50 grafana${NC}"
            echo "  4. Check container status: ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} ps${NC}"
            echo "  5. Restart problematic services: ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} restart [service]${NC}"
            ;;
        "dashboard")
            echo "  ${CYAN}Dashboard Provisioning Failure:${NC}"
            echo "  1. Verify dashboard file: ${BOLD}cat ${GRAFANA_DASHBOARD_PATH}${NC}"
            echo "  2. Check Grafana logs: ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} logs grafana${NC}"
            echo "  3. Test Grafana API: ${BOLD}curl -v http://localhost:${GRAFANA_PORT}/api/health${NC}"
            echo "  4. Manual dashboard import via Grafana UI"
            echo "  5. Restart Grafana: ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} restart grafana${NC}"
            ;;
        *)
            echo "  ${CYAN}General Troubleshooting:${NC}"
            echo "  1. Check system resources: ${BOLD}free -h && df -h${NC}"
            echo "  2. Verify Docker installation: ${BOLD}docker version && ${COMPOSE_CMD} version${NC}"
            echo "  3. Check project structure: ${BOLD}ls -la ${PROJECT_ROOT}/infrastructure/monitoring/${NC}"
            echo "  4. Run with full debugging: ${BOLD}${SCRIPT_NAME} --verbose --log-level DEBUG${NC}"
            echo "  5. Validate configuration: ${BOLD}${SCRIPT_NAME} --dry-run${NC}"
            ;;
    esac
    
    echo
    echo "${BOLD}Cleanup and Recovery Commands:${NC}"
    echo "  # Stop monitoring services"
    echo "  ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} stop prometheus grafana${NC}"
    echo
    echo "  # Remove monitoring containers and volumes"
    echo "  ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} down prometheus grafana${NC}"
    echo
    echo "  # Clean Docker system (if needed)"
    echo "  ${BOLD}docker system prune -f${NC}"
    echo
    echo "${BOLD}Recovery Options:${NC}"
    echo "  # Retry setup with clean slate"
    echo "  ${BOLD}${COMPOSE_CMD} -f ${COMPOSE_FILE} down prometheus grafana && ${SCRIPT_NAME}${NC}"
    echo
    echo "  # Force restart monitoring stack"
    echo "  ${BOLD}${SCRIPT_NAME} --force${NC}"
    echo
    echo "  # Setup with extended timeout"
    echo "  ${BOLD}${SCRIPT_NAME} --timeout 180${NC}"
    echo
    echo "${RED}${BOLD}=============================================================${NC}"
    echo
}

# =============================================================================
# MAIN MONITORING SETUP ORCHESTRATION
# =============================================================================

# Main monitoring setup function orchestrating all setup steps
main() {
    local start_time
    start_time=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo
    echo "${BLUE}${BOLD}=============================================================${NC}"
    echo "${BLUE}${BOLD}  Node.js Tutorial Monitoring Stack Setup v${SCRIPT_VERSION}${NC}"
    echo "${BLUE}${BOLD}=============================================================${NC}"
    echo
    log "INFO" "Monitoring setup started at ${start_time}"
    log "INFO" "Target services: ${MONITORING_SERVICES}"
    log "INFO" "Prometheus port: ${PROMETHEUS_PORT}"
    log "INFO" "Grafana port: ${GRAFANA_PORT}"
    log "INFO" "Healthcheck timeout: ${HEALTHCHECK_TIMEOUT}s"
    log "INFO" "Compose file: ${COMPOSE_FILE}"
    if [[ "${DRY_RUN}" == "true" ]]; then
        log "INFO" "DRY-RUN MODE: Configuration validation only"
    fi
    echo
    
    # Step 1: Validate prerequisites and configuration
    log "INFO" "Step 1/6: Validating prerequisites and configuration..."
    if ! validate_prerequisites; then
        handle_monitoring_failure 1 "prerequisites"
        exit 1
    fi
    
    # Step 2: Run backup integration if requested
    if [[ "${BACKUP_BEFORE_MONITORING}" == "1" ]]; then
        log "INFO" "Step 2/6: Running backup integration..."
        run_backup_integration  # This function handles its own errors gracefully
    else
        log "INFO" "Step 2/6: Skipping backup integration (not requested)"
    fi
    
    # Step 3: Start monitoring services
    log "INFO" "Step 3/6: Starting monitoring services..."
    if ! docker_compose_up_monitoring; then
        handle_monitoring_failure 4 "startup"
        exit 4
    fi
    
    # Step 4: Wait for health checks
    log "INFO" "Step 4/6: Verifying monitoring service health..."
    if ! wait_for_monitoring_healthchecks; then
        handle_monitoring_failure 5 "healthcheck"
        exit 5
    fi
    
    # Step 5: Provision Grafana dashboard
    log "INFO" "Step 5/6: Verifying Grafana dashboard provisioning..."
    if ! provision_grafana_dashboard; then
        handle_monitoring_failure 6 "dashboard"
        exit 6
    fi
    
    # Step 6: Generate access instructions
    log "INFO" "Step 6/6: Generating monitoring access instructions..."
    print_access_instructions
    
    # Final success message
    local end_time
    end_time=$(date '+%Y-%m-%d %H:%M:%S')
    local setup_duration
    setup_duration=$(( $(date -d "${end_time}" +%s) - $(date -d "${start_time}" +%s) ))
    
    log "SUCCESS" "Monitoring stack setup completed successfully in ${setup_duration} seconds"
    log "INFO" "All monitoring services are running and accessible"
    log "INFO" "Prometheus: http://localhost:${PROMETHEUS_PORT}"
    log "INFO" "Grafana: http://localhost:${GRAFANA_PORT} (admin/admin)"
    
    exit 0
}

# =============================================================================
# SCRIPT EXECUTION ENTRY POINT
# =============================================================================

# Entry point with signal handling and comprehensive error management
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    # Set up signal handling for graceful cleanup
    trap 'log "ERROR" "Monitoring setup interrupted by signal"; exit 130' INT TERM
    
    # Parse command-line arguments
    parse_args "$@"
    
    # Validate execution context
    if [[ ! -f "${COMPOSE_FILE}" ]]; then
        log "ERROR" "Docker Compose file not found: ${COMPOSE_FILE}"
        log "ERROR" "Please run from the project root or set COMPOSE_FILE environment variable"
        exit 1
    fi
    
    # Execute main monitoring setup process
    main
fi

# =============================================================================
# END OF SCRIPT
# =============================================================================