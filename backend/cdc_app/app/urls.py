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
    
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)