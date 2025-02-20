"""
Django settings for app project.

Generated by 'django-admin startproject' using Django 5.1.4.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

import os
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-8mz93#hhc@#cxc1!t^83t$6)j_ar28_7c8qn=p2wbz=mji-q@p'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG')

ALLOWED_HOSTS = ['192.168.1.105', 'localhost', '127.0.0.1'] # ['*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.sites',
    'django.contrib.staticfiles',
    #internal
    'core',
    'myaccount',
    #external
    'django_sonar',
    'crispy_forms',
    'django_filters',
    'pwa',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.microsoft',
    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',
    'dj_rest_auth',
    'dj_rest_auth.registration'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

CORS_ALLOW_METHODS = (
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
)

# https://github.com/adamchainz/django-cors-headers
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGIN = [
    "http://127.0.0.1:8081",
    "http://192.168.1.105:8083",
]

CSRF_TRUSTED_ORIGINS = [
	"http://localhost:8083",
	"http://127.0.0.1:8083",
	"https://www.moloai.com",
    "http://192.168.1.105:8083",
]

HEALTH_CHECK = {
    'DISK_USAGE_MAX': 90,
    'MEMORY_MIN': 100,
}

ROOT_URLCONF = 'app.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                # 'core.context_processor.price'
            ],
        },
    },
]

WSGI_APPLICATION = 'app.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

DATABASES = {
	'default': {
		'ENGINE': 'django.db.backends.sqlite3',
		'NAME': BASE_DIR / 'db.sqlite3',
		#postgresql
		# 'ENGINE': 'django.db.backends.postgresql',
		# 'HOST': os.environ.get('DB_HOST'),
		# 'PORT': os.environ.get('DB_PORT', 5432),
		# 'NAME': os.environ.get('DB_NAME'),
		# 'USER': os.environ.get('DB_USER'),
		# 'PASSWORD': os.environ.get('DB_PASS'),
	}
}

print(os.environ.get('SITE_ID') + " "+ os.environ.get('DB_NAME') + " " + os.environ.get('DB_PORT'))

AUTHENTICATION_BACKENDS = [
    # Needed to login by username in Django admin, regardless of `allauth`
    'django.contrib.auth.backends.ModelBackend',

    # `allauth` specific authentication methods, such as login by e-mail
    'allauth.account.auth_backends.AuthenticationBackend',
]


# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

ACCOUNT_FORMS = {
	'signup': 'myaccount.forms.CustomSignupForm',
}

AUTH_USER_MODEL = 'myaccount.CustomUser'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        # 'rest_framework.authentication.TokenAuthentication',
    ],
}

REST_AUTH = {
    'USE_JWT': True,
    'REGISTER_SERIALIZER': 'myaccount.serializer.CustomRegisterSerializer',
}


SESSION_COOKIE_AGE = 24 * 60*60 #24h
PASSWORD_RESET_TIMEOUT = 3 * (24 * 60*60) #days
SITE_ID = int(os.environ.get('SITE_ID',1))
LOGIN_REDIRECT_URL = '/dashboard'
ACCOUNT_LOGOUT_REDIRECT_URL ="/accounts/login"
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION='optional'
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_NAME_REQUIRED = True
ACCOUNT_FIRST_NAME_MIN_LENGTH = 1
ACCOUNT_LAST_NAME_MIN_LENGTH = 1

# SOCIALACCOUNT_PROVIDERS = {
#     'google': {
#         'APP': {
#             'client_id': os.environ.get('GOOGLE_SOCIALACCOUNT_CLIENT_ID'),
#             'secret': os.environ.get('GOOGLE_SOCIALACCOUNT_SECRET'),
#         },
#         'SCOPE': [
#             'profile',
#             'email',
#             # 'https://www.googleapis.com/auth/gmail.send',
#             ],
#         'AUTH_PARAMS': {
#             'access_type': 'online',
#         },
#     },
#     # 'microsoft': {
#     #     'APP': {
#     #         'client_id': os.environ.get('MICROSOFT_OUTLOOK_CLIENT_ID'),
#     #         'secret': os.environ.get('MICROSOFT_OUTLOOK_SECRET_KEY'),
#     #     },
#     #     'SCOPE': [
#     #         'User.Read',
#     #         'Mail.Send',
#     #     ],
#     #     'AUTH_PARAMS': {
#     #         'response_type': 'code',
#     #     }
#     # },
# }

ACCOUNT_ADAPTER = 'allauth.account.adapter.DefaultAccountAdapter'
SOCIALACCOUNT_ADAPTER = 'allauth.socialaccount.adapter.DefaultSocialAccountAdapter'

GOOGLE_OAUTH2_CLIENT_SECRETS_JSON = os.path.join(BASE_DIR, 'client_secret.json')
GOOGLE_OAUTH2_SCOPES = ['https://www.googleapis.com/auth/gmail.send']

SOCIALACCOUNT_LOGIN_ON_GET = True
SOCIALACCOUNT_QUERY_EMAIL = True
SOCIALACCOUNT_LINKEDIN_KEY = '772oztr6e6r7jf'
SOCIALACCOUNT_LINKEDIN_SECRET = 'xUldciCh47hJPU1i'
# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Africa/Johannesburg'

USE_I18N = True

USE_TZ = True

# Accessing the email email.moloai.com
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587

EMAIL_USE_TLS = True
# EMAIL_HOST_USER = 'themba@moloai.com'
# EMAIL_HOST_PASSWORD = 'ymjxkbdlzdguptgf'

EMAIL_HOST_USER = 'sishubats@gmail.com'
EMAIL_HOST_PASSWORD = 'yqqvbzfqtutbwvnj'

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = '/static/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media') # used to access the file
MEDIA_URL = '/media/' # used when file is uploaded, it is directed here
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
UPLOAD_FILES = 'resources'
UPLOAD_APPS = 'apps'
EMAIL_NEWSLETTER = 'emailnewsletter'
QR_CODE = 'qr-code'
COMPANY_LOGO = 'logos'
RECORDS = 'records'
UPLOAD_PICS = 'profile_pics'
INVOICE = 'invoice'
CREATED_INVOICE = 'created_invoice'
DB_BACKUP = 'db_backup'

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field


SESSION_KEYS = ["theUser"]

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

YOCO_KEY = os.environ.get('YOCO_KEY')
OPEN_API_KEY = os.environ.get('OPEN_API_KEY')

AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')

TRANSLATE_KEY = os.environ.get('TRANSLATE_KEY')
TRANSLATE_LOCATION = os.environ.get('TRANSLATE_LOCATION')

MOLOAI_PRICE = int(os.environ.get('MOLOAI_PRICE'))

AZURE_FUNDA_KEY = os.environ.get('AZURE_FUNDA_KEY')
AZURE_FUNDA_ENDPOINT = os.environ.get('AZURE_FUNDA_ENDPOINT')

PAYFAST = {
"merchant_id":"12847760",
"merchant_key":"zrtnw9btioujt",
"amount":"500",
"item_name":"Test Product",
"return_url":"https://www.moloai.com/payment/?url=success",
"cancel_url":"https://www.moloai.com/payment/?url=cancel",
"notify_url":"https://www.moloai.com/payment",
"email_address": "",
"email_confirmation":"1",
"confirmation_address":"themba@moloai.com",
"subscription_type":"1",
"recurring_amount":"23.45",
"frequency":"3",
"cycles":"12",
"subscription_notify_email":"true",
"subscription_notify_webhook":"true",
"subscription_notify_buyer":"true",
}

CM_KEY = os.environ.get('CM_KEY')

# Celery Configuration
# CELERY_BROKER_URL = f"amqps://{os.environ.get('RABBITMQ_USERNAME')}:{os.environ.get('RABBITMQ_PASSWORD')}@{os.environ.get('RABBITMQ_HOST')}.mq.{os.environ.get('RABBITMQ_REGION')}.amazonaws.com:5671/"
CELERY_BROKER_URL = 'redis://default:4pUA4QwzHR1cpQsXhYKC5lXL01G8YlvK@redis-15201.c274.us-east-1-3.ec2.cloud.redislabs.com:15201'
# CELERY_BROKER_URL = f"amqps://{os.environ.get('RABBITMQ_USERNAME')}:{os.environ.get('RABBITMQ_PASSWORD')}@{os.environ.get('RABBITMQ_HOST')}:{os.environ.get('RABBITMQ_PORT')}/"
# CELERY_BROKER_URL = 'amqp://guest@localhost:5672/'
CELERY_RESULT_BACKEND = 'redis://default:4pUA4QwzHR1cpQsXhYKC5lXL01G8YlvK@redis-15201.c274.us-east-1-3.ec2.cloud.redislabs.com:15201'
CELERY_CACHE_BACKEND = 'default'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = TIME_ZONE
CELERY_TASK_TRACK_STARTED = True
CELERY_ENABLE_UTC = True

# import redis

# r = redis.Redis(
#   host='redis-15201.c274.us-east-1-3.ec2.cloud.redislabs.com',
#   port=15201,
#   password='4pUA4QwzHR1cpQsXhYKC5lXL01G8YlvK')

# celery setting.
CELERY_CACHE_BACKEND = 'default'

# django setting.
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
        'LOCATION': 'my_cache_table',
    }
}

MOLOAI_PROCESS = os.environ.get('MOLOAI_PROCESS')

SITE_DOMAIN = os.environ.get('DOMAIN')

EXCHANGE_RATE_KEY = os.environ.get('EXCHANGE_RATE_KEY')
ZAR = ("ZAR", 19.99)
USD = ("USD", 9.99)
EUR = ("EUR", 9.99)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': 'django_error.log',  # Path to the log file
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}