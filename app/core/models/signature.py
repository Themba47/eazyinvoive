from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

class Signature(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    signature = models.ImageField(upload_to='signatures/')
    
    def __str__(self):
       return f"{self.user.username}"