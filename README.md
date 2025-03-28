# hao-backprop-test

Test project for backprop integration. Do not touch!

## Overview

This is a minimal Python Flask-based HTTP server that provides a stable, controlled environment for backprop integration testing. The server responds to all HTTP requests with "Hello, World!" regardless of method or path.

## Requirements

- Python 3.6 or higher
- Flask (installed via requirements.txt)

## Installation

1. Ensure Python 3 is installed on your system:
   ```
   python --version
   ```

2. It's recommended to use a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

## Running the Server

Start the server with:
```
python app.py
```

The server will output:
```
Server running at http://127.0.0.1:3000/
```

The server binds exclusively to localhost (127.0.0.1) on port 3000 and responds to all requests with "Hello, World!" and a 200 status code.

## Testing

You can verify the server is working correctly by sending an HTTP request to http://127.0.0.1:3000/ using any HTTP client (browser, curl, etc.).

Example using curl:
```
curl http://127.0.0.1:3000/
```

Expected response:
```
Hello, World!
```

## Important Notes

- This server is designed for testing purposes only
- The server binds only to localhost for security
- All HTTP methods and paths return the same response
- Do not modify this implementation to ensure consistent test results