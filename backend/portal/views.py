from rest_framework import viewsets
from .models import CalendarEvent, Notification, ReportCard, Grade, Absence, DocumentRequest
from .serializers import CalendarEventSerializer, NotificationSerializer, ReportCardSerializer, GradeSerializer, AbsenceSerializer, DocumentRequestSerializer

class CalendarEventViewSet(viewsets.ModelViewSet):
    queryset = CalendarEvent.objects.all().order_by('start_time')
    serializer_class = CalendarEventSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by('-date_envoi')
    serializer_class = NotificationSerializer

class ReportCardViewSet(viewsets.ModelViewSet):
    queryset = ReportCard.objects.all()
    serializer_class = ReportCardSerializer

class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer

class AbsenceViewSet(viewsets.ModelViewSet):
    queryset = Absence.objects.all().order_by('-date_seance')
    serializer_class = AbsenceSerializer

class DocumentRequestViewSet(viewsets.ModelViewSet):
    queryset = DocumentRequest.objects.all().order_by('-created_at')
    serializer_class = DocumentRequestSerializer
