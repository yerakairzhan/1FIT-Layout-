# serializers.py

from rest_framework import serializers
from .models import Gym, Category, Booking, Posts

class GymSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field='name', queryset=Category.objects.all())

    class Meta:
        model = Gym
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'


class PostsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

class PostsCustomSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=255)
    user = serializers.CharField(max_length=255)
    content = serializers.CharField()

    def create(self, validated_data):
        return Posts.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.user = validated_data.get('user', instance.user)
        instance.content = validated_data.get('content', instance.content)
        instance.save()
        return instance

