import base64
import logging

from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import render, get_object_or_404
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from dj_rest_auth.views import LoginView, LogoutView
from dj_rest_auth.registration.views import RegisterView

from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Address, BillTo, Company, Job, InvoiceTemplate, Signature, UserDetails
from .serializers import AddressSerializer, BillToSerializer, CompanySerializer, CompanyLogoSerializer, JobSerializer, InvoiceTemplate, GeneratedInvoiceSerializer, InvoiceTemplateSerializer, TaxCompanySerializer, UserDetailsSerializer

User = get_user_model()
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

def csrf_token_view(request):
   token = get_token(request)
   return JsonResponse({'csrfToken': token})


class CustomRegisterView(RegisterView):
    def create(self, request, *args, **kwargs):
        try:
            # Call the parent's create method to handle registration
            response = super().create(request, *args, **kwargs)
            logging.info(f"EISH>> {response.data}")
            # Get the registered user
            # for item in dir(self):
            #     attr = getattr(self, item)
            #     logging.info(f"{item}: {type(attr)}")
                
            user = response.data['user']
            logging.info(f"USER: {user.get('access')}")
            # Modify the response to include additional fields
            custom_response = {
                'key': response.data.get('access'),  # Authentication key
                'user_id': str(user.get('pk')),              # User ID
                'email': user.get('email'),             # User email
                'first_name': user.get('first_name'),   # User first name
                'last_name': user.get('last_name')     # User last name
            }
            
            userdetails = UserDetails.objects.create(user=get_object_or_404(User, pk=user.get('pk')))
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
            logging.info(original_response.data)
            user = original_response.data['user']
            
            company = Company.objects.filter(user_id=user.get('pk')).first()
            if company:
                company_id = company.id
            
            # Add custom fields to the response
            custom_data = {
                'key': original_response.data['access'],
                'user_id': str(user.get('pk')),
                'email': user.get('email'), 
                'company_id': company_id,
                'first_name': user.get('first_name'),
                'last_name': user.get('last_name')
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
   def delete(self, request, pk=None):
        try:
            job = Job.objects.get(pk=pk)
            job.delete()
            logging.info(f"++++++++++++++++ Job deleted successfully ++++++++++++++++")
            return Response({"message": "Job deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Job.DoesNotExist:
            return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND) 
    
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
  
  

class BillToView(APIView):
    serializer_class = BillToSerializer
    permission_classes = [IsAuthenticated]
    
    def get(self, request, user_id=None):
        try:      
         billto = BillTo.objects.filter(user_id=user_id)
         logging.info(billto)
         serializer = self.serializer_class(billto, many=True)
         
         data = {
            'message': 'LETS GET THE BAG!!!',
            'myjobs': serializer.data,
         }
         
         return Response(data=data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logging.error(f'Error: {e}')
    
    def post(self, request, user_id=None):
        user_id = user_id
        logging.info(f"<----------- WE IN BILL TO {request.user} ---------->")
        serializer = self.serializer_class(data=request.data)
        print(serializer.is_valid())
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            logging.error(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class InvoiceTemplateView(APIView):
   def get(self, request, invoiceId=None):
       if invoiceId:
           invoice = InvoiceTemplate.objects.filter(user=request.user, pk=invoiceId)
           serializer = InvoiceTemplateSerializer(invoice , many=True)
       else:
            invoices = InvoiceTemplate.objects.filter(user=request.user)
            serializer = InvoiceTemplateSerializer(invoices, many=True)
       data = {
            'message': 'LETS GET THE BAG!!!',
            'myjobs': serializer.data,
         }
       return Response(data)

   def post(self, request):
       serializer = InvoiceTemplateSerializer(data=request.data)
       if serializer.is_valid():
           serializer.save(user=request.user)
        #    if request.data.get('status') != 'QUOTE':
        #        print(serializer.data['id'])
        #        userdetails = get_object_or_404(UserDetails, user_id=request.user)
        #        userdetails.updateCount()
        #        logging.info(serializer.data)
            #    GeneratedInvoiceSerializer()
           return Response(serializer.data, status=201)
       return Response(serializer.errors, status=400)
   
   
   def delete(self, request, pk=None):
        try:
            invoice_template = InvoiceTemplate.objects.get(pk=pk)
            invoice_template.Active = False
            invoice_template.save()
            logging.info(f"++++++++++++++++ Invoice deleted successfully ++++++++++++++++")
            return Response({"message": "Invoice deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Job.DoesNotExist:
            return Response({"error": "Invoice not found"}, status=status.HTTP_404_NOT_FOUND)
        
        
class UserDetailsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve the authenticated user's details"""
        logging.info(f"++++++++++++++++ {request.user} ++++++++++++++++")
        try:
            user_details = UserDetails.objects.get(user=request.user)
            logging.info(f">>>> {user_details} <<<<<")
            serializer = UserDetailsSerializer(user_details)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist as e:
            logging.error(e)
            return Response({"error": "User details not found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        """Increment invoices_generated for the user"""
        try:
            user_details = UserDetails.objects.get(user=request.user)
            new_count = user_details.updateCount()
            return Response({"invoices_generated": new_count}, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            return Response({"error": "User details not found"}, status=status.HTTP_404_NOT_FOUND)
        
        

class UploadSignature(APIView):
    
    def get(self, request):
        try:
            signature = Signature.objects.get(user=request.user)
            signature_url = request.build_absolute_uri(signature.signature.url)
            return Response({"signature": signature_url}, status=200)
        except Signature.DoesNotExist:
            return Response({"signature": None}, status=200)
    
    def post(self, request):
        try:
            data = request.data.get("signature")  # Get Base64 string
            if not data:
                return Response({"error": "No signature data provided"}, status=400)

            # Decode and save as an image
            format, imgstr = data.split(";base64,")  # Extract base64 format
            ext = format.split("/")[-1]  # Extract file extension (e.g., png)

            signature_file = ContentFile(base64.b64decode(imgstr), name=f"signature_{request.user.id}.{ext}")
            
            # Save to a model (optional)
            Signature.objects.create(user=request.user, signature=signature_file)
            logging.info(f"{'<' * 20} Signature Saved {'>' * 20}")
            return Response({"message": "Signature uploaded successfully!"})
        except Exception as e:
            logging.error(f"Error: {e}")

