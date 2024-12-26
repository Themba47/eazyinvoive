import requests
from core.utils import * 
from allauth.account.forms import SignupForm
from django import forms

class CustomSignupForm(SignupForm):
   
   try:
      countries = requests.get('https://restcountries.com/v2/all')
      if countries.status_code == 200:
         json_data = countries.json()
         COUNTRIES = [(country['name'], country['name']) for country in json_data]
   except Exception as e:
      COUNTRIES = ''
      
   
   first_name = forms.CharField(max_length=30, label='First Name', widget=forms.TextInput(attrs={'placeholder': 'First Name', 'pattern': '[A-Za-z]+'}))
   last_name = forms.CharField(max_length=30, label='Last Name', widget=forms.TextInput(attrs={'placeholder': 'Last Name', 'pattern': '[A-Za-z]+'}))
   Country = forms.CharField(widget=forms.Select(attrs={'id': 'country-select', 'style': 'width:75%'}, choices=COUNTRIES), required=False)
   
   def __init__(self, *args, **kwargs):
	   super(CustomSignupForm, self).__init__( *args, **kwargs)
    
   
   def save(self, request):
      user = super(CustomSignupForm, self).save(request)
      user.Country = self.cleaned_data['Country']
      # user.user_code = f'{user.id}{generate_hex_code(user.first_name)}'
      user.save()
      return user

class UpdateProfile(forms.Form):
   first_name = forms.CharField(max_length=30, label='First Name', required=False, widget=forms.TextInput(attrs={'placeholder': 'First Name', 'pattern': '[A-Za-z]+'}))
   last_name = forms.CharField(max_length=30, label='Last Name', required=False, widget=forms.TextInput(attrs={'placeholder': 'First Name', 'pattern': '[A-Za-z]+'}))
   Country = forms.CharField(max_length=250, label='Country', required=False)
   # profile_picture = forms.FileField()
   