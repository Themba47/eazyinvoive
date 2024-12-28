from dj_rest_auth.registration.serializers import RegisterSerializer
from allauth.account.forms import SignupForm
from django.conf import settings

class CustomRegisterSerializer(RegisterSerializer):
    def save(self, request):
        pass