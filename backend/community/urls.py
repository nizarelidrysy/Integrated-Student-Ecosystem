from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OfferViewSet, MaterialViewSet, MessageViewSet, CampusAnnouncementViewSet, cv_analyze

router = DefaultRouter()
router.register(r'offers', OfferViewSet)
router.register(r'materials', MaterialViewSet)
router.register(r'messages', MessageViewSet, basename='message')
router.register(r'announcements', CampusAnnouncementViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('cv_analyze/', cv_analyze, name='cv_analyze'),
]
