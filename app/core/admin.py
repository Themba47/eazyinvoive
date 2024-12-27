from django.contrib import admin
from .models import Address, Company, InvoiceTemplate, UserDetails
from myaccount.models import CustomUser, CustomUserAdmin

admin.site.site_header = "EazyInvoice"
admin.site.register(Address)
admin.site.register(Company)
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(InvoiceTemplate)
admin.site.register(UserDetails)

# Register your models here.
