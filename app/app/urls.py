"""
URL configuration for app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
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
from django.urls import path, include
from core.apiviews import csrf_token_view, AddressAPIView, CompanyView, CustomRegisterView, CustomLoginView, CustomLogoutView, UploadLogo, TaxCompanyView

urlpatterns = [
    path('kwam/', admin.site.urls),
    path("accounts/", include("allauth.urls")),
    # path('api/auth/', include('dj_rest_auth.urls')),  # Login/logout
    path('api/auth/login/', CustomLoginView.as_view(), name='custom-login'),
    path('api/auth/logout/', CustomLogoutView.as_view(), name='custom_logout'),
    path('api/auth/registration/', CustomRegisterView.as_view(), name='custom-register'),
    path('api/address/', AddressAPIView.as_view(), name='create-address'),
    path('api/company/', CompanyView.as_view(), name='company_create_get'),  # For POST and GET all companies
    path('api/update-company-tax/', TaxCompanyView.as_view(), name='company_update_tax'),
    path('api/company/<int:company_id>/', CompanyView.as_view(), name='company_detail'),  # For GET a specific company
    path('api/upload-logo/', UploadLogo.as_view(), name='upload-logo'),
    path('api/csrf/', csrf_token_view, name='csrf'),
]
