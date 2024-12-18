# Django Backend Setup

1. First, create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

2. Install the requirements:
```bash
pip install -r requirements.txt
```

3. Run the migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

4. Start the development server:
```bash
python manage.py runserver
```

The server will start at http://127.0.0.1:8000/

## API Endpoints

- GET/POST /api/tasks - List or create tasks
- GET/PUT/DELETE /api/tasks/<task_id> - Retrieve, update or delete a task
- PUT /api/tasks/<task_id>/toggle - Toggle task completion
- PUT /api/tasks/<task_id>/pin - Toggle task pin status

All endpoints require the X-Device-ID header for device-specific task management.