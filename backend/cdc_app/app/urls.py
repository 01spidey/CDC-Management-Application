from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.test),
    path('add_admin',views.add_admin),
    path('login', views.login),
    path('add_member', views.add_member),
    path('load_members', views.load_members),
   
    path('get_drive_by_status', views.get_drive_by_status),
    path('get_drive_by_dateRange', views.get_drive_by_dateRange),
    path('delete_drive', views.delete_drive),
       
    path('get_report_summary', views.get_report_summary),
    
    path('get_notifications', views.get_notifications),
   
    path('get_member_by_id', views.get_member_by_id),
    path('update_member', views.update_member),
    path('delete_member', views.delete_member),
    path('get_user_stats', views.get_user_stats),
    path('get_company_stats', views.get_company_stats),

    
    path('send_otp', views.send_otp),
    path('update_credentials', views.update_credentials),
    
    
    
    
    path('add_company', views.add_company),
    path('get_company_by_id', views.get_company_by_id),
    path('update_company', views.update_company),
    path('delete_company', views.delete_company),
    path('get_companies', views.get_companies),
    
    path('get_reports_by_company', views.get_reports_by_company),
    path('add_and_update_company_report', views.add_and_update_company_report),
    path('delete_company_report', views.delete_company_report),
    path('export_as_csv', views.export_as_csv),
    
    path('add_and_update_company_drive', views.add_and_update_company_drive),
    
    path('get_eligible_students', views.get_eligible_students),
    path('publish_drive_mail', views.publish_drive_mail),
        
    path('get_placement_stats', views.get_placement_stats),
    path('get_company_category_stats', views.get_company_category_stats),
    path('get_charts_data', views.get_charts_data),
    path('add_remarks', views.add_remarks),
    
    path('get_dept_wise_report_data', views.get_dept_wise_report_data),
    path('get_visited_companies', views.get_visited_companies),
    path('get_student_data', views.get_student_data),
    
    path('get_placed_students', views.get_placed_students),
     
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)