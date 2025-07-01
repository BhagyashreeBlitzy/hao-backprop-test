# Contributing to Node.js Hello World Tutorial

Thank you for your interest in contributing to the Node.js Hello World tutorial application! This project serves as an educational demonstration of fundamental HTTP server concepts using Node.js and Express.js. We welcome contributions that help improve the learning experience for developers new to web development.

## 1. Introduction

This Node.js tutorial application demonstrates core web server implementation using Express.js 5.1.0 and Node.js 22.x LTS. The application features a single `/hello` endpoint that returns "Hello world" to demonstrate fundamental request-response patterns in web development.

**Project Goals:**
- Provide clear, educational examples of Node.js and Express.js fundamentals
- Maintain simplicity while following industry best practices
- Serve as a foundation for more complex web development concepts
- Foster inclusive, collaborative learning environment

**Key Technologies:**
- **Runtime:** Node.js 22.x LTS (requires Node.js 18+)
- **Framework:** Express.js 5.1.0 (latest stable release)
- **Package Manager:** npm 11.4.2+
- **Testing:** Jest 29.7.0+ with Supertest 7.1.1+

## 2. How to Contribute

### 2.1 Reporting Bugs

Found a bug? Help us improve the tutorial by reporting it properly:

#### Bug Report Process:
1. **Search existing issues** to avoid duplicates
2. **Use the bug report template** when creating new issues
3. **Provide detailed information** including:
   - Steps to reproduce the issue
   - Expected vs actual behavior
   - Environment details (Node.js version, OS, npm version)
   - Error messages or stack traces
   - Screenshots if applicable

#### Issue Template Requirements:
- **Title:** Clear, descriptive summary of the bug
- **Description:** Detailed explanation of the issue
- **Steps to Reproduce:** Numbered list of exact steps
- **Expected Behavior:** What should happen
- **Actual Behavior:** What actually happens
- **Environment:** Node.js version, npm version, OS
- **Additional Context:** Any other relevant information

### 2.2 Requesting Features

We welcome feature requests that enhance the educational value of the tutorial:

#### Feature Request Guidelines:
1. **Check existing issues** for similar requests
2. **Use the feature request template**
3. **Explain the educational benefit** of the proposed feature
4. **Consider the project scope** - features should align with tutorial objectives
5. **Provide implementation suggestions** if possible

#### Feature Evaluation Criteria:
- **Educational Value:** Does it help learners understand key concepts?
- **Simplicity:** Does it maintain the tutorial's approachable nature?
- **Scope Alignment:** Does it fit within the project's educational goals?
- **Maintenance Overhead:** Can it be maintained long-term?

### 2.3 Submitting Code Changes

#### Prerequisites:
- Fork the repository and clone it locally
- Install Node.js 18+ (recommended: Node.js 22.x LTS)
- Install dependencies: `npm install`
- Verify setup: `npm test`

#### Development Setup:
```bash
# Clone your fork
git clone https://github.com/your-username/nodejs-hello-world.git
cd nodejs-hello-world

# Install dependencies
npm install

# Run tests to verify setup
npm test

# Start development server
npm start
```

## 3. Code Style Guide

### 3.1 JavaScript Style Standards

**ESLint Configuration:**
- Follow the project's `.eslintrc.js` configuration
- Use 2-space indentation
- Single quotes for strings
- Trailing commas where possible
- Semicolons required

**Prettier Configuration:**
- Follow the project's `.prettierrc.js` configuration
- Automatic formatting on save recommended
- Run `npm run format` before committing

#### Code Style Examples:
```javascript
// ✅ Good
const express = require('express');
const app = express();

app.get('/hello', (req, res) => {
  res.send('Hello world');
});

// ❌ Bad
const express = require("express")
const app = express()

app.get("/hello", function(req, res) {
    res.send("Hello world")
})
```

### 3.2 Documentation Standards

**Comments:**
- Use JSDoc format for function documentation
- Explain complex logic with inline comments
- Keep comments concise and relevant
- Update comments when code changes

**README Updates:**
- Update README.md for user-facing changes
- Include examples for new features
- Maintain consistency with existing documentation

#### Documentation Examples:
```javascript
/**
 * Handles GET requests to the /hello endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
app.get('/hello', (req, res) => {
  // Return static "Hello world" message for educational demonstration
  res.send('Hello world');
});
```

### 3.3 Code Quality Checks

**Pre-commit Checklist:**
- [ ] Code follows ESLint rules: `npm run lint`
- [ ] Code is properly formatted: `npm run format`
- [ ] All tests pass: `npm test`
- [ ] Code coverage meets threshold: `npm run test:coverage`
- [ ] No console.log statements in production code
- [ ] Error handling implemented where appropriate

## 4. Branching and Commit Conventions

### 4.1 Branching Model

**Branch Naming Conventions:**
- **Feature branches:** `feature/short-description`
- **Bug fix branches:** `bugfix/short-description`
- **Hotfix branches:** `hotfix/short-description`
- **Documentation:** `docs/short-description`

#### Branch Examples:
```bash
# Good branch names
feature/add-health-endpoint
bugfix/fix-response-headers
hotfix/security-update
docs/update-contributing-guide

# Bad branch names
new-feature
fix
my-changes
```

**Branch Management:**
- Create branches from `main` or `develop`
- Keep branches focused on single changes
- Delete branches after merging
- Rebase before merging to maintain clean history

### 4.2 Commit Message Format

**Conventional Commits:**
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

#### Commit Types:
- **feat:** New features
- **fix:** Bug fixes
- **docs:** Documentation changes
- **style:** Code style changes (formatting, semicolons)
- **refactor:** Code refactoring
- **test:** Adding or updating tests
- **chore:** Maintenance tasks

#### Commit Examples:
```bash
# Good commit messages
feat: add health check endpoint
fix: correct response content-type header
docs: update API documentation
test: add integration tests for hello endpoint

# Bad commit messages
added stuff
fix bug
update
changes
```

## 5. Pull Request Process

### 5.1 Pull Request Requirements

**Before Submitting:**
- [ ] Reference related issue number
- [ ] All tests pass locally
- [ ] Code coverage meets requirements
- [ ] Documentation updated if needed
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with main

**Pull Request Checklist:**
- [ ] Descriptive title and description
- [ ] Related issue referenced (fixes #123)
- [ ] Tests added for new functionality
- [ ] Documentation updated
- [ ] CI checks passing
- [ ] Ready for review

### 5.2 Pull Request Template

**Title Format:** `[Type] Brief description (fixes #issue-number)`

**Description Template:**
```markdown
## Description
Brief description of changes made.

## Related Issue
Fixes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Documentation
- [ ] README updated
- [ ] Code comments added
- [ ] API documentation updated
```

### 5.3 Review Process

**Review Requirements:**
- At least one maintainer approval required
- All CI checks must pass
- No merge conflicts
- Code style compliance verified

**Review Criteria:**
- **Functionality:** Does the code work as intended?
- **Code Quality:** Is the code clean and maintainable?
- **Testing:** Are tests comprehensive and meaningful?
- **Documentation:** Is documentation clear and updated?
- **Educational Value:** Does it enhance learning objectives?

## 6. Code Review Guidelines

### 6.1 For Reviewers

**Review Checklist:**
- [ ] Code follows project style guidelines
- [ ] Tests are comprehensive and pass
- [ ] Documentation is clear and updated
- [ ] Security considerations addressed
- [ ] Performance impact considered
- [ ] Educational value maintained

**Review Etiquette:**
- Be constructive and respectful
- Explain the reasoning behind suggestions
- Acknowledge good code practices
- Focus on code, not the person
- Provide specific, actionable feedback

### 6.2 For Contributors

**Responding to Reviews:**
- Address all feedback promptly
- Ask questions if feedback is unclear
- Make requested changes in separate commits
- Thank reviewers for their time
- Test changes thoroughly before pushing updates

**Review Response Examples:**
```markdown
# Good responses
"Thanks for the feedback! I've updated the error handling as suggested."
"Good point about the edge case. I've added a test to cover that scenario."

# Avoid
"I disagree"
"That's not how I would do it"
```

## 7. Community Standards and Code of Conduct

### 7.1 Our Commitment

We are committed to providing a welcoming, inclusive, and harassment-free experience for everyone, regardless of:
- Age, body size, disability, ethnicity, gender identity and expression
- Level of experience, education, socio-economic status
- Nationality, personal appearance, race, religion
- Sexual identity and orientation

### 7.2 Expected Behavior

**Positive Community Behaviors:**
- Use welcoming and inclusive language
- Respect differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

**Educational Environment:**
- Help newcomers feel welcome
- Share knowledge generously
- Ask questions respectfully
- Celebrate learning achievements
- Support collaborative learning

### 7.3 Unacceptable Behavior

**Prohibited Behaviors:**
- Harassment, trolling, or insulting comments
- Personal or political attacks
- Publishing others' private information
- Spam or irrelevant content
- Any conduct that could reasonably be considered inappropriate

**Consequences:**
- Warning for minor violations
- Temporary suspension for repeated violations
- Permanent ban for severe violations
- Reporting to relevant platforms if necessary

## 8. Getting Help

### 8.1 First-Time Contributors

**Getting Started:**
1. Read the main README.md for project overview
2. Check the "Getting Started" section for setup instructions
3. Review this contributing guide thoroughly
4. Look for issues labeled "good first issue"
5. Join community discussions for questions

**Setup Help:**
- See `docs/getting-started.md` for detailed setup instructions
- Check Node.js and npm version requirements
- Verify all dependencies install correctly
- Run the test suite to ensure everything works

### 8.2 Support Channels

**Where to Get Help:**
- **GitHub Issues:** Technical problems and bug reports
- **GitHub Discussions:** General questions and community chat
- **Documentation:** README.md and docs/ folder
- **Code Comments:** Inline documentation and examples

**Response Times:**
- Issues: 24-48 hours during weekdays
- Pull requests: 48-72 hours for initial review
- Discussions: Community-driven, varies

### 8.3 Development Resources

**Useful Links:**
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [ESLint Rules](https://eslint.org/docs/rules/)

**Learning Resources:**
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [JavaScript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

## Quick Reference

### Commands
```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Format code
npm run format

# Start development server
npm start
```

### Useful NPM Scripts
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run lint` - Check code style
- `npm run format` - Format code automatically

---

Thank you for contributing to the Node.js Hello World tutorial! Your efforts help make web development more accessible to learners worldwide. 🚀

For questions or clarifications about this contributing guide, please open an issue or start a discussion in the repository.