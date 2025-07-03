#!/bin/bash

# =============================================================================
# Node.js Tutorial Infrastructure Backup Script
# =============================================================================
# 
# Comprehensive backup solution for Node.js/Express.js tutorial stack
# supporting disaster recovery, safe rollback, and reproducible deployments.
# 
# Version: 1.0.0
# Compatibility: Bash 4.0+, Docker 20+, Docker Compose 1.29+/Compose V2
# 
# FEATURES:
# - Automated backup of Docker volumes (Prometheus, Grafana persistent data)
# - Configuration file backup (docker-compose.yml, nginx.conf, monitoring)
# - Backend environment and dependency manifest backup (.env.example, package.json)
# - Timestamped archives with compression for efficient storage
# - Comprehensive error handling with detailed logging to stdout/stderr
# - Support for local, CI/CD, and educational environments
# - Configurable retention policies for automated cleanup
# - Dry-run mode for testing and validation
# - Extensible architecture for future enhancements
# 
# REQUIREMENTS ADDRESSED:
# - Disaster Recovery Procedures (Technical Specifications/5.4.6)
# - Environment Configuration (Technical Specifications/8.2.5)  
# - Monitoring and Observability (Technical Specifications/6.5)
# - Error Management & Logging (Technical Specifications/1.3.1, 6.5)
# 
# USAGE:
#   ./backup.sh                    # Standard backup with default settings
#   ./backup.sh --help             # Display usage information
#   ./backup.sh --dry-run          # Test mode without actual backup operations
#   ./backup.sh --retention 14     # Set retention period to 14 days
# 
# DEPENDENCIES:
#   - docker (20+): Docker volume export and container management
#   - docker-compose (1.29+/V2): Service volume identification
#   - tar (coreutils 8+): Archive creation and compression
#   - gzip (coreutils 8+): Backup compression
#   - date (coreutils 8+): Timestamp generation
#   - Standard POSIX utilities: echo, mkdir, cp, rm, find
# 
# ENVIRONMENT VARIABLES:
#   BACKUP_ROOT: Override default backup directory (default: infrastructure/backups)
#   BACKUP_RETENTION_DAYS: Override retention period (default: 7)
#   DRY_RUN: Enable dry-run mode (set to "true")
#   LOG_LEVEL: Control logging verbosity (INFO, WARN, ERROR)
# 
# EXIT CODES:
#   0: Successful backup completion
#   1: General error (invalid arguments, missing dependencies)
#   2: Docker/Docker Compose not available
#   3: Backup directory creation failure
#   4: Docker volume backup failure
#   5: Configuration file backup failure
#   6: Archive creation failure
#   7: Cleanup operation failure
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

# Backup configuration with environment variable support
readonly BACKUP_ROOT="${BACKUP_ROOT:-${PROJECT_ROOT}/infrastructure/backups}"
readonly DEFAULT_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-7}"
readonly TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
readonly BACKUP_DIR="${BACKUP_ROOT}/backup_${TIMESTAMP}"

# Docker volume names as defined in docker-compose.yml
readonly PROMETHEUS_VOLUME="infrastructure_prometheus_data"
readonly GRAFANA_VOLUME="infrastructure_grafana_data"

# Configuration file paths relative to project root
readonly CONFIG_FILES=(
    "infrastructure/docker-compose.yml"
    "infrastructure/nginx/nginx.conf"
    "infrastructure/monitoring/prometheus.yml"
    "infrastructure/monitoring/grafana-dashboard.json"
    "src/backend/.env.example"
    "src/backend/package.json"
)

# Script operation flags with defaults
DRY_RUN="${DRY_RUN:-false}"
RETENTION_DAYS="${DEFAULT_RETENTION_DAYS}"
LOG_LEVEL="${LOG_LEVEL:-INFO}"
VERBOSE=false

# Color codes for enhanced output formatting
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m' # No Color

# =============================================================================
# LOGGING AND OUTPUT FUNCTIONS
# =============================================================================

# Enhanced logging function with timestamp, level, and color support
# Supports multiple log levels: INFO, WARN, ERROR, DEBUG
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
        *)
            echo -e "${BLUE}[${level}]${NC} ${timestamp} - ${message}" >&1
            ;;
    esac
}

# Print usage instructions with comprehensive help information
print_usage() {
    cat << EOF
${SCRIPT_NAME} v${SCRIPT_VERSION} - Node.js Tutorial Infrastructure Backup

DESCRIPTION:
    Automated backup solution for Node.js/Express.js tutorial stack including
    Docker volumes (Prometheus, Grafana), configuration files, and backend
    environment files. Provides disaster recovery and reproducible deployments.

USAGE:
    ${SCRIPT_NAME} [OPTIONS]

OPTIONS:
    -h, --help              Display this help message and exit
    -d, --dry-run           Execute in dry-run mode (no actual backup operations)
    -r, --retention DAYS    Set backup retention period in days (default: ${DEFAULT_RETENTION_DAYS})
    -v, --verbose           Enable verbose output for debugging
    --log-level LEVEL       Set logging level: INFO, WARN, ERROR, DEBUG (default: INFO)

EXAMPLES:
    ${SCRIPT_NAME}                          # Standard backup with default settings
    ${SCRIPT_NAME} --dry-run                # Test backup process without execution
    ${SCRIPT_NAME} --retention 14           # Keep backups for 14 days
    ${SCRIPT_NAME} --verbose --log-level DEBUG  # Maximum verbosity for troubleshooting

ENVIRONMENT VARIABLES:
    BACKUP_ROOT             Override default backup directory
    BACKUP_RETENTION_DAYS   Override default retention period
    DRY_RUN                 Enable dry-run mode (set to "true")
    LOG_LEVEL               Control logging verbosity

BACKUP CONTENTS:
    Docker Volumes:
        - ${PROMETHEUS_VOLUME} (Prometheus time-series data)
        - ${GRAFANA_VOLUME} (Grafana dashboards and configuration)
    
    Configuration Files:
        - infrastructure/docker-compose.yml (Service orchestration)
        - infrastructure/nginx/nginx.conf (Reverse proxy configuration)
        - infrastructure/monitoring/prometheus.yml (Metrics collection)
        - infrastructure/monitoring/grafana-dashboard.json (Dashboard definitions)
        - src/backend/.env.example (Environment template)
        - src/backend/package.json (Dependency manifest)

BACKUP LOCATION:
    Default: ${BACKUP_ROOT}/backup_TIMESTAMP
    Archive: ${BACKUP_ROOT}/backup_TIMESTAMP.tar.gz

REQUIREMENTS:
    - Docker 20+ with docker-compose support
    - Standard POSIX utilities (tar, gzip, date, etc.)
    - Sufficient disk space for backup storage
    - Read access to Docker volumes and configuration files

EXIT CODES:
    0: Successful backup completion
    1: General error (invalid arguments, missing dependencies)
    2: Docker/Docker Compose not available
    3: Backup directory creation failure
    4: Docker volume backup failure
    5: Configuration file backup failure
    6: Archive creation failure
    7: Cleanup operation failure

For more information, visit the project documentation.
EOF
}

# =============================================================================
# ARGUMENT PARSING AND VALIDATION
# =============================================================================

# Comprehensive command-line argument parsing with validation
# Supports short and long options with proper error handling
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                print_usage
                exit 0
                ;;
            -d|--dry-run)
                DRY_RUN=true
                log "INFO" "Dry-run mode enabled - no actual backup operations will be performed"
                shift
                ;;
            -r|--retention)
                if [[ -n "${2:-}" ]] && [[ "${2}" =~ ^[0-9]+$ ]]; then
                    RETENTION_DAYS="${2}"
                    log "INFO" "Backup retention period set to ${RETENTION_DAYS} days"
                    shift 2
                else
                    log "ERROR" "Invalid retention value: ${2:-}. Must be a positive integer."
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
# Checks Docker, Docker Compose, and standard Unix utilities
check_dependencies() {
    log "INFO" "Verifying system dependencies and requirements..."
    
    local missing_deps=()
    local required_commands=("docker" "tar" "gzip" "date" "mkdir" "cp" "rm" "find")
    
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
    local compose_cmd="docker-compose"
    if ! command -v docker-compose > /dev/null 2>&1; then
        compose_cmd="docker compose"
    fi
    
    if ! ${compose_cmd} version > /dev/null 2>&1; then
        log "ERROR" "Docker Compose is not functional"
        exit 2
    fi
    
    log "INFO" "All dependencies verified successfully"
    log "DEBUG" "Docker version: $(docker --version)"
    log "DEBUG" "Docker Compose command: ${compose_cmd}"
}

# =============================================================================
# BACKUP DIRECTORY MANAGEMENT
# =============================================================================

# Create timestamped backup directory with proper error handling
# Ensures directory structure exists and handles permission issues
create_backup_dir() {
    log "INFO" "Creating backup directory: ${BACKUP_DIR}"
    
    if [[ "${DRY_RUN}" == "true" ]]; then
        log "INFO" "[DRY-RUN] Would create backup directory: ${BACKUP_DIR}"
        return 0
    fi
    
    # Create backup root directory if it doesn't exist
    if [[ ! -d "${BACKUP_ROOT}" ]]; then
        if ! mkdir -p "${BACKUP_ROOT}"; then
            log "ERROR" "Failed to create backup root directory: ${BACKUP_ROOT}"
            exit 3
        fi
        log "INFO" "Created backup root directory: ${BACKUP_ROOT}"
    fi
    
    # Create timestamped backup directory
    if ! mkdir -p "${BACKUP_DIR}"; then
        log "ERROR" "Failed to create backup directory: ${BACKUP_DIR}"
        exit 3
    fi
    
    # Create subdirectories for organized backup structure
    local subdirs=("volumes" "config" "logs")
    for subdir in "${subdirs[@]}"; do
        if ! mkdir -p "${BACKUP_DIR}/${subdir}"; then
            log "ERROR" "Failed to create backup subdirectory: ${BACKUP_DIR}/${subdir}"
            exit 3
        fi
    done
    
    log "INFO" "Backup directory structure created successfully"
    log "DEBUG" "Backup location: ${BACKUP_DIR}"
}

# =============================================================================
# DOCKER VOLUME BACKUP FUNCTIONS
# =============================================================================

# Export Docker volume to compressed tar archive using busybox container
# Provides robust volume backup with error handling and validation
backup_docker_volume() {
    local volume_name="$1"
    local backup_dir="$2"
    local archive_name="${volume_name}.tar.gz"
    local archive_path="${backup_dir}/volumes/${archive_name}"
    
    log "INFO" "Backing up Docker volume: ${volume_name}"
    
    if [[ "${DRY_RUN}" == "true" ]]; then
        log "INFO" "[DRY-RUN] Would backup volume ${volume_name} to ${archive_path}"
        return 0
    fi
    
    # Verify volume exists
    if ! docker volume inspect "${volume_name}" > /dev/null 2>&1; then
        log "WARN" "Docker volume ${volume_name} does not exist, skipping backup"
        return 0
    fi
    
    # Create temporary container to export volume data
    log "DEBUG" "Exporting volume ${volume_name} using busybox container"
    
    local export_cmd=(
        "docker" "run" "--rm"
        "-v" "${volume_name}:/volume:ro"
        "-v" "${backup_dir}/volumes:/backup"
        "busybox:latest"
        "tar" "czf" "/backup/${archive_name}" "-C" "/volume" "."
    )
    
    if ! "${export_cmd[@]}" 2>&1; then
        log "ERROR" "Failed to backup Docker volume: ${volume_name}"
        return 4
    fi
    
    # Verify archive was created successfully
    if [[ ! -f "${archive_path}" ]]; then
        log "ERROR" "Volume backup archive not found: ${archive_path}"
        return 4
    fi
    
    # Get archive size for logging
    local archive_size
    archive_size=$(du -h "${archive_path}" | cut -f1)
    
    log "INFO" "Successfully backed up volume ${volume_name} (${archive_size})"
    log "DEBUG" "Archive location: ${archive_path}"
    
    return 0
}

# Backup all defined Docker volumes with comprehensive error handling
backup_all_volumes() {
    log "INFO" "Starting Docker volume backup process"
    
    local volumes=("${PROMETHEUS_VOLUME}" "${GRAFANA_VOLUME}")
    local failed_volumes=()
    
    for volume in "${volumes[@]}"; do
        if ! backup_docker_volume "${volume}" "${BACKUP_DIR}"; then
            failed_volumes+=("${volume}")
            log "ERROR" "Failed to backup volume: ${volume}"
        fi
    done
    
    # Report backup results
    if [[ ${#failed_volumes[@]} -eq 0 ]]; then
        log "INFO" "All Docker volumes backed up successfully"
        return 0
    else
        log "ERROR" "Failed to backup ${#failed_volumes[@]} volume(s): ${failed_volumes[*]}"
        return 4
    fi
}

# =============================================================================
# CONFIGURATION FILE BACKUP FUNCTIONS
# =============================================================================

# Copy configuration files to backup directory with structure preservation
# Maintains directory hierarchy and handles missing files gracefully
backup_config_files() {
    log "INFO" "Starting configuration file backup process"
    
    local config_backup_dir="${BACKUP_DIR}/config"
    local failed_files=()
    local copied_files=0
    
    for config_file in "${CONFIG_FILES[@]}"; do
        local source_path="${PROJECT_ROOT}/${config_file}"
        local dest_dir="${config_backup_dir}/$(dirname "${config_file}")"
        local dest_path="${config_backup_dir}/${config_file}"
        
        log "DEBUG" "Processing config file: ${config_file}"
        
        if [[ "${DRY_RUN}" == "true" ]]; then
            if [[ -f "${source_path}" ]]; then
                log "INFO" "[DRY-RUN] Would copy ${config_file}"
            else
                log "WARN" "[DRY-RUN] Config file not found: ${config_file}"
            fi
            continue
        fi
        
        # Check if source file exists
        if [[ ! -f "${source_path}" ]]; then
            log "WARN" "Configuration file not found: ${config_file}"
            failed_files+=("${config_file}")
            continue
        fi
        
        # Create destination directory structure
        if ! mkdir -p "${dest_dir}"; then
            log "ERROR" "Failed to create destination directory: ${dest_dir}"
            failed_files+=("${config_file}")
            continue
        fi
        
        # Copy file with preservation of metadata
        if ! cp -p "${source_path}" "${dest_path}"; then
            log "ERROR" "Failed to copy configuration file: ${config_file}"
            failed_files+=("${config_file}")
            continue
        fi
        
        # Verify copy was successful
        if [[ ! -f "${dest_path}" ]]; then
            log "ERROR" "Configuration file copy verification failed: ${config_file}"
            failed_files+=("${config_file}")
            continue
        fi
        
        ((copied_files++))
        log "INFO" "Successfully copied: ${config_file}"
    done
    
    # Report backup results
    log "INFO" "Configuration file backup completed: ${copied_files}/${#CONFIG_FILES[@]} files copied"
    
    if [[ ${#failed_files[@]} -gt 0 ]]; then
        log "WARN" "Failed to backup ${#failed_files[@]} configuration file(s): ${failed_files[*]}"
        return 5
    fi
    
    return 0
}

# =============================================================================
# BACKUP ARCHIVE CREATION
# =============================================================================

# Create compressed tar archive of entire backup directory
# Provides efficient storage and easy transport of backup data
create_backup_archive() {
    local archive_path="${BACKUP_DIR}.tar.gz"
    
    log "INFO" "Creating compressed backup archive"
    
    if [[ "${DRY_RUN}" == "true" ]]; then
        log "INFO" "[DRY-RUN] Would create archive: ${archive_path}"
        return 0
    fi
    
    # Change to backup root directory for relative path archiving
    local current_dir
    current_dir=$(pwd)
    
    if ! cd "${BACKUP_ROOT}"; then
        log "ERROR" "Failed to change to backup root directory: ${BACKUP_ROOT}"
        return 6
    fi
    
    # Create compressed tar archive
    local backup_folder_name
    backup_folder_name=$(basename "${BACKUP_DIR}")
    
    log "DEBUG" "Creating archive with command: tar czf ${archive_path} ${backup_folder_name}"
    
    if ! tar czf "${archive_path}" "${backup_folder_name}"; then
        log "ERROR" "Failed to create backup archive: ${archive_path}"
        cd "${current_dir}"
        return 6
    fi
    
    # Return to original directory
    cd "${current_dir}"
    
    # Verify archive was created and get size information
    if [[ ! -f "${archive_path}" ]]; then
        log "ERROR" "Backup archive not found after creation: ${archive_path}"
        return 6
    fi
    
    local archive_size
    archive_size=$(du -h "${archive_path}" | cut -f1)
    
    log "INFO" "Backup archive created successfully (${archive_size})"
    log "INFO" "Archive location: ${archive_path}"
    
    return 0
}

# =============================================================================
# BACKUP CLEANUP AND RETENTION MANAGEMENT
# =============================================================================

# Remove old backup directories and archives based on retention policy
# Implements safe cleanup with comprehensive logging and error handling
cleanup_old_backups() {
    log "INFO" "Starting cleanup of old backups (retention: ${RETENTION_DAYS} days)"
    
    if [[ "${DRY_RUN}" == "true" ]]; then
        log "INFO" "[DRY-RUN] Would clean up backups older than ${RETENTION_DAYS} days"
        
        # Show what would be deleted in dry-run mode
        local old_items
        old_items=$(find "${BACKUP_ROOT}" -maxdepth 1 \( -type d -name "backup_*" -o -name "backup_*.tar.gz" \) -mtime +${RETENTION_DAYS} 2>/dev/null || true)
        
        if [[ -n "${old_items}" ]]; then
            log "INFO" "[DRY-RUN] Items that would be deleted:"
            echo "${old_items}" | while read -r item; do
                if [[ -n "${item}" ]]; then
                    log "INFO" "[DRY-RUN]   - $(basename "${item}")"
                fi
            done
        else
            log "INFO" "[DRY-RUN] No old backups found for cleanup"
        fi
        return 0
    fi
    
    local cleanup_count=0
    local failed_cleanup=()
    
    # Find and remove old backup directories
    log "DEBUG" "Searching for backup directories older than ${RETENTION_DAYS} days"
    
    while IFS= read -r -d '' backup_dir; do
        if [[ -n "${backup_dir}" ]]; then
            log "DEBUG" "Removing old backup directory: $(basename "${backup_dir}")"
            if rm -rf "${backup_dir}"; then
                ((cleanup_count++))
                log "INFO" "Removed old backup directory: $(basename "${backup_dir}")"
            else
                failed_cleanup+=("$(basename "${backup_dir}")")
                log "ERROR" "Failed to remove backup directory: $(basename "${backup_dir}")"
            fi
        fi
    done < <(find "${BACKUP_ROOT}" -maxdepth 1 -type d -name "backup_*" -mtime +${RETENTION_DAYS} -print0 2>/dev/null || true)
    
    # Find and remove old backup archives
    log "DEBUG" "Searching for backup archives older than ${RETENTION_DAYS} days"
    
    while IFS= read -r -d '' backup_archive; do
        if [[ -n "${backup_archive}" ]]; then
            log "DEBUG" "Removing old backup archive: $(basename "${backup_archive}")"
            if rm -f "${backup_archive}"; then
                ((cleanup_count++))
                log "INFO" "Removed old backup archive: $(basename "${backup_archive}")"
            else
                failed_cleanup+=("$(basename "${backup_archive}")")
                log "ERROR" "Failed to remove backup archive: $(basename "${backup_archive}")"
            fi
        fi
    done < <(find "${BACKUP_ROOT}" -maxdepth 1 -name "backup_*.tar.gz" -mtime +${RETENTION_DAYS} -print0 2>/dev/null || true)
    
    # Report cleanup results
    if [[ ${cleanup_count} -eq 0 ]]; then
        log "INFO" "No old backups found for cleanup"
    else
        log "INFO" "Cleanup completed: ${cleanup_count} old backup(s) removed"
    fi
    
    if [[ ${#failed_cleanup[@]} -gt 0 ]]; then
        log "ERROR" "Failed to clean up ${#failed_cleanup[@]} backup(s): ${failed_cleanup[*]}"
        return 7
    fi
    
    return 0
}

# =============================================================================
# BACKUP PROCESS ORCHESTRATION
# =============================================================================

# Generate comprehensive backup summary report
# Provides detailed information about backup contents and status
generate_backup_summary() {
    local exit_code="${1:-0}"
    local end_time
    end_time=$(date '+%Y-%m-%d %H:%M:%S')
    
    log "INFO" "Backup process completed at ${end_time}"
    log "INFO" "=========================================="
    log "INFO" "BACKUP SUMMARY REPORT"
    log "INFO" "=========================================="
    log "INFO" "Backup Status: $([ ${exit_code} -eq 0 ] && echo "SUCCESS" || echo "FAILED (exit code: ${exit_code})")"
    log "INFO" "Backup Timestamp: ${TIMESTAMP}"
    log "INFO" "Backup Location: ${BACKUP_DIR}"
    log "INFO" "Archive Location: ${BACKUP_DIR}.tar.gz"
    log "INFO" "Retention Period: ${RETENTION_DAYS} days"
    log "INFO" "Dry Run Mode: ${DRY_RUN}"
    
    if [[ "${DRY_RUN}" == "false" && ${exit_code} -eq 0 ]]; then
        # Calculate backup sizes if real backup was performed
        if [[ -d "${BACKUP_DIR}" ]]; then
            local backup_size
            backup_size=$(du -sh "${BACKUP_DIR}" 2>/dev/null | cut -f1 || echo "Unknown")
            log "INFO" "Backup Directory Size: ${backup_size}"
        fi
        
        if [[ -f "${BACKUP_DIR}.tar.gz" ]]; then
            local archive_size
            archive_size=$(du -h "${BACKUP_DIR}.tar.gz" 2>/dev/null | cut -f1 || echo "Unknown")
            log "INFO" "Archive Size: ${archive_size}"
        fi
        
        # List backed up volumes
        log "INFO" "Docker Volumes Backed Up:"
        log "INFO" "  - ${PROMETHEUS_VOLUME} (Prometheus time-series data)"
        log "INFO" "  - ${GRAFANA_VOLUME} (Grafana dashboards and configuration)"
        
        # List backed up configuration files
        log "INFO" "Configuration Files Backed Up:"
        for config_file in "${CONFIG_FILES[@]}"; do
            log "INFO" "  - ${config_file}"
        done
    fi
    
    log "INFO" "=========================================="
}

# Main backup orchestration function with comprehensive error handling
# Coordinates all backup operations and provides detailed progress reporting
main() {
    local start_time
    start_time=$(date '+%Y-%m-%d %H:%M:%S')
    
    log "INFO" "Starting Node.js Tutorial Infrastructure Backup v${SCRIPT_VERSION}"
    log "INFO" "Backup started at ${start_time}"
    log "INFO" "=========================================="
    
    # Validate dependencies and system requirements
    check_dependencies
    
    # Create backup directory structure
    create_backup_dir
    
    # Initialize backup operation tracking
    local backup_steps=0
    local failed_steps=0
    
    # Step 1: Backup Docker volumes
    log "INFO" "Step 1/4: Backing up Docker volumes..."
    if backup_all_volumes; then
        ((backup_steps++))
        log "INFO" "Docker volume backup completed successfully"
    else
        ((failed_steps++))
        log "ERROR" "Docker volume backup failed"
    fi
    
    # Step 2: Backup configuration files
    log "INFO" "Step 2/4: Backing up configuration files..."
    if backup_config_files; then
        ((backup_steps++))
        log "INFO" "Configuration file backup completed successfully"
    else
        ((failed_steps++))
        log "ERROR" "Configuration file backup failed"
    fi
    
    # Step 3: Create compressed archive
    log "INFO" "Step 3/4: Creating backup archive..."
    if create_backup_archive; then
        ((backup_steps++))
        log "INFO" "Backup archive creation completed successfully"
    else
        ((failed_steps++))
        log "ERROR" "Backup archive creation failed"
    fi
    
    # Step 4: Cleanup old backups
    log "INFO" "Step 4/4: Cleaning up old backups..."
    if cleanup_old_backups; then
        ((backup_steps++))
        log "INFO" "Backup cleanup completed successfully"
    else
        ((failed_steps++))
        log "ERROR" "Backup cleanup failed"
    fi
    
    # Determine overall backup status
    local exit_code=0
    if [[ ${failed_steps} -gt 0 ]]; then
        exit_code=1
        log "ERROR" "Backup process completed with ${failed_steps} failed step(s)"
    else
        log "INFO" "All backup steps completed successfully (${backup_steps}/4)"
    fi
    
    # Generate final summary report
    generate_backup_summary ${exit_code}
    
    # Exit with appropriate code
    exit ${exit_code}
}

# =============================================================================
# SCRIPT EXECUTION ENTRY POINT
# =============================================================================

# Parse command-line arguments and execute main backup process
# Provides comprehensive error handling and cleanup
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    # Trap signals for graceful cleanup
    trap 'log "ERROR" "Backup interrupted by signal"; exit 130' INT TERM
    
    # Parse command-line arguments
    parse_args "$@"
    
    # Validate script execution context
    if [[ ! -f "${PROJECT_ROOT}/infrastructure/docker-compose.yml" ]]; then
        log "ERROR" "docker-compose.yml not found. Please run from project root or infrastructure/scripts directory"
        exit 1
    fi
    
    # Execute main backup process
    main
fi

# =============================================================================
# END OF SCRIPT
# =============================================================================