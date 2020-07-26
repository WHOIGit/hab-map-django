from django.contrib.gis.db import models
from django.contrib.postgres.fields import ArrayField, JSONField
from django.utils import timezone

# IFCB dataset models

class Dataset(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100, null=False, blank=True)
    geom =  models.PointField(srid=4326, null=True, blank=True)
    # the lookup name from the IFCB dashboard
    dashboard_id_name = models.CharField(max_length=100)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return F'{self.name} - {self.location}'


class Bin(models.Model):
    ALEXANDRIUM_CATENELLA = 'Alexandrium_catenella'
    DINOPHYSIS = 'Dinophysis'
    DINOPHYSIS_ACUMINATA = 'Dinophysis_acuminata'
    DINOPHYSIS_NORVEGICA = 'Dinophysis_norvegica'
    TARGET_SPECIES = (
        (ALEXANDRIUM_CATENELLA, 'Alexandrium catenella'),
        (DINOPHYSIS, 'Dinophysis'),
        (DINOPHYSIS_ACUMINATA, 'Dinophysis acuminata'),
        (DINOPHYSIS_NORVEGICA, 'Dinophysis norvegica'),
    )

    # the primary ID from the IFCB dashboard
    pid = models.CharField(max_length=100, unique=True)
    geom =  models.PointField(srid=4326, null=True, blank=True)
    dataset = models.ForeignKey(Dataset, related_name='bins', on_delete=models.CASCADE)
    sample_time = models.DateTimeField(default=timezone.now)
    ifcb = models.PositiveIntegerField(null=True, blank=True)
    ml_analyzed = models.DecimalField(max_digits=15, decimal_places=14, null=True, blank=True)
    depth = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    cruise = models.CharField(max_length=50, null=False, blank=True)
    cast = models.CharField(max_length=50, null=False, blank=True)
    niskin = models.CharField(max_length=50, null=False, blank=True)
    sample_type = models.CharField(max_length=50, null=False, blank=True)
    n_images = models.PositiveIntegerField(null=True, blank=True)
    skip = models.BooleanField(default=False)
    species_found = ArrayField(models.CharField(max_length=500), null=True, blank=True, default=None)
    # Units are cells/L : cell_concentration = (image_numbers / bin.ml_analyzed) * 1000
    cell_concentration_data = JSONField(null=True)

    class Meta:
        ordering = ['-sample_time']
        get_latest_by = 'sample_time'

    def __str__(self):
        return self.pid

    def get_concentration_units(self):
        return 'cells/L'

    def get_concentration_data_by_species(self, species):
        if self.cell_concentration_data:
            item = next((item for item in self.cell_concentration_data if item['species'] == species), False)
            return item
        return None


class SpeciesClassified(models.Model):
    ALEXANDRIUM_CATENELLA = 'Alexandrium_catenella'
    DINOPHYSIS = 'Dinophysis'
    DINOPHYSIS_ACUMINATA = 'Dinophysis_acuminata'
    DINOPHYSIS_NORVEGICA = 'Dinophysis_norvegica'
    TARGET_SPECIES = (
        (ALEXANDRIUM_CATENELLA, 'Alexandrium catenella'),
        (DINOPHYSIS, 'Dinophysis'),
        (DINOPHYSIS_ACUMINATA, 'Dinophysis acuminata'),
        (DINOPHYSIS_NORVEGICA, 'Dinophysis norvegica'),
    )

    bin = models.ForeignKey(Bin, related_name='species_classified', on_delete=models.CASCADE)
    species = models.CharField(max_length=100, choices=TARGET_SPECIES)
    image_count = models.PositiveIntegerField(default=0)
    # Units are cells/L : cell_concentration = (image_numbers / bin.ml_analyzed) * 1000
    cell_concentration = models.PositiveIntegerField(default=0)
    image_numbers = ArrayField(models.CharField(max_length=100), blank=True)

    class Meta:
        ordering = ['species']

    def __str__(self):
        return self.species
