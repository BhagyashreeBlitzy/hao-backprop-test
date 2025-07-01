<!-- 
Pull Request Template for Node.js/Express.js Tutorial Backend
This template ensures consistency, traceability, and quality in the code review process.
Please fill out all relevant sections to help reviewers understand your changes.
-->

## Pull Request Title
<!-- Provide a concise, descriptive title for your pull request -->

---

## Description
<!-- Please provide a summary of the change and relevant motivation/context -->
<!-- Include any background information that helps reviewers understand the purpose -->

### What does this PR do?
- 

### Why is this change needed?
- 

### How does this change improve the project?
- 

---

## Related Issue(s)
<!-- Reference any related GitHub issues or feature requests -->
<!-- Use "Closes #123" to automatically close issues when this PR is merged -->

- Closes # (issue number)
- Related to # (issue number)
- Addresses # (issue number)

---

## Type of Change
<!-- Check all that apply -->

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 📚 Documentation update (improvements to README, comments, or docs)
- [ ] 🔨 Refactor (code change that neither fixes a bug nor adds a feature)
- [ ] 🧹 Chore (maintenance tasks, dependency updates, build changes)
- [ ] ⚠️ Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 🏗️ Other (please describe): 

---

## How Has This Been Tested?
<!-- Describe the testing you performed to verify your changes -->
<!-- Include details about test cases, manual testing, and any edge cases covered -->

### Testing Checklist
- [ ] Unit tests (using Jest framework)
- [ ] Integration tests (HTTP endpoint testing with Supertest)
- [ ] Manual testing (local server testing)
- [ ] End-to-end tests (full request-response cycle)
- [ ] Performance testing (response time verification)
- [ ] Not tested (explain why): 

### Test Results
<!-- Include relevant test output, coverage reports, or performance metrics -->
```
Paste test results here if applicable
```

### Manual Testing Steps
1. 
2. 
3. 

---

## Code Quality Checklist
<!-- Confirm that your code meets the project's quality standards -->

### Development Standards
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] My code follows Node.js and Express.js best practices
- [ ] I have used appropriate error handling patterns

### Testing and Quality
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] My changes generate no new warnings or linting errors
- [ ] Code coverage is maintained or improved
- [ ] I have tested the '/hello' endpoint functionality (if applicable)

### Documentation and Dependencies
- [ ] I have made corresponding changes to the documentation
- [ ] I have updated comments and JSDoc annotations where necessary
- [ ] Any new dependencies are justified and documented
- [ ] Package.json has been updated if dependencies changed
- [ ] I have verified Node.js 18+ and Express.js 5.1.0 compatibility

### Integration and Deployment
- [ ] My changes don't break the existing API contract
- [ ] The application starts successfully with my changes
- [ ] Environment configuration is properly handled
- [ ] Any dependent changes have been merged and published
- [ ] I have assigned appropriate reviewer(s)

---

## Security Considerations
<!-- Address any security implications of your changes -->

- [ ] No sensitive information is exposed in logs or responses
- [ ] Input validation is implemented where applicable
- [ ] HTTP security headers are properly configured
- [ ] No new security vulnerabilities introduced
- [ ] Dependencies are up-to-date and secure

---

## Performance Impact
<!-- Describe any performance implications -->

### Performance Checklist
- [ ] Response time targets are met (< 100ms for /hello endpoint)
- [ ] Memory usage is within acceptable limits
- [ ] No blocking operations introduced
- [ ] Asynchronous patterns used appropriately

### Performance Metrics
<!-- Include any relevant performance measurements -->
- Response time: 
- Memory usage: 
- CPU impact: 

---

## Breaking Changes
<!-- If this is a breaking change, describe the impact and migration path -->

### What breaks?
- 

### Migration steps for users:
1. 
2. 
3. 

---

## Additional Context
<!-- Add any other context, screenshots, logs, or information about the pull request here -->

### Screenshots
<!-- If applicable, add screenshots to help explain your changes -->

### Logs
<!-- Include relevant log output if helpful for review -->
```
Paste logs here if applicable
```

### Additional Notes
<!-- Any additional information that reviewers should know -->

---

## Reviewer Guidelines
<!-- Information for reviewers -->

### Focus Areas for Review
- [ ] Code quality and adherence to Node.js/Express.js best practices
- [ ] Test coverage and quality
- [ ] Documentation completeness
- [ ] Security implications
- [ ] Performance considerations
- [ ] Educational value (for tutorial purposes)

### Testing Instructions for Reviewers
1. Pull the branch locally
2. Run `npm install` to install dependencies
3. Run `npm test` to execute the test suite
4. Run `npm start` and test the `/hello` endpoint
5. Verify all functionality works as expected

---

<!-- 
Thank you for contributing to the Node.js/Express.js Tutorial Backend!
Your contribution helps make this educational resource better for everyone.
-->