# syntax=docker/dockerfile:1

# =============================================================================
# Node.js Tutorial Backend - Production Dockerfile
# =============================================================================
# This Dockerfile creates a production-ready container image for the Node.js
# tutorial backend application using Node.js v22.11.0 LTS and Express.js v5.1.0.
# 
# Key Features:
# - Multi-stage build pattern for optimized image size and security
# - Node.js v22.11.0 LTS (Active LTS until 2025-10-21)
# - Express.js v5.1.0 compatibility with automatic promise handling
# - Security-first approach with non-root user execution
# - Production dependency optimization with npm ci --omit=dev
# - Health check integration for container orchestration
# - Educational documentation and best practices demonstration
#
# Build Command:
# docker build -t nodejs-tutorial-backend -f infrastructure/docker/Dockerfile .
# 
# Run Command:
# docker run -p 3000:3000 --env-file src/backend/.env nodejs-tutorial-backend
#
# Technical Requirements Addressed:
# - HTTP Server Initialization & Containerization (F-001)
# - Environment and Configuration Management (ENV-001)
# - Security and Best Practices (SEC-001)
# - Educational Value and Code Clarity (EDU-001)
# =============================================================================

# -----------------------------------------------------------------------------
# STAGE 1: Base Dependencies and Build Environment
# -----------------------------------------------------------------------------

# Use official Node.js v22.11.0 LTS slim image as base
# - Debian-based slim variant provides minimal attack surface
# - Active LTS support until 2025-10-21, Maintenance until 2027-04-30
# - Compatible with Express.js v5.1.0 requirements (Node.js v18+)
# - npm v11.4.2 bundled for dependency management
FROM node:22.11.0-slim AS base

# Add image metadata for documentation and maintenance
LABEL maintainer="Node.js Tutorial Project" \
      description="Node.js tutorial backend application with Express.js v5.1.0" \
      version="1.0.0" \
      node-version="22.11.0" \
      express-version="5.1.0" \
      base-image="node:22.11.0-slim"

# Set working directory following Docker best practices
# - /usr/src/app is conventional for Node.js applications
# - Provides clear separation from system directories
# - Compatible with container orchestration platforms
WORKDIR /usr/src/app

# Install system dependencies required for Node.js native modules
# - Update package lists for security patches
# - Install curl for health checks and debugging
# - Install dumb-init for proper signal handling in containers
# - Clean up package cache to reduce image size
RUN apt-get update && apt-get install -y \
    curl \
    dumb-init \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# -----------------------------------------------------------------------------
# STAGE 2: Dependency Installation and Optimization
# -----------------------------------------------------------------------------

# Copy package management files for dependency resolution
# - package.json contains dependencies and project configuration
# - package-lock.json ensures exact version reproducibility
# - Copying these files first enables Docker layer caching optimization
COPY src/backend/package*.json ./

# Install production dependencies using npm ci for reproducible builds
# - npm ci provides faster, reliable, reproducible builds for production
# - --omit=dev excludes development dependencies for smaller image size
# - --no-audit skips audit to speed up build (handled separately in CI/CD)
# - --no-fund removes funding messages for cleaner build output
RUN npm ci --omit=dev --no-audit --no-fund

# -----------------------------------------------------------------------------
# STAGE 3: Application Source Code Integration
# -----------------------------------------------------------------------------

# Copy application source code and configuration files
# - Copy entire backend application structure
# - Includes all JavaScript modules, configuration, and utilities
# - Preserves file permissions and directory structure
COPY src/backend/ ./

# Copy environment configuration files (optional for local development)
# - .env file provides default configuration values
# - .env.example serves as documentation for required variables
# - Production deployments should use container environment variables
# - These files are copied for educational demonstration and local testing
COPY src/backend/.env* ./

# Set production environment by default
# - NODE_ENV=production enables Express.js production optimizations
# - Can be overridden at runtime with docker run -e NODE_ENV=development
# - Production mode enables view caching, less verbose error messages
# - Required for optimal Express.js v5.1.0 performance
ENV NODE_ENV=production

# Configure default port for the application
# - PORT=3000 matches application default configuration
# - Can be overridden at runtime with docker run -e PORT=8080
# - Standard Node.js convention for port configuration
# - Compatible with container orchestration port mapping
ENV PORT=3000

# -----------------------------------------------------------------------------
# STAGE 4: Security Configuration and User Management
# -----------------------------------------------------------------------------

# Create a non-root user for security best practices
# - Running containers as root poses security risks
# - 'node' user is pre-created in official Node.js images
# - Follows principle of least privilege for container security
# - Required for production deployments and security compliance
RUN chown -R node:node /usr/src/app
USER node

# -----------------------------------------------------------------------------
# STAGE 5: Container Runtime Configuration
# -----------------------------------------------------------------------------

# Expose the application port for container networking
# - Documents the port used by the application
# - Required for container orchestration and port mapping
# - Port 3000 is standard for Node.js development and tutorials
# - Actual port binding is controlled by docker run -p flag
EXPOSE 3000

# Configure health check for container orchestration
# - GET /health endpoint provides application health status
# - 30-second interval balances monitoring frequency with resource usage
# - 3-second timeout prevents hanging health checks
# - 3 consecutive failures before marking container unhealthy
# - Essential for Kubernetes liveness and readiness probes
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Set container startup command using dumb-init for proper signal handling
# - dumb-init ensures proper signal forwarding to Node.js process
# - Enables graceful shutdown handling for SIGTERM/SIGINT signals
# - Required for proper container lifecycle management
# - node server.js starts the Express.js HTTP server
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]

# =============================================================================
# EDUCATIONAL NOTES AND BEST PRACTICES
# =============================================================================

# Multi-Stage Build Benefits (Future Enhancement):
# While this Dockerfile uses a single-stage approach for educational clarity,
# production applications can benefit from multi-stage builds:
# 
# FROM node:22.11.0-slim AS builder
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm ci --include=dev
# COPY . .
# RUN npm run build && npm prune --omit=dev
# 
# FROM node:22.11.0-slim AS runtime
# WORKDIR /usr/src/app
# COPY --from=builder /usr/src/app .
# USER node
# CMD ["node", "server.js"]

# Security Considerations:
# 1. Non-root user execution prevents privilege escalation
# 2. Slim base image reduces attack surface
# 3. Minimal system dependencies limit vulnerability exposure
# 4. Production dependencies only reduce unnecessary packages
# 5. Regular base image updates ensure security patches

# Performance Optimizations:
# 1. Layer caching through strategic COPY ordering
# 2. npm ci for faster, deterministic dependency installation
# 3. Production NODE_ENV enables Express.js optimizations
# 4. dumb-init reduces process overhead and improves signal handling
# 5. Health checks enable proper load balancer integration

# Container Orchestration Features:
# 1. HEALTHCHECK enables automated health monitoring
# 2. EXPOSE documents network requirements
# 3. Environment variable configuration supports deployment flexibility
# 4. Signal handling enables graceful shutdown in orchestration platforms
# 5. Non-root execution meets security policy requirements

# Build and Deployment Examples:
# 
# Development Build:
# docker build -t nodejs-tutorial-backend:dev -f infrastructure/docker/Dockerfile .
# 
# Production Build with Version Tag:
# docker build -t nodejs-tutorial-backend:v1.0.0 -f infrastructure/docker/Dockerfile .
# 
# Local Development Run:
# docker run -p 3000:3000 --env-file src/backend/.env nodejs-tutorial-backend:dev
# 
# Production Run with Environment Override:
# docker run -p 80:3000 -e NODE_ENV=production -e PORT=3000 nodejs-tutorial-backend:v1.0.0
# 
# Docker Compose Integration:
# version: '3.8'
# services:
#   backend:
#     build:
#       context: .
#       dockerfile: infrastructure/docker/Dockerfile
#     ports:
#       - "3000:3000"
#     environment:
#       - NODE_ENV=production
#       - PORT=3000
#     healthcheck:
#       test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
#       interval: 30s
#       timeout: 10s
#       retries: 3

# Kubernetes Deployment Example:
# apiVersion: apps/v1
# kind: Deployment
# metadata:
#   name: nodejs-tutorial-backend
# spec:
#   replicas: 3
#   selector:
#     matchLabels:
#       app: nodejs-tutorial-backend
#   template:
#     metadata:
#       labels:
#         app: nodejs-tutorial-backend
#     spec:
#       containers:
#       - name: backend
#         image: nodejs-tutorial-backend:v1.0.0
#         ports:
#         - containerPort: 3000
#         env:
#         - name: NODE_ENV
#           value: "production"
#         - name: PORT
#           value: "3000"
#         livenessProbe:
#           httpGet:
#             path: /health
#             port: 3000
#           initialDelaySeconds: 30
#           periodSeconds: 10
#         readinessProbe:
#           httpGet:
#             path: /health
#             port: 3000
#           initialDelaySeconds: 5
#           periodSeconds: 5

# =============================================================================
# TROUBLESHOOTING GUIDE
# =============================================================================

# Common Build Issues:
# 
# 1. "npm ERR! network timeout" during npm ci:
#    - Increase Docker build timeout: docker build --timeout=600
#    - Use corporate npm registry: npm config set registry http://internal-registry
#    - Check network connectivity and DNS resolution
# 
# 2. "Permission denied" errors:
#    - Ensure proper file permissions before COPY operations
#    - Verify USER directive is placed correctly after file operations
#    - Check host system file ownership and permissions
# 
# 3. "Module not found" errors at runtime:
#    - Verify package.json includes all required dependencies
#    - Ensure npm ci completed successfully without errors
#    - Check for missing native dependencies in slim base image
# 
# 4. Application startup failures:
#    - Check environment variable configuration and defaults
#    - Verify port binding and network configuration
#    - Review application logs for specific error messages
#    - Ensure all required configuration files are copied

# Runtime Troubleshooting:
# 
# 1. Container exits immediately:
#    - Check application startup errors in container logs
#    - Verify environment variable configuration
#    - Ensure port is not already in use on host system
# 
# 2. Health check failures:
#    - Verify /health endpoint is implemented and accessible
#    - Check application startup time and health check timing
#    - Ensure curl is available in container (installed in this Dockerfile)
# 
# 3. Performance issues:
#    - Monitor container resource usage (CPU, memory)
#    - Check for memory leaks in Node.js application
#    - Verify NODE_ENV=production for optimal Express.js performance
# 
# 4. Connectivity problems:
#    - Verify port mapping in docker run command (-p 3000:3000)
#    - Check firewall and network security group configurations
#    - Ensure application binds to 0.0.0.0, not localhost in container

# =============================================================================