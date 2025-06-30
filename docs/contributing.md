# Contributing to Node.js Tutorial Application

Welcome to the Node.js Tutorial Application! This comprehensive contribution guide provides detailed standards, workflow, and best practices for contributing to this educational Node.js and Express.js backend project. Whether you're a learner, educator, or open-source contributor, this guide ensures all contributions align with the project's educational goals, technical requirements, and production-quality standards.

## Table of Contents

1. [Contribution Overview](#contribution-overview)
2. [Code Style and Linting](#code-style-and-linting)
3. [Branching and Commit Messages](#branching-and-commit-messages)
4. [Testing and Coverage](#testing-and-coverage)
5. [Documentation Standards](#documentation-standards)
6. [Pull Request Process](#pull-request-process)
7. [Links and References](#links-and-references)

---

## Contribution Overview

### Project Values and Educational Focus

This Node.js tutorial application serves as a foundational learning resource demonstrating modern web server development with Node.js v22.x LTS and Express.js v5.1.0. Our project addresses the need for accessible, practical learning resources in server-side JavaScript development, bridging the gap between overly simplistic examples and complex production applications.

**Core Educational Objectives:**
- **HTTP Server Fundamentals**: Understanding Node.js HTTP server creation and configuration
- **Express.js Framework**: Learning the de facto standard web framework for Node.js
- **Modern JavaScript Patterns**: ES2015+ features and async/await error handling
- **Production-Ready Practices**: Error handling, logging, testing, and code organization
- **Code Clarity and Documentation**: Comprehensive inline documentation for learning value

### Contribution Philosophy

All contributions must maintain the balance between educational clarity and production readiness. Code should be:
- **Educationally Valuable**: Clear, well-documented, and demonstrative of best practices
- **Production-Ready**: Following industry standards for quality, testing, and maintainability
- **Consistent**: Adhering to established patterns and architectural decisions
- **Reproducible**: Ensuring all contributors can easily set up and work with the codebase

### High-Level Contribution Workflow

1. **Fork and Clone**: Create your own fork of the repository
2. **Branch**: Create a feature or bugfix branch from `main`
3. **Code**: Implement changes following our standards and patterns
4. **Test**: Ensure all tests pass and coverage meets requirements (90%+)
5. **Document**: Update documentation to reflect your changes
6. **Lint**: Verify code quality using our ESLint configuration
7. **Pull Request**: Submit a PR with clear description and rationale

---

## Code Style and Linting

### ESLint Configuration

Our project uses ESLint v8.56.0 with a comprehensive configuration optimized for Node.js v22.x LTS and Express.js v5.1.0. The configuration is defined in `src/backend/.eslintrc.js` and includes:

**Core Rule Sets:**
- `eslint:recommended`: Standard JavaScript best practices
- `plugin:node/recommended`: Node.js-specific rules and patterns
- `plugin:jest/recommended`: Jest testing framework recommended rules
- `plugin:jest/style`: Jest style and formatting rules

**Environment Configuration:**
- **Node.js**: v18+ compatible with ES2022 features
- **Jest**: Testing environment with global variables
- **ES2022**: Modern JavaScript syntax and features

### Code Style Standards

#### Formatting Rules

| Rule | Requirement | Example |
|------|-------------|---------|
| **Quotes** | Single quotes with escape avoidance | `'Hello world'` |
| **Semicolons** | Required for statement termination | `const app = express();` |
| **Indentation** | 2 spaces, switch case indented | `if (condition) {\n  // 2 spaces\n}` |
| **Trailing Commas** | Not allowed | `{ a: 1, b: 2 }` |

#### Code Quality Rules

```javascript
// ✅ Correct: Use strict equality
if (value === 'hello') {
  // Implementation
}

// ❌ Incorrect: Avoid loose equality
if (value == 'hello') {
  // Implementation
}

// ✅ Correct: Always use curly braces
if (condition) {
  return result;
}

// ❌ Incorrect: Missing curly braces
if (condition) return result;
```

### Running the Linter

**Check code quality:**
```bash
npm run lint
```

**Common lint commands:**
```bash
# Lint all backend files
npx eslint src/backend

# Lint specific file
npx eslint src/backend/app.js

# Auto-fix fixable issues
npx eslint src/backend --fix
```

### Educational Comments and Documentation

All code must include comprehensive inline documentation that serves educational purposes:

```javascript
/**
 * Creates and configures the Express.js application instance.
 * 
 * This function demonstrates the fundamental pattern for Express.js app setup,
 * including middleware registration, route mounting, and error handling.
 * Educational value: Shows proper separation of concerns and middleware ordering.
 * 
 * @returns {Express} Configured Express application instance
 */
function createApp() {
  const app = express();
  
  // Middleware registration order is critical in Express.js
  app.use(requestLogger); // Log all incoming requests first
  app.use('/hello', helloRouter); // Mount route handlers
  app.use(notFoundHandler); // Handle 404 errors
  app.use(errorHandler); // Handle all other errors last
  
  return app;
}
```

---

## Branching and Commit Messages

### Branching Strategy

We follow a **simplified Git Flow** model optimized for educational contributions:

**Branch Types:**
- `main`: Production-ready code, always stable
- `feature/*`: New features or enhancements
- `bugfix/*`: Bug fixes and corrections
- `docs/*`: Documentation updates
- `refactor/*`: Code refactoring without behavior changes

**Branch Naming Convention:**
```bash
# Feature branches
feature/add-health-endpoint
feature/improve-error-handling

# Bug fix branches
bugfix/fix-cors-headers
bugfix/resolve-memory-leak

# Documentation branches
docs/update-api-documentation
docs/add-deployment-guide
```

### Commit Message Conventions

Follow **Conventional Commits** specification for clear, meaningful commit messages:

**Format:**
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Commit Types:**
- `feat`: New features or functionality
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons)
- `refactor`: Code refactoring without behavior changes
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates

**Examples:**
```bash
feat(routes): add health check endpoint

Add /health endpoint for application monitoring and load balancer
health checks. Returns server status, uptime, and basic metrics.

Closes #123

fix(middleware): resolve error handler promise rejection

Express 5 automatically handles promise rejections, but error
handler was not properly configured for async middleware.

test(integration): add comprehensive endpoint testing

Increase test coverage for all HTTP endpoints including error
scenarios. Coverage now meets 90%+ requirement.
```

### Version Control Hygiene

Our `.gitignore` configuration in `src/backend/.gitignore` maintains repository cleanliness by excluding:

**Security and Sensitive Files:**
- `.env` and environment variable files
- `*.log` files that may contain sensitive runtime data
- Process files (`*.pid`, `*.pid.lock`)

**Build Artifacts and Dependencies:**
- `node_modules/` directory (managed via `package.json`)
- `coverage/` directory (generated by Jest)
- `dist/` and `build/` directories

**Development Tool Cache:**
- `.eslintcache` files
- Operating system files (`.DS_Store`)

**Best Practices:**
- Never commit `node_modules/` - dependencies managed via `package.json`
- Always exclude `.env` files containing sensitive configuration
- Commit `package-lock.json` for reproducible builds
- Use meaningful file organization and naming conventions

---

## Testing and Coverage

### Testing Framework and Tools

Our comprehensive testing strategy uses modern JavaScript testing tools:

**Primary Testing Stack:**
- **Jest v29.0.0**: JavaScript testing framework with built-in assertions, mocking, and coverage
- **Supertest v7.1.1**: HTTP assertion library for testing Express.js applications
- **Node.js Test Environment**: Optimized for server-side testing

**Configuration:** Testing is configured in `src/backend/jest.config.js` with comprehensive settings for educational clarity.

### Test Organization

```
src/backend/tests/
├── setup.js                   # Global test environment setup
├── helpers/                   # Shared test utilities
│   └── testUtils.js          # Common test helper functions
├── unit/                     # Unit tests for individual functions
│   ├── app.test.js          # Express app configuration tests
│   └── routes.test.js       # Route handler tests
└── integration/             # Integration tests for HTTP endpoints
    ├── server.test.js       # Server startup and lifecycle tests
    └── endpoints.test.js    # HTTP endpoint tests
```

### Running Tests

**Execute all tests:**
```bash
npm test
```

**Run tests with coverage report:**
```bash
npm run test:coverage
```

**Watch mode for development:**
```bash
npm run test:watch
```

**Test specific files:**
```bash
# Run specific test file
npx jest tests/unit/app.test.js

# Run tests matching pattern
npx jest --testNamePattern="hello endpoint"
```

### Coverage Requirements

**Minimum Coverage Thresholds:**
- **Line Coverage**: 90% minimum (target: 95%)
- **Function Coverage**: 100% required
- **Branch Coverage**: 85% minimum (target: 90%)
- **Statement Coverage**: 90% minimum

**Coverage Reports:**
- **HTML Report**: `coverage/lcov-report/index.html` - Interactive browser-based report
- **Console Output**: Summary displayed during test execution
- **LCOV Format**: `coverage/lcov.info` - For CI/CD integration

### Testing Standards

**Unit Test Example:**
```javascript
describe('Hello Route Handler', () => {
  it('should return Hello world with correct status', async () => {
    const response = await request(app)
      .get('/hello')
      .expect('Content-Type', /text/)
      .expect(200);
    
    expect(response.text).toBe('Hello world');
  });

  it('should handle errors gracefully', async () => {
    // Test error scenarios
    const response = await request(app)
      .post('/hello') // Invalid method
      .expect(405);
    
    expect(response.body.error).toBe(true);
  });
});
```

**Integration Test Requirements:**
- Test complete HTTP request-response cycles
- Validate all status codes and response formats
- Test error handling and edge cases
- Ensure middleware integration works correctly

**Test Quality Standards:**
- **Descriptive Names**: Test names should clearly describe behavior being tested
- **Isolation**: Each test should be independent and not affect others
- **Comprehensive Coverage**: Test both success and failure scenarios
- **Performance**: Tests should complete within reasonable time limits (< 10 seconds)

---

## Documentation Standards

### Inline Documentation Requirements

All code must include comprehensive inline documentation that serves educational purposes:

**Function Documentation:**
```javascript
/**
 * Configures and initializes the Express.js application with middleware and routes.
 * 
 * This function demonstrates the fundamental pattern for Express.js application setup,
 * showcasing proper middleware ordering, route mounting, and error handling configuration.
 * The implementation follows Express.js v5.1.0 best practices and serves as an educational
 * example of production-ready server configuration.
 * 
 * Educational Value:
 * - Demonstrates middleware execution order importance
 * - Shows proper error handling middleware placement
 * - Illustrates Express.js application factory pattern
 * 
 * @returns {Express} Configured Express application instance ready for server binding
 * @throws {Error} If middleware registration fails
 */
function createExpressApp() {
  // Implementation with detailed comments
}
```

**Module Documentation:**
```javascript
/**
 * HELLO ENDPOINT ROUTE HANDLER
 * 
 * This module implements the /hello endpoint for the Node.js tutorial application,
 * demonstrating fundamental HTTP request handling patterns in Express.js v5.1.0.
 * The implementation serves as an educational example of proper route organization,
 * response formatting, and error handling in a Node.js web server.
 * 
 * Key Learning Objectives:
 * 1. Express.js route definition and handler implementation
 * 2. HTTP response generation with proper status codes
 * 3. Request processing and middleware integration
 * 4. Error handling patterns for production applications
 * 
 * @fileoverview Hello endpoint implementation for educational Node.js tutorial
 * @author Node.js Tutorial Contributors
 * @requires express Express.js framework v5.1.0
 */
```

### Markdown Documentation Updates

When making changes that affect functionality, update relevant documentation:

**Required Documentation Updates:**
- **API Documentation**: Update `src/backend/docs/API.md` for endpoint changes
- **README Updates**: Modify `src/backend/README.md` for setup or usage changes
- **Architecture Documentation**: Update component documentation for structural changes

**Documentation Standards:**
- Use clear, concise language suitable for learners
- Include practical examples and code snippets
- Maintain consistent formatting and structure
- Provide cross-references to related documentation

### API Documentation Requirements

For any endpoint changes, update `src/backend/docs/API.md` with:

```markdown
#### GET /hello
Returns the foundational "Hello world" message demonstrating basic HTTP request/response handling.

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

**Error Responses:**
- `405 Method Not Allowed`: Non-GET requests
- `500 Internal Server Error`: Unexpected server errors
```

---

## Pull Request Process

### Before Opening a Pull Request

**Pre-submission Checklist:**
- [ ] All tests pass (`npm test`)
- [ ] Code coverage meets requirements (`npm run test:coverage`)
- [ ] Code quality checks pass (`npm run lint`)
- [ ] Documentation updated for any functional changes
- [ ] Commit messages follow conventional commit format
- [ ] Branch follows naming conventions

### Pull Request Requirements

**PR Title Format:**
```
<type>(<scope>): <description>

Examples:
feat(routes): add health check endpoint
fix(middleware): resolve CORS header issue
docs(api): update endpoint documentation
```

**PR Description Template:**
```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Code refactoring

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] All tests pass
- [ ] Coverage requirements met (90%+)

## Documentation
- [ ] Code includes comprehensive inline documentation
- [ ] API documentation updated (if applicable)
- [ ] README updated (if applicable)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Code is well-commented for educational value
- [ ] No sensitive information exposed
```

### Review Process

**Required Checks:**
1. **Automated Checks**: All CI/CD checks must pass
2. **Code Quality**: ESLint validation and style compliance
3. **Test Coverage**: Minimum 90% coverage maintained
4. **Educational Value**: Code demonstrates learning objectives clearly
5. **Documentation**: Comprehensive documentation for educational purposes

**Review Criteria:**
- **Functionality**: Code works as intended and meets requirements
- **Quality**: Follows established patterns and best practices
- **Testing**: Comprehensive test coverage for new and changed code
- **Documentation**: Clear explanations suitable for learning
- **Security**: No sensitive information or security vulnerabilities

### Addressing Review Feedback

**Response Process:**
1. **Read Carefully**: Understand all reviewer feedback
2. **Ask Questions**: Clarify any unclear feedback
3. **Make Changes**: Address all requested modifications
4. **Test Again**: Ensure changes don't break existing functionality
5. **Document**: Update documentation if changes affect behavior
6. **Respond**: Mark resolved conversations and explain changes

**Common Review Points:**
- Code style and ESLint compliance
- Test coverage and quality
- Documentation completeness
- Error handling patterns
- Educational clarity and value

---

## Links and References

### Project Documentation

**Core Documentation:**
- **[Backend README](../src/backend/README.md)**: Comprehensive backend documentation and setup guide
- **[API Documentation](../src/backend/docs/API.md)**: Complete API reference with examples
- **[Package Configuration](../src/backend/package.json)**: Dependencies, scripts, and project metadata

**Configuration Files:**
- **[ESLint Configuration](../src/backend/.eslintrc.js)**: Code style and quality rules
- **[Jest Configuration](../src/backend/jest.config.js)**: Testing framework setup and coverage requirements
- **[Git Ignore Rules](../src/backend/.gitignore)**: Version control exclusion patterns

### Technical Resources

**Node.js and Express.js:**
- **[Node.js v22.x LTS Documentation](https://nodejs.org/docs/latest-v22.x/api/)**: Official Node.js API reference
- **[Express.js v5.x Documentation](https://expressjs.com/en/5x/api.html)**: Express.js framework documentation
- **[Express.js Migration Guide](https://expressjs.com/en/guide/migrating-5.html)**: Express 4 to 5 migration guide

**Testing and Quality:**
- **[Jest Documentation](https://jestjs.io/docs/getting-started)**: JavaScript testing framework
- **[Supertest Documentation](https://github.com/visionmedia/supertest)**: HTTP assertion library
- **[ESLint Rules Reference](https://eslint.org/docs/rules/)**: Complete ESLint rules documentation

**Development Best Practices:**
- **[Conventional Commits](https://www.conventionalcommits.org/)**: Commit message specification
- **[Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)**: Community best practices guide
- **[JavaScript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)**: Testing guidelines

### Educational Resources

**Learning Path:**
1. **Beginner**: Start with basic HTTP server concepts and Express.js fundamentals
2. **Intermediate**: Explore middleware patterns, error handling, and testing strategies
3. **Advanced**: Study production deployment, monitoring, and performance optimization
4. **Expert**: Investigate microservices architecture and distributed systems

**Related Concepts:**
- **RESTful API Design**: HTTP methods, status codes, and resource modeling
- **Middleware Patterns**: Request processing pipelines and cross-cutting concerns
- **Testing Strategies**: Unit, integration, and end-to-end testing approaches
- **Code Quality**: Linting, formatting, and maintainability practices

### Support and Community

**Getting Help:**
- **Issues**: Use GitHub issues for bug reports and feature requests
- **Discussions**: Community discussions for questions and learning
- **Documentation**: Comprehensive inline and markdown documentation

**Issue Templates:**
- **Bug Report**: For reporting functionality issues
- **Feature Request**: For suggesting new educational features
- **Documentation**: For documentation improvements or clarifications
- **Question**: For learning-related questions and clarifications

---

## Summary

This contribution guide ensures that all contributions to the Node.js Tutorial Application maintain the highest standards of educational value, code quality, and production readiness. By following these guidelines, contributors help create a valuable learning resource that demonstrates modern Node.js and Express.js development practices.

**Key Takeaways:**
- **Educational First**: All code should serve as clear examples for learners
- **Quality Standards**: Maintain 90%+ test coverage and ESLint compliance
- **Documentation**: Comprehensive inline and markdown documentation required
- **Modern Practices**: Use Node.js v22.x LTS and Express.js v5.1.0 best practices
- **Consistency**: Follow established patterns and architectural decisions

**Quick Start for Contributors:**
1. Fork repository and create feature branch
2. Set up development environment: `npm install && npm run dev`
3. Make changes following style and testing requirements
4. Validate: `npm test && npm run test:coverage && npm run lint`
5. Submit pull request with comprehensive description

Thank you for contributing to this educational Node.js resource! Your contributions help developers worldwide learn server-side JavaScript development with modern, production-ready patterns.