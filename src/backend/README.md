# Node.js Tutorial Backend

A comprehensive, educational Node.js and Express.js backend application demonstrating fundamental HTTP server concepts, modern JavaScript patterns, and production-ready development practices. This backend serves as a hands-on learning resource for developers exploring server-side JavaScript development with industry-standard tools and techniques.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture and File Structure](#architecture-and-file-structure)
3. [Setup and Installation](#setup-and-installation)
4. [Usage and Scripts](#usage-and-scripts)
5. [API Summary](#api-summary)
6. [Error Handling and Logging](#error-handling-and-logging)
7. [Testing and Coverage](#testing-and-coverage)
8. [Development Guidelines](#development-guidelines)
9. [Contribution Guidelines](#contribution-guidelines)
10. [Links and References](#links-and-references)

---

## Project Overview

### Educational Mission

This Node.js tutorial backend addresses the need for accessible, practical learning resources in modern server-side JavaScript development. Many developers transitioning to backend development require hands-on examples that demonstrate core concepts without overwhelming complexity. This application provides a foundational understanding of HTTP server creation, request handling, and response generation in a Node.js environment.

**Key Learning Objectives:**
- **HTTP Server Fundamentals**: Understanding Node.js HTTP server creation and configuration
- **Express.js Framework**: Learning the de facto standard web framework for Node.js
- **Modern JavaScript Patterns**: ES2015+ features and async/await error handling
- **Production-Ready Practices**: Error handling, logging, testing, and code organization
- **API Development**: RESTful endpoint design and HTTP protocol compliance

### Core Business Problem

The project addresses the growing demand for practical Node.js learning resources that bridge the gap between overly simplistic tutorials and complex production applications. It provides a minimal yet properly structured implementation that follows current industry best practices while maintaining educational clarity.

### Technical Stack

- **Runtime**: Node.js v22.x LTS (Active until October 2025)
- **Framework**: Express.js v5.1.0 (latest stable with enhanced security and performance)
- **Testing**: Jest v29.0.0 with Supertest v7.1.1 for HTTP testing
- **Code Quality**: ESLint v8.56.0 with comprehensive rule sets
- **Development**: Nodemon v3.0.3 for hot-reloading during development

---

## Architecture and File Structure

### High-Level Architecture

The application follows a **minimalist single-tier architecture** designed for educational clarity. It implements an **event-driven, non-blocking I/O architecture** that leverages Node.js's single-threaded event loop model for efficient HTTP request handling.

```
src/backend/
├── app.js                      # Express application configuration and initialization
├── server.js                   # HTTP server entry point and process management
├── package.json                # Project dependencies and scripts configuration
├── config/
│   ├── index.js               # Centralized configuration aggregation
│   └── server.js              # Server-specific configuration (port, host, environment)
├── routes/
│   ├── index.js               # Main router aggregator
│   └── hello.js               # Hello endpoint implementation (/hello)
├── middleware/
│   ├── index.js               # Middleware aggregation and exports
│   ├── requestLogger.js       # HTTP request logging middleware
│   ├── notFoundHandler.js     # 404 Not Found response handler
│   └── errorHandler.js        # Centralized error handling middleware
├── utils/
│   ├── logger.js              # Centralized logging utilities (logInfo, logWarn, logError)
│   ├── responseFormatter.js   # Standardized response formatting utilities
│   ├── httpStatusCodes.js     # HTTP status code constants
│   └── constants.js           # Application-wide constants
└── docs/
    └── API.md                 # Comprehensive API documentation
```

### Component Architecture

The application implements a **three-tier component structure** optimized for educational clarity:

| Layer | Component | Responsibility | Technology |
|-------|-----------|---------------|------------|
| **Runtime Layer** | Node.js Runtime Engine | JavaScript execution and event loop management | Node.js v22.11.0 LTS |
| **Framework Layer** | Express.js Application | HTTP server creation and request routing | Express.js v5.1.0 |
| **Application Layer** | Route Handlers & Middleware | Business logic and request processing | JavaScript ES2015+ |

### Key Design Principles

- **Separation of Concerns**: Clear distinction between app configuration (`app.js`) and server startup (`server.js`)
- **Modular Architecture**: Routes, middleware, and utilities organized in logical modules
- **Centralized Configuration**: Environment variables and settings managed in dedicated config modules
- **Educational Clarity**: Comprehensive documentation and maintainable code structure
- **Production Readiness**: Error handling, logging, and testing patterns suitable for real applications

---

## Setup and Installation

### Prerequisites

Before setting up the Node.js Tutorial Backend, ensure you have the following installed:

- **Node.js v18 or higher** (v22.x LTS recommended)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
- **npm v10 or higher** (bundled with Node.js)
  - Verify installation: `npm --version`

### Installation Steps

1. **Navigate to the backend directory**:
   ```bash
   cd src/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Verify installation** by running tests:
   ```bash
   npm test
   ```

### Environment Configuration

The application supports flexible configuration through environment variables with sensible defaults:

#### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP server port |
| `HOST` | `localhost` | Server host address |
| `NODE_ENV` | `development` | Node.js environment |

#### Configuration Examples

**Development (default)**:
```bash
# Uses default configuration
npm start
```

**Custom port**:
```bash
PORT=8080 npm start
```

**Production deployment**:
```bash
NODE_ENV=production PORT=8080 HOST=0.0.0.0 npm start
```

**Environment file** (optional):
Create a `.env` file in the backend directory:
```env
PORT=3000
HOST=localhost
NODE_ENV=development
```

---

## Usage and Scripts

### Available NPM Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `npm start` | `node server.js` | Start the production server |
| `npm run dev` | `nodemon server.js` | Start development server with hot-reloading |
| `npm test` | `jest` | Run all tests |
| `npm run test:coverage` | `jest --coverage` | Run tests with coverage report |
| `npm run lint` | `eslint src/backend` | Run code linting |

### Starting the Server

#### Development Mode
```bash
npm run dev
```
- Uses nodemon for automatic restarts on file changes
- Enables colorized console output
- Watches `src/backend` directory for changes
- Ideal for development and learning

#### Production Mode
```bash
npm start
```
- Direct Node.js execution without file watching
- Optimized for production deployment
- Uses production-level logging and error handling

### Server Output

When successfully started, you'll see output like:
```
[2024-12-30T14:25:30.123Z] [NodeJSTutorialApp] [INFO] Server listening on http://localhost:3000 (env: development)
[2024-12-30T14:25:30.124Z] [NodeJSTutorialApp] [INFO] Press Ctrl+C to stop the server
```

### Testing the Server

Once the server is running, test the `/hello` endpoint:

**Using curl**:
```bash
curl http://localhost:3000/hello
# Response: Hello world
```

**Using a web browser**:
Navigate to `http://localhost:3000/hello`

**Using wget**:
```bash
wget -qO- http://localhost:3000/hello
```

---

## API Summary

### Core Endpoint

#### GET /hello
Returns the foundational "Hello world" message demonstrating basic HTTP request/response handling.

**Request**:
```http
GET /hello HTTP/1.1
Host: localhost:3000
```

**Response**:
```http
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 11

Hello world
```

### HTTP Status Codes

| Status | Code | Description | Use Case |
|--------|------|-------------|----------|
| Success | 200 | OK | Successful `/hello` requests |
| Client Error | 404 | Not Found | Requests to undefined endpoints |
| Client Error | 405 | Method Not Allowed | Non-GET requests to `/hello` |
| Server Error | 500 | Internal Server Error | Unexpected server errors |

### Response Formats

- **Success Response**: Plain text (`text/plain`) for simple string responses
- **Error Responses**: JSON (`application/json`) for structured error information

### Detailed API Documentation

For comprehensive API documentation including request/response examples, error handling details, and integration patterns, see [API.md](./docs/API.md).

The API documentation covers:
- Complete endpoint specifications
- Error handling strategies
- Request/response examples
- HTTP status codes
- Integration patterns
- Security considerations

---

## Error Handling and Logging

### Error Handling Strategy

The application implements **comprehensive, centralized error handling** that provides consistent error responses while maintaining security through controlled information disclosure.

#### Error Types and Responses

**404 Not Found** - Requests to undefined endpoints:
```json
{
  "error": true,
  "message": "Resource not found"
}
```

**405 Method Not Allowed** - Invalid HTTP methods:
```json
{
  "error": true,
  "message": "Method not allowed"
}
```

**500 Internal Server Error** - Unexpected server errors:
```json
{
  "error": true,
  "message": "An unexpected error occurred"
}
```

#### Express 5 Error Handling Features

- **Automatic Promise Handling**: Express 5 automatically forwards rejected promises to error-handling middleware
- **Enhanced Error Context**: Improved error stack traces and debugging information
- **Security Improvements**: Better protection against ReDoS attacks and information disclosure

### Logging Architecture

The application uses a **centralized logging system** with structured output and environment-aware behavior.

#### Log Levels

| Level | Purpose | Example Usage |
|-------|---------|---------------|
| **INFO** | General operations | Server startup, request processing, configuration loading |
| **WARN** | Non-critical issues | 404 errors, deprecated features, performance warnings |
| **ERROR** | Error conditions | 500 errors, exceptions, system failures |

#### Log Format

All logs follow a standardized format:
```
[timestamp] [NodeJSTutorialApp] [LEVEL] message [metadata]
```

**Example log output**:
```
[2024-12-30T14:25:30.123Z] [NodeJSTutorialApp] [INFO] Server listening on http://localhost:3000 (env: development)
[2024-12-30T14:25:35.456Z] [NodeJSTutorialApp] [INFO] GET /hello - 200 - 45ms {"ip":"127.0.0.1","userAgent":"curl/7.68.0"}
[2024-12-30T14:25:40.789Z] [NodeJSTutorialApp] [WARN] 404 Not Found - Request to undefined endpoint {"method":"GET","path":"/unknown"}
```

#### Environment-Aware Logging

- **Development**: Colorized console output for enhanced readability
- **Production**: Plain text output suitable for log aggregation and monitoring systems

---

## Testing and Coverage

### Testing Framework

The application uses **Jest** as the primary testing framework with **Supertest** for HTTP endpoint testing, providing comprehensive test coverage and educational examples.

#### Test Architecture

```
test/
├── unit/                       # Unit tests for individual functions
│   ├── app.test.js            # Express app configuration tests
│   └── routes.test.js         # Route handler tests
└── integration/               # Integration tests for HTTP endpoints
    ├── server.test.js         # Server startup and lifecycle tests
    └── endpoints.test.js      # HTTP endpoint tests
```

### Running Tests

**Execute all tests**:
```bash
npm test
```

**Run tests with coverage report**:
```bash
npm run test:coverage
```

**Watch mode for development**:
```bash
npm run test:watch
```

### Coverage Targets

The application maintains high test coverage standards:

| Coverage Type | Target | Minimum |
|---------------|---------|---------|
| **Line Coverage** | 95% | 90% |
| **Function Coverage** | 100% | 100% |
| **Branch Coverage** | 90% | 85% |

### Test Examples

**Unit Test Example**:
```javascript
describe('Hello Route Handler', () => {
  it('should return Hello world with correct status', async () => {
    const response = await request(app)
      .get('/hello')
      .expect('Content-Type', /text/)
      .expect(200);
    
    expect(response.text).toBe('Hello world');
  });
});
```

**Integration Test Example**:
```javascript
describe('Server Integration', () => {
  it('should handle 404 errors gracefully', async () => {
    const response = await request(app)
      .get('/nonexistent')
      .expect('Content-Type', /json/)
      .expect(404);
    
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe('Resource not found');
  });
});
```

### Coverage Reports

Coverage reports are generated in multiple formats:
- **HTML**: `coverage/lcov-report/index.html` - Interactive coverage browser
- **Text**: Console output during test execution
- **LCOV**: `coverage/lcov.info` - For CI/CD integration

---

## Development Guidelines

### Code Quality Standards

#### Linting Configuration

The project uses **ESLint** with comprehensive rules for code quality and consistency:

```bash
npm run lint
```

**ESLint Configuration**:
- **eslint:recommended**: Standard JavaScript best practices
- **plugin:node/recommended**: Node.js-specific rules
- **plugin:promise/recommended**: Promise handling best practices
- **prettier**: Code formatting consistency

#### Code Style Guidelines

- **ES2015+ Features**: Use modern JavaScript syntax and patterns
- **Async/Await**: Prefer async/await over callbacks and raw promises
- **Error Handling**: Always handle errors explicitly or delegate to middleware
- **Documentation**: Comprehensive inline documentation for educational value
- **Modular Design**: Clear separation of concerns and single responsibility principle

### Development Workflow

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **Run tests continuously**:
   ```bash
   npm run test:watch
   ```

3. **Check code quality**:
   ```bash
   npm run lint
   ```

4. **Generate coverage report**:
   ```bash
   npm run test:coverage
   ```

### Adding New Features

#### Adding New Endpoints

1. **Create route module** in `routes/` directory:
   ```javascript
   // routes/newEndpoint.js
   const express = require('express');
   const router = express.Router();
   
   router.get('/', (req, res) => {
     // Implementation
   });
   
   module.exports = { newEndpointRouter: router };
   ```

2. **Mount in main router** (`routes/index.js`):
   ```javascript
   const { newEndpointRouter } = require('./newEndpoint.js');
   router.use('/new-endpoint', newEndpointRouter);
   ```

3. **Add tests** in `test/` directory
4. **Update API documentation** in `docs/API.md`

#### Adding New Middleware

1. **Create middleware module** in `middleware/` directory
2. **Export from middleware index** (`middleware/index.js`)
3. **Register in app.js** following middleware order conventions
4. **Add comprehensive tests** and documentation

---

## Contribution Guidelines

### Educational Focus

This project serves as an educational resource designed to demonstrate Node.js and Express.js best practices. While not open for external contributions, the codebase provides excellent learning opportunities for:

#### Learning Objectives

- **Understanding Express.js Architecture**: Study the separation between app configuration and server startup
- **Error Handling Patterns**: Explore centralized error handling and Express 5 promise features
- **Testing Strategies**: Learn unit and integration testing with Jest and Supertest
- **Code Organization**: Understand modular architecture and separation of concerns
- **Production Practices**: Study logging, configuration management, and deployment patterns

#### Code Study Guidelines

1. **Start with `server.js`**: Understand the application entry point and process management
2. **Explore `app.js`**: Learn Express application configuration and middleware ordering
3. **Study routes**: Understand route organization and handler implementation
4. **Examine middleware**: Learn request processing and error handling patterns
5. **Review utilities**: Understand centralized logging and response formatting

#### Testing Requirements

All code follows strict testing requirements:
- **100% function coverage**: Every function must be tested
- **90%+ line coverage**: Comprehensive code execution testing
- **Integration tests**: Full HTTP request/response cycle testing
- **Error scenario testing**: All error paths must be validated

#### Documentation Standards

- **Comprehensive inline documentation**: Every function and module thoroughly documented
- **Educational comments**: Explanations of architectural decisions and patterns
- **Usage examples**: Practical examples for learning and reference
- **API documentation**: Complete endpoint specifications and examples

### Issue Reporting for Learning

Issues can be used as learning opportunities to:

1. **Understand Error Scenarios**: Practice debugging and error analysis
2. **Explore HTTP Concepts**: Study status codes and response formats
3. **Learn Testing Patterns**: Understand test-driven development practices
4. **Study Architecture**: Analyze modular design and best practices

---

## Links and References

### Project Documentation

- **[API Documentation](./docs/API.md)**: Comprehensive API reference with examples and integration patterns
- **[Package Configuration](./package.json)**: Project dependencies, scripts, and configuration
- **[Application Entry Point](./app.js)**: Express application configuration and middleware setup
- **[Server Startup](./server.js)**: HTTP server initialization and process management

### Technical Resources

#### Node.js Resources
- **[Node.js Official Documentation](https://nodejs.org/docs/)**: Complete Node.js API reference
- **[Node.js v22.x LTS Guide](https://nodejs.org/en/about/releases/)**: Long-term support information
- **[Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)**: Community best practices guide

#### Express.js Resources
- **[Express.js Official Documentation](https://expressjs.com/)**: Complete Express.js framework guide
- **[Express.js 5.x API Reference](https://expressjs.com/en/5x/api.html)**: Latest API documentation
- **[Express.js Migration Guide](https://expressjs.com/en/guide/migrating-5.html)**: Express 4 to 5 migration

#### Testing and Quality
- **[Jest Documentation](https://jestjs.io/docs/getting-started)**: JavaScript testing framework
- **[Supertest Documentation](https://github.com/visionmedia/supertest)**: HTTP assertion library
- **[ESLint Configuration](https://eslint.org/docs/user-guide/configuring)**: Code quality and linting

### Educational Context

#### Learning Path Progression

1. **Beginner**: Start with this tutorial backend to understand HTTP and Express.js basics
2. **Intermediate**: Extend with database integration, authentication, and additional endpoints
3. **Advanced**: Explore microservices, API gateways, and distributed systems
4. **Expert**: Study performance optimization, monitoring, and production deployment

#### Related Concepts

- **RESTful API Design**: Understanding HTTP methods and resource modeling
- **Middleware Patterns**: Request processing pipelines and cross-cutting concerns
- **Error Handling**: Centralized error management and HTTP status codes
- **Testing Strategies**: Unit, integration, and end-to-end testing approaches
- **Observability**: Logging, monitoring, and debugging practices

### Industry Standards

- **[HTTP/1.1 Specification](https://tools.ietf.org/html/rfc7231)**: HTTP protocol standards
- **[REST API Design Guidelines](https://restfulapi.net/)**: RESTful API best practices
- **[Semantic Versioning](https://semver.org/)**: Version management standards
- **[Conventional Commits](https://www.conventionalcommits.org/)**: Commit message standards

---

## Version Information

- **Project Version**: 1.0.0
- **Node.js Compatibility**: v18.0.0 or higher
- **Express.js Version**: 5.1.0
- **License**: MIT
- **Last Updated**: 2024-12-30

### Maintenance Schedule

- **Node.js v22.x LTS**: Active until October 2025, Maintenance until April 2027
- **Express.js v5.x**: Regular security updates and feature enhancements
- **Dependencies**: Regular security audits and updates via `npm audit`

---

**🚀 Quick Start**: `npm install && npm run dev` then visit `http://localhost:3000/hello`

**📚 Learning Focus**: This backend demonstrates production-ready Node.js patterns while maintaining educational clarity through comprehensive documentation and examples.

**🔍 Deep Dive**: Explore the modular architecture, study the comprehensive error handling, and understand how modern Express.js applications are structured for maintainability and scalability.