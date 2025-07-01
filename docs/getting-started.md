# Getting Started Guide - Node.js Hello World Tutorial

Welcome to the Node.js/Express.js Hello World tutorial application! This comprehensive guide will walk you through setting up, running, and verifying the backend server in local or cloud environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Server](#running-the-server)
- [Environment Configuration](#environment-configuration)
- [Accessing the /hello Endpoint](#accessing-the-hello-endpoint)
- [Testing](#testing)
- [Docker/Container Usage](#dockercontainer-usage)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before getting started, ensure your development environment meets the following requirements:

### Required Software

- **Node.js**: Version 18.0.0 or higher
  - Download from [https://nodejs.org/](https://nodejs.org/)
  - Verify installation: `node --version`
  - Express.js 5.1.0 requires Node.js 18+ for compatibility and security features

- **npm**: Version 8.0.0 or higher
  - Comes bundled with Node.js
  - Verify installation: `npm --version`
  - Used for dependency management and running scripts

### Optional Software

- **Docker**: For containerized deployment (optional)
  - Download from [https://docker.com/](https://docker.com/)
  - Verify installation: `docker --version`

### System Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| RAM | 512MB | 1GB |
| CPU | 1 core | 2 cores |
| Storage | 100MB | 500MB |
| Network | Internet access for npm | Stable connection |

## Installation

Follow these steps to set up the tutorial application on your local machine:

### 1. Clone or Download the Project

If you received the project as a zip file, extract it to your preferred directory. If using Git:

```bash
git clone <repository-url>
cd nodejs-hello-world-tutorial
```

### 2. Navigate to Backend Directory

```bash
cd src/backend
```

### 3. Install Dependencies

Install all required dependencies using npm:

```bash
npm install
```

This command will:
- Read the `package.json` file
- Install Express.js 5.1.0 and other dependencies
- Create a `node_modules` directory
- Generate or update `package-lock.json`

### 4. Verify Installation

Check that dependencies were installed correctly:

```bash
npm list
```

You should see a dependency tree showing:
- `express@5.1.0`
- `dotenv@^16.4.5`

## Running the Server

The application provides multiple ways to start the server:

### Production Mode (Recommended)

Start the server using the production script:

```bash
npm start
```

This command:
- Runs `node ./scripts/start.js`
- Starts the server on the configured port (default: 3000)
- Enables production optimizations

### Development Mode

For development with auto-restart on file changes:

```bash
npm run dev
```

This command uses nodemon to automatically restart the server when files change.

### Direct Execution

You can also run the server directly:

```bash
node server.js
```

### Successful Startup

When the server starts successfully, you'll see output similar to:

```
[INFO] Express application initialized - Environment: development
[INFO] Server started successfully on http://localhost:3000
[INFO] Application ready to accept requests
```

## Environment Configuration

The application supports environment-based configuration through environment variables:

### Environment Variables

| Variable | Default | Description | Required |
|----------|---------|-------------|----------|
| `PORT` | 3000 | Server port number | No |
| `NODE_ENV` | development | Environment mode | No |

### Setting Environment Variables

#### Option 1: Create .env File (Recommended)

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file:
   ```bash
   # Port configuration
   PORT=3000
   
   # Environment mode
   NODE_ENV=development
   ```

#### Option 2: System Environment Variables

**Windows:**
```cmd
set PORT=4000
set NODE_ENV=production
npm start
```

**macOS/Linux:**
```bash
export PORT=4000
export NODE_ENV=production
npm start
```

#### Option 3: Inline Environment Variables

```bash
PORT=4000 NODE_ENV=production npm start
```

### Environment Modes

- **development**: Enables verbose logging and development features
- **production**: Optimizes for performance and security
- **test**: Used by testing framework

## Accessing the /hello Endpoint

Once the server is running, you can access the Hello World endpoint:

### Using curl

```bash
curl http://localhost:3000/hello
```

**Expected Response:**
```
Hello world
```

### Using a Web Browser

Open your web browser and navigate to:
```
http://localhost:3000/hello
```

You should see "Hello world" displayed in the browser.

### Using Other HTTP Clients

**PowerShell (Windows):**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/hello" -Method Get
```

**HTTPie:**
```bash
http GET localhost:3000/hello
```

**Postman:**
- Method: GET
- URL: `http://localhost:3000/hello`
- Expected Status: 200 OK
- Expected Response: `Hello world`

### Response Details

- **Status Code**: 200 OK
- **Content-Type**: text/plain; charset=utf-8
- **Response Body**: "Hello world"
- **Response Time**: < 100ms (target)

### Health Check Endpoint

The application also provides a health check endpoint:

```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "uptime": 123.456,
  "timestamp": "2025-07-01T12:00:00.000Z",
  "memory": {
    "rss": 12345678,
    "heapTotal": 8765432,
    "heapUsed": 4321098,
    "external": 876543,
    "arrayBuffers": 12345
  }
}
```

## Testing

The application includes a comprehensive test suite:

### Running All Tests

```bash
npm test
```

### Running Specific Test Types

**Unit Tests:**
```bash
npm run test:unit
```

**Integration Tests:**
```bash
npm run test:integration
```

**Coverage Report:**
```bash
npm run test:coverage
```

### Test Coverage

The test suite maintains the following coverage targets:

- **Line Coverage**: 90%+
- **Function Coverage**: 90%+
- **Branch Coverage**: 80%+
- **Statement Coverage**: 90%+

### Viewing Coverage Reports

After running `npm run test:coverage`, open the coverage report:

```bash
# Open HTML coverage report
open coverage/lcov-report/index.html
```

### Example Test Output

```
PASS  test/unit/hello.test.js
PASS  test/integration/server.test.js

Test Suites: 2 passed, 2 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        2.345 s
Ran all test suites.

Coverage summary:
Statements   : 95.24% ( 20/21 )
Branches     : 85.71% ( 6/7 )
Functions    : 100% ( 5/5 )
Lines        : 95.24% ( 20/21 )
```

## Docker/Container Usage

The application includes Docker support for containerized deployment:

### Prerequisites

- Docker installed and running
- Basic familiarity with Docker commands

### Building the Docker Image

**Basic Build:**
```bash
docker build -t hello-backend .
```

**Production Build:**
```bash
docker build -t hello-backend:latest .
```

**Test Build (includes dev dependencies):**
```bash
docker build --target test -t hello-backend:test .
```

### Running the Container

**Basic Run:**
```bash
docker run -p 3000:3000 hello-backend
```

**With Environment Variables:**
```bash
docker run -p 3000:3000 -e PORT=3000 -e NODE_ENV=production hello-backend
```

**With Environment File:**
```bash
docker run -p 3000:3000 --env-file .env hello-backend
```

**Custom Port:**
```bash
docker run -p 4000:4000 -e PORT=4000 hello-backend
```

### Docker Health Check

The container includes a built-in health check:

```bash
# Check container health status
docker inspect --format='{{.State.Health.Status}}' <container-id>
```

### Docker Compose (Optional)

Create a `docker-compose.yml` file:

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
```

Run with Docker Compose:
```bash
docker-compose up
```

### Container Features

- **Security**: Runs as non-root user
- **Efficiency**: Multi-stage build for minimal image size
- **Health Checks**: Built-in health monitoring
- **Signal Handling**: Proper graceful shutdown
- **Production Ready**: Optimized for production deployment

## Troubleshooting

Common issues and their solutions:

### Port Already in Use

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**
1. **Use a different port:**
   ```bash
   PORT=4000 npm start
   ```

2. **Find and stop the conflicting process:**
   ```bash
   # Find process using port 3000
   lsof -i :3000  # macOS/Linux
   netstat -ano | findstr :3000  # Windows
   
   # Kill the process
   kill -9 <PID>  # macOS/Linux
   taskkill /PID <PID> /F  # Windows
   ```

### Missing Dependencies

**Error Message:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Permission Denied (Linux/macOS)

**Error Message:**
```
Error: listen EACCES: permission denied
```

**Solutions:**
1. **Use a port >= 1024:**
   ```bash
   PORT=3000 npm start
   ```

2. **Or run with appropriate permissions:**
   ```bash
   sudo npm start  # Not recommended for development
   ```

### Node.js Version Issues

**Error Message:**
```
Error: Node.js version 16.x.x is not supported
```

**Solution:**
1. **Update Node.js to version 18+:**
   - Download from [nodejs.org](https://nodejs.org/)
   - Or use a version manager like nvm

2. **Verify version:**
   ```bash
   node --version  # Should show v18.x.x or higher
   ```

### Environment Variable Issues

**Problem:** Environment variables not being loaded

**Solutions:**
1. **Check .env file location:**
   ```bash
   # Should be in src/backend/.env
   ls -la .env
   ```

2. **Verify .env file format:**
   ```bash
   # No spaces around = sign
   PORT=3000
   NODE_ENV=development
   ```

3. **Check file permissions:**
   ```bash
   chmod 644 .env
   ```

### Docker Issues

**Build Failures:**

1. **Clear Docker cache:**
   ```bash
   docker system prune -a
   ```

2. **Check Dockerfile location:**
   ```bash
   # Must be in src/backend/
   ls -la Dockerfile
   ```

**Container Won't Start:**

1. **Check logs:**
   ```bash
   docker logs <container-id>
   ```

2. **Verify port mapping:**
   ```bash
   docker run -p 3000:3000 hello-backend
   ```

### Testing Issues

**Tests Failing:**

1. **Ensure all dependencies are installed:**
   ```bash
   npm install
   ```

2. **Check Node.js version compatibility:**
   ```bash
   node --version  # Should be 18+
   ```

3. **Run tests with verbose output:**
   ```bash
   npm test -- --verbose
   ```

### Network Connectivity Issues

**Cannot Access Endpoint:**

1. **Verify server is running:**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Check firewall settings:**
   - Ensure port 3000 is not blocked
   - Disable firewall temporarily for testing

3. **Try different ports:**
   ```bash
   PORT=8080 npm start
   curl http://localhost:8080/hello
   ```

### Memory Issues

**Out of Memory Errors:**

1. **Increase Node.js memory limit:**
   ```bash
   NODE_OPTIONS="--max-old-space-size=2048" npm start
   ```

2. **Monitor memory usage:**
   ```bash
   # Check memory usage via health endpoint
   curl http://localhost:3000/health
   ```

### Getting Help

If you encounter issues not covered in this guide:

1. **Check application logs** for detailed error messages
2. **Verify system requirements** are met
3. **Ensure latest version** of Node.js and npm
4. **Review environment configuration** carefully
5. **Test with minimal configuration** (default settings)

### Support Resources

- **Node.js Documentation**: [https://nodejs.org/docs/](https://nodejs.org/docs/)
- **Express.js Documentation**: [https://expressjs.com/](https://expressjs.com/)
- **npm Documentation**: [https://docs.npmjs.com/](https://docs.npmjs.com/)

---

## Next Steps

Once you have the application running successfully:

1. **Explore the codebase** to understand the Express.js implementation
2. **Modify the response message** in `src/backend/routes/hello.js`
3. **Add new endpoints** following the same pattern
4. **Deploy to a cloud platform** for external access
5. **Implement additional features** like logging, authentication, or data persistence

Congratulations! You now have a fully functional Node.js/Express.js Hello World application running locally.