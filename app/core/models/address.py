from django.db import models

class Address(models.Model):
    ADDRESS_TYPES = [
        ('Home', 'Home'),
        ('Office', 'Office'),
        ('Warehouse', 'Warehouse'),
        ('Other', 'Other'),
    ]

    company_id = models.ForeignKey('Company', on_delete=models.CASCADE)
    street = models.CharField(max_length=255)
    complex_apartment = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    province = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100)
    latitude = models.DecimalField(max_digits=10, decimal_places=8, blank=True, null=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, blank=True, null=True)
    address_type = models.CharField(max_length=10, choices=ADDRESS_TYPES, default='Other')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "addresses"