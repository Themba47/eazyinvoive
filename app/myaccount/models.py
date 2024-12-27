import datetime
from django.contrib import admin
from django.contrib.auth.models import AbstractUser
from django.db import models
from core.utils import check_30_days


class CustomUser(AbstractUser):
   
   Country = models.CharField(null=True, blank=True, verbose_name='country', max_length=255)	# type: ignore
   Free_tokens = models.IntegerField(default=1)
   user_code = models.CharField(null=True, blank=True, verbose_name='user code', max_length=255)
   date_paid = models.DateTimeField(editable=True, null=True, blank=True, verbose_name="The date they paid")

   
   class Meta:
      db_table = 'auth_user'
      verbose_name = 'User'
      verbose_name_plural = 'Users'
      
   def __str__(self):
      if len(self.first_name) > 0 and len(self.last_name) > 0:
          return f"{self.first_name} {self.last_name}"
      else:
         return self.email      
      
   def get_user(self):
      try:
         return f"{self.AbstractUser.first_name} {self.AbstractUser.last_name}"
      except:
         return None
      
   def get_free_tokens(self):
      return self.Free_tokens
   

   def minus_free_token(self):
      if self.Free_tokens > 0:
         self.Free_tokens -= 1
         self.save()
      return self.Free_tokens
   
   def minus_token(self, emails):
      if self.Free_tokens > 0:
         self.Free_tokens -= emails
      if self.Free_tokens < 0:
         self.Free_tokens = 0
      self.save()
      return self.Free_tokens
   

class CustomUserAdmin(admin.ModelAdmin):
    #list
	list_display = ['__str__','username','is_staff','last_login','date_joined']
	# search_fields = [
	# 	'package',
   #    # 'last_login_longer_than_30_days',
	# ]
	# list_filter = ['Project','Language']
      

	

   
