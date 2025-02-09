from rest_framework import serializers
from .models import Address, BillTo, Company, Job, InvoiceTemplate, GeneratedInvoice, UserDetails
from django.contrib.auth import get_user_model

User = get_user_model()

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            'company_id',
            'street',
            'complex_apartment',
            'city',
            'province',
            'postal_code',
            'country',
            'address_type',
        ]


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            'id',  # Include the primary key
            'company_name', 'company_code', 'company_type', 'reg_number',
            'tax_number', 'contact_number', 'contact_email', 'logo',
            'other_vital_info', 'details', 'user_id', 'date_updated', 'date_created', 'Active'
        ]
        read_only_fields = ['id', 'company_code', 'Active', 'date_created', 'date_updated']
        
    # Custom validation for company_type field to handle 'Freelancer' and 'Informal' scenarios
    def validate(self, data):
        company_type = data.get('company_type')
        if company_type in ['Freelancer', 'Informal']:
            # If company is Freelancer or Informal, make reg_number optional
            if data.get('reg_number'):
                raise serializers.ValidationError("Registration number should not be provided for Freelancer or Informal companies.")
        return data
    
 
class TaxCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['calculate_tax']  # Include only the `calculate_tax` field
    

class CompanyLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['logo']  # Include only the `logo` field
        
        
class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id', 'job_name', 'user_id','description','price','job_type']
        read_only_fields = ['id']
        
        
class BillToSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillTo
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
        
        
class GeneratedInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedInvoice
        fields = '__all__'
        read_only_fields = ('created_at')
        

class InvoiceTemplateSerializer(serializers.ModelSerializer):
   client = BillToSerializer()
   class Meta:
       model = InvoiceTemplate
       fields = ['id', 'user', 'name', 'client', 'items', 'status', 
                'Active', 'date_updated', 'date_created']
       read_only_fields = ['Active', 'date_updated', 'date_created'] 
       

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]

class UserDetailsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserDetails
        fields = "__all__"    

