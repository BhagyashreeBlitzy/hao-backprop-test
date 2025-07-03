/**
 * @fileoverview Unit Test Suite for /hello Endpoint Router
 * 
 * Unit test suite for the '/hello' endpoint router. Validates that the router defined in
 * src/backend/routes/hello.js correctly handles GET requests to '/hello' by returning the
 * canonical 'Hello world' response, enforces method restrictions (405 for non-GET), and
 * integrates with error handling as specified.
 * 
 * Uses Supertest to simulate requests directly to the router, and test helpers/fixtures
 * to ensure DRY, standards-compliant assertions. Ensures the endpoint's contract, error
 * handling, and response format are correct in isolation from the full app.
 * 
 * Test Coverage:
 * - GET /hello returns 200 with canonical "Hello world" message
 * - POST /hello returns 405 Method Not Allowed
 * - PUT /hello returns 405 Method Not Allowed  
 * - DELETE /hello returns 405 Method Not Allowed
 * - PATCH /hello returns 405 Method Not Allowed
 * - HEAD /hello returns 405 Method Not Allowed
 * - OPTIONS /hello returns 405 Method Not Allowed
 * - GET /hello with query parameters returns canonical message
 * 
 * @author Generated for Node.js Tutorial Application
 * @version 1.0.0
 */

// External dependencies
const { describe, it, expect } = require('@jest/globals'); // Jest v29.7.0 - Testing framework with describe, it, and expect

// Internal dependencies
const { router } = require('../../../backend/routes/hello.js'); // The Express Router instance exposing the '/hello' endpoint for GET requests and method enforcement
const { makeRequest, assertHelloResponse, assertErrorResponse } = require('../../helpers/testUtils.js'); // Reusable test helpers for HTTP requests and assertions
const { METHOD_NOT_ALLOWED_RESPONSE } = require('../../fixtures/responses.js'); // Canonical response body for 405 Method Not Allowed

/**
 * Main test suite for the /hello endpoint router.
 * 
 * Contains all unit tests for GET and non-GET method handling to ensure the router
 * correctly implements the technical specification requirements for the Hello World
 * endpoint and response generation features.
 * 
 * The test suite validates:
 * - Correct GET request handling with canonical response
 * - Proper HTTP method enforcement (405 for non-GET methods)
 * - Integration with error handling middleware
 * - Response format and headers compliance
 * - Query parameter handling robustness
 * 
 * All tests use shared helpers and fixtures to ensure DRY, maintainable, and
 * standards-compliant test code that can be easily updated if canonical responses change.
 */
describe('/hello router', () => {
    /**
     * Test: GET /hello returns 200 and canonical message
     * 
     * Validates that the router correctly handles GET requests to '/hello' by:
     * - Returning HTTP status 200 (OK)
     * - Setting correct Content-Type header (text/plain)
     * - Returning the exact canonical "Hello world" message
     * 
     * This test ensures the Hello World Endpoint feature (Technical Specifications/2.1.2)
     * and Response Generation feature (Technical Specifications/2.1.4) are implemented correctly.
     */
    it('should return 200 and canonical message for GET /hello', async () => {
        // Call makeRequest helper to send GET request to /hello endpoint
        const response = await makeRequest(router, 'get', '/hello');
        
        // Use assertHelloResponse helper to validate status, headers, and body
        assertHelloResponse(response);
    });

    /**
     * Test: POST /hello returns 405 Method Not Allowed
     * 
     * Validates that the router correctly enforces HTTP method restrictions by:
     * - Returning HTTP status 405 (Method Not Allowed)
     * - Returning the canonical METHOD_NOT_ALLOWED_RESPONSE message
     * 
     * This test ensures proper method validation as specified in the Response Generation
     * feature requirements.
     */
    it('should return 405 Method Not Allowed for POST /hello', async () => {
        // Call makeRequest helper to send POST request to /hello endpoint
        const response = await makeRequest(router, 'post', '/hello');
        
        // Use assertErrorResponse helper to validate 405 status and canonical error message
        assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
    });

    /**
     * Test: PUT /hello returns 405 Method Not Allowed
     * 
     * Validates that the router correctly enforces HTTP method restrictions by:
     * - Returning HTTP status 405 (Method Not Allowed)
     * - Returning the canonical METHOD_NOT_ALLOWED_RESPONSE message
     * 
     * This test ensures proper method validation for PUT requests.
     */
    it('should return 405 Method Not Allowed for PUT /hello', async () => {
        // Call makeRequest helper to send PUT request to /hello endpoint
        const response = await makeRequest(router, 'put', '/hello');
        
        // Use assertErrorResponse helper to validate 405 status and canonical error message
        assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
    });

    /**
     * Test: DELETE /hello returns 405 Method Not Allowed
     * 
     * Validates that the router correctly enforces HTTP method restrictions by:
     * - Returning HTTP status 405 (Method Not Allowed)
     * - Returning the canonical METHOD_NOT_ALLOWED_RESPONSE message
     * 
     * This test ensures proper method validation for DELETE requests.
     */
    it('should return 405 Method Not Allowed for DELETE /hello', async () => {
        // Call makeRequest helper to send DELETE request to /hello endpoint
        const response = await makeRequest(router, 'delete', '/hello');
        
        // Use assertErrorResponse helper to validate 405 status and canonical error message
        assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
    });

    /**
     * Test: PATCH /hello returns 405 Method Not Allowed
     * 
     * Validates that the router correctly enforces HTTP method restrictions by:
     * - Returning HTTP status 405 (Method Not Allowed)
     * - Returning the canonical METHOD_NOT_ALLOWED_RESPONSE message
     * 
     * This test ensures proper method validation for PATCH requests.
     */
    it('should return 405 Method Not Allowed for PATCH /hello', async () => {
        // Call makeRequest helper to send PATCH request to /hello endpoint
        const response = await makeRequest(router, 'patch', '/hello');
        
        // Use assertErrorResponse helper to validate 405 status and canonical error message
        assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
    });

    /**
     * Test: HEAD /hello returns 405 Method Not Allowed
     * 
     * Validates that the router correctly enforces HTTP method restrictions by:
     * - Returning HTTP status 405 (Method Not Allowed)
     * - Returning the canonical METHOD_NOT_ALLOWED_RESPONSE message
     * 
     * This test ensures proper method validation for HEAD requests.
     */
    it('should return 405 Method Not Allowed for HEAD /hello', async () => {
        // Call makeRequest helper to send HEAD request to /hello endpoint
        const response = await makeRequest(router, 'head', '/hello');
        
        // Use assertErrorResponse helper to validate 405 status and canonical error message
        assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
    });

    /**
     * Test: OPTIONS /hello returns 405 Method Not Allowed
     * 
     * Validates that the router correctly enforces HTTP method restrictions by:
     * - Returning HTTP status 405 (Method Not Allowed)
     * - Returning the canonical METHOD_NOT_ALLOWED_RESPONSE message
     * 
     * This test ensures proper method validation for OPTIONS requests.
     */
    it('should return 405 Method Not Allowed for OPTIONS /hello', async () => {
        // Call makeRequest helper to send OPTIONS request to /hello endpoint
        const response = await makeRequest(router, 'options', '/hello');
        
        // Use assertErrorResponse helper to validate 405 status and canonical error message
        assertErrorResponse(response, 405, METHOD_NOT_ALLOWED_RESPONSE);
    });

    /**
     * Test: GET /hello with query params returns canonical message
     * 
     * Validates that the router correctly handles GET requests with query parameters by:
     * - Ignoring query parameters (maintaining endpoint simplicity)
     * - Returning HTTP status 200 (OK)
     * - Returning the exact canonical "Hello world" message
     * 
     * This test ensures robustness and that query parameters don't affect the static response,
     * which is important for maintaining the endpoint's educational clarity and simplicity.
     */
    it('should return canonical message for GET /hello with query params', async () => {
        // Call makeRequest helper to send GET request with query parameters
        const response = await makeRequest(router, 'get', '/hello?foo=bar&test=value');
        
        // Use assertHelloResponse helper to validate response is still canonical
        assertHelloResponse(response);
    });
});