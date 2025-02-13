from django.db import models
from django.contrib.auth import get_user_model
from core.models import Document
User = get_user_model()

class ExpenseReport(models.Model):
    title = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    documents = models.ManyToManyField(Document)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    notes = models.TextField(blank=True)
    
    def generate_summary(self):
        summary = {
            'total_amount': float(self.total_amount),
            'document_count': self.documents.count(),
            'categories': {}
        }
        
        for doc in self.documents.all():
            category = doc.category.name
            if category not in summary['categories']:
                summary['categories'][category] = 0
            summary['categories'][category] += float(doc.total_amount)
            
        return summary