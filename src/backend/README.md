# Node.js Tutorial Backend

This backend implements a simple, production-ready Node.js/Express.js server for educational purposes. It demonstrates HTTP server initialization, request routing, and a single /hello endpoint.

## Table of Contents

1. [Introduction](#1-introduction)
2. [Features](#2-features)
3. [Getting Started](#3-getting-started)
4. [Development Workflow](#4-development-workflow)
5. [Testing](#5-testing)
6. [Deployment](#6-deployment)
7. [Configuration](#7-configuration)
8. [Security](#8-security)
9. [Troubleshooting](#9-troubleshooting)
10. [Contributing](#10-contributing)
11. [License](#11-license)

## 1. Introduction

This backend is part of a Node.js tutorial project designed to teach fundamental server-side JavaScript concepts. It uses Express.js 5.1.0 (Node.js 18+ required) and follows best practices for maintainability, security, and educational clarity.

The application demonstrates core HTTP server concepts through a simplified layered architecture, leveraging Express.js 5.1.0's modern features including automatic promise rejection handling, enhanced security through path-to-regexp 8.x for ReDoS mitigation, and production-ready patterns suitable for educational advancement.

**Educational Objectives:**
- Demonstrate Node.js HTTP server setup and lifecycle
- Showcase Express.js routing and middleware patterns
- Highlight security and performance best practices
- Provide a foundation for further Node.js learning

**Key Design Decisions:**
- Express.js 5.1.0 for modern, secure HTTP server implementation
- Single responsibility principle for each module (routes, middleware, utils)
- No database or authentication for tutorial clarity and focus
- Comprehensive test coverage with Jest and Supertest integration
- Security best practices including headers and dependency management

## 2. Features

- **Express.js 5.1.0 HTTP server** - Latest stable framework with enhanced security
- **Single GET /hello endpoint** - Returns 'Hello world' message
- **Request logging and error handling middleware** - Production-ready logging patterns
- **Security headers and ReDoS mitigation** - path-to-regexp 8.x security improvements
- **Comprehensive testing with Jest and Supertest** - Unit and integration test coverage
- **Docker and Docker Compose support** - Containerized deployment capability
- **Health check endpoint** - Basic application health monitoring
- **Modern JavaScript features** - ES2022+ syntax and patterns
- **Production-ready error handling** - Secure error responses without information disclosure
- **Automatic dependency security scanning** - npm audit integration

## 3. Getting Started

### Prerequisites

- **Node.js 18.x, 20.x, or 22.x** (LTS recommended)
  - Express.js 5.x requires Node.js 18+ for security and modern JavaScript features
  - Production applications should use Active LTS (22.x) or Maintenance LTS (20.x)
- **npm 9+** (Latest version 11.4.2 recommended)

### Installation

```bash
cd src/backend
npm install
```

### Running the Server

```bash
npm start
```

The server listens on port 3000 by default. You can override with the PORT environment variable:

```bash
PORT=8080 npm start
```

### Development Mode (with auto-reload)

```bash
npm run dev
```

This runs the server with automatic restart on file changes using nodemon.

### Quick Test

Test the /hello endpoint:

```bash
curl -i http://localhost:3000/hello
```

Expected output:
```
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Content-Length: 11

Hello world
```

## 4. Development Workflow

### Project Structure

```
src/backend/
├── server.js              # Main server entry point
├── app.js                 # Express application configuration
├── routes/
│   ├── index.js          # Route index and aggregation
│   └── hello.js          # Hello endpoint implementation
├── middleware/
│   ├── logging.js        # Request/response logging
│   ├── errorHandler.js   # Error handling middleware
│   └── securityHeaders.js # Security headers (Helmet.js)
├── utils/
│   ├── httpResponses.js  # HTTP response utilities
│   └── logger.js         # Logging utilities
├── config/
│   ├── server.js         # Server configuration
│   └── environment.js    # Environment variables
├── scripts/
│   ├── dev.js           # Development server script
│   ├── start.js         # Production server script
│   └── test.js          # Test runner script
├── test/
│   ├── unit/            # Unit tests
│   ├── integration/     # Integration tests
│   └── helpers/         # Test helper functions
├── package.json         # Project dependencies and scripts
├── Dockerfile          # Container configuration
└── docker-compose.yml  # Multi-container setup
```

### Development Guidelines

- **Source code**: Located in `src/backend/`
- **Main entry**: `server.js` bootstraps the application using `app.js`
- **Routes**: Organized in `routes/` directory with clear separation
- **Middleware**: Reusable middleware functions in `middleware/`
- **Utilities**: Common utilities and helpers in `utils/`
- **Configuration**: Environment-specific settings in `config/`
- **Testing**: Comprehensive test suite in `test/` directory

### Code Organization Principles

- **Single Responsibility**: Each module handles one specific concern
- **Separation of Concerns**: HTTP layer isolated from business logic
- **Educational Clarity**: Simplified structure for learning purposes
- **Modern Security**: Express 5.x security features and best practices

## 5. Testing

Unit and integration tests are provided using Jest and Supertest, demonstrating modern testing practices for Node.js applications.

### Test Framework

- **Jest**: JavaScript testing framework with built-in assertions, mocking, and coverage
- **Supertest**: HTTP assertion library for testing Express applications
- **Coverage**: Automated code coverage reporting with thresholds

### Run All Tests

```bash
npm test
```

### Test Structure

```
test/
├── unit/                 # Unit tests for individual components
│   ├── hello.test.js    # Hello endpoint unit tests
│   ├── middleware.test.js # Middleware unit tests
│   └── utils.test.js    # Utility function tests
├── integration/          # Integration tests for full request flow
│   ├── server.test.js   # Server integration tests
│   └── api.test.js      # API endpoint integration tests
└── helpers/             # Test helper functions and utilities
    ├── testHelpers.js   # Common test utilities
    └── mockData.js      # Mock data for tests
```

### Test Coverage

```bash
npm run test:coverage
```

**Coverage Targets:**
- Line Coverage: 80%
- Function Coverage: 90%
- Branch Coverage: 70%
- Statement Coverage: 80%

### Watch Mode (Development)

```bash
npm run test:watch
```

### CI Integration

Tests are automatically executed in CI/CD pipelines. See `.github/workflows/ci.yml` for the automated test configuration.

**CI Test Commands:**
```bash
npm run test:ci  # CI-optimized test execution
npm run test:coverage  # Coverage report generation
```

## 6. Deployment

### Local Deployment

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

### Docker Deployment

**Build and run container:**
```bash
docker build -t nodejs-tutorial-backend .
docker run -p 3000:3000 nodejs-tutorial-backend
```

**Using Docker Compose:**
```bash
docker-compose up
```

The Docker configuration includes:
- Multi-stage build for optimized image size
- Security best practices (non-root user, minimal base image)
- Health check endpoint for container orchestration
- Production-ready environment configuration

### Container Health Check

The application includes a health check endpoint for monitoring:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "uptime": 3600,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "memory": {
    "rss": 41943040,
    "heapTotal": 29360128,
    "heapUsed": 17123456,
    "external": 1089024
  }
}
```

### Environment-Specific Configuration

**Development:**
- Enhanced logging and debugging
- Automatic server restart on file changes
- Detailed error messages

**Production:**
- Optimized performance settings
- Secure error handling
- Minimal logging overhead

## 7. Configuration

### Environment Variables

Environment variables can be set in `.env` file or via the shell:

```bash
# Server Configuration
PORT=3000                    # Server port (default: 3000)
HOST=localhost              # Server host (default: localhost)
NODE_ENV=development        # Environment (development/production)

# Logging Configuration
LOG_LEVEL=info              # Logging level (debug/info/warn/error)
LOG_FORMAT=combined         # Log format (combined/common/short)

# Security Configuration
HELMET_ENABLED=true         # Enable security headers
CORS_ENABLED=false          # Enable CORS (not required for tutorial)
```

### Configuration Files

**Server Configuration (`config/server.js`):**
```javascript
module.exports = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  env: process.env.NODE_ENV || 'development'
};
```

**Environment Configuration (`config/environment.js`):**
```javascript
module.exports = {
  development: {
    logging: true,
    errorDetails: true
  },
  production: {
    logging: false,
    errorDetails: false
  }
};
```

### Default Configuration

- **Default port**: 3000
- **Default host**: localhost
- **Default environment**: development
- **Default log level**: info

## 8. Security

### Security Features

The application implements multiple layers of security appropriate for its educational scope:

**Framework Security:**
- **Express.js 5.1.0** with security fixes for ReDoS attacks and CVE-2024-45590
- **path-to-regexp 8.x** for secure routing with ReDoS mitigation
- **Automatic promise rejection handling** for secure error management

**Security Headers:**
- **Helmet.js integration** for comprehensive HTTP security headers
- **X-Content-Type-Options**: nosniff (prevents MIME type sniffing)
- **X-Frame-Options**: DENY (prevents clickjacking)
- **X-XSS-Protection**: 1; mode=block (XSS protection)
- **X-Powered-By removal** (removes Express fingerprinting)

**Input Validation:**
- Request method validation (GET only for /hello)
- Path validation and sanitization
- Error handling without information disclosure

### Security Best Practices

**Dependencies:**
```bash
npm audit              # Check for vulnerabilities
npm audit fix          # Fix automatically resolvable vulnerabilities
```

**Production Recommendations:**
- Use only LTS Node.js versions (18.x, 20.x, 22.x)
- Enable HTTPS/TLS in production environments
- Implement rate limiting for production deployments
- Use environment variables for sensitive configuration
- Regular security audits and dependency updates

**Security Monitoring:**
- Basic security event logging
- Error sanitization to prevent information disclosure
- Request validation and suspicious activity detection

### Security Testing

```bash
npm run security:audit    # Run security audit
npm run security:test     # Run security-focused tests
```

## 9. Troubleshooting

### Common Issues

**Server won't start:**
- Ensure Node.js version is >= 18
- Check if port 3000 is available: `lsof -i :3000`
- Verify all dependencies are installed: `npm install`

**Port already in use:**
```bash
# Change port
PORT=8080 npm start

# Or find and kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

**npm install fails:**
- Clear npm cache: `npm cache clean --force`
- Delete node_modules: `rm -rf node_modules`
- Reinstall: `npm install`

**Tests failing:**
- Ensure test database is running (if applicable)
- Check Node.js version compatibility
- Verify test environment variables

### Docker Issues

**Container won't start:**
- Ensure Docker daemon is running
- Check Dockerfile syntax
- Verify port mapping: `-p 3000:3000`

**Build fails:**
- Check Node.js version in Dockerfile
- Verify package.json exists
- Ensure all dependencies are available

### Debugging

**Enable debug logging:**
```bash
DEBUG=* npm start
```

**Check application logs:**
```bash
# Development
npm run dev

# Production
npm start 2>&1 | tee app.log
```

**Memory and performance debugging:**
```bash
# Monitor memory usage
node --inspect server.js

# Profile performance
node --prof server.js
```

### Performance Issues

**High response times:**
- Check system resources (CPU, memory)
- Monitor request patterns
- Review middleware performance

**Memory leaks:**
- Use Node.js built-in memory profiling
- Check for unclosed connections
- Monitor process memory usage

## 10. Contributing

We welcome contributions to improve the tutorial application and documentation!

### Development Setup

1. **Fork the repository** and create a feature branch
2. **Install dependencies**: `npm install`
3. **Run tests**: `npm test`
4. **Start development server**: `npm run dev`

### Code Standards

**Style Guidelines:**
- Follow existing code formatting (ESLint/Prettier configuration)
- Use descriptive variable and function names
- Add comments for complex logic
- Maintain test coverage above 80%

**Testing Requirements:**
- Add unit tests for new functions
- Include integration tests for new endpoints
- Update test documentation
- Ensure all tests pass before submitting

### Commit Guidelines

```bash
# Format: type(scope): description
feat(endpoint): add new /hello endpoint
fix(middleware): resolve error handling issue
docs(readme): update installation instructions
test(unit): add hello endpoint tests
```

### Pull Request Process

1. **Create feature branch**: `git checkout -b feature/your-feature`
2. **Make changes** and add tests
3. **Run full test suite**: `npm test`
4. **Submit pull request** with clear description
5. **Address review feedback** and update as needed

### Code Review Checklist

- [ ] Code follows project style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] Security implications are considered
- [ ] Performance impact is evaluated

## 11. License

This project is licensed under the MIT License. See [LICENSE](../../LICENSE) for details.

---

## Additional Resources

### Learning Resources

- **Node.js Official Documentation**: https://nodejs.org/docs/
- **Express.js Documentation**: https://expressjs.com/
- **JavaScript Modern Features**: ES2022+ syntax and patterns
- **HTTP Protocol Fundamentals**: Request/response cycle understanding

### Related Projects

- **Frontend Tutorial**: Companion frontend implementation
- **Advanced Node.js Patterns**: Next-level architectural patterns
- **Production Deployment**: Enterprise deployment strategies

### Community

- **Issues**: Report bugs and request features
- **Discussions**: Technical discussions and questions
- **Contributing**: Guidelines for contributing to the project

### Performance Benchmarks

**Expected Performance:**
- Response time: < 100ms for /hello endpoint
- Memory usage: < 50MB during normal operation
- Throughput: 1000+ requests/second on modern hardware

**Monitoring:**
- Use built-in health check endpoint
- Monitor application logs
- Track memory and CPU usage

---

*This README provides comprehensive guidance for developers and learners working with the Node.js tutorial backend. For additional support, please refer to the troubleshooting section or open an issue in the repository.*