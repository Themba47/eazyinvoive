import hashlib
from django.db import models

from core.utils import * 
from core.models import InvoiceTemplate
from core.models.invoice_template import InvoiceStatus
from django.contrib.auth import get_user_model
User = get_user_model()


   

class GeneratedInvoice(models.Model):
    template = models.ForeignKey(InvoiceTemplate, on_delete=models.CASCADE)
    invoice_number = models.CharField(max_length = 50, blank=True, null=True, default=None, help_text='')
    file = models.FileField(upload_to=settings.INVOICE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=InvoiceStatus.choices, default=InvoiceStatus.UNPAID)
    date_created = models.DateTimeField(auto_now_add=True)