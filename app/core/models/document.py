from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.utils import timezone

from decimal import Decimal
User = get_user_model()

class DocumentManager(models.Manager):
    def get_pending_payments(self):
        return self.filter(
            payment_status='UNPAID',
            due_date__isnull=False
        ).order_by('due_date')
    
    def get_overdue_documents(self):
        return self.filter(
            payment_status='UNPAID',
            due_date__lt=timezone.now()
        )

class Document(models.Model):
    DOCUMENT_TYPES = [
        ('INVOICE', 'Invoice'),
        ('RECEIPT', 'Receipt'),
        ('CONTRACT', 'Contract'),
        ('FORM', 'Form'),
        ('OTHER', 'Other'),
    ]
    
    PAYMENT_STATUS = [
        ('PAID', 'Paid'),
        ('UNPAID', 'Unpaid'),
        ('PENDING', 'Pending'),
        ('DISPUTED', 'Disputed'),
    ]
    
    URGENCY_LEVELS = [
        ('HIGH', 'High'),
        ('MEDIUM', 'Medium'),
        ('LOW', 'Low'),
    ]

    # Basic Fields
    title = models.CharField(max_length=255)
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to='documents/%Y/%m/')
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    # Metadata
    date = models.DateField()
    due_date = models.DateField(null=True, blank=True)
    processed_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    
    # Relationships
    vendor = models.ForeignKey('Vendor', on_delete=models.CASCADE, related_name='documents')
    category = models.ForeignKey('CategoryVendor', on_delete=models.SET_NULL, null=True, related_name='documents')
    
    # Financial Information
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    currency = models.CharField(max_length=3, default='USD')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='UNPAID')
    
    # AI-Generated Fields
    extracted_text = models.TextField(blank=True)
    key_items = models.JSONField(default=list)
    urgency_level = models.CharField(max_length=10, choices=URGENCY_LEVELS, default='MEDIUM')
    ai_analysis = models.JSONField(default=dict)
    confidence_score = models.FloatField(default=0.0)
    
    objects = DocumentManager()
    
    class Meta:
        indexes = [
            models.Index(fields=['date', 'due_date']),
            models.Index(fields=['payment_status']),
            models.Index(fields=['document_type']),
        ]
    
    def save(self, *args, **kwargs):
        if not self.extracted_text and self.file:
            self.extract_text()
        if self.extracted_text and not self.ai_analysis:
            self.analyze_content()
        super().save(*args, **kwargs)
    
    def extract_text(self):
        """Extract text from document using OCR"""
        # Implementation depends on your OCR solution
        pass
    
    def analyze_content(self):
        """Analyze document content using AI"""
        # Implementation depends on your AI solution
        pass