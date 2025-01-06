from django.db import models

from django.contrib.auth import get_user_model
User = get_user_model()

class InvoiceLineItem(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='User')
    description = models.TextField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100)
    confidence_score = models.FloatField()
    tax_code = models.CharField(max_length=20)
    is_verified = models.BooleanField(default=False)