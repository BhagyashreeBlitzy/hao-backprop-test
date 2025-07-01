# Node.js Hello World Tutorial Application

[![Build Status](https://github.com/username/nodejs-hello-tutorial/workflows/CI/badge.svg)](https://github.com/username/nodejs-hello-tutorial/actions)
[![Coverage Status](https://codecov.io/gh/username/nodejs-hello-tutorial/branch/main/graph/badge.svg)](https://codecov.io/gh/username/nodejs-hello-tutorial)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Express Version](https://img.shields.io/badge/express-5.1.0-blue.svg)](https://expressjs.com/)

## Project Overview

This project is a Node.js tutorial application that demonstrates fundamental web server capabilities through a simple HTTP endpoint implementation. The application leverages **Node.js 22.x LTS** as a free, open-source, cross-platform JavaScript runtime environment combined with **Express.js 5.1.0** (now the default on npm) as the web framework.

### Core Business Problem

The project addresses the fundamental need for developers to understand basic web server implementation using modern JavaScript technologies. It serves as an educational foundation for building HTTP-based applications, demonstrating how to create a responsive web endpoint that can handle client requests and return appropriate responses.

### Key Stakeholders

- **Development Teams**: Learning Node.js fundamentals and Express.js implementation
- **Technical Educators**: Teaching web development concepts through practical examples  
- **Software Architects**: Evaluating modern JavaScript server-side architecture patterns
- **DevOps Engineers**: Understanding application deployment and runtime requirements

### Business Value

The tutorial application provides immediate educational value by demonstrating industry-standard practices for Node.js web development. Express.js has been called the de facto standard server framework for Node.js and is used by Fox Sports, PayPal, Uber, and IBM, making this tutorial highly relevant for modern web development education.

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)  
- [Usage](#usage)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [References](#references)

## Features

- **Modern Stack**: Node.js 18+ and Express.js 5.1.0 with latest security features
- **Single HTTP Endpoint**: Clean `/hello` GET endpoint implementation
- **Static Response**: Returns consistent "Hello world" message
- **Educational Focus**: Demonstrates fundamental HTTP request-response patterns
- **Basic Error Handling**: Proper HTTP status codes and error responses
- **Health Check Support**: Built-in application health monitoring
- **Comprehensive Test Suite**: Unit and integration tests with coverage reporting
- **Security Enhanced**: Express.js 5.0 includes ReDoS attack prevention and CVE-2024-45590 mitigation
- **Cross-Platform**: Compatible with Windows, macOS, Linux, and other Node.js supported platforms

## Quick Start

Get up and running in less than 2 minutes:

```bash
# Clone the repository
git clone https://github.com/username/nodejs-hello-tutorial.git
cd nodejs-hello-tutorial

# Install dependencies
npm install

# Start the server
npm start

# Test the endpoint
curl http://localhost:3000/hello
```

**Expected Response**: `Hello world`

## Installation

### Prerequisites

- **Node.js**: Version 18.0.0 or higher (22.x LTS recommended)
- **npm**: Version 8.0.0 or higher (comes bundled with Node.js)

> **Note**: Express.js 5.0 requires Node.js 18 or higher for security standards and modern JavaScript feature support.

### Step-by-Step Installation

1. **Verify Node.js Installation**:
   ```bash
   node --version  # Should show v18.0.0 or higher
   npm --version   # Should show 8.0.0 or higher
   ```

2. **Clone the Repository**:
   ```bash
   git clone https://github.com/username/nodejs-hello-tutorial.git
   cd nodejs-hello-tutorial
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Verify Installation**:
   ```bash
   npm ls  # Check dependency tree
   npm audit  # Security vulnerability check
   ```

5. **Start the Application**:
   ```bash
   npm start
   ```

6. **Verify Server is Running**:
   ```bash
   # The server should display: "Server running on port 3000"
   # Test the endpoint:
   curl http://localhost:3000/hello
   ```

### Alternative Installation Methods

**Using Docker** (Optional):
```bash
# Build Docker image
docker build -t nodejs-hello-tutorial .

# Run container
docker run -p 3000:3000 nodejs-hello-tutorial
```

## Usage

### Basic Usage

Once the server is running, you can interact with the API endpoint:

**Start the Server**:
```bash
npm start
# Output: Server running on port 3000
```

**Access the Hello Endpoint**:
```bash
# Using curl
curl http://localhost:3000/hello

# Using wget
wget -qO- http://localhost:3000/hello

# Using httpie
http GET localhost:3000/hello
```

**Expected Response**:
```
Hello world
```

### Development Mode

For development with automatic restart on file changes:

```bash
# Install nodemon globally (optional)
npm install -g nodemon

# Run in development mode
npm run dev
```

### Environment Configuration

The application supports environment-based configuration:

```bash
# Set custom port
PORT=8080 npm start

# Set environment mode
NODE_ENV=production npm start

# Combined configuration
PORT=8080 NODE_ENV=production npm start
```

### Health Check

Monitor application health:

```bash
curl http://localhost:3000/health
```

**Response Example**:
```json
{
  "status": "healthy",
  "uptime": 125.45,
  "timestamp": "2025-07-01T12:00:00.000Z",
  "memory": {
    "rss": 45678592,
    "heapTotal": 20971520,
    "heapUsed": 15728640,
    "external": 1048576
  }
}
```

## API Reference

### Endpoints

#### GET /hello

Returns a "Hello world" message demonstrating basic HTTP endpoint functionality.

**Request**:
```http
GET /hello HTTP/1.1
Host: localhost:3000
Accept: text/plain
```

**Response**:
```http
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Content-Length: 11
Date: Wed, 01 Jul 2025 12:00:00 GMT

Hello world
```

**cURL Example**:
```bash
curl -X GET http://localhost:3000/hello \
  -H "Accept: text/plain"
```

**JavaScript Fetch Example**:
```javascript
fetch('http://localhost:3000/hello')
  .then(response => response.text())
  .then(data => console.log(data)); // "Hello world"
```

#### GET /health

Returns application health and status information.

**Response**:
```json
{
  "status": "healthy",
  "uptime": 125.45,
  "timestamp": "2025-07-01T12:00:00.000Z",
  "memory": {
    "rss": 45678592,
    "heapTotal": 20971520,
    "heapUsed": 15728640
  }
}
```

### Error Responses

#### 404 Not Found
For requests to non-existent endpoints:

```http
HTTP/1.1 404 Not Found
Content-Type: text/html; charset=utf-8
Content-Length: 139

<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Error</title></head>
<body><pre>Cannot GET /invalid-path</pre></body>
</html>
```

#### 405 Method Not Allowed
For invalid HTTP methods on existing endpoints:

```http
HTTP/1.1 405 Method Not Allowed
Content-Type: text/plain; charset=utf-8
Allow: GET

Method Not Allowed
```

#### 500 Internal Server Error
For server-side errors:

```http
HTTP/1.1 500 Internal Server Error
Content-Type: text/plain; charset=utf-8

Internal Server Error
```

### Response Headers

All responses include security headers:

- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking attacks
- `X-XSS-Protection: 1; mode=block` - Enables XSS filtering

## Testing

The application includes a comprehensive test suite using Jest and Supertest.

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode (development)
npm run test:watch

# Run tests with verbose output
npm run test:verbose

# Run tests for CI/CD
npm run test:ci
```

### Test Structure

```
test/
├── unit/
│   └── hello.test.js       # Unit tests for route handlers
├── integration/
│   └── server.test.js      # Integration tests for HTTP server
└── fixtures/
    └── responses.js        # Test data and fixtures
```

### Test Coverage

The test suite maintains high coverage standards:

- **Line Coverage**: 90%+ target
- **Function Coverage**: 100% target  
- **Branch Coverage**: 80%+ target
- **Statement Coverage**: 90%+ target

**View Coverage Report**:
```bash
npm run test:coverage
# Open coverage/index.html in browser
```

### Test Examples

**Basic Endpoint Test**:
```javascript
describe('GET /hello', () => {
  it('should return Hello world', async () => {
    const response = await request(app)
      .get('/hello')
      .expect(200)
      .expect('Content-Type', /text/);
    
    expect(response.text).toBe('Hello world');
  });
});
```

**Performance Test**:
```javascript
it('should respond within 100ms', async () => {
  const start = Date.now();
  await request(app).get('/hello').expect(200);
  const duration = Date.now() - start;
  
  expect(duration).toBeLessThan(100);
});
```

## Deployment

The application supports multiple deployment options from local development to cloud platforms.

### Local Deployment

**Production Mode**:
```bash
NODE_ENV=production npm start
```

**Custom Port Configuration**:
```bash
PORT=8080 npm start
```

### Docker Deployment

**Using Docker Compose**:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
```

**Commands**:
```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up -d
```

### Cloud Platform Deployment

#### Render (Recommended for Tutorials)

Render stands out among Node.js free hosting services with its straightforward deployment process:

1. Connect your GitHub repository to Render
2. Configure build settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Deploy automatically on git push

#### Vercel

While primarily known for frontend hosting, Vercel provides excellent Node.js hosting:

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel --prod`
3. Configure environment variables in dashboard

#### Railway

Railway offers a modern approach to Node.js hosting:

1. Connect GitHub repository
2. Configure environment variables
3. Deploy with automatic builds

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port (automatically set by hosting platforms) |
| `NODE_ENV` | `development` | Environment mode (`development`, `production`) |
| `HOST` | `localhost` | Server hostname |

### Health Check Configuration

For load balancers and monitoring systems:

- **Health Check URL**: `/health`
- **Expected Status**: `200 OK`
- **Response Format**: JSON with status information
- **Timeout**: 5 seconds recommended

### Performance Considerations

- **Memory Usage**: < 100MB baseline consumption
- **Response Time**: < 100ms for `/hello` endpoint
- **Concurrent Connections**: 1000+ supported
- **Startup Time**: < 500ms for application initialization

## Project Structure

```
nodejs-hello-tutorial/
├── app.js                  # Main application file
├── package.json           # Project configuration and dependencies
├── package-lock.json      # Dependency lock file
├── README.md              # This documentation file
├── LICENSE               # MIT license file
├── .gitignore            # Git ignore rules
├── .dockerignore         # Docker ignore rules
├── Dockerfile            # Docker configuration (optional)
├── docker-compose.yml    # Docker Compose configuration (optional)
├── jest.config.js        # Jest testing configuration
├── test/                 # Test suites and fixtures
│   ├── unit/
│   │   └── hello.test.js
│   ├── integration/
│   │   └── server.test.js
│   └── fixtures/
│       └── responses.js
├── docs/                 # Additional documentation
│   ├── getting-started.md
│   ├── api-documentation.md
│   ├── deployment-guide.md
│   ├── contributing.md
│   └── architecture.md
└── infrastructure/       # Deployment and monitoring scripts
    ├── docker/
    └── monitoring/
```

### Key Files Description

- **`app.js`**: Main Express.js application with route definitions
- **`package.json`**: Project metadata, dependencies, and npm scripts
- **`jest.config.js`**: Test framework configuration with coverage settings
- **`Dockerfile`**: Container configuration for Docker deployment
- **`test/`**: Comprehensive test suite with unit and integration tests

## Contributing

We welcome contributions to improve this tutorial application!

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Submit a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write tests for new functionality
- Maintain or improve code coverage
- Update documentation for significant changes
- Use meaningful commit messages

### Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](docs/contributing.md#code-of-conduct). By participating, you are expected to uphold this code.

### Reporting Issues

- Use the GitHub issue tracker
- Provide detailed reproduction steps
- Include environment information (Node.js version, OS, etc.)
- Add relevant logs or error messages

### Documentation Contributions

- Documentation improvements are highly valued
- Follow the existing documentation style
- Test any code examples provided
- Update table of contents when adding new sections

For detailed contribution guidelines, see [CONTRIBUTING.md](docs/contributing.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Node.js Hello World Tutorial

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## References

### Framework Documentation

- [Node.js Official Documentation](https://nodejs.org/docs/) - JavaScript runtime environment
- [Express.js 5.x Documentation](https://expressjs.com/5x/api.html) - Web framework documentation
- [npm Documentation](https://docs.npmjs.com/) - Package manager documentation

### Educational Resources

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices) - Comprehensive best practices guide
- [Express.js Guide](https://expressjs.com/en/guide/) - Official Express.js learning guide
- [MDN Web Docs - HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) - HTTP protocol reference

### Testing and Quality

- [Jest Documentation](https://jestjs.io/docs/getting-started) - JavaScript testing framework
- [Supertest Documentation](https://github.com/ladjs/supertest) - HTTP testing library
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Security vulnerability checking

### Deployment Platforms

- [Render Node.js Deployment](https://render.com/docs/node-express-app) - Deployment guide for Render
- [Vercel Node.js Functions](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js) - Serverless deployment
- [Railway Node.js Guide](https://docs.railway.app/guides/nodejs) - Modern deployment platform

### Additional Documentation

- [Getting Started Guide](docs/getting-started.md) - Detailed setup and tutorial
- [API Documentation](docs/api-documentation.md) - Complete API reference
- [Deployment Guide](docs/deployment-guide.md) - Comprehensive deployment instructions
- [Architecture Overview](docs/architecture.md) - System design and technical details

---

**Made with ❤️ for the Node.js community**

*This tutorial application demonstrates modern Node.js and Express.js development practices while maintaining simplicity for educational purposes.*