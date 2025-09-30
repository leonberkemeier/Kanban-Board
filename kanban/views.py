from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import Task
from .serializers import TaskSerializer, TaskUpdateSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    
    def get_queryset(self):
        queryset = Task.objects.all()
        column = self.request.query_params.get('column', None)
        if column is not None:
            queryset = queryset.filter(column=column)
        return queryset.order_by('order', 'created_at')
    
    @action(detail=False, methods=['post'])
    def update_positions(self, request):
        """Update multiple task positions at once for drag and drop"""
        tasks_data = request.data.get('tasks', [])
        
        try:
            with transaction.atomic():
                for task_data in tasks_data:
                    task_id = task_data.get('id')
                    column = task_data.get('column')
                    order = task_data.get('order')
                    
                    if task_id and column is not None and order is not None:
                        Task.objects.filter(id=task_id).update(
                            column=column,
                            order=order
                        )
            
            return Response({'status': 'success'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
