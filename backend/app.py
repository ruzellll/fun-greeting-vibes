from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__, static_folder='../dist')
CORS(app)

@app.route('/api/tasks', methods=['GET', 'POST'])
def handle_tasks():
    if request.method == 'GET':
        return jsonify({"message": "Tasks retrieved successfully"})
    elif request.method == 'POST':
        return jsonify({"message": "Task added successfully"})

@app.route('/api/tasks/<task_id>', methods=['PUT', 'DELETE'])
def handle_task(task_id):
    if request.method == 'PUT':
        return jsonify({"message": "Task updated successfully"})
    elif request.method == 'DELETE':
        return jsonify({"message": "Task deleted successfully"})

# Serve static files from the dist folder
@app.route('/')
def serve():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True)