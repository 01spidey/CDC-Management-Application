# Generated by Django 4.2.2 on 2023-07-04 06:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0032_alter_studentedu_board_12_alter_studentedu_cutoff_12_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='studentedu',
            name='board_10',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='studentedu',
            name='mark_10',
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name='studentedu',
            name='medium_10',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='studentedu',
            name='percent_10',
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name='studentedu',
            name='school_10',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
