from django.shortcuts import render
from main.models import Message
from main.models import Person
from django.http import JsonResponse
from django.utils import timezone
from django.core import serializers
import json
from django.db.models import Q

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

    return JsonResponse({
       'contacts': list(map(lambda p: {
            'id': p.id,
            'name': p.name,
        }, persons))
    })

def messages(request, recipient_id):
    if not recipient_id:
        return JsonResponse({
            'errors': [
                'wrong recipient'
            ]
        })

    my_id = int(request.COOKIES.get('my_id'))

    messages = Message.objects.filter(
        (Q(sender=my_id) & Q(recipient=recipient_id))
        | (Q(sender=recipient_id) & Q(recipient=my_id))
    )

    return JsonResponse({
       'messages': list(map(lambda m: {
            'sender_id': m.sender.id,
            'recipient_id': m.recipient.id,
            'date': m.date,
            'text': m.text,
        }, messages))
    })


def add(request):
    sender_id = int(request.COOKIES.get('my_id'))

    request_data = json.loads(request.body)

    recipient_id = int(request_data['recipient_id'] or 0)

    if not recipient_id or request_data['text'] == '':
        return JsonResponse({
            'status': False,
        })

    message = Message(
        sender_id = sender_id,
        recipient_id = recipient_id,
        text = request_data['text'],
        date = timezone.now()
    )

    message.save()

    return JsonResponse({
        'status': True,
    })
