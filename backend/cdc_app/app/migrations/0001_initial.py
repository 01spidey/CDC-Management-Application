# Generated by Django 4.2.2 on 2023-06-13 08:23

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='PlacementDirector',
            fields=[
                ('user_id', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('password', models.CharField(max_length=50)),
                ('name', models.CharField(max_length=50)),
                ('mail', models.EmailField(max_length=254)),
                ('phone', models.CharField(max_length=50)),
                ('staff_id', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='PlacementOfficer',
            fields=[
                ('user_id', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('password', models.CharField(max_length=50)),
                ('name', models.CharField(max_length=50)),
                ('mail', models.EmailField(max_length=254)),
                ('phone', models.CharField(max_length=50)),
                ('staff_id', models.CharField(max_length=50, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Report',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(default=django.utils.timezone.now)),
                ('company', models.CharField(max_length=50)),
                ('website', models.URLField()),
                ('HR_name', models.CharField(max_length=50)),
                ('HR_mail', models.EmailField(max_length=254)),
                ('contact_mode', models.CharField(max_length=50)),
                ('message', models.TextField()),
                ('reminder_date', models.DateField(default=None, null=True)),
                ('placement_officer_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.placementofficer', to_field='staff_id')),
            ],
            options={
                'ordering': ['-date'],
            },
        ),
    ]
