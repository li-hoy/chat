import json

from asgiref.sync import sync_to_async
from django.db.models import Q
from django.http import JsonResponse
from django.utils import timezone
from .models import Message
from channels.generic.websocket import AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.group_name = f"chat_{self.user_id}"

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        # await self.send({"type": "websocket.accept"})


    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.group_name, self.channel_name)


    # Receive message from WebSocket
    async def receive(self, text_data):
        # Send message to room group
        await self.channel_layer.group_send(self.group_name, {
            "type": "chat.message",
            "message": json.loads(text_data)
        })


    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]
        recipient_id = message["recipient_id"]
        sended_at = message["sended_at"]
        text = message["text"]
        date = timezone.now()

        if not recipient_id:
            await self.send(text_data = json.dumps({
                'error': "No recipient_id",
            }))

            return

        if text == '':
            await self.send(text_data = json.dumps({
                'error': "No text",
            }))

            return

        message = Message(
            sender_id = self.user_id,
            recipient_id = recipient_id,
            text = text,
            date = date
        )

        await sync_to_async(message.save)()

        # messages = Message.objects.filter(
        #     (Q(sender=self.user_id) & Q(recipient=recipient_id))
        #     | (Q(sender=recipient_id) & Q(recipient=self.user_id))
        # )

        # Send message to WebSocket
        await self.send(text_data = json.dumps({
            "sender_id": self.user_id,
            "recipient_id": recipient_id,
            "text": text,
            "sended_at": sended_at,
            "date": date.isoformat(),
        }))
