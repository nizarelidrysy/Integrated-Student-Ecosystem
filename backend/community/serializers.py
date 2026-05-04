from rest_framework import serializers
from .models import Offer, Material, Message, CampusAnnouncement
from accounts.serializers import UserSerializer

class OfferSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Offer
        fields = '__all__'

class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    sender_id = serializers.IntegerField(write_only=True, required=False)
    receiver_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Message
        fields = '__all__'
        extra_kwargs = {'receiver': {'read_only': True}}

    def create(self, validated_data):
        receiver_id = validated_data.pop('receiver_id')
        sender_id = validated_data.pop('sender_id', None)
        
        # Manually create the message to ensure IDs are set correctly
        message = Message.objects.create(
            receiver_id=receiver_id,
            sender_id=sender_id,
            content=validated_data.get('content', '')
        )
        return message

class CampusAnnouncementSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = CampusAnnouncement
        fields = '__all__'
