#!/usr/bin/env bash

# =============================================================================
# NODE.JS TUTORIAL BACKEND - MONITORING SETUP SCRIPT
# =============================================================================
# 
# This script automates the setup and initialization of monitoring infrastructure
# for the Node.js tutorial backend application. It ensures that all prerequisites
# for observability are met, including environment validation, dependency
# installation, configuration of Prometheus and Grafana, and orchestration of
# monitoring services using Docker Compose.
#
# COMPATIBILITY:
# - Bash >=5.0
# - Docker >=20.10
# - Docker Compose >=1.29
# - prom/prometheus:v2.52.0
# - grafana/grafana:10.4.2
#
# USAGE:
#   ./monitoring-setup.sh [OPTIONS]
#   source ./monitoring-setup.sh [OPTIONS]
#
# OPTIONS:
#   --help          Display this help message
#   --clean         Remove all monitoring containers and volumes
#   --restart       Restart monitoring services
#   --stop          Stop monitoring services without removing them
#   --import-dashboard  Force import of Grafana dashboard
#   --skip-backend  Skip backend service startup
#   --verbose       Enable verbose output
#
# EDUCATIONAL PURPOSE:
# This script demonstrates best practices for monitoring setup in Node.js/Express
# projects, including clear logging, error handling, and step-by-step documentation.
# Provides a reproducible, idempotent script for onboarding and CI/CD workflows.
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
readonly MONITORING_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Define project structure paths relative to script location
readonly MONITORING_CONFIG_DIR="$MONITORING_SCRIPT_DIR/../monitoring"
readonly DOCKER_COMPOSE_FILE="$MONITORING_SCRIPT_DIR/../docker/docker-compose.yml"
readonly PROMETHEUS_CONFIG="$MONITORING_CONFIG_DIR/prometheus.yml"
readonly GRAFANA_DASHBOARD="$MONITORING_CONFIG_DIR/grafana-dashboard.json"

# Monitoring service configuration
readonly PROMETHEUS_PORT="${PROMETHEUS_PORT:-9090}"
readonly GRAFANA_PORT="${GRAFANA_PORT:-3001}"
readonly BACKEND_PORT="${BACKEND_PORT:-3000}"
readonly GRAFANA_DEFAULT_USER="${GRAFANA_DEFAULT_USER:-admin}"
readonly GRAFANA_DEFAULT_PASS="${GRAFANA_DEFAULT_PASS:-admin}"

# Docker service names (must match docker-compose.yml)
readonly PROMETHEUS_SERVICE="prometheus"
readonly GRAFANA_SERVICE="grafana"
readonly BACKEND_SERVICE="backend"

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
CLEAN_SETUP=false
RESTART_SERVICES=false
STOP_SERVICES=false
IMPORT_DASHBOARD=false
SKIP_BACKEND=false
VERBOSE_MODE=false

# -----------------------------------------------------------------------------
# SOURCE SHARED SETUP LOGIC
# -----------------------------------------------------------------------------

# Source the shared setup script for common functions and utilities
# This provides access to logging functions, version checks, and other utilities
if [[ -f "$MONITORING_SCRIPT_DIR/setup.sh" ]]; then
    # shellcheck source=./setup.sh
    source "$MONITORING_SCRIPT_DIR/setup.sh"
    log_verbose "Successfully sourced shared setup functions from setup.sh"
else
    echo "[ERROR] Cannot find setup.sh in $MONITORING_SCRIPT_DIR"
    echo "[INFO] Please ensure you are running this script from the correct directory"
    exit 1
fi

# -----------------------------------------------------------------------------
# MONITORING-SPECIFIC UTILITY FUNCTIONS
# -----------------------------------------------------------------------------

# Function: print_monitoring_separator
# Purpose: Print a visual separator for monitoring output organization
print_monitoring_separator() {
    echo -e "${CYAN}===============================================================================${NC}"
}

# Function: check_service_health
# Purpose: Check if a service is healthy and responding
# Parameters: $1 - Service URL, $2 - Service name, $3 - timeout (optional)
check_service_health() {
    local service_url="$1"
    local service_name="$2"
    local timeout="${3:-30}"
    local max_attempts=6
    local attempt=1
    
    log_info "Checking $service_name health at $service_url..."
    
    while [[ $attempt -le $max_attempts ]]; do
        if curl -s --max-time 5 "$service_url" > /dev/null 2>&1; then
            log_success "$service_name is healthy and responding"
            return 0
        fi
        
        if [[ $attempt -eq $max_attempts ]]; then
            log_warning "$service_name is not responding after $timeout seconds"
            log_info "Service may still be starting up. Check logs with: docker-compose logs $service_name"
            return 1
        fi
        
        log_verbose "Attempt $attempt/$max_attempts: $service_name not ready, waiting..."
        sleep 5
        ((attempt++))
    done
}

# Function: wait_for_service
# Purpose: Wait for a Docker service to be in running state
# Parameters: $1 - Service name
wait_for_service() {
    local service_name="$1"
    local max_attempts=12
    local attempt=1
    
    log_info "Waiting for $service_name service to start..."
    
    while [[ $attempt -le $max_attempts ]]; do
        if docker-compose -f "$DOCKER_COMPOSE_FILE" ps "$service_name" | grep -q "Up"; then
            log_success "$service_name service is running"
            return 0
        fi
        
        if [[ $attempt -eq $max_attempts ]]; then
            log_error "$service_name service failed to start within expected time"
            log_info "Check service logs with: docker-compose -f $DOCKER_COMPOSE_FILE logs $service_name"
            return 1
        fi
        
        log_verbose "Attempt $attempt/$max_attempts: Waiting for $service_name to start..."
        sleep 5
        ((attempt++))
    done
}

# -----------------------------------------------------------------------------
# MONITORING SETUP FUNCTIONS
# -----------------------------------------------------------------------------

# Function: print_usage
# Purpose: Display comprehensive usage instructions for monitoring setup
# Returns: void (prints to stdout)
print_usage() {
    cat << 'EOF'
===============================================================================
NODE.JS TUTORIAL BACKEND - MONITORING SETUP SCRIPT
===============================================================================

DESCRIPTION:
    Automates the setup and initialization of monitoring infrastructure for the
    Node.js tutorial backend application. Ensures all prerequisites for
    observability are met, configures Prometheus and Grafana, and orchestrates
    monitoring services using Docker Compose.

USAGE:
    ./monitoring-setup.sh [OPTIONS]
    source ./monitoring-setup.sh [OPTIONS]

OPTIONS:
    --help                 Display this help message and exit
    --clean                Remove all monitoring containers and volumes
    --restart              Restart all monitoring services
    --stop                 Stop monitoring services without removing them
    --import-dashboard     Force import of Grafana dashboard
    --skip-backend         Skip backend service startup
    --verbose              Enable verbose output for debugging

REQUIREMENTS:
    - Bash >=5.0
    - Docker >=20.10
    - Docker Compose >=1.29
    - Prometheus configuration: infrastructure/monitoring/prometheus.yml
    - Grafana dashboard: infrastructure/monitoring/grafana-dashboard.json
    - Docker Compose configuration: infrastructure/docker/docker-compose.yml

EXAMPLES:
    # Standard monitoring setup
    ./monitoring-setup.sh

    # Setup with verbose output
    ./monitoring-setup.sh --verbose

    # Clean previous setup and restart
    ./monitoring-setup.sh --clean

    # Restart services only
    ./monitoring-setup.sh --restart

    # Setup monitoring without backend
    ./monitoring-setup.sh --skip-backend

MONITORING SERVICES:
    - Prometheus (metrics collection): http://localhost:9090
    - Grafana (visualization): http://localhost:3001 (admin/admin)
    - Backend (application): http://localhost:3000/hello

EDUCATIONAL NOTES:
    This script demonstrates monitoring setup best practices:
    - Configuration validation and health checking
    - Service orchestration with Docker Compose
    - Prometheus metrics collection configuration
    - Grafana dashboard automation and import
    - Error handling and user feedback patterns
    - Idempotent setup operations for CI/CD workflows

For more information, see: infrastructure/monitoring/README.md

===============================================================================
EOF
}

# Function: parse_arguments
# Purpose: Parse command-line arguments and set corresponding flags
# Parameters: All command-line arguments passed to script ($@)
# Returns: void (sets global flag variables)
parse_arguments() {
    log_verbose "Parsing monitoring setup arguments: $*"
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --help|-h)
                print_usage
                exit 0
                ;;
            --clean)
                CLEAN_SETUP=true
                log_verbose "Clean setup mode enabled"
                shift
                ;;
            --restart)
                RESTART_SERVICES=true
                log_verbose "Service restart mode enabled"
                shift
                ;;
            --stop)
                STOP_SERVICES=true
                log_verbose "Service stop mode enabled"
                shift
                ;;
            --import-dashboard)
                IMPORT_DASHBOARD=true
                log_verbose "Dashboard import mode enabled"
                shift
                ;;
            --skip-backend)
                SKIP_BACKEND=true
                log_verbose "Backend service will be skipped"
                shift
                ;;
            --verbose|-v)
                VERBOSE_MODE=true
                log_verbose "Verbose mode enabled for monitoring setup"
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

# Function: validate_monitoring_configs
# Purpose: Ensure Prometheus and Grafana configuration files are present and valid
# Returns: void (exits with error if required files are missing)
validate_monitoring_configs() {
    log_info "Validating monitoring configuration files..."
    
    # Check if monitoring configuration directory exists
    if [[ ! -d "$MONITORING_CONFIG_DIR" ]]; then
        log_error "Monitoring configuration directory not found: $MONITORING_CONFIG_DIR"
        log_info "Please ensure the monitoring directory exists with required configuration files"
        exit 1
    fi
    
    # Check Prometheus configuration file
    if [[ ! -f "$PROMETHEUS_CONFIG" ]]; then
        log_error "Prometheus configuration not found at $PROMETHEUS_CONFIG"
        log_info "Prometheus requires a configuration file to define scrape targets and rules"
        log_info "Expected file structure:"
        log_info "  - global: scrape_interval, evaluation_interval"
        log_info "  - scrape_configs: job configurations for backend service"
        exit 1
    fi
    
    # Validate Prometheus configuration syntax
    log_verbose "Validating Prometheus configuration syntax..."
    if command -v docker &> /dev/null; then
        # Use promtool via Docker to validate configuration
        if ! docker run --rm -v "$PROMETHEUS_CONFIG":/tmp/prometheus.yml \
            prom/prometheus:v2.52.0 promtool check config /tmp/prometheus.yml > /dev/null 2>&1; then
            log_warning "Prometheus configuration syntax validation failed"
            log_info "Configuration may have syntax errors, but setup will continue"
        else
            log_verbose "Prometheus configuration syntax is valid"
        fi
    fi
    
    # Check Grafana dashboard configuration file
    if [[ ! -f "$GRAFANA_DASHBOARD" ]]; then
        log_error "Grafana dashboard not found at $GRAFANA_DASHBOARD"
        log_info "Grafana dashboard provides visualization for Prometheus metrics"
        log_info "Expected dashboard components:"
        log_info "  - Service uptime monitoring"
        log_info "  - Request rate and response time metrics"
        log_info "  - Error rate and performance indicators"
        exit 1
    fi
    
    # Validate Grafana dashboard JSON syntax
    log_verbose "Validating Grafana dashboard JSON syntax..."
    if ! python3 -m json.tool "$GRAFANA_DASHBOARD" > /dev/null 2>&1; then
        if ! jq empty "$GRAFANA_DASHBOARD" > /dev/null 2>&1; then
            log_warning "Grafana dashboard JSON syntax validation failed"
            log_info "Dashboard may have JSON syntax errors, but setup will continue"
        else
            log_verbose "Grafana dashboard JSON syntax is valid"
        fi
    else
        log_verbose "Grafana dashboard JSON syntax is valid"
    fi
    
    # Check Docker Compose configuration file
    if [[ ! -f "$DOCKER_COMPOSE_FILE" ]]; then
        log_error "Docker Compose configuration not found at $DOCKER_COMPOSE_FILE"
        log_info "Docker Compose orchestrates Prometheus, Grafana, and backend services"
        exit 1
    fi
    
    # Validate Docker Compose configuration
    log_verbose "Validating Docker Compose configuration..."
    if ! docker-compose -f "$DOCKER_COMPOSE_FILE" config > /dev/null 2>&1; then
        log_error "Docker Compose configuration validation failed"
        log_info "Please check the Docker Compose file for syntax errors"
        exit 1
    fi
    
    log_success "Monitoring configuration files validation completed"
    
    # Display configuration summary in verbose mode
    if [[ "$VERBOSE_MODE" == "true" ]]; then
        log_verbose "Configuration file summary:"
        log_verbose "  - Prometheus config: $PROMETHEUS_CONFIG"
        log_verbose "  - Grafana dashboard: $GRAFANA_DASHBOARD"
        log_verbose "  - Docker Compose: $DOCKER_COMPOSE_FILE"
        
        # Show file sizes
        if command -v du &> /dev/null; then
            local prometheus_size grafana_size compose_size
            prometheus_size=$(du -h "$PROMETHEUS_CONFIG" | cut -f1)
            grafana_size=$(du -h "$GRAFANA_DASHBOARD" | cut -f1)
            compose_size=$(du -h "$DOCKER_COMPOSE_FILE" | cut -f1)
            
            log_verbose "Configuration file sizes:"
            log_verbose "  - Prometheus: $prometheus_size"
            log_verbose "  - Grafana: $grafana_size"
            log_verbose "  - Docker Compose: $compose_size"
        fi
    fi
}

# Function: clean_monitoring_services
# Purpose: Remove all monitoring containers, networks, and volumes
# Returns: void (cleans up monitoring infrastructure)
clean_monitoring_services() {
    log_info "Cleaning up existing monitoring infrastructure..."
    
    # Change to Docker Compose directory for operations
    cd "$(dirname "$DOCKER_COMPOSE_FILE")" || {
        log_error "Failed to change to Docker Compose directory"
        exit 1
    }
    
    # Stop and remove containers, networks, and volumes
    if docker-compose ps --services > /dev/null 2>&1; then
        log_info "Stopping and removing monitoring containers..."
        
        # Stop services gracefully
        if [[ "$VERBOSE_MODE" == "true" ]]; then
            docker-compose down --volumes --remove-orphans
        else
            docker-compose down --volumes --remove-orphans > /dev/null 2>&1
        fi
        
        log_success "Monitoring containers and volumes cleaned up"
    else
        log_info "No existing monitoring containers found to clean up"
    fi
    
    # Remove any dangling images related to monitoring
    log_verbose "Cleaning up dangling Docker images..."
    if docker images -q --filter=dangling=true | grep -q .; then
        docker rmi $(docker images -q --filter=dangling=true) > /dev/null 2>&1 || true
        log_verbose "Removed dangling Docker images"
    fi
    
    # Return to original directory
    cd - > /dev/null || true
}

# Function: start_monitoring_services
# Purpose: Start Prometheus, Grafana, and backend services using Docker Compose
# Returns: void (starts all monitoring containers and logs status)
start_monitoring_services() {
    log_info "Starting monitoring services with Docker Compose..."
    
    # Change to Docker Compose directory for operations
    cd "$(dirname "$DOCKER_COMPOSE_FILE")" || {
        log_error "Failed to change to Docker Compose directory"
        exit 1
    }
    
    # Define services to start based on configuration
    local services_to_start=""
    
    # Always start Prometheus and Grafana for monitoring
    services_to_start="$PROMETHEUS_SERVICE $GRAFANA_SERVICE"
    
    # Add backend service unless explicitly skipped
    if [[ "$SKIP_BACKEND" == "false" ]]; then
        services_to_start="$services_to_start $BACKEND_SERVICE"
    fi
    
    log_info "Services to start: $services_to_start"
    
    # Pull latest images before starting services
    log_verbose "Pulling latest Docker images for monitoring services..."
    if [[ "$VERBOSE_MODE" == "true" ]]; then
        docker-compose pull $services_to_start
    else
        docker-compose pull $services_to_start > /dev/null 2>&1
    fi
    
    # Start services in detached mode
    log_info "Starting monitoring containers in background..."
    if [[ "$VERBOSE_MODE" == "true" ]]; then
        docker-compose up -d $services_to_start
    else
        docker-compose up -d $services_to_start > /dev/null 2>&1
    fi
    
    # Wait for services to be in running state
    for service in $services_to_start; do
        wait_for_service "$service"
    done
    
    # Return to original directory
    cd - > /dev/null || true
    
    log_success "Monitoring services started successfully"
    
    # Display container status
    log_info "Monitoring service status:"
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps --format table
}

# Function: verify_services_health
# Purpose: Verify that all monitoring services are healthy and responding
# Returns: void (reports health status of services)
verify_services_health() {
    log_info "Verifying monitoring services health..."
    
    local health_checks_passed=0
    local total_health_checks=0
    
    # Check Prometheus health
    ((total_health_checks++))
    if check_service_health "http://localhost:$PROMETHEUS_PORT/-/healthy" "Prometheus"; then
        ((health_checks_passed++))
    fi
    
    # Check Grafana health
    ((total_health_checks++))
    if check_service_health "http://localhost:$GRAFANA_PORT/api/health" "Grafana"; then
        ((health_checks_passed++))
    fi
    
    # Check backend health if not skipped
    if [[ "$SKIP_BACKEND" == "false" ]]; then
        ((total_health_checks++))
        if check_service_health "http://localhost:$BACKEND_PORT/hello" "Backend Application"; then
            ((health_checks_passed++))
        fi
    fi
    
    # Report health check summary
    if [[ $health_checks_passed -eq $total_health_checks ]]; then
        log_success "All monitoring services are healthy ($health_checks_passed/$total_health_checks)"
    else
        log_warning "Some services may not be fully ready ($health_checks_passed/$total_health_checks healthy)"
        log_info "Services may still be starting up. Check individual service logs for details."
    fi
    
    # Display detailed service information in verbose mode
    if [[ "$VERBOSE_MODE" == "true" ]]; then
        log_verbose "Detailed service information:"
        
        # Show Docker container status
        log_verbose "Container status:"
        docker-compose -f "$DOCKER_COMPOSE_FILE" ps
        
        # Show port mappings
        log_verbose "Port mappings:"
        docker-compose -f "$DOCKER_COMPOSE_FILE" port prometheus 9090 2>/dev/null | sed 's/^/  Prometheus: /' || true
        docker-compose -f "$DOCKER_COMPOSE_FILE" port grafana 3000 2>/dev/null | sed 's/^/  Grafana: /' || true
        if [[ "$SKIP_BACKEND" == "false" ]]; then
            docker-compose -f "$DOCKER_COMPOSE_FILE" port backend 3000 2>/dev/null | sed 's/^/  Backend: /' || true
        fi
    fi
}

# Function: import_grafana_dashboard
# Purpose: Automate the import of Grafana dashboard (optional, for advanced onboarding)
# Returns: void (imports dashboard or logs instructions for manual import)
import_grafana_dashboard() {
    log_info "Setting up Grafana dashboard import..."
    
    # Wait additional time for Grafana to fully initialize
    log_verbose "Waiting for Grafana to fully initialize..."
    sleep 10
    
    # Check if Grafana API is accessible
    local grafana_api_url="http://localhost:$GRAFANA_PORT/api"
    local max_attempts=6
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        if curl -s --max-time 5 "$grafana_api_url/health" > /dev/null 2>&1; then
            log_verbose "Grafana API is accessible"
            break
        fi
        
        if [[ $attempt -eq $max_attempts ]]; then
            log_warning "Grafana API is not accessible for dashboard import"
            log_info "You can manually import the dashboard later from: $GRAFANA_DASHBOARD"
            return 1
        fi
        
        log_verbose "Attempt $attempt/$max_attempts: Waiting for Grafana API..."
        sleep 5
        ((attempt++))
    done
    
    # Attempt to configure Prometheus datasource
    log_verbose "Configuring Prometheus datasource in Grafana..."
    
    local datasource_config='{
        "name": "prometheus",
        "type": "prometheus",
        "url": "http://prometheus:9090",
        "access": "proxy",
        "isDefault": true,
        "basicAuth": false
    }'
    
    # Add Prometheus datasource (ignore if it already exists)
    if curl -s -X POST \
        -H "Content-Type: application/json" \
        -u "$GRAFANA_DEFAULT_USER:$GRAFANA_DEFAULT_PASS" \
        -d "$datasource_config" \
        "$grafana_api_url/datasources" > /dev/null 2>&1; then
        log_verbose "Prometheus datasource configured successfully"
    else
        log_verbose "Prometheus datasource may already exist or configuration failed"
    fi
    
    # Attempt automatic dashboard import
    if [[ "$IMPORT_DASHBOARD" == "true" ]] || command -v jq &> /dev/null; then
        log_info "Attempting automatic dashboard import..."
        
        # Create dashboard import payload
        local dashboard_payload
        if command -v jq &> /dev/null; then
            dashboard_payload=$(jq -n \
                --argjson dashboard "$(cat "$GRAFANA_DASHBOARD")" \
                '{
                    dashboard: $dashboard.dashboard,
                    overwrite: true,
                    inputs: [
                        {
                            name: "DS_PROMETHEUS",
                            type: "datasource",
                            pluginId: "prometheus",
                            value: "prometheus"
                        }
                    ]
                }')
        else
            log_verbose "jq not available, skipping automatic dashboard import"
            dashboard_payload=""
        fi
        
        if [[ -n "$dashboard_payload" ]]; then
            # Import dashboard via API
            local import_response
            import_response=$(curl -s -X POST \
                -H "Content-Type: application/json" \
                -u "$GRAFANA_DEFAULT_USER:$GRAFANA_DEFAULT_PASS" \
                -d "$dashboard_payload" \
                "$grafana_api_url/dashboards/import" 2>/dev/null)
            
            if echo "$import_response" | grep -q '"status":"success"' 2>/dev/null; then
                log_success "Grafana dashboard imported automatically"
                log_info "Dashboard is available at: http://localhost:$GRAFANA_PORT/d/nodejs-tutorial-backend/nodejs-tutorial-backend-monitoring"
            else
                log_verbose "Automatic dashboard import may have failed"
                log_info "Manual dashboard import instructions provided below"
            fi
        fi
    fi
    
    # Provide manual import instructions
    log_info "To manually import the Grafana dashboard:"
    log_info "1. Open Grafana at http://localhost:$GRAFANA_PORT"
    log_info "2. Login with username: $GRAFANA_DEFAULT_USER, password: $GRAFANA_DEFAULT_PASS"
    log_info "3. Navigate to '+' > Import dashboard"
    log_info "4. Upload the dashboard file: $GRAFANA_DASHBOARD"
    log_info "5. Select the Prometheus datasource when prompted"
}

# Function: stop_monitoring_services
# Purpose: Stop monitoring services without removing containers
# Returns: void (stops services gracefully)
stop_monitoring_services() {
    log_info "Stopping monitoring services..."
    
    # Change to Docker Compose directory for operations
    cd "$(dirname "$DOCKER_COMPOSE_FILE")" || {
        log_error "Failed to change to Docker Compose directory"
        exit 1
    }
    
    # Stop services gracefully
    if [[ "$VERBOSE_MODE" == "true" ]]; then
        docker-compose stop
    else
        docker-compose stop > /dev/null 2>&1
    fi
    
    # Return to original directory
    cd - > /dev/null || true
    
    log_success "Monitoring services stopped successfully"
}

# Function: restart_monitoring_services
# Purpose: Restart monitoring services (stop and start)
# Returns: void (restarts all monitoring services)
restart_monitoring_services() {
    log_info "Restarting monitoring services..."
    
    # Stop services first
    stop_monitoring_services
    
    # Wait a moment for complete shutdown
    sleep 3
    
    # Start services again
    start_monitoring_services
    
    # Verify health after restart
    verify_services_health
    
    log_success "Monitoring services restarted successfully"
}

# Function: print_success
# Purpose: Display monitoring setup completion summary and next steps
# Returns: void (prints summary to stdout)
print_success() {
    print_monitoring_separator
    log_success "Monitoring setup completed successfully!"
    print_monitoring_separator
    
    echo ""
    echo -e "${WHITE}MONITORING SETUP SUMMARY:${NC}"
    echo -e "  ${GREEN}✓${NC} Monitoring configuration files validated"
    echo -e "  ${GREEN}✓${NC} Docker Compose services orchestrated"
    echo -e "  ${GREEN}✓${NC} Prometheus metrics collection configured"
    echo -e "  ${GREEN}✓${NC} Grafana visualization platform ready"
    
    if [[ "$SKIP_BACKEND" == "false" ]]; then
        echo -e "  ${GREEN}✓${NC} Backend application integrated with monitoring"
    else
        echo -e "  ${YELLOW}~${NC} Backend service skipped as requested"
    fi
    
    echo -e "  ${GREEN}✓${NC} Service health checks completed"
    
    echo ""
    echo -e "${WHITE}MONITORING SERVICES ACCESS:${NC}"
    echo ""
    echo -e "  ${CYAN}🔍 Prometheus (Metrics Collection):${NC}"
    echo -e "     URL: http://localhost:$PROMETHEUS_PORT"
    echo -e "     Targets: http://localhost:$PROMETHEUS_PORT/targets"
    echo -e "     Configuration: http://localhost:$PROMETHEUS_PORT/config"
    echo ""
    echo -e "  ${CYAN}📊 Grafana (Visualization Dashboard):${NC}"
    echo -e "     URL: http://localhost:$GRAFANA_PORT"
    echo -e "     Login: $GRAFANA_DEFAULT_USER / $GRAFANA_DEFAULT_PASS"
    echo -e "     Dashboard: http://localhost:$GRAFANA_PORT/d/nodejs-tutorial-backend/nodejs-tutorial-backend-monitoring"
    echo ""
    
    if [[ "$SKIP_BACKEND" == "false" ]]; then
        echo -e "  ${CYAN}🚀 Backend Application:${NC}"
        echo -e "     URL: http://localhost:$BACKEND_PORT/hello"
        echo -e "     Health: http://localhost:$BACKEND_PORT/health"
        echo -e "     Metrics: http://localhost:$BACKEND_PORT/metrics"
        echo ""
    fi
    
    echo -e "${WHITE}MONITORING OPERATIONS:${NC}"
    echo ""
    echo -e "  ${CYAN}View real-time logs:${NC}"
    echo -e "     docker-compose -f $DOCKER_COMPOSE_FILE logs -f"
    echo ""
    echo -e "  ${CYAN}Check service status:${NC}"
    echo -e "     docker-compose -f $DOCKER_COMPOSE_FILE ps"
    echo ""
    echo -e "  ${CYAN}Restart monitoring services:${NC}"
    echo -e "     ./monitoring-setup.sh --restart"
    echo ""
    echo -e "  ${CYAN}Stop monitoring services:${NC}"
    echo -e "     ./monitoring-setup.sh --stop"
    echo ""
    echo -e "  ${CYAN}Clean monitoring setup:${NC}"
    echo -e "     ./monitoring-setup.sh --clean"
    echo ""
    echo -e "${WHITE}GRAFANA DASHBOARD SETUP:${NC}"
    echo ""
    if [[ "$IMPORT_DASHBOARD" == "true" ]] || command -v jq &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} Dashboard import attempted automatically"
        echo -e "  ${CYAN}Direct link:${NC} http://localhost:$GRAFANA_PORT/d/nodejs-tutorial-backend/nodejs-tutorial-backend-monitoring"
    else
        echo -e "  ${YELLOW}!${NC} Manual dashboard import required"
        echo -e "  ${CYAN}Import file:${NC} $GRAFANA_DASHBOARD"
    fi
    echo ""
    echo -e "${WHITE}EDUCATIONAL RESOURCES:${NC}"
    echo -e "  • Monitoring README: ${CYAN}infrastructure/monitoring/README.md${NC}"
    echo -e "  • Prometheus config: ${CYAN}$PROMETHEUS_CONFIG${NC}"
    echo -e "  • Grafana dashboard: ${CYAN}$GRAFANA_DASHBOARD${NC}"
    echo -e "  • Docker Compose: ${CYAN}$DOCKER_COMPOSE_FILE${NC}"
    echo ""
    echo -e "${WHITE}TROUBLESHOOTING:${NC}"
    echo -e "  • Re-run with verbose output: ${CYAN}./monitoring-setup.sh --verbose${NC}"
    echo -e "  • Check service logs: ${CYAN}docker-compose logs [service-name]${NC}"
    echo -e "  • Restart services: ${CYAN}./monitoring-setup.sh --restart${NC}"
    echo -e "  • Clean and rebuild: ${CYAN}./monitoring-setup.sh --clean${NC}"
    echo ""
    print_monitoring_separator
    echo -e "${GREEN}Happy monitoring with Prometheus and Grafana! 📈${NC}"
    print_monitoring_separator
}

# -----------------------------------------------------------------------------
# MAIN EXECUTION FLOW
# -----------------------------------------------------------------------------

# Function: main
# Purpose: Main execution flow orchestrating all monitoring setup steps
# Parameters: All command-line arguments ($@)
# Returns: void (exits with appropriate status code)
main() {
    # Display script header
    print_monitoring_separator
    echo -e "${WHITE}NODE.JS TUTORIAL BACKEND - MONITORING SETUP${NC}"
    echo -e "${CYAN}Automating Prometheus and Grafana monitoring infrastructure for observability${NC}"
    print_monitoring_separator
    echo ""
    
    # Parse command-line arguments
    parse_arguments "$@"
    
    # Handle special operation modes first
    if [[ "$STOP_SERVICES" == "true" ]]; then
        stop_monitoring_services
        log_success "Monitoring services stopped as requested"
        exit 0
    fi
    
    if [[ "$CLEAN_SETUP" == "true" ]]; then
        clean_monitoring_services
        echo ""
    fi
    
    if [[ "$RESTART_SERVICES" == "true" ]]; then
        restart_monitoring_services
        echo ""
        print_success
        exit 0
    fi
    
    # Execute monitoring setup steps in logical order
    log_info "Starting monitoring infrastructure setup process..."
    echo ""
    
    # Step 1: Validate monitoring configuration files
    validate_monitoring_configs
    echo ""
    
    # Step 2: Check Docker tools availability (required for monitoring)
    check_docker_tools
    echo ""
    
    # Step 3: Start monitoring services with Docker Compose
    start_monitoring_services
    echo ""
    
    # Step 4: Verify service health and availability
    verify_services_health
    echo ""
    
    # Step 5: Import Grafana dashboard (optional automation)
    import_grafana_dashboard
    echo ""
    
    # Step 6: Display success summary and access information
    print_success
}

# -----------------------------------------------------------------------------
# SCRIPT EXECUTION ENTRY POINT
# -----------------------------------------------------------------------------

# Only execute main function if script is run directly (not sourced)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    # Trap signals for graceful cleanup
    trap 'log_error "Monitoring setup interrupted by user"; exit 130' INT TERM
    
    # Execute main function with all provided arguments
    main "$@"
    
    # Exit with success status
    exit 0
fi

# -----------------------------------------------------------------------------
# EXPORTED FUNCTIONS FOR EXTERNAL USE
# -----------------------------------------------------------------------------

# Export functions for use in other scripts when this file is sourced
# This allows other infrastructure scripts to leverage monitoring setup utilities

# shellcheck disable=SC2034
{
    # Mark functions as available for export
    export -f print_usage
    export -f parse_arguments
    export -f validate_monitoring_configs
    export -f start_monitoring_services
    export -f import_grafana_dashboard
    export -f print_success
    export -f check_service_health
    export -f wait_for_service
    export -f clean_monitoring_services
    export -f stop_monitoring_services
    export -f restart_monitoring_services
}

# Export global constants for use in other scripts
export MONITORING_SCRIPT_DIR
export MONITORING_CONFIG_DIR
export DOCKER_COMPOSE_FILE
export PROMETHEUS_CONFIG
export GRAFANA_DASHBOARD

# =============================================================================
# END OF MONITORING SETUP SCRIPT
# =============================================================================