from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers

class CustomRegisterSerializer(RegisterSerializer):
    # Add the additional fields from your CustomSignupForm
    first_name = serializers.CharField(max_length=30, required=False)
    last_name = serializers.CharField(max_length=30, required=False)
    Country = serializers.CharField(max_length=30, required=False)
    
    def get_cleaned_data(self):
        # Get the default cleaned data from RegisterSerializer
        data = super().get_cleaned_data()
        
        # Add our custom fields
        data.update({
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'Country': self.validated_data.get('Country', ''),
        })
        print(data)
        return data

    def save(self, request):
        try:
            # Call the parent class's save method
            user = super().save(request)
            
            # Debug: Check if the user object is created
            print("USER CREATED:", user)
            
            # Set additional fields
            user.first_name = self.cleaned_data.get('first_name', '')
            user.last_name = self.cleaned_data.get('last_name', '')
            user.Country = self.cleaned_data.get('Country', '')

            # Save the user
            user.save()
            
            # Debug: Confirm user save
            print("USER SAVED SUCCESSFULLY:", user)
            
            return user
        except Exception as e:
            # Debug: Print the exception
            print("ERROR IN SAVE METHOD:", str(e))
            raise e