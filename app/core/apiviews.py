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
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Address, Company, Job
from .serializers import AddressSerializer, CompanySerializer, CompanyLogoSerializer, JobSerializer, TaxCompanySerializer

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
        try:
            logging.info("-------- WE LOGGING IN ----------")
            original_response = super().get_response()
            company_id = None
            user = self.user
            
            company = Company.objects.filter(user_id=user.id).first()
            if company:
                company_id = company.id
            
            # Add custom fields to the response
            custom_data = {
                'key': original_response.data['key'],
                'user_id': user.id,
                'email': user.email,
                'company_id': company_id,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
            return Response(custom_data)
        except Exception as e:
            logging.error(f"Error during registration: {e}")
            return Response({'error': 'An error occurred during registration.'}, status=status.HTTP_400_BAD_REQUEST)
     
     
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
           

class TaxCompanyView(APIView):
    
    def post(self, request, *args, **kwargs):
        company_id = request.data.get('company_id')  # Expecting `company_id` in the request payload
        try:
            if not company_id:
                return Response({"error": "company_id is required."}, status=status.HTTP_400_BAD_REQUEST)

            # Fetch the company instance
            company = get_object_or_404(Company, id=company_id)
            
            # Pass the instance to the serializer for update
            serializer = TaxCompanySerializer(company, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                logging.info({"message": "Tax uploaded successfully.", "calculate_tax": serializer.data['calculate_tax']})
                return Response({"message": "Tax uploaded successfully.", "calculate_tax": serializer.data['calculate_tax']}, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(f'Error: {e}')
           
           
class UploadLogo(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        company_id = request.data.get('company_id')  # Expecting `company_id` in the request payload
        try:
            logging.info(f"_______ | {company_id} | __________")
            if not company_id:
                return Response({"error": "company_id is required."}, status=status.HTTP_400_BAD_REQUEST)

            # Fetch the company instance
            company = get_object_or_404(Company, id=company_id)
            
            # Pass the instance to the serializer for update
            serializer = CompanyLogoSerializer(company, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Logo uploaded successfully.", "logo_url": serializer.data['logo']}, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(f'Error: {e}')
            
            
class AddressAPIView(APIView):
    serializer_class = AddressSerializer

    def get(self, request):
        company_id = request.query_params.get('company_id')
        if not company_id:
            return Response({'error': 'company_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        addresses = Address.objects.filter(company_id=company_id)
        serializer = self.serializer_class(addresses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        company_id = request.data.get('company_id')
        if not company_id:
            return Response({'error': 'company_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddJobAPIView(APIView):
    serializer_class = JobSerializer
    def post(self, request):
        user_id = request.data.get('user_id')
        logging.info(f"<----------- WE IN ADD SERVICE {user_id} ---------->")
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    

class JobsAPIView(APIView):
   def get(self, request, user_id=None, *args, **kwargs):
      
      try:      
         jobs = Job.objects.filter(user_id=user_id)
         
         serializer = JobSerializer(jobs, many=True)
         
         data = {
            'message': 'LETS GET THE BAG!!!',
            'myjobs': serializer.data,
         }
         
         return Response(data=data, status=status.HTTP_201_CREATED)
      except Exception as e:
            logging.error(f'Error: {e}')
        
   def post(self, request, *args, **kwargs):
      pass
