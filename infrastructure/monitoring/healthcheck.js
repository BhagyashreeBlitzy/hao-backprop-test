// External imports
const process = require('process'); // Node.js 18+ - Access process uptime, memory usage, and version
const os = require('os'); // Node.js 18+ - Retrieve system-level information for extended health diagnostics

// Internal imports
const { logger } = require('../../src/backend/utils/logger.js');

// Global constants for health status
const HEALTH_STATUS_OK = "OK";
const HEALTH_STATUS_ERROR = "ERROR";

/**
 * Collects and returns a health status object with server and process metrics.
 * 
 * This function gathers comprehensive health information including process uptime,
 * memory usage, Node.js version, and system-level metrics. It provides a complete
 * health snapshot suitable for monitoring tools, container orchestrators, and
 * CI/CD pipelines.
 * 
 * @returns {object} Health data object containing status, uptime, timestamp, memory usage, 
 *                   Node.js version, and optionally system metrics
 */
function getHealthData() {
    try {
        // Get process uptime in seconds
        const uptimeSeconds = process.uptime();
        
        // Get current timestamp in ISO format for consistent time representation
        const timestamp = new Date().toISOString();
        
        // Get process memory usage for memory leak detection and resource monitoring
        const memoryUsage = process.memoryUsage();
        
        // Get Node.js version for compatibility and debugging information
        const nodeVersion = process.version;
        
        // Get system load average for extended health diagnostics
        const loadAverage = os.loadavg();
        
        // Get system free memory for system-level resource monitoring
        const freeMemory = os.freemem();
        const totalMemory = os.totalmem();
        
        // Calculate memory usage percentage for better insights
        const memoryUsagePercent = ((totalMemory - freeMemory) / totalMemory * 100).toFixed(2);
        
        // Get system platform and architecture information
        const platform = os.platform();
        const architecture = os.arch();
        
        // Construct comprehensive health data object
        const healthData = {
            status: HEALTH_STATUS_OK,
            uptime: uptimeSeconds,
            timestamp: timestamp,
            memory: {
                rss: memoryUsage.rss,              // Resident Set Size
                heapTotal: memoryUsage.heapTotal,   // V8 heap total
                heapUsed: memoryUsage.heapUsed,     // V8 heap used
                external: memoryUsage.external,     // External memory usage
                arrayBuffers: memoryUsage.arrayBuffers // ArrayBuffer memory usage
            },
            version: {
                node: nodeVersion,
                platform: platform,
                architecture: architecture
            },
            system: {
                loadAverage: loadAverage,           // System load average [1m, 5m, 15m]
                freeMemory: freeMemory,             // Free system memory in bytes
                totalMemory: totalMemory,           // Total system memory in bytes
                memoryUsagePercent: parseFloat(memoryUsagePercent), // Memory usage percentage
                cpuCount: os.cpus().length          // Number of CPU cores
            }
        };
        
        // Log successful health data collection
        logger.info('Health check data collected successfully', {
            uptime: uptimeSeconds,
            memoryUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
            systemMemoryUsagePercent: memoryUsagePercent
        });
        
        return healthData;
        
    } catch (error) {
        // Log error during health data collection
        logger.error('Failed to collect health data', error);
        
        // Return error status with minimal information
        return {
            status: HEALTH_STATUS_ERROR,
            timestamp: new Date().toISOString(),
            error: 'Health check failed',
            message: error.message
        };
    }
}

/**
 * Entry point for the health check script. 
 * 
 * Outputs health data as JSON to stdout and sets exit code based on health status.
 * This function is designed to be used by container orchestrators (Docker HEALTHCHECK),
 * CI/CD pipelines, or external monitoring tools to verify backend health.
 * 
 * Exit codes:
 * - 0: Health check passed (status: OK)
 * - 1: Health check failed (status: ERROR or exception occurred)
 * 
 * @returns {void} Outputs health check result and exits process
 */
function main() {
    try {
        // Collect health data from the system
        const healthData = getHealthData();
        
        // Log health check execution with key metrics
        if (healthData.status === HEALTH_STATUS_OK) {
            logger.info('Health check completed successfully', {
                status: healthData.status,
                uptime: healthData.uptime,
                memoryUsedMB: Math.round(healthData.memory.heapUsed / 1024 / 1024)
            });
        } else {
            logger.warn('Health check completed with errors', {
                status: healthData.status,
                error: healthData.error
            });
        }
        
        // Output health data as JSON to stdout for consumption by external tools
        console.log(JSON.stringify(healthData, null, 2));
        
        // Set exit code based on health status
        if (healthData.status === HEALTH_STATUS_OK) {
            // Exit with success code for healthy system
            process.exit(0);
        } else {
            // Exit with error code for unhealthy system
            process.exit(1);
        }
        
    } catch (error) {
        // Handle any unexpected errors during health check execution
        logger.error('Health check script encountered an unexpected error', error);
        
        // Output error information as JSON for external tool consumption
        const errorOutput = {
            status: HEALTH_STATUS_ERROR,
            timestamp: new Date().toISOString(),
            error: 'Health check script failed',
            message: error.message,
            stack: error.stack
        };
        
        console.error(JSON.stringify(errorOutput, null, 2));
        
        // Exit with error code to signal failure to orchestrators
        process.exit(1);
    }
}

// Export the health data collection function for use in other monitoring scripts or tests
module.exports = { getHealthData };

// Execute main function if this script is run directly (not imported as module)
if (require.main === module) {
    main();
}