from django.shortcuts import render
from main.models import Message
from main.models import Person
from django.http import JsonResponse
from django.utils import timezone
from django.core import serializers

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

def contacts(request):
    response = JsonResponse({
       'contacts': list(map(lambda p: {
            'id': p.id,
            'name': p.name,
        }, Person.objects.all()))
    })
    
    response.set_cookie('my_id', 1)

    return response

def messages(request, interlocutor_id):
    my_id = int(request.COOKIES.get('my_id'))

    filtered_messages = []

    messages = [
        {
            'author_id': 1,
            'interlocutor_id': 1,
            'content': 'my message 1',
        },
        {
            'author_id': 1,
            'interlocutor_id': 2,
            'content': 'his message 3',
        },
        {
            'author_id': 1,
            'interlocutor_id': 1,
            'content': 'my message 2',
        },
        {
            'author_id': 1,
            'interlocutor_id': 2,
            'content': 'his message 4',
        },
    ]

    for message in messages:
        if message['author_id'] == my_id and interlocutor_id == message['interlocutor_id']:
            filtered_messages.append(message)

    return JsonResponse({
        'messages': filtered_messages,
    });

def add(request):
    message = Message(
        sender_id = request.sender_id,
        recipient_id = request.recipient_id,
        message = request.message,
        date = timezone.now()
    )

    message.save()
