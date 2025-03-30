from flask import Flask, Response

app = Flask(__name__)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return Response('Hello, World!\n', mimetype='text/plain')

if __name__ == '__main__':
    hostname = '127.0.0.1'
    port = 3000
    print(f"Server running at http://{hostname}:{port}/")
    app.run(host=hostname, port=port)