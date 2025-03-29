# hao-backprop-test
Test project for backprop integration. Do not touch!

## Description
This is a minimal Python Flask-based HTTP server designed specifically for backprop integration testing. The server responds to all HTTP requests with "Hello, World!" regardless of the request method or path.

## Requirements
- Python 3.6 or higher
- Flask 2.0.1

## Setup
1. Ensure Python 3 is installed on your system
2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Alternatively, install Flask directly:
   ```
   pip install Flask==2.0.1
   ```

## Usage
Start the server by running:
```
python app.py
```

The server will start on localhost (127.0.0.1) port 3000. You should see the following message:
```
Server running at http://127.0.0.1:3000/
```

## Testing
Send any HTTP request to http://127.0.0.1:3000/ to receive a "Hello, World!" response.

Example using curl:
```
curl http://127.0.0.1:3000/
```

Expected response:
```
Hello, World!
```

## Important Note
This is a test environment for backprop integration. Do not modify any files in this repository as it may affect integration test results.