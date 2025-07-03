# Contributing to Node.js Hello World Tutorial Backend

Welcome to the Node.js/Express.js Hello World tutorial backend project! We're excited that you want to contribute to this educational resource. This guide provides everything you need to know to make high-quality contributions that help others learn Node.js and Express.js fundamentals.

## Table of Contents

1. [Introduction](#introduction)
2. [Contribution Workflow](#contribution-workflow)
3. [Code Style and Formatting](#code-style-and-formatting)
4. [Testing Requirements](#testing-requirements)
5. [Documentation Standards](#documentation-standards)
6. [Branching and Pull Requests](#branching-and-pull-requests)
7. [Issue and Feature Request Process](#issue-and-feature-request-process)
8. [Community Conduct](#community-conduct)
9. [References](#references)

## Introduction

This Node.js/Express.js tutorial backend serves as an educational foundation for learning modern web server development. Our contribution guidelines ensure that all additions maintain the project's educational value while demonstrating industry-standard practices.

### Project Overview

- **Purpose**: Educational demonstration of Node.js/Express.js fundamentals
- **Technology Stack**: Node.js 18+, Express.js 5.1.0, Jest, ESLint, Prettier
- **Architecture**: Single `/hello` endpoint with comprehensive error handling and monitoring
- **Target Audience**: Developers learning Node.js and Express.js concepts

### Contributing Philosophy

We welcome contributions that:
- Enhance educational value and clarity
- Demonstrate Node.js/Express.js best practices
- Maintain code quality and test coverage
- Follow security and performance guidelines
- Improve documentation and accessibility

## Contribution Workflow

Follow this end-to-end workflow for contributing code, documentation, or tests to the project.

### Step 1: Fork and Clone

Fork the repository and create your local development environment:

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/your-username/nodejs-hello-world-tutorial-backend.git
cd nodejs-hello-world-tutorial-backend

# Add upstream remote for syncing
git remote add upstream https://github.com/original-repo/nodejs-hello-world-tutorial-backend.git
```

### Step 2: Environment Setup

Set up your development environment with the required tools:

```bash
# Verify Node.js version (18.0.0 or higher required)
node --version

# Verify npm version (8.0.0 or higher required)
npm --version

# Navigate to backend directory and install dependencies
cd src/backend
npm install

# Verify installation
npm run validate
```

### Step 3: Create Feature Branch

Create a new branch from main for your changes:

```bash
# Sync your fork with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch with descriptive name
git checkout -b feature/add-error-handling
# or
git checkout -b bugfix/fix-health-endpoint
# or  
git checkout -b docs/update-api-documentation
```

### Step 4: Make Your Changes

Implement your changes following project standards:

```bash
# Make code changes
# Edit files in src/backend/ directory

# Run linting and formatting
npm run lint:fix
npm run format

# Run tests to ensure nothing breaks
npm test

# Add new tests for your changes
# Edit files in src/test/ directory
```

### Step 5: Test Your Changes

Ensure all tests pass and coverage requirements are met:

```bash
# Run complete test suite
npm test

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:coverage

# Verify code coverage meets requirements (90%+ lines, 80%+ branches)
# Check coverage/index.html for detailed report
```

### Step 6: Update Documentation

Update relevant documentation for your changes:

```bash
# Update API documentation if endpoints changed
vim docs/api-documentation.md

# Update README if setup or usage changed
vim src/backend/README.md

# Update deployment guide if infrastructure changed
vim docs/deployment-guide.md

# Update getting started guide if setup process changed
vim docs/getting-started.md
```

### Step 7: Commit Your Changes

Create meaningful commits with clear messages:

```bash
# Stage your changes
git add .

# Commit with descriptive message following conventional commits
git commit -m "feat: add request timeout configuration

- Add configurable request timeout middleware
- Update environment configuration documentation
- Add timeout tests in integration test suite
- Resolves #123"
```

### Step 8: Open Pull Request

Submit your changes for review:

```bash
# Push your branch to your fork
git push origin feature/add-error-handling

# Open pull request on GitHub
# Use the provided PR template
# Fill out all required sections
# Link related issues
```

### Step 9: Address Review Feedback

Collaborate with reviewers to refine your contribution:

```bash
# Make requested changes
# Commit additional fixes
git commit -m "fix: address code review feedback"

# Push updates to your branch
git push origin feature/add-error-handling

# Pull request will automatically update
```

### Step 10: Merge and Cleanup

After approval and successful CI checks:

```bash
# Maintainers will merge your PR
# Clean up your local branches after merge
git checkout main
git pull upstream main
git branch -d feature/add-error-handling
```

## Code Style and Formatting

Maintain consistent code style across the project using automated tools and established conventions.

### ESLint Configuration

The project uses ESLint with the following key rules:

```bash
# Run linting
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# ESLint configuration highlights:
# - eslint:recommended base rules
# - Node.js specific rules
# - Prettier integration
# - Import order enforcement
```

**Key ESLint Rules:**
- `no-console: "warn"` - Minimize console.log usage
- `no-unused-vars: "error"` - Remove unused variables
- `prefer-const: "error"` - Use const for immutable variables
- `no-var: "error"` - Use let/const instead of var

### Prettier Formatting

Code formatting is handled automatically by Prettier:

```bash
# Format all files
npm run format

# Check formatting without making changes
npm run format:check

# Prettier configuration:
# - Single quotes preferred
# - Semicolons required
# - 2-space indentation
# - 100 character line width
```

### Code Style Guidelines

Follow these conventions for maintainable, educational code:

**Variable and Function Naming:**
```javascript
// Use descriptive, camelCase names
const serverPort = process.env.PORT || 3000;
const requestLogger = require('./middleware/requestLogger');

// Function names should describe actions
function validateRequestParameters(req) {
  // Implementation
}

// Constants should be UPPER_CASE
const DEFAULT_TIMEOUT = 30000;
const API_VERSION = '1.0.0';
```

**Error Handling:**
```javascript
// Use consistent error handling patterns
app.get('/hello', async (req, res, next) => {
  try {
    // Endpoint logic
    res.send('Hello world');
  } catch (error) {
    // Pass errors to error handler middleware
    next(error);
  }
});
```

**Comments and Documentation:**
```javascript
/**
 * Express route handler for the hello endpoint
 * Demonstrates basic HTTP GET request handling
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
function helloHandler(req, res) {
  // Send static response as plain text
  res.send('Hello world');
}
```

### Pre-commit Quality Checks

Run these checks before committing:

```bash
# Complete quality check sequence
npm run lint
npm run format:check
npm test
npm run validate

# Fix any issues before committing
npm run lint:fix
npm run format
```

## Testing Requirements

All contributions must include appropriate tests and maintain code coverage requirements.

### Testing Framework

The project uses Jest with Supertest for comprehensive testing:

```bash
# Test dependencies (from package.json):
# - jest: ^29.7.0 (testing framework)
# - supertest: ^7.1.1 (HTTP testing)
# - cross-env: ^7.0.3 (environment variables)
```

### Test Types and Requirements

#### Unit Tests
Test individual functions and modules in isolation:

```javascript
// Example: src/test/unit/hello.test.js
const request = require('supertest');
const { app } = require('../../app');

describe('Hello Endpoint', () => {
  it('should return Hello world text', async () => {
    const response = await request(app)
      .get('/hello')
      .expect(200)
      .expect('Content-Type', /text/);
    
    expect(response.text).toBe('Hello world');
  });

  it('should reject POST requests with 405', async () => {
    await request(app)
      .post('/hello')
      .expect(405);
  });
});
```

#### Integration Tests
Test complete request-response cycles and middleware integration:

```javascript
// Example: src/test/integration/server.test.js
const request = require('supertest');
const { app } = require('../../app');

describe('Server Integration', () => {
  it('should handle complete request cycle', async () => {
    const response = await request(app)
      .get('/hello')
      .set('Accept', 'text/plain')
      .expect(200);
    
    expect(response.text).toBe('Hello world');
    expect(response.headers['content-type']).toMatch(/text\/plain/);
  });
});
```

### Test Coverage Requirements

Maintain high test coverage with meaningful assertions:

**Coverage Targets:**
- **Lines**: 90%+
- **Functions**: 90%+
- **Branches**: 80%+
- **Statements**: 90%+

```bash
# Generate coverage report
npm run test:coverage

# View detailed HTML report
open coverage/index.html

# Coverage configuration in jest.config.js
{
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 90,
      "lines": 90,
      "statements": 90
    }
  }
}
```

### Test Writing Guidelines

**Test Structure:**
```javascript
describe('Feature or Component', () => {
  // Setup before each test
  beforeEach(() => {
    // Initialize test environment
  });

  // Cleanup after each test
  afterEach(() => {
    // Clean up resources
  });

  it('should describe expected behavior clearly', async () => {
    // Arrange: Set up test data and conditions
    const testData = { /* test data */ };
    
    // Act: Execute the code under test
    const result = await functionUnderTest(testData);
    
    // Assert: Verify expected outcomes
    expect(result).toBe(expectedValue);
  });
});
```

**Testing Best Practices:**
- Write descriptive test names that explain the expected behavior
- Test both success and error scenarios
- Use async/await for asynchronous operations
- Include performance assertions for critical endpoints
- Test edge cases and boundary conditions

### Running Tests

```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit
npm run test:integration

# Run tests in watch mode during development
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI/CD
npm run test:ci
```

## Documentation Standards

Maintain comprehensive, clear documentation for all code, API, and user-facing changes.

### Documentation Types

#### Code Documentation
Document functions, modules, and complex logic:

```javascript
/**
 * Configures Express application with middleware and routes
 * Demonstrates standard Express.js application setup patterns
 * @returns {Express.Application} Configured Express application
 */
function createApp() {
  const app = express();
  
  // Request logging middleware for development visibility
  app.use(requestLogger);
  
  // JSON body parsing for API requests
  app.use(express.json());
  
  return app;
}
```

#### API Documentation
Update API documentation for endpoint changes:

```markdown
<!-- docs/api-documentation.md -->
### GET /hello

Returns a simple "Hello world" message.

**Request:**
- Method: GET
- URL: `/hello`
- Headers: None required

**Response:**
- Status: 200 OK
- Content-Type: `text/plain; charset=utf-8`
- Body: `Hello world`
```

#### README Updates
Update relevant README files for setup or usage changes:

- **Main README**: Overall project description and setup
- **Backend README**: Backend-specific documentation
- **Getting Started Guide**: Setup and onboarding instructions

### Documentation Guidelines

**Writing Style:**
- Use clear, concise language
- Include practical examples
- Provide step-by-step instructions
- Use consistent formatting and structure

**Code Examples:**
- Include complete, runnable examples
- Show both successful and error scenarios
- Use realistic data and parameters
- Explain complex code sections with comments

**Link Management:**
- Use relative links between documentation files
- Keep external links current and relevant
- Cross-reference related documentation sections

### Documentation Checklist

Before submitting changes, verify:

- [ ] Code includes appropriate comments for complex logic
- [ ] Public functions have JSDoc documentation
- [ ] API changes are reflected in docs/api-documentation.md
- [ ] Setup changes are updated in docs/getting-started.md
- [ ] Configuration changes are documented
- [ ] Examples are tested and working

## Branching and Pull Requests

Follow structured branching strategy and pull request process for organized development.

### Branching Strategy

Create feature branches from main using descriptive naming conventions:

**Branch Naming:**
- `feature/short-description` - New features
- `bugfix/short-description` - Bug fixes
- `docs/short-description` - Documentation updates
- `refactor/short-description` - Code refactoring
- `test/short-description` - Test improvements

**Examples:**
```bash
git checkout -b feature/add-cors-middleware
git checkout -b bugfix/fix-health-endpoint-timeout
git checkout -b docs/update-deployment-guide
git checkout -b refactor/extract-error-handlers
```

### Keeping Branches Updated

Regularly sync your branch with main to avoid merge conflicts:

```bash
# Fetch latest changes from upstream
git fetch upstream

# Rebase your feature branch on latest main
git checkout feature/your-feature
git rebase upstream/main

# Or merge if rebase is not appropriate
git merge upstream/main

# Push updated branch
git push origin feature/your-feature --force-with-lease
```

### Pull Request Process

#### Creating Pull Requests

Use the provided PR template and fill out all required sections:

```markdown
# Pull Request Title: Clear description of changes

## Description
- Detailed explanation of changes made
- Motivation and context for the changes
- Technical approach and implementation details

## Related Issue(s)
- Closes #123
- Relates to #456

## Type of Change
- [x] Bug fix
- [x] New feature
- [ ] Breaking change
- [x] Documentation update

## Testing
- [x] Unit tests added/updated
- [x] Integration tests pass
- [x] Manual testing completed
- [x] Coverage requirements met
```

#### Pull Request Requirements

**Before submitting:**
- [ ] All tests pass locally
- [ ] Code follows style guidelines
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] Branch is up to date with main

**Code Quality:**
- [ ] ESLint passes without errors
- [ ] Prettier formatting applied
- [ ] Test coverage meets requirements (90%+ lines)
- [ ] No console.log statements in production code

**Performance:**
- [ ] Hello endpoint responds in <100ms
- [ ] Memory usage remains stable
- [ ] No performance regressions introduced

### Code Review Process

#### For Contributors

**Requesting Reviews:**
- Assign reviewers based on CODEOWNERS file
- Request review from relevant team members
- Provide context for complex changes
- Respond promptly to feedback

**Addressing Feedback:**
```bash
# Make requested changes
git add .
git commit -m "fix: address review feedback - improve error handling"

# Push updates (PR will automatically update)
git push origin feature/your-feature

# Add reply comments explaining changes made
```

#### Code Owner Responsibilities

Based on `.github/CODEOWNERS`, the following teams review changes:

- **Backend Code** (`/src/backend/`): @backend-team @lead-backend-dev
- **Tests** (`/src/test/`): @qa-team @lead-backend-dev  
- **Infrastructure** (`/infrastructure/`): @devops-team
- **Documentation** (`/docs/`): @docs-team

### Merge Requirements

Pull requests require:
- [ ] Approval from code owners
- [ ] All CI checks passing
- [ ] Up-to-date with main branch
- [ ] No merge conflicts
- [ ] Required reviews completed

**Automated Checks:**
- ESLint validation
- Test suite execution
- Code coverage verification
- Security vulnerability scan

## Issue and Feature Request Process

Use standardized templates and processes for reporting bugs and requesting features.

### Bug Reports

Report bugs using the provided bug report template:

**Required Information:**
- Clear description of the bug
- Steps to reproduce the issue
- Expected vs. actual behavior
- Environment details (OS, Node.js version, npm version)
- Error messages or logs
- Screenshots if applicable

**Example Bug Report:**
```markdown
## Describe the bug
The /hello endpoint returns 500 error instead of "Hello world" when NODE_ENV=production

## Steps to reproduce
1. Set NODE_ENV=production
2. Start server with npm start
3. Send GET request to /hello endpoint
4. Receive 500 Internal Server Error

## Expected behavior
Should return 200 OK with "Hello world" text

## Environment
- OS: Ubuntu 20.04
- Node.js version: 18.17.0
- npm version: 9.6.7
- Express.js version: 5.1.0
```

### Feature Requests

Submit feature requests using the provided template:

**Required Information:**
- Clear description of the proposed feature
- Problem the feature would solve
- Detailed solution description
- Alternative approaches considered
- Additional context or examples

**Example Feature Request:**
```markdown
## Feature Description
Add request logging middleware to track API usage and performance

## Problem
Currently difficult to monitor API usage patterns and debug performance issues

## Proposed Solution
Implement structured logging middleware that captures:
- Request method, URL, and headers
- Response status and processing time
- User agent and IP address (if applicable)
- Timestamp and unique request ID

## Educational Value
Demonstrates logging best practices for Node.js applications
```

### Issue Triage and Labels

Issues are categorized using labels:

**Priority Labels:**
- `priority: high` - Critical bugs or important features
- `priority: medium` - Standard improvements
- `priority: low` - Nice-to-have enhancements

**Type Labels:**
- `bug` - Bug reports and fixes
- `enhancement` - New features and improvements
- `documentation` - Documentation updates
- `question` - Questions and support requests

**Status Labels:**
- `status: triage` - Needs initial review
- `status: in-progress` - Being actively worked on
- `status: blocked` - Waiting on external dependencies
- `status: needs-info` - Requires additional information

### Issue Lifecycle

1. **Submission**: Issue created using appropriate template
2. **Triage**: Maintainers review and assign labels
3. **Assignment**: Issue assigned to contributor or team
4. **Development**: Work begins on solution
5. **Review**: Pull request submitted and reviewed
6. **Resolution**: Changes merged and issue closed

### Contributing to Issue Resolution

**Finding Issues to Work On:**
- Look for `good first issue` label for newcomers
- Check `help wanted` label for community contributions
- Review `status: triage` issues for new opportunities

**Claiming Issues:**
- Comment on the issue expressing interest
- Wait for maintainer assignment confirmation
- Ask questions if requirements are unclear

## Community Conduct

Maintain a welcoming, inclusive environment for all contributors.

### Code of Conduct

**Our Standards:**
- Be respectful and constructive in all communications
- Welcome newcomers and help them learn
- Focus on what is best for the community and educational goals
- Show empathy towards other community members
- Accept constructive criticism gracefully

**Unacceptable Behavior:**
- Harassment, discrimination, or offensive language
- Personal attacks or trolling
- Publishing private information without consent
- Spamming or excessive self-promotion
- Any conduct that would be inappropriate in a professional setting

### Communication Guidelines

**In Issues and Pull Requests:**
- Provide clear, detailed descriptions
- Be patient when waiting for responses
- Acknowledge and thank contributors for their time
- Offer constructive feedback and suggestions

**In Code Reviews:**
- Focus on the code, not the person
- Explain the reasoning behind feedback
- Suggest specific improvements when possible
- Recognize good work and improvements

### Getting Help

**For Questions:**
- Check existing documentation first
- Search closed issues for similar questions
- Create new issue with `question` label
- Be specific about what you're trying to achieve

**For Support:**
- Refer to the getting started guide
- Check troubleshooting sections in documentation
- Provide environment details when asking for help
- Share relevant error messages or logs

### Reporting Issues

**Code of Conduct Violations:**
- Contact maintainers directly for serious violations
- Include specific details about the incident
- Provide evidence if available (screenshots, links)
- Respect privacy of all parties involved

**Technical Issues:**
- Use appropriate issue templates
- Provide complete reproduction steps
- Include environment and version information
- Attach relevant logs or error messages

### Recognition

We value all contributions to the project:

**Types of Contributions Recognized:**
- Code contributions (features, bug fixes, refactoring)
- Documentation improvements
- Test coverage additions
- Issue reporting and triage
- Community support and mentoring
- Translation and accessibility improvements

**Recognition Methods:**
- Contributor mentions in release notes
- Special recognition for significant contributions
- Community highlighting of helpful members
- Contribution statistics in project documentation

## References

Additional resources and links to related documentation.

### Project Documentation

- **[Getting Started Guide](./getting-started.md)**: Complete setup and onboarding instructions
- **[API Documentation](./api-documentation.md)**: Comprehensive endpoint reference and examples
- **[Deployment Guide](./deployment-guide.md)**: Local, Docker, and cloud deployment instructions
- **[Backend README](../src/backend/README.md)**: Backend-specific documentation and architecture

### GitHub Templates and Processes

- **[Pull Request Template](../.github/PULL_REQUEST_TEMPLATE.md)**: Standardized PR submission format
- **[Bug Report Template](../.github/ISSUE_TEMPLATE/bug_report.md)**: Bug reporting guidelines
- **[Feature Request Template](../.github/ISSUE_TEMPLATE/feature_request.md)**: Feature proposal format
- **[Code Owners](../.github/CODEOWNERS)**: Code review and approval responsibilities

### Technical References

#### Node.js and Express.js

- **[Node.js Documentation](https://nodejs.org/docs/)**: Official Node.js API and guides
- **[Express.js Documentation](https://expressjs.com/)**: Express.js framework reference
- **[Express.js 5.x Migration Guide](https://expressjs.com/en/guide/migrating-5.html)**: Upgrading to Express 5.x
- **[Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)**: Community best practices guide

#### Testing and Quality

- **[Jest Documentation](https://jestjs.io/)**: Testing framework reference and examples
- **[Supertest Documentation](https://github.com/visionmedia/supertest)**: HTTP testing library
- **[ESLint Documentation](https://eslint.org/)**: Linting configuration and rules
- **[Prettier Documentation](https://prettier.io/)**: Code formatting configuration

#### Development Tools

- **[npm Documentation](https://docs.npmjs.com/)**: Package manager reference
- **[Git Documentation](https://git-scm.com/doc)**: Version control system guide
- **[GitHub Flow](https://guides.github.com/introduction/flow/)**: Git workflow best practices

### Educational Resources

- **[The Node.js Event Loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)**: Understanding Node.js asynchronous architecture
- **[Express.js Middleware Guide](https://expressjs.com/en/guide/using-middleware.html)**: Middleware patterns and best practices
- **[HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)**: HTTP response status reference
- **[REST API Design Best Practices](https://restfulapi.net/)**: RESTful API design principles

### Community Resources

- **[Node.js Community](https://nodejs.org/en/community/)**: Official Node.js community hub
- **[Express.js Community](https://expressjs.com/en/resources/community.html)**: Express.js community resources
- **[GitHub Community Guidelines](https://docs.github.com/en/github/site-policy/github-community-guidelines)**: Platform community standards

---

**Contributing Guide Version**: 1.0.0  
**Last Updated**: 2024-01-01  
**Compatibility**: Node.js 18+, Express.js 5.1.0

Thank you for contributing to the Node.js Hello World Tutorial Backend! Your contributions help create a valuable educational resource for the Node.js community. For additional questions or support, please open an issue or reach out to the maintainers.

**Happy Contributing!** 🚀