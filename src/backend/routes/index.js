// External imports
const { Router } = require('express'); // v5.1.0 - Express Router constructor for defining the central router and mounting child routers

// Internal imports
const { helloRouter } = require('./hello.js'); // Provides the /hello endpoint router, handling GET requests and method filtering for /hello

/**
 * Central Express Router Module
 * 
 * This module serves as the central aggregation point for all route modules in the Node.js tutorial application.
 * It implements a modular routing architecture that demonstrates production-ready patterns for organizing
 * and mounting endpoint routers in Express.js applications.
 * 
 * Key responsibilities:
 * - Aggregate all endpoint-specific routers into a single router instance
 * - Provide a clean separation of concerns between different API endpoints
 * - Enable easy extension for additional endpoints and route modules
 * - Maintain educational clarity while demonstrating scalable routing patterns
 * 
 * Architecture Pattern:
 * This follows the Express Router Aggregator Module pattern, where individual route modules
 * (like hello.js) handle specific endpoints, and this central module mounts them at appropriate
 * paths for use by the main Express application.
 * 
 * Educational Value:
 * Demonstrates best practices for organizing routes in a modular Node.js/Express.js application,
 * supporting both learning objectives and production-ready architecture patterns.
 */

/**
 * Creates and configures the central Express router instance.
 * 
 * Initializes a new Express Router and mounts all available endpoint routers
 * at their designated paths. This function implements the core routing aggregation
 * logic that enables modular endpoint organization.
 * 
 * Current endpoint routers mounted:
 * - helloRouter: Handles /hello endpoint with GET support and method filtering
 * 
 * Future extensibility:
 * Additional routers can be easily added by importing them and mounting at
 * appropriate paths (e.g., /users, /status, /api/v1, etc.).
 * 
 * @returns {Object} Configured Express Router instance with all endpoint routers mounted
 */
function createRouter() {
    // Create a new Express Router instance for central route aggregation
    const router = Router();
    
    // Mount the hello router to handle all /hello endpoint requests
    // The helloRouter already defines routes for '/hello' path, so mounting at '/'
    // makes the endpoint available at '/hello' in the final application
    router.use('/', helloRouter);
    
    // Future endpoint routers can be mounted here following the same pattern:
    // router.use('/users', userRouter);
    // router.use('/status', statusRouter);
    // router.use('/api/v1', apiV1Router);
    
    return router;
}

// Create the configured router instance
const router = createRouter();

// Export the central Express router with all endpoint routers mounted
// This router is designed to be imported and used by the main Express app
// (e.g., app.js) to provide all backend API routes in a single mount operation
// 
// Usage in main application:
// const routes = require('./routes');
// app.use(routes);
// 
// This approach provides:
// - Centralized route management and organization
// - Easy extension for new endpoints and route modules
// - Clear separation between application setup and route definition
// - Production-ready architecture suitable for scaling
module.exports = router;