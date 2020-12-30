# Generated by Django 3.0.10 on 2020-12-29 19:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stations', '0018_auto_20201126_1953'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='datapoint',
            name='species',
        ),
        migrations.AddField(
            model_name='datapoint',
            name='species_tested',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.DeleteModel(
            name='Species',
        ),
    ]
