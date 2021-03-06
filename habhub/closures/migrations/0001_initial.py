# Generated by Django 2.2.4 on 2019-08-23 14:36

from django.db import migrations, models
import djgeojson.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ClosureArea',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('state', models.CharField(blank=True, choices=[('ME', 'Maine'), ('MA', 'Massachusetts'), ('NH', 'New Hampshire')], max_length=50)),
                ('geometry', djgeojson.fields.PolygonField()),
                ('acres', models.DecimalField(decimal_places=10, max_digits=19)),
                ('area_description', models.CharField(max_length=1000)),
                ('area_class', models.CharField(max_length=100)),
            ],
            options={
                'ordering': ['state', 'name'],
            },
        ),
    ]
