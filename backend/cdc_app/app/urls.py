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
    path('add_drive', views.add_drive),
    path('get_drive_by_dateRange', views.get_drive_by_dateRange),
    path('delete_drive', views.delete_drive),
    path('get_drive_by_id', views.get_drive_by_id),
    path('update_drive', views.update_drive),   
   
    path('add_report', views.add_report),
    path('delete_report', views.delete_report),
    path('update_report', views.update_report),
    path('get_reports', views.get_reports),
    path('get_members', views.get_members),
    path('get_report_by_id', views.get_report_by_id),
    
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
    
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)