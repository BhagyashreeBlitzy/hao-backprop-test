/**
 * Central Export Hub for Backend Utility Modules
 * 
 * This module serves as the single point of entry for all backend utility classes
 * and functions, providing a centralized export hub for error handling and logging
 * utilities throughout the backend codebase. It re-exports all utility classes and
 * functions to ensure convenient, consistent, and maintainable imports across the
 * entire backend application.
 * 
 * The centralized approach supports best practices in modularity and code organization
 * by providing a single import point for all utility functionality, reducing dependency
 * coupling and improving maintainability across the backend services.
 * 
 * Features:
 * - Central export hub for all backend utility modules
 * - Re-exports custom error types for standardized error handling
 * - Re-exports logging utilities for consistent observability
 * - Supports convenient import patterns throughout the backend
 * - Maintains clear separation of concerns between utility modules
 * - Enables tree-shaking for optimized bundle sizes
 * 
 * Requirements Addressed:
 * - Error Management: Centralizes exports for custom error types (HttpError, NotFoundError,
 *   MethodNotAllowedError, InternalServerError) supporting standardized error handling
 *   throughout the backend with proper HTTP status codes and structured error responses
 * - Monitoring and Observability: Ensures logger utility accessibility for request,
 *   error, and performance logging across all backend services for troubleshooting
 *   and health monitoring
 * - Response Generation Feature: Supports standardized error responses with proper
 *   HTTP status codes and messages for client communication and debugging by
 *   centralizing error type exports
 * 
 * Usage Examples:
 * 
 * // Import all utilities from central hub
 * import { HttpError, NotFoundError, Logger } from './utils';
 * 
 * // Use error types for structured error handling
 * throw new NotFoundError('User not found', { userId: 123 });
 * 
 * // Use logger for consistent observability
 * Logger.info('User operation completed', { userId: 123, operation: 'update' });
 * 
 * // Import specific utilities as needed
 * import { Logger } from './utils';
 * import { InternalServerError } from './utils';
 * 
 * @fileoverview Central export hub for backend utility modules
 * @version 1.0.0
 * @author Tutorial Implementation Team
 */

// =============================================================================
// IMPORTS FROM UTILITY MODULES
// =============================================================================

/**
 * Import all custom error types from errorTypes module
 * 
 * These error classes provide a consistent structure for all HTTP-related errors
 * throughout the backend application, supporting standardized error handling,
 * logging, and secure client responses. Each error type encapsulates specific
 * HTTP status codes and appropriate error messages for different failure scenarios.
 * 
 * Error Types Imported:
 * - HttpError: Base class for all HTTP-related errors with status, message, and details
 * - NotFoundError: 404 errors for missing resources or routes
 * - MethodNotAllowedError: 405 errors for unsupported HTTP methods
 * - InternalServerError: 500 errors for unexpected application failures
 */
const {
  HttpError,
  NotFoundError,
  MethodNotAllowedError,
  InternalServerError
} = require('./errorTypes.js');

/**
 * Import Logger class from logger module
 * 
 * The Logger class provides static logging methods for comprehensive observability
 * across the backend application. It supports multiple log levels (info, warn, error, debug)
 * with environment-aware output, consistent formatting, and structured logging capabilities
 * for monitoring, debugging, and operational visibility.
 * 
 * Logger Capabilities:
 * - Static logging methods with consistent formatting
 * - Environment-aware logging behavior
 * - Structured logging with timestamps and metadata
 * - Multiple log levels for different scenarios
 * - Automatic error object handling with stack traces
 */
const {
  Logger
} = require('./logger.js');

// =============================================================================
// CENTRALIZED EXPORTS
// =============================================================================

/**
 * Re-export all utility classes and functions for centralized access
 * 
 * This export pattern provides a single import point for all backend utility
 * functionality, supporting maintainable and consistent imports throughout the
 * application. It enables both individual imports and bulk imports as needed
 * by different modules.
 * 
 * Export Categories:
 * 
 * Error Management Exports:
 * - HttpError: Base HTTP error class with status, message, and details members
 * - NotFoundError: 404 error class for missing resources
 * - MethodNotAllowedError: 405 error class for unsupported methods
 * - InternalServerError: 500 error class for server failures
 * 
 * Logging and Observability Exports:
 * - Logger: Static logging class with info, warn, error, and debug methods
 * 
 * Usage Patterns:
 * 
 * // Import all utilities
 * const { HttpError, NotFoundError, Logger } = require('./utils');
 * 
 * // Import specific utilities
 * const { Logger } = require('./utils');
 * 
 * // Use in error handling middleware
 * app.use((err, req, res, next) => {
 *   if (err instanceof HttpError) {
 *     Logger.error('HTTP error occurred', { status: err.status, message: err.message });
 *     return res.status(err.status).json({ error: err.message });
 *   }
 *   next(err);
 * });
 * 
 * // Use in route handlers
 * app.get('/users/:id', (req, res, next) => {
 *   Logger.info('User lookup requested', { userId: req.params.id });
 *   
 *   const user = findUser(req.params.id);
 *   if (!user) {
 *     throw new NotFoundError('User not found', { userId: req.params.id });
 *   }
 *   
 *   res.json(user);
 * });
 * 
 * Integration Benefits:
 * - Consistent error handling across all backend services
 * - Centralized logging for comprehensive observability
 * - Reduced import complexity and dependency management
 * - Improved maintainability through single source of truth
 * - Support for tree-shaking and optimization
 * - Clear separation of concerns between utility modules
 */
module.exports = {
  // Error Management Exports
  // Base HTTP error class providing consistent error structure with status, message, and details
  HttpError,
  
  // 404 Not Found error class for missing resources or routes with proper HTTP status
  NotFoundError,
  
  // 405 Method Not Allowed error class for unsupported HTTP methods with proper HTTP status
  MethodNotAllowedError,
  
  // 500 Internal Server Error class for unexpected application failures with proper HTTP status
  InternalServerError,
  
  // Logging and Observability Exports
  // Static logging class providing info, warn, error, and debug methods for comprehensive observability
  Logger
};