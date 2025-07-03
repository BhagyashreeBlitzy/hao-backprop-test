// Internal imports - Core middleware functions for Express.js application
// These middleware functions provide essential functionality for HTTP request processing,
// security, and error handling in the Node.js tutorial application

// Request logging middleware for comprehensive HTTP request tracking and observability
// Provides structured logging with timing information, client details, and request metadata
// Used globally in the Express application to monitor all incoming HTTP requests
const { requestLogger } = require('./requestLogger.js');

// Security headers middleware for comprehensive HTTP security protection
// Applies industry-standard security headers using helmet.js and custom security configurations
// Used globally in the Express application to protect against common web vulnerabilities
const { securityHeaders } = require('./securityHeaders.js');

// Error handling middleware for centralized error processing and standardized error responses
// Handles all unhandled errors in the Express middleware stack with secure error reporting
// Used as the final middleware in the Express application to catch and process all errors
const { errorHandler } = require('./errorHandler.js');

/**
 * Middleware Barrel Export Module
 * 
 * This module implements the "Middleware Barrel Export" pattern by aggregating and re-exporting
 * all core middleware functions used in the Node.js tutorial application. This centralized
 * approach provides several benefits:
 * 
 * 1. **Maintainability**: Single point of import for all middleware reduces dependency complexity
 * 2. **Modularity**: Clean separation of concerns with each middleware in its own file
 * 3. **Scalability**: Easy to add new middleware by importing and re-exporting here
 * 4. **Educational Clarity**: Demonstrates best practices for middleware organization
 * 5. **Production Readiness**: Follows industry standards for Express.js middleware management
 * 
 * Usage Pattern:
 * ```javascript
 * // In app.js or server.js
 * const { requestLogger, securityHeaders, errorHandler } = require('./middleware');
 * 
 * // Apply middleware in correct order
 * app.use(requestLogger);    // First: Request logging
 * app.use(securityHeaders);  // Second: Security headers
 * // ... other middleware and routes ...
 * app.use(errorHandler);     // Last: Error handling
 * ```
 * 
 * Middleware Application Order:
 * 1. requestLogger - Logs all incoming requests for observability
 * 2. securityHeaders - Applies security headers to all responses
 * 3. [Application routes and business logic middleware]
 * 4. errorHandler - Catches and processes all unhandled errors
 * 
 * This pattern supports both educational objectives and production-ready architecture
 * by demonstrating proper middleware organization while maintaining clear, maintainable code.
 */

// Export all core middleware functions as named exports
// This enables destructuring imports: const { requestLogger, securityHeaders, errorHandler } = require('./middleware')
// Each export maintains its original function signature and behavior while being aggregated here

// Request logging middleware export
// Provides HTTP request/response logging with timing, client IP, and comprehensive metadata
// Essential for observability, debugging, and monitoring in development and production environments
module.exports = {
    requestLogger,
    
    // Security headers middleware export
    // Applies comprehensive HTTP security headers including helmet.js baseline security
    // Critical for protecting against common web vulnerabilities like XSS, clickjacking, and MIME sniffing
    securityHeaders,
    
    // Error handling middleware export
    // Centralized error processing with secure error responses and comprehensive logging
    // Must be used as the final middleware in the Express application to catch all errors
    errorHandler
};

/**
 * Extensibility Notes:
 * 
 * This middleware index can be easily extended to include additional middleware as the application grows:
 * 
 * Future Middleware Additions:
 * - Body parsing middleware (express.json(), express.urlencoded())
 * - CORS middleware for cross-origin resource sharing
 * - Rate limiting middleware for API protection
 * - Authentication middleware for protected routes
 * - Compression middleware for response optimization
 * - Static file serving middleware
 * - Session management middleware
 * - API versioning middleware
 * 
 * Extension Pattern:
 * ```javascript
 * const { newMiddleware } = require('./newMiddleware.js');
 * 
 * module.exports = {
 *     requestLogger,
 *     securityHeaders,
 *     errorHandler,
 *     newMiddleware  // Add new middleware here
 * };
 * ```
 * 
 * This pattern maintains backwards compatibility while enabling progressive enhancement
 * of the middleware stack as application requirements evolve.
 */