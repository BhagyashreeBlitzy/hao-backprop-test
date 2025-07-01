# Node.js Hello World Tutorial API Documentation

## Overview

This document provides comprehensive API documentation for the Node.js Hello World tutorial backend application. The API demonstrates fundamental HTTP server concepts using Node.js 18+ and Express.js 5.1.0, designed for educational purposes to teach core web development principles.

**Technology Stack:**
- **Runtime:** Node.js 18+ (required for Express.js 5.1.0 compatibility)
- **Framework:** Express.js 5.1.0 (latest stable with enhanced security features)
- **Protocol:** HTTP/1.1 with keep-alive support
- **Content Types:** `text/plain`, `application/json`
- **Character Encoding:** UTF-8

**Educational Purpose:**
This API serves as a minimal, complete example of REST API implementation focusing on:
- HTTP request-response patterns
- Express.js routing and middleware
- Standardized error handling
- Application monitoring and health checks
- Modern JavaScript and Node.js best practices

## Base URL

```
http://localhost:3000
```

**Environment Configuration:**
- **Development:** `http://localhost:3000`
- **Production:** Configured via `HOST` and `PORT` environment variables
- **Port Range:** 1024-65535 (default: 3000)
- **Host Binding:** Configurable (default: localhost)

## Authentication

**No authentication required.** All endpoints are publicly accessible for educational and demonstration purposes. The API is designed to be stateless and does not require any authentication headers, API keys, or session management.

## Endpoints

### GET /hello

Returns a static "Hello world" message as plain text. This endpoint demonstrates the most basic HTTP GET request-response pattern.

**URL:** `/hello`  
**Method:** `GET`  
**Description:** Returns a simple greeting message for educational demonstration

#### Request

**HTTP Method:** GET only (all other methods return 405 Method Not Allowed)

**Headers:**
- `Accept: text/plain` (optional, but recommended)
- `User-Agent: <client-identifier>` (optional)

**Query Parameters:** None  
**Request Body:** None

**Example Request:**
```bash
curl -i http://localhost:3000/hello
```

#### Response

**Success Response (200 OK):**

**Status Code:** `200 OK`

**Headers:**
- `Content-Type: text/plain; charset=utf-8`
- `Content-Length: 11`
- `Date: <current-date>`

**Response Body:**
```
Hello world
```

**Complete Example Response:**
```http
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Content-Length: 11
Date: Mon, 01 Jul 2025 12:00:00 GMT

Hello world
```

#### Error Responses

**Method Not Allowed (405):**

When using any HTTP method other than GET:

```http
HTTP/1.1 405 Method Not Allowed
Content-Type: application/json; charset=utf-8

{
  "status": 405,
  "message": "Method Not Allowed"
}
```

**Internal Server Error (500):**

For unexpected server errors:

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json; charset=utf-8

{
  "status": 500,
  "message": "Internal Server Error"
}
```

#### Performance Characteristics

- **Target Response Time:** < 100ms
- **Memory Usage:** Minimal (static response)
- **Concurrency:** Unlimited (stateless design)
- **Caching:** No caching headers (always fresh)

---

### GET /health

Returns comprehensive application health status in JSON format. Used for monitoring, load balancer health checks, and operational observability.

**URL:** `/health`  
**Method:** `GET`  
**Description:** Provides application health metrics and status information

#### Request

**HTTP Method:** GET

**Headers:**
- `Accept: application/json` (optional, but recommended)
- `User-Agent: <client-identifier>` (optional)

**Query Parameters:** None  
**Request Body:** None

**Example Request:**
```bash
curl -i http://localhost:3000/health
```

#### Response

**Success Response (200 OK):**

**Status Code:** `200 OK`

**Headers:**
- `Content-Type: application/json; charset=utf-8`
- `Date: <current-date>`

**Response Body Schema:**
```json
{
  "status": "healthy",
  "env": "development|production|test",
  "uptime": "<seconds-since-startup>",
  "timestamp": "<ISO8601-timestamp>",
  "memory": {
    "rss": "<resident-set-size-bytes>",
    "heapTotal": "<total-heap-bytes>",
    "heapUsed": "<used-heap-bytes>",
    "external": "<external-memory-bytes>",
    "arrayBuffers": "<array-buffer-bytes>"
  }
}
```

**Example Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Date: Mon, 01 Jul 2025 12:00:00 GMT

{
  "status": "healthy",
  "env": "development",
  "uptime": 3600.123,
  "timestamp": "2025-07-01T12:00:00.000Z",
  "memory": {
    "rss": 25165824,
    "heapTotal": 8388608,
    "heapUsed": 4194304,
    "external": 1048576,
    "arrayBuffers": 0
  }
}
```

**Response Field Descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Always "healthy" for successful responses |
| `env` | string | Current runtime environment (development/production/test) |
| `uptime` | number | Process uptime in seconds (floating-point precision) |
| `timestamp` | string | ISO8601 timestamp of the health check |
| `memory.rss` | number | Resident Set Size - total memory allocated by the process |
| `memory.heapTotal` | number | Total heap memory allocated by V8 |
| `memory.heapUsed` | number | Heap memory currently in use by V8 |
| `memory.external` | number | Memory usage of C++ objects bound to JavaScript objects |
| `memory.arrayBuffers` | number | Memory allocated for ArrayBuffers and SharedArrayBuffers |

#### Error Responses

**Internal Server Error (500):**

For unexpected server errors during health check:

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json; charset=utf-8

{
  "status": 500,
  "message": "Internal Server Error"
}
```

#### Health Check Usage

**Monitoring Systems:**
- Poll every 30-60 seconds for continuous monitoring
- Alert on non-200 responses or absence of "healthy" status
- Track memory usage trends over time

**Load Balancers:**
- Use for upstream health verification
- Configure appropriate timeout values (< 5 seconds recommended)
- Set retry logic for transient failures

**Container Orchestration:**
- Configure as liveness and readiness probe
- Set appropriate failure thresholds (3-5 consecutive failures)

---

## Error Handling

All API errors follow a standardized JSON response format with consistent structure across all endpoints. Error responses include appropriate HTTP status codes and human-readable messages.

### Error Response Format

**Development/Test Environment:**
```json
{
  "status": "<http-status-code>",
  "message": "<error-message>",
  "details": {
    "<additional-context>": "<debug-information>"
  },
  "stack": "<stack-trace-for-debugging>"
}
```

**Production Environment:**
```json
{
  "status": "<http-status-code>",
  "message": "<error-message>"
}
```

**Security Note:** Stack traces and detailed error information are automatically hidden in production to prevent information disclosure.

### Standard Error Types

#### 404 Not Found

**Scenario:** Requesting a non-existent endpoint

**Example Request:**
```bash
curl -i http://localhost:3000/invalid-endpoint
```

**Response:**
```http
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8

{
  "status": 404,
  "message": "Not Found"
}
```

#### 405 Method Not Allowed

**Scenario:** Using an unsupported HTTP method on an existing endpoint

**Example Request:**
```bash
curl -i -X POST http://localhost:3000/hello
```

**Response:**
```http
HTTP/1.1 405 Method Not Allowed
Content-Type: application/json; charset=utf-8

{
  "status": 405,
  "message": "Method Not Allowed"
}
```

#### 500 Internal Server Error

**Scenario:** Unexpected server-side errors

**Response:**
```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json; charset=utf-8

{
  "status": 500,
  "message": "Internal Server Error"
}
```

### Error Logging

All errors are logged internally with comprehensive context:
- Request method and URL
- Client user agent
- Error details and stack traces
- Request timestamp
- Memory and system metrics (when relevant)

**Log Format Example:**
```
[ERROR] 2025-07-01T12:00:00.000Z - Express error handler caught error
{
  "status": 405,
  "message": "Method Not Allowed",
  "method": "POST",
  "url": "/hello",
  "userAgent": "curl/7.68.0"
}
```

## HTTP Status Codes

Complete reference of HTTP status codes used by the API:

| Status Code | Name | Description | Endpoints |
|-------------|------|-------------|-----------|
| `200` | OK | Successful request | `/hello`, `/health` |
| `404` | Not Found | Requested resource not found | Any invalid endpoint |
| `405` | Method Not Allowed | HTTP method not supported | `/hello` (non-GET methods) |
| `500` | Internal Server Error | Unexpected server error | Any endpoint (system failures) |

### Status Code Details

**200 OK**
- Successful completion of GET requests
- Response includes appropriate content-type headers
- Body contains requested data (text or JSON)

**404 Not Found**
- Invalid or non-existent endpoint paths
- Automatic response for undefined routes
- Consistent JSON error format

**405 Method Not Allowed**
- Unsupported HTTP methods on valid endpoints
- `/hello` endpoint only supports GET method
- Proper REST API method enforcement

**500 Internal Server Error**
- Unexpected application errors
- Database connection failures (if applicable)
- System resource exhaustion
- Unhandled exceptions in request processing

## Request/Response Examples

### Complete Request-Response Cycles

#### Successful Hello World Request

**Request:**
```bash
curl -i -H "Accept: text/plain" http://localhost:3000/hello
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Content-Length: 11
Date: Mon, 01 Jul 2025 12:00:00 GMT
Connection: keep-alive

Hello world
```

#### Successful Health Check Request

**Request:**
```bash
curl -i -H "Accept: application/json" http://localhost:3000/health
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 234
Date: Mon, 01 Jul 2025 12:00:00 GMT
Connection: keep-alive

{
  "status": "healthy",
  "env": "development",
  "uptime": 1234.567,
  "timestamp": "2025-07-01T12:00:00.000Z",
  "memory": {
    "rss": 25165824,
    "heapTotal": 8388608,
    "heapUsed": 4194304,
    "external": 1048576,
    "arrayBuffers": 0
  }
}
```

#### Method Not Allowed Error

**Request:**
```bash
curl -i -X DELETE http://localhost:3000/hello
```

**Response:**
```http
HTTP/1.1 405 Method Not Allowed
Content-Type: application/json; charset=utf-8
Content-Length: 45
Date: Mon, 01 Jul 2025 12:00:00 GMT
Connection: keep-alive

{
  "status": 405,
  "message": "Method Not Allowed"
}
```

## Environment and Configuration

### Runtime Requirements

**Node.js Version:** 18.0.0 or higher (required for Express.js 5.1.0)
**Express.js Version:** 5.1.0 (latest stable with security enhancements)
**npm Version:** 9.0.0 or higher (recommended)

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Runtime environment mode | `development` | No |
| `PORT` | Server listening port | `3000` | No |
| `HOST` | Server bind address | `localhost` | No |

**Supported NODE_ENV Values:**
- `development` - Full error details and debug logging
- `production` - Secure error handling and optimized performance
- `test` - Testing environment with appropriate configurations

### Security Features

**Express.js 5.1.0 Security Enhancements:**
- ReDoS attack prevention through updated path-to-regexp
- CVE-2024-45590 mitigation
- Automatic promise rejection handling
- Enhanced request parsing security

**Application Security:**
- Environment-aware error handling
- Secure header configuration
- Input validation through Express.js routing
- No sensitive data exposure in responses

### Performance Characteristics

**Response Time Targets:**
- `/hello` endpoint: < 100ms
- `/health` endpoint: < 50ms
- Error responses: < 25ms

**Memory Usage:**
- Baseline: < 50MB
- Per request: < 1MB additional
- Memory cleanup: Automatic garbage collection

**Concurrency:**
- Stateless design supports unlimited concurrent requests
- Node.js event loop handles I/O efficiently
- No blocking operations in request processing

## Testing and Development

### Development Server

**Starting the server:**
```bash
npm start
```

**Development mode with auto-reload:**
```bash
npm run dev
```

**Testing endpoints:**
```bash
# Test hello endpoint
curl http://localhost:3000/hello

# Test health endpoint  
curl http://localhost:3000/health

# Test error handling
curl -X POST http://localhost:3000/hello
```

### API Testing

**Basic functionality test:**
```bash
# Should return "Hello world"
curl -s http://localhost:3000/hello

# Should return JSON health status
curl -s http://localhost:3000/health | jq '.'

# Should return 405 error
curl -s -X POST http://localhost:3000/hello | jq '.'
```

**Load testing (basic):**
```bash
# Simple load test using curl
for i in {1..100}; do
  curl -s http://localhost:3000/hello > /dev/null &
done
wait
```

## Conclusion

This API documentation covers all aspects of the Node.js Hello World tutorial backend, including:

- **Complete endpoint documentation** with request/response examples
- **Comprehensive error handling** with standardized response formats
- **Operational monitoring** through health check endpoints
- **Security considerations** with environment-aware configuration
- **Performance characteristics** and optimization details
- **Development and testing** guidance for educational use

The API demonstrates modern Node.js and Express.js best practices while maintaining simplicity for educational purposes. It serves as a solid foundation for understanding HTTP server development, RESTful API design, and backend application architecture.

For additional support or questions about this API, refer to the complete source code implementation and technical specifications provided with this tutorial.