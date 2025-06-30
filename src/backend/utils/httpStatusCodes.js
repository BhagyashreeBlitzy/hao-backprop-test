/**
 * HTTP Status Code Constants
 * 
 * This module centralizes all HTTP status code constants used throughout the Node.js tutorial backend.
 * It provides named constants for standard HTTP status codes to improve code readability, maintainability,
 * and educational value by replacing numeric literals with descriptive constant names.
 * 
 * These constants are used across the application in:
 * - Route handlers for successful responses
 * - Error handling middleware for error responses
 * - Response formatting utilities for consistent status codes
 * - Not found handlers for 404 responses
 * 
 * Educational Benefits:
 * - Eliminates magic numbers in the codebase
 * - Provides clear documentation of each status code's purpose
 * - Improves code readability and maintainability
 * - Demonstrates best practices for constant management
 * 
 * @fileoverview HTTP status code constants for Node.js tutorial application
 * @author Node.js Tutorial Team
 * @version 1.0.0
 */

// =============================================================================
// SUCCESS STATUS CODES (2xx)
// =============================================================================

/**
 * HTTP 200 OK
 * 
 * The request has succeeded. The meaning of the success depends on the HTTP method:
 * - GET: The resource has been fetched and is transmitted in the message body
 * - HEAD: The entity headers are in the message body
 * - PUT or POST: The resource describing the result of the action is transmitted in the message body
 * - TRACE: The message body contains the request message as received by the server
 * 
 * Usage: Standard response for successful HTTP requests, particularly for GET requests
 * to the /hello endpoint in this tutorial application.
 * 
 * @constant {number}
 * @default 200
 */
const HTTP_OK = 200;

/**
 * HTTP 201 Created
 * 
 * The request has been fulfilled and resulted in a new resource being created.
 * The newly created resource can be referenced by the URI(s) returned in the entity
 * of the response, with the most specific URI for the resource given by a Location
 * header field. The response SHOULD include an entity containing a list of resource
 * characteristics and location(s) from which the user or user agent can choose the one most appropriate.
 * 
 * Usage: Indicates successful resource creation, typically used in POST requests
 * when creating new resources on the server.
 * 
 * @constant {number}
 * @default 201
 */
const HTTP_CREATED = 201;

/**
 * HTTP 204 No Content
 * 
 * The server successfully processed the request and is not returning any content.
 * A 204 response is terminated by the first empty line after the header fields
 * because it cannot contain a message-body.
 * 
 * Usage: Indicates successful request processing with no response body needed,
 * commonly used for DELETE operations or PUT updates that don't return data.
 * 
 * @constant {number}
 * @default 204
 */
const HTTP_NO_CONTENT = 204;

// =============================================================================
// CLIENT ERROR STATUS CODES (4xx)
// =============================================================================

/**
 * HTTP 400 Bad Request
 * 
 * The request could not be understood by the server due to malformed syntax.
 * The client SHOULD NOT repeat the request without modifications.
 * 
 * Usage: Indicates client sent an invalid request, such as malformed JSON,
 * missing required parameters, or invalid request format.
 * 
 * @constant {number}
 * @default 400
 */
const HTTP_BAD_REQUEST = 400;

/**
 * HTTP 401 Unauthorized
 * 
 * The request requires user authentication. The response MUST include a
 * WWW-Authenticate header field containing a challenge applicable to the
 * requested resource. The client MAY repeat the request with a suitable
 * Authorization header field.
 * 
 * Usage: Indicates authentication is required and has failed or has not yet
 * been provided. Used when protected resources require valid authentication.
 * 
 * @constant {number}
 * @default 401
 */
const HTTP_UNAUTHORIZED = 401;

/**
 * HTTP 403 Forbidden
 * 
 * The server understood the request, but is refusing to fulfill it.
 * Authorization will not help and the request SHOULD NOT be repeated.
 * If the request method was not HEAD and the server wishes to make public
 * why the request has not been fulfilled, it SHOULD describe the reason
 * for the refusal in the entity.
 * 
 * Usage: Indicates the server understood the request but refuses to authorize it.
 * Different from 401 - authentication won't help with this error.
 * 
 * @constant {number}
 * @default 403
 */
const HTTP_FORBIDDEN = 403;

/**
 * HTTP 404 Not Found
 * 
 * The server has not found anything matching the Request-URI. No indication
 * is given of whether the condition is temporary or permanent. The 410 (Gone)
 * status code SHOULD be used if the server knows, through some internally
 * configurable mechanism, that an old resource is permanently unavailable
 * and has no forwarding address.
 * 
 * Usage: Indicates the requested resource could not be found. Used by the
 * not found handler middleware when routes don't match any defined endpoints.
 * 
 * @constant {number}
 * @default 404
 */
const HTTP_NOT_FOUND = 404;

/**
 * HTTP 405 Method Not Allowed
 * 
 * The method specified in the Request-Line is not allowed for the resource
 * identified by the Request-URI. The response MUST include an Allow header
 * containing a list of valid methods for the requested resource.
 * 
 * Usage: Indicates the request method is not supported for the requested resource.
 * For example, trying to POST to a resource that only accepts GET requests.
 * 
 * @constant {number}
 * @default 405
 */
const HTTP_METHOD_NOT_ALLOWED = 405;

/**
 * HTTP 409 Conflict
 * 
 * The request could not be completed due to a conflict with the current state
 * of the resource. This code is only allowed in situations where it is expected
 * that the user might be able to resolve the conflict and resubmit the request.
 * 
 * Usage: Indicates a request conflict with current state of the resource.
 * Common in scenarios like trying to create a resource that already exists
 * or concurrent modification conflicts.
 * 
 * @constant {number}
 * @default 409
 */
const HTTP_CONFLICT = 409;

/**
 * HTTP 422 Unprocessable Entity
 * 
 * The request was well-formed but was unable to be followed due to semantic errors.
 * This status code is typically used when the server understands the content type
 * of the request entity and the syntax is correct, but was unable to process
 * the contained instructions.
 * 
 * Usage: Indicates the server understands the content type but was unable to
 * process the contained instructions. Often used for validation errors where
 * the request is syntactically correct but semantically invalid.
 * 
 * @constant {number}
 * @default 422
 */
const HTTP_UNPROCESSABLE_ENTITY = 422;

// =============================================================================
// SERVER ERROR STATUS CODES (5xx)
// =============================================================================

/**
 * HTTP 500 Internal Server Error
 * 
 * The server encountered an unexpected condition which prevented it from
 * fulfilling the request. This is a generic error message when no more
 * specific message is suitable.
 * 
 * Usage: Indicates an unexpected server error occurred. Used by error handling
 * middleware to respond to unhandled exceptions and unexpected application errors.
 * Should be used sparingly and with proper error logging.
 * 
 * @constant {number}
 * @default 500
 */
const HTTP_INTERNAL_SERVER_ERROR = 500;

/**
 * HTTP 501 Not Implemented
 * 
 * The server does not support the functionality required to fulfill the request.
 * This is the appropriate response when the server does not recognize the request
 * method and is not capable of supporting it for any resource.
 * 
 * Usage: Indicates the server does not support the functionality required to
 * fulfill the request. Used when features are planned but not yet implemented.
 * 
 * @constant {number}
 * @default 501
 */
const HTTP_NOT_IMPLEMENTED = 501;

/**
 * HTTP 503 Service Unavailable
 * 
 * The server is currently unable to handle the request due to a temporary
 * overloading or maintenance of the server. The implication is that this is
 * a temporary condition which will be alleviated after some delay.
 * 
 * Usage: Indicates the server is currently unable to handle the request due to
 * temporary overload or maintenance. Should include a Retry-After header when possible.
 * 
 * @constant {number}
 * @default 503
 */
const HTTP_SERVICE_UNAVAILABLE = 503;

// =============================================================================
// EXPORTS
// =============================================================================

/**
 * Module exports for HTTP status code constants.
 * 
 * These constants are exported for use throughout the Node.js tutorial application,
 * including in route handlers, middleware, utilities, and server logic.
 * 
 * Import examples:
 * - const { HTTP_OK, HTTP_NOT_FOUND } = require('./httpStatusCodes');
 * - const statusCodes = require('./httpStatusCodes');
 * - import { HTTP_OK, HTTP_INTERNAL_SERVER_ERROR } from './httpStatusCodes';
 * 
 * Usage in application:
 * - res.status(HTTP_OK).json({ message: 'Success' });
 * - res.status(HTTP_NOT_FOUND).json({ error: 'Resource not found' });
 * - res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
 */

// Success status codes (2xx)
module.exports.HTTP_OK = HTTP_OK;
module.exports.HTTP_CREATED = HTTP_CREATED;
module.exports.HTTP_NO_CONTENT = HTTP_NO_CONTENT;

// Client error status codes (4xx)
module.exports.HTTP_BAD_REQUEST = HTTP_BAD_REQUEST;
module.exports.HTTP_UNAUTHORIZED = HTTP_UNAUTHORIZED;
module.exports.HTTP_FORBIDDEN = HTTP_FORBIDDEN;
module.exports.HTTP_NOT_FOUND = HTTP_NOT_FOUND;
module.exports.HTTP_METHOD_NOT_ALLOWED = HTTP_METHOD_NOT_ALLOWED;
module.exports.HTTP_CONFLICT = HTTP_CONFLICT;
module.exports.HTTP_UNPROCESSABLE_ENTITY = HTTP_UNPROCESSABLE_ENTITY;

// Server error status codes (5xx)
module.exports.HTTP_INTERNAL_SERVER_ERROR = HTTP_INTERNAL_SERVER_ERROR;
module.exports.HTTP_NOT_IMPLEMENTED = HTTP_NOT_IMPLEMENTED;
module.exports.HTTP_SERVICE_UNAVAILABLE = HTTP_SERVICE_UNAVAILABLE;