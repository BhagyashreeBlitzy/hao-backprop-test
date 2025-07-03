# Node.js Hello World Tutorial API Documentation

## Overview

Welcome to the API documentation for the Node.js Hello World Tutorial backend application. This RESTful API demonstrates fundamental web server concepts using Node.js 18+ and Express.js 5.1.0, providing a simple yet production-ready HTTP server implementation.

**Purpose**: This API serves as an educational demonstration of modern Node.js and Express.js development practices, showcasing HTTP request-response patterns, error handling, and health monitoring in a minimalist web application.

**Technology Stack**:
- **Runtime**: Node.js 18+ (required for Express.js 5.1.0 compatibility)
- **Framework**: Express.js 5.1.0 (latest stable with security enhancements)
- **Architecture**: Stateless, event-driven HTTP server
- **Response Formats**: Plain text, JSON

**Base URL**: `http://localhost:3000` (default development configuration)

**API Characteristics**:
- Lightweight and fast with <100ms response times
- Stateless design supporting high concurrency
- Comprehensive error handling with standardized responses
- Built-in health monitoring for operational observability
- Security-hardened with Express.js 5.1.0 protections

## Authentication

**No authentication required**. All endpoints are publicly accessible for educational and demonstration purposes. This design choice aligns with the tutorial's objective of providing immediate, barrier-free access to core HTTP server concepts.

**Security Note**: While authentication is not implemented in this tutorial application, production applications should implement appropriate authentication mechanisms such as OAuth 2.0, JWT, or API keys based on security requirements.

## Endpoints

### GET /hello

Returns a simple "Hello world" message as plain text, demonstrating basic HTTP GET request handling and static response generation.

**Endpoint Details**:
- **URL**: `/hello`
- **Method**: `GET`
- **Content-Type**: `text/plain; charset=utf-8`
- **Response Time**: <100ms target

**Request Format**:
```http
GET /hello HTTP/1.1
Host: localhost:3000
Accept: text/plain
```

**Request Headers**:
- `Accept`: `text/plain` (recommended, but optional)
- `User-Agent`: Client identification (optional)

**Successful Response**:
```http
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Content-Length: 11
Date: Mon, 03 Jul 2025 12:00:00 GMT

Hello world
```

**Response Schema**:
- **Status Code**: `200 OK`
- **Body**: Static string "Hello world"
- **Encoding**: UTF-8
- **MIME Type**: `text/plain`

**Error Responses**:

| Status Code | Description | Response Body |
|-------------|-------------|---------------|
| `405` | Method Not Allowed - Non-GET methods | `{"status":405,"message":"Method Not Allowed"}` |
| `500` | Internal Server Error - Unexpected server failure | `{"status":500,"message":"Internal Server Error"}` |

**Example Requests**:

```bash
# cURL example
curl -i http://localhost:3000/hello

# Response
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Content-Length: 11

Hello world
```

```bash
# HTTP client example with Accept header
curl -i -H "Accept: text/plain" http://localhost:3000/hello
```

```bash
# Invalid method example (returns 405)
curl -i -X POST http://localhost:3000/hello

# Response
HTTP/1.1 405 Method Not Allowed
Content-Type: application/json; charset=utf-8

{"status":405,"message":"Method Not Allowed"}
```

**Implementation Notes**:
- Only GET method is supported; all other HTTP methods return 405 Method Not Allowed
- Response content is static and does not vary based on request parameters
- Endpoint is optimized for educational demonstration with minimal processing overhead
- Integrates with centralized logging for request tracking and monitoring

### GET /health

Returns comprehensive application health status information in JSON format, designed for monitoring systems, load balancers, and operational observability.

**Endpoint Details**:
- **URL**: `/health`
- **Method**: `GET`
- **Content-Type**: `application/json; charset=utf-8`
- **Response Time**: <50ms target

**Request Format**:
```http
GET /health HTTP/1.1
Host: localhost:3000
Accept: application/json
```

**Request Headers**:
- `Accept`: `application/json` (recommended, but optional)
- `User-Agent`: Client identification (optional)

**Successful Response**:
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Date: Mon, 03 Jul 2025 12:00:00 GMT

{
  "status": "healthy",
  "env": "development",
  "uptime": 3600.5,
  "timestamp": "2025-07-03T12:00:00.000Z",
  "memory": {
    "rss": 29036544,
    "heapTotal": 6488064,
    "heapUsed": 4124392,
    "external": 1089470
  }
}
```

**Response Schema**:
```json
{
  "status": "string (healthy|unhealthy|degraded)",
  "env": "string (development|production|test)",
  "uptime": "number (seconds since application start)",
  "timestamp": "string (ISO8601 datetime)",
  "memory": {
    "rss": "number (Resident Set Size in bytes)",
    "heapTotal": "number (Total heap size in bytes)",
    "heapUsed": "number (Used heap size in bytes)", 
    "external": "number (External memory usage in bytes)"
  }
}
```

**Field Descriptions**:
- **status**: Current application health status (always "healthy" in current implementation)
- **env**: Runtime environment (development, production, test)
- **uptime**: Process uptime in seconds since application start
- **timestamp**: Current server timestamp in ISO8601 format
- **memory**: Node.js process memory usage statistics from `process.memoryUsage()`

**Error Responses**:

| Status Code | Description | Response Body |
|-------------|-------------|---------------|
| `500` | Internal Server Error - Health check failure | `{"status":500,"message":"Internal Server Error"}` |

**Example Requests**:

```bash
# cURL example
curl -i http://localhost:3000/health

# Response
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "status": "healthy",
  "env": "development",
  "uptime": 1234.56,
  "timestamp": "2025-07-03T12:00:00.000Z",
  "memory": {
    "rss": 29036544,
    "heapTotal": 6488064,
    "heapUsed": 4124392,
    "external": 1089470
  }
}
```

```bash
# JSON pretty-print example
curl -s http://localhost:3000/health | json_pp
```

**Monitoring Integration**:
- Suitable for load balancer health checks (AWS ALB, NGINX, HAProxy)
- Compatible with monitoring systems (Prometheus, Grafana, DataDog)
- Provides essential metrics for application performance monitoring
- Enables automated alerting based on memory usage and uptime thresholds

**Implementation Notes**:
- Memory usage reported in bytes from Node.js `process.memoryUsage()`
- Uptime calculated from Node.js `process.uptime()` in seconds
- Timestamp generated server-side using `new Date().toISOString()`
- Environment value sourced from validated runtime configuration
- Future extensible for database connectivity and external service checks

## Error Handling

The API implements comprehensive, standardized error handling with consistent JSON response formatting. All errors are logged for monitoring and debugging while ensuring security-appropriate information disclosure based on the runtime environment.

**Error Response Format**:
```json
{
  "status": "number (HTTP status code)",
  "message": "string (human-readable error description)",
  "details": "object (optional, additional error context)",
  "stack": "string (only in development/test environments)"
}
```

**Environment-Based Error Details**:
- **Production**: Error responses exclude stack traces and sensitive details to prevent information leakage
- **Development/Test**: Error responses include full stack traces and debugging information for troubleshooting

**Error Categories**:

### Client Errors (4xx)

**404 Not Found**
```json
{
  "status": 404,
  "message": "Not Found"
}
```
- **Cause**: Request to non-existent endpoint or resource
- **Resolution**: Verify the request URL and available endpoints

**405 Method Not Allowed**
```json
{
  "status": 405,
  "message": "Method Not Allowed"
}
```
- **Cause**: Using unsupported HTTP method on an endpoint (e.g., POST to /hello)
- **Resolution**: Use the correct HTTP method (GET) for the endpoint

### Server Errors (5xx)

**500 Internal Server Error**
```json
{
  "status": 500,
  "message": "Internal Server Error"
}
```
- **Cause**: Unexpected server-side failure or unhandled exception
- **Resolution**: Check server logs for detailed error information; contact support if issue persists

**Development Environment Error Example**:
```json
{
  "status": 500,
  "message": "Internal Server Error",
  "details": {
    "originalName": "TypeError",
    "originalMessage": "Cannot read property 'x' of undefined"
  },
  "stack": "TypeError: Cannot read property 'x' of undefined\n    at /app/routes/hello.js:25:10\n    ..."
}
```

**Error Logging**:
- All errors are logged with comprehensive metadata including request details, timestamps, and stack traces
- Error logs include request method, URL, client IP, user agent, and processing context
- Production environments log errors without exposing sensitive information in responses
- Development environments provide verbose error details for debugging

**Error Handling Best Practices**:
- Clients should implement retry logic with exponential backoff for 5xx errors
- 4xx errors indicate client-side issues and should not be retried without correction
- Monitor error rates and patterns for application health assessment
- Use status codes to determine appropriate client response strategies

## Status Codes

The API uses standard HTTP status codes to indicate the success or failure of requests. This section provides a comprehensive reference for all status codes used by the API.

### Success Codes (2xx)

| Code | Name | Usage | Description |
|------|------|-------|-------------|
| `200` | OK | `/hello`, `/health` | Request successful, response body contains requested data |

### Client Error Codes (4xx)

| Code | Name | Usage | Description |
|------|------|-------|-------------|
| `404` | Not Found | Invalid endpoints | Requested resource or endpoint does not exist |
| `405` | Method Not Allowed | Non-GET requests to `/hello` | HTTP method not supported for this endpoint |

### Server Error Codes (5xx)

| Code | Name | Usage | Description |
|------|------|-------|-------------|
| `500` | Internal Server Error | All endpoints | Unexpected server error occurred during processing |

**Status Code Guidelines**:
- **2xx codes**: Indicate successful request processing; response body contains valid data
- **4xx codes**: Indicate client-side errors; client should modify request before retrying
- **5xx codes**: Indicate server-side errors; client may retry with appropriate backoff strategy

**Response Time Expectations**:
- **200 OK**: Target response time <100ms for all successful requests
- **4xx/5xx errors**: Error responses typically complete within <50ms
- **Health checks**: Optimized for <25ms response time for monitoring efficiency

## Versioning & Environment

**API Versioning**: This tutorial API is intentionally **versionless** to maintain educational simplicity and focus on fundamental HTTP server concepts. The API does not implement versioning strategies such as URL path versioning (`/v1/hello`) or header-based versioning.

**Future Versioning Considerations**: Should the API evolve beyond its educational scope, consider implementing:
- URL path versioning: `/v1/hello`, `/v2/hello`
- Header-based versioning: `Accept: application/vnd.api+json;version=1`
- Media type versioning: `application/vnd.myapi.v1+json`

**Environment Requirements**:
- **Node.js**: Version 18.0.0 or higher (required for Express.js 5.1.0 compatibility)
- **Express.js**: Version 5.1.0 (includes security enhancements and ReDoS protection)
- **Memory**: Minimum 50MB available memory for optimal performance
- **Network**: HTTP/1.1 protocol support (HTTPS optional for production)

**Runtime Environment Detection**:
The application automatically detects its runtime environment through the `NODE_ENV` environment variable:

- **development** (default): Enhanced logging, detailed error responses, development-specific middleware
- **production**: Optimized performance, security-hardened error responses, minimal logging
- **test**: Testing-specific configuration, predictable behavior, isolated state

**Environment-Specific Behavior**:

| Feature | Development | Production | Test |
|---------|-------------|------------|------|
| Error Details | Full stack traces | Sanitized messages | Controlled output |
| Logging Level | Verbose (debug/info/warn/error) | Essential (warn/error) | Minimal (error only) |
| Response Headers | Development headers included | Production headers only | Test-specific headers |
| Performance Monitoring | Enhanced metrics | Essential metrics | Basic metrics |

**Deployment Compatibility**:
- **Local Development**: `npm start` or `node server.js`
- **Docker**: Compatible with standard Node.js Docker images
- **Cloud Platforms**: AWS, Azure, Google Cloud, Heroku
- **Process Managers**: PM2, systemd, Docker Compose
- **Reverse Proxies**: NGINX, Apache HTTP Server, CloudFlare

**Configuration Management**:
Environment configuration is managed through environment variables with sensible defaults:

```bash
# Essential environment variables
NODE_ENV=production    # Runtime environment mode
PORT=3000             # Server listening port
HOST=localhost        # Server binding host

# Optional environment variables
LOG_LEVEL=info        # Logging verbosity level
REQUEST_TIMEOUT=30000 # Request timeout in milliseconds
```

**Health Check Integration**:
The `/health` endpoint reports the current environment in its response, enabling monitoring systems to verify correct environment configuration and detect environment-specific issues.

---

## Conclusion

This API documentation provides comprehensive coverage of the Node.js Hello World Tutorial backend, designed for developers, educators, and reviewers to understand, test, and integrate with the HTTP API. The implementation demonstrates modern Node.js and Express.js best practices while maintaining educational clarity and production-readiness.

For additional information, implementation details, or advanced configuration options, refer to the complete source code and technical specifications included with this tutorial project.

**Support and Resources**:
- Source Code: Available in the project repository
- Technical Specifications: Detailed in the project documentation
- Community: Educational use encouraged with proper attribution
- Issues: Report through project repository issue tracker