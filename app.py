from flask import Flask, Response

app = Flask(__name__)

# Route handler for root path and all other paths
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    # Return consistent response with 200 status code and text/plain content type
    return Response('Hello, World!\n', mimetype='text/plain')

if __name__ == '__main__':
    # Server configuration
    hostname = '127.0.0.1'
    port = 3000
    
    # Log server startup information to console
    print(f"Server running at http://{hostname}:{port}/")
    
    # Start the Flask development server
    app.run(host=hostname, port=port)