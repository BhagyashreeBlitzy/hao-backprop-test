# Use Node.js 22 Alpine as the base image for optimal security and size
# Node.js 22 is the Active LTS release providing production stability and security patches
FROM node:22-alpine

# Set metadata labels for container documentation and management
LABEL maintainer="Tutorial Authors"
LABEL description="Production-ready Node.js tutorial backend with Express.js 5.1.0"
LABEL version="1.0.0"
LABEL app.name="nodejs-hello-tutorial-backend"
LABEL app.component="backend"
LABEL app.version="1.0.0"

# Install security updates and essential packages
# curl is needed for health checks, dumb-init provides proper signal handling
RUN apk update && apk upgrade && \
    apk add --no-cache \
        curl \
        dumb-init \
    && rm -rf /var/cache/apk/*

# Create application directory with proper permissions
WORKDIR /usr/src/app

# Create non-root user for security
# Using the built-in 'node' user from the Node.js Alpine image
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy package files first for efficient Docker layer caching
# This enables Docker to cache npm install step when only code changes
COPY package*.json ./

# Install only production dependencies with npm ci for reproducible builds
# --only=production excludes devDependencies
# --ci ensures clean install using package-lock.json
RUN npm ci --only=production --no-audit --no-fund && \
    npm cache clean --force

# Copy application source code
# Use .dockerignore to exclude unnecessary files
COPY . .

# Set proper file ownership and permissions for security
# Ensure the node user owns the application directory
RUN chown -R node:node /usr/src/app && \
    chmod -R 755 /usr/src/app

# Switch to non-root user for security
USER node

# Set environment variables for production configuration
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
ENV LOG_LEVEL=info
ENV APP_NAME=nodejs-hello-tutorial
ENV APP_VERSION=1.0.0

# Expose port 3000 for HTTP traffic
# This is the default port as defined in the application configuration
EXPOSE 3000

# Configure health check to verify application readiness
# Points to the /hello endpoint as specified in F-002 requirements
# --start-period allows time for application startup
# --interval=30s checks health every 30 seconds
# --timeout=3s allows 3 seconds for response
# --retries=3 allows 3 consecutive failures before marking unhealthy
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3000/hello || exit 1

# Use dumb-init to handle signals properly and prevent zombie processes
# Start the application using npm start script defined in package.json
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["npm", "start"]