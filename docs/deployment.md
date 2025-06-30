# Node.js Tutorial Backend - Deployment Guide

Comprehensive deployment documentation for the Node.js tutorial application covering local development, containerized environments, automation scripts, reverse proxy configuration, and process management. This guide supports both educational learning and production-ready deployments.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Local Development Deployment](#local-development-deployment)
4. [Docker Containerized Deployment](#docker-containerized-deployment)
5. [Docker Compose Orchestration](#docker-compose-orchestration)
6. [Automation Scripts](#automation-scripts)
7. [Reverse Proxy with Nginx](#reverse-proxy-with-nginx)
8. [Process Management with PM2](#process-management-with-pm2)
9. [Cloud and CI/CD References](#cloud-and-ci-cd-references)
10. [Troubleshooting](#troubleshooting)
11. [Best Practices](#best-practices)

## Overview

This documentation covers all deployment scenarios for the Node.js tutorial backend application, from local development to production-ready containerized deployments. The application features:

- **Express.js v5.1.0** HTTP server with `/hello` endpoint
- **Node.js v22.x LTS** runtime environment
- **Production-ready** configuration and monitoring
- **Educational focus** with comprehensive documentation
- **Multiple deployment strategies** for different environments

### Deployment Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Development   │    │   Containerized  │    │   Production    │
│                 │    │                  │    │                 │
│ • Node.js       │    │ • Docker         │    │ • Cloud VM      │
│ • npm scripts   │    │ • Docker Compose │    │ • Kubernetes    │
│ • Hot reload    │    │ • Health checks  │    │ • Load balancer │
│ • Local only    │    │ • Log aggregation│    │ • Auto-scaling  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Prerequisites

### System Requirements

| Component | Requirement | Purpose |
|-----------|-------------|---------|
| **Node.js** | ≥18.0.0 (recommended: v22.11.0 LTS) | JavaScript runtime environment |
| **npm** | ≥9.0.0 (bundled with Node.js) | Package manager |
| **Docker** | ≥20.10 (optional) | Container runtime |
| **Docker Compose** | ≥1.29 (optional) | Container orchestration |

### Installation

```bash
# Check current versions
node --version
npm --version
docker --version
docker-compose --version

# Install Node.js v22.x LTS (recommended)
# Visit: https://nodejs.org/

# Install Docker (optional, for containerization)
# Visit: https://docs.docker.com/get-docker/
```

### Project Structure

```
nodejs-tutorial-backend/
├── src/backend/                 # Application source code
│   ├── server.js               # HTTP server entry point
│   ├── app.js                  # Express app configuration
│   ├── package.json            # Dependencies and scripts
│   ├── .env.example           # Environment template
│   └── .env                   # Runtime environment variables
├── infrastructure/
│   ├── docker/
│   │   ├── Dockerfile         # Container build instructions
│   │   └── docker-compose.yml # Multi-container orchestration
│   ├── scripts/
│   │   ├── setup.sh           # Environment setup automation
│   │   └── deploy.sh          # Deployment automation
│   └── config/
│       ├── nginx.conf         # Reverse proxy configuration
│       └── pm2.config.js      # Process manager configuration
└── docs/
    └── deployment.md          # This documentation file
```

## Local Development Deployment

### Quick Start

The simplest way to run the application locally using Node.js directly:

```bash
# 1. Clone and navigate to project
cd nodejs-tutorial-backend

# 2. Automated setup (recommended)
./infrastructure/scripts/setup.sh

# 3. Start the application
cd src/backend
npm start
```

### Manual Setup

If you prefer manual setup or need to understand each step:

```bash
# 1. Validate Node.js and npm versions
node --version  # Should be ≥18.0.0
npm --version   # Should be ≥9.0.0

# 2. Navigate to backend directory
cd src/backend

# 3. Install dependencies
npm ci  # Use npm ci for reproducible builds

# 4. Copy environment configuration
cp .env.example .env

# 5. Customize environment variables (optional)
nano .env
```

### Environment Configuration

The `.env` file contains runtime configuration:

```bash
# HTTP Server Configuration
NODE_ENV=development
PORT=3000
HOST=localhost

# Logging Configuration
LOG_LEVEL=info
DEBUG=

# Development Features
VERBOSE_ERRORS=true
API_DOCUMENTATION_ENABLED=true
```

### Running the Application

```bash
# Production mode
npm start

# Development mode (with hot-reload)
npm run dev

# Background process with PM2
pm2 start infrastructure/config/pm2.config.js

# Custom port
PORT=3001 npm start
```

### Testing Local Deployment

```bash
# Test the hello endpoint
curl http://localhost:3000/hello
# Expected: Hello world

# Check application health
curl http://localhost:3000/health
# Expected: JSON health status

# Load testing (optional)
ab -n 100 -c 10 http://localhost:3000/hello
```

### Development Workflow

```bash
# Install development dependencies
npm install

# Run tests
npm test

# Code quality checks
npm run lint

# Watch for changes (nodemon)
npm run dev
```

## Docker Containerized Deployment

### Container Features

The provided Dockerfile creates a production-ready container with:

- **Node.js v22.11.0 LTS** runtime
- **Non-root user** execution for security
- **Health checks** for container orchestration
- **Signal handling** for graceful shutdown
- **Optimized layers** for efficient builds

### Building the Docker Image

```bash
# Build with default settings
docker build -t nodejs-tutorial-backend -f infrastructure/docker/Dockerfile .

# Build with custom tag
docker build -t nodejs-tutorial-backend:v1.0.0 -f infrastructure/docker/Dockerfile .

# Build for production (optimization)
docker build --target production -t nodejs-tutorial-backend:prod .

# No-cache build (fresh dependencies)
docker build --no-cache -t nodejs-tutorial-backend .
```

### Running the Container

```bash
# Basic container run
docker run -p 3000:3000 nodejs-tutorial-backend

# With environment variables
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e HOST=0.0.0.0 \
  nodejs-tutorial-backend

# With volume mounts (development)
docker run -p 3000:3000 \
  -v $(pwd)/src/backend:/usr/src/app \
  -v $(pwd)/src/backend/.env:/usr/src/app/.env \
  nodejs-tutorial-backend

# Background (daemon) mode
docker run -d -p 3000:3000 --name tutorial-backend nodejs-tutorial-backend
```

### Container Management

```bash
# View container logs
docker logs tutorial-backend

# Follow log output
docker logs -f tutorial-backend

# Execute commands in container
docker exec -it tutorial-backend bash

# Health check status
docker inspect tutorial-backend | grep -A 10 Health

# Container resource usage
docker stats tutorial-backend

# Stop and remove container
docker stop tutorial-backend
docker rm tutorial-backend
```

### Container Health Monitoring

The container includes built-in health checks:

```bash
# Check health status
docker ps  # Shows health status in status column

# Manual health check
docker exec tutorial-backend curl -f http://localhost:3000/health
```

## Docker Compose Orchestration

### Compose Configuration Features

The `docker-compose.yml` provides:

- **Single-command deployment** with dependencies
- **Environment variable management** via `.env` files
- **Development volume mounts** for hot-reloading
- **Health checks** and automatic restarts
- **Resource limits** and logging configuration

### Starting Services

```bash
# Start all services
docker-compose -f infrastructure/docker/docker-compose.yml up

# Start in background
docker-compose -f infrastructure/docker/docker-compose.yml up -d

# Build and start
docker-compose -f infrastructure/docker/docker-compose.yml up --build

# Start specific service
docker-compose -f infrastructure/docker/docker-compose.yml up backend
```

### Service Management

```bash
# View service status
docker-compose -f infrastructure/docker/docker-compose.yml ps

# View service logs
docker-compose -f infrastructure/docker/docker-compose.yml logs backend

# Follow logs in real-time
docker-compose -f infrastructure/docker/docker-compose.yml logs -f

# Restart services
docker-compose -f infrastructure/docker/docker-compose.yml restart

# Scale services (cluster mode)
docker-compose -f infrastructure/docker/docker-compose.yml up -d --scale backend=3

# Execute commands in service
docker-compose -f infrastructure/docker/docker-compose.yml exec backend bash
```

### Environment Overrides

Create environment-specific compose files:

```bash
# Development (default)
docker-compose up

# Production override
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

# Testing environment
docker-compose -f docker-compose.yml -f docker-compose.test.yml up
```

### Stopping and Cleanup

```bash
# Stop services
docker-compose -f infrastructure/docker/docker-compose.yml stop

# Stop and remove containers
docker-compose -f infrastructure/docker/docker-compose.yml down

# Remove containers and volumes
docker-compose -f infrastructure/docker/docker-compose.yml down -v

# Remove containers, volumes, and images
docker-compose -f infrastructure/docker/docker-compose.yml down -v --rmi all
```

## Automation Scripts

### Setup Script (`setup.sh`)

Automates environment preparation and validation:

```bash
# Full setup with validation
./infrastructure/scripts/setup.sh

# Verbose output for debugging
./infrastructure/scripts/setup.sh --verbose

# Skip Docker checks (development only)
./infrastructure/scripts/setup.sh --skip-docker

# Force dependency reinstallation
./infrastructure/scripts/setup.sh --force-install

# Version checks only
./infrastructure/scripts/setup.sh --check-only
```

**Setup Script Features:**
- Node.js and npm version validation
- Docker and Docker Compose availability checks
- Project structure validation
- Dependency installation with `npm ci`
- Environment file creation from template
- Basic health checks and configuration validation

### Deployment Script (`deploy.sh`)

Orchestrates end-to-end deployment automation:

```bash
# Local Node.js deployment
./infrastructure/scripts/deploy.sh

# Docker containerized deployment
./infrastructure/scripts/deploy.sh --docker

# Full deployment with monitoring
./infrastructure/scripts/deploy.sh --docker --monitoring

# Force image rebuild
./infrastructure/scripts/deploy.sh --docker --rebuild

# Verbose deployment output
./infrastructure/scripts/deploy.sh --docker --verbose

# Teardown deployment
./infrastructure/scripts/deploy.sh --teardown
```

**Deployment Script Features:**
- Environment setup and prerequisite validation
- Docker image building and optimization
- Container orchestration with health checks
- Service readiness validation and monitoring
- Comprehensive logging and error handling
- Deployment success reporting with access points

### Script Integration

```bash
# CI/CD pipeline integration
./infrastructure/scripts/setup.sh --check-only
./infrastructure/scripts/deploy.sh --docker --skip-setup

# Development workflow
./infrastructure/scripts/setup.sh --verbose
./infrastructure/scripts/deploy.sh --docker --monitoring

# Production deployment
NODE_ENV=production ./infrastructure/scripts/deploy.sh --docker
```

## Reverse Proxy with Nginx

### Nginx Configuration Features

The provided `nginx.conf` implements:

- **HTTP request proxying** to Node.js backend
- **WebSocket and HTTP/1.1 upgrade** support
- **Security headers** protection against common vulnerabilities
- **Static error page handling** for graceful degradation
- **Performance optimization** with timeouts and buffering
- **Health check endpoints** for monitoring

### Nginx Deployment

```bash
# Install Nginx (Ubuntu/Debian)
sudo apt update && sudo apt install nginx

# Install Nginx (CentOS/RHEL)
sudo yum install nginx

# Install Nginx (macOS)
brew install nginx
```

### Configuration Setup

```bash
# Copy configuration file
sudo cp infrastructure/config/nginx.conf /etc/nginx/nginx.conf

# Test configuration
sudo nginx -t

# Start Nginx service
sudo systemctl start nginx
sudo systemctl enable nginx

# Reload configuration
sudo systemctl reload nginx
```

### Docker Nginx Deployment

```bash
# Run Nginx with custom configuration
docker run -d \
  -p 80:80 \
  -v $(pwd)/infrastructure/config/nginx.conf:/etc/nginx/nginx.conf \
  -v $(pwd)/html:/usr/share/nginx/html \
  --name nginx-proxy \
  nginx:1.22-alpine

# With Docker Compose
version: '3.8'
services:
  nginx:
    image: nginx:1.22-alpine
    ports:
      - "80:80"
    volumes:
      - ./infrastructure/config/nginx.conf:/etc/nginx/nginx.conf
      - ./html:/usr/share/nginx/html
    depends_on:
      - backend
```

### Nginx Features

**Security Headers:**
```nginx
# MIME type sniffing protection
X-Content-Type-Options: nosniff

# Clickjacking protection
X-Frame-Options: SAMEORIGIN

# XSS protection
X-XSS-Protection: 1; mode=block

# Referrer policy
Referrer-Policy: strict-origin-when-cross-origin
```

**Performance Optimization:**
- Connection keep-alive and reuse
- Request/response buffering
- Upstream connection pooling
- Static file caching
- Gzip compression (configurable)

**Monitoring and Logging:**
```bash
# Access logs
tail -f /var/log/nginx/tutorial_access.log

# Error logs
tail -f /var/log/nginx/tutorial_error.log

# Nginx health check
curl http://localhost/nginx-health
```

## Process Management with PM2

### PM2 Configuration Features

The `pm2.config.js` provides:

- **Process lifecycle management** with automatic restarts
- **Environment-specific configurations** (development/production)
- **Centralized logging** with file rotation
- **Clustering support** for multi-core utilization
- **Zero-downtime deployments** and graceful shutdowns
- **Resource monitoring** and limits

### PM2 Installation

```bash
# Global installation
npm install -g pm2@^5.3.0

# Verify installation
pm2 --version

# Setup PM2 startup script
pm2 startup
```

### PM2 Deployment

```bash
# Start application
pm2 start infrastructure/config/pm2.config.js

# Start with production environment
pm2 start infrastructure/config/pm2.config.js --env production

# Start specific number of instances
pm2 start infrastructure/config/pm2.config.js -i 4
```

### PM2 Management

```bash
# List all processes
pm2 list

# Monitor processes in real-time
pm2 monit

# View logs
pm2 logs nodejs-tutorial-backend

# View specific log types
pm2 logs nodejs-tutorial-backend --err  # Error logs only
pm2 logs nodejs-tutorial-backend --out  # Output logs only

# Restart application
pm2 restart nodejs-tutorial-backend

# Reload application (zero-downtime)
pm2 reload nodejs-tutorial-backend

# Stop application
pm2 stop nodejs-tutorial-backend

# Delete application
pm2 delete nodejs-tutorial-backend
```

### PM2 Advanced Features

**Clustering Mode:**
```javascript
// Modify pm2.config.js for production scaling
{
  instances: 'max',        // Use all CPU cores
  exec_mode: 'cluster',    // Enable load balancing
  max_memory_restart: '1G' // Increase memory limit
}
```

**Log Management:**
```bash
# Log rotation
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true

# Flush logs
pm2 flush
```

**Process Persistence:**
```bash
# Save current process list
pm2 save

# Restore processes after reboot
pm2 resurrect

# Generate startup script
pm2 startup
```

### PM2 Monitoring

```bash
# Real-time monitoring dashboard
pm2 monit

# Process information
pm2 show nodejs-tutorial-backend

# Memory and CPU usage
pm2 list

# Application metrics
pm2 web  # Web-based monitoring (port 9615)
```

## Cloud and CI/CD References

### Infrastructure as Code

For production deployments beyond the tutorial scope, refer to:

**Terraform Deployment:**
- Configuration: `infrastructure/terraform/main.tf`
- Variables: `infrastructure/terraform/variables.tf`
- Outputs: `infrastructure/terraform/outputs.tf`

**Kubernetes Deployment:**
- Deployment: `infrastructure/kubernetes/deployment.yaml`
- Service: `infrastructure/kubernetes/service.yaml`
- Ingress: `infrastructure/kubernetes/ingress.yaml`

### CI/CD Integration

**GitHub Actions Workflow:**
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      
      - name: Setup environment
        run: ./infrastructure/scripts/setup.sh --check-only
      
      - name: Run tests
        run: |
          cd src/backend
          npm test
      
      - name: Deploy with Docker
        run: ./infrastructure/scripts/deploy.sh --docker --skip-setup
```

### Cloud Platform Deployment

**Docker Hub Integration:**
```bash
# Build and tag for registry
docker build -t username/nodejs-tutorial-backend:latest .

# Push to Docker Hub
docker push username/nodejs-tutorial-backend:latest

# Deploy from registry
docker run -p 3000:3000 username/nodejs-tutorial-backend:latest
```

**Cloud VM Deployment:**
```bash
# Using deploy script on cloud VM
ssh user@cloud-vm
git clone https://github.com/username/nodejs-tutorial.git
cd nodejs-tutorial
./infrastructure/scripts/setup.sh
./infrastructure/scripts/deploy.sh --docker
```

**Container Orchestration:**
```bash
# Kubernetes deployment
kubectl apply -f infrastructure/kubernetes/

# Docker Swarm deployment
docker stack deploy -c docker-compose.yml tutorial-stack
```

## Troubleshooting

### Common Issues and Solutions

**Port Already in Use:**
```bash
# Find process using port 3000
lsof -i :3000          # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>

# Use different port
PORT=3001 npm start
```

**Docker Build Failures:**
```bash
# Clear Docker cache
docker system prune -a

# Build without cache
docker build --no-cache -t nodejs-tutorial-backend .

# Check build context
docker build --progress=plain -t nodejs-tutorial-backend .
```

**Container Network Issues:**
```bash
# Check container networking
docker network ls
docker inspect <container_name>

# Test container connectivity
docker exec -it <container> curl http://localhost:3000/health

# Check port mapping
docker port <container>
```

**PM2 Process Issues:**
```bash
# Check PM2 status
pm2 status

# View detailed process information
pm2 show nodejs-tutorial-backend

# Check PM2 logs
pm2 logs --err

# Reset PM2 process list
pm2 kill
pm2 start infrastructure/config/pm2.config.js
```

**Nginx Configuration Errors:**
```bash
# Test Nginx configuration
sudo nginx -t

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Verify upstream backend
curl http://localhost:3000/health

# Check Nginx access logs
sudo tail -f /var/log/nginx/access.log
```

**Environment Variable Issues:**
```bash
# Check environment variables
printenv | grep NODE

# Validate .env file format
cat src/backend/.env

# Test configuration loading
node -e "require('dotenv').config(); console.log(process.env.PORT)"
```

**Dependency Problems:**
```bash
# Clear npm cache
npm cache clean --force

# Remove and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Use exact versions
npm ci

# Check for security vulnerabilities
npm audit
npm audit fix
```

### Debugging Techniques

**Application Debugging:**
```bash
# Enable debug output
DEBUG=* npm start

# Node.js inspector
node --inspect server.js

# Memory usage monitoring
node --expose-gc --inspect server.js
```

**Container Debugging:**
```bash
# Interactive container debugging
docker run -it --entrypoint bash nodejs-tutorial-backend

# Container resource monitoring
docker stats

# Container file system inspection
docker exec -it <container> ls -la /usr/src/app
```

**Network Debugging:**
```bash
# Test connectivity
curl -v http://localhost:3000/hello

# Check DNS resolution
nslookup localhost

# Network troubleshooting
netstat -tulpn | grep :3000
ss -tulpn | grep :3000
```

## Best Practices

### Development Best Practices

**Environment Management:**
- Use `.env.example` as template for configuration
- Never commit sensitive data in `.env` files
- Use different environments for dev/staging/production
- Validate environment variables at startup

**Code Quality:**
```bash
# Use linting and formatting
npm run lint
npm run format

# Run tests before deployment
npm test
npm run test:coverage

# Security auditing
npm audit
npm run security-check
```

**Version Control:**
```bash
# Commit package-lock.json for reproducible builds
git add package-lock.json

# Use semantic versioning for releases
git tag v1.0.0

# Document changes in deployment
git commit -m "deploy: update to Node.js v22.x LTS"
```

### Production Best Practices

**Security:**
- Run containers as non-root users
- Use security headers in Nginx configuration
- Regularly update base images and dependencies
- Implement rate limiting and request validation
- Use secrets management for sensitive configuration

**Performance:**
- Enable clustering with PM2 for multi-core utilization
- Implement caching strategies for static content
- Use connection pooling for database connections
- Monitor memory usage and implement limits
- Optimize Docker images with multi-stage builds

**Monitoring and Observability:**
- Implement structured logging with correlation IDs
- Set up health checks for all services
- Monitor application metrics and performance
- Implement alerting for critical failures
- Use distributed tracing for complex deployments

**High Availability:**
- Deploy multiple instances behind load balancer
- Implement graceful shutdown handling
- Use rolling updates for zero-downtime deployments
- Configure automatic restarts and failover
- Test disaster recovery procedures

### Deployment Best Practices

**Infrastructure as Code:**
- Version control all configuration files
- Use declarative configuration over imperative scripts
- Implement immutable infrastructure patterns
- Test infrastructure changes in staging environment

**CI/CD Pipeline:**
- Automate testing and deployment processes
- Use feature flags for gradual rollouts
- Implement automated rollback mechanisms
- Monitor deployment success metrics

**Resource Management:**
- Set appropriate resource limits and requests
- Monitor resource utilization and scaling needs
- Implement cost optimization strategies
- Use appropriate instance sizes for workloads

---

## Conclusion

This deployment guide provides comprehensive coverage of deploying the Node.js tutorial backend application across various environments and scenarios. From local development to production-ready containerized deployments, each approach is documented with clear instructions, automation scripts, and best practices.

Key deployment strategies covered:

1. **Local Development** - Quick setup with Node.js and npm
2. **Docker Containers** - Isolated, reproducible deployments
3. **Docker Compose** - Multi-service orchestration with monitoring
4. **Automation Scripts** - One-command setup and deployment
5. **Reverse Proxy** - Production-ready request routing with Nginx
6. **Process Management** - Robust application lifecycle with PM2

For advanced deployment scenarios including cloud platforms, Kubernetes orchestration, and CI/CD automation, refer to the additional documentation in `docs/infrastructure.md` and `docs/architecture.md`.

The modular approach ensures you can start simple with local development and progressively adopt more sophisticated deployment strategies as your application and infrastructure requirements evolve.