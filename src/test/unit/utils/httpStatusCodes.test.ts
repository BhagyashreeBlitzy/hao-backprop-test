/**
 * Unit Test Suite for HTTP Status Code Constants
 * 
 * This test suite validates all HTTP status code constants exported from
 * src/backend/utils/httpStatusCodes.js. It ensures that each constant is properly
 * defined, has the correct type (number), and maintains the expected value as
 * specified in the HTTP/1.1 standard (RFC 7231).
 * 
 * Educational Purpose:
 * - Demonstrates comprehensive unit testing practices for constant modules
 * - Validates the integrity of application-wide HTTP status code definitions
 * - Ensures type safety and value correctness for all status codes
 * - Provides 100% test coverage for the httpStatusCodes utility module
 * 
 * Test Coverage:
 * - All success status codes (2xx series)
 * - All client error status codes (4xx series) 
 * - All server error status codes (5xx series)
 * - Type validation for each constant
 * - Value validation for each constant
 * - Existence validation for each constant
 * 
 * Maintenance Notes:
 * - If new status codes are added to httpStatusCodes.js, corresponding tests must be added here
 * - Each test validates three aspects: existence, type, and value
 * - Tests are organized by HTTP status code categories for maintainability
 * 
 * @fileoverview Unit tests for HTTP status code constants module
 * @author Node.js Tutorial Team
 * @version 1.0.0
 */

// Jest testing framework imports - version ^29.0.0
import { describe, it, expect } from 'jest';

// Import all HTTP status code constants from the source module
// These imports align with the application's usage patterns across route handlers,
// middleware, error handling, and response formatting utilities
import {
    // Success status codes (2xx series)
    HTTP_OK,
    HTTP_CREATED,
    HTTP_NO_CONTENT,
    
    // Client error status codes (4xx series)
    HTTP_BAD_REQUEST,
    HTTP_UNAUTHORIZED,
    HTTP_FORBIDDEN,
    HTTP_NOT_FOUND,
    HTTP_METHOD_NOT_ALLOWED,
    HTTP_CONFLICT,
    HTTP_UNPROCESSABLE_ENTITY,
    
    // Server error status codes (5xx series)
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_NOT_IMPLEMENTED,
    HTTP_SERVICE_UNAVAILABLE
} from '../../../backend/utils/httpStatusCodes.js';

/**
 * Test Suite: HTTP Status Code Constants Validation
 * 
 * This comprehensive test suite validates all HTTP status code constants used
 * throughout the Node.js tutorial application. The tests ensure that status codes
 * are properly defined for use in:
 * - Route handlers (especially the /hello endpoint)
 * - Error handling middleware
 * - Response formatting utilities
 * - Application-wide HTTP response generation
 */
describe('HTTP Status Code Constants', () => {
    
    /**
     * Test Category: Success Status Codes (2xx Series)
     * 
     * These tests validate success-related HTTP status codes that indicate
     * successful processing of client requests. Used primarily in route handlers
     * for successful API responses.
     */
    describe('Success Status Codes (2xx)', () => {
        
        /**
         * Test: HTTP 200 OK Status Code
         * 
         * Validates the HTTP_OK constant used for standard successful responses,
         * particularly for GET requests to the /hello endpoint in the tutorial application.
         * This is the most commonly used success status code across the application.
         */
        it('should define HTTP_OK as 200', () => {
            // Verify the constant is defined (not undefined)
            expect(HTTP_OK).toBeDefined();
            
            // Verify the constant is of type number (not string or other type)
            expect(typeof HTTP_OK).toBe('number');
            
            // Verify the constant has the correct HTTP standard value
            expect(HTTP_OK).toBe(200);
        });
        
        /**
         * Test: HTTP 201 Created Status Code
         * 
         * Validates the HTTP_CREATED constant used for successful resource creation.
         * While not directly used in the current /hello endpoint, this constant
         * is essential for future POST endpoints and resource creation operations.
         */
        it('should define HTTP_CREATED as 201', () => {
            // Verify the constant is defined (not undefined)
            expect(HTTP_CREATED).toBeDefined();
            
            // Verify the constant is of type number (not string or other type)
            expect(typeof HTTP_CREATED).toBe('number');
            
            // Verify the constant has the correct HTTP standard value
            expect(HTTP_CREATED).toBe(201);
        });
        
        /**
         * Test: HTTP 204 No Content Status Code
         * 
         * Validates the HTTP_NO_CONTENT constant used for successful requests
         * that don't return any content. Commonly used for DELETE operations
         * and PUT updates that don't require response data.
         */
        it('should define HTTP_NO_CONTENT as 204', () => {
            // Verify the constant is defined (not undefined)
            expect(HTTP_NO_CONTENT).toBeDefined();
            
            // Verify the constant is of type number (not string or other type)
            expect(typeof HTTP_NO_CONTENT).toBe('number');
            
            // Verify the constant has the correct HTTP standard value
            expect(HTTP_NO_CONTENT).toBe(204);
        });
    });
    
    /**
     * Test Category: Client Error Status Codes (4xx Series)
     * 
     * These tests validate client error-related HTTP status codes that indicate
     * problems with client requests. Used extensively in error handling middleware
     * and route validation throughout the application.
     */
    describe('Client Error Status Codes (4xx)', () => {
        
        /**
         * Test: HTTP 400 Bad Request Status Code
         * 
         * Validates the HTTP_BAD_REQUEST constant used for malformed client requests.
         * Essential for input validation and request format checking across all
         * API endpoints in the application.
         */
        it('should define HTTP_BAD_REQUEST as 400', () => {
            // Verify the constant is defined (not undefined)
            expect(HTTP_BAD_REQUEST).toBeDefined();
            
            // Verify the constant is of type number (not string or other type)
            expect(typeof HTTP_BAD_REQUEST).toBe('number');
            
            // Verify the constant has the correct HTTP standard value
            expect(HTTP_BAD_REQUEST).toBe(400);
        });
        
        /**
         * Test: HTTP 401 Unauthorized Status Code
         * 
         * Validates the HTTP_UNAUTHORIZED constant used for authentication failures.
         * Critical for protected resources and authentication middleware throughout
         * the application's security layer.
         */
        it('should define HTTP_UNAUTHORIZED as 401', () => {
            // Verify the constant is defined (not undefined)
            expect(HTTP_UNAUTHORIZED).toBeDefined();
            
            // Verify the constant is of type number (not string or other type)
            expect(typeof HTTP_UNAUTHORIZED).toBe('number');
            
            // Verify the constant has the correct HTTP standard value
            expect(HTTP_UNAUTHORIZED).toBe(401);
        });
        
        /**
         * Test: HTTP 403 Forbidden Status Code
         * 
         * Validates the HTTP_FORBIDDEN constant used for authorization failures.
         * Important for access control and permission-based resource protection
         * across the application's authorization layer.
         */
        it('should define HTTP_FORBIDDEN as 403', () => {
            // Verify the constant is defined (not undefined)
            expect(HTTP_FORBIDDEN).toBeDefined();
            
            // Verify the constant is of type number (not string or other type)
            expect(typeof HTTP_FORBIDDEN).toBe('number');
            
            // Verify the constant has the correct HTTP standard value
            expect(HTTP_FORBIDDEN).toBe(403);
        });
        
        /**
         * Test: HTTP 404 Not Found Status Code
         * 
         * Validates the HTTP_NOT_FOUND constant used by the not found handler middleware.
         * This is one of the most critical status codes in the application, used when
         * requested resources or endpoints don't exist or match defined routes.
         */
        it('should define HTTP_NOT_FOUND as 404', () => {
            // Verify the constant is defined (not undefined)
            expect(HTTP_NOT_FOUND).toBeDefined();
            
            // Verify the constant is of type number (not string or other type)
            expect(typeof HTTP_NOT_FOUND).toBe('number');
            
            // Verify the constant has the correct HTTP standard value
            expect(HTTP_NOT_FOUND).toBe(404);
        });
        
        /**
         * Test: HTTP 405 Method Not Allowed Status Code
         * 
         * Validates the HTTP_METHOD_NOT_ALLOWED constant used when request methods
         * are not supported for specific resources. Essential for proper HTTP method
         * handling and RESTful API compliance.
         */
        it('should define HTTP_METHOD_NOT_ALLOWED as 405', () => {
            // Verify the constant is defined (not undefined)
            expect(HTTP_METHOD_NOT_ALLOWED).toBeDefined();
            
            // Verify the constant is of type number (not string or other type)
            expect(typeof HTTP_METHOD_NOT_ALLOWED).toBe('number');
            
            // Verify the constant has the correct HTTP standard value
            expect(HTTP_METHOD_NOT_ALLOWED).toBe(405);
        });
        
        /**
         * Test: HTTP 409 Conflict Status Code
         * 
         * Validates the HTTP_CONFLICT constant used for resource state conflicts.
         * Important for handling concurrent operations and resource state management
         * in data manipulation scenarios.
         */
        it('should define HTTP_CONFLICT as 409', () => {
            // Verify the constant is defined (not undefined)
            expect(HTTP_CONFLICT).toBeDefined();
            
            // Verify the constant is of type number (not string or other type)
            expect(typeof HTTP_CONFLICT).toBe('number');
            
            // Verify the constant has the correct HTTP standard value
            expect(HTTP_CONFLICT).toBe(409);
        });
        
        /**
         * Test: HTTP 422 Unprocessable Entity Status Code
         * 
         * Validates the HTTP_UNPROCESSABLE_ENTITY constant used for semantic validation errors.
         * Critical for advanced input validation where request syntax is correct but
         * semantic validation fails (e.g., business rule violations).
         */
        it('should define HTTP_UNPROCESSABLE_ENTITY as 422', () => {
            // Verify the constant is defined (not undefined)
            expect(HTTP_UNPROCESSABLE_ENTITY).toBeDefined();
            
            // Verify the constant is of type number (not string or other type)
            expect(typeof HTTP_UNPROCESSABLE_ENTITY).toBe('number');
            
            // Verify the constant has the correct HTTP standard value
            expect(HTTP_UNPROCESSABLE_ENTITY).toBe(422);
        });
    });
    
    /**
     * Test Category: Server Error Status Codes (5xx Series)
     * 
     * These tests validate server error-related HTTP status codes that indicate
     * problems with server processing. Used primarily in error handling middleware
     * for unhandled exceptions and server-side failures.
     */
    describe('Server Error Status Codes (5xx)', () => {
        
        /**
         * Test: HTTP 500 Internal Server Error Status Code
         * 
         * Validates the HTTP_INTERNAL_SERVER_ERROR constant used by error handling
         * middleware for unhandled exceptions. This is the most critical server error
         * status code, used as a fallback for unexpected application errors.
         */
        it('should define HTTP_INTERNAL_SERVER_ERROR as 500', () => {
            // Verify the constant is defined (not undefined)
            expect(HTTP_INTERNAL_SERVER_ERROR).toBeDefined();
            
            // Verify the constant is of type number (not string or other type)
            expect(typeof HTTP_INTERNAL_SERVER_ERROR).toBe('number');
            
            // Verify the constant has the correct HTTP standard value
            expect(HTTP_INTERNAL_SERVER_ERROR).toBe(500);
        });
        
        /**
         * Test: HTTP 501 Not Implemented Status Code
         * 
         * Validates the HTTP_NOT_IMPLEMENTED constant used when server functionality
         * is not yet implemented. Useful for planned features and API endpoints
         * that are documented but not yet developed.
         */
        it('should define HTTP_NOT_IMPLEMENTED as 501', () => {
            // Verify the constant is defined (not undefined)
            expect(HTTP_NOT_IMPLEMENTED).toBeDefined();
            
            // Verify the constant is of type number (not string or other type)
            expect(typeof HTTP_NOT_IMPLEMENTED).toBe('number');
            
            // Verify the constant has the correct HTTP standard value
            expect(HTTP_NOT_IMPLEMENTED).toBe(501);
        });
        
        /**
         * Test: HTTP 503 Service Unavailable Status Code
         * 
         * Validates the HTTP_SERVICE_UNAVAILABLE constant used when the server
         * is temporarily unable to handle requests. Important for maintenance modes,
         * overload conditions, and temporary service outages.
         */
        it('should define HTTP_SERVICE_UNAVAILABLE as 503', () => {
            // Verify the constant is defined (not undefined)
            expect(HTTP_SERVICE_UNAVAILABLE).toBeDefined();
            
            // Verify the constant is of type number (not string or other type)
            expect(typeof HTTP_SERVICE_UNAVAILABLE).toBe('number');
            
            // Verify the constant has the correct HTTP standard value
            expect(HTTP_SERVICE_UNAVAILABLE).toBe(503);
        });
    });
    
    /**
     * Integration Test: Comprehensive Status Code Validation
     * 
     * This test provides an additional layer of validation by testing all status codes
     * in a single comprehensive test. It ensures that the complete set of status codes
     * maintains consistency and follows expected patterns.
     */
    describe('Comprehensive Status Code Validation', () => {
        
        /**
         * Test: All Status Codes Are Numbers
         * 
         * Validates that every imported status code constant is of type 'number'.
         * This test provides a safety net to ensure type consistency across all
         * status code constants in the module.
         */
        it('should ensure all status codes are of type number', () => {
            const statusCodes = [
                // Success codes (2xx)
                HTTP_OK,
                HTTP_CREATED,
                HTTP_NO_CONTENT,
                
                // Client error codes (4xx)
                HTTP_BAD_REQUEST,
                HTTP_UNAUTHORIZED,
                HTTP_FORBIDDEN,
                HTTP_NOT_FOUND,
                HTTP_METHOD_NOT_ALLOWED,
                HTTP_CONFLICT,
                HTTP_UNPROCESSABLE_ENTITY,
                
                // Server error codes (5xx)
                HTTP_INTERNAL_SERVER_ERROR,
                HTTP_NOT_IMPLEMENTED,
                HTTP_SERVICE_UNAVAILABLE
            ];
            
            // Verify each status code is of type number
            statusCodes.forEach((statusCode, index) => {
                expect(typeof statusCode).toBe('number');
                expect(statusCode).toBeGreaterThan(0);
                expect(Number.isInteger(statusCode)).toBe(true);
            });
        });
        
        /**
         * Test: Status Code Range Validation
         * 
         * Validates that status codes fall within their expected HTTP ranges:
         * - 2xx for success codes (200-299)
         * - 4xx for client error codes (400-499)
         * - 5xx for server error codes (500-599)
         */
        it('should ensure status codes fall within correct HTTP ranges', () => {
            // Success codes should be in 200-299 range
            expect(HTTP_OK).toBeGreaterThanOrEqual(200);
            expect(HTTP_OK).toBeLessThan(300);
            expect(HTTP_CREATED).toBeGreaterThanOrEqual(200);
            expect(HTTP_CREATED).toBeLessThan(300);
            expect(HTTP_NO_CONTENT).toBeGreaterThanOrEqual(200);
            expect(HTTP_NO_CONTENT).toBeLessThan(300);
            
            // Client error codes should be in 400-499 range
            expect(HTTP_BAD_REQUEST).toBeGreaterThanOrEqual(400);
            expect(HTTP_BAD_REQUEST).toBeLessThan(500);
            expect(HTTP_UNAUTHORIZED).toBeGreaterThanOrEqual(400);
            expect(HTTP_UNAUTHORIZED).toBeLessThan(500);
            expect(HTTP_FORBIDDEN).toBeGreaterThanOrEqual(400);
            expect(HTTP_FORBIDDEN).toBeLessThan(500);
            expect(HTTP_NOT_FOUND).toBeGreaterThanOrEqual(400);
            expect(HTTP_NOT_FOUND).toBeLessThan(500);
            expect(HTTP_METHOD_NOT_ALLOWED).toBeGreaterThanOrEqual(400);
            expect(HTTP_METHOD_NOT_ALLOWED).toBeLessThan(500);
            expect(HTTP_CONFLICT).toBeGreaterThanOrEqual(400);
            expect(HTTP_CONFLICT).toBeLessThan(500);
            expect(HTTP_UNPROCESSABLE_ENTITY).toBeGreaterThanOrEqual(400);
            expect(HTTP_UNPROCESSABLE_ENTITY).toBeLessThan(500);
            
            // Server error codes should be in 500-599 range
            expect(HTTP_INTERNAL_SERVER_ERROR).toBeGreaterThanOrEqual(500);
            expect(HTTP_INTERNAL_SERVER_ERROR).toBeLessThan(600);
            expect(HTTP_NOT_IMPLEMENTED).toBeGreaterThanOrEqual(500);
            expect(HTTP_NOT_IMPLEMENTED).toBeLessThan(600);
            expect(HTTP_SERVICE_UNAVAILABLE).toBeGreaterThanOrEqual(500);
            expect(HTTP_SERVICE_UNAVAILABLE).toBeLessThan(600);
        });
        
        /**
         * Test: Status Code Uniqueness
         * 
         * Validates that all status code constants have unique values to prevent
         * accidental duplicates that could cause confusion in application logic.
         */
        it('should ensure all status codes have unique values', () => {
            const statusCodeValues = [
                HTTP_OK,
                HTTP_CREATED,
                HTTP_NO_CONTENT,
                HTTP_BAD_REQUEST,
                HTTP_UNAUTHORIZED,
                HTTP_FORBIDDEN,
                HTTP_NOT_FOUND,
                HTTP_METHOD_NOT_ALLOWED,
                HTTP_CONFLICT,
                HTTP_UNPROCESSABLE_ENTITY,
                HTTP_INTERNAL_SERVER_ERROR,
                HTTP_NOT_IMPLEMENTED,
                HTTP_SERVICE_UNAVAILABLE
            ];
            
            // Create a Set to check for duplicates
            const uniqueValues = new Set(statusCodeValues);
            
            // Verify that the Set has the same length as the array (no duplicates)
            expect(uniqueValues.size).toBe(statusCodeValues.length);
        });
    });
});