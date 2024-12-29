from rest_framework import serializers
from .models import Company

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            'company_name', 'company_code', 'company_type', 'reg_number',
            'tax_number', 'contact_number', 'contact_email', 'logo',
            'other_vital_info', 'details', 'user_id', 'date_updated', 'date_created', 'Active'
        ]
        
    # Custom validation for company_type field to handle 'Freelancer' and 'Informal' scenarios
    def validate(self, data):
        company_type = data.get('company_type')
        if company_type in ['Freelancer', 'Informal']:
            # If company is Freelancer or Informal, make reg_number optional
            if data.get('reg_number'):
                raise serializers.ValidationError("Registration number should not be provided for Freelancer or Informal companies.")
        return data
