# hao-backprop-test

Test project for backprop integration. Do not touch!

## Description

This is a minimal Python Flask-based HTTP server designed specifically for backprop integration testing. The server responds to all HTTP requests with a "Hello, World!" message and a 200 status code.

## Requirements

- Python 3.6 or higher
- Flask 2.0.1 (specified in requirements.txt)

## Setup

It is recommended to use a virtual environment to isolate dependencies:

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On Unix/MacOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Running the Server

Start the server with:

```bash
python app.py
```

The server will run at http://127.0.0.1:3000/ and respond to all HTTP requests with "Hello, World!".

To stop the server, press Ctrl+C in the terminal.

## Important Note

This is a test project for backprop integration. Do not modify its behavior to ensure consistent test results.