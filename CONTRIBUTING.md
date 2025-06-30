# Contributing to Node.js Tutorial Application

Welcome to the Node.js Tutorial Application! This project is designed as a comprehensive educational resource for learning server-side JavaScript development with Node.js v22.x LTS and Express.js v5.1.0. While this is primarily an educational project, we welcome contributions that enhance the learning experience and maintain the high-quality standards established by this codebase.

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

### Project Mission and Educational Values

This Node.js tutorial backend addresses the need for accessible, practical learning resources in modern server-side JavaScript development. Our contribution philosophy centers around maintaining **educational clarity**, **production-ready practices**, and **comprehensive documentation** that serves both individual learners and educational institutions.

**Core Values:**
- **Educational Excellence**: Every contribution must enhance learning value and provide clear understanding of Node.js concepts
- **Code Clarity**: All code must be self-documenting with comprehensive inline comments and examples
- **Production Readiness**: Despite being educational, all code follows enterprise-grade patterns and best practices
- **Reproducibility**: All contributions must work consistently across different development environments
- **Maintainability**: Clean, modular code organization that demonstrates professional development practices

### Educational Focus Areas

Our contributors help maintain and enhance learning resources in:

| Focus Area | Description | Key Skills Demonstrated |
|------------|-------------|------------------------|
| **HTTP Server Fundamentals** | Node.js HTTP server creation and configuration | Node.js runtime, event loop, non-blocking I/O |
| **Express.js Framework** | Modern web framework patterns and middleware | Express.js v5.1.0, routing, middleware architecture |
| **Modern JavaScript** | ES2015+ features and async/await patterns | JavaScript evolution, async programming |
| **Testing Strategies** | Comprehensive testing with Jest and Supertest | Test-driven development, coverage analysis |
| **Production Practices** | Error handling, logging, configuration management | Professional development workflows |

### High-Level Contribution Workflow

1. **Fork the Repository**: Create your own fork to work on
2. **Create Feature Branch**: Use descriptive branch names from `main`
3. **Implement Changes**: Follow our code style and testing requirements
4. **Test Thoroughly**: Ensure 90%+ coverage and all tests pass
5. **Document Changes**: Update relevant documentation and inline comments
6. **Submit Pull Request**: Follow our PR template and review process

**Quick Start for Contributors:**
```bash
# Fork the repository on GitHub, then:
git clone https://github.com/your-username/nodejs-tutorial-backend.git
cd nodejs-tutorial-backend/src/backend
npm install
npm run dev
npm test
```

---

## Code Style and Linting

### ESLint Configuration

Our project uses comprehensive ESLint rules defined in [`src/backend/.eslintrc.js`](src/backend/.eslintrc.js) to ensure consistent, high-quality code that serves educational purposes.

**Core ESLint Configuration:**
- **Framework**: ESLint v8.56.0 with Node.js and Jest plugins
- **Environment**: Node.js v22.x, ES2022, Jest testing environment
- **Extensions**: `eslint:recommended`, `plugin:node/recommended`, `plugin:jest/recommended`

### Code Style Requirements

#### JavaScript Style Standards

| Style Aspect | Requirement | ESLint Rule | Educational Purpose |
|--------------|-------------|-------------|-------------------|
| **Semicolons** | Always required | `semi: ['error', 'always']` | Explicit statement termination |
| **Quotes** | Single quotes preferred | `quotes: ['error', 'single']` | Consistent string formatting |
| **Indentation** | 2 spaces | `indent: ['error', 2]` | Clean, readable code structure |
| **Equality** | Strict equality (===) | `eqeqeq: ['error', 'always']` | Type-safe comparisons |
| **Curly Braces** | Always required | `curly: ['error', 'all']` | Explicit control flow |

#### Running Linting Commands

```bash
# Check code style across the entire backend
npm run lint

# Auto-fix linting issues where possible
npx eslint src/backend --fix

# Check specific files
npx eslint src/backend/app.js src/backend/routes/hello.js
```

### Inline Documentation Requirements

Every contribution must include comprehensive inline documentation that enhances educational value:

**Function Documentation Pattern:**
```javascript
/**
 * Generates a standardized "Hello world" response for the tutorial endpoint.
 * 
 * This function demonstrates basic HTTP response generation patterns in Express.js,
 * showing how server-side JavaScript can process requests and generate appropriate
 * responses. The implementation showcases modern JavaScript syntax and Express.js
 * response object methods.
 * 
 * Educational Value:
 * - HTTP response object manipulation
 * - Content-Type header management
 * - Status code setting best practices
 * 
 * @param {Object} req - Express.js request object containing client request data
 * @param {Object} res - Express.js response object for sending data to client
 * @returns {void} Sends HTTP response directly to client
 */
function generateHelloResponse(req, res) {
  // Set appropriate content type for plain text response
  res.setHeader('Content-Type', 'text/plain');
  
  // Send successful response with educational message
  res.status(200).send('Hello world');
}
```

---

## Branching and Commit Messages

### Branching Strategy

We use a **feature branch workflow** based on the `main` branch to maintain clean version control and enable collaborative development.

**Branch Naming Conventions:**

| Branch Type | Naming Pattern | Example | Purpose |
|-------------|---------------|---------|---------|
| **Feature** | `feature/descriptive-name` | `feature/add-health-endpoint` | New functionality or enhancements |
| **Bug Fix** | `bugfix/issue-description` | `bugfix/fix-error-handler-logging` | Corrections to existing functionality |
| **Documentation** | `docs/section-updated` | `docs/update-api-documentation` | Documentation improvements |
| **Refactor** | `refactor/component-name` | `refactor/middleware-organization` | Code improvements without functional changes |

**Branch Creation Process:**
```bash
# Always start from latest main branch
git checkout main
git pull origin main

# Create and switch to feature branch
git checkout -b feature/descriptive-name

# Make your changes, then:
git add .
git commit -m "feat: descriptive commit message"
git push origin feature/descriptive-name
```

### Commit Message Conventions

We follow **conventional commit** standards to maintain clear project history and enable automated versioning.

**Commit Message Format:**
```
<type>(<scope>): <description>

<optional body>

<optional footer>
```

**Commit Types:**

| Type | Purpose | Example |
|------|---------|---------|
| `feat` | New features | `feat(routes): add health check endpoint` |
| `fix` | Bug fixes | `fix(middleware): correct error handler status codes` |
| `docs` | Documentation changes | `docs(readme): update installation instructions` |
| `style` | Code formatting (not affecting logic) | `style(app): fix ESLint formatting issues` |
| `refactor` | Code refactoring | `refactor(utils): reorganize logger utility functions` |
| `test` | Test additions or modifications | `test(routes): add integration tests for hello endpoint` |
| `chore` | Build process or auxiliary tool changes | `chore(package): update Express.js to v5.1.0` |

**Good Commit Examples:**
```bash
git commit -m "feat(routes): implement GET /hello endpoint with comprehensive logging"
git commit -m "test(integration): add Supertest coverage for error handling middleware"
git commit -m "docs(contributing): update code style guidelines with ESLint rules"
git commit -m "fix(config): resolve environment variable loading in production"
```

### Version Control Hygiene

Our [`.gitignore`](src/backend/.gitignore) file ensures repository cleanliness and security:

**Key Exclusions:**
- **Dependencies**: `node_modules/` (installed via `npm install`)
- **Build Artifacts**: `dist/`, `build/`, `coverage/`
- **Sensitive Data**: `.env`, `.env.*`, `*.log`
- **OS Files**: `.DS_Store`, temporary files
- **Development Cache**: `.eslintcache`, `*.pid`

**Repository Hygiene Checklist:**
- ✅ Never commit `node_modules/` or `package-lock.json` to main branch
- ✅ Always exclude environment files (`.env`) containing sensitive data
- ✅ Remove log files and temporary data before commits
- ✅ Use descriptive commit messages following conventional format
- ✅ Keep commits focused on single logical changes

---

## Testing and Coverage

### Testing Framework Configuration

Our comprehensive testing strategy uses **Jest v29.0.0** with **Supertest v7.1.1** as defined in [`src/backend/jest.config.js`](src/backend/jest.config.js).

**Testing Stack:**
- **Test Framework**: Jest (built-in assertions, mocking, coverage)
- **HTTP Testing**: Supertest (Express.js HTTP endpoint testing)
- **Coverage**: Jest built-in coverage with HTML, LCOV, and text reports
- **Environment**: Node.js test environment optimized for server-side testing

### Test Organization

```
src/backend/tests/
├── unit/                       # Unit tests for individual functions
│   ├── app.test.js            # Express app configuration tests
│   └── routes.test.js         # Route handler unit tests
├── integration/               # Integration tests for HTTP endpoints
│   ├── server.test.js         # Server startup and lifecycle tests
│   └── endpoints.test.js      # HTTP endpoint integration tests
├── helpers/                   # Test utility functions
│   └── testUtils.js          # Shared test helpers and utilities
└── setup.js                  # Global test environment setup
```

### Running Tests

**Essential Test Commands:**
```bash
# Run all tests with coverage report
npm test

# Run tests with detailed coverage report
npm run test:coverage

# Run tests in watch mode during development
npm run test:watch

# Run specific test file
npx jest tests/unit/app.test.js

# Run tests matching pattern
npx jest --testNamePattern="hello endpoint"
```

### Coverage Requirements

| Coverage Type | Target | Minimum Threshold | Enforcement |
|---------------|---------|------------------|-------------|
| **Line Coverage** | 95% | 90% | Build failure below threshold |
| **Function Coverage** | 100% | 100% | All functions must be tested |
| **Branch Coverage** | 90% | 85% | Decision paths covered |
| **Statement Coverage** | 95% | 90% | Code execution coverage |

**Coverage Validation:**
```bash
# Generate detailed coverage report
npm run test:coverage

# View HTML coverage report
open coverage/lcov-report/index.html

# Check coverage thresholds
npx jest --coverage --passWithNoTests
```

### Test Requirements for New Code

#### Unit Test Requirements

Every new function, route handler, or utility must include comprehensive unit tests:

```javascript
// Example unit test pattern following Jest best practices
describe('Hello Route Handler', () => {
  it('should return Hello world with correct status code', async () => {
    const req = {}; // Mock Express request object
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      setHeader: jest.fn()
    };
    
    helloHandler(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('Hello world');
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
  });
});
```

#### Integration Test Requirements

All HTTP endpoints must have comprehensive integration tests using Supertest:

```javascript
// Example integration test pattern with Supertest
describe('GET /hello endpoint', () => {
  it('should return Hello world with 200 status', async () => {
    const response = await request(app)
      .get('/hello')
      .expect('Content-Type', /text/)
      .expect(200);
    
    expect(response.text).toBe('Hello world');
  });
  
  it('should handle invalid methods gracefully', async () => {
    await request(app)
      .post('/hello')
      .expect('Content-Type', /json/)
      .expect(405);
  });
});
```

### Test Documentation Requirements

Every test must be clearly documented with educational value:
- **Descriptive test names** explaining behavior being tested
- **Comments explaining test logic** and learning objectives
- **Mock usage documentation** showing testing patterns
- **Error scenario coverage** demonstrating error handling

---

## Documentation Standards

### Inline Code Documentation

All code contributions must include comprehensive inline documentation that serves educational purposes and enables easy maintenance.

**Documentation Requirements:**

| Code Element | Documentation Standard | Example Location |
|--------------|----------------------|------------------|
| **Functions** | JSDoc comments with purpose, parameters, returns | See function examples above |
| **Routes** | Endpoint documentation with HTTP methods, parameters | `src/backend/routes/hello.js` |
| **Middleware** | Purpose, input/output, error handling behavior | `src/backend/middleware/` |
| **Configuration** | Environment variables, options, defaults | `src/backend/config/` |

### Markdown Documentation Updates

#### README.md Updates

When adding new features or changing existing functionality, update the relevant sections in [`src/backend/README.md`](src/backend/README.md):

**Sections to Update:**
- **API Summary**: Add new endpoints with full specifications
- **Usage and Scripts**: Document new npm scripts or commands
- **Architecture**: Update component diagrams if architecture changes
- **Testing**: Document new testing patterns or requirements

#### API Documentation

All API changes must be documented in [`src/backend/docs/API.md`](src/backend/docs/API.md):

**API Documentation Requirements:**
- **Complete endpoint specifications** with HTTP methods, parameters, responses
- **Request/response examples** with actual JSON/text samples
- **Error response documentation** with status codes and messages
- **Integration examples** showing how to use endpoints

#### Configuration Documentation

Document any new configuration options, environment variables, or setup requirements:

**Configuration Documentation Checklist:**
- ✅ Environment variables in README.md setup section
- ✅ Default values and examples provided
- ✅ Production deployment considerations
- ✅ Security implications of configuration changes

### Educational Documentation Standards

All documentation must enhance learning value:

**Educational Enhancement Guidelines:**
- **Explain the "why"** behind implementation decisions
- **Provide learning context** for each concept demonstrated
- **Include progressive complexity** from basic to advanced concepts
- **Cross-reference related concepts** and documentation sections
- **Maintain beginner-friendly language** while being technically accurate

---

## Pull Request Process

### Pull Request Requirements

Before submitting a pull request, ensure all requirements are met:

**Pre-submission Checklist:**
- ✅ **Code Quality**: All ESLint rules pass (`npm run lint`)
- ✅ **Testing**: All tests pass with 90%+ coverage (`npm test`)
- ✅ **Documentation**: All relevant documentation updated
- ✅ **Branching**: Feature branch created from latest `main`
- ✅ **Commits**: Conventional commit message format used

### Pull Request Template

Use this template for all pull requests:

```markdown
## Description
Brief description of changes and their educational value.

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (change affecting existing functionality)
- [ ] Documentation update

## Educational Impact
Explain how this change enhances the learning experience:
- What new concepts does it demonstrate?
- How does it improve code clarity or understanding?
- What educational value does it provide?

## Testing Checklist
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] All tests pass locally
- [ ] Coverage requirements met (90%+)

## Documentation Checklist
- [ ] Code includes comprehensive inline documentation
- [ ] README.md updated if needed
- [ ] API documentation updated if needed
- [ ] Configuration documentation updated if needed

## Validation Commands
Please run these commands and confirm results:
```bash
npm run lint      # ✅ No linting errors
npm test          # ✅ All tests pass
npm run test:coverage  # ✅ Coverage >= 90%
```
```

### Review Process

**Review Criteria:**
1. **Educational Value**: Does the change enhance learning?
2. **Code Quality**: Follows our style guidelines and best practices?
3. **Testing**: Comprehensive test coverage with clear test cases?
4. **Documentation**: Clear, helpful documentation included?
5. **Production Readiness**: Follows enterprise-grade patterns?

**Review Timeline:**
- Initial review within 2-3 business days
- Feedback provided with specific, actionable suggestions
- Re-review within 1 business day after updates
- Merge after all criteria met and approvals received

### Getting Help

If you need assistance with contributions:

**Support Channels:**
- **GitHub Issues**: [Create an issue](https://github.com/nodejs-tutorial/backend/issues) for questions or problems
- **Documentation**: Review comprehensive guides in `src/backend/README.md`
- **Code Examples**: Study existing implementations for patterns and style
- **Testing Guidance**: Review existing tests for patterns and approaches

**Common Contribution Questions:**
- **Setup Issues**: Check Node.js version (v18+ required) and dependency installation
- **Testing Problems**: Ensure test environment setup and review Jest configuration
- **Linting Errors**: Run `npm run lint` and fix reported issues
- **Coverage Issues**: Review coverage report and add missing tests

---

## Links and References

### Project Documentation

- **[Backend README.md](src/backend/README.md)**: Comprehensive project overview, setup, and usage guide
- **[API Documentation](src/backend/docs/API.md)**: Complete endpoint specifications and examples
- **[Package Configuration](src/backend/package.json)**: Dependencies, scripts, and project metadata
- **[Application Entry Point](src/backend/app.js)**: Express.js application configuration
- **[Server Startup](src/backend/server.js)**: HTTP server initialization

### Configuration and Setup

- **[ESLint Configuration](src/backend/.eslintrc.js)**: Code style rules and linting standards
- **[Jest Configuration](src/backend/jest.config.js)**: Testing framework setup and coverage requirements
- **[Git Ignore Rules](src/backend/.gitignore)**: Version control exclusion patterns
- **[Environment Config](src/backend/config/)**: Server configuration and environment management

### Educational Resources

#### Node.js Learning Resources
- **[Node.js Official Documentation](https://nodejs.org/docs/)**: Complete API reference and guides
- **[Node.js v22.x LTS Information](https://nodejs.org/en/about/releases/)**: Long-term support details
- **[Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)**: Community best practices

#### Express.js Framework Resources
- **[Express.js Official Documentation](https://expressjs.com/)**: Framework guide and tutorials
- **[Express.js 5.x API Reference](https://expressjs.com/en/5x/api.html)**: Latest API documentation
- **[Express.js Migration Guide](https://expressjs.com/en/guide/migrating-5.html)**: Version 4 to 5 migration

#### Testing and Quality Resources
- **[Jest Documentation](https://jestjs.io/docs/getting-started)**: Testing framework guide
- **[Supertest GitHub](https://github.com/visionmedia/supertest)**: HTTP testing library
- **[ESLint Rules Reference](https://eslint.org/docs/rules/)**: Complete linting rule documentation

### Industry Standards and Best Practices

- **[HTTP/1.1 Specification](https://tools.ietf.org/html/rfc7231)**: HTTP protocol standards
- **[RESTful API Guidelines](https://restfulapi.net/)**: REST API design principles
- **[Conventional Commits](https://www.conventionalcommits.org/)**: Commit message standards
- **[Semantic Versioning](https://semver.org/)**: Version management standards

### Development Environment

- **Node.js Version**: v22.x LTS (Active until October 2025)
- **Express.js Version**: v5.1.0 (latest stable with security enhancements)
- **Testing Framework**: Jest v29.0.0 with Supertest v7.1.1
- **Code Quality**: ESLint v8.56.0 with comprehensive rule sets
- **Development Tools**: Nodemon v3.0.3 for hot-reloading

---

## Quick Reference

### Common Commands

```bash
# Development setup
npm install
npm run dev

# Code quality
npm run lint
npm test
npm run test:coverage

# Branch management
git checkout -b feature/your-feature-name
git commit -m "feat: descriptive message"
git push origin feature/your-feature-name
```

### File Structure Reference

```
src/backend/
├── app.js              # Express app configuration
├── server.js           # Server entry point
├── package.json        # Project configuration
├── .eslintrc.js        # Linting rules
├── jest.config.js      # Testing configuration
├── .gitignore          # Version control exclusions
├── config/             # Configuration management
├── routes/             # API endpoint implementations
├── middleware/         # Express middleware
├── utils/              # Utility functions
├── tests/              # Test suites
└── docs/               # Documentation
```

### Coverage and Quality Targets

| Metric | Target | Minimum |
|--------|--------|---------|
| Line Coverage | 95% | 90% |
| Function Coverage | 100% | 100% |
| Branch Coverage | 90% | 85% |
| ESLint Issues | 0 | 0 |

---

**🚀 Ready to Contribute?** Start with `npm install && npm run dev` then explore the codebase and create your first feature branch!

**📚 Learning Goals**: Every contribution should enhance the educational value while maintaining production-ready code quality and comprehensive testing.

**🔍 Need Help?** Review the comprehensive documentation in [`src/backend/README.md`](src/backend/README.md) or create an issue for support.