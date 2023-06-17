from django.conf import settings
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import PlacementDirector,PlacementOfficer,Report, Drive
from datetime import datetime, date, timedelta
from django.core.files.storage import FileSystemStorage
from django.contrib.sites.shortcuts import get_current_site

# from models import PlacementDirector

# Create your views here.

@csrf_exempt
def test(request):
    data = {
        'message':'vanakkam Bruh!!'}
    
    return JsonResponse(data)

@csrf_exempt
def login(request):
    user_id = request.POST['user_id']
    password = request.POST['pass']
    role = request.POST['role']
    
    success = True
    
    message = "Login Successfull!!"
    
    user_data = {
        'user_id' : 'null',
        'name' : 'null',
        'mail' : 'null',
        'phone' : 'null',
        'staff_id' : 'null'
    }
    
    print(f'{user_id}\n{password}\n{role}')
    
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
def add_member(request):
    
    user_id = request.POST['staff_id']
    password = request.POST['staff_id']
    name = request.POST['name']
    mail = request.POST['mail']
    contact = request.POST['contact']
    staff_id = request.POST['staff_id']
    
    print(f'{user_id}\n{password}\n{name}\n{mail}\n{contact}\n{staff_id}')
    
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
            phone = '+91 '+contact,
            staff_id = staff_id
        )
        
        officer.save()
        
        
    data = {
        'success':True,
        'message' : 'Member added Successfully!!'
    }
    
    return JsonResponse(data)

@csrf_exempt
def load_members(request):
    team_lst = []
    
    for officer in PlacementOfficer.objects.all():
        team_lst.append(
            {
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
 
@csrf_exempt
def get_drive_by_status(request):
     
    drive_lst = []
    
    status = request.GET.get('status')
    print(status)
    today = date.today()


    # Retrieve the drives based on the status parameter
    try:
        drives = None
        
        if(status=='Today'):
            drives = Drive.objects.filter(date=today)
        elif(status=='Upcoming'):
            drives = Drive.objects.filter(date__gt=today)


        for drive in drives:
            print(drive.file.url)
            current_site = get_current_site(request)
            domain = current_site.domain
            file_url = f"{settings.MEDIA_URL}{drive.file}"
            file_absolute_url = f"http://{domain}{file_url}"
            drive_date = datetime.strptime(str(drive.date), '%Y-%m-%d').strftime('%d-%m-%Y')

            drive_lst.append(
                {
                    'id' : drive.pk,
                    'company' : drive.company,
                    'job_role': drive.job_role,
                    'mode': drive.drive_mode,
                    'date': drive_date,
                    'placement_officer_id': drive.placement_officer_id,
                    'website' : drive.website,
                    'HR_name' : drive.HR_name,
                    'HR_mail' : drive.HR_mail,
                    'description' : drive.description,
                    'file' : file_absolute_url
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
        print(f'{status}\n{start_date}\n{end_date}') 
        
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
            print(drive.file.url)
            current_site = get_current_site(request)
            domain = current_site.domain
            file_url = f"{settings.MEDIA_URL}{drive.file}"
            file_absolute_url = f"http://{domain}{file_url}"
            drive_date = datetime.strptime(str(drive.date), '%Y-%m-%d').strftime('%d-%m-%Y')

            drive_lst.append(
                {
                    'id' : drive.pk,
                    'company' : drive.company,
                    'job_role': drive.job_role,
                    'mode': drive.drive_mode,
                    'date': drive_date,
                    'placement_officer_id': drive.placement_officer_id,
                    'website' : drive.website,
                    'HR_name' : drive.HR_name,
                    'HR_mail' : drive.HR_mail,
                    'description' : drive.description,
                    'file' : file_absolute_url,
                    'completed' : True if status == 'Completed' else drive.date < today 
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
def add_drive(request):
    company = request.POST['company']
    job_role = request.POST['job_role']
    website = request.POST['website']
    hr_name = request.POST['hr_name']
    hr_mail = request.POST['hr_mail']
    description = request.POST['description']
    eligible_lst = request.FILES['eligible_lst']
    staff_id = request.POST['staff_id']
    mode = request.POST['mode']
    
    date_str = request.POST['date']
    date_obj = datetime.strptime(date_str, '%d-%m-%Y').date()
    current_date = date.today()
    
    try:
        drive = Drive(
            job_role = job_role,
            date = date_obj,
            placement_officer_id = staff_id,
            company = company,
            website = website,
            HR_name = hr_name,
            HR_mail = hr_mail,
            drive_mode = mode,
            description = description,
            file  = eligible_lst
        )
        
        data = {
            'success':True,
            'message' : f'{company} drive added Successfully!!'
        }
        
        drive.save()
        
        return JsonResponse(data)
        
    except Exception as e:
        
        print(e)
        
        data = {
            'success':False,
            'message' : 'Technical Error !!'
        }
    
        return JsonResponse(data)
    
    
    
    