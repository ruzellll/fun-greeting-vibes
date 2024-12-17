from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='../dist')
CORS(app)

# In-memory storage (simulating localStorage)
tasks_storage = []

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
    return jsonify(tasks_storage)

# Add a new task
@app.route('/api/tasks', methods=['POST'])
def add_task():
    task = request.json
    tasks_storage.append(task)
    return jsonify(task), 201

# Update a task
@app.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    updated_task = request.json
    
    for i, task in enumerate(tasks_storage):
        if task['id'] == task_id:
            tasks_storage[i] = updated_task
            return jsonify(updated_task)
    
    return jsonify({'error': 'Task not found'}), 404

# Delete a task
@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks_storage
    tasks_storage = [task for task in tasks_storage if task['id'] != task_id]
    return '', 204

# Toggle task completion
@app.route('/api/tasks/<task_id>/toggle', methods=['PUT'])
def toggle_task(task_id):
    for task in tasks_storage:
        if task['id'] == task_id:
            task['completed'] = not task['completed']
            return jsonify(task)
    
    return jsonify({'error': 'Task not found'}), 404

# Toggle task pin status
@app.route('/api/tasks/<task_id>/pin', methods=['PUT'])
def pin_task(task_id):
    for task in tasks_storage:
        if task['id'] == task_id:
            task['pinned'] = not task.get('pinned', False)
            return jsonify(task)
    
    return jsonify({'error': 'Task not found'}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)