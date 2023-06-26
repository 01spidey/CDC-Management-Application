from django.db import models
from django.utils.timezone import now
from django.contrib.postgres.fields import ArrayField


# Create your models here.

class Report(models.Model):
    date = models.DateField(default=now, null=False)
    placement_officer_id = models.CharField(max_length=50, null=True)
    company = models.CharField(max_length=50, null=False)
    HR_name = models.CharField(max_length=50, null=False)
    HR_mail = models.EmailField(null=False)
    contact_mode = models.CharField(max_length=50, null=False)
    message = models.TextField(null=False)
    reminder_date = models.DateField(null=True, default=None)
    visibility = models.CharField(max_length=50, null=False, default='public')
    visible_to = ArrayField(models.CharField(max_length=100), blank=True, null=True)
    
    class Meta:
        ordering = ['-date']

class PlacementOfficer(models.Model):
    user_id = models.CharField(max_length=50, null=False, primary_key=True)
    password = models.CharField(max_length=50, null=False)
    name = models.CharField(max_length=50, null=False)
    mail = models.EmailField(null=False)
    phone = models.CharField(max_length=50, null=False)
    staff_id = models.CharField(max_length=50, null=False, unique=True)
    profile_img = models.ImageField(upload_to='backend\cdc_app\app\officer_profiles', null=True)

class PlacementDirector(models.Model):
    user_id = models.CharField(max_length=50, null=False, primary_key=True)
    password = models.CharField(max_length=50, null=False)
    name = models.CharField(max_length=50, null=False)
    mail = models.EmailField(null=False)
    phone = models.CharField(max_length=50, null=False)
    staff_id = models.CharField(max_length=50, null=False)
    profile_img = models.ImageField(upload_to='backend\cdc_app\app\director_profiles', null=True)

class Drive(models.Model):
    job_role = models.CharField(max_length=50, null=True)
    placement_officer_id = models.CharField(max_length=50, null=True)
    date = models.DateField(default=now, null=False)
    company = models.CharField(max_length=50, null=False)
    website = models.URLField(null=False)
    HR_name = models.CharField(max_length=50, null=False)
    HR_mail = models.EmailField(null=False)
    drive_mode = models.CharField(max_length=50, null=False)
    description = models.TextField(null=False)
    category = models.CharField(max_length=50, null=True)
    file = models.FileField(upload_to='file_uploads/', null=True)  # Adjust the upload destination as per your requirements
    
    class Meta:
        ordering = ['-date']
    
    


