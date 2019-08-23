from django.db import models
from djgeojson.fields import PointField, PolygonField

# Create your models here.

class ClosureArea(models.Model):
    STATES = (
        ('ME', 'Maine'),
        ('MA', 'Massachusetts'),
        ('NH', 'New Hampshire'),
    )

    name = models.CharField(max_length=100)
    state = models.CharField(max_length=50, choices=STATES, null=False, blank=True)
    geom = PolygonField()
    acres = models.DecimalField(max_digits=19, decimal_places=10, null=True)
    area_description = models.CharField(max_length=1000, null=True, blank=True)
    area_class = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        ordering = ['state', 'name']

    def __str__(self):
        return self.name
