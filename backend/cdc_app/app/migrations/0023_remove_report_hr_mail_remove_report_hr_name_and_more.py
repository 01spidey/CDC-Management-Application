# Generated by Django 4.2.2 on 2023-06-27 04:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0022_company_last_reminder_date'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='report',
            name='HR_mail',
        ),
        migrations.RemoveField(
            model_name='report',
            name='HR_name',
        ),
        migrations.RemoveField(
            model_name='report',
            name='category',
        ),
        migrations.RemoveField(
            model_name='report',
            name='visibility',
        ),
        migrations.RemoveField(
            model_name='report',
            name='visible_to',
        ),
    ]
