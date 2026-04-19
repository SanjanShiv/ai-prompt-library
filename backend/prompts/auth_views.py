import json
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return JsonResponse({'error': 'Please provide both email and password.'}, status=400)

            user = authenticate(request, username=email, password=password)
            if user is not None:
                payload = {
                    'user_id': user.id,
                    'email': user.email,
                    'is_admin': user.is_superuser,
                    'exp': datetime.utcnow() + timedelta(days=1),
                    'iat': datetime.utcnow(),
                }
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
                
                return JsonResponse({
                    'message': 'Login successful',
                    'token': token,
                    'email': user.email,
                    'is_admin': user.is_superuser
                })
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=401)
                
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class SignupView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            password = data.get('password')

            if not name or not email or not password:
                return JsonResponse({'error': 'Please provide name, email, and password.'}, status=400)

            if User.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email already exists.'}, status=400)

            user = User.objects.create_user(
                username=email,  # Use email as username for simplicity
                email=email,
                password=password,
                first_name=name
            )
            
            return JsonResponse({
                'message': 'Signup successful',
                'user_id': user.id
            }, status=201)
                
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
