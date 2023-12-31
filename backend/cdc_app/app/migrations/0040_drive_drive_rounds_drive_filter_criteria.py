# Generated by Django 4.2.2 on 2023-07-07 14:17

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0039_remove_drive_filter_criteria_remove_drive_rounds'),
    ]

    operations = [
        migrations.AddField(
            model_name='drive',
            name='drive_rounds',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.JSONField(null=True), default=list, size=None),
        ),
        migrations.AddField(
            model_name='drive',
            name='filter_criteria',
            field=models.JSONField(null=True),
        ),
    ]
