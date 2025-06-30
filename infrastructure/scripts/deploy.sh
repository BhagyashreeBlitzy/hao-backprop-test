#!/usr/bin/env bash

# =============================================================================
# NODE.JS TUTORIAL BACKEND - DEPLOYMENT AUTOMATION SCRIPT
# =============================================================================
# 
# This script orchestrates the end-to-end deployment process for the Node.js
# tutorial backend application, including environment setup, Docker image build,
# container orchestration, and optional monitoring stack provisioning. It is
# designed for educational clarity, reproducibility, and ease of use in local,
# CI/CD, or containerized environments.
#
# COMPATIBILITY:
# - Bash >=5.0
# - Node.js >=18.0.0 (recommended: v22.x LTS)
# - npm >=9.0.0
# - Docker >=20.10
# - Docker Compose >=1.29
#
# USAGE:
#   ./deploy.sh [OPTIONS]
#
# OPTIONS:
#   --help          Display this help message
#   --docker        Build and deploy using Docker and Docker Compose
#   --monitoring    Provision and validate monitoring stack (Prometheus, Grafana)
#   --teardown      Stop and remove all containers
#   --rebuild       Force rebuild of Docker image
#   --skip-setup    Skip environment setup and validation
#   --verbose       Enable verbose output
#
# EDUCATIONAL PURPOSE:
# This script demonstrates best practices for deployment automation in Node.js/Express
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
readonly DEPLOY_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Define project structure paths relative to script location
readonly PROJECT_ROOT="$(cd "$DEPLOY_SCRIPT_DIR/../.." && pwd)"
readonly BACKEND_DIR="$PROJECT_ROOT/src/backend"
readonly DOCKER_COMPOSE_FILE="$DEPLOY_SCRIPT_DIR/../docker/docker-compose.yml"
readonly DOCKERFILE="$DEPLOY_SCRIPT_DIR/../docker/Dockerfile"
readonly MONITORING_SETUP_SCRIPT="$DEPLOY_SCRIPT_DIR/monitoring-setup.sh"
readonly SETUP_SCRIPT="$DEPLOY_SCRIPT_DIR/setup.sh"

# Docker configuration
readonly DOCKER_IMAGE_NAME="nodejs-tutorial-backend"
readonly DOCKER_IMAGE_TAG="${DOCKER_TAG:-latest}"
readonly DOCKER_REGISTRY="${DOCKER_REGISTRY:-}"

# Service configuration
readonly BACKEND_PORT="${PORT:-3000}"
readonly PROMETHEUS_PORT="${PROMETHEUS_PORT:-9090}"
readonly GRAFANA_PORT="${GRAFANA_PORT:-3001}"

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
DEPLOY_MODE="local"
USE_DOCKER=false
PROVISION_MONITORING=false
TEARDOWN_DEPLOYMENT=false
REBUILD_IMAGE=false
SKIP_SETUP=false
VERBOSE_MODE=false

# -----------------------------------------------------------------------------
# SOURCE SHARED SETUP LOGIC
# -----------------------------------------------------------------------------

# Source the shared setup script for common functions and utilities
if [[ -f "$SETUP_SCRIPT" ]]; then
    # shellcheck source=./setup.sh
    source "$SETUP_SCRIPT"
    log_verbose "Successfully sourced shared setup functions from setup.sh"
else
    echo "[ERROR] Cannot find setup.sh in $DEPLOY_SCRIPT_DIR"
    echo "[INFO] Please ensure you are running this script from the correct directory"
    exit 1
fi

# -----------------------------------------------------------------------------
# DEPLOYMENT-SPECIFIC UTILITY FUNCTIONS
# -----------------------------------------------------------------------------

# Function: print_deployment_separator
# Purpose: Print a visual separator for deployment output organization
print_deployment_separator() {
    echo -e "${CYAN}===============================================================================${NC}"
}

# Function: check_deployment_prerequisites
# Purpose: Verify all required tools and configurations are available
# Returns: void (exits with error if prerequisites not met)
check_deployment_prerequisites() {
    log_info "Checking deployment prerequisites..."
    
    # Check if project structure is valid
    if [[ ! -d "$BACKEND_DIR" ]]; then
        log_error "Backend directory not found: $BACKEND_DIR"
        log_info "Please ensure you are running this script from the project root"
        exit 1
    fi
    
    # Check if Docker Compose file exists
    if [[ "$USE_DOCKER" == "true" ]] && [[ ! -f "$DOCKER_COMPOSE_FILE" ]]; then
        log_error "Docker Compose file not found: $DOCKER_COMPOSE_FILE"
        log_info "Docker deployment requires a valid docker-compose.yml file"
        exit 1
    fi
    
    # Check if Dockerfile exists
    if [[ "$USE_DOCKER" == "true" ]] && [[ ! -f "$DOCKERFILE" ]]; then
        log_error "Dockerfile not found: $DOCKERFILE"
        log_info "Docker deployment requires a valid Dockerfile"
        exit 1
    fi
    
    # Verify monitoring setup script exists if monitoring is requested
    if [[ "$PROVISION_MONITORING" == "true" ]] && [[ ! -f "$MONITORING_SETUP_SCRIPT" ]]; then
        log_error "Monitoring setup script not found: $MONITORING_SETUP_SCRIPT"
        log_info "Monitoring deployment requires the monitoring-setup.sh script"
        exit 1
    fi
    
    log_success "Deployment prerequisites validation completed"
}

# Function: wait_for_service_ready
# Purpose: Wait for a service to be ready and responding
# Parameters: $1 - Service URL, $2 - Service name, $3 - timeout (optional)
wait_for_service_ready() {
    local service_url="$1"
    local service_name="$2"
    local timeout="${3:-60}"
    local max_attempts=$((timeout / 5))
    local attempt=1
    
    log_info "Waiting for $service_name to be ready at $service_url..."
    
    while [[ $attempt -le $max_attempts ]]; do
        if curl -s --max-time 5 "$service_url" > /dev/null 2>&1; then
            log_success "$service_name is ready and responding"
            return 0
        fi
        
        if [[ $attempt -eq $max_attempts ]]; then
            log_warning "$service_name is not responding after $timeout seconds"
            log_info "Service may still be starting up. Check logs for details."
            return 1
        fi
        
        log_verbose "Attempt $attempt/$max_attempts: Waiting for $service_name..."
        sleep 5
        ((attempt++))
    done
}

# -----------------------------------------------------------------------------
# DEPLOYMENT FUNCTIONS
# -----------------------------------------------------------------------------

# Function: print_usage
# Purpose: Display comprehensive usage instructions and available options
# Returns: void (prints to stdout)
print_usage() {
    cat << 'EOF'
===============================================================================
NODE.JS TUTORIAL BACKEND - DEPLOYMENT AUTOMATION SCRIPT
===============================================================================

DESCRIPTION:
    Orchestrates the end-to-end deployment process for the Node.js tutorial
    backend application, including environment setup, Docker image build,
    container orchestration, and optional monitoring stack provisioning.

USAGE:
    ./deploy.sh [OPTIONS]

OPTIONS:
    --help              Display this help message and exit
    --docker            Build and deploy using Docker and Docker Compose
    --monitoring        Provision and validate monitoring stack (Prometheus, Grafana)
    --teardown          Stop and remove all containers
    --rebuild           Force rebuild of Docker image
    --skip-setup        Skip environment setup and validation
    --verbose           Enable verbose output for debugging

DEPLOYMENT MODES:
    Local Development:  ./deploy.sh
    Docker Deployment:  ./deploy.sh --docker
    Full Monitoring:    ./deploy.sh --docker --monitoring
    Teardown:          ./deploy.sh --teardown

REQUIREMENTS:
    - Bash >=5.0
    - Node.js >=18.0.0 (recommended: v22.x LTS)
    - npm >=9.0.0 (bundled with Node.js)
    - Docker >=20.10 (for --docker mode)
    - Docker Compose >=1.29 (for --docker mode)

EXAMPLES:
    # Local development deployment
    ./deploy.sh

    # Docker deployment with monitoring
    ./deploy.sh --docker --monitoring

    # Rebuild and deploy
    ./deploy.sh --docker --rebuild

    # Teardown deployment
    ./deploy.sh --teardown

    # Verbose deployment
    ./deploy.sh --docker --verbose

EDUCATIONAL NOTES:
    This script demonstrates deployment automation best practices:
    - Environment validation and dependency management
    - Docker image building and container orchestration
    - Service health checking and monitoring integration
    - Error handling and rollback procedures
    - Logging and documentation for troubleshooting

ACCESS POINTS:
    - Backend API: http://localhost:3000/hello
    - Health Check: http://localhost:3000/health
    - Prometheus: http://localhost:9090 (with --monitoring)
    - Grafana: http://localhost:3001 (with --monitoring, admin/admin)

For more information, see: src/backend/README.md and infrastructure/README.md

===============================================================================
EOF
}

# Function: parse_arguments
# Purpose: Parse command-line arguments and set corresponding flags
# Parameters: All command-line arguments passed to script ($@)
# Returns: void (sets global flag variables)
parse_arguments() {
    log_verbose "Parsing deployment arguments: $*"
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --help|-h)
                print_usage
                exit 0
                ;;
            --docker)
                USE_DOCKER=true
                DEPLOY_MODE="docker"
                log_verbose "Docker deployment mode enabled"
                shift
                ;;
            --monitoring)
                PROVISION_MONITORING=true
                log_verbose "Monitoring stack provisioning enabled"
                shift
                ;;
            --teardown)
                TEARDOWN_DEPLOYMENT=true
                log_verbose "Teardown mode enabled"
                shift
                ;;
            --rebuild)
                REBUILD_IMAGE=true
                log_verbose "Image rebuild forced"
                shift
                ;;
            --skip-setup)
                SKIP_SETUP=true
                log_verbose "Setup validation will be skipped"
                shift
                ;;
            --verbose|-v)
                VERBOSE_MODE=true
                log_verbose "Verbose mode enabled for deployment"
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                log_info "Use --help for usage information"
                exit 1
                ;;
        esac
    done
    
    # Validate argument combinations
    if [[ "$PROVISION_MONITORING" == "true" ]] && [[ "$USE_DOCKER" == "false" ]]; then
        log_warning "Monitoring stack requires Docker deployment"
        log_info "Enabling Docker mode automatically"
        USE_DOCKER=true
        DEPLOY_MODE="docker"
    fi
}

# Function: run_setup
# Purpose: Run environment and dependency setup to ensure prerequisites are met
# Returns: void (ensures environment is ready for deployment)
run_setup() {
    if [[ "$SKIP_SETUP" == "true" ]]; then
        log_info "Skipping setup validation (--skip-setup)"
        return 0
    fi
    
    log_info "Running environment and dependency setup..."
    
    # Change to project root for setup operations
    cd "$PROJECT_ROOT" || {
        log_error "Failed to change to project root: $PROJECT_ROOT"
        exit 1
    }
    
    # Run setup script with appropriate flags
    local setup_args=""
    if [[ "$VERBOSE_MODE" == "true" ]]; then
        setup_args="--verbose"
    fi
    
    if [[ "$USE_DOCKER" == "false" ]]; then
        setup_args="$setup_args --skip-docker"
    fi
    
    # Execute setup script
    if [[ -x "$SETUP_SCRIPT" ]]; then
        log_verbose "Executing setup script with args: $setup_args"
        "$SETUP_SCRIPT" $setup_args
    else
        # Fallback to sourcing if not executable
        log_verbose "Sourcing setup script functions"
        # shellcheck source=./setup.sh
        source "$SETUP_SCRIPT"
        
        # Run individual setup functions
        validate_project_structure
        check_node_npm_versions
        if [[ "$USE_DOCKER" == "true" ]]; then
            check_docker_tools
        fi
        install_node_dependencies
        validate_env_file
        run_basic_health_checks
    fi
    
    log_success "Environment setup completed successfully"
}

# Function: build_docker_image
# Purpose: Build the Docker image for the backend application using the canonical Dockerfile
# Returns: void (builds the backend container image or exits on failure)
build_docker_image() {
    if [[ "$USE_DOCKER" == "false" ]]; then
        log_verbose "Skipping Docker image build (not in Docker mode)"
        return 0
    fi
    
    log_info "Building Docker image for backend application..."
    
    # Change to project root for Docker build context
    cd "$PROJECT_ROOT" || {
        log_error "Failed to change to project root for Docker build"
        exit 1
    }
    
    # Prepare Docker build arguments
    local build_args=(
        "-t" "${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
        "-f" "$DOCKERFILE"
    )
    
    # Add build context (project root)
    build_args+=(".")
    
    # Add no-cache flag if rebuild is requested
    if [[ "$REBUILD_IMAGE" == "true" ]]; then
        build_args=("--no-cache" "${build_args[@]}")
        log_info "Forcing image rebuild (--rebuild)"
    fi
    
    # Add verbose output if requested
    if [[ "$VERBOSE_MODE" == "true" ]]; then
        build_args=("--progress=plain" "${build_args[@]}")
    fi
    
    log_info "Docker build command: docker build ${build_args[*]}"
    
    # Execute Docker build
    if docker build "${build_args[@]}"; then
        log_success "Docker image built successfully: ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
        
        # Display image information in verbose mode
        if [[ "$VERBOSE_MODE" == "true" ]]; then
            log_verbose "Image details:"
            docker images "${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
            
            # Show image layers
            log_verbose "Image history:"
            docker history "${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}" --no-trunc || true
        fi
    else
        log_error "Docker image build failed"
        log_info "Troubleshooting tips:"
        log_info "  - Check Dockerfile syntax and build context"
        log_info "  - Ensure all required files are present in build context"
        log_info "  - Check Docker daemon status: docker info"
        log_info "  - Review build logs for specific error details"
        exit 1
    fi
}

# Function: deploy_with_docker_compose
# Purpose: Deploy the backend service (and optionally monitoring stack) using Docker Compose
# Returns: void (starts the backend and monitoring containers or exits on failure)
deploy_with_docker_compose() {
    if [[ "$USE_DOCKER" == "false" ]]; then
        log_verbose "Skipping Docker Compose deployment (not in Docker mode)"
        return 0
    fi
    
    log_info "Deploying services with Docker Compose..."
    
    # Change to Docker Compose directory
    cd "$(dirname "$DOCKER_COMPOSE_FILE")" || {
        log_error "Failed to change to Docker Compose directory"
        exit 1
    }
    
    # Determine services to deploy
    local services_to_deploy=("backend")
    
    if [[ "$PROVISION_MONITORING" == "true" ]]; then
        services_to_deploy+=("prometheus" "grafana")
        log_info "Including monitoring stack in deployment"
    fi
    
    log_info "Services to deploy: ${services_to_deploy[*]}"
    
    # Prepare Docker Compose command arguments
    local compose_args=("-f" "$DOCKER_COMPOSE_FILE" "up" "-d")
    
    # Add services to the command
    compose_args+=("${services_to_deploy[@]}")
    
    # Execute Docker Compose deployment
    log_info "Docker Compose command: docker-compose ${compose_args[*]}"
    
    if [[ "$VERBOSE_MODE" == "true" ]]; then
        docker-compose "${compose_args[@]}"
    else
        docker-compose "${compose_args[@]}" > /dev/null 2>&1
    fi
    
    log_success "Docker Compose deployment initiated"
    
    # Wait for services to be ready
    log_info "Waiting for services to start and become healthy..."
    
    # Wait for backend service
    if wait_for_service_ready "http://localhost:$BACKEND_PORT/health" "Backend Application" 60; then
        log_success "Backend service is running and healthy"
    else
        log_warning "Backend service health check failed"
        log_info "Check service logs: docker-compose -f $DOCKER_COMPOSE_FILE logs backend"
    fi
    
    # Wait for monitoring services if enabled
    if [[ "$PROVISION_MONITORING" == "true" ]]; then
        if wait_for_service_ready "http://localhost:$PROMETHEUS_PORT/-/healthy" "Prometheus" 60; then
            log_success "Prometheus is running and healthy"
        else
            log_warning "Prometheus health check failed"
        fi
        
        if wait_for_service_ready "http://localhost:$GRAFANA_PORT/api/health" "Grafana" 60; then
            log_success "Grafana is running and healthy"
        else
            log_warning "Grafana health check failed"
        fi
    fi
    
    # Display service status
    log_info "Current service status:"
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps --format table
    
    log_success "Docker Compose deployment completed"
}

# Function: deploy_local_development
# Purpose: Deploy application locally for development (non-Docker mode)
# Returns: void (starts the application locally or exits on failure)
deploy_local_development() {
    if [[ "$USE_DOCKER" == "true" ]]; then
        log_verbose "Skipping local deployment (Docker mode enabled)"
        return 0
    fi
    
    log_info "Starting local development deployment..."
    
    # Change to backend directory
    cd "$BACKEND_DIR" || {
        log_error "Failed to change to backend directory: $BACKEND_DIR"
        exit 1
    }
    
    # Check if server is already running on the port
    if lsof -Pi :$BACKEND_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_warning "Port $BACKEND_PORT is already in use"
        log_info "Another instance may be running. Use 'pkill -f server.js' to stop it"
        log_info "Or use a different port: PORT=3001 ./deploy.sh"
        
        # Ask user if they want to continue
        if [[ -t 0 ]]; then  # Check if running interactively
            echo -n "Continue anyway? (y/N): "
            read -r response
            if [[ ! "$response" =~ ^[Yy]$ ]]; then
                log_info "Deployment cancelled by user"
                exit 1
            fi
        else
            log_error "Port conflict detected in non-interactive mode"
            exit 1
        fi
    fi
    
    # Start the application
    log_info "Starting Node.js application..."
    log_info "Command: npm start"
    log_info "Application will be available at: http://localhost:$BACKEND_PORT/hello"
    log_info "Health check endpoint: http://localhost:$BACKEND_PORT/health"
    log_info ""
    log_info "Press Ctrl+C to stop the application"
    
    # Execute npm start
    npm start
}

# Function: provision_monitoring_stack
# Purpose: Provision and validate the monitoring stack (Prometheus, Grafana)
# Returns: void (starts monitoring services or exits on failure)
provision_monitoring_stack() {
    if [[ "$PROVISION_MONITORING" == "false" ]]; then
        log_verbose "Skipping monitoring stack provisioning"
        return 0
    fi
    
    log_info "Provisioning monitoring stack..."
    
    # Execute monitoring setup script
    local monitoring_args=""
    if [[ "$VERBOSE_MODE" == "true" ]]; then
        monitoring_args="--verbose"
    fi
    
    if [[ -x "$MONITORING_SETUP_SCRIPT" ]]; then
        log_verbose "Executing monitoring setup script with args: $monitoring_args"
        "$MONITORING_SETUP_SCRIPT" $monitoring_args
    else
        # Fallback to sourcing if not executable
        log_verbose "Sourcing monitoring setup script functions"
        # shellcheck source=./monitoring-setup.sh
        source "$MONITORING_SETUP_SCRIPT"
        
        # Run monitoring setup functions
        validate_monitoring_configs
        start_monitoring_services
        verify_services_health
        import_grafana_dashboard
    fi
    
    log_success "Monitoring stack provisioning completed"
}

# Function: teardown_deployment
# Purpose: Stop and remove all containers and clean up resources
# Returns: void (stops and removes backend and monitoring containers)
teardown_deployment() {
    log_info "Tearing down deployment infrastructure..."
    
    # Change to Docker Compose directory
    cd "$(dirname "$DOCKER_COMPOSE_FILE")" || {
        log_error "Failed to change to Docker Compose directory"
        exit 1
    }
    
    # Stop and remove all services
    log_info "Stopping and removing all containers..."
    
    if [[ "$VERBOSE_MODE" == "true" ]]; then
        docker-compose -f "$DOCKER_COMPOSE_FILE" down --volumes --remove-orphans
    else
        docker-compose -f "$DOCKER_COMPOSE_FILE" down --volumes --remove-orphans > /dev/null 2>&1
    fi
    
    # Optional: Remove built images
    if [[ "$REBUILD_IMAGE" == "true" ]]; then
        log_info "Removing built Docker images..."
        if docker images "${DOCKER_IMAGE_NAME}" -q | grep -q .; then
            docker rmi $(docker images "${DOCKER_IMAGE_NAME}" -q) > /dev/null 2>&1 || true
            log_success "Docker images removed"
        fi
    fi
    
    # Clean up any dangling images and volumes
    log_verbose "Cleaning up dangling Docker resources..."
    docker system prune -f > /dev/null 2>&1 || true
    
    log_success "Deployment teardown completed"
    
    # Provide restart instructions
    log_info "To restart the deployment:"
    log_info "  ./deploy.sh --docker --monitoring"
}

# Function: print_success
# Purpose: Print deployment completion summary and next steps
# Returns: void (prints deployment summary to stdout)
print_success() {
    print_deployment_separator
    log_success "Deployment completed successfully!"
    print_deployment_separator
    
    echo ""
    echo -e "${WHITE}DEPLOYMENT SUMMARY:${NC}"
    
    if [[ "$SKIP_SETUP" == "false" ]]; then
        echo -e "  ${GREEN}✓${NC} Environment setup and validation completed"
    else
        echo -e "  ${YELLOW}~${NC} Environment setup skipped as requested"
    fi
    
    if [[ "$USE_DOCKER" == "true" ]]; then
        echo -e "  ${GREEN}✓${NC} Docker image built successfully"
        echo -e "  ${GREEN}✓${NC} Docker Compose services deployed"
        echo -e "  ${GREEN}✓${NC} Container health checks validated"
    else
        echo -e "  ${GREEN}✓${NC} Local development environment prepared"
    fi
    
    if [[ "$PROVISION_MONITORING" == "true" ]]; then
        echo -e "  ${GREEN}✓${NC} Monitoring stack provisioned and validated"
    fi
    
    echo ""
    echo -e "${WHITE}ACCESS POINTS:${NC}"
    echo ""
    echo -e "  ${CYAN}🚀 Backend Application:${NC}"
    echo -e "     Hello Endpoint: http://localhost:$BACKEND_PORT/hello"
    echo -e "     Health Check:   http://localhost:$BACKEND_PORT/health"
    echo -e "     API Status:     curl http://localhost:$BACKEND_PORT/hello"
    echo ""
    
    if [[ "$PROVISION_MONITORING" == "true" ]]; then
        echo -e "  ${CYAN}📊 Monitoring Services:${NC}"
        echo -e "     Prometheus:     http://localhost:$PROMETHEUS_PORT"
        echo -e "     Grafana:        http://localhost:$GRAFANA_PORT (admin/admin)"
        echo -e "     Targets:        http://localhost:$PROMETHEUS_PORT/targets"
        echo ""
    fi
    
    echo -e "${WHITE}OPERATIONAL COMMANDS:${NC}"
    echo ""
    
    if [[ "$USE_DOCKER" == "true" ]]; then
        echo -e "  ${CYAN}View service logs:${NC}"
        echo -e "     docker-compose -f $DOCKER_COMPOSE_FILE logs -f"
        echo ""
        echo -e "  ${CYAN}Check service status:${NC}"
        echo -e "     docker-compose -f $DOCKER_COMPOSE_FILE ps"
        echo ""
        echo -e "  ${CYAN}Execute commands in containers:${NC}"
        echo -e "     docker-compose -f $DOCKER_COMPOSE_FILE exec backend bash"
        echo ""
        echo -e "  ${CYAN}Restart services:${NC}"
        echo -e "     docker-compose -f $DOCKER_COMPOSE_FILE restart"
        echo ""
        echo -e "  ${CYAN}Scale backend service:${NC}"
        echo -e "     docker-compose -f $DOCKER_COMPOSE_FILE up -d --scale backend=3"
        echo ""
    else
        echo -e "  ${CYAN}Development commands:${NC}"
        echo -e "     cd src/backend && npm run dev    ${YELLOW}# Auto-restart on changes${NC}"
        echo -e "     cd src/backend && npm test       ${YELLOW}# Run test suite${NC}"
        echo -e "     cd src/backend && npm run lint   ${YELLOW}# Code quality check${NC}"
        echo ""
    fi
    
    echo -e "  ${CYAN}Teardown deployment:${NC}"
    echo -e "     ./deploy.sh --teardown"
    echo ""
    echo -e "  ${CYAN}Rebuild and redeploy:${NC}"
    echo -e "     ./deploy.sh --docker --rebuild"
    echo ""
    
    echo -e "${WHITE}TESTING AND VALIDATION:${NC}"
    echo ""
    echo -e "  ${CYAN}Test the hello endpoint:${NC}"
    echo -e "     curl http://localhost:$BACKEND_PORT/hello"
    echo -e "     Expected response: Hello world"
    echo ""
    echo -e "  ${CYAN}Check application health:${NC}"
    echo -e "     curl http://localhost:$BACKEND_PORT/health"
    echo ""
    echo -e "  ${CYAN}Load testing (optional):${NC}"
    echo -e "     ab -n 100 -c 10 http://localhost:$BACKEND_PORT/hello"
    echo ""
    
    echo -e "${WHITE}DOCUMENTATION AND RESOURCES:${NC}"
    echo -e "  • Backend README:    ${CYAN}src/backend/README.md${NC}"
    echo -e "  • API Documentation: ${CYAN}http://localhost:$BACKEND_PORT/docs${NC} (when running)"
    echo -e "  • Docker Guide:      ${CYAN}infrastructure/docker/README.md${NC}"
    
    if [[ "$PROVISION_MONITORING" == "true" ]]; then
        echo -e "  • Monitoring Guide:  ${CYAN}infrastructure/monitoring/README.md${NC}"
        echo -e "  • Grafana Dashboards: ${CYAN}infrastructure/monitoring/grafana-dashboard.json${NC}"
    fi
    
    echo ""
    echo -e "${WHITE}TROUBLESHOOTING:${NC}"
    echo -e "  • Re-run with verbose output:    ${CYAN}./deploy.sh --verbose${NC}"
    echo -e "  • Force rebuild:                 ${CYAN}./deploy.sh --docker --rebuild${NC}"
    echo -e "  • Check service logs:            ${CYAN}docker-compose logs [service]${NC}"
    echo -e "  • Reset environment:             ${CYAN}./deploy.sh --teardown && ./deploy.sh --docker${NC}"
    echo ""
    print_deployment_separator
    echo -e "${GREEN}Happy developing with Node.js and Express! 🎉${NC}"
    print_deployment_separator
}

# -----------------------------------------------------------------------------
# MAIN EXECUTION FLOW
# -----------------------------------------------------------------------------

# Function: main
# Purpose: Main execution flow orchestrating all deployment steps
# Parameters: All command-line arguments ($@)
# Returns: void (exits with appropriate status code)
main() {
    # Display script header
    print_deployment_separator
    echo -e "${WHITE}NODE.JS TUTORIAL BACKEND - DEPLOYMENT AUTOMATION${NC}"
    echo -e "${CYAN}Orchestrating end-to-end deployment with environment setup, containerization, and monitoring${NC}"
    print_deployment_separator
    echo ""
    
    # Parse command-line arguments
    parse_arguments "$@"
    
    # Handle teardown mode first
    if [[ "$TEARDOWN_DEPLOYMENT" == "true" ]]; then
        teardown_deployment
        log_success "Teardown completed successfully"
        exit 0
    fi
    
    # Execute deployment steps in logical order
    log_info "Starting deployment process in $DEPLOY_MODE mode..."
    echo ""
    
    # Step 1: Check deployment prerequisites
    check_deployment_prerequisites
    echo ""
    
    # Step 2: Run environment setup and validation
    run_setup
    echo ""
    
    # Step 3: Build Docker image (if using Docker)
    build_docker_image
    echo ""
    
    # Step 4: Deploy services based on mode
    if [[ "$USE_DOCKER" == "true" ]]; then
        # Docker deployment path
        deploy_with_docker_compose
        echo ""
        
        # Provision monitoring stack if requested
        if [[ "$PROVISION_MONITORING" == "true" ]]; then
            provision_monitoring_stack
            echo ""
        fi
    else
        # Local development deployment path
        deploy_local_development
        # Note: This function runs the server and blocks, so success message
        # will only be shown if the server is stopped gracefully
        echo ""
    fi
    
    # Step 5: Display deployment success summary
    print_success
}

# -----------------------------------------------------------------------------
# SCRIPT EXECUTION ENTRY POINT
# -----------------------------------------------------------------------------

# Only execute main function if script is run directly (not sourced)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    # Trap signals for graceful cleanup
    trap 'log_error "Deployment interrupted by user"; exit 130' INT TERM
    
    # Execute main function with all provided arguments
    main "$@"
    
    # Exit with success status
    exit 0
fi

# -----------------------------------------------------------------------------
# EXPORTED FUNCTIONS FOR EXTERNAL USE
# -----------------------------------------------------------------------------

# Export functions for use in other scripts when this file is sourced
# This allows other infrastructure scripts to leverage deployment utilities

# shellcheck disable=SC2034
{
    # Mark functions as available for export
    export -f print_usage
    export -f parse_arguments
    export -f run_setup
    export -f build_docker_image
    export -f deploy_with_docker_compose
    export -f teardown_deployment
    export -f print_success
    export -f check_deployment_prerequisites
    export -f wait_for_service_ready
    export -f deploy_local_development
    export -f provision_monitoring_stack
}

# Export global constants for use in other scripts
export DEPLOY_SCRIPT_DIR
export BACKEND_DIR
export DOCKER_COMPOSE_FILE
export DOCKERFILE
export MONITORING_SETUP_SCRIPT
export SETUP_SCRIPT

# =============================================================================
# END OF DEPLOYMENT SCRIPT
# =============================================================================