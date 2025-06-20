from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from your Chrome extension

@app.route('/')
def index():
    return '<h1>Hello from Flask on port 5001!</h1>'

if __name__ == '__main__':
    app.run(port=5001, debug=True)