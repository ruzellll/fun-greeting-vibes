from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import sqlite3
from pathlib import Path

app = Flask(__name__, static_folder='../dist')
CORS(app)

# Ensure the databases directory exists
DB_DIR = Path('backend/databases')
DB_DIR.mkdir(parents=True, exist_ok=True) 

def get_db_connection(device_id):
    """Get a database connection for the specific device"""
    db_path = DB_DIR / f"{device_id}.db"
    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    
    # Create tasks table if it doesn't exist
    with conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS tasks (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                completed BOOLEAN NOT NULL DEFAULT 0,
                pinned BOOLEAN NOT NULL DEFAULT 0
            )
        ''')
    
    return conn

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
    device_id = request.headers.get('X-Device-ID')
    if not device_id:
        return jsonify({'error': 'Device ID is required'}), 400
    
    conn = get_db_connection(device_id)
    try:
        cursor = conn.execute('SELECT * FROM tasks')
        tasks = [dict(row) for row in cursor.fetchall()]
        return jsonify(tasks)
    finally:
        conn.close()

# Add a new task
@app.route('/api/tasks', methods=['POST'])
def add_task():
    device_id = request.headers.get('X-Device-ID')
    if not device_id:
        return jsonify({'error': 'Device ID is required'}), 400
    
    task = request.json
    conn = get_db_connection(device_id)
    try:
        conn.execute('''
            INSERT INTO tasks (id, title, description, completed, pinned)
            VALUES (?, ?, ?, ?, ?)
        ''', (task['id'], task['title'], task['description'], task['completed'], task.get('pinned', False)))
        conn.commit()
        return jsonify(task), 201
    finally:
        conn.close()

# Update a task
@app.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    device_id = request.headers.get('X-Device-ID')
    if not device_id:
        return jsonify({'error': 'Device ID is required'}), 400
    
    updated_task = request.json
    conn = get_db_connection(device_id)
    try:
        conn.execute('''
            UPDATE tasks
            SET title = ?, description = ?, completed = ?, pinned = ?
            WHERE id = ?
        ''', (updated_task['title'], updated_task['description'], 
              updated_task['completed'], updated_task.get('pinned', False), task_id))
        conn.commit()
        
        if conn.total_changes > 0:
            return jsonify(updated_task)
        return jsonify({'error': 'Task not found'}), 404
    finally:
        conn.close()

# Delete a task
@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    device_id = request.headers.get('X-Device-ID')
    if not device_id:
        return jsonify({'error': 'Device ID is required'}), 400
    
    conn = get_db_connection(device_id)
    try:
        conn.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
        conn.commit()
        return '', 204
    finally:
        conn.close()

# Toggle task completion
@app.route('/api/tasks/<task_id>/toggle', methods=['PUT'])
def toggle_task(task_id):
    device_id = request.headers.get('X-Device-ID')
    if not device_id:
        return jsonify({'error': 'Device ID is required'}), 400
    
    conn = get_db_connection(device_id)
    try:
        # First get the current state
        cursor = conn.execute('SELECT * FROM tasks WHERE id = ?', (task_id,))
        task = cursor.fetchone()
        
        if task:
            # Toggle the completed status
            new_status = not task['completed']
            conn.execute('UPDATE tasks SET completed = ? WHERE id = ?', 
                        (new_status, task_id))
            conn.commit()
            
            # Return the updated task
            task = dict(task)
            task['completed'] = new_status
            return jsonify(task)
        
        return jsonify({'error': 'Task not found'}), 404
    finally:
        conn.close()

# Toggle task pin status
@app.route('/api/tasks/<task_id>/pin', methods=['PUT'])
def pin_task(task_id):
    device_id = request.headers.get('X-Device-ID')
    if not device_id:
        return jsonify({'error': 'Device ID is required'}), 400
    
    conn = get_db_connection(device_id)
    try:
        # First get the current state
        cursor = conn.execute('SELECT * FROM tasks WHERE id = ?', (task_id,))
        task = cursor.fetchone()
        
        if task:
            # Toggle the pinned status
            new_status = not task['pinned']
            conn.execute('UPDATE tasks SET pinned = ? WHERE id = ?', 
                        (new_status, task_id))
            conn.commit()
            
            # Return the updated task
            task = dict(task)
            task['pinned'] = new_status
            return jsonify(task)
        
        return jsonify({'error': 'Task not found'}), 404
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
