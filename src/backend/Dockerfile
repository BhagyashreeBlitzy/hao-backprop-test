# Multi-stage Docker build for Node.js/Express.js Hello World Tutorial Backend
# 
# This Dockerfile creates a secure, production-ready container image for the backend service
# implementing Docker security best practices, multi-stage builds, and environment-agnostic deployment.
# Supports local development, CI/CD pipelines, and cloud platform deployment.
#
# Build stages:
# 1. base - Common base configuration with Node.js LTS Alpine image
# 2. dependencies - Install and cache dependencies efficiently
# 3. test - Development stage with all dependencies for testing
# 4. production - Minimal production runtime with security hardening
#
# Security Features:
# - Official Node.js LTS Alpine base image for minimal attack surface
# - Non-root user execution for container security
# - Minimal production dependencies (npm ci --omit=dev)
# - Secure file permissions and ownership
# - Health check endpoint exposure for monitoring
# - Environment variable support for configuration
#
# Build Examples:
# docker build -t hello-backend .
# docker build --target test -t hello-backend:test .
# docker build --build-arg NODE_ENV=production -t hello-backend:prod .

# =============================================================================
# Stage 1: Base Configuration
# =============================================================================
# Use official Node.js 22.x LTS Alpine image for optimal security and minimal size
# Alpine Linux provides a small, security-oriented distribution
# Node.js 22.x LTS ensures long-term support through April 2027
FROM node:22-alpine AS base

# Set working directory following Docker best practices
# /usr/src/app is the conventional location for application code
WORKDIR /usr/src/app

# Create non-root user for security (Alpine Linux pattern)
# Running as non-root user prevents privilege escalation attacks
# nodejs user with home directory for better security isolation
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Install dumb-init for proper signal handling in containers
# dumb-init acts as PID 1 and forwards signals properly to Node.js process
# Essential for graceful shutdown handling in Kubernetes and Docker
RUN apk add --no-cache dumb-init

# Set environment variables for Node.js optimization
# NODE_ENV=production enables production optimizations in Node.js and Express.js
# NPM_CONFIG_CACHE sets npm cache location to prevent permission issues
ENV NODE_ENV=production \
    NPM_CONFIG_CACHE=/tmp/.npm \
    NODE_OPTIONS="--max-old-space-size=1024"

# =============================================================================
# Stage 2: Dependencies Installation
# =============================================================================
FROM base AS dependencies

# Copy package management files for dependency resolution
# Copying package*.json separately enables Docker layer caching
# If dependencies don't change, this layer can be reused
COPY package*.json ./

# Install production dependencies using npm ci for reproducible builds
# npm ci installs dependencies from package-lock.json exactly
# --omit=dev excludes devDependencies for minimal production image
# --only=production ensures only production dependencies are installed
RUN npm ci --omit=dev --only=production && \
    npm cache clean --force

# Verify dependency installation and security
# npm audit checks for known security vulnerabilities
# npm ls verifies dependency tree integrity
RUN npm audit --audit-level=high && \
    npm ls

# =============================================================================
# Stage 3: Test Stage (Development Dependencies)
# =============================================================================
FROM base AS test

# Set development environment for testing stage
ENV NODE_ENV=development

# Copy package files for full dependency installation
COPY package*.json ./

# Install ALL dependencies (including devDependencies) for testing
# This includes Jest, Supertest, ESLint, Prettier, and other dev tools
RUN npm ci && \
    npm cache clean --force

# Copy source code for testing
# Copy all source files needed for test execution
COPY app.js server.js ./
COPY config/ ./config/
COPY middleware/ ./middleware/
COPY routes/ ./routes/
COPY utils/ ./utils/
COPY healthcheck/ ./healthcheck/
COPY scripts/ ./scripts/
COPY .env.example ./

# Copy test files and configuration
COPY jest.config.js ./
COPY test/ ./test/

# Change ownership to nodejs user for security
RUN chown -R nodejs:nodejs /usr/src/app

# Switch to non-root user
USER nodejs

# Expose port for testing (can be overridden)
EXPOSE 3000

# Health check for test stage
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "const http = require('http'); \
    const options = { host: 'localhost', port: process.env.PORT || 3000, path: '/health', timeout: 2000 }; \
    const req = http.request(options, (res) => { \
        process.exit(res.statusCode === 200 ? 0 : 1); \
    }); \
    req.on('error', () => process.exit(1)); \
    req.end();"

# Default command for test stage - run tests
CMD ["dumb-init", "npm", "test"]

# =============================================================================
# Stage 4: Production Stage (Final Optimized Image)
# =============================================================================
FROM dependencies AS production

# Copy application source code
# Copy only necessary files for production runtime
COPY app.js server.js ./
COPY config/ ./config/
COPY middleware/ ./middleware/
COPY routes/ ./routes/
COPY utils/ ./utils/
COPY healthcheck/ ./healthcheck/
COPY scripts/ ./scripts/

# Copy environment template (actual .env should be mounted at runtime)
COPY .env.example ./

# Set secure file permissions and ownership for production
# Ensure all files are owned by nodejs user
# Set read-only permissions for enhanced security
RUN chown -R nodejs:nodejs /usr/src/app && \
    chmod -R 755 /usr/src/app && \
    chmod -R 644 /usr/src/app/*.js /usr/src/app/**/*.js && \
    chmod +x /usr/src/app/scripts/start.js

# Switch to non-root user for production security
USER nodejs

# Expose application port
# Default port 3000, can be overridden with PORT environment variable
EXPOSE 3000

# Add health check for container orchestration
# Health check calls /health endpoint to verify application readiness
# Used by Docker, Kubernetes, and cloud platforms for service health monitoring
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "const http = require('http'); \
    const options = { host: 'localhost', port: process.env.PORT || 3000, path: '/health', timeout: 2000 }; \
    const req = http.request(options, (res) => { \
        process.exit(res.statusCode === 200 ? 0 : 1); \
    }); \
    req.on('error', () => process.exit(1)); \
    req.end();"

# Set production runtime configuration
ENV NODE_ENV=production \
    PORT=3000

# Use dumb-init to handle signals properly and start the application
# dumb-init ensures proper signal forwarding for graceful shutdown
# node scripts/start.js is the canonical entry point as defined in package.json
CMD ["dumb-init", "node", "scripts/start.js"]

# =============================================================================
# Build and Usage Instructions
# =============================================================================
#
# BUILD COMMANDS:
# ---------------
# Production build (default):
#   docker build -t hello-backend .
#   docker build -t hello-backend:latest .
#
# Test build (includes devDependencies):
#   docker build --target test -t hello-backend:test .
#
# Development build with build args:
#   docker build --build-arg NODE_ENV=development -t hello-backend:dev .
#
# RUN COMMANDS:
# -------------
# Production run:
#   docker run -p 3000:3000 hello-backend
#   docker run -p 3000:3000 -e PORT=3000 -e NODE_ENV=production hello-backend
#
# Run with environment file:
#   docker run -p 3000:3000 --env-file .env hello-backend
#
# Run with custom port:
#   docker run -p 4000:4000 -e PORT=4000 hello-backend
#
# Test execution:
#   docker run --rm hello-backend:test
#
# Interactive development:
#   docker run -it -p 3000:3000 -v $(pwd):/usr/src/app hello-backend:test sh
#
# HEALTH CHECK:
# -------------
# The container includes a health check that verifies the /health endpoint
# Status can be checked with: docker inspect --format='{{.State.Health.Status}}' <container>
#
# SECURITY FEATURES:
# ------------------
# - Non-root user execution (nodejs:nodejs)
# - Official Node.js LTS Alpine base image
# - Minimal production dependencies
# - Secure file permissions (644 for files, 755 for directories)
# - Environment variable configuration
# - Signal handling with dumb-init
# - Health check endpoint for monitoring
# - Multi-stage build for optimized image size
#
# COMPATIBILITY:
# --------------
# - Docker 20.10+
# - Kubernetes 1.20+
# - Docker Compose 2.0+
# - Cloud platforms (AWS ECS, Google Cloud Run, Azure Container Instances)
# - CI/CD pipelines (GitHub Actions, GitLab CI/CD, Jenkins)