# Node.js Tutorial Backend API Documentation

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

## Introduction

Welcome to the Node.js Tutorial Backend API documentation. This API serves as a foundational learning resource for developers exploring server-side JavaScript development with Node.js and Express.js. The backend implements a minimal yet production-ready HTTP server that demonstrates core web development concepts including routing, error handling, response formatting, and observability.

### Key Features

- **Educational Focus**: Designed specifically for learning Node.js and Express.js fundamentals
- **Production-Ready Patterns**: Implements industry best practices for error handling, logging, and response formatting
- **Modern Technology Stack**: Built with Node.js v18+ and Express.js v5.1.0
- **Comprehensive Documentation**: Every component is thoroughly documented for educational clarity
- **Consistent Architecture**: Demonstrates modular design patterns and separation of concerns

### Technical Architecture

The API is built on a modular architecture with the following core components:

- **Express.js v5.1.0**: Modern web framework with automatic promise handling
- **Centralized Error Handling**: Consistent error responses across all endpoints
- **Response Formatting Utilities**: Standardized success and error response structures
- **Comprehensive Logging**: Structured logging for observability and debugging
- **HTTP Status Code Constants**: Maintainable status code management

### API Base URL

When running locally with default configuration:
```
http://localhost:3000
```

### Content Types

The API supports the following content types:
- **Plain Text**: `text/plain` for simple string responses
- **JSON**: `application/json` for structured error responses

## Authentication

**No authentication is required** for any endpoints in this tutorial application. All endpoints are publicly accessible and designed for educational purposes. This design choice allows learners to focus on core HTTP and Express.js concepts without the complexity of authentication systems.

In a production application, you would typically implement authentication using:
- JWT (JSON Web Tokens)
- Session-based authentication
- OAuth 2.0 / OpenID Connect
- API key authentication

## Endpoints

### GET /hello

Returns a simple "Hello world" message as plain text. This endpoint serves as the primary educational example demonstrating basic HTTP GET request handling, response generation, and Express.js route implementation patterns.

#### Request

```http
GET /hello HTTP/1.1
Host: localhost:3000
```

**HTTP Method:** `GET`  
**Path:** `/hello`  
**Query Parameters:** None  
**Request Body:** None  
**Headers:** No special headers required

#### Response

**Success Response:**

```http
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 11

Hello world
```

**Status Code:** `200 OK`  
**Content-Type:** `text/plain`  
**Response Body:** `Hello world` (exact text as specified in technical requirements)

#### Implementation Details

The `/hello` endpoint demonstrates several key concepts:

- **Route Handler Structure**: Proper Express.js route handler implementation
- **Response Formatting**: Uses centralized `formatSuccessResponse` utility
- **Constants Usage**: Leverages `HELLO_RESPONSE_TEXT` constant for consistency
- **Error Handling**: Delegates to global error middleware for any unexpected issues
- **HTTP Compliance**: Returns appropriate status codes and content types

#### Code Example

```javascript
// Route handler implementation
function helloHandler(req, res, next) {
    formatSuccessResponse(res, HELLO_RESPONSE_TEXT);
}

// Route registration
helloRouter.get('/', helloHandler);
```

## Error Handling

The API implements comprehensive, centralized error handling that provides consistent error responses while maintaining security through controlled information disclosure.

### Error Response Structure

All error responses follow a standardized JSON structure:

```json
{
  "error": true,
  "message": "Error description",
  "details": {
    // Additional details (development environment only)
  }
}
```

### Common Error Scenarios

#### 404 Not Found

Returned when a request is made to an undefined endpoint.

**Trigger Conditions:**
- Requesting any path other than `/hello`
- Misspelled endpoint paths
- Requesting deleted or non-existent resources

**Response Example:**
```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "error": true,
  "message": "Resource not found"
}
```

**Development Environment Response:**
```json
{
  "error": true,
  "message": "Resource not found",
  "details": {
    "method": "GET",
    "path": "/nonexistent",
    "requestedAt": "2024-12-30T14:25:30.123Z"
  }
}
```

#### 405 Method Not Allowed

Returned when a request is made to `/hello` with an unsupported HTTP method.

**Trigger Conditions:**
- `POST /hello`
- `PUT /hello`
- `DELETE /hello`
- Any HTTP method other than `GET` on the `/hello` endpoint

**Response Example:**
```http
HTTP/1.1 405 Method Not Allowed
Content-Type: application/json

{
  "error": true,
  "message": "Method not allowed"
}
```

#### 500 Internal Server Error

Returned when an unexpected server error occurs.

**Trigger Conditions:**
- Unhandled exceptions in route handlers
- Database connection failures (if implemented)
- File system errors
- Any unexpected server-side error

**Response Example:**
```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": true,
  "message": "An unexpected error occurred"
}
```

**Development Environment Response:**
```json
{
  "error": true,
  "message": "An unexpected error occurred",
  "details": {
    "stack": "Error: Something went wrong\n    at ...",
    "originalMessage": "Something went wrong",
    "name": "Error",
    "statusCode": 500,
    "request": {
      "method": "GET",
      "url": "/hello",
      "ip": "127.0.0.1",
      "userAgent": "Mozilla/5.0..."
    },
    "timestamp": "2024-12-30T14:25:30.123Z"
  }
}
```

### Error Security

The error handling system implements security-conscious practices:

- **Production Environment**: Never exposes internal error details, stack traces, or system information
- **Development Environment**: Provides comprehensive error details for debugging
- **Generic Messages**: Uses safe, generic error messages to prevent information disclosure
- **Comprehensive Logging**: All errors are logged with full context for monitoring and debugging

## Status Codes

The API uses standard HTTP status codes defined in centralized constants for consistency and maintainability.

### Success Status Codes

| Code | Constant | Description | Usage |
|------|----------|-------------|-------|
| 200 | `HTTP_OK` | OK | Successful GET requests (e.g., `/hello` endpoint) |
| 201 | `HTTP_CREATED` | Created | Successful resource creation (future endpoints) |
| 204 | `HTTP_NO_CONTENT` | No Content | Successful operations with no response body |

### Client Error Status Codes

| Code | Constant | Description | Usage |
|------|----------|-------------|-------|
| 400 | `HTTP_BAD_REQUEST` | Bad Request | Malformed requests or invalid input |
| 401 | `HTTP_UNAUTHORIZED` | Unauthorized | Authentication required |
| 403 | `HTTP_FORBIDDEN` | Forbidden | Access denied |
| 404 | `HTTP_NOT_FOUND` | Not Found | Undefined endpoints or missing resources |
| 405 | `HTTP_METHOD_NOT_ALLOWED` | Method Not Allowed | Unsupported HTTP methods on valid endpoints |
| 409 | `HTTP_CONFLICT` | Conflict | Resource conflicts |
| 422 | `HTTP_UNPROCESSABLE_ENTITY` | Unprocessable Entity | Validation errors |

### Server Error Status Codes

| Code | Constant | Description | Usage |
|------|----------|-------------|-------|
| 500 | `HTTP_INTERNAL_SERVER_ERROR` | Internal Server Error | Unexpected server errors |
| 501 | `HTTP_NOT_IMPLEMENTED` | Not Implemented | Unimplemented features |
| 503 | `HTTP_SERVICE_UNAVAILABLE` | Service Unavailable | Temporary service unavailability |

## Response Format

The API uses different response formats based on the type of response:

### Success Responses

#### Plain Text Responses

Used for simple string responses like the `/hello` endpoint:

```http
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 11

Hello world
```

**Characteristics:**
- Content-Type: `text/plain`
- Response body contains the raw text
- No JSON wrapper or additional formatting
- Appropriate for simple, human-readable messages

#### JSON Responses

Used for structured data responses (future endpoints):

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": {
    "message": "Operation successful",
    "timestamp": "2024-12-30T14:25:30.123Z"
  }
}
```

### Error Responses

All error responses use JSON format for consistency and programmatic handling:

```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "error": true,
  "message": "Resource not found"
}
```

**Standard Error Fields:**
- `error`: Boolean flag indicating this is an error response
- `message`: Human-readable error description
- `details`: Additional error context (development environment only)

### Response Headers

#### Common Headers

All responses include standard HTTP headers:

```http
Content-Type: text/plain | application/json
Content-Length: <response_size>
Date: <current_date>
```

#### Security Headers

While not implemented in this tutorial, production APIs should include:

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

## Logging and Observability

The API implements comprehensive logging for observability, debugging, and educational purposes.

### Log Levels

#### INFO Level
Used for general operational messages:
- Server startup and shutdown events
- Successful request processing
- Configuration loading
- Performance metrics

**Example:**
```
[2024-12-30T14:25:30.123Z] [NodeJSTutorialApp] [INFO] Server listening on port 3000
```

#### WARN Level
Used for non-critical issues:
- 404 Not Found errors
- Deprecated feature usage
- Performance threshold breaches
- Configuration fallbacks

**Example:**
```
[2024-12-30T14:25:30.123Z] [NodeJSTutorialApp] [WARN] 404 Not Found - Request to undefined endpoint {"method":"GET","path":"/nonexistent"}
```

#### ERROR Level
Used for error conditions:
- 500 Internal Server Errors
- Unhandled exceptions
- System failures
- Critical issues

**Example:**
```
[2024-12-30T14:25:30.123Z] [NodeJSTutorialApp] [ERROR] Request processing failed - Error handled by errorHandler middleware {"errorMessage":"Something went wrong","statusCode":500}
```

### Log Format

All log messages follow a standardized format:

```
[timestamp] [app_name] [level] message [metadata]
```

**Components:**
- **Timestamp**: ISO 8601 UTC format for precise timing
- **App Name**: Application identifier for log aggregation
- **Level**: Log severity level (INFO, WARN, ERROR)
- **Message**: Human-readable log message
- **Metadata**: Structured JSON data with additional context

### Request Logging

Every request is logged with relevant context:

```json
{
  "method": "GET",
  "path": "/hello",
  "statusCode": 200,
  "responseTime": "45ms",
  "ip": "127.0.0.1",
  "userAgent": "Mozilla/5.0..."
}
```

### Error Logging

Error logging includes comprehensive context for debugging:

```json
{
  "errorMessage": "Something went wrong",
  "errorName": "Error",
  "statusCode": 500,
  "stack": "Error: Something went wrong\n    at ...",
  "request": {
    "method": "GET",
    "url": "/hello",
    "ip": "127.0.0.1",
    "userAgent": "Mozilla/5.0..."
  },
  "timestamp": "2024-12-30T14:25:30.123Z"
}
```

## Examples

### Successful Request Examples

#### Basic Hello Request

**Request:**
```bash
curl -X GET http://localhost:3000/hello
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 11

Hello world
```

#### Hello Request with Verbose Output

**Request:**
```bash
curl -v http://localhost:3000/hello
```

**Response:**
```http
> GET /hello HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.68.0
> Accept: */*
> 
< HTTP/1.1 200 OK
< Content-Type: text/plain
< Content-Length: 11
< Date: Mon, 30 Dec 2024 14:25:30 GMT
< 
Hello world
```

#### Using wget

**Request:**
```bash
wget -qO- http://localhost:3000/hello
```

**Response:**
```
Hello world
```

### Error Request Examples

#### 404 Not Found

**Request:**
```bash
curl -X GET http://localhost:3000/nonexistent
```

**Response:**
```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "error": true,
  "message": "Resource not found"
}
```

#### 405 Method Not Allowed

**Request:**
```bash
curl -X POST http://localhost:3000/hello
```

**Response:**
```http
HTTP/1.1 405 Method Not Allowed
Content-Type: application/json

{
  "error": true,
  "message": "Method not allowed"
}
```

#### 404 with JSON Response

**Request:**
```bash
curl -X GET \
  -H "Accept: application/json" \
  http://localhost:3000/unknown
```

**Response:**
```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "error": true,
  "message": "Resource not found"
}
```

### JavaScript/Node.js Client Examples

#### Using Native fetch API

```javascript
// Successful request
async function getHello() {
  try {
    const response = await fetch('http://localhost:3000/hello');
    const text = await response.text();
    console.log('Response:', text); // "Hello world"
  } catch (error) {
    console.error('Request failed:', error);
  }
}

// Error handling
async function handleError() {
  try {
    const response = await fetch('http://localhost:3000/nonexistent');
    if (!response.ok) {
      const error = await response.json();
      console.error('Error:', error);
      // { error: true, message: "Resource not found" }
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}
```

#### Using axios

```javascript
const axios = require('axios');

// Successful request
axios.get('http://localhost:3000/hello')
  .then(response => {
    console.log('Status:', response.status); // 200
    console.log('Data:', response.data); // "Hello world"
    console.log('Content-Type:', response.headers['content-type']); // "text/plain"
  })
  .catch(error => {
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    }
  });

// Error request
axios.get('http://localhost:3000/nonexistent')
  .catch(error => {
    console.log('Status:', error.response.status); // 404
    console.log('Error:', error.response.data);
    // { error: true, message: "Resource not found" }
  });
```

### Browser Examples

#### Using the Fetch API in Browser

```javascript
// In browser console or JavaScript file
fetch('/hello')
  .then(response => response.text())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Error handling example
fetch('/nonexistent')
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => Promise.reject(err));
    }
    return response.text();
  })
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

#### XMLHttpRequest Example

```javascript
function makeRequest(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(null, xhr.responseText);
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          callback(error, null);
        } catch (e) {
          callback({ error: true, message: 'Request failed' }, null);
        }
      }
    }
  };
  
  xhr.send();
}

// Usage
makeRequest('/hello', function(error, data) {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success:', data); // "Hello world"
  }
});
```

## Changelog and Versioning

### Version 1.0.0 (Current)

**Release Date:** 2024-12-30

**Features:**
- Initial release of Node.js Tutorial Backend API
- GET /hello endpoint returning "Hello world" message
- Comprehensive error handling with 404, 405, and 500 responses
- Centralized logging system with structured output
- Production-ready security practices
- Complete API documentation

**Technical Stack:**
- Node.js v18+ (LTS)
- Express.js v5.1.0
- Comprehensive error handling middleware
- Centralized response formatting utilities
- HTTP status code constants
- Structured logging system

**Educational Features:**
- Extensive inline code documentation
- Modular architecture demonstrating best practices
- Clear separation of concerns
- Production-ready patterns for learning purposes

### Versioning Policy

This tutorial application follows **Semantic Versioning (SemVer)**:

- **MAJOR.MINOR.PATCH** (e.g., 1.0.0)
- **MAJOR**: Incompatible API changes
- **MINOR**: New functionality in a backwards-compatible manner
- **PATCH**: Backwards-compatible bug fixes

### Future Roadmap

**Version 1.1.0 (Planned)**
- Additional endpoints for CRUD operations
- Request body parsing and validation
- Database integration examples
- Authentication middleware examples

**Version 1.2.0 (Planned)**
- File upload handling
- Rate limiting middleware
- Advanced error handling scenarios
- Performance monitoring integration

**Version 2.0.0 (Future)**
- GraphQL endpoint implementation
- WebSocket support for real-time features
- Microservices architecture examples
- Docker containerization

### Contributing

This is an educational project designed for learning purposes. While not open for external contributions, the codebase serves as a reference implementation for Node.js and Express.js best practices.

### Issue Reporting

For educational purposes, issues or questions about the implementation can be used as learning opportunities to:

1. **Understand Error Scenarios**: Explore how different types of errors are handled
2. **Practice Debugging**: Use logging output to trace request processing
3. **Learn HTTP Concepts**: Understand status codes and response formats
4. **Explore Architecture**: Study modular design patterns and separation of concerns

### License

This tutorial application is provided for educational purposes. The code demonstrates production-ready patterns while maintaining educational clarity through comprehensive documentation and examples.

---

**Last Updated:** 2024-12-30  
**API Version:** 1.0.0  
**Documentation Version:** 1.0.0

For additional questions or clarification about the API implementation, refer to the comprehensive inline documentation within the source code, which provides detailed explanations of all architectural decisions and implementation patterns.