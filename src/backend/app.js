/**
 * Main Express Application Initialization Module
 * 
 * This module serves as the core Express application setup and configuration point,
 * initializing the Express app instance with all required middleware, routers, and
 * error handling components in the correct order. It provides a robust, maintainable,
 * and observable server setup following Node.js/Express.js best practices.
 * 
 * The application is designed for import by server.js for HTTP server binding and
 * supports modular architecture with centralized middleware management, comprehensive
 * request/response logging, and standardized error handling across all endpoints.
 * 
 * Features:
 * - Express.js 5.1.0 application instance with latest security enhancements
 * - Comprehensive middleware stack configured in optimal order
 * - Centralized API router mounting for '/hello' and '/health' endpoints
 * - Request/response logging for observability and troubleshooting
 * - Centralized error handling with environment-aware error responses
 * - JSON and URL-encoded body parsing for future extensibility
 * - Stateless design compatible with horizontal scaling
 * - Environment-aware configuration for development and production
 * 
 * Middleware Execution Order:
 * 1. requestLogger - Comprehensive request/response logging (first)
 * 2. express.json() - JSON body parsing middleware (future extensibility)
 * 3. express.urlencoded() - URL-encoded body parsing (future extensibility)
 * 4. Central API router - Mounts '/hello' and '/health' endpoints
 * 5. errorHandler - Centralized error handling and response formatting (last)
 * 
 * Technical Requirements:
 * - Express.js 5.1.0 with ReDoS protection and security enhancements
 * - Node.js 18+ runtime environment for modern JavaScript features
 * - HTTP/1.1 protocol compliance with proper status codes and headers
 * - Response time target: < 100ms for '/hello' endpoint
 * - Memory efficiency through stateless request processing
 * - Comprehensive error handling with secure error responses
 * 
 * @fileoverview Main Express application configuration and middleware setup
 * @author Backend Development Team
 * @version 1.0.0
 * @since Node.js 18+
 * @requires express@5.1.0
 */

// External Dependencies
// Express.js 5.1.0 - Fast, unopinionated, minimalist web framework for Node.js
// Latest stable version with enhanced security features and ReDoS attack prevention
const express = require('express'); // v5.1.0

// Internal Dependencies - Middleware Components
// Import requestLogger and errorHandler from centralized middleware module
const { requestLogger, errorHandler } = require('./middleware/index.js');

// Internal Dependencies - Routing Components  
// Import central API router that aggregates all feature routers
const { router } = require('./routes/index.js');

// Internal Dependencies - Configuration Components
// Import resolved environment configuration for environment-aware setup
const { env } = require('./config/env.js');

/**
 * Configures the Express application instance with all required middleware,
 * routers, and error handlers in the optimal order for performance, security,
 * and maintainability.
 * 
 * This function implements the core application configuration logic following
 * Express.js best practices and middleware ordering principles. It ensures:
 * - Request logging is captured for all requests (success and error)
 * - Body parsing middleware is available for future extensibility
 * - API routes are properly mounted and accessible
 * - All errors are caught and handled by centralized error middleware
 * 
 * Middleware Configuration Strategy:
 * The middleware stack is configured to maximize observability, maintainability,
 * and error handling while supporting future application growth. Each middleware
 * component serves a specific purpose in the request processing pipeline.
 * 
 * Security Considerations:
 * - Express.js 5.1.0 provides built-in ReDoS attack prevention
 * - Error handler prevents stack trace leakage in production
 * - Request logger captures security-relevant request details
 * - Body parsing limits prevent DoS attacks through request size
 * 
 * Performance Optimization:
 * - Minimal middleware overhead through selective middleware registration
 * - Stateless design enables horizontal scaling and load balancing
 * - Efficient routing through Express.js 5.1.0 path-to-regexp engine
 * - Memory-efficient request processing without persistent state
 * 
 * @function configureApp
 * @returns {express.Application} The fully configured Express application instance
 * 
 * @example
 * // Usage in server.js
 * const { app } = require('./app.js');
 * const server = app.listen(3000, () => {
 *   console.log('Server running on port 3000');
 * });
 */
function configureApp() {
    // Step 1: Create the Express application instance
    // Express.js 5.1.0 provides enhanced security and performance features
    // including ReDoS protection and improved error handling for async/await
    const app = express();
    
    // Step 2: Configure request logging middleware (FIRST MIDDLEWARE)
    // Register requestLogger as the first middleware to ensure comprehensive
    // coverage of all incoming requests, including those that result in errors
    // or are handled by other middleware. This provides complete observability
    // of the request/response cycle for troubleshooting and monitoring.
    app.use(requestLogger);
    
    // Step 3: Configure JSON body parsing middleware (FUTURE EXTENSIBILITY)
    // Register express.json() middleware to parse JSON request bodies for
    // future extensibility when POST, PUT, or PATCH endpoints are added.
    // This middleware is included now to prevent breaking changes when
    // expanding the API surface beyond the current '/hello' GET endpoint.
    app.use(express.json());
    
    // Step 4: Configure URL-encoded body parsing middleware (FUTURE EXTENSIBILITY)
    // Register express.urlencoded() middleware with extended: false for basic
    // URL-encoded form data parsing. This supports future form-based endpoints
    // while maintaining security through simplified parsing without nested objects.
    app.use(express.urlencoded({ extended: false }));
    
    // Step 5: Mount the central API router at root path
    // The router aggregates all feature routers including:
    // - '/hello' endpoint for the main tutorial functionality
    // - '/health' endpoint for application health monitoring
    // Mounting at root path '/' provides clean URL structure without prefixes
    app.use('/', router);
    
    // Step 6: Configure centralized error handling middleware (LAST MIDDLEWARE)
    // Register errorHandler as the final middleware to catch all errors thrown
    // in the Express pipeline. This must be registered AFTER all routes and
    // other middleware to ensure comprehensive error handling coverage.
    // The error handler provides standardized error responses and secure
    // error logging without exposing sensitive information to clients.
    app.use(errorHandler);
    
    // Step 7: Return the fully configured Express application instance
    // The configured app is ready for server binding in server.js with all
    // middleware properly registered and all routes accessible
    return app;
}

// Initialize the Express application with full configuration
// This creates the app instance that will be exported for use in server.js
// The configuration is applied immediately to ensure the app is ready for use
const app = configureApp();

// Environment-aware application logging
// Log the application initialization status with environment information
// This provides visibility into the application startup process and configuration
if (env === 'development') {
    // Development environment: More verbose logging for debugging
    console.log(`[INFO] Express application initialized successfully`);
    console.log(`[INFO] Environment: ${env}`);
    console.log(`[INFO] Middleware stack configured:`);
    console.log(`[INFO] - requestLogger (request/response logging)`);
    console.log(`[INFO] - express.json() (JSON body parsing)`);
    console.log(`[INFO] - express.urlencoded() (URL-encoded body parsing)`);
    console.log(`[INFO] - router (API routes: /hello, /health)`);
    console.log(`[INFO] - errorHandler (centralized error handling)`);
    console.log(`[INFO] Application ready for server binding`);
} else {
    // Production/test environment: Minimal logging for performance
    console.log(`[INFO] Express application initialized - Environment: ${env}`);
}

/**
 * Named exports for the Express application module
 * 
 * Exports the fully configured Express application instance as a named export
 * to support tree-shaking optimization and explicit import patterns. The app
 * instance is ready for HTTP server binding with all middleware configured.
 * 
 * Export Structure:
 * - app: Configured Express application instance
 * 
 * Integration Pattern:
 * ```javascript
 * // In server.js
 * const { app } = require('./app.js');
 * const { port, host } = require('./config/env.js');
 * 
 * const server = app.listen(port, host, () => {
 *   console.log(`Server running on http://${host}:${port}`);
 * });
 * ```
 * 
 * Application Capabilities:
 * - GET /hello: Returns "Hello world" with proper HTTP headers
 * - GET /health: Returns application health status in JSON format
 * - Request logging: Comprehensive request/response logging for observability
 * - Error handling: Centralized error handling with environment-aware responses
 * - Body parsing: JSON and URL-encoded parsing for future extensibility
 * - Method enforcement: 405 errors for unsupported HTTP methods on endpoints
 * 
 * Performance Characteristics:
 * - Response time: < 100ms target for '/hello' endpoint
 * - Memory usage: Minimal overhead through stateless design
 * - Concurrency: Unlimited concurrent requests via Node.js event loop
 * - Scalability: Horizontal scaling compatible through stateless architecture
 * 
 * Security Features:
 * - Express.js 5.1.0 ReDoS attack prevention
 * - Secure error handling without stack trace exposure in production
 * - Request logging for security monitoring and audit trails
 * - Method enforcement preventing unauthorized HTTP method usage
 */
module.exports = {
    /**
     * Fully configured Express application instance ready for server binding
     * 
     * This application instance includes:
     * - Complete middleware stack configured in optimal order
     * - All API routes mounted and accessible (/hello, /health)
     * - Comprehensive request/response logging for observability
     * - Centralized error handling with secure error responses
     * - JSON and URL-encoded body parsing for future extensibility
     * - Environment-aware configuration for development and production
     * 
     * The app instance is stateless and compatible with:
     * - HTTP server binding (http.createServer or app.listen)
     * - Load balancers and reverse proxies
     * - Container orchestration platforms
     * - Horizontal scaling architectures
     * - Development and production environments
     * 
     * @type {express.Application}
     */
    app
};