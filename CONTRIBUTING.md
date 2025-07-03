# Contributing to Node.js Hello World Tutorial

Welcome to the Node.js Hello World Tutorial project! We appreciate your interest in contributing to this educational resource. This document provides guidelines and standards for contributing to help ensure that all contributions align with the project's educational goals, technical requirements, and quality standards.

## 1. Introduction

This Node.js Hello World tutorial application demonstrates fundamental web server capabilities through a simple HTTP endpoint implementation using Node.js and Express.js 5.1.0. The project serves as an educational foundation for learning modern JavaScript server-side development, showcasing industry-standard practices while maintaining simplicity for educational clarity.

### Project Overview

- **Purpose**: Educational demonstration of Node.js and Express.js fundamentals
- **Technology Stack**: Node.js 18+, Express.js 5.1.0
- **Architecture**: Single endpoint (`/hello`) returning "Hello world"
- **Target Audience**: Developers learning Node.js, students, and technical educators

### Contributing Philosophy

We welcome contributions that enhance the educational value of this tutorial while maintaining its simplicity and clarity. All contributions should support the project's primary objective of teaching fundamental web development concepts without introducing unnecessary complexity.

## 2. How to Contribute

There are several ways to contribute to this project:

- **Report bugs** in the application or documentation
- **Request features** that enhance educational value
- **Submit code changes** including bug fixes, improvements, or documentation updates
- **Improve documentation** to make the tutorial more accessible
- **Share feedback** on the learning experience

### 2.1 Reporting Bugs

We use GitHub Issues with structured templates to track bugs and ensure clear communication. When reporting bugs, please help us understand and reproduce the issue quickly.

#### Bug Report Process

1. **Search existing issues** to avoid duplicates
2. **Use the bug report template** provided in GitHub Issues
3. **Provide detailed information** including:
   - Steps to reproduce the issue
   - Expected behavior vs actual behavior
   - Environment details (Node.js version, OS, etc.)
   - Error messages or screenshots if applicable

#### Bug Report Template Requirements

```markdown
**Bug Description**
A clear and concise description of the bug.

**Steps to Reproduce**
1. Step one
2. Step two
3. Step three

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- Node.js version:
- Express.js version:
- Operating System:
- Browser (if applicable):

**Additional Context**
Any additional information that might be helpful.
```

### 2.2 Requesting Features

Feature requests should align with the educational goals of the tutorial and maintain its simplicity. We encourage suggestions that enhance learning without adding unnecessary complexity.

#### Feature Request Guidelines

- **Educational Value**: Features should contribute to learning objectives
- **Simplicity**: Maintain the tutorial's minimal complexity
- **Relevance**: Align with Node.js and Express.js fundamentals
- **Clarity**: Enhance understanding rather than confuse learners

#### Feature Request Process

1. **Search existing feature requests** to avoid duplicates
2. **Use the feature request template** in GitHub Issues
3. **Explain the educational benefit** of the proposed feature
4. **Consider the complexity impact** on new learners

### 2.3 Submitting Code Changes

All code changes must follow our established standards and go through the pull request process.

#### Prerequisites

- Fork the repository
- Set up your development environment
- Ensure you have Node.js 18+ installed
- Run `npm install` to install dependencies

#### Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/nodejs-hello-world-tutorial.git
cd nodejs-hello-world-tutorial

# Install dependencies
npm install

# Start the application
npm start

# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format
```

## 3. Code Style Guide

Consistency in code style helps maintain readability and makes the tutorial more accessible to learners. We follow industry-standard JavaScript conventions with specific configurations.

### JavaScript Style Standards

- **Indentation**: Use 2 spaces (no tabs)
- **Quotes**: Use single quotes for strings
- **Semicolons**: Use semicolons consistently
- **Trailing Commas**: Use trailing commas where possible
- **Line Length**: Maximum 80 characters per line

### ESLint Configuration

Follow the project's `.eslintrc.js` configuration:

```javascript
module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
  },
};
```

### Prettier Configuration

Code formatting is handled by Prettier using `.prettierrc.js`:

```javascript
module.exports = {
  singleQuote: true,
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  printWidth: 80,
};
```

### Code Quality Requirements

- **Linting**: All code must pass ESLint checks (`npm run lint`)
- **Formatting**: Code must be formatted with Prettier (`npm run format`)
- **Testing**: New features require appropriate tests
- **Documentation**: Code should be well-commented for educational purposes

## 4. Branching and Commit Conventions

We use a structured branching model and commit message format to maintain project organization and clarity.

### Branching Strategy

- **main**: Production-ready code
- **develop**: Integration branch for new features
- **feature/**: Feature development branches
- **bugfix/**: Bug fix branches
- **hotfix/**: Critical production fixes

#### Branch Naming Conventions

```
feature/short-description
bugfix/issue-number-description
hotfix/critical-fix-description
```

**Examples:**
- `feature/add-health-endpoint`
- `bugfix/fix-response-headers`
- `hotfix/security-update`

### Commit Message Format

We follow the Conventional Commits specification for clear, standardized commit messages:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Commit Types

- **feat**: New features
- **fix**: Bug fixes
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Test additions or modifications
- **chore**: Build process or auxiliary tool changes

#### Commit Message Examples

```
feat: add hello endpoint with basic response
fix: correct response content-type header
docs: update README with installation instructions
style: format code according to prettier rules
test: add unit tests for hello endpoint
```

## 5. Pull Request Process

All code changes must be submitted through pull requests and undergo review before merging.

### Pull Request Requirements

- **Reference related issue**: Link to the GitHub issue being addressed
- **Pass CI checks**: All automated tests and linting must pass
- **Include tests**: New features and bug fixes must include appropriate tests
- **Update documentation**: Modify README.md and relevant docs for user-facing changes
- **Maintainer review**: At least one maintainer must approve the pull request

### Pull Request Steps

1. **Create a feature branch** from `develop` or `main`
2. **Make your changes** following the code style guide
3. **Write or update tests** to cover your changes
4. **Run the test suite** to ensure all tests pass
5. **Run linting and formatting** to ensure code quality
6. **Commit your changes** using conventional commit format
7. **Push to your fork** and create a pull request
8. **Fill out the PR template** with detailed information
9. **Request review** from maintainers
10. **Address feedback** and make necessary changes

### Pull Request Template

```markdown
## Description
Brief description of the changes made.

## Related Issue
Closes #[issue number]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code style/refactoring
- [ ] Test improvements

## Testing
- [ ] Tests pass locally
- [ ] New tests added for changes
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 6. Code Review Guidelines

Code reviews ensure quality, maintainability, and educational value while providing learning opportunities for all contributors.

### Review Process

#### For Authors

- **Self-review**: Review your own code before submitting
- **Clear descriptions**: Provide detailed pull request descriptions
- **Responsive feedback**: Address reviewer comments promptly
- **Test coverage**: Ensure adequate test coverage for changes

#### For Reviewers

- **Constructive feedback**: Provide helpful, specific suggestions
- **Educational focus**: Consider the learning impact of changes
- **Code quality**: Check for adherence to style and best practices
- **Testing**: Verify appropriate test coverage
- **Documentation**: Ensure changes are properly documented

### Review Criteria

#### Code Quality
- Follows established style guidelines
- Includes appropriate error handling
- Uses meaningful variable and function names
- Maintains code simplicity for educational purposes

#### Educational Value
- Enhances learning objectives
- Maintains tutorial simplicity
- Includes clear comments and documentation
- Avoids unnecessary complexity

#### Technical Standards
- Passes all automated tests
- Follows Node.js and Express.js best practices
- Maintains security considerations
- Ensures backward compatibility

### CI/CD Checks

All pull requests must pass automated checks:

- **Linting**: ESLint validation
- **Testing**: Jest test suite execution
- **Coverage**: Minimum code coverage requirements
- **Build**: Successful application build

## 7. Community Standards and Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of background, experience level, or identity.

### Our Values

- **Respect**: Treat all community members with respect and kindness
- **Inclusion**: Welcome contributors from all backgrounds and skill levels
- **Learning**: Foster an environment that promotes learning and growth
- **Collaboration**: Work together constructively to improve the project
- **Professionalism**: Maintain professional conduct in all interactions

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Give and gracefully accept constructive feedback
- Focus on what is best for the community and learning objectives
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or inappropriate comments
- Trolling, insulting, or derogatory comments
- Personal or political attacks
- Public or private harassment
- Publishing others' private information without permission

### Enforcement

Project maintainers are responsible for clarifying and enforcing standards of acceptable behavior. Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant](https://www.contributor-covenant.org/), version 2.0.

## 8. Getting Help

If you need help contributing to the project or have questions about the tutorial, we provide several resources:

### Documentation Resources

- **README.md**: Project overview and setup instructions
- **docs/getting-started.md**: Detailed setup and development guide
- **API Documentation**: Endpoint specifications and examples
- **Technical Specifications**: Detailed system architecture and requirements

### Communication Channels

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For general questions and community interaction
- **Pull Request Comments**: For specific code-related questions

### Getting Started Support

If you're new to contributing to open source projects:

1. **Read the documentation** thoroughly
2. **Start with small issues** labeled "good first issue"
3. **Ask questions** in GitHub Discussions
4. **Review existing pull requests** to understand the process
5. **Join the community** and introduce yourself

### Development Environment Help

If you encounter issues setting up your development environment:

1. **Check Node.js version** (18+ required)
2. **Verify npm installation** and dependency resolution
3. **Review the setup documentation**
4. **Create an issue** if problems persist

### Learning Resources

For developers new to Node.js or Express.js:

- **Official Node.js Documentation**: https://nodejs.org/docs/
- **Express.js Documentation**: https://expressjs.com/
- **JavaScript Fundamentals**: MDN Web Docs
- **Git and GitHub Guides**: GitHub's official documentation

---

## Summary

Thank you for your interest in contributing to the Node.js Hello World Tutorial! Your contributions help make this educational resource more valuable for learners worldwide. By following these guidelines, you help maintain the quality and educational effectiveness of the project.

### Key Reminders

- **Educational Focus**: Keep the tutorial's learning objectives in mind
- **Code Quality**: Follow established style and testing standards
- **Community**: Maintain respectful and inclusive interactions
- **Process**: Use the established workflow for all contributions

### Quick Reference

- **Code Style**: Follow `.eslintrc.js` and `.prettierrc.js`
- **Testing**: Run `npm test` before submitting
- **Branching**: Use feature branches with descriptive names
- **Commits**: Follow Conventional Commits format
- **Pull Requests**: Include tests, documentation, and detailed descriptions

We look forward to your contributions and to building a better learning resource together!