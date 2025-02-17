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
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views_email_extract_api import *
from core.viewsets import *
from core.apiviews import *

router = DefaultRouter()

# Register the viewsets with the router
# router.register(r'achievements', AchievementViewSet)
# router.register(r'categories', CategoryViewSet)
# router.register(r'games_played', GamesPlayedViewSet)
# router.register(r'questions', QuestionViewSet)
router.register(r'address-patch', AddressViewSet)
router.register(r'company-patch', CompanyViewSet, basename='company')
router.register(r'profile', UserViewSet, basename='user-profile')

urlpatterns = [
    path('kwam/', admin.site.urls),
    path('django-sonar/', include('django_sonar.urls')),
    path("accounts/", include("allauth.urls")),
    # path('api/auth/', include('dj_rest_auth.urls')),  # Login/logout
    path('api/', include(router.urls)),
    path('api/auth/login/', CustomLoginView.as_view(), name='custom-login'),
    path('api/auth/logout/', CustomLogoutView.as_view(), name='custom_logout'),
    path('api/auth/registration/', CustomRegisterView.as_view(), name='custom-register'),
    path('api/add-job/', AddJobAPIView.as_view(), name="add-job"),
    path('api/address/', AddressAPIView.as_view(), name='create-address'),
    path('api/address/<int:company_id>/', AddressAPIView.as_view(), name='address'),
    path('api/jobs/<int:user_id>/', JobsAPIView.as_view(), name="jobs"),
    path('api/jobs/delete/<int:pk>/', JobsAPIView.as_view(), name='jobs'),  # For GET a specific company
    path('api/company/', CompanyView.as_view(), name='company_create_get'),  # For POST and GET all companies
    path('api/update-company-tax/', TaxCompanyView.as_view(), name='company_update_tax'),
    path('api/company/<int:company_id>/', CompanyView.as_view(), name='company_detail'),  # For GET a specific company
    path('api/upload-logo/', UploadLogo.as_view(), name='upload-logo'),
    path('api/billto/', BillToView.as_view(), name='bill-to'),
    path('api/billto/<int:user_id>/', BillToView.as_view(), name='bill-to'),
    path('api/invoices/', InvoiceTemplateView.as_view(), name='invoice-templates'),
    path('api/invoices/<int:invoiceId>/', InvoiceTemplateView.as_view(), name='invoice-templates'),
    path('api/userdetails/', UserDetailsAPIView.as_view(), name='user-details'),
    path('api/signature/', UploadSignature.as_view(), name="upload-siganture"),
    path('api/csrf/', csrf_token_view, name='csrf'),
    # ******************************** EMAIL EXTRACT ****************************************
    path('api/email-extract/', EmailExtractAPIView.as_view(), name="email-extract")
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
