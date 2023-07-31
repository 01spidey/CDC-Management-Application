from django.db import models
from django.utils.timezone import now
from django.contrib.postgres.fields import ArrayField
# from app.models import Student, Drive
from django.contrib.postgres.fields.jsonb import JSONField



# Create your models here.

class Report(models.Model):
    date = models.DateField(default=now, null=False)
    company = models.CharField(max_length=50, null=False)
    placement_officer_id = models.CharField(max_length=50, null=True)
    message = models.TextField(null=False)
    reminder_date = models.DateField(null=True, default=None)
    completed = models.BooleanField(default=False)
    timestamp = models.DateTimeField(default=now, null=True)
    remarks = models.TextField(null=True)
    # time = models.CharField(max_length=50, null=True)
    
    class Meta:
        ordering = ['-timestamp']

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

class Company(models.Model):
    company = models.CharField(max_length=50, null=False)
    HR_name = models.CharField(max_length=50, null=False)
    HR_mail = models.EmailField(null=False)
    
    HR_contact = models.CharField(max_length=50, null=True)
    lock_hr_mail = models.BooleanField(default=False)
    lock_hr_contact = models.BooleanField(default=False)
    
    placement_officer_id = models.CharField(max_length=50, null=False)
    category = models.CharField(max_length=50, null=True)
    website = models.URLField(null=True)
    last_reminder_date = models.DateField(null=True, default=None)
    
    initiated_at = models.DateField(default=now, null=False)

class StudentEdu(models.Model):
    reg_no = models.CharField(max_length=50, null=False, primary_key=True)
    mark_10 = models.FloatField(null=True)
    mark_12 = models.FloatField(null=True)
    percent_10 = models.FloatField(null=True)
    percent_12 = models.FloatField(null=True)
    board_10 = models.CharField(max_length=50, null=True)
    board_12 = models.CharField(max_length=50, null=True)
    medium_10 = models.CharField(max_length=50, null=True)
    medium_12 = models.CharField(max_length=50, null=True)
    cutoff_12 = models.FloatField(null=True)
    
    mark_diploma = models.FloatField(null=True)
    percent_diploma = models.FloatField(null=True)
    school_10 = models.CharField(max_length=50, null=True)
    school_12 = models.CharField(max_length=50, null=True)
    college_diploma = models.CharField(max_length=50, null=True)
    
    ug_cgpa = models.FloatField(null=True)
    ug_percent = models.FloatField(null=True)
    arrear_history = models.IntegerField(null=True)
    standing_arrears = models.IntegerField(null=True)
    
class DriveSelection(models.Model):
    drive = models.ForeignKey('Drive', on_delete=models.CASCADE)
    student = models.ForeignKey('Student', on_delete=models.CASCADE)
    selected = models.BooleanField(default=False)
    round = models.IntegerField(default=0)
    date = models.DateField(default=now, null=False)

class Student(models.Model):
    reg_no = models.CharField(max_length=50, null=False, primary_key=True)
    name = models.CharField(max_length=50, null=False)
    phone = models.CharField(max_length=50, null=False)
    mail = models.EmailField(null=False)
    dept = models.CharField(max_length=20, null=False)
    dob = models.DateField(null=False)
    gender = models.CharField(max_length=10, null=False)
    batch = models.CharField(max_length=10, null=False)
    placement_interested = models.BooleanField(default=True)
    attended_drives = models.ManyToManyField('Drive', through='DriveSelection')
    
class Drive(models.Model):
    job_role = models.CharField(max_length=50, null=True)
    date = models.DateField(default=now, null=False)
    company = models.CharField(max_length=50, null=False)
    drive_mode = models.CharField(max_length=50, null=False)
    description = models.TextField(null=False)
    ctc = models.FloatField(null=True)
    departments = ArrayField(models.CharField(max_length=100), blank=True, null=True)
    filter_criteria = models.JSONField(null=True)
    attended_students = models.ManyToManyField('Student', through='DriveSelection')
    drive_rounds = ArrayField(models.JSONField(null=True), default=list)
    offer_type = models.CharField(max_length=50, default='Job')
    completed = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-date']
    
    
    



    
    


