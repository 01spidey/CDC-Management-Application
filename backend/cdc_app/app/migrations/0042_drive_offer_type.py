# Generated by Django 4.2.2 on 2023-07-12 04:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0041_drive_completed'),
    ]

    operations = [
        migrations.AddField(
            model_name='drive',
            name='offer_type',
            field=models.CharField(default='Job', max_length=50),
        ),
    ]