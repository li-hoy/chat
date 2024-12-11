from django import forms
from django.contrib.auth import get_user_model

class RegistrationUserForm(forms.ModelForm):
    username = forms.CharField(label='Логин', widget=forms.TextInput(attrs={'class': 'form-input'}))
    password = forms.CharField(label='Пароль', widget=forms.PasswordInput(attrs={'class': 'form-input'}))
    password2 = forms.CharField(label='Повторите пароль', widget=forms.PasswordInput(attrs={'class': 'form-input'}))

    # class Meta:
    #     model = get_user_model()
    #     fields = ['username', 'password']
    #     labels = {
    #         'first_name': 'Имя',
    #         'last_name': 'Фамилия',
    #     }