import logging

from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import render, get_object_or_404
from dj_rest_auth.views import LoginView, LogoutView
from dj_rest_auth.registration.views import RegisterView

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from .models import Company
from .serializers import CompanySerializer

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

def csrf_token_view(request):
   token = get_token(request)
   return JsonResponse({'csrfToken': token})


class CustomRegisterView(RegisterView):
    def create(self, request, *args, **kwargs):
        try:
            # Call the parent's create method to handle registration
            response = super().create(request, *args, **kwargs)

            # Get the registered user
            user = self.get_user()

            # Modify the response to include additional fields
            custom_response = {
                'key': response.data.get('key'),  # Authentication key
                'user_id': user.id,              # User ID
                'email': user.email,             # User email
                'first_name': user.first_name,   # User first name
                'last_name': user.last_name,     # User last name
            }

            logging.info(f"Custom Response: {custom_response}")
            return Response(custom_response, status=response.status_code)

        except Exception as e:
            logging.error(f"Error during registration: {e}")
            return Response({'error': 'An error occurred during registration.'}, status=500)
         
         

class CustomLoginView(LoginView):
    def get_response(self):
        logging.info("-------- WE LOGGING IN ----------")
        original_response = super().get_response()
        user = self.user
        
        # Add custom fields to the response
        custom_data = {
            'key': original_response.data['key'],
            'user_id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        }
        return Response(custom_data)
     
     
class CustomLogoutView(LogoutView):
    def logout(self, request):
        try:
            # Call the parent's logout method
            response = super().logout(request)

            # Add any custom actions here, e.g., logging or custom response data
            logging.info(f"User {request.user} has logged out successfully.")

            # Customize the response
            return Response({'message': 'Logged out successfully!'}, status=200)

        except Exception as e:
            logging.error(f"Error during logout: {e}")
            return Response({'error': 'An error occurred during logout.'}, status=500)
         
         
class CompanyView(APIView):
    
    def get(self, request, company_id=None, *args, **kwargs):
        # If company_id is provided, fetch the specific company
        if company_id:
            company = get_object_or_404(Company, pk=company_id)
            serializer = CompanySerializer(company)
            return Response(serializer.data)
        
        # If no company_id is provided, fetch all companies (optional)
        companies = Company.objects.all()
        serializer = CompanySerializer(companies, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        # Handle the creation of a new company
        try:
           serializer = CompanySerializer(data=request.data)
           if serializer.is_valid():
              company = serializer.save(user_id=request.user)
              response_serializer = CompanySerializer(company)
              return Response(response_serializer.data, status=status.HTTP_201_CREATED)
           return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
           logging.error(f'Error: {e}')
