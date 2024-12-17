from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='../dist')
CORS(app)

# Serve static files from the dist folder
@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

# Get all tasks
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = request.json or []
    return jsonify(tasks)

# Add a new task
@app.route('/api/tasks', methods=['POST'])
def add_task():
    task = request.json
    return jsonify(task), 201

# Update a task
@app.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    updated_task = request.json
    return jsonify(updated_task)

# Delete a task
@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    return '', 204

# Toggle task completion
@app.route('/api/tasks/<task_id>/toggle', methods=['PUT'])
def toggle_task(task_id):
    task = request.json
    return jsonify(task)

# Toggle task pin status
@app.route('/api/tasks/<task_id>/pin', methods=['PUT'])
def pin_task(task_id):
    task = request.json
    return jsonify(task)

if __name__ == '__main__':
    app.run(debug=True, port=5000)