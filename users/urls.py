app_name = "users"

from django.urls import path
from . import views

urlpatterns = [
    path('registration/', views.register_user, name='registration'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('profile/', views.profile_form_handler, name='profile'),
]