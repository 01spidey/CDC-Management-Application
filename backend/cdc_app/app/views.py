import csv
import json
import random
from django.conf import settings
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from .models import DriveSelection, PlacementDirector,PlacementOfficer,Report, Drive, Company, Student, StudentEdu
from datetime import datetime, date, timedelta
from django.core.files.storage import FileSystemStorage
from django.contrib.sites.shortcuts import get_current_site
from django.db.models import Q
from django.core.mail import send_mail
from random import sample
from cryptography.fernet import Fernet
from django.utils import timezone
import pytz
import pandas as pd


# Create your views here.

# def sample():
#     try:
#         data = pd.read_csv(r'D:\\CDC_Website\backend\\cdc_app\\app\student_data\\mech_data.csv')
        
#         for _, row in data.iterrows():
#             dob = datetime.strptime(row['dob'], "%Y/%m/%d").strftime("%Y-%m-%d")
#             student = Student(
#                 reg_no=row['reg_no'],
#                 name=row['name'],
#                 phone=row['phone'],
#                 mail=row['mail'],
#                 gender=row['gender'],
#                 dept=row['dept'],
#                 dob=dob,
#                 batch=row['batch'],
#             )
#             student.save()
            
#             studentEdu = StudentEdu(
#                 reg_no=row['reg_no'],
#                 mark_10 = row['mark_10'],
#                 mark_12 = row['mark_12'],
#                 percent_10 = row['percent_10'],
#                 percent_12 = row['percent_12'],
#                 board_10 = row['board_10'],
#                 board_12 = row['board_12'],
#                 medium_10 = row['medium_10'],
#                 medium_12 = row['medium_12'],
#                 cutoff_12 = row['cutoff_12'],
                
#                 # mark_diploma = models.FloatField(null=True)
#                 # percent_diploma = models.FloatField(null=True)
#                 school_10 = random.choice(["School-A", "School-B", "School-C", "School-D", "School-E", "School-F", "School-G", "School-H", "School-I", "School-J"]),
#                 school_12 = random.choice(["School-A", "School-B", "School-C", "School-D", "School-E", "School-F", "School-G", "School-H", "School-I", "School-J"]),
#                 # college_diploma = models.CharField(max_length=50, null=True)
                
#                 ug_cgpa = row['ug_cgpa'],
#                 ug_percent = row['ug_percent'],
#                 arrear_history = row['arrear_history'],
#                 standing_arrears = row['standing_arrears'],
#             )
#             studentEdu.save()
            
#         print("Success")
        
#     except Exception as e:
#         print(e)
#         print("Out-uh vro!!")

@csrf_exempt
def test(request):
    data = {
        'message':'vanakkam Bruh!!'}
    
    return JsonResponse(data)

@csrf_exempt
def send_otp(request):
    formData = json.loads(request.body)
    role = formData['role']
    staff_id = formData['staff_id']
    mail_id = formData['mail_id']
    otp = 0
    
    table = PlacementDirector if role=='Director' else PlacementOfficer
    try:
        if(table.objects.filter(staff_id=staff_id,mail=mail_id)):
            
            user_id = table.objects.get(staff_id=staff_id,mail=mail_id).user_id
            password = table.objects.get(staff_id=staff_id,mail=mail_id).password
            
            otp = sample(range(0, 10), 4)
            otp = "".join(map(str, otp))
            secret_key = Fernet.generate_key()

            from_email = '01srikumaran@gmail.com'
            to_email = mail_id
            subject = 'OTP for Resetting Credentials'
            message = f'Your OTP is {otp}'
            
            send_mail(
                subject=subject,
                message=message,
                from_email=from_email,
                recipient_list=[to_email],
                fail_silently=False
            )
            
            data = {
                'success':True,
                'otp' : otp,
                'user_id' : user_id,
                'password' :password,
                # 'key' : str(secret_key)
            }
            
            return JsonResponse(data)
        else:
            data = {
                'success':False,
                'otp' : '',
                'user_id' : '',
                'password' : ''
            }
            return JsonResponse(data)
    
    except Exception as e:
        print(f'Error : {e}')
        data = {
                'success':False,
                'otp' : '',
                'user_id' : '',
                'password' : ''
            }
        return JsonResponse(data)

@csrf_exempt
def update_credentials(request):
    formData = json.loads(request.body)
    # print(formData)
    old_user_id = formData['old_user_id']
    old_pass = formData['old_password']
    new_user_id = formData['new_user_id']
    new_pass = formData['new_password']
    role = formData['role']
    
    table = PlacementDirector if role=='Director' else PlacementOfficer
    
    try:
        user = table.objects.filter(user_id=old_user_id,password=old_pass)
        user.update(user_id=new_user_id,password=new_pass)
        data = {
            'success':True,
            'message' : "Credentials Updated Successfully!!"
        }
        return JsonResponse(data) 
        
    except Exception as e:
        print(e)
        data = {
            'success':False,
            'message' : "Something went wrong!!"
        }
        
        return JsonResponse(data)      

@csrf_exempt
def login(request):
    user_id = request.POST['user_id']
    password = request.POST['pass']
    role = request.POST['user_role']
    
    success = True
    
    message = "Login Successfull!!"
    
    user_data = {
        'user_id' : 'null',
        'name' : 'null',
        'mail' : 'null',
        'phone' : 'null',
        'staff_id' : 'null'
    }
    
    # print(f'{user_id}\n{password}\n{role}')
    
    if(role=='Director'):
        if PlacementDirector.objects.filter(user_id=user_id, password = password):
            success = True  
            
            director = PlacementDirector.objects.get(user_id=user_id)
            user_data  =  { 'user_id' : director.user_id,
                            'name' : director.name,
                            'mail' : director.mail,
                            'phone' : director.phone,
                            'staff_id' : director.staff_id
                            }
            
            message = f'Welcome {director.name}!!'          
            
        else:
            success = False
            message = 'Invalid Crdentials!!'
   
    else:
        if PlacementOfficer.objects.filter(user_id=user_id,password=password):
            success = True
            
            officer = PlacementOfficer.objects.get(user_id=user_id)
            user_data = {
                    'user_id' : officer.user_id,
                    'name' : officer.name,
                    'mail' : officer.mail,
                    'phone' : officer.phone,
                    'staff_id' : officer.staff_id
                }
            message = f"Welcome {officer.name}!!"


        else:
            success = False
            message = 'Invalid Crdentials!!'
        
    data = {
        'success':success,
        'message' : message,
        'user_data' : user_data
    }
    
    return JsonResponse(data)

@csrf_exempt
def add_admin(request):
    name = request.POST['name']
    password = request.POST['pass']
    user_id = request.POST['user_id']
    mail = request.POST['mail']
    phone = request.POST['contact']
    staff_id = request.POST['staff_id']
    
    try:
        director = PlacementDirector.objects.create(
            user_id = user_id,
            password = password,
            name = name,
            mail = mail,
            phone = phone,
            staff_id = staff_id
        )
        
        director.save()
        
        data = {
            'message':f'Admin Created Successfully!!'
        }
    
        return JsonResponse(data)
    
    except Exception as e:
        data = {
            'message': 'Error Bruh!!'
        }
        print(e)
        
        return JsonResponse(data)
        
# Need to be changed
@csrf_exempt
def get_drive_by_status(request):
     
    drive_lst = []
    
    status = request.GET.get('status')
    # print(status)
    today = date.today()


    # Retrieve the drives based on the status parameter
    try:
        drives = None
        
        if(status=='Today'):
            drives = Drive.objects.filter(date=today)
        elif(status=='Upcoming'):
            drives = Drive.objects.filter(date__gt=today)


        for drive in drives:
            drive_date = datetime.strptime(str(drive.date), '%Y-%m-%d').strftime('%d-%m-%Y')
            company_obj = Company.objects.get(company=drive.company)
            # print(json.loads(drive.drive_rounds))
            drive_lst.append(
                {
                    'id' : drive.pk,
                    'company' : drive.company,
                    'job_role': drive.job_role,
                    'mode': drive.drive_mode,
                    'date': drive_date,
                    'placement_officer_id': company_obj.placement_officer_id,
                    'website' : company_obj.website,
                    'HR_name' : company_obj.HR_name,
                    'HR_mail' : company_obj.HR_mail,
                    'HR_contact' : company_obj.HR_contact,
                    'description' : drive.description,
                    'category' : company_obj.category,
                    'lock_hr_mail' : company_obj.lock_hr_mail,
                    'lock_hr_contact' : company_obj.lock_hr_contact,
                    'completed' : drive.completed,
                    'departments' : drive.departments,
                    'ctc' : drive.ctc,
                    'filters' : drive.filter_criteria,
                    'rounds' : [] if drive.drive_rounds==None else drive.drive_rounds
                }
            )
            
        data = {
            'success':True,
            'drive_lst' : drive_lst
        }
        
        return JsonResponse(data)
    
    except Exception as e:
        print(e)
        return JsonResponse(
            {
                'success':False,
                'drive_lst':drive_lst
            }
        )
 
# Need to be changed
@csrf_exempt
def get_drive_by_dateRange(request):
    drive_lst = []
    
    status = request.POST.get('status')
    start_date = request.POST.get('start_date')
    end_date = request.POST.get('end_date')
    
    # Implement the logic to retrieve the drives based on the date range 
    # and populate the drive_lst and send it as a response to the client
    
    today = date.today()   
    yesterday = today - timedelta(days=1)                   
    
    try:
        # print(f'{status}\n{start_date}\n{end_date}') 
        
        drives = None
        
        if(status=='All'):
            drives = Drive.objects.filter(date__range=[start_date, end_date])
        
        elif(status=='Completed'):
            
            if(start_date>=str(today)):
                print('start_date is greater than today')
                return JsonResponse(
                        {
                            'success':False,
                            'drive_lst':drive_lst
                        }
                )
            
            elif(end_date>str(today)):
                print('end_date is greater than today')
                end_date = yesterday
                # drives = Drive.objects.filter(date__range=[start_date, yesterday], date__lt=today)
                
            drives = Drive.objects.filter(date__range=[start_date, end_date], date__lt=today)
        
        for drive in drives:
            drive_date = datetime.strptime(str(drive.date), '%Y-%m-%d').strftime('%d-%m-%Y')
            company_obj = Company.objects.get(company=drive.company)
            print(drive.drive_rounds)
            
            drive_lst.append(
                {
                    'id' : drive.pk,
                    'company' : drive.company,
                    'job_role': drive.job_role,
                    'mode': drive.drive_mode,
                    'date': drive_date,
                    'placement_officer_id': company_obj.placement_officer_id,
                    'website' : company_obj.website,
                    'HR_name' : company_obj.HR_name,
                    'HR_mail' : company_obj.HR_mail,
                    'HR_contact' : company_obj.HR_contact,
                    'description' : drive.description,
                    'completed' : drive.completed,
                    'category' : company_obj.category,
                    'lock_hr_mail' : company_obj.lock_hr_mail,
                    'lock_hr_contact' : company_obj.lock_hr_contact,
                    'departments' : drive.departments,
                    'ctc' : drive.ctc,
                    'filters' : drive.filter_criteria,
                    'rounds' : [] if drive.drive_rounds==None else drive.drive_rounds, 
                }
            )
            
        data = {
            'success':True,
            'drive_lst' : drive_lst
        }
    
        return JsonResponse(data)
    
    except Exception as e:
        print(e)
        return JsonResponse(
            {
                'success':False,
                'drive_lst':drive_lst
            }
        )

def get_report_summary_by_id(staff_id, filter, start_date, end_date):
    # staff_id = request.GET.get('staff_id', 'default_staff_id')
    report_data = Report.objects.all()
    
    if filter == 'Today':
        report_data = Report.objects.filter(placement_officer_id=staff_id, date=date.today())
    else:
        # startDate = datetime.strptime(str(start_date), '%Y-%m-%d').strftime('%d-%m-%Y')
        # endDate = datetime.strptime(str(end_date), '%Y-%m-%d').strftime('%d-%m-%Y')
        report_data = Report.objects.filter(placement_officer_id=staff_id, date__range=[start_date, end_date])
    
    name = PlacementOfficer.objects.get(staff_id=staff_id).name
    companies = report_data.values_list('company', flat=True)

    response_data = {
        'staff_id': staff_id, # staff id of the placement officer
        'name': name, # name of the placement officer
        'total_reports': len(report_data), # total number of reports
        'companies': list(set(companies)) # list of companies contacted by the placement officer
    }
    
    return response_data

@csrf_exempt
def get_report_summary(request):
    
    data = json.loads(request.body)
    filter = data['filter']
    start_date = data['start_date']
    end_date = data['end_date']
    
    report_summary = []
       
    print(filter, start_date, end_date) 
    
    try:
        staff_ids = PlacementOfficer.objects.values_list('staff_id', flat=True).distinct()
        staff_ids_array = list(staff_ids)
        
        a = 1
        for staff_id in staff_ids_array:
            summary = get_report_summary_by_id(staff_id, filter, start_date, end_date)
            summary['position'] = a
            report_summary.append(summary)
            a+=1
            
        data = {
            'success': True,
            'report_summary': report_summary
        }

        return JsonResponse(data)
    
    except Exception as e:
        print(e)
        data = {
            'success': False,
            'report_summary': []
        }

        return JsonResponse(data) 
 
def get_remaining_days(date_string):
    # Convert the date string to a datetime object
    # target_date = datetime.strptime(date_string, '%d-%m-%Y')

    # Get the current date
    current_date = datetime.now().date()

    # Calculate the difference in days between the target date and current date
    remaining_days = (date_string - current_date).days

    return remaining_days
 
def convert_date_format(date):
    converted_date = date.strftime('%d-%m-%Y')
    return converted_date 
       
@csrf_exempt
def get_notifications(request):
    category = request.GET.get('category')
    staff_id = request.GET.get('staff_id')
    
    print(category, staff_id)
    report_notifications = []
    drive_notifications = []
    
    today = date.today()
    
    if(category=='report_alerts'):
        reports = Report.objects.filter(Q(placement_officer_id=staff_id, completed = False)).order_by('reminder_date')
        for report in reports:
            report_notifications.append(
                {
                    'pk' : report.pk,
                    'company' : report.company,
                    'date' : convert_date_format(report.reminder_date),
                    'last_message' : report.message,
                    'last_message_date' : convert_date_format(report.date),
                    'days_left' : get_remaining_days(report.reminder_date),
                }
            )
        print(today)
            
        data = {
            'success': True,
            'notifications': report_notifications
        }
        
        return JsonResponse(data)
        
    else:
        drives = Drive.objects.filter(Q(date__gt=today) | Q(date=today)).order_by('date')
        for drive in drives:
            drive_notifications.append(
              {
                    'company' : drive.company,
                    'date' : convert_date_format(drive.date),
                    'role' : drive.job_role,
                    'mode' : drive.drive_mode,
                    'days_left' : get_remaining_days(drive.date),
                }  
            )
        
        data = {
            'success': True,
            'notifications': drive_notifications
        }
        return JsonResponse(data)




# Implemented for both admin and member
@csrf_exempt
def load_members(request):
    team_lst = []
    role = request.GET.get('role')
    if(role=='admin'):
        for director in PlacementDirector.objects.all():
            team_lst.append(
                {
                    'pk' : director.pk,
                    'user_id' : director.user_id,
                    'name' : director.name,
                    'mail' : director.mail,
                    'phone' : director.phone,
                    'staff_id' : director.staff_id
                }
            )
        
        data = {
            'success':True,
            'team_lst' : team_lst
        }
        
        return JsonResponse(data)
    
    else:
        for officer in PlacementOfficer.objects.all():
            team_lst.append(
                {
                    'pk' : officer.pk,
                    'user_id' : officer.user_id,
                    'name' : officer.name,
                    'mail' : officer.mail,
                    'phone' : officer.phone,
                    'staff_id' : officer.staff_id
                }
            )
        
        data = {
            'success':True,
            'team_lst' : team_lst
        }
        
        return JsonResponse(data)
    
# Implemented for both admin and member
@csrf_exempt
def add_member(request):
    
    user_id = request.POST['staff_id']
    password = request.POST['staff_id']
    name = request.POST['name']
    mail = request.POST['mail']
    contact = request.POST['contact']
    staff_id = request.POST['staff_id']
    role = request.POST['role']
    
    print(f'{user_id}\n{password}\n{name}\n{mail}\n{contact}\n{staff_id}')
    
    try:
        if(role=='Admin'):
            if PlacementDirector.objects.filter(user_id=user_id) or PlacementDirector.objects.filter(staff_id =staff_id):     
                
                return JsonResponse(
                    {
                        'success':False,
                        'message' : 'Admin already Exists!!'
                    }
                )  
            else:
                director = PlacementDirector(
                    user_id = user_id,
                    password = password,
                    name = name,
                    mail = mail,
                    phone = contact,
                    staff_id = staff_id
                )  
                
                director.save()
                
                data = {
                    'success':True,
                    'message' : 'Admin added Successfully!!'
                }
                
                return JsonResponse(data)
        
        else :
            if PlacementOfficer.objects.filter(user_id=user_id) or PlacementOfficer.objects.filter(staff_id =staff_id):     
                
                return JsonResponse(
                    {
                        'success':False,
                        'message' : 'Member already Exists!!'
                    }
                )
                    
            else:
                officer = PlacementOfficer(
                    user_id = user_id,
                    password = password,
                    name = name,
                    mail = mail,
                    phone = contact,
                    staff_id = staff_id
                )
                
                officer.save()
            
            
                data = {
                    'success':True,
                    'message' : 'Member added Successfully!!'
                }
                
                return JsonResponse(data)
    
    except Exception as e:
        print(e)
        data = {
           'success':False,
            'message' : 'Some Technical Error!!' 
        }

# Implemented for both admin and member 
@csrf_exempt
def get_member_by_id(request):
    pk = request.GET.get('pk')
    role = request.GET.get('role')
    
    try:
        if(role=='admin'):
            user = PlacementDirector.objects.get(pk = pk)
            
            data = {
                'success' : True,
                'user' : {
                    'pk' : pk,
                    'name' : user.name,
                    'user_id' : user.user_id,
                    'staff_id' : user.staff_id,
                    'mail' : user.mail,
                    'phone' : user.phone
                }
            }
            return JsonResponse(data)
        
        else:
            user = PlacementOfficer.objects.get(pk = pk)
            
            data = {
                'success' : True,
                'user' : {
                    'pk' : pk,
                    'name' : user.name,
                    'user_id' : user.user_id,
                    'staff_id' : user.staff_id,
                    'mail' : user.mail,
                    'phone' : user.phone
                }
            }
            return JsonResponse(data)
    
    except Exception as e:
        print(e)
        data = {
            'success' : False,
            'user' : { }
        }
        return JsonResponse(data)

# Implemented for both admin and member
@csrf_exempt
def update_member(request):
    pk = request.POST['pk']
    name = request.POST['name']
    mail = request.POST['mail']
    contact = request.POST['contact']
    staff_id = request.POST['staff_id']
    role = request.POST['role']
    
    try:
        updated_data = {
            'name' : name,
            'mail' : mail,
            'phone' : contact,
            'staff_id' : staff_id
        }
        
        print(role)
        print(pk)
        
        if(role=='Member'):
            PlacementOfficer.objects.filter(pk=pk).update(**updated_data)
            
            data = {
                'success':True,
                'message' : f'Member updated Successfully!!'
            }
        
            return JsonResponse(data)
        
        else:
            PlacementDirector.objects.filter(pk=pk).update(**updated_data)
            
            data = {
                'success':True,
                'message' : f'Admin updated Successfully!!'
            }
        
            return JsonResponse(data)
    
    except Exception as e:
        print(e)
        data = {
            'success':False,
            'message' : f'Some Technical Error!!'
        }
    
        return JsonResponse(data)
 
# Implemented for both admin and member   
@csrf_exempt
def delete_member(request):
    data = json.loads(request.body)
    pk = data['pk']
    role = data['role']
    
    try:
        if(role=='admin'):
            director = PlacementDirector.objects.get(pk = pk)
            director.delete()
            data = {
                'success':True,
                'message' : f'Admin deleted Successfully!!'
            }
        
            return JsonResponse(data)
        else:
            officer = PlacementOfficer.objects.get(pk = pk)
            officer.delete()
            data = {
                'success':True,
                'message' : f'Member deleted Successfully!!'
            }
        
            return JsonResponse(data)
    
    except Exception as e:
        print(e)
        data = {
            'success':False,
            'message' : f'Some Technical Error!!'
        }
    
        return JsonResponse(data)

@csrf_exempt
def get_user_stats(request):
    reports_today = 0
    reports_week = 0
    reports_month = 0
    drives_today = 0
    drives_week = 0
    drives_month = 0
    
    staff_id = request.GET.get('staff_id')
    today = date.today()
    print(staff_id)
    try:
        if(Company.objects.filter(placement_officer_id = staff_id)):
            company = Company.objects.filter(placement_officer_id = staff_id)
            company_lst = [item.company for item in company if item.placement_officer_id==staff_id]
            
            user_reports = Report.objects.filter(placement_officer_id = staff_id)
            
            user_drives = Drive.objects.filter(company__in = company_lst)
            
            reports = user_reports.filter(date = today)
            drives = user_drives.filter(date = today)
            reports_today = len(reports)
            drives_today = len(drives)
            
            reports = user_reports.filter(date__range = [today - timedelta(days=7), today])
            drives = user_drives.filter(date__range = [today - timedelta(days=7), today])
            reports_week = len(reports)
            drives_week = len(drives)
            
            reports = user_reports.filter(date__range = [today - timedelta(days=30), today])
            drives = user_drives.filter(date__range = [today - timedelta(days=30), today])
            reports_month = len(reports)
            drives_month = len(drives)
        
        data = {
            'success':True,
            'stats' : {
                'reports_today' : reports_today,
                'reports_week' : reports_week,
                'reports_month' : reports_month,
                'drives_today' : drives_today,
                'drives_week' : drives_week,
                'drives_month' : drives_month
            }
        } 
    
        return JsonResponse(data)
    
    except Exception as e:
        print(e)
        data = {
            'success': False,
            'stats' : {}
        }
        
        return JsonResponse(data)
    
def get_company_stats(request):
    staff_id = request.GET.get('staff_id')
    
    core, it_product, it_service, marketing, others = [], [], [], [], []
    
    companies = Company.objects.filter(placement_officer_id = staff_id)

    try:
        core = companies.filter(category='Core').values('company').distinct()
        it_product = companies.filter(category='IT - Product').values('company').distinct()
        it_service = companies.filter(category='IT - ES').values('company').distinct()
        marketing = companies.filter(category='Sales / Management').values('company').distinct()
        others = companies.filter(category='Others').values('company').distinct()
    
        print(it_service)
        
        data = {
            'success' : True,
            'stats' : {
                'core' : list(core),
                'it_product' : list(it_product),
                'it_service' : list(it_service),
                'marketing' : list(marketing),
                'others' : list(others)
            }
        }
        
        return JsonResponse(data)
    
    except Exception as e:
        print(e)
        data = {
            'success' : False,
            'stats' : {
                'core' : [],
                'it_product' : [],
                'it_service' : [],
                'marketing' : [],
                'others' : [] 
            }
        }
        
        return JsonResponse(data)


# -------------------------------------------------------------------------------

@csrf_exempt
def get_reports_by_company(request):
    company = request.GET.get('company')
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    staff_id = request.GET.get('staff_id')
    
    print(f'company : {company}\nstart_date : {start_date}\nend_date : {end_date}\nstaff_id : {staff_id}')
    try:
        reports = Report.objects.filter(company = company, date__range = [start_date, end_date]).order_by('-date')
        company = Company.objects.get(company = company)
        reports_lst = []
        a = 1
        for report in reports:
            # print()
            reports_lst.append(
                {
                    'pk' : report.pk,
                    'position' : a,
                    'date' : convert_date_format(report.date),
                    'company'  : report.company,
                    'status' : report.completed,
                    'message' : report.message,
                    'reminder_date' : None if report.reminder_date is None else convert_date_format(report.reminder_date),
                    'time' : UTCtoIST(str(report.timestamp))
                }
            )
            a+=1
        
        data = {
            'success' : True,
            'reports' : reports_lst
        }
        
        return JsonResponse(data)
    
    except  Exception as e:
        print(e)
        data = {
            'success' : False,
            'reports' : []
        }
        
        return JsonResponse(data)

def UTCtoIST(utc_time_string):
    utc_time = datetime.strptime(utc_time_string, '%Y-%m-%d %H:%M:%S.%f%z')

    ist_timezone = pytz.timezone('Asia/Kolkata')
    ist_time = utc_time.astimezone(ist_timezone)
    formatted_time = ist_time.strftime('%I:%M %p')
    return formatted_time

@csrf_exempt
def add_company(request):
    formdata = json.loads(request.body)
    company = formdata['company']
    hr_name = formdata['hr_name']
    hr_mail = formdata['hr_mail']
    category = formdata['category']
    staff_id = formdata['staff_id']
    website = formdata['website']
    hr_contact = formdata['hr_contact']
    lock_hr_mail = formdata['lock_hr_mail']
    lock_hr_contact = formdata['lock_hr_contact']
    
    message = formdata['message']
    reminder_date = formdata['reminder_date']
    today = date.today()
    reminder_date_obj = None if reminder_date=='' else datetime.strptime(reminder_date, '%d-%m-%Y').date()

    print(f'company : {company}\nhr_name : {hr_name}\nhr_mail : {hr_mail}\ncategory : {category}\nstaff_id : {staff_id}\nwebsite : {website}\nmessage : {message}\nreminder_date : {reminder_date}\ntoday : {today}')
    
    try:
        if(Company.objects.filter(company = company).exists()):
            data = {
                'success' : False,
                'message' : 'Company already exists!!'
            }
            return JsonResponse(data)
        else:
            report_obj = Report(
                date = today,
                company = company,
                placement_officer_id = staff_id,
                message = message,
                reminder_date = reminder_date_obj,
                completed = True if reminder_date_obj is None else False
            )
            
            company_obj = Company(
                company = company,
                HR_name = hr_name,
                HR_mail = hr_mail,
                placement_officer_id = staff_id,
                category = category,
                website = website,
                last_reminder_date = reminder_date_obj,
                HR_contact = hr_contact,
                lock_hr_mail = lock_hr_mail,
                lock_hr_contact = lock_hr_contact
            )            
            
            print(f'Reminder Date : {reminder_date_obj}') 
            company_obj.save()
            report_obj.save()

            data  = {
                'success' : True,
                'message' : 'Company added Successfully!!'
            }
            return JsonResponse(data)
            
    except Exception as e:
        print(e)
        data = {
            'success' : False,
            'message' : 'Some Technical Error!!'
        }
        return JsonResponse(data)

@csrf_exempt
def get_company_by_id(request):
    
    company = request.GET.get('company')
    
    try:
        company_obj = Company.objects.get(company = company)
        data = {
            'success' : True,
            'company' : company_obj
        }
        return JsonResponse(data)
    
    except Exception as e:
        print(e)
        data = {
            'success' : False,
            'company' : {}
        }
        return JsonResponse(data)

@csrf_exempt
def get_companies(request):
    staff_id = request.GET.get('staff_id')
    filter = request.GET.get('filter')
    role = request.GET.get('role')
    
    try:
        today = datetime.now().date()
        thirty_days_ago = today - timedelta(days=30)
        thirty_days_later = today + timedelta(days=30) 
        
        if filter=='Active':
            if(role=='Officer'):
                companies = Company.objects.filter(placement_officer_id = staff_id, last_reminder_date__range = [thirty_days_ago, thirty_days_later])
            else:
                companies = Company.objects.filter(last_reminder_date__range = [thirty_days_ago, thirty_days_later])
                
        else:
            if(role=='Officer'):
                companies = Company.objects.filter(placement_officer_id = staff_id)
            else:
                companies = Company.objects.all()
        
        res = list(companies.values())
        for company_obj in res:
            company_obj['name'] = PlacementOfficer.objects.get(staff_id = company_obj['placement_officer_id']).name
        
        data = {
            'success' : True,
            'companies' : res
        }
        return JsonResponse(data)
    
    except Exception as e:
        print(e)
        data = {
            'success' : False,
            'companies' : []
        }
        return JsonResponse(data)

@csrf_exempt
def update_company(request):
    formdata = json.loads(request.body)
    pk = formdata['pk']
    new_company = formdata['company']
    hr_name = formdata['hr_name']
    hr_mail = formdata['hr_mail']
    hr_contact = formdata['hr_contact']
    category = formdata['category']
    website = formdata['website']
    lock_hr_mail = formdata['lock_hr_mail']
    lock_hr_contact = formdata['lock_hr_contact']
    
    
    try:
        print(formdata)
        company_obj = Company.objects.get(pk = pk)
        company_name = company_obj.company
        # print(company_name)
        Report.objects.filter(company = company_name).update(company = new_company)
        Drive.objects.filter(company = company_name).update(company = new_company)
        # print(reports)
        company_obj.HR_name = hr_name
        company_obj.company = new_company
        company_obj.HR_mail = hr_mail
        company_obj.category = category
        company_obj.website = website
        company_obj.HR_contact = hr_contact
        company_obj.lock_hr_mail = lock_hr_mail
        company_obj.lock_hr_contact = lock_hr_contact
        company_obj.save()
        
        return JsonResponse({
            'success' : True,
            'message' : 'Company Updated Successfully!!'
        })
        
    except Exception as e:
        print(e)
        data = {
            'success' : False,
            'message' : 'Some Technical Error!!'
        }
        return JsonResponse(data)
    
@csrf_exempt
def delete_company(request):
    company = request.POST.get('company')
    
    try:
        company_obj = Company.objects.get(company = company)
        company_obj.delete()
        return JsonResponse({
            'success' : True,
            'message' : 'Company Deleted Successfully!!'
        })
    
    except Exception as e:
        print(e)
        data = {
            'success' : False,
            'message' : 'Some Technical Error!!'
        }
        return JsonResponse(data)  
    
@csrf_exempt
def add_and_update_company_report(request):
    
    formdata = json.loads(request.body)
    # print(formdata)
    pk = formdata['pk']
    company = formdata['company']
    staff_id = formdata['staff_id']
    message = formdata['message']
    reminder_date = formdata['reminder_date']
    report_date = formdata['date']
    reminder_date_obj = None if reminder_date=='' else datetime.strptime(reminder_date, '%Y-%m-%d').date()
    
    try:
        if(formdata['action'])=='add':
            today = date.today()    
            report_obj = Report(
                date = today,
                company = company,
                placement_officer_id = staff_id,
                message = message,
                reminder_date = reminder_date_obj,
                completed = True if reminder_date_obj is None else False
            )
            
            prev_report_obj = Report.objects.get(pk = pk)
            prev_report_obj.completed = True
            prev_report_obj.save()          
            
            company_obj = Company.objects.get(company = company)
            
            print(company_obj.last_reminder_date, reminder_date_obj)
            
            if(company_obj.last_reminder_date < reminder_date_obj):
                company_obj.last_reminder_date = reminder_date_obj
                company_obj.save()
                print('reminder date changed') 
            else:
                print('reminder date not changed')
            
            report_obj.save()
            
            data = {
                'success' : True,
                'message' : 'Follow-Up Added Successfully!!'
            }     
            return JsonResponse(data)
        
        else:
            report_obj = Report.objects.get(pk = pk)
            report_obj.message = message
            report_obj.date = datetime.strptime(report_date, '%Y-%m-%d').date()
            report_obj.reminder_date = reminder_date_obj
            report_obj.timestamp = timezone.now()
            report_obj.completed = True if reminder_date_obj is None else False
            
            report_obj.save()
            
            data = {
                'success' : True,
                'message' : 'Report Updated Successfully!!'
            }     
            return JsonResponse(data)
        
    except Exception as e:
        print(e)
        data = {
            'success' : False,
            'message' : 'Some Technical Error!!'
        }
        return JsonResponse(data)
    
@csrf_exempt
def delete_company_report(request):
    data = json.loads(request.body)
    report_id = data['pk']
    # print(formData)
    try:
        report = Report.objects.get(pk = report_id)
        report.delete()
        data = {
            'success':True,
            'message' : 'Report deleted Successfully!!'
        }
        return JsonResponse(data)
    
    except Exception as e:
        print(e)
    
        data = {
            'success':False,
            'message' : 'Some Technical Error!!'
        }
        
        return JsonResponse(data)

# Need to Make changes in this function
@csrf_exempt
def add_and_update_company_drive(request):
    formdata = request.POST
    
    pk = formdata['pk']
    company = formdata['company']
    date_str = formdata['date'] 
    job_role = formdata['job_role']
    description = formdata['description']
    mode = formdata['mode']
    ctc = formdata['ctc']
    
    filters = json.loads(formdata['filters'])
    # print(filters)
    
    checked_students = filters['checked_students']
    departments = formdata['eligible_depts'].split(',')  
    cur_round = filters['round']
    cur_round_name = formdata['round_name']
    date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
    
    
    
    try:     
        if(pk==''):   
            drive = Drive(
                job_role = job_role,
                date = date_obj,
                company = company,
                drive_mode = mode,
                description = description,
                departments = departments,
                ctc = float(ctc),
                filter_criteria = filters,
            )
            drive.drive_rounds.append(
                {
                    'num' : 0,
                    'name' : 'Eligible List',
                    
                }
            )
            
            drive.save()
            
            students = Student.objects.filter(reg_no__in=checked_students)
            drive.attended_students.set(students)
            
            
            # Update attended_drives field in Student model
            for student in students:
                student.attended_drives.add(drive)            
            
            data = {
                'success':True,
                'message' : f'{company} Drive added Successfully!!'
            }
            
            return JsonResponse(data)
        
        else:
            print('Edit Drive', pk)
            # print(formdata)
            
            final_round = filters['final_round']
            
            drive_obj = Drive.objects.get(pk=pk)
            
            drive_obj.job_role = job_role
            drive_obj.date = date_obj
            drive_obj.company = company
            drive_obj.drive_mode = mode
            drive_obj.description = description
            drive_obj.departments = departments
            drive_obj.ctc = float(ctc)
            
            drive_obj.save()
            # print(filters)
            
            if(cur_round>len(drive_obj.drive_rounds)-1):
                print('Adding new round')
                # print(checked_students)
                # Adding the new round to the drive_rounds field
                drive_rounds_data = drive_obj.drive_rounds
                drive_rounds_data.append(
                    {'num' : cur_round, 'name' : cur_round_name}
                )
                print(drive_rounds_data)
                drive_obj.drive_rounds = drive_rounds_data
                
                if(final_round):
                    drive_obj.completed = final_round
                
                DriveSelection.objects.filter(drive = drive_obj, student__reg_no__in = checked_students).update(round = cur_round)

                drive_obj.save()
            
         
                
            else:
                print('Updating Existing round')
                if(cur_round==0):
                    # the students should be removed from the attended_students field
                    pass
                else:
                    # the round field of the driveselection object of corresponding drive_pk and student_reg_no should be updated 
                    pass
                
            # if(cur_round==0):
            #     pass
            # already_selected_students = drive_obj.attended_students.all()
            # for student in already_selected_students:
            #     student.attended_drives.remove(drive_obj)
            # drive_obj.filter_criteria = filters
            
            # drive_obj.save()
            
            # students = Student.objects.filter(reg_no__in=checked_students)
            # drive_obj.attended_students.set(students)
            
            # # Update attended_drives field in Student model
            # for student in students:
            #     student.attended_drives.add(drive_obj)
            
            data = {
                'success':True,
                'message' : f'{company} Drive Updated Successfully!!'
            }
            
            return JsonResponse(data)
        
    except Exception as e:
        
        print('Exception : ',e)
        
        data = {
            'success':False,
            'message' : 'Some Technical Error !!'
        }
    
        return JsonResponse(data)

@csrf_exempt
def export_as_csv(request):
    if(request.method == 'POST'):
        formdata = json.loads(request.body)
        company = formdata['company']
        start_date = formdata['start_date']
        end_date = formdata['end_date']
        staff_id = formdata['staff_id']
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{company}_followup.csv"'
        
        staff_name =  PlacementOfficer.objects.get(staff_id = staff_id).name
        
        try:
            reports = Report.objects.filter(company = company, date__range = [start_date, end_date]).order_by('date')
            
            
            writer = csv.writer(response)
            writer.writerow(['S.No','Staff', 'Date','Time', 'Company', 'Message', 'Reminder Date', 'Status'])
            
            
            position = 1
            for report in reports:
                # print(UTCtoIST(str(report.timestamp)))
                writer.writerow([position, report.placement_officer_id, report.date, UTCtoIST(str(report.timestamp)), report.company, report.message, report.reminder_date, 'Completed' if report.completed else 'Not Completed'])
                position+=1
            
            
        except Exception as e:
            print(e)
        
        return response
    
    else:
        drive_id = int(request.GET.get('drive_id'))
        drive_round = int(request.GET.get('round'))
        print(f'Drive ID : {drive_id}, Round : {drive_round}')
        drive_obj = Drive.objects.get(pk=drive_id)

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="student_data.csv"'
        
        try:
            student_personal_data = drive_obj.attended_students.filter(driveselection__round__gt = drive_round-1).order_by('reg_no')
            writer = csv.writer(response)
            writer.writerow(['S.No','Reg No', 'Name', 'Email', 'Phone', 'Dept', 'Batch'])
            
            
            position = 1
            for student in student_personal_data:
                # print(UTCtoIST(str(report.timestamp)))
                writer.writerow([position, student.reg_no, student.name, student.mail, str(student.phone), student.dept, student.batch])
                position+=1
                
            
    
        except Exception as e:
            print(e)
            
        return response

@csrf_exempt
def delete_drive(request):
    drive_id = request.POST.get('drive_id')
    print(drive_id)
    
    try:
        drive = Drive.objects.get(pk=drive_id)
        company = drive.company
        drive.delete()
        data = {
            'success':True,
            'message' : f'{company} Drive Deleted Successfully!!'
        }
        return JsonResponse(data)
    
    except Exception as e:
        data = {
            'success':False,
            'message' : f'Some Technical Error !!'
        }
        return JsonResponse(data)


@csrf_exempt
def get_eligible_students(request):
    
    cur_round_name = ''
    
    if(request.method == 'POST'):
    
        formdata = json.loads(request.body)
        # print(formdata)
        # checked_students = formdata['checked_students']
        round = formdata['round']
        pk = formdata['drive_id']
        print(pk, round)
        
        
        eligible_students = Student.objects.all() 
        
        if(pk!=None):
            # print(f'Requesting for Drive - {pk}\nRound - {round}')
            # filter the students based on the round
            # If round exists in drive_rounds, then filter the students based on the round
            # else filter the students based on the previous round
            cur_round = int(round)
            drive = Drive.objects.get(pk=pk)
            drive_rounds = drive.drive_rounds
            
            
            # print(cur_round)
            prev_round = cur_round-1
            if(cur_round>len(drive_rounds)-1):
                eligible_students = eligible_students.filter(attended_drives__pk=pk, driveselection__round =prev_round )
                print(f'Filtering students for New Round = {cur_round}\nCount : {len(eligible_students)}')
            else:
                cur_round_name = drive_rounds[cur_round]['name']
                eligible_students = eligible_students.filter(attended_drives__pk=pk, driveselection__round__gt = prev_round-1)
                print(f'Filtering students for Existing Round = {cur_round}\nCount : {len(eligible_students)}')
        
        departments = formdata['departments']
        batch = formdata['batch']
        gender = formdata['gender']
        
        sslc = formdata['sslc']
        sslc_medium = sslc['medium']
        sslc_board = sslc['board']
        sslc_percent = sslc['percentage'] #array [min, max]
        
        hsc = formdata['hsc']
        hsc_enabled = hsc['enabled']
        hsc_medium = hsc['medium']
        hsc_board = hsc['board']
        hsc_percent = hsc['percentage'] #array [min, max]
        hsc_cutoff = hsc['cutoff'] #array [min, max]
        
        diploma = formdata['diploma']
        diploma_enabled = diploma['enabled']
        diploma_percent = diploma['percentage'] #array [min, max]
        
        ug = formdata['ug']
        cgpa = ug['cgpa'] #array [min, max]
        backlogs = ug['backlogs'] #array [history, standing]
        status = ug['status'] #array [placed, non-placed]
        
        # eligible_students = Student.objects.filter(department__in = formdata['departments'], cgpa__gte = formdata['cgpa'], arrears__lte = formdata['arrears'], placed = False)
    
        eligible_students = eligible_students.filter(
            placement_interested = True, 
            dept__in = departments, 
            batch = batch,
            gender__in = ['Male', 'Female'] if gender=='All' else [gender] 
        )
        
        # print(f'Count : {len(eligible_students)}')

        
        # print(status)
        if(status[0] and (not status[1])):
            eligible_students = eligible_students.filter(attended_drives__driveselection__selected=True)
        elif(status[1] and (not status[0])):
            eligible_students = eligible_students.filter(Q(attended_drives__driveselection__selected=False) | Q(attended_drives = None))
        
        eligible_students_id = eligible_students.values_list('reg_no', flat=True).distinct().order_by('reg_no')
        # print(f'Count : {len(eligible_students)}')
         
        eligible_students = StudentEdu.objects.filter(
            reg_no__in=eligible_students_id, 
            percent_10__range = sslc_percent,
            board_10__in = [sslc_board] if sslc_board != 'All' else ['CBSE', 'Others', 'State Board'], 
            medium_10__in = [sslc_medium] if sslc_medium!='All' else ['English', 'Tamil', 'Others'],
        ).order_by('reg_no')
        
        
        
        if(hsc_enabled):
            eligible_students = eligible_students.filter(
                percent_12__range = hsc_percent,
                cutoff_12__range = hsc_cutoff,
                board_12__in = [hsc_board] if hsc_board!='All' else ['CBSE', 'Others', 'State Board'],
                medium_12__in  = [hsc_medium] if hsc_medium!='All' else ['English', 'Tamil', 'Others'], 
            )
        else:
            eligible_students = eligible_students.filter(
                percent_diploma__range = diploma_percent,
            )
        
        # cgpa = [cgpa[0]+0.01, cgpa[1]+0.01]
        # print(cgpa)
        eligible_students_edu = eligible_students.filter(ug_cgpa__range = cgpa)
        
        # print(backlogs)
        
        if((not backlogs[0]) and (not backlogs[1])):
            eligible_students_edu = eligible_students_edu.filter(arrear_history = 0, standing_arrears = 0)
        
        
        print(f'Count : {len(eligible_students_edu)}')
        
        eligible_students_edu = eligible_students_edu.order_by('reg_no')
        eligible_students_id = eligible_students_edu.values_list('reg_no', flat=True).distinct()
        eligible_students_personal = Student.objects.filter(reg_no__in = eligible_students_id).order_by('reg_no')
        
        
        
        eligible_students = []
        
        position = 1
        checked_students = []
        
        drive_selection_objs = DriveSelection.objects.filter(drive__pk=pk, round__gt=round-1).values_list('student__reg_no', flat=True)
        checked_students = list(drive_selection_objs)
        
        print(checked_students)
        
        for student_personal, student_edu in zip(eligible_students_personal, eligible_students_edu):
            eligible_students.append({
                'checked': True if student_personal.reg_no in checked_students else False,
                'position':position,
                'reg_no' : student_personal.reg_no,
                'name' : student_personal.name,
                'dept' : student_personal.dept,
                'batch' : student_personal.batch,
                'gender' : student_personal.gender,
                'sslc' : {
                    'percent' : student_edu.percent_10,
                    'board' : student_edu.board_10,
                    'medium' : student_edu.medium_10
                },
                'hsc' : {
                    'percent' : student_edu.percent_12,
                    'cutoff' : student_edu.cutoff_12,
                    'board' : student_edu.board_12,
                    'medium' : student_edu.medium_12
                },
                'diploma' : {
                    'percent' : student_edu.percent_diploma
                },
                'ug' : {
                    'cgpa' : student_edu.ug_cgpa,
                    'percent' : student_edu.ug_percent,
                    'arrear_history' : student_edu.arrear_history,
                    'standing_arrears' : student_edu.standing_arrears,
                }
            })  
            position+=1  
        
        # for student in eligible_students.values():
        #     print(student)  
        
        print(f'Final Count : {len(eligible_students)}')
        
        data = {
            'success':True,
            'round_name' : cur_round_name,
            'filtered_students' : eligible_students
        }
        
        return JsonResponse(data)
    
    else: 
        print('Else Bruh!!')
        pk = int(request.GET.get('drive_id'))
        checked_students = request.GET.get('checked_students').split(',')
        cur_round = int(request.GET.get('cur_round'))
        
        students_personal = Student.objects.filter(reg_no__in = checked_students).order_by('reg_no')
        students_edu = StudentEdu.objects.filter(reg_no__in = checked_students).order_by('reg_no')
        
        
        
        eligible_students = []
        
        position = 1
        
        for student_personal, student_edu in zip(students_personal, students_edu):
            eligible_students.append({
                'checked': True if student_personal.reg_no in checked_students else False,
                'position':position,
                'reg_no' : student_personal.reg_no,
                'name' : student_personal.name,
                'dept' : student_personal.dept,
                'batch' : student_personal.batch,
                'gender' : student_personal.gender,
                'sslc' : {
                    'percent' : student_edu.percent_10,
                    'board' : student_edu.board_10,
                    'medium' : student_edu.medium_10
                },
                'hsc' : {
                    'percent' : student_edu.percent_12,
                    'cutoff' : student_edu.cutoff_12,
                    'board' : student_edu.board_12,
                    'medium' : student_edu.medium_12
                },
                'diploma' : {
                    'percent' : student_edu.percent_diploma
                },
                'ug' : {
                    'cgpa' : student_edu.ug_cgpa,
                    'percent' : student_edu.ug_percent,
                    'arrear_history' : student_edu.arrear_history,
                    'standing_arrears' : student_edu.standing_arrears,
                }
            })  
            position+=1  
       
        drive = Drive.objects.get(pk=pk)
        drive_rounds = drive.drive_rounds 
        prev_round = cur_round-1
        
        if(cur_round<=len(drive_rounds)-1):
            cur_round_name = drive_rounds[cur_round]['name']
        
        data = {
            'success':True,
            'round_name' : cur_round_name,
            'filtered_students' : eligible_students
        }
        
        return JsonResponse(data)
        # eligible_students_personal = Student.objects.filter(reg_no__in = checked_students.split(',')).order_by('reg_no')