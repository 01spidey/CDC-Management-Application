# Generated by Django 4.2.2 on 2023-07-04 04:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0031_driveselection_studentedu_student_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='studentedu',
            name='board_12',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='studentedu',
            name='cutoff_12',
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name='studentedu',
            name='mark_10',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='studentedu',
            name='mark_12',
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name='studentedu',
            name='mark_diploma',
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name='studentedu',
            name='medium_12',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='studentedu',
            name='percent_10',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='studentedu',
            name='percent_12',
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name='studentedu',
            name='percent_diploma',
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name='studentedu',
            name='school_12',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='studentedu',
            name='ug_percent',
            field=models.FloatField(null=True),
        ),
    ]
