from django.db import models
from core.utils import * 

from django.contrib.auth import get_user_model
User = get_user_model()

class Package(models.TextChoices):
   Free = "Free", 'Free'
   Standard = "Standard", 'Standard'

class UserDetails(models.Model):
   # attr
   
   user_id = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Manager')
   invoices_generated = models.IntegerField(default=0)
   package = models.CharField(max_length=16, blank=True, null=True, choices=Package.choices, default=Package.Free, verbose_name='Packages')
   date_updated = models.DateTimeField(auto_now=True, editable=False, verbose_name="Date updated")
   date_created = models.DateTimeField(auto_now_add=True, editable=False, verbose_name="Date created")
   
   class Meta:
      verbose_name = 'User Details'
   
   def __str__(self):
      return f'{self.id} created: {self.date_created.strftime("%Y-%m-%d %H:%M")}'
   
   
   def is_free_package(self):
      if self.package == Package.Free:
         return True
      return False
   
   
   def update_to_pro(self):
      self.package = Package.Pro
      self.date_paid = datetime.datetime.now()
      self.Free_tokens += 1
      self.save()
      return self.package
   
   
   def check_users_30_days(self):
      check_date = False
      days = None
      if self.date_paid:
         days, check_date = check_30_days(self.date_paid)
      if check_date:
         self.package = Package.Free
         self.save()
      print(f">>>>>> User has {days} {check_date}")
      return check_date
   