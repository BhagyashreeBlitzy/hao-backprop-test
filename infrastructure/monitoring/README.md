# Health Check and Monitoring Subsystem

## Overview

The health check and monitoring subsystem provides comprehensive observability for the Node.js tutorial application backend. This subsystem centers around the `healthcheck.js` script, which implements a production-ready health checking mechanism that returns server status, uptime, memory usage, and system-level diagnostics.

### Purpose and Role

The monitoring subsystem serves several critical functions:

- **Health Assessment**: Provides real-time health status information for the application
- **Observability**: Enables monitoring and debugging of server performance and resource utilization
- **Container Integration**: Supports Docker HEALTHCHECK directives and Kubernetes health probes
- **CI/CD Integration**: Enables automated deployment readiness checks and monitoring workflows
- **Educational Value**: Demonstrates modern observability patterns and best practices in Node.js applications

### Key Benefits

| Benefit | Description | Use Case |
|---------|-------------|----------|
| **Operational Readiness** | Provides instant health status for production deployments | Container orchestration, load balancer health checks |
| **Performance Monitoring** | Tracks memory usage, uptime, and system metrics | Resource optimization, memory leak detection |
| **Educational Demonstration** | Shows practical implementation of health check patterns | Learning Node.js monitoring best practices |
| **Integration Flexibility** | Works with various monitoring tools and platforms | Prometheus, Datadog, custom monitoring solutions |

The health check system is designed to be lightweight, reliable, and educational, serving as both a functional monitoring tool and a learning resource for developers implementing observability in Node.js applications.

## Usage

### Running the Health Check Locally

The health check script can be executed as a standalone Node.js script for development and testing purposes:

```bash
# Basic health check execution
node infrastructure/monitoring/healthcheck.js

# Expected output (JSON format):
{
  "status": "OK",
  "uptime": 123.45,
  "timestamp": "2024-06-01T12:34:56.789Z",
  "memory": {
    "rss": 45678912,
    "heapTotal": 33554432,
    "heapUsed": 18874368,
    "external": 1234567,
    "arrayBuffers": 123456
  },
  "version": {
    "node": "v22.3.0",
    "platform": "linux",
    "architecture": "x64"
  },
  "system": {
    "loadAverage": [0.5, 0.3, 0.2],
    "freeMemory": 8589934592,
    "totalMemory": 17179869184,
    "memoryUsagePercent": 50.0,
    "cpuCount": 8
  }
}
```

### Exit Codes and Monitoring Integration

The health check script provides standard exit codes for monitoring tools:

| Exit Code | Status | Description | Monitoring Action |
|-----------|--------|-------------|-------------------|
| `0` | Healthy | All checks passed successfully | Continue normal operation |
| `1` | Unhealthy | Health check failed or error occurred | Investigate and potentially restart |

### Integration with Monitoring Tools

#### cURL-based Monitoring

```bash
# Direct health check execution with monitoring
if node infrastructure/monitoring/healthcheck.js > /dev/null 2>&1; then
    echo "Health check passed"
else
    echo "Health check failed"
    exit 1
fi

# Parse health check output
HEALTH_OUTPUT=$(node infrastructure/monitoring/healthcheck.js)
echo "Health Status: $HEALTH_OUTPUT"
```

#### Scripted Monitoring

```bash
#!/bin/bash
# Health check monitoring script
HEALTH_CHECK_SCRIPT="infrastructure/monitoring/healthcheck.js"
LOG_FILE="/var/log/health-check.log"

# Execute health check and capture output
if OUTPUT=$(node "$HEALTH_CHECK_SCRIPT" 2>&1); then
    echo "$(date): Health check passed" >> "$LOG_FILE"
    echo "$OUTPUT" >> "$LOG_FILE"
else
    echo "$(date): Health check failed" >> "$LOG_FILE"
    echo "$OUTPUT" >> "$LOG_FILE"
    # Trigger alert or restart logic here
fi
```

### Performance Considerations

- **Execution Time**: Typically completes in under 50ms
- **Memory Usage**: Minimal overhead, approximately 1-2MB during execution
- **System Impact**: Low CPU utilization, uses built-in Node.js APIs
- **Frequency**: Safe to run every 10-30 seconds for continuous monitoring

## Integration

### Docker HEALTHCHECK Integration

The health check script integrates seamlessly with Docker's HEALTHCHECK directive:

```dockerfile
# Dockerfile configuration
FROM node:22-alpine

WORKDIR /app

# Copy application files
COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Expose application port
EXPOSE 3000

# Configure health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node infrastructure/monitoring/healthcheck.js || exit 1

# Start application
CMD ["npm", "start"]
```

### Kubernetes Health Probes

Configure Kubernetes liveness and readiness probes:

```yaml
# kubernetes-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nodejs-tutorial-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nodejs-tutorial-app
  template:
    metadata:
      labels:
        app: nodejs-tutorial-app
    spec:
      containers:
      - name: app
        image: nodejs-tutorial-app:latest
        ports:
        - containerPort: 3000
        livenessProbe:
          exec:
            command:
            - node
            - infrastructure/monitoring/healthcheck.js
          initialDelaySeconds: 10
          periodSeconds: 30
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          exec:
            command:
            - node
            - infrastructure/monitoring/healthcheck.js
          initialDelaySeconds: 5
          periodSeconds: 10
          timeoutSeconds: 3
          failureThreshold: 2
```

### CI/CD Pipeline Integration

Integrate health checks into automated deployment workflows:

```yaml
# GitHub Actions workflow
name: Deploy with Health Check
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run health check
        run: node infrastructure/monitoring/healthcheck.js
        
      - name: Deploy application
        run: |
          # Deployment commands here
          echo "Deploying application..."
          
      - name: Verify deployment health
        run: |
          sleep 10
          node infrastructure/monitoring/healthcheck.js
          echo "Deployment health check passed"
```

### External Monitoring Systems

#### Prometheus Integration

```yaml
# prometheus-config.yml
scrape_configs:
  - job_name: 'nodejs-tutorial-health'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: /metrics
    scrape_interval: 15s
    healthcheck_path: /health
```

#### Datadog Integration

```bash
# Datadog custom check script
#!/bin/bash
# /etc/datadog-agent/checks.d/nodejs_health.py equivalent in bash

HEALTH_OUTPUT=$(node infrastructure/monitoring/healthcheck.js 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "nodejs.health.status:1|g"
    echo "nodejs.health.uptime:$(echo "$HEALTH_OUTPUT" | jq '.uptime')|g"
    echo "nodejs.health.memory.heap_used:$(echo "$HEALTH_OUTPUT" | jq '.memory.heapUsed')|g"
else
    echo "nodejs.health.status:0|g"
fi
```

### Load Balancer Health Checks

Configure load balancers to use the health check script:

```bash
# HAProxy configuration example
backend nodejs_backend
    balance roundrobin
    option httpchk GET /health
    server app1 127.0.0.1:3000 check
    server app2 127.0.0.1:3001 check
    server app3 127.0.0.1:3002 check
```

## Extensibility

### Adding Custom Health Checks

Extend the health check system by modifying the `getHealthData()` function:

```javascript
// Example: Adding database connectivity check
function getHealthData() {
    try {
        const basicHealthData = {
            status: HEALTH_STATUS_OK,
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            memory: process.memoryUsage(),
            version: {
                node: process.version,
                platform: os.platform(),
                architecture: os.arch()
            }
        };
        
        // Add custom health checks
        const customChecks = {
            database: checkDatabaseConnection(),
            cache: checkCacheConnection(),
            externalServices: checkExternalServices()
        };
        
        // Combine basic and custom health data
        return {
            ...basicHealthData,
            checks: customChecks
        };
        
    } catch (error) {
        logger.error('Health check failed', error);
        return {
            status: HEALTH_STATUS_ERROR,
            timestamp: new Date().toISOString(),
            error: 'Health check failed',
            message: error.message
        };
    }
}

// Custom check implementations
function checkDatabaseConnection() {
    try {
        // Database connection check logic
        return { status: 'OK', latency: 5 };
    } catch (error) {
        return { status: 'ERROR', error: error.message };
    }
}

function checkCacheConnection() {
    try {
        // Cache connection check logic
        return { status: 'OK', latency: 2 };
    } catch (error) {
        return { status: 'ERROR', error: error.message };
    }
}
```

### Creating HTTP Health Endpoints

Expose health data via HTTP endpoints for web-based monitoring:

```javascript
// Express.js health endpoint implementation
const express = require('express');
const { getHealthData } = require('./infrastructure/monitoring/healthcheck');

const app = express();

// Health check endpoint
app.get('/health', (req, res) => {
    const healthData = getHealthData();
    const statusCode = healthData.status === 'OK' ? 200 : 503;
    
    res.status(statusCode).json(healthData);
});

// Detailed health endpoint
app.get('/health/detailed', (req, res) => {
    const healthData = getHealthData();
    const statusCode = healthData.status === 'OK' ? 200 : 503;
    
    res.status(statusCode).json({
        ...healthData,
        environment: process.env.NODE_ENV,
        pid: process.pid,
        hostname: require('os').hostname()
    });
});

// Liveness probe endpoint (minimal check)
app.get('/health/live', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Readiness probe endpoint (comprehensive check)
app.get('/health/ready', (req, res) => {
    const healthData = getHealthData();
    const isReady = healthData.status === 'OK' && healthData.uptime > 10;
    const statusCode = isReady ? 200 : 503;
    
    res.status(statusCode).json({
        status: isReady ? 'READY' : 'NOT_READY',
        uptime: healthData.uptime,
        timestamp: healthData.timestamp
    });
});
```

### Integration with Monitoring Platforms

#### Prometheus Metrics Export

```javascript
// Prometheus metrics integration
const promClient = require('prom-client');

// Create custom metrics
const healthCheckDuration = new promClient.Histogram({
    name: 'health_check_duration_seconds',
    help: 'Duration of health check execution',
    labelNames: ['status']
});

const memoryUsageGauge = new promClient.Gauge({
    name: 'nodejs_memory_usage_bytes',
    help: 'Node.js memory usage in bytes',
    labelNames: ['type']
});

// Enhanced health check with metrics
function getHealthDataWithMetrics() {
    const startTime = Date.now();
    
    try {
        const healthData = getHealthData();
        
        // Record metrics
        const duration = (Date.now() - startTime) / 1000;
        healthCheckDuration.observe({ status: healthData.status }, duration);
        
        // Update memory metrics
        memoryUsageGauge.set({ type: 'rss' }, healthData.memory.rss);
        memoryUsageGauge.set({ type: 'heapTotal' }, healthData.memory.heapTotal);
        memoryUsageGauge.set({ type: 'heapUsed' }, healthData.memory.heapUsed);
        
        return healthData;
    } catch (error) {
        healthCheckDuration.observe({ status: 'ERROR' }, (Date.now() - startTime) / 1000);
        throw error;
    }
}
```

### Error Handling and Logging Best Practices

```javascript
// Enhanced error handling in health checks
function robustHealthCheck() {
    const healthData = {
        status: HEALTH_STATUS_OK,
        timestamp: new Date().toISOString(),
        checks: {}
    };
    
    // Individual check implementations with error isolation
    const checks = [
        { name: 'memory', fn: checkMemory },
        { name: 'disk', fn: checkDiskSpace },
        { name: 'network', fn: checkNetworkConnectivity }
    ];
    
    for (const check of checks) {
        try {
            healthData.checks[check.name] = check.fn();
            logger.info(`Health check ${check.name} passed`);
        } catch (error) {
            healthData.checks[check.name] = {
                status: 'ERROR',
                error: error.message,
                timestamp: new Date().toISOString()
            };
            logger.error(`Health check ${check.name} failed`, error);
            healthData.status = HEALTH_STATUS_ERROR;
        }
    }
    
    return healthData;
}
```

## Educational Value

### Understanding Health Check Patterns

Health checks are a fundamental component of modern application architecture, serving as the foundation for:

**Observability and Monitoring**
- **Real-time Status**: Provides immediate insight into application health and performance
- **Trend Analysis**: Historical health data enables performance trend identification
- **Alerting**: Triggers notifications when health thresholds are exceeded

**Production Readiness**
- **Deployment Validation**: Ensures applications are ready to serve traffic
- **Load Balancer Integration**: Enables automatic traffic routing based on health status
- **Container Orchestration**: Supports Kubernetes and Docker health management

**Operational Excellence**
- **Proactive Monitoring**: Identifies issues before they impact users
- **Automated Recovery**: Enables automatic restart and failover mechanisms
- **Compliance**: Supports operational compliance and SLA monitoring

### Node.js Specific Considerations

The health check implementation demonstrates several Node.js best practices:

#### Event Loop Monitoring

```javascript
// Monitor event loop lag
const { performance } = require('perf_hooks');

function checkEventLoopLag() {
    const start = performance.now();
    
    setImmediate(() => {
        const lag = performance.now() - start;
        return {
            status: lag < 50 ? 'OK' : 'DEGRADED',
            lagMs: lag,
            threshold: 50
        };
    });
}
```

#### Memory Management

```javascript
// Comprehensive memory monitoring
function getMemoryHealth() {
    const usage = process.memoryUsage();
    const totalSystemMemory = require('os').totalmem();
    
    return {
        heap: {
            used: usage.heapUsed,
            total: usage.heapTotal,
            utilization: (usage.heapUsed / usage.heapTotal * 100).toFixed(2)
        },
        system: {
            rss: usage.rss,
            external: usage.external,
            systemTotal: totalSystemMemory,
            systemUtilization: (usage.rss / totalSystemMemory * 100).toFixed(2)
        }
    };
}
```

### Observability Patterns in Node.js

The health check system demonstrates several observability patterns:

#### Structured Logging

```javascript
// Structured logging for health events
logger.info('Health check completed', {
    status: healthData.status,
    duration: responseTime,
    memory: {
        heapUsed: healthData.memory.heapUsed,
        heapTotal: healthData.memory.heapTotal
    },
    uptime: healthData.uptime
});
```

#### Metrics Collection

```javascript
// Metrics collection patterns
const metrics = {
    counters: {
        healthCheckExecutions: 0,
        healthCheckFailures: 0
    },
    gauges: {
        currentMemoryUsage: 0,
        uptime: 0
    },
    histograms: {
        healthCheckDuration: []
    }
};

function recordHealthCheckMetrics(healthData, duration) {
    metrics.counters.healthCheckExecutions++;
    metrics.gauges.currentMemoryUsage = healthData.memory.heapUsed;
    metrics.gauges.uptime = healthData.uptime;
    metrics.histograms.healthCheckDuration.push(duration);
    
    if (healthData.status !== 'OK') {
        metrics.counters.healthCheckFailures++;
    }
}
```

### Best Practices for Health Checks

#### 1. Lightweight Implementation
- Keep health checks fast and lightweight (< 100ms execution time)
- Avoid expensive operations like database queries in basic health checks
- Use cached results for expensive checks when appropriate

#### 2. Comprehensive Coverage
- Monitor critical application dependencies
- Include system-level metrics (memory, CPU, disk)
- Validate external service connectivity

#### 3. Graceful Degradation
- Implement multiple levels of health checks (liveness, readiness, detailed)
- Provide meaningful error messages without exposing sensitive information
- Use circuit breaker patterns for external dependencies

#### 4. Monitoring Integration
- Design health checks for easy integration with monitoring tools
- Use standard exit codes and response formats
- Implement both push and pull monitoring patterns

### Further Reading and Resources

**Node.js Monitoring Resources:**
- [Node.js Performance Monitoring Guide](https://nodejs.org/en/docs/guides/simple-profiling/)
- [Express.js Health Check Patterns](https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html)
- [Docker Health Check Documentation](https://docs.docker.com/engine/reference/builder/#healthcheck)
- [Kubernetes Health Check Best Practices](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)

**Observability and Monitoring:**
- [The Three Pillars of Observability](https://distributed-systems-observability-ebook.humio.com/)
- [Prometheus Monitoring Best Practices](https://prometheus.io/docs/practices/monitoring/)
- [Application Performance Monitoring (APM) Patterns](https://newrelic.com/resources/ebooks/what-is-application-performance-monitoring)

**Production Readiness:**
- [12-Factor App Methodology](https://12factor.net/)
- [Site Reliability Engineering (SRE) Principles](https://sre.google/sre-book/table-of-contents/)
- [Microservices Health Check Patterns](https://microservices.io/patterns/observability/health-check-api.html)

This comprehensive health check and monitoring documentation provides both practical implementation guidance and educational value for developers learning to implement robust observability patterns in Node.js applications. The system demonstrates production-ready practices while maintaining the simplicity necessary for educational purposes.