from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class Task(models.Model):
    COLUMN_CHOICES = [
        ('backlog', 'Backlog'),
        ('todo', 'To-Do'),
        ('in_progress', 'In Progress'),
        ('review', 'Review/Testing'),
        ('done', 'Done'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    column = models.CharField(max_length=20, choices=COLUMN_CHOICES, default='backlog')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    priority = models.CharField(
        max_length=10,
        choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')],
        default='medium'
    )
    assignee = models.CharField(max_length=100, blank=True)
    detailed_information = models.TextField(blank=True, help_text="Detailed information only visible in task details")
    
    class Meta:
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return self.title
