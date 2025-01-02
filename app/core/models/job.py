import hashlib
from django.contrib import admin
from django.db import models

from core.utils import * 

from django.contrib.auth import get_user_model
User = get_user_model()

class Job(models.Model):
   # attr
   JOB_TYPES = [
        ('Service', 'Service'),
        ('Product', 'Product'),
    ]

   user_id = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='User')
   description = models.CharField(max_length = 2500, blank=True, null=True, default=None, help_text='')
   price = models.CharField(max_length = 500, blank=True, null=True, default=None, help_text='', unique=True)
   job_type = models.CharField(max_length=10, choices=JOB_TYPES, default='Service')
   date_updated = models.DateTimeField(auto_now=True, editable=False, verbose_name="Date updated")
   date_created = models.DateTimeField(auto_now_add=True, editable=False, verbose_name="Date created")
   Active = models.BooleanField(default=True)
   
   class Meta:
      verbose_name = 'Job'
   
   def __str__(self):
      return f"{self.user_id.username}"
   
   
class JobAdmin(admin.ModelAdmin):
    #list
	list_display = ['__str__','id','description','Active','price']
	# search_fields = [
	# 	'package',
   #    # 'last_login_longer_than_30_days',
	# ]
	# list_filter = ['Project','Language']