# Generated by Django 4.2.2 on 2023-06-15 10:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_report_visibility'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='drive',
            name='title',
        ),
        migrations.AddField(
            model_name='drive',
            name='id',
            field=models.BigAutoField(auto_created=True,  primary_key=True, serialize=False, verbose_name='ID'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='drive',
            name='job_role',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
