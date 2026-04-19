import json
import redis
import jwt
from django.conf import settings
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .models import Prompt, Tag

redis_client = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, decode_responses=True)

@method_decorator(csrf_exempt, name='dispatch')
class PromptListView(View):
    def get(self, request):
        prompts = Prompt.objects.all().order_by('-created_at')
        return JsonResponse([p.to_dict() for p in prompts], safe=False)

    def post(self, request):
        try:
            data = json.loads(request.body)
            
            title = data.get('title', '')
            content = data.get('content', '')
            complexity = data.get('complexity', 5)
            tags_input = data.get('tags', '')

            if len(title) < 3:
                return JsonResponse({'error': 'Title must be at least 3 characters long.'}, status=400)
            if len(content) < 20:
                return JsonResponse({'error': 'Content must be at least 20 characters long.'}, status=400)
            if not isinstance(complexity, int) or complexity < 1 or complexity > 10:
                return JsonResponse({'error': 'Complexity must be an integer between 1 and 10.'}, status=400)

            prompt = Prompt.objects.create(
                title=title,
                content=content,
                complexity=complexity
            )
            
            if tags_input:
                # Handle comma-separated tags
                tag_names = [t.strip().lower() for t in tags_input.split(',') if t.strip()]
                for t_name in tag_names:
                    tag_obj, created = Tag.objects.get_or_create(name=t_name)
                    prompt.tags.add(tag_obj)
                    
            return JsonResponse(prompt.to_dict(), status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

class PromptDetailView(View):
    def get(self, request, pk):
        prompt = get_object_or_404(Prompt, pk=pk)
        
        # Redis View Counter logic
        redis_key = f"prompt:{pk}:views"
        view_count = redis_client.incr(redis_key)
        
        response_data = prompt.to_dict()
        response_data['view_count'] = view_count
        
        return JsonResponse(response_data)

    def delete(self, request, pk):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Unauthorized. Please provide a valid Bearer token.'}, status=401)
            
        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')
            user = User.objects.get(id=user_id)
            if not user.is_superuser:
                return JsonResponse({'error': 'Forbidden. Admin access required.'}, status=403)
        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Token has expired.'}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Invalid token.'}, status=401)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found.'}, status=401)

        prompt = get_object_or_404(Prompt, pk=pk)
        prompt.delete()
        return JsonResponse({'message': 'Prompt deleted successfully.'}, status=200)
