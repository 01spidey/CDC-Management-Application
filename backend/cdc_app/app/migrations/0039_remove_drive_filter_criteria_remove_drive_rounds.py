# Generated by Django 4.2.2 on 2023-07-07 14:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0038_drive_rounds_driveselection_round'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='drive',
            name='filter_criteria',
        ),
        migrations.RemoveField(
            model_name='drive',
            name='rounds',
        ),
    ]
