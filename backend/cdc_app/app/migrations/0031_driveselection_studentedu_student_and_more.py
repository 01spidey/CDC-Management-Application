# Generated by Django 4.2.2 on 2023-07-03 17:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0030_remove_drive_hr_mail_remove_drive_hr_name_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='DriveSelection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('selected', models.BooleanField(default=False)),
                ('drive', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.drive')),
            ],
        ),
        migrations.CreateModel(
            name='StudentEdu',
            fields=[
                ('reg_no', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('mark_10', models.IntegerField()),
                ('mark_12', models.IntegerField()),
                ('percent_10', models.IntegerField()),
                ('percent_12', models.IntegerField()),
                ('board_10', models.CharField(max_length=50)),
                ('board_12', models.CharField(max_length=50)),
                ('medium_10', models.CharField(max_length=50)),
                ('medium_12', models.CharField(max_length=50)),
                ('cutoff_12', models.IntegerField()),
                ('mark_diploma', models.IntegerField(null=True)),
                ('percent_diploma', models.IntegerField(null=True)),
                ('school_10', models.CharField(max_length=50)),
                ('school_12', models.CharField(max_length=50)),
                ('college_diploma', models.CharField(max_length=50, null=True)),
                ('ug_cgpa', models.FloatField(null=True)),
                ('ug_percent', models.IntegerField(null=True)),
                ('arrear_history', models.IntegerField(null=True)),
                ('standing_arrears', models.IntegerField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('reg_no', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=50)),
                ('phone', models.CharField(max_length=50)),
                ('mail', models.EmailField(max_length=254)),
                ('dept', models.CharField(max_length=20)),
                ('dob', models.DateField()),
                ('gender', models.CharField(max_length=10)),
                ('batch', models.CharField(max_length=10)),
                ('drives', models.ManyToManyField(through='app.DriveSelection', to='app.drive')),
            ],
        ),
        migrations.AddField(
            model_name='driveselection',
            name='student',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.student'),
        ),
        migrations.AddField(
            model_name='drive',
            name='students',
            field=models.ManyToManyField(through='app.DriveSelection', to='app.student'),
        ),
    ]
