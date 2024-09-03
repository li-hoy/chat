from django.db import models

class Person(models.Model):
    name = models.CharField(max_length=30)
    pass_hash = models.CharField(max_length=255, null=True)

class Message(models.Model):
    sender = models.ForeignKey(Person, related_name='senders', default=0, on_delete=models.CASCADE)
    recipient = models.ForeignKey(Person, related_name='recipients', default=0, on_delete=models.CASCADE)
    message = models.TextField()
    date = models.DateTimeField()
