# hao-backprop-test
Test project for backprop integration using Python Flask. Do not touch!

## Description
This is a minimal Python Flask-based HTTP server designed specifically for backprop integration testing. The server provides a consistent HTTP response for all requests, making it ideal for controlled testing environments.

## Installation
1. Ensure Python 3 is installed on your system
2. Install dependencies using pip:
   ```
   pip install -r requirements.txt
   ```
3. Optionally, create a virtual environment before installing dependencies:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

## Usage
Start the server with:
```
python app.py
```

The server will run at http://127.0.0.1:3000/ and respond to all HTTP requests with "Hello, World!" and a 200 status code.

## Important Note
This project is designed specifically for backprop integration testing. Do not modify its behavior as it may affect test results.