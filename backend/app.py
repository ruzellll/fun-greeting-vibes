from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os

app = Flask(__name__, static_folder='../dist')
CORS(app)

# File to store tasks (simulating a database)
TASKS_FILE = 'tasks.json'

def load_tasks():
    if os.path.exists(TASKS_FILE):
        with open(TASKS_FILE, 'r') as f:
            return json.load(f)
    return []

def save_tasks(tasks):
    with open(TASKS_FILE, 'w') as f:
        json.dump(tasks, f)

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
    tasks = load_tasks()
    return jsonify(tasks)

# Add a new task
@app.route('/api/tasks', methods=['POST'])
def add_task():
    task = request.json
    tasks = load_tasks()
    tasks.append(task)
    save_tasks(tasks)
    return jsonify(task), 201

# Update a task
@app.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    tasks = load_tasks()
    updated_task = request.json
    
    for i, task in enumerate(tasks):
        if task['id'] == task_id:
            tasks[i] = updated_task
            save_tasks(tasks)
            return jsonify(updated_task)
    
    return jsonify({'error': 'Task not found'}), 404

# Delete a task
@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    tasks = load_tasks()
    tasks = [task for task in tasks if task['id'] != task_id]
    save_tasks(tasks)
    return '', 204

# Toggle task completion
@app.route('/api/tasks/<task_id>/toggle', methods=['PUT'])
def toggle_task(task_id):
    tasks = load_tasks()
    
    for task in tasks:
        if task['id'] == task_id:
            task['completed'] = not task['completed']
            save_tasks(tasks)
            return jsonify(task)
    
    return jsonify({'error': 'Task not found'}), 404

# Toggle task pin status
@app.route('/api/tasks/<task_id>/pin', methods=['PUT'])
def pin_task(task_id):
    tasks = load_tasks()
    
    for task in tasks:
        if task['id'] == task_id:
            task['pinned'] = not task.get('pinned', False)
            save_tasks(tasks)
            return jsonify(task)
    
    return jsonify({'error': 'Task not found'}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)