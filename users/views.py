from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django import forms
from django.http import HttpResponse, Http404, HttpResponseBadRequest, HttpResponseRedirect, HttpResponseServerError
from django.shortcuts import render
from django.urls import reverse
from users.forms.login_form import LoginUserForm
from users.forms.register_form import RegistrationUserForm

def register_user(request):
    if request.method != 'POST':
        return Http404()
    
    form = RegistrationUserForm(request.POST)

    if not form.is_valid():
        return HttpResponseBadRequest()
    
    user_data = form.cleaned_data

    if User.objects.filter(username=user_data['username']).exists():
        return HttpResponse('Пользователь с таким логином уже зарегистрирован')
    
    user = form.save(commit=False)
    user.set_password(form.cleaned_data['password'])
    user.save()

    user = authenticate(request, username=user.username, password=user.password)

    if not user.is_active:
        return HttpResponseServerError()

    return HttpResponseRedirect(reverse('home'))


def login_user(request):
    if request.method != 'POST':
        return Http404()
    
    form = LoginUserForm(request.POST)
    
    if not form.is_valid():
        return HttpResponseBadRequest()
    
    user_data = form.cleaned_data
    user = authenticate(request, username=user_data['username'], password=user_data['password'])

    if not user or not user.is_active:
        raise forms.ValidationError("Неправильный логин или пароль.")
    
    login(request, user)

    return HttpResponseRedirect(reverse('home'))


def logout_user(request):
    logout(request)
    return HttpResponseRedirect(reverse('home'))
