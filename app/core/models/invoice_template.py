import hashlib
from django.db import models

from core.utils import * 

from django.contrib.auth import get_user_model
User = get_user_model()

class InvoiceTemplate(models.Model):
   # attr

   user_id = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='User')
   file  = models.FileField(upload_to=settings.INVOICE, blank=True, null=True)
   date_updated = models.DateTimeField(auto_now=True, editable=False, verbose_name="Date updated")
   date_created = models.DateTimeField(auto_now_add=True, editable=False, verbose_name="Date created")
   Active = models.BooleanField(default=True)
   
   class Meta:
      verbose_name = 'Invoice Template'
   
   # def __str__(self):
   #    return f"{self.company_name}"