# Node.js Tutorial Backend - Infrastructure Documentation

[![Node.js Version](https://img.shields.io/badge/node-22.11.0%20LTS-green.svg)](https://nodejs.org/)
[![Express Version](https://img.shields.io/badge/express-5.1.0-blue.svg)](https://expressjs.com/)
[![Docker](https://img.shields.io/badge/docker-20.10+-blue.svg)](https://docker.com/)
[![Kubernetes](https://img.shields.io/badge/kubernetes-1.29+-blue.svg)](https://kubernetes.io/)

## Table of Contents

- [Overview](#overview)
- [Local Development](#local-development)
- [Containerization](#containerization)
- [Orchestration](#orchestration)
- [Monitoring and Observability](#monitoring-and-observability)
- [Cloud Provisioning (IaC)](#cloud-provisioning-iac)
- [Reverse Proxy and Process Management](#reverse-proxy-and-process-management)
- [Automation Scripts](#automation-scripts)
- [References and Further Reading](#references-and-further-reading)

## Overview

This infrastructure documentation provides a comprehensive guide for deploying, running, and monitoring the Node.js tutorial backend application. The application demonstrates a minimal yet production-ready Express.js server with a single `/hello` endpoint, showcasing modern DevOps practices and infrastructure patterns.

### Architecture Philosophy

The infrastructure follows a **progressive complexity model** designed for educational purposes:

- **Minimal Core**: Simple Node.js server with Express.js framework
- **Containerized Deployment**: Docker and Docker Compose for local development
- **Orchestrated Services**: Kubernetes manifests for production deployment
- **Observable Systems**: Prometheus and Grafana for monitoring and alerting
- **Automated Operations**: Shell scripts for setup, deployment, and maintenance

### Key Infrastructure Components

| Component | Technology | Purpose | Environment |
|-----------|------------|---------|-------------|
| **Runtime** | Node.js v22.11.0 LTS | JavaScript execution environment | All |
| **Framework** | Express.js v5.1.0 | Web application framework | All |
| **Containerization** | Docker & Docker Compose | Application packaging and local orchestration | Development/Production |
| **Orchestration** | Kubernetes | Container orchestration and scaling | Production |
| **Monitoring** | Prometheus & Grafana | Metrics collection and visualization | Production |
| **Process Management** | PM2 | Process monitoring and clustering | Production |
| **Reverse Proxy** | Nginx | Load balancing and SSL termination | Production |
| **Infrastructure as Code** | Terraform | Cloud resource provisioning | Cloud |

## Local Development

### Prerequisites

Before setting up the local development environment, ensure you have the following tools installed:

#### Required Tools

| Tool | Minimum Version | Recommended Version | Purpose |
|------|----------------|---------------------|---------|
| **Node.js** | v18.0.0 | v22.11.0 LTS | JavaScript runtime |
| **npm** | v9.0.0 | v11.4.2 (bundled) | Package manager |
| **Git** | v2.0+ | Latest | Version control |

#### Optional Tools (for advanced workflows)

| Tool | Minimum Version | Purpose |
|------|----------------|---------|
| **Docker** | v20.10+ | Containerization |
| **Docker Compose** | v1.29+ | Multi-container orchestration |

### Environment Setup

#### 1. Automated Setup (Recommended)

The project includes an automated setup script that validates your environment and installs all dependencies:

```bash
# Navigate to the project root
cd nodejs-tutorial-backend

# Run the automated setup script
./infrastructure/scripts/setup.sh

# For verbose output and debugging
./infrastructure/scripts/setup.sh --verbose

# To skip Docker checks (development-only setup)
./infrastructure/scripts/setup.sh --skip-docker
```

The setup script performs the following operations:

- ✅ Validates Node.js and npm versions
- ✅ Checks Docker availability (optional)
- ✅ Installs npm dependencies with `npm ci`
- ✅ Creates `.env` file from `.env.example` template
- ✅ Runs basic health checks
- ✅ Provides next steps and access information

#### 2. Manual Setup

If you prefer manual setup or encounter issues with the automated script:

```bash
# 1. Verify Node.js installation
node --version  # Should be v18+ (recommended: v22.11.0)
npm --version   # Should be v9+ (recommended: v11.4.2)

# 2. Navigate to backend directory
cd src/backend

# 3. Install dependencies
npm ci  # Use npm ci for reproducible builds
# or: npm install (if package-lock.json is missing)

# 4. Create environment configuration
cp .env.example .env
# Edit .env file as needed for your environment

# 5. Verify installation
npm run health-check  # Optional: run basic health checks
```

### Configuration Management

#### Environment Variables

The application uses environment variables for configuration with sensible defaults:

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Node.js environment (development/production) |
| `PORT` | `3000` | HTTP server port |
| `HOST` | `localhost` | Server host binding |
| `LOG_LEVEL` | `info` | Logging verbosity level |

#### .env File Configuration

Create a `.env` file in the `src/backend` directory:

```bash
# Server Configuration
NODE_ENV=development
PORT=3000
HOST=localhost

# Logging Configuration  
LOG_LEVEL=info
DEBUG=

# Application Features
HEALTH_CHECK_ENABLED=true
METRICS_ENABLED=true
API_DOCUMENTATION_ENABLED=true

# Security Configuration
CORS_ENABLED=true
CORS_ORIGIN=*
HELMET_ENABLED=true

# Performance Configuration
REQUEST_TIMEOUT=30000
MAX_REQUEST_SIZE=1mb
```

### Development Workflow

#### Starting the Application

```bash
# Navigate to backend directory
cd src/backend

# Start the development server
npm start

# Alternative: Start with auto-restart on file changes
npm run dev

# Alternative: Start with debugging enabled
DEBUG=* npm start
```

#### Accessing the Application

Once started, the application provides the following endpoints:

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/hello` | GET | Main tutorial endpoint | `"Hello world"` |
| `/health` | GET | Health check endpoint | JSON health status |
| `/` | GET | Default route (404) | Error response |

**Example Usage:**

```bash
# Test the hello endpoint
curl http://localhost:3000/hello
# Expected response: Hello world

# Check application health
curl http://localhost:3000/health
# Expected response: {"status":"OK","uptime":123.456,"timestamp":"2024-12-30T..."}

# Test invalid endpoint (demonstrates error handling)
curl http://localhost:3000/invalid
# Expected response: 404 Not Found
```

#### Development Commands

| Command | Purpose | Usage |
|---------|---------|-------|
| `npm start` | Start production server | `npm start` |
| `npm run dev` | Start development server with auto-restart | `npm run dev` |
| `npm test` | Run test suite | `npm test` |
| `npm run lint` | Check code quality | `npm run lint` |
| `npm run health-check` | Verify application health | `npm run health-check` |

### Troubleshooting Local Development

#### Common Issues

**Port Already in Use:**
```bash
# Check what's using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Use a different port
PORT=3001 npm start
```

**Module Not Found Errors:**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Permission Issues:**
```bash
# Fix npm permissions (Unix systems)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) node_modules
```

## Containerization

The application includes comprehensive Docker support for consistent deployment across environments.

### Docker Setup

#### Dockerfile Architecture

The application uses a production-optimized Dockerfile located at `infrastructure/docker/Dockerfile`:

**Key Features:**
- **Base Image**: Node.js v22.11.0 LTS slim (Debian-based)
- **Multi-stage Build**: Optimized for production with minimal attack surface
- **Security**: Non-root user execution, minimal dependencies
- **Health Checks**: Built-in health monitoring for orchestration
- **Signal Handling**: Graceful shutdown with dumb-init

**Dockerfile Structure:**
```dockerfile
# Base stage with Node.js v22.11.0 LTS
FROM node:22.11.0-slim AS base

# Install system dependencies
RUN apt-get update && apt-get install -y curl dumb-init

# Set working directory
WORKDIR /usr/src/app

# Copy package files for dependency installation
COPY src/backend/package*.json ./

# Install production dependencies
RUN npm ci --omit=dev --no-audit --no-fund

# Copy application source code
COPY src/backend/ ./

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user for security
RUN chown -R node:node /usr/src/app
USER node

# Expose application port
EXPOSE 3000

# Configure health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Set container startup command
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
```

#### Building Docker Images

```bash
# Navigate to project root
cd nodejs-tutorial-backend

# Build Docker image
docker build -t nodejs-tutorial-backend:latest -f infrastructure/docker/Dockerfile .

# Build with specific tag
docker build -t nodejs-tutorial-backend:v1.0.0 -f infrastructure/docker/Dockerfile .

# Build with no cache (force rebuild)
docker build --no-cache -t nodejs-tutorial-backend:latest -f infrastructure/docker/Dockerfile .
```

#### Running Docker Containers

**Basic Container Execution:**
```bash
# Run container with port mapping
docker run -p 3000:3000 nodejs-tutorial-backend:latest

# Run in background (detached mode)
docker run -d -p 3000:3000 --name tutorial-backend nodejs-tutorial-backend:latest

# Run with environment variables
docker run -p 3000:3000 -e NODE_ENV=production -e PORT=3000 nodejs-tutorial-backend:latest

# Run with environment file
docker run -p 3000:3000 --env-file src/backend/.env nodejs-tutorial-backend:latest
```

**Container Management:**
```bash
# View running containers
docker ps

# Check container logs
docker logs tutorial-backend
docker logs -f tutorial-backend  # Follow logs

# Execute commands in running container
docker exec -it tutorial-backend /bin/sh

# Stop container
docker stop tutorial-backend

# Remove container
docker rm tutorial-backend
```

#### Docker Compose Integration

The project includes a comprehensive Docker Compose configuration for local development and testing.

**Docker Compose Features:**
- **Single-service architecture** with potential for extension
- **Development-optimized** with hot-reloading support
- **Environment variable** injection and configuration
- **Health checks** for container orchestration
- **Volume mounts** for development workflow

**Starting with Docker Compose:**
```bash
# Navigate to project root
cd nodejs-tutorial-backend

# Start services in foreground
docker-compose -f infrastructure/docker/docker-compose.yml up

# Start services in background
docker-compose -f infrastructure/docker/docker-compose.yml up -d

# Build and start services
docker-compose -f infrastructure/docker/docker-compose.yml up --build

# Start specific services
docker-compose -f infrastructure/docker/docker-compose.yml up backend
```

**Docker Compose Management:**
```bash
# Check service status
docker-compose -f infrastructure/docker/docker-compose.yml ps

# View service logs
docker-compose -f infrastructure/docker/docker-compose.yml logs -f backend

# Restart services
docker-compose -f infrastructure/docker/docker-compose.yml restart

# Stop services
docker-compose -f infrastructure/docker/docker-compose.yml stop

# Stop and remove containers, networks, volumes
docker-compose -f infrastructure/docker/docker-compose.yml down -v
```

### Container Security Best Practices

The Docker setup implements several security best practices:

| Security Measure | Implementation | Benefit |
|------------------|----------------|---------|
| **Non-root User** | `USER node` | Prevents privilege escalation |
| **Minimal Base Image** | `node:22.11.0-slim` | Reduces attack surface |
| **Dependency Optimization** | `npm ci --omit=dev` | Excludes unnecessary packages |
| **Health Checks** | Built-in HTTP health monitoring | Enables automatic recovery |
| **Signal Handling** | `dumb-init` for proper signal forwarding | Graceful shutdown support |
| **Resource Limits** | Memory and CPU constraints | Prevents resource exhaustion |

## Orchestration

The application provides comprehensive Kubernetes support for production deployment and scaling.

### Docker Compose Orchestration

#### Local Multi-Service Development

Docker Compose orchestrates the backend service and optional monitoring stack:

**Service Architecture:**
```yaml
services:
  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      PORT: 3000
      HOST: 0.0.0.0
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped
```

**Orchestration Commands:**
```bash
# Scale backend service
docker-compose -f infrastructure/docker/docker-compose.yml up -d --scale backend=3

# Update service configuration
docker-compose -f infrastructure/docker/docker-compose.yml up -d --force-recreate

# View service dependencies
docker-compose -f infrastructure/docker/docker-compose.yml config
```

### Kubernetes Orchestration

#### Production Deployment

The application includes production-ready Kubernetes manifests in `infrastructure/kubernetes/`:

**Kubernetes Resources:**

| Resource | File | Purpose |
|----------|------|---------|
| **Deployment** | `deployment.yaml` | Pod management and rolling updates |
| **Service** | `service.yaml` | Internal load balancing and service discovery |
| **Ingress** | `ingress.yaml` | External HTTP access and routing |

#### Deployment Resource

The Kubernetes Deployment (`infrastructure/kubernetes/deployment.yaml`) provides:

**Key Features:**
- **Rolling Update Strategy**: Zero-downtime deployments
- **Health Probes**: Liveness, readiness, and startup checks
- **Resource Management**: CPU and memory limits/requests
- **Security Context**: Non-root execution and security policies
- **Environment Configuration**: Production-ready settings

**Deployment Configuration:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nodejs-tutorial-backend
  labels:
    app: nodejs-tutorial-backend
    component: backend
spec:
  replicas: 1
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%
      maxSurge: 25%
  selector:
    matchLabels:
      app: nodejs-tutorial-backend
      component: backend
  template:
    spec:
      containers:
      - name: nodejs-tutorial-backend
        image: nodejs-tutorial-backend:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 256Mi
        livenessProbe:
          httpGet:
            path: /hello
            port: 3000
          initialDelaySeconds: 15
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /hello
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

#### Kubernetes Deployment Commands

**Deploy to Kubernetes:**
```bash
# Apply all Kubernetes manifests
kubectl apply -f infrastructure/kubernetes/

# Apply specific resource
kubectl apply -f infrastructure/kubernetes/deployment.yaml

# Verify deployment status
kubectl rollout status deployment/nodejs-tutorial-backend

# Get deployment information
kubectl get deployment nodejs-tutorial-backend
kubectl describe deployment nodejs-tutorial-backend
```

**Scaling and Updates:**
```bash
# Scale deployment
kubectl scale deployment nodejs-tutorial-backend --replicas=3

# Update image
kubectl set image deployment/nodejs-tutorial-backend \
  nodejs-tutorial-backend=nodejs-tutorial-backend:v1.1.0

# Rollback deployment
kubectl rollout undo deployment/nodejs-tutorial-backend

# View rollout history
kubectl rollout history deployment/nodejs-tutorial-backend
```

**Pod Management:**
```bash
# List pods
kubectl get pods -l app=nodejs-tutorial-backend

# View pod logs
kubectl logs -l app=nodejs-tutorial-backend
kubectl logs -f deployment/nodejs-tutorial-backend

# Port forward for testing
kubectl port-forward deployment/nodejs-tutorial-backend 3000:3000

# Execute commands in pod
kubectl exec -it <pod-name> -- /bin/sh
```

#### Service and Ingress

**Service Configuration:**
The Service resource provides stable networking and load balancing:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nodejs-tutorial-backend-service
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 3000
    protocol: TCP
  selector:
    app: nodejs-tutorial-backend
    component: backend
```

**Ingress Configuration:**
The Ingress resource enables external HTTP access:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nodejs-tutorial-backend-ingress
spec:
  rules:
  - host: tutorial-backend.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nodejs-tutorial-backend-service
            port:
              number: 80
```

**Accessing the Application:**
```bash
# Via port forwarding
kubectl port-forward service/nodejs-tutorial-backend-service 3000:80

# Via Ingress (configure DNS or hosts file)
curl http://tutorial-backend.local/hello

# Direct service access (from within cluster)
curl http://nodejs-tutorial-backend-service.default.svc.cluster.local/hello
```

### Orchestration Best Practices

| Practice | Implementation | Benefit |
|----------|----------------|---------|
| **Health Checks** | HTTP probes on `/hello` endpoint | Automatic failure detection |
| **Rolling Updates** | Gradual pod replacement | Zero-downtime deployments |
| **Resource Limits** | CPU/memory constraints | Predictable resource usage |
| **Label Selectors** | Consistent labeling strategy | Flexible service discovery |
| **Security Context** | Non-root execution | Enhanced security posture |

## Monitoring and Observability

The application includes a comprehensive monitoring stack with Prometheus and Grafana for metrics collection, visualization, and alerting.

### Monitoring Architecture

#### Components Overview

| Component | Technology | Purpose | Port |
|-----------|------------|---------|------|
| **Metrics Collection** | Prometheus v2.52.0 | Time-series metrics storage | 9090 |
| **Visualization** | Grafana v10.4.2 | Dashboard and alerting | 3001 |
| **Application Metrics** | Node.js `/metrics` endpoint | Application performance data | 3000 |

#### Monitoring Stack Setup

The monitoring stack is automated through the dedicated setup script:

```bash
# Start monitoring stack
./infrastructure/scripts/monitoring-setup.sh

# Start with verbose output
./infrastructure/scripts/monitoring-setup.sh --verbose

# Restart monitoring services
./infrastructure/scripts/monitoring-setup.sh --restart

# Clean previous setup
./infrastructure/scripts/monitoring-setup.sh --clean
```

### Prometheus Configuration

#### Metrics Collection Setup

Prometheus is configured via `infrastructure/monitoring/prometheus.yml`:

**Scrape Configuration:**
```yaml
scrape_configs:
  - job_name: 'nodejs-backend'
    scrape_interval: 15s
    static_configs:
      - targets: ['backend:3000']
    metrics_path: /metrics
    relabel_configs:
      - target_label: service
        replacement: 'nodejs-backend'
```

**Key Metrics Collected:**

| Metric Category | Metric Name | Description |
|----------------|-------------|-------------|
| **Availability** | `up{job="nodejs-backend"}` | Service availability (0/1) |
| **HTTP Requests** | `http_requests_total` | Request count by status code |
| **Response Time** | `http_request_duration_seconds` | Request duration histograms |
| **Memory Usage** | `process_resident_memory_bytes` | Process memory consumption |
| **CPU Usage** | `process_cpu_seconds_total` | CPU time consumption |
| **Node.js Heap** | `nodejs_heap_size_used_bytes` | V8 heap memory usage |
| **Event Loop** | `nodejs_eventloop_lag_seconds` | Event loop lag indicators |

#### Prometheus Operations

```bash
# Access Prometheus UI
open http://localhost:9090

# Query examples
# Service availability
up{job="nodejs-backend"}

# Request rate (per second)
rate(http_requests_total{job="nodejs-backend"}[1m])

# 95th percentile response time
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{job="nodejs-backend"}[5m]))

# Memory usage trend
process_resident_memory_bytes{job="nodejs-backend"}
```

### Grafana Dashboard

#### Dashboard Configuration

The application includes a pre-configured Grafana dashboard (`infrastructure/monitoring/grafana-dashboard.json`) with comprehensive visualizations:

**Dashboard Sections:**

| Section | Visualizations | Purpose |
|---------|----------------|---------|
| **Service Overview** | Uptime, status, version | High-level service health |
| **Request Metrics** | RPS, response times, status codes | HTTP performance monitoring |
| **Resource Usage** | CPU, memory, event loop | System resource tracking |
| **Error Analysis** | Error rates, failed requests | Problem identification |

#### Accessing Grafana

```bash
# Access Grafana UI
open http://localhost:3001

# Default credentials
Username: admin
Password: admin

# Dashboard URL (after import)
http://localhost:3001/d/nodejs-tutorial-backend/nodejs-tutorial-backend-monitoring
```

#### Dashboard Import

**Automatic Import:**
The monitoring setup script attempts automatic dashboard import using the Grafana API.

**Manual Import:**
1. Navigate to Grafana UI (http://localhost:3001)
2. Login with admin/admin credentials
3. Go to "+" → "Import"
4. Upload `infrastructure/monitoring/grafana-dashboard.json`
5. Select Prometheus datasource when prompted

### Application Instrumentation

#### Health Check Endpoint

The application provides a comprehensive health check endpoint at `/health`:

```bash
# Check application health
curl http://localhost:3000/health

# Example response
{
  "status": "OK",
  "uptime": 3600.123,
  "timestamp": "2024-12-30T10:30:00.000Z",
  "memory": {
    "rss": 50331648,
    "heapTotal": 20971520,
    "heapUsed": 15728640,
    "external": 1048576
  },
  "version": "1.0.0"
}
```

#### Metrics Endpoint

For advanced monitoring, the application can be extended with a `/metrics` endpoint:

```bash
# Access Prometheus metrics (if implemented)
curl http://localhost:3000/metrics

# Example metrics format
# HELP nodejs_version_info Node.js version info
# TYPE nodejs_version_info gauge
nodejs_version_info{version="v22.11.0",major="22",minor="11",patch="0"} 1

# HELP process_cpu_seconds_total Total user and system CPU time spent in seconds
# TYPE process_cpu_seconds_total counter
process_cpu_seconds_total 1.23
```

### Monitoring Operations

#### Service Management

```bash
# Check monitoring stack status
docker-compose -f infrastructure/docker/docker-compose.yml ps

# View monitoring logs
docker-compose -f infrastructure/docker/docker-compose.yml logs prometheus
docker-compose -f infrastructure/docker/docker-compose.yml logs grafana

# Restart monitoring services
./infrastructure/scripts/monitoring-setup.sh --restart

# Stop monitoring services
./infrastructure/scripts/monitoring-setup.sh --stop
```

#### Troubleshooting Monitoring

**Common Issues:**

**Prometheus Not Scraping:**
```bash
# Check Prometheus targets
curl http://localhost:9090/api/v1/targets

# Verify backend metrics endpoint
curl http://localhost:3000/metrics

# Check Prometheus configuration
docker-compose exec prometheus cat /etc/prometheus/prometheus.yml
```

**Grafana Dashboard Issues:**
```bash
# Check Grafana datasource
curl -u admin:admin http://localhost:3001/api/datasources

# Re-import dashboard
./infrastructure/scripts/monitoring-setup.sh --import-dashboard

# Check Grafana logs
docker-compose logs grafana
```

## Cloud Provisioning (IaC)

The application includes Terraform configurations for provisioning minimal, stateless infrastructure in cloud environments.

### Infrastructure as Code Overview

#### Terraform Configuration

The Terraform setup is located in `infrastructure/terraform/` and includes:

| File | Purpose | Contents |
|------|---------|----------|
| `main.tf` | Core infrastructure resources | Compute, networking, security |
| `variables.tf` | Input variable definitions | Parameterization and configuration |
| `outputs.tf` | Resource output values | Instance IDs, IP addresses, URLs |

#### Supported Cloud Providers

The Terraform configuration is designed to be **cloud-agnostic** with provider-specific implementations:

| Provider | Support Level | Resources |
|----------|---------------|-----------|
| **AWS** | ✅ Primary | EC2, VPC, Security Groups |
| **Azure** | ✅ Supported | Virtual Machines, Resource Groups |
| **Google Cloud** | ✅ Supported | Compute Engine, VPC Networks |
| **DigitalOcean** | ✅ Educational | Droplets, VPC |

### AWS Infrastructure Example

#### Core Resources

**main.tf Configuration:**
```hcl
# Provider configuration
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.3.0"
}

provider "aws" {
  region = var.aws_region
}

# VPC and Networking
resource "aws_vpc" "nodejs_tutorial" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "nodejs-tutorial-vpc"
    Project     = "nodejs-tutorial"
    Environment = var.environment
  }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.nodejs_tutorial.id
  cidr_block              = var.public_subnet_cidr
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = {
    Name = "nodejs-tutorial-public-subnet"
  }
}

resource "aws_internet_gateway" "nodejs_tutorial" {
  vpc_id = aws_vpc.nodejs_tutorial.id

  tags = {
    Name = "nodejs-tutorial-igw"
  }
}

# Security Group
resource "aws_security_group" "nodejs_backend" {
  name_description = "Security group for Node.js tutorial backend"
  vpc_id = aws_vpc.nodejs_tutorial.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "nodejs-tutorial-backend-sg"
  }
}

# EC2 Instance
resource "aws_instance" "nodejs_backend" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.nodejs_backend.id]
  key_name               = var.key_pair_name

  user_data = base64encode(templatefile("${path.module}/user-data.sh", {
    docker_image = var.docker_image
    app_port     = var.app_port
  }))

  tags = {
    Name        = "nodejs-tutorial-backend"
    Project     = "nodejs-tutorial"
    Environment = var.environment
  }
}
```

#### Variable Configuration

**variables.tf:**
```hcl
variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "development"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for public subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "key_pair_name" {
  description = "AWS key pair name for SSH access"
  type        = string
}

variable "docker_image" {
  description = "Docker image for the application"
  type        = string
  default     = "nodejs-tutorial-backend:latest"
}

variable "app_port" {
  description = "Application port"
  type        = number
  default     = 3000
}
```

#### Output Configuration

**outputs.tf:**
```hcl
output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.nodejs_backend.id
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.nodejs_backend.public_ip
}

output "instance_public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.nodejs_backend.public_dns
}

output "application_url" {
  description = "URL to access the application"
  value       = "http://${aws_instance.nodejs_backend.public_ip}:${var.app_port}/hello"
}

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.nodejs_tutorial.id
}

output "security_group_id" {
  description = "ID of the security group"
  value       = aws_security_group.nodejs_backend.id
}
```

### Terraform Operations

#### Infrastructure Deployment

```bash
# Navigate to Terraform directory
cd infrastructure/terraform

# Initialize Terraform
terraform init

# Plan infrastructure changes
terraform plan -var="key_pair_name=your-key-pair"

# Apply infrastructure changes
terraform apply -var="key_pair_name=your-key-pair"

# Show current state
terraform show

# List resources
terraform state list
```

#### Infrastructure Management

```bash
# Update infrastructure
terraform plan -var="instance_type=t3.small"
terraform apply

# Destroy infrastructure
terraform destroy

# Import existing resources
terraform import aws_instance.nodejs_backend i-1234567890abcdef0

# Format configuration files
terraform fmt

# Validate configuration
terraform validate
```

#### Environment-Specific Deployments

**Development Environment:**
```bash
terraform apply \
  -var="environment=development" \
  -var="instance_type=t3.micro" \
  -var="key_pair_name=dev-key"
```

**Production Environment:**
```bash
terraform apply \
  -var="environment=production" \
  -var="instance_type=t3.small" \
  -var="key_pair_name=prod-key"
```

### User Data Script

The EC2 instance is configured automatically using a user data script:

**user-data.sh:**
```bash
#!/bin/bash
set -e

# Update system packages
apt-get update
apt-get install -y docker.io docker-compose curl

# Start Docker service
systemctl start docker
systemctl enable docker

# Add ubuntu user to docker group
usermod -aG docker ubuntu

# Pull and run the application
docker pull ${docker_image}
docker run -d \
  --name nodejs-tutorial-backend \
  --restart unless-stopped \
  -p ${app_port}:${app_port} \
  -e NODE_ENV=production \
  -e PORT=${app_port} \
  -e HOST=0.0.0.0 \
  ${docker_image}

# Configure health check
cat > /usr/local/bin/health-check.sh << 'EOF'
#!/bin/bash
curl -f http://localhost:${app_port}/health || exit 1
EOF

chmod +x /usr/local/bin/health-check.sh

# Setup cron for health monitoring
echo "*/5 * * * * root /usr/local/bin/health-check.sh" >> /etc/crontab
```

### Cloud Deployment Best Practices

| Practice | Implementation | Benefit |
|----------|----------------|---------|
| **Infrastructure as Code** | Terraform configurations | Repeatable, version-controlled deployments |
| **Environment Separation** | Variable-based configuration | Multiple environment support |
| **Security Groups** | Restrictive network access | Minimal attack surface |
| **Automated Deployment** | User data scripts | Consistent instance configuration |
| **Resource Tagging** | Comprehensive tagging strategy | Cost tracking and resource management |
| **State Management** | Remote state storage | Team collaboration and state persistence |

## Reverse Proxy and Process Management

For production deployments, the application supports advanced deployment patterns using Nginx as a reverse proxy and PM2 for process management.

### Nginx Reverse Proxy

#### Configuration Overview

Nginx serves as the reverse proxy, handling SSL termination, load balancing, and static file serving:

**nginx.conf Configuration:**
```nginx
# Main context configuration
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    # Basic configuration
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logging configuration
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    
    # Performance optimization
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/javascript application/xml+rss 
               application/json;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    # Upstream backend servers
    upstream nodejs_backend {
        least_conn;
        server 127.0.0.1:3000 max_fails=3 fail_timeout=30s;
        # Add additional backend servers for load balancing:
        # server 127.0.0.1:3001 max_fails=3 fail_timeout=30s;
        # server 127.0.0.1:3002 max_fails=3 fail_timeout=30s;
        
        keepalive 32;
    }
    
    # Main server configuration
    server {
        listen 80;
        server_name localhost tutorial-backend.local;
        
        # Redirect HTTP to HTTPS (production)
        # return 301 https://$server_name$request_uri;
        
        # Health check endpoint (bypass proxy)
        location /nginx-health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
        
        # Main application proxy
        location / {
            # Rate limiting
            limit_req zone=api burst=20 nodelay;
            
            # Proxy configuration
            proxy_pass http://nodejs_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            
            # Timeouts
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
            proxy_read_timeout 30s;
            
            # Buffer configuration
            proxy_buffering on;
            proxy_buffer_size 4k;
            proxy_buffers 8 4k;
        }
        
        # Static file serving (if needed)
        location /static/ {
            alias /var/www/static/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Error pages
        error_page 404 /404.html;
        error_page 500 502 503 504 /50x.html;
        
        location = /50x.html {
            root /usr/share/nginx/html;
        }
    }
    
    # HTTPS server configuration (production)
    server {
        listen 443 ssl http2;
        server_name tutorial-backend.local;
        
        # SSL configuration
        ssl_certificate /etc/ssl/certs/server.crt;
        ssl_certificate_key /etc/ssl/private/server.key;
        ssl_session_timeout 1d;
        ssl_session_cache shared:SSL:50m;
        ssl_session_tickets off;
        
        # Modern SSL configuration
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
        ssl_prefer_server_ciphers off;
        
        # OCSP stapling
        ssl_stapling on;
        ssl_stapling_verify on;
        
        # Same location blocks as HTTP server
        location / {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://nodejs_backend;
            # ... same proxy configuration as above
        }
    }
}
```

#### Nginx Deployment

**Installation and Configuration:**
```bash
# Install Nginx
sudo apt-get update
sudo apt-get install nginx

# Copy configuration
sudo cp infrastructure/config/nginx.conf /etc/nginx/nginx.conf

# Test configuration
sudo nginx -t

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Reload configuration
sudo nginx -s reload
```

**Nginx Management:**
```bash
# Check status
sudo systemctl status nginx

# View access logs
sudo tail -f /var/log/nginx/access.log

# View error logs
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx
```

### PM2 Process Management

#### Configuration Overview

PM2 manages Node.js processes with clustering, monitoring, and automatic restarts:

**pm2.config.js Configuration:**
```javascript
module.exports = {
  apps: [
    {
      // Application configuration
      name: 'nodejs-tutorial-backend',
      script: './server.js',
      cwd: '/path/to/application',
      
      // Process management
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster',
      
      // Environment configuration
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        HOST: '127.0.0.1'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '127.0.0.1'
      },
      
      // Monitoring and restarts
      watch: false, // Set to true for development
      ignore_watch: ['node_modules', 'logs'],
      watch_options: {
        followSymlinks: false
      },
      
      // Auto-restart configuration
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '256M',
      
      // Logging configuration
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Health monitoring
      listen_timeout: 3000,
      kill_timeout: 5000,
      
      // Advanced options
      node_args: ['--max-old-space-size=256'],
      source_map_support: true,
      
      // Process timing
      cron_restart: '0 4 * * *', // Restart daily at 4 AM
      
      // Instance variables
      instance_var: 'INSTANCE_ID'
    }
  ],
  
  // Deployment configuration
  deploy: {
    production: {
      user: 'deploy',
      host: ['server1.example.com', 'server2.example.com'],
      ref: 'origin/main',
      repo: 'git@github.com:username/nodejs-tutorial-backend.git',
      path: '/var/www/nodejs-tutorial-backend',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
```

#### PM2 Operations

**Application Management:**
```bash
# Install PM2 globally
npm install -g pm2

# Start application with configuration
pm2 start infrastructure/config/pm2.config.js

# Start with specific environment
pm2 start infrastructure/config/pm2.config.js --env production

# Start single instance
pm2 start src/backend/server.js --name nodejs-tutorial-backend

# Application control
pm2 restart nodejs-tutorial-backend
pm2 reload nodejs-tutorial-backend
pm2 stop nodejs-tutorial-backend
pm2 delete nodejs-tutorial-backend

# List running processes
pm2 list
pm2 status

# Show process information
pm2 show nodejs-tutorial-backend
pm2 describe nodejs-tutorial-backend
```

**Monitoring and Logs:**
```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs nodejs-tutorial-backend
pm2 logs --lines 100

# Flush logs
pm2 flush

# Log rotation
pm2 install pm2-logrotate

# Process metrics
pm2 web  # Web-based monitoring
```

**Cluster Management:**
```bash
# Scale processes
pm2 scale nodejs-tutorial-backend 4

# Reload with zero downtime
pm2 reload nodejs-tutorial-backend

# Graceful restart
pm2 gracefulReload nodejs-tutorial-backend

# Reset restart counter
pm2 reset nodejs-tutorial-backend
```

#### Production Deployment

**System Service Integration:**
```bash
# Generate startup script
pm2 startup

# Save current process list
pm2 save

# Resurrect saved processes
pm2 resurrect

# Update PM2
pm2 update
```

**Health Monitoring:**
```bash
# Install PM2 monitoring
pm2 install pm2-server-monit

# Configure monitoring
pm2 set pm2-server-monit:url https://monitoring.example.com

# Health check endpoint
curl http://localhost:9615/api/status
```

### Load Balancing and High Availability

#### Multi-Instance Setup

**Nginx Load Balancing:**
```nginx
upstream nodejs_backend {
    least_conn;
    server 127.0.0.1:3000 weight=1 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3001 weight=1 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3002 weight=1 max_fails=3 fail_timeout=30s;
    
    keepalive 32;
}
```

**PM2 Cluster Mode:**
```javascript
module.exports = {
  apps: [{
    name: 'nodejs-tutorial-backend',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

### Performance Optimization

| Component | Optimization | Benefit |
|-----------|-------------|---------|
| **Nginx** | Gzip compression, keepalive connections | Reduced bandwidth, faster responses |
| **PM2** | Cluster mode, automatic restarts | CPU utilization, high availability |
| **Load Balancing** | Least connections, health checks | Even load distribution |
| **Caching** | Proxy caching, static file caching | Reduced backend load |
| **SSL/TLS** | HTTP/2, modern ciphers | Secure, efficient connections |

## Automation Scripts

The application includes comprehensive automation scripts for environment setup, deployment, and monitoring operations.

### Script Architecture

#### Script Organization

| Script | Location | Purpose | Dependencies |
|--------|----------|---------|--------------|
| **setup.sh** | `infrastructure/scripts/setup.sh` | Environment validation and dependency installation | Bash 5.0+, Node.js |
| **deploy.sh** | `infrastructure/scripts/deploy.sh` | End-to-end deployment automation | setup.sh, Docker |
| **monitoring-setup.sh** | `infrastructure/scripts/monitoring-setup.sh` | Monitoring stack provisioning | Docker Compose |

#### Common Features

All scripts implement standardized patterns for:

- ✅ **Comprehensive argument parsing** with `--help`, `--verbose`, and operation-specific flags
- ✅ **Colored output and logging** with timestamps and structured error messages
- ✅ **Error handling and validation** with graceful failure recovery
- ✅ **Educational documentation** with inline comments and usage examples
- ✅ **Idempotent operations** that can be run multiple times safely
- ✅ **Function modularity** for reusability and testing

### setup.sh - Environment Setup

#### Purpose and Features

The setup script automates environment validation and preparation:

**Core Functions:**
- Environment tool version validation (Node.js, npm, Docker)
- Project structure verification and dependency installation
- Configuration file management (.env creation)
- Basic health checks and readiness validation

#### Usage Examples

```bash
# Standard environment setup
./infrastructure/scripts/setup.sh

# Setup with verbose output
./infrastructure/scripts/setup.sh --verbose

# Version checks only (no installation)
./infrastructure/scripts/setup.sh --check-only

# Skip Docker checks for development-only setup
./infrastructure/scripts/setup.sh --skip-docker

# Force dependency reinstallation
./infrastructure/scripts/setup.sh --force-install
```

#### Key Operations

**Environment Validation:**
```bash
# Node.js version checking
check_node_npm_versions() {
    local node_version=$(node --version)
    local npm_version=$(npm --version)
    
    if ! version_compare "$node_version" "$MIN_NODE_VERSION"; then
        log_error "Node.js version $node_version is below minimum required version $MIN_NODE_VERSION"
        exit 1
    fi
    
    log_success "Node.js $node_version and npm $npm_version meet requirements"
}
```

**Dependency Installation:**
```bash
# Reproducible dependency installation
install_node_dependencies() {
    cd "$BACKEND_DIR"
    
    if [[ -f "package-lock.json" ]]; then
        npm ci  # Clean install for reproducible builds
    else
        npm install  # Fallback for missing lock file
    fi
    
    log_success "Node.js dependencies installed successfully"
}
```

**Environment Configuration:**
```bash
# .env file management
validate_env_file() {
    if [[ ! -f "$ENV_FILE" ]] && [[ -f "$ENV_EXAMPLE_FILE" ]]; then
        cp "$ENV_EXAMPLE_FILE" "$ENV_FILE"
        log_success ".env file created from .env.example template"
        log_info "Please review and customize $ENV_FILE as needed"
    fi
}
```

### deploy.sh - Deployment Automation

#### Purpose and Features

The deployment script orchestrates end-to-end application deployment:

**Core Functions:**
- Docker image building with optimization and caching
- Container orchestration with Docker Compose
- Service health monitoring and validation
- Monitoring stack integration (optional)

#### Usage Examples

```bash
# Local development deployment
./infrastructure/scripts/deploy.sh

# Docker deployment with image rebuild
./infrastructure/scripts/deploy.sh --docker --rebuild

# Full deployment with monitoring stack
./infrastructure/scripts/deploy.sh --docker --monitoring

# Teardown all containers and cleanup
./infrastructure/scripts/deploy.sh --teardown

# Verbose deployment with detailed logging
./infrastructure/scripts/deploy.sh --docker --monitoring --verbose
```

#### Key Operations

**Docker Image Building:**
```bash
# Optimized Docker image build
build_docker_image() {
    local build_args=(
        "-t" "${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
        "-f" "$DOCKERFILE"
        "."  # Build context
    )
    
    if [[ "$REBUILD_IMAGE" == "true" ]]; then
        build_args=("--no-cache" "${build_args[@]}")
    fi
    
    docker build "${build_args[@]}"
    log_success "Docker image built successfully: ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
}
```

**Service Orchestration:**
```bash
# Docker Compose deployment
deploy_with_docker_compose() {
    local services_to_start="backend"
    
    if [[ "$PROVISION_MONITORING" == "true" ]]; then
        services_to_start="$services_to_start prometheus grafana"
    fi
    
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d $services_to_start
    
    # Wait for services to be ready
    wait_for_service_ready "http://localhost:$BACKEND_PORT/health" "Backend Application"
}
```

**Health Monitoring:**
```bash
# Service health validation
wait_for_service_ready() {
    local service_url="$1"
    local service_name="$2"
    local timeout="${3:-60}"
    local max_attempts=$((timeout / 5))
    
    for attempt in $(seq 1 $max_attempts); do
        if curl -s --max-time 5 "$service_url" > /dev/null 2>&1; then
            log_success "$service_name is ready and responding"
            return 0
        fi
        sleep 5
    done
    
    log_warning "$service_name is not responding after $timeout seconds"
    return 1
}
```

### monitoring-setup.sh - Monitoring Automation

#### Purpose and Features

The monitoring setup script provisions the observability stack:

**Core Functions:**
- Prometheus and Grafana container orchestration
- Configuration file validation and syntax checking
- Automated Grafana dashboard import
- Service health verification and troubleshooting

#### Usage Examples

```bash
# Standard monitoring setup
./infrastructure/scripts/monitoring-setup.sh

# Setup with automatic dashboard import
./infrastructure/scripts/monitoring-setup.sh --import-dashboard

# Restart monitoring services
./infrastructure/scripts/monitoring-setup.sh --restart

# Clean previous setup and restart
./infrastructure/scripts/monitoring-setup.sh --clean

# Setup monitoring without backend service
./infrastructure/scripts/monitoring-setup.sh --skip-backend
```

#### Key Operations

**Configuration Validation:**
```bash
# Prometheus configuration syntax validation
validate_monitoring_configs() {
    if ! docker run --rm -v "$PROMETHEUS_CONFIG":/tmp/prometheus.yml \
        prom/prometheus:v2.52.0 promtool check config /tmp/prometheus.yml; then
        log_warning "Prometheus configuration syntax validation failed"
    fi
    
    # Grafana dashboard JSON validation
    if ! python3 -m json.tool "$GRAFANA_DASHBOARD" > /dev/null 2>&1; then
        log_warning "Grafana dashboard JSON syntax validation failed"
    fi
}
```

**Service Health Monitoring:**
```bash
# Multi-service health verification
verify_services_health() {
    local health_checks_passed=0
    local total_health_checks=0
    
    ((total_health_checks++))
    if check_service_health "http://localhost:$PROMETHEUS_PORT/-/healthy" "Prometheus"; then
        ((health_checks_passed++))
    fi
    
    ((total_health_checks++))
    if check_service_health "http://localhost:$GRAFANA_PORT/api/health" "Grafana"; then
        ((health_checks_passed++))
    fi
    
    log_success "Health checks: $health_checks_passed/$total_health_checks services healthy"
}
```

**Dashboard Automation:**
```bash
# Automated Grafana dashboard import
import_grafana_dashboard() {
    local grafana_api_url="http://localhost:$GRAFANA_PORT/api"
    
    # Configure Prometheus datasource
    local datasource_config='{
        "name": "prometheus",
        "type": "prometheus", 
        "url": "http://prometheus:9090",
        "access": "proxy",
        "isDefault": true
    }'
    
    curl -s -X POST \
        -H "Content-Type: application/json" \
        -u "$GRAFANA_DEFAULT_USER:$GRAFANA_DEFAULT_PASS" \
        -d "$datasource_config" \
        "$grafana_api_url/datasources"
    
    # Import dashboard via API
    if command -v jq &> /dev/null; then
        local dashboard_payload=$(jq -n \
            --argjson dashboard "$(cat "$GRAFANA_DASHBOARD")" \
            '{ dashboard: $dashboard.dashboard, overwrite: true }')
        
        curl -s -X POST \
            -H "Content-Type: application/json" \
            -u "$GRAFANA_DEFAULT_USER:$GRAFANA_DEFAULT_PASS" \
            -d "$dashboard_payload" \
            "$grafana_api_url/dashboards/import"
    fi
}
```

### Script Integration and Dependencies

#### Shared Functionality

The scripts share common utilities through sourcing patterns:

**Logger Functions:**
```bash
# Standardized logging with timestamps and colors
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

log_verbose() {
    if [[ "$VERBOSE_MODE" == "true" ]]; then
        echo -e "${PURPLE}[VERBOSE]${NC} $1"
    fi
}
```

**Version Comparison:**
```bash
# Semantic version comparison utility
version_compare() {
    local version1="$1"
    local version2="$2"
    
    version1="${version1#v}"
    version2="${version2#v}"
    
    IFS='.' read -ra ver1_parts <<< "$version1"
    IFS='.' read -ra ver2_parts <<< "$version2"
    
    for i in {0..2}; do
        local v1="${ver1_parts[i]:-0}"
        local v2="${ver2_parts[i]:-0}"
        
        v1="${v1%%[^0-9]*}"
        v2="${v2%%[^0-9]*}"
        
        if (( v1 > v2 )); then
            return 0
        elif (( v1 < v2 )); then
            return 1
        fi
    done
    
    return 0
}
```

#### Script Execution Flow

**Integrated Deployment Pipeline:**
```bash
# Full deployment workflow
./infrastructure/scripts/setup.sh --verbose
./infrastructure/scripts/deploy.sh --docker --monitoring
./infrastructure/scripts/monitoring-setup.sh --import-dashboard

# Teardown workflow
./infrastructure/scripts/deploy.sh --teardown
./infrastructure/scripts/monitoring-setup.sh --clean
```

**CI/CD Integration:**
```bash
#!/bin/bash
# Example CI/CD pipeline integration

set -e

# Environment setup
./infrastructure/scripts/setup.sh --check-only

# Build and test
npm test

# Deploy application
./infrastructure/scripts/deploy.sh --docker --skip-setup

# Verify deployment
curl -f http://localhost:3000/health

# Setup monitoring
./infrastructure/scripts/monitoring-setup.sh --skip-backend

echo "Deployment completed successfully"
```

### Automation Best Practices

| Practice | Implementation | Benefit |
|----------|----------------|---------|
| **Idempotent Operations** | State checking before actions | Safe re-execution |
| **Comprehensive Logging** | Structured output with timestamps | Debugging and monitoring |
| **Error Handling** | Graceful failure with cleanup | Reliable operations |
| **Argument Validation** | Input sanitization and validation | User-friendly interface |
| **Progress Indication** | Step-by-step status reporting | Operational visibility |
| **Documentation** | Inline help and usage examples | Educational value |

## References and Further Reading

### Project Documentation

#### Core Application Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| **Backend README** | [`src/backend/README.md`](../src/backend/README.md) | Complete backend setup, API documentation, and development guide |
| **API Documentation** | [`src/backend/docs/API.md`](../src/backend/docs/API.md) | Detailed API reference and endpoint documentation |
| **Package Configuration** | [`src/backend/package.json`](../src/backend/package.json) | Dependencies, scripts, and project metadata |

#### Infrastructure Configuration Files

**Docker and Containerization:**
- [`infrastructure/docker/Dockerfile`](../infrastructure/docker/Dockerfile) - Production-ready container image definition
- [`infrastructure/docker/docker-compose.yml`](../infrastructure/docker/docker-compose.yml) - Multi-service orchestration configuration

**Kubernetes Manifests:**
- [`infrastructure/kubernetes/deployment.yaml`](../infrastructure/kubernetes/deployment.yaml) - Pod management and rolling updates
- [`infrastructure/kubernetes/service.yaml`](../infrastructure/kubernetes/service.yaml) - Internal load balancing and service discovery
- [`infrastructure/kubernetes/ingress.yaml`](../infrastructure/kubernetes/ingress.yaml) - External HTTP access and routing

**Monitoring Configuration:**
- [`infrastructure/monitoring/prometheus.yml`](../infrastructure/monitoring/prometheus.yml) - Metrics collection and scraping configuration
- [`infrastructure/monitoring/grafana-dashboard.json`](../infrastructure/monitoring/grafana-dashboard.json) - Pre-configured visualization dashboards

**Process Management:**
- [`infrastructure/config/nginx.conf`](../infrastructure/config/nginx.conf) - Reverse proxy and load balancing configuration
- [`infrastructure/config/pm2.config.js`](../infrastructure/config/pm2.config.js) - Process management and clustering setup

**Infrastructure as Code:**
- [`infrastructure/terraform/main.tf`](../infrastructure/terraform/main.tf) - Core cloud infrastructure resources
- [`infrastructure/terraform/variables.tf`](../infrastructure/terraform/variables.tf) - Input variables and parameterization
- [`infrastructure/terraform/outputs.tf`](../infrastructure/terraform/outputs.tf) - Resource outputs and access information

### Technology Documentation

#### Node.js and Express.js

| Resource | URL | Description |
|----------|-----|-------------|
| **Node.js Official Documentation** | [nodejs.org/docs](https://nodejs.org/docs/) | Complete Node.js API reference and guides |
| **Express.js 5.x Guide** | [expressjs.com/en/5x/api.html](https://expressjs.com/en/5x/api.html) | Express.js v5 API documentation and migration guide |
| **npm Documentation** | [docs.npmjs.com](https://docs.npmjs.com/) | Package management and dependency handling |

#### Containerization and Orchestration

| Resource | URL | Description |
|----------|-----|-------------|
| **Docker Documentation** | [docs.docker.com](https://docs.docker.com/) | Container platform documentation and best practices |
| **Docker Compose Reference** | [docs.docker.com/compose](https://docs.docker.com/compose/) | Multi-container application orchestration |
| **Kubernetes Documentation** | [kubernetes.io/docs](https://kubernetes.io/docs/) | Container orchestration and cluster management |

#### Monitoring and Observability

| Resource | URL | Description |
|----------|-----|-------------|
| **Prometheus Documentation** | [prometheus.io/docs](https://prometheus.io/docs/) | Metrics collection and time-series database |
| **Grafana Documentation** | [grafana.com/docs](https://grafana.com/docs/) | Visualization and dashboard platform |
| **Node.js Monitoring Guide** | [nodejs.org/en/learn/getting-started/monitoring](https://nodejs.org/en/learn/getting-started/monitoring) | Application performance monitoring best practices |

#### Infrastructure as Code

| Resource | URL | Description |
|----------|-----|-------------|
| **Terraform Documentation** | [registry.terraform.io/providers/hashicorp/aws/latest/docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs) | Infrastructure provisioning and management |
| **AWS Provider Documentation** | [registry.terraform.io/providers/hashicorp/aws/latest](https://registry.terraform.io/providers/hashicorp/aws/latest) | AWS resource management with Terraform |

#### Process Management and Reverse Proxy

| Resource | URL | Description |
|----------|-----|-------------|
| **PM2 Documentation** | [pm2.keymetrics.io/docs](https://pm2.keymetrics.io/docs/) | Process management and clustering for Node.js |
| **Nginx Documentation** | [nginx.org/en/docs](http://nginx.org/en/docs/) | Reverse proxy and web server configuration |

### Quick Start Guides

#### 5-Minute Setup

```bash
# 1. Clone and setup environment
git clone <repository-url>
cd nodejs-tutorial-backend
./infrastructure/scripts/setup.sh

# 2. Start the application
cd src/backend
npm start

# 3. Test the application
curl http://localhost:3000/hello
```

#### Container Deployment

```bash
# 1. Environment setup with Docker
./infrastructure/scripts/setup.sh

# 2. Deploy with Docker Compose
./infrastructure/scripts/deploy.sh --docker

# 3. Access application
curl http://localhost:3000/hello
```

#### Full Production Setup

```bash
# 1. Complete environment validation
./infrastructure/scripts/setup.sh --verbose

# 2. Deploy with monitoring
./infrastructure/scripts/deploy.sh --docker --monitoring

# 3. Setup observability stack
./infrastructure/scripts/monitoring-setup.sh --import-dashboard

# 4. Access points
curl http://localhost:3000/hello        # Application
open http://localhost:9090              # Prometheus
open http://localhost:3001              # Grafana (admin/admin)
```

### Troubleshooting Resources

#### Common Issues and Solutions

**Environment Setup Issues:**
- [Node.js Installation Guide](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)
- [Docker Installation Guide](https://docs.docker.com/get-docker/)
- [Port Conflict Resolution](https://stackoverflow.com/questions/tagged/port+nodejs)

**Container Deployment Issues:**
- [Docker Troubleshooting Guide](https://docs.docker.com/config/troubleshoot/)
- [Docker Compose Debugging](https://docs.docker.com/compose/troubleshooting/)

**Monitoring Setup Issues:**
- [Prometheus Troubleshooting](https://prometheus.io/docs/prometheus/latest/troubleshooting/)
- [Grafana Configuration Guide](https://grafana.com/docs/grafana/latest/troubleshooting/)

### Community and Support

#### Educational Resources

| Resource | Type | Description |
|----------|------|-------------|
| **Node.js Learning Path** | Official Guide | [nodejs.org/en/learn](https://nodejs.org/en/learn/) |
| **Express.js Tutorial Series** | Documentation | [expressjs.com/en/starter/installing.html](https://expressjs.com/en/starter/installing.html) |
| **Docker for Beginners** | Tutorial | [docker.com/101-tutorial](https://www.docker.com/101-tutorial/) |
| **Kubernetes Basics** | Interactive Tutorial | [kubernetes.io/docs/tutorials/kubernetes-basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/) |

#### Community Support

- **Node.js Community**: [nodejs.org/en/get-involved](https://nodejs.org/en/get-involved/)
- **Express.js Discussions**: [github.com/expressjs/express/discussions](https://github.com/expressjs/express/discussions)
- **Docker Community**: [community.docker.com](https://community.docker.com/)
- **Kubernetes Community**: [kubernetes.io/community](https://kubernetes.io/community/)

### Next Steps

#### Extending the Infrastructure

**Adding Database Support:**
1. Review PostgreSQL or MongoDB integration patterns
2. Update Docker Compose with database services
3. Implement database migration and seeding
4. Add database monitoring to Grafana dashboards

**Implementing CI/CD:**
1. Study GitHub Actions workflow examples
2. Integrate automated testing in pipelines
3. Add deployment automation with branch strategies
4. Implement blue-green or canary deployments

**Scaling for Production:**
1. Implement horizontal pod autoscaling in Kubernetes
2. Add Redis for session management and caching
3. Configure centralized logging with ELK stack
4. Implement comprehensive alerting rules

**Security Hardening:**
1. Add SSL/TLS termination with Let's Encrypt
2. Implement authentication and authorization
3. Add security scanning to CI/CD pipelines
4. Configure network policies and security contexts

---

## Conclusion

This infrastructure documentation provides a comprehensive foundation for deploying, monitoring, and managing the Node.js tutorial backend application. The progressive architecture demonstrates modern DevOps practices while maintaining educational clarity and production readiness.

The infrastructure supports multiple deployment patterns—from simple local development to full production deployments with monitoring, scaling, and automation. Each component is designed to be educational, well-documented, and extensible for real-world applications.

For additional support or contributions, please refer to the project repository and community resources listed in the references section.

**Key Takeaways:**
- ✅ **Progressive Complexity**: Start simple, scale as needed
- ✅ **Educational Focus**: Every component teaches modern practices
- ✅ **Production Ready**: All configurations follow industry standards
- ✅ **Comprehensive Automation**: Scripts handle the heavy lifting
- ✅ **Observable Systems**: Built-in monitoring and health checks
- ✅ **Extensible Architecture**: Easy to add new components and features

Happy deploying! 🚀