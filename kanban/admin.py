from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'column', 'priority', 'assignee', 'created_at']
    list_filter = ['column', 'priority', 'created_at']
    search_fields = ['title', 'description', 'assignee']
    ordering = ['column', 'order', 'created_at']
