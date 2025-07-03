// External imports
const jest = require('jest'); // Jest ^29.0.0 - JavaScript testing framework for unit testing and assertions

// Internal imports
const { helloRouter } = require('../../routes/hello.js'); // Hello endpoint router with GET and method filtering handlers
const { createMockRequest, createMockResponse, assertResponse } = require('../helpers/testUtils.js'); // Test utilities for mocking and assertions

// Test suite for /hello endpoint route handler
describe('/hello endpoint', () => {
    
    // Test suite for GET /hello route handler
    describe('GET /hello', () => {
        
        test("should return 200 and 'Hello world' for GET /hello", async () => {
            // Create mock GET request to /hello endpoint
            const mockRequest = createMockRequest({
                method: 'GET',
                path: '/hello'
            });
            
            // Create mock response object with Jest spies
            const mockResponse = createMockResponse();
            
            // Get the GET handler from the router stack
            const getRoute = helloRouter.stack.find(layer => 
                layer.route && 
                layer.route.path === '/hello' && 
                layer.route.methods.get
            );
            
            // Ensure the GET route was found
            expect(getRoute).toBeDefined();
            expect(getRoute.route.methods.get).toBe(true);
            
            // Get the handler function from the route
            const getHandler = getRoute.route.stack[0].handle;
            
            // Invoke the GET /hello handler with mock request and response
            await getHandler(mockRequest, mockResponse);
            
            // Assert that the response matches expected values
            // Status: 200, Content-Type: text/plain; charset=utf-8, Body: 'Hello world'
            assertResponse(
                mockResponse,
                200,
                { 'Content-Type': 'text/plain; charset=utf-8' },
                'Hello world'
            );
        });
        
        test('should set correct headers for GET /hello', async () => {
            // Create mock GET request to /hello endpoint
            const mockRequest = createMockRequest({
                method: 'GET',
                path: '/hello'
            });
            
            // Create mock response object with Jest spies
            const mockResponse = createMockResponse();
            
            // Get the GET handler from the router stack
            const getRoute = helloRouter.stack.find(layer => 
                layer.route && 
                layer.route.path === '/hello' && 
                layer.route.methods.get
            );
            
            // Get the handler function from the route
            const getHandler = getRoute.route.stack[0].handle;
            
            // Invoke the GET /hello handler with mock request and response
            await getHandler(mockRequest, mockResponse);
            
            // Assert that status method was called with 200
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            
            // Assert that set method was called with Content-Type header
            expect(mockResponse.set).toHaveBeenCalledWith('Content-Type', 'text/plain; charset=utf-8');
            
            // Assert that send method was called with 'Hello world'
            expect(mockResponse.send).toHaveBeenCalledWith('Hello world');
            
            // Verify response status code is correctly set
            expect(mockResponse.statusCode).toBe(200);
            
            // Verify Content-Type header is correctly set
            expect(mockResponse.headers['Content-Type']).toBe('text/plain; charset=utf-8');
            
            // Verify response body is correctly set
            expect(mockResponse.body).toBe('Hello world');
        });
        
        test('should call response methods in correct order for GET /hello', async () => {
            // Create mock GET request to /hello endpoint
            const mockRequest = createMockRequest({
                method: 'GET',
                path: '/hello'
            });
            
            // Create mock response object with Jest spies
            const mockResponse = createMockResponse();
            
            // Get the GET handler from the router stack
            const getRoute = helloRouter.stack.find(layer => 
                layer.route && 
                layer.route.path === '/hello' && 
                layer.route.methods.get
            );
            
            // Get the handler function from the route
            const getHandler = getRoute.route.stack[0].handle;
            
            // Invoke the GET /hello handler with mock request and response
            await getHandler(mockRequest, mockResponse);
            
            // Verify that all expected methods were called
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.set).toHaveBeenCalledTimes(1);
            expect(mockResponse.send).toHaveBeenCalledTimes(1);
            
            // Verify method call order: status -> set -> send
            const statusCallOrder = mockResponse.status.mock.invocationCallOrder[0];
            const setCallOrder = mockResponse.set.mock.invocationCallOrder[0];
            const sendCallOrder = mockResponse.send.mock.invocationCallOrder[0];
            
            expect(statusCallOrder).toBeLessThan(setCallOrder);
            expect(setCallOrder).toBeLessThan(sendCallOrder);
        });
    });
    
    // Test suite for non-GET methods to /hello endpoint
    describe('non-GET methods to /hello', () => {
        
        test('should return 405 for POST /hello', async () => {
            // Create mock POST request to /hello endpoint
            const mockRequest = createMockRequest({
                method: 'POST',
                path: '/hello'
            });
            
            // Create mock response object with Jest spies
            const mockResponse = createMockResponse();
            
            // Get the ALL handler from the router stack (handles non-GET methods)
            const allRoute = helloRouter.stack.find(layer => 
                layer.route && 
                layer.route.path === '/hello' && 
                layer.route.methods._all
            );
            
            // Ensure the ALL route was found
            expect(allRoute).toBeDefined();
            expect(allRoute.route.methods._all).toBe(true);
            
            // Get the handler function from the route
            const allHandler = allRoute.route.stack[0].handle;
            
            // Invoke the ALL /hello handler with mock request and response
            await allHandler(mockRequest, mockResponse);
            
            // Assert that the response matches expected values
            // Status: 405, Content-Type: text/plain; charset=utf-8, Body: 'Method Not Allowed'
            assertResponse(
                mockResponse,
                405,
                { 'Content-Type': 'text/plain; charset=utf-8' },
                'Method Not Allowed'
            );
        });
        
        test('should return 405 for PUT /hello', async () => {
            // Create mock PUT request to /hello endpoint
            const mockRequest = createMockRequest({
                method: 'PUT',
                path: '/hello'
            });
            
            // Create mock response object with Jest spies
            const mockResponse = createMockResponse();
            
            // Get the ALL handler from the router stack
            const allRoute = helloRouter.stack.find(layer => 
                layer.route && 
                layer.route.path === '/hello' && 
                layer.route.methods._all
            );
            
            // Get the handler function from the route
            const allHandler = allRoute.route.stack[0].handle;
            
            // Invoke the ALL /hello handler with mock request and response
            await allHandler(mockRequest, mockResponse);
            
            // Assert that the response matches expected values
            assertResponse(
                mockResponse,
                405,
                { 'Content-Type': 'text/plain; charset=utf-8' },
                'Method Not Allowed'
            );
        });
        
        test('should return 405 for DELETE /hello', async () => {
            // Create mock DELETE request to /hello endpoint
            const mockRequest = createMockRequest({
                method: 'DELETE',
                path: '/hello'
            });
            
            // Create mock response object with Jest spies
            const mockResponse = createMockResponse();
            
            // Get the ALL handler from the router stack
            const allRoute = helloRouter.stack.find(layer => 
                layer.route && 
                layer.route.path === '/hello' && 
                layer.route.methods._all
            );
            
            // Get the handler function from the route
            const allHandler = allRoute.route.stack[0].handle;
            
            // Invoke the ALL /hello handler with mock request and response
            await allHandler(mockRequest, mockResponse);
            
            // Assert that the response matches expected values
            assertResponse(
                mockResponse,
                405,
                { 'Content-Type': 'text/plain; charset=utf-8' },
                'Method Not Allowed'
            );
        });
        
        test('should return 405 for PATCH /hello', async () => {
            // Create mock PATCH request to /hello endpoint
            const mockRequest = createMockRequest({
                method: 'PATCH',
                path: '/hello'
            });
            
            // Create mock response object with Jest spies
            const mockResponse = createMockResponse();
            
            // Get the ALL handler from the router stack
            const allRoute = helloRouter.stack.find(layer => 
                layer.route && 
                layer.route.path === '/hello' && 
                layer.route.methods._all
            );
            
            // Get the handler function from the route
            const allHandler = allRoute.route.stack[0].handle;
            
            // Invoke the ALL /hello handler with mock request and response
            await allHandler(mockRequest, mockResponse);
            
            // Assert that the response matches expected values
            assertResponse(
                mockResponse,
                405,
                { 'Content-Type': 'text/plain; charset=utf-8' },
                'Method Not Allowed'
            );
        });
        
        test('should set correct headers for non-GET methods to /hello', async () => {
            // Test multiple HTTP methods that should return 405
            const nonGetMethods = ['POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
            
            for (const method of nonGetMethods) {
                // Create mock request with current method
                const mockRequest = createMockRequest({
                    method: method,
                    path: '/hello'
                });
                
                // Create mock response object with Jest spies
                const mockResponse = createMockResponse();
                
                // Get the ALL handler from the router stack
                const allRoute = helloRouter.stack.find(layer => 
                    layer.route && 
                    layer.route.path === '/hello' && 
                    layer.route.methods._all
                );
                
                // Get the handler function from the route
                const allHandler = allRoute.route.stack[0].handle;
                
                // Invoke the ALL /hello handler with mock request and response
                await allHandler(mockRequest, mockResponse);
                
                // Assert that status method was called with 405
                expect(mockResponse.status).toHaveBeenCalledWith(405);
                
                // Assert that set method was called with Content-Type header
                expect(mockResponse.set).toHaveBeenCalledWith('Content-Type', 'text/plain; charset=utf-8');
                
                // Assert that send method was called with 'Method Not Allowed'
                expect(mockResponse.send).toHaveBeenCalledWith('Method Not Allowed');
                
                // Verify response status code is correctly set
                expect(mockResponse.statusCode).toBe(405);
                
                // Verify Content-Type header is correctly set
                expect(mockResponse.headers['Content-Type']).toBe('text/plain; charset=utf-8');
                
                // Verify response body is correctly set
                expect(mockResponse.body).toBe('Method Not Allowed');
            }
        });
        
        test('should call response methods in correct order for non-GET methods', async () => {
            // Create mock POST request to /hello endpoint
            const mockRequest = createMockRequest({
                method: 'POST',
                path: '/hello'
            });
            
            // Create mock response object with Jest spies
            const mockResponse = createMockResponse();
            
            // Get the ALL handler from the router stack
            const allRoute = helloRouter.stack.find(layer => 
                layer.route && 
                layer.route.path === '/hello' && 
                layer.route.methods._all
            );
            
            // Get the handler function from the route
            const allHandler = allRoute.route.stack[0].handle;
            
            // Invoke the ALL /hello handler with mock request and response
            await allHandler(mockRequest, mockResponse);
            
            // Verify that all expected methods were called
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.set).toHaveBeenCalledTimes(1);
            expect(mockResponse.send).toHaveBeenCalledTimes(1);
            
            // Verify method call order: status -> set -> send
            const statusCallOrder = mockResponse.status.mock.invocationCallOrder[0];
            const setCallOrder = mockResponse.set.mock.invocationCallOrder[0];
            const sendCallOrder = mockResponse.send.mock.invocationCallOrder[0];
            
            expect(statusCallOrder).toBeLessThan(setCallOrder);
            expect(setCallOrder).toBeLessThan(sendCallOrder);
        });
    });
    
    // Test suite for router configuration and structure
    describe('router configuration', () => {
        
        test('should have correct route definitions', () => {
            // Verify that the router has the expected number of routes
            expect(helloRouter.stack).toHaveLength(2);
            
            // Find GET and ALL routes
            const getRoute = helloRouter.stack.find(layer => 
                layer.route && 
                layer.route.path === '/hello' && 
                layer.route.methods.get
            );
            
            const allRoute = helloRouter.stack.find(layer => 
                layer.route && 
                layer.route.path === '/hello' && 
                layer.route.methods._all
            );
            
            // Verify both routes exist
            expect(getRoute).toBeDefined();
            expect(allRoute).toBeDefined();
            
            // Verify route paths
            expect(getRoute.route.path).toBe('/hello');
            expect(allRoute.route.path).toBe('/hello');
            
            // Verify route methods
            expect(getRoute.route.methods.get).toBe(true);
            expect(allRoute.route.methods._all).toBe(true);
        });
        
        test('should have handlers for each route', () => {
            // Get GET and ALL routes
            const getRoute = helloRouter.stack.find(layer => 
                layer.route && 
                layer.route.path === '/hello' && 
                layer.route.methods.get
            );
            
            const allRoute = helloRouter.stack.find(layer => 
                layer.route && 
                layer.route.path === '/hello' && 
                layer.route.methods._all
            );
            
            // Verify each route has exactly one handler
            expect(getRoute.route.stack).toHaveLength(1);
            expect(allRoute.route.stack).toHaveLength(1);
            
            // Verify handlers are functions
            expect(typeof getRoute.route.stack[0].handle).toBe('function');
            expect(typeof allRoute.route.stack[0].handle).toBe('function');
        });
    });
    
    // Test suite for edge cases and error handling
    describe('edge cases', () => {
        
        test('should handle undefined request object gracefully', async () => {
            // Get the GET handler from the router stack
            const getRoute = helloRouter.stack.find(layer => 
                layer.route && 
                layer.route.path === '/hello' && 
                layer.route.methods.get
            );
            
            const getHandler = getRoute.route.stack[0].handle;
            
            // Create mock response object
            const mockResponse = createMockResponse();
            
            // Test with undefined request (should not throw error)
            await expect(getHandler(undefined, mockResponse)).resolves.not.toThrow();
            
            // Response should still be generated correctly
            expect(mockResponse.statusCode).toBe(200);
            expect(mockResponse.body).toBe('Hello world');
        });
        
        test('should handle malformed request object gracefully', async () => {
            // Get the GET handler from the router stack
            const getRoute = helloRouter.stack.find(layer => 
                layer.route && 
                layer.route.path === '/hello' && 
                layer.route.methods.get
            );
            
            const getHandler = getRoute.route.stack[0].handle;
            
            // Create malformed request object
            const malformedRequest = {
                // Missing standard request properties
                invalidProperty: 'invalid'
            };
            
            // Create mock response object
            const mockResponse = createMockResponse();
            
            // Test with malformed request (should not throw error)
            await expect(getHandler(malformedRequest, mockResponse)).resolves.not.toThrow();
            
            // Response should still be generated correctly
            expect(mockResponse.statusCode).toBe(200);
            expect(mockResponse.body).toBe('Hello world');
        });
        
        test('should handle null response object gracefully', async () => {
            // Get the GET handler from the router stack
            const getRoute = helloRouter.stack.find(layer => 
                layer.route && 
                layer.route.path === '/hello' && 
                layer.route.methods.get
            );
            
            const getHandler = getRoute.route.stack[0].handle;
            
            // Create mock request object
            const mockRequest = createMockRequest({
                method: 'GET',
                path: '/hello'
            });
            
            // Test with null response should throw error (cannot call methods on null)
            await expect(getHandler(mockRequest, null)).rejects.toThrow();
        });
    });
    
    // Test suite for response consistency
    describe('response consistency', () => {
        
        test('should always return same response for multiple GET requests', async () => {
            // Get the GET handler from the router stack
            const getRoute = helloRouter.stack.find(layer => 
                layer.route && 
                layer.route.path === '/hello' && 
                layer.route.methods.get
            );
            
            const getHandler = getRoute.route.stack[0].handle;
            
            // Execute multiple requests
            const responses = [];
            for (let i = 0; i < 5; i++) {
                const mockRequest = createMockRequest({
                    method: 'GET',
                    path: '/hello'
                });
                
                const mockResponse = createMockResponse();
                
                await getHandler(mockRequest, mockResponse);
                responses.push(mockResponse);
            }
            
            // Verify all responses are identical
            responses.forEach(response => {
                expect(response.statusCode).toBe(200);
                expect(response.headers['Content-Type']).toBe('text/plain; charset=utf-8');
                expect(response.body).toBe('Hello world');
            });
        });
        
        test('should always return same response for multiple non-GET requests', async () => {
            // Get the ALL handler from the router stack
            const allRoute = helloRouter.stack.find(layer => 
                layer.route && 
                layer.route.path === '/hello' && 
                layer.route.methods._all
            );
            
            const allHandler = allRoute.route.stack[0].handle;
            
            // Test multiple non-GET methods
            const nonGetMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
            
            for (const method of nonGetMethods) {
                const responses = [];
                
                // Execute multiple requests with the same method
                for (let i = 0; i < 3; i++) {
                    const mockRequest = createMockRequest({
                        method: method,
                        path: '/hello'
                    });
                    
                    const mockResponse = createMockResponse();
                    
                    await allHandler(mockRequest, mockResponse);
                    responses.push(mockResponse);
                }
                
                // Verify all responses are identical
                responses.forEach(response => {
                    expect(response.statusCode).toBe(405);
                    expect(response.headers['Content-Type']).toBe('text/plain; charset=utf-8');
                    expect(response.body).toBe('Method Not Allowed');
                });
            }
        });
    });
});