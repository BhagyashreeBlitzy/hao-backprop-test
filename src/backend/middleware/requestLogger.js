// Internal imports
const { logger } = require('../utils/logger.js'); // v1.0.0 - Centralized logging utility for structured, timestamped logs

/**
 * Express middleware function for comprehensive HTTP request logging.
 * 
 * This middleware provides production-ready request logging with structured output,
 * capturing essential HTTP request metadata including method, URL, status code,
 * response time, and client information. Designed for observability, debugging,
 * and educational clarity while following Express.js best practices.
 * 
 * Features:
 * - High-resolution timing for accurate response time measurement
 * - Structured logging with consistent format across all requests
 * - Intelligent log level selection based on HTTP status codes
 * - Client IP address extraction for security monitoring
 * - Non-blocking asynchronous logging implementation
 * - Production-ready error handling and edge case management
 * 
 * @param {Object} req - Express request object containing HTTP request details
 * @param {Object} res - Express response object for HTTP response management
 * @param {Function} next - Express next function to continue middleware chain
 * @returns {void} Passes control to next middleware after attaching logging listeners
 */
function requestLogger(req, res, next) {
    // Record high-resolution start time for accurate response time calculation
    // Using process.hrtime.bigint() for nanosecond precision timing
    const startTime = process.hrtime.bigint();
    
    // Extract client IP address with fallback hierarchy for various deployment scenarios
    // Supports X-Forwarded-For header for load balancers and proxy configurations
    const clientIp = req.ip || 
                    req.connection?.remoteAddress || 
                    req.socket?.remoteAddress || 
                    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                    req.headers['x-real-ip'] ||
                    'unknown';
    
    // Attach event listener to response 'finish' event for post-response logging
    // The 'finish' event is emitted after the response has been sent completely
    res.on('finish', () => {
        try {
            // Calculate elapsed time in milliseconds with high precision
            const endTime = process.hrtime.bigint();
            const responseTime = Number((endTime - startTime) / BigInt(1000000)); // Convert nanoseconds to milliseconds
            
            // Extract essential HTTP request/response metadata
            const method = req.method || 'UNKNOWN';
            const originalUrl = req.originalUrl || req.url || '/';
            const statusCode = res.statusCode || 500;
            const userAgent = req.headers['user-agent'] || 'unknown';
            const contentLength = res.getHeader('content-length') || 0;
            
            // Create structured log message with comprehensive request information
            const logMessage = `${method} ${originalUrl} - ${statusCode} - ${responseTime}ms`;
            
            // Create metadata object for structured logging with additional context
            const logMetadata = {
                method: method,
                url: originalUrl,
                statusCode: statusCode,
                responseTime: responseTime,
                clientIp: clientIp,
                userAgent: userAgent,
                contentLength: contentLength,
                timestamp: new Date().toISOString(),
                // Add request ID if available (useful for correlation in production)
                requestId: req.headers['x-request-id'] || req.id || null
            };
            
            // Intelligent log level selection based on HTTP status code ranges
            // Following HTTP status code semantics for appropriate log levels
            if (statusCode >= 500) {
                // Server errors (5xx) - Critical issues requiring immediate attention
                logger.error(logMessage, logMetadata);
            } else if (statusCode >= 400) {
                // Client errors (4xx) - Warning level for client-side issues
                logger.warn(logMessage, logMetadata);
            } else {
                // Successful requests (2xx, 3xx) - Information level for normal operation
                logger.info(logMessage, logMetadata);
            }
            
        } catch (loggingError) {
            // Handle any errors in the logging process to prevent middleware chain disruption
            // Log the error using the error logger to maintain observability
            logger.error('Request logging error occurred', {
                error: loggingError.message,
                stack: loggingError.stack,
                originalRequest: {
                    method: req.method,
                    url: req.originalUrl || req.url,
                    timestamp: new Date().toISOString()
                }
            });
        }
    });
    
    // Handle response error events to ensure logging even in error scenarios
    res.on('error', (error) => {
        try {
            // Calculate response time even for errored responses
            const endTime = process.hrtime.bigint();
            const responseTime = Number((endTime - startTime) / BigInt(1000000));
            
            // Log error responses with appropriate context
            logger.error(`${req.method || 'UNKNOWN'} ${req.originalUrl || req.url || '/'} - ERROR - ${responseTime}ms`, {
                method: req.method || 'UNKNOWN',
                url: req.originalUrl || req.url || '/',
                responseTime: responseTime,
                clientIp: clientIp,
                error: error.message,
                errorStack: error.stack,
                timestamp: new Date().toISOString()
            });
        } catch (errorLoggingError) {
            // Final fallback error handling to prevent any logging errors from affecting the application
            logger.error('Critical error in request logger error handler', {
                error: errorLoggingError.message,
                originalError: error.message,
                timestamp: new Date().toISOString()
            });
        }
    });
    
    // Pass control to the next middleware function in the Express middleware chain
    // This ensures the request logging middleware doesn't block request processing
    next();
}

// Export the requestLogger middleware function for use in Express application setup
// Named export pattern supports ES6 destructuring imports: { requestLogger }
module.exports = { requestLogger };