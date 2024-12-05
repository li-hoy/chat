from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django import forms
from django.http import Http404, HttpResponseBadRequest, HttpResponseRedirect
from django.urls import reverse
from django.shortcuts import render
from users.forms.login_form import LoginUserForm
from users.forms.register_form import RegistrationUserForm


def register_user(request):
    if request.method == 'GET':
        form = RegistrationUserForm()

        return render(request, 'registration.html', {'form': form})
    elif request.method == 'POST':
        form = RegistrationUserForm(request.POST)

        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()

            return login_user(request)
        
        return render(request, 'registration.html', {'form': form})
    else:
        return Http404()


def login_user(request):
    if request.method == 'POST':
        form = LoginUserForm(request.POST)
        
        if form.is_valid():
            user_data = form.cleaned_data

            user = authenticate(request, username=user_data['username'], password=user_data['password'])

            if user and user.is_active:
                login(request, user)

            return HttpResponseRedirect(reverse('home'))
    else:
        return Http404()


def logout_user(request):
    logout(request)

    return HttpResponseRedirect(reverse('users:login'))
