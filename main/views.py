from django.shortcuts import render
from main.models import Person
from django.http import JsonResponse

def experiments(request):
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

def messages(request):
    return JsonResponse({
        'messages': [
            {
                'author_id': 0,
                'interlocutor_id': 1,
                'content': 'my message 1',
            },
            {
                'author_id': 1,
                'interlocutor_id': 0,
                'content': 'his message 1',
            },
        ]
    })
