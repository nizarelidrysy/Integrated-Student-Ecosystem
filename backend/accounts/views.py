from rest_framework import viewsets
from .models import CustomUser
from .serializers import UserSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['get'])
    def demo_users(self, request):
        students = CustomUser.objects.filter(role='student')
        teachers = CustomUser.objects.filter(role='teacher')
        admins = CustomUser.objects.filter(role='admin')
        
        return Response({
            'student': UserSerializer(students.first()).data if students.exists() else None,
            'teacher': UserSerializer(teachers.first()).data if teachers.exists() else None,
            'admin': UserSerializer(admins.first()).data if admins.exists() else None,
        })
