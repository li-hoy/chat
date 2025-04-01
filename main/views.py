from django.shortcuts import render
from .models import Message
from django.http import JsonResponse, Http404
from django.utils import timezone
import json
from django.db.models import Q
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from users.forms.login_form import LoginUserForm

def home(request):
    context = {}

    if not request.user.is_authenticated:
        form_data = request.POST if request.method == 'POST' else None
        context['login_form'] = LoginUserForm(form_data)

    return render(request, 'home.html', context)


@login_required
def contacts(request):
    users = User.objects.exclude(id=request.user.id)

    return JsonResponse({
       'contacts': list(map(lambda user: {
            'id': user.id,
            'name': user.username,
        }, users))
    })


@login_required
def messages(request, recipient_id):
    if not recipient_id:
        return JsonResponse({
            'errors': [
                'wrong recipient'
            ]
        })

    my_id = request.user.id

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


@login_required
def add(request):
    sender_id = request.user.id
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

    messages = Message.objects.filter(
        (Q(sender=sender_id) & Q(recipient=recipient_id))
        | (Q(sender=recipient_id) & Q(recipient=sender_id))
    )

    return JsonResponse({
        'status': True,
        'messages': list(map(lambda m: {
            'sender_id': m.sender.id,
            'recipient_id': m.recipient.id,
            'date': m.date,
            'text': m.text,
        }, messages)),
    })


@login_required
def common(request):
    user = User.objects.get(id=request.user.id)

    if user is None:
        return Http404()

    return JsonResponse({
       'user': {
            'id': user.id,
            'name': user.username,
        }
    })
