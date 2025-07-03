// External imports
const helmet = require('helmet'); // v7.0.0 - Industry-standard Express middleware for setting comprehensive HTTP security headers

// Internal imports
const { logger } = require('../../src/backend/utils/logger.js'); // Provides structured logging for security header application, error reporting, and operational observability

// Global security headers configuration
// Comprehensive set of HTTP security headers to mitigate common web vulnerabilities
// and demonstrate secure Express.js middleware patterns for production readiness
const SECURITY_HEADERS_CONFIG = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '0',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'no-referrer',
    'Permissions-Policy': 'geolocation=(), microphone=()',
    'Cross-Origin-Resource-Policy': 'same-origin'
};

/**
 * Express middleware function that applies a comprehensive set of HTTP security headers 
 * to all outgoing responses. Uses helmet for baseline headers and applies additional 
 * custom headers as needed. Logs header application and errors for observability.
 * 
 * This middleware provides production-ready security header enforcement suitable for 
 * educational demonstration and reference implementation. It combines industry-standard 
 * helmet.js security headers with custom header configuration to demonstrate secure 
 * Express.js middleware patterns.
 * 
 * Security Headers Applied:
 * - X-Content-Type-Options: Prevents MIME type sniffing attacks
 * - X-Frame-Options: Prevents clickjacking by denying iframe embedding
 * - X-XSS-Protection: Disables legacy XSS protection (modern CSP preferred)
 * - Strict-Transport-Security: Enforces HTTPS connections (when applicable)
 * - Referrer-Policy: Controls referrer information sent with requests
 * - Permissions-Policy: Restricts access to browser features
 * - Cross-Origin-Resource-Policy: Controls cross-origin resource sharing
 * 
 * @param {Object} req - Express request object containing client request data
 * @param {Object} res - Express response object for setting headers and sending responses
 * @param {Function} next - Express next middleware function to continue the middleware chain
 * @returns {void} Calls next() after setting headers; does not return a value
 */
function securityHeaders(req, res, next) {
    try {
        // Step 1: Invoke helmet() middleware to set baseline security headers
        // Helmet provides comprehensive security header defaults including:
        // - Content-Security-Policy, X-DNS-Prefetch-Control, Expect-CT, etc.
        // - Express.js 5.x compatible security enhancements
        // - CVE-2024-45590 mitigation and ReDoS attack prevention
        helmet({
            // Configure helmet with production-ready defaults
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                    connectSrc: ["'self'"],
                    fontSrc: ["'self'"],
                    objectSrc: ["'none'"],
                    mediaSrc: ["'self'"],
                    frameSrc: ["'none'"],
                },
            },
            crossOriginEmbedderPolicy: false, // Avoid breaking compatibility for tutorial context
            crossOriginOpenerPolicy: { policy: "same-origin" },
            crossOriginResourcePolicy: { policy: "same-origin" },
            dnsPrefetchControl: { allow: false },
            frameguard: { action: 'deny' },
            hidePoweredBy: true,
            hsts: {
                maxAge: 31536000,
                includeSubDomains: true,
                preload: false
            },
            ieNoOpen: true,
            noSniff: true,
            originAgentCluster: true,
            permittedCrossDomainPolicies: false,
            referrerPolicy: { policy: "no-referrer" },
            xssFilter: false // Disabled as per modern security practices
        })(req, res, (helmetError) => {
            if (helmetError) {
                // Log helmet middleware error but continue processing
                logger.error('Helmet middleware error occurred', {
                    error: helmetError.message,
                    stack: helmetError.stack,
                    method: req.method,
                    path: req.path,
                    userAgent: req.get('User-Agent'),
                    clientIp: req.ip || req.connection.remoteAddress
                });
            }
            
            try {
                // Step 2: Iterate over SECURITY_HEADERS_CONFIG and set each header on the response object
                // Apply custom security headers for educational demonstration and additional protection
                Object.entries(SECURITY_HEADERS_CONFIG).forEach(([headerName, headerValue]) => {
                    if (headerName && headerValue) {
                        res.setHeader(headerName, headerValue);
                    }
                });
                
                // Step 3: Log successful application of security headers using logger.info
                logger.info('Security headers successfully applied to response', {
                    method: req.method,
                    path: req.path,
                    statusCode: res.statusCode,
                    userAgent: req.get('User-Agent'),
                    clientIp: req.ip || req.connection.remoteAddress,
                    headersApplied: Object.keys(SECURITY_HEADERS_CONFIG).length,
                    timestamp: new Date().toISOString()
                });
                
                // Step 5: Call next() to continue the middleware chain
                next();
                
            } catch (headerError) {
                // Step 4: If an error occurs during header setting, log the error using logger.error and proceed to next middleware
                logger.error('Error occurred while setting custom security headers', {
                    error: headerError.message,
                    stack: headerError.stack,
                    method: req.method,
                    path: req.path,
                    userAgent: req.get('User-Agent'),
                    clientIp: req.ip || req.connection.remoteAddress,
                    timestamp: new Date().toISOString()
                });
                
                // Continue to next middleware even if header setting fails
                // This ensures the application remains functional while logging the issue
                next();
            }
        });
        
    } catch (outerError) {
        // Catch any errors in the outer try block (helmet initialization errors)
        logger.error('Critical error in security headers middleware initialization', {
            error: outerError.message,
            stack: outerError.stack,
            method: req.method,
            path: req.path,
            userAgent: req.get('User-Agent'),
            clientIp: req.ip || req.connection.remoteAddress,
            timestamp: new Date().toISOString()
        });
        
        // Apply basic fallback security headers if helmet fails completely
        try {
            Object.entries(SECURITY_HEADERS_CONFIG).forEach(([headerName, headerValue]) => {
                if (headerName && headerValue) {
                    res.setHeader(headerName, headerValue);
                }
            });
            
            logger.warn('Applied fallback security headers after helmet initialization failure', {
                method: req.method,
                path: req.path,
                headersApplied: Object.keys(SECURITY_HEADERS_CONFIG).length
            });
            
        } catch (fallbackError) {
            logger.error('Failed to apply fallback security headers', {
                error: fallbackError.message,
                stack: fallbackError.stack,
                method: req.method,
                path: req.path
            });
        }
        
        // Continue to next middleware to prevent application failure
        next();
    }
}

// Export the securityHeaders middleware function for use in Express applications
// This enables global security header application through app.use(securityHeaders)
// or selective application on specific routes for production-ready security
module.exports = {
    securityHeaders
};