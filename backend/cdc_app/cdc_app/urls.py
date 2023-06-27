"""
URL configuration for cdc_app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('app.urls')),
    path('add_admin', include('app.urls')),
    path('login', include('app.urls')),
    path('add_member', include('app.urls')),
    path('load_members', include('app.urls')),
    
    path('get_drive_by_status', include('app.urls')),
    path('get_drive_by_dateRange', include('app.urls')),
    path('add_drive', include('app.urls')),
    path('delete_drive', include('app.urls')),
    path('get_drive_by_id', include('app.urls')),
    path('update_drive', include('app.urls')),
    
    path('add_report', include('app.urls')),
    path('delete_report', include('app.urls')),
    path('update_report', include('app.urls')),
    path('get_reports', include('app.urls')),
    
    path('get_members', include('app.urls')),
    path('get_report_by_id', include('app.urls')),
    
    path('get_report_summary', include('app.urls')),
    path('get_notifications', include('app.urls')),
    path('get_member_by_id', include('app.urls')),
    path('update_member', include('app.urls')),
    path('delete_member', include('app.urls')),
    path('get_user_stats', include('app.urls')),
    
    path('send_otp', include('app.urls')),
    path('update_credentials', include('app.urls')),
    path('get_company_stats', include('app.urls')),
    
    
    
    
    path('add_company', include('app.urls')),
    path('get_company_by_id', include('app.urls')),
    path('update_company', include('app.urls')),
    path('delete_company', include('app.urls')),
    path('get_companies', include('app.urls')),
    path('get_reports_by_company', include('app.urls')),
    
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
