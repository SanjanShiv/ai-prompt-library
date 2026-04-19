from django.contrib import admin
from django.urls import path
from prompts.views import PromptListView, PromptDetailView
from prompts.auth_views import LoginView, SignupView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', LoginView.as_view(), name='login'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('prompts/', PromptListView.as_view(), name='prompt-list'),
    path('prompts/<uuid:pk>/', PromptDetailView.as_view(), name='prompt-detail'),
]
