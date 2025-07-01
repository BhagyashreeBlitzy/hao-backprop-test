/**
 * Performance Test Suite for the '/hello' Endpoint
 * 
 * This performance test suite validates that the '/hello' endpoint meets the technical
 * specification's performance requirements (<100ms response time, high concurrency, and
 * low error rate) using Jest for test orchestration, Supertest for HTTP request simulation,
 * and shared test utilities for DRY request/response validation.
 * 
 * Performance Requirements Validated:
 * - Response time < 100ms under normal and concurrent load (Technical Specifications/2.4.2)
 * - High throughput and minimal memory usage under stress conditions
 * - Zero error rate under expected and stress load conditions
 * - Endpoint availability and correctness under concurrent access patterns
 * 
 * The test suite is designed to run as part of the automated test pipeline to validate
 * that the backend remains performant and robust under expected and stress conditions.
 * If performance degrades or errors increase, tests will fail, alerting developers to
 * performance regressions that require optimization.
 * 
 * Test Architecture:
 * - Uses Supertest to simulate HTTP requests to the Express app
 * - Leverages shared test utilities (makeRequest, assertHelloResponse) for DRY code
 * - Implements concurrent load testing across multiple concurrency levels
 * - Measures and validates response times, throughput, and error rates
 * - Provides actionable performance metrics for backend performance tuning
 * 
 * @fileoverview Performance tests for '/hello' endpoint response time and concurrency
 * @author Backend Development Team
 * @version 1.0.0
 * @since Node.js 18+
 * @requires jest@29.7.0
 * @requires supertest@7.1.1
 */

// External Dependencies
const supertest = require('supertest'); // ^7.1.1 - HTTP testing library for Express apps
const { expect } = require('jest'); // ^29.7.0 - Assertion library for test expectations

// Internal Dependencies - Application Under Test
const { app } = require('../../backend/app.js'); // Express application instance for performance testing

// Internal Dependencies - Test Utilities
const { makeRequest, assertHelloResponse } = require('../helpers/testUtils.js'); // Reusable helpers for HTTP requests and response validation

// Performance Test Configuration Constants
// These constants define the test parameters for performance validation
// and can be adjusted based on specific performance requirements or infrastructure capacity

/**
 * Array of concurrency levels to test sequential load patterns
 * Tests performance across different concurrent user scenarios:
 * - 1: Single user baseline performance
 * - 10: Moderate concurrent access (typical small application load)
 * - 50: High concurrent access (stress testing scenario)
 * - 100: Maximum concurrent access (peak load testing)
 * @type {number[]}
 */
const CONCURRENCY_LEVELS = [1, 10, 50, 100];

/**
 * Number of requests to execute per concurrency level
 * Each concurrency level will execute this many total requests distributed
 * across the concurrent threads to provide statistically meaningful results
 * @type {number}
 */
const REQUESTS_PER_LEVEL = 100;

/**
 * Maximum acceptable response time threshold in milliseconds
 * Based on Technical Specifications/2.4.2 Performance Requirements
 * The '/hello' endpoint must respond within 100ms to meet SLA requirements
 * @type {number}
 */
const RESPONSE_TIME_THRESHOLD_MS = 100;

/**
 * Executes a batch of concurrent GET requests to the '/hello' endpoint and measures
 * response times, error rates, and throughput under specified concurrency conditions
 * 
 * This function implements the core performance testing logic by:
 * 1. Creating batches of concurrent request promises based on concurrency level
 * 2. Distributing the total request count across concurrent execution threads
 * 3. Measuring individual request response times and aggregating metrics
 * 4. Validating response correctness using assertHelloResponse helper
 * 5. Calculating performance metrics including averages, min/max, and throughput
 * 
 * The function uses Promise.all to execute requests concurrently while maintaining
 * precise timing measurements for each individual request. Error handling ensures
 * that failed requests are counted and reported without disrupting the overall
 * performance measurement process.
 * 
 * @param {number} concurrencyLevel - Number of concurrent request execution threads
 * @param {number} requestsPerLevel - Total number of requests to execute across all threads
 * @param {object} app - Express application instance to test for performance
 * @returns {Promise<object>} Aggregated performance metrics object containing:
 *   - {number} averageResponseTime - Mean response time across all requests (ms)
 *   - {number} maxResponseTime - Maximum individual request response time (ms)
 *   - {number} minResponseTime - Minimum individual request response time (ms)
 *   - {number} errorCount - Total number of failed requests or invalid responses
 *   - {number} throughput - Requests per second (total requests / total execution time)
 *   - {number} totalRequests - Total number of requests executed
 *   - {number} successfulRequests - Number of successful requests (status 200)
 *   - {number} totalExecutionTime - Total time to complete all requests (ms)
 * 
 * @example
 * // Test moderate concurrency with 50 requests across 10 concurrent threads
 * const metrics = await runPerformanceTest(10, 50, app);
 * console.log(`Average response time: ${metrics.averageResponseTime}ms`);
 * console.log(`Throughput: ${metrics.throughput} requests/sec`);
 * console.log(`Error rate: ${(metrics.errorCount / metrics.totalRequests * 100).toFixed(2)}%`);
 */
async function runPerformanceTest(concurrencyLevel, requestsPerLevel, app) {
    // Initialize array to hold all request promises for concurrent execution
    const requestPromises = [];
    
    // Calculate requests per concurrent thread (batch size)
    // This ensures even distribution of load across concurrent execution threads
    const requestsPerBatch = Math.ceil(requestsPerLevel / concurrencyLevel);
    
    // Record test execution start time for throughput calculation
    const testStartTime = Date.now();
    
    // Create concurrent batches of requests based on specified concurrency level
    for (let batchIndex = 0; batchIndex < concurrencyLevel; batchIndex++) {
        // Calculate the number of requests for this specific batch
        // Handle remainder requests for the last batch to ensure exact request count
        const remainingRequests = requestsPerLevel - (batchIndex * requestsPerBatch);
        const currentBatchSize = Math.min(requestsPerBatch, remainingRequests);
        
        // Skip empty batches when total requests don't divide evenly
        if (currentBatchSize <= 0) {
            break;
        }
        
        // Create batch of concurrent requests for this execution thread
        for (let requestIndex = 0; requestIndex < currentBatchSize; requestIndex++) {
            // Create individual request promise with timing measurement
            const requestPromise = (async () => {
                try {
                    // Record individual request start time for latency measurement
                    const requestStartTime = Date.now();
                    
                    // Execute HTTP GET request to '/hello' endpoint using makeRequest helper
                    // makeRequest provides consistent request execution and error handling
                    const response = await makeRequest(app, 'GET', '/hello');
                    
                    // Calculate individual request response time
                    const requestEndTime = Date.now();
                    const responseTime = requestEndTime - requestStartTime;
                    
                    // Validate response correctness using assertHelloResponse helper
                    // This ensures performance testing doesn't compromise response accuracy
                    assertHelloResponse(response);
                    
                    // Return performance metrics for this individual request
                    return {
                        responseTime: responseTime,
                        status: response.status,
                        success: true,
                        error: null
                    };
                } catch (error) {
                    // Handle request failures without disrupting concurrent execution
                    // Record error details for aggregate error reporting
                    return {
                        responseTime: null,
                        status: null,
                        success: false,
                        error: error.message || 'Unknown error'
                    };
                }
            })();
            
            // Add request promise to concurrent execution array
            requestPromises.push(requestPromise);
        }
    }
    
    // Execute all requests concurrently and wait for completion
    // Promise.all ensures all requests complete before metrics aggregation
    const requestResults = await Promise.all(requestPromises);
    
    // Record test execution end time for throughput calculation
    const testEndTime = Date.now();
    const totalExecutionTime = testEndTime - testStartTime;
    
    // Aggregate performance metrics from individual request results
    const successfulResults = requestResults.filter(result => result.success);
    const failedResults = requestResults.filter(result => !result.success);
    
    // Calculate response time statistics from successful requests
    const responseTimes = successfulResults.map(result => result.responseTime);
    const averageResponseTime = responseTimes.length > 0 
        ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
        : 0;
    const maxResponseTime = responseTimes.length > 0 
        ? Math.max(...responseTimes) 
        : 0;
    const minResponseTime = responseTimes.length > 0 
        ? Math.min(...responseTimes) 
        : 0;
    
    // Calculate throughput (requests per second)
    const throughput = totalExecutionTime > 0 
        ? (requestResults.length / totalExecutionTime) * 1000 
        : 0;
    
    // Return aggregated performance metrics for test validation
    return {
        averageResponseTime: Math.round(averageResponseTime * 100) / 100, // Round to 2 decimal places
        maxResponseTime: maxResponseTime,
        minResponseTime: minResponseTime,
        errorCount: failedResults.length,
        throughput: Math.round(throughput * 100) / 100, // Round to 2 decimal places
        totalRequests: requestResults.length,
        successfulRequests: successfulResults.length,
        totalExecutionTime: totalExecutionTime
    };
}

// Performance Test Suite Implementation
// This test suite validates '/hello' endpoint performance across different load conditions
// and ensures the endpoint meets technical specification requirements under stress

describe('Hello Endpoint Performance', () => {
    // Test Suite Setup and Configuration
    // Configure Jest timeout for performance tests to allow sufficient execution time
    // Performance tests may take longer than default Jest timeout due to concurrent load
    beforeAll(() => {
        // Set test timeout to 60 seconds to accommodate high concurrency tests
        // This ensures tests don't fail due to timeout during legitimate performance testing
        jest.setTimeout(60000);
    });
    
    // Test Suite Cleanup
    // Restore default Jest timeout after performance test completion
    afterAll(() => {
        // Restore Jest default timeout for other test suites
        jest.setTimeout(5000);
    });

    /**
     * Single Request Performance Test
     * 
     * Validates that the '/hello' endpoint responds within the 100ms threshold
     * for individual requests under no concurrent load. This establishes the
     * baseline performance expectation for the endpoint.
     * 
     * Performance Requirements Validated:
     * - Response time < 100ms for single request (Technical Specifications/2.4.2)
     * - Response correctness under performance measurement conditions
     * - Endpoint availability and basic functionality
     */
    test('should respond within 100ms under single request', async () => {
        // Send a single GET request to '/hello' using makeRequest helper
        // Record response time for performance validation
        const startTime = Date.now();
        const response = await makeRequest(app, 'GET', '/hello');
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        // Assert that response time is less than RESPONSE_TIME_THRESHOLD_MS (100ms)
        expect(responseTime).toBeLessThan(RESPONSE_TIME_THRESHOLD_MS);
        
        // Assert that the response is correct using assertHelloResponse helper
        // This ensures performance testing doesn't compromise response accuracy
        assertHelloResponse(response);
        
        // Log performance metrics for observability and debugging
        console.log(`[PERF] Single request response time: ${responseTime}ms`);
    });

    /**
     * Concurrent Load Performance Test
     * 
     * Validates that the '/hello' endpoint maintains response time and accuracy
     * requirements under various concurrent load conditions. Tests multiple
     * concurrency levels to ensure the endpoint scales appropriately.
     * 
     * Performance Requirements Validated:
     * - Average response time < 100ms under concurrent load
     * - Maximum response time < 100ms for individual requests
     * - Zero error rate under concurrent access patterns
     * - Response correctness maintained under load conditions
     * - Throughput measurement for capacity planning
     */
    test('should maintain <100ms response time under moderate concurrency', async () => {
        // Test performance across all defined concurrency levels
        for (const concurrencyLevel of CONCURRENCY_LEVELS) {
            console.log(`[PERF] Testing concurrency level: ${concurrencyLevel} concurrent requests`);
            
            // Run performance test for current concurrency level
            const performanceMetrics = await runPerformanceTest(
                concurrencyLevel, 
                REQUESTS_PER_LEVEL, 
                app
            );
            
            // Assert that average response time is below threshold
            expect(performanceMetrics.averageResponseTime).toBeLessThan(RESPONSE_TIME_THRESHOLD_MS);
            
            // Assert that maximum response time is below threshold
            // This ensures no individual request exceeds the SLA requirement
            expect(performanceMetrics.maxResponseTime).toBeLessThan(RESPONSE_TIME_THRESHOLD_MS);
            
            // Assert that error count is zero
            // High-quality endpoints should not fail under expected load conditions
            expect(performanceMetrics.errorCount).toBe(0);
            
            // Assert that all requests were successful
            expect(performanceMetrics.successfulRequests).toBe(performanceMetrics.totalRequests);
            
            // Log comprehensive performance metrics for observability and capacity planning
            console.log(`[PERF] Concurrency Level: ${concurrencyLevel}`);
            console.log(`[PERF] Total Requests: ${performanceMetrics.totalRequests}`);
            console.log(`[PERF] Successful Requests: ${performanceMetrics.successfulRequests}`);
            console.log(`[PERF] Average Response Time: ${performanceMetrics.averageResponseTime}ms`);
            console.log(`[PERF] Min Response Time: ${performanceMetrics.minResponseTime}ms`);
            console.log(`[PERF] Max Response Time: ${performanceMetrics.maxResponseTime}ms`);
            console.log(`[PERF] Throughput: ${performanceMetrics.throughput} requests/sec`);
            console.log(`[PERF] Total Execution Time: ${performanceMetrics.totalExecutionTime}ms`);
            console.log(`[PERF] Error Count: ${performanceMetrics.errorCount}`);
            console.log(`[PERF] ----------------------------------------`);
        }
    });

    /**
     * High Concurrency Error Rate Test
     * 
     * Validates that the '/hello' endpoint maintains zero or acceptably low error
     * rates under high concurrent load conditions. This test focuses on system
     * stability and reliability under stress conditions.
     * 
     * Performance Requirements Validated:
     * - Error rate below acceptable threshold (<1%) under maximum concurrency
     * - System stability under peak load conditions
     * - Response correctness maintained under maximum stress
     * - No system failures or crashes under high load
     */
    test('should not exceed error rate threshold under high concurrency', async () => {
        // Test at the highest concurrency level for maximum stress validation
        const maxConcurrencyLevel = Math.max(...CONCURRENCY_LEVELS);
        
        console.log(`[PERF] Testing maximum concurrency: ${maxConcurrencyLevel} concurrent requests`);
        
        // Run performance test at maximum concurrency level
        const performanceMetrics = await runPerformanceTest(
            maxConcurrencyLevel, 
            REQUESTS_PER_LEVEL, 
            app
        );
        
        // Calculate error rate percentage for validation
        const errorRate = (performanceMetrics.errorCount / performanceMetrics.totalRequests) * 100;
        
        // Assert that error rate is zero or below acceptable threshold (1%)
        // For tutorial applications, zero errors are expected under normal conditions
        expect(performanceMetrics.errorCount).toBe(0);
        expect(errorRate).toBeLessThan(1.0);
        
        // Assert that all responses are valid using aggregate validation
        // This ensures response correctness is maintained under high load
        expect(performanceMetrics.successfulRequests).toBe(performanceMetrics.totalRequests);
        
        // Log comprehensive error analysis for troubleshooting and optimization
        console.log(`[PERF] High Concurrency Test Results:`);
        console.log(`[PERF] Concurrency Level: ${maxConcurrencyLevel}`);
        console.log(`[PERF] Total Requests: ${performanceMetrics.totalRequests}`);
        console.log(`[PERF] Successful Requests: ${performanceMetrics.successfulRequests}`);
        console.log(`[PERF] Error Count: ${performanceMetrics.errorCount}`);
        console.log(`[PERF] Error Rate: ${errorRate.toFixed(2)}%`);
        console.log(`[PERF] Average Response Time: ${performanceMetrics.averageResponseTime}ms`);
        console.log(`[PERF] Max Response Time: ${performanceMetrics.maxResponseTime}ms`);
        console.log(`[PERF] Throughput: ${performanceMetrics.throughput} requests/sec`);
    });

    /**
     * Performance Regression Detection Test
     * 
     * Validates that performance metrics remain within acceptable ranges across
     * multiple test runs to detect performance regressions. This test can be
     * extended with historical performance data for trend analysis.
     * 
     * Performance Requirements Validated:
     * - Consistent performance across multiple test executions
     * - Performance stability and predictability
     * - Early detection of performance degradation
     */
    test('should maintain consistent performance across multiple runs', async () => {
        const testRuns = 3; // Number of performance test runs for consistency validation
        const performanceResults = [];
        
        // Execute multiple performance test runs for consistency analysis
        for (let runIndex = 0; runIndex < testRuns; runIndex++) {
            console.log(`[PERF] Performance consistency run ${runIndex + 1}/${testRuns}`);
            
            const performanceMetrics = await runPerformanceTest(
                10, // Use moderate concurrency for consistency testing
                50, // Use smaller request count for faster execution
                app
            );
            
            performanceResults.push(performanceMetrics);
            
            // Validate individual run performance requirements
            expect(performanceMetrics.averageResponseTime).toBeLessThan(RESPONSE_TIME_THRESHOLD_MS);
            expect(performanceMetrics.errorCount).toBe(0);
        }
        
        // Calculate performance consistency metrics across all runs
        const averageResponseTimes = performanceResults.map(result => result.averageResponseTime);
        const maxResponseTimes = performanceResults.map(result => result.maxResponseTime);
        const throughputs = performanceResults.map(result => result.throughput);
        
        // Calculate standard deviation for performance consistency validation
        const avgResponseTimeStdDev = calculateStandardDeviation(averageResponseTimes);
        const maxResponseTimeStdDev = calculateStandardDeviation(maxResponseTimes);
        const throughputStdDev = calculateStandardDeviation(throughputs);
        
        // Assert performance consistency (low standard deviation indicates consistent performance)
        // Standard deviation should be less than 20% of the mean for acceptable consistency
        const avgResponseTimeMean = averageResponseTimes.reduce((sum, val) => sum + val, 0) / averageResponseTimes.length;
        expect(avgResponseTimeStdDev).toBeLessThan(avgResponseTimeMean * 0.2);
        
        // Log performance consistency analysis
        console.log(`[PERF] Performance Consistency Analysis:`);
        console.log(`[PERF] Average Response Time - Mean: ${avgResponseTimeMean.toFixed(2)}ms, StdDev: ${avgResponseTimeStdDev.toFixed(2)}ms`);
        console.log(`[PERF] Max Response Time - StdDev: ${maxResponseTimeStdDev.toFixed(2)}ms`);
        console.log(`[PERF] Throughput - StdDev: ${throughputStdDev.toFixed(2)} req/sec`);
    });
});

/**
 * Helper function to calculate standard deviation for performance consistency analysis
 * 
 * @param {number[]} values - Array of numeric values to calculate standard deviation
 * @returns {number} Standard deviation of the input values
 */
function calculateStandardDeviation(values) {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDifferences = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDifferences.reduce((sum, val) => sum + val, 0) / values.length;
    
    return Math.sqrt(variance);
}