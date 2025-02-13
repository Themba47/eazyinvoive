from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.utils import timezone
import json
from decimal import Decimal

class Vendor(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    category = models.ForeignKey('CategoryVendor', on_delete=models.SET_NULL, null=True)
    average_payment_terms = models.IntegerField(default=30)
    website = models.URLField(blank=True, null=True)
    tax_id = models.CharField(max_length=50, blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['name']),
        ]

    def get_spending_patterns(self):
        documents = self.documents.all()
        if not documents:
            return None
            
        amounts = [doc.total_amount for doc in documents]
        return {
            'average_amount': sum(amounts) / len(amounts),
            'highest_amount': max(amounts),
            'lowest_amount': min(amounts),
            'total_spent': sum(amounts),
            'document_count': len(documents)
        }