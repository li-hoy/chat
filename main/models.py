from django.db import models
from django.contrib.auth.models import User

class Message(models.Model):
    sender = models.ForeignKey(User, related_name='senders', default=0, on_delete=models.CASCADE)
    recipient = models.ForeignKey(User, related_name='recipients', default=0, on_delete=models.CASCADE)
    text = models.TextField()
    date = models.DateTimeField()
