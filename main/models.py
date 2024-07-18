from django.db import models

class Person(models.Model):
    name = models.CharField(max_length=30)
    pass_hash = models.CharField(max_length=255, null=True)

class Message(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    message = models.TextField()
    date = models.DateTimeField()
