# hao-backprop-test
Test project for backprop integration. Do not touch!

## Overview
This is a minimal Python Flask-based HTTP server that provides a stable environment for backprop integration testing.

## Requirements
- Python 3.6 or higher
- Flask 2.0.1 (specified in requirements.txt)

## Setup Instructions

### 1. Install Python 3
Ensure you have Python 3.6 or higher installed on your system.
You can verify your Python version with:
```
python --version
```

### 2. Set Up a Virtual Environment (Recommended)
It's recommended to use a virtual environment to isolate dependencies:

```
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies
Install the required packages using pip:

```
pip install -r requirements.txt
```

## Running the Server
Start the server with:

```
python app.py
```

The server will start on localhost (127.0.0.1) port 3000 and display:
"Server running at http://127.0.0.1:3000/"

## Server Behavior
- The server listens on localhost:3000
- All HTTP requests (any method, any path) receive the same response:
  - Status code: 200 OK
  - Content-Type: text/plain
  - Body: "Hello, World!"
- To stop the server, press Ctrl+C in the terminal

## Important Note
This is a test project specifically designed for backprop integration testing.
Do not modify this application as it may affect test results.