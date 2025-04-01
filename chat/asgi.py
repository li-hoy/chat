"""
ASGI config for chat project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""
import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator

from django.core.asgi import get_asgi_application
from django.urls import re_path

from main import consumers

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chat.settings')

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': AllowedHostsOriginValidator(AuthMiddlewareStack(URLRouter([
        re_path("ws/(?P<user_id>\d+)", consumers.ChatConsumer.as_asgi()),
    ])))
})