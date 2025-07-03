# Node.js Hello World Tutorial Application

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-username/nodejs-hello-tutorial)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Express.js Version](https://img.shields.io/badge/express-5.1.0-blue)](https://expressjs.com/)

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [References](#references)

## Project Overview

The Node.js Hello World Tutorial Application is an educational demonstration of fundamental web server capabilities using modern JavaScript technologies. This project serves as a practical introduction to Node.js and Express.js development, showcasing how to create a responsive web endpoint that handles HTTP requests and returns appropriate responses.

### Purpose

This tutorial application addresses the fundamental need for developers to understand basic web server implementation using Node.js and Express.js. It serves as an educational foundation for building HTTP-based applications while demonstrating industry-standard practices for rapid web server development.

### Business Value

- **Educational Foundation**: Provides immediate learning value for Node.js fundamentals
- **Industry Standards**: Demonstrates Express.js framework usage adopted by Fox Sports, PayPal, Uber, and IBM
- **Modern Technology**: Utilizes Express.js 5.1.0 and Node.js 18+ for current development practices
- **Simplicity Focus**: Minimalist architecture ideal for understanding core concepts

### Key Stakeholders

| Stakeholder Group | Role | Primary Interest |
|---|---|---|
| Development Teams | Primary Users | Learning Node.js fundamentals and Express.js implementation |
| Technical Educators | Content Creators | Teaching web development concepts through practical examples |
| Software Architects | Technical Reviewers | Evaluating modern JavaScript server-side architecture patterns |
| DevOps Engineers | Deployment Specialists | Understanding application deployment and runtime requirements |

## Features

✅ **Modern Technology Stack**
- Node.js 18+ runtime environment
- Express.js 5.1.0 web framework
- Enhanced security with ReDoS attack prevention
- Promise support with automatic error handling

✅ **Simple HTTP Server**
- Single HTTP GET `/hello` endpoint
- Static "Hello world" response
- Stateless request-response architecture
- Cross-platform compatibility

✅ **Educational Design**
- Minimal boilerplate code
- Clear, readable implementation
- Focus on fundamental concepts
- Comprehensive documentation

✅ **Production-Ready Practices**
- Basic error handling
- Environment configuration support
- Standard HTTP response codes
- Security best practices

## Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)

### Version Verification

```bash
node --version  # Should show v18.0.0 or higher
npm --version   # Should show v8.0.0 or higher
```

### Installing Node.js

Download and install Node.js from the official website:
- [Node.js Downloads](https://nodejs.org/en/download/)

For package managers:
```bash
# macOS with Homebrew
brew install node

# Ubuntu/Debian
sudo apt-get install nodejs npm

# Windows with Chocolatey
choco install nodejs
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/nodejs-hello-tutorial.git
cd nodejs-hello-tutorial
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- `express@^5.1.0` - Web framework for Node.js

### 3. Verify Installation

```bash
npm ls
```

Expected output:
```
nodejs-hello-tutorial@1.0.0
└── express@5.1.0
```

## Usage

### Starting the Application

```bash
npm start
```

Expected output:
```
Server running on port 3000
```

### Accessing the Application

Once the server is running, you can access the application at:
- **Local URL**: http://localhost:3000/hello
- **Expected Response**: "Hello world"

### Example Usage

#### Using curl

```bash
curl http://localhost:3000/hello
```

Response:
```
Hello world
```

#### Using a Web Browser

Navigate to http://localhost:3000/hello in your browser to see the "Hello world" message.

#### Using Node.js fetch (Node.js 18+)

```javascript
const response = await fetch('http://localhost:3000/hello');
const text = await response.text();
console.log(text); // "Hello world"
```

## API Reference

### GET /hello

Returns a simple "Hello world" greeting message.

#### Request

```http
GET /hello HTTP/1.1
Host: localhost:3000
```

#### Response

```http
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Content-Length: 11

Hello world
```

#### Response Details

| Property | Value |
|---|---|
| **Status Code** | 200 OK |
| **Content-Type** | text/plain; charset=utf-8 |
| **Response Body** | "Hello world" |
| **Response Time** | < 100ms (typical) |

### Error Responses

#### 404 Not Found

For any route other than `/hello`:

```http
HTTP/1.1 404 Not Found
Content-Type: text/html; charset=utf-8
Content-Length: 139

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot GET /invalid-route</pre>
</body>
</html>
```

#### 405 Method Not Allowed

For non-GET requests to `/hello`:

```http
HTTP/1.1 405 Method Not Allowed
Content-Type: text/html; charset=utf-8
```

## Testing

### Running Tests

```bash
npm test
```

### Test Coverage

Generate test coverage report:

```bash
npm run test:coverage
```

### Test Structure

The application includes comprehensive test coverage:

- **Unit Tests**: Route handler functionality testing
- **Integration Tests**: HTTP server behavior validation
- **End-to-End Tests**: Complete request-response cycle testing
- **Performance Tests**: Response time validation

### Test Organization

```
test/
├── unit/
│   └── hello.test.js        # Route handler tests
├── integration/
│   └── server.test.js       # HTTP server tests
└── helpers/
    └── testUtils.js         # Shared test utilities
```

### Test Commands

| Command | Purpose |
|---|---|
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:verbose` | Run tests with detailed output |

## Deployment

### Local Deployment

The application is ready to run locally with minimal setup:

```bash
npm install
npm start
```

### Environment Configuration

#### PORT Configuration

The application uses environment variables for configuration:

```bash
# Development (default)
PORT=3000 npm start

# Production
PORT=8080 npm start
```

#### NODE_ENV Configuration

```bash
# Development mode
NODE_ENV=development npm start

# Production mode
NODE_ENV=production npm start
```

### Cloud Deployment

#### Render

1. Connect your GitHub repository to Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Deploy automatically

#### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

#### Railway

1. Connect your GitHub repository to Railway
2. Deploy with zero configuration

### Docker Deployment (Optional)

Create a `Dockerfile`:

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

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | 3000 | Server port number |
| `NODE_ENV` | development | Environment mode |

## Project Structure

```
nodejs-hello-tutorial/
├── app.js                 # Main application file
├── package.json           # Project configuration and dependencies
├── package-lock.json      # Dependency lock file
├── README.md              # This file
├── LICENSE                # MIT License
├── .gitignore             # Git ignore rules
├── test/                  # Test files
│   ├── unit/
│   │   └── hello.test.js
│   └── integration/
│       └── server.test.js
├── docs/                  # Additional documentation
│   ├── getting-started.md
│   ├── api-documentation.md
│   ├── deployment-guide.md
│   ├── contributing.md
│   └── architecture.md
└── infrastructure/        # Deployment and monitoring scripts
    ├── docker-compose.yml
    └── monitoring/
```

### Key Files

- **app.js**: Main Express.js application with route definitions
- **package.json**: Project metadata, dependencies, and scripts
- **README.md**: Comprehensive project documentation
- **test/**: Test suites for quality assurance

## Contributing

We welcome contributions to improve this educational tutorial! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/improvement`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m "Add improvement"`
6. Push to the branch: `git push origin feature/improvement`
7. Submit a pull request

### Code Style

- Follow JavaScript ES6+ standards
- Use meaningful variable names
- Include comments for complex logic
- Maintain the educational focus of the project

### Testing

All contributions should include appropriate tests:
- Unit tests for new functions
- Integration tests for API changes
- Documentation updates for new features

### Code of Conduct

Please read our [Code of Conduct](docs/contributing.md) to understand our community standards.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Node.js Hello World Tutorial

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

### Documentation

- [Node.js Official Documentation](https://nodejs.org/en/docs/)
- [Express.js Official Documentation](https://expressjs.com/)
- [npm Documentation](https://docs.npmjs.com/)

### Learning Resources

- [Node.js Tutorial](https://nodejs.org/en/learn/)
- [Express.js Tutorial](https://expressjs.com/en/starter/hello-world.html)
- [JavaScript MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

### Related Projects

- [Express.js Examples](https://github.com/expressjs/express/tree/master/examples)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Awesome Node.js](https://github.com/sindresorhus/awesome-nodejs)

### Additional Resources

- [Getting Started Guide](docs/getting-started.md)
- [API Documentation](docs/api-documentation.md)
- [Deployment Guide](docs/deployment-guide.md)
- [Contributing Guide](docs/contributing.md)
- [Architecture Overview](docs/architecture.md)

---

**Built with ❤️ for learning Node.js and Express.js**

For questions or support, please open an issue on GitHub or reach out to the maintainers.