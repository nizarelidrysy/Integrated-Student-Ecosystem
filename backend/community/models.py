from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Offer(models.Model):
    OFFER_TYPES = (
        ('Internship', 'Internship'),
        ('PFA', 'PFA'),
        ('PFE', 'PFE'),
    )
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    description = models.TextField()
    offer_type = models.CharField(max_length=50, choices=OFFER_TYPES)
    location = models.CharField(max_length=500, blank=True, null=True, help_text="Location text or Google Maps URL")
    date_posted = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_offers')

    def __str__(self):
        return f"{self.offer_type} - {self.title}"

class Material(models.Model):
    MATERIAL_TYPES = (
        ('CV', 'CV Template'),
        ('CoverLetter', 'Cover Letter Template'),
        ('Other', 'Other'),
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    material_type = models.CharField(max_length=50, choices=MATERIAL_TYPES)
    file_url = models.URLField(blank=True, null=True) # Assuming a simple URL for now, could be FileField if dealing with media uploads
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"From {self.sender.username} to {self.receiver.username}"

class CampusAnnouncement(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    date_posted = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_announcements')

    def __str__(self):
        return self.title
