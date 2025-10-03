from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'column', 'order', 'created_at', 
                 'updated_at', 'priority', 'assignee', 'detailed_information', 'owner_username']
        read_only_fields = ['created_at', 'updated_at', 'owner_username']

class TaskUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating task position and column"""
    class Meta:
        model = Task
        fields = ['id', 'column', 'order']