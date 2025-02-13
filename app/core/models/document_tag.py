from django.db import models
from core.models import Document


class DocumentTag(models.Model):
    name = models.CharField(max_length=100)
    documents = models.ManyToManyField(Document, related_name='tags')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name