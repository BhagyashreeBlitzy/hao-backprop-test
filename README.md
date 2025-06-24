# hao-backprop-test
Test project for backprop integration. Do not touch!

## Description
This is a minimal Node.js Express.js-based HTTP server designed specifically for backprop integration testing. The server provides two distinct endpoints: a default endpoint that responds with "Hello world" and a dedicated "/good-evening" endpoint that responds with "Good evening". This implementation demonstrates Express.js routing capabilities while maintaining educational simplicity.

### Framework Migration Benefits
This project has been migrated from a raw HTTP module implementation to Express.js framework to provide:
- **Enhanced Routing**: Clean separation of endpoint logic through Express.js routing
- **Framework Foundation**: Industry-standard web framework architecture for future extensibility
- **Educational Value**: Demonstrates modern Node.js web development patterns and middleware concepts
- **Scalability**: Event-driven request processing with efficient concurrent connection handling

## Requirements
- Node.js 18+ LTS (for optimal compatibility and security features)
- Express.js 5.1.0 (automatically installed via npm)

## Setup
1. Ensure Node.js 18+ is installed on your system
2. Install the required dependencies:
   ```
   npm install
   ```
3. Alternatively, install Express.js directly:
   ```
   npm install express@^5.1.0
   ```

## Usage
Start the server by running:
```
node server.js
```

The server will start on localhost (127.0.0.1) port 3000. You should see the following message:
```
Server running at http://127.0.0.1:3000/
```

## Available Endpoints

### Default Endpoint
Send any HTTP request to the root path or any undefined path to receive a "Hello world" response.

Example using curl:
```
curl http://127.0.0.1:3000/
```

Expected response:
```
Hello world
```

### Good Evening Endpoint
Send an HTTP request to the "/good-evening" path to receive a "Good evening" response.

Example using curl:
```
curl http://127.0.0.1:3000/good-evening
```

Expected response:
```
Good evening
```

## Express.js Implementation Details

### Route Configuration
The server uses Express.js routing with the following pattern:
- **Specific Route**: `app.get('/good-evening', handler)` - Handles the dedicated good evening endpoint
- **Catch-All Route**: `app.get('*', handler)` - Handles all other requests with the default Hello world response

### Framework Architecture
- **Express Application**: `const app = express()` creates the application framework foundation
- **Route Handlers**: Individual functions process requests for each endpoint
- **Server Binding**: `app.listen(3000, '127.0.0.1')` replaces manual HTTP server creation
- **Middleware Pipeline**: Extensible request/response processing architecture for future enhancements

## Testing Both Endpoints
You can test both endpoints to verify proper Express.js routing functionality:

### Test Default Endpoint
```bash
curl http://127.0.0.1:3000/
# Expected: Hello world

curl http://127.0.0.1:3000/any-undefined-path
# Expected: Hello world (catch-all behavior)
```

### Test Good Evening Endpoint
```bash
curl http://127.0.0.1:3000/good-evening
# Expected: Good evening
```

### Comprehensive Testing
To validate both endpoints in sequence:
```bash
# Test default endpoint
curl http://127.0.0.1:3000/

# Test good evening endpoint  
curl http://127.0.0.1:3000/good-evening

# Test catch-all behavior
curl http://127.0.0.1:3000/test
```

## Technical Implementation Notes

### Response Format Consistency
Both endpoints return plain text responses with:
- **Content-Type**: `text/plain`
- **Status Code**: `200 OK`
- **Response Body**: Text content followed by newline character

### Development Server Features
- **Automatic Restart**: Restart the server manually after code changes
- **Error Handling**: Express.js middleware provides built-in error management
- **Route Precedence**: Specific routes (`/good-evening`) are evaluated before catch-all routes (`*`)

### Performance Characteristics
- **Server Startup**: <5 seconds (including Express.js initialization and route registration)
- **Request Processing**: <100ms (including Express.js routing evaluation)
- **Memory Footprint**: Minimal baseline appropriate for development and testing environments

## Important Note
This is a test environment for backprop integration. Do not modify any files in this repository as it may affect integration test results.