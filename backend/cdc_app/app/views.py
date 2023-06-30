import json
from django.conf import settings
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import PlacementDirector,PlacementOfficer,Report, Drive, Company
from datetime import datetime, date, timedelta
from django.core.files.storage import FileSystemStorage
from django.contrib.sites.shortcuts import get_current_site
from django.db.models import Q
from django.core.mail import send_mail
from random import sample
from cryptography.fernet import Fernet
from django.utils import timezone
import pytz


# from models import PlacementDirector

# Create your views here.

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
            # print(drive.file.url)
            current_site = get_current_site(request)
            domain = current_site.domain
            file_url = f"{settings.MEDIA_URL}{drive.file}"
            file_absolute_url = f"http://{domain}{file_url}"
            drive_date = datetime.strptime(str(drive.date), '%Y-%m-%d').strftime('%d-%m-%Y')
            company_obj = Company.objects.get(company=drive.company)

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
                    'file' : file_absolute_url,
                    'category' : company_obj.category,
                    'lock_hr_mail' : company_obj.lock_hr_mail,
                    'lock_hr_contact' : company_obj.lock_hr_contact,
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
            # print(drive.file.url)
            current_site = get_current_site(request)
            domain = current_site.domain
            file_url = f"{settings.MEDIA_URL}{drive.file}"
            
            if(file_url=='/media/None' or file_url=='/media/'):
                file_url = '/media/file_uploads/empty.csv'
            
            file_absolute_url = f"http://{domain}{file_url}"
            drive_date = datetime.strptime(str(drive.date), '%Y-%m-%d').strftime('%d-%m-%Y')
            company_obj = Company.objects.get(company=drive.company)
            
            print(file_url)
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
                    'description' : drive.description,
                    'file' : file_absolute_url,
                    'completed' : True if status == 'Completed' else drive.date < today,
                    'category' : company_obj.category,
                    'lock_hr_mail' : company_obj.lock_hr_mail,
                    'lock_hr_contact' : company_obj.lock_hr_contact,
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
                                               
@csrf_exempt
def delete_drive(request):
    drive_id = request.POST.get('drive_id')
    print(drive_id)
    
    try:
        drive = Drive.objects.get(pk=drive_id)
        drive.delete()
        data = {
            'success':True,
            'message' : f'Drive added Successfully!!'
        }
        return JsonResponse(data)
    
    except Exception as e:
        data = {
            'success':False,
            'message' : f'Some Technical Error !!'
        }
        return JsonResponse(data)

@csrf_exempt
def get_drive_by_id(request):
    
    drive_id = request.GET.get('drive_id')
    # print(drive_id)
    
    drive_obj = {}
    
    try:
        drive = Drive.objects.get(pk=drive_id)
        current_site = get_current_site(request)
        domain = current_site.domain
        file_url = f"{settings.MEDIA_URL}{drive.file}"
        file_absolute_url = f"http://{domain}{file_url}"
        
        drive_obj = {
                    'id' : drive.pk,
                    'company' : drive.company,
                    'job_role': drive.job_role,
                    'mode': drive.drive_mode,
                    'date': drive.date,
                    'description' : drive.description,
                    'file' : (drive.file.name).split('/')[-1],
                    'completed' : True,
                }
        data = {
            'success':True,
            'drive' : drive_obj
        }
    
        return JsonResponse(data)
    
    except Exception as e:
        data = {
            'success':False,
            'drive' : {}
        }
    
        return JsonResponse(data)

 
@csrf_exempt
def update_drive(request):
    company = request.POST['company']
    job_role = request.POST['job_role']
    website = request.POST['website']
    hr_name = request.POST['hr_name']
    hr_mail = request.POST['hr_mail']
    description = request.POST['description']
    category = request.POST['category']
    mode = request.POST['mode']
    drive_id = int(request.POST['drive_id'])
    date_str = request.POST['date']
    date_obj = datetime.strptime(date_str, '%d-%m-%Y').date()
    
    try:    
        eligible_lst = request.FILES['eligible_lst']
        print(f'Update_drive : {category}')
        
        # print(company+"\n"+eligible_lst)
        
        updated_data = {
            'job_role' : job_role,
            'date' : date_obj,
            'company' : company,
            'website' : website,
            'HR_name'  : hr_name,
            'HR_mail' : hr_mail,
            'drive_mode' : mode,
            'description' : description,
            'file' : eligible_lst,
            'category' : category
        }
        
        Drive.objects.filter(pk=drive_id).update(**updated_data)
        
        data = {
                'success':True,
                'message' : f'Drive updated Successfully!!'
            }
        
        return JsonResponse(data)

    except Exception as e:
        # print(request.POST.get('eligible_lst'))
        updated_data = {
            'job_role' : job_role,
            'date' : date_obj,
            'company' : company,
            'website' : website,
            'HR_name'  : hr_name,
            'HR_mail' : hr_mail,
            'drive_mode' : mode,
            'description' : description,
            'category' : category
        }
    
        Drive.objects.filter(pk=drive_id).update(**updated_data)
        data = {
            'success':True,
            'message' : f'Drive updated Successfully!!'
        }
    
        return JsonResponse(data)
        
@csrf_exempt
def add_report(request):
    
    formData = json.loads(request.body)
    # print(formData)
    # {'company': 'vsv', 'date': '2023-06-17T18:30:00.000Z', 'hr_name': 'sdvsdv', 'hr_mail': 'abc@gmail.com', 'message': 'svsdvs', 'mode': 'sdvsv', 'visibility': 'Public', 'reminder': False, 'reminder_date': ''}
    
    
    try:
        company = formData['company']
        report_date = formData['date']
        hr_name = formData['hr_name']
        hr_mail = formData['hr_mail']
        mode = formData['mode']
        message = formData['message']
        reminder_date = formData['reminder_date']
        visibility = formData['visibility']
        staff_id = formData['staff_id']
        visible_to = formData['visible_to']
        category = formData['category']
        
        date_obj = datetime.strptime(report_date, '%d-%m-%Y').date()
        reminder_date_obj = None if reminder_date=='' else datetime.strptime(reminder_date, '%d-%m-%Y').date()
        
        # print(f'{company}\n{report_date}\n{hr_name}\n{hr_mail}\n{mode}\n{message}\n{reminder_date}\n{visibility}\n{visible_to}')
        
        report = Report(
            date = date_obj,
            placement_officer_id = staff_id,
            company = company,
            HR_name = hr_name,
            HR_mail = hr_mail,
            contact_mode = mode,
            message = message,
            reminder_date = reminder_date_obj,
            visibility = visibility,
            visible_to = visible_to,
            category = category
        )
        report.save()
        
        data = {
            'success':True,
            'message' : 'Report added Successfully!!'
        }
        
        return JsonResponse(data)
    
    except Exception as e:
        print(e)
        data = {
            'success':False,
            'message' : 'Some Technical Error!!'
        }
        
        return JsonResponse(data)
    


@csrf_exempt
def update_report(request):
    
    formData = json.loads(request.body)
    # print(formData)
    date_obj = datetime.strptime(formData['date'], '%d-%m-%Y').date()
    reminder_date_obj = None if formData['reminder_date']=='' else datetime.strptime(formData['reminder_date'], '%d-%m-%Y').date()
    
    try:
        updated_data = {
            'date' : date_obj,
            'placement_officer_id': formData['staff_id'],
            'company' : formData['company'],
            'HR_name': formData['hr_name'],
            'HR_mail' : formData['hr_mail'],
            'contact_mode' : formData['mode'],
            'message' : formData['message'],
            'reminder_date' : reminder_date_obj,
            'visibility' : formData['visibility'],
            'visible_to' : formData['visible_to'],
            'category' : formData['category']
        }
        
        # print(updated_data)
        
        Report.objects.filter(pk=formData['pk']).update(**updated_data)
        
    #     pk : this.pkey,
    #   company:this.addReportForm.value.company,
    #   date:formattedDate,
    #   hr_name:this.addReportForm.value.hr_name,
    #   hr_mail:this.addReportForm.value.hr_mail,
    #   message:this.addReportForm.value.message,
    #   mode : this.addReportForm.value.mode,
    #   visibility : this.vis_toggle,
    #   reminder_date : formattedReminderDate,
    #   staff_id : this.userData.user_id,
    #   visi
        
        data = {
                'success':True,
                'message' : f'Report updated Successfully!!'
            }
        
        return JsonResponse(data)
    
    except Exception as e:
        print(e)
        data = {
            'success':False,
            'message' : 'Some Technical Error!!'
        }
        
        return JsonResponse(data)
  
@csrf_exempt
def get_reports(request):
    
    reports = []
    try:
        if(request.method == 'POST'):
            filter_options = json.loads(request.body)
            category = filter_options['category']
            period = filter_options['period']
            startDate = filter_options['startDate']
            endDate = filter_options['endDate']
            visibility = filter_options['visibility']
            staff_id = filter_options['staff_id']

            report_lst = Report.objects.all()
            
            print(category, period, startDate, endDate, visibility, staff_id)
            

            if category == 'All':
                if period == 'Today':
                    print(date.today())
                    # Filter for today's reports with visibility for all
                    report_lst = report_lst.filter(
                        Q(date=date.today(), visible_to__contains=[staff_id]) | 
                        Q(date=date.today(), visibility='Public') |
                        Q(date=date.today(), placement_officer_id=staff_id)
                    )
                    
                    print(report_lst)
                else:
                    print(startDate, endDate)
                    # Filter based on start date and end date with visibility for all
                    report_lst = report_lst.filter(
                        Q(date__range=[startDate, endDate], visible_to__contains=[staff_id]) |
                        Q(date__range=[startDate, endDate], visibility='Public') |
                        Q(date__range=[startDate, endDate], placement_officer_id=staff_id)
                    )

            elif category == 'My':
                if period == 'Today':
                    if visibility == 'All':
                        # Filter for today's reports with visibility as public and for the specific staff_id
                        print(staff_id)
                        report_lst = report_lst.filter(date=date.today(), placement_officer_id=staff_id)
                    elif visibility == 'Private':
                        # Filter for today's reports with visibility as private and for the specific staff_id
                        report_lst = report_lst.filter(date=date.today(), visibility='Private', placement_officer_id=staff_id)
                else:
                    if visibility == 'All':
                        # Filter based on start date, end date, visibility as public, and for the specific staff_id
                        report_lst = report_lst.filter(date__range=[startDate, endDate],placement_officer_id=staff_id)
                    elif visibility == 'Private':
                        # Filter based on start date, end date, visibility as private, and for the specific staff_id
                        report_lst = report_lst.filter(date__range=[startDate, endDate], visibility='Private', placement_officer_id=staff_id)
            
            # reports_temp = list(report_lst)
            # print(reports_temp)
            a=1
            for report in report_lst:
                reports.append({
                    'position' : a,
                    'pk' : report.pk,
                    'date': report.date,
                    'staff_id': report.placement_officer_id,
                    'company': report.company,
                    'HR_name': report.HR_name,
                    'HR_mail': report.HR_mail,
                    'contact_mode': report.contact_mode,
                    'message': report.message,
                    'reminder_date': report.reminder_date,
                    'visibility': report.visibility
                })
                a+=1
            
            # report_lst = report_lst.values('pk', 'date', 'placement_officer_id', 'company', 'HR_name', 'HR_mail', 'contact_mode', 'message', 'reminder_date', 'visibility')

            data = {
                'success' : True,
                'reports' : reports
            }   
            
            return JsonResponse(data)
    
        elif(request.method == 'GET'):
            start_date = request.GET.get('start_date')
            end_date = request.GET.get('end_date')
            filter = request.GET.get('filter')
            report_lst = Report.objects.all()
            
            print(start_date, end_date, filter)
            
            if(filter=='Today'):
                report_lst = report_lst.filter(date=date.today())
            else:
                report_lst = report_lst.filter(date__range=[start_date, end_date])
                

            a=1
            for report in report_lst:
                reports.append({
                    'position' : a,
                    'pk' : report.pk,
                    'date': report.date,
                    'staff_id': report.placement_officer_id,
                    'company': report.company,
                    'HR_name': report.HR_name,
                    'HR_mail': report.HR_mail,
                    'contact_mode': report.contact_mode,
                    'message': report.message,
                    'reminder_date': report.reminder_date,
                    'visibility': report.visibility
                })
                a+=1
            
            data = {
                    'success' : True,
                    'reports' : reports
                }
            
            return JsonResponse(data)
    
    except Exception as e:
        print(e)
        data ={
            'success' : False,
            'reports' : reports,
        }
        
        return JsonResponse(data)

@csrf_exempt
def get_report_by_id(request):
    report_id = request.GET.get('report_id')
    report_obj = {}
    
    try:
        report = Report.objects.get(pk = report_id)
        
        date = report.date
        staff_id = report.placement_officer_id
        company = report.company
        HR_name = report.HR_name
        HR_mail = report.HR_mail
        contact_mode = report.contact_mode
        message = report.message
        reminder_date = report.reminder_date
        visibility = report.visibility
        visible_to = report.visible_to
        category = report.category
        
        print(f'{date}\n{reminder_date}\n{visibility}\n{visible_to}')
        
        data = {
            'success' : True,
            'report' : {
                'date' : date,
                'staff_id' : staff_id,
                'company' : company,
                'HR_name' : HR_name,
                'HR_mail' : HR_mail,
                'contact_mode' : contact_mode,
                'message' : message,
                'reminder_date' : reminder_date,
                'visibility' : visibility,
                'visible_to' : visible_to,
                'category' : category
                
            }
        }
        
        return JsonResponse(data)
        
        
    except Exception as e:
        print(e)
        data = {
            'success' : False,
            'report' : {}
        }
        
        return JsonResponse(data)

@csrf_exempt
def get_members(request):
    staff_ids = PlacementOfficer.objects.values_list('staff_id', flat=True).distinct()

    data = {
        'success': True,
        'members': list(staff_ids)
    }
    
    return JsonResponse(data)

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
    
    try:
        
        reports = Report.objects.filter(date = today, placement_officer_id = staff_id)
        drives = Drive.objects.filter(date = today, placement_officer_id = staff_id)
        reports_today = len(reports)
        drives_today = len(drives)
        
        reports = Report.objects.filter(date__range = [today - timedelta(days=7), today], placement_officer_id = staff_id)
        drives = Drive.objects.filter(date__range = [today - timedelta(days=7), today], placement_officer_id = staff_id)
        reports_week = len(reports)
        drives_week = len(drives)
        
        reports = Report.objects.filter(date__range = [today - timedelta(days=30), today], placement_officer_id = staff_id)
        drives = Drive.objects.filter(date__range = [today - timedelta(days=30), today], placement_officer_id = staff_id)
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
    
    core, it_product, it_service, marketing, others = [], [], [], [], []
    # reports = Report.objects.all()
    companies = Company.objects.all()

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
        reports = Report.objects.filter(company = company, placement_officer_id = staff_id, date__range = [start_date, end_date]).order_by('-date')
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
                    'reminder_date' : convert_date_format(report.reminder_date),
                    'hr_name' : company.HR_name,
                    'hr_mail' : company.HR_mail,
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
                completed = False
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
            
            print(lock_hr_contact, lock_hr_mail)
            
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
    
    try:
        today = datetime.now().date()
        thirty_days_ago = today - timedelta(days=30)
        thirty_days_later = today + timedelta(days=30) 
        
        if filter=='Active':
            companies = Company.objects.filter(placement_officer_id = staff_id, last_reminder_date__range = [thirty_days_ago, thirty_days_later])
        else:
            companies = Company.objects.filter(placement_officer_id = staff_id)
        
        data = {
            'success' : True,
            'companies' : list(companies.values())
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
                reminder_date = reminder_date,
                completed = False
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

@csrf_exempt
def add_company_drive(request):
    formdata = request.POST
    
    company = formdata['company']
    date_str = formdata['date']
    job_role = formdata['job_role']
    description = formdata['description']
    mode = formdata['mode']
     
    eligible_depts = formdata['eligible_depts']    
    date_obj = datetime.strptime(date_str, '%d-%m-%Y').date()
    
    try:
        eligible_lst = request.FILES['eligible_lst']
    except:
        eligible_lst = None
    
    departments = eligible_depts.split(',')
    
    print(f'company : {company}\ndate : {date_obj}\njob_role : {job_role}\ndescription : {description}\nmode : {mode}\neligible_lst : {eligible_lst}\neligible_depts : {departments}')
    
    # data = {
    #     'success':True,
    #     'message' : f'{company} drive added Successfully!!'
    # }
         
    # return JsonResponse(data)
   
    try:
        # company_obj = Company.objects.get(company = company)
        
        drive = Drive(
            job_role = job_role,
            date = date_obj,
            company = company,
            drive_mode = mode,
            description = description,
            file  = eligible_lst,
            departments = departments
        )
        
        drive.save()
        
        data = {
            'success':True,
            'message' : f'{company} drive added Successfully!!'
        }
        
        return JsonResponse(data)
        
    except Exception as e:
        
        print(e)
        
        data = {
            'success':False,
            'message' : 'Some Technical Error !!'
        }
    
        return JsonResponse(data)