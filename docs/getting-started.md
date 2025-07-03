# Getting Started Guide - Node.js Hello World Tutorial

This comprehensive guide provides step-by-step instructions for setting up, running, and verifying the Node.js/Express.js Hello World tutorial application. The guide is designed for developers, educators, and reviewers to quickly onboard and validate the backend server in local or cloud environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Running the Server](#running-the-server)
4. [Environment Configuration](#environment-configuration)
5. [Accessing the /hello Endpoint](#accessing-the-hello-endpoint)
6. [Testing](#testing)
7. [Docker/Container Usage](#dockercontainer-usage)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before setting up the Node.js Hello World tutorial application, ensure your development environment meets the following requirements:

### Required Software

| Software | Version | Purpose | Installation |
|----------|---------|---------|--------------|
| **Node.js** | `>=18.0.0` | JavaScript runtime environment | [Download from nodejs.org](https://nodejs.org/) |
| **npm** | `>=8.0.0` | Package manager (bundled with Node.js) | Included with Node.js installation |

### Verify Installation

Check your installed versions to ensure compatibility:

```bash
# Check Node.js version
node --version
# Expected output: v18.x.x or higher

# Check npm version
npm --version
# Expected output: 8.x.x or higher
```

### Optional Tools

| Tool | Purpose | Installation |
|------|---------|--------------|
| **Docker** | Container deployment (optional) | [Download from docker.com](https://www.docker.com/) |
| **Git** | Source code management | [Download from git-scm.com](https://git-scm.com/) |
| **curl** | API testing (or use browser/Postman) | Pre-installed on most systems |

### System Requirements

- **Operating System**: Windows, macOS, or Linux
- **Memory**: Minimum 512MB RAM available
- **Storage**: 100MB free disk space
- **Network**: Internet connection for dependency installation

---

## Installation

Follow these steps to install and set up the Node.js Hello World tutorial application:

### Step 1: Clone the Repository

```bash
# Clone the repository (if using Git)
git clone <repository-url>
cd nodejs-hello-world-tutorial

# Or download and extract the project files
```

### Step 2: Navigate to Backend Directory

```bash
# Navigate to the backend source directory
cd src/backend
```

### Step 3: Install Dependencies

```bash
# Install all required dependencies
npm install
```

**What this does:**
- Installs Express.js 5.1.0 (core web framework)
- Installs dotenv for environment variable management
- Installs development dependencies (Jest, ESLint, Prettier, nodemon)
- Creates `node_modules/` directory with all dependencies
- Generates `package-lock.json` for dependency version locking

### Step 4: Verify Installation

```bash
# Verify installation by checking package list
npm ls

# Run validation script to ensure everything is properly installed
npm run validate
```

### Project Structure Overview

After installation, your project structure should look like this:

```
src/backend/
├── app.js              # Express application configuration
├── server.js           # HTTP server entry point
├── package.json        # Project dependencies and scripts
├── .env.example        # Environment variable template
├── Dockerfile          # Container build configuration
├── scripts/            # Startup and utility scripts
├── routes/             # API route handlers
│   ├── index.js        # Central API router
│   └── hello.js        # Hello endpoint implementation
├── middleware/         # Express middleware components
├── utils/              # Utility functions and helpers
├── config/             # Configuration modules
├── healthcheck/        # Health check functionality
└── src/test/          # Test files and configuration
```

---

## Running the Server

The application provides multiple ways to start the server for different development scenarios:

### Quick Start (Recommended)

```bash
# Start the server using the default production command
npm start
```

### Development Mode with Auto-Reload

```bash
# Start the server in development mode with automatic restart on file changes
npm run dev
```

### Direct Server Execution

```bash
# Run the server directly using Node.js
node server.js

# Or using the startup script
node scripts/start.js
```

### Expected Output

When the server starts successfully, you should see output similar to:

```bash
🌟 Starting Node.js tutorial application
✅ Express application initialized successfully
🚀 HTTP server started successfully
🔧 Development server ready
   Local URL: http://localhost:3000
   Hello Endpoint: http://localhost:3000/hello
   Health Endpoint: http://localhost:3000/health
   Tips: Use Ctrl+C to stop the server gracefully
🎯 Application initialization completed
```

### Server Status Verification

Verify the server is running by checking the health endpoint:

```bash
# Check server health
curl http://localhost:3000/health

# Expected response:
{
  "status": "healthy",
  "uptime": 15.234,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "memory": {
    "rss": 45678912,
    "heapTotal": 12345678,
    "heapUsed": 8765432,
    "external": 1234567
  }
}
```

### Stopping the Server

```bash
# Graceful shutdown using Ctrl+C
# The server will log shutdown process:
🛑 Received SIGINT (Ctrl+C) - initiating graceful shutdown
🔄 Closing HTTP server and draining connections
✅ Graceful shutdown completed successfully
```

---

## Environment Configuration

The application uses environment variables for flexible configuration across different deployment environments.

### Environment Setup

1. **Copy the environment template:**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   ```

2. **Edit the `.env` file** with your preferred settings:
   ```bash
   # Open .env file in your preferred editor
   nano .env
   # or
   code .env
   ```

### Environment Variables

| Variable | Default | Description | Examples |
|----------|---------|-------------|----------|
| `PORT` | `3000` | Server port number | `3000`, `8080`, `process.env.PORT` |
| `NODE_ENV` | `development` | Runtime environment | `development`, `production`, `test` |

### Environment Configuration Examples

#### Local Development
```bash
# .env file for local development
PORT=3000
NODE_ENV=development
```

#### Production Deployment
```bash
# .env file for production
# PORT is typically provided by hosting platform
NODE_ENV=production
```

#### Testing Environment
```bash
# .env file for testing
PORT=0
NODE_ENV=test
```

### Platform-Specific Configuration

#### Cloud Platforms (Render, Heroku, Vercel)
```bash
# These platforms automatically provide PORT via environment variables
# Only set NODE_ENV in your platform's environment settings
NODE_ENV=production
```

#### Docker Container
```bash
# Set environment variables when running container
docker run -p 3000:3000 -e NODE_ENV=production -e PORT=3000 hello-backend
```

### Configuration Validation

Verify your configuration is working correctly:

```bash
# Check current environment settings
npm run validate

# Start server and check startup logs for configuration details
npm start
```

---

## Accessing the /hello Endpoint

The application provides a simple HTTP endpoint that demonstrates basic request-response patterns.

### Endpoint Details

| Property | Value |
|----------|-------|
| **URL** | `http://localhost:3000/hello` |
| **Method** | `GET` |
| **Response Content-Type** | `text/plain; charset=utf-8` |
| **Response Body** | `Hello world` |
| **Status Code** | `200 OK` |

### Using curl (Command Line)

```bash
# Basic GET request
curl http://localhost:3000/hello

# Expected output:
Hello world

# Verbose request with headers
curl -v http://localhost:3000/hello

# Expected output with headers:
* Connected to localhost (127.0.0.1) port 3000 (#0)
> GET /hello HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.68.0
> Accept: */*
>
< HTTP/1.1 200 OK
< Content-Type: text/plain; charset=utf-8
< Content-Length: 11
< Date: Mon, 01 Jan 2024 12:00:00 GMT
<
Hello world
```

### Using a Web Browser

1. Open your web browser
2. Navigate to: `http://localhost:3000/hello`
3. You should see "Hello world" displayed as plain text

### Using Postman or Similar Tools

1. Create a new GET request
2. Set URL to: `http://localhost:3000/hello`
3. Send the request
4. Verify response status is `200 OK`
5. Verify response body contains `Hello world`

### Testing Different HTTP Methods

The endpoint only supports GET requests. Other methods will return appropriate error responses:

```bash
# POST request (not allowed)
curl -X POST http://localhost:3000/hello
# Expected: 405 Method Not Allowed

# PUT request (not allowed)  
curl -X PUT http://localhost:3000/hello
# Expected: 405 Method Not Allowed

# DELETE request (not allowed)
curl -X DELETE http://localhost:3000/hello
# Expected: 405 Method Not Allowed
```

### Performance Testing

Test response times to verify optimal performance:

```bash
# Time the request
time curl http://localhost:3000/hello

# Expected response time: < 100ms

# Multiple requests for consistency testing
for i in {1..10}; do curl -w "%{time_total}\n" -o /dev/null -s http://localhost:3000/hello; done
```

---

## Testing

The application includes a comprehensive testing suite covering unit tests, integration tests, and code coverage analysis.

### Available Test Commands

| Command | Purpose | Description |
|---------|---------|-------------|
| `npm test` | Run all tests | Executes linting, unit tests, and generates coverage |
| `npm run test:unit` | Unit tests only | Tests individual functions and components |
| `npm run test:integration` | Integration tests only | Tests API endpoints and request/response cycles |
| `npm run test:coverage` | Coverage report | Generates detailed code coverage analysis |
| `npm run test:watch` | Watch mode | Automatically re-runs tests on file changes |
| `npm run test:ci` | CI/CD testing | Optimized for continuous integration environments |

### Running Tests

#### Basic Test Execution
```bash
# Run the complete test suite
npm test

# Expected output:
> nodejs-hello-world-tutorial-backend@1.0.0 test
> npm run lint && npm run test:ci

✅ ESLint validation passed
🧪 Running test suite...

PASS  src/test/unit/hello.test.js
PASS  src/test/integration/server.test.js

Test Suites: 2 passed, 2 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        2.134 s

Coverage Summary:
Statements   : 95.12% ( 78/82 )
Branches     : 88.89% ( 8/9 )
Functions    : 100% ( 12/12 )
Lines        : 94.87% ( 74/78 )
```

#### Unit Tests
```bash
# Run only unit tests
npm run test:unit

# Tests individual components:
# - Route handlers
# - Middleware functions
# - Utility functions
# - Configuration modules
```

#### Integration Tests
```bash
# Run only integration tests
npm run test:integration

# Tests complete request/response cycles:
# - HTTP server startup
# - Endpoint accessibility
# - Response format validation
# - Error handling scenarios
```

#### Development Testing with Watch Mode
```bash
# Run tests in watch mode for development
npm run test:watch

# Automatically re-runs tests when files change
# Useful during development and debugging
```

### Test Coverage Analysis

```bash
# Generate detailed coverage report
npm run test:coverage

# Opens HTML coverage report
open coverage/lcov-report/index.html
```

#### Coverage Targets

| Metric | Target | Current |
|--------|--------|---------|
| **Statements** | 90% | 95.12% ✅ |
| **Branches** | 80% | 88.89% ✅ |
| **Functions** | 90% | 100% ✅ |
| **Lines** | 90% | 94.87% ✅ |

### Test Environment Setup

Tests run in an isolated environment with:
- `NODE_ENV=test`
- Random port assignment (`PORT=0`)
- Minimal logging output
- Clean database state (if applicable)
- Mock external dependencies

### Writing Custom Tests

To add new tests, follow the existing patterns:

```javascript
// Example test file: src/test/unit/example.test.js
const request = require('supertest');
const { app } = require('../../app.js');

describe('Example Feature', () => {
  it('should demonstrate test structure', async () => {
    const response = await request(app)
      .get('/hello')
      .expect(200);
    
    expect(response.text).toBe('Hello world');
  });
});
```

---

## Docker/Container Usage

The application includes comprehensive Docker support for containerized deployment across development, testing, and production environments.

### Docker Prerequisites

Ensure Docker is installed and running:

```bash
# Verify Docker installation
docker --version
# Expected: Docker version 20.x.x or higher

# Verify Docker is running
docker info
```

### Building the Docker Image

#### Production Build (Default)
```bash
# Build production-optimized image
docker build -t hello-backend .

# Build with specific tag
docker build -t hello-backend:latest .
docker build -t hello-backend:v1.0.0 .
```

#### Development Build
```bash
# Build development image with dev tools
docker build --target development -t hello-backend:dev .
```

#### Test Build
```bash
# Build image and run tests during build process
docker build --target test -t hello-backend:test .
```

### Running the Container

#### Basic Container Execution
```bash
# Run container with port mapping
docker run -p 3000:3000 hello-backend

# Run container in detached mode
docker run -d -p 3000:3000 --name hello-server hello-backend

# Run with custom port
docker run -p 8080:3000 -e PORT=3000 hello-backend
```

#### Advanced Container Configuration
```bash
# Run with environment variables
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  hello-backend

# Run with volume mounting for development
docker run -p 3000:3000 \
  -v $(pwd):/usr/src/app \
  hello-backend:dev

# Run with resource limits
docker run -p 3000:3000 \
  --memory=512m \
  --cpus=1.0 \
  hello-backend
```

### Container Management

#### Container Lifecycle
```bash
# List running containers
docker ps

# Stop running container
docker stop hello-server

# Start stopped container
docker start hello-server

# Remove container
docker rm hello-server

# View container logs
docker logs hello-server

# Follow log output
docker logs -f hello-server
```

#### Container Health Monitoring
```bash
# Check container health status
docker inspect hello-server | grep Health

# Expected healthy output:
"Health": {
  "Status": "healthy",
  "FailingStreak": 0,
  "Log": [...]
}
```

### Docker Compose (Optional)

Create a `docker-compose.yml` file for simplified multi-container orchestration:

```yaml
version: '3.8'
services:
  hello-backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

#### Using Docker Compose
```bash
# Start services
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

### Container Image Optimization

The Docker image is optimized for:
- **Security**: Alpine Linux base, non-root user execution
- **Size**: Multi-stage build, production dependency optimization
- **Performance**: Optimized layer caching, minimal runtime overhead
- **Observability**: Built-in health checks, structured logging

#### Image Size Information
```bash
# Check image size
docker images hello-backend

# Expected output:
REPOSITORY      TAG       IMAGE ID       CREATED          SIZE
hello-backend   latest    abc123def456   2 minutes ago    ~45MB
```

---

## Troubleshooting

This section provides solutions for common issues you might encounter while setting up and running the Node.js Hello World tutorial application.

### Common Issues and Solutions

#### Issue 1: Port Already in Use

**Symptoms:**
```bash
❌ Server startup failed: Port already in use
Error: listen EADDRINUSE :::3000
```

**Causes:**
- Another application is using port 3000
- Previous server instance wasn't properly terminated
- Port conflict with other development tools

**Solutions:**

1. **Find and stop the process using the port:**
   ```bash
   # Find process using port 3000
   lsof -i :3000
   # Kill the process (replace PID with actual process ID)
   kill -9 <PID>
   ```

2. **Use a different port:**
   ```bash
   # Set custom port via environment variable
   PORT=8080 npm start
   
   # Or update .env file
   echo "PORT=8080" > .env
   npm start
   ```

3. **Check for hidden Node.js processes:**
   ```bash
   # List all Node.js processes
   ps aux | grep node
   # Kill all Node.js processes (use with caution)
   pkill node
   ```

#### Issue 2: Module Not Found Errors

**Symptoms:**
```bash
Error: Cannot find module 'express'
Error: Cannot find module './app.js'
```

**Causes:**
- Dependencies not installed
- Working directory mismatch
- Corrupted node_modules directory

**Solutions:**

1. **Ensure you're in the correct directory:**
   ```bash
   # Verify you're in src/backend
   pwd
   # Should show: /path/to/project/src/backend
   cd src/backend
   ```

2. **Reinstall dependencies:**
   ```bash
   # Clean installation
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Verify package.json exists:**
   ```bash
   # Check if package.json exists in current directory
   ls -la package.json
   cat package.json | grep "express"
   ```

#### Issue 3: Node.js Version Compatibility

**Symptoms:**
```bash
Error: Node.js version 16.x.x is not supported
npm ERR! engine Unsupported engine
```

**Causes:**
- Node.js version below 18.0.0
- npm version incompatibility

**Solutions:**

1. **Update Node.js:**
   ```bash
   # Check current version
   node --version
   
   # Install Node.js 18+ from nodejs.org
   # Or use Node Version Manager (nvm)
   nvm install 18
   nvm use 18
   ```

2. **Verify compatibility:**
   ```bash
   # Check versions
   node --version  # Should be >= 18.0.0
   npm --version   # Should be >= 8.0.0
   ```

#### Issue 4: Environment Configuration Issues

**Symptoms:**
```bash
Server running on undefined:undefined
Environment variable not found
```

**Causes:**
- Missing .env file
- Incorrect environment variable syntax
- Environment loading issues

**Solutions:**

1. **Create .env file:**
   ```bash
   # Copy example file
   cp .env.example .env
   
   # Verify content
   cat .env
   ```

2. **Check environment variable syntax:**
   ```bash
   # Correct format (no spaces around =)
   PORT=3000
   NODE_ENV=development
   
   # Incorrect format
   PORT = 3000  # Wrong: spaces around =
   ```

3. **Test environment loading:**
   ```bash
   # Verify environment variables are loaded
   node -e "console.log(process.env.PORT, process.env.NODE_ENV)"
   ```

#### Issue 5: Docker Build or Runtime Issues

**Symptoms:**
```bash
docker: command not found
Error response from daemon: No such image
Container exits immediately
```

**Causes:**
- Docker not installed or not running
- Build context issues
- Container configuration problems

**Solutions:**

1. **Verify Docker installation:**
   ```bash
   # Check if Docker is installed and running
   docker --version
   docker info
   
   # Start Docker if not running
   # On macOS/Windows: Start Docker Desktop
   # On Linux: sudo systemctl start docker
   ```

2. **Build from correct directory:**
   ```bash
   # Ensure you're in src/backend directory
   cd src/backend
   
   # Build with build context
   docker build -t hello-backend .
   ```

3. **Check container logs:**
   ```bash
   # View container logs for debugging
   docker logs <container-name>
   
   # Run container interactively for debugging
   docker run -it hello-backend /bin/sh
   ```

#### Issue 6: Testing Failures

**Symptoms:**
```bash
Tests are failing
Coverage below threshold
Linting errors
```

**Causes:**
- Code changes breaking existing tests
- Environment issues during testing
- Dependency version conflicts

**Solutions:**

1. **Run tests with verbose output:**
   ```bash
   # Get detailed test output
   npm run test:verbose
   
   # Run specific test file
   npx jest src/test/unit/hello.test.js
   ```

2. **Check test environment:**
   ```bash
   # Verify test setup
   NODE_ENV=test npm test
   
   # Clear Jest cache
   npx jest --clearCache
   ```

3. **Fix linting issues:**
   ```bash
   # Auto-fix linting issues
   npm run lint:fix
   
   # Format code
   npm run format
   ```

### Performance Issues

#### Issue: Slow Response Times

**Diagnosis:**
```bash
# Test response time
time curl http://localhost:3000/hello

# Expected: < 100ms
```

**Solutions:**
- Restart the server
- Check system resources (CPU, memory)
- Verify no other processes are consuming resources

#### Issue: Memory Leaks

**Diagnosis:**
```bash
# Monitor memory usage
curl http://localhost:3000/health

# Check memory stats in response
```

**Solutions:**
- Restart the server
- Update to latest Node.js version
- Check for improper event listener usage

### Getting Additional Help

If you continue to experience issues:

1. **Check the logs:**
   ```bash
   # Application logs show detailed error information
   npm start 2>&1 | tee server.log
   ```

2. **Verify system requirements:**
   ```bash
   # Check system specifications
   node --version
   npm --version
   docker --version
   ```

3. **Search for similar issues:**
   - Check GitHub issues in the repository
   - Search Stack Overflow with error messages
   - Consult Node.js and Express.js documentation

4. **Report new issues:**
   - Include error messages, system information, and steps to reproduce
   - Provide relevant log files and configuration details

---

## Quick Reference

### Essential Commands

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Start server | `npm start` |
| Development mode | `npm run dev` |
| Run tests | `npm test` |
| Build Docker image | `docker build -t hello-backend .` |
| Run Docker container | `docker run -p 3000:3000 hello-backend` |
| Check health | `curl http://localhost:3000/health` |
| Test hello endpoint | `curl http://localhost:3000/hello` |

### Important URLs

| Endpoint | URL | Purpose |
|----------|-----|---------|
| Hello World | `http://localhost:3000/hello` | Main tutorial endpoint |
| Health Check | `http://localhost:3000/health` | Server status monitoring |

### Support

For additional help and documentation:
- **Project Documentation**: Check the `docs/` directory
- **Backend README**: See `src/backend/README.md` for advanced configuration
- **API Documentation**: Explore endpoint details and examples
- **GitHub Issues**: Report bugs and request features

---

*This getting started guide provides comprehensive instructions for the Node.js Hello World tutorial application. For advanced configuration and deployment scenarios, refer to the additional documentation in the `docs/` directory.*