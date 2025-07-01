# Deployment Guide

## Node.js/Express.js Hello World Tutorial Application

This comprehensive deployment guide provides step-by-step instructions for deploying the Node.js/Express.js Hello World tutorial application across multiple environments. The guide covers local development, containerized deployment, cloud platforms, and production-ready configurations with monitoring and observability.

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Local Deployment](#local-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Docker Compose Deployment](#docker-compose-deployment)
6. [Cloud Deployment](#cloud-deployment)
7. [Healthcheck and Monitoring](#healthcheck-and-monitoring)
8. [Disaster Recovery](#disaster-recovery)
9. [Troubleshooting](#troubleshooting)
10. [References](#references)

## Introduction

The Node.js/Express.js Hello World tutorial application demonstrates fundamental HTTP server concepts using modern web technologies. This deployment guide ensures reproducible, robust, and observable deployments suitable for educational purposes, development environments, and production demonstrations.

### Deployment Options Overview

| Deployment Type | Complexity | Use Case | Infrastructure |
|---|---|---|---|
| Local Development | Simple | Learning and development | Node.js + npm |
| Docker Container | Medium | Portable deployment | Docker |
| Docker Compose Stack | Advanced | Production-like setup | Multi-container orchestration |
| Cloud Platforms | Variable | Scalable deployment | Managed cloud services |

### Architecture Overview

The application follows a layered architecture optimized for educational demonstration:

- **Runtime Layer**: Node.js 18+ with V8 JavaScript engine
- **Framework Layer**: Express.js 5.1.0 with enhanced security features
- **Application Layer**: Single `/hello` endpoint returning "Hello world"
- **Infrastructure Layer**: NGINX reverse proxy, Prometheus monitoring, Grafana visualization

## Prerequisites

### System Requirements

**Minimum Requirements:**
- RAM: 512MB available
- CPU: 1 core
- Storage: 2GB free space
- Network: Internet connectivity for dependency installation

**Recommended Requirements:**
- RAM: 2GB available
- CPU: 2+ cores
- Storage: 5GB free space
- Network: Broadband internet connection

### Required Software

#### For Local Deployment

```bash
# Node.js 18+ and npm 8+
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 8.0.0
```

**Installation Instructions:**

**Windows:**
```powershell
# Download from nodejs.org or use Chocolatey
choco install nodejs
```

**macOS:**
```bash
# Using Homebrew
brew install node
```

**Linux (Ubuntu/Debian):**
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### For Docker Deployment

```bash
# Docker Engine 20+ with BuildKit support
docker --version  # Should be >= 20.10.0

# Docker Compose 1.29+ or Compose V2
docker-compose --version  # Should be >= 1.29.0
```

**Installation Instructions:**

**Windows:**
```powershell
# Download Docker Desktop from docker.com
# Includes Docker Engine and Docker Compose
```

**macOS:**
```bash
# Using Homebrew
brew install --cask docker
```

**Linux:**
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

#### Additional Tools

```bash
# curl for health check verification (7.68+)
curl --version

# git for repository cloning
git --version
```

## Local Deployment

Local deployment provides the simplest setup for development and learning purposes using Node.js and npm directly.

### Step 1: Repository Setup

```bash
# Clone the repository
git clone <repository-url>
cd nodejs-hello-world-tutorial

# Navigate to backend directory
cd src/backend
```

### Step 2: Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables (optional)
nano .env
```

**Environment Variables:**
```bash
# .env file configuration
PORT=3000                # Server port (default: 3000)
NODE_ENV=development     # Environment mode
```

### Step 3: Dependency Installation

```bash
# Install production dependencies
npm install

# Verify installation
npm ls
```

**Package.json Scripts Overview:**
```json
{
  "scripts": {
    "start": "node ./scripts/start.js",      # Production start
    "dev": "nodemon ./scripts/start.js",     # Development with auto-reload
    "test": "node ./scripts/test.js",        # Run tests
    "lint": "eslint . --ext .js"             # Code linting
  }
}
```

### Step 4: Application Startup

```bash
# Start the server (production mode)
npm start

# OR start in development mode with auto-reload
npm run dev
```

**Expected Output:**
```
[INFO] 2024-01-01 12:00:00 - Server starting...
[INFO] 2024-01-01 12:00:00 - Environment: development
[INFO] 2024-01-01 12:00:00 - Server running on port 3000
[SUCCESS] 2024-01-01 12:00:00 - Node.js/Express.js server ready!
```

### Step 5: Verification and Testing

```bash
# Test the hello endpoint
curl http://localhost:3000/hello
# Expected response: Hello world

# Check health endpoint
curl http://localhost:3000/health
# Expected response: {"status":"healthy","uptime":123.45,"timestamp":"2024-01-01T12:00:00.000Z"}

# Check application in browser
open http://localhost:3000/hello
```

### Local Development Commands

```bash
# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Generate test coverage report
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Stop the server
# Press Ctrl+C in the terminal
```

### Local Deployment Troubleshooting

**Port Already in Use:**
```bash
# Check what's using port 3000
lsof -i :3000

# Kill process using port
kill -9 <PID>

# OR use different port
PORT=3001 npm start
```

**Module Not Found Errors:**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Docker Deployment

Docker deployment provides containerized isolation and portability, ideal for consistent environments across different systems.

### Step 1: Docker Environment Setup

```bash
# Verify Docker installation
docker --version
docker info

# Enable BuildKit for optimized builds
export DOCKER_BUILDKIT=1
```

### Step 2: Container Image Building

```bash
# Navigate to backend directory
cd src/backend

# Build Docker image
docker build -t hello-backend .

# Verify image creation
docker images | grep hello-backend
```

**Multi-stage Build Options:**
```bash
# Production build (default)
docker build -t hello-backend:latest .

# Test build with devDependencies
docker build --target test -t hello-backend:test .

# Development build
docker build --build-arg NODE_ENV=development -t hello-backend:dev .
```

### Step 3: Container Configuration

**Environment File Setup:**
```bash
# Create production environment file
cp .env.example .env.production

# Edit production settings
echo "NODE_ENV=production" >> .env.production
echo "PORT=3000" >> .env.production
```

### Step 4: Container Execution

```bash
# Run container with default settings
docker run -p 3000:3000 hello-backend

# Run with environment file
docker run -p 3000:3000 --env-file .env.production hello-backend

# Run with custom environment variables
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  hello-backend

# Run in background (detached mode)
docker run -d -p 3000:3000 --name hello-backend-container hello-backend
```

### Step 5: Container Management

```bash
# Check container status
docker ps

# View container logs
docker logs hello-backend-container

# Follow logs in real-time
docker logs -f hello-backend-container

# Execute commands in running container
docker exec -it hello-backend-container sh

# Stop container
docker stop hello-backend-container

# Remove container
docker rm hello-backend-container
```

### Step 6: Docker Health Checks

```bash
# Check container health status
docker inspect --format='{{.State.Health.Status}}' hello-backend-container

# View health check logs
docker inspect --format='{{json .State.Health}}' hello-backend-container | jq
```

### Docker Deployment Verification

```bash
# Test application endpoints
curl http://localhost:3000/hello
curl http://localhost:3000/health

# Monitor container resource usage
docker stats hello-backend-container

# Inspect container configuration
docker inspect hello-backend-container
```

### Docker Best Practices

**Security Considerations:**
- Container runs as non-root user (nodejs:nodejs)
- Minimal Alpine Linux base image
- Multi-stage build for production optimization
- Health checks for monitoring integration

**Performance Optimization:**
```bash
# Build with cache optimization
docker build --cache-from hello-backend:latest -t hello-backend:latest .

# Run with resource limits
docker run -p 3000:3000 \
  --memory=256m \
  --cpus=0.5 \
  hello-backend
```

## Docker Compose Deployment

Docker Compose deployment orchestrates a complete production-like environment with NGINX reverse proxy, Prometheus monitoring, and Grafana visualization.

### Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   HTTP Client   │───▶│      NGINX      │───▶│    Backend      │
│   (Port 80)     │    │  Reverse Proxy  │    │   (Port 3000)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Grafana     │◀───│   Prometheus    │◀───│   Metrics       │
│   (Port 3001)   │    │   (Port 9090)   │    │   Collection    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Step 1: Infrastructure Setup

```bash
# Navigate to project root
cd /path/to/nodejs-hello-world-tutorial

# Verify Docker Compose file
ls infrastructure/docker-compose.yml

# Validate compose configuration
docker-compose -f infrastructure/docker-compose.yml config
```

### Step 2: Automated Deployment

**Using Deployment Script (Recommended):**
```bash
# Navigate to infrastructure directory
cd infrastructure

# Make deployment script executable
chmod +x scripts/deploy.sh

# Run automated deployment
./scripts/deploy.sh

# With custom options
./scripts/deploy.sh --env production --backup --verbose
```

**Manual Docker Compose Commands:**
```bash
# Build and start all services
docker-compose -f infrastructure/docker-compose.yml up --build -d

# Check service status
docker-compose -f infrastructure/docker-compose.yml ps

# Follow logs for all services
docker-compose -f infrastructure/docker-compose.yml logs -f
```

### Step 3: Service Configuration

**Backend Service:**
- **Image**: Built from `src/backend/Dockerfile`
- **Port**: 3000 (internal), exposed for direct access
- **Health Check**: `/health` endpoint with 30s intervals
- **Environment**: Production-optimized Node.js configuration

**NGINX Service:**
- **Image**: `nginx:latest`
- **Port**: 80 (HTTP entry point)
- **Configuration**: Custom `nginx.conf` with security headers
- **Upstream**: Proxies to backend service

**Prometheus Service:**
- **Image**: `prom/prometheus:latest`
- **Port**: 9090 (metrics collection)
- **Configuration**: `prometheus.yml` with backend scraping
- **Storage**: Persistent volume for metrics data

**Grafana Service:**
- **Image**: `grafana/grafana:10.4.2`
- **Port**: 3001 (visualization interface)
- **Credentials**: admin/admin (change after first login)
- **Storage**: Persistent volume for dashboards

### Step 4: Service Health Verification

```bash
# Check all service health
curl http://localhost/health      # NGINX → Backend health
curl http://localhost:9090/-/healthy    # Prometheus health
curl http://localhost:3001/api/health   # Grafana health

# Automated health check script
cat << 'EOF' > health_check.sh
#!/bin/bash
services=("http://localhost/health" "http://localhost:9090/-/healthy" "http://localhost:3001/api/health")
for service in "${services[@]}"; do
  if curl -f -s "$service" > /dev/null; then
    echo "✅ $service - Healthy"
  else
    echo "❌ $service - Unhealthy"
  fi
done
EOF
chmod +x health_check.sh
./health_check.sh
```

### Step 5: Access and Testing

**Application Access:**
```bash
# Main application (via NGINX)
curl http://localhost/hello
# Response: Hello world

# Health check (via NGINX)
curl http://localhost/health
# Response: {"status":"healthy",...}

# Direct backend access (development only)
curl http://localhost:3000/hello
```

**Monitoring Access:**
```bash
# Open Prometheus in browser
open http://localhost:9090

# Open Grafana in browser
open http://localhost:3001
# Login: admin/admin
```

### Step 6: Service Management

```bash
# View service logs
docker-compose -f infrastructure/docker-compose.yml logs backend
docker-compose -f infrastructure/docker-compose.yml logs nginx
docker-compose -f infrastructure/docker-compose.yml logs prometheus
docker-compose -f infrastructure/docker-compose.yml logs grafana

# Restart specific service
docker-compose -f infrastructure/docker-compose.yml restart backend

# Scale backend service (advanced)
docker-compose -f infrastructure/docker-compose.yml up --scale backend=3

# Stop all services
docker-compose -f infrastructure/docker-compose.yml down

# Stop and remove volumes (complete cleanup)
docker-compose -f infrastructure/docker-compose.yml down -v
```

### Docker Compose Configuration Details

**Volume Management:**
```yaml
volumes:
  prometheus_data:    # Persistent metrics storage
  grafana_data:       # Persistent dashboard storage
```

**Network Configuration:**
```yaml
networks:
  nodejs-tutorial-network:
    driver: bridge    # Inter-service communication
```

**Environment Variables:**
```yaml
environment:
  - NODE_ENV=production
  - PORT=3000
  - GF_SECURITY_ADMIN_PASSWORD=admin
```

### Advanced Configuration

**Production Optimization:**
```bash
# Deploy with production settings
NODE_ENV=production docker-compose -f infrastructure/docker-compose.yml up -d

# Enable resource monitoring
docker stats

# Configure log rotation
docker-compose -f infrastructure/docker-compose.yml up -d \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3
```

## Cloud Deployment

Cloud deployment enables scalable, managed hosting on platforms like Render, Vercel, Railway, and other Node.js-compatible services.

### General Cloud Deployment Process

#### Step 1: Repository Preparation

```bash
# Ensure code is in version control
git add .
git commit -m "Prepare for cloud deployment"
git push origin main

# Verify package.json configuration
cat package.json | jq '.scripts.start'
# Should output: "node ./scripts/start.js"

# Verify engines specification
cat package.json | jq '.engines'
# Should specify Node.js 18+ and npm 8+
```

#### Step 2: Environment Configuration

**Cloud Platform Environment Variables:**
```bash
# Required for most cloud platforms
NODE_ENV=production
PORT=3000  # May be overridden by platform

# Optional optimization variables
NODE_OPTIONS=--max-old-space-size=1024
NPM_CONFIG_CACHE=/tmp/.npm
```

### Platform-Specific Deployment

#### Render Deployment

**Step 1: Platform Setup**
1. Connect GitHub/GitLab repository to Render
2. Select "Web Service" deployment type
3. Configure build and start commands

**Step 2: Service Configuration**
```yaml
# render.yaml (optional)
services:
  - type: web
    name: nodejs-hello-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        fromService:
          type: web
          name: nodejs-hello-backend
          property: port
```

**Step 3: Deploy and Verify**
```bash
# Automatic deployment triggers on git push
git push origin main

# Verify deployment
curl https://your-app-name.onrender.com/hello
```

#### Vercel Deployment

**Step 1: Platform Setup**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to project
cd nodejs-hello-world-tutorial/src/backend
```

**Step 2: Configuration**
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**Step 3: Deploy**
```bash
# Deploy to Vercel
vercel --prod

# Verify deployment
curl https://your-app-name.vercel.app/hello
```

#### Railway Deployment

**Step 1: Platform Setup**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project
railway init
```

**Step 2: Deploy**
```bash
# Deploy from repository
railway up

# Or connect GitHub repository through web interface
# Set environment variables in Railway dashboard
```

#### AWS App Runner / Google Cloud Run

**Step 1: Container Preparation**
```bash
# Build container for cloud deployment
docker build -t hello-backend:cloud .

# Push to container registry (example: AWS ECR)
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker tag hello-backend:cloud <account-id>.dkr.ecr.us-east-1.amazonaws.com/hello-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/hello-backend:latest
```

**Step 2: Service Configuration**
```yaml
# apprunner.yaml (AWS App Runner)
version: 1.0
runtime: docker
build:
  commands:
    build:
      - echo "Building the application"
run:
  runtime-version: latest
  command: node scripts/start.js
  network:
    port: 3000
    env: PORT
  env:
    - name: NODE_ENV
      value: production
```

### Cloud Deployment Best Practices

#### Security Configuration
```bash
# Use environment variables for sensitive data
# Never commit .env files to version control
echo ".env*" >> .gitignore

# Set secure environment variables in cloud platform
NODE_ENV=production
DATABASE_URL=postgresql://...  # If database added later
JWT_SECRET=your-secret-here    # If authentication added later
```

#### Performance Optimization
```bash
# Enable production optimizations in package.json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  },
  "scripts": {
    "build": "echo 'No build step required'",
    "start": "node scripts/start.js"
  }
}
```

#### Monitoring and Logging
```bash
# Many cloud platforms provide built-in monitoring
# Ensure health endpoint is accessible
curl https://your-app.platform.com/health

# Monitor logs through platform dashboard
# Or use platform CLI tools
railway logs
render logs
vercel logs
```

### Cloud Deployment Troubleshooting

**Common Issues:**

1. **Port Configuration:**
```bash
# Ensure app listens on platform-provided port
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

2. **Build Failures:**
```bash
# Check Node.js version compatibility
node --version  # Local version
# Compare with platform Node.js version

# Verify dependencies
npm audit
npm ls
```

3. **Health Check Failures:**
```bash
# Ensure health endpoint responds correctly
curl https://your-app.platform.com/health
# Should return 200 status with JSON response
```

## Healthcheck and Monitoring

Comprehensive monitoring ensures reliable operation and provides insights into application performance, system health, and potential issues.

### Health Check Implementation

#### Backend Health Endpoint

The application includes a dedicated health check endpoint at `/health`:

```javascript
// Health check response example
{
  "status": "healthy",
  "uptime": 3600.123,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "memory": {
    "rss": 45678592,
    "heapTotal": 29360128,
    "heapUsed": 18123456,
    "external": 1234567
  },
  "version": "1.0.0",
  "node_version": "18.17.0"
}
```

#### Health Check Commands

```bash
# Basic health check
curl http://localhost:3000/health

# Health check with verbose output
curl -v http://localhost:3000/health

# Health check via NGINX proxy
curl http://localhost/health

# Automated health monitoring script
cat << 'EOF' > monitor_health.sh
#!/bin/bash
while true; do
  timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  if response=$(curl -s -f http://localhost/health); then
    status=$(echo "$response" | jq -r '.status')
    uptime=$(echo "$response" | jq -r '.uptime')
    echo "[$timestamp] Status: $status, Uptime: ${uptime}s"
  else
    echo "[$timestamp] Health check failed"
  fi
  sleep 30
done
EOF
chmod +x monitor_health.sh
./monitor_health.sh
```

### Docker Health Checks

#### Container Health Monitoring

```bash
# Check container health status
docker inspect --format='{{.State.Health.Status}}' nodejs-hello-backend

# View health check history
docker inspect --format='{{json .State.Health.Log}}' nodejs-hello-backend | jq

# Watch health status changes
watch -n 5 'docker inspect --format="{{.State.Health.Status}}: {{.State.Health.FailingStreak}}" nodejs-hello-backend'
```

#### Docker Compose Health Monitoring

```bash
# Check all service health
docker-compose -f infrastructure/docker-compose.yml ps

# Monitor service health in real-time
watch -n 10 'docker-compose -f infrastructure/docker-compose.yml ps'

# Health check all services
services=("backend" "nginx" "prometheus" "grafana")
for service in "${services[@]}"; do
  status=$(docker-compose -f infrastructure/docker-compose.yml ps -q "$service" | xargs docker inspect --format='{{.State.Health.Status}}' 2>/dev/null || echo "unknown")
  echo "$service: $status"
done
```

### Prometheus Monitoring

#### Metrics Collection

**Prometheus Configuration:**
```yaml
# prometheus.yml excerpt
scrape_configs:
  - job_name: 'nodejs-backend'
    static_configs:
      - targets: ['backend:3000']
    metrics_path: '/metrics'
    scrape_interval: 15s
```

**Key Metrics Monitored:**
- HTTP request duration and rate
- Memory usage and garbage collection
- CPU utilization
- Active connections
- Error rates and status codes

#### Prometheus Queries

```bash
# Access Prometheus web interface
open http://localhost:9090

# Example PromQL queries:
# Request rate: rate(http_requests_total[5m])
# Error rate: rate(http_requests_total{status=~"5.."}[5m])
# Memory usage: nodejs_heap_size_used_bytes
# Response time: histogram_quantile(0.95, rate(http_request_duration_ms_bucket[5m]))
```

### Grafana Visualization

#### Dashboard Setup

```bash
# Access Grafana interface
open http://localhost:3001
# Login: admin/admin (change after first login)

# Pre-configured dashboard includes:
# - Request rate and response time graphs
# - Memory and CPU utilization
# - Error rate tracking
# - Service health status
# - System resource usage
```

#### Custom Dashboard Creation

1. **Add Prometheus Data Source:**
   - URL: `http://prometheus:9090`
   - Access: `Server (default)`

2. **Create Panels:**
   - Request Rate: `rate(http_requests_total[5m])`
   - Memory Usage: `nodejs_heap_size_used_bytes`
   - Response Time: `histogram_quantile(0.95, rate(http_request_duration_ms_bucket[5m]))`

3. **Configure Alerts:**
   - High error rate (>5%)
   - Memory usage >80%
   - Response time >1s

### NGINX Monitoring

#### Access Log Analysis

```bash
# View NGINX access logs
docker-compose -f infrastructure/docker-compose.yml logs nginx | grep "GET /hello"

# Real-time log monitoring
docker-compose -f infrastructure/docker-compose.yml logs -f nginx

# Access log format includes:
# - Client IP address
# - Request timestamp
# - HTTP method and path
# - Response status code
# - Response size
# - User agent
# - Response time
```

#### NGINX Metrics

```bash
# Check NGINX status
curl http://localhost/nginx_status  # If enabled

# Monitor NGINX process
docker exec -it nodejs-hello-nginx ps aux | grep nginx

# Check NGINX configuration
docker exec -it nodejs-hello-nginx nginx -t
```

### Performance Monitoring

#### Load Testing

```bash
# Simple load test with curl
for i in {1..100}; do
  curl -w "%{time_total}\n" -o /dev/null -s http://localhost/hello
done | sort -n | tail -10

# Apache Bench load testing
ab -n 1000 -c 10 http://localhost/hello

# wrk load testing
wrk -t12 -c400 -d30s http://localhost/hello
```

#### Resource Monitoring

```bash
# Monitor Docker container resources
docker stats

# System resource monitoring
htop
iotop
nethogs

# Memory usage tracking
free -h
cat /proc/meminfo

# Disk usage monitoring
df -h
du -sh /var/lib/docker
```

### Alerting Configuration

#### Prometheus Alerting Rules

```yaml
# alerts.yml
groups:
  - name: nodejs-tutorial
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} requests per second"

      - alert: HighMemoryUsage
        expr: nodejs_heap_size_used_bytes / nodejs_heap_size_total_bytes > 0.8
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value | humanizePercentage }}"
```

#### Grafana Alerts

1. **Configure Notification Channels:**
   - Email alerts
   - Slack integration
   - Webhook notifications

2. **Set Alert Thresholds:**
   - Response time > 1 second
   - Error rate > 5%
   - Memory usage > 80%
   - Service unavailable

### Monitoring Best Practices

#### Health Check Guidelines

```bash
# Health check endpoint requirements:
# - Fast response (<100ms)
# - No external dependencies
# - Clear status indication
# - Detailed error information
# - Version information
```

#### Log Management

```bash
# Structured logging format
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "level": "INFO",
  "message": "Request processed",
  "requestId": "req-12345",
  "method": "GET",
  "path": "/hello",
  "statusCode": 200,
  "duration": 45
}

# Log rotation configuration
docker-compose -f infrastructure/docker-compose.yml up -d \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3
```

## Disaster Recovery

Disaster recovery procedures ensure data protection, service continuity, and rapid recovery from failures or system issues.

### Backup Procedures

#### Automated Backup Script

The infrastructure includes a comprehensive backup script at `infrastructure/scripts/backup.sh`:

```bash
# Execute manual backup
cd infrastructure
./scripts/backup.sh

# Backup with verbose output
./scripts/backup.sh --verbose

# Backup specific components
./scripts/backup.sh --config-only
./scripts/backup.sh --data-only
```

#### Pre-Deployment Backup

```bash
# Enable automatic backup before deployment
BACKUP_BEFORE_DEPLOY=1 ./scripts/deploy.sh

# Deploy with backup flag
./scripts/deploy.sh --backup --env production
```

#### Backup Components

**Configuration Backup:**
```bash
# Backup all configuration files
backup_configs() {
  local backup_dir="backups/$(date +%Y%m%d_%H%M%S)"
  mkdir -p "$backup_dir"
  
  # Docker Compose configuration
  cp infrastructure/docker-compose.yml "$backup_dir/"
  
  # NGINX configuration
  cp infrastructure/nginx/nginx.conf "$backup_dir/"
  
  # Prometheus configuration
  cp infrastructure/monitoring/prometheus.yml "$backup_dir/"
  
  # Environment files
  cp src/backend/.env.example "$backup_dir/"
  
  # Application source
  tar -czf "$backup_dir/application.tar.gz" src/backend/
  
  echo "Configuration backup completed: $backup_dir"
}
```

**Data Backup:**
```bash
# Backup Docker volumes
backup_volumes() {
  local backup_dir="backups/$(date +%Y%m%d_%H%M%S)"
  mkdir -p "$backup_dir"
  
  # Prometheus data
  docker run --rm \
    -v infrastructure_prometheus_data:/source:ro \
    -v "$(pwd)/$backup_dir":/backup \
    alpine tar -czf /backup/prometheus_data.tar.gz -C /source .
  
  # Grafana data
  docker run --rm \
    -v infrastructure_grafana_data:/source:ro \
    -v "$(pwd)/$backup_dir":/backup \
    alpine tar -czf /backup/grafana_data.tar.gz -C /source .
  
  echo "Volume backup completed: $backup_dir"
}
```

### Recovery Procedures

#### Service Recovery

**Single Service Recovery:**
```bash
# Restart failed service
docker-compose -f infrastructure/docker-compose.yml restart backend

# Rebuild and restart service
docker-compose -f infrastructure/docker-compose.yml build backend
docker-compose -f infrastructure/docker-compose.yml up -d backend

# Check service health after restart
curl http://localhost/health
```

**Full Stack Recovery:**
```bash
# Complete stack restart
docker-compose -f infrastructure/docker-compose.yml down
docker-compose -f infrastructure/docker-compose.yml up -d

# Recovery with backup restoration
./scripts/backup.sh --restore backups/20240101_120000
./scripts/deploy.sh --env production
```

#### Configuration Recovery

```bash
# Restore configuration from backup
restore_config() {
  local backup_dir="$1"
  
  if [[ ! -d "$backup_dir" ]]; then
    echo "Error: Backup directory not found: $backup_dir"
    return 1
  fi
  
  # Stop services
  docker-compose -f infrastructure/docker-compose.yml down
  
  # Restore configuration files
  cp "$backup_dir/docker-compose.yml" infrastructure/
  cp "$backup_dir/nginx.conf" infrastructure/nginx/
  cp "$backup_dir/prometheus.yml" infrastructure/monitoring/
  
  # Restart services
  docker-compose -f infrastructure/docker-compose.yml up -d
  
  echo "Configuration restored from: $backup_dir"
}
```

#### Data Recovery

```bash
# Restore Docker volumes from backup
restore_volumes() {
  local backup_dir="$1"
  
  # Stop services that use volumes
  docker-compose -f infrastructure/docker-compose.yml stop prometheus grafana
  
  # Restore Prometheus data
  docker run --rm \
    -v infrastructure_prometheus_data:/target \
    -v "$(pwd)/$backup_dir":/backup \
    alpine tar -xzf /backup/prometheus_data.tar.gz -C /target
  
  # Restore Grafana data
  docker run --rm \
    -v infrastructure_grafana_data:/target \
    -v "$(pwd)/$backup_dir":/backup \
    alpine tar -xzf /backup/grafana_data.tar.gz -C /target
  
  # Restart services
  docker-compose -f infrastructure/docker-compose.yml start prometheus grafana
  
  echo "Volume data restored from: $backup_dir"
}
```

### Backup Schedule Automation

#### Cron Job Setup

```bash
# Create backup cron job
cat << 'EOF' > /etc/cron.d/nodejs-tutorial-backup
# Backup Node.js tutorial infrastructure daily at 2 AM
0 2 * * * root cd /path/to/nodejs-hello-world-tutorial && ./infrastructure/scripts/backup.sh --quiet
EOF

# Verify cron job
crontab -l | grep nodejs-tutorial
```

#### Backup Retention Policy

```bash
# Automated cleanup of old backups (keep last 7 days)
cleanup_old_backups() {
  local backup_base_dir="backups"
  local retention_days=7
  
  find "$backup_base_dir" -type d -name "20*" -mtime +$retention_days -exec rm -rf {} \;
  
  echo "Cleaned up backups older than $retention_days days"
}
```

### Disaster Recovery Testing

#### Recovery Test Procedures

```bash
# Monthly disaster recovery test
test_disaster_recovery() {
  echo "=== Disaster Recovery Test ==="
  
  # 1. Create backup
  echo "Creating test backup..."
  ./scripts/backup.sh --test
  
  # 2. Simulate failure
  echo "Simulating service failure..."
  docker-compose -f infrastructure/docker-compose.yml down -v
  
  # 3. Perform recovery
  echo "Performing recovery..."
  ./scripts/deploy.sh --backup
  
  # 4. Verify functionality
  echo "Verifying recovery..."
  for endpoint in "/hello" "/health"; do
    if curl -f "http://localhost$endpoint" > /dev/null 2>&1; then
      echo "✅ $endpoint - OK"
    else
      echo "❌ $endpoint - FAILED"
    fi
  done
  
  echo "Disaster recovery test completed"
}
```

#### Recovery Validation

```bash
# Comprehensive recovery validation
validate_recovery() {
  local validation_errors=0
  
  echo "=== Recovery Validation ==="
  
  # Check service availability
  services=("backend" "nginx" "prometheus" "grafana")
  for service in "${services[@]}"; do
    if docker-compose -f infrastructure/docker-compose.yml ps "$service" | grep -q "Up"; then
      echo "✅ Service $service is running"
    else
      echo "❌ Service $service is not running"
      ((validation_errors++))
    fi
  done
  
  # Check endpoint functionality
  endpoints=(
    "http://localhost/hello:Hello world"
    "http://localhost/health:healthy"
    "http://localhost:9090/-/healthy:Prometheus is Ready"
    "http://localhost:3001/api/health:ok"
  )
  
  for endpoint_check in "${endpoints[@]}"; do
    url="${endpoint_check%:*}"
    expected="${endpoint_check#*:}"
    
    if response=$(curl -s "$url") && echo "$response" | grep -q "$expected"; then
      echo "✅ Endpoint $url is functional"
    else
      echo "❌ Endpoint $url is not functional"
      ((validation_errors++))
    fi
  done
  
  # Check data integrity
  if curl -s "http://localhost:9090/api/v1/targets" | jq -e '.data.activeTargets | length > 0' > /dev/null; then
    echo "✅ Prometheus targets are configured"
  else
    echo "❌ Prometheus targets are missing"
    ((validation_errors++))
  fi
  
  if [[ $validation_errors -eq 0 ]]; then
    echo "🎉 Recovery validation successful"
    return 0
  else
    echo "⚠️  Recovery validation failed with $validation_errors errors"
    return 1
  fi
}
```

### Business Continuity Planning

#### Recovery Time Objectives (RTO)

| Component | Target RTO | Recovery Method |
|---|---|---|
| Application Service | < 2 minutes | Container restart |
| Full Stack | < 5 minutes | Docker Compose redeploy |
| Configuration | < 1 minute | Git checkout + restart |
| Data Recovery | < 10 minutes | Volume restore + restart |

#### Recovery Point Objectives (RPO)

| Data Type | Target RPO | Backup Frequency |
|---|---|---|
| Configuration | 0 (version controlled) | Real-time (Git) |
| Metrics Data | 24 hours | Daily backup |
| Dashboard Config | 24 hours | Daily backup |
| Application Logs | 1 hour | Real-time logging |

#### Emergency Procedures

```bash
# Emergency recovery checklist
emergency_recovery() {
  echo "=== EMERGENCY RECOVERY PROCEDURES ==="
  echo "1. Assess the failure scope and impact"
  echo "2. Check system resources (disk, memory, network)"
  echo "3. Review recent logs for error patterns"
  echo "4. Execute appropriate recovery procedure:"
  echo "   - Service restart: docker-compose restart [service]"
  echo "   - Full recovery: ./scripts/deploy.sh --backup"
  echo "   - Configuration rollback: git checkout [previous-commit]"
  echo "5. Validate recovery using validation script"
  echo "6. Document incident and update procedures"
  echo ""
  echo "Emergency contacts: infrastructure-team@company.com"
}
```

## Troubleshooting

Common deployment issues and their resolutions, organized by deployment type and symptom.

### Local Deployment Issues

#### Node.js and npm Issues

**Problem: Node.js version incompatibility**
```bash
# Symptoms
Error: The engine "node" is incompatible with this module

# Solution
# Check required version
cat package.json | jq '.engines.node'

# Install correct Node.js version using nvm
nvm install 18
nvm use 18
node --version
```

**Problem: npm installation failures**
```bash
# Symptoms
npm ERR! code EACCES
npm ERR! errno -13

# Solution
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Problem: Port already in use**
```bash
# Symptoms
Error: listen EADDRINUSE :::3000

# Solution
# Find process using port
lsof -i :3000
netstat -tulpn | grep :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm start
```

#### Application Startup Issues

**Problem: Module not found errors**
```bash
# Symptoms
Error: Cannot find module 'express'

# Solution
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Verify installation
npm ls express
```

**Problem: Environment configuration issues**
```bash
# Symptoms
Application starts but endpoints return 404

# Solution
# Check environment file
cp .env.example .env
cat .env

# Verify PORT and NODE_ENV settings
PORT=3000
NODE_ENV=development
```

### Docker Deployment Issues

#### Docker Build Issues

**Problem: Docker build failures**
```bash
# Symptoms
ERROR [internal] load metadata for docker.io/library/node:18-alpine

# Solution
# Update Docker and check connectivity
docker system prune -f
docker pull node:18-alpine

# Build with verbose output
docker build --no-cache --progress=plain -t hello-backend .
```

**Problem: Permission denied in container**
```bash
# Symptoms
Permission denied: '/usr/src/app'

# Solution
# Check Dockerfile user configuration
# Ensure proper ownership
RUN chown -R nodejs:nodejs /usr/src/app
USER nodejs
```

#### Docker Runtime Issues

**Problem: Container exits immediately**
```bash
# Symptoms
Container starts but stops immediately

# Diagnosis
docker logs <container-id>
docker run -it hello-backend sh

# Common solutions
# Check start command in package.json
# Verify all dependencies are installed
# Check for syntax errors in application code
```

**Problem: Health check failures**
```bash
# Symptoms
Container marked as unhealthy

# Diagnosis
# Check health check configuration
docker inspect --format='{{json .State.Health}}' <container-id>

# Test health endpoint manually
docker exec -it <container-id> curl http://localhost:3000/health

# Solution
# Adjust health check timeout or interval
# Verify health endpoint implementation
```

### Docker Compose Issues

#### Service Orchestration Problems

**Problem: Services fail to start**
```bash
# Symptoms
docker-compose up fails with dependency errors

# Diagnosis
docker-compose -f infrastructure/docker-compose.yml config
docker-compose -f infrastructure/docker-compose.yml ps

# Solutions
# Check service dependencies
# Verify network configuration
# Check volume mounts
# Review environment variables
```

**Problem: Inter-service communication failures**
```bash
# Symptoms
NGINX cannot connect to backend

# Diagnosis
# Check network connectivity
docker-compose exec nginx ping backend
docker-compose exec backend ping nginx

# Check service discovery
docker-compose exec nginx nslookup backend

# Solution
# Verify service names in configuration
# Check network configuration in docker-compose.yml
# Ensure services are on same network
```

#### Volume and Persistence Issues

**Problem: Data not persisting**
```bash
# Symptoms
Prometheus/Grafana data lost on restart

# Diagnosis
docker volume ls
docker-compose -f infrastructure/docker-compose.yml down -v

# Solution
# Check volume configuration in docker-compose.yml
volumes:
  prometheus_data:
    driver: local
  grafana_data:
    driver: local

# Verify volume mounts in services
```

### Monitoring and Health Check Issues

#### Prometheus Issues

**Problem: Prometheus not scraping targets**
```bash
# Symptoms
No metrics data in Prometheus

# Diagnosis
# Check Prometheus targets
curl http://localhost:9090/api/v1/targets

# Check configuration
docker-compose exec prometheus cat /etc/prometheus/prometheus.yml

# Solution
# Verify scrape configuration
# Check service discovery
# Ensure metrics endpoint is accessible
```

**Problem: Grafana dashboard not loading**
```bash
# Symptoms
Grafana shows no data

# Diagnosis
# Check Grafana logs
docker-compose logs grafana

# Verify Prometheus data source
curl http://localhost:3001/api/datasources

# Solution
# Configure Prometheus data source
# Import dashboard configuration
# Check query syntax in panels
```

#### Health Check Debugging

**Problem: Intermittent health check failures**
```bash
# Symptoms
Services randomly marked as unhealthy

# Diagnosis
# Monitor health checks
watch -n 5 'curl -s http://localhost/health | jq'

# Check system resources
docker stats
htop

# Solution
# Increase health check timeout
# Reduce health check frequency
# Optimize application performance
# Check resource constraints
```

### Network and Connectivity Issues

#### NGINX Proxy Issues

**Problem: NGINX returns 502 Bad Gateway**
```bash
# Symptoms
curl http://localhost returns 502 error

# Diagnosis
# Check NGINX logs
docker-compose logs nginx

# Check upstream configuration
docker-compose exec nginx cat /etc/nginx/nginx.conf

# Test backend directly
curl http://localhost:3000/hello

# Solution
# Verify upstream server configuration
upstream backend {
    server backend:3000;
}

# Check service name resolution
# Ensure backend service is healthy
```

**Problem: SSL/TLS certificate issues (if configured)**
```bash
# Symptoms
SSL certificate errors

# Diagnosis
# Check certificate configuration
openssl s_client -connect localhost:443

# Solution
# Update certificate files
# Check certificate permissions
# Verify NGINX SSL configuration
```

### Cloud Deployment Issues

#### Platform-Specific Issues

**Problem: Build failures on cloud platforms**
```bash
# Symptoms
Platform build logs show npm install failures

# Diagnosis
# Check platform Node.js version
# Review build logs
# Verify package.json engines

# Solution
# Specify exact Node.js version
"engines": {
  "node": "18.17.0",
  "npm": "8.19.0"
}

# Use npm ci instead of npm install
"scripts": {
  "build": "npm ci --only=production"
}
```

**Problem: Environment variable issues**
```bash
# Symptoms
Application starts but behaves incorrectly

# Diagnosis
# Check environment variables on platform
# Verify PORT variable handling

# Solution
# Set required environment variables
NODE_ENV=production
PORT=${PORT:-3000}

# Update application to handle platform PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0');
```

### Performance Issues

#### High Memory Usage

**Problem: Application consumes excessive memory**
```bash
# Symptoms
Container OOM killed or high memory usage

# Diagnosis
# Monitor memory usage
docker stats
node -e "console.log(process.memoryUsage())"

# Solution
# Set Node.js memory limits
NODE_OPTIONS=--max-old-space-size=512

# Optimize garbage collection
NODE_OPTIONS=--optimize-for-size

# Profile memory usage
node --inspect server.js
```

#### Slow Response Times

**Problem: Endpoints respond slowly**
```bash
# Symptoms
curl -w "%{time_total}" shows high response times

# Diagnosis
# Check CPU usage
docker stats
htop

# Profile application
node --prof server.js

# Solution
# Enable production optimizations
NODE_ENV=production

# Optimize middleware stack
# Remove unnecessary logging in production
# Enable HTTP keep-alive
```

### Debugging Tools and Commands

#### Comprehensive Diagnostic Script

```bash
#!/bin/bash
# diagnostic.sh - Comprehensive system diagnostic

echo "=== Node.js Tutorial Deployment Diagnostics ==="

# System information
echo "--- System Information ---"
echo "OS: $(uname -a)"
echo "Docker: $(docker --version)"
echo "Docker Compose: $(docker-compose --version)"
echo "Node.js: $(node --version 2>/dev/null || echo 'Not installed')"
echo "npm: $(npm --version 2>/dev/null || echo 'Not installed')"

# Service status
echo "--- Service Status ---"
if docker-compose -f infrastructure/docker-compose.yml ps 2>/dev/null; then
  echo "Docker Compose services running"
else
  echo "Docker Compose not running or configuration issue"
fi

# Health checks
echo "--- Health Checks ---"
endpoints=(
  "http://localhost/hello"
  "http://localhost/health"
  "http://localhost:9090/-/healthy"
  "http://localhost:3001/api/health"
)

for endpoint in "${endpoints[@]}"; do
  if curl -f -s -m 5 "$endpoint" > /dev/null 2>&1; then
    echo "✅ $endpoint - OK"
  else
    echo "❌ $endpoint - FAILED"
  fi
done

# Resource usage
echo "--- Resource Usage ---"
echo "Disk usage:"
df -h
echo "Memory usage:"
free -h
echo "Docker disk usage:"
docker system df

# Recent logs
echo "--- Recent Logs (last 10 lines) ---"
if docker-compose -f infrastructure/docker-compose.yml ps -q backend &>/dev/null; then
  echo "Backend logs:"
  docker-compose -f infrastructure/docker-compose.yml logs --tail=10 backend
fi

echo "=== Diagnostics Complete ==="
```

#### Log Analysis Tools

```bash
# Analyze application logs
analyze_logs() {
  local service="$1"
  
  echo "=== Log Analysis for $service ==="
  
  # Error rate
  echo "Error count (last 100 lines):"
  docker-compose -f infrastructure/docker-compose.yml logs --tail=100 "$service" | grep -c "ERROR"
  
  # Recent errors
  echo "Recent errors:"
  docker-compose -f infrastructure/docker-compose.yml logs --tail=100 "$service" | grep "ERROR" | tail -5
  
  # Response times (if available)
  echo "Response times:"
  docker-compose -f infrastructure/docker-compose.yml logs --tail=100 "$service" | grep -o '[0-9]\+ms' | sort -n | tail -10
}

# Usage: analyze_logs backend
```

## References

### Documentation Links

**Framework Documentation:**
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js 5.x Documentation](https://expressjs.com/en/5x/api.html)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)

**Configuration Files:**
- [`package.json`](../src/backend/package.json) - Backend dependencies and scripts
- [`Dockerfile`](../src/backend/Dockerfile) - Container build specification
- [`docker-compose.yml`](../infrastructure/docker-compose.yml) - Multi-container orchestration
- [`nginx.conf`](../infrastructure/nginx/nginx.conf) - Reverse proxy configuration

**Scripts and Automation:**
- [`deploy.sh`](../infrastructure/scripts/deploy.sh) - Automated deployment script
- [`backup.sh`](../infrastructure/scripts/backup.sh) - Backup and recovery script
- [`start.js`](../src/backend/scripts/start.js) - Application entrypoint

**Backend Implementation:**
- [`server.js`](../src/backend/server.js) - HTTP server configuration
- [`app.js`](../src/backend/app.js) - Express application setup
- [Backend README](../src/backend/README.md) - Backend-specific documentation

### Cloud Platform Resources

**Deployment Platforms:**
- [Render Node.js Deployment](https://render.com/docs/deploy-node-express-app)
- [Vercel Node.js Functions](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)
- [Railway Node.js Deployment](https://docs.railway.app/deploy/deployments)
- [AWS App Runner](https://docs.aws.amazon.com/apprunner/)
- [Google Cloud Run](https://cloud.google.com/run/docs)

**Monitoring and Observability:**
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [NGINX Monitoring](https://docs.nginx.com/nginx/admin-guide/monitoring/)

### Best Practices and Security

**Security Guidelines:**
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security Updates](https://expressjs.com/en/advanced/security-updates.html)
- [Docker Security](https://docs.docker.com/engine/security/)
- [Container Security Best Practices](https://sysdig.com/blog/dockerfile-best-practices/)

**Performance Optimization:**
- [Node.js Performance Best Practices](https://nodejs.org/en/docs/guides/simple-profiling/)
- [Express.js Performance Tips](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Docker Performance Tuning](https://docs.docker.com/config/containers/resource_constraints/)

### Community and Support

**GitHub Repositories:**
- [Express.js GitHub](https://github.com/expressjs/express)
- [Node.js GitHub](https://github.com/nodejs/node)
- [Docker Compose GitHub](https://github.com/docker/compose)

**Community Resources:**
- [Node.js Community](https://nodejs.org/en/get-involved/)
- [Express.js Community](https://expressjs.com/en/resources/community.html)
- [Docker Community](https://www.docker.com/community/)

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Compatibility**: Node.js 18+, Express.js 5.1.0, Docker 20+, Docker Compose 1.29+

For additional support or questions about deployment procedures, refer to the project documentation or contact the development team.