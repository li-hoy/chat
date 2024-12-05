from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django import forms
from django.http import Http404, HttpResponseBadRequest, HttpResponseRedirect
from django.urls import reverse
from django.shortcuts import render
from users.forms.login_form import LoginUserForm
from users.forms.register_form import RegistrationUserForm


def register_user(request):
    if request.method != 'POST':
        return Http404()
    
    form = RegistrationUserForm(request.POST)

    if form.is_valid():
        user = form.save(commit=False)
        user.set_password(form.cleaned_data['password'])
        user.save()

    return login_user(request, form)


def login_user(request, form = None):
    if request.method == 'GET':
        form = form if form else LoginUserForm()
    elif request.method == 'POST':
        form = form if form else LoginUserForm(request.POST)
        
        if form.is_valid():
            user_data = form.cleaned_data

            user = authenticate(request, username=user_data['username'], password=user_data['password'])

            if user and user.is_active:
                login(request, user)

                return HttpResponseRedirect(reverse('home'))
            else:
                form.add_error(None, 'Неправильный логин или пароль.')
    else:
        return Http404()

    return render(request, 'login.html', {'form': form})


def logout_user(request):
    logout(request)

    return HttpResponseRedirect(reverse('users:login'))
