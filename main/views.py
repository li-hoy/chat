from django.shortcuts import render
from main.models import Message
from main.models import Person
from django.http import JsonResponse
from django.utils import timezone
from django.core import serializers
import json

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
    my_id = 3

    context = {
        "my_id": my_id,
        "title": 'chat',
    }

    response = render(request, 'chat.html', context)

    response.set_cookie('my_id', 3)

    return response


def contacts(request):
    my_id = int(request.COOKIES.get('my_id'))

    persons = Person.objects.exclude(id=my_id)

    response = JsonResponse({
       'contacts': list(map(lambda p: {
            'id': p.id,
            'name': p.name,
        }, persons)) #exclude(my_id).values()
    })

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
    })

def add(request):
    sender_id = int(request.COOKIES.get('my_id'))

    request_data = json.loads(request.body)

    message = Message(
        sender_id = sender_id,
        recipient_id = int(request_data['recipient_id']),
        text = request_data['text'],
        date = timezone.now()
    )

    message.save()

    return JsonResponse({
        'status': True,
    })
