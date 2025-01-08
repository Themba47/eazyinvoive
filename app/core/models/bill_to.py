from django.db import models

from django.contrib.auth import get_user_model
User = get_user_model()

class BillTo(models.Model):
  
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='User')
    client_company_name = models.CharField(max_length=255, blank=True, null=True)
    client_name = models.CharField(max_length=255, blank=True, null=True)
    client_email = models.CharField(max_length=255, blank=True, null=True)
    client_phone_number = models.CharField(max_length=255, blank=True, null=True)
    tax_number = models.CharField(max_length=100, blank=True, null=True)
    
    address = models.CharField(max_length=255, blank=True, null=True)
    complex_apartment = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    province = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=8, blank=True, null=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, blank=True, null=True)
    additional_info = models.TextField(blank = True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    Active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Bill To"
        
    
    def __str__(self):
      return f"{self.client_name} ({self.client_company_name})" if self.client_company_name else self.client_name