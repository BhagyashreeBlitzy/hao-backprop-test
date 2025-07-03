/**
 * Main Express Application Initialization Module
 * 
 * This module serves as the core Express application initialization file, responsible
 * for creating and configuring the Express.js application instance with all required
 * middleware, routing, and error handling components. It implements a robust, 
 * maintainable, and observable server setup following Node.js/Express.js best practices
 * and is designed for import by server.js for HTTP server binding.
 * 
 * The module establishes the foundation for a production-ready Express application
 * by configuring essential middleware in the correct order, mounting the central API
 * router, and integrating comprehensive error handling and logging capabilities.
 * The design emphasizes modularity, maintainability, and extensibility while providing
 * excellent observability for troubleshooting and monitoring.
 * 
 * Architecture Pattern:
 * This module follows the Express.js application factory pattern where the Express
 * application is configured and returned as a fully initialized instance. The
 * configuration is performed through a dedicated configureApp function that handles
 * all middleware registration, route mounting, and error handling setup.
 * 
 * Key Features:
 * - Express.js 5.1.0 application initialization with security enhancements
 * - Comprehensive middleware stack with proper ordering for optimal performance
 * - Centralized API router mounting for clean route organization
 * - Robust error handling with environment-aware responses
 * - Request/response logging for observability and troubleshooting
 * - JSON and URL-encoded body parsing for future extensibility
 * - Production-ready configuration with security best practices
 * - Modular design supporting future enhancements and middleware additions
 * 
 * Middleware Stack Configuration:
 * 1. requestLogger - First middleware for comprehensive request/response logging
 * 2. express.json() - Built-in JSON body parser for future API extensibility
 * 3. express.urlencoded() - Built-in URL-encoded body parser for form data
 * 4. Central API Router - Mounts all feature routes (/hello, /health) at root path
 * 5. errorHandler - Last middleware for centralized error handling and logging
 * 
 * Requirements Addressed:
 * - HTTP Server Implementation (F-001): Creates and configures Express.js application
 *   instance with proper middleware stack and routing setup
 * - Hello World Endpoint (F-002): Mounts central API router that exposes '/hello'
 *   endpoint for GET requests returning 'Hello world' message
 * - Request Processing (F-003): Configures comprehensive request logging and body
 *   parsing middleware for robust request processing and observability
 * - Response Generation (F-004): Ensures proper response generation through
 *   centralized error handling and standardized response formatting
 * - Monitoring and Observability (6.5): Integrates request logging and health check
 *   endpoints for comprehensive monitoring and troubleshooting capabilities
 * - Error Management (1.3.1): Implements centralized error handling middleware
 *   for consistent error responses and comprehensive error logging
 * 
 * Security Considerations:
 * - Express.js 5.1.0 with built-in security improvements (ReDoS protection)
 * - Environment-aware error responses to prevent information leakage
 * - Secure middleware ordering to prevent security vulnerabilities
 * - Integration with centralized logging for security event monitoring
 * 
 * Performance Characteristics:
 * - Optimized middleware order for minimal processing overhead
 * - Express.js 5.1.0 performance enhancements with path-to-regexp@8.x
 * - Efficient request processing with minimal memory footprint
 * - Target response times: <100ms for all endpoints
 * - Scalable architecture supporting high concurrent connections
 * 
 * @fileoverview Main Express application initialization and configuration module
 * @version 1.0.0
 * @author Tutorial Implementation Team
 * @requires express Express.js web framework (v5.1.0)
 * @requires ./middleware/index.js Centralized middleware exports (requestLogger, errorHandler)
 * @requires ./routes/index.js Central API router with feature endpoints
 * @requires ./config/env.js Environment configuration and validation
 * @since 2024-01-01
 */

// =============================================================================
// EXTERNAL DEPENDENCIES
// =============================================================================

/**
 * Express.js Web Framework - Version 5.1.0
 * 
 * Express.js is a fast, unopinionated, minimalist web framework for Node.js
 * that provides a robust set of features for web and mobile applications.
 * Version 5.1.0 includes important security enhancements, performance improvements,
 * and modern JavaScript features support.
 * 
 * Key Features in Express.js 5.1.0:
 * - Enhanced security with ReDoS attack prevention (path-to-regexp@8.x)
 * - Automatic promise rejection handling for async middleware
 * - Node.js 18+ compatibility with modern JavaScript features
 * - Improved routing performance and memory efficiency
 * - Built-in middleware enhancements for better request processing
 * 
 * Security Improvements:
 * - CVE-2024-45590 mitigation for enhanced security
 * - Removal of sub-expression regular expressions to prevent ReDoS attacks
 * - Enhanced header validation and sanitization
 * - Improved error handling to prevent information leakage
 * 
 * @external express
 * @see {@link https://expressjs.com/en/5x/api.html|Express.js 5.x API Documentation}
 * @see {@link https://github.com/expressjs/express/releases/tag/5.1.0|Express.js 5.1.0 Release Notes}
 * @version 5.1.0
 */
const express = require('express'); // Express.js v5.1.0 - Core web framework for Node.js

// =============================================================================
// INTERNAL DEPENDENCIES
// =============================================================================

/**
 * Centralized Middleware Components
 * 
 * Import essential middleware components from the centralized middleware module
 * that provides standardized request logging and error handling functionality.
 * These middleware components are designed to work together to provide
 * comprehensive observability and robust error management.
 * 
 * Imported Middleware:
 * - requestLogger: Comprehensive request/response logging middleware
 * - errorHandler: Centralized error handling and response middleware
 * 
 * @see {@link ./middleware/index.js|Centralized Middleware Module}
 */
const { requestLogger, errorHandler } = require('./middleware/index.js');

/**
 * Central API Router
 * 
 * Import the central API router that aggregates all feature routers including
 * the hello endpoint and health check functionality. The router is fully
 * configured with proper error handling and HTTP method validation.
 * 
 * Router Features:
 * - GET /hello endpoint returning "Hello world" message
 * - GET /health endpoint providing comprehensive health status
 * - Proper HTTP method validation and error responses
 * - Integration with centralized error handling middleware
 * 
 * @see {@link ./routes/index.js|Central API Router Module}
 */
const { router } = require('./routes/index.js');

/**
 * Environment Configuration
 * 
 * Import the current runtime environment configuration for environment-aware
 * application behavior and logging. The environment configuration provides
 * validated runtime settings and deployment-specific configurations.
 * 
 * Environment Values:
 * - development: Local development with enhanced logging and error details
 * - production: Production deployment with optimized performance and security
 * - test: Testing environment with minimal logging and predictable behavior
 * 
 * @see {@link ./config/env.js|Environment Configuration Module}
 */
const { env } = require('./config/env.js');

// =============================================================================
// GLOBAL APPLICATION INSTANCE
// =============================================================================

/**
 * Express Application Instance
 * 
 * Create the main Express application instance that will be configured with
 * all necessary middleware, routing, and error handling components. This
 * instance serves as the foundation for the entire web application.
 * 
 * The application instance is created using the Express.js 5.1.0 framework
 * with all default settings optimized for production use, including enhanced
 * security features and performance improvements.
 * 
 * @constant {express.Application} app - Main Express application instance
 * @see {@link https://expressjs.com/en/5x/api.html#app|Express Application API}
 */
const app = express();

// =============================================================================
// APPLICATION CONFIGURATION FUNCTION
// =============================================================================

/**
 * Configure Express Application with Middleware, Routes, and Error Handling
 * 
 * This function implements the complete Express application configuration,
 * setting up all required middleware components in the proper order to ensure
 * optimal performance, security, and observability. The configuration follows
 * Express.js best practices and production deployment requirements.
 * 
 * Configuration Strategy:
 * The middleware stack is configured in a specific order to ensure proper
 * request processing flow and optimal performance:
 * 
 * 1. Request Logging (First) - Captures all incoming requests for observability
 * 2. Built-in Middleware - JSON and URL-encoded body parsing for extensibility
 * 3. Application Routes - Central API router with all feature endpoints
 * 4. Error Handling (Last) - Centralized error processing and response generation
 * 
 * Middleware Order Justification:
 * - requestLogger first: Ensures all requests are logged regardless of processing outcome
 * - Body parsers early: Enables request body processing for all subsequent middleware
 * - Router in middle: Handles business logic after request preprocessing
 * - errorHandler last: Catches all errors from previous middleware and routes
 * 
 * Future Extensibility:
 * The configuration is designed to support future middleware additions without
 * breaking existing functionality. New middleware can be added between body
 * parsers and the router for additional request processing capabilities.
 * 
 * Performance Considerations:
 * - Minimal middleware overhead with efficient ordering
 * - Express.js 5.1.0 performance optimizations
 * - Optimized request processing pipeline
 * - Memory-efficient middleware composition
 * 
 * Security Implementation:
 * - Environment-aware error handling to prevent information leakage
 * - Secure middleware ordering to prevent security vulnerabilities
 * - Integration with Express.js 5.1.0 security enhancements
 * 
 * @function configureApp
 * @returns {express.Application} The fully configured Express application instance
 * 
 * @example
 * // Basic usage - configure and start application
 * const app = configureApp();
 * app.listen(3000, () => {
 *   console.log('Server running on port 3000');
 * });
 * 
 * @example
 * // Advanced usage - configure with custom settings
 * const app = configureApp();
 * app.set('trust proxy', 1); // Custom Express settings
 * app.listen(process.env.PORT || 3000);
 * 
 * @example
 * // Testing usage - configure for test environment
 * const app = configureApp();
 * // App is ready for supertest or other testing frameworks
 * const response = await request(app).get('/hello').expect(200);
 */
function configureApp() {
    // =========================================================================
    // STEP 1: REQUEST LOGGING MIDDLEWARE (FIRST)
    // =========================================================================
    
    /**
     * Register Request Logger Middleware as First Middleware
     * 
     * The request logger middleware is registered as the first middleware in the
     * stack to ensure comprehensive logging of all incoming HTTP requests and
     * their corresponding responses. This positioning guarantees that all requests
     * are logged regardless of their processing outcome or any errors that occur.
     * 
     * Request Logger Features:
     * - High-resolution timing for accurate response time measurement
     * - Comprehensive request metadata logging (method, path, headers, etc.)
     * - Environment-aware logging with appropriate log levels
     * - Status code-based log level selection (info, warn, error)
     * - Integration with centralized logging infrastructure
     * 
     * Positioning Rationale:
     * Placing the request logger first ensures that even if subsequent middleware
     * throws errors or the request fails, the request attempt is still logged
     * for observability and troubleshooting purposes.
     * 
     * @middleware requestLogger
     * @position 1 (First)
     * @purpose Comprehensive request/response logging and observability
     */
    app.use(requestLogger);
    
    // =========================================================================
    // STEP 2: BUILT-IN EXPRESS MIDDLEWARE (BODY PARSING)
    // =========================================================================
    
    /**
     * Register JSON Body Parser Middleware
     * 
     * Configure Express.js built-in JSON body parser middleware to handle
     * incoming requests with JSON payloads. This middleware is included for
     * future extensibility even though the current hello endpoint doesn't
     * require JSON parsing.
     * 
     * JSON Parser Features:
     * - Automatic JSON parsing for Content-Type: application/json
     * - Built-in error handling for malformed JSON
     * - Configurable size limits for request bodies
     * - Integration with Express.js 5.1.0 performance optimizations
     * 
     * Configuration Options:
     * - Uses default settings optimized for most applications
     * - Automatic content-type detection and validation
     * - Error handling for JSON parsing failures
     * 
     * Future Extensibility:
     * This middleware enables future API endpoints that accept JSON payloads
     * without requiring application reconfiguration.
     * 
     * @middleware express.json()
     * @position 2
     * @purpose JSON request body parsing for future API extensibility
     */
    app.use(express.json());
    
    /**
     * Register URL-Encoded Body Parser Middleware
     * 
     * Configure Express.js built-in URL-encoded body parser middleware to handle
     * incoming requests with form data payloads. This middleware is included for
     * future extensibility to support form submissions or URL-encoded data.
     * 
     * URL-Encoded Parser Features:
     * - Automatic parsing for Content-Type: application/x-www-form-urlencoded
     * - Extended parsing option set to false for simplified parsing
     * - Built-in error handling for malformed form data
     * - Memory-efficient parsing with configurable limits
     * 
     * Configuration Options:
     * - extended: false - Uses querystring library for simpler parsing
     * - Provides adequate functionality for most form handling scenarios
     * - Optimized for performance with minimal memory overhead
     * 
     * Security Considerations:
     * - extended: false setting prevents prototype pollution vulnerabilities
     * - Simplified parsing reduces attack surface
     * - Built-in size limits prevent DoS attacks
     * 
     * @middleware express.urlencoded()
     * @position 3
     * @purpose URL-encoded form data parsing for future extensibility
     */
    app.use(express.urlencoded({ extended: false }));
    
    // =========================================================================
    // STEP 3: CENTRAL API ROUTER (ROUTE HANDLERS)
    // =========================================================================
    
    /**
     * Mount Central API Router at Root Path
     * 
     * Mount the central API router at the root path ('/') to make all feature
     * endpoints available at the application root. The router aggregates all
     * feature routers including the hello endpoint and health check functionality.
     * 
     * Router Features:
     * - GET /hello endpoint returning "Hello world" message
     * - GET /health endpoint providing comprehensive health status
     * - Proper HTTP method validation and error responses
     * - Integration with centralized error handling middleware
     * 
     * Mounting Strategy:
     * Mounting at root path ('/') provides clean URLs without additional prefixes:
     * - http://localhost:3000/hello (not /api/hello)
     * - http://localhost:3000/health (not /api/health)
     * 
     * This design aligns with the tutorial's educational objectives while
     * maintaining flexibility for future API versioning if needed.
     * 
     * Route Processing:
     * The router handles all route matching, HTTP method validation, and
     * business logic processing. It integrates seamlessly with the middleware
     * stack for consistent error handling and logging.
     * 
     * @middleware router
     * @position 4
     * @purpose Central API routing for all application endpoints
     * @path / (root path)
     */
    app.use('/', router);
    
    // =========================================================================
    // STEP 4: ERROR HANDLING MIDDLEWARE (LAST)
    // =========================================================================
    
    /**
     * Register Error Handler Middleware as Last Middleware
     * 
     * The error handler middleware is registered as the last middleware in the
     * stack to ensure comprehensive error handling for all errors thrown by
     * previous middleware or route handlers. This positioning guarantees that
     * all application errors are processed consistently.
     * 
     * Error Handler Features:
     * - Operational vs programmer error classification
     * - Environment-aware error response formatting
     * - Comprehensive error logging with structured metadata
     * - Security-focused error response generation
     * - Integration with centralized logging infrastructure
     * 
     * Positioning Rationale:
     * Express.js error handling middleware must be registered after all other
     * middleware and routes to properly catch errors. The error handler serves
     * as the final safety net for all application errors.
     * 
     * Error Processing Flow:
     * 1. Previous middleware or route throws error
     * 2. Express.js automatically calls error handler
     * 3. Error handler logs error details
     * 4. Error handler generates appropriate response
     * 5. Response sent to client with proper status code
     * 
     * Security Considerations:
     * - Production environment hides sensitive error details
     * - Development environment provides detailed error information
     * - Prevents information leakage through error responses
     * - Consistent error response format across all endpoints
     * 
     * @middleware errorHandler
     * @position 5 (Last)
     * @purpose Centralized error handling and response generation
     */
    app.use(errorHandler);
    
    // =========================================================================
    // RETURN CONFIGURED APPLICATION INSTANCE
    // =========================================================================
    
    /**
     * Return Fully Configured Express Application Instance
     * 
     * Return the Express application instance that has been fully configured
     * with all necessary middleware, routing, and error handling components.
     * The application is ready for server binding and request processing.
     * 
     * Application State:
     * - All middleware registered in optimal order
     * - Central API router mounted with all feature endpoints
     * - Comprehensive error handling configured
     * - Request logging and observability enabled
     * - Future extensibility supported through body parsers
     * 
     * Ready for Integration:
     * The returned application instance is ready for integration with:
     * - HTTP server binding (server.js)
     * - Testing frameworks (Jest, Supertest)
     * - Development tools (nodemon, debugging)
     * - Production deployment (PM2, Docker, cloud platforms)
     * 
     * @returns {express.Application} Fully configured Express application instance
     */
    return app;
}

// =============================================================================
// APPLICATION INITIALIZATION
// =============================================================================

/**
 * Initialize and Configure Express Application
 * 
 * Execute the configureApp function to initialize the Express application
 * with all required middleware, routing, and error handling components.
 * The initialization is performed at module load time to ensure the
 * application is ready for use when imported.
 * 
 * Initialization Process:
 * 1. Execute configureApp() function
 * 2. Register all middleware in proper order
 * 3. Mount central API router with feature endpoints
 * 4. Configure comprehensive error handling
 * 5. Prepare application for export and server binding
 * 
 * Configuration Validation:
 * The initialization process includes implicit validation through Express.js
 * that ensures all middleware and routes are properly configured. Any
 * configuration errors will be thrown during initialization.
 * 
 * Environment Awareness:
 * The application configuration is aware of the runtime environment and
 * adjusts behavior accordingly for optimal performance and security.
 * 
 * @constant {express.Application} configuredApp - Fully configured Express application
 */
const configuredApp = configureApp();

// =============================================================================
// DEVELOPMENT LOGGING
// =============================================================================

/**
 * Development Environment Logging
 * 
 * Provide informational logging about the application configuration when
 * running in development mode. This logging helps developers understand
 * the application state and configuration during development and debugging.
 * 
 * Logging Information:
 * - Application initialization confirmation
 * - Middleware stack configuration status
 * - Environment-specific behavior indication
 * - Available endpoints and features
 * 
 * Environment Guard:
 * Logging is only active in development environment to prevent unnecessary
 * log output in production and test environments.
 * 
 * @conditional Development environment only
 */
if (env === 'development') {
    console.log('✅ Express application initialized successfully');
    console.log('🔧 Middleware stack configured:');
    console.log('   1. Request Logger (request/response logging)');
    console.log('   2. JSON Body Parser (application/json support)');
    console.log('   3. URL-Encoded Parser (form data support)');
    console.log('   4. Central API Router (feature endpoints)');
    console.log('   5. Error Handler (centralized error processing)');
    console.log('🌐 Available endpoints:');
    console.log('   GET /hello - Hello world message');
    console.log('   GET /health - Application health status');
    console.log(`🏃 Running in ${env} mode`);
}

// =============================================================================
// MODULE EXPORTS
// =============================================================================

/**
 * Export Configured Express Application Instance
 * 
 * Export the fully configured Express application instance as the main module
 * export, making it available for import by server.js and other modules that
 * need to access the configured application.
 * 
 * Export Features:
 * - Fully configured Express application instance
 * - All middleware registered in optimal order
 * - Central API router mounted with feature endpoints
 * - Comprehensive error handling and logging
 * - Ready for server binding and request processing
 * 
 * Integration Patterns:
 * The exported application supports multiple integration patterns:
 * 
 * 1. HTTP Server Binding (Primary Use Case):
 *    const app = require('./app.js');
 *    const server = app.listen(3000, () => {
 *      console.log('Server running on port 3000');
 *    });
 * 
 * 2. Testing Integration:
 *    const app = require('./app.js');
 *    const response = await request(app).get('/hello').expect(200);
 * 
 * 3. Custom Server Configuration:
 *    const app = require('./app.js');
 *    const http = require('http');
 *    const server = http.createServer(app);
 *    server.listen(3000);
 * 
 * 4. Advanced Configuration:
 *    const app = require('./app.js');
 *    app.set('trust proxy', 1); // Additional Express settings
 *    app.listen(process.env.PORT || 3000);
 * 
 * Application State:
 * The exported application is in a ready state with:
 * - All middleware configured and registered
 * - All routes mounted and accessible
 * - Error handling fully operational
 * - Logging and observability enabled
 * - Performance optimizations applied
 * 
 * Security Considerations:
 * - Environment-aware configuration for security
 * - Express.js 5.1.0 security enhancements enabled
 * - Proper error handling to prevent information leakage
 * - Secure middleware ordering for optimal protection
 * 
 * Performance Characteristics:
 * - Optimized middleware order for minimal overhead
 * - Express.js 5.1.0 performance improvements
 * - Efficient request processing pipeline
 * - Memory-optimized configuration
 * 
 * Quality Assurance:
 * The exported application includes comprehensive quality assurance features:
 * - Comprehensive error handling for robustness
 * - Detailed logging for observability and troubleshooting
 * - Environment-aware behavior for deployment flexibility
 * - Future extensibility through modular design
 * 
 * @exports {express.Application} app - Fully configured Express application instance
 * @see {@link https://expressjs.com/en/5x/api.html#app|Express Application API}
 * @see {@link ./middleware/index.js|Middleware Components}
 * @see {@link ./routes/index.js|Central API Router}
 * @see {@link ./config/env.js|Environment Configuration}
 * 
 * @example
 * // Basic server.js integration
 * const app = require('./app.js');
 * const { port, host } = require('./config/env.js');
 * 
 * const server = app.listen(port, host, () => {
 *   console.log(`Server running on ${host}:${port}`);
 * });
 * 
 * @example
 * // Testing integration
 * const request = require('supertest');
 * const app = require('./app.js');
 * 
 * describe('Application Tests', () => {
 *   it('should respond to hello endpoint', async () => {
 *     const response = await request(app)
 *       .get('/hello')
 *       .expect(200);
 *     expect(response.text).toBe('Hello world');
 *   });
 * });
 * 
 * @example
 * // Advanced configuration
 * const app = require('./app.js');
 * const { env } = require('./config/env.js');
 * 
 * // Environment-specific configuration
 * if (env === 'production') {
 *   app.set('trust proxy', 1);
 * }
 * 
 * // Start server
 * const server = app.listen(process.env.PORT || 3000);
 */
module.exports = {
    /**
     * Fully configured Express application instance
     * 
     * The main Express application instance configured with all necessary
     * middleware, routing, and error handling components. This instance is
     * ready for server binding and request processing.
     * 
     * Application Features:
     * - Express.js 5.1.0 with security enhancements
     * - Comprehensive middleware stack in optimal order
     * - Central API router with feature endpoints
     * - Robust error handling and logging
     * - Environment-aware configuration
     * - Future extensibility support
     * 
     * @type {express.Application}
     * @readonly
     */
    app: configuredApp
};