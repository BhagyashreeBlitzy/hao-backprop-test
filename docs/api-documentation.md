# Node.js Tutorial Backend - API Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [Endpoints](#endpoints)
   - [GET /hello](#get-hello)
4. [Error Handling](#error-handling)
5. [Status Codes](#status-codes)
6. [Response Format](#response-format)
7. [Logging and Observability](#logging-and-observability)
8. [Examples](#examples)
9. [Changelog and Versioning](#changelog-and-versioning)

---

## Introduction

Welcome to the Node.js Tutorial Backend API documentation. This API serves as an educational resource demonstrating fundamental HTTP server concepts using Node.js v22.x LTS and Express.js v5.1.0. The backend implements a simple yet comprehensive web server architecture that follows modern development best practices.

### Educational Purpose

This tutorial application is designed to teach:
- HTTP server initialization and configuration
- Request-response cycle fundamentals
- Express.js routing and middleware patterns
- Centralized error handling and logging
- API documentation best practices
- Production-ready code structure and organization

### Technology Stack

- **Runtime**: Node.js v22.x LTS (Active LTS until October 2025)
- **Framework**: Express.js v5.1.0 (latest stable release)
- **Architecture**: Modular router pattern with centralized utilities
- **Error Handling**: Promise-aware middleware with Express 5 enhancements
- **Logging**: Structured logging with environment-aware features

### API Overview

The API currently provides a single educational endpoint that demonstrates core HTTP concepts. The implementation leverages:
- Centralized response formatting for consistent output
- Standardized error handling across all endpoints
- Comprehensive logging for observability and debugging
- HTTP status code constants for maintainable code
- Modular architecture supporting future expansion

---

## Authentication

**No authentication is required** for any endpoint in this tutorial application. All endpoints are publicly accessible to facilitate learning and experimentation.

This design choice reflects the educational nature of the application, allowing developers to focus on understanding HTTP fundamentals without the complexity of authentication mechanisms.

---

## Endpoints

### GET /hello

Returns a simple "Hello world" message demonstrating basic HTTP GET endpoint implementation.

#### Method
```
GET /hello
```

#### Description
This endpoint serves as the primary educational example of HTTP request-response handling. It demonstrates:
- Express.js route handler implementation
- Plain text response generation
- Centralized response formatting usage
- HTTP compliance with proper status codes and headers

#### Request Parameters
- **Path Parameters**: None
- **Query Parameters**: None
- **Request Headers**: No special headers required
- **Request Body**: None (GET request)

#### Response

**Success Response (200 OK)**
- **Status Code**: 200 OK
- **Content-Type**: `text/plain`
- **Response Body**: `Hello world`

#### Response Headers
```http
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 11
Date: Mon, 30 Dec 2024 10:30:00 GMT
Connection: keep-alive
```

#### Implementation Details

The `/hello` endpoint is implemented using:
- **Route Handler**: `helloHandler` function in `routes/hello.js`
- **Response Formatting**: `formatSuccessResponse` utility for consistent output
- **Constants**: `HELLO_RESPONSE_TEXT` constant ensuring exact message compliance
- **Error Handling**: Delegates to global error middleware for any issues

#### Educational Value

This endpoint demonstrates:
- Basic Express.js route definition and handler implementation
- Request object usage and response object manipulation
- Centralized utility integration for maintainable code
- HTTP protocol compliance through proper headers and status codes

---

## Error Handling

The API implements comprehensive error handling that provides consistent, secure error responses while maintaining educational clarity.

### Error Response Structure

All error responses follow a standardized JSON format:

```json
{
  "error": true,
  "message": "Human-readable error description"
}
```

**Development Environment Enhanced Response:**
```json
{
  "error": true,
  "message": "Human-readable error description",
  "details": {
    "stack": "Error stack trace",
    "request": {
      "method": "GET",
      "url": "/invalid-path",
      "timestamp": "2024-12-30T10:30:00.000Z"
    }
  }
}
```

### Error Types

#### 404 Not Found

**Description**: Returned when a request is made to an undefined endpoint.

**Status Code**: 404
**Content-Type**: `application/json`

**Response Body**:
```json
{
  "error": true,
  "message": "Resource not found"
}
```

**Common Scenarios**:
- Requesting non-existent endpoints (e.g., `/invalid-path`)
- Typos in endpoint URLs
- Accessing endpoints that don't exist

**Implementation**: Handled by `notFoundHandler` middleware in `middleware/notFoundHandler.js`

#### 405 Method Not Allowed

**Description**: Returned when a request is made to `/hello` with an unsupported HTTP method.

**Status Code**: 405
**Content-Type**: `application/json`

**Response Body**:
```json
{
  "error": true,
  "message": "Method not allowed"
}
```

**Common Scenarios**:
- POST request to `/hello` endpoint (only GET is supported)
- PUT, DELETE, or other HTTP methods to `/hello`
- Using incorrect HTTP method for any endpoint

**Implementation**: Automatically handled by Express.js routing when method doesn't match

#### 500 Internal Server Error

**Description**: Returned when an unexpected server error occurs.

**Status Code**: 500
**Content-Type**: `application/json`

**Response Body**:
```json
{
  "error": true,
  "message": "An unexpected error occurred"
}
```

**Common Scenarios**:
- Unhandled exceptions in route handlers
- Server resource failures
- Unexpected application errors

**Implementation**: Handled by `errorHandler` middleware in `middleware/errorHandler.js`

### Security Considerations

- **Production Environment**: Error details are sanitized to prevent information disclosure
- **Development Environment**: Full error details including stack traces are included for debugging
- **Generic Messages**: Client-facing error messages are generic to prevent security vulnerabilities
- **Comprehensive Logging**: All errors are logged with complete context for monitoring

### Error Handling Implementation

The error handling system uses:
- **Error Handler Middleware**: Centralized error processing with `errorHandler` function
- **Not Found Middleware**: Dedicated 404 handling with `notFoundHandler` function
- **Response Formatter**: Consistent error response structure via `formatErrorResponse` utility
- **Environment Awareness**: Different behavior for development vs production environments

---

## Status Codes

The API uses standard HTTP status codes defined in `utils/httpStatusCodes.js` for consistent status code management.

### Success Status Codes (2xx)

| Code | Constant | Description | Usage |
|------|----------|-------------|-------|
| 200 | `HTTP_OK` | Request succeeded | Successful GET /hello responses |
| 201 | `HTTP_CREATED` | Resource created | Future POST endpoint implementations |
| 204 | `HTTP_NO_CONTENT` | Success with no content | Future DELETE operations |

### Client Error Status Codes (4xx)

| Code | Constant | Description | Usage |
|------|----------|-------------|-------|
| 400 | `HTTP_BAD_REQUEST` | Invalid request format | Future input validation |
| 401 | `HTTP_UNAUTHORIZED` | Authentication required | Future protected endpoints |
| 403 | `HTTP_FORBIDDEN` | Access denied | Future authorization checks |
| 404 | `HTTP_NOT_FOUND` | Resource not found | Undefined endpoints |
| 405 | `HTTP_METHOD_NOT_ALLOWED` | Method not supported | Wrong HTTP method usage |
| 409 | `HTTP_CONFLICT` | Resource conflict | Future resource management |
| 422 | `HTTP_UNPROCESSABLE_ENTITY` | Validation errors | Future input validation |

### Server Error Status Codes (5xx)

| Code | Constant | Description | Usage |
|------|----------|-------------|-------|
| 500 | `HTTP_INTERNAL_SERVER_ERROR` | Unexpected server error | Unhandled exceptions |
| 501 | `HTTP_NOT_IMPLEMENTED` | Feature not implemented | Future functionality |
| 503 | `HTTP_SERVICE_UNAVAILABLE` | Service temporarily unavailable | Maintenance mode |

### Status Code Implementation

Status codes are implemented using:
- **Centralized Constants**: All status codes defined in `utils/httpStatusCodes.js`
- **Named Exports**: `const { HTTP_OK, HTTP_NOT_FOUND } = require('./httpStatusCodes')`
- **Consistent Usage**: Same constants used across routes, middleware, and utilities
- **Educational Value**: Descriptive constant names improve code readability

---

## Response Format

The API uses two primary response formats depending on the content type and endpoint requirements.

### Plain Text Responses

Used for simple string responses like the `/hello` endpoint.

**Content-Type**: `text/plain`
**Structure**: Direct string content

**Example**:
```
Hello world
```

**Implementation**:
- Response generated via `formatSuccessResponse` utility
- Content-Type automatically set to `text/plain` for string data
- HTTP 200 status code for successful responses

### JSON Error Responses

Used for all error responses to provide structured, parseable error information.

**Content-Type**: `application/json`
**Structure**:
```json
{
  "error": boolean,
  "message": string,
  "details": object (development only)
}
```

**Properties**:
- **error**: Always `true` for error responses, helps client-side error detection
- **message**: Human-readable error description safe for display to users
- **details**: Additional debugging information (development environment only)

**Example Error Response**:
```json
{
  "error": true,
  "message": "Resource not found"
}
```

### Response Generation Implementation

Responses are generated using centralized utilities:

- **Success Responses**: `formatSuccessResponse(res, data, status, headers)` from `utils/responseFormatter.js`
- **Error Responses**: `formatErrorResponse(res, status, message, details)` from `utils/responseFormatter.js`
- **Automatic Type Detection**: Response formatter automatically sets appropriate Content-Type
- **Header Management**: Custom headers can be set through formatter parameters

### Response Headers

All responses include standard HTTP headers:
- **Content-Type**: Automatically set based on response content
- **Content-Length**: Calculated automatically by Express.js
- **Date**: Server timestamp for response generation
- **Connection**: Keep-alive for connection reuse
- **Security Headers**: Applied via Helmet.js middleware (recommended)

---

## Logging and Observability

The API implements comprehensive logging for observability, debugging, and monitoring using the centralized logger utility (`utils/logger.js`).

### Log Levels

#### INFO Level
**Purpose**: General operational messages and successful operations

**Usage**:
- Server startup and configuration
- Successful request processing
- System status updates

**Example**:
```
[2024-12-30T10:30:00.123Z] [NodeJSTutorialApp] [INFO] Server listening on port 3000
[2024-12-30T10:30:15.456Z] [NodeJSTutorialApp] [INFO] GET /hello - 200 - 45ms
```

#### WARN Level
**Purpose**: Non-critical issues and potential problems

**Usage**:
- 404 Not Found errors (client-side issues)
- Performance threshold breaches
- Configuration fallbacks

**Example**:
```
[2024-12-30T10:30:30.789Z] [NodeJSTutorialApp] [WARN] 404 Not Found - Request to undefined endpoint {"method":"GET","path":"/invalid"}
```

#### ERROR Level
**Purpose**: Error conditions and exceptions requiring attention

**Usage**:
- HTTP 500 Internal Server Errors
- Unhandled exceptions
- System failures

**Example**:
```
[2024-12-30T10:30:45.012Z] [NodeJSTutorialApp] [ERROR] Request processing failed - Error handled by errorHandler middleware {"errorMessage":"Database connection failed","statusCode":500}
```

### Log Format

All log messages follow a standardized format:
```
[timestamp] [application_name] [level] message [metadata]
```

**Components**:
- **Timestamp**: ISO 8601 UTC format for consistency
- **Application Name**: `NodeJSTutorialApp` for identification
- **Level**: INFO, WARN, or ERROR for categorization
- **Message**: Human-readable description of the event
- **Metadata**: Optional JSON object with additional context

### Logging Implementation

**Logger Utilities**:
- `logInfo(message, metadata)`: Information-level logging
- `logWarn(message, metadata)`: Warning-level logging
- `logError(message, metadata)`: Error-level logging

**Integration Points**:
- **Route Handlers**: Request processing and response logging
- **Error Middleware**: Comprehensive error logging with context
- **Not Found Middleware**: 404 event logging
- **Server Initialization**: Startup and configuration logging

### Environment-Specific Features

**Development Environment**:
- Colorized console output for enhanced readability
- Detailed error information including stack traces
- Request context metadata for debugging

**Production Environment**:
- Plain text logging for log aggregation systems
- Sanitized error messages without internal details
- Performance-optimized logging with minimal overhead

### Observability Benefits

The logging system provides:
- **Request Tracking**: Complete request-response cycle visibility
- **Error Monitoring**: Comprehensive error capture and analysis
- **Performance Insights**: Response time and system health metrics
- **Security Monitoring**: Access pattern analysis and threat detection
- **Debugging Support**: Detailed context for issue resolution

---

## Examples

### Successful Request Examples

#### Hello Endpoint Request

**cURL Command**:
```bash
curl -X GET http://localhost:3000/hello
```

**HTTP Request**:
```http
GET /hello HTTP/1.1
Host: localhost:3000
User-Agent: curl/7.68.0
Accept: */*
```

**HTTP Response**:
```http
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 11
Date: Mon, 30 Dec 2024 10:30:00 GMT
Connection: keep-alive

Hello world
```

**Expected Log Output**:
```
[2024-12-30T10:30:00.123Z] [NodeJSTutorialApp] [INFO] GET /hello - 200 - 45ms
```

#### Using Different HTTP Clients

**Node.js Fetch**:
```javascript
const response = await fetch('http://localhost:3000/hello');
const text = await response.text();
console.log(text); // "Hello world"
```

**Python Requests**:
```python
import requests
response = requests.get('http://localhost:3000/hello')
print(response.text)  # "Hello world"
print(response.status_code)  # 200
```

### Error Response Examples

#### 404 Not Found Error

**cURL Command**:
```bash
curl -X GET http://localhost:3000/nonexistent
```

**HTTP Response**:
```http
HTTP/1.1 404 Not Found
Content-Type: application/json
Content-Length: 45

{
  "error": true,
  "message": "Resource not found"
}
```

**Expected Log Output**:
```
[2024-12-30T10:30:15.456Z] [NodeJSTutorialApp] [WARN] 404 Not Found - Request to undefined endpoint {"method":"GET","path":"/nonexistent"}
```

#### 405 Method Not Allowed Error

**cURL Command**:
```bash
curl -X POST http://localhost:3000/hello
```

**HTTP Response**:
```http
HTTP/1.1 405 Method Not Allowed
Content-Type: application/json
Content-Length: 47

{
  "error": true,
  "message": "Method not allowed"
}
```

#### 500 Internal Server Error

**HTTP Response**:
```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
Content-Length: 58

{
  "error": true,
  "message": "An unexpected error occurred"
}
```

**Expected Log Output**:
```
[2024-12-30T10:30:30.789Z] [NodeJSTutorialApp] [ERROR] Request processing failed - Error handled by errorHandler middleware {"errorMessage":"Unexpected server error","statusCode":500}
```

### Development vs Production Responses

#### Development Environment Error Response

```json
{
  "error": true,
  "message": "Resource not found",
  "details": {
    "method": "GET",
    "path": "/invalid-endpoint",
    "requestedAt": "2024-12-30T10:30:00.000Z"
  }
}
```

#### Production Environment Error Response

```json
{
  "error": true,
  "message": "Resource not found"
}
```

### Testing the API

#### Health Check Pattern

While not currently implemented, a health check endpoint would follow this pattern:

**cURL Command**:
```bash
curl -X GET http://localhost:3000/health
```

**Expected Response**:
```json
{
  "status": "OK",
  "uptime": 3600.123,
  "timestamp": "2024-12-30T10:30:00.000Z",
  "message": "Service is healthy"
}
```

---

## Changelog and Versioning

### Version 1.0.0 (Current)

**Release Date**: December 30, 2024

**Features**:
- ✅ GET /hello endpoint returning "Hello world" message
- ✅ Comprehensive error handling for 404, 405, and 500 errors
- ✅ Centralized response formatting with consistent structure
- ✅ Structured logging with multiple log levels (INFO, WARN, ERROR)
- ✅ Environment-aware error detail exposure
- ✅ HTTP status code constants for maintainable code
- ✅ Modular router architecture supporting future expansion

**Technical Implementation**:
- Node.js v22.x LTS runtime with Active LTS support until October 2025
- Express.js v5.1.0 with enhanced promise handling and security improvements
- Centralized utilities for response formatting, logging, and constants management
- Production-ready error handling with security considerations
- Comprehensive API documentation with educational focus

**Educational Components**:
- Extensive inline code documentation for learning purposes
- Clear architectural patterns demonstrating Express.js best practices
- Examples and usage patterns for HTTP server development
- Foundation for understanding Node.js web application development

### Versioning Policy

This tutorial application follows semantic versioning (SemVer) principles:

- **Major Version**: Breaking changes to API endpoints or response formats
- **Minor Version**: New features or endpoints added without breaking existing functionality
- **Patch Version**: Bug fixes, documentation updates, or internal improvements

### Planned Future Enhancements

#### Version 1.1.0 (Planned)
- Health check endpoint (`GET /health`)
- Request logging middleware with timing information
- Enhanced error responses with correlation IDs
- API rate limiting examples

#### Version 1.2.0 (Planned)
- Multiple endpoint examples demonstrating different HTTP methods
- Request validation examples with detailed error responses
- Authentication middleware examples (educational purposes)
- API versioning patterns demonstration

#### Version 2.0.0 (Future)
- Database integration examples
- Advanced middleware patterns
- Production deployment configurations
- Performance monitoring integration

### Reporting Issues and Requesting Features

This tutorial application is designed for educational purposes. For questions, issues, or feature requests:

1. **Educational Questions**: Focus on understanding the implementation patterns and architectural decisions
2. **Bug Reports**: Document the issue with steps to reproduce and expected vs actual behavior
3. **Feature Requests**: Suggest educational enhancements that would improve learning value
4. **Documentation Improvements**: Propose clarifications or additional examples

### Compatibility Notes

- **Node.js**: Requires v18 or higher (Express 5 requirement)
- **Express.js**: Designed for v5.1.0 with backward compatibility considerations
- **Browser Compatibility**: API responses are compatible with all modern browsers
- **HTTP Clients**: Standard HTTP/1.1 compliance ensures compatibility with all HTTP clients

### Migration Guide

When upgrading between versions:

1. **Review Changelog**: Check for breaking changes or new features
2. **Update Dependencies**: Ensure Node.js and Express.js versions meet requirements
3. **Test Endpoints**: Verify all existing functionality continues to work
4. **Update Documentation**: Review any changes to API behavior or response formats
5. **Check Logs**: Verify logging output matches expected format

---

**Last Updated**: December 30, 2024  
**API Version**: 1.0.0  
**Documentation Version**: 1.0.0