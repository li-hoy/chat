# Generated by Django 4.2.10 on 2024-09-09 20:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_remove_message_person_message_recipient_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='message',
            old_name='message',
            new_name='text',
        ),
    ]
