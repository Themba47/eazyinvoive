from django.contrib import admin
from .models import AIAnalysisLog, Address, BillTo, Company, InvoiceTemplate, CategoryVendor, CreatedInvoice, Document, DocumentTag, ExpenseReport, Job, JobAdmin, Signature, UserDetails, Vendor
from myaccount.models import CustomUser, CustomUserAdmin

admin.site.site_header = "EazyInvoice"
admin.site.register(AIAnalysisLog)
admin.site.register(Address)
admin.site.register(BillTo)
admin.site.register(CategoryVendor)
admin.site.register(Company)
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(DocumentTag)
admin.site.register(Document)
admin.site.register(ExpenseReport)
admin.site.register(InvoiceTemplate)
admin.site.register(CreatedInvoice)
admin.site.register(Job, JobAdmin)
admin.site.register(Signature)
admin.site.register(UserDetails)
admin.site.register(Vendor)

# Register your models here.
