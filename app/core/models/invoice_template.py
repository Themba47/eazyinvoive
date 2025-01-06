import hashlib
from django.db import models

from core.utils import * 

from django.contrib.auth import get_user_model
User = get_user_model()

class InvoiceStatus(models.TextChoices):
   # DRAFT = 'draft', 'Draft'
   QUOTE = 'QUOTE', 'QUOTE'
   UNPAID = 'UNPAID', 'UNPAID'
   PAID = 'PAID', 'PAID'

class InvoiceTemplate(models.Model):
   user = models.ForeignKey(User, on_delete=models.CASCADE)
   name = models.CharField(max_length = 255, blank=True, null=True, default=None)
   client = models.ForeignKey('BillTo', on_delete=models.SET_NULL, null=True)
   items = models.JSONField(default=list)
   status = models.CharField(max_length=20, choices=InvoiceStatus.choices, default=InvoiceStatus.UNPAID)
   Active = models.BooleanField(default=True)
   date_updated = models.DateTimeField(auto_now=True, editable=False, verbose_name="Date updated")
   date_created = models.DateTimeField(auto_now_add=True, editable=False, verbose_name="Date created")
   

class GeneratedInvoice(models.Model):
    template = models.ForeignKey(InvoiceTemplate, on_delete=models.CASCADE)
    invoice_number = models.CharField(max_length = 50, blank=True, null=True, default=None, help_text='')
    file = models.FileField(upload_to=settings.INVOICE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=InvoiceStatus.choices, default=InvoiceStatus.UNPAID)
    generated_at = models.DateTimeField(auto_now_add=True)
   
