from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='../dist')
CORS(app)

@app.route('/api/tasks', methods=['GET', 'POST', 'PUT', 'DELETE'])
def handle_tasks():
    if request.method == 'GET':
        return jsonify({"message": "Tasks retrieved successfully"})
    elif request.method == 'POST':
        return jsonify({"message": "Task added successfully"})
    elif request.method == 'PUT':
        return jsonify({"message": "Task updated successfully"})
    elif request.method == 'DELETE':
        return jsonify({"message": "Task deleted successfully"})

# Serve static files from the dist folder
@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)