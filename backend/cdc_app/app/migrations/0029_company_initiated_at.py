# Generated by Django 4.2.2 on 2023-06-28 14:59

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0028_alter_report_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='initiated_at',
            field=models.DateField(default=django.utils.timezone.now),
        ),
    ]