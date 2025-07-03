/**
 * @fileoverview Performance Test Suite for '/hello' Endpoint
 * 
 * This module implements comprehensive performance testing for the '/hello' endpoint of the 
 * Node.js Hello World tutorial backend. It measures response time, throughput, and latency 
 * under concurrent load to ensure the endpoint meets the technical specification's performance 
 * requirements (<100ms response time, high concurrency, and low error rate).
 * 
 * The test suite utilizes Jest for test orchestration, Supertest for HTTP request simulation, 
 * and shared test utilities for DRY request/response validation. It's designed to be run as 
 * part of the automated test suite to validate that the backend remains performant and robust 
 * under expected and stress conditions.
 * 
 * Performance Testing Strategy:
 * - Single request validation to establish baseline performance
 * - Moderate concurrency testing (1, 10, 50, 100 concurrent requests)
 * - High concurrency stress testing to validate error rate thresholds
 * - Response time validation against <100ms requirement
 * - Throughput measurement for capacity planning
 * - Error rate validation to ensure system stability
 * 
 * Key Performance Metrics:
 * - Response Time: Average, minimum, and maximum response times
 * - Throughput: Requests per second under various concurrency levels
 * - Error Rate: Percentage of failed requests under load
 * - Latency Distribution: P95, P99 response time percentiles
 * - Memory Usage: Resource consumption during load testing
 * 
 * Technical Requirements Addressed:
 * - Performance Requirements (2.4.2): Validates <100ms response time under normal and concurrent load
 * - Hello Endpoint Feature (2.1.2): Ensures correct response under performance testing conditions
 * - Testing Strategy (6.6): Implements automated performance tests with shared utilities
 * 
 * @author Generated for Node.js Tutorial Application
 * @version 1.0.0
 * @requires supertest HTTP testing library for Express applications (v7.1.1)
 * @requires jest Testing framework and assertion library (v29.7.0)
 * @requires ../../backend/app.js Express application instance for testing
 * @requires ../helpers/testUtils.js Shared test utilities for DRY testing
 */

// =============================================================================
// EXTERNAL DEPENDENCIES
// =============================================================================

/**
 * Supertest HTTP Testing Library - Version 7.1.1
 * 
 * Supertest is a highly efficient and flexible testing library designed for testing 
 * HTTP assertions. It enables programmatic HTTP requests (GET, POST, PATCH, PUT, DELETE) 
 * to HTTP servers and provides methods for asserting responses. Used for concurrent 
 * load testing and response validation.
 * 
 * @external supertest
 * @see {@link https://github.com/visionmedia/supertest|Supertest Documentation}
 * @version 7.1.1
 */
const supertest = require('supertest'); // v7.1.1 - HTTP testing library for Express applications

/**
 * Jest Assertion Library - Version 29.7.0
 * 
 * Jest's expect function provides powerful assertion capabilities for validating 
 * performance test results, including response times, error rates, and throughput metrics.
 * Used for custom performance matchers and threshold validation.
 * 
 * @external jest
 * @see {@link https://jestjs.io/docs/expect|Jest Expect API}
 * @version 29.7.0
 */
const { expect } = require('jest'); // v29.7.0 - Jest assertion library for test expectations

// =============================================================================
// INTERNAL DEPENDENCIES
// =============================================================================

/**
 * Express Application Instance
 * 
 * Import the fully configured Express application instance from the backend
 * module. This instance includes all middleware, routing, and error handling
 * components configured for production use.
 * 
 * @see {@link ../../backend/app.js|Express Application Module}
 */
const { app } = require('../../backend/app.js');

/**
 * Shared Test Utilities
 * 
 * Import reusable helper functions for HTTP request simulation and response
 * validation. These utilities ensure DRY (Don't Repeat Yourself) principles
 * and consistent validation logic across all performance test cases.
 * 
 * @see {@link ../helpers/testUtils.js|Test Utilities Module}
 */
const { makeRequest, assertHelloResponse } = require('../helpers/testUtils.js');

// =============================================================================
// PERFORMANCE TEST CONFIGURATION
// =============================================================================

/**
 * Concurrency Levels for Performance Testing
 * 
 * Array of concurrency levels to test, ranging from single request baseline
 * to high concurrency stress testing. Each level represents the number of
 * concurrent requests to execute simultaneously.
 * 
 * Testing Strategy:
 * - Level 1: Baseline single request performance
 * - Level 10: Moderate concurrency typical of small applications
 * - Level 50: High concurrency representing moderate load
 * - Level 100: Stress testing representing peak load conditions
 * 
 * @constant {Array<number>} CONCURRENCY_LEVELS
 * @default [1, 10, 50, 100]
 */
const CONCURRENCY_LEVELS = [1, 10, 50, 100];

/**
 * Number of Requests Per Concurrency Level
 * 
 * Total number of requests to execute for each concurrency level test.
 * This provides sufficient sample size for accurate performance measurement
 * while maintaining reasonable test execution times.
 * 
 * @constant {number} REQUESTS_PER_LEVEL
 * @default 100
 */
const REQUESTS_PER_LEVEL = 100;

/**
 * Response Time Threshold in Milliseconds
 * 
 * Maximum acceptable response time for the '/hello' endpoint as specified
 * in the technical requirements. Used to validate that performance meets
 * the specified service level objectives.
 * 
 * @constant {number} RESPONSE_TIME_THRESHOLD_MS
 * @default 100
 */
const RESPONSE_TIME_THRESHOLD_MS = 100;

// =============================================================================
// PERFORMANCE TESTING FUNCTIONS
// =============================================================================

/**
 * Execute Performance Test with Concurrent Requests
 * 
 * This function executes a batch of concurrent GET requests to the '/hello' endpoint
 * and measures comprehensive performance metrics including response times, error rates,
 * and throughput. It distributes the total request load across the specified number
 * of concurrent workers to simulate realistic load conditions.
 * 
 * Performance Measurement Strategy:
 * 1. Divide total requests evenly across concurrency level
 * 2. Launch concurrent request batches simultaneously
 * 3. Measure individual request response times with high precision
 * 4. Validate each response for correctness using shared utilities
 * 5. Aggregate performance metrics for analysis
 * 6. Calculate throughput and error rate statistics
 * 
 * Error Handling:
 * - Captures and counts all request errors
 * - Continues testing even if individual requests fail
 * - Provides detailed error reporting for debugging
 * - Maintains test isolation to prevent cascading failures
 * 
 * @param {number} concurrencyLevel - Number of concurrent request batches to execute
 * @param {number} requestsPerLevel - Total number of requests to execute across all batches
 * @param {Object} app - Express application instance to test
 * @returns {Promise<Object>} Aggregated performance metrics object
 * @returns {Promise<Object>} returns.averageResponseTime - Average response time in milliseconds
 * @returns {Promise<Object>} returns.maxResponseTime - Maximum response time in milliseconds
 * @returns {Promise<Object>} returns.minResponseTime - Minimum response time in milliseconds
 * @returns {Promise<Object>} returns.errorCount - Total number of failed requests
 * @returns {Promise<Object>} returns.throughput - Requests per second
 * @returns {Promise<Object>} returns.responseTimes - Array of all individual response times
 * @returns {Promise<Object>} returns.totalRequests - Total number of requests executed
 * @returns {Promise<Object>} returns.successfulRequests - Number of successful requests
 * 
 * @example
 * // Test with 10 concurrent requests, 100 total requests
 * const metrics = await runPerformanceTest(10, 100, app);
 * console.log(`Average response time: ${metrics.averageResponseTime}ms`);
 * console.log(`Throughput: ${metrics.throughput} requests/second`);
 * 
 * @example
 * // High concurrency stress test
 * const metrics = await runPerformanceTest(100, 1000, app);
 * expect(metrics.errorCount).toBe(0);
 * expect(metrics.averageResponseTime).toBeLessThan(100);
 */
async function runPerformanceTest(concurrencyLevel, requestsPerLevel, app) {
    // Step 1: Initialize performance measurement arrays
    const responseTimes = [];
    const errors = [];
    const requestPromises = [];
    
    // Step 2: Calculate requests per concurrent batch
    const requestsPerBatch = Math.ceil(requestsPerLevel / concurrencyLevel);
    
    // Step 3: Record overall test start time for throughput calculation
    const testStartTime = Date.now();
    
    // Step 4: Create concurrent request batches
    for (let batchIndex = 0; batchIndex < concurrencyLevel; batchIndex++) {
        // Step 5: Create batch of requests for this concurrency level
        const batchPromises = [];
        
        for (let requestIndex = 0; requestIndex < requestsPerBatch; requestIndex++) {
            // Step 6: Create individual request promise with timing
            const requestPromise = (async () => {
                try {
                    // Step 7: Record request start time with high precision
                    const requestStartTime = Date.now();
                    
                    // Step 8: Execute HTTP request using shared test utility
                    const response = await makeRequest(app, 'GET', '/hello');
                    
                    // Step 9: Record request end time
                    const requestEndTime = Date.now();
                    
                    // Step 10: Calculate response time
                    const responseTime = requestEndTime - requestStartTime;
                    
                    // Step 11: Validate response correctness using shared utility
                    assertHelloResponse(response);
                    
                    // Step 12: Store response time for aggregation
                    responseTimes.push(responseTime);
                    
                    return {
                        success: true,
                        responseTime: responseTime,
                        status: response.status
                    };
                } catch (error) {
                    // Step 13: Handle request errors without failing entire test
                    errors.push({
                        error: error.message,
                        timestamp: Date.now()
                    });
                    
                    return {
                        success: false,
                        error: error.message
                    };
                }
            })();
            
            batchPromises.push(requestPromise);
        }
        
        // Step 14: Add batch promises to main promise array
        requestPromises.push(...batchPromises);
    }
    
    // Step 15: Execute all concurrent requests simultaneously
    const results = await Promise.all(requestPromises);
    
    // Step 16: Record overall test end time
    const testEndTime = Date.now();
    
    // Step 17: Calculate performance metrics
    const totalRequests = results.length;
    const successfulRequests = results.filter(r => r.success).length;
    const errorCount = errors.length;
    
    // Step 18: Calculate response time statistics
    const averageResponseTime = responseTimes.length > 0 
        ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
        : 0;
    
    const maxResponseTime = responseTimes.length > 0 
        ? Math.max(...responseTimes) 
        : 0;
    
    const minResponseTime = responseTimes.length > 0 
        ? Math.min(...responseTimes) 
        : 0;
    
    // Step 19: Calculate throughput (requests per second)
    const totalTestDuration = testEndTime - testStartTime;
    const throughput = totalRequests / (totalTestDuration / 1000);
    
    // Step 20: Calculate percentile response times
    const sortedResponseTimes = responseTimes.sort((a, b) => a - b);
    const p95ResponseTime = sortedResponseTimes.length > 0 
        ? sortedResponseTimes[Math.floor(sortedResponseTimes.length * 0.95)]
        : 0;
    
    const p99ResponseTime = sortedResponseTimes.length > 0 
        ? sortedResponseTimes[Math.floor(sortedResponseTimes.length * 0.99)]
        : 0;
    
    // Step 21: Return aggregated performance metrics
    return {
        averageResponseTime: Math.round(averageResponseTime * 100) / 100,
        maxResponseTime,
        minResponseTime,
        errorCount,
        throughput: Math.round(throughput * 100) / 100,
        responseTimes,
        totalRequests,
        successfulRequests,
        p95ResponseTime,
        p99ResponseTime,
        testDuration: totalTestDuration,
        concurrencyLevel,
        requestsPerLevel
    };
}

// =============================================================================
// PERFORMANCE TEST SUITES
// =============================================================================

/**
 * Hello Endpoint Performance Test Suite
 * 
 * Comprehensive performance testing suite for the '/hello' endpoint that validates
 * response time, throughput, and error rate requirements under various load conditions.
 * Tests are designed to ensure the endpoint meets the technical specification's
 * performance requirements while maintaining system stability and correctness.
 * 
 * Test Strategy:
 * - Baseline performance validation with single requests
 * - Concurrent load testing across multiple concurrency levels
 * - Error rate validation under high load conditions
 * - Response time threshold validation
 * - Throughput measurement for capacity planning
 * 
 * Performance Requirements Validation:
 * - Response time < 100ms under normal and concurrent load
 * - Error rate < 1% under high concurrency
 * - Consistent response correctness under all load conditions
 * - System stability maintained throughout testing
 */
describe('Hello Endpoint Performance', () => {
    
    /**
     * Test Suite Setup
     * 
     * Configure Jest timeout for performance tests to allow sufficient time
     * for high concurrency testing and metric collection.
     */
    beforeAll(() => {
        // Set extended timeout for performance tests (30 seconds)
        jest.setTimeout(30000);
    });
    
    /**
     * Single Request Performance Validation
     * 
     * Validates baseline performance with a single request to establish
     * minimum performance expectations and ensure the endpoint responds
     * within the specified threshold without any concurrency load.
     * 
     * This test serves as a baseline to compare against concurrent load
     * performance and ensures the endpoint meets basic response time requirements.
     */
    describe('Single Request Performance', () => {
        it('should respond within 100ms under single request', async () => {
            // Step 1: Record start time for response time measurement
            const startTime = Date.now();
            
            // Step 2: Send single GET request to /hello endpoint
            const response = await makeRequest(app, 'GET', '/hello');
            
            // Step 3: Record end time
            const endTime = Date.now();
            
            // Step 4: Calculate response time
            const responseTime = endTime - startTime;
            
            // Step 5: Assert response time is below threshold
            expect(responseTime).toBeLessThan(RESPONSE_TIME_THRESHOLD_MS);
            
            // Step 6: Assert response correctness using shared utility
            assertHelloResponse(response);
            
            // Step 7: Log performance metrics for observability
            console.log(`Single request response time: ${responseTime}ms`);
        });
    });
    
    /**
     * Concurrent Load Performance Validation
     * 
     * Tests the endpoint performance under various concurrency levels to ensure
     * it maintains acceptable response times and error rates under realistic
     * load conditions. Each concurrency level is tested independently to
     * provide comprehensive performance analysis.
     * 
     * This suite validates that the endpoint can handle concurrent requests
     * while maintaining the <100ms response time requirement and zero error rate.
     */
    describe('Concurrent Load Performance', () => {
        it('should maintain <100ms response time under moderate concurrency', async () => {
            // Step 1: Test each concurrency level independently
            for (const concurrencyLevel of CONCURRENCY_LEVELS) {
                // Step 2: Execute performance test at current concurrency level
                const metrics = await runPerformanceTest(
                    concurrencyLevel, 
                    REQUESTS_PER_LEVEL, 
                    app
                );
                
                // Step 3: Assert average response time is below threshold
                expect(metrics.averageResponseTime).toBeLessThan(RESPONSE_TIME_THRESHOLD_MS);
                
                // Step 4: Assert maximum response time is below threshold
                expect(metrics.maxResponseTime).toBeLessThan(RESPONSE_TIME_THRESHOLD_MS);
                
                // Step 5: Assert zero error count for reliability
                expect(metrics.errorCount).toBe(0);
                
                // Step 6: Assert all requests were successful
                expect(metrics.successfulRequests).toBe(metrics.totalRequests);
                
                // Step 7: Log performance metrics for observability
                console.log(`Concurrency Level ${concurrencyLevel}:`);
                console.log(`  Average Response Time: ${metrics.averageResponseTime}ms`);
                console.log(`  Max Response Time: ${metrics.maxResponseTime}ms`);
                console.log(`  Min Response Time: ${metrics.minResponseTime}ms`);
                console.log(`  Throughput: ${metrics.throughput} requests/second`);
                console.log(`  Error Count: ${metrics.errorCount}`);
                console.log(`  P95 Response Time: ${metrics.p95ResponseTime}ms`);
                console.log(`  P99 Response Time: ${metrics.p99ResponseTime}ms`);
                console.log(`  Test Duration: ${metrics.testDuration}ms`);
                console.log('---');
            }
        });
    });
    
    /**
     * High Concurrency Error Rate Validation
     * 
     * Tests the endpoint under maximum concurrency to validate error rate
     * thresholds and ensure system stability under stress conditions.
     * This test ensures the system gracefully handles peak load without
     * experiencing cascading failures or unacceptable error rates.
     * 
     * Validates that the system maintains reliability even under extreme
     * load conditions and provides actionable performance data for capacity planning.
     */
    describe('High Concurrency Error Rate', () => {
        it('should not exceed error rate threshold under high concurrency', async () => {
            // Step 1: Get maximum concurrency level for stress testing
            const maxConcurrencyLevel = Math.max(...CONCURRENCY_LEVELS);
            
            // Step 2: Execute stress test with maximum concurrency
            const metrics = await runPerformanceTest(
                maxConcurrencyLevel, 
                REQUESTS_PER_LEVEL, 
                app
            );
            
            // Step 3: Calculate error rate percentage
            const errorRate = (metrics.errorCount / metrics.totalRequests) * 100;
            
            // Step 4: Assert error rate is below 1% threshold
            expect(errorRate).toBeLessThan(1);
            
            // Step 5: Assert error count is zero for maximum reliability
            expect(metrics.errorCount).toBe(0);
            
            // Step 6: Validate response time under high load
            expect(metrics.averageResponseTime).toBeLessThan(RESPONSE_TIME_THRESHOLD_MS);
            
            // Step 7: Log stress test results for analysis
            console.log(`High Concurrency Stress Test (${maxConcurrencyLevel} concurrent):`);
            console.log(`  Total Requests: ${metrics.totalRequests}`);
            console.log(`  Successful Requests: ${metrics.successfulRequests}`);
            console.log(`  Error Count: ${metrics.errorCount}`);
            console.log(`  Error Rate: ${errorRate.toFixed(2)}%`);
            console.log(`  Average Response Time: ${metrics.averageResponseTime}ms`);
            console.log(`  Throughput: ${metrics.throughput} requests/second`);
        });
    });
    
    /**
     * Performance Regression Detection
     * 
     * Validates that performance metrics remain consistent across multiple
     * test runs to detect potential performance regressions and ensure
     * system stability over time.
     * 
     * This test helps identify performance degradation and ensures the
     * system maintains consistent performance characteristics.
     */
    describe('Performance Consistency', () => {
        it('should maintain consistent performance across multiple runs', async () => {
            // Step 1: Configure test parameters
            const testRuns = 3;
            const testConcurrency = 10;
            const testResults = [];
            
            // Step 2: Execute multiple test runs
            for (let run = 0; run < testRuns; run++) {
                const metrics = await runPerformanceTest(
                    testConcurrency, 
                    REQUESTS_PER_LEVEL, 
                    app
                );
                testResults.push(metrics);
            }
            
            // Step 3: Calculate performance consistency metrics
            const averageResponseTimes = testResults.map(r => r.averageResponseTime);
            const meanResponseTime = averageResponseTimes.reduce((sum, time) => sum + time, 0) / testRuns;
            const responseTimeVariance = averageResponseTimes.reduce((sum, time) => sum + Math.pow(time - meanResponseTime, 2), 0) / testRuns;
            const responseTimeStandardDeviation = Math.sqrt(responseTimeVariance);
            
            // Step 4: Assert performance consistency (standard deviation < 20% of mean)
            const consistencyThreshold = meanResponseTime * 0.2;
            expect(responseTimeStandardDeviation).toBeLessThan(consistencyThreshold);
            
            // Step 5: Assert all runs meet performance requirements
            testResults.forEach((metrics, index) => {
                expect(metrics.averageResponseTime).toBeLessThan(RESPONSE_TIME_THRESHOLD_MS);
                expect(metrics.errorCount).toBe(0);
                
                console.log(`Run ${index + 1}: ${metrics.averageResponseTime}ms avg, ${metrics.throughput} req/sec`);
            });
            
            // Step 6: Log consistency analysis
            console.log(`Performance Consistency Analysis:`);
            console.log(`  Mean Response Time: ${meanResponseTime.toFixed(2)}ms`);
            console.log(`  Standard Deviation: ${responseTimeStandardDeviation.toFixed(2)}ms`);
            console.log(`  Consistency Threshold: ${consistencyThreshold.toFixed(2)}ms`);
            console.log(`  Performance Variance: ${responseTimeVariance.toFixed(2)}`);
        });
    });
    
    /**
     * Memory Usage Validation
     * 
     * Monitors memory usage during performance testing to ensure the
     * application doesn't have memory leaks or excessive memory consumption
     * under concurrent load conditions.
     * 
     * This test validates that the system maintains efficient memory usage
     * even under high concurrent load and helps identify potential memory issues.
     */
    describe('Memory Usage Performance', () => {
        it('should maintain efficient memory usage under load', async () => {
            // Step 1: Record initial memory usage
            const initialMemory = process.memoryUsage();
            
            // Step 2: Execute performance test under high concurrency
            const metrics = await runPerformanceTest(
                Math.max(...CONCURRENCY_LEVELS), 
                REQUESTS_PER_LEVEL, 
                app
            );
            
            // Step 3: Force garbage collection if available
            if (global.gc) {
                global.gc();
            }
            
            // Step 4: Record final memory usage
            const finalMemory = process.memoryUsage();
            
            // Step 5: Calculate memory usage delta
            const memoryDelta = {
                heapUsed: finalMemory.heapUsed - initialMemory.heapUsed,
                heapTotal: finalMemory.heapTotal - initialMemory.heapTotal,
                external: finalMemory.external - initialMemory.external,
                rss: finalMemory.rss - initialMemory.rss
            };
            
            // Step 6: Assert memory usage is reasonable (< 50MB increase)
            const memoryThreshold = 50 * 1024 * 1024; // 50MB in bytes
            expect(memoryDelta.heapUsed).toBeLessThan(memoryThreshold);
            
            // Step 7: Assert performance requirements were met
            expect(metrics.averageResponseTime).toBeLessThan(RESPONSE_TIME_THRESHOLD_MS);
            expect(metrics.errorCount).toBe(0);
            
            // Step 8: Log memory usage analysis
            console.log(`Memory Usage Analysis:`);
            console.log(`  Initial Heap Used: ${(initialMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
            console.log(`  Final Heap Used: ${(finalMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
            console.log(`  Heap Delta: ${(memoryDelta.heapUsed / 1024 / 1024).toFixed(2)}MB`);
            console.log(`  RSS Delta: ${(memoryDelta.rss / 1024 / 1024).toFixed(2)}MB`);
            console.log(`  Performance: ${metrics.averageResponseTime}ms avg, ${metrics.throughput} req/sec`);
        });
    });
});