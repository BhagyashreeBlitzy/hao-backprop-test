# Node.js Tutorial Backend

A comprehensive, production-ready Node.js backend application designed for educational purposes. This backend demonstrates fundamental web server concepts using Express.js v5.1.0 and Node.js v22.x LTS, implementing a single `/hello` endpoint with enterprise-grade architecture patterns, comprehensive error handling, and educational clarity.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [API Documentation](#api-documentation)
5. [Error Handling](#error-handling)
6. [Testing](#testing)
7. [Configuration](#configuration)
8. [Logging and Observability](#logging-and-observability)
9. [Development Guidelines](#development-guidelines)
10. [Contributing](#contributing)
11. [Educational Resources](#educational-resources)
12. [License](#license)

## Project Overview

### Purpose and Educational Goals

This Node.js backend serves as a foundational learning resource for developers exploring server-side JavaScript development. It demonstrates core web development concepts through a minimal yet comprehensive implementation that follows industry best practices and modern architectural patterns.

**Key Learning Objectives:**
- Understanding Express.js framework fundamentals and middleware patterns
- Implementing proper HTTP request/response handling and status code management
- Demonstrating centralized error handling and logging strategies
- Exploring modular application architecture and separation of concerns
- Learning production-ready configuration management and environment handling
- Practicing modern JavaScript development with Node.js v22.x LTS features

### Technical Architecture

The application implements a **three-tier modular architecture** optimized for educational clarity:

- **Runtime Layer**: Node.js v22.11.0 LTS for JavaScript execution and event loop management
- **Framework Layer**: Express.js v5.1.0 for HTTP server creation and request routing
- **Application Layer**: Custom route handlers and business logic implementation

**Core Design Principles:**
- **Educational First**: Comprehensive documentation and clear implementation patterns
- **Production Ready**: Enterprise-grade error handling, security practices, and observability
- **Modular Design**: Clean separation of concerns with reusable components
- **Modern Standards**: Latest LTS versions and current industry best practices

### Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Runtime** | Node.js | v22.11.0 LTS | JavaScript execution environment |
| **Framework** | Express.js | v5.1.0 | Web application framework |
| **Testing** | Jest | ^29.7.0 | Testing framework |
| **HTTP Testing** | Supertest | ^7.1.1 | HTTP endpoint testing |
| **Code Quality** | ESLint | ^8.56.0 | Static code analysis |
| **Development** | Nodemon | ^3.0.3 | Auto-restart development server |
| **Logging** | Chalk | ^5.3.0 | Terminal output colorization |

### Key Features

- **Single `/hello` Endpoint**: Returns "Hello world" message demonstrating basic HTTP handling
- **Centralized Error Handling**: Comprehensive error management with security-conscious responses
- **Structured Logging**: Timestamped, colorized logging for development and production
- **Environment Configuration**: Flexible configuration supporting multiple deployment environments
- **Modular Architecture**: Organized codebase with clear separation of concerns
- **Comprehensive Documentation**: Extensive inline documentation for educational clarity
- **Testing Support**: Complete test infrastructure with unit and integration test examples

## Getting Started

### Prerequisites

Ensure you have the following installed on your development machine:

- **Node.js v18 or higher** (v22.11.0 LTS recommended)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
- **npm** (included with Node.js)
  - Verify installation: `npm --version`

### Installation

1. **Navigate to the backend directory:**
   ```bash
   cd src/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment (optional):**
   ```bash
   # Copy example environment file
   cp .env.example .env
   
   # Edit .env file to customize configuration
   # PORT=3000
   # HOST=localhost
   # NODE_ENV=development
   ```

### Running the Server

#### Development Mode (Recommended for Learning)

Start the server with automatic restart on file changes:

```bash
npm run dev
```

**Features:**
- Automatic server restart with Nodemon
- Colorized console output for better readability
- Detailed error logging and stack traces
- Development-optimized configuration

#### Production Mode

Start the server for production deployment:

```bash
npm start
```

**Features:**
- Optimized performance settings
- Secure error handling (no internal details exposed)
- Production logging configuration
- Environment-specific optimizations

#### Custom Configuration

Start with custom port and host:

```bash
# Using environment variables
PORT=8080 HOST=0.0.0.0 npm start

# For production deployment
NODE_ENV=production PORT=8080 HOST=0.0.0.0 npm start
```

### Verifying Installation

Once the server is running, verify it's working correctly:

1. **Check server startup logs:**
   ```
   [2024-12-30T14:25:30.123Z] [NodeJSTutorialApp] [INFO] Server listening on http://localhost:3000 (env: development)
   [2024-12-30T14:25:30.123Z] [NodeJSTutorialApp] [INFO] Press Ctrl+C to stop the server
   ```

2. **Test the /hello endpoint:**
   ```bash
   # Using curl
   curl http://localhost:3000/hello
   
   # Expected response: "Hello world"
   ```

3. **Test in browser:**
   - Open [http://localhost:3000/hello](http://localhost:3000/hello)
   - Should display: "Hello world"

## Project Structure

The backend follows a modular architecture with clear separation of concerns:

```
src/backend/
├── app.js                     # Express application configuration and middleware setup
├── server.js                  # HTTP server entry point and process management
├── package.json              # Dependencies and npm scripts
├── .env.example              # Environment configuration template
├── docs/
│   ├── README.md             # This comprehensive documentation (canonical)
│   └── API.md                # Detailed API reference and endpoint documentation
├── config/
│   ├── index.js              # Unified configuration export and aggregation
│   └── server.js             # Server configuration (PORT, HOST, NODE_ENV resolution)
├── routes/
│   ├── index.js              # Main router aggregator and mounting point
│   └── hello.js              # Hello endpoint implementation (/hello route)
├── middleware/
│   ├── index.js              # Centralized middleware exports
│   ├── errorHandler.js       # Global error handling middleware
│   ├── notFoundHandler.js    # 404 Not Found handling middleware
│   └── requestLogger.js      # HTTP request logging middleware
├── utils/
│   ├── constants.js          # Application constants and static values
│   ├── httpStatusCodes.js    # HTTP status code constants
│   ├── logger.js             # Centralized logging utilities
│   └── responseFormatter.js  # Standardized response formatting
└── tests/                    # Test files and testing utilities
    ├── unit/                 # Unit tests for individual components
    ├── integration/          # Integration tests for HTTP endpoints
    └── helpers/              # Shared testing utilities and fixtures
```

### Core Components

#### Application Files

- **`app.js`**: Central Express application configuration with middleware registration and route mounting
- **`server.js`**: HTTP server startup, process management, and graceful shutdown handling

#### Configuration Management

- **`config/index.js`**: Unified configuration access point for all application modules
- **`config/server.js`**: Environment variable resolution with validation and fallback defaults

#### Routing Architecture

- **`routes/index.js`**: Main router aggregator implementing modular route organization
- **`routes/hello.js`**: Hello endpoint implementation demonstrating Express.js route patterns

#### Middleware Stack

- **`middleware/errorHandler.js`**: Centralized error handling with Express 5 promise support
- **`middleware/notFoundHandler.js`**: 404 error handling with consistent response formatting
- **`middleware/requestLogger.js`**: HTTP request logging with response time measurement

#### Utility Modules

- **`utils/logger.js`**: Structured logging with environment-aware colorization
- **`utils/responseFormatter.js`**: Standardized success and error response formatting
- **`utils/constants.js`**: Application constants ensuring consistency across modules
- **`utils/httpStatusCodes.js`**: HTTP status code constants for maintainable status handling

## API Documentation

### Quick Reference

The backend currently implements a single educational endpoint:

| Method | Endpoint | Description | Response Type |
|--------|----------|-------------|---------------|
| GET | `/hello` | Returns "Hello world" message | `text/plain` |

### Hello Endpoint

**Request:**
```http
GET /hello HTTP/1.1
Host: localhost:3000
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 11

Hello world
```

### Error Responses

The API returns consistent JSON error responses:

```json
{
  "error": true,
  "message": "Resource not found"
}
```

**Common Status Codes:**
- `200 OK`: Successful requests
- `404 Not Found`: Undefined endpoints
- `405 Method Not Allowed`: Unsupported HTTP methods
- `500 Internal Server Error`: Server errors

### Detailed API Documentation

For comprehensive API documentation including:
- Complete endpoint specifications
- Request/response examples
- Error handling details
- Security considerations
- Client implementation examples

**See:** [API.md](./API.md) - Complete API Reference

## Error Handling

The application implements a comprehensive, three-layer error handling strategy:

### 1. Centralized Error Middleware

**Location:** `middleware/errorHandler.js`

**Features:**
- Catches all unhandled errors from routes and middleware
- Environment-aware error detail exposure (development vs. production)
- Comprehensive error logging with request context
- Express 5 automatic promise rejection handling
- Standardized error response formatting

**Security Features:**
- Never exposes internal error details in production
- Sanitizes error messages to prevent information disclosure
- Uses generic error responses to prevent enumeration attacks
- Comprehensive error logging for security monitoring

### 2. 404 Not Found Handler

**Location:** `middleware/notFoundHandler.js`

**Features:**
- Intercepts requests to undefined routes
- Logs 404 events with request details
- Returns standardized JSON error responses
- Prevents information leakage through consistent messaging

### 3. Express 5 Promise Handling

**Automatic Error Catching:**
Express 5 automatically catches rejected promises from async routes and middleware, eliminating the need for manual error handling in most cases.

```javascript
// Errors are automatically caught and passed to error handler
app.get('/example', async (req, res) => {
  throw new Error('This will be caught automatically');
});
```

### Error Response Examples

**Development Environment:**
```json
{
  "error": true,
  "message": "An unexpected error occurred",
  "details": {
    "stack": "Error: Something went wrong\n    at ...",
    "request": {
      "method": "GET",
      "url": "/hello",
      "ip": "127.0.0.1"
    },
    "timestamp": "2024-12-30T14:25:30.123Z"
  }
}
```

**Production Environment:**
```json
{
  "error": true,
  "message": "An unexpected error occurred"
}
```

## Testing

The application includes comprehensive testing infrastructure supporting both unit and integration testing approaches.

### Testing Framework

- **Jest**: Primary testing framework with built-in assertions and mocking
- **Supertest**: HTTP endpoint testing for integration tests
- **Coverage Reporting**: Automated code coverage analysis with configurable thresholds

### Running Tests

#### All Tests
```bash
npm test
```

#### Unit Tests
```bash
npm run test:unit
```

#### Integration Tests
```bash
npm run test:integration
```

#### Watch Mode (Development)
```bash
npm run test:watch
```

#### Coverage Report
```bash
npm run test:coverage
```

### Test Organization

```
tests/
├── unit/                     # Unit tests for individual components
│   ├── utils/               # Utility function tests
│   ├── middleware/          # Middleware component tests
│   └── routes/              # Route handler tests
├── integration/             # Integration tests for HTTP endpoints
│   ├── hello.test.js        # /hello endpoint integration tests
│   └── error.test.js        # Error handling integration tests
└── helpers/                 # Shared testing utilities
    ├── testApp.js          # Test application factory
    └── fixtures.js         # Test data and fixtures
```

### Example Test

```javascript
// Integration test example
describe('GET /hello', () => {
  it('should return Hello world with 200 status', async () => {
    const response = await request(app)
      .get('/hello')
      .expect('Content-Type', /text/)
      .expect(200);
    
    expect(response.text).toBe('Hello world');
  });
});
```

### Coverage Requirements

- **Line Coverage**: 90% minimum
- **Function Coverage**: 100% target
- **Branch Coverage**: 85% minimum

## Configuration

The application uses environment-based configuration with sensible defaults and validation.

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port for HTTP binding |
| `HOST` | `localhost` | Server host address |
| `NODE_ENV` | `development` | Node.js environment setting |

### Configuration Files

- **`.env.example`**: Template for environment variable configuration
- **`config/server.js`**: Environment variable resolution with validation
- **`config/index.js`**: Unified configuration access point

### Environment-Specific Behavior

#### Development
- Colorized console logging
- Detailed error responses with stack traces
- Verbose request logging
- Auto-restart with file watching

#### Test
- Suppressed console output
- Fast test execution
- Isolated test environment
- Mock-friendly configuration

#### Production
- Optimized performance settings
- Secure error handling (no internal details)
- Structured logging for log aggregation
- Security-hardened configuration

### Configuration Usage

```javascript
// Import specific configuration values
const { PORT, HOST, NODE_ENV } = require('./config');

// Import complete configuration object
const { getServerConfig } = require('./config');
const config = getServerConfig();
console.log(`Server: ${config.host}:${config.port} (${config.env})`);
```

## Logging and Observability

The application implements structured logging for comprehensive observability and debugging support.

### Log Levels

- **INFO**: Server startup, successful requests, operational events
- **WARN**: 404 errors, configuration warnings, non-critical issues
- **ERROR**: Server errors, exceptions, critical failures

### Log Format

```
[timestamp] [app_name] [level] message [metadata]
```

**Example:**
```
[2024-12-30T14:25:30.123Z] [NodeJSTutorialApp] [INFO] GET /hello 200 45ms
```

### Features

- **Structured Metadata**: JSON metadata for programmatic log analysis
- **High-Precision Timing**: Microsecond-accurate response time measurement
- **Environment-Aware Colorization**: Enhanced readability in development
- **Centralized Configuration**: Consistent formatting across all modules

### Monitoring Integration

The logging system is designed for integration with:
- **Log Aggregation**: ELK Stack, Splunk, or cloud logging services
- **Monitoring Tools**: Application Performance Monitoring (APM) systems
- **Alerting Systems**: Error rate and performance threshold monitoring
- **Analytics**: Request pattern analysis and performance metrics

## Development Guidelines

### Code Style and Standards

- **ESLint Configuration**: Automated code quality enforcement
- **Comprehensive Documentation**: JSDoc comments for all functions and modules
- **Modular Architecture**: Clear separation of concerns and single responsibility
- **Error Handling**: Comprehensive error management throughout the application

### Adding New Endpoints

1. **Create Route Module**: Add new file in `routes/` directory
2. **Implement Route Handler**: Follow patterns established in `routes/hello.js`
3. **Mount Route**: Register new router in `routes/index.js`
4. **Add Tests**: Create corresponding test files for new functionality
5. **Update Documentation**: Update API.md with new endpoint details

### Best Practices

- **Use Centralized Utilities**: Leverage existing response formatters and constants
- **Follow Established Patterns**: Maintain consistency with existing code structure
- **Comprehensive Testing**: Include both unit and integration tests
- **Document Everything**: Provide educational value through clear documentation

### Development Workflow

1. **Start Development Server**: `npm run dev`
2. **Make Changes**: Edit files with automatic restart
3. **Run Tests**: `npm test` to validate changes
4. **Check Code Quality**: ESLint automatically validates code style
5. **Update Documentation**: Keep README.md and API.md current

## Contributing

This project serves as an educational resource demonstrating Node.js and Express.js best practices. While primarily designed for learning purposes, the codebase follows professional development standards.

### Code Review Guidelines

When reviewing or studying the code, consider:

1. **Architecture Patterns**: How modules interact and maintain separation of concerns
2. **Error Handling**: Comprehensive error management strategies
3. **Testing Approaches**: Unit and integration testing patterns
4. **Documentation Quality**: Educational value and clarity of explanations
5. **Production Readiness**: Security, performance, and maintainability considerations

### Learning Objectives

Use this codebase to explore:
- Express.js middleware patterns and request lifecycle
- Modern JavaScript features and Node.js capabilities
- Error handling and response formatting strategies
- Testing methodologies for web applications
- Configuration management and environment handling
- Logging and observability best practices

## Educational Resources

### Key Learning Topics

1. **Node.js Fundamentals**
   - Event-driven architecture and event loop
   - Non-blocking I/O and asynchronous programming
   - Module system and dependency management

2. **Express.js Framework**
   - Middleware patterns and execution order
   - Route handling and parameter processing
   - Error handling and response generation

3. **Web Development Concepts**
   - HTTP protocol and status codes
   - Request/response cycle and headers
   - API design and RESTful principles

4. **Production Practices**
   - Error handling and graceful degradation
   - Logging and observability patterns
   - Configuration management and security
   - Testing strategies and code quality

### Extended Learning

This foundation prepares you for exploring:
- Database integration with MongoDB or PostgreSQL
- Authentication and authorization systems
- Real-time features with WebSockets
- Microservices architecture patterns
- Container deployment with Docker
- Cloud platform deployment (AWS, Azure, GCP)

### Documentation Structure

The comprehensive documentation includes:
- **Inline Code Comments**: Detailed explanations within source files
- **API Documentation**: Complete endpoint reference in `docs/API.md`
- **Architecture Guidance**: Design patterns and implementation notes
- **Testing Examples**: Unit and integration test demonstrations

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

- **Commercial Use**: ✅ Permitted
- **Modification**: ✅ Permitted
- **Distribution**: ✅ Permitted
- **Private Use**: ✅ Permitted
- **Liability**: ❌ License includes no liability
- **Warranty**: ❌ License includes no warranty

### Attribution

When using this code for educational purposes or as a foundation for other projects, please maintain attribution to the original educational intent and comprehensive documentation approach.

---

**Project Status**: ✅ Production Ready for Educational Use  
**Node.js Compatibility**: v18+ (v22.11.0 LTS Recommended)  
**Express.js Version**: v5.1.0  
**Last Updated**: 2024-12-30  
**Documentation Version**: 1.0.0

For detailed API specifications and advanced usage examples, see [API.md](./API.md).