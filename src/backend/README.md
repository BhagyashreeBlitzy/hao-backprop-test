# Node.js Hello World Tutorial Backend

A comprehensive Node.js/Express.js tutorial application demonstrating fundamental HTTP server concepts with a single `/hello` endpoint. This backend implementation showcases modern Node.js development practices including robust error handling, comprehensive logging, health monitoring, and production-ready architecture.

## Project Overview

This tutorial application serves as an educational demonstration of building HTTP servers using Node.js 18+ and Express.js 5.1.0. The application implements a minimalist yet complete backend server with a single endpoint that returns "Hello world" while showcasing industry-standard practices for web development.

### Key Features

- **Single Endpoint Implementation**: GET `/hello` endpoint returning "Hello world"
- **Health Monitoring**: GET `/health` endpoint for application monitoring and observability
- **Production-Ready Architecture**: Comprehensive error handling, logging, and graceful shutdown
- **Modern Framework**: Express.js 5.1.0 with enhanced security and ReDoS attack prevention
- **Robust Middleware Stack**: Request logging, error handling, and body parsing for future extensibility
- **Educational Focus**: Clear, well-documented code demonstrating fundamental concepts
- **Platform Agnostic**: Compatible with local development and cloud deployment platforms

### Technology Stack

- **Runtime**: Node.js 18+ (LTS recommended)
- **Framework**: Express.js 5.1.0
- **Package Manager**: npm 8+
- **Architecture**: Stateless, horizontally scalable design
- **Protocol**: HTTP/1.1 compliant with proper status codes and headers

## Getting Started

### Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js 18.0.0 or higher**: Download from [nodejs.org](https://nodejs.org/)
- **npm 8.0.0 or higher**: Included with Node.js installation

Verify your installation:

```bash
node --version  # Should show v18.0.0 or higher
npm --version   # Should show 8.0.0 or higher
```

### Installation

1. **Clone or download the project**:
   ```bash
   # Navigate to the backend directory
   cd src/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Verify installation**:
   ```bash
   npm run validate  # Checks dependencies and syntax
   ```

### Running the Application

#### Development Mode

Start the server in development mode with enhanced logging:

```bash
npm start
```

The server will start and display:
```
[INFO] Express application initialized successfully
[INFO] Environment: development  
[INFO] Server started successfully on http://localhost:3000
[INFO] Application ready to accept requests
```

#### Alternative Start Methods

```bash
# Direct execution
node server.js

# Using development script (with nodemon for auto-restart)
npm run dev

# Custom port configuration
PORT=8080 npm start
```

#### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port number |
| `HOST` | localhost | Server host address |
| `NODE_ENV` | development | Environment mode (development/production) |

## Usage

Once the server is running, you can interact with the API using the following methods:

### Using curl

```bash
# Test the hello endpoint
curl http://localhost:3000/hello

# Expected response: Hello world

# Test with verbose output
curl -v http://localhost:3000/hello

# Check application health
curl http://localhost:3000/health
```

### Using a Web Browser

Navigate to `http://localhost:3000/hello` in your browser to see the "Hello world" response.

### Using Postman or Similar Tools

- **URL**: `http://localhost:3000/hello`
- **Method**: GET
- **Expected Response**: `Hello world`
- **Content-Type**: `text/plain; charset=utf-8`

## API Endpoints

### GET /hello

Returns a static "Hello world" message demonstrating basic HTTP request-response patterns.

**Request:**
```http
GET /hello HTTP/1.1
Host: localhost:3000
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Content-Length: 11

Hello world
```

**Error Responses:**

- **405 Method Not Allowed**: When using unsupported HTTP methods (POST, PUT, DELETE, etc.)
  ```json
  {
    "error": "Method Not Allowed",
    "status": 405
  }
  ```

### GET /health

Returns comprehensive application health status including uptime, memory usage, and environment information.

**Request:**
```http
GET /health HTTP/1.1
Host: localhost:3000
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "healthy",
  "env": "development",
  "uptime": 3600.123,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "memory": {
    "rss": 25165824,
    "heapTotal": 8388608,
    "heapUsed": 4194304,
    "external": 1048576,
    "arrayBuffers": 0
  }
}
```

### Error Handling

The application provides standardized error responses:

- **404 Not Found**: For invalid routes
- **405 Method Not Allowed**: For unsupported HTTP methods
- **500 Internal Server Error**: For server-side errors

## Testing

The application includes comprehensive testing capabilities using Jest and Supertest frameworks.

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only  
npm run test:integration

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode (development)
npm run test:watch
```

### Test Structure

```
src/test/
├── unit/           # Unit tests for individual components
├── integration/    # Integration tests for HTTP endpoints
├── helpers/        # Test utilities and helpers
├── fixtures/       # Test data and mock responses
└── setup.js        # Test environment configuration
```

### Test Coverage

The application maintains high test coverage standards:

- **Line Coverage**: 90%+ target
- **Function Coverage**: 100% target  
- **Branch Coverage**: 80%+ target

### Example Test Execution

```bash
$ npm test

> nodejs-hello-world-tutorial-backend@1.0.0 test
> node ./scripts/test.js

 PASS  src/test/unit/hello.test.js
 PASS  src/test/integration/server.test.js

Test Suites: 2 passed, 2 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        2.345 s
```

## Deployment

The application supports various deployment options from local development to cloud platforms.

### Environment Configuration

Set the following environment variables for different deployment scenarios:

```bash
# Production configuration
export NODE_ENV=production
export PORT=8080
export HOST=0.0.0.0

# Start the application
npm start
```

### Cloud Platform Deployment

#### Render

1. Connect your Git repository to Render
2. Configure build settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node.js

#### Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Deploy: `vercel --prod`
3. Configure vercel.json:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/server.js"
       }
     ]
   }
   ```

#### Railway

1. Connect repository to Railway
2. Configure environment variables
3. Deploy automatically from Git pushes

### Docker Deployment (Optional)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

USER node

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t nodejs-hello-tutorial .
docker run -p 3000:3000 nodejs-hello-tutorial
```

### Platform-Specific Notes

- **Port Configuration**: Use `process.env.PORT` for platform-provided ports
- **Host Binding**: Use `0.0.0.0` for cloud deployments
- **Environment Detection**: Set `NODE_ENV=production` for production optimizations
- **Process Management**: Application includes graceful shutdown handling

## Development

### Project Structure

```
src/backend/
├── app.js                    # Main Express application configuration
├── server.js                 # HTTP server startup and lifecycle management
├── package.json              # Project dependencies and scripts
├── routes/
│   ├── index.js             # Central router aggregating all routes
│   └── hello.js             # Hello endpoint implementation
├── middleware/
│   ├── index.js             # Middleware exports and configuration
│   ├── errorHandler.js      # Centralized error handling middleware
│   └── requestLogger.js     # Request/response logging middleware
├── utils/
│   ├── logger.js            # Centralized logging utility
│   └── errorTypes.js        # Custom error class definitions
├── config/
│   ├── constants.js         # Application constants and messages
│   └── env.js               # Environment configuration management
├── healthcheck/
│   ├── index.js             # Healthcheck module exports
│   └── routes.js            # Health monitoring endpoint
└── scripts/
    ├── start.js             # Application startup script
    └── test.js              # Test execution script
```

### Core Components

#### Application Layer (app.js)
- Express application configuration
- Middleware stack setup
- Router mounting
- Error handling registration

#### Server Layer (server.js)  
- HTTP server initialization
- Process signal handling
- Graceful shutdown management
- Startup/shutdown logging

#### Routing Layer (routes/)
- Modular route definitions
- HTTP method enforcement
- Request/response handling
- Integration with middleware

#### Utilities Layer (utils/)
- Centralized logging
- Custom error types
- Common utility functions

### Development Guidelines

#### Code Style

The project uses standardized formatting and linting:

```bash
# Check code style
npm run lint

# Auto-format code
npm run format
```

#### Adding New Endpoints

1. Create route handler in `routes/` directory
2. Export router from route module
3. Import and mount in `routes/index.js`
4. Add corresponding tests
5. Update documentation

#### Middleware Development

1. Create middleware function in `middleware/` directory
2. Export from `middleware/index.js`
3. Register in `app.js` in correct order
4. Add tests and documentation

#### Error Handling

Use custom error types from `utils/errorTypes.js`:

```javascript
const { ValidationError, NotFoundError } = require('../utils/errorTypes.js');

// Throw specific error
throw new ValidationError('Invalid input data');

// Error is caught by centralized handler
```

### Debugging

#### Development Logging

The application provides comprehensive logging in development mode:

```bash
# Start with enhanced logging
NODE_ENV=development npm start

# View specific log levels
DEBUG=app:* npm start
```

#### Health Monitoring

Monitor application health during development:

```bash
# Check health status
curl http://localhost:3000/health

# Monitor uptime and memory
watch -n 5 'curl -s http://localhost:3000/health | jq'
```

## Contributing

We welcome contributions to improve this tutorial application! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Install dependencies: `npm install`
4. Make your changes
5. Run tests: `npm test`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Development Standards

- **Code Quality**: Maintain test coverage above 90%
- **Documentation**: Update README and inline comments
- **Testing**: Add tests for new functionality
- **Style**: Follow existing conventions and use provided linting

### Code Review Process

1. All changes require code review
2. Tests must pass before merging
3. Documentation must be updated
4. Performance impact should be considered

### Issue Reporting

Please use the issue tracker to report bugs or request features:

- **Bug Reports**: Include reproduction steps and environment details
- **Feature Requests**: Explain the use case and expected behavior
- **Questions**: Use discussions for general questions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

- **Permission**: Use, copy, modify, distribute, and sell
- **Condition**: Include original copyright and license notice
- **Limitation**: Software provided "as is" without warranty

---

## Additional Resources

### Learning Resources

- [Node.js Official Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [REST API Design Guidelines](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design)

### Related Documentation

- [API Documentation](../docs/api.md)
- [Deployment Guide](../docs/deployment.md)
- [Troubleshooting Guide](../docs/troubleshooting.md)
- [Contributing Guidelines](../CONTRIBUTING.md)

### Support

For questions, issues, or contributions:

- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Discussions**: Use GitHub Discussions for questions and general discussion
- **Email**: Contact the development team for security issues

---

**Happy coding!** 🚀

This README provides comprehensive documentation for the Node.js Hello World Tutorial Backend. The application demonstrates fundamental concepts while maintaining production-ready practices and extensive documentation for educational purposes.