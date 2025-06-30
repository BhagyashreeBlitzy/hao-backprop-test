/**
 * PM2 Process Manager Configuration for Node.js Tutorial Backend
 * 
 * This file defines the PM2 ecosystem configuration for managing the Node.js tutorial
 * backend application (src/backend/server.js) in both development and production
 * environments. PM2 provides robust process management, automatic restarts, log
 * centralization, clustering capabilities, and zero-downtime deployment support.
 * 
 * Key Features:
 * - Process management and monitoring for Express.js HTTP server
 * - Environment-specific configurations (development and production)
 * - Centralized logging with configurable file paths
 * - Support for single-instance and cluster scaling modes
 * - Automatic restart policies with delay configuration
 * - Educational documentation for maintainability and learning
 * 
 * Architecture Benefits:
 * - Zero-downtime process management and automatic recovery from crashes
 * - Log aggregation and centralization for monitoring and debugging
 * - Horizontal scaling through clustering for multi-core utilization
 * - Environment variable management for flexible deployment configurations
 * - Integration with CI/CD pipelines and deployment automation
 * 
 * Technical Requirements Addressed:
 * - HTTP Server Initialization & Process Management: Ensures server.js is monitored and restarted
 * - Environment and Configuration Management: Supports NODE_ENV, PORT, HOST variables
 * - Logging and Monitoring: Centralized log files for stdout/stderr with merge capabilities
 * - Scalability and High Availability: Single and cluster modes for different deployment needs
 * - Educational Value and Code Clarity: Comprehensive documentation and clear configuration
 * 
 * PM2 Commands:
 * - Start: pm2 start infrastructure/config/pm2.config.js
 * - Start Production: pm2 start infrastructure/config/pm2.config.js --env production
 * - Monitor: pm2 monit
 * - Logs: pm2 logs nodejs-tutorial-backend
 * - Restart: pm2 restart nodejs-tutorial-backend
 * - Stop: pm2 stop nodejs-tutorial-backend
 * - Delete: pm2 delete nodejs-tutorial-backend
 * 
 * Educational Value:
 * This configuration demonstrates production-ready process management patterns:
 * - Process lifecycle management and automatic recovery
 * - Environment-specific configuration and deployment strategies
 * - Log management and centralization for observability
 * - Scaling strategies for performance optimization
 * - Integration with Node.js applications and Express.js servers
 * 
 * @fileoverview PM2 ecosystem configuration for Node.js tutorial backend process management
 * @author Node.js Tutorial Project
 * @version 1.0.0
 * @requires pm2@^5.3.0 - Process manager for Node.js applications
 * @requires src/backend/server.js - Main Express.js application entry point
 */

/**
 * PM2 Ecosystem Configuration Object
 * 
 * Defines the complete PM2 ecosystem configuration including application processes,
 * environment variables, logging settings, scaling options, and restart policies.
 * This configuration is designed for both educational clarity and production readiness.
 * 
 * Configuration Structure:
 * - apps: Array of application process configurations
 * - deploy: Optional deployment configuration (for advanced scenarios)
 * 
 * Design Principles:
 * - Educational Clarity: All settings documented for learning purposes
 * - Production Readiness: Robust configuration suitable for production deployment
 * - Flexibility: Support for multiple environments and scaling strategies
 * - Maintainability: Clear organization and comprehensive documentation
 * 
 * @type {Object}
 * @property {Array<Object>} apps - Array of PM2 application configurations
 */
module.exports = {
    /**
     * PM2 Applications Configuration Array
     * 
     * Defines the list of applications to be managed by PM2. In this tutorial,
     * we have a single Node.js backend application, but the array structure
     * supports multiple applications for more complex scenarios.
     * 
     * Each application object defines:
     * - Process identification and script location
     * - Environment variables and configuration
     * - Logging and monitoring settings
     * - Scaling and restart policies
     * - Error handling and recovery options
     */
    apps: [
        {
            /**
             * Application Process Name
             * 
             * Unique identifier for the PM2 process, used in all PM2 commands
             * and monitoring interfaces. This name should be descriptive and
             * consistent across all environments.
             * 
             * Naming Convention: [project]-[component]-[role]
             * - nodejs-tutorial: Project identifier
             * - backend: Application component
             * 
             * Usage in PM2 Commands:
             * - pm2 restart nodejs-tutorial-backend
             * - pm2 logs nodejs-tutorial-backend
             * - pm2 monit (shows this name in process list)
             * 
             * @type {string}
             */
            name: 'nodejs-tutorial-backend',

            /**
             * Application Entry Script Path
             * 
             * Relative path to the main Node.js application entry point from the
             * current working directory. This file contains the HTTP server
             * initialization and is the primary executable for the application.
             * 
             * Script Details:
             * - Path: src/backend/server.js
             * - Purpose: Express.js HTTP server initialization and startup
             * - Dependencies: Imports app.js, configuration, and utilities
             * - Functionality: Binds to network, handles requests, manages lifecycle
             * 
             * Educational Note:
             * This demonstrates the separation between application logic (app.js)
             * and server initialization (server.js), following Node.js best practices.
             * 
             * @type {string}
             */
            script: 'src/backend/server.js',

            /**
             * Current Working Directory
             * 
             * Sets the working directory for the Node.js process. Using './' ensures
             * the process runs from the project root, maintaining correct relative
             * path resolution for imports, configuration files, and assets.
             * 
             * Directory Structure Context:
             * ./                                 <- PM2 cwd setting
             * ├── src/backend/server.js         <- script path
             * ├── infrastructure/config/        <- PM2 config location
             * ├── logs/                         <- log file destination
             * └── package.json                  <- project dependencies
             * 
             * Importance:
             * - Ensures require() statements resolve correctly
             * - Maintains consistent file system access
             * - Supports proper configuration and asset loading
             * 
             * @type {string}
             */
            cwd: './',

            /**
             * Node.js Interpreter
             * 
             * Specifies the interpreter to use for executing the application script.
             * 'node' is the default and recommended setting for Node.js applications,
             * ensuring compatibility with the installed Node.js runtime.
             * 
             * Alternative Options:
             * - 'node': Standard Node.js interpreter (recommended)
             * - 'babel-node': For applications requiring Babel transpilation
             * - './node_modules/.bin/ts-node': For TypeScript applications
             * - Custom interpreter paths: For specific Node.js versions
             * 
             * Educational Note:
             * Using the standard 'node' interpreter demonstrates proper Node.js
             * application deployment without additional build or transpilation steps.
             * 
             * @type {string}
             */
            interpreter: 'node',

            /**
             * Command Line Arguments
             * 
             * Array of command line arguments to pass to the Node.js application.
             * Empty array indicates no additional arguments are required for the
             * tutorial backend, as all configuration is handled through environment
             * variables and configuration files.
             * 
             * Common Use Cases (not needed for this tutorial):
             * - ['--max-old-space-size=4096']: Node.js memory optimization
             * - ['--inspect=9229']: Enable Node.js debugging
             * - ['--harmony']: Enable experimental JavaScript features
             * 
             * Educational Value:
             * Demonstrates clean application design where configuration is externalized
             * rather than passed through command line arguments.
             * 
             * @type {Array<string>}
             */
            args: [],

            /**
             * Default Environment Variables
             * 
             * Environment variables for development and default scenarios.
             * These values provide secure defaults for local development while
             * being easily overridable for different deployment environments.
             * 
             * Variable Descriptions:
             * - NODE_ENV: Controls Express.js behavior and application features
             * - PORT: HTTP server port binding (default from server configuration)
             * - HOST: HTTP server host binding (secure localhost default)
             * 
             * Security Considerations:
             * - HOST='localhost': Secure default preventing external access in development
             * - PORT=3000: Standard development port above system reserved range
             * - NODE_ENV='development': Enables development features and verbose logging
             * 
             * @type {Object}
             */
            env: {
                NODE_ENV: 'development',
                PORT: 3000,
                HOST: 'localhost'
            },

            /**
             * Production Environment Variables
             * 
             * Environment variables specifically for production deployment.
             * These override the default env settings when PM2 is started with
             * the --env production flag.
             * 
             * Production Configuration:
             * - NODE_ENV='production': Optimizes Express.js for production performance
             * - PORT=3000: Maintains consistent port (often overridden by deployment)
             * - HOST='0.0.0.0': Binds to all interfaces for external access
             * 
             * Production Features Enabled:
             * - Express.js performance optimizations
             * - Reduced logging verbosity
             * - Error message sanitization
             * - Caching and compression optimizations
             * 
             * Usage: pm2 start pm2.config.js --env production
             * 
             * @type {Object}
             */
            env_production: {
                NODE_ENV: 'production',
                PORT: 3000,
                HOST: '0.0.0.0'
            },

            /**
             * File Watching Configuration
             * 
             * Controls whether PM2 should watch for file changes and automatically
             * restart the application. Set to false for production stability and
             * performance, but can be enabled for development convenience.
             * 
             * Watch Behavior:
             * - false (recommended): No automatic restarts on file changes
             * - true: Restart application when source files change
             * - Array: Specify specific files/directories to watch
             * 
             * Development vs Production:
             * - Development: Can be set to true for automatic reload during coding
             * - Production: Should always be false to prevent unintended restarts
             * 
             * Educational Note:
             * File watching is convenient for development but can cause stability
             * issues in production. Use nodemon for development instead.
             * 
             * @type {boolean}
             */
            watch: false,

            /**
             * Process Instance Count
             * 
             * Defines the number of application instances to run. This setting
             * enables horizontal scaling and multi-core utilization for improved
             * performance and availability.
             * 
             * Configuration Options:
             * - 1: Single instance (recommended for development and small loads)
             * - 'max': One instance per CPU core (recommended for production)
             * - Number: Specific instance count (e.g., 2, 4, 8)
             * 
             * Scaling Strategy:
             * - Development: 1 instance for simplicity and debugging
             * - Production: 'max' for full CPU utilization
             * - Load Testing: Adjust based on performance requirements
             * 
             * Educational Value:
             * Demonstrates Node.js clustering concepts and horizontal scaling
             * strategies for improving application performance and reliability.
             * 
             * @type {number|string}
             */
            instances: 1,

            /**
             * Process Execution Mode
             * 
             * Determines how PM2 executes the application instances. Different modes
             * provide different capabilities for scaling and inter-process communication.
             * 
             * Execution Modes:
             * - 'fork': Single process mode (default, recommended for development)
             * - 'cluster': Multi-process cluster mode (recommended for production scaling)
             * 
             * Mode Characteristics:
             * - Fork Mode: Simple process execution, easier debugging, lower overhead
             * - Cluster Mode: Load balancing across instances, better CPU utilization
             * 
             * Configuration Alignment:
             * - instances: 1 + exec_mode: 'fork' = Single process
             * - instances: 'max' + exec_mode: 'cluster' = Multi-core scaling
             * 
             * Educational Note:
             * Fork mode is ideal for learning and development, while cluster mode
             * demonstrates production scaling techniques.
             * 
             * @type {string}
             */
            exec_mode: 'fork',

            /**
             * Error Log File Path
             * 
             * Specifies the file path for capturing stderr output from the application.
             * This includes application errors, warnings, and error-level logging
             * for debugging and monitoring purposes.
             * 
             * Log File Features:
             * - Centralized error collection for debugging
             * - Persistent storage across application restarts
             * - Integration with log monitoring and alerting systems
             * - Separation of error logs from standard output
             * 
             * Directory Structure:
             * logs/
             * ├── pm2-error.log    <- stderr output (this file)
             * ├── pm2-out.log      <- stdout output
             * └── pm2-combined.log <- merged logs (if merge_logs enabled)
             * 
             * Educational Value:
             * Demonstrates proper logging practices and error handling strategies
             * for production Node.js applications.
             * 
             * @type {string}
             */
            error_file: 'logs/pm2-error.log',

            /**
             * Output Log File Path
             * 
             * Specifies the file path for capturing stdout output from the application.
             * This includes application logs, request information, and general
             * operational output for monitoring and debugging.
             * 
             * Log Content Examples:
             * - Server startup messages
             * - HTTP request logging
             * - Application status information
             * - Debug output and operational messages
             * 
             * Log Management:
             * - Automatic log rotation (configurable)
             * - Integration with log aggregation systems
             * - Support for log parsing and analysis tools
             * - Real-time log monitoring capabilities
             * 
             * Usage:
             * - pm2 logs nodejs-tutorial-backend: View live logs
             * - tail -f logs/pm2-out.log: Direct file monitoring
             * 
             * @type {string}
             */
            out_file: 'logs/pm2-out.log',

            /**
             * Log Merging Configuration
             * 
             * Controls whether PM2 should merge stdout and stderr logs from all
             * instances into single files. This simplifies log management and
             * analysis when running multiple application instances.
             * 
             * Merge Behavior:
             * - true: Combine logs from all instances into single files
             * - false: Separate log files for each instance (e.g., app-0.log, app-1.log)
             * 
             * Benefits of Merging:
             * - Simplified log analysis and monitoring
             * - Reduced file system complexity
             * - Easier integration with log aggregation systems
             * - Consistent log format across instances
             * 
             * Educational Note:
             * Log merging is especially valuable in cluster mode where multiple
             * instances generate logs simultaneously.
             * 
             * @type {boolean}
             */
            merge_logs: true,

            /**
             * Restart Delay Configuration
             * 
             * Defines the delay (in milliseconds) between automatic restart attempts
             * when the application crashes or exits unexpectedly. This prevents
             * rapid restart loops and reduces system resource consumption.
             * 
             * Delay Strategy:
             * - 2000ms (2 seconds): Reasonable delay for most applications
             * - Prevents rapid restart loops that could overwhelm the system
             * - Allows time for external dependencies to recover
             * - Provides debugging opportunity for persistent issues
             * 
             * Restart Scenarios:
             * - Application crashes due to unhandled errors
             * - Process exits due to fatal errors
             * - Memory exhaustion or resource limits
             * - External dependency failures
             * 
             * Educational Value:
             * Demonstrates proper error recovery strategies and system stability
             * considerations for production applications.
             * 
             * @type {number}
             */
            restart_delay: 2000,

            /**
             * Automatic Restart Configuration
             * 
             * Controls PM2's automatic restart behavior when the application stops
             * or crashes. This ensures high availability and automatic recovery
             * from unexpected failures.
             * 
             * Restart Behavior:
             * - true: Automatically restart on crashes (recommended)
             * - false: Manual restart required
             * - 'always': Restart regardless of exit code
             * 
             * Restart Triggers:
             * - Unhandled exceptions
             * - Process crashes
             * - Memory limit exceeded
             * - Application exit with error code
             * 
             * Production Benefits:
             * - High availability and fault tolerance
             * - Automatic recovery from transient issues
             * - Reduced manual intervention requirements
             * - Improved service reliability
             * 
             * @type {boolean}
             */
            autorestart: true,

            /**
             * Maximum Memory Limit
             * 
             * Sets the maximum memory consumption limit for the application process.
             * When exceeded, PM2 will automatically restart the application to
             * prevent memory leaks from affecting system stability.
             * 
             * Memory Management:
             * - 512M: Conservative limit suitable for tutorial application
             * - Automatic restart when limit exceeded
             * - Prevents memory leaks from causing system issues
             * - Configurable based on application requirements
             * 
             * Memory Monitoring:
             * - pm2 monit: Real-time memory usage monitoring
             * - pm2 logs: Memory restart notifications
             * - Integration with monitoring systems
             * 
             * Educational Note:
             * Memory limits demonstrate proper resource management and monitoring
             * practices for production Node.js applications.
             * 
             * @type {string}
             */
            max_memory_restart: '512M',

            /**
             * Process Kill Timeout
             * 
             * Defines the timeout (in milliseconds) for graceful process shutdown
             * before PM2 forces termination. This allows the application to complete
             * current requests and clean up resources properly.
             * 
             * Shutdown Process:
             * 1. PM2 sends SIGINT signal to application
             * 2. Application begins graceful shutdown
             * 3. After kill_timeout, PM2 sends SIGKILL if needed
             * 
             * Graceful Shutdown Benefits:
             * - Complete processing of active requests
             * - Proper resource cleanup and connection closing
             * - Data consistency and transaction completion
             * - Clean application state management
             * 
             * Educational Value:
             * Demonstrates proper application lifecycle management and graceful
             * shutdown patterns for production deployments.
             * 
             * @type {number}
             */
            kill_timeout: 3000,

            /**
             * Process Listening Timeout
             * 
             * Sets the timeout (in milliseconds) for PM2 to wait for the application
             * to start listening on its configured port. This prevents hanging
             * processes and ensures proper startup validation.
             * 
             * Startup Validation:
             * - PM2 waits for port binding confirmation
             * - Timeout prevents indefinite waiting
             * - Failed startups are properly handled
             * - Restart policies apply to startup failures
             * 
             * Application Startup:
             * - server.js binds to configured PORT and HOST
             * - PM2 detects successful port binding
             * - Application marked as ready for traffic
             * 
             * @type {number}
             */
            listen_timeout: 10000,

            /**
             * Maximum Restart Attempts
             * 
             * Limits the number of automatic restart attempts within a specific
             * time window to prevent infinite restart loops for persistently
             * failing applications.
             * 
             * Restart Management:
             * - 10 attempts: Reasonable limit for recovery attempts
             * - Prevents resource exhaustion from failed restarts
             * - Allows for transient issue recovery
             * - Stops attempts after limit reached
             * 
             * Failure Scenarios:
             * - Persistent configuration errors
             * - Missing dependencies or files
             * - Port conflicts or network issues
             * - Corrupted application state
             * 
             * @type {number}
             */
            max_restarts: 10,

            /**
             * Restart Time Window
             * 
             * Defines the time window (in milliseconds) for tracking restart attempts.
             * Used in conjunction with max_restarts to prevent restart loops.
             * 
             * Window Management:
             * - 60000ms (1 minute): Time window for restart counting
             * - Resets after window expires
             * - Prevents long-term restart accumulation
             * - Allows recovery after resolving issues
             * 
             * @type {number}
             */
            min_uptime: 60000,

            /**
             * Process Time Zone Configuration
             * 
             * Sets the time zone for the application process, affecting log timestamps
             * and date/time operations. Using 'Etc/UTC' ensures consistent timestamps
             * regardless of deployment location.
             * 
             * Time Zone Benefits:
             * - Consistent log timestamps across deployments
             * - Simplified log analysis and correlation
             * - Avoids daylight saving time complications
             * - Standard practice for distributed systems
             * 
             * @type {string}
             */
            env_timezone: 'Etc/UTC'
        }
    ],

    /**
     * Deployment Configuration (Optional)
     * 
     * This section can be used for advanced deployment scenarios with PM2 deploy
     * functionality. For the tutorial application, deployment is handled through
     * simpler means, but this structure is provided for educational purposes.
     * 
     * Deployment Features (Advanced):
     * - Git-based deployment automation
     * - Remote server deployment
     * - Rollback capabilities
     * - Environment-specific deployment configurations
     * 
     * Educational Note:
     * While not required for this tutorial, deployment configuration demonstrates
     * how PM2 can automate complex deployment workflows in production environments.
     * 
     * Example Structure (commented for tutorial):
     * deploy: {
     *   production: {
     *     user: 'deploy',
     *     host: ['server1.example.com', 'server2.example.com'],
     *     ref: 'origin/main',
     *     repo: 'git@github.com:username/nodejs-tutorial.git',
     *     path: '/var/www/production',
     *     'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
     *   }
     * }
     */
};

/**
 * PM2 Configuration Usage Examples and Best Practices
 * 
 * This section provides comprehensive guidance for using this PM2 configuration
 * in different scenarios and environments.
 * 
 * Basic Usage Commands:
 * 
 * Start Application (Development):
 * pm2 start infrastructure/config/pm2.config.js
 * 
 * Start Application (Production):
 * pm2 start infrastructure/config/pm2.config.js --env production
 * 
 * Monitor Application:
 * pm2 monit
 * 
 * View Logs:
 * pm2 logs nodejs-tutorial-backend
 * pm2 logs nodejs-tutorial-backend --lines 100
 * 
 * Restart Application:
 * pm2 restart nodejs-tutorial-backend
 * 
 * Reload Application (Zero Downtime):
 * pm2 reload nodejs-tutorial-backend
 * 
 * Stop Application:
 * pm2 stop nodejs-tutorial-backend
 * 
 * Delete Application:
 * pm2 delete nodejs-tutorial-backend
 * 
 * Show Process Information:
 * pm2 show nodejs-tutorial-backend
 * 
 * List All Processes:
 * pm2 list
 * 
 * Save PM2 Process List:
 * pm2 save
 * 
 * Restore PM2 Process List:
 * pm2 resurrect
 * 
 * Advanced Configuration Examples:
 * 
 * Cluster Mode for Production (modify instances and exec_mode):
 * instances: 'max',
 * exec_mode: 'cluster'
 * 
 * Development with File Watching:
 * watch: true,
 * ignore_watch: ['logs', 'node_modules', '.git']
 * 
 * Custom Environment Variables:
 * env_staging: {
 *   NODE_ENV: 'staging',
 *   PORT: 4000,
 *   HOST: '0.0.0.0',
 *   DATABASE_URL: 'postgres://...'
 * }
 * 
 * Memory and CPU Limits:
 * max_memory_restart: '1G',
 * node_args: '--max-old-space-size=1024'
 * 
 * Log Rotation Configuration:
 * log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
 * combine_logs: true,
 * merge_logs: true
 */

/**
 * Production Deployment Guidelines
 * 
 * For production deployment of this PM2 configuration, consider these recommendations:
 * 
 * 1. Environment Variables:
 *    - Set NODE_ENV=production
 *    - Configure appropriate PORT for your deployment
 *    - Set HOST=0.0.0.0 for external access
 *    - Add database and external service configurations
 * 
 * 2. Scaling Configuration:
 *    - Use instances: 'max' for full CPU utilization
 *    - Set exec_mode: 'cluster' for load balancing
 *    - Adjust max_memory_restart based on available system memory
 * 
 * 3. Logging Configuration:
 *    - Ensure logs directory exists and is writable
 *    - Configure log rotation to prevent disk space issues
 *    - Set up log monitoring and alerting
 *    - Consider using external log aggregation services
 * 
 * 4. Monitoring and Alerting:
 *    - Set up PM2 monitoring dashboard
 *    - Configure health check endpoints
 *    - Set up alerts for crashes and restarts
 *    - Monitor resource usage and performance metrics
 * 
 * 5. Security Considerations:
 *    - Run PM2 as non-root user in production
 *    - Secure log files with appropriate permissions
 *    - Configure firewall rules for application ports
 *    - Use process isolation and resource limits
 * 
 * 6. Backup and Recovery:
 *    - Save PM2 configuration: pm2 save
 *    - Backup ecosystem configuration file
 *    - Document restart and recovery procedures
 *    - Test disaster recovery scenarios
 */

/**
 * Troubleshooting Common Issues
 * 
 * Application Won't Start:
 * - Check that src/backend/server.js exists and is executable
 * - Verify Node.js version compatibility (requires Node.js v18+)
 * - Ensure all npm dependencies are installed
 * - Check port availability and permissions
 * 
 * High Memory Usage:
 * - Monitor with: pm2 monit
 * - Adjust max_memory_restart limit
 * - Check for memory leaks in application code
 * - Consider reducing instances count
 * 
 * Application Keeps Restarting:
 * - Check error logs: pm2 logs nodejs-tutorial-backend --err
 * - Verify configuration values and environment variables
 * - Check for port conflicts with other processes
 * - Review max_restarts and min_uptime settings
 * 
 * Log Files Not Created:
 * - Ensure logs directory exists: mkdir -p logs
 * - Check file permissions and disk space
 * - Verify log file paths in configuration
 * - Check PM2 permissions and user access
 * 
 * Performance Issues:
 * - Monitor resource usage: pm2 monit
 * - Consider enabling cluster mode for scaling
 * - Review application code for performance bottlenecks
 * - Adjust memory limits and restart policies
 */

/**
 * Educational Learning Objectives
 * 
 * This PM2 configuration demonstrates several key concepts for Node.js developers:
 * 
 * 1. Process Management:
 *    - Understanding process lifecycle and monitoring
 *    - Automatic restart and recovery strategies
 *    - Resource limits and protection mechanisms
 * 
 * 2. Environment Configuration:
 *    - Environment variable management
 *    - Development vs production configurations
 *    - Configuration externalization best practices
 * 
 * 3. Logging and Monitoring:
 *    - Centralized log management
 *    - Log file organization and rotation
 *    - Monitoring and observability practices
 * 
 * 4. Scaling and Performance:
 *    - Horizontal scaling through clustering
 *    - Load balancing and multi-core utilization
 *    - Resource optimization strategies
 * 
 * 5. Production Readiness:
 *    - High availability and fault tolerance
 *    - Zero-downtime deployment strategies
 *    - Security and operational best practices
 * 
 * 6. DevOps Integration:
 *    - CI/CD pipeline integration
 *    - Deployment automation
 *    - Infrastructure as code principles
 */