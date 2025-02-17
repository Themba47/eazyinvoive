import logging

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.contrib.auth import get_user_model
from django.shortcuts import render, get_object_or_404
from dj_rest_auth.views import LoginView, LogoutView
from dj_rest_auth.registration.views import RegisterView, SocialLoginView

from rest_framework import status, viewsets, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Address, Company
from .serializers import AddressSerializer, CompanySerializer, UserUpdateSerializer, UserSerializer

User = get_user_model()

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

        
        
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    # http_method_names = ['get', 'patch', 'put', 'post', 'delete']

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return super().get_serializer_class()
    
    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)
    
    def create(self, request, *args, **kwargs):
        """Override POST to allow user updates"""
        user = request.user
        serializer = self.get_serializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
         
         
class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    http_method_names = ['get', 'post', 'patch', 'delete']
    
    def get_queryset(self):
        # Optionally, filter companies based on the logged-in user
        user = self.request.user
        return Company.objects.filter(user_id=user.id)

class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']

# class GamesPlayedViewSet(viewsets.ModelViewSet):
#     queryset = GamesPlayed.objects.all()
#     serializer_class = GamesPlayedSerializer
    

# class FeedbackViewSet(viewsets.ModelViewSet):
#     serializer_class = FeedbackSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         """Allow users to see only their own feedback."""
#         return Feedback.objects.filter(user=self.request.user)

#     def perform_create(self, serializer):
#         """Attach the logged-in user when creating feedback."""
#         serializer.save(user=self.request.user)

    
