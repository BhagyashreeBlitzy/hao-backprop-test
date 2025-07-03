// External imports
const helmet = require('helmet'); // ^7.0.0 - Industry-standard Express middleware for setting comprehensive HTTP security headers

// Internal imports
const { logger } = require('../utils'); // Production-ready logging utility with info, warn, and error methods

// Global security headers configuration object
// Contains custom HTTP security headers that extend helmet's baseline security
// Each header is specifically configured for production-ready security best practices
const SECURITY_HEADERS_CONFIG = {
    // Prevents browsers from MIME-type sniffing responses away from declared content-type
    // Helps prevent XSS attacks via malicious file uploads or content injection
    'X-Content-Type-Options': 'nosniff',
    
    // Prevents page from being embedded in frames, iframes, or objects
    // Protects against clickjacking attacks by denying frame embedding entirely
    'X-Frame-Options': 'DENY',
    
    // Disables legacy XSS protection in modern browsers
    // Set to 0 as recommended by OWASP due to potential bypass vulnerabilities
    'X-XSS-Protection': '0',
    
    // Enforces HTTPS connections and prevents protocol downgrade attacks
    // Instructs browsers to only communicate with server over HTTPS for 1 year
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    
    // Controls referrer information sent when navigating away from the page
    // 'no-referrer' prevents any referrer information from being sent
    'Referrer-Policy': 'no-referrer',
    
    // Controls access to browser features and APIs
    // Restricts geolocation and microphone access to prevent unauthorized usage
    'Permissions-Policy': 'geolocation=(), microphone=()',
    
    // Restricts how resources can be loaded from other origins
    // 'same-origin' allows resources only from the same origin
    'Cross-Origin-Resource-Policy': 'same-origin'
};

/**
 * Express middleware function that sets standard HTTP security headers on all outgoing responses.
 * 
 * This middleware implements production-ready security best practices by:
 * 1. Applying helmet.js baseline security headers for comprehensive protection
 * 2. Adding custom security headers from SECURITY_HEADERS_CONFIG
 * 3. Logging successful header application for observability
 * 4. Handling errors gracefully with appropriate logging
 * 
 * Security Headers Applied:
 * - Content Security Policy (via helmet)
 * - X-Content-Type-Options: nosniff
 * - X-Frame-Options: DENY
 * - X-XSS-Protection: 0 (disabled per OWASP recommendations)
 * - Strict-Transport-Security: max-age=31536000; includeSubDomains
 * - Referrer-Policy: no-referrer
 * - Permissions-Policy: geolocation=(), microphone=()
 * - Cross-Origin-Resource-Policy: same-origin
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object  
 * @param {Function} next - Express next middleware function
 * @returns {void} Calls next() after setting headers; does not return a value
 */
function securityHeaders(req, res, next) {
    try {
        // Step 1: Apply helmet middleware for baseline security headers
        // Helmet provides comprehensive security headers including CSP, HSTS, and others
        // This creates a solid foundation of security headers following industry best practices
        helmet()(req, res, (err) => {
            if (err) {
                // Log helmet middleware error and continue with custom headers
                logger.error('Helmet middleware encountered an error', {
                    error: err.message,
                    stack: err.stack,
                    path: req.path,
                    method: req.method
                });
                
                // Continue processing despite helmet error to ensure basic security headers are still applied
            }
            
            try {
                // Step 2: Apply custom security headers from SECURITY_HEADERS_CONFIG
                // These headers extend helmet's baseline security with additional protections
                // Each header is individually set to ensure granular control and error handling
                Object.entries(SECURITY_HEADERS_CONFIG).forEach(([headerName, headerValue]) => {
                    try {
                        // Set individual security header on response object
                        res.setHeader(headerName, headerValue);
                    } catch (headerError) {
                        // Log individual header setting error but continue with remaining headers
                        logger.warn(`Failed to set security header: ${headerName}`, {
                            headerName,
                            headerValue,
                            error: headerError.message,
                            path: req.path,
                            method: req.method
                        });
                    }
                });
                
                // Step 3: Log successful application of security headers for observability
                // This provides visibility into security middleware operation for monitoring
                logger.info('Security headers successfully applied', {
                    path: req.path,
                    method: req.method,
                    userAgent: req.get('User-Agent'),
                    headersCount: Object.keys(SECURITY_HEADERS_CONFIG).length,
                    timestamp: new Date().toISOString()
                });
                
                // Step 4: Continue to next middleware in the chain
                // Security headers are now applied and logged, ready for request processing
                next();
                
            } catch (customHeaderError) {
                // Step 5: Handle errors during custom header application
                // Log error details for debugging while ensuring request continues
                logger.error('Error occurred during custom security header application', {
                    error: customHeaderError.message,
                    stack: customHeaderError.stack,
                    path: req.path,
                    method: req.method,
                    timestamp: new Date().toISOString()
                });
                
                // Continue to next middleware even if custom headers fail
                // This ensures the application remains functional despite security header issues
                next();
            }
        });
        
    } catch (middlewareError) {
        // Step 6: Handle any top-level middleware errors
        // This catches any errors not handled by the inner try-catch blocks
        logger.error('Critical error in security headers middleware', {
            error: middlewareError.message,
            stack: middlewareError.stack,
            path: req.path,
            method: req.method,
            timestamp: new Date().toISOString()
        });
        
        // Continue to next middleware to prevent application failure
        // Security headers may be incomplete but application functionality is preserved
        next();
    }
}

// Export the security headers middleware function for use in Express application
// This enables global application of security headers through app.use(securityHeaders)
module.exports = {
    securityHeaders
};