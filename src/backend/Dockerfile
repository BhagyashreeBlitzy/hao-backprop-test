# Use Node.js 22 LTS Alpine base image for smaller size and security
# Node.js 22.x is Active LTS and provides the latest features with long-term support
FROM node:22-alpine

# Set metadata labels for container information and maintainability
LABEL maintainer="Tutorial Authors" \
      version="1.0.0" \
      description="Production-ready Node.js tutorial backend with Express.js 5.1.0" \
      node.version="22" \
      express.version="5.1.0"

# Install additional system dependencies for security and functionality
# curl: Required for health checks and debugging
# dumb-init: Proper signal handling for PID 1
RUN apk add --no-cache \
    curl \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Create application directory with proper permissions
# Use /usr/src/app as recommended by Node.js Docker best practices
WORKDIR /usr/src/app

# Create non-root user for security
# Use the built-in 'node' user from the official Node.js image
RUN addgroup -g 1000 node && \
    adduser -u 1000 -G node -s /bin/sh -D node || true

# Copy package files first for better Docker layer caching
# This allows Docker to cache the dependency installation step
COPY --chown=node:node package.json package-lock.json ./

# Install production dependencies only
# Use npm ci for faster, reliable, reproducible builds
# --only=production ensures only production dependencies are installed
# --no-audit disables audit for faster builds (audit should be done in CI/CD)
RUN npm ci --only=production --no-audit && \
    npm cache clean --force

# Copy application source code
# Use --chown to set proper ownership for security
COPY --chown=node:node . .

# Set production environment variables
# NODE_ENV=production enables Express.js production optimizations
# PORT=3000 sets the default port (can be overridden at runtime)
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

# Switch to non-root user for security
# All subsequent commands and container runtime will use this user
USER node

# Expose the application port
# This is the default port but can be overridden with environment variables
EXPOSE 3000

# Add health check for container orchestration
# Checks the /hello endpoint every 30 seconds
# Starts checking after 5 seconds startup period
# Fails after 3 consecutive failures
# Uses curl with --fail to return proper exit codes
HEALTHCHECK --interval=30s \
            --timeout=3s \
            --start-period=5s \
            --retries=3 \
            CMD curl --fail --silent --show-error http://localhost:${PORT}/hello || exit 1

# Use dumb-init for proper signal handling as PID 1
# This ensures graceful shutdown and proper zombie process reaping
# Start the application using npm start script
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]