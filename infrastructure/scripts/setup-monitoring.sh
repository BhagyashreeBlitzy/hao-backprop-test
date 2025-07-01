#!/bin/bash

# =============================================================================
# Monitoring Stack Setup Script for Node.js/Express.js Tutorial
# =============================================================================
#
# This script automates the setup and initialization of the monitoring stack
# (Prometheus and Grafana) for the Node.js/Express.js tutorial application.
# It ensures that Prometheus and Grafana are correctly configured, started,
# and accessible, with all required configuration files and dashboards mounted.
#
# Features:
# - Validates prerequisites and dependencies
# - Manages Docker Compose orchestration for monitoring services
# - Provisions Grafana dashboards automatically
# - Provides comprehensive health check verification
# - Supports educational, local, and CI/CD deployments
# - Integrates with backup and disaster recovery procedures
#
# Requirements:
# - Docker Engine (20+) with proper permissions
# - Docker Compose (1.29+ or Compose V2) for service orchestration
# - curl (7.68+) for health endpoint verification
# - Core utilities: sleep, echo, grep (coreutils 8+)
# - Prometheus configuration: infrastructure/monitoring/prometheus.yml
# - Grafana dashboard: infrastructure/monitoring/grafana-dashboard.json
# - Docker Compose file: infrastructure/docker-compose.yml
#
# Usage Examples:
#   ./setup-monitoring.sh                     # Standard monitoring setup
#   ./setup-monitoring.sh --timeout 120      # Custom health check timeout
#   ./setup-monitoring.sh --verbose          # Enable detailed logging
#   ./setup-monitoring.sh --help             # Display usage instructions
#
# Exit Codes:
#   0 - Monitoring setup completed successfully
#   1 - General setup error or service failure
#   2 - Invalid arguments or missing dependencies
#   3 - Docker/Docker Compose unavailable
#   4 - Service health check failure or timeout
#   5 - Configuration file validation failure
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

# Monitoring service configuration
readonly MONITORING_SERVICES="prometheus grafana"
readonly PROMETHEUS_CONFIG_PATH="${PROJECT_ROOT}/infrastructure/monitoring/prometheus.yml"
readonly GRAFANA_DASHBOARD_PATH="${PROJECT_ROOT}/infrastructure/monitoring/grafana-dashboard.json"
readonly COMPOSE_FILE="${PROJECT_ROOT}/infrastructure/docker-compose.yml"

# Service endpoints and ports
readonly PROMETHEUS_PORT="9090"
readonly GRAFANA_PORT="3001"

# Default configuration with environment variable override support
readonly DEFAULT_HEALTHCHECK_TIMEOUT="${HEALTHCHECK_TIMEOUT:-60}"

# Runtime variables (set by argument parsing)
HEALTHCHECK_TIMEOUT="${DEFAULT_HEALTHCHECK_TIMEOUT}"
VERBOSE=false

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
# Usage: log_message "INFO" "Monitoring setup started"
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
# Usage: handle_error "Health check failed" 4
handle_error() {
    local error_message="$1"
    local exit_code="${2:-1}"
    
    log_message "ERROR" "${error_message}"
    log_message "ERROR" "Monitoring setup failed with exit code ${exit_code}"
    log_message "INFO" "Check logs above for detailed error information"
    log_message "INFO" "Use 'docker-compose -f ${COMPOSE_FILE} logs prometheus grafana' for service logs"
    
    # Provide troubleshooting guidance
    case "${exit_code}" in
        1)
            log_message "INFO" "General error - check Docker daemon and service configurations"
            ;;
        2)
            log_message "INFO" "Configuration error - verify arguments and file paths"
            ;;
        3)
            log_message "INFO" "Docker unavailable - ensure Docker daemon is running"
            ;;
        4)
            log_message "INFO" "Health check failure - services may need more time to start"
            log_message "INFO" "Try increasing HEALTHCHECK_TIMEOUT or check service logs"
            ;;
        5)
            log_message "INFO" "Configuration validation failure - check prometheus.yml and grafana-dashboard.json"
            ;;
    esac
    
    exit "${exit_code}"
}

# =============================================================================
# Core Setup Functions
# =============================================================================

# Display comprehensive usage instructions and examples
# Usage: print_usage
print_usage() {
    cat << EOF
${CYAN}${SCRIPT_NAME} v${SCRIPT_VERSION}${NC}
Monitoring Stack Setup Script for Node.js/Express.js Tutorial

${YELLOW}DESCRIPTION:${NC}
    Automates the setup and initialization of the monitoring stack (Prometheus
    and Grafana) for the Node.js/Express.js tutorial application. Ensures that
    monitoring services are correctly configured, started, and accessible with
    all required configuration files and dashboards mounted.

${YELLOW}USAGE:${NC}
    ${SCRIPT_NAME} [OPTIONS]

${YELLOW}OPTIONS:${NC}
    -h, --help                  Display this help message and exit
    -t, --timeout SECONDS       Health check timeout in seconds (default: ${DEFAULT_HEALTHCHECK_TIMEOUT})
    -v, --verbose               Enable verbose logging and debug output

${YELLOW}EXAMPLES:${NC}
    ${SCRIPT_NAME}                          # Standard monitoring setup
    ${SCRIPT_NAME} --timeout 120            # Custom health check timeout
    ${SCRIPT_NAME} --verbose                # Enable detailed logging
    ${SCRIPT_NAME} --timeout 90 --verbose  # Custom timeout with verbose output

${YELLOW}ENVIRONMENT VARIABLES:${NC}
    HEALTHCHECK_TIMEOUT         Default health check timeout in seconds (default: 60)

${YELLOW}MONITORING SERVICES:${NC}
    Prometheus:
    • Metrics collection and storage (port ${PROMETHEUS_PORT})
    • Configuration: ${PROMETHEUS_CONFIG_PATH}
    • Health endpoint: http://localhost:${PROMETHEUS_PORT}/-/healthy
    • Web UI: http://localhost:${PROMETHEUS_PORT}

    Grafana:
    • Metrics visualization and dashboarding (port ${GRAFANA_PORT})
    • Dashboard configuration: ${GRAFANA_DASHBOARD_PATH}
    • Health endpoint: http://localhost:${GRAFANA_PORT}/api/health
    • Web UI: http://localhost:${GRAFANA_PORT} (admin/admin)

${YELLOW}SETUP PHASES:${NC}
    1. Prerequisites Validation    Verify Docker, Compose, and configuration files
    2. Service Startup            Start Prometheus and Grafana via Docker Compose
    3. Health Check Verification  Wait for services to pass health checks
    4. Dashboard Provisioning    Ensure Grafana dashboard is available
    5. Access Instructions       Display endpoint URLs and credentials

${YELLOW}PREREQUISITES:${NC}
    • Docker Engine 20+ with proper permissions
    • Docker Compose 1.29+ or Compose V2
    • curl 7.68+ for health check verification
    • GNU coreutils 8+ (sleep, echo, grep)
    • Required configuration files:
      - ${PROMETHEUS_CONFIG_PATH}
      - ${GRAFANA_DASHBOARD_PATH}
      - ${COMPOSE_FILE}

${YELLOW}EXIT CODES:${NC}
    0    Monitoring setup completed successfully
    1    General setup error or service failure
    2    Invalid arguments or missing dependencies
    3    Docker/Docker Compose unavailable
    4    Service health check failure or timeout
    5    Configuration file validation failure

${YELLOW}TROUBLESHOOTING:${NC}
    Service Logs:               docker-compose -f ${COMPOSE_FILE} logs prometheus grafana
    Service Status:             docker-compose -f ${COMPOSE_FILE} ps
    Stop Services:              docker-compose -f ${COMPOSE_FILE} stop prometheus grafana
    Configuration Test:         docker-compose -f ${COMPOSE_FILE} config

${YELLOW}INTEGRATION:${NC}
    This script can be integrated with:
    • deploy.sh for full stack deployment
    • backup.sh for disaster recovery procedures
    • CI/CD pipelines for automated monitoring setup
    • Educational workflows for tutorial environments

EOF
}

# Parse and validate command-line arguments
# Sets global variables: HEALTHCHECK_TIMEOUT, VERBOSE
# Usage: parse_args "$@"
parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -h|--help)
                print_usage
                exit 0
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
    
    log_message "DEBUG" "Command-line arguments parsed successfully"
}

# Comprehensive prerequisite validation
# Validates Docker environment, Docker Compose, and configuration files
# Usage: validate_prerequisites
validate_prerequisites() {
    log_message "INFO" "=== Prerequisites Validation Phase ==="
    log_message "INFO" "Validating Docker environment and configuration files"
    
    local missing_deps=()
    
    # Check required command-line utilities (Docker Engine 20+, Docker Compose 1.29+, curl 7.68+, coreutils 8+)
    local required_commands=("docker" "docker-compose" "curl" "grep" "sleep" "echo")
    
    for cmd in "${required_commands[@]}"; do
        if ! command -v "${cmd}" &> /dev/null; then
            missing_deps+=("${cmd}")
        fi
    done
    
    if [[ ${#missing_deps[@]} -gt 0 ]]; then
        handle_error "Missing required dependencies: ${missing_deps[*]}" 2
    fi
    
    # Validate Docker daemon availability and permissions
    if ! docker info &> /dev/null; then
        handle_error "Docker daemon is not running or not accessible" 3
    fi
    
    log_message "DEBUG" "Docker daemon is available and accessible"
    
    # Validate Docker Compose availability and functionality
    if ! docker-compose version &> /dev/null; then
        handle_error "Docker Compose is not available or not functioning" 3
    fi
    
    log_message "DEBUG" "Docker Compose is available and functional"
    
    # Validate Docker Compose file existence and syntax
    if [[ ! -f "${COMPOSE_FILE}" ]]; then
        handle_error "Docker Compose file not found: ${COMPOSE_FILE}" 5
    fi
    
    if ! docker-compose -f "${COMPOSE_FILE}" config &> /dev/null; then
        handle_error "Docker Compose file syntax validation failed: ${COMPOSE_FILE}" 5
    fi
    
    log_message "DEBUG" "Docker Compose file validated successfully"
    
    # Validate Prometheus configuration file
    if [[ ! -f "${PROMETHEUS_CONFIG_PATH}" ]]; then
        handle_error "Prometheus configuration file not found: ${PROMETHEUS_CONFIG_PATH}" 5
    fi
    
    # Basic Prometheus configuration validation
    if ! grep -q "scrape_configs:" "${PROMETHEUS_CONFIG_PATH}"; then
        handle_error "Prometheus configuration appears invalid - missing scrape_configs section" 5
    fi
    
    if ! grep -q "nodejs-backend" "${PROMETHEUS_CONFIG_PATH}"; then
        handle_error "Prometheus configuration missing nodejs-backend job definition" 5
    fi
    
    log_message "DEBUG" "Prometheus configuration file validated successfully"
    
    # Validate Grafana dashboard configuration file
    if [[ ! -f "${GRAFANA_DASHBOARD_PATH}" ]]; then
        handle_error "Grafana dashboard file not found: ${GRAFANA_DASHBOARD_PATH}" 5
    fi
    
    # Basic Grafana dashboard JSON validation
    if ! grep -q '"dashboard"' "${GRAFANA_DASHBOARD_PATH}"; then
        handle_error "Grafana dashboard appears invalid - missing dashboard section" 5
    fi
    
    if ! grep -q '"nodejs-hello-tutorial"' "${GRAFANA_DASHBOARD_PATH}"; then
        handle_error "Grafana dashboard missing expected tutorial configuration" 5
    fi
    
    log_message "DEBUG" "Grafana dashboard configuration validated successfully"
    
    # Verify Docker Compose includes prometheus and grafana services
    if ! docker-compose -f "${COMPOSE_FILE}" config | grep -q "prometheus:"; then
        handle_error "Docker Compose configuration missing prometheus service definition" 5
    fi
    
    if ! docker-compose -f "${COMPOSE_FILE}" config | grep -q "grafana:"; then
        handle_error "Docker Compose configuration missing grafana service definition" 5
    fi
    
    log_message "SUCCESS" "All prerequisites validated successfully"
}

# Start Prometheus and Grafana services using Docker Compose
# Returns: 0 on success, non-zero on failure
# Usage: docker_compose_up_monitoring
docker_compose_up_monitoring() {
    log_message "INFO" "=== Service Startup Phase ==="
    log_message "INFO" "Starting Prometheus and Grafana services with Docker Compose"
    
    # Set environment variables for consistent configuration
    export NODE_ENV="${NODE_ENV:-development}"
    export COMPOSE_DOCKER_CLI_BUILD=1
    export DOCKER_BUILDKIT=1
    
    # Construct docker-compose up command for monitoring services only
    local compose_up_cmd=(
        docker-compose
        -f "${COMPOSE_FILE}"
        up
        -d
        --remove-orphans
        prometheus
        grafana
    )
    
    log_message "DEBUG" "Executing startup command: ${compose_up_cmd[*]}"
    
    if "${compose_up_cmd[@]}"; then
        log_message "SUCCESS" "Monitoring services started successfully"
        
        # Display service status if verbose mode is enabled
        if [[ "${VERBOSE}" == "true" ]]; then
            log_message "DEBUG" "Service status:"
            docker-compose -f "${COMPOSE_FILE}" ps prometheus grafana
        fi
        
        return 0
    else
        local startup_exit_code=$?
        handle_error "Monitoring service startup failed with exit code ${startup_exit_code}" 1
    fi
}

# Wait for Prometheus and Grafana to pass their health checks with comprehensive monitoring
# Returns: 0 on success, non-zero on failure/timeout
# Usage: wait_for_monitoring_healthchecks
wait_for_monitoring_healthchecks() {
    log_message "INFO" "=== Health Check Verification Phase ==="
    log_message "INFO" "Waiting for Prometheus and Grafana to become healthy (timeout: ${HEALTHCHECK_TIMEOUT}s)"
    
    local start_time
    start_time="$(date '+%s')"
    local check_interval=5
    local services_healthy=0
    local total_services=2  # prometheus and grafana
    
    # Service definitions for health checking
    local services=("prometheus" "grafana")
    local service_ports=("${PROMETHEUS_PORT}" "${GRAFANA_PORT}")
    local health_endpoints=("/-/healthy" "/api/health")
    
    # Health check status tracking
    declare -A service_status
    declare -A service_last_check
    
    # Initialize service status tracking
    for service in "${services[@]}"; do
        service_status["$service"]="unknown"
        service_last_check["$service"]=0
    done
    
    log_message "INFO" "Monitoring ${total_services} services: ${services[*]}"
    
    while true; do
        local current_time
        current_time="$(date '+%s')"
        local elapsed_time=$((current_time - start_time))
        
        # Check if overall timeout exceeded
        if [[ ${elapsed_time} -ge ${HEALTHCHECK_TIMEOUT} ]]; then
            log_message "ERROR" "Health check timeout exceeded (${HEALTHCHECK_TIMEOUT}s)"
            log_message "ERROR" "Service health status summary:"
            for service in "${services[@]}"; do
                log_message "ERROR" "  ${service}: ${service_status[$service]}"
            done
            handle_error "Health check verification failed due to timeout" 4
        fi
        
        services_healthy=0
        
        # Check each service health status
        for i in "${!services[@]}"; do
            local service="${services[$i]}"
            local port="${service_ports[$i]}"
            local health_endpoint="${health_endpoints[$i]}"
            local service_url="http://localhost:${port}${health_endpoint}"
            
            # Skip frequent checks for already healthy services
            local last_check="${service_last_check[$service]}"
            if [[ "${service_status[$service]}" == "healthy" && $((current_time - last_check)) -lt 15 ]]; then
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
                        if [[ "${VERBOSE}" == "true" ]]; then
                            log_message "ERROR" "Last 10 lines of ${service} logs:"
                            docker-compose -f "${COMPOSE_FILE}" logs --tail=10 "${service}" >&2
                        fi
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
            log_message "SUCCESS" "All ${total_services} monitoring services are healthy!"
            log_message "INFO" "Total health check time: ${elapsed_time} seconds"
            return 0
        fi
        
        # Progress update every 20 seconds
        if [[ $((elapsed_time % 20)) -eq 0 && ${elapsed_time} -gt 0 ]]; then
            log_message "INFO" "Health check progress: ${services_healthy}/${total_services} services healthy (${elapsed_time}s elapsed)"
        fi
        
        # Wait before next check cycle
        sleep ${check_interval}
    done
}

# Ensure Grafana dashboard is provisioned by verifying mount and availability
# Returns: 0 on success, non-zero on error
# Usage: provision_grafana_dashboard
provision_grafana_dashboard() {
    log_message "INFO" "=== Dashboard Provisioning Phase ==="
    log_message "INFO" "Verifying Grafana dashboard provisioning and availability"
    
    # Check that grafana-dashboard.json is mounted into the Grafana container
    local grafana_container_id
    grafana_container_id=$(docker-compose -f "${COMPOSE_FILE}" ps -q grafana 2>/dev/null)
    
    if [[ -z "${grafana_container_id}" ]]; then
        handle_error "Grafana container not found or not running" 1
    fi
    
    # Verify dashboard file is mounted in the container
    if docker exec "${grafana_container_id}" test -f "/etc/grafana/provisioning/dashboards/nodejs-tutorial.json" 2>/dev/null; then
        log_message "SUCCESS" "Grafana dashboard file is properly mounted"
    else
        log_message "WARN" "Dashboard file not found in expected location - checking alternative paths"
        
        # Check if dashboard file exists in any grafana provisioning directory
        if docker exec "${grafana_container_id}" find /etc/grafana -name "*.json" -type f 2>/dev/null | grep -q "nodejs"; then
            log_message "SUCCESS" "Dashboard file found in grafana provisioning directory"
        else
            log_message "ERROR" "Dashboard file not properly mounted in Grafana container"
            log_message "INFO" "Grafana will start without pre-configured dashboard"
            log_message "INFO" "Dashboard can be imported manually via Grafana UI"
        fi
    fi
    
    # Wait for Grafana to fully initialize (dashboard loading takes time)
    log_message "INFO" "Waiting for Grafana to complete initialization and dashboard loading..."
    sleep 10
    
    # Optional: Verify dashboard is accessible via Grafana API (requires admin credentials)
    # This is optional since it requires API authentication
    local grafana_api_url="http://localhost:${GRAFANA_PORT}/api/search?query=nodejs"
    local api_check_result
    
    if api_check_result=$(curl -f -s -u admin:admin "${grafana_api_url}" 2>/dev/null); then
        if echo "${api_check_result}" | grep -q "nodejs"; then
            log_message "SUCCESS" "Dashboard is available and accessible via Grafana API"
        else
            log_message "INFO" "Dashboard may still be loading - check Grafana UI for availability"
        fi
    else
        log_message "DEBUG" "Unable to verify dashboard via API (expected for default configuration)"
        log_message "INFO" "Dashboard should be available in Grafana UI after login"
    fi
    
    log_message "SUCCESS" "Dashboard provisioning phase completed"
    return 0
}

# Display comprehensive access instructions and monitoring information
# Usage: print_access_instructions
print_access_instructions() {
    log_message "INFO" "=== Monitoring Setup Complete - Access Information ==="
    
    cat << EOF

${GREEN}🎉 Monitoring Stack Setup Successful!${NC}

${YELLOW}📊 Monitoring Service Access URLs:${NC}
┌─────────────────────────────────────────────────────────────┐
│ ${BLUE}Prometheus Monitoring:${NC}          http://localhost:${PROMETHEUS_PORT}   │
│ ${BLUE}Prometheus Health Check:${NC}        http://localhost:${PROMETHEUS_PORT}/-/healthy │
│ ${BLUE}Prometheus Targets:${NC}             http://localhost:${PROMETHEUS_PORT}/targets │
│ ${BLUE}Prometheus Metrics:${NC}             http://localhost:${PROMETHEUS_PORT}/metrics │
├─────────────────────────────────────────────────────────────┤
│ ${GREEN}Grafana Dashboard:${NC}              http://localhost:${GRAFANA_PORT}   │
│ ${GREEN}Grafana Health Check:${NC}           http://localhost:${GRAFANA_PORT}/api/health │
│ ${GREEN}Grafana API:${NC}                    http://localhost:${GRAFANA_PORT}/api │
└─────────────────────────────────────────────────────────────┘

${YELLOW}🔐 Default Credentials:${NC}
• Grafana: ${CYAN}admin${NC} / ${CYAN}admin${NC} (change after first login)

${YELLOW}🚀 Quick Verification Commands:${NC}
# Check Prometheus health and targets
${CYAN}curl http://localhost:${PROMETHEUS_PORT}/-/healthy${NC}
${CYAN}curl http://localhost:${PROMETHEUS_PORT}/api/v1/targets${NC}

# Check Grafana health and API
${CYAN}curl http://localhost:${GRAFANA_PORT}/api/health${NC}
${CYAN}curl -u admin:admin http://localhost:${GRAFANA_PORT}/api/search${NC}

# Test backend metrics scraping (if backend is running)
${CYAN}curl http://localhost:${PROMETHEUS_PORT}/api/v1/query?query=up${NC}

${YELLOW}📈 Monitoring Features:${NC}
• Prometheus automatically scrapes metrics from Node.js backend
• Grafana provides pre-configured dashboard for tutorial application
• Real-time metrics visualization and monitoring
• Health check endpoints for service status verification

${YELLOW}🔧 Configuration Files:${NC}
• Prometheus Config: ${PROMETHEUS_CONFIG_PATH}
• Grafana Dashboard: ${GRAFANA_DASHBOARD_PATH}
• Docker Compose: ${COMPOSE_FILE}

${YELLOW}🛠 Management Commands:${NC}
# View monitoring service logs
${CYAN}docker-compose -f ${COMPOSE_FILE} logs prometheus grafana${NC}

# Check monitoring service status
${CYAN}docker-compose -f ${COMPOSE_FILE} ps prometheus grafana${NC}

# Stop monitoring services
${CYAN}docker-compose -f ${COMPOSE_FILE} stop prometheus grafana${NC}

# Restart monitoring services
${CYAN}docker-compose -f ${COMPOSE_FILE} restart prometheus grafana${NC}

${YELLOW}📚 Educational Usage:${NC}
• Access Prometheus to explore metrics and targets configuration
• Use Grafana to visualize backend application performance
• Modify prometheus.yml to add custom scraping configurations
• Import additional dashboards via Grafana UI
• Practice querying metrics using PromQL in Prometheus

${YELLOW}🔍 Troubleshooting:${NC}
• Check service logs if dashboards don't load: ${CYAN}docker-compose logs grafana${NC}
• Verify backend service is running for metric collection
• Ensure no port conflicts with other services
• Check Docker daemon status and available resources
• Validate configuration files for syntax errors

${GREEN}Health Check Timeout: ${HEALTHCHECK_TIMEOUT}s${NC}
${GREEN}Verbose Logging: $([ "${VERBOSE}" = "true" ] && echo "Enabled" || echo "Disabled")${NC}

EOF

    # Display setup summary
    local setup_time
    setup_time="$(date '+%Y-%m-%d %H:%M:%S')"
    
    log_message "SUCCESS" "Monitoring setup completed successfully at ${setup_time}"
    log_message "INFO" "Prometheus and Grafana are running and healthy"
    log_message "INFO" "The monitoring stack is ready for Node.js/Express.js tutorial use"
    
    # Educational notes for tutorial users
    log_message "INFO" ""
    log_message "INFO" "📚 Educational Notes:"
    log_message "INFO" "• Prometheus scrapes metrics from backend service automatically"
    log_message "INFO" "• Grafana dashboard provides comprehensive application monitoring"
    log_message "INFO" "• This setup demonstrates production-like monitoring practices"
    log_message "INFO" "• Configuration files can be modified for custom monitoring needs"
    log_message "INFO" "• Integration with deploy.sh provides full stack monitoring"
}

# =============================================================================
# Main Setup Orchestration Function
# =============================================================================

# Main monitoring setup orchestration function
# Coordinates all setup phases with comprehensive error handling and logging
# Returns: 0 on success, non-zero on failure
# Usage: main "$@"
main() {
    local start_time
    start_time="$(date '+%s')"
    
    # Script initialization and banner
    log_message "INFO" ""
    log_message "INFO" "╔══════════════════════════════════════════════════════════════╗"
    log_message "INFO" "║         Node.js/Express.js Tutorial Monitoring Setup        ║"
    log_message "INFO" "║                    ${SCRIPT_NAME} v${SCRIPT_VERSION}                    ║"
    log_message "INFO" "╚══════════════════════════════════════════════════════════════╝"
    log_message "INFO" ""
    
    # Parse command-line arguments
    parse_args "$@"
    
    # Environment and configuration display
    log_message "INFO" "🔧 Monitoring Setup Configuration:"
    log_message "INFO" "  • Project Root: ${PROJECT_ROOT}"
    log_message "INFO" "  • Compose File: ${COMPOSE_FILE}"
    log_message "INFO" "  • Prometheus Config: ${PROMETHEUS_CONFIG_PATH}"
    log_message "INFO" "  • Grafana Dashboard: ${GRAFANA_DASHBOARD_PATH}"
    log_message "INFO" "  • Health Check Timeout: ${HEALTHCHECK_TIMEOUT}s"
    log_message "INFO" "  • Verbose Logging: $([ "${VERBOSE}" = "true" ] && echo "Yes" || echo "No")"
    log_message "INFO" ""
    
    # Phase 1: Validate prerequisites and dependencies
    validate_prerequisites
    
    # Phase 2: Start monitoring services
    docker_compose_up_monitoring
    
    # Phase 3: Wait for service health checks
    wait_for_monitoring_healthchecks
    
    # Phase 4: Provision Grafana dashboard
    provision_grafana_dashboard
    
    # Phase 5: Display access information and completion
    print_access_instructions
    
    # Calculate and report setup statistics
    local end_time duration_seconds
    end_time="$(date '+%s')"
    duration_seconds=$((end_time - start_time))
    local duration_minutes=$((duration_seconds / 60))
    local duration_remainder=$((duration_seconds % 60))
    
    log_message "SUCCESS" ""
    log_message "SUCCESS" "🎯 Monitoring Setup Summary:"
    log_message "SUCCESS" "  • Total Duration: ${duration_minutes}m ${duration_remainder}s"
    log_message "SUCCESS" "  • Services Started: prometheus, grafana"
    log_message "SUCCESS" "  • Status: All monitoring services healthy and ready"
    log_message "SUCCESS" ""
    log_message "SUCCESS" "✅ Monitoring Stack Setup Complete!"
    log_message "SUCCESS" "   Visit http://localhost:${PROMETHEUS_PORT} for Prometheus"
    log_message "SUCCESS" "   Visit http://localhost:${GRAFANA_PORT} for Grafana (admin/admin)"
    log_message "SUCCESS" ""
    
    return 0
}

# =============================================================================
# Signal Handling and Script Execution
# =============================================================================

# Trap signals for graceful cleanup on interruption
# Ensures proper cleanup of partially started services
cleanup_on_signal() {
    local signal="$1"
    log_message "WARN" "Received ${signal} signal - initiating graceful shutdown"
    log_message "INFO" "Stopping monitoring services..."
    
    # Attempt to stop services gracefully
    if [[ -f "${COMPOSE_FILE}" ]]; then
        docker-compose -f "${COMPOSE_FILE}" stop prometheus grafana 2>/dev/null || true
    fi
    
    handle_error "Monitoring setup interrupted by ${signal} signal" 130
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
# 1. Standard Monitoring Setup:
#    cd /path/to/project
#    ./infrastructure/scripts/setup-monitoring.sh
#
# 2. Custom Timeout Setup:
#    ./setup-monitoring.sh --timeout 120
#
# 3. Verbose Debug Setup:
#    ./setup-monitoring.sh --verbose
#
# 4. Integration with Full Stack Deployment:
#    ./infrastructure/scripts/deploy.sh  # Deploys full stack including monitoring
#    # OR setup monitoring separately:
#    ./infrastructure/scripts/setup-monitoring.sh
#
# 5. CI/CD Pipeline Integration:
#    - name: Setup Monitoring Stack
#      run: |
#        ./infrastructure/scripts/setup-monitoring.sh --verbose --timeout 180
#        # Verify monitoring endpoints
#        curl --retry 5 --retry-delay 5 http://localhost:9090/-/healthy
#        curl --retry 5 --retry-delay 5 http://localhost:3001/api/health
#
# 6. Educational Workflow:
#    # Start backend first (optional)
#    npm start
#    # Then setup monitoring
#    ./setup-monitoring.sh
#    # Access dashboards for learning
#
# Maintenance and Operations:
# - Monitor service health: watch -n 10 'curl -s http://localhost:9090/-/healthy && curl -s http://localhost:3001/api/health'
# - View real-time logs: docker-compose logs -f prometheus grafana
# - Update configuration: Edit config files and restart services
# - Backup monitoring data: Include prometheus_data and grafana_data volumes in backup procedures
#
# Security Considerations:
# - Change default Grafana credentials after first login
# - Consider enabling Grafana authentication for production use
# - Review Prometheus security settings for external access
# - Implement proper firewall rules for monitoring endpoints
#
# Performance Optimization:
# - Adjust Prometheus retention settings in prometheus.yml
# - Configure Grafana dashboard refresh intervals based on needs
# - Monitor resource usage of monitoring services
# - Optimize scrape intervals for balanced performance and data freshness