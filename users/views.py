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

    if not form.is_valid():
        raise forms.ValidationError(form.errors.as_text)
    
    user_data = form.cleaned_data

    if User.objects.filter(username=user_data['username']).exists():
        raise forms.ValidationError('Пользователь с таким логином уже зарегистрирован')
    
    user = form.save(commit=False)
    user.set_password(user_data['password'])
    user.save()

    user = authenticate(request, username=user_data['username'], password=user_data['password'])

    if not user or not user.is_active:
        raise forms.ValidationError("Ошибка аутентификации.")

    login(request, user)

    return HttpResponseRedirect(reverse('home'))


def login_user(request):
    if request.method == 'GET':
        form = LoginUserForm()
    elif request.method == 'POST':
        form = LoginUserForm(request.POST)
        
        if form.is_valid():
            user_data = form.cleaned_data

            user = authenticate(request, username=user_data['username'], password=user_data['password'])

            if user and user.is_active:
                login(request, user)
            else:
                form.add_error(None, 'Неправильный логин или пароль.')
    else:
        return Http404()

    return render(request, 'login.html', {'form': form})


def logout_user(request):
    logout(request)

    return HttpResponseRedirect(reverse('home'))
