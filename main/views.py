from django.shortcuts import render
from main.models import Person

def root(request):
    try:
        p = Person.objects.get(id = 2)
        name = p.name
    except:
        name = '-'
   
    context = {
        "content": name,
    }
    return render(request, 'title.html', context)

def chat(request):
    context = {
        "title": 'chat',
    }

    return render(request, 'chat.html', context)