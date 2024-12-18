from django.db import models

class Task(models.Model):
    id = models.TextField(primary_key=True)
    device_id = models.TextField()
    title = models.TextField()
    description = models.TextField(null=True, blank=True)
    completed = models.BooleanField(default=False)
    pinned = models.BooleanField(default=False)

    class Meta:
        unique_together = ('id', 'device_id')