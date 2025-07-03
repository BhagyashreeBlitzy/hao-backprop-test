# Node.js Hello World Tutorial Backend

A comprehensive Node.js/Express.js tutorial application demonstrating fundamental HTTP server concepts. This backend implements a single `/hello` endpoint returning "Hello world" with robust error handling, logging, and production-ready architecture patterns.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Deployment](#deployment)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Overview

This tutorial backend serves as an educational foundation for learning Node.js and Express.js development. Built with Express.js 5.1.0 and Node.js 18+, it demonstrates industry-standard practices including:

- **Modern Architecture**: Express.js 5.1.0 with enhanced security and performance
- **Production-Ready**: Comprehensive error handling, logging, and health monitoring
- **Educational Focus**: Clean, well-documented code perfect for learning
- **Best Practices**: Follows Node.js/Express.js conventions and security guidelines

### Key Technologies

- **Runtime**: Node.js 18+ (LTS)
- **Framework**: Express.js 5.1.0
- **Testing**: Jest with Supertest
- **Development**: Nodemon for auto-restart
- **Code Quality**: ESLint + Prettier

## Features

- 🚀 **HTTP Server**: Fast, lightweight Express.js server
- 🌐 **Hello Endpoint**: Simple `/hello` GET endpoint returning "Hello world"
- 🏥 **Health Checks**: Built-in `/health` endpoint for monitoring
- 📝 **Comprehensive Logging**: Request/response logging with structured output
- 🛡️ **Error Handling**: Centralized error management with proper HTTP status codes
- 🔧 **Development Tools**: Hot reload, testing, and code quality tools
- 📦 **Easy Deployment**: Platform-agnostic deployment support

## Getting Started

### Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)

Check your versions:
```bash
node --version  # Should be 18.0.0+
npm --version   # Should be 8.0.0+
```

### Installation

1. **Navigate to the backend directory**:
   ```bash
   cd src/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Verify installation**:
   ```bash
   npm run validate
   ```

### Running the Server

#### Development Mode (with auto-restart)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

#### Manual Start
```bash
node server.js
```

The server will start on `http://localhost:3000` by default.

### Environment Configuration

Configure the server using environment variables:

```bash
# Set custom port
export PORT=8080

# Set custom host  
export HOST=0.0.0.0

# Set environment mode
export NODE_ENV=production
```

Or create a `.env` file:
```env
PORT=3000
HOST=localhost
NODE_ENV=development
```

## Usage

### Basic Usage

Once the server is running, you can test the endpoints:

#### Hello World Endpoint
```bash
curl http://localhost:3000/hello
```

**Response:**
```
Hello world
```

#### Health Check Endpoint
```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "healthy",
  "uptime": 123.456,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "memory": {
    "rss": 25165824,
    "heapTotal": 16777216,
    "heapUsed": 10485760,
    "external": 1048576
  }
}
```

### Using Different HTTP Clients

#### With cURL
```bash
# GET request to hello endpoint
curl -X GET http://localhost:3000/hello

# GET request with headers
curl -H "Accept: text/plain" http://localhost:3000/hello
```

#### With HTTPie
```bash
# Simple GET request
http GET localhost:3000/hello

# GET request with headers
http GET localhost:3000/hello Accept:text/plain
```

#### With Postman
1. Create a new GET request
2. Set URL to `http://localhost:3000/hello`
3. Send the request
4. Expect 200 OK with "Hello world" response

## API Endpoints

### GET /hello

Returns a static "Hello world" message.

**Request:**
- **Method**: GET
- **URL**: `/hello`
- **Headers**: None required

**Response:**
- **Status**: 200 OK
- **Content-Type**: `text/plain; charset=utf-8`
- **Body**: `Hello world`

**Example:**
```bash
curl http://localhost:3000/hello
# Response: Hello world
```

### GET /health

Returns server health status and metrics.

**Request:**
- **Method**: GET
- **URL**: `/health`
- **Headers**: None required

**Response:**
- **Status**: 200 OK
- **Content-Type**: `application/json`
- **Body**: Health status object

**Example:**
```bash
curl http://localhost:3000/health
```

**Response Body:**
```json
{
  "status": "healthy",
  "uptime": 123.456,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "memory": {
    "rss": 25165824,
    "heapTotal": 16777216,
    "heapUsed": 10485760,
    "external": 1048576
  }
}
```

### Error Responses

#### 404 Not Found
For non-existent endpoints:
```bash
curl http://localhost:3000/nonexistent
# Response: 404 Not Found
```

#### 405 Method Not Allowed
For unsupported HTTP methods:
```bash
curl -X POST http://localhost:3000/hello
# Response: 405 Method Not Allowed
```

## Testing

### Available Test Scripts

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only  
npm run test:integration

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode (for development)
npm run test:watch

# Run tests for CI/CD (coverage + no watch)
npm run test:ci
```

### Test Structure

```
src/test/
├── unit/                    # Unit tests
│   ├── hello.test.js       # Hello endpoint tests
│   └── health.test.js      # Health endpoint tests
├── integration/            # Integration tests
│   └── server.test.js      # Full server tests
├── helpers/                # Test utilities
│   └── testUtils.js        # Shared test helpers
├── fixtures/               # Test data
│   └── responses.js        # Expected response data
└── setup.js                # Test environment setup
```

### Running Specific Tests

```bash
# Test specific file
npx jest src/test/unit/hello.test.js

# Test with pattern matching
npx jest --testNamePattern="hello endpoint"

# Test with coverage for specific files
npx jest --coverage --collectCoverageFrom="src/routes/hello.js"
```

### Test Coverage Requirements

- **Lines**: 90%+
- **Functions**: 90%+
- **Branches**: 80%+
- **Statements**: 90%+

View detailed coverage reports:
```bash
npm run test:coverage
# Open coverage/index.html in browser
```

## Deployment

### Local Deployment

1. **Production build**:
   ```bash
   npm run validate
   npm test
   ```

2. **Start in production mode**:
   ```bash
   NODE_ENV=production npm start
   ```

### Cloud Platform Deployment

#### Render
1. Connect your GitHub repository
2. Set environment to Node.js
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Deploy automatically

#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. Follow prompts for configuration

#### Railway
1. Connect GitHub repository
2. Select Node.js environment
3. Deploy with default settings

### Docker Deployment

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t nodejs-hello-tutorial .
docker run -p 3000:3000 nodejs-hello-tutorial
```

### Environment Variables for Deployment

Required environment variables for different platforms:

```bash
# Port (provided by platform)
PORT=3000

# Environment mode
NODE_ENV=production

# Optional: Custom host binding
HOST=0.0.0.0
```

### Health Check Configuration

For container orchestration and monitoring:

```bash
# Health check endpoint
curl http://localhost:3000/health

# Expected response: 200 OK with JSON health data
```

## Development

### Project Structure

```
src/backend/
├── app.js                   # Express app configuration
├── server.js                # HTTP server entry point
├── package.json             # Dependencies and scripts
├── config/                  # Configuration modules
│   ├── constants.js         # Application constants
│   └── env.js              # Environment configuration
├── middleware/              # Express middleware
│   ├── index.js            # Middleware exports
│   ├── errorHandler.js     # Error handling middleware
│   └── requestLogger.js    # Request logging middleware
├── routes/                  # Route handlers
│   ├── index.js            # Central router
│   └── hello.js            # Hello endpoint router
├── healthcheck/             # Health check functionality
│   ├── index.js            # Health check exports
│   └── routes.js           # Health check routes
├── utils/                   # Utility modules
│   ├── logger.js           # Logging utility
│   └── errorTypes.js       # Custom error classes
└── scripts/                 # Build and utility scripts
    ├── start.js            # Production start script
    └── test.js             # Test runner script
```

### Key Files Explained

#### app.js
Main Express application configuration with middleware stack:
- Request logging
- Body parsing (JSON, URL-encoded)
- Route mounting
- Error handling

#### server.js
HTTP server lifecycle management:
- Server startup and binding
- Process signal handling (SIGINT, SIGTERM)
- Graceful shutdown
- Error handling

#### routes/hello.js
Hello endpoint implementation:
- GET /hello handler
- HTTP method validation
- Error handling integration

### Development Scripts

```bash
# Start development server with auto-reload
npm run dev

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check code formatting
npm run format:check

# Check for outdated dependencies
npm run outdated

# Security audit
npm run audit

# Validate installation
npm run validate
```

### Code Quality

The project uses:

- **ESLint**: Code linting with Node.js best practices
- **Prettier**: Code formatting with consistent style
- **Jest**: Testing framework with coverage reporting
- **Husky**: Git hooks for quality checks (if configured)

### Adding New Features

1. **Create route handler** in `src/routes/`
2. **Add route to central router** in `src/routes/index.js`  
3. **Write tests** in `src/test/`
4. **Update documentation** in README.md
5. **Run quality checks** with `npm run lint` and `npm test`

### Debugging

#### Development Debugging
```bash
# Start with Node.js debugger
node --inspect server.js

# Start with debug logging
DEBUG=* npm run dev
```

#### Production Debugging
```bash
# Check application logs
pm2 logs nodejs-hello-tutorial

# Monitor server health
curl http://localhost:3000/health
```

## Contributing

We welcome contributions! Please follow these guidelines:

### Development Setup

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/nodejs-hello-world-tutorial-backend.git
   ```
3. **Install dependencies**:
   ```bash
   cd nodejs-hello-world-tutorial-backend/src/backend
   npm install
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Workflow

1. **Make your changes**
2. **Run quality checks**:
   ```bash
   npm run lint
   npm test
   npm run format:check
   ```
3. **Commit your changes**:
   ```bash
   git commit -m "feat: add your feature description"
   ```
4. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Standards

- Follow existing code style (ESLint + Prettier)
- Write comprehensive tests for new features
- Update documentation for user-facing changes
- Ensure all tests pass and coverage requirements are met

### Pull Request Process

1. Ensure your branch is up to date with main
2. Run full test suite: `npm run test:ci`
3. Update README.md if needed
4. Submit PR with clear description
5. Address review feedback promptly

For questions or support, please open an issue or refer to the [CONTRIBUTING.md](../../CONTRIBUTING.md) file.

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

---

**Happy Coding!** 🚀

This tutorial backend provides a solid foundation for learning Node.js and Express.js development. Feel free to extend it with additional features as you continue your learning journey.