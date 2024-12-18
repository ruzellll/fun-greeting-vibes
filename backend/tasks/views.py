from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Task

@csrf_exempt
def tasks_list(request):
    device_id = request.headers.get('X-Device-ID')
    if not device_id:
        return JsonResponse({'error': 'Device ID is required'}, status=400)

    if request.method == 'GET':
        tasks = Task.objects.filter(device_id=device_id)
        return JsonResponse(list(tasks.values()), safe=False)

    elif request.method == 'POST':
        data = json.loads(request.body)
        task = Task.objects.create(
            id=data['id'],
            device_id=device_id,
            title=data['title'],
            description=data['description'],
            completed=data['completed'],
            pinned=data.get('pinned', False)
        )
        return JsonResponse(data, status=201)

    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def task_detail(request, task_id):
    device_id = request.headers.get('X-Device-ID')
    if not device_id:
        return JsonResponse({'error': 'Device ID is required'}, status=400)

    try:
        task = Task.objects.get(id=task_id, device_id=device_id)
    except Task.DoesNotExist:
        return JsonResponse({'error': 'Task not found'}, status=404)

    if request.method == 'PUT':
        data = json.loads(request.body)
        task.title = data['title']
        task.description = data['description']
        task.completed = data['completed']
        task.pinned = data.get('pinned', False)
        task.save()
        return JsonResponse(data)

    elif request.method == 'DELETE':
        task.delete()
        return JsonResponse({}, status=204)

    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def toggle_task(request, task_id):
    if request.method != 'PUT':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    device_id = request.headers.get('X-Device-ID')
    if not device_id:
        return JsonResponse({'error': 'Device ID is required'}, status=400)

    try:
        task = Task.objects.get(id=task_id, device_id=device_id)
        task.completed = not task.completed
        task.save()
        return JsonResponse({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'completed': task.completed,
            'pinned': task.pinned
        })
    except Task.DoesNotExist:
        return JsonResponse({'error': 'Task not found'}, status=404)

@csrf_exempt
def pin_task(request, task_id):
    if request.method != 'PUT':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    device_id = request.headers.get('X-Device-ID')
    if not device_id:
        return JsonResponse({'error': 'Device ID is required'}, status=400)

    try:
        task = Task.objects.get(id=task_id, device_id=device_id)
        task.pinned = not task.pinned
        task.save()
        return JsonResponse({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'completed': task.completed,
            'pinned': task.pinned
        })
    except Task.DoesNotExist:
        return JsonResponse({'error': 'Task not found'}, status=404)