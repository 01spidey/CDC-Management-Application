# Generated by Django 4.2.2 on 2023-07-04 14:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0035_drive_ctc'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='placement_interested',
            field=models.BooleanField(default=True),
        ),
    ]
