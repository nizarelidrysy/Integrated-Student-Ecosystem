from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CalendarEventViewSet, NotificationViewSet, ReportCardViewSet, GradeViewSet, AbsenceViewSet, DocumentRequestViewSet

router = DefaultRouter()
router.register(r'calendar', CalendarEventViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'report-cards', ReportCardViewSet)
router.register(r'grades', GradeViewSet)
router.register(r'absences', AbsenceViewSet)
router.register(r'document-requests', DocumentRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
