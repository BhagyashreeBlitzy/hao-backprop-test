# =============================================================================
# Node.js/Express.js Backend Dockerfile
# =============================================================================
# Production-ready containerization for Node.js tutorial application backend
# Supports development, testing, and production deployment scenarios with
# comprehensive security, performance, and observability considerations.
#
# Features:
# - Multi-stage build for testing and production optimization
# - Alpine Linux base for minimal attack surface and image size
# - Non-root user execution for enhanced security
# - Environment variable support for deployment flexibility
# - Optimized dependency installation and caching
# - Health check integration and monitoring support
# - Platform-agnostic deployment compatibility
#
# Requirements Addressed:
# - HTTP Server Implementation (2.1.1): Node.js 18+ and Express.js 5.1.0
# - Deployment and Environment Configuration (8.2.5): PORT and NODE_ENV support
# - Monitoring and Observability (6.5): Health check and logging integration
# - Testing Strategy (6.6): Multi-stage build for test execution
# - Security Architecture (6.4): Alpine base, non-root user, minimal dependencies
#
# Build Commands:
#   docker build -t hello-backend .
#   docker build --target test -t hello-backend:test .
#   docker run -p 3000:3000 -e NODE_ENV=production hello-backend
# =============================================================================

# =============================================================================
# BASE STAGE - Foundation for all subsequent stages
# =============================================================================
FROM node:22-alpine AS base

# Security hardening: Create non-root user for application execution
# Alpine Linux provides 'addgroup' and 'adduser' commands for user management
# The 'node' user provides a secure runtime environment for the application
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set working directory to standard Node.js application location
# /usr/src/app is the conventional directory for Node.js applications
# This provides consistency across different deployment environments
WORKDIR /usr/src/app

# Install security updates and essential system dependencies
# Alpine package manager (apk) provides minimal, security-focused packages
# --no-cache flag prevents package cache from being stored in the image layers
RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
        dumb-init \
        curl && \
    rm -rf /var/cache/apk/*

# Copy package management files for dependency resolution
# package.json and package-lock.json enable deterministic dependency installation
# Copying these files separately enables Docker layer caching optimization
COPY package*.json ./

# =============================================================================
# DEVELOPMENT STAGE - Enhanced development environment
# =============================================================================
FROM base AS development

# Install all dependencies including development tools
# npm ci provides faster, reliable, reproducible builds for development
# Development dependencies include testing, linting, and debugging tools
RUN npm ci

# Copy entire source code for development flexibility
# Development stage includes all files for hot reloading and debugging
COPY . .

# Set development environment variables
ENV NODE_ENV=development
ENV PORT=3000

# Expose development port for local access
EXPOSE 3000

# Development entry point with enhanced debugging
# Uses npm run dev for development server with hot reloading capabilities
CMD ["npm", "run", "dev"]

# =============================================================================
# TEST STAGE - Comprehensive testing environment
# =============================================================================
FROM base AS test

# Install all dependencies including development and testing tools
# Full dependency installation enables comprehensive testing capabilities
# Testing tools include Jest, Supertest, ESLint, and coverage reporting
RUN npm ci

# Copy entire codebase including test files and configuration
# Test stage requires complete source code for unit, integration, and coverage testing
COPY . .

# Set test environment configuration
ENV NODE_ENV=test
ENV PORT=0

# Run comprehensive test suite with coverage reporting
# Executes linting, unit tests, integration tests, and generates coverage reports
# Multi-command execution ensures all quality gates are validated
RUN npm run lint && \
    npm run test:ci && \
    npm run test:coverage

# Test verification command for CI/CD pipeline integration
CMD ["npm", "run", "test:ci"]

# =============================================================================
# PRODUCTION BUILD STAGE - Optimized dependency installation
# =============================================================================
FROM base AS production-deps

# Install only production dependencies for minimal runtime image
# --omit=dev flag excludes development dependencies reducing image size
# --frozen-lockfile ensures exact dependency versions for security
RUN npm ci --omit=dev --frozen-lockfile && \
    npm cache clean --force

# =============================================================================
# PRODUCTION STAGE - Secure, optimized runtime environment
# =============================================================================
FROM base AS production

# Copy production dependencies from optimized build stage
# Multi-stage copy reduces final image size by excluding development tools
COPY --from=production-deps /usr/src/app/node_modules ./node_modules

# Copy package.json for runtime metadata and script definitions
COPY package*.json ./

# Copy application source code with proper ownership
# --chown flag ensures files are owned by the non-root user
# Excludes unnecessary files like tests, development configs, and documentation
COPY --chown=nextjs:nodejs app.js server.js ./
COPY --chown=nextjs:nodejs scripts/ ./scripts/
COPY --chown=nextjs:nodejs routes/ ./routes/
COPY --chown=nextjs:nodejs middleware/ ./middleware/
COPY --chown=nextjs:nodejs utils/ ./utils/
COPY --chown=nextjs:nodejs config/ ./config/
COPY --chown=nextjs:nodejs healthcheck/ ./healthcheck/

# Copy environment template for deployment configuration
# .env.example provides environment variable documentation
COPY --chown=nextjs:nodejs .env.example ./

# Set production environment variables
# NODE_ENV=production enables Express.js production optimizations
# PORT=3000 provides default port with override capability
ENV NODE_ENV=production
ENV PORT=3000

# Expose application port for container networking
# Port 3000 is the standard Node.js application port
# Can be overridden at runtime with -p flag or environment variables
EXPOSE 3000

# Switch to non-root user for security
# Prevents privilege escalation attacks and follows security best practices
USER nextjs

# Configure health check for container orchestration
# Health check enables proper container lifecycle management
# Polls /health endpoint to verify application responsiveness
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Production startup command with process signal handling
# dumb-init ensures proper signal handling for graceful shutdown
# Uses scripts/start.js as canonical entrypoint for robust startup
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "scripts/start.js"]

# =============================================================================
# DEFAULT TARGET - Production stage for standard builds
# =============================================================================
# Default to production stage when no specific target is specified
# Provides secure, optimized runtime environment for deployment