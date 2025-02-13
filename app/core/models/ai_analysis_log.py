from django.db import models

class AIAnalysisLog(models.Model):
    document = models.ForeignKey('Document', on_delete=models.CASCADE)
    processed_at = models.DateTimeField(auto_now_add=True)
    input_text = models.TextField()
    output_analysis = models.JSONField()
    processing_time = models.FloatField()  # in seconds
    error_message = models.TextField(blank=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['processed_at']),
        ]