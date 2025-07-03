// Internal imports - HTTP response helper functions for standardized API responses
const { 
    sendOk, 
    sendNotFound, 
    sendMethodNotAllowed, 
    sendServerError, 
    sendBadRequest 
} = require('./httpResponses.js'); // Express.js 5.1.0 compatible HTTP response utilities

// Internal imports - Singleton logger for consistent application-wide logging
const { logger } = require('./logger.js'); // Production-ready logging utility with configurable levels

// Central utility module that re-exports all backend utility helpers
// This barrel module provides a single import point for all utility functions and objects,
// ensuring maintainable and consistent usage throughout the backend application.
// 
// Pattern: Utility Barrel Module
// - Centralizes utility exports for scalable, maintainable code structure
// - Simplifies internal imports for routes, middleware, and other backend modules
// - Supports standardized HTTP response helpers and logging functionality
// - Designed for future extension with additional utility modules

// Export all HTTP response helper functions
// These functions provide standardized HTTP response generation with consistent
// status codes, headers, and logging for production-ready applications
module.exports = {
    // HTTP 200 OK response helper for successful requests
    sendOk,
    
    // HTTP 404 Not Found response helper for invalid routes/resources
    sendNotFound,
    
    // HTTP 405 Method Not Allowed response helper for unsupported HTTP methods
    sendMethodNotAllowed,
    
    // HTTP 500 Internal Server Error response helper for server-side errors
    sendServerError,
    
    // HTTP 400 Bad Request response helper for client-side input errors
    sendBadRequest,
    
    // Singleton logger object for consistent, structured logging throughout the backend
    // Provides info, warn, and error methods with timestamp formatting and level control
    logger
};