from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin

from .models import ClosureArea, Species, ClosureNotice

# Register your models here.

class ClosureAreaAdmin(admin.ModelAdmin):
    ordering = ['name']
    search_fields = ['name']

class ClosureNoticeAdmin(LeafletGeoAdmin):
    autocomplete_fields = ['closure_areas']

admin.site.register(ClosureArea, ClosureAreaAdmin)

admin.site.register(ClosureNotice, ClosureNoticeAdmin)

admin.site.register(Species)
