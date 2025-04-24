from django.shortcuts import render

# Create your views here.
# views.py
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Gym, Category, Booking, Posts
from .serializers import GymSerializer, CategorySerializer, BookingSerializer, PostsSerializer
from django.shortcuts import get_object_or_404

# CBV
class GymViewSet(APIView):
    # queryset = Gym.objects.all()
    # serializer_class = GymSerializer

    # get gym by id 
    def get(self, request, id=None):
        if id:
            gym = get_object_or_404(Gym, id=id)
            serializer = GymSerializer(gym)
        else:
            gym = Gym.objects.all()
            serializer = GymSerializer(gym, many=True)
        return Response(serializer.data)
    
    # create gym 
    def post(self, request):
        serializer = GymSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    # update gym by id 
    def put(self, request, id):
        gym = get_object_or_404(Gym, id=id)
        serializer = GymSerializer(gym, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    # delete gym by id
    def delete(self, request, id):
        gym = get_object_or_404(Gym, id=id)
        gym.delete()
        return Response(status=204)

class BookingViewSet(APIView):
    # queryset = Booking.objects.all()
    # serializer_class = BookingSerializer

    def get(self, request, id=None):
        if id:
            booking = get_object_or_404(Booking, id=id)
            serializer = BookingSerializer(booking)
        else:
            booking = Booking.objects.all()
            serializer = BookingSerializer(booking, many=True)
        return Response(serializer.data)

class CategoryViewSet(APIView):
    def get(self, request, id=None):
        if id:
            category = get_object_or_404(Category, id=id)
            serializer = CategorySerializer(category)
        else:
            category = Category.objects.all()
            serializer = CategorySerializer(category, many=True)
        return Response(serializer.data)

# FBV
@api_view(['GET', 'POST'])
def list_categories(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
@api_view(['GET', 'POST'])
def list_posts(request):
    if request.method == 'GET':
        posts = Posts.objects.all()
        serializer = PostsSerializer(posts, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = PostsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
@api_view(['GET', 'POST'])
def list_gyms(request):
    if request.method == 'GET':
        gyms = Gym.objects.all()
        serializer = GymSerializer(gyms, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = GymSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def gym_detail_crud(request, id):
    try:
        gym = Gym.objects.get(id=id)
    except Gym.DoesNotExist:

        return Response({'error': 'Gym not found'}, status=404)
    
    if request.method == 'GET':
        gym = Gym.objects.all()
        serializer = GymSerializer(gym, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = GymSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    elif request.method == 'PUT':
        serializer = GymSerializer(gym, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    elif request.method == 'DELETE':
        gym.delete()
        return Response(status=204)

