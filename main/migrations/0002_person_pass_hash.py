# Generated by Django 4.2.10 on 2024-03-27 19:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='person',
            name='pass_hash',
            field=models.CharField(max_length=255, null=True),
        ),
    ]