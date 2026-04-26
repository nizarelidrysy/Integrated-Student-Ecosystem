from rest_framework import serializers
from .models import CalendarEvent, Notification, ReportCard, Grade, Absence, DocumentRequest
from accounts.serializers import UserSerializer

class CalendarEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarEvent
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = '__all__'

class ReportCardSerializer(serializers.ModelSerializer):
    grades = GradeSerializer(many=True, read_only=True)
    
    class Meta:
        model = ReportCard
        fields = '__all__'

class AbsenceSerializer(serializers.ModelSerializer):
    student_details = UserSerializer(source='student', read_only=True)
    
    class Meta:
        model = Absence
        fields = '__all__'

class DocumentRequestSerializer(serializers.ModelSerializer):
    student_details = UserSerializer(source='student', read_only=True)

    class Meta:
        model = DocumentRequest
        fields = '__all__'
