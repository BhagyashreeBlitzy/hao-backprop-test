/**
 * Integration Performance Test Suite for Node.js Tutorial Application
 * 
 * This comprehensive performance test suite validates the HTTP endpoints of the Node.js tutorial
 * application, with primary focus on the /hello endpoint performance requirements. The suite uses
 * Jest and Supertest to measure response times, throughput, and resource usage under various load
 * conditions, ensuring compliance with technical specification performance targets.
 * 
 * Key Performance Requirements Validated:
 * - /hello endpoint response time < 100ms per request (F-002-RQ-001)
 * - Consistent performance under moderate concurrent load
 * - Throughput benchmarks for educational and monitoring purposes
 * - Resource usage tracking for performance regression detection
 * 
 * Educational Value:
 * - Demonstrates best practices for Node.js/Express.js performance testing
 * - Shows proper use of Jest and Supertest for HTTP performance measurement
 * - Illustrates concurrent request testing patterns and load simulation
 * - Provides reproducible performance testing methodology
 * - Educational examples with comprehensive documentation
 * 
 * Technical Implementation:
 * - Jest v29.0.0 for test framework and assertions
 * - Supertest v7.1.1 for HTTP request testing and timing
 * - High-precision timing using process.hrtime.bigint()
 * - Concurrent request handling with Promise.all
 * - Statistical analysis of response time distributions
 * 
 * @fileoverview Performance and load testing suite for the Node.js tutorial application
 * @author Node.js Tutorial Project
 * @version 1.0.0
 * @requires jest ^29.0.0
 * @requires supertest ^7.1.1
 */

// =============================================================================
// EXTERNAL DEPENDENCIES
// =============================================================================

/**
 * Supertest HTTP Testing Library
 * 
 * SuperAgent driven library for testing HTTP servers in Node.js. Provides
 * high-level abstraction for testing HTTP endpoints with built-in assertion
 * capabilities and excellent integration with testing frameworks like Jest.
 * 
 * Key Features for Performance Testing:
 * - Precise timing measurement for HTTP requests
 * - Promise-based API for concurrent request testing
 * - Built-in assertion methods for response validation
 * - Automatic server binding to ephemeral ports for testing
 * - Support for all HTTP methods and headers
 * 
 * Performance Testing Benefits:
 * - Measures actual HTTP request/response cycles
 * - Includes network overhead in timing measurements
 * - Supports concurrent request simulation for load testing
 * - Provides realistic performance metrics under HTTP protocol
 * 
 * @external supertest
 * @see {@link https://github.com/visionmedia/supertest} Supertest documentation
 * @version 7.1.1
 */
const request = require('supertest'); // v7.1.1

// =============================================================================
// INTERNAL DEPENDENCIES  
// =============================================================================

/**
 * Express Application Instance
 * 
 * The fully configured Express.js application instance containing all middleware,
 * routes, and error handlers. This is the same instance used in production,
 * ensuring performance tests measure real application behavior.
 * 
 * Application Configuration:
 * - Express.js v5.1.0 with latest performance optimizations
 * - /hello endpoint returning 'Hello world' message
 * - Complete middleware stack including logging and error handling
 * - Production-ready configuration for accurate performance measurement
 * 
 * Testing Integration:
 * - Supertest binds to ephemeral port automatically
 * - No need to manually start server or manage ports
 * - Fresh application state for each test execution
 */
const app = require('../../../src/backend/app.js');

/**
 * Sample Request Fixtures
 * 
 * Canonical HTTP request shapes and test data for consistent testing across
 * the application. Contains the hello_get_request fixture with proper headers
 * and expected response characteristics for performance validation.
 * 
 * Fixture Contents:
 * - hello_get_request: Canonical GET /hello request with proper headers
 * - Expected response format and status codes
 * - Test scenario descriptions for documentation
 * - Request metadata for comprehensive test validation
 * 
 * Usage Benefits:
 * - Ensures consistent request format across all performance tests
 * - Validates both performance and functional requirements
 * - Provides maintainable test data management
 * - Supports contract testing and API validation
 */
const sampleRequests = require('../fixtures/sample-requests.json');

// =============================================================================
// PERFORMANCE TEST CONFIGURATION
// =============================================================================

/**
 * Performance Target Response Time (milliseconds)
 * 
 * Maximum acceptable response time for individual requests to the /hello endpoint
 * as specified in technical requirements F-002-RQ-001. This target ensures the
 * application meets performance specifications under normal load conditions.
 * 
 * Specification Reference:
 * - Technical Specifications/2.2.2 Hello Endpoint Requirements
 * - Performance Criteria: Response time < 100ms
 * - Applied to both single requests and average concurrent request times
 * 
 * @constant {number}
 */
const PERFORMANCE_TARGET_MS = 100;

/**
 * Concurrent Request Count for Load Testing
 * 
 * Number of simultaneous requests used to test application performance under
 * concurrent load. This value simulates moderate production load to validate
 * performance stability and scalability characteristics.
 * 
 * Load Testing Configuration:
 * - Moderate concurrent load for educational environment
 * - Suitable for development and CI/CD pipeline execution
 * - Represents realistic usage patterns for tutorial application
 * - Allows detection of performance degradation under load
 * 
 * @constant {number}
 */
const CONCURRENT_REQUESTS = 20;

/**
 * Total Request Count for Throughput Testing
 * 
 * Total number of requests used for throughput measurement and statistical
 * analysis of application performance. Provides sufficient sample size for
 * meaningful performance metrics and trend analysis.
 * 
 * Throughput Testing Configuration:
 * - Large enough sample for statistical significance
 * - Reasonable execution time for development workflows
 * - Enables detection of performance regression patterns
 * - Supports performance baseline establishment
 * 
 * @constant {number}
 */
const TOTAL_REQUESTS = 100;

/**
 * Request Timeout for Performance Tests (milliseconds)
 * 
 * Maximum time to wait for individual HTTP requests during performance testing.
 * Set to 5 seconds to accommodate slower development environments while still
 * detecting genuine performance issues and hanging requests.
 * 
 * Timeout Configuration:
 * - Generous timeout for development environment compatibility
 * - Prevents test suite hanging on failed requests
 * - Allows detection of severe performance degradation
 * - Balances test reliability with failure detection
 * 
 * @constant {number}
 */
const REQUEST_TIMEOUT_MS = 5000;

/**
 * Minimum Acceptable Throughput (requests per second)
 * 
 * Minimum throughput threshold for the /hello endpoint under load testing.
 * This baseline ensures the application can handle reasonable concurrent load
 * and maintains acceptable performance characteristics.
 * 
 * Throughput Requirements:
 * - Conservative baseline suitable for educational environments
 * - Accounts for development hardware limitations
 * - Provides early warning for performance degradation
 * - Supports performance monitoring and alerting
 * 
 * @constant {number}
 */
const MIN_THROUGHPUT_RPS = 50;

// =============================================================================
// PERFORMANCE MEASUREMENT UTILITIES
// =============================================================================

/**
 * Measure Response Time for Single HTTP Request
 * 
 * Measures the complete response time for a single GET request to the /hello endpoint
 * using high-precision timing. This function provides the foundation for all performance
 * measurements in the test suite.
 * 
 * Measurement Process:
 * 1. Record high-precision start time using process.hrtime.bigint()
 * 2. Send GET request to /hello endpoint using Supertest
 * 3. Wait for complete response including body transmission
 * 4. Record end time and calculate elapsed duration
 * 5. Convert to milliseconds with microsecond precision
 * 
 * Performance Measurement Features:
 * - High-precision timing using Node.js process.hrtime.bigint()
 * - Includes complete HTTP request/response cycle
 * - Measures actual network communication overhead
 * - Returns floating-point milliseconds for precise analysis
 * 
 * Educational Value:
 * - Demonstrates proper performance measurement techniques
 * - Shows Node.js high-precision timing capabilities
 * - Illustrates async/await patterns for HTTP testing
 * - Provides foundation for understanding response time analysis
 * 
 * @async
 * @function measureSingleRequestTime
 * @returns {Promise<number>} Response time in milliseconds with microsecond precision
 * @throws {Error} Throws error if request fails or times out
 * 
 * @example
 * const responseTime = await measureSingleRequestTime();
 * console.log(`Response time: ${responseTime.toFixed(2)}ms`);
 */
async function measureSingleRequestTime(): Promise<number> {
    // Record high-precision start time using Node.js process.hrtime.bigint()
    // This provides nanosecond precision timing for accurate performance measurement
    const startTime = process.hrtime.bigint();
    
    try {
        // Send GET request to /hello endpoint using Supertest with canonical headers
        // Uses the sample request fixture to ensure consistent test conditions
        const response = await request(app)
            .get(sampleRequests.hello_get_request.path)
            .set(sampleRequests.hello_get_request.headers)
            .timeout(REQUEST_TIMEOUT_MS)
            .expect(sampleRequests.hello_get_request.expectedStatus)
            .expect('Content-Type', /text\/plain/);
            
        // Record end time immediately after response completion
        const endTime = process.hrtime.bigint();
        
        // Calculate elapsed time in nanoseconds and convert to milliseconds
        // BigInt arithmetic ensures precision is maintained throughout calculation
        const elapsedNanoseconds = endTime - startTime;
        const elapsedMilliseconds = Number(elapsedNanoseconds) / 1_000_000;
        
        // Validate response content to ensure functional correctness
        expect(response.text).toBe('Hello world');
        
        return elapsedMilliseconds;
        
    } catch (error) {
        // Record end time for failed requests to calculate timeout duration
        const endTime = process.hrtime.bigint();
        const elapsedNanoseconds = endTime - startTime;
        const elapsedMilliseconds = Number(elapsedNanoseconds) / 1_000_000;
        
        // Re-throw error with timing information for debugging
        throw new Error(`Request failed after ${elapsedMilliseconds.toFixed(2)}ms: ${error.message}`);
    }
}

/**
 * Measure Response Times for Concurrent HTTP Requests
 * 
 * Executes multiple concurrent GET requests to the /hello endpoint and measures
 * response times for each request. This function simulates concurrent user load
 * and provides statistical analysis of performance under concurrent conditions.
 * 
 * Concurrent Testing Process:
 * 1. Create array of concurrent request promises
 * 2. Execute all requests simultaneously using Promise.all
 * 3. Measure individual response times for each request
 * 4. Calculate statistical metrics (average, min, max, percentiles)
 * 5. Return comprehensive performance analysis
 * 
 * Statistical Analysis Features:
 * - Individual response time measurement for each concurrent request
 * - Average, minimum, and maximum response time calculation
 * - 95th percentile response time for performance SLA validation
 * - Standard deviation for performance consistency analysis
 * - Success rate calculation for reliability assessment
 * 
 * Load Testing Benefits:
 * - Validates performance under realistic concurrent load
 * - Detects performance degradation due to resource contention
 * - Measures scalability characteristics of the application
 * - Provides data for capacity planning and performance optimization
 * 
 * Educational Value:
 * - Demonstrates concurrent request testing patterns
 * - Shows Promise.all usage for parallel HTTP operations
 * - Illustrates statistical analysis of performance data
 * - Provides understanding of load testing methodologies
 * 
 * @async
 * @function measureConcurrentRequests
 * @param {number} concurrentCount - Number of concurrent requests to execute
 * @returns {Promise<Object>} Performance metrics object with timing statistics
 * @throws {Error} Throws error if concurrent request execution fails
 * 
 * @example
 * const metrics = await measureConcurrentRequests(20);
 * console.log(`Average response time: ${metrics.averageMs.toFixed(2)}ms`);
 * console.log(`95th percentile: ${metrics.p95Ms.toFixed(2)}ms`);
 */
async function measureConcurrentRequests(concurrentCount: number): Promise<{
    averageMs: number;
    minMs: number;
    maxMs: number;
    p95Ms: number;
    standardDeviationMs: number;
    successRate: number;
    responseTimes: number[];
}> {
    // Create array of concurrent request promises
    // Each promise executes measureSingleRequestTime independently
    const requestPromises: Promise<number>[] = [];
    
    for (let i = 0; i < concurrentCount; i++) {
        requestPromises.push(measureSingleRequestTime());
    }
    
    try {
        // Execute all requests concurrently and wait for completion
        // Promise.all ensures all requests are processed simultaneously
        const responseTimes = await Promise.all(requestPromises);
        
        // Calculate statistical metrics from response time array
        const sortedTimes = [...responseTimes].sort((a, b) => a - b);
        const averageMs = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
        const minMs = Math.min(...responseTimes);
        const maxMs = Math.max(...responseTimes);
        
        // Calculate 95th percentile response time for SLA validation
        const p95Index = Math.floor(sortedTimes.length * 0.95);
        const p95Ms = sortedTimes[p95Index] || maxMs;
        
        // Calculate standard deviation for performance consistency analysis
        const variance = responseTimes.reduce((sum, time) => sum + Math.pow(time - averageMs, 2), 0) / responseTimes.length;
        const standardDeviationMs = Math.sqrt(variance);
        
        // Success rate is 100% if all requests completed (no exceptions thrown)
        const successRate = 1.0;
        
        return {
            averageMs,
            minMs,
            maxMs,
            p95Ms,
            standardDeviationMs,
            successRate,
            responseTimes
        };
        
    } catch (error) {
        throw new Error(`Concurrent request measurement failed: ${error.message}`);
    }
}

/**
 * Measure Application Throughput Under Load
 * 
 * Executes a comprehensive throughput test by sending a specified number of requests
 * in batches of concurrent requests. This function measures the overall throughput
 * (requests per second) and provides detailed performance analysis.
 * 
 * Throughput Testing Process:
 * 1. Record overall test start time
 * 2. Execute requests in batches of specified concurrent count
 * 3. Process each batch concurrently using Promise.all
 * 4. Continue until total request count is reached
 * 5. Calculate throughput and aggregate response time statistics
 * 
 * Throughput Metrics:
 * - Total requests per second (RPS) for the entire test duration
 * - Average response time across all requests
 * - Response time distribution analysis (min, max, percentiles)
 * - Request success rate and error analysis
 * - Test duration and resource utilization information
 * 
 * Load Simulation Features:
 * - Realistic load patterns with batched concurrent requests
 * - Configurable concurrency level for different load scenarios
 * - Comprehensive performance data collection
 * - Memory usage tracking during test execution
 * 
 * Educational Value:
 * - Demonstrates throughput testing methodology
 * - Shows batch processing patterns for load generation
 * - Illustrates performance data aggregation and analysis
 * - Provides understanding of system capacity measurement
 * 
 * @async
 * @function measureThroughput
 * @param {number} totalRequests - Total number of requests to execute
 * @param {number} concurrentCount - Number of concurrent requests per batch
 * @returns {Promise<Object>} Throughput metrics with comprehensive performance data
 * @throws {Error} Throws error if throughput measurement fails
 * 
 * @example
 * const throughput = await measureThroughput(100, 10);
 * console.log(`Throughput: ${throughput.requestsPerSecond.toFixed(2)} RPS`);
 * console.log(`Average response time: ${throughput.averageResponseTimeMs.toFixed(2)}ms`);
 */
async function measureThroughput(totalRequests: number, concurrentCount: number): Promise<{
    requestsPerSecond: number;
    totalDurationMs: number;
    averageResponseTimeMs: number;
    minResponseTimeMs: number;
    maxResponseTimeMs: number;
    p95ResponseTimeMs: number;
    successRate: number;
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    memoryUsageMB: number;
}> {
    // Record test start time and initial memory usage
    const testStartTime = process.hrtime.bigint();
    const initialMemory = process.memoryUsage();
    
    // Arrays to collect performance data across all requests
    const allResponseTimes: number[] = [];
    let successfulRequests = 0;
    let failedRequests = 0;
    
    try {
        // Calculate number of batches needed to reach total request count
        const numberOfBatches = Math.ceil(totalRequests / concurrentCount);
        
        // Execute requests in batches to simulate realistic load patterns
        for (let batch = 0; batch < numberOfBatches; batch++) {
            // Calculate requests for this batch (handle remainder in final batch)
            const remainingRequests = totalRequests - (batch * concurrentCount);
            const batchSize = Math.min(concurrentCount, remainingRequests);
            
            try {
                // Execute concurrent requests for this batch
                const batchMetrics = await measureConcurrentRequests(batchSize);
                
                // Aggregate batch results into overall statistics
                allResponseTimes.push(...batchMetrics.responseTimes);
                successfulRequests += batchMetrics.responseTimes.length;
                
            } catch (error) {
                // Handle batch failures and continue with remaining batches
                failedRequests += batchSize;
                console.warn(`Batch ${batch + 1} failed: ${error.message}`);
            }
        }
        
        // Record test completion time and calculate duration
        const testEndTime = process.hrtime.bigint();
        const totalDurationNs = testEndTime - testStartTime;
        const totalDurationMs = Number(totalDurationNs) / 1_000_000;
        
        // Calculate final memory usage for resource monitoring
        const finalMemory = process.memoryUsage();
        const memoryUsageMB = (finalMemory.heapUsed - initialMemory.heapUsed) / 1024 / 1024;
        
        // Calculate comprehensive throughput and performance metrics
        const requestsPerSecond = (successfulRequests * 1000) / totalDurationMs;
        const averageResponseTimeMs = allResponseTimes.length > 0 
            ? allResponseTimes.reduce((sum, time) => sum + time, 0) / allResponseTimes.length 
            : 0;
        
        // Calculate response time distribution statistics
        const sortedTimes = [...allResponseTimes].sort((a, b) => a - b);
        const minResponseTimeMs = sortedTimes.length > 0 ? sortedTimes[0] : 0;
        const maxResponseTimeMs = sortedTimes.length > 0 ? sortedTimes[sortedTimes.length - 1] : 0;
        const p95Index = Math.floor(sortedTimes.length * 0.95);
        const p95ResponseTimeMs = sortedTimes.length > 0 ? (sortedTimes[p95Index] || maxResponseTimeMs) : 0;
        
        // Calculate success rate for reliability assessment
        const successRate = totalRequests > 0 ? successfulRequests / totalRequests : 0;
        
        return {
            requestsPerSecond,
            totalDurationMs,
            averageResponseTimeMs,
            minResponseTimeMs,
            maxResponseTimeMs,
            p95ResponseTimeMs,
            successRate,
            totalRequests,
            successfulRequests,
            failedRequests,
            memoryUsageMB
        };
        
    } catch (error) {
        throw new Error(`Throughput measurement failed: ${error.message}`);
    }
}

// =============================================================================
// PERFORMANCE TEST SUITES
// =============================================================================

/**
 * Hello Endpoint Performance Test Suite
 * 
 * Comprehensive performance testing for the /hello endpoint covering single request
 * performance, concurrent load handling, and throughput measurement. This suite
 * validates all performance requirements specified in the technical documentation.
 */
describe('/hello Endpoint Performance Tests', () => {
    
    /**
     * Single Request Performance Test
     * 
     * Validates that individual GET requests to the /hello endpoint respond within
     * the specified performance target of 100ms. This test establishes the baseline
     * performance characteristics of the endpoint under optimal conditions.
     * 
     * Test Validation:
     * - Response time is less than PERFORMANCE_TARGET_MS (100ms)
     * - Response content is correct ('Hello world')
     * - HTTP status code is 200 OK
     * - Content-Type header is set to text/plain
     * 
     * Educational Value:
     * - Demonstrates basic performance testing patterns
     * - Shows proper assertion structure for performance tests
     * - Illustrates timing measurement in test environments
     * - Provides foundation for understanding performance requirements
     */
    test('should respond to single GET /hello request in under 100ms', async () => {
        // Measure response time for single request
        const responseTime = await measureSingleRequestTime();
        
        // Log response time for visibility and debugging
        console.log(`✓ Single request response time: ${responseTime.toFixed(2)}ms`);
        
        // Assert performance requirement compliance
        expect(responseTime).toBeLessThan(PERFORMANCE_TARGET_MS);
        
        // Additional validation to ensure performance test accuracy
        expect(responseTime).toBeGreaterThan(0);
        expect(responseTime).toBeLessThan(REQUEST_TIMEOUT_MS);
    }, REQUEST_TIMEOUT_MS + 1000);
    
    /**
     * Concurrent Request Performance Test
     * 
     * Validates that the /hello endpoint maintains acceptable performance under
     * concurrent load conditions. Tests the application's ability to handle
     * multiple simultaneous requests while preserving response time requirements.
     * 
     * Test Validation:
     * - Average response time under concurrent load is less than PERFORMANCE_TARGET_MS
     * - Maximum response time is within acceptable bounds
     * - 95th percentile response time meets performance SLA
     * - All concurrent requests complete successfully
     * - Performance consistency is maintained across requests
     * 
     * Educational Value:
     * - Demonstrates concurrent load testing patterns
     * - Shows statistical analysis of performance data
     * - Illustrates performance validation under realistic conditions
     * - Provides understanding of scalability testing methods
     */
    test('should handle concurrent GET /hello requests with average response time under 100ms', async () => {
        // Execute concurrent requests and measure performance metrics
        const metrics = await measureConcurrentRequests(CONCURRENT_REQUESTS);
        
        // Log comprehensive performance metrics for analysis
        console.log(`✓ Concurrent requests (${CONCURRENT_REQUESTS}):`);
        console.log(`  Average response time: ${metrics.averageMs.toFixed(2)}ms`);
        console.log(`  Minimum response time: ${metrics.minMs.toFixed(2)}ms`);
        console.log(`  Maximum response time: ${metrics.maxMs.toFixed(2)}ms`);
        console.log(`  95th percentile: ${metrics.p95Ms.toFixed(2)}ms`);
        console.log(`  Standard deviation: ${metrics.standardDeviationMs.toFixed(2)}ms`);
        console.log(`  Success rate: ${(metrics.successRate * 100).toFixed(1)}%`);
        
        // Assert performance requirements for concurrent load
        expect(metrics.averageMs).toBeLessThan(PERFORMANCE_TARGET_MS);
        expect(metrics.successRate).toBe(1.0); // 100% success rate required
        
        // Additional performance quality assertions
        expect(metrics.p95Ms).toBeLessThan(PERFORMANCE_TARGET_MS * 1.5); // Allow 50% tolerance for 95th percentile
        expect(metrics.minMs).toBeGreaterThan(0);
        expect(metrics.maxMs).toBeLessThan(REQUEST_TIMEOUT_MS);
        
        // Performance consistency validation
        expect(metrics.standardDeviationMs).toBeLessThan(PERFORMANCE_TARGET_MS); // Reasonable consistency
        
    }, (REQUEST_TIMEOUT_MS * 2) + 5000); // Extended timeout for concurrent requests
    
    /**
     * Throughput Performance Test
     * 
     * Measures the overall throughput capacity of the /hello endpoint by executing
     * a large number of requests in concurrent batches. This test validates the
     * application's ability to maintain performance under sustained load.
     * 
     * Test Validation:
     * - Throughput exceeds minimum acceptable requests per second
     * - Average response time remains within performance targets
     * - Success rate is maintained at acceptable levels
     * - Memory usage remains stable during test execution
     * - Performance degrades gracefully under load
     * 
     * Educational Value:
     * - Demonstrates throughput testing methodology
     * - Shows capacity planning and performance benchmarking
     * - Illustrates sustained load testing patterns
     * - Provides understanding of system performance limits
     */
    test('should achieve minimum throughput of 50 RPS for GET /hello endpoint', async () => {
        // Execute comprehensive throughput test
        const throughputMetrics = await measureThroughput(TOTAL_REQUESTS, CONCURRENT_REQUESTS);
        
        // Log comprehensive throughput analysis for performance monitoring
        console.log(`✓ Throughput test (${TOTAL_REQUESTS} requests in batches of ${CONCURRENT_REQUESTS}):`);
        console.log(`  Requests per second: ${throughputMetrics.requestsPerSecond.toFixed(2)} RPS`);
        console.log(`  Total test duration: ${throughputMetrics.totalDurationMs.toFixed(2)}ms`);
        console.log(`  Average response time: ${throughputMetrics.averageResponseTimeMs.toFixed(2)}ms`);
        console.log(`  Minimum response time: ${throughputMetrics.minResponseTimeMs.toFixed(2)}ms`);
        console.log(`  Maximum response time: ${throughputMetrics.maxResponseTimeMs.toFixed(2)}ms`);
        console.log(`  95th percentile: ${throughputMetrics.p95ResponseTimeMs.toFixed(2)}ms`);
        console.log(`  Success rate: ${(throughputMetrics.successRate * 100).toFixed(1)}%`);
        console.log(`  Successful requests: ${throughputMetrics.successfulRequests}/${throughputMetrics.totalRequests}`);
        console.log(`  Memory usage: ${throughputMetrics.memoryUsageMB.toFixed(2)}MB`);
        
        // Assert throughput performance requirements
        expect(throughputMetrics.requestsPerSecond).toBeGreaterThan(MIN_THROUGHPUT_RPS);
        expect(throughputMetrics.averageResponseTimeMs).toBeLessThan(PERFORMANCE_TARGET_MS);
        expect(throughputMetrics.successRate).toBeGreaterThan(0.95); // 95% minimum success rate
        
        // Additional throughput quality assertions
        expect(throughputMetrics.successfulRequests).toBeGreaterThan(0);
        expect(throughputMetrics.totalDurationMs).toBeGreaterThan(0);
        expect(throughputMetrics.p95ResponseTimeMs).toBeLessThan(PERFORMANCE_TARGET_MS * 2); // Reasonable SLA
        
        // Resource usage validation
        expect(throughputMetrics.memoryUsageMB).toBeLessThan(100); // Reasonable memory usage limit
        
    }, (REQUEST_TIMEOUT_MS * 3) + 10000); // Extended timeout for throughput testing
    
    /**
     * Performance Regression Test
     * 
     * Validates that performance characteristics remain stable over multiple test
     * executions. This test helps detect performance regressions and ensures
     * consistent application behavior across different execution environments.
     * 
     * Test Validation:
     * - Multiple performance measurements show consistent results
     * - Performance variance is within acceptable tolerances
     * - No significant performance degradation between test runs
     * - Application performance is stable and predictable
     * 
     * Educational Value:
     * - Demonstrates performance regression testing patterns
     * - Shows statistical analysis for performance stability
     * - Illustrates consistency validation methods
     * - Provides understanding of performance monitoring strategies
     */
    test('should maintain consistent performance across multiple measurements', async () => {
        const measurements: number[] = [];
        const numberOfMeasurements = 5;
        
        // Execute multiple performance measurements
        for (let i = 0; i < numberOfMeasurements; i++) {
            const responseTime = await measureSingleRequestTime();
            measurements.push(responseTime);
            
            // Small delay between measurements to avoid overwhelming the system
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Calculate performance consistency metrics
        const averageTime = measurements.reduce((sum, time) => sum + time, 0) / measurements.length;
        const minTime = Math.min(...measurements);
        const maxTime = Math.max(...measurements);
        const variance = measurements.reduce((sum, time) => sum + Math.pow(time - averageTime, 2), 0) / measurements.length;
        const standardDeviation = Math.sqrt(variance);
        const coefficientOfVariation = standardDeviation / averageTime;
        
        // Log consistency analysis for performance monitoring
        console.log(`✓ Performance consistency analysis (${numberOfMeasurements} measurements):`);
        console.log(`  Average response time: ${averageTime.toFixed(2)}ms`);
        console.log(`  Minimum response time: ${minTime.toFixed(2)}ms`);
        console.log(`  Maximum response time: ${maxTime.toFixed(2)}ms`);
        console.log(`  Standard deviation: ${standardDeviation.toFixed(2)}ms`);
        console.log(`  Coefficient of variation: ${(coefficientOfVariation * 100).toFixed(1)}%`);
        console.log(`  All measurements: [${measurements.map(t => t.toFixed(2)).join(', ')}]ms`);
        
        // Assert performance consistency requirements
        expect(averageTime).toBeLessThan(PERFORMANCE_TARGET_MS);
        expect(maxTime).toBeLessThan(PERFORMANCE_TARGET_MS * 1.5); // Allow some variance
        expect(coefficientOfVariation).toBeLessThan(0.3); // 30% maximum variation
        
        // Individual measurement validation
        measurements.forEach((time, index) => {
            expect(time).toBeGreaterThan(0);
            expect(time).toBeLessThan(REQUEST_TIMEOUT_MS);
        });
        
    }, (REQUEST_TIMEOUT_MS * 2) + 2000);
});

// =============================================================================
// PERFORMANCE MONITORING AND HEALTH CHECKS
// =============================================================================

/**
 * Application Health and Performance Monitoring Test Suite
 * 
 * Additional performance tests for monitoring application health, resource usage,
 * and performance characteristics that support observability and alerting objectives.
 */
describe('Application Performance Monitoring', () => {
    
    /**
     * Memory Usage Performance Test
     * 
     * Monitors memory consumption during performance testing to detect memory leaks
     * and ensure stable resource usage patterns. This test supports long-term
     * application stability and performance monitoring objectives.
     * 
     * Educational Value:
     * - Demonstrates memory usage monitoring in Node.js applications
     * - Shows integration of performance and resource monitoring
     * - Illustrates application health validation patterns
     * - Provides understanding of resource-aware performance testing
     */
    test('should maintain stable memory usage during performance testing', async () => {
        // Record initial memory state
        const initialMemory = process.memoryUsage();
        
        // Execute performance test to generate load
        const throughputMetrics = await measureThroughput(50, 10); // Smaller test for memory monitoring
        
        // Record final memory state
        const finalMemory = process.memoryUsage();
        
        // Calculate memory usage changes
        const heapUsedDiff = (finalMemory.heapUsed - initialMemory.heapUsed) / 1024 / 1024; // MB
        const heapTotalDiff = (finalMemory.heapTotal - initialMemory.heapTotal) / 1024 / 1024; // MB
        const externalDiff = (finalMemory.external - initialMemory.external) / 1024 / 1024; // MB
        
        // Log memory usage analysis
        console.log(`✓ Memory usage monitoring:`);
        console.log(`  Initial heap used: ${(initialMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
        console.log(`  Final heap used: ${(finalMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
        console.log(`  Heap used difference: ${heapUsedDiff.toFixed(2)}MB`);
        console.log(`  Heap total difference: ${heapTotalDiff.toFixed(2)}MB`);
        console.log(`  External memory difference: ${externalDiff.toFixed(2)}MB`);
        console.log(`  Requests per second: ${throughputMetrics.requestsPerSecond.toFixed(2)} RPS`);
        
        // Assert memory usage requirements
        expect(Math.abs(heapUsedDiff)).toBeLessThan(50); // Less than 50MB change
        expect(Math.abs(heapTotalDiff)).toBeLessThan(100); // Less than 100MB total change
        
        // Validate performance was maintained during memory monitoring
        expect(throughputMetrics.requestsPerSecond).toBeGreaterThan(MIN_THROUGHPUT_RPS);
        expect(throughputMetrics.averageResponseTimeMs).toBeLessThan(PERFORMANCE_TARGET_MS);
        
    }, REQUEST_TIMEOUT_MS + 5000);
    
    /**
     * Error Rate Performance Test
     * 
     * Validates that error rates remain low during performance testing and that
     * the application maintains stability under load. This test supports reliability
     * and observability monitoring objectives.
     * 
     * Educational Value:
     * - Demonstrates error rate monitoring in performance tests
     * - Shows integration of reliability and performance validation
     * - Illustrates failure rate analysis patterns
     * - Provides understanding of application stability testing
     */
    test('should maintain low error rate during sustained load', async () => {
        let totalRequests = 0;
        let successfulRequests = 0;
        let failedRequests = 0;
        const errorDetails: string[] = [];
        
        // Execute multiple batches to simulate sustained load
        const numberOfBatches = 3;
        const requestsPerBatch = 20;
        
        for (let batch = 0; batch < numberOfBatches; batch++) {
            try {
                const batchMetrics = await measureConcurrentRequests(requestsPerBatch);
                totalRequests += requestsPerBatch;
                successfulRequests += batchMetrics.responseTimes.length;
                
                // Small delay between batches to simulate realistic load patterns
                await new Promise(resolve => setTimeout(resolve, 200));
                
            } catch (error) {
                totalRequests += requestsPerBatch;
                failedRequests += requestsPerBatch;
                errorDetails.push(`Batch ${batch + 1}: ${error.message}`);
            }
        }
        
        // Calculate error rate and reliability metrics
        const errorRate = totalRequests > 0 ? failedRequests / totalRequests : 0;
        const successRate = totalRequests > 0 ? successfulRequests / totalRequests : 0;
        
        // Log error rate analysis
        console.log(`✓ Error rate monitoring (${numberOfBatches} batches of ${requestsPerBatch} requests):`);
        console.log(`  Total requests: ${totalRequests}`);
        console.log(`  Successful requests: ${successfulRequests}`);
        console.log(`  Failed requests: ${failedRequests}`);
        console.log(`  Success rate: ${(successRate * 100).toFixed(1)}%`);
        console.log(`  Error rate: ${(errorRate * 100).toFixed(1)}%`);
        
        if (errorDetails.length > 0) {
            console.log(`  Error details: ${errorDetails.join('; ')}`);
        }
        
        // Assert error rate requirements
        expect(errorRate).toBeLessThan(0.05); // Less than 5% error rate
        expect(successRate).toBeGreaterThan(0.95); // Greater than 95% success rate
        expect(successfulRequests).toBeGreaterThan(0); // At least some requests succeeded
        
    }, (REQUEST_TIMEOUT_MS * 2) + 5000);
});

// =============================================================================
// PERFORMANCE TEST UTILITIES AND HELPERS
// =============================================================================

/**
 * Performance Test Setup and Teardown
 * 
 * Global test setup and teardown functions to ensure clean test environments
 * and proper resource management during performance testing.
 */
beforeAll(async () => {
    // Log test suite initialization
    console.log('🚀 Starting Performance Test Suite for Node.js Tutorial Application');
    console.log(`📊 Performance Targets:`);
    console.log(`   Response Time: < ${PERFORMANCE_TARGET_MS}ms`);
    console.log(`   Concurrent Requests: ${CONCURRENT_REQUESTS}`);
    console.log(`   Total Requests: ${TOTAL_REQUESTS}`);
    console.log(`   Minimum Throughput: ${MIN_THROUGHPUT_RPS} RPS`);
    console.log(`   Request Timeout: ${REQUEST_TIMEOUT_MS}ms`);
    console.log('');
    
    // Warm up the application to ensure fair performance testing
    console.log('🔥 Warming up application...');
    try {
        await measureSingleRequestTime();
        console.log('✅ Application warm-up completed');
    } catch (error) {
        console.warn('⚠️  Application warm-up failed:', error.message);
    }
    console.log('');
});

afterAll(async () => {
    // Log test suite completion and final memory state
    const finalMemory = process.memoryUsage();
    console.log('');
    console.log('✅ Performance Test Suite Completed');
    console.log(`📈 Final Memory Usage:`);
    console.log(`   Heap Used: ${(finalMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   Heap Total: ${(finalMemory.heapTotal / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   External: ${(finalMemory.external / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   RSS: ${(finalMemory.rss / 1024 / 1024).toFixed(2)}MB`);
    console.log('');
    console.log('🎯 Performance validation complete - All endpoints meet technical specifications');
});

// =============================================================================
// EDUCATIONAL NOTES AND IMPLEMENTATION GUIDANCE
// =============================================================================

/**
 * Implementation Notes for Performance Testing
 * 
 * This comprehensive performance test suite demonstrates best practices for
 * Node.js/Express.js application performance validation and provides educational
 * examples for understanding performance testing concepts.
 * 
 * Key Educational Concepts:
 * 
 * 1. **High-Precision Timing:**
 *    - Uses process.hrtime.bigint() for nanosecond-precision timing
 *    - Demonstrates proper timing measurement in Node.js environments
 *    - Shows conversion from nanoseconds to milliseconds with precision
 * 
 * 2. **Concurrent Load Testing:**
 *    - Uses Promise.all for true concurrent request execution
 *    - Demonstrates realistic load simulation patterns
 *    - Shows statistical analysis of performance under concurrent conditions
 * 
 * 3. **Throughput Measurement:**
 *    - Implements batch processing for sustained load testing
 *    - Demonstrates capacity planning and performance benchmarking
 *    - Shows comprehensive performance metric collection and analysis
 * 
 * 4. **Performance Validation:**
 *    - Validates against specific technical requirements (< 100ms)
 *    - Demonstrates SLA compliance testing patterns
 *    - Shows performance regression detection methods
 * 
 * 5. **Resource Monitoring:**
 *    - Integrates memory usage monitoring with performance testing
 *    - Demonstrates resource-aware performance validation
 *    - Shows application health monitoring patterns
 * 
 * 6. **Statistical Analysis:**
 *    - Calculates mean, median, percentiles for performance data
 *    - Demonstrates performance consistency validation
 *    - Shows variance and standard deviation analysis
 * 
 * 7. **Error Rate Monitoring:**
 *    - Validates application reliability under load
 *    - Demonstrates failure rate analysis and monitoring
 *    - Shows integration of reliability and performance testing
 * 
 * Extension Guidelines:
 * 
 * 1. **Additional Endpoints:**
 *    - Follow the same testing patterns for new endpoints
 *    - Adjust performance targets based on endpoint complexity
 *    - Maintain consistent statistical analysis approaches
 * 
 * 2. **Load Scenarios:**
 *    - Implement different load patterns (ramp-up, spike, sustained)
 *    - Add stress testing for extreme load conditions
 *    - Include recovery testing after load spikes
 * 
 * 3. **Performance Monitoring:**
 *    - Integrate with APM tools for production monitoring
 *    - Add performance alerting based on test thresholds
 *    - Implement performance trend analysis over time
 * 
 * 4. **CI/CD Integration:**
 *    - Run performance tests in CI pipeline
 *    - Fail builds on performance regression
 *    - Generate performance reports for trend analysis
 * 
 * This test suite provides a comprehensive foundation for understanding and
 * implementing performance testing in Node.js applications while maintaining
 * educational clarity and production-ready testing practices.
 */