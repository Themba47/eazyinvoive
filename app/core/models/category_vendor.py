from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.utils import timezone
import json
from decimal import Decimal


class CategoryVendor(models.Model):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    def get_monthly_spending(self, year, month):
        return self.documents.filter(
            date__year=year,
            date__month=month
        ).aggregate(total=models.Sum('total_amount'))['total'] or 0

    class Meta:
        verbose_name_plural = "category vendors"