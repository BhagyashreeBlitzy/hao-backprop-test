from flask import Flask, Response

# Define server constants
hostname = '127.0.0.1'
port = 3000

# Create Flask application instance
app = Flask(__name__)

# Define route handler for all paths
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    # Return consistent response for all requests
    return Response('Hello, World!\n', mimetype='text/plain')

# Start the server when this file is executed directly
if __name__ == '__main__':
    # Log server startup information
    print(f"Server running at http://{hostname}:{port}/")
    # Run the Flask application
    app.run(host=hostname, port=port)