# hao-backprop-test

Test project for backprop integration. Do not touch!

## Overview

This is a minimal Python Flask-based HTTP server that responds with "Hello, World!" to all requests. It is specifically designed for backprop integration testing.

## Requirements

- Python 3.6 or higher
- Flask 2.0.1 (installed via requirements.txt)

## Setup Instructions

1. Ensure Python 3 is installed on your system
   ```
   python --version
   ```

2. (Optional but recommended) Create a virtual environment
   ```
   python -m venv venv
   ```

3. Activate the virtual environment
   - Windows:
     ```
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Install dependencies
   ```
   pip install -r requirements.txt
   ```

## Running the Server

Start the server with:
```
python app.py
```

The server will run at http://127.0.0.1:3000/ and respond with "Hello, World!" to all HTTP requests.

## Testing

You can test the server using any HTTP client (browser, curl, etc.) by sending requests to http://127.0.0.1:3000/.

Example using curl:
```
curl http://127.0.0.1:3000/
```

Expected response:
```
Hello, World!
```