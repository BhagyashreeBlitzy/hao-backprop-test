---
name: Bug report
about: Create a report to help us improve
labels: bug, triage
---

### Describe the bug
A clear and concise description of what the bug is.

### To Reproduce
Steps to reproduce the behavior:
1. Go to '...'
2. Run '...'
3. Click on '...'
4. See error

### Expected behavior
A clear and concise description of what you expected to happen.

### Actual behavior
A clear and concise description of what actually happened.

### Environment
Please complete the following information:
- OS: [e.g. Ubuntu 22.04, Windows 11, macOS 14.1]
- Node.js version: [e.g. 22.11.0] (run `node --version`)
- Express version: [e.g. 5.1.0] (check `package.json`)
- npm version: [e.g. 10.2.4] (run `npm --version`)
- Browser [if applicable]: [e.g. Chrome 120, Safari 17]
- Other relevant dependencies: [list any other relevant packages]

### Logs, error messages, or stack traces
```
Paste any relevant logs, error output, or stack traces here.
Use code blocks to preserve formatting.
```

### Additional context
Add any other context about the problem here, including screenshots if applicable.

### Related issues
Reference any related issues or pull requests (e.g., "Related to #123").

---

### For Maintainers (Please ignore this section when reporting bugs)

**Triage Checklist:**
- [ ] Bug report contains sufficient information for reproduction
- [ ] Environment details are complete and accurate
- [ ] Issue is not a duplicate of existing reports
- [ ] Bug affects the core tutorial application functionality
- [ ] Severity and priority assessment completed

**Additional Notes:**
- Check [CONTRIBUTING.md](../../CONTRIBUTING.md) for detailed bug reporting guidelines
- Review [README.md](../../README.md) for setup and troubleshooting information
- Ensure the issue relates to the Node.js tutorial application with Express.js v5.1.0

**Quick Debugging Steps:**
1. Verify Node.js version compatibility (v18+ required, v22.x LTS recommended)
2. Check that all dependencies are installed (`npm install`)
3. Confirm server starts successfully (`npm start` or `npm run dev`)
4. Test the `/hello` endpoint with `curl http://localhost:3000/hello`
5. Review application logs for error details