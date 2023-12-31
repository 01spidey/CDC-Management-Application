# Generated by Django 4.2.2 on 2023-06-26 15:44

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0019_report_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='drive',
            name='departments',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=100), blank=True, null=True, size=None),
        ),
        migrations.AddField(
            model_name='report',
            name='completed',
            field=models.BooleanField(default=False),
        ),
    ]
