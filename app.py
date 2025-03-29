from flask import Flask, Response

app = Flask(__name__)

# Define server constants
hostname = '127.0.0.1'
port = 3000

# Route handler for all paths
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    # Return a consistent response for all requests
    # Status code 200 is the default for Flask responses
    return Response('Hello, World!\n', mimetype='text/plain')

if __name__ == '__main__':
    # Log server startup information
    print(f"Server running at http://{hostname}:{port}/")
    # Start the Flask development server
    app.run(host=hostname, port=port)