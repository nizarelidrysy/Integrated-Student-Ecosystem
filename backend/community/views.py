from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Offer, Material, Message, CampusAnnouncement
from .serializers import OfferSerializer, MaterialSerializer, MessageSerializer, CampusAnnouncementSerializer
from .utils import analyze_cv_text
from django.db.models import Q

class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all().order_by('-date_posted')
    serializer_class = OfferSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all().order_by('-date_added')
    serializer_class = MaterialSerializer

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    
    def get_queryset(self):
        # In demo mode, return all messages
        return Message.objects.all().order_by('timestamp')

    def perform_create(self, serializer):
        # Allow passing sender_id explicitly for demo mode
        sender_id = self.request.data.get('sender_id')
        if sender_id:
            serializer.save(sender_id=sender_id)
        else:
            # Fallback to logged-in user if exists
            user = self.request.user if self.request.user.is_authenticated else None
            serializer.save(sender=user)

class CampusAnnouncementViewSet(viewsets.ModelViewSet):
    queryset = CampusAnnouncement.objects.all().order_by('-date_posted')
    serializer_class = CampusAnnouncementSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

import fitz  # PyMuPDF
import io

@api_view(['POST'])
@permission_classes([permissions.AllowAny])  # Allowing any for demo purposes
def cv_analyze(request):
    text = request.data.get('text', '')
    
    if 'file' in request.FILES:
        pdf_file = request.FILES['file']
        try:
            # Read into fitz
            doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
            extracted_text = ""
            for page in doc:
                extracted_text += page.get_text("text") + "\n"
            text = extracted_text
        except Exception as e:
            return Response({'error': f'Failed to parse PDF: {str(e)}'}, status=400)

    if not text.strip():
        return Response({'error': 'No text or file provided.'}, status=400)
        
    result = analyze_cv_text(text)
    return Response(result)
