import hashlib
import random
from django.db import models

from core.utils import * 

from django.contrib.auth import get_user_model
User = get_user_model()

class Company(models.Model):
   # attr
   COMPANY_TYPES = [
        ('Registered', 'Registered'),
        ('Freelancer', 'Freelancer'),
        ('Informal', 'Informal'),
        ('Other', 'Other'),
    ]
   
   company_name = models.CharField(max_length = 500, blank=True, null=True, default=None, help_text='', unique=True)
   company_code = models.CharField(max_length = 6, help_text='ABC123', unique=True, verbose_name='Code')
   company_type = models.CharField(max_length=10, choices=COMPANY_TYPES, default='Other')
   reg_number = models.CharField(max_length = 100, blank=True, null=True, default=None, help_text='')
   tax_number = models.CharField(max_length = 100, blank=True, null=True, default=None, help_text='', unique=True)
   contact_number = models.CharField(max_length = 100, blank=True, null=True, default=None, help_text='', unique=True)
   contact_email = models.CharField(max_length = 100, blank=True, null=True, default=None, help_text='', unique=True)
   country_of_operation = models.CharField(max_length = 100, blank=True, null=True, default=None, help_text='')
   industry = models.CharField(max_length = 100, blank=True, null=True, default=None, help_text='')
   logo = models.FileField(upload_to=settings.COMPANY_LOGO, blank=True, null=True)
   other_vital_info = models.JSONField(blank=True, null=True)
   details = models.TextField(blank = True, null=True, help_text='')
   user_id = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='User')
   date_updated = models.DateTimeField(auto_now=True, editable=False, verbose_name="Date updated")
   date_created = models.DateTimeField(auto_now_add=True, editable=False, verbose_name="Date created")
   calculate_tax = models.BooleanField(default=False)
   Active = models.BooleanField(default=True)
   
   class Meta:
      verbose_name = 'Company'
   
   def __str__(self):
      return f"{self.company_name}"
   
   def save(self, *args, **kwargs):
      if not self.company_code:
         code_exists = True
         while code_exists:
            cc = self.generate_code(self.company_name)
            if self.try_client_code(cc):
               code_exists = False
               self.company_code = cc
      super(Company,self).save(*args,**kwargs)
      
   

   def generate_code(self, mystring):
    # Convert the string to bytes, then convert each byte to a hex representation
    random_number = f"{round(random.random() * 100):02}"
    arr = mystring.split(" ")
    if len(arr) == 1:
      return f'{mystring[:2]}{random_number}'
    elif len(mystring) >= 2:
       return f'{mystring[0][:1]}{mystring[1][:1]}{random_number}'
    else:
       return
   

   
   @staticmethod
   def try_client_code(string):
      q = Company.objects.filter(company_code=string)
      if q.count() > 0:
         return False
      else:
         return True
      
   def logo_url(self):
      if self.logo:
         return f'{settings.SITE_DOMAIN}{settings.MEDIA_URL}{settings.COMPANY_LOGO}/{self.logo.path.split("/")[-1]}'
      return
      
