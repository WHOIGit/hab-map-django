# Generated by Django 2.2.4 on 2019-09-16 16:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('closures', '0016_auto_20190906_1353'),
    ]

    operations = [
        migrations.CreateModel(
            name='CausativeOrganism',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
            options={
                'ordering': ['name'],
            },
        ),
    ]
