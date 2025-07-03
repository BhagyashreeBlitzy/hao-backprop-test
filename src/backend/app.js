// External imports
const express = require('express'); // v5.1.0 - Express.js web framework for creating the application instance, middleware stack, and routing

// Internal imports
const router = require('./routes/index.js'); // Central Express router aggregating all endpoint routers (currently /hello). Mounted at the root path to provide all API routes
const { requestLogger, securityHeaders, errorHandler } = require('./middleware/index.js'); // Core middleware functions for request logging, security headers, and error handling

/**
 * Express Application Initialization Module
 * 
 * This module serves as the main Express application initialization and configuration entry point
 * for the Node.js tutorial backend. It demonstrates production-ready patterns for Express.js 5.x
 * applications while maintaining educational clarity and best practices.
 * 
 * Key Responsibilities:
 * - Initialize and configure the Express application instance
 * - Apply global middleware in the correct order for security, logging, and error handling
 * - Mount the central router that aggregates all API endpoints
 * - Register centralized error handling middleware
 * - Export the fully configured application for use by the server entry point
 * 
 * Architecture Pattern:
 * This follows the Express Application Factory pattern, where the application is created
 * and configured in a dedicated function, enabling easy testing, reuse, and extension.
 * 
 * Middleware Application Order:
 * 1. requestLogger - Logs all incoming HTTP requests for observability
 * 2. securityHeaders - Applies security headers to all responses for protection
 * 3. router - Mounts all API endpoints and routing logic
 * 4. errorHandler - Catches and processes all unhandled errors (must be last)
 * 
 * Educational Value:
 * Demonstrates best practices for Express.js application initialization, middleware
 * organization, route management, and error handling patterns suitable for both
 * learning environments and production deployments.
 */

/**
 * Creates and configures the Express application instance.
 * 
 * Initializes a new Express application with all necessary middleware, routing,
 * and error handling configured in the correct order. This function implements
 * the core application setup logic following Express.js best practices.
 * 
 * Middleware Stack Configuration:
 * 1. Request Logging: Captures all HTTP requests for monitoring and debugging
 * 2. Security Headers: Applies comprehensive security headers via helmet.js
 * 3. Route Mounting: Mounts the central router containing all API endpoints
 * 4. Error Handling: Registers centralized error processing middleware
 * 
 * Express.js 5.x Features Utilized:
 * - Enhanced error handling with automatic promise rejection forwarding
 * - Improved security with ReDoS attack prevention via path-to-regexp 8.x
 * - Modern middleware patterns with simplified async/await support
 * - Security improvements addressing CVE-2024-45590 and other vulnerabilities
 * 
 * @returns {Object} Fully configured Express application instance ready for server binding
 */
function createApp() {
    // Create a new Express application instance
    // Express 5.1.0 provides enhanced security, performance, and modern JavaScript support
    const app = express();
    
    // Disable the X-Powered-By header for security
    // This prevents Express fingerprinting and reduces information disclosure
    app.disable('x-powered-by');
    
    // Apply request logging middleware globally
    // This middleware logs all incoming HTTP requests with timing, client IP, and metadata
    // Essential for observability, debugging, and monitoring application usage
    app.use(requestLogger);
    
    // Apply security headers middleware globally
    // This middleware applies comprehensive HTTP security headers using helmet.js
    // Protects against common web vulnerabilities including XSS, clickjacking, and MIME sniffing
    app.use(securityHeaders);
    
    // Mount the central router at the root path
    // The router aggregates all endpoint routers (currently /hello) and provides
    // a clean, modular architecture for API route management
    app.use('/', router);
    
    // Register the error handler middleware as the last middleware
    // This must be the final middleware to catch all unhandled errors from the middleware stack
    // Express 5.x automatically forwards rejected promises to error handling middleware
    app.use(errorHandler);
    
    // Return the fully configured Express application instance
    return app;
}

// Create the configured Express application instance
const app = createApp();

// Export the configured Express application instance as default export
// This allows the main server entry point (e.g., server.js) to import and start the HTTP server
// Also enables easy testing by providing access to the application instance
// 
// Usage patterns:
// - Server startup: const app = require('./app'); app.listen(port);
// - Testing: const app = require('./app'); supertest(app).get('/hello').expect(200);
// - Development: Enables hot reloading and development server integration
// 
// The exported application includes:
// - Complete middleware stack with logging, security, and error handling
// - All API routes mounted and configured for request processing
// - Production-ready configuration suitable for deployment
// - Educational clarity with comprehensive documentation and best practices
module.exports = app;