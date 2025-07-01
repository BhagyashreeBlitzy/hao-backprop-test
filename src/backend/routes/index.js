/**
 * Central Routing Module for Backend API - Main Router Integration Point
 * 
 * This module serves as the central composition point for all backend API routes,
 * aggregating and mounting all feature routers (hello endpoint, healthcheck) into
 * a single Express Router instance for integration with the main Express application.
 * 
 * The router provides modular, maintainable route structure with clean separation
 * of concerns, supporting future extensibility through standardized router mounting
 * patterns. It integrates with centralized error handling and request logging
 * middleware while maintaining stateless design for horizontal scalability.
 * 
 * Features:
 * - Centralized router composition for all API endpoints
 * - Modular mounting of feature routers at standardized paths
 * - Support for future extensibility through consistent patterns
 * - Integration with Express.js 5.1.0 routing capabilities
 * - Stateless design compatible with load balancers and clustering
 * - Clean separation between router integration and feature implementation
 * 
 * Router Structure:
 * - GET /hello - Hello world endpoint (via helloRouter)
 * - GET /health - Application health check endpoint (via healthcheckRouter)
 * - Future endpoints can be added through additional router mounting
 * 
 * Usage:
 * // Import and mount in main Express application
 * const { router: apiRouter } = require('./routes');
 * app.use('/', apiRouter);
 * 
 * Technical Requirements:
 * - Express.js 5.1.0 compatibility with enhanced security features
 * - Node.js 18+ runtime support for modern JavaScript capabilities
 * - HTTP/1.1 protocol compliance with proper status codes
 * - Response time target: < 100ms for all mounted endpoints
 * - Modular architecture supporting independent feature development
 * 
 * @fileoverview Central routing module for Express.js backend API integration
 * @author Backend Development Team
 * @version 1.0.0
 * @since Node.js 18+
 * @requires express@5.1.0
 */

// External Dependencies - Express.js Framework
// Express.js 5.1.0 - Latest stable version with enhanced security features and ReDoS protection
const { Router } = require('express');

// Internal Dependencies - Feature Routers
// Import hello router with named import pattern for explicit dependency management
const { router: helloRouter } = require('./hello.js');

// Import healthcheck router from healthcheck module index for monitoring integration
const { router: healthcheckRouter } = require('../healthcheck/index.js');

/**
 * Express Router instance for main API routing
 * 
 * This router instance serves as the central composition point for all backend
 * API routes. It provides modular architecture where individual feature routers
 * are mounted at their respective paths, enabling clean separation of concerns
 * and maintainable code organization.
 * 
 * Router Configuration:
 * - Case-sensitive routing: Enabled (Express.js default)
 * - Strict routing: Disabled for path flexibility
 * - Merge parameters: Enabled for nested routing support
 * - Path normalization: Automatic trailing slash handling
 * 
 * Mounted Routes:
 * - /hello: Hello world endpoint router (HTTP GET support)
 * - /health: Application health check router (monitoring integration)
 * 
 * Security Features:
 * - Express.js 5.1.0 built-in ReDoS attack prevention
 * - path-to-regexp@8.x for secure route matching
 * - Method enforcement handled by individual feature routers
 * - Centralized error handling integration
 * 
 * Performance Characteristics:
 * - Minimal routing overhead through Express.js optimization
 * - Stateless design for horizontal scaling compatibility
 * - Efficient route matching with path-to-regexp engine
 * - Support for high concurrent request handling
 * 
 * @type {express.Router}
 */
const router = Router();

/**
 * Mount Feature Routers Function
 * 
 * This function configures the main router instance with all feature routers
 * at their respective paths. It implements the core router composition logic
 * that enables modular architecture and clean separation of concerns.
 * 
 * The function follows a standardized mounting pattern that:
 * 1. Mounts each feature router at its designated path prefix
 * 2. Ensures proper route isolation between different features
 * 3. Maintains consistent URL structure across the API
 * 4. Supports future extensibility through standardized patterns
 * 
 * Router Mounting Strategy:
 * - Path-based mounting for logical grouping of related endpoints
 * - Explicit path prefixes for clear API structure
 * - Independent error handling within each feature router
 * - Centralized composition for maintainability
 * 
 * URL Structure:
 * - /hello routes -> handled by helloRouter
 * - /health routes -> handled by healthcheckRouter
 * - Future routes -> can be added with consistent patterns
 * 
 * Error Handling Integration:
 * - Each mounted router handles its own method enforcement
 * - Errors are propagated to centralized error handling middleware
 * - Consistent error response format across all endpoints
 * - HTTP status codes managed by individual route handlers
 * 
 * @function mountFeatureRouters
 * @returns {void} Configures the router instance with all feature routers
 * 
 * @example
 * // After calling mountFeatureRouters(), the router supports:
 * // GET /hello -> returns "Hello world" (via helloRouter)
 * // GET /health -> returns application health status (via healthcheckRouter)
 * // POST /hello -> returns 405 Method Not Allowed (via helloRouter)
 */
function mountFeatureRouters() {
    // Step 1: Mount helloRouter at '/hello' path
    // This enables all hello-related endpoints to be accessible under the /hello prefix
    // The helloRouter handles GET /hello requests and method enforcement for other HTTP methods
    // Full endpoint: GET /hello -> "Hello world" response with proper headers
    router.use('/hello', helloRouter);
    
    // Step 2: Mount healthcheckRouter at '/health' path  
    // This enables health monitoring endpoints for application observability
    // The healthcheckRouter provides GET /health endpoint for load balancer health checks
    // Full endpoint: GET /health -> JSON health status with uptime and memory metrics
    router.use('/health', healthcheckRouter);
    
    // Step 3: Future Extensibility Support
    // Additional feature routers can be mounted here following the same pattern:
    // router.use('/users', userRouter);        // User management endpoints
    // router.use('/auth', authRouter);         // Authentication endpoints
    // router.use('/api/v1', apiV1Router);     // Versioned API endpoints
    // 
    // This design pattern enables:
    // - Independent development of feature modules
    // - Clean separation of routing concerns
    // - Consistent URL structure across the application
    // - Easy addition of new feature areas without modifying existing code
}

// Execute the router mounting configuration
// This call configures the router instance with all currently available feature routers
// The function is called immediately to ensure the router is properly configured
// before being exported for use in the main Express application
mountFeatureRouters();

/**
 * Named exports for the central routing module
 * 
 * The router is exported as a named export to support:
 * - Tree-shaking optimization in production builds
 * - Explicit import patterns for better maintainability
 * - Integration with main Express application via standardized import
 * - Clear dependency tracking and module resolution
 * 
 * Export Structure:
 * - router: Configured Express Router instance with all feature routes mounted
 * 
 * Integration Pattern:
 * ```javascript
 * // In main Express application (app.js or server.js)
 * const { router: apiRouter } = require('./routes');
 * app.use('/', apiRouter);  // Mount at root level
 * 
 * // Alternative mounting patterns:
 * app.use('/api', apiRouter);     // Mount under /api prefix
 * app.use('/v1', apiRouter);      // Mount under /v1 prefix
 * ```
 * 
 * Router Capabilities:
 * - GET /hello: Returns "Hello world" with proper HTTP headers
 * - GET /health: Returns application health status in JSON format
 * - Method enforcement: 405 errors for unsupported HTTP methods
 * - Error integration: Centralized error handling for all endpoints
 * - Monitoring support: Health check endpoint for load balancers
 * 
 * Performance Characteristics:
 * - Response time: < 100ms target for all endpoints
 * - Memory usage: Minimal overhead through stateless design
 * - Concurrency: Unlimited concurrent requests (Node.js event loop)
 * - Scalability: Horizontal scaling compatible through stateless architecture
 * 
 * Security Features:
 * - Express.js 5.1.0 security enhancements (ReDoS protection)
 * - Method enforcement through individual feature routers
 * - Consistent error handling preventing information disclosure
 * - No authentication required (public endpoints for tutorial purposes)
 */
module.exports = {
    /**
     * Main API router instance with all feature endpoints configured
     * 
     * This router provides the complete API surface for the backend application,
     * including hello world functionality and health monitoring capabilities.
     * 
     * Mounted Endpoints:
     * - GET /hello: Tutorial application primary endpoint
     * - GET /health: Application monitoring and health check endpoint
     * 
     * Router Features:
     * - Modular architecture with feature-based route organization
     * - Centralized composition for maintainable code structure
     * - Consistent error handling across all endpoints
     * - Future extensibility through standardized mounting patterns
     * 
     * @type {express.Router}
     */
    router
};