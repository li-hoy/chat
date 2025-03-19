from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import Http404, HttpResponseRedirect
from django.urls import reverse
from django.shortcuts import render
from users.forms.login_form import LoginUserForm
from users.forms.register_form import RegistrationUserForm
from users.forms.profile_form import ProfileForm


def register_user(request):
    if request.method not in ('GET', 'POST'):
        return Http404()

    if request.method == 'GET':
        form = RegistrationUserForm()
    
    if request.method == 'POST':
        form = RegistrationUserForm(request.POST)

        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()

            return login_user(request)
        
    return render(request, 'registration.html', {'form': form})


def login_user(request):
    if request.method not in ('GET', 'POST'):
        return Http404()

    if request.method == 'GET':
        form = LoginUserForm()
    
    if request.method == 'POST':
        form = LoginUserForm(request.POST)
        
        if form.is_valid():
            user_data = form.cleaned_data
            user = authenticate(request, username=user_data['username'], password=user_data['password'])

            if user and user.is_active:
                login(request, user)

                return HttpResponseRedirect(reverse('home'))
            
            form.add_error('username', 'Неправильный логин или пароль')

    return render(request, 'login.html', {'form': form})


@login_required
def logout_user(request):
    logout(request)

    return HttpResponseRedirect(reverse('home'))


def profile_form_handler(request):
    if request.method not in ('GET', 'POST'):
        return Http404()

    if request.method == 'GET':
        form = ProfileForm()
    
    if request.method == 'POST':
        form = ProfileForm(request.POST)
        
        if form.is_valid():
            user_data = form.cleaned_data
            user = authenticate(request, username=user_data['username'], password=user_data['password'])

            if user and user.is_active:
                user.email = user_data['email']

                user.save()

    return render(request, 'profile.html', {'form': form})

