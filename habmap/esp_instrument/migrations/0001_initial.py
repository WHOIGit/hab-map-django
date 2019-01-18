# Generated by Django 2.0.9 on 2019-01-07 20:13

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='EspInstrument',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('esp_name', models.CharField(max_length=100)),
            ],
            options={
                'ordering': ['esp_name'],
            },
        ),
    ]