from django.urls import path
from . import views

urlpatterns = [
    path('tasks', views.tasks_list, name='tasks_list'),
    path('tasks/<str:task_id>', views.task_detail, name='task_detail'),
    path('tasks/<str:task_id>/toggle', views.toggle_task, name='toggle_task'),
    path('tasks/<str:task_id>/pin', views.pin_task, name='pin_task'),
]