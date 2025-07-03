# Node.js Tutorial Application

A simple, production-ready Node.js/Express.js server for educational purposes. Demonstrates HTTP server initialization, request routing, and a single `/hello` endpoint. Designed for clarity, maintainability, and security.

## Table of Contents

1. [Introduction](#1-introduction)
2. [Features](#2-features)
3. [Getting Started](#3-getting-started)
4. [Architecture Overview](#4-architecture-overview)
5. [Development Workflow](#5-development-workflow)
6. [Testing](#6-testing)
7. [Deployment](#7-deployment)
8. [Configuration](#8-configuration)
9. [Security](#9-security)
10. [Troubleshooting](#10-troubleshooting)
11. [Contributing](#11-contributing)
12. [License](#12-license)

## 1. Introduction

This project is a Node.js tutorial application designed to teach fundamental server-side JavaScript concepts. It uses Express.js 5.1.0 (Node.js 18+ required) and follows best practices for maintainability, security, and educational clarity. The application provides a single `/hello` endpoint and demonstrates modern patterns for HTTP server development.

### Educational Objectives

- Demonstrate Node.js HTTP server setup and lifecycle
- Showcase Express.js routing and middleware patterns
- Highlight security and performance best practices
- Provide a foundation for further Node.js learning

### Key Design Decisions

- **Express.js 5.1.0**: Latest stable release with enhanced security features, including ReDoS attack prevention and CVE-2024-45590 mitigation
- **Single responsibility**: Each module handles one specific concern (routes, middleware, utils)
- **No database or authentication**: Maintains tutorial clarity and focuses on HTTP fundamentals
- **Comprehensive test coverage**: Demonstrates testing best practices with Jest and Supertest
- **Security-first approach**: Implements security headers, dependency management, and safe development practices

## 2. Features

- **Express.js 5.1.0 HTTP server** (Node.js 18+ required)
- **Single GET `/hello` endpoint** returning 'Hello world'
- **Request logging and error handling middleware**
- **Security headers and ReDoS mitigation** via path-to-regexp 8.x
- **Comprehensive testing** with Jest and Supertest
- **Docker and Docker Compose support**
- **Health check endpoint** (if implemented)
- **Production-ready architecture** with educational focus

## 3. Getting Started

### Prerequisites

- **Node.js 18.x, 20.x, or 22.x** (LTS recommended)
- **npm 9+** (npm 11.4.2 latest)

### Installation

```bash
cd src/backend
npm install
```

### Running the Server

```bash
npm start
```

The server listens on port 3000 by default. You can override with the `PORT` environment variable.

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Quick Test

Test the `/hello` endpoint:

```bash
curl -i http://localhost:3000/hello
```

Expected output:
```
HTTP/1.1 200 OK
Content-Type: text/plain

Hello world
```

## 4. Architecture Overview

The application implements a simplified layered architecture optimized for educational clarity:

```
src/backend/
├── server.js              # Main entry point
├── app.js                 # Express app configuration
├── routes/
│   ├── index.js          # Route aggregation
│   └── hello.js          # Hello endpoint implementation
├── middleware/
│   ├── logger.js         # Request logging
│   ├── errorHandler.js   # Error handling
│   └── securityHeaders.js # Security headers
├── utils/
│   ├── httpResponse.js   # HTTP response utilities
│   └── logger.js         # Logging utilities
├── config/
│   └── serverConfig.js   # Server configuration
├── scripts/
│   ├── dev.js           # Development script
│   ├── start.js         # Production start script
│   └── test.js          # Test runner
├── test/
│   ├── unit/            # Unit tests
│   ├── integration/     # Integration tests
│   └── helpers/         # Test utilities
├── infrastructure/
│   └── monitoring/
│       └── healthcheck.js # Health check endpoint
├── Dockerfile           # Container configuration
└── docker-compose.yml   # Multi-container setup
```

### Key Components

- **HTTP Server**: Manages connections and delegates to Express app
- **Express Application**: Orchestrates middleware and routing
- **Route Handler**: Processes `/hello` endpoint requests
- **Response Generator**: Creates properly formatted HTTP responses
- **Security Layer**: Implements security headers and ReDoS mitigation

## 5. Development Workflow

### Best Practices

- Use **feature branches** for new work
- Follow **code style guidelines** (`.eslintrc.js`, `.prettierrc`)
- **Add/modify tests** for new features
- Use `npm run dev` for **auto-reload** during development
- Use `npm run lint` and `npm run format` to check **code quality**

### Development Commands

```bash
# Start development server with auto-reload
npm run dev

# Run linting
npm run lint

# Format code
npm run format

# Run tests in watch mode
npm run test:watch

# Generate test coverage
npm run test:coverage
```

### Code Quality

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **Jest** for testing
- **Supertest** for HTTP endpoint testing

## 6. Testing

Unit and integration tests are provided using Jest and Supertest, demonstrating comprehensive testing strategies for Node.js applications.

### Run all tests

```bash
npm test
```

### Test structure

```
test/
├── unit/                 # Unit tests for individual components
│   ├── routes/
│   ├── middleware/
│   └── utils/
├── integration/          # Integration tests for complete workflows
│   ├── hello.test.js
│   └── server.test.js
└── helpers/             # Test utilities and mocks
    ├── testHelpers.js
    └── mockData.js
```

### Code coverage

```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory.

### CI Integration

See `.github/workflows/ci.yml` for automated test pipeline configuration. The CI pipeline:
- Runs tests on multiple Node.js versions (18.x, 20.x, 22.x)
- Checks code quality and formatting
- Generates coverage reports
- Validates security with `npm audit`

## 7. Deployment

### Local deployment

```bash
# Production mode
npm start

# Development mode with auto-reload
npm run dev
```

### Docker deployment

```bash
# Build container
docker build -t nodejs-tutorial-backend .

# Run container
docker run -p 3000:3000 nodejs-tutorial-backend
```

### Docker Compose

```bash
# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop services
docker-compose down
```

### Health check

If a `/health` endpoint is implemented, use it for readiness/liveness probes:

```bash
curl http://localhost:3000/health
```

## 8. Configuration

### Environment Variables

Environment variables can be set in `.env` or via the shell:

```bash
# Server configuration
PORT=3000
NODE_ENV=development

# Logging
LOG_LEVEL=info

# Security
TRUST_PROXY=false
```

### Configuration Files

- **`.env.example`**: Template for environment variables
- **`config/serverConfig.js`**: Server configuration management
- **Default values**: Port 3000, development mode

### Example `.env` file

```env
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
TRUST_PROXY=false
```

## 9. Security

### Security Features

- **Express 5.1.0** with path-to-regexp@8.x for ReDoS mitigation
- **Security headers** via middleware (`middleware/securityHeaders.js`)
- **CVE-2024-45590 mitigation** through Express 5.x security patches
- **Input validation** and sanitization
- **Error information sanitization** to prevent information leakage

### Security Best Practices

- **No authentication required** for `/hello` endpoint (tutorial scope)
- **Use only LTS Node.js versions** for production
- **Run `npm audit` regularly** to check for vulnerabilities
- **Keep dependencies updated** to latest secure versions
- **Follow secure coding practices** demonstrated in the codebase

### Security Monitoring

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# View security report
npm audit --json
```

## 10. Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Server won't start | Ensure Node.js version is >= 18, check port availability |
| Port already in use | Change PORT environment variable or kill existing process |
| Dependencies not found | Run `npm install` to install dependencies |
| Tests failing | Check Node.js version, verify dependencies installed |

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm start

# Enable specific debug namespace
DEBUG=express:* npm start
```

### Docker Issues

- **Port mapping**: Ensure ports are mapped correctly (`-p 3000:3000`)
- **Dependencies**: Verify `npm install` runs successfully in container
- **Node.js version**: Check Dockerfile uses Node.js 18+ base image

### Log Analysis

Review logs for errors (see `utils/logger.js` for log configuration):

```bash
# View server logs
npm start 2>&1 | tee server.log

# Monitor logs in real-time
tail -f server.log
```

## 11. Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started

1. **Fork the repository** and create a feature branch
2. **Install dependencies**: `npm install`
3. **Run tests**: `npm test`
4. **Start development server**: `npm run dev`

### Development Guidelines

- **Follow code style** guidelines (`.eslintrc.js`, `.prettierrc`)
- **Add/modify tests** for new features
- **Write clear commit messages**
- **Update documentation** as needed

### Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** with appropriate tests
3. **Run the full test suite**: `npm test`
4. **Check code quality**: `npm run lint`
5. **Format code**: `npm run format`
6. **Submit a pull request** with a clear description

### Code Style

- Use **ES2022+** JavaScript features
- Follow **Node.js best practices**
- Implement **comprehensive error handling**
- Write **clear, self-documenting code**
- Include **JSDoc comments** for public APIs

## 12. License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

### Additional Resources

- **Express.js Documentation**: https://expressjs.com/
- **Node.js Documentation**: https://nodejs.org/docs/
- **npm Documentation**: https://docs.npmjs.com/
- **Jest Testing Framework**: https://jestjs.io/
- **Docker Documentation**: https://docs.docker.com/

### Support

For questions or issues:
1. Check the **Troubleshooting** section above
2. Review existing **GitHub issues**
3. Create a **new issue** with detailed information
4. Follow the **Contributing** guidelines for code contributions

---

*This README serves as both documentation and a learning resource for Node.js/Express.js development patterns. Keep it updated as the project evolves.*