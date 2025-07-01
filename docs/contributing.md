# Contributing to Node.js Hello World Tutorial Backend

Welcome to the Node.js/Express.js Hello World tutorial backend project! We're excited to have you contribute to this educational resource that helps developers learn fundamental HTTP server concepts using modern Node.js and Express.js technologies.

This guide provides everything you need to know to contribute effectively to the project, whether you're fixing bugs, adding features, improving documentation, or enhancing tests.

## Table of Contents

- [Getting Started](#getting-started)
- [Contribution Workflow](#contribution-workflow)
- [Code Style and Formatting](#code-style-and-formatting)
- [Testing Requirements](#testing-requirements)
- [Documentation Standards](#documentation-standards)
- [Branching and Pull Requests](#branching-and-pull-requests)
- [Issue and Feature Request Process](#issue-and-feature-request-process)
- [Community Conduct](#community-conduct)
- [References](#references)

## Getting Started

### Prerequisites

Before contributing, ensure your development environment meets these requirements:

**Required Software:**
- **Node.js 18.0.0 or higher** - [Download from nodejs.org](https://nodejs.org/)
- **npm 8.0.0 or higher** - Comes bundled with Node.js
- **Git version control** - For repository management

**Verify your installation:**
```bash
node --version  # Should show v18.0.0 or higher
npm --version   # Should show 8.0.0 or higher  
git --version   # Any recent version
```

**System Requirements:**
- RAM: 1GB minimum, 2GB recommended
- Storage: 500MB for dependencies and development files
- Internet connection for package installation

### Repository Setup

1. **Fork the repository** on GitHub to your personal account

2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/nodejs-hello-world-tutorial.git
   cd nodejs-hello-world-tutorial
   ```

3. **Navigate to the backend directory**:
   ```bash
   cd src/backend
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Verify the setup**:
   ```bash
   npm test          # Run test suite
   npm start         # Start the server
   curl http://localhost:3000/hello  # Test the endpoint
   ```

6. **Add upstream remote** (for syncing with the main repository):
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/nodejs-hello-world-tutorial.git
   ```

### Project Structure Overview

Understanding the project structure helps you navigate and contribute effectively:

```
src/backend/
├── app.js                    # Express application configuration
├── server.js                 # HTTP server startup and lifecycle
├── package.json              # Dependencies and scripts
├── routes/
│   ├── index.js             # Central router
│   └── hello.js             # Hello endpoint implementation
├── middleware/
│   ├── index.js             # Middleware exports
│   ├── errorHandler.js      # Error handling middleware
│   └── requestLogger.js     # Request logging middleware
├── utils/
│   ├── logger.js            # Centralized logging utility
│   └── errorTypes.js        # Custom error definitions
├── config/
│   ├── constants.js         # Application constants
│   └── env.js               # Environment configuration
├── healthcheck/
│   ├── index.js             # Health check exports
│   └── routes.js            # Health monitoring endpoint
└── scripts/
    ├── start.js             # Application startup script
    └── test.js              # Test execution script
```

## Contribution Workflow

Follow this step-by-step process for all contributions:

### 1. Sync Your Fork

Always start by syncing your fork with the upstream repository:

```bash
# Switch to main branch
git checkout main

# Pull latest changes from upstream
git pull upstream main

# Push updates to your fork
git push origin main
```

### 2. Create a Feature Branch

Create a descriptive branch name for your work:

```bash
# For new features
git checkout -b feature/add-middleware-logging

# For bug fixes
git checkout -b bugfix/fix-error-handling

# For documentation updates
git checkout -b docs/update-contributing-guide

# For test improvements
git checkout -b test/add-integration-tests
```

### 3. Make Your Changes

Follow the project's development standards:

- **Write clear, maintainable code** following existing patterns
- **Add or update tests** for any code changes
- **Update documentation** as needed
- **Follow the established code style** (see Code Style section)

### 4. Validate Your Changes

Before committing, ensure your changes meet quality standards:

```bash
# Run linting
npm run lint

# Auto-format code  
npm run format

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Verify the server starts successfully
npm start
```

### 5. Commit Your Changes

Write clear, descriptive commit messages:

```bash
# Stage your changes
git add .

# Commit with descriptive message
git commit -m "feat: add request logging middleware

- Implement requestLogger middleware for HTTP request tracking
- Add timestamps and request details to logs
- Include error boundary for logging failures
- Update middleware documentation
"
```

**Commit Message Format:**
```
type(scope): brief description

Detailed explanation of what changed and why.
Include any breaking changes or special considerations.

Closes #123
```

**Commit Types:**
- `feat`: New features
- `fix`: Bug fixes  
- `docs`: Documentation updates
- `test`: Test additions or fixes
- `refactor`: Code refactoring
- `style`: Code formatting changes
- `chore`: Maintenance tasks

### 6. Push and Create Pull Request

```bash
# Push your branch to your fork
git push origin feature/your-branch-name

# Create pull request on GitHub
# Use the pull request template and fill out all sections
```

### 7. Address Review Feedback

- Respond to code review comments promptly
- Make requested changes in additional commits
- Update your branch if the main branch advances
- Re-request review after addressing all feedback

### 8. Merge and Cleanup

After your PR is approved and merged:

```bash
# Switch back to main and sync
git checkout main
git pull upstream main

# Delete your feature branch
git branch -d feature/your-branch-name
git push origin --delete feature/your-branch-name
```

## Code Style and Formatting

We maintain consistent code style across the project using ESLint and Prettier.

### Style Guidelines

**JavaScript Standards:**
- Use **ES6+ features** (async/await, arrow functions, destructuring)
- Prefer **const** over let, avoid var
- Use **camelCase** for variables and functions
- Use **PascalCase** for classes and constructors
- Use **meaningful, descriptive names** for variables and functions

**Code Organization:**
- **Keep functions small and focused** (single responsibility)
- **Use consistent error handling patterns** (try/catch for async, error middleware for Express)
- **Write self-documenting code** with clear variable names
- **Add comments for complex logic**, not obvious code
- **Group related functionality** into modules

### Automated Style Enforcement

**Before submitting any changes:**

```bash
# Check for linting errors
npm run lint

# Auto-fix linting issues where possible
npm run lint -- --fix

# Format code using Prettier
npm run format
```

**ESLint Configuration:**
The project uses ESLint with these key rules:
- Airbnb base configuration
- ES6+ syntax enforcement
- Node.js specific rules
- Express.js best practices
- Security-focused linting

**Prettier Configuration:**
Consistent formatting with:
- 2-space indentation
- Single quotes for strings
- Semicolons required
- Trailing commas in multi-line structures

### Example Code Style

**Good:**
```javascript
const express = require('express');
const { logRequest } = require('../utils/logger');

const createHelloHandler = () => {
  return async (req, res, next) => {
    try {
      logRequest(req.method, req.path);
      res.status(200).send('Hello world');
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { createHelloHandler };
```

**Avoid:**
```javascript
var express=require('express')

function hello(req,res){
res.send("Hello world")
}
```

## Testing Requirements

All contributions must include appropriate tests. The project maintains high testing standards to ensure reliability and prevent regressions.

### Test Types and Requirements

**Unit Tests (Required):**
- Test individual functions and modules in isolation
- Mock external dependencies
- Achieve 90%+ line coverage for new code
- Place in `src/test/unit/`

**Integration Tests (Required for API changes):**
- Test HTTP endpoints using Supertest
- Verify request/response cycles
- Test middleware integration
- Place in `src/test/integration/`

**Performance Tests (Optional but recommended):**
- Validate response time targets (< 100ms for /hello)
- Monitor memory usage patterns
- Place in `src/test/performance/`

### Writing Tests

**Test Framework:** Jest with Supertest for HTTP testing

**Example Unit Test:**
```javascript
const { createHelloHandler } = require('../../routes/hello');

describe('Hello Handler', () => {
  it('should return Hello world message', async () => {
    const req = { method: 'GET', path: '/hello' };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const next = jest.fn();

    const handler = createHelloHandler();
    await handler(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('Hello world');
    expect(next).not.toHaveBeenCalled();
  });
});
```

**Example Integration Test:**
```javascript
const request = require('supertest');
const app = require('../../app');

describe('GET /hello', () => {
  it('should return 200 with Hello world message', async () => {
    const response = await request(app)
      .get('/hello')
      .expect(200)
      .expect('Content-Type', /text/);

    expect(response.text).toBe('Hello world');
  });

  it('should respond within 100ms', async () => {
    const start = Date.now();
    await request(app).get('/hello').expect(200);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(100);
  });
});
```

### Running Tests

**Essential test commands:**

```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit
npm run test:integration

# Run with coverage report
npm run test:coverage

# Run in watch mode during development
npm run test:watch

# Run specific test file
npx jest path/to/test/file.test.js
```

### Test Coverage Requirements

**Minimum Coverage Targets:**
- **Line Coverage:** 90%
- **Function Coverage:** 100%
- **Branch Coverage:** 80%
- **Statement Coverage:** 90%

**Coverage Reporting:**
- HTML reports generated in `coverage/` directory
- CI/CD integration for coverage tracking
- Pull requests must maintain or improve coverage

### Test Best Practices

**Writing Quality Tests:**
- Use **descriptive test names** that explain the expected behavior
- **Test both success and error cases**
- **Use appropriate assertions** (toBe, toEqual, toHaveBeenCalled, etc.)
- **Clean up resources** after tests (close servers, clear timers)
- **Keep tests isolated** - no dependencies between tests

**Test Organization:**
- **Group related tests** using `describe` blocks
- **Use `beforeEach`/`afterEach`** for common setup/teardown
- **Place test data** in `src/test/fixtures/`
- **Use test helpers** from `src/test/helpers/`

**Performance Testing:**
```javascript
describe('Performance Tests', () => {
  it('should handle concurrent requests efficiently', async () => {
    const promises = Array.from({ length: 10 }, () =>
      request(app).get('/hello').expect(200)
    );

    const start = Date.now();
    await Promise.all(promises);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(500); // All 10 requests in < 500ms
  });
});
```

## Documentation Standards

Clear, comprehensive documentation is essential for this educational project. All contributions must include appropriate documentation updates.

### Documentation Requirements

**For Code Changes:**
- Update inline comments for complex logic
- Add JSDoc comments for new functions/classes
- Update README files if functionality changes
- Include examples for new features

**For API Changes:**
- Document new endpoints in `docs/api-documentation.md`
- Update request/response examples
- Include error scenarios and status codes
- Add usage examples

**For Configuration Changes:**
- Update environment variable documentation
- Document new configuration options
- Update deployment guides if needed
- Include migration steps for breaking changes

### Documentation Types

**Inline Documentation:**
Use JSDoc for functions and classes:

```javascript
/**
 * Creates a middleware function for logging HTTP requests
 * @param {Object} options - Configuration options for the logger
 * @param {string} options.level - Log level (info, warn, error)
 * @param {boolean} options.includeBody - Whether to log request body
 * @returns {Function} Express middleware function
 * @example
 * app.use(createRequestLogger({ level: 'info', includeBody: false }));
 */
const createRequestLogger = (options = {}) => {
  // Implementation
};
```

**README Updates:**
Update relevant README files when making changes:
- `src/backend/README.md` - Main backend documentation
- `src/test/README.md` - Testing documentation
- `docs/getting-started.md` - Getting started guide
- `docs/api-documentation.md` - API reference

**API Documentation:**
Follow this format for new endpoints:

```markdown
### GET /new-endpoint

Description of what the endpoint does and its purpose.

**Request:**
```http
GET /new-endpoint HTTP/1.1
Host: localhost:3000
Content-Type: application/json
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Success response"
}
```

**Error Responses:**
- **400 Bad Request**: Invalid request parameters
- **500 Internal Server Error**: Server error occurred
```

### Documentation Style Guide

**Writing Style:**
- Use **clear, concise language** appropriate for developers
- **Write in present tense** ("The server starts" not "The server will start")
- **Use active voice** when possible
- **Include practical examples** for all instructions
- **Explain the "why" not just the "how"** for educational value

**Formatting Standards:**
- Use **Markdown** for all documentation files
- Include **code blocks** with syntax highlighting
- Use **tables** for structured information
- Add **links** to external resources and related docs
- Include **Table of Contents** for longer documents

**Code Examples:**
- **Show complete, working examples**
- **Include expected output** where relevant
- **Use realistic data** in examples
- **Explain complex examples** with comments

### Documentation Maintenance

**Review Process:**
- Documentation changes require review by the docs team
- Technical accuracy verified by backend team
- Style and clarity reviewed by documentation maintainers

**Version Control:**
- Keep documentation in sync with code changes
- Update documentation in the same PR as code changes
- Tag documentation versions for major releases

## Branching and Pull Requests

We use a feature branch workflow with specific conventions for branch naming and pull request management.

### Branching Strategy

**Main Branch:**
- `main` - Always deployable, production-ready code
- Protected branch requiring pull request reviews
- All commits must be via pull request
- Automatic CI/CD validation required

**Branch Naming Conventions:**
- `feature/short-description` - New features or enhancements
- `bugfix/short-description` - Bug fixes
- `docs/short-description` - Documentation updates  
- `test/short-description` - Test improvements
- `refactor/short-description` - Code refactoring
- `chore/short-description` - Maintenance tasks

**Examples:**
```bash
feature/add-cors-middleware
bugfix/fix-memory-leak
docs/update-api-documentation
test/add-health-check-tests
refactor/improve-error-handling
chore/update-dependencies
```

### Creating Pull Requests

**Before Opening a PR:**
1. **Sync your branch** with the latest main
2. **Run all tests** and ensure they pass
3. **Run linting and formatting** tools
4. **Update documentation** as needed
5. **Verify the application starts** successfully

**Pull Request Process:**

1. **Use the PR template** - Fill out all sections completely
2. **Write a clear title** that summarizes the change
3. **Provide detailed description** of what changed and why
4. **Link related issues** using "Closes #123" syntax
5. **Request appropriate reviewers** based on CODEOWNERS
6. **Assign labels** (bug, feature, documentation, etc.)

**Pull Request Template Sections:**
- **Description:** What the PR does and why
- **Related Issues:** Link to GitHub issues
- **Type of Change:** Bug fix, feature, docs, etc.
- **Testing:** How changes were validated
- **Code Quality Checklist:** Style, tests, documentation
- **Security Considerations:** Any security implications
- **Performance Impact:** Performance effects

### Code Review Process

**Review Assignment:**
Reviews are automatically assigned based on `.github/CODEOWNERS`:
- **Backend changes:** `@backend-team @lead-backend-dev`
- **Test changes:** `@qa-team @lead-backend-dev`
- **Documentation:** `@docs-team`
- **Infrastructure:** `@devops-team`

**Review Requirements:**
- **At least one approving review** from code owners
- **All automated checks** must pass (tests, linting, etc.)
- **No unresolved conversations** or change requests
- **Up-to-date with main branch** (no merge conflicts)

**Review Guidelines:**

**For Authors:**
- **Respond promptly** to review feedback
- **Make requested changes** in additional commits
- **Ask for clarification** if feedback is unclear
- **Update your branch** if main advances
- **Re-request review** after addressing feedback

**For Reviewers:**
- **Review within 48 hours** of assignment
- **Provide constructive feedback** with specific suggestions
- **Check for code quality, security, and performance**
- **Verify tests cover new functionality**
- **Ensure documentation is updated**
- **Test locally** for significant changes

**Review Checklist:**
- [ ] Code follows project style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated appropriately
- [ ] No security vulnerabilities introduced
- [ ] Performance impact is acceptable
- [ ] API contract is maintained
- [ ] Educational value is preserved

### Merge Process

**Merge Requirements:**
- All required reviews approved
- All automated checks passing
- Branch up-to-date with main
- No merge conflicts

**Merge Methods:**
- **Squash and merge** (preferred) - Combines commits into one
- **Merge commit** - Preserves individual commits
- **Rebase and merge** - Linear history without merge commit

**Post-Merge Cleanup:**
- Delete feature branch from remote
- Clean up local branches
- Sync your fork with upstream
- Close related issues if applicable

### Handling Merge Conflicts

When conflicts occur:

1. **Sync with upstream:**
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-feature-branch
   git merge main
   ```

2. **Resolve conflicts manually:**
   - Edit conflicted files
   - Remove conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)
   - Test that everything still works

3. **Commit the resolution:**
   ```bash
   git add .
   git commit -m "resolve merge conflicts with main"
   git push origin your-feature-branch
   ```

## Issue and Feature Request Process

We use GitHub Issues for bug reports, feature requests, and project discussions. Follow our templates and guidelines for effective issue management.

### Reporting Bugs

**Before Creating a Bug Report:**
1. **Search existing issues** to avoid duplicates
2. **Try the latest version** to see if it's already fixed
3. **Gather reproduction steps** and environment details
4. **Test with minimal configuration** to isolate the issue

**Bug Report Template:**
Use the bug report template (`.github/ISSUE_TEMPLATE/bug_report.md`) and include:

- **Clear, descriptive title**
- **Detailed description** of the bug
- **Steps to reproduce** the issue
- **Expected vs. actual behavior**
- **Environment information** (OS, Node.js version, npm version)
- **Additional context** (logs, screenshots, error messages)

**Example Bug Report:**
```markdown
Title: Server crashes on startup with Node.js v19.0.0

## Describe the bug
The Express server fails to start when using Node.js v19.0.0, throwing an error about incompatible module imports.

## Steps to reproduce
1. Install Node.js v19.0.0
2. Run `npm install` in src/backend/
3. Execute `npm start`
4. Server crashes with module error

## Expected behavior
Server should start successfully and listen on port 3000

## Actual behavior
Process exits with error: "Cannot resolve module 'express'"

## Environment
- OS: macOS 13.1
- Node.js: v19.0.0
- npm: 8.19.2
- Express: 5.1.0

## Additional context
Error logs attached. Issue doesn't occur with Node.js v18.x.
```

### Requesting Features

**Before Creating a Feature Request:**
1. **Check existing feature requests** for similar ideas
2. **Consider the educational scope** of the project
3. **Think about implementation complexity**
4. **Gather use cases** and examples

**Feature Request Template:**
Use the feature request template (`.github/ISSUE_TEMPLATE/feature_request.md`) and include:

- **Clear feature description**
- **Problem it solves**
- **Proposed solution**
- **Alternative approaches considered**
- **Additional context** and use cases

**Feature Request Guidelines:**
- **Keep requests focused** on single features
- **Provide educational justification** for tutorial value
- **Consider backward compatibility**
- **Include implementation suggestions** if you have them
- **Be open to alternative solutions**

**Example Feature Request:**
```markdown
Title: Add CORS middleware for cross-origin requests

## Feature Description
Add configurable CORS (Cross-Origin Resource Sharing) middleware to enable cross-origin requests from web browsers.

## Is your feature request related to a problem?
Yes, developers following the tutorial can't make requests from frontend applications running on different ports (e.g., React dev server on port 3001).

## Describe the solution you'd like
- Add CORS middleware using the 'cors' package
- Make it configurable via environment variables
- Include educational documentation about CORS
- Add tests for CORS functionality

## Describe alternatives you've considered
- Manual CORS headers in each route (more complex)
- Custom CORS middleware (reinventing the wheel)
- Documentation-only solution (doesn't solve the problem)

## Additional context
This would help developers understand:
- How to handle cross-origin requests
- Middleware configuration patterns
- Security considerations for CORS
```

### Issue Lifecycle

**Issue States:**
- **Open** - New issue awaiting triage
- **In Progress** - Someone is actively working on it
- **Needs Info** - Waiting for additional information
- **Blocked** - Waiting on external dependencies
- **Closed** - Issue resolved or won't fix

**Issue Labels:**
- **Type:** `bug`, `feature`, `documentation`, `question`
- **Priority:** `high`, `medium`, `low`
- **Status:** `needs-triage`, `in-progress`, `blocked`
- **Area:** `backend`, `tests`, `docs`, `infrastructure`

**Triage Process:**
1. **Initial review** within 48 hours
2. **Label assignment** by maintainers
3. **Priority assessment** based on impact
4. **Assignment** to appropriate team member
5. **Status updates** as work progresses

### Contributing to Issue Resolution

**Finding Issues to Work On:**
- Look for issues labeled `good first issue`
- Check `help wanted` label for contribution opportunities
- Browse issues in your area of expertise
- Ask maintainers about priority issues

**Working on Issues:**
1. **Comment on the issue** to express interest
2. **Get assigned** by a maintainer
3. **Ask questions** if requirements are unclear
4. **Provide status updates** on progress
5. **Link your PR** to the issue when ready

**Issue Etiquette:**
- **Be respectful** in all communications
- **Provide constructive feedback** on proposed solutions
- **Stay on topic** and avoid thread hijacking
- **Use GitHub reactions** instead of "+1" comments
- **Follow up** on your own issues with additional info

## Community Conduct

We are committed to providing a welcoming, inclusive, and harassment-free experience for everyone who participates in our project community.

### Our Standards

**Expected Behavior:**
- **Be respectful and inclusive** in all communications
- **Use welcoming and constructive language**
- **Be collaborative** and help others learn
- **Focus on what's best for the community**
- **Show empathy** towards other community members
- **Give credit** where credit is due

**Unacceptable Behavior:**
- Harassment, discrimination, or bullying of any kind
- Personal attacks or inflammatory language
- Trolling, spamming, or derailing discussions
- Publishing private information without consent
- Any behavior that makes others feel unwelcome

### Communication Guidelines

**Code Reviews:**
- **Focus on the code, not the person** writing it
- **Provide specific, actionable feedback**
- **Explain the reasoning** behind suggestions
- **Be open to different approaches**
- **Acknowledge good work** and improvements

**Issue Discussions:**
- **Stay on topic** and keep discussions relevant
- **Be patient** with newcomers and different skill levels
- **Provide helpful context** and examples
- **Search existing discussions** before asking questions
- **Use appropriate issue labels** and formatting

**General Communication:**
- **Be professional** in all project communications
- **Assume positive intent** from other contributors
- **Ask for clarification** when things are unclear
- **Share knowledge** and help others learn
- **Celebrate contributions** from all community members

### Mentorship and Learning

**For New Contributors:**
- **Don't be afraid to ask questions** - everyone was new once
- **Start with small contributions** to learn the workflow
- **Read existing code** to understand patterns
- **Follow established conventions** and guidelines
- **Ask for help** when you're stuck

**For Experienced Contributors:**
- **Welcome new contributors** and help them get started
- **Provide mentorship** and guidance when possible
- **Share knowledge** through code reviews and discussions
- **Be patient with learning processes**
- **Recognize that teaching benefits everyone**

### Enforcement

**Reporting Issues:**
If you experience or witness unacceptable behavior:
1. **Document the incident** with screenshots or links
2. **Report to project maintainers** via email or private message
3. **Provide context** and specific examples
4. **Suggest appropriate actions** if you have ideas

**Response Process:**
- Reports will be reviewed promptly and confidentially
- Appropriate action will be taken based on severity
- All parties will be kept informed of decisions
- Appeals process is available for disputed actions

### Recognition

**Contributor Recognition:**
- Contributors are acknowledged in release notes
- Significant contributions highlighted in documentation
- Regular contributors may be invited to join teams
- Community contributions celebrated publicly

**Ways to Contribute Beyond Code:**
- **Answer questions** in issues and discussions
- **Improve documentation** and tutorials
- **Test and report bugs** with detailed information
- **Share the project** with others who might benefit
- **Provide feedback** on proposed changes

## References

### Project Documentation

**Getting Started:**
- [Getting Started Guide](getting-started.md) - Setup and installation instructions
- [Backend README](../src/backend/README.md) - Main backend documentation
- [API Documentation](api-documentation.md) - Endpoint specifications
- [Deployment Guide](deployment-guide.md) - Production deployment instructions

**Development Resources:**
- [Test Documentation](../src/test/README.md) - Testing guidelines and structure
- [Package.json Scripts](../src/backend/package.json) - Available development commands
- [Environment Configuration](../src/backend/.env.example) - Configuration options

### GitHub Templates and Workflows

**Issue Templates:**
- [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md) - For reporting bugs
- [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md) - For suggesting features

**Pull Request Process:**
- [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md) - PR submission guidelines
- [Code Owners](.github/CODEOWNERS) - Review assignment rules

### External Resources

**Technology Documentation:**
- [Node.js Documentation](https://nodejs.org/docs/) - Runtime environment reference
- [Express.js Guide](https://expressjs.com/en/guide/) - Web framework documentation
- [Jest Testing Framework](https://jestjs.io/docs/) - JavaScript testing framework
- [Supertest Documentation](https://github.com/visionmedia/supertest) - HTTP testing library

**Best Practices:**
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices) - Community guidelines
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html) - Security guidelines
- [JavaScript Style Guide](https://github.com/airbnb/javascript) - Code style reference

**Development Tools:**
- [ESLint Configuration](https://eslint.org/docs/rules/) - Linting rules reference
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html) - Code formatting options
- [npm Scripts Documentation](https://docs.npmjs.com/cli/v8/using-npm/scripts) - Package.json scripts

### Getting Help

**Community Support:**
- **GitHub Issues** - For bugs, feature requests, and project questions
- **GitHub Discussions** - For general questions and community discussion
- **Code Reviews** - Learn from feedback on your contributions

**Educational Resources:**
- **Inline Documentation** - JSDoc comments and code examples
- **README Files** - Comprehensive setup and usage guides
- **Test Examples** - Practical examples of testing patterns

**Contact Information:**
- **Security Issues** - Report privately to maintainers
- **General Questions** - Use GitHub Issues with question label
- **Contribution Ideas** - Discuss in GitHub Issues or Discussions

---

## Thank You

Thank you for your interest in contributing to the Node.js Hello World Tutorial Backend! Your contributions help make this educational resource better for developers learning Node.js and Express.js fundamentals.

Whether you're fixing a typo, adding a feature, improving tests, or enhancing documentation, every contribution makes a difference. We appreciate your time, effort, and expertise in helping us create a high-quality learning resource.

**Happy coding!** 🚀

---

*This contributing guide is a living document that evolves with the project. If you have suggestions for improvements, please open an issue or submit a pull request.*