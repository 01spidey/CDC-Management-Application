# Generated by Django 4.2.2 on 2023-06-28 14:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0026_remove_report_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='report',
            name='timestamp',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]